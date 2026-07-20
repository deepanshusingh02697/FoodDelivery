import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { Provider } from "react-redux";
import { store } from "./store.tsx";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: "include",
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </StrictMode>,
);
