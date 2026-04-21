import React from "react";
import "./News.css";
import {data} from './data'
function News() {
    console.log(data)
  return (
    <div>
      <h2>News</h2>
      <div className="NewscontentPOS">
        {data.map(item=>{
            return(
        <div className="newscardPOS">
          <h3>{item.title}</h3>
          <h5>{item.time}</h5>
          <p>
            {item.news}
          </p>
          <div className="redirectbtnPOS">
            <p>{item.buttontxt}</p>
          </div>
        </div> 
            )
        })}
        {/* <div className="newscardPOS">
          <h3>NEW: Google Rating Boost</h3>
          <h5>2 Days ago</h5>
          <p>
            Now you can send your happiest Trakky clients to leave the same
            great reviews on Google. It’ll boost your ranking and get more
            clicks on your business.
          </p>
          <div className="redirectbtnPOS">
            <p>Get started</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default News;
