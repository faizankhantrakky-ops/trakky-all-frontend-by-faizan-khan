import React from 'react';
import FacilityContext from './contexts/FacilityContext';

const CheckBox = ({ Img, ImgActive, title }) => {
    const { facilities, setFacilities } = React.useContext(FacilityContext);

    const active = facilities.includes(title);

    const changeFacilityData = () => {
        let updatedFacilities;

        if (active) {
            updatedFacilities = facilities.filter(item => item !== title);
        } else {
            updatedFacilities = [...facilities, title];
        }

        setFacilities(updatedFacilities);
    };

    return (
        <div onClick={changeFacilityData} className='flex flex-col justify-center items-center'>
            <img src={active ? ImgActive : Img} className='w-[2.5rem]' alt="checkbox_img" />
            <p className='text-xs'>{title}</p>
        </div>
    );
};

export default CheckBox;
