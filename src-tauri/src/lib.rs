use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn find_source_db(app: &tauri::App) -> Option<PathBuf> {
    let candidates = [
        // Production: bundled resource
        app.path().resource_dir().ok().map(|d| d.join("database.sqlite")),
        // Dev: next to src-tauri/
        app.path()
            .resource_dir()
            .ok()
            .map(|d| d.join("../database.sqlite")),
        // Fallback: current working dir
        std::env::current_dir().ok().map(|d| d.join("database.sqlite")),
    ];

    candidates.into_iter().flatten().find(|p| p.exists())
}

#[tauri::command]
async fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_user_input::init())
        .setup(|app| {
            let app_config_dir = app
                .path()
                .app_config_dir()
                .expect("failed to get app config dir");
            fs::create_dir_all(&app_config_dir).ok();

            let db_path = app_config_dir.join("database.sqlite");

            if !db_path.exists() {
                let source = find_source_db(app)
                    .expect("database.sqlite not found in resources, project root, or cwd");
                fs::copy(&source, &db_path)
                    .expect("failed to copy database file to app config dir");
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![quit_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
