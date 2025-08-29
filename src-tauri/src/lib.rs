use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use tauri::ActivationPolicy;

use tauri::menu::{Menu, MenuItem};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            // Hide dock icon
            // UNCOMMENT TO ENABLE
            // #[cfg(target_os = "macos")]
            // app.set_activation_policy(ActivationPolicy::Accessory);

            // Get a handle to the main window
            let main_window = app.get_webview_window("main").unwrap();
            let icon = app.default_window_icon().unwrap();

            let monitor = main_window.current_monitor().unwrap().unwrap();
            let scale_factor = monitor.scale_factor();

            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            // Create tray icon
            TrayIconBuilder::new()
                .icon(icon.clone())
                .tooltip("Arborista")
                .on_tray_icon_event(move |_tray, event| {
                    if let TrayIconEvent::Click {
                        position,
                        rect,
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        if main_window.is_visible().unwrap() {
                            main_window.hide().unwrap();
                        } else {
                            // Place window under tray icon
                            // let size = main_window.outer_size().unwrap();
                            let logical_position = tauri::LogicalPosition {
                                x: rect.position.to_logical::<f64>(scale_factor).x - 180.
                                    + rect.size.to_logical::<f64>(scale_factor).width / 2.,
                                y: rect.position.to_logical::<f64>(scale_factor).y,
                            };
                            main_window
                                .set_position(tauri::Position::Logical(logical_position))
                                .unwrap();

                            main_window.show().unwrap();
                            main_window.set_focus().unwrap();
                        }
                    }
                })
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        println!("quit menu item was clicked");
                        app.exit(0);
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .build(app)?;

            Ok(())
            // let main_window = app.get_window("main").unwrap();
            // Create tray icon
            // TrayIconBuilder::new()
            //     .tooltip("Arborista")
        })
        .on_window_event(|window, event| match event {
            // UNCOMMENT TO ENABLE
            // tauri::WindowEvent::Focused(focused) => {
            //     // hide window whenever it loses focus
            //     if !focused {
            //         window.hide().unwrap();
            //     }
            // }
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
