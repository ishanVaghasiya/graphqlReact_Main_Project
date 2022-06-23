import React, { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Login = () => {
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");
    if (token && token !== null) {
      navigate("/allpost");
    }
  });

  const navigate = useNavigate();
  // state define : take user login data
  const [userInput, setUserInput] = useState({
    emailId: "",
    password: "",
  });
  const onInputFeildChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  // Api call for user validation
  const validUser = async () =>
    await axios
      .post("http://localhost:4000/userAuth/login", userInput, {
        withCredentials: true,
      })
      .then((e) => {
        if (e.statusText === "Accepted") {
          if (e.data.status === false) return toast.error(e.data.message);
        }
        if (e.statusText === "OK") {
          if (e.data.status === true) {
            return (
              toast.success(e.data.message),
              navigate("/home/allpost"),
              window.location.reload(true)
            );
          } else return toast.error(e.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    validUser();
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              {/* side Image */}
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample"
              />
            </div>

            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 mx-5 loginFormContainer">
              <p className="loginFormHeading">Login</p>
              <form className="loginForm" onSubmit={handleOnSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  name="emailId"
                  id="emailId"
                  required
                  onChange={onInputFeildChange}
                />
                <input
                  type="password"
                  placeholder="password"
                  name="password"
                  id="password"
                  required
                  onChange={onInputFeildChange}
                />
                <button
                  variant="contained"
                  color="success"
                  type="submit"
                  className="success_btn"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
