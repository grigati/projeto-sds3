import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { SaleSuccess } from "types/sale";
import { round } from "utils/format";
import { BASE_URL } from "utils/requests";

type SeriesData = {
  name: string;
  data: number[];
};

type ChartData = {
  series: SeriesData[];
  labels: {
    categories: string[];
  };
};

const BarChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: {
      categories: [],
    },
    series: [
      {
        name: "",
        data: [],
      },
    ],
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/sales/success-by-seller`).then((response) => {
      const data = response.data as SaleSuccess[];

      setChartData({
        labels: {
          categories: data.map((x) => x.sellerName),
        },
        series: [
          {
            name: "% Sucesso",
            data: data.map((x) => round((100 * x.deals) / x.visited, 1)),
          },
        ],
      });
    });
  }, []);

  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
  };

  return (
    <Chart
      series={chartData.series}
      options={{ ...options, xaxis: chartData.labels }}
      type="bar"
      height="240"
    />
  );
};

export default BarChart;
