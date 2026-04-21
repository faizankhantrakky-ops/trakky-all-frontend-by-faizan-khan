import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Divider from '@mui/material/Divider';
export default function Sidebilling({ props }) {
  const [feename, setfeename] = useState();
  const [feeamt, setfeeAmt] = useState();
  const [classActive, setClassActive] = useState("%");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="sideBillingMainDiv">
      <div className="Suppplier_billing">
        <span style={{ color: "#757676", fontSize: "15px" }}>Supplier</span>
        <span
          style={{ padding: "10px 0", fontWeight: "600", fontSize: "16px" }}
        >
          Vedant Enterprise
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ display: "flex", flexFlow: "column", color: "#757676" }}
          >
            <span>XYZ,Prahladnagar,Ahmedabad</span>
            <span>+91 8320067833</span>
            <span>vedantTrakky@gmail.com</span>
          </span>
          <span
            style={{ fontSize: "14px", color: "#512DC8", cursor: "pointer" }}
          >
            Change Supplier
          </span>
        </span>
      </div>
      <div className="Suppplier_billing">
        <span style={{ color: "#757676", fontSize: "15px" }}>Location</span>
        <span
          style={{ padding: "10px 0", fontWeight: "600", fontSize: "16px" }}
        >
          Salon 1
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ display: "flex", flexFlow: "column", color: "#757676" }}
          >
            <span>Sakar Bazar,Ahmedabad</span>
            <span>Gujarat</span>
            <span>+91 8320067833</span>
          </span>
          <span
            style={{ fontSize: "14px", color: "#512DC8", cursor: "pointer" }}
          >
            Change
          </span>
        </span>
      </div>
      <div className="Suppplier_billing">
        <span style={{ color: "#757676", fontSize: "15px" }}>Fees</span>
       
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {feename && feeamt ? (
            classActive === "%" ? (
              <div className="FEES_ForBilling">
                <span>
                  {feename} {feeamt} {classActive}{" "}
                </span>
                <span>
                  {classActive === "%" ? (feeamt * props) / 100 : ""} ₹
                </span>
              </div>
            ) : (
              <div className="FEES_ForBilling">
                <span>{feename}</span>
                <span>{feeamt} ₹</span>
              </div>
            )
          ) : (
            <span
              onClick={handleOpen}
              style={{ fontSize: "14px", color: "#512DC8", cursor: "pointer" }}
            >
              Add Fees
            </span>
          )}
        </span>
      </div>
      <Divider/>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="InsideModalSideBilling">
          <div className="sideBillingAddFees">
            <span style={{ fontWeight: "600" }}>Manage Fees</span>
            <span
              style={{ display: "flex", gap: "20px", alignItems: "center" }}
            >
              <span>
                <TextField
                  id="outlined-basic"
                  label="Fees Name"
                  variant="outlined"
                  onBlur={(e) => {
                    setfeename(e.target.value);
                  }}
                />
              </span>
              <span>
                <TextField
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  onBlur={(e) => {
                    setfeeAmt(e.target.value);
                  }}
                />
              </span>
              <span className="options_forFees">
                {" "}
                <button
                  className={
                    classActive === "%" ? "activeundersideBilling" : ""
                  }
                  onClick={() => {
                    setClassActive("%");
                  }}
                >
                  %
                </button>
                <button
                  className={
                    classActive === "INR" ? "activeundersideBilling" : ""
                  }
                  onClick={() => {
                    setClassActive("INR");
                  }}
                >
                  INR
                </button>
              </span>
            </span>
            <span
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <button className="SaveButtonbilling" onClick={handleClose}>
                Save
              </button>
            </span>
          </div>
        </div>
      </Modal>
      <div className="Suppplier_billing" style={{ gap: "10px" }}>
        <span className="Subtotal_sideBilling">
          <span>
            Subtotal
          </span>{" "}
          <span>
            {" "}
           {props} ₹
          </span>
        </span>
        {feeamt && feename ? (
          <span className="Subtotal_sideBilling">
            <span>
              Fees
            </span>
            <span>
             
              {classActive === "%"
                ? (feeamt * props) / 100
                : feeamt}{" "}
              ₹
            </span>
          </span>
        ) : (
          ""
        )}
      </div>
      <div className="Suppplier_billing subtotalwithfeesbilling">
        <h1>
            Total</h1>
         {
                feeamt && feename? classActive==='%'? (feeamt * props) / 100+props:parseInt(feeamt)+parseInt(props):props
            } ₹
        
      </div>
    </div>
  );
}
