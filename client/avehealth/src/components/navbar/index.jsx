import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import RefreshIcon from "../../assets/refresh.png";


const NavBar = (props) => {
  const refreshIconRef = useRef(null);
  const DataLogRef = useRef(null);
  const AlertsRef = useRef(null);

  const handleRefresh = () => {
    props.getData();
    refreshIconRef.current.style.animation = "refreshIconAnimation 2s ease-out 3";

    setTimeout (() => {
      refreshIconRef.current.style.animation = "";
    }, 6000);
  }

  const handleDataLogTabSelect = () => {
    props.setCurrentPage(0);
    DataLogRef.current.classList.add("selected");
    AlertsRef.current.classList.remove("selected");
  }

  const handleAlertsTabSelect = () => {
    props.setCurrentPage(1);
    AlertsRef.current.classList.add("selected");
    DataLogRef.current.classList.remove("selected");
  }

  useEffect(() => {
    handleDataLogTabSelect();
  }, []);

  return (
    <div className="nav-bar">
      <div className="header">
        <h1>AveHealth</h1>
        <button onClick={handleRefresh}>
          <img src={RefreshIcon} 
            ref={refreshIconRef} 
            alt="refresh-icon"/>
        </button>
      </div>
      <div className="tabs">
        <button ref={DataLogRef} 
          onClick={handleDataLogTabSelect}>
          Data Log
        </button>
        <button ref={AlertsRef} 
          onClick={handleAlertsTabSelect}>
          Alerts
        </button>
      </div>
    </div>
  )
}

export default NavBar;