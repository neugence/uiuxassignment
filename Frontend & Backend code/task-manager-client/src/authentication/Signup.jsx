import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Googlelogin from "./Googlelogin";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import { useAddUserMutation } from "../redux/baseApi/baseApi";

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_url = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Signup = () => {
  const [addUser] = useAddUserMutation();
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const imageFile = { image: data?.profilePicture[0] };
    const responseImage = await axios.post(image_hosting_url, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    const imageUrl = await responseImage?.data?.data?.display_url;
    await createUser(data.email, data.password).then(async (res) => {
      await updateProfile(res.user, {
        displayName: data.name,
        photoURL: imageUrl,
      });
    });
    const userInfo = {
      name: data.name,
      email: data.email,
      imageURL: imageUrl,
    };
    const res = await addUser(userInfo);
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
      await navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 pt-20 lg:pt-10">
      <div className="bg-purple-200 p-8 rounded-lg shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Picture Upload */}
          <div className="flex flex-col md:flex-row w-full gap-3 md:gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  {...register("profilePicture", {
                    required: "Profile picture is required",
                  })}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {errors.profilePicture && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePicture.message}
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  className={`w-full mt-1 px-4 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1">
              {/* Email Input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full mt-1 px-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full mt-1 px-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="border-2 border-purple-700 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-xl cursor-pointer w-full font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
        <div className="md:w-72 mx-auto">
          <Googlelogin></Googlelogin>
        </div>
      </div>
    </div>
  );
};

export default Signup;
