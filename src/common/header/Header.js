import React, { useState, useEffect } from "react";
import "./Header.css";
import Logo from "../../assets/logo.jpeg";
import { Button } from "@material-ui/core";
import Modal from "react-modal";
import { Tab } from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import Register from "../../screens/register/Register";
import Login from "../../screens/login/Login";

// TABPANEL FROM MATERIAL UI
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography component="span">{children}</Typography>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// CUSTOM STYLES FOR LOGIN/REGISTER MODAL
const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
//======================================================================================================
//HEADER FUNCTION
export default function Header({ isUserLoggedIn, setIsUserLoggedIn }) {
  //OPEN/CLOSE LOGIN-REGISTER MODAL
  const [isOpen, setIsOpen] = useState(false);
  function openOrCloseModal() {
    setIsOpen(!isOpen);
  }

  //HANDLE MODAL TAB VALUES
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //SET USER'S LOGIN STATUS
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // useEffect(() => {
  //   const accessToken = sessionStorage.getItem("access-token");
  //   if (accessToken) {
  //     setIsUserLoggedIn(true);
  //   }
  // }, []);

  //UPDATE USER'S LOGIN STATUS & CLOSE MODAL
  const updateLoginStatus = (loggedIn) => {
    setIsUserLoggedIn(loggedIn);
    if (isOpen) {
      openOrCloseModal();
    }
  };

  //FUNCTION FOR LOGGING OUT
  const logoutHandler = async () => {
    const url = "http://localhost:8080/auth/logout";
    const logoutRequest = {
      method: "POST",
      headers: {
        // "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + sessionStorage.getItem("access-token"),
      },
    };

    try {
      const rawResponse = await fetch(url, logoutRequest);
      if (rawResponse.status === 200) {
        // console.log(rawResponse);
        // console.log(rawResponse.ok);
        // console.log(rawResponse.status);
        // console.log(sessionStorage.getItem("access-token"));
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("user-id");
        sessionStorage.removeItem("user-firstName");
        sessionStorage.removeItem("user-lastName");
        updateLoginStatus(false);
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        console.log("User Could not be logged out");
        console.log(sessionStorage.getItem("access-token"));
        throw error;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const loginHandler = async (email, password) => {
    const userCredentials = window.btoa(email + ":" + password);
    const url = "http://localhost:8080/auth/login";
    const loginRequest = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        authorization: "Basic " + userCredentials,
      },
    };

    try {
      const rawResponse = await fetch(url, loginRequest);
      if (rawResponse.ok) {
        const response = await rawResponse.json();
        sessionStorage.setItem("access-token", response.accessToken);
        sessionStorage.setItem("user-id", response.id);
        sessionStorage.setItem("user-firstName", response.firstName);
        sessionStorage.setItem("user-lastName", response.lastName);
        // sessionStorage.setItem("user-info", JSON.stringify(response));
        // sessionStorage.setItem("user-id", JSON.stringify(response.id));
        updateLoginStatus(true);
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        throw error;
      }
    } catch (error) {
      alert(`${error.message} Please enter correct details.`);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access-token");
    if (accessToken) {
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <div className="header-container">
        <img className="header-logo" src={Logo} alt="logo" />

        {/* DISPLAY LOGIN/LOGOUT BUTTON ACCORDING TO USERS LOGIN STATUS */}
        {isUserLoggedIn ? (
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "right" }}
            onClick={logoutHandler}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={openOrCloseModal}
          >
            Login
          </Button>
        )}

        {/* LOGIN/REGISTER MODAL */}
        <Modal
          ariaHideApp={false}
          isOpen={isOpen}
          onRequestClose={openOrCloseModal}
          contentLabel="Login-Register Modal"
          style={modalStyle}
          centered
        >
          <Tabs value={tabValue} onChange={handleTabValueChange}>
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="Register" {...a11yProps(1)} />
          </Tabs>

          {/* LOGIN FORM */}
          <TabPanel value={tabValue} index={0}>
            <Login
              updateLoginStatus={updateLoginStatus}
              loginHandler={loginHandler}
            />
          </TabPanel>

          {/* REGISTRATION FORM */}
          <TabPanel value={tabValue} index={1}>
            <Register
              updateLoginStatus={updateLoginStatus}
              loginHandler={loginHandler}
            />
          </TabPanel>
        </Modal>
      </div>
    </div>
  );
}
