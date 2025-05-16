use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

#[tauri::command]
pub fn init_system_tray(app_handle: &AppHandle) -> Result<(), String> {
    let show_i = MenuItem::with_id(app_handle, "show", "Show", true, None::<&str>).unwrap();
    let quit_i = MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>).unwrap();
    let menu = Menu::with_items(app_handle, &[&show_i, &quit_i]).unwrap();

    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                show_picker_window(app);
            }
            "quit" => {
                app.exit(0);
            }
            _ => {
                // println!("menu item {:?} not handled", event.id);
            }
        })
        .on_tray_icon_event(|app, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                show_picker_window(app.app_handle());
            }
            _ => {}
        })
        .icon_as_template(false)
        .icon(app_handle.default_window_icon().unwrap().clone())
        .tooltip("Emoget")
        .build(app_handle)
        .unwrap();
    Ok(())
}

fn show_picker_window(app: &AppHandle) {
    if let Some(picker_window) = app.get_webview_window("picker") {
        let _ = picker_window.unminimize();
        let _ = picker_window.show();
        let _ = picker_window.set_focus();
    }
}
