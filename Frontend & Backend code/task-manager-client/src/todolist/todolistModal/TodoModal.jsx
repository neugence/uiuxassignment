import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAddTaskMutation } from "../../redux/baseApi/baseApi";
import { Bounce, toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const TodoModal = ({ isOpen, onClose, modalStatus }) => {
  const modalRef = useRef(null);
  const [addTask] = useAddTaskMutation();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      assignTo: "",
      status: modalStatus || "general",
      start_date: "",
      end_date: "",
    },
  });
  const onSubmit = async (data) => {
    const task = {
      userEmail: user?.email,
      title: data.title,
      assignTo: data.assignTo,
      status: data?.status,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    const res = await addTask(task);
    if (res?.data.insertedId) {
      toast("✔️ You are Signed Upped", {
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
    }
    reset();
    onClose();
  };

  useEffect(() => {
    // Update the form with modalStatus whenever it changes
    if (modalStatus) {
      setValue("status", modalStatus);
    }
  }, [modalStatus, setValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 shadow-2xl">
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-lg max-w-lg relative shadow-lg"
      >
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add New Task
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-purple-700"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task title"
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 mt-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Assign To Input */}
          <div className="flex gap-3">
            <div>
              <label
                htmlFor="assignTo"
                className="block text-lg font-medium text-purple-700"
              >
                Assigned To
              </label>
              <input
                type="text"
                id="assignTo"
                name="assignTo"
                placeholder="Enter assignee's name"
                {...register("assignTo", { required: "Assignee is required" })}
                className="w-full p-3 mt-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.assignTo && (
                <p className="text-red-500 text-sm">
                  {errors.assignTo.message}
                </p>
              )}
            </div>

            {/* Status (with default status) */}
            <div>
              <label
                htmlFor="status"
                className="block text-lg font-medium text-purple-700"
              >
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                defaultValue={modalStatus}
                {...register("status")}
                readOnly
                className="w-full p-3 mt-2 bg-purple-100 text-purple-600 border border-purple-300 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>
          {/* Start Date Input */}
          <div className="flex gap-3">
            <div className="w-full">
              <label
                htmlFor="start_date"
                className="block text-lg font-medium text-purple-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                {...register("start_date")}
                className="w-full p-3 mt-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* End Date Input */}
            <div className="w-full">
              <label
                htmlFor="end_date"
                className="block text-lg font-medium text-purple-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                {...register("end_date")}
                className="w-full p-3 mt-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg focus:outline-none hover:bg-purple-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg focus:outline-none hover:bg-purple-700 cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
