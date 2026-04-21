import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import smallAndFormat from "../../Common/functions/smallAndFormat";

function Spaservices() {
  const params = useParams();
  const navigate = useNavigate();

  const [masterMassages, setMasterMassages] = useState([]);
  const [masterMassagesLoading, setMasterMassagesLoading] = useState(true);

  const getBestMassage = async () => {
    let url = "https://backendapi.trakky.in/spas/masterservice/";

    setMasterMassagesLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setMasterMassages(data?.results);
        setMasterMassagesLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setMasterMassagesLoading(false);
    }
  };

  useEffect(() => {
    getBestMassage();
  }, []);

  const formateServiceName = (name) => {

    return name?.toLowerCase().replace(/ /g, "-").replace(/---/g, "-");
  };

  return (
    (masterMassagesLoading ||
    masterMassages?.length > 0 ) && 
      <div className="mt-5 lg:mt-6">
        <div className="mx-4 flex items-center md:mx-10">
          <h2 className=" text-base md:text-xl font-semibold">
            {/* What are you looking for? */}
            Massage therapies in {smallAndFormat(params?.city)}
          </h2>
        </div>
        <div className="ml-4 pt-4 flex gap-5 overflow-x-scroll snap-x snap-mandatory md:ml-10">
          {masterMassages?.length > 0 ? (
            Array.from(
              { length: masterMassages?.length / 2 },
              (_, index) => (
                <div className="flex flex-col gap-4 snap-start last:mr-4 lg:flex-row">
                  {masterMassages
                    ?.slice(index * 2, index * 2 + 2)
                    .map((service, index) => (
                      <div
                        className="flex flex-col gap-1 lg:gap-3 cursor-pointer w-28 lg:w-32"
                        onClick={() =>{
                          navigate(`/${encodeURIComponent(params?.city)}/massages/${formateServiceName(service?.service_name)}/${service?.id}`)
                        }}
                      >
                        <div className=" bg-gray-200 h-28 w-28 rounded-full lg:h-32 lg:w-32">
                          {service?.service_image && (
                            <img
                              src={service?.service_image}
                              alt={service?.service_name}
                              className="h-full w-full object-cover rounded-full drop-shadow shadow blur-[0.15px]"
                            />
                          )}
                        </div>
                        <div className="text-center line-clamp-1 text-sm">
                          {service?.service_name}
                        </div>
                      </div>
                    ))}
                </div>
              )
            )
          ) : (
            Array.from(
              { length: 8 },
              (_, index) => (
                <div className="flex flex-col gap-4 snap-start last:mr-4 lg:flex-row">
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
                    ?.slice(index * 2, index * 2 + 2)
                    .map((service, index) => (
                      <div
                        className="flex flex-col gap-1 lg:gap-3 cursor-pointer w-28 lg:w-32"                 
                      >
                        <div className=" bg-gray-200 h-28 w-28 rounded-full lg:h-32 lg:w-32 animate-pulse">
                        </div>
                        <div className="text-center line-clamp-1 text-sm animate-pulse">
                          Loading...
                        </div>
                      </div>
                    ))}
                </div>
              )
            )
          )}
        </div>
      </div>
    
    
  )
}

export default Spaservices;
