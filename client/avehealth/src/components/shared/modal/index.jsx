/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import BirdImage from "../../../assets/birb.png";
import "./style.scss";

const Modal = (props) => {
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [mostRecentEntry, setMostRecentEntry] = useState({});
  const [requests, setRequests] = useState();
  const [treatments, setTreatments] = useState([]);
  const modalRef = useRef(null);

  /**
   * States for the treatment form
   */
  const [medicationName, setMedicationName] = useState();
  const [dose, setDose] = useState();
  const [amount, setAmount] = useState();
  const [route, setRoute] = useState();
  const [duration, setDuration] = useState();

  const openModal = () => {
    modalRef.current.showModal();
    document.body.style.overflow = "hidden";
  }

  const closeModal = () => {
    props.setOpenModal(false);
    modalRef.current.close();
    document.body.style.overflow = "scroll";
  }



  /**
   * Functions for Requests
   */

  const addRequest = async () => {
    try {
      const body = {
        bird_id: `${props.selectedEntry.bird_id}`,
        "special_request": `${requests}`
      }

      const response = await fetch ("https://avehealth.onrender.com/comments", {
          method: "POST",
          cache: "no-cache",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        }
      )
      
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const getRequest = async () => {
    try {
      fetch (`https://avehealth.onrender.com/comments?bird_id=${props.selectedEntry.bird_id}`, {
          method: "GET",
          cache: "no-cache",
          headers: {"Accept": "application/json"}
        }
      )
      .then (response => {
        return response.json();
      })
      .then (data => {
        try {
          setRequests(data[0].special_request);
        } catch (e) {
          console.log(e);
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getRequest();
  }, [props.selectedEntry])

  /**
   * Functions for treatments
   */
  const addTreatment = () => {
    let body = {
      clock: `${new Date().toLocaleString}`,
      bird_id: `${props.selectedEntry.bird_id}`,
      medication: `${medicationName}`,
      dose: `${dose}`,
      amount: `${amount}`,
      route: `${route}`,
      duration: `${duration}`,
      remaining_duration: `${duration}`
    }

    try {
      fetch ("https://avehealth.onrender.com/treatments", {
          method: "POST",
          cache: "no-cache",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        }
      )
      .then (response => response.json())
      .then (getTreatment())
    } catch (e) {
      console.log(e);
    }
  }

  const getTreatment = () => {
    try {
      fetch (`https://avehealth.onrender.com/treatments?bird_id=${props.selectedEntry.bird_id}`, {
          method: "GET",
          cache: "no-cache",
          headers: {"Accept": "application/json"}
        }
      )
      .then (response => {
        return response.json();
      })
      .then (data => {
        console.log(treatments);
        setTreatments(data[0]);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const deleteTreatment = () => {
    try {
      fetch (`https://avehealth.onrender.com/treatments?bird_id=${props.selectedEntry.bird_id}`, {
          method: "DELETE",
          cache: "no-cache",
          headers: {"Content-Type": "application/json"}
        }
      )
      .then (response => {
        return response.json();
      })
      .then (data => {
        setTreatments({
          clock: "",
          bird_id: "",
          medication: "",
          dose: "",
          amount: "",
          route: "",
          duration: "",
          remaining_duration: ""
        });
      })
    } catch (e) {
      console.log(e);
    }
  }

  const reduceDoseByOne = () => {

  }

  useEffect(() => {
    getTreatment();
  }, [props.selectedEntry])

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
            {" Weight: "}{mostRecentEntry.weight}{"g"}
          </p>
        : <p>Something went wrong</p>
      }
            {(props.sortBy === "uniqueID") 
            ? <div className="uniqueID-form">
                <p>Special Request</p>
                <textarea
                  placeholder={requests}
                  onChange={(e) => {
                    setRequests(e.target.value);
                  }}></textarea>
                <button onClick={addRequest}>Edit</button>
                <p>Existing Treatment Plans</p>
                {(treatments !== undefined || treatments === null)
                  ? <div className="uniqueID-form">
                      <p>Medication: {(treatments !== null) ? treatments.medication : "..."}</p>
                      <p>Route: {(treatments.route !== null) ? treatments.route : "..."}</p>
                      <p>Last Administered: {(treatments.clock !== null) ? treatments.clock : "..."}</p>
                      <p>Duration: {(treatments.duration !== null) ? treatments.duration : "..."}</p>
                      <p>Amount: {(treatments.amount !== null) ? treatments.amount : "..."}</p>
                      <p>Dose: {(treatments.dose !== null) ? treatments.dose : "..."}</p>
                      <button onClick={deleteTreatment}>Completed a dose</button>
                      <button onClick={deleteTreatment}>Delete</button>
                    </div>
                  : <></>
                }
                <button onClick={getTreatment}>Refresh</button>
                <p>Add New Treatment Plan</p>
                <input placeholder="Medication Name"
                  onChange={(e) => {
                    setMedicationName(e.target.value);
                  }}></input>
                <input placeholder="Dose"
                  onChange={(e) => {
                    setDose(e.target.value);
                  }}></input>
                <input placeholder="Amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}></input>
                <input placeholder="Route"
                  onChange={(e) => {
                    setRoute(e.target.value);
                  }}></input>
                <input placeholder="Days"
                  onChange={(e) => {
                    setDuration(e.target.value);
                  }}></input>
                <input placeholder="Times/day"></input>
                <button onClick={addTreatment}>Add Treatment Plan</button>
              </div>
            : <></>
          }
      <h1>Logs</h1>
      {(selectedEntries).map((item, index) => {
        return <div className="entry-div" key={index}>
          <p>Date/Time: {item.monthText} {item.day}, {item.hour}:{item.minutes} Weight: {item.weight}</p>
        </div>
      })}

    </dialog>
  </>
}

export default Modal;