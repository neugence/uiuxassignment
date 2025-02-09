import { Timer, User } from "lucide-react";
import {
  useDeleteTaskMutation,
  useGetUserQueryQuery,
} from "../redux/baseApi/baseApi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Search from "./Search";
import Filter from "./Filter";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const ManageTasks = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [tasksFilter, setTasksFilter] = useState([]);
  // const { data: tasks, error } = useGetUserQueryQuery(user?.email);
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access-token");
        const response = await axios.get(
          `http://localhost:5000/task-search-filter?status=${status}&title=${search}&email=${user?.email}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setTasksFilter(response.data.tasks);
        setData(response.data.result);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [status, search, user?.email]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value);
    e.target.search.value = "";
  };
  const handleReset = () => {
    setTasksFilter("");
    setData("");
    window.location.reload();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9c0caa",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteTask(id);
        if (res?.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "The Task has been removed.",
            icon: "success",
          });
        }
      }
    });
  };

  if (loading)
    return (
      <div className="text-center py-72">
        <Loading></Loading>
      </div>
    );

  return (
    <div className=" p-4 pb-10">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
        Manage Tasks
      </h2>
      <div className="pb-5 flex flex-wrap items-center justify-between gap-4">
        <Search handleSearch={handleSearch} />
        <Filter
          tasksFilter={tasksFilter}
          setStatus={setStatus}
          handleReset={handleReset}
        />
      </div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4">
          {data?.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No tasks available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-purple-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left ">Title</th>
                    <th className="py-3 px-4 text-left ">Assigned To</th>
                    <th className="py-3 px-4 text-left ">Status</th>
                    <th className="py-3 px-4 text-left ">Start Date</th>
                    <th className="py-3 px-4 text-left">End Date</th>
                    <th className="py-3 px-4 text-left ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((task, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-400 hover:bg-purple-50 transition-all"
                    >
                      <td className="py-4 px-4 font-medium">{task.title}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 items-center">
                          <User className="text-purple-600" />
                          {task.assignTo}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-lg capitalize ${
                            task.status === "general"
                              ? "bg-gray-500 text-white"
                              : task.status === "backlog"
                              ? "bg-blue-500 text-white"
                              : task.status === "in-progress"
                              ? "bg-yellow-500 text-white"
                              : task.status === "paused"
                              ? "bg-red-500 text-white"
                              : task.status === "ready-to-launch"
                              ? "bg-green-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 items-center">
                          <Timer className="text-purple-600" />
                          {task.start_date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 items-center">
                          <Timer className="text-purple-600" />
                          {task.end_date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/dashboard/manage-tasks/edit-task/${task._id}`}
                            className="border-2 border-purple-600 text-black font-semibold px-2 py-1 md:px-3 md:py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-sm md:text-base cursor-pointer"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="bg-rose-600 text-white font-semibold px-2 py-1 md:px-3 md:py-2 rounded-md hover:bg-rose-500 ease-in-out transition-all duration-300 text-sm md:text-base cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
