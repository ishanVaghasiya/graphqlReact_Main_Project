const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await prisma.tbl_user.findMany({
      where: {
        email_id: emailId,
      },
    });
    const userStatus = await prisma.tbl_user.count({
      where: {
        email_id: emailId,
        status: 1,
      },
    });

    if (userStatus === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `User is deleted. Can't login!`,
      });
    }
    if (user.length > 0) {
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      const accessToken = jwt.sign(
        { userId: user[0].user_id, emailId: user[0].email_id },
        "secret",
        {
          expiresIn: "24h",
        }
      );
      if (passwordMatch) {
        return res
          .cookie("access_token", accessToken, {
            httpOnly: false,
            sameSite: "lax",
            secure: false,
            // maxAge: 360000,
          })
          .json({
            status: true,
            code: 201,
            message: `User has been logged in successfully `,
          });
      } else {
        return res.json({ message: "Please enter correct password" });
      }
    } else {
      return res.json({ message: "Invalid email id or password" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const logout = async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "You have been logged out successfully" });
};
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const createdBy =  req.userInformation.userId;
    // if user is not a admin then the user is not authorized to perform the operation
    const IsAdmin = await prisma.tbl_user.count({
      where: {
        user_id: createdBy,
        is_admin: true,
      },
    });
    if (IsAdmin === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `You're not authorized to perform this operation`,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.tbl_user.findMany({
        where: {
          email_id: emailId,
        },
      });
      if (user.length > 0) {
        return res
          .status(401)
          .json({ status: false, code: 202, message: "User already exists!" });
      }
      await prisma.tbl_user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email_id: emailId,
          password: hashedPassword,
          created_by: createdBy,
          updated_by: null,
          updated_at: null,
          deleted_by: null,
          deleted_at: null,
        },
      });
      return res.status(201).json({
        status: true,
        code: 201,
        message: `User has been created successfully!`,
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { userId, firstName, lastName, emailId } = req.body;
    const updatedBy = req.userInformation.userId;
    if (userId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid user id!`,
      });
    }
    const userCheck = await prisma.tbl_user.count({
      where: {
        user_id: userId,
        status: 1,
      },
    });
    if (userCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `UserId not found!`,
      });
    }
    await prisma.tbl_user.update({
      where: {
        user_id: userId,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        email_id: emailId,
        updated_by: updatedBy,
        updated_at: new Date(),
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `User has been updated successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(userId);
    const deletedBy = req.userInformation.userId;
    if (userId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid user id!`,
      });
    }
    const userCheck = await prisma.tbl_user.count({
      where: {
        user_id: userId,
      },
    });
    const userData = await prisma.tbl_user.findMany({
      where: {
        user_id: userId,
      },
    });
    if (userCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `UserId not found!`,
      });
    }
    if (userData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `User is already deleted!`,
      });
    }
    await prisma.tbl_user.update({
      where: {
        user_id: userId,
      },
      data: {
        status: 2,
        deleted_by: deletedBy,
        deleted_at: new Date(),
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `User has been deleted successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const enableDisableUser = async (req, res) => {
  try {
    const { userId, operation } = req.body;
    const updatedBy = req.userInformation.userId;

    if (userId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid user id!`,
      });
    }
    if (operation !== 0 && operation !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Operation must be either 0(disable) or 1(enable)!`,
      });
    }
    const updateStatus = operation === 0 ? 3 : 1;
    const userCheck = await prisma.tbl_user.findMany({
      where: {
        user_id: userId,
      },
    });
    if (userCheck.length === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `UserId not found!`,
      });
    }
    const roleCheck = await prisma.tbl_user.findMany({
      where: {
        user_id: req.userInformation.userId,
      },
    });
    if (
      roleCheck[0].is_admin === false &&
      userId !== req.userInformation.userId
    ) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Only admin can enable or disable the user!`,
      });
    }
    switch (updateStatus) {
      case 3:
        if (updateStatus === userCheck[0].status) {
          return res.status(202).json({
            status: false,
            code: 202,
            message: `User is already disabled.`,
          });
        }
        break;
      case 1:
        if (updateStatus === userCheck[0].status) {
          return res.status(202).json({
            status: false,
            code: 202,
            message: `User is already enabled.`,
          });
        }
        break;
    }
    await prisma.tbl_user.update({
      where: {
        user_id: userId,
      },
      data: {
        status: updateStatus,
        updated_by: updatedBy,
        updated_at: new Date(),
      },
    });
    if (updateStatus === 3) {
      return res.status(201).json({
        status: true,
        code: 201,
        message: `User has been disabled successfully!`,
      });
    }
    return res.status(201).json({
      status: true,
      code: 201,
      message: `User has been enabled successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // if user  is not admin then the user is not authorized to perform the operation
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.tbl_user.findMany({
      where: {
        email_id: emailId,
      },
    });
    if (user.length > 0) {
      return res
        .status(401)
        .json({ status: false, code: 202, message: "Admin already exists!" });
    }
    await prisma.tbl_user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email_id: emailId,
        password: hashedPassword,
        created_by: 1,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
        is_admin: true,
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Admin has been created successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const changeEmail = async (req, res) => {
  try {
    const { userId, emailId } = req.body;
    console.log(userId);
    const updatedBy = req.userInformation.userId;
    if (userId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid user id!`,
      });
    }
    const userCheck = await prisma.tbl_user.count({
      where: {
        user_id: userId,
        status: 1,
      },
    });
    if (userCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `User either deleted or doesn't exists!`,
      });
    }
    const roleCheck = await prisma.tbl_user.findMany({
      where: {
        user_id: req.userInformation.userId,
      },
    });
    if (
      roleCheck[0].is_admin === false &&
      userId !== req.userInformation.userId
    ) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid userId & email!`,
      });
    }
    await prisma.tbl_user.update({
      where: {
        user_id: userId,
      },
      data: {
        email_id: emailId,
        updated_at: new Date(),
        updated_by: updatedBy,
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Your email has been updated successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const updatedBy = req.userInformation.userId;

    const userCheck = await prisma.tbl_user.findMany({
      where: {
        user_id: req.userInformation.userId,
        status: 1,
      },
    });
    if (userCheck.length === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `User doesn't exists!`,
      });
    }
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      userCheck[0].password
    );
    if (!passwordMatch) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Old password is wrong!`,
      });
    }
    if (oldPassword === newPassword) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Old and new passwords must not be same. Please try different password`,
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.tbl_user.update({
      where: {
        user_id: req.userInformation.userId,
      },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
        updated_by: updatedBy,
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Your password has been updated successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  createAdmin,
  changeEmail,
  changePassword,
  logout,
  enableDisableUser,
};
