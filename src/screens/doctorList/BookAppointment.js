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
// import { Book } from "@material-ui/icons";

const BookAppointment = ({
  doctor,
  getUserAppointments,
  userAppointments,
  closeModalHandler,
}) => {
  const doctorName = `${doctor.firstName} ${doctor.lastName}`;

  const dateFormatter = (date) => {
    let dateArray = date.toLocaleDateString().split("/");
    let newDate = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
    // console.log(newDate);
    return newDate;
  };

  const currentUserAppointments = userAppointments;
  const [selectDate, setSelectDate] = useState(dateFormatter(new Date()));
  const [selectSlot, setSelectSlot] = useState("");
  const [slotsAvailable, setSlotsAvailable] = useState(["None"]);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookedSuccessfully, setBookedSuccessfully] = useState(false);
  const [slotRequired, setSlotRequired] = useState("None");

  const dateChangeHandler = (date) => {
    setSelectDate(dateFormatter(date));
  };

  const slotChangeHandler = (event) => {
    setSelectSlot(event.target.value);
    //insert here
    slotRequired("None");
  };

  const getAvailableSlots = async () => {
    const url = `http://localhost:8080/doctors/${doctor.id}/timeSlots?date=?${selectDate}`;
    try {
      const rawResponse = await fetch(url);
      if (rawResponse.ok) {
        const response = await rawResponse.json();
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

  const bookAppointmentHandler = async (e) => {
    if (e) e.preventDefault();

    if (selectSlot === null || selectSlot === "" || selectSlot === "None") {
      setSlotRequired("Block");
      return;
    }

    const accessToken = sessionStorage.getItem("access-token");
    const userDetails = sessionStorage.getItem("user-info");
    // const emailId = sessionStorage.getItem("user-id");
    // const emailId = JSON.parse(sessionStorage.getItem("userId"));
    // const userDetails = JSON.parse(sessionStorage.getItem("user-info"));

    if (accessToken === null || userDetails === null) {
      alert("Please Login to Book an appointment");
      closeModalHandler();
      return;
    }

    // Check if user already has appointment for the same date-time
    const existingAppointment = currentUserAppointments.filter(
      (appointment) => {
        if (
          appointment.appointmentDate === selectDate &&
          appointment.timeSlot === selectSlot
        ) {
          return appointment;
        }
        return null;
      }
    );
    if (existingAppointment.length > 0) {
      alert("Either the slot is already booked or not available");
      return;
    }

    const data = {
      doctorId: doctor.id,
      doctorName: doctorName,
      userId: userDetails.id,
      userName: `${userDetails.firstName} ${userDetails.lastName}`,
      timeSlot: selectSlot,
      createdDate: dateFormatter(new Date()),
      appointmentDate: selectDate,
      symptoms: symptoms,
      priorMedicalHistory: medicalHistory,
    };

    const url = "http://localhost:8080/appointments";
    const appointmentRequest = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const rawResponse = await fetch(url, appointmentRequest);
      if (rawResponse.ok) {
        setBookedSuccessfully(true);
        getUserAppointments();
        setTimeout(function () {
          closeModalHandler();
        }, 1000);
      } else {
        if (rawResponse.status === 400) {
          alert("Bad Request");
        }
      }
    } catch (error) {
      alert(e.message);
    }
  };

  // useEffect(() => {
  //   getAvailableSlots();
  // }, [selectDate]);

  return (
    <div>
      <Paper className="bookingModal">
        <CardHeader className="cardHeader" title="Book an Appointment" />
        <CardContent key={doctor.id}>
          <form noValidate autoComplete="off" onSubmit={bookAppointmentHandler}>
            <div>
              <TextField
                disabled
                id="standard-disabled"
                label="DoctorName"
                required
                value={doctorName}
              />
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectDate}
                  onChange={dateChangeHandler}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <FormControl>
                <InputLabel id="timeSlotInput">Time Slot</InputLabel>
                <Select
                  labelId="timeSlotInput"
                  id="timeSlotInput"
                  value={selectSlot}
                  onChange={slotChangeHandler}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {/* For Testing of Duplicate date-time booking */}
                  {/* <MenuItem value="05PM-06PM">
                    <em>05PM-06PM</em>
                  </MenuItem> */}
                  {slotsAvailable.map((slot, key) => (
                    <MenuItem key={key} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className={slotRequired}>
                  <span className="red">Select a time slot</span>
                </FormHelperText>
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Medical History"
                  multiline
                  rows={4}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Symptoms"
                  multiline
                  rows={4}
                  value={symptoms}
                  placeholder="ex.Cold, Swelling, etc"
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            {bookedSuccessfully === true && (
              <FormControl>
                <span>Appointment booked successfully.</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              id="bookappointment"
              type="submit"
              variant="contained"
              color="primary"
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Paper>{" "}
    </div>
  );
};

export default BookAppointment;
