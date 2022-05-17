import Header from "../../common/header/Header";
import React, { useState, useEffect } from "react";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import { Tab, Tabs } from "@material-ui/core";

const Home = () => {
  const emailId = sessionStorage.getItem("user-id");
  const [value, setValue] = useState(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);

  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };

  //SET USER'S LOGIN STATUS
  // useEffect(() => {
  //   const accessToken = sessionStorage.getItem("access-token");
  //   if (accessToken) {
  //     setIsUserLoggedIn(true);
  //   }
  // }, []);

  //GET APPOINTMENTS
  const getUserAppointments = async () => {
    // console.log(emailId);
    const url = `http://localhost:8080/users/${emailId}/appointments`;
    const accessToken = sessionStorage.getItem("access-token");

    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json;Charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setUserAppointments(response);
      } else {
        const error = new Error();
        error.message = "Some Error Occurred";
        throw error;
      }
    } catch (e) {
      alert(e.message);
    }
  };
  useEffect(() => {
    if (isUserLoggedIn === true) {
      getUserAppointments();
    }
  }, [isUserLoggedIn]);

  return (
    <div>
      <Header
        isUserLoggedIn={isUserLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
      />
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={value}
        onChange={tabSwitchHandler}
      >
        <Tab label="Doctors"></Tab>
        <Tab label="Appointment"></Tab>
      </Tabs>
      {value === 0 && (
        <DoctorList
          getUserAppointments={getUserAppointments}
          userAppointments={userAppointments}
        />
      )}
      {value === 1 && (
        <Appointment
          userAppointments={userAppointments}
          isUserLoggedIn={isUserLoggedIn}
        />
      )}
    </div>
  );
};

export default Home;
