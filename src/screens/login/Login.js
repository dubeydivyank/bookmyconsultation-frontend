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

const Login = ({ updateLoginStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameIsRequired, setUsernameIsRequired] = useState(false);
  const [passwordIsRequired, setPasswordIsRequired] = useState(false);

  function handleLoginRequest(e) {
    e.preventDefault();
    //
    if (username === "") {
      setAnchorEl(e.currentTarget.parentNode.children[0]);
      return;
    }
    if (password === "") {
      setAnchorEl(e.currentTarget.parentNode.children[2]);
      return;
    }
    //
    setUsernameIsRequired(username === "" ? true : false);
    setPasswordIsRequired(password === "" ? true : false);
    const userCredentials = window.btoa(username + ":" + password);
    const loginRequest = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: "Basic " + userCredentials,
      },
    };
    fetch("/api/v1/auth/login", loginRequest)
      .then((response) => {
        if (!response.ok) {
          return response.json();
        }
        return response;
      })
      .then((response) => {
        if (response.headers) {
          sessionStorage.setItem(
            "access-token",
            response.headers.get("access-token")
          );
          updateLoginStatus(true);
        } else {
          console.log(response.body);
        }
      });
  }

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <FormControl required>
          <InputLabel htmlFor="userName">Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          {usernameIsRequired && (
            <FormHelperText>
              <span className="required-error">required</span>
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
          {passwordIsRequired && (
            <FormHelperText>
              <span className="required-error">required</span>
            </FormHelperText>
          )}
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
