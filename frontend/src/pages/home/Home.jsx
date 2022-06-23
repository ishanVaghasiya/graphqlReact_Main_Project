import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DrawerContainer from "./DrawerContainer ";
import MyNavbar from "./MyNavbar"
import { Route, Routes } from "react-router-dom";
import AllUser from "../all_user/AllUser";
import AllPost from "../all_post/AllPost";
import MyPost from "../all_post/MyPost";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("access_token");
  useEffect(() => {
    if (!token || token === null) {
      navigate("/");
    }
  });

  return (
    <>
      <MyNavbar />
      <DrawerContainer>
        <Routes>
          <Route exact={true} path="/alluser" element={<AllUser />} />
          <Route exact={true} path="/allpost" element={<AllPost />} />
          <Route exact={true} path="/mypost" element={<MyPost />} />
        </Routes>
      </DrawerContainer>
    </>
  );
};

export default Home;
