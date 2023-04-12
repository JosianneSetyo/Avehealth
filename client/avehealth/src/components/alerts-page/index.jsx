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
  const calculateMedian = (values) => {
    const middleIndex = Math.floor(values.length / 2);
    console.log(middleIndex)
    if (values.length % 2 === 0) {
      // If there are an even number of values, take the average of the middle two values
      return (values[middleIndex - 1] + values[middleIndex]) / 2;
    } else {
      // If there are an odd number of values, take the middle value
      return values[middleIndex];
    }
  }
  
  const returnFiltered = (items, deviationFactor) => {
    const values = items.map(item => item.result);
    console.log(values)
    values.sort((a, b) => a - b);
    //Calculate median
    let median = 0;
    const middleIndex = Math.floor(values.length / 2);
    console.log(middleIndex)
  
    //Calculate quartiles
    const q1 = calculateMedian(values.slice(0, middleIndex));
    const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));
    //apply filter
    const iqr = q3 - q1;
    console.log(iqr)
  
    const lowerBound = q1 - deviationFactor * iqr;
    const upperBound = q3 + deviationFactor * iqr;
    console.log(q3)
    const trimmedValues = items.filter((value) => value.result >= lowerBound && value.result <= upperBound);
  
    return trimmedValues;
  }

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
    
    const allEntriesSortedByIDs = [];

    for (let i = 0; i < listOfIDs.length; i ++) {
      let temp = {
        id: listOfIDs[i],
        listOfEntries: []
      }

      for (let j = 0; j < props.allEntries.length; j ++) {
        if (props.allEntries[j].bird_id === listOfIDs[i]) {
          temp.listOfEntries.push(props.allEntries[j])
        }
      }

      allEntriesSortedByIDs.push(temp);
    }

    // const listOfAverages = getAveragesForEachID(listOfIDs, props.allEntries);
    
    // const highAlertList = getAlerts(entriesWithUniqueIDs, listOfAverages, 0.9, 0);
    // const lowAlertList = getAlerts(entriesWithUniqueIDs, listOfAverages, 2, 0.9);

    const highAlertList = [];

    for (let k = 0; k < allEntriesSortedByIDs.length; k ++) {
      console.log(allEntriesSortedByIDs)
      if (allEntriesSortedByIDs[k].listOfEntries.length > 0) {
        let temp = returnFiltered(allEntriesSortedByIDs[k].listOfEntries, 1.5);
        console.log(temp)
      }
    }


    setListOfHighAlerts(highAlertList);
    // setListOfLowAlerts(lowAlertList);

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