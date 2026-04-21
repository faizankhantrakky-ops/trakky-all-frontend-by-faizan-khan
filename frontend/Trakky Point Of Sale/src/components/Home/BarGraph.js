import React from "react";
import {data2} from './Data'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

function BarGraph() {
    const labels = data2.map(item=>{
        return item.date
    })
    const booking = data2.map(item=>{
        return item.booking
    })
    let totalBooking = 0;

for (let i = 0; i < data2.length; i++) {
  totalBooking += data2[i].booking;
}
     const data = {
        labels,
        datasets: [
          {
            label: "Dataset 1",
            data: booking,
            backgroundColor: "#512DC8",
          },
        ],
      };
  return (
    <div className="POSlinegraph">
     Upcoming Appointments <br /> <br />
     Total Bookings: {totalBooking}
     <div className="flex justify-center">
      <Bar options={options} data={data} className="linegraphPOS" />
      </div>
    </div>
  );
}

export default BarGraph;
