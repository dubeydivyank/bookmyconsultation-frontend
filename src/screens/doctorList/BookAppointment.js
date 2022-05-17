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
    // let dateArray = date.toLocaleDateString().split("/");
    // let newDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    // console.log(newDate);
    // return newDate;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  const currentUserAppointments = userAppointments;
  const [selectDate, setSelectDate] = useState(dateFormatter(new Date()));
  const [selectSlot, setSelectSlot] = useState("");
  const [slotsAvailable, setSlotsAvailable] = useState(["None"]);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookedSuccessfully, setBookedSuccessfully] = useState(false);
  const [slotRequired, setSlotRequired] = useState("none");

  const dateChangeHandler = (date) => {
    setSelectDate(dateFormatter(date));
  };

  const slotChangeHandler = (event) => {
    setSelectSlot(event.target.value);
    //insert here
    setSlotRequired("none");
  };

  const getAvailableSlots = async () => {
    const url = `http://localhost:8080/doctors/${doctor.id}/timeSlots?date=${selectDate}`;
    try {
      const rawResponse = await fetch(url);
      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setSlotsAvailable(response.timeSlot);
      } else {
        const error = new Error();
        error.message = "Some error occured in fetching timeslots";
        throw error;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const bookAppointmentHandler = async (e) => {
    if (e) e.preventDefault();

    if (selectSlot === null || selectSlot === "" || selectSlot === "None") {
      setSlotRequired("block");
      return;
    }

    const accessToken = sessionStorage.getItem("access-token");
    const firstName = sessionStorage.getItem("user-firstName");
    const lastName = sessionStorage.getItem("user-lastName");
    // const userDetails = sessionStorage.getItem("user-info");
    const emailId = sessionStorage.getItem("user-id");
    // const emailId = JSON.parse(sessionStorage.getItem("user-id"));
    // const userDetails = JSON.parse(sessionStorage.getItem("user-info"));
    // console.log("accessss" + accessToken);
    // console.log(userDetails);

    if (accessToken === null) {
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
    //

    //
    const data = {
      doctorId: `${doctor.id}`,
      doctorName: `${doctorName}`,
      userId: `${emailId}`,
      userName: `${firstName} ${lastName}`,
      userEmailId: `${emailId}`,
      timeSlot: `${selectSlot}`,
      appointmentDate: `${selectDate}`,
      createdDate: `${dateFormatter(new Date())}`,
      symptoms: `${symptoms}`,
      priorMedicalHistory: `${medicalHistory}`,
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

  useEffect(() => {
    getAvailableSlots();
  }, [selectDate]);

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
// import React, { Fragment, useEffect, useState } from "react";
// import {
//   Button,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
// } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import DateFnsUtils from "@date-io/date-fns";
// import { FormLabel } from "@material-ui/core";
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from "@material-ui/pickers";
// import Alert from "@material-ui/lab/Alert";

// const useModalStyles = makeStyles((theme) => ({
//   root: {
//     padding: "15px 15px 30px 15px",
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       width: 200,
//     },
//     "& .MuiFormControl-root": {
//       display: "flex",
//       marginBottom: "15px",
//     },
//   },
// }));

// const selectStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//     width: "200px",
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

// const getFormattedDate = (date) => {
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();

//   return `${year}-${month}-${day}`;
// };

// const BookAppointment = ({
//   doctor,
//   getUserAppointments,
//   userAppointments,
//   closeModalHandler,
// }) => {
//   const doctorName = `${doctor.firstName} ${doctor.lastName}`;
//   const accessToken = sessionStorage.getItem("access-token");
//   const userDetails = sessionStorage.getItem("user-info");
//   const modalClasses = useModalStyles();
//   const [selectedDate, setSelectedDate] = React.useState(
//     getFormattedDate(new Date())
//   );
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
//   const [bookAppointmentForm, setBookAppointmentForm] = useState({
//     medicalHistory: "",
//     symptoms: "",
//   });
//   const selectClasses = selectStyles();

//   const fetchTimeSlotForAppointment = () => {
//     fetch(
//       `http://localhost:8080/doctors/${doctor.id}/timeSlots?date=${selectedDate}`
//     )
//       .then((response) => response.json())
//       .then((response) => {
//         const time = response.timeSlot;
//         setTimeSlots([...time]);
//       });
//   };

//   useEffect(() => {
//     const err = document.getElementById("timeslot-error");
//     err.style.display = "none";
//     const err2 = document.getElementById("not-loggedin-error");
//     err2.classList.add("hide-message");
//     err2.classList.remove("show-message");
//     fetchTimeSlotForAppointment();
//   }, []);

//   const handleDateChange = (date) => {
//     setSelectedDate(getFormattedDate(date));
//     fetchTimeSlotForAppointment();
//   };

//   const handleTimeSlotChange = (event) => {
//     const err = document.getElementById("timeslot-error");
//     err.style.display = "none";
//     setSelectedTimeSlot(event.target.value);
//   };

//   const handleInputChange = (e) => {
//     const state = bookAppointmentForm;
//     state[e.target.name] = e.target.value;
//     setBookAppointmentForm({ ...state });
//   };

//   const isValidForm = () => {
//     let errorFound = false;
//     if (selectedTimeSlot === "") {
//       const err = document.getElementById("timeslot-error");
//       err.style.display = "block";
//       errorFound = true;
//     }

//     if (accessToken === null || userDetails === null) {
//       const err = document.getElementById("not-loggedin-error");
//       err.classList.remove("hide-message");
//       err.classList.add("show-message");
//       errorFound = true;
//     }

//     return !errorFound;
//   };

//   const handleBookAppointment = async () => {
//     if (isValidForm()) {
//       const body = {
//         doctorId: doctor.id,
//         doctorName: doctorName,
//         userId: userDetails.id,
//         userName: `${userDetails.firstName} ${userDetails.lastName}`,
//         timeSlot: selectedTimeSlot,
//         createdDate: "",
//         appointmentDate: selectedDate,
//         symptoms: `${bookAppointmentForm.symptoms}`,
//         priorMedicalHistory: `${bookAppointmentForm.medicalHistory}`,
//       };
//       const rawResponse = await fetch("http://localhost:8080/appointments", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
//       if (rawResponse.ok) {
//         alert("Appointment was booked successfully");
//         closeModalHandler();
//       } else {
//         alert("Either the slot is already booked or not available");
//       }
//     }
//   };

//   return (
//     <Fragment>
//       <div className="heading">
//         <h2>Book an Appointment</h2>
//       </div>
//       <form name="book-appointment-form" className={modalClasses.root}>
//         <TextField
//           disabled
//           id="doctorName"
//           label="Doctor Name*"
//           defaultValue={doctorName}
//         />

//         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//           <KeyboardDatePicker
//             disableToolbar
//             variant="inline"
//             format="MM/dd/yyyy"
//             margin="normal"
//             id="date-picker-inline"
//             label="Date picker inline"
//             value={selectedDate}
//             onChange={handleDateChange}
//             KeyboardButtonProps={{
//               "aria-label": "change date",
//             }}
//           />
//         </MuiPickersUtilsProvider>
//         <FormControl className={selectClasses.formControl}>
//           <InputLabel shrink id="select-speciality-input-label">
//             Timeslot
//           </InputLabel>
//           <Select
//             labelId="select-timeslot-label-label"
//             id="select-timeslot-label"
//             value={selectedTimeSlot}
//             onChange={handleTimeSlotChange}
//             displayEmpty
//             className={selectClasses.selectEmpty}
//           >
//             <MenuItem value="">
//               <em>None</em>
//             </MenuItem>
//             {timeSlots.map((time) => (
//               <MenuItem value={time}>{time}</MenuItem>
//             ))}
//           </Select>
//           <FormHelperText id="timeslot-error">
//             Select a time slot
//           </FormHelperText>
//         </FormControl>
//         <FormControl className={selectClasses.formControl}>
//           <FormLabel>Medical History</FormLabel>
//           <TextField
//             id="medical-history"
//             name="medicalHistory"
//             onChange={handleInputChange}
//           />
//         </FormControl>
//         <FormControl className={selectClasses.formControl}>
//           <FormLabel>Symptoms</FormLabel>
//           <TextField
//             id="symptoms"
//             name="symptoms"
//             onChange={handleInputChange}
//           />
//         </FormControl>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleBookAppointment}
//         >
//           BOOK APPOINTMENT
//         </Button>
//         <Alert
//           severity="error"
//           className="hide-message"
//           id="not-loggedin-error"
//         >
//           Please login to book an appointment
//         </Alert>
//       </form>
//     </Fragment>
//   );
// };

// export default BookAppointment;
