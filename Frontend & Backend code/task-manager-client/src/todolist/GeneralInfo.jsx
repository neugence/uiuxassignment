import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { CopyPlus } from "lucide-react";
import ToDoCard from "./todolistCard/ToDoCard";
import { useGetTasksQuery, useGetUserQueryQuery } from "../redux/baseApi/baseApi";
import DropArea from "./todolistCard/DropArea";
import useAuth from "../hooks/useAuth";

const GeneralInfo = ({ openModal, setActiveCard, onDrop }) => {
  const {user} = useAuth()
  const { data, isLoading } = useGetUserQueryQuery(user?.email);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // if (isLoading) return <p>loading.......</p>;

  const general = data?.filter((item) => item.status === "general") || [];
  const pageCount = Math.ceil(general?.length / itemsPerPage);

  const currentItems = general?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <h1 className="text-xl pb-2 text-purple-700 font-semibold">
        General Information
      </h1>
      <div
        onClick={() => openModal("general")}
        className="bg-slate-400 text-black p-4 mb- cursor-pointer hover:scale-105 rounded-lg duration-300 transition-all ease-in-out"
      >
        <button className="flex items-center gap-2 cursor-pointer font-semibold">
          <CopyPlus />
          Add General Info
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

export default GeneralInfo;
