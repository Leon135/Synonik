use tauri::plugin::TauriPlugin;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

pub fn toggle_autostart(app: &tauri::AppHandle) {
    let manager = app.autolaunch();
    let enabled = manager.is_enabled().unwrap_or_else(|e| {
        eprintln!("[Synonik] Failed to check autostart status: {e}");
        false
    });
    if enabled {
        if let Err(e) = manager.disable() {
            eprintln!("[Synonik] Failed to disable autostart: {e}");
        }
    } else {
        if let Err(e) = manager.enable() {
            eprintln!("[Synonik] Failed to enable autostart: {e}");
        }
    }
}

pub fn is_autostart_enabled(app: &tauri::AppHandle) -> bool {
    let autostart_manager = app.autolaunch();
    autostart_manager.is_enabled().unwrap_or_else(|e| {
        eprintln!("[Synonik] Failed to check autostart status: {e}");
        false
    })
}

pub fn autostart_plugin() -> TauriPlugin<tauri::Wry> {
    tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None)
}
