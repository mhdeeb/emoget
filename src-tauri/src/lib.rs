use tauri::Manager;
pub mod system_tray;
use system_tray::init_system_tray;

#[tauri::command]
fn hide_picker_window(app_handle: tauri::AppHandle) {
    if let Some(picker_window) = app_handle.get_webview_window("picker") {
        let _ = picker_window.hide();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init_system_tray(app.app_handle()).unwrap();
            let window = app.get_webview_window("main").unwrap();
            let _ = window.set_ignore_cursor_events(true);
            let webview_url = tauri::WebviewUrl::App("/picker".into());
            tauri::WebviewWindowBuilder::new(app, "picker", webview_url.clone())
                .title("EmoGet")
                .inner_size(400.0, 650.0)
                .focused(false)
                .decorations(false)
                .transparent(true)
                .always_on_top(true)
                .build()?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![hide_picker_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
