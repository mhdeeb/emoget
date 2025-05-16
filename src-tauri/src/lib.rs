use tauri::Manager;
pub mod system_tray;
use system_tray::init_system_tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init_system_tray(app.app_handle()).unwrap();
            let window = app.get_webview_window("main").unwrap();
            let _ = window.set_ignore_cursor_events(true);
            let webview_url = tauri::WebviewUrl::App("/picker".into());
            tauri::WebviewWindowBuilder::new(app, "picker", webview_url.clone())
                .title("EmoGet")
                .inner_size(400.0, 600.0)
                .resizable(false)
                .focused(false)
                .decorations(false)
                .skip_taskbar(true)
                .transparent(true)
                .always_on_top(true)
                .build()?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
