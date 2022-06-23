const { PrismaClient } = require("@prisma/client");
const { createWriteStream } = require("fs");
const prisma = new PrismaClient();
const fs = require("fs");
const { GraphQLUpload } = require("graphql-upload");
const path = require("path");
const { parse } = require("path");
const resolvers = {
  Mutation: {
    createPost: async (_, args, req) => {
      try {
        let { filename, createReadStream } = await args.file;
        const createdBy = req.userInformation.userId;
        const userId = req.userInformation.userId;

        const userCheck = await prisma.tbl_user.count({
          where: {
            user_id: userId,
          },
        });

        if (userCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `UserId not found!`,
          };
        }
        const postCheck = await prisma.tbl_post.count({
          where: {
            title: args.title,
            status: 1,
          },
        });

        if (postCheck === 1) {
          return {
            status: false,
            code: 202,
            message: `post already exists!`,
          };
        }

        let stream = createReadStream();
        let { name, ext } = parse(filename);
        let serverFile = path.join(__dirname, `../../uploads/${name}${ext}`);
        let writeStream = await createWriteStream(serverFile);
        await stream.pipe(writeStream);

        await prisma.tbl_post.create({
          data: {
            user_id: userId,
            title: args.title,
            description: args.description,
            image: filename,
            created_by: createdBy,
            updated_by: null,
            updated_at: null,
            deleted_by: null,
            deleted_at: null,
          },
        });
        return {
          status: true,
          code: 201,
          message: `Post has been created successfully!`,
        };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },

    deletePost: async (_, args, req) => {
      try {
        const { postId } = args;
        const deletedBy = req.userInformation.userId;
        const postCheck = await prisma.tbl_post.count({
          where: {
            post_id: postId,
          },
        });

        const postData = await prisma.tbl_post.findMany({
          where: {
            post_id: postId,
          },
        });

        if (postCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
        }
        if (postData[0].status !== 1) {
          return {
            status: false,
            code: 202,
            message: `Post is already deleted!`,
          };
        }
        await prisma.tbl_post.update({
          where: {
            post_id: postId,
          },
          data: {
            status: 2,
            deleted_at: new Date(),
            deleted_by: deletedBy,
          },
        });
        return {
          status: true,
          code: 201,
          message: `Post has been deleted successfully!`,
        };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },

    updatePost: async (_, args, req) => {
      try {
        const updatedBy = req.userInformation.userId;
        let { filename, createReadStream } = await args.file;

        const postCheck = await prisma.tbl_post.count({
          where: {
            post_id: args.postId,
          },
        });

        if (postCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
        }
        const postData = await prisma.tbl_post.findMany({
          where: {
            post_id: args.postId,
          },
        });
        if (postData[0].status !== 1) {
          return {
            status: false,
            code: 202,
            message: `Post is deleted!`,
          };
        }

        const titleCheck = await prisma.tbl_post.findFirst({
          where: {
            title: args.title,
          },
        });

        // if title alredy exists and post id doesn't match with title in the database then it can't be updated
        //same title can be updated on it's own post id
        if (titleCheck && titleCheck.post_id !== args.postId) {
          return {
            status: true,
            code: 201,
            message: `Post already exists on different postId! Please provide correct postId`,
          };
        }
        const getImg = await prisma.tbl_post.findMany({
          where: {
            post_id: args.postId,
          },
        });
        fs.unlink(
          path.join(__dirname, `../../uploads/${getImg[0].image}`),
          (err) => {
            if (err) return err.message;
          }
        );

        let stream = createReadStream();
        let { name, ext } = parse(filename);
        let serverFile = path.join(__dirname, `../../uploads/${name}${ext}`);
        let writeStream = await createWriteStream(serverFile);
        await stream.pipe(writeStream);

        await prisma.tbl_post.update({
          where: {
            post_id: args.postId,
          },
          data: {
            title: args.title,
            description: args.description,
            image: filename,
            updated_by: updatedBy,
            deleted_at: null,
            deleted_by: null,
            updated_at: new Date(),
          },
        });
        return {
          status: true,
          code: 201,
          message: `Post has been updated successfully!`,
        };
      } catch (error) {
        return error.message;
      }
    },
  },
  Upload: GraphQLUpload,

  Query: {
    getAllPosts: async () => {
      try {
        const data = await prisma.tbl_post.findMany({
          where: {
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data found" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },

    getPostsByPostId: async (_, args) => {
      try {
        const { postId } = args;
        const postCheck = await prisma.tbl_post.count({
          where: {
            post_id: postId,
          },
        });
        const postData = await prisma.tbl_post.findMany({
          where: {
            post_id: postId,
          },
        });
        if (postCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
        }
        if (postData[0].status !== 1) {
          return {
            status: false,
            code: 202,
            message: `Post is deleted!`,
          };
        }
        const data = await prisma.tbl_post.findMany({
          where: {
            post_id: postId,
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data found" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getPostsByUser: async (_, args) => {
      try {
        const { userId } = args;
        const userCheck = await prisma.tbl_user.count({
          where: {
            user_id: userId,
            status: 1,
          },
        });
        if (userCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `UserId not found!`,
          };
        }
        const data = await prisma.tbl_post.findMany({
          where: {
            user_id: userId,
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data foud" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getAllUsers: async () => {
      try {
        const data = await prisma.tbl_user.findMany({
          where: {
            status: 1,
          },
        });

        console.log("data :>> ", data);
        if (data.length === 0) {
          return { status: false, code: 202, message: "No data foud" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getAllUsersByUserId: async (_, args, req) => {
      try {
        const { userId } = args;

        if (userId <= 0) {
          return {
            status: false,
            code: 202,
            message: "Please provide valid user id",
          };
        }

        const data = await prisma.tbl_user.findMany({
          where: {
            status: 1,
            user_id: userId,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data foud" };
        }
        return { status: true, code: 201, message: "OK", data: data[0] };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getMyPost: async (_, args, req) => {
      try {
        const userId = req.userInformation.userId;

        if (userId <= 0) {
          return {
            status: false,
            code: 202,
            message: "Please provide valid user id",
          };
        }

        const data = await prisma.tbl_post.findMany({
          where: {
            status: 1,
            user_id: userId,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data foud" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
  },
};

module.exports = resolvers;
