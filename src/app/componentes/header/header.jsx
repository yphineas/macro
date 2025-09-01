import React, { useState } from "react";
import "./header.css";

function Title() {

  const [conf, setConf] = useState(20);
  const [alert, setAlert] = useState("success"); // success, warning ou error

  const getColor = (alert) => {
    switch (alert) {
      case "success":
        return "green";
      case "warning":
        return "yellow";
      case "error":
        return "red";
      default:
        return "green";
    }
  };

  const getStatus = () => {
    const cor = getColor(alert); 
    return (
      <div>
        <div>
          <span style={{ color: cor }}>STATUS</span>
        </div>
      </div>
    );
  };

  return (
    <div className="areaTitle">
      <div className="title">
        <h1 className="titlePrim">MACRO_CONTROL_SYSTEM</h1>
        <p className="titleSec">
          AUTOMATION_ACTIVE
        </p>
      </div>
      <div className="status">
        <div className="text-right">
          {getStatus()}
          <div className="titlePrim">CPU USAGE</div>
          <div className="titleSec">{conf}%</div>
          
        </div>
      </div>
    </div>
  );
}

export default Title;
