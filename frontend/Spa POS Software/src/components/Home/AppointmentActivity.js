import React from "react";
import "./HomeCardPOS.css";
import { Link } from "react-router-dom";
function AppointmentActivity() {
  return (
    <div className="HomeCardPOS">
      <span className="flex justify-between items-center">
        <h2>Appointment Activity</h2>{" "}
        <Link to="/calendar">
          <p className="flex-1 text-end p-2 text-blue-500">...view more</p>
        </Link>
      </span>
      <div style={{ height: "240px", overflowX: "auto" }}>
        <ul>
          <li>
            <div className="datePOS">
              {" "}
              <span>06</span>
              <span>Apr</span>
            </div>
            <div className="accactivity">
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Sat, 6 April 2024 2:00pm{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#512DC8",
                    paddingLeft: "5px",
                  }}
                >
                  BOOKED
                </span>
              </span>
              <span style={{ padding: "5px 0", fontSize: "18px" }}>
                Haircut
              </span>
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Walkin, 45min with priyansh
              </span>
            </div>
          </li>
          <li>
            <div className="datePOS">
              {" "}
              <span>06</span>
              <span>Apr</span>
            </div>
            <div className="accactivity">
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Sat, 6 April 2024 2:00pm{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#512DC8",
                    paddingLeft: "5px",
                  }}
                >
                  BOOKED
                </span>
              </span>
              <span style={{ padding: "5px 0", fontSize: "18px" }}>
                Haircut
              </span>
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Walkin, 45min with priyansh
              </span>
            </div>
          </li>
          <li>
            <div className="datePOS">
              {" "}
              <span>06</span>
              <span>Apr</span>
            </div>
            <div className="accactivity">
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Sat, 6 April 2024 2:00pm{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#512DC8",
                    paddingLeft: "5px",
                  }}
                >
                  BOOKED
                </span>
              </span>
              <span style={{ padding: "5px 0", fontSize: "18px" }}>
                Haircut
              </span>
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Walkin, 45min with priyansh
              </span>
            </div>
          </li>
          <li>
            <div className="datePOS">
              {" "}
              <span>06</span>
              <span>Apr</span>
            </div>
            <div className="accactivity">
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Sat, 6 April 2024 2:00pm{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#512DC8",
                    paddingLeft: "5px",
                  }}
                >
                  BOOKED
                </span>
              </span>
              <span style={{ padding: "5px 0", fontSize: "18px" }}>
                Haircut
              </span>
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Walkin, 45min with priyansh
              </span>
            </div>
          </li>
          <li>
            <div className="datePOS">
              {" "}
              <span>06</span>
              <span>Apr</span>
            </div>
            <div className="accactivity">
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Sat, 6 April 2024 2:00pm{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#512DC8",
                    paddingLeft: "5px",
                  }}
                >
                  BOOKED
                </span>
              </span>
              <span style={{ padding: "5px 0", fontSize: "18px" }}>
                Haircut
              </span>
              <span style={{ fontSize: "18px", color: "#777878" }}>
                Walkin, 45min with priyansh
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AppointmentActivity;
