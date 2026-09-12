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
    app.clipboard().read_text().unwrap_or_else(|e| {
        eprintln!("[Synonik] Failed to read clipboard: {e}");
        String::new()
    })
}

fn get_selected_text(app: &tauri::AppHandle) -> String {
    let user_input = app.user_input();

    let previous_clipboard = read_clipboard(app);

    let send_key = |key: monio::Key, event_type: EventType| {
        if let Err(e) = user_input.key(key, event_type) {
            eprintln!("[Synonik] Failed to copy selected text: {e}");
        }
    };
    send_key(monio::Key::ControlLeft, EventType::KeyPress);
    send_key(monio::Key::KeyC, EventType::KeyClick);
    send_key(monio::Key::ControlLeft, EventType::KeyRelease);

    let mut new_clipboard = read_clipboard(app);
    let mut wait_time = 50;
    let mut attempts = 0;

    while (new_clipboard == previous_clipboard || new_clipboard.is_empty()) && attempts < 5 {
        attempts += 1;

        std::thread::sleep(std::time::Duration::from_millis(wait_time));

        new_clipboard = read_clipboard(app);
        wait_time *= 2;
    }

    if new_clipboard == previous_clipboard || new_clipboard.is_empty() {
        if let Err(e) = app.clipboard().write_text(previous_clipboard) {
            eprintln!("[Synonik] Failed to restore clipboard: {e}");
        }
        return String::new();
    }

    if let Err(e) = app.clipboard().write_text(previous_clipboard) {
        eprintln!("[Synonik] Failed to restore clipboard: {e}");
    }
    new_clipboard
}

fn handle_shortcut_action(app: &tauri::AppHandle) {
    let app = app.clone();
    std::thread::spawn(move || {
        let selected_text = get_selected_text(&app);
        show_app(&app);
        if let Err(e) = app.emit_to("main", "shortcut-pressed-input", selected_text) {
            eprintln!("[Synonik] Failed to emit shortcut input event: {e}");
        }
    });
}

pub fn register_shortcut_on_start(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {  
    let store = app.store("settings.json")?;  
    let shortcut = store  
        .get("shortcut")  
        .and_then(|v| v.as_str().map(String::from))  
        .unwrap_or_else(|| "Control+F2".to_string());  
    app.manage(CurrentShortcut::new(Some(shortcut.clone())));  

    if let Err(e) = register_shortcut(app.handle().clone(), shortcut) {
        eprintln!("[Synonik] Failed to register shortcut on startup: {e}");
    }

    Ok(())  
}

#[tauri::command]
pub fn register_shortcut(app: tauri::AppHandle, shortcut: String) -> Result<(), String> {
    let global_shortcut = app.global_shortcut();

    // Register first: on failure the previous hotkey stays active and nothing
    // is persisted, so the app never ends up with no shortcut and a stale
    // invalid value in settings.json.
    global_shortcut
        .unregister_all()
        .map_err(|e| format!("Failed to unregister previous shortcuts: {e}"))?;

    if let Err(e) = global_shortcut.on_shortcut(shortcut.as_str(), move |app, _shortcut, event| {
        if event.state() == ShortcutState::Pressed {
            handle_shortcut_action(app);
        }
    }) {
        // Best effort: restore the previously active shortcut.
        let state = app.state::<CurrentShortcut>();
        if let Ok(current) = state.0.lock() {
            if let Some(prev) = current.as_deref() {
                let _ = global_shortcut.on_shortcut(prev, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        handle_shortcut_action(app);
                    }
                });
            }
        }
        return Err(format!("Failed to register shortcut: {e}"));
    }

    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    store.set("shortcut", shortcut.as_str());
    if let Err(e) = store.save().map_err(|e| e.to_string()) {
        // Restore previous shortcut: new hotkey is active but not persisted.
        let _ = global_shortcut.unregister_all();
        let state = app.state::<CurrentShortcut>();
        if let Ok(current) = state.0.lock() {
            if let Some(prev) = current.as_deref() {
                let _ = global_shortcut.on_shortcut(prev, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        handle_shortcut_action(app);
                    }
                });
            }
        }
        return Err(e);
    }

    let state = app.state::<CurrentShortcut>();
    let mut current = state.0.lock().map_err(|e| format!("Failed to access shortcut state: {e}"))?;
    *current = Some(shortcut);

    Ok(())
}
