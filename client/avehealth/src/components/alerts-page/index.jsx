
import React, { useState, useEffect } from "react";
import SearchResults from "../shared/search-results";
import "./style.scss";

const AlertsPage = (props) => {
  const [dataUniqueID, setDataUniqueIDs] = useState([]);

  useEffect(() => {
    const getDataUniqueIDs = () => {
      let presentDate = new Date();
      let month = presentDate.getMonth();
      let day = presentDate.getDate();
      
      let listIDs = [];
      let temp = [];

      let allEntriesCopy = [...props.allEntries];
      allEntriesCopy.sort((a, b) => b.clock - a.clock);

      for (let i = 0; i < allEntriesCopy.length; i ++) {
        let idExists = false;
        
        for (let j = 0; j < listIDs.length; j ++) {
          if (props.allEntries[i].bird_id === listIDs[j]) {
            idExists = true;
            break;
          }
        }

        if (!idExists) {
          listIDs.push(allEntriesCopy[i].bird_id);
          
          let entryDate = new Date(allEntriesCopy[i].clock);

          if (entryDate.getMonth() === month && entryDate.getDate() === day) {
            temp.push(allEntriesCopy[i]);
          }
        } 
      }

      setDataUniqueIDs(temp);
    }


    getDataUniqueIDs();
  }, [props.allEntries]);


  return (
    <div className="alerts-page">
      <div>
        <h1 className="title high-alert">High Alert</h1>
        <SearchResults allEntries={dataUniqueID}
          sortBy="weight"
          upperLimit={2500}
          lowerLimit={30}/>
      </div>
      <div>
        <h1 className="title low-alert">Low Alert</h1>
        <SearchResults allEntries={dataUniqueID}
          sortBy="weight"
          upperLimit={2500}
          lowerLimit={30}/>
      </div>    
          
    </div>
  )
}

export default AlertsPage;