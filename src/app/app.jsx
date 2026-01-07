import React, { useState } from "react";
import "./css/App.css";
import Title from "./componentes/header/header";
import Body from "./body/body";

export default function App() {
  return (
    <div className="container">
      <div className="content">
        <Title />
        <div className="area">
          <Body />
        </div>
      </div>
    </div>
  );
}
