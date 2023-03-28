/* eslint-disable */
import React, { useState } from "react";
import "./style.scss";
import Modal from "../modal";
import BirdImage from "../../../assets/birb.png";

const SearchResults = (props) => {
  const [selectedEntry, setSelectedEntry] = useState({});
  const [openModal, setOpenModal] = useState(false);
  // Handles differences in pop-ups
  const [sortBy, setSortBy] = useState(props.sortBy); 

  const handleSelectModal = (item) => {
    setSelectedEntry(item);
    setSortBy(props.sortBy);
    setOpenModal(true);
  }


  return (
    <>      
      <Modal openModal={openModal}
        setOpenModal={setOpenModal}
        selectedEntry={selectedEntry}
        allEntries={props.allEntries}
        sortBy={sortBy}/>
      
      {props.allEntries.map(
        (item, index) => {
          let itemDate = new Date(`${item.clock}`);
          if ((props.sortBy === "weight" && props.selectedEntries.includes(item))
              || (props.sortBy === "uniqueID" && props.selectedEntries.includes(item))) {
            return(
              <div className="result-div" 
                key={index} 
                onClick={() => {
                  handleSelectModal(item)
                  }
                }>
                <img src={BirdImage}/>
                <div>
                  <div className="row-1">
                    <p>ID: {item.bird_id}</p>
                    <p>Time: {itemDate.getHours()}:{itemDate.getMinutes()}</p>
                  </div>
                  <div className="row-1">
                    <p>Species name: Temp</p>
                  </div>
                  <div className="row-1">
                    <p>Weight: {item.weight}</p>
                  </div>
                </div>
              </div>
            );
          } else if ((props.sortBy === "date" && props.month === itemDate.getMonth() && props.day === itemDate.getDate())
                      || (props.sortBy === "id" && `${item.bird_id}`.includes(props.searchID))) {
              return (<div className="entry-row" key={index}>
                        <p>{itemDate.getHours()}:{itemDate.getMinutes()}</p>
                        <p>{item.bird_id}</p>
                        <p>Species</p>
                        <p>{item.weight}</p>
                      </div>)
                      
          }
        }) 
      }
    </>
  );
}

export default SearchResults;