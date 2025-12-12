/* eslint-disable */
import React, { useState, useEffect } from "react";

/* Components */
import NavBar from "./components/navbar";
import DataLogPage from "./components/datalog-page";
import AlertsPage from "./components/alerts-page";
import HomePage from "./components/home-page";

import "./style.scss";


const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [allData, setAllData] = useState([]);

  // To switch between PostgreSQL server and NoSQL server
  const [currentServer, setCurrentServer] = useState(1);


  const getDataFromPostgreSQL = async () => {
    try {
      fetch ("https://avehealth.onrender.com/entries", {
          method: "GET",
          headers: {"Accept": "application/json"},
        }
      )
      .then (response => response.json())
      .then (response => {
        let listToSort = response;
        listToSort.sort((a, b) => new Date(b.clock) - new Date(a.clock)); 
        setAllData(listToSort);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  const getDataFromNoSQL = async () => {
    try {
      fetch ("https://avehealth2.onrender.com/entries", {
          method: "GET",
          headers: {"Accept": "application/json"},
        }
      )
      .then (response => response.json())
      .then (response => {
        let temp = [];
        
        for (let i = 0; i < response.length; i ++) {
          let entry = {
            bird_id: response[i].rfid_tag,
            clock: response[i].date_time,
            weight: response[i].result
          }

          temp.push(entry);
        }

        let listToSort = temp;
        listToSort.sort((a, b) => new Date(b.clock) - new Date(a.clock));

        setAllData(listToSort);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect (() => {
    if (currentServer === 0) {
      getDataFromPostgreSQL();
    } else if (currentServer === 1) {
      getDataFromNoSQL();
    }
  }, []);


  return (
    <div className="App">
      <NavBar currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getData={getDataFromPostgreSQL}
      />
      {(currentPage === 1) 
      ? <AlertsPage allEntries={allData}/>
      : (currentPage === 0)
          ? <DataLogPage allEntries={allData}/>
          : <HomePage allEntries={allData}/>
        
    }
    </div>
  );
}

export default App;
