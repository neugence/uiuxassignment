/* eslint-disable react/prop-types */
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  BetweenHorizonalEnd,
  BetweenHorizonalStart,
  Handshake,
} from "lucide-react";
import {
  useUpdateBackStatusButtonMutation,
  useUpdateStatusButtonMutation,
} from "../../redux/baseApi/baseApi";
import { Bounce, toast } from "react-toastify";

const ToDoCard = ({ item, setActiveCard, index }) => {
  const { title, status, assignTo, start_date, end_date, _id } = item;
  const [updateStatusButton] = useUpdateStatusButtonMutation();
  const [updateBackStatusButton] = useUpdateBackStatusButtonMutation();

  const handleUpdateStatus = async (item) => {
    console.log(item);
    let updateStatus;

    if (item?.status === "general") {
      updateStatus = "backlog";
    } else if (item?.status === "backlog") {
      updateStatus = "in-progress";
    } else if (item?.status === "in-progress") {
      updateStatus = "paused";
    } else if (item?.status === "paused") {
      updateStatus = "ready-to-launch";
    } else {
      updateStatus = "";
    }
    console.log(updateStatus);
    const res = await updateStatusButton({ id: item?._id, updateStatus });
    if (res?.data.modifiedCount > 0) {
      toast("✔️ The Task status is updated", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleUpdateBackStatus = async (item) => {
    console.log(item);
    let updateBackStatus;

    if (item?.status === "backlog") {
      updateBackStatus = "general";
    } else if (item?.status === "in-progress") {
      updateBackStatus = "backlog";
    } else if (item?.status === "paused") {
      updateBackStatus = "in-progress";
    } else if (item?.status === "ready-to-launch") {
      updateBackStatus = "paused";
    } else {
      updateBackStatus = "";
    }
    const res = await updateBackStatusButton({
      id: item?._id,
      updateBackStatus,
    });
    if (res?.data.modifiedCount > 0) {
      toast("✔️ The Task status is updated", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <article
      className="task_card border-gray-300 shadow-lg p-4 bg-white flex flex-col gap-4"
      draggable
      onDragStart={() => setActiveCard(_id)}
      onDragEnd={() => setActiveCard(null)}
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-end">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-lg capitalize ${
            status === "general"
              ? "bg-gray-500 text-white"
              : status === "backlog"
              ? "bg-blue-500 text-white"
              : status === "in-progress"
              ? "bg-yellow-500 text-black"
              : status === "paused"
              ? "bg-red-500 text-white"
              : status === "ready-to-launch"
              ? "bg-green-500 text-black"
              : "bg-gray-400 text-white"
          }`}
        >
          {status}
        </span>
      </p>
      <div className="text-sm text-gray-600 flex flex-col gap-2">
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <Handshake className="text-purple-600" /> Assigned to:
          </span>{" "}
          {assignTo}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <BetweenHorizonalStart /> Start Date:
          </span>{" "}
          {start_date}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <BetweenHorizonalEnd /> End Date:
          </span>{" "}
          {end_date}
        </p>
        <div
          className={`${
            status === "general"
              ? "flex justify-end items-center"
              : "flex justify-between items-center"
          }`}
        >
          {status === "backlog" ||
          status === "in-progress" ||
          status === "paused" ||
          status === "ready-to-launch" ? (
            <button
              onClick={() => handleUpdateBackStatus(item)}
              className={`px-2 py-1 text-xs font-medium rounded-lg cursor-pointer capitalize ${
                status === "general"
                  ? "bg-gray-500 text-white"
                  : status === "backlog"
                  ? "bg-gray-500 text-white"
                  : status === "in-progress"
                  ? "bg-blue-500 text-white"
                  : status === "paused"
                  ? "bg-yellow-500 text-black"
                  : status === "ready-to-launch"
                  ? "bg-red-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              <ArrowBigLeftDash />
            </button>
          ) : (
            ""
          )}
          {status === "general" ||
          status === "backlog" ||
          status === "in-progress" ||
          status === "paused" ? (
            <button
              onClick={() => handleUpdateStatus(item)}
              className={`px-2 py-1 text-xs font-medium rounded-lg cursor-pointer capitalize ${
                status === "general"
                  ? "bg-blue-500 text-white"
                  : status === "backlog"
                  ? "bg-yellow-500 text-black"
                  : status === "in-progress"
                  ? "bg-red-500 text-white"
                  : status === "paused"
                  ? "bg-green-500 text-black"
                  : status === "ready-to-launch"
                  ? "bg-green-500 text-black"
                  : "bg-gray-400 text-white"
              }`}
            >
              <ArrowBigRightDash />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </article>
  );
};

export default ToDoCard;
