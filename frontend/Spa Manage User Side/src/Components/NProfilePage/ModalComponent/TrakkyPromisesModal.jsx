import React from "react";
import PromisesLogo from '../../../Assets/images/icons/trakky_promises_png.png';
import crossIcon from '../../../Assets/images/icons/crossIcon_svg.svg'

const TrakkyPromisesModal = ({onClose , spa}) => {
  return (
    <div className=" TPM-trakky-promises relative w-11/12 max-w-[420px] rounded-lg bg-white top-1/2 -translate-y-1/2 m-auto">
        <div className=" absolute h-10 w-10 flex items-center justify-center rounded-full bg-white -top-12 right-0" onClick={onClose}>
            <img src={crossIcon} className=" h-[14px] brightness-50 aspect-square object-cover " alt="" />
        </div>
        <div className=" w-full h-auto flex gap-3 p-5">
            <div className=" flex flex-col gap-3 grow">
                <h2 className=" text-xl font-semibold">Trakky Promises</h2>
                {
                    spa?.promise_description ? (<div className=" text-slate-600" dangerouslySetInnerHTML={{__html: spa?.promise_description}}></div>) : (
                        <div className=" text-slate-600">No promises available</div>
                    )
                }
            </div>
            <div className=" h-16 w-16 shrink-0 rounded-full">
                <img src={PromisesLogo} className=" h-16 aspect-square rounded-full object-cover" alt="promises" />
            </div>
        </div>
    </div>
  );
};

export default TrakkyPromisesModal;
