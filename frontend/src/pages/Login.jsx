/** @format */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authServices";

function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (login.email === "" || login.password === "") {
      alert("Please fill all the fields");
      return;
    }

    try {
      const data = await loginRequest({
        email: login.email,
        password: login.password,
      });

      const user = data.user;
      alert("Login Successful");

      // Guests sent here by the auth guard go back to where they were headed
      if (redirectTo && user.role !== "admin") {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (user.role === "admin") {
        navigate("/admindashboard");
      } else if (user.role === "user") {
        navigate("/userdashboard");
      } else {
        alert("Invalid role");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Email:</label>

            <input
              type="email"
              value={login.email}
              onChange={(e) =>
                setLogin({
                  ...login,
                  email: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Password:
            </label>

            <input
              type="password"
              value={login.password}
              onChange={(e) =>
                setLogin({
                  ...login,
                  password: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}

                
              
              className="text-blue-500 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;
