
import React, { useState, useEffect } from "react";
import SearchResults from "../shared/search-results";
import "./style.scss";

const AlertsPage = (props) => {
  const [dataUniqueIDs, setDataUniqueIDs] = useState([]);
  const [listOfAverageWeights, setListOfAverageWeights] = useState([]);
  const [listOfAlerts, setListOfAlerts] = useState([]);
  const [listOfLowAlerts, setListOfLowAlerts] = useState([]);

  useEffect(() => {
    const getDataUniqueIDs = () => {
      let presentDate = new Date();
      let month = presentDate.getMonth();
      let day = presentDate.getDate();
      
      let listIDs = [];
      let temp = [];

      let allEntriesCopy = [...props.allEntries];
      allEntriesCopy.sort((b, a) => a.clock - b.clock);

      for (let i = allEntriesCopy.length; i >= 0; i --) {
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

      console.log(temp);

      setDataUniqueIDs(temp);
    }


    getDataUniqueIDs();
  }, [props.allEntries]);

  useEffect(() => {
    const getAverage = () => {
      let temp = [];

      for (let i = 0; i < dataUniqueIDs.length; i ++){
        let sumOfWeights = 0;
        let numOfEntries = 0;

        for (let j = 0; j < props.allEntries.length; j ++) {
          if (props.allEntries[j].bird_id === dataUniqueIDs[i]) {
            sumOfWeights += dataUniqueIDs.weight;
            numOfEntries ++;
          }
        }

        let average = sumOfWeights / numOfEntries;

        let entry = {
          bird_id: dataUniqueIDs.bird_id,
          average: average
        }

        temp.push(entry);
      }

      setListOfAverageWeights(temp);
    }


    getAverage();
  }, [dataUniqueIDs, props.allEntries]);

  useEffect(() => {
    const getHighAlert = () => {
      let temp = [];

      for (let i = 0; i < listOfAverageWeights.length; i ++){
        for (let j = 0; j < dataUniqueIDs.length; j ++) {
          if (dataUniqueIDs[j].bird_id === listOfAverageWeights[i].bird_id) {
            let recentWeight = dataUniqueIDs[j].weight;
            if (listOfAverageWeights[i].sumOfWeights - recentWeight > listOfAverageWeights[i].sumOfWeights * 0.1) {
              temp.push(dataUniqueIDs[j]);
            }

            break;
          }
        }
      }

      setListOfAlerts(temp);
    }

    getHighAlert();
  }, [listOfAverageWeights])

  useEffect(() => {
    const getLowAlert = () => {
      let temp = [];

      for (let i = 0; i < dataUniqueIDs.length; i++){
        if (listOfAlerts.includes(dataUniqueIDs[i]) === false){
          temp.push(dataUniqueIDs[i]);
        }
      }

      setListOfLowAlerts(temp);
      
    }

    getLowAlert();
  }, [listOfAverageWeights])


  return (
    <div className="alerts-page">
      <div>
        <h1 className="title high-alert">High Alert</h1>
        <SearchResults allEntries={listOfAlerts}
          sortBy="weight"
          upperLimit={2500}
          lowerLimit={30}/>
      </div>
      <div>
        <h1 className="title low-alert">Low Alert</h1>
        <SearchResults allEntries={listOfLowAlerts}
          sortBy="weight"
          upperLimit={2500}
          lowerLimit={30}/>
      </div>    
          
    </div>
  )
}

export default AlertsPage;