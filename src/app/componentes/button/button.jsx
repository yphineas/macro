import React from "react";
import "./button.css";

export default function CustomButton({ text, color, model = 1, icone, onClick }) {
  return (
    <button
      className={`btn model-${model}`}
      style={{ "--btn-color": color }}
      onClick={onClick}
    >
      {model === 1 && <span className="icon">{icone}</span>}
      {model === 2 && <span className="icon">{icone}</span>}
      <span className="label">{text}</span>
    </button>
  );
}
