import configDB from "../../data/customizer/config";


const primary = configDB.data.color.primary_color;
const secondary = configDB.data.color.secondary_color;
const success = configDB.data.color.success_color;
const info = configDB.data.color.info_color;

export let apexRadialBarChart = {
  series: [],
  options: {
    chart: {
      height: 420,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "23px",
          },
          value: {
            fontSize: "17px",
          },
          total: {
            show: true,
            label: "",
            formatter: function (w) {
              return;
            },
          },
        },
      },
    },
    labels:[],    
    colors: [secondary, success, info],    
  },
};
