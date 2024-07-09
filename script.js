var data = [];
let body = {
  summary: "Event summary",
  location: "Event location details",
  description: "Event description",
  start: {
    dateTime: "2024-05-15T21:00:00+05:30",
    timeZone: "IST",
  },
  end: {
    dateTime: "2024-05-15T21:30:00+05:30",
    timeZone: "IST",
  },
  sendNotifications: true,
  attendees: [
    {
      email: "hello@example.com",
    },
    {
      email: "sales@example.com",
    },
  ],
};

// ............................... auto reload..........................................
function autoReload() {
  location.reload();
}

// Set a timeout to call the autoReload function after 60 seconds (60000 milliseconds)
setTimeout(autoReload, 60000);


// ----------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', fetchEvents);

/* Create Operation */
async function addItem() {
  const summary = document.getElementById("summary").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (summary && description && location && startTime && endTime) {
    body.summary = summary;
    body.description = description;
    body.location = location;
    body.start.dateTime = startTime + ":00+05:30";
    body.end.dateTime = endTime + ":00+05:30";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(
        "https://v1.nocodeapi.com/bosesupriyo/calendar/MNpSWETwOnDcKdlp/event", 
        requestOptions
      );
      const data = await response.json();
      console.log(data);

      await fetchEvents();
      clearForm();
    } catch (error) {
      console.log("error", error);
    }
  } else {
    alert("Please fill in all fields.");
  }
}

async function fetchEvents() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://v1.nocodeapi.com/bosesupriyo/calendar/MNpSWETwOnDcKdlp/listEvents",
      requestOptions
    );
    const d = await response.json();
    console.log(d);

    data = d;
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    d.items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id.split('_')[0]}</td>
        <td>${item.summary}</td>
        <td>${item.description}</td>
        <td>${item.location}</td>
        <td>${item.start.dateTime}</td>
        <td>${item.end.dateTime}</td>
        <td>
          <button onclick="editItem('${item.id}')">Edit</button>
          <button onclick="deleteItem('${item.id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.log("error", error);
  }
}

function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("summary").value = "";
  document.getElementById("description").value = "";
  document.getElementById("location").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
}

function editItem(id) {
  const selectedItem = data.items.find((item) => item.id === id);

  if (selectedItem) {
    document.getElementById("id").value = selectedItem.id;
    document.getElementById("summary").value = selectedItem.summary;
    document.getElementById("description").value = selectedItem.description;
    document.getElementById("location").value = selectedItem.location;
    document.getElementById("startTime").value =
      selectedItem.start.dateTime.slice(0, 16);
    document.getElementById("endTime").value = selectedItem.end.dateTime.slice(
      0,
      16
    );
    const formContainer = document.getElementById("form-container");
    const addButton = formContainer.querySelector("button");
    addButton.textContent = "Save";
    addButton.onclick = () => saveEdit(id);
  }
}

async function saveEdit(id) {
  const eventIdentity = document.getElementById("id").value.split('_')[0];
  const summary = document.getElementById("summary").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (summary && description && location && startTime && endTime) {
    body.summary = summary;
    body.description = description;
    body.location = location;
    body.start.dateTime = startTime + ":00+05:30";
    body.end.dateTime = endTime + ":00+05:30";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(
        "https://v1.nocodeapi.com/bosesupriyo/calendar/MNpSWETwOnDcKdlp/event?eventId=" +
          eventIdentity,
        requestOptions
      );
      const result = await response.text();
      console.log(result);

      await fetchEvents();
      location.reload();  // Reload the page after successful edit
    } catch (error) {
      console.log("error", error);
    }
  } else {
    alert("Please fill in all fields.");
  }
}

async function deleteItem(id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://v1.nocodeapi.com/bosesupriyo/calendar/MNpSWETwOnDcKdlp/event?eventId=" + id, 
      requestOptions
    );
    const result = await response.text();
    console.log(result);

    alert("Event deleted successfully");
    await fetchEvents();
    location.reload();  // Reload the page after successful delete
  } catch (error) {
    console.log("error", error);
  }
}
