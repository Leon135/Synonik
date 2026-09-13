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

    user_input.key(monio::Key::ControlLeft, EventType::KeyPress).ok();
    user_input.key(monio::Key::KeyC, EventType::KeyClick).ok();
    user_input
        .key(monio::Key::ControlLeft, EventType::KeyRelease)
        .ok();

    let mut new_clipboard = read_clipboard(app);
    let mut wait_time = 50;
    for _ in 0..5 {
        if new_clipboard != previous_clipboard && !new_clipboard.is_empty() {
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(wait_time));
        new_clipboard = read_clipboard(app);
        wait_time *= 2;
    }

    let _ = app.clipboard().write_text(previous_clipboard.clone());
    if new_clipboard == previous_clipboard || new_clipboard.is_empty() {
        return String::new();
    }
    new_clipboard
}

pub(crate) fn handle_shortcut_action(app: &tauri::AppHandle) {
    let app = app.clone();
    std::thread::spawn(move || {
        let selected_text = get_selected_text(&app);
        show_app(&app);
        let _ = app.emit_to("main", "shortcut-pressed-input", selected_text);
    });
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
    if let Ok(t) = std::env::var("XDG_SESSION_TYPE") {
        if t.eq_ignore_ascii_case("wayland") {
            return true;
        }
        if t.eq_ignore_ascii_case("x11") {
            return false;
        }
    }
    std::env::var("WAYLAND_DISPLAY").is_ok()
}

#[cfg(target_os = "linux")]
fn to_gnome_binding(shortcut: &str) -> String {
    shortcut
        .split('+')
        .map(|part| match part.trim().to_lowercase().as_str() {
            "control" | "ctrl" | "commandorcontrol" => "<Control>".to_string(),
            "shift" => "<Shift>".to_string(),
            "alt" => "<Alt>".to_string(),
            "super" | "meta" => "<Super>".to_string(),
            _ => part.trim().to_string(),
        })
        .collect::<Vec<_>>()
        .join("")
}

#[cfg(target_os = "linux")]
fn gsettings(args: &[&str]) -> Result<String, String> {
    let out = std::process::Command::new("gsettings")
        .args(args)
        .output()
        .map_err(|e| e.to_string())?;
    if !out.status.success() {
        return Err(String::from_utf8_lossy(&out.stderr).trim().to_string());
    }
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

#[cfg(target_os = "linux")]
fn register_gnome_keybinding(shortcut: &str) -> Result<(), String> {
    const PATH: &str =
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/synonik/";
    const SCHEMA: &str = "org.gnome.settings-daemon.plugins.media-keys";
    let exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let command = format!("'\"{}\" --toggle'", exe.display());

    let list = gsettings(&["get", SCHEMA, "custom-keybindings"])?;
    if !list.contains(PATH) {
        let updated = if list.trim() == "@as []" || list.trim() == "[]" {
            format!("['{PATH}']")
        } else {
            format!(
                "[{}, '{PATH}']",
                list.trim().trim_start_matches('[').trim_end_matches(']')
            )
        };
        gsettings(&["set", SCHEMA, "custom-keybindings", &updated])?;
    }

    let key = format!("org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:{PATH}");
    gsettings(&["set", &key, "name", "Synonik"])?;
    gsettings(&["set", &key, "command", &command])?;
    gsettings(&["set", &key, "binding", &to_gnome_binding(shortcut)])?;
    Ok(())
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
        if let Err(e) = register_gnome_keybinding(&shortcut) {
            eprintln!("[Synonik] GNOME keybinding failed: {e}");
        }
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
        register_gnome_keybinding(&shortcut)?;
        return persist_shortcut(&app, shortcut);
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
