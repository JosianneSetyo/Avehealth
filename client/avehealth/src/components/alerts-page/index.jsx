import React, { useState } from "react";
import SearchResults from "../shared/search-results";
import "./style.scss";

const AlertsPage = (props) => {
  return (
    <div className="alerts-page">
      <div>
        <h1 className="title high-alert">High Alert</h1>
        <SearchResults allEntries={props.allEntries}
          sortBy="weight"
          upperLimit={100}
          lowerLimit={30}/>
      </div>
      <div>
        <h1 className="title low-alert">Low Alert</h1>
        <SearchResults allEntries={props.allEntries}
          sortBy="weight"
          upperLimit={100}
          lowerLimit={30}/>
      </div>    
          
    </div>
  )
}

export default AlertsPage;