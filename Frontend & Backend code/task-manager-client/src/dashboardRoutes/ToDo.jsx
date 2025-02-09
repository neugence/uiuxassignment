import { useState } from "react";
import BackLog from "../todolist/BackLog";
import GeneralInfo from "../todolist/GeneralInfo";
import InProgress from "../todolist/InProgress";
import Paused from "../todolist/Paused";
import ReadyToLaunch from "../todolist/ReadyToLaunch";
import TodoModal from "../todolist/todolistModal/TodoModal";
import { useUpdateStatusMutation } from "../redux/baseApi/baseApi";
import Marquee from "react-fast-marquee";

const ToDo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [updateStatus] = useUpdateStatusMutation();
  const openModal = async (status) => {
    setModalStatus(status);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const onDrop = async (status) => {
    console.log(activeCard, status);
    if (activeCard === null || activeCard === undefined) {
      return;
    }
    const id = activeCard;
    const statusData = {
      status: status,
    };
    const res = await updateStatus({ id, ...statusData });
    console.log(res);
  };

  return (
    <div className="px-2 pt-2 pb-12">
      <Marquee>
        <p className="text-red-600 font-medium">Drag & drop the task cards at top of the other status cards to update the status ---- Or you can update the status by clicking the arrow buttons</p>
      </Marquee>
      <div className="flex flex-col md:flex-wrap lg:flex-row gap-2 w-full pt-1">
        <div className="flex-1">
          <GeneralInfo
            openModal={openModal}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </div>
        <div className="flex-1">
          <BackLog
            openModal={openModal}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </div>
        <div className="flex-1">
          <InProgress
            openModal={openModal}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </div>
        <div className="flex-1">
          <Paused
            openModal={openModal}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </div>
        <div className="flex-1">
          <ReadyToLaunch
            openModal={openModal}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </div>
        {/* Modal */}
        <TodoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalStatus={modalStatus}
        />
      </div>
    </div>
  );
};

export default ToDo;
