import React, { useContext, useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardActions,
  CardImage,
} from "@progress/kendo-react-layout";
import { CREATE_POST, DELETE_POST, EDIT_POST } from "../../graphql/mutations";
import { GET_ALL_POST, GET_MY_POST } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import MyNavbar from "../home/MyNavbar";
import "./post.css"
import { ThemeContext } from "../darkmode/ThemeContext";

const MyPost = (props) => {
  const { darkmode } = useContext(ThemeContext)

  // State define : model open-close FOR CREATE
  const [visible, setVisible] = useState(false);

  // State define : model open-close FOR EDIT
  const [visibleEdit, setVisibleEdit] = useState(false);

  // State define : userInput FOR CREATE
  const [userInput, setUserInput] = useState({});

  // State define : userInput FOR EDIT
  const [userInputEdit, setUserInputEdit] = useState({});

  // State handle : model open-close FOR CREATE
  const toggleDialog = () => {
    setVisible(!visible);
  };

  // State handle : model open-close FOR EDIT
  const toggleDialogEdit = () => {
    setVisibleEdit(!visibleEdit);
  };

  // State handle - FOR CREATE : set value to state on input feild change
  const onInputFeildChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "file") {
      const fileValue = e.target.files[0];
      setUserInput({
        ...userInput,
        [name]: fileValue,
      });
    } else {
      setUserInput({
        ...userInput,
        [name]: value,
      })
    }
  };

  //State handle - FOR EDIT : set value to state on input feild change
  const onInputFeildChangeEdit = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "file") {
      const fileValue = e.target.files[0];
      setUserInputEdit({
        ...userInputEdit,
        [name]: fileValue,
      });
    } else {
      setUserInputEdit({
        ...userInputEdit,
        [name]: value,
      })
    }
  };

  const { loading, error, data } = useQuery(GET_MY_POST, GET_ALL_POST);

  // GRAPHQL: createPost
  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: (e) => {
      console.log(e.createPost.message);
      toast.success(e.createPost.message)
    },
    refetchQueries: [{ query: GET_MY_POST }, { query: GET_ALL_POST }]
  });

  // GRAPHQL: updatePost
  const [updatePost] = useMutation(EDIT_POST, {
    onCompleted: (e) => {
      console.log(e.updatePost.message);
      toast.success(e.updatePost.message)
    },
    refetchQueries: [{ query: GET_MY_POST }, { query: GET_ALL_POST }]
  })

  // GRAPHQL: deletePost
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: (e) => {
      console.log(e.deletePost.message);
      toast.success(e.deletePost.message)
    },
    refetchQueries: [{ query: GET_MY_POST }, { query: GET_ALL_POST }]
  });

  if (loading) {
    return <h1>Loading Please Wait....</h1>
  }
  if (error) {
    console.log(error)
  }

  // set postid to graphqlfor delete api
  const handleDelete = (id) => {
    console.log(id)
    deletePost({
      variables: {
        postId: id
      }
    })
  }

  //FOR EDIT open edit form model
  const handleEdit = (value) => {
    console.log(value)
    setVisibleEdit(!visibleEdit)
    setUserInputEdit(value)
  }

  //FOR EDIT set value of edit post for graphql api
  const handleOnEdit = (e) => {
    e.preventDefault();
    console.log(userInputEdit);
    setVisibleEdit(!visibleEdit)
    updatePost({
      variables: {
        file: userInputEdit.file,
        title: userInputEdit.title,
        description: userInputEdit.description,
        postId: userInputEdit.post_id
      }
    })
  }

  // FOR CREATE set value of edit post for graphql api
  const handleOnSubmit = (e) => {
    e.preventDefault();
    // console.log(e);
    setVisible(!visible);
    console.log(userInput);
    createPost({
      variables: {
        file: userInput.file,
        title: userInput.title,
        description: userInput.description,
      },
    });
  };


  return (
   
        <>
      <MyNavbar />
      <div className={`myContainer ${darkmode && "myDarkContainer"}`}>
      <h1 className={`${darkmode && "darkHeading"}`}>My Post</h1>
        <Button
          className="add_user_btn"
          themeColor={"primary"}
          name="user"
          onClick={toggleDialog}
          icon="image"
        >
          Add
        </Button>
 
        {/* diaplay posts card */}
        <div className={` row row-cols-1 row-cols-md-4  ${darkmode && "darkcardContainer"}`}>
          {data.getMyPost.data && data.getMyPost.data.map((value, index) => {
            return (
              <React.Fragment key={index}>
                <div className="mycard">
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
                      <CardActions className="btnContainer">
                        <Button icon="edit" className="editBtn" onClick={() => handleEdit(value)} />
                        <Button icon="delete" className="deleteBtn" onClick={() => handleDelete(value.post_id)} />
                      </CardActions>
                    </CardBody>
                  </Card>
                </div>
              </React.Fragment>
            )
          })}
        </div>

        {/* ------------------------ Create : model ------------------------------ */}
        {visible && (
          <Dialog title={"Upload Post"} width={300} onClose={toggleDialog}>
            <div>
              <form className="fromContainer" onSubmit={handleOnSubmit}>
                <input
                  type="file"
                  placeholder="Upload Img"
                  id="file"
                  required
                  name="file"
                  accept="image/*"
                  onChange={onInputFeildChange}
                // value={userInput.file}
                />
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  id="title"
                  required
                  onChange={onInputFeildChange}
                  value={userInput.title}
                />
                <textarea
                  className="textarea"
                  type="textarea"
                  placeholder="Description"
                  name="description"
                  id="description"
                  required
                  onChange={onInputFeildChange}
                  value={userInput.description}
                />
                <button
                  variant="contained"
                  color="success"
                  type="submit"
                  className="success_btn"
                >
                  Upload
                </button>
              </form>
            </div>
          </Dialog>
        )}

        {/* ------------------------ Edit : model ------------------------------ */}
        {visibleEdit && (
          <Dialog title={"Edit Post"} width={300} onClose={toggleDialogEdit}>
            <div>
              <form className="fromContainer" onSubmit={handleOnEdit}>
                <input
                  type="file"
                  placeholder="Upload Img"
                  id="file"
                  required
                  name="file"
                  accept="image/*"
                  onChange={onInputFeildChangeEdit}
                // defaultValue={userInput.file}
                // value={userInput.file}

                />
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  id="title"
                  required
                  onChange={onInputFeildChangeEdit}
                  // value={userInput.title}
                  defaultValue={userInputEdit.title}
                />
                <textarea
                  className="textarea"
                  type="textarea"
                  placeholder="Description"
                  name="description"
                  id="description"
                  required
                  onChange={onInputFeildChangeEdit}
                  // value={userInput.description}
                  defaultValue={userInputEdit.description}
                />
                <button
                  variant="contained"
                  color="success"
                  type="submit"
                  className="success_btn"
                >
                  Upload
                </button>
              </form>
            </div>
          </Dialog>)}
      </div>
    </>
  )
};

export default MyPost;
