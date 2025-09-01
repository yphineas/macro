import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let pythonProcess;

const DATA_FILE = path.join(__dirname, "image/imagens.json");
pythonProcess = spawn("python", [path.join(__dirname, "../pyMacro/main.py")]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // permite usar require() no index.html
      contextIsolation: false,
    },
  });

  // const devUrl = path.join(__dirname, "../../dist/index.html");
  const devUrl = "http://localhost:5173";
  mainWindow.loadURL(devUrl);
  mainWindow.webContents.openDevTools();

  // Inicia o script Python

  // Recebe stdout do Python
  pythonProcess.stdout.on("data", (data) => {
    const msg = data.toString().trim();
    console.log("📥 Python:", msg);
    if (mainWindow) {
      mainWindow.webContents.send("fromPython", { msg });
    }
  });

  // Mostra erros do Python
  pythonProcess.stderr.on("data", (data) => {
    console.error("⚠️ Python erro:", data.toString());
  });
}

function salvarImagens(paths) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(paths, null, 2), "utf-8");
}

// Lê os caminhos salvos
function lerImagens() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler imagens:", e);
      return [];
    }
  }
  return [];
}

// Selecionar imagens
ipcMain.handle("selecionar-imagens", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Selecione imagens",
    properties: ["openFile", "multiSelections"],
    filters: [
      { name: "Imagens", extensions: ["jpg", "jpeg", "png", "bmp", "gif"] },
    ],
  });

  const paths = result.canceled ? [] : result.filePaths;

  if (paths.length > 0) {
    const todasImagens = [...lerImagens(), ...paths];
    salvarImagens(todasImagens);
  }

  return lerImagens();
});

// Limpar imagens salvas
ipcMain.handle("limpar-imagens", () => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  return [];
});

// Retornar imagens salvas
ipcMain.handle("ler-imagens", () => {
  return lerImagens();
});

// Evento do botão -> envia para Python
ipcMain.on("toPython", (event, arg) => {
  console.log("📤 Recebi do renderer:", arg);
  if (pythonProcess) {
    pythonProcess.stdin.write(JSON.stringify(arg) + "\n");
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
