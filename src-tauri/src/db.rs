use std::{fs, path::PathBuf};
use tauri::Manager;

fn find_source_db(app: &tauri::App) -> Option<PathBuf> {
    let candidates = [
        // Production: bundled resource
        app.path()
            .resource_dir()
            .ok()
            .map(|d| d.join("database.sqlite")),
        // Dev: next to src-tauri/
        app.path()
            .resource_dir()
            .ok()
            .map(|d| d.join("../database.sqlite")),
        // Fallback: current working dir
        std::env::current_dir()
            .ok()
            .map(|d| d.join("database.sqlite")),
    ];

    candidates.into_iter().flatten().find(|p| p.exists())
}

pub fn prepare_db(app: &tauri::App) {
    let app_config_dir = app
        .path()
        .app_config_dir()
        .expect("failed to get app config dir");
    fs::create_dir_all(&app_config_dir).ok();

    let db_path = app_config_dir.join("database.sqlite");

    if !db_path.exists() {
        let source = find_source_db(app)
            .expect("database.sqlite not found in resources, project root, or cwd");
        fs::copy(&source, &db_path).expect("failed to copy database file to app config dir");
    };
}
