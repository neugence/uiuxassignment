import { AlarmClockCheck, CopyPlus } from "lucide-react";
import ToDoCard from "./todolistCard/ToDoCard";
import {
  useGetTasksQuery,
  useGetUserQueryQuery,
} from "../redux/baseApi/baseApi";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import DropArea from "./todolistCard/DropArea";
import React from "react";
import useAuth from "../hooks/useAuth";

const BackLog = ({ openModal, setActiveCard, onDrop }) => {
  const { user } = useAuth();
  const { data, isLoading } = useGetUserQueryQuery(user?.email);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsByPage = 5;

  // if (isLoading) {
  //   return <p>loading.......</p>;
  // }
  const backlog = data?.filter((item) => item.status === "backlog");
  const pageCount = Math.ceil(backlog?.length / itemsByPage);

  const currentItems = backlog?.slice(
    currentPage * itemsByPage,
    (currentPage + 1) * itemsByPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <h1 className="text-xl pb-2 text-purple-700 font-semibold">
        BackLog Information
      </h1>
      <div
        onClick={() => openModal("backlog")}
        className="bg-blue-500 p-4 mb- cursor-pointer hover:scale-105 rounded-lg duration-300 transition-all ease-in-out text-white"
      >
        <button className="flex items-center gap-2 cursor-pointer font-semibold">
          <AlarmClockCheck />
          Add BackLog Info
        </button>
      </div>

      <div className="space-y-">
        {currentItems?.length > 0 ? (
          currentItems?.map((item, index) => (
            <React.Fragment key={index}>
              <DropArea
                item={item}
                onDrop={() => onDrop(item.status, index + 1)}
              />
              <ToDoCard
                item={item}
                index={index}
                key={item._id}
                setActiveCard={setActiveCard}
              />
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-500 text-center pt-20">No tasks available</p>
        )}
      </div>
      {pageCount > 1 && (
        <div className="mt-4 flex justify-center">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            onPageChange={handlePageClick}
            pageCount={pageCount}
            containerClassName="flex gap-4"
            previousClassName="text-purple-600 font-semibold rounded text-lg transition cursor-pointer hover:underline underline-offset-4 "
            nextClassName="rounded transition text-lg text-purple-600 font-semibold cursor-pointer hover:underline underline-offset-4"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakClassName="hidden"
            pageClassName="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default BackLog;
