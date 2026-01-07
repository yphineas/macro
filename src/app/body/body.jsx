import React, { useState, useEffect } from "react";
import "./body.css";
import Button from "../componentes/button/button";

let ipcRenderer = window.require("electron").ipcRenderer;

function Body() {
  const [logs, setLogs] = useState([]);
  const [imagens, setImagens] = useState([]);

  async function selecionarImagens() {
    const novas = await ipcRenderer.invoke("selecionar-imagens");
    setImagens(novas);
  }

  async function limparImagens() {
    const vazio = await ipcRenderer.invoke("limpar-imagens");
    setImagens(vazio);
  }

  const enviar = () => {
    ipcRenderer.send("toPython", { action: "start" });
    setLogs((prev) => [...prev, "📤 Inicializando..."]);
  };

  const para = () => {
    ipcRenderer.send("toPython", { action: "stop" });
    setLogs((prev) => [...prev, "📤 Parando..."]);
  };

  useEffect(() => {
    if (!ipcRenderer) return;
    ipcRenderer.invoke("ler-imagens").then(setImagens);

    ipcRenderer.invoke("fromPython", (event, data) => {
      setLogs((prev) => [...prev, JSON.stringify(data)]);
    });
    
    ipcRenderer.on("python-message", (_, msg) => {
      setLog((prev) => [...prev, msg]);
    });

    ipcRenderer.on("fromPython", (event, data) => {
      console.log("📥 Resposta do Python:", data);
    });

    return () => {
      ipcRenderer.removeAllListeners("fromPython");
    };
  }, []);

  return (
    <div className="areaBody">
      <div className="log">
        <div className="titleLog">
          {" "}
          <div>
            <span>LOG</span>
          </div>
          <Button
            text="LIMPA"
            color="#00bcd4"
            model={2}
            icone="☁ "
            onClick={() => setLogs([])}
          />{" "}
        </div>
        <ul className="areaLog">
          {logs.map((l, i) => (
            <li className="textoLog" key={i}>
              {l}
            </li>
          ))}
        </ul>
      </div>

      <div className="areaConfig">
        <div className="config">
          <div className="iconConfig">
            <Button
              text="INICIAR"
              color="rgb(0, 255, 136)"
              model={1}
              icone="▶ "
              onClick={enviar}
            />
            <Button
              text="PARA"
              color="rgba(197, 44, 77, 1)"
              model={1}
              icone="☐ "
              button
              onClick={para}
            />
          </div>
          <div>
            <Button text="PROGRAMA" color="#00bcd4" model={2} icone="< > " />
          </div>
          <div>
            <Button text="CONFIG" color="#00bcd4" model={2} icone="{ } " />
          </div>
        </div>
        <div className="config">
          <div className="iconConfig">
            <Button
              text="IMAGENS"
              color="#00bcd4"
              model={2}
              icone=""
              onClick={selecionarImagens}
            />
            <Button
              text="LIMPA"
              color="#00bcd4"
              model={2}
              icone=""
              onClick={limparImagens}
            />
          </div>

          <div className="iconConfig">
            <ul className="areaImg">
              {imagens.map((img, i) => (
                <li key={i} className="img">
                  <img
                    className="img"
                    onClick={() => window.open(`file://${img}`)}
                    src={`file:/${img.replace(/\\/g, "/")}`} // converte C:\Users\... para file:///C:/Users/...
                    alt={`preview-${i}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
