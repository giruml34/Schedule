const scheduleList =
  document.getElementById("scheduleList");

const driverFilter =
  document.getElementById("driverFilter");


function formatDate(dateValue) {

  const date = new Date(
    `${dateValue}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}


function formatTime(timeValue) {

  const time = new Date(
    `2000-01-01T${timeValue}`
  );

  return time.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


function renderSchedule() {

  const selectedDriver =
    driverFilter.value;


  const savedBookings =
    JSON.parse(
      localStorage.getItem("rideBookings")
    ) || [];


  const driverBookings =
    savedBookings
      .filter(
        function (booking) {
          return booking.driver === selectedDriver;
        }
      )
      .sort(
        function (firstBooking, secondBooking) {

          const firstDate =
            new Date(
              `${firstBooking.date}T${firstBooking.time}`
            );

          const secondDate =
            new Date(
              `${secondBooking.date}T${secondBooking.time}`
            );

          return firstDate - secondDate;

        }
      );


  scheduleList.innerHTML = "";


  if (driverBookings.length === 0) {

    scheduleList.innerHTML = `
      <div class="empty-state">

        <h2>
          No bookings for ${selectedDriver}
        </h2>

        <p>
          New reservations will appear here.
        </p>

        <a
          class="button"
          href="booking.html?driver=${selectedDriver}"
        >
          Add a Booking
        </a>

      </div>
    `;

    return;
  }


  driverBookings.forEach(
    function (booking) {

      const bookingCard =
        document.createElement("article");


      bookingCard.className =
        "booking-card";


      bookingCard.innerHTML = `
        <div class="booking-time">

          <strong>
            ${formatTime(booking.time)}
          </strong>

          <span>
            ${formatDate(booking.date)}
          </span>

        </div>


        <div class="booking-details">

          <h2>
            ${booking.passengerName}
          </h2>

          <p>
            <strong>Pickup:</strong>
            ${booking.pickup}
          </p>

          <p>
            <strong>Destination:</strong>
            ${booking.destination}
          </p>

          <p>
            <strong>Phone:</strong>
            ${booking.phone}
          </p>

          ${
            booking.notes
              ? `
                <p>
                  <strong>Notes:</strong>
                  ${booking.notes}
                </p>
              `
              : ""
          }

        </div>


        <button
          class="delete-button"
          data-id="${booking.id}"
        >
          Cancel
        </button>
      `;


      scheduleList.appendChild(
        bookingCard
      );

    }
  );


  const cancelButtons =
    document.querySelectorAll(
      ".delete-button"
    );


  cancelButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const bookingId =
            Number(button.dataset.id);

          deleteBooking(bookingId);

        }
      );

    }
  );

}


function deleteBooking(bookingId) {

  const savedBookings =
    JSON.parse(
      localStorage.getItem("rideBookings")
    ) || [];


  const updatedBookings =
    savedBookings.filter(
      function (booking) {

        return booking.id !== bookingId;

      }
    );


  localStorage.setItem(
    "rideBookings",
    JSON.stringify(updatedBookings)
  );


  renderSchedule();

}


driverFilter.addEventListener(
  "change",
  renderSchedule
);


renderSchedule();
