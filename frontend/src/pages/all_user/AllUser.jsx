import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import "./alluser.css";
import { Dialog } from "@progress/kendo-react-dialogs";
import axios from "axios";
import toast from "react-hot-toast";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GET_ALL_USERS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";


const initialDataState = {
    skip: 0,
    take: 5,
};
const AllUser = (props) => {

    // State define : for table paggeble
    const [page, setPage] = useState(initialDataState);

    // State define : for model open-close FOR ADDUSER
    const [visible, setVisible] = useState(false);

    // State define : for model open-close FOR EDIT
    const [visibleEdit, setVisibleEdit] = useState(false);

    // State handle : for table paggeble
    const pageChange = (event) => {
        setPage(event.page);
    };


    // State define : userInputs FOR ADDUSER
    const [userInput, setUserInput] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
    });

    // State define : userInput FOR EDIT
    const [userInputEdit, setUserInputEdit] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        emailId: "",
    });

    // State handle : model open-close FOR ADDUSER
    const toggleDialog = () => {
        setVisible(!visible);
    };

    const toggleDialogEdit = () => {
        setVisibleEdit(!visibleEdit);
    };

    // State handle - FOR CREATE : userInputs FOR ADDUSER
    const onInputFeildChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserInput({
            ...userInput,
            [name]: value,
        });
    };

    //State handle - FOR EDIT : userInputs FOR EDIT
    const onInputFeildChangeEdit = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserInputEdit({
            ...userInputEdit,
            [name]: value,
        });
    };

    // Handle api : addUser 
    const handleAddUser = async () => {
        console.log(userInput)
        const adduser = await axios
            .post("http://localhost:4000/userAuth/addUser", userInput, {
                withCredentials: true,
            })
            .then((e) => {
                if (e.statusText === "Created") {
                    toast.success(e.data.message);
                }
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.response.data.message);
            });
        console.log(adduser);
    };
    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(userInput);
        handleAddUser();
        setVisible(!visible);
    };

    // Handle api : edit api
    // 1:first on edit button click set prev valur to edit model feild and state
    const handleEdit = async (userData) => {
        console.log(`Fatched userId:${userData.user_id} data`, userData)
        setVisibleEdit(!visibleEdit)
        setUserInputEdit({
            userId: userData.user_id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            emailId: userData.email_id
        })
    }
    // 2:second on submit edit form called api and update th data
    const handleEditUser = async () => {
        await axios.post("http://localhost:4000/userAuth/updateUser", userInputEdit, {
            withCredentials: true
        }).then((e) => {
            console.log(e);
            toast.success(e.data.message)
        })
    }

    const handleOnEdit = (e) => {
        e.preventDefault();
        handleEditUser();
        setVisibleEdit(!visibleEdit)
        console.log(userInputEdit)
    }

    // Handle api : delete api
    const handleDelete = async (userId) => {
        console.log(userId)
        if (userId === 1) {
            return alert("you can't delete admin")
        } else {
            await axios.post(`http://localhost:4000/userAuth/deleteUser/${userId}`, {}, {
                withCredentials: true
            }).then((e) => {
                console.log(e);
                return toast.success(e.data.message)
            })
        }
    }

    // Fatch all users data with graphql
    const { loading, error, data } = useQuery(GET_ALL_USERS, {
        onCompleted: (e) => {
            console.log(e);
        }
    });
    if (loading) {
        return <h1 className="apolloHandler">Loading please wait...</h1>;
    }
    if (error) {
        return <h1 className="apolloHandler">{console.log(error)}</h1>;
    }
    if (data) {
        console.log("Fatched ALL USER data", data.getAllUsers.data)
    }


    // Add and Delete btn 
    const actionCell = (userData) => {
        return (
            <td>
                <Button onClick={() => { handleEdit(userData.dataItem) }} icon="edit" className="editBtn" />
                <Button onClick={() => { handleDelete(userData.dataItem.user_id) }} icon="delete" className="deleteBtn" />
            </td>
        )
    }

    const text = (
        <>
            {/* Add user btn */}
            <div className="drawerContent">
                <Button
                    className="add_user_btn"
                    themeColor={"primary"}
                    onClick={toggleDialog}
                    icon="user"
                >
                    Add user
                </Button>

                {/* All user data table */}
                <Grid data={data.getAllUsers.data.slice(page.skip, page.take + page.skip)}
                    total={data.getAllUsers.data.length}
                    pageable={true}
                    skip={page.skip}
                    take={page.take}
                    onPageChange={pageChange} >
                    <GridColumn field="user_id" name="userId" title="ID" width={40} />
                    <GridColumn field="first_name" name="firstName" title="First Name" />
                    <GridColumn field="last_name" name="lastName" title="Last Name" />
                    <GridColumn field="email_id" name="emailId" title="emailId" />
                    <GridColumn cell={actionCell} title="Action" />
                </Grid>

                {/* ------------------------ Add user : model ------------------------------ */}
                {visible && (
                    <Dialog title={"Add New User"} width={300} onClose={toggleDialog}>
                        <div>
                            <form className="fromContainer" onSubmit={handleOnSubmit}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    autoComplete="off"
                                    onChange={onInputFeildChange}
                                    value={userInput.firstName}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    autoComplete="off"
                                    onChange={onInputFeildChange}
                                    value={userInput.lastName}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="emailId"
                                    id="emailId"
                                    required
                                    autoComplete="off"
                                    onChange={onInputFeildChange}
                                    value={userInput.emailId}
                                />
                                <input
                                    type="password"
                                    placeholder="password"
                                    name="password"
                                    id="password"
                                    required
                                    autoComplete="off"
                                    onChange={onInputFeildChange}
                                    value={userInput.password}
                                />

                                <button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    className="success_btn"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </Dialog>
                )}

                {/* ------------------------ Edit : model ------------------------------ */}
                {visibleEdit && (
                    <Dialog title={"Edit User"} width={300} onClose={toggleDialogEdit}>
                        <div>
                            <form className="fromContainer" onSubmit={handleOnEdit}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    defaultValue={userInputEdit.firstName}
                                    onChange={onInputFeildChangeEdit}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    defaultValue={userInputEdit.lastName}
                                // onChange={onInputFeildChange}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="emailId"
                                    id="emailId"
                                    required
                                    defaultValue={userInputEdit.emailId}
                                    onChange={onInputFeildChangeEdit}
                                />
                                <button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    className="success_btn"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </Dialog>
                )}
            </div>
        </>
    );

    return <>{props.children ? props.children : text}</>;
};

export default AllUser;
