import React, { useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import ThemeBtn from "../darkmode/ThemeBtn";
import { ThemeContext } from "../darkmode/ThemeContext";

let kendokaAvatar =
  "https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png";

const MyNavbar = () => {
  const {darkmode} = useContext(ThemeContext)
  console.log(":app", darkmode)
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("access_token");
  useEffect(() => {
    if (!token || token === null) {
      navigate("/");
    }
  });

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/userAuth/logout", { withCredentials: true })
      .then((e) => {
        if (e.statusText === "OK") {
          navigate("/");
          return toast.success(e.data.message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    console.log("User Logout");
  };
  return (
    <>
      <div className={`myNavbar ${darkmode && "myDarkNavbar"}`}>
        <AppBar positionMode="sticky">
          <AppBarSection>
            <Link className="myLink" to="/home/allpost">
              <h3>Myproject</h3>
            </Link>
          </AppBarSection>
          <AppBarSpacer />

          <AppBarSection>
            <ThemeBtn />
          </AppBarSection>

          <AppBarSection>
            <Button
              icon="undo"
              themeColor={"primary"}
              fillMode="flat"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </AppBarSection>

          <AppBarSection>
            <span className="k-appbar-separator" />
          </AppBarSection>

          <AppBarSection>
            <Button
              themeColor={"success"}
              fillMode="flat"
              onClick={() => {
                navigate("/mypost");
              }}
            >
              My Post
            </Button>
          </AppBarSection>

          <AppBarSection>
            <Avatar type="image">
              <img src={kendokaAvatar} alt="User" />
            </Avatar>
          </AppBarSection>
        </AppBar>
      </div>
    </>
  );
};

export default MyNavbar;
