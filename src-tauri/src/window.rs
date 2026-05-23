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
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}
