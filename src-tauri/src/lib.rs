use tauri::WindowEvent;
mod autostart;
mod db;
mod shortcut;
mod tray;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(autostart::autostart_plugin())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(shortcut::shortcut_plugin())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_user_input::init())
        .setup(|app| {
            db::prepare_db(app);

            let _ = tray::setup_tray(app);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                window.hide().unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
