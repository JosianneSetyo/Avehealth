/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./style.scss";
import SearchResults from "../shared/search-results";


const DataLogPage = (props) => {
  const [searchID, setSearchID] = useState("");
  const [dataUniqueIDs, setDataUniqueIDs] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchID(event.target.value);
  }

  useEffect(() => {
    const getUniqueDates = () => {
      let temp = {month: "", day: "", monthText: ""};
      let dates = [];

      for(let i = 0; i < props.allEntries.length; i ++) {
        let date = new Date(`${props.allEntries[i].clock}`);
        let tempMonth = date.getMonth();
        let tempDay = date.getDate();

        if (temp.month !== tempMonth || temp.day !== tempDay) {
          let monthText;

          switch (tempMonth) {
            case (0):
              monthText = "Jan";
              break;
            case (1):
              monthText = "Feb";
              break;
            case (2):
              monthText = "Mar";
              break;
            case (3):
              monthText = "Apr";
              break;
            case (4):
              monthText = "May";
              break;
            case (5):
              monthText = "Jun";
              break;
            case (6):
              monthText = "Jul";
              break;
            case (7):
              monthText = "Aug";
              break;
            case (8):
              monthText = "Sep";
              break;
            case (9):
              monthText = "Oct";
              break;
            case (10):
              monthText = "Nov";
              break;
            case (11):
              monthText = "Dec";
              break;
            default:
              monthText = "Error";
                break;
          }

          temp = {month: date.getMonth(), day: date.getDate(), monthText: monthText}
          dates.push(temp);
        }
      }
      
      setUniqueDates(dates);
    }

    getUniqueDates();
  }, [props.allEntries]); 

  return (
  <div className="datalog-page">
    <input onChange={handleSearchInputChange} 
      placeholder="Provide a Bird ID">
    </input>
    {
      (searchID === "")
      ? <> 
          {uniqueDates.map((item, index) => {
            return (
              <div key={index}>
                <h1 className="title">{item.monthText} {item.day}</h1>
                <SearchResults allEntries={props.allEntries}
                  sortBy="date"
                  month={item.month}
                  day={item.day}/>
              </div>
            )})
          }
        </>
      : <>
          <SearchResults allEntries={props.allEntries}
            sortBy="id"
            searchID={searchID}/>
        </>
    }

  </div>
  )
}

export default DataLogPage;