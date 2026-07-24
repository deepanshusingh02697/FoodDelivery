import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { ToastContainer } from "react-toastify";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store";

import { logoutSuccess } from "./Redux/Slices/authSlice";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: "include",
});

const errorLink = onError(({ error }) => {
  let shouldLogout = false;

  if (CombinedGraphQLErrors.is(error)) {
    shouldLogout = error.errors.some(
      (err) => err.extensions?.code === "UNAUTHENTICATED",
    );
  }

  if (ServerError.is(error) && error.statusCode === 401) {
    shouldLogout = true;
  }

  if (shouldLogout) {
    store.dispatch(logoutSuccess());
    persistor.purge();
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
