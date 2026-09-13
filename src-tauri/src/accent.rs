#[cfg(target_os = "linux")]
fn gsettings(schema: &str, key: &str) -> Option<String> {
    let out = std::process::Command::new("gsettings")
        .args(["get", schema, key])
        .output()
        .ok()?;
    if !out.status.success() {
        return None;
    }
    Some(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

#[cfg(target_os = "linux")]
fn accent_name_to_hex(name: &str) -> Option<&'static str> {
    match name.trim().trim_matches('\'').to_lowercase().as_str() {
        "blue" => Some("#3584e4"),
        "teal" => Some("#2190a4"),
        "green" => Some("#3a944a"),
        "yellow" => Some("#c88800"),
        "orange" => Some("#ed5b00"),
        "red" => Some("#e62d42"),
        "pink" => Some("#d56199"),
        "purple" => Some("#9141ac"),
        "slate" => Some("#6f8396"),
        _ => None,
    }
}

#[cfg(target_os = "linux")]
fn get_accent_color_inner() -> Option<String> {
    accent_name_to_hex(&gsettings("org.gnome.desktop.interface", "accent-color")?)
        .map(|s| s.to_string())
}

#[cfg(windows)]
fn get_accent_color_inner() -> Option<String> {
    use windows::UI::ViewManagement::{UIColorType, UISettings};
    let color = UISettings::new()
        .ok()?
        .GetColorValue(UIColorType::Accent)
        .ok()?;
    Some(format!("#{:02x}{:02x}{:02x}", color.R, color.G, color.B))
}

#[cfg(not(any(target_os = "linux", windows)))]
fn get_accent_color_inner() -> Option<String> {
    None
}

#[tauri::command]
pub fn get_accent_color() -> Option<String> {
    get_accent_color_inner()
}
