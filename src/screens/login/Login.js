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

const Login = ({ updateLoginStatus, loginHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

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

  async function handleLoginRequest(e) {
    e.preventDefault();

    if (email === "") {
      setAnchorEl(e.currentTarget.parentNode.children[0]);
      return;
    }
    if (password === "") {
      setAnchorEl(e.currentTarget.parentNode.children[2]);
      return;
    }

    const emailPattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    if (!email.match(emailPattern)) {
      setInvalidEmail(true);
      return;
    } else {
      setInvalidEmail(false);
    }
    loginHandler(email, password);
    //
    // const userCredentials = window.btoa(email + ":" + password);
    // const url = "http://localhost:8080/auth/login";
    // const loginRequest = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json;charset=UTF-8",
    //     Accept: "application/json",
    //     authorization: "Basic " + userCredentials,
    //   },
    // };

    // try {
    //   const rawResponse = await fetch(url, loginRequest);
    //   if (rawResponse.ok) {
    //     const response = await rawResponse.json();
    //     sessionStorage.setItem("access-token", response.accessToken);
    //     sessionStorage.setItem("user-info", response);
    //     sessionStorage.setItem("user-id", response.id);
    //     updateLoginStatus(true);
    //     console.log(response);
    //     console.log(sessionStorage.getItem("access-token"));
    //   } else {
    //     const error = new Error();
    //     error.message = "Something went wrong.";
    //     throw error;
    //   }
    // } catch (error) {
    //   alert(`${error.message} Please enter correct details.`);
    // }

    // fetch(url, loginRequest)
    //   .then((response) => {
    //     // if (!response.ok) {
    //     return response.json();
    //     // }
    //     // return response;
    //   })
    //   .then((response) => {
    //     if (response.accessToken !== null) {
    //       console.log(response.accessToken);
    //       const userInfo = {
    //         userId: response?.id,
    //         userName: response?.firstName + " " + response?.lastName,
    //         email: response?.emailAddress,
    //       };
    //       sessionStorage.setItem("access-token", response.accessToken);
    //       sessionStorage.setItem("user-info", userInfo);
    //       sessionStorage.setItem("user-Id", userInfo.userId);

    //       updateLoginStatus(true);
    //     } else {
    //       console.log(response.body);
    //     }
    //   });
  }

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <FormControl required>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="username"
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
        <FormControl required>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
          />
        </FormControl>
        <br />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleLoginRequest(e);
          }}
          style={{ float: "center" }}
        >
          LOGIN
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
export default Login;
