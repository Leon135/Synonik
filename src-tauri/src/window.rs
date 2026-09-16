use tauri::Manager;

pub fn quit_app(app: &tauri::AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn quit_app_command(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
}

pub fn show_app(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if let Err(e) = window.show() {
            eprintln!("[Synonik] Failed to show window: {e}");
        }
        if let Err(e) = window.unminimize() {
            eprintln!("[Synonik] Failed to unminimize window: {e}");
        }
        if let Err(e) = window.set_focus() {
            eprintln!("[Synonik] Failed to focus window: {e}");
        }
    }
}
