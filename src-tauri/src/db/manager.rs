use diesel::dsl::*;
use diesel::prelude::*;
use std::{fs, path::PathBuf};
use tauri::Manager;

use crate::DbState;

use super::schema::{base_forms, synonym_groups, word_in_group, words};

fn find_source_db(app: &tauri::App) -> Option<PathBuf> {
    let candidates = [
        app.path()
            .resource_dir()
            .ok()
            .map(|d| d.join("database.sqlite")),
        app.path()
            .resource_dir()
            .ok()
            .map(|d| d.join("../database.sqlite")),
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

#[tauri::command]
pub fn search_synonyms(
    state: tauri::State<'_, DbState>,
    word: String,
) -> Result<Vec<(String, String)>, String> {
    let mut conn = state.0.lock().map_err(|e| e.to_string())?;

    let base_ids = words::table
        .inner_join(base_forms::table.on(words::id.eq(base_forms::word_id)))
        .filter(words::word.eq(&word))
        .select(base_forms::base_form_id)
        .load::<i32>(&mut *conn)
        .map_err(|e| e.to_string())?;

    if base_ids.is_empty() {
        return Ok(vec![]);
    }

    let group_ids = word_in_group::table
        .filter(word_in_group::word_id.eq_any(&base_ids))
        .select(word_in_group::group_id)
        .distinct()
        .load::<i32>(&mut *conn)
        .map_err(|e| e.to_string())?;

    if group_ids.is_empty() {
        return Ok(vec![]);
    }

    let results = word_in_group::table
        .filter(word_in_group::group_id.eq_any(&group_ids))
        .filter(not(word_in_group::word_id.eq_any(&base_ids)))
        .inner_join(words::table.on(words::id.eq(word_in_group::word_id)))
        .inner_join(synonym_groups::table.on(synonym_groups::group_id.eq(word_in_group::group_id)))
        .select((words::word, synonym_groups::group_meaning))
        .distinct()
        .load::<(String, String)>(&mut *conn)
        .map_err(|e| e.to_string())?;

    Ok(results)
}
