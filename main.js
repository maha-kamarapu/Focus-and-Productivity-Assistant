const { app, BrowserWindow, Tray, nativeImage, Menu } = require('electron');
const path = require('path');

let win; // Single main window
let tray = null;

// Function to create the main window (focus assistant window)
function createWindow() {
  win = new BrowserWindow({
    width: 800, // Adjusted to fit the UI without extra space
    height: 600,
    frame: false, // Remove the window frame for a clean look
    alwaysOnTop: true, // Keep the window always on top of others
    transparent: true, // Makes the window background transparent
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow context bridging for Electron
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the React app (running on http://localhost:3000)
  win.loadURL('http://localhost:3000'); // Ensure the main React app includes both clock and face detection

  // Create a tray icon in the system tray
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'tray-icon.png')));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Focus Assistant',
      click: () => {
        win.show(); // Show the window if hidden
      }
    },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Focus Assistant');
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show(); // Toggle window visibility
  });

  // Show the window immediately on app startup
  win.show();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});








