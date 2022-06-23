import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { ThemeContext } from "../darkmode/ThemeContext";



const items = [
  {
    text: "All User",
    icon: "k-i-user",
    route: "/home/alluser",
  },
  {
    text: "All Post",
    icon: "k-i-image",
    route: "/home/allpost",
  },
];
const DrawerContainer = (props) => {
  const navigate = useNavigate();
  const {darkmode} = useContext(ThemeContext)
  const [expanded, setExpanded] = useState(true);

  const onSelect = (e) => {
    navigate(e.itemTarget.props.route);
    setExpanded(!expanded);
  };
  return (
    <>
      {/* Deawer */}
      <div className={`drawerContainer ${darkmode && "darkDrawerContainer"}`}>
        <Drawer
          expanded={expanded}
          position={"start"}
          mode={"push"}
          width={175}
          mini={true}
          items={items.map((item) => ({
            ...item
          }))}
          onSelect={onSelect}
        >
          <DrawerContent className="drawer_content">{props.children}</DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default DrawerContainer;
