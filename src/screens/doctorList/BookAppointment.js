import React, { useState, useEffect } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const BookAppointment = ({
  doctor,
  getUserAppointments,
  userAppointments,
  closeModalHandler,
}) => {
  const currentUserAppointments = userAppointments;
  const [selectDate, setSelectDate] = useState(dateFormatter(new Date()));
  const [selectSlot, setSelectSlot] = useState("");
  const [slotsAvailable, setSlotsAvailable] = useState(["None"]);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookedSuccessfully, setBookedSuccessfully] = useState(false);

  const dateChangeHandler = (date) => {
    setSelectDate(dateFormatter(date));
  };

  const slotChangeHandler = (event) => {
    setSelectSlot(event.target.value);
    //insert here
  };

  const getAvailableSlots = async () => {
    const url = `http://localhost:8080/doctors${doctor.id}timeSlot?date=?${selectDate}`;
    try {
      const rawResponse = await fetch(url);
      if (rawResponse.ok) {
        const response = rawResponse.json();
        setSlotsAvailable(response.timeSlot);
      } else {
        const error = new Error();
        error.message = "Some error Occured in fetching timeslots";
        throw error;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const bookAppointmentHandler = () => {};

  return (
    <div>
      <div></div>
    </div>
  );
};
