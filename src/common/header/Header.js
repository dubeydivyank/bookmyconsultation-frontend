import "./Header.css";
import logo from "../../assets/logo.jpeg";
import { Button } from "@material-ui/core";

import Modal from "@material-ui/core/Modal";
import React, { useState, useEffect } from "react";

//
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

const Header = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const accessToken = sessionStorage.getItem("access-token");
    if (accessToken) {
      setIsUserLoggedIn(true);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  function openOrCloseModal() {
    console.log("clicked");
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <div className="header-container">
        <img src={logo} alt="logo loading..." className="header-logo" />
        {isUserLoggedIn ? (
          <Button
            variant="contained"
            className="login-button"
            color="secondary"
          >
            LOGOUT
          </Button>
        ) : (
          <Button
            variant="contained"
            className="login-button"
            color="primary"
            onClick={openOrCloseModal}
          >
            LOGIN
          </Button>
        )}
        <Modal
          ariaHideApp={false}
          open={isOpen}
          onClose={openOrCloseModal}
          contentLabel="Login-Register Modal"
          style={modalStyle}
          centered
        >
          <div>asdfasdfas</div>
        </Modal>
      </div>
    </div>
  );
};

export default Header;
