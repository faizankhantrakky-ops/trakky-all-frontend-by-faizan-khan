import React from 'react'
import { Line } from "react-chartjs-2";
import {data1} from './Data'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components and scales
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Generate static data for labels (months)

// Generate static data for datasets
// const generateRandomData = () => {
//   return labels.map(
//     () => Math.floor(Math.random() * (1000 - -1000 + 1)) + -1000
//   );
// };

// Define options outside the component


// Define datasets outside the component


function LineGraph() {
    const labels=data1.map(item=>{
       return item.date
    })
    const appointment =data1.map(item=>{
        return item.Appointmentamount
    })
    const sales =data1.map(item=>{
        return item.Salesamount
    })
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
            text: "Chart.js Line Chart",
          },
        },
        scales: {
          x: {
            type: "category", // Use 'category' type for the x-axis scale
            labels: labels,
          },
        },
      };
      const data = {
        labels,
        datasets: [
          {
            label: "Appointment",
            data: appointment,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Sales",
            data: sales,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
    let sum = appointment.reduce((sum,currentval)=>sum +parseInt(currentval),0)
    console.log(sum)
    let sum2 = sales.reduce((sum,currentval)=>sum +parseInt(currentval),0)
    console.log(sum2)
  return (
    <div className="POSlinegraph">
    Appointment Amount: {sum} <br /> <br />
    Sales Amount:{sum2}
    <div className='w-full flex justify-center'>
    <Line options={options} data={data} className="linegraphPOS"/>
    </div>
  </div>
  )
}

export default LineGraph