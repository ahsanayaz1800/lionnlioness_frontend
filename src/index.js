import React from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { render } from "react-dom";
import MainRouter from "./routes";
import { Provider } from "react-redux";
import configureStore from "./store";
import { getUserData } from "./actions/user-actions";
import AuthService from "./services/AuthService";
import { GoogleOAuthProvider } from "@react-oauth/google";
const Auth = new AuthService();
const store = configureStore();

if (Auth.loggedIn()) {
  store.dispatch(getUserData(Auth.getConfirm().username));
}

render(
  <Provider store={store}>
   <GoogleOAuthProvider clientId="53925760279-cs8hnrbvmsmh1eur6f5ghjme5se9hamu.apps.googleusercontent.com">
      <MainRouter />

   </GoogleOAuthProvider>
  </Provider>,
  document.getElementById("root")
);
