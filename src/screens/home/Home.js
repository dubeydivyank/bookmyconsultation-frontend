import Header from "../../common/header/Header";
import React, { useState } from "react";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import { Tab, Tabs } from "@material-ui/core";

const Home = () => {
  const [value, setValue] = useState(0);
  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };
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
        // getUserAppointments={getUserAppointments}
        // userAppointments={userAppointments}
        />
      )}
      {value === 1 && (
        <Appointment
        // userAppointments={userAppointments}
        // isLogin={isLogin}
        />
      )}
    </div>
  );
};

export default Home;
