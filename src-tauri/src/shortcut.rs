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

fn get_selected_text(app: &tauri::AppHandle) -> String {
    let user_input = app.user_input();

    let previous_clipboard = app.clipboard().read_text().unwrap_or_default();

    let mut new_clipboard = app.clipboard().read_text().unwrap_or_default();
    let mut wait_time = 50;
    let mut attempts = 0;

    while (new_clipboard == previous_clipboard || new_clipboard.is_empty()) && attempts < 5 {
        attempts += 1;
        let _ = user_input.key(monio::Key::ControlLeft, EventType::KeyPress);
        let _ = user_input.key(monio::Key::KeyC, EventType::KeyPress);
        let _ = user_input.key(monio::Key::KeyC, EventType::KeyRelease);
        let _ = user_input.key(monio::Key::ControlLeft, EventType::KeyRelease);

        std::thread::sleep(std::time::Duration::from_millis(wait_time));

        new_clipboard = app.clipboard().read_text().unwrap_or_default();
        wait_time *= 2;
    }

    if new_clipboard == previous_clipboard || new_clipboard.is_empty() {
        return String::new();
    }

    app.clipboard().write_text(previous_clipboard).ok();
    new_clipboard
}

fn handle_shortcut_action(app: &tauri::AppHandle) {
    let selected_text = get_selected_text(app);
    show_app(app);
    let _ = app.emit_to("main", "shortcut-pressed-input", selected_text);
}

pub fn register_shortcut_on_start(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {  
    let store = app.store("settings.json")?;  
    let shortcut = store  
        .get("shortcut")  
        .and_then(|v| v.as_str().map(String::from))  
        .unwrap_or_else(|| "Control+F2".to_string());  
    app.manage(CurrentShortcut::new(Some(shortcut.clone())));  

    if let Err(e) = register_shortcut(app.handle().clone(), shortcut) {
        eprintln!("[Synonik] Nie udało się zarejestrować skrótu przy starcie: {e}");
    }

    Ok(())  
}

#[tauri::command]
pub fn register_shortcut(app: tauri::AppHandle, shortcut: String) -> Result<(), String> {
    let global_shortcut = app.global_shortcut();

    let state = app.state::<CurrentShortcut>();
    let mut current = state.0.lock().unwrap();
    if let Some(prev) = current.as_deref() {
        let _ = global_shortcut.unregister(prev);
    }

    global_shortcut
        .on_shortcut(shortcut.as_str(), move |app, _shortcut, event| {
            if event.state() == ShortcutState::Pressed {
                handle_shortcut_action(app);
            }
        })
        .map_err(|e| format!("Nie udało się zarejestrować skrótu: {e}"))?;

    *current = Some(shortcut.clone());

    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    store.set("shortcut", shortcut);
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}
