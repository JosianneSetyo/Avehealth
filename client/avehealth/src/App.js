/* eslint-disable */
import React, { useState, useEffect } from "react";

import BirdImage from "../src/assets/birb.png";

import "./jungle_style.scss";

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentBird, setCurrentBird] = useState({id: 1, weight: 2, clock: 3});


  const getData = async () => {
    try {
      fetch (
        "http://localhost:5500/entries", {
          method: "GET",
          headers: {"Accept": "application/json"},
        }
      )
        .then (response => response.json())
        .then (response => {
          let temp1 = [];
          let temp2 = [];

          for (let i = 0; i < response.length; i ++) {
            let doesIdExist = false;
            for (let j = 0; j < temp1.length; j ++) {
              if (temp1[j].bird_id === response[i].bird_id) {
                doesIdExist = true;
              }
            }
            if (!doesIdExist) {
              temp1.push(response[i]);
            }

            temp2.push(response[i]);
          }

          setData(temp1);
          setAllData(temp2);
        });

      console.log(data);

      console.log(allData)
    } catch (e) {
      console.log(e.message);
    }
  }


  const getAlerts = (val1, val2) => {
    let alerts = 0;

    for (let i = 0; i < data.length; i ++) {
      if (data[i].weight >= val1 && data[i].weight <= val2) {
        alerts ++;
      }
    }

    return alerts;
  }


  useEffect (() => {
    getData();
  }, []);


  const openModal = (val, weight, clock, id) => {
    console.log(`${id} ${weight} ${clock}`)
    setCurrentBird({id: id, weight: weight, clock: clock});
    
    if (val === "alert") {
      let el = document.getElementById("alert-dialog");
      el.showModal();
    } 
  }

  const closeModal = (val) => {
    if (val === "alert") {
      let el = document.getElementById("alert-dialog");
      el.close();
    } 
  }

  useEffect(() => {
    let matches = 0;
    let result = [];

    for (let i = 0; i < data.length; i ++) {
      if (data[i].bird_id == search) {
        result.push(data[i]);
        matches ++;
      } 
    }

    if (matches === 0) {
      setSearchResults([]);
    } else {
      setSearchResults(result);
    }

    console.log(searchResults)

  }, [search])


  return (
    <div className="main-section">
      {/* <div className="header">Page {currentPage}</div> */}
      <button className="tab-button" onClick={() => {setCurrentPage(0)}}>Data Log</button>
      <button className="tab-button" onClick={() => {setCurrentPage(1)}}>Alerts</button>
      <button className="refresh" onClick={getData}></button>
      {(currentPage == 1) 
      ? 
        <div>
          <dialog id="alert-dialog">
            <button className="close-button" onClick={() => closeModal("alert")}></button>
            <img src={BirdImage} alt="back"></img>
            <p>Temp Species Name</p>
            <p>Last recorded: {new Date(`${currentBird.clock}`).getMonth()}/{new Date(`${currentBird.clock}`).getDay()}  {new Date(`${currentBird.clock}`).getHours()}:{new Date(`${currentBird.clock}`).getMinutes()}</p>
            <h1>Logs</h1>
            {allData.map((item, index) => {
              if (item.bird_id === currentBird.id) {
                let itemDate = new Date(`${item.clock}`);
                return  <p key={index}>
                          Time: {itemDate.getMonth()}/{itemDate.getDay()}  {itemDate.getHours()}:{itemDate.getMinutes()}   
                              Weight: {item.weight}
                        </p>
              }})
            }
          </dialog>
  
          <div className="high-alert-div">
            <div><h1 className="high-alert-h1">{getAlerts(10, 30)} High Alert</h1></div>
            {data.map((item, index) => 
              {
                let itemDate = new Date(`${item.clock}`);
                if (item.weight >= 10 && item.weight <= 30) {
                  return <div key={index} className="bird-div" onClick={() => {openModal("alert", item.weight, item.clock, item.bird_id)}}>
                            <div className="div-top"></div>
                            <div className="div-bottom">
                              <div className="div-1"><p>{item.bird_id}</p><p>{itemDate.getHours()}:{itemDate.getMinutes()}</p></div> 
                              <div className="div-2"><p>species name: temp</p></div>
                              <div><p>weight:{item.weight}</p></div>
                            </div>
                          </div>;
                }
              }
            )}
          </div>
          <div className="high-alert-div">
            <div><h1 className="low-alert-h1">{getAlerts(30, 100)} Low Alert</h1></div>
            <dialog id="alert-dialog"></dialog>
            {data.map((item, index) => 
              {
                let itemDate = new Date(`${item.clock}`);
                if (item.weight > 30 && item.weight <= 100) {
                  return <div key={index} className="bird-div" onClick={() => {openModal("alert", item.weight, item.clock, item.bird_id)}}>
                                  <div className="div-top"></div>
                                  <div className="div-bottom">
                                    <div className="div-1"><p>{item.bird_id}</p><p>{itemDate.getHours()}:{itemDate.getMinutes()}</p></div> 
                                    <div className="div-2"><p>species name: temp</p></div>
                                    <div><p>weight:{item.weight}</p></div>
                                  </div>
                                </div>;
                }
              }
            )}
          </div>
        </div>
      :
        <div className="main-section">
          <div className="search-div">
            <input placeholder="Find a Bird with Bird ID"
              onChange={(e) => {
                setSearch(e.target.value);
              }}></input>
          </div>
          
          {
            (`${search}` === "")
            ?
            <div>
              <h1>Today</h1>
              <div className="high-alert-div">
              <dialog id="alert-dialog">
                <button className="close-button" onClick={() => closeModal("alert")}></button>
                <img src={BirdImage} alt="back"></img>
                <p>Temp Species Name</p>
                <p>Last recorded: {new Date(`${currentBird.clock}`).getMonth()}/{new Date(`${currentBird.clock}`).getDay()}  {new Date(`${currentBird.clock}`).getHours()}:{new Date(`${currentBird.clock}`).getMinutes()}</p>
                <h1>Logs</h1>
                {allData.map((item, index) => {
                  let itemDate = new Date(`${item.clock}`)
                  if (item.bird_id === currentBird.id) {
                    return  <div key={index} style={{margin: "0px", padding: "0px", width: "40vw", display: "flex", justifyContent: "flex-start"}}> 
                          <p style={{margin: "0"}}>
                            Time: {itemDate.getMonth()}/{itemDate.getDay()}  {itemDate.getHours()}:{itemDate.getMinutes()}   
                          </p>
                          <p style={{margin: "0"}}>
                            Weight: {item.weight}
                          </p>
                        </div>
                        
              }})
            }
              </dialog>
                {allData.map((item, index) => 
                    {
                      let itemDate = new Date(`${item.clock}`);
                      console.log(itemDate.getDate())
                      if (itemDate.getDate() > 3) {
                        return <div key={index} className="bird-div" onClick={() => {openModal("alert", item.weight, item.clock, item.bird_id)}}>
                                  <div className="div-top"></div>
                                  <div className="div-bottom">
                                    <div className="div-1"><p>{item.bird_id}</p><p>{itemDate.getHours()}:{itemDate.getMinutes()}</p></div> 
                                    <div className="div-2"><p>species name: temp</p></div>
                                    <div><p>weight:{item.weight}</p></div>
                                  </div>
                                </div>;
                      }
                    }
                  )}
              </div>
              <h1>Yesterday</h1>
              <div className="high-alert-div">
                {allData.map((item) => 
                    {
                      let itemDate = new Date(`${item.clock}`);
                      if (itemDate.getDate() <= 3) {
                        return <div className="bird-div" onClick={() => {openModal("alert", item.weight, item.clock, item.bird_id)}}>
                                  <div className="div-top"></div>
                                  <div className="div-bottom">
                                    <div className="div-1"><p>{item.bird_id}</p><p>{itemDate.getHours()}:{itemDate.getMinutes()}</p></div> 
                                    <div className="div-2"><p>species name: temp</p></div>
                                    <div><p>weight:{item.weight}</p></div>
                                  </div>
                                </div>;
                      }
                    }
                  )}
              </div>
            </div>
            :
            <div>
              <div className="high-alert-div">
                {searchResults.map((item) => 
                    {
                      return <div className="bird-div" onClick={() => {openModal("alert")}}>
                                <div className="div-top"></div>
                                <div className="div-bottom">
                                  <div className="div-1"><p>{item.bird_id}</p><p>{item.clock}</p></div> 
                                  <div className="div-2"><p>species name: temp</p></div>
                                  <div><p>weight:{item.weight}</p></div>
                                </div>
                              </div>;
                    }
                  )}
              </div>
            </div>
          }
        </div>
      }
      
  
    </div>
  );
}

export default App;