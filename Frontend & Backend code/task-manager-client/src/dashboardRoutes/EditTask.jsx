import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useEditTaskMutation,
  useFindTaskQuery,
} from "../redux/baseApi/baseApi";
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2";

const EditTask = () => {
  const { id } = useParams();
  const { data: task, isLoading } = useFindTaskQuery(id);
  const [editTask] = useEditTaskMutation();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const task = {
      title: data?.title,
      assignTo: data?.assignTo,
      status: data?.status,
      start_date: data?.start_date,
      end_date: data?.end_date,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#9c0caa",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await editTask({ id, ...task });
          if (res?.data.modifiedCount > 0) {
            toast("✔️ The Task has been updated successfully", {
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
        } catch (error) {
          toast("Failed to update the Task. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="pt-5">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-purple-700 font-medium">Title</label>
            <input
              {...register("title")}
              defaultValue={task?.title}
              className="w-full p-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none hover:border-purple-700 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <label className="block text-purple-700 font-medium">
                Assign To
              </label>
              <input
                {...register("assignTo")}
                defaultValue={task?.assignTo}
                className="w-full p-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none hover:border-purple-700 transition-all"
              />
            </div>
            <div className="w-full">
              <label className="block text-purple-700 font-medium">
                Status
              </label>
              <select
                {...register("status")}
                defaultValue={task?.status}
                className="w-full p-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none hover:border-purple-700 transition-all"
              >
                <option value="general">General</option>
                <option value="backlog">Backlog</option>
                <option value="in-progress">In-Progress</option>
                <option value="paused">Paused</option>
                <option value="ready-to-launch">Ready-to-launch</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <label className="block text-purple-700 font-medium">
                Start Date
              </label>
              <input
                type="date"
                {...register("start_date")}
                defaultValue={task?.start_date}
                className="w-full p-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none hover:border-purple-700 transition-all"
              />
            </div>
            <div className="w-full">
              <label className="block text-purple-700 font-medium">
                End Date
              </label>
              <input
                type="date"
                {...register("end_date")}
                defaultValue={task?.end_date}
                className="w-full p-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none hover:border-purple-700 transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 cursor-pointer"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
