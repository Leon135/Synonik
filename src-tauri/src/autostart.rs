use tauri::plugin::TauriPlugin;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

pub fn toggle_autostart(app: &tauri::AppHandle) {
    let manager = app.autolaunch();
    if manager.is_enabled().unwrap_or(false) {
        manager.disable().ok();
    } else {
        manager.enable().ok();
    }
}

pub fn is_autostart_enabled(app: &tauri::AppHandle) -> bool {
    let autostart_manager = app.autolaunch();
    autostart_manager.is_enabled().unwrap_or(false)
}

pub fn autostart_plugin() -> TauriPlugin<tauri::Wry> {
    tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None)
}
