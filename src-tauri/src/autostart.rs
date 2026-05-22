use tauri::plugin::TauriPlugin;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

pub fn change_autostart(app: &tauri::AppHandle) {
    let autostart_manager = app.autolaunch();

    if autostart_manager.is_enabled().unwrap_or(false) {
        autostart_manager.disable().ok();
    } else {
        autostart_manager.enable().ok();
    }
}

pub fn autostart_plugin() -> TauriPlugin<tauri::Wry> {
    tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None)
}
