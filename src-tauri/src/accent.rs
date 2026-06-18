#[cfg(windows)]
fn get_accent_color_inner() -> Option<String> {
    use windows::UI::ViewManagement::{UIColorType, UISettings};

    let settings = UISettings::new().ok()?;
    let color = settings.GetColorValue(UIColorType::Accent).ok()?;
    Some(format!("rgba({},{},{},{})", color.R, color.G, color.B, color.A))
}

#[tauri::command]
pub fn get_accent_color() -> Option<String> {
    get_accent_color_inner()
}
