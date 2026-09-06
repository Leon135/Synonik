#[cfg(windows)]
fn get_accent_color_inner() -> Option<String> {
    use windows::UI::ViewManagement::{UIColorType, UISettings};

    let settings = match UISettings::new() {
        Ok(s) => s,
        Err(e) => {
            eprintln!("[Synonik] Failed to create UISettings: {e}");
            return None;
        }
    };
    let color = match settings.GetColorValue(UIColorType::Accent) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("[Synonik] Failed to get accent color: {e}");
            return None;
        }
    };
    Some(format!("rgba({},{},{},{})", color.R, color.G, color.B, color.A))
}

#[tauri::command]
pub fn get_accent_color() -> Option<String> {
    get_accent_color_inner()
}
