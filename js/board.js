let currentDraggedStatus;
let currentDraggedElement;
let taskStatus = ["todo", "inprogress", "testing", "done"];
let allTasks = data;
let acc = document.getElementsByClassName("accordion");
let i;

/**
 * This function is an onload(body) function.
 *
 */
async function initBoard() {
  await init();
  await loadTickets();
  let screenSize = document.getElementById("body").clientWidth;
  if (screenSize < 769) {
    showInResponsive();
  } else {
    showTickets();
  }
  readyForOpenTask();
  //setColor();
}

// NEU NEW ADDED
fetch('/api/todos/')  // URL für die Django-API-View, die die Todos-Daten liefert
  .then(response => response.json())
  .then(allTasks => {
    // Verarbeiten Sie die erhaltenen Daten hier
    console.log(allTasks);
  })
  .catch(error => {
    // Behandeln Sie Fehler hier
    console.error(error);
  });

/**
 *
 * load all tickets and put it in a local variable "allTasks"
 */
function loadTickets() {
  for (let i = 0; i < data.length; i++) {
    allTasks.push(data[i]);
  }
}

/**
 * get a status from taskStatus[] and add the Tickets
 *
 */
function showTickets() {
  for (let i = 0; i < taskStatus.length; i++) {
    let currentStatus = taskStatus[i];
    getTasks(currentStatus);
  }
}

/**
 * filter tasks by status and add in the right column
 *
 * @param {string} currentStatus - status for using the right tasks and div-IDs
 */
function getTasks(currentStatus) {
  let tasks = allTasks.filter((t) => t["status"] == currentStatus);

  mainContent = document.getElementById(currentStatus + "Content");
  mainContent.innerHTML = ``;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let id = task["id"];
    let currentUsers = task["assignedTo"];
    mainContent.innerHTML += addHTML(task, id);
    addIconsToBoard(task, id);
    document.getElementById("ticket" + id).classList.add(checkPriority(task));
  }
}

/**
 * add information in HTML
 *
 * @param {string} id - status and arreyposition to define the ticket
 * @param {string} currentArray - This is the current task.
 * @returns - HTML-Code with informations from the array
 */
function addHTML(currentArray, id) {
  return `
            <div id="ticket${id}" draggable="true" ondragstart="startDragging(${id})" class="task-card">
                <button class="accordion">
                <div>
                   
                    <span class="category">${currentArray["category"]}</span>


                </div>
                    <div class="ticket-header">
                        <h3>${currentArray["title"]}</h3>
                        
                    </div>
                    <span id="date${id}" class="date">${getDate(
    currentArray["dueTo"],
    id
  )}
      </span>
                </button>
                <div class="panel">
                <span class="description">${currentArray["description"]}</span>
                
                    <div>
                    <img src="src/img/back-to-backlog.png" title="put it back to Backlog" class="put-to-backlog" onclick="backToBacklog(${id})"></img>
                    <img class="click-delete-icon" src="src/img/delete.png" onclick="deleteByClick(${id})">
                    <div class="arrows">  
                </div>
                <div id="iconArea${id}" class="iconAreaBoard">
                </div>
                    </div>
                </div>
                
                
            </div>
         `;
}

/**
 * check the assignedTo "status" and return a alternative string if this is empty
 *
 * @param {string} currentArray - sometimes needed if the alternative returns
 * @param {string} id - position of the ticket in the array
 * @returns - correct link or alternative
 */
function checkAssignedTo(currentArray, id) {
  let a = true;
  if (data[id].assignedTo[0]) {
    return data[id].assignedTo[0].img;
  } else {
    return "./src/img/profile.png";
  }
}

/**
 * get the the dragged element by array-id
 *
 * @param {string} id - id from the dragged element
 */
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * set the new status of the ticket and update the page
 *
 * @param {string} status - status for set new column
 */
function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  document.getElementById("bin").classList.add("d-none");
  saveData();
  showTickets();
  readyForOpenTask();
  saveData();
}

/**
 * prepare the tasks for opening
 *
 */
function readyForOpenTask() {
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      let panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}

/**
 * Safe Data[] to Backend.
 *
 */
async function saveData() {
  await backend.setItem("tickets", JSON.stringify(data));
}

/**
 *
 * delete complete task by drag and drop
 */
/*async function deleteTicket() {
  await data.splice(currentDraggedElement, 1);
  allTasks = data;
  saveData();
  showTickets();
  readyForOpenTask();
  saveData();
}

/**
 *
 * delete complete task by click(only in responsive)
 * @param {string} id - ticket position in array
 */
function deleteByClick(id) {
  data.splice(id, 1);
  console.log(data);
  showInResponsive();
  readyForOpenTask();
  saveData();
  showTickets();
}

/**
 *
 * change status of the ticket to backlog and refresh page
 * @param {string} id
 */
function backToBacklog(id) {
  allTasks[id]["status"] = "backlog";
  saveData();
  showTickets();
  showInResponsive();
  readyForOpenTask();
}

/**
 *
 * only in responsive, change status to the status of the left side
 * @param {string} id - ticket position in array
 */

function moveTicketLeft(id) {
  let ticketStatus = data[id]["status"];
  for (let i = 0; i < taskStatus.length; i++) {
    let element = taskStatus[i];
    if (element == ticketStatus && i >= 1) {
      data[id]["status"] = taskStatus[i - 1];
      {
        break;
      }
    }
  }
  saveData();
  showTickets();
  showInResponsive();
  readyForOpenTask();
  saveData();
}

/**

* only in responsive, change the status to the status of the right side

* @param {string} id  - ticket position in array

*/

function moveTicketRight(id) {
  let ticketStatus = data[id]["status"];
  for (let i = 0; i < taskStatus.length; i++) {
    let element = taskStatus[i];
    if (element == ticketStatus && i < taskStatus.length - 1) {
      data[id]["status"] = taskStatus[i + 1];
      {
        break;
      }
    }
  }
  showTickets();
  showInResponsive();
  readyForOpenTask();
  saveData();
}

/**
 * get the todue and change it in "days left"
 * @param {string} todue - date of todue
 * @param {string} id - ticket position in array
 * @returns - formated todue date in "days left", or "deadline has come"
 */
function getDate(todue, id) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date();
  const secondDate = new Date(todue);

  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  let fixedDays = diffDays + 1;

  if (firstDate < secondDate) {
    return fixedDays + "days left";
  }
  if (firstDate == secondDate) {
    return "today";
  } else {
    return "the deadline has come";
  }
}

function showInResponsive() {
  allTasks = data;
  let currentCollumn = document.getElementById("responsiveHeadline");
  let currentValue = currentCollumn.value;
  console.log("the current collumn is " + currentValue);
  getTasksInResponsive(currentValue);
}

/**
 * filter tasks by status and add in the right column
 *
 * @param {string} currentStatus - status for using the right tasks and div-IDs
 */
function getTasksInResponsive(currentStatus) {
  let tasks = allTasks.filter((t) => t["status"] == currentStatus);
  responsiveContent = document.getElementById("responsiveMainContent");
  responsiveContent.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let id = task["id"];
    responsiveContent.innerHTML += addHTMLrespomsive(task, id);
    let ticket = document.getElementById("resticket" + id);
    ticket.classList.add(checkPriority(task));
    addIconsToBoardInResponsive(task, id);
  }
}

function addHTMLrespomsive(currentArray, id) {
  return `
            <div id="resticket${id}" class="task-card">
                <button class="accordion">
                    <div class="ticket-header">
                        <h3>${currentArray["title"]}</h3>
                        
                    </div>
                    <span id="date${id}" class="date">${getDate(
    currentArray["dueTo"],
    id
  )}
      </span>
                </button>
                <div class="panel">
                <div id="iconAreaResponsive${id}" class="iconAreaBoard">
                </div>
                <span class="description">${currentArray["description"]}</span>
                
                    <div>
                    <img src="src/img/back-to-backlog.png" title="put it back to Backlog" class="put-to-backlog" onclick="backToBacklog(${id})"></img>
                    <div class="arrows">
                    <img src="src/img/arrow-icon-left.png" onclick="moveTicketLeft(${id})">
                    <img class="click-delete-icon" src="src/img/delete.png" onclick="deleteByClick(${id})">
                    <img src="src/img/arrow-icon-right.png" onclick="moveTicketRight(${id})">
                </div>
                    </div>
                </div>
                
            </div>
         `;
}

function iconFit() {
  let icons = document.getElementsByClassName("user-icon");

  for (let i = 0; i < icons.length; i++) {
    let icon = icons[i];
    icon.classList.add("board-icons");
  }
}

function getAllAssignedUser(currentArray) {
  allUsers = currentArray["assignedTo"];
  for (let i = 0; i < allUsers.length; i++) {
    let thatUser = allUsers[i];
    return createUserIcon(thatUser);
  }
}

function addIconsToBoard(task, id) {
  let target = document.getElementById("iconArea" + id);
  let allUsers = task["assignedTo"];
  for (let i = 0; i < allUsers.length; i++) {
    let thatUser = allUsers[i];
    target.innerHTML += createUserIcon(thatUser);
  }
}

function addIconsToBoardInResponsive(task, id) {
  let target = document.getElementById("iconAreaResponsive" + id);
  let allUsers = task["assignedTo"];
  for (let i = 0; i < allUsers.length; i++) {
    let thatUser = allUsers[i];
    target.innerHTML += createUserIcon(thatUser);
  }
}
