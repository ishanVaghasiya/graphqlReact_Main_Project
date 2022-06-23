require("dotenv").config();
const express = require("express");
const app = express();
const Route = require("./routes/route");
const { ApolloServer } = require("apollo-server-express");
const { verifyToken } = require("./auth");
const cors = require("cors");
const path = require("path");

const typeDefs = require("./controllers/schema/post");
const resolvers = require("./controllers/resolvers/post");

const { graphqlUploadExpress } = require("graphql-upload");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/uploads/")));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
let port = process.env.PORT || 3000;

app.use("/", Route);
app.use(verifyToken);
app.use(graphqlUploadExpress());

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return req;
    },
    
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: corsOptions,
  });
}
startApolloServer();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
