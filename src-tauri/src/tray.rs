use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};

use crate::autostart::change_autostart;
use crate::window::{quit_app, show_app};

pub fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    let show_element = MenuItem::with_id(app, "show", "Pokaż", true, None::<&str>)?;
    let autostart_element = MenuItem::with_id(app, "autostart", "Autostart", true, None::<&str>)?;
    let quit_element = MenuItem::with_id(app, "quit", "Wyjdź", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_element, &autostart_element, &quit_element])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app: &tauri::AppHandle, event| match event.id.as_ref() {
            "show" => {
                show_app(app);
            }
            "autostart" => {
                change_autostart(app);
            }
            "quit" => {
                quit_app(app);
            }
            _ => {}
        }).build(app)?;
    Ok(())
}
