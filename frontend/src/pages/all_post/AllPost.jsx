import React, { useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { GET_ALL_POST } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody, 
  CardImage,
} from "@progress/kendo-react-layout";
import "./post.css"
import { ThemeContext } from "../darkmode/ThemeContext";

const AllPost = () => {
  const { darkmode } = useContext(ThemeContext)
  const navigate = useNavigate();
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");
    if (!token || token === null) {
      navigate("/");
    }
  });


  const { loading, data } = useQuery(GET_ALL_POST,
    // refetchQueries : ``
    );
  if(loading) { return <h1>Loading.....</h1>}
  
  return (
    <>
      <div className={`row row-cols-1 row-cols-md-3 cardContainer ${darkmode && "darkcardContainer"}`}>
          {data.getAllPosts.data && data.getAllPosts.data.map((value, index) => {
            return (
              <React.Fragment key={index}>
                <Card style={{ width: "300px", margin: "10px", padding: "0" }}>
                  <CardImage
                    style={{ maxHeight: "150px" }}
                    src={`http://localhost:4000/${value.image}`}
                  />
                  <CardHeader>
                    <CardTitle style={{ fontSize: "25px" }}><b>{value.title}</b></CardTitle>
                  </CardHeader>
                  <CardBody style={{ padding: "10px" }}>
                    <details>
                      <summary>Read Description</summary>
                      <textarea className="description" value={value.description} readOnly>
                        {value.description}
                      </textarea>
                    </details>
                   
                  </CardBody>
                </Card>
              </React.Fragment>
            )
          })}
        </div>
    </>
  );
};

export default AllPost;
