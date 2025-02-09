import { CircleStop, CopyPlus } from "lucide-react";
import ToDoCard from "./todolistCard/ToDoCard";
import { useGetTasksQuery, useGetUserQueryQuery } from "../redux/baseApi/baseApi";
import ReactPaginate from "react-paginate";
import React, { useState } from "react";
import DropArea from "./todolistCard/DropArea";
import useAuth from "../hooks/useAuth";

const Paused = ({ openModal, setActiveCard, onDrop }) => {
  const {user} = useAuth()
  const { data, isLoading } = useGetUserQueryQuery(user?.email);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsByPage = 5;

  // if (isLoading) {
  //   return <p>loading.......</p>;
  // }

  const paused = data?.filter((item) => item.status === "paused");
  const pageCount = Math.ceil(paused?.length / itemsByPage);

  const currentItems = paused?.slice(
    currentPage * itemsByPage,
    (currentPage + 1) * itemsByPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <h1 className="text-xl pb-2 text-purple-700 font-semibold">
        Paused Information
      </h1>
      <div
        onClick={() => openModal("paused")}
        className="bg-red-500 text-white p-4 mb- cursor-pointer hover:scale-105 rounded-lg duration-300 transition-all ease-in-out"
      >
        <button className="flex items-center gap-2 cursor-pointer font-semibold">
          <CircleStop />
          Add paused Info
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
            previousClassName="px-4 py-2 bg-slate-600 text-white font-semibold rounded hover:bg-slate-500 transition cursor-pointer"
            nextClassName="px-3 py-2 rounded bg-purple-500 hover:bg-purple-400 transition text-lg text-white font-semibold cursor-pointer"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakClassName="hidden"
            pageClassName="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default Paused;
