use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle,
};

#[tauri::command]
pub fn init_system_tray(app_handle: &AppHandle) -> Result<(), String> {
    let quit_i = MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>).unwrap();
    let menu = Menu::with_items(app_handle, &[&quit_i]).unwrap();

    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            _ => {
                // println!("menu item {:?} not handled", event.id);
            }
        })
        .icon_as_template(false)
        .icon(app_handle.default_window_icon().unwrap().clone())
        .tooltip("Emoget")
        .build(app_handle)
        .unwrap();
    Ok(())
}
