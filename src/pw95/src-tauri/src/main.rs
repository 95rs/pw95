// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window};

#[tauri::command]
fn is_window_active(app: tauri::AppHandle) -> bool {
    if let Some(window) = app.get_webview_window("main") {
        return window.is_focused().unwrap_or(false);
    }
    false
}

#[tauri::command]
fn stop_app(window: Window) {
    // OLD CODE:
    // process::exit(0); 0 is typically a success exit code

    // Close the window, which will trigger app shutdown
    window.close().unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Access the main window by its label "main"
            let main_window = app.get_webview_window("main").unwrap();
            
            // Remove the window decorations (no border or shadow)
            main_window.set_decorations(false).unwrap();
            
            // No direct method for set_transparent, handled via tauri.conf.json
            // If further customizations are needed, do them within the frontend

            Ok(())
        })
        
        // Register the commands
        .invoke_handler(tauri::generate_handler![
            stop_app,
            is_window_active
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    pw95_lib::run()
}
