/* eslint-disable */
import React, { useState, useEffect } from "react";

/* Components */
import NavBar from "./components/navbar";
import DataLogPage from "./components/datalog-page";
import AlertsPage from "./components/alerts-page";

import "./style.scss";


const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [allData, setAllData] = useState([]);


  const getData = async () => {
    try {
      fetch ("https://avehealth.onrender.com/entries", {
          method: "GET",
          headers: {"Accept": "application/json"},
        }
      )
      .then (response => response.json())
      .then (response => {
        // let temp = [];
        
        // for (let i = 0; i < response.length; i ++) {
        //   let entry = {
        //     bird_id: response[i].rfid_tag,
        //     clock: response[i].date_time,
        //     weight: response[i].result
        //   }

        //   temp.push(entry);
        // }

        setAllData(response);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect (() => {
    getData();
  }, []);


  return (
    <div className="App">
      <NavBar currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getData={getData}
      />
      {(currentPage === 1) 
      ? <AlertsPage allEntries={allData}/>
      : <DataLogPage allEntries={allData}/>
    }
      
  
    </div>
  );
}

export default App;