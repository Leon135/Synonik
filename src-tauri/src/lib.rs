use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use std::sync::Mutex;
use tauri::Manager;
use tauri::WindowEvent;

mod accent;
mod autostart;
mod db;
mod shortcut;
mod store;
mod tray;
mod window;

pub struct DbState(pub Mutex<SqliteConnection>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(autostart::autostart_plugin())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            shortcut::handle_toggle(app, &argv);
        }))

        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_user_input::init())
        .invoke_handler(tauri::generate_handler![
            db::manager::search_synonyms,
            window::quit_app_command,
            shortcut::register_shortcut,
            shortcut::is_manual_shortcut,
            shortcut::get_toggle_command,
            store::get_shortcut,
            accent::get_accent_color
        ])
        .setup(|app| {
            db::prepare_db(app)?;

            let db_path = app.path().app_config_dir()?.join("database.sqlite");
            let conn = SqliteConnection::establish(
                db_path
                    .to_str()
                    .ok_or_else(|| "invalid database path".to_string())?,
            )?;

            app.manage(DbState(Mutex::new(conn)));

            store::prepare_store(app)?;
            shortcut::register_shortcut_on_start(app)?;

            if let Err(e) = tray::setup_tray(app) {
                eprintln!("[Synonik] Failed to create tray icon: {e}");
            }

            // Cold start via `synonik --toggle` with no instance running.
            if std::env::args().any(|a| a == "--toggle") {
                shortcut::handle_toggle(app.handle(), &std::env::args().collect::<Vec<_>>());
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                if let Err(e) = window.hide() {
                    eprintln!("[Synonik] Failed to hide window: {e}");
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
