/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchResults from "../shared/search-results";


const HomePage = (props) => {
  const [dataWithUniqueID, setDataWithUniqueID] = useState([]);

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

    return [entriesWithUniqueIDs];
  }

  useEffect(() => {
    let temp = getDataWithUniqueIDs(props.allEntries);
    setDataWithUniqueID(temp[0]);
  }, [])

  return (
    <div className="home-page">
      <SearchResults allEntries={props.allEntries}
        selectedEntries={dataWithUniqueID}
        sortBy="uniqueID"/>
    </div>
  );
}

export default HomePage;