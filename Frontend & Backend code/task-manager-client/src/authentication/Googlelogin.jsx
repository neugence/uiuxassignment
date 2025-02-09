import { FcGoogle } from "react-icons/fc";
import useAuth from "../hooks/useAuth";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAddUserMutation } from "../redux/baseApi/baseApi";

const Googlelogin = () => {
  const [addUser] = useAddUserMutation();
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    await googleLogin().then(async (res) => {
      if (res?.user.email) {
        toast("✔️ You are Signed up Successfully", {
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
        await navigate("/");
        window.location.reload();
      }
      const userInfo = {
        name: res?.user.displayName,
        email: res?.user.email,
        imageURL: res?.user.photoURL,
      };
      await addUser(userInfo);
    });
  };

  return (
    <div className="pt-5">
      <button
        onClick={handleGoogle}
        className="border-2 border-purple-700 text-purple-700 px-1 md:px-4 py-1 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 md:text-xl cursor-pointer w-full font-semibold flex items-center gap-3 justify-center"
      >
        <FcGoogle />
        <span className="">Log In With Google</span>
      </button>
    </div>
  );
};

export default Googlelogin;
