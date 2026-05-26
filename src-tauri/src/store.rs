use std::error::Error;

use tauri_plugin_store::StoreExt;

pub fn prepare_store(app: &tauri::App) -> Result<(), Box<dyn Error>> {
    let store = app.store("settings.json")?;
    if !store.has("shortcut") {
        store.set("shortcut", "Control+F2");
    }
    Ok(())
}

#[tauri::command]
pub fn get_shortcut(app: tauri::AppHandle) -> Result<String, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    let shortcut = store
        .get("shortcut")
        .and_then(|v| v.as_str().map(String::from))
        .ok_or_else(|| "shortcut not found".to_string())?;
    Ok(shortcut)
}
