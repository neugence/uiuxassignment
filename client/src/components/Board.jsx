import React, { useContext, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import useTaskStore from "../store/taskStore";
import { Ellipsis } from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";
import CardItem from "./CardItem";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
function Board() {
  const { columns, getTasksByColumn, moveTask, reorderTasks } = useTaskStore();
  const { openModal } = useContext(GlobalContext);
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumn = active.data?.current?.sortable?.containerId;
    const overColumn = over.data?.current?.sortable?.containerId;

    if (!activeColumn || !overColumn) return;

    if (activeColumn !== overColumn) {
      moveTask(activeId, overColumn);
    } else {
      const tasks = getTasksByColumn(activeColumn);
      const oldIndex = tasks.findIndex((task) => task.id === activeId);
      const newIndex = tasks.findIndex((task) => task.id === overId);
      reorderTasks(activeColumn, oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen  py-2">
      <div className="max-w-[1800px] mx-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {columns.map((column) => (
              <div
                key={column}
                className="bg-gray-200 rounded-lg shadow-lg  p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg text-black">{column}</h2>
                  {/* starts  */}
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                        <Ellipsis />
                      </MenuButton>
                    </div>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition-all scale-95 opacity-0 focus:scale-100 focus:opacity-100">
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            Oldest
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            Newest
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            Alphabetically
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                  {/* ends */}
                </div>
                <CardItem column={column} tasks={getTasksByColumn(column)} />
                <button
                  className="w-full p-1 mt-2 text-white bg-green-400 rounded-lg hover:bg-green-600"
                  onClick={() => openModal()}
                >
                  {" Add +"}
                  {/* <Plus size={15}></Plus> */}
                </button>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default Board;
