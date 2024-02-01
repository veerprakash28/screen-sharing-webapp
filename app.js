const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");
const screenshot = require("screenshot-desktop");

var socket = require("socket.io-client")("http://192.168.1.4:5001");
var internal;

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 150,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("start-share", function (event, arg) {
  var uuid = uuidv4();
  socket.emit("join-message", uuid);
  event.reply("uuid", uuid);
  // TODO: Take continuous screen shot

  interval = setInterval(function () {
    screenshot().then((img) => {
      var imgStr = new Buffer(img).toString("base64");

      var obj = {};
      obj.room = uuid;
      obj.image = imgStr;

      socket.emit("screen-data", JSON.stringify(obj));
    });
  }, 500);
  // TODO: Broadcast to all other users
});

ipcMain.on("stop-share", function (event, arg) {
  clearInterval(interval);
  // TODO: Stop braodcasting and screenshot capturing
});
