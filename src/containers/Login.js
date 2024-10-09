import React, { Component } from "react"; 
import "../styles/App.css"; 
import NavBar from "../components/NavBar";
import "materialize-css/dist/css/materialize.min.css";
import AuthService from "../services/AuthService";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import { BackgroundAdd } from "../components/Background";
import ErrorToast from "../services/ErrorToastService";
import * as actionCreators from "../actions/user-actions";
import Logo from "../assets/heart-anim.gif";
import { GoogleLogin } from '@react-oauth/google';
import { googleAuthLogin } from "../http/index";
import { connect } from "react-redux";
import Materialize from "materialize-css";
import axios from 'axios';

// import GoogleLogin from "./googleLogin";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      pwd: "",
      loginError: "",
      pwdError: "",
      loginValid: false,
      pwdValid: false,
      responseToPost: "",
    };
    this._isMounted = false;
  }

  // Google login success callback
  handleGoogleSuccess = async (credentialResponse) => {
    // console.log(credentialResponse)
    try {
      // Send the token to your backend for user verification or registration
      const res = await googleAuthLogin({ credential: credentialResponse.credential });
  
     const data = res.data
     console.log(data)
      if(data.message == "User registered with success"){
        Materialize.toast({
          html: "User registered with success , Please verify your email",
          displayLength: 1500,
          classes: "rounded info-toast"
        });
                
      }

      if(data.message=="User logged in with success"){
       
        const user = data.user; // backend response
        Axios.post("/users/login", {
          login: user.mail.toLowerCase(),
          pwd: user.password
        })
          .then(res => {
            this._isMounted && this.setState({ responseToPost: res.status });
            localStorage.setItem("Token", res.data["token"]);
            this.props.getUserData(res.data["username"]);
            this.props.history.push("/");
          })
          .catch(err => {
            ErrorToast.custom.error(err.response["data"]["message"], 1400);
          });


      }
      
    } catch (error) {
      console.error("Google login failed:", error);
      ErrorToast.custom.error("Google login failed", 1400);
    }
  };

  handleGoogleFailure = (error) => {
    console.error("Google login error:", error);
    ErrorToast.custom.error("Google login failed", 1400);
  };

  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="row login-register-page">
          <div className="col a12 m6" id="login-box">
            <div className="login-header">
              Only a few clicks away from{" "}
              <span className="logo-header-love">
                L
                <img
                  className="login-love-logo"
                  src={Logo}
                  alt="Logo on login"
                />
                ve
              </span>
            </div>
            <div className="card-panel center">
              <i className="medium material-icons">account_box</i>
              <span className="title-page">Log in</span>
              <div className="card-panel">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field">
                    <i className="material-icons prefix input-icons">
                      person_outline
                    </i>
                    <input
                      type="text"
                      name="name"
                      id="user-login"
                      autoComplete="username"
                      value={this.state.login}
                      onChange={this.handleChange}
                      onKeyUp={this.validateLogin}
                      required
                    />
                    <div className="login-error">{this.state.loginError}</div>
                    <label htmlFor="user-login">Username or email</label>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix input-icons">
                      lock_outline
                    </i>
                    <input
                      type="password"
                      name="pwd"
                      id="pwd-login"
                      autoComplete="current-password"
                      value={this.state.pwd}
                      onChange={this.handleChange}
                      onKeyUp={this.validatePwd}
                      required
                    />
                    <div className="login-error">{this.state.pwdError}</div>
                    <label htmlFor="pwd-login">Password</label>
                  </div>
                  <input
                    type="submit"
                    name="submit"
                    value="Login"
                    className="btn"
                    disabled={!this.state.loginValid || !this.state.pwdValid}
                  />
                </form>
                  {/* Google login button */}
                  <GoogleLogin
                  clientId='53925760279-cs8hnrbvmsmh1eur6f5ghjme5se9hamu.apps.googleusercontent.com' // Your Google Client ID
                  buttonText="Sign in with Google"
                  onSuccess={this.handleGoogleSuccess}
                  onFailure={this.handleGoogleFailure}
                  cookiePolicy={'single_host_origin'}
                />

                <p className="register-login-link link-left">
                  Forgot password?{" "}
                  <NavLink className="pink-link" to="/users/forgot-password">
                    Click here
                  </NavLink>
                </p>
                <p className="register-login-link link-right">
                  Don't have an account yet?{" "}
                  <NavLink className="pink-link" to="/users/register">
                    Register
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect user if already logged in
  componentDidMount() {
    this._isMounted = true;
    BackgroundAdd();
    if (this.Auth.loggedIn()) {
      ErrorToast.auth.userAlreadyLogged();
      this.props.history.replace("/");
    }
  }

  // Checking username or email format is valid
  validateLogin = () => {
    let loginError = "";
    let regexLogin = /^[a-zA-Z0-9]*-?[a-zA-Z0-9]*$/;
    let regexEmail = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

    if (
      !this.state.login.match(regexLogin) &&
      !this.state.login.match(regexEmail)
    ) {
      loginError = "Please enter a valid Username/Email";
    } else if (this.state.login === "") {
      loginError = "Username/Email cannot be empty";
    } else if (this.state.login.length > 30) {
      loginError = "Username/Email must be less or equal to 30 chars";
    }

    if (loginError) {
      this._isMounted && this.setState({ loginValid: false });
    } else if (this.state.login !== "") {
      this._isMounted && this.setState({ loginValid: true });
    }

    this._isMounted && this.setState({ loginError });
  };

  // Checking password format is valid
  validatePwd = () => {
    let pwdError = "";

    if (this.state.pwd.length < 8 || this.state.pwd.includes(" ")) {
      pwdError = "Please enter a valid password";
    } else if (this.state.pwd.length > 30) {
      pwdError = "Password must be less or equal to 30 chars";
    }

    if (pwdError) {
      this._isMounted && this.setState({ pwdValid: false });
    } else if (this.state.pwd) {
      this._isMounted && this.setState({ pwdValid: true });
    }

    this._isMounted && this.setState({ pwdError });
  };

  // On user input change, update states
  handleChange = e => {
    const isLogin = e.target.name === "name";
    const isPwd = e.target.name === "pwd";

    if (isLogin) {
      this._isMounted && this.setState({ login: e.target.value });
    }

    if (isPwd) {
      this._isMounted && this.setState({ pwd: e.target.value });
    }
  };

  // On user button submit, execute this
  handleSubmit = async e => {
    e.preventDefault();
    axios.post("lionnlioness-backend-git-master-lionnlioness-projects.vercel.app/users/login", {
      login: this.state.login.toLowerCase(),
      pwd: this.state.pwd
    })
      .then(res => {
        this._isMounted && this.setState({ responseToPost: res.status });
        localStorage.setItem("Token", res.data["token"]);
        this.props.getUserData(res.data["username"]);
        this.props.history.push("/");
      })
      .catch(err => {
        ErrorToast.custom.error(err.response["data"]["message"], 1400);
      });
  };

  componentDidMount() {
    this._isMounted = true;
    BackgroundAdd();
    if (localStorage.getItem("Token")) {
      ErrorToast.auth.userAlreadyLogged();
      this.props.history.replace("/");
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}

const mapStateToProps = state => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status
  };
};

export default connect(
  mapStateToProps,
  actionCreators
)(Login);
