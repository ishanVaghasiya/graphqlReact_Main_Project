import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./color.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import "@progress/kendo-theme-default/dist/all.css";
import { createUploadLink } from "apollo-upload-client";
import { ThemeProvider } from "./pages/darkmode/ThemeContext";

const link = new createUploadLink({ uri: 'http://localhost:4000/graphql', credentials: "include" })
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
