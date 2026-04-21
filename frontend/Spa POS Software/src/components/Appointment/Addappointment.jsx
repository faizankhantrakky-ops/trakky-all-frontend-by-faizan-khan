import React, { useContext, useEffect, useState } from "react";
import { data } from "./DummyData";
import FormAddappointment from "./FormAddappointment";
import AuthContext from "../../Context/Auth";
import axios from "axios";
export default function Addappointment() {

  const { authTokens } = useContext(AuthContext);

  const [offer, setoffer] = useState([]);
  const [staff, setStaff] = useState([])
  const bearerToken = authTokens.access_token;

  const fetchOffersData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/offers/",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setoffer(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  };


  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/spavendor/staff/`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (response?.data) {
        setStaff(response?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // fetchOffersData();
    fetchStaff();
  }
    , []);

  return (
    <div
      style={{
        paddingTop: "20px",
        display: "flex",
        flexFlow: "column",
        gap: "15px",
      }}
    >
      {/* <div className="chairouterboxPOS">
        {offer.map((item, index) => {
          return (
            <span className="chairinnerBox" key={index}>
              <span style={{ fontWeight: "600" }}>{item.offername}</span>

              <span>{item.price}</span>
            </span>
          );
        })}
      </div> */}
      <div className="addappointmentFormNDmembershipdetails" style={{ display: "flex", gap: "15px" }}>
        <div className="FormPOSaddappointment">
          <FormAddappointment props={offer} staff={staff} />
        </div>
        <div className="POSmembershipandotherdetails">
          <div className="available_staff">
            <h3 style={{ margin: "0" }}>Available Staff</h3>
            <div style={{ display: "flex", flexFlow: "column", gap: "15px" }}>
              {staff.map((item) => {
                return (
                  <div>
                    <span>{item.staffname}</span>
                    <span
                      style={{
                        color: item.is_busy === true ? "red" : "green",
                      }}
                    >
                      {item.is_busy === true ? "Busy" : "Free"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
