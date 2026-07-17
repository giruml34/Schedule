const bookingForm = document.getElementById("bookingForm");
const messageBox = document.getElementById("message");
const driverSelect = document.getElementById("driver");
const dateInput = document.getElementById("date");

const pageParameters = new URLSearchParams(
  window.location.search
);

const selectedDriver = pageParameters.get("driver");

if (selectedDriver) {
  driverSelect.value = selectedDriver;
}

const today = new Date()
  .toISOString()
  .split("T")[0];

dateInput.min = today;


function showMessage(message, type) {
  messageBox.textContent = message;

  messageBox.className =
    `message ${type}`;
}


bookingForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    const booking = {
      id: Date.now(),

      driver:
        driverSelect.value,

      passengerName:
        document
          .getElementById("passengerName")
          .value
          .trim(),

      phone:
        document
          .getElementById("phone")
          .value
          .trim(),

      pickup:
        document
          .getElementById("pickup")
          .value
          .trim(),

      destination:
        document
          .getElementById("destination")
          .value
          .trim(),

      date:
        dateInput.value,

      time:
        document
          .getElementById("time")
          .value,

      notes:
        document
          .getElementById("notes")
          .value
          .trim()
    };


    const savedBookings =
      JSON.parse(
        localStorage.getItem("rideBookings")
      ) || [];


    const driverIsAlreadyBooked =
      savedBookings.some(
        function (existingBooking) {

          return (
            existingBooking.driver === booking.driver &&
            existingBooking.date === booking.date &&
            existingBooking.time === booking.time
          );

        }
      );


    if (driverIsAlreadyBooked) {

      showMessage(
        `${booking.driver} is already booked at that date and time.`,
        "error"
      );

      return;
    }


    savedBookings.push(booking);


    localStorage.setItem(
      "rideBookings",
      JSON.stringify(savedBookings)
    );


    showMessage(
      `Your booking with ${booking.driver} was submitted successfully.`,
      "success"
    );


    bookingForm.reset();


    if (selectedDriver) {
      driverSelect.value = selectedDriver;
    }


    dateInput.min = today;

  }
);
