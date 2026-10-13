import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../services/authServices";

function Register() {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      register.name === "" ||
      register.email === "" ||
      register.password === "" ||
      register.confirmPassword === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (register.password.length < 8) {
      alert("Password should be at least 8 characters");
      return;
    }

    if (register.password !== register.confirmPassword) {
      alert("Password and confirm password should be same");
      return;
    }

    try {
      const data = await registerRequest({
        name: register.name,
        email: register.email,
        password: register.password,
        confirmPassword: register.confirmPassword,
      });

      console.log(data);

      alert("Registration successful! please check your email for verification code.");

      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.log(error);

      if (error.response) {
        const message = error.response.data.message || "Registration failed";
        if (
          error.response.status === 409 &&
          message.toLowerCase().includes("not verified")
        ) {
          navigate(
            `/verify-email?email=${encodeURIComponent(register.email.trim())}`,
            { state: { notice: message } }
          );
          return;
        }
        alert(message);
      } else {
        alert("Cannot connect to backend");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Name:
            </label>

            <input
              type="text"
              value={register.name}
              onChange={(e) =>
                setRegister({
                  ...register,
                  name: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Email:
            </label>

            <input
              type="email"
              value={register.email}
              onChange={(e) =>
                setRegister({
                  ...register,
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
              value={register.password}
              onChange={(e) =>
                setRegister({
                  ...register,
                  password: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Confirm Password:
            </label>

            <input
              type="password"
              value={register.confirmPassword}
              onChange={(e) =>
                setRegister({
                  ...register,
                  confirmPassword: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;