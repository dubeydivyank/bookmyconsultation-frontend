import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(1.5),
    backgroundColor: "#464646",
    color: "white",
    fontSize: "14px",
  },
}));

const Register = ({ updateLoginStatus }) => {
  //HANDLE USER REGISTRATION REQUEST
  const [anchorEl, setAnchorEl] = useState(null);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState();
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidMobile, setInvalidMobile] = useState(false);
  const setParentAnchorElNull = () => {
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setParentAnchorElNull();
  };

  useEffect(() => {
    setAnchorEl(anchorEl);
  }, [anchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const classes = useStyles();

  function handleRegistrationRequest(e) {
    e.preventDefault();

    if (firstName === "") {
      setAnchorEl(e.currentTarget.parentNode.children[0]);
      return;
    }
    if (lastName === "") {
      setAnchorEl(e.currentTarget.parentNode.children[2]);
      return;
    }
    if (email === "") {
      setAnchorEl(e.currentTarget.parentNode.children[4]);
      return;
    }
    if (password === "") {
      setAnchorEl(e.currentTarget.parentNode.children[6]);
      return;
    }
    if (contactNo === "") {
      setAnchorEl(e.currentTarget.parentNode.children[8]);
      return;
    }

    const emailPattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    const mobilePattern = /^[6-9]\d{9}$/i;

    if (!email.match(emailPattern)) {
      setInvalidEmail(true);
      return;
    } else {
      setInvalidEmail(false);
    }

    if (!contactNo.match(mobilePattern)) {
      setInvalidMobile(true);
      return;
    } else {
      setInvalidMobile(false);
    }

    const userDetails = {
      emailId: email,
      firstName: firstName,
      lastName: lastName,
      mobile: contactNo,
      password: password,
    };

    const url = "http://localhost:8080/users/register";
    const signupRequest = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    fetch(url, signupRequest)
      .then((response) => response.json())
      .then((response) => {
        // if (response.id) {
        updateLoginStatus(true);
        setRegistrationSuccessMsg(response.salt !== null ? true : false);
        // }
      });
  }

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <FormControl required={true}>
          <InputLabel htmlFor="first-name">First Name</InputLabel>
          <Input
            id="first-name"
            value={firstName}
            onChange={({ target }) => setFirstName(target.value)}
          />
        </FormControl>
        <br />
        <FormControl required={true}>
          <InputLabel htmlFor="last-name">Last Name</InputLabel>
          <Input
            id="last-name"
            value={lastName}
            onChange={({ target }) => setLastName(target.value)}
          />
        </FormControl>
        <br />
        <FormControl required={true}>
          <InputLabel htmlFor="email-address">Email</InputLabel>
          <Input
            id="email-address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          {invalidEmail === true && (
            <FormHelperText>
              <span style={{ color: "red" }}>Enter valid Email</span>
            </FormHelperText>
          )}
        </FormControl>
        <br />
        <FormControl required={true}>
          <InputLabel htmlFor="new-password">Password</InputLabel>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </FormControl>
        <br />
        <FormControl required={true}>
          <InputLabel htmlFor="contact-no">Contact No.</InputLabel>
          <Input
            id="contact-no"
            value={contactNo}
            onChange={({ target }) => setContactNo(target.value)}
          />
          {invalidMobile === true && (
            <FormHelperText>
              <span style={{ color: "red" }}>Enter valid Contact no.</span>
            </FormHelperText>
          )}
        </FormControl>
        <br />
        <br />
        <span>{registrationSuccessMsg}</span>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          style={{ float: "center" }}
          type="submit"
          onClick={(e) => {
            handleRegistrationRequest(e);
          }}
        >
          REGISTER
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography className={classes.typography}>
            Please fill out this field
          </Typography>
        </Popover>
      </div>
    </div>
  );
};

export default Register;
