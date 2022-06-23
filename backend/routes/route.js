const express = require("express");
const { verifyToken } = require("../auth");

const {
  createUser,
  loginUser,
  createAdmin,
  updateUser,
  deleteUser,
  changeEmail,
  changePassword,
  logout,
  enableDisableUser,
} = require("../controllers/user/user");
const router = express.Router();

router.post(`/userAuth/login`, loginUser);
router.get(`/userAuth/logout`, verifyToken, logout);

router.post(`/userAuth/addUser`, verifyToken, createUser);
router.post(`/userAuth/updateUser`, verifyToken, updateUser);
router.post(`/userAuth/deleteUser/:userId`, verifyToken, deleteUser);
router.post(`/userAuth/createAdmin`, verifyToken, createAdmin);
router.post(`/userAuth/changeEmail`, verifyToken, changeEmail);
router.post(`/userAuth/changePassword`, verifyToken, changePassword);
router.post(`/userAuth/enableDisableUser`, verifyToken, enableDisableUser);

module.exports = router;
