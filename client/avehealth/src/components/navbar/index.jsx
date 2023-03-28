/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import RefreshIcon from "../../assets/refresh.png";


const NavBar = (props) => {
  const refreshIconRef = useRef(null);
  const dataLogRef = useRef(null);
  const alertsRef = useRef(null);
  const homeRef = useRef(null);

  const handleRefresh = () => {
    props.getData();
    refreshIconRef.current.style.animation = "refreshIconAnimation 2s ease-out 3";

    setTimeout (() => {
      refreshIconRef.current.style.animation = "";
    }, 6000);
  }

  const handleDataLogTabSelect = () => {
    props.setCurrentPage(0);
    dataLogRef.current.classList.add("selected");
    alertsRef.current.classList.remove("selected");
    homeRef.current.classList.remove("selected");
  }

  const handleAlertsTabSelect = () => {
    props.setCurrentPage(1);
    alertsRef.current.classList.add("selected");
    dataLogRef.current.classList.remove("selected");
    homeRef.current.classList.remove("selected");
  }

  const handleHomeTabSelect = () => {
    props.setCurrentPage(2);
    homeRef.current.classList.add("selected");
    alertsRef.current.classList.remove("selected");
    dataLogRef.current.classList.remove("selected");
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
        <button ref={dataLogRef} 
          onClick={handleDataLogTabSelect}>
          Data Log
        </button>
        <button ref={homeRef} 
          onClick={handleHomeTabSelect}>
          Home
        </button>
        <button ref={alertsRef} 
          onClick={handleAlertsTabSelect}>
          Alerts
        </button>
      </div>
    </div>
  )
}

export default NavBar;