import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";
import { useGetTaskStatsQuery } from "../redux/baseApi/baseApi";

const Charts = () => {
  const { data: taskStats, isLoading } = useGetTaskStatsQuery();

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="lg:w-[60%] bg-white rounded-lg shadow-xl p-4">
        <Bar
          data={{
            labels: taskStats?.map((task) => task._id),
            datasets: [
              {
                label: "Count",
                data: taskStats?.map((task) => task.count),
                backgroundColor: [
                  "rgba(132, 234, 91)",
                  "rgba(162, 162, 162)",
                  "rgba(253, 108, 108)",
                  "rgba(70, 165, 255)",
                  "rgba(250, 207, 81)",
                ],
                borderRadius: 5,
              },
              {
                label: "Count",
                data: taskStats?.map((task) => task.count),
                backgroundColor: [
                  "rgba(132, 234, 91)",
                  "rgba(162, 162, 162)",
                  "rgba(253, 108, 108)",
                  "rgba(70, 165, 255)",
                  "rgba(250, 207, 81)",
                ],
                borderRadius: 5,
              },
            ],
          }}
        />
      </div>
      <div className="lg:w-[35%]">
        <div className="bg-white rounded-lg shadow-xl p-4 mx-auto">
          <Doughnut
            className=""
            data={{
              labels: taskStats?.map((task) => task._id),
              datasets: [
                {
                  label: "Counts",
                  data: taskStats?.map((task) => task.count),
                  backgroundColor: [
                    "rgba(132, 234, 91)",
                    "rgba(162, 162, 162)",
                    "rgba(253, 108, 108)",
                    "rgba(70, 165, 255)",
                    "rgba(250, 207, 81)",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Charts;
