import Header from "../../common/header/Header";
import React, { useState } from "react";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import { Tab, Tabs } from "@material-ui/core";

const Home = () => {
  const [value, setValue] = useState(0);
  const [userAppointments, setUserAppointments] = useState([]);

  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };

  //SET USER'S LOGIN STATUS
  const [IsUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const accessToken = sessionStorage.getItem("access-token");
    if (accessToken) {
      setIsUserLoggedIn(true);
    }
  }, []);

  //GET APPOINTMENTS
  const getUserAppointments = async () => {
    const url = `http://localhost:8080/users/${emailId}/appointments`;
    const accessToken = sessionStorage.getItem("access-token");
    // console.log(url, accessToken);

    try {
      // debugger;
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
        // console.log(response);
        setUserAppointments(response);
        // console.log(setAvailableSlots);
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
    if (isLogin === true) {
      getUserAppointments();
    }
    // eslint-disable-next-line
  }, [isLogin]);
  return (
    <div>
      <Header />
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
          // userAppointments={userAppointments}
          IsUserLoggedIn={IsUserLoggedIn}
        />
      )}
    </div>
  );
};

export default Home;
