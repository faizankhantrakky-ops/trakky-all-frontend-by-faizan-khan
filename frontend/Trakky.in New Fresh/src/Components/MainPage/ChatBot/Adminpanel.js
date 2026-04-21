import React, { useEffect, useState } from "react";
import "./Adminpanel.css";
import CloseIcon from "@mui/icons-material/Close";
import { data } from "./newdata.js";

function Adminpanel() {
  const [error, setError] = useState(null);
  const [chathistory, setChathistory] = useState([]);
  const [cardnum, setCardnum] = useState(null);
  const [visibility, setVisibility] = useState("hidden");
  const [cardvisibility, setcardVisibility] = useState("visible");

  const showchatHandler = () => {
    setVisibility("hidden");
    setcardVisibility("visible");
  };

  useEffect(() => {
    fetch("https://backendapi.trakky.in/api/chatdata/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setChathistory(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);
  useEffect(() => {
    console.log(chathistory);
  }, [chathistory]);
  useEffect(() => {
    console.log(cardnum);
  }, [cardnum]);

  const selectItemHandler = (item) => {
    setCardnum(item);
    setcardVisibility("hidden");
    setVisibility("visible");
  };

  return (
    <>
      <div className="tablechathistory">
        <table
          style={{ visibility: cardvisibility }}
          className="chathistory-parent"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {chathistory.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.number}</td>
                    <td>{item.timestamp.split("T")[0]}</td>
                    <td onClick={() => selectItemHandler(item)}>
                      <span className="chathistory_viewchat_action">
                        View Chat
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <div className='chatbox-container'>
        {chathistory.map((item, index) => (
          <React.Fragment key={index}>
            <div className="chatbox-card" onClick={() => selectItemHandler(item)} style={{visibility:cardvisibility}}>
              <div className='chatbox-details'>
                <p>Name: <span>{item.name}</span></p>
                <p>Mobile No: <span>{item.number}</span></p>
                <p>Date: <span>{item.timestamp.split('T')[0]}</span></p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div> */}

      {cardnum && (
        <div
          className="chathistory-container"
          style={{ visibility: visibility }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px",
            }}
            className="chathistory-clsbtn"
          >
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={showchatHandler}
            />
          </div>
          <div className="chatbox-history">
            <div className="chathistory-us">
              <p>Please provide your number</p>
            </div>
            {cardnum.children.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="chathistory-user">
                    <p>{item.user}</p>
                  </div>
                  <div className="chathistory-us">
                    <p>{item.quote}</p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Adminpanel;
