use std::sync::Mutex;
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use tauri_plugin_store::StoreExt;
use tauri_plugin_user_input::{EventType, UserInputExt};

use crate::window::show_app;

pub struct CurrentShortcut(Mutex<Option<String>>);

impl CurrentShortcut {
    pub fn new(shortcut: Option<String>) -> Self {
        Self(Mutex::new(shortcut))
    }
}

pub struct PendingToggle(pub Mutex<Option<String>>);

impl PendingToggle {
    pub fn new() -> Self {
        Self(Mutex::new(None))
    }
}

fn read_clipboard(app: &tauri::AppHandle) -> String {
    app.clipboard().read_text().unwrap_or_default()
}

#[cfg(target_os = "linux")]
fn read_primary_selection() -> Option<String> {
    let out = std::process::Command::new("wl-paste")
        .args(["--primary", "--no-newline"])
        .output()
        .ok()?;
    if !out.status.success() {
        return None;
    }
    let text = String::from_utf8_lossy(&out.stdout).trim().to_string();
    if text.is_empty() {
        return None;
    }
    Some(text)
}

fn get_selected_text(app: &tauri::AppHandle) -> String {
    #[cfg(target_os = "linux")]
    if is_wayland() {
        return read_primary_selection().unwrap_or_default();
    }

    let user_input = app.user_input();
    let previous_clipboard = read_clipboard(app);

    let _ = app.clipboard().write_text(String::new());

    user_input
        .key(monio::Key::ControlLeft, EventType::KeyPress)
        .ok();
    user_input.key(monio::Key::KeyC, EventType::KeyClick).ok();
    user_input
        .key(monio::Key::ControlLeft, EventType::KeyRelease)
        .ok();

    let mut new_clipboard = read_clipboard(app);
    let mut wait_time = 50;
    for _ in 0..5 {
        if !new_clipboard.is_empty() {
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(wait_time));
        new_clipboard = read_clipboard(app);
        wait_time *= 2;
    }

    let _ = app.clipboard().write_text(previous_clipboard);
    if new_clipboard.is_empty() {
        return String::new();
    }
    new_clipboard
}

pub(crate) fn handle_shortcut_action(app: &tauri::AppHandle) {
    let app = app.clone();
    std::thread::spawn(move || {
        let selected_text = get_selected_text(&app);
        if let Some(pending) = app.try_state::<PendingToggle>() {
            if let Ok(mut guard) = pending.0.lock() {
                *guard = Some(selected_text.clone());
            }
        }
        show_app(&app);
        let _ = app.emit_to("main", "shortcut-pressed-input", selected_text);
    });
}

#[tauri::command]
pub fn take_pending_toggle(app: tauri::AppHandle) -> Option<String> {
    let pending_toggle = app.try_state::<PendingToggle>()?;
    let mut pending_guard = pending_toggle.0.lock().ok()?;
    pending_guard.take()
}

pub(crate) fn handle_toggle(app: &tauri::AppHandle, argv: &[String]) {
    if argv.iter().any(|a| a == "--toggle") {
        handle_shortcut_action(app);
    } else {
        show_app(app);
    }
}

#[cfg(target_os = "linux")]
fn is_wayland() -> bool {
    if let Ok(session_type) = std::env::var("XDG_SESSION_TYPE") {
        if session_type.eq_ignore_ascii_case("wayland") {
            return true;
        }
        if session_type.eq_ignore_ascii_case("x11") {
            return false;
        }
    }
    std::env::var("WAYLAND_DISPLAY").is_ok()
}

#[tauri::command]
pub fn is_manual_shortcut() -> bool {
    #[cfg(target_os = "linux")]
    return is_wayland();
    #[cfg(not(target_os = "linux"))]
    return false;
}

#[tauri::command]
pub fn get_desktop_environment() -> String {
    for environment_variable in [
        "XDG_CURRENT_DESKTOP",
        "XDG_SESSION_DESKTOP",
        "DESKTOP_SESSION",
    ] {
        if let Ok(desktop_value) = std::env::var(environment_variable) {
            let normalized_desktop = desktop_value.trim().to_lowercase();
            if !normalized_desktop.is_empty() && normalized_desktop != "unknown" {
                return normalized_desktop;
            }
        }
    }
    "unknown".to_string()
}

#[tauri::command]
pub fn get_toggle_command() -> String {
    if let Some(appimage_path) = std::env::var_os("APPIMAGE").filter(|path| !path.is_empty()) {
        return format!("\"{}\" --toggle", appimage_path.to_string_lossy());
    }
    match std::env::current_exe() {
        Ok(exe_path) => format!("\"{}\" --toggle", exe_path.display()),
        Err(_) => "synonik --toggle".to_string(),
    }
}

fn persist_shortcut(app: &tauri::AppHandle, shortcut: String) -> Result<(), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    store.set("shortcut", shortcut.clone());
    store.save().map_err(|e| e.to_string())?;
    let state = app.state::<CurrentShortcut>();
    *state.0.lock().map_err(|e| e.to_string())? = Some(shortcut);
    Ok(())
}

pub fn register_shortcut_on_start(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let store = app.store("settings.json")?;
    let shortcut = store
        .get("shortcut")
        .and_then(|v| v.as_str().map(String::from))
        .unwrap_or_else(|| "Control+F2".to_string());
    app.manage(CurrentShortcut::new(Some(shortcut.clone())));

    #[cfg(target_os = "linux")]
    if is_wayland() {
        return Ok(());
    }

    if let Err(e) = register_shortcut(app.handle().clone(), shortcut) {
        eprintln!("[Synonik] Failed to register shortcut on startup: {e}");
    }

    Ok(())
}

#[tauri::command]
pub fn register_shortcut(app: tauri::AppHandle, shortcut: String) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    if is_wayland() {
        let _ = (app, shortcut);
        return Ok(());
    }

    register_shortcut_inner(&app, &shortcut)?;
    persist_shortcut(&app, shortcut)
}

fn register_shortcut_inner(app: &tauri::AppHandle, shortcut: &str) -> Result<(), String> {
    let global_shortcut = app.global_shortcut();
    global_shortcut
        .unregister_all()
        .map_err(|e| e.to_string())?;
    global_shortcut
        .on_shortcut(shortcut, move |app, _, event| {
            if event.state() == ShortcutState::Pressed {
                handle_shortcut_action(app);
            }
        })
        .map_err(|e| e.to_string())
}
