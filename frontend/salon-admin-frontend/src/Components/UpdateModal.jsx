import React from "react";


export default function Modal(props) {    
    
  return (
        <div className="modal">
          <div
            className="justify-center items-start flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => props.closeModal()}
          >
            <div className="relative w-3/4 my-6 mx-auto max-w-3xl "
                onClick={(e) => e.stopPropagation()}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-transparent outline-none focus:outline-none">
                  {
                    props.children
                  }
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
  );
}