import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { MdTravelExplore } from "react-icons/md";
import {
  FilePenLine,
  FolderKanban,
  Grip,
  Handshake,
  Key,
  Laugh,
  Pencil,
  PlusSquareIcon,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Banner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExplore = async () => {
    if (!user) {
      Swal.fire({
        title: "You are not logged In",
        text: "Please Login first to explore the Task Manager",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#9c0caa",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Login!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate("/dashboard/overview");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  return (
    <div className="h-full overflow-x-hidden">
      <div className="relative">
        <div className="px-4 text-center text-black relative z-40">
          <div className="pt-24 md:pt-44">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
              Organize Your Tasks Effortlessly
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 animate-fade-in-up">
              Stay productive and manage your tasks with ease. Prioritize,
              track, and achieve your goals efficiently.
            </p>
            <button
              onClick={handleExplore}
              className="flex items-center gap-3 border-2 border-purple-600 text-white font-semibold px-4 py-3 bg-purple-600 rounded-md hover:bg-purple-400 hover:text-black ease-in-out transition-all duration-300 text-base cursor-pointer w-full md:w-64 justify-center mx-auto"
            >
              <MdTravelExplore className="text-2xl" /> Start Managing Tasks
            </button>
          </div>
        </div>

        {/* First Backdrop - Left-Top */}
        <div className="w-[590px] h-[400px] bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 opacity-50 blur-[100px] absolute top-0 left- z-30 md:block hidden"></div>

        {/* Middle Backdrop - Middle-Bottom */}
        <div className="w-[590px] h-[400px] bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 opacity-60 blur-[100px] absolute top-60 left-1/2 transform -translate-x-1/2 z-30"></div>

        {/* Last Backdrop - Right-Top */}
        <div className="w-[590px] h-[400px] bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 opacity-50 blur-[100px] absolute top-0 right-0 z-30 md:block hidden"></div>

        <div className="pb-10 block lg:hidden px-5">
          <div className="text-center pt-16 pb-8 px-5">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              About Task Manager
            </h2>
            <p className="text-lg sm:text-xl text-black">
              A simple and efficient task management tool to organize your work.
            </p>
          </div>
          <p className="leading-relaxed text-black">
            Task Manager is designed to help you stay organized and boost your
            productivity. With a clean and intuitive interface, you can create,
            update, and track your tasks with ease. Whether you're working on a
            project, managing daily to-dos, or collaborating with your team,
            this app makes task management efficient and hassle-free.
          </p>
          <p className="leading-relaxed text-black">
            With the Task Manager, you can easily categorize your tasks, set
            deadlines, and mark them as complete. The app ensures that you never
            miss an important deadline or task by sending timely notifications
            for upcoming tasks.
          </p>
          <p className="leading-relaxed text-black">
            It also features a secure authentication system, allowing you to
            access your tasks from any device after logging in. Whether you're a
            solo worker or part of a team, Task Manager adapts to your needs,
            giving you full control over your workflow.
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-col md:flex-row justify-center max-w-[1400px] mx-auto gap-6 md:gap-4 mt-16 md:mt-20 font-bold px-5 lg:px-0 ">
            <div
              className="bg-gradient-to-r from-zinc-500 via-zinc-500 to-zinc-500 text-center text-white opacity- p-5 border-white border-2 rounded-lg text-2xl"
              data-aos="fade-down-right"
            >
              <h1 className="flex items-center gap-2 pb-3">
                <Key size={30} /> Login First
              </h1>
              <p className="flex items-center gap-2">
                <UserRoundCheck size={30} />
                Be A User
              </p>
            </div>
            <div
              className="bg-gradient-to-r from-zinc-500 via-zinc-500 to-zinc-500 text-center text-white opacity- p-5 border-white border-2 rounded-lg text-2xl"
              data-aos="fade-right"
            >
              <h1 className="flex items-center gap-2 pb-3">
                <PlusSquareIcon size={30} /> Add Task
              </h1>
              <p className="flex items-center gap-2">
                <Handshake size={30} /> Assist Tasks
              </p>
            </div>
            <div
              className="bg-gradient-to-r from-zinc-500 via-zinc-500 to-zinc-500 text-center text-white opacity- p-5 border-white border-2 rounded-lg text-2xl"
              data-aos="fade-up"
            >
              <h1 className="flex items-center gap-2 pb-3">
                <Pencil size={30} /> Update Task
              </h1>
              <p className="flex items-center gap-2">
                <Grip size={30} /> Drag & Drop
              </p>
            </div>
            <div
              className="bg-gradient-to-r from-zinc-500 via-zinc-500 to-zinc-500 text-center text-white opacity- p-5 border-white border-2 rounded-lg text-2xl"
              data-aos="fade-left"
            >
              <h1 className="flex items-center gap-2 pb-3">
                <FolderKanban size={30} /> Manage Tasks
              </h1>
              <p className="flex items-center gap-2">
                <FilePenLine size={30} /> Edit & Remove
              </p>
            </div>
            <div
              className="bg-gradient-to-r from-zinc-500 via-zinc-500 to-zinc-500 text-center text-white opacity- p-5 border-white border-2 rounded-lg text-2xl"
              data-aos="fade-down-left"
            >
              <h1 className="flex items-center gap-2 pb-3">
                <Target size={30} /> See Overview
              </h1>
              <p className="flex items-center gap-2">
                <Laugh size={30} /> Thank You!!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
