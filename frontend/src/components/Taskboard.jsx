import React, { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  addSubTask,
  editTask,
  deleteTask,
  deleteSubTask,
  moveTask,
  editSubTask,
  toggleSubTaskStatus,
} from "../redux/taskSlice";
import { Link } from "react-router";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.items || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editSubTaskId, setEditSubTaskId] = useState(null);
  const [editedSubTaskTitle, setEditedSubTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newSubTaskTitles, setNewSubTaskTitles] = useState({});

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) => {
      const taskMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const subtaskMatch = task.subTasks.some((subtask) =>
        subtask.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return taskMatch || subtaskMatch;
    });
  }, [tasks, searchQuery]);

  const highlightMatch = (text) => {
    if (!searchQuery.trim()) return text;
    const parts = text.toLowerCase().split(searchQuery.toLowerCase());
    const result = [];
    let lastIndex = 0;

    parts.forEach((part, index) => {
      const startIndex = lastIndex;
      const endIndex = startIndex + part.length;
      result.push(text.slice(startIndex, endIndex));

      if (index !== parts.length - 1) {
        const matchStart = endIndex;
        const matchEnd = matchStart + searchQuery.length;
        result.push(
          <span key={index} className="bg-yellow-200">
            {text.slice(matchStart, matchEnd)}
          </span>
        );
      }
      lastIndex = endIndex + searchQuery.length;
    });

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    dispatch(
      moveTask({
        sourceId: source.droppableId,
        destId: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
      })
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "" || selectedStartDate.trim() === "" || selectedEndDate.trim() === "") return;
    dispatch(
      addTask({
        title: newTaskTitle,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      })
    );
    setSelectedStartDate("");
    setSelectedEndDate("");
    setNewTaskTitle("");
  };

  const handleAddSubTask = (taskId) => {
    const subTaskTitle = newSubTaskTitles[taskId] || "";
    if (subTaskTitle.trim() === "") return;
    dispatch(addSubTask({ taskId, subTaskTitle }));
    setNewSubTaskTitles((prev) => ({
      ...prev,
      [taskId]: "",
    }));
  };

  const handleSubTaskInputChange = (taskId, value) => {
    setNewSubTaskTitles((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleEditTask = (taskId) => {
    if (editedTaskTitle.trim() === "") return;
    dispatch(editTask({ taskId, title: editedTaskTitle }));
    setEditTaskId(null);
    setEditedTaskTitle("");
  };

  const handleEditSubTask = (taskId, subTaskId) => {
    if (editedSubTaskTitle.trim() === "") return;
    dispatch(
      editSubTask({
        taskId,
        subTaskId,
        title: editedSubTaskTitle,
      })
    );
    setEditSubTaskId(null);
    setEditingTaskId(null);
    setEditedSubTaskTitle("");
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask({ taskId }));
    const { [taskId]: removed, ...rest } = newSubTaskTitles;
    setNewSubTaskTitles(rest);
  };

  const handleDeleteSubTask = (taskId, subTaskId) => {
    dispatch(deleteSubTask({ taskId, subTaskId }));
  };

  if (!Array.isArray(tasks)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[url(https://cdn.svgator.com/images/2022/06/use-svg-as-background-image-particle-strokes.svg)]">
      <div className="sticky top-0 z-10 backdrop-blur-2xl bg-white/5 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-white">Task Master</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks and subtasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Link 
                to="dashboard"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="py-4 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="New Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Start date</label>
                  <input
                    type="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">End date</label>
                  <input
                    type="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    className="mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddTask}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-6 items-start">
            {filteredTasks.map((task) => (
              <Droppable key={task.id} droppableId={task.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white/15 text-white rounded-2xl shadow-md p-4 w-full sm:w-[350px] flex-grow-0 flex-shrink-0 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      {editTaskId === task.id ? (
                        <div className="flex gap-2 flex-1">
                          <input
                            type="text"
                            value={editedTaskTitle}
                            onChange={(e) => setEditedTaskTitle(e.target.value)}
                            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold break-words max-w-[200px]">
                            {highlightMatch(task.title)}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditTaskId(task.id);
                                setEditedTaskTitle(task.title);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-sm text-gray-300 mb-4">
                      <div>Start: {new Date(task.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(task.endDate).toLocaleDateString()}</div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="New Subtask"
                          value={newSubTaskTitles[task.id] || ""}
                          onChange={(e) => handleSubTaskInputChange(task.id, e.target.value)}
                          className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddSubTask(task.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-2 min-h-[2px]">
                        {task.subTasks?.map((subTask, index) => (
                          <Draggable
                            key={subTask.id}
                            draggableId={subTask.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white/10 rounded p-3"
                              >
                                {editSubTaskId === subTask.id && editingTaskId === task.id ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={editedSubTaskTitle}
                                      onChange={(e) => setEditedSubTaskTitle(e.target.value)}
                                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                      onClick={() => handleEditSubTask(task.id, subTask.id)}
                                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 whitespace-nowrap"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="break-words flex-1 min-w-0">
                                      {highlightMatch(subTask.title)}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <select
                                        value={subTask.status}
                                        onChange={() =>
                                          dispatch(
                                            toggleSubTaskStatus({
                                              taskId: task.id,
                                              subTaskId: subTask.id,
                                            })
                                          )
                                        }
                                        className={`text-sm px-2 py-1 rounded outline-none whitespace-nowrap ${
                                          subTask.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                      </select>
                                      <button
                                        onClick={() => {
                                          setEditSubTaskId(subTask.id);
                                          setEditingTaskId(task.id);
                                          setEditedSubTaskTitle(subTask.title);
                                        }}
                                        className="p-1 text-base rounded-md bg-white hover:bg-black text-blue-600 hover:text-blue-800 whitespace-nowrap"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubTask(task.id, subTask.id)}
                                        className="p-1 text-base rounded-md bg-white hover:bg-black text-red-600 hover:text-red-800 whitespace-nowrap"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;