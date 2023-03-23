/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import BirdImage from "../../../assets/birb.png";
import "./style.scss";

const Modal = (props) => {
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [mostRecentEntry, setMostRecentEntry] = useState({});
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current.showModal();
    document.body.style.overflow = "hidden";
  }

  const closeModal = () => {
    props.setOpenModal(false);
    modalRef.current.close();
    document.body.style.overflow = "scroll";
  }

  useEffect(() => {
    if (props.openModal === false) {
      closeModal();
    } else {
      openModal();
    }
  }, [props.openModal])

  useEffect(() => {
    const updateSelectedEntries = () => {
      let temp = [];
      for (let i = 0; i < props.allEntries.length; i ++) {
        if (props.allEntries[i].bird_id === props.selectedEntry.bird_id) {
          let date = new Date(`${props.allEntries[i].clock}`);
          let monthText;

          switch (date.getMonth()) {
            case (1):
              monthText = "Jan";
              break;
            case (2):
              monthText = "Feb";
              break;
            case (3):
              monthText = "Mar";
              break;
            case (4):
              monthText = "Apr";
              break;
            case (5):
              monthText = "May";
              break;
            case (6):
              monthText = "Jun";
              break;
            case (7):
              monthText = "Jul";
              break;
            case (8):
              monthText = "Aug";
              break;
            case (9):
              monthText = "Sep";
              break;
            case (10):
              monthText = "Oct";
              break;
            case (11):
              monthText = "Nov";
              break;
            case (12):
              monthText = "Dec";
              break;
            default:
              monthText = "Error";
                break;
          }

          let entry = {
            monthText: monthText,
            date: date,
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            weight: props.allEntries[i].weight
          }

          temp.push(entry);
        }

        temp.sort((a, b) => b.date - a.date);
      }
      setMostRecentEntry(temp[0]);
      setSelectedEntries(temp);
    }

    updateSelectedEntries();
  }, [props.selectedEntry, props.allEntries]);
  

  return <>
    <dialog ref={modalRef}>
      <button onClick={closeModal}>x</button>
      <img src={BirdImage}/>
      {(mostRecentEntry) 
        ? <p>
            Last recorded: {mostRecentEntry.monthText} 
            {" "}{mostRecentEntry.day} 
            {", "}{mostRecentEntry.hour}
            {":"}{mostRecentEntry.minutes}
          </p>
        : <p>Something went wrong</p>
      }
      <h1>Logs</h1>
      {(selectedEntries).map((item, index) => {
        return <div className="entry-div" key={index}>
          <p>Date/Time: {item.monthText} {item.day}, {item.hour}:{item.minutes} Weight: {item.weight}</p>
          {(selectedEntries.bird_id === '0001H5-018A69941') 
            ? <p>
              Kestrel
              </p>
            : <p>Pigeon</p>
        } 
        </div>
      })}
    </dialog>
  </>
}

export default Modal;