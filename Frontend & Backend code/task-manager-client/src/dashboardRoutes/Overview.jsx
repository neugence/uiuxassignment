import { useGetTaskStatsQuery } from "../redux/baseApi/baseApi";
import Loading from "../components/Loading";
import { GoFileDirectoryFill } from "react-icons/go";
import { RiStockFill } from "react-icons/ri";
import { HiMiniPlayPause } from "react-icons/hi2";
import { LuLoaderPinwheel } from "react-icons/lu";
import { FaDiagramSuccessor } from "react-icons/fa6";
import Charts from "./Charts";

const Overview = () => {
  const { data: taskStats, isLoading } = useGetTaskStatsQuery();

  if (isLoading) {
    return (
      <div className="text-center py-72">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className=" pb-12">
      <h1 className="text-3xl font-bold text-center text-purple-800 pt-3 pb-4">
        Tasks Overview
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {taskStats?.map((task) => (
            <div
              key={task?._id}
              className="transition-transform hover:-translate-y-2 duration-300 hover:scale-105 cursor-pointer"
            >
              <div
                className={`p-6 w-56 rounded-lg shadow-lg ${
                  task?._id === "general"
                    ? "bg-gradient-to-br from-gray-400 to-gray-400 text-white"
                    : task?._id === "backlog"
                    ? "bg-gradient-to-br from-blue-400 to-blue-400 text-white"
                    : task?._id === "in-progress"
                    ? "bg-gradient-to-br from-amber-400 to-amber-400 text-white"
                    : task?._id === "paused"
                    ? "bg-gradient-to-br from-rose-400 to-rose-400 text-white"
                    : task?._id === "ready-to-launch"
                    ? "bg-gradient-to-br from-green-400 to-green-400 text-white"
                    : "bg-gradient-to-br from-gray-400 to-gray-400 text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold">{task.count} Task</p>
                  {task._id === "general" ? (
                    <p className="bg-slate-500 rounded-xl text-3xl p-2">
                      <GoFileDirectoryFill />
                    </p>
                  ) : task._id === "backlog" ? (
                    <p className="bg-slate-500 rounded-xl text-3xl p-2">
                      {" "}
                      <RiStockFill />
                    </p>
                  ) : task._id === "in-progress" ? (
                    <p className="bg-slate-500 rounded-xl text-3xl p-2">
                      <LuLoaderPinwheel />
                    </p>
                  ) : task._id === "paused" ? (
                    <p className="bg-slate-500 rounded-xl text-3xl p-2">
                      <HiMiniPlayPause />
                    </p>
                  ) : task._id === "ready-to-launch" ? (
                    <p className="bg-slate-500 rounded-xl text-3xl p-2">
                      <FaDiagramSuccessor />
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <h2 className="text-xl font-semibold capitalize">
                  {task._id.replace(/-/g, " ")}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-6">
        <Charts></Charts>
      </div>
    </div>
  );
};

export default Overview;
