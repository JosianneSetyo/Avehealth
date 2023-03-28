/* eslint-disable */
import React, { useState, useEffect } from "react";
import SearchResults from "../shared/search-results";
import "./style.scss";


const AlertsPage = (props) => {
  const [listOfHighAlerts, setListOfHighAlerts] = useState([]);
  const [listOfLowAlerts, setListOfLowAlerts] = useState([]);

  /**
   * This function returns an array of latest data entries
   * for each unique ID.
   * Expects the argument "allEntries" to be sorted in descending order,
   * based on date.
   */
  const getDataWithUniqueIDs = (allEntries) => {
    let listOfIDs = [];
    let entriesWithUniqueIDs = [];

    for (let i = 0; i < allEntries.length; i ++) {
      let idExists = false;

      for (let j = 0; j < listOfIDs.length; j ++) {
        if (allEntries[i].bird_id === listOfIDs[j]) {
          idExists = true;
          break;
        }
      }

      if (idExists === false) {
        listOfIDs.push(allEntries[i].bird_id);
        entriesWithUniqueIDs.push(allEntries[i]);
      }
    }

    return [listOfIDs, entriesWithUniqueIDs];
  }

  const getAveragesForEachID = (listOfIDs, allEntries) => {
    let listOfAverages = [];

    for (let i = 0; i < listOfIDs.length; i ++) {
      let sum = 0;
      let numOfEntries = 0;

      for (let j = 0; j < allEntries.length; j ++) {
        if (listOfIDs[i] === allEntries[j].bird_id) {
          sum += allEntries[j].weight;
          numOfEntries ++;
        }
      }

      let average = sum / numOfEntries;
      let temp = {
        bird_id: listOfIDs[i],
        average: average
      }

      listOfAverages.push(temp);
    }

    return listOfAverages;
  }

  const getAlerts = (entriesWithUniqueIDs, listOfAverages, upperBounds, lowerBounds) => {
    let alertList = [];

    for (let i = 0; i < entriesWithUniqueIDs.length; i ++) {
      let currentIDMostRecentWeight = entriesWithUniqueIDs[i].weight;
      let currentIDAverage;

      for (let j = 0; j < listOfAverages.length; j ++) {
        if (entriesWithUniqueIDs[i].bird_id === listOfAverages[j].bird_id) {
          currentIDAverage = listOfAverages[j].average;
          break;
        }
      }

      if (currentIDMostRecentWeight < currentIDAverage * (upperBounds) 
        && currentIDMostRecentWeight >= currentIDAverage * (lowerBounds)) {
        alertList.push(entriesWithUniqueIDs[i]);
      }
    }

    return alertList;
  }

  useEffect(() => {
    const [listOfIDs, entriesWithUniqueIDs] = getDataWithUniqueIDs(props.allEntries);
    const listOfAverages = getAveragesForEachID(listOfIDs, props.allEntries);
    
    const highAlertList = getAlerts(entriesWithUniqueIDs, listOfAverages, 0.9, 0);
    const lowAlertList = getAlerts(entriesWithUniqueIDs, listOfAverages, 2, 0.9);

    setListOfHighAlerts(highAlertList);
    setListOfLowAlerts(lowAlertList);

  }, [props.allEntries]);


  return (
    <div className="alerts-page">
      <div>
        <h1 className="title high-alert">High Alert</h1>
        <SearchResults allEntries={props.allEntries}
          sortBy="weight"
          selectedEntries={listOfHighAlerts}/>
      </div>
    </div>
  )
}

export default AlertsPage;