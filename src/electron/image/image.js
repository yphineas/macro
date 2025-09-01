
function salvarImagens(paths) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(paths, null, 2), "utf-8");
}

// Lê os caminhos salvos
function lerImagens() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  }
  return [];
}