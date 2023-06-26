let currentDraggedStatus;
let currentDraggedElement;
let taskStatus = ["todo", "inprogress", "testing", "done"];
 let allTasks = []; 
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
}

async function loadTickets() {
 try {
    const response = await fetch(`http://127.0.0.1:8000/api/todos/`);
    const data = await response.json();
    allTasks = data;     
  } catch (error) {
    console.log('Error:', error);
  }
}


function showTickets() {
  console.log('allTask', allTasks);
  for (let i = 0; i < taskStatus.length; i++) {
    let currentStatus = taskStatus[i];
    getTasks(currentStatus);
  }
}

function getTasks(currentStatus) {
  console.log('allTaskinGetTasks', allTasks);
  let tasks = allTasks.filter((t) => t["status"] == currentStatus); 
  mainContent = document.getElementById(currentStatus + "Content");

  mainContent.innerHTML = ``;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    let id = task["id"];

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
                  <span id="date${id}" class="date">${getDate(currentArray["due_date"],id)}</span>
                </button>
                <div class="panel">
                  <span class="description">${currentArray["description"]}</span>
                    <div>
                    <img src="src/img/back-to-backlog.png" title="put it back to Backlog" class="put-to-backlog" onclick="backToBacklog(${id})"></img>
                    <img class="click-delete-icon" src="src/img/delete.png" onclick="deleteByClick(${id})">
                    <div class="arrows"></div>
                    <div id="iconArea${id}" class="iconAreaBoard"></div>
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

function moveTo(status) {
/* allTasks[currentDraggedElement]["status"] = status;  */
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

var raw = JSON.stringify({
  "status": status
});

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`http://127.0.0.1:8000/api/todos/${currentDraggedElement}/`, requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result), 
    console.log('updated Alltasks', allTasks);
    showTickets(); 
    initBoard();
  })
  .catch(error => console.log('error', error));
  document.getElementById("bin").classList.add("d-none");

}
/**
 * set the new status of the ticket and update the page
 *
 * @param {string} status - status for set new column
 */

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


function readyForOpenTaskInResponsive() {
  let accResponsive = document.getElementsByClassName("accordion");

  for (let i = 0; i < accResponsive.length; i++) {
    accResponsive[i].addEventListener("click", function () {
      this.classList.toggle("active");
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
 *
 * delete complete task by click(only in responsive)
 * @param {string} id - ticket position in array
 */
function deleteByClick(id) {
 
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

/* var raw = JSON.stringify({
}); */

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
/*   body: raw, */
  redirect: 'follow'
};

  fetch(`http://127.0.0.1:8000/api/todos/${id}/`, requestOptions)
    .then(response => response.text())
    .then(result => 
      {console.log(result),
            allTasks = allTasks.filter(task => task.id !== id); // Element entfernen

    showTickets(); 
    initBoard();}
    )
    .catch(error => console.log('error', error));

     showInResponsive();
  readyForOpenTask();
}

function backToBacklog(id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

  var raw = JSON.stringify({
    "status": "backlog"
  });

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`http://127.0.0.1:8000/api/todos/${id}/`, requestOptions)
    .then(response => response.json())
    .then(result => {console.log(result),
      allTasks = allTasks.filter(task => task.id !== id); // Element entfernen
   
      showTickets(); 
      initBoard();
      })
    .catch(error => console.log('error', error));

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
  console.log('ticketStatus in MoveTicketRight', ticketStatus);

  for (let i = 0; i < taskStatus.length; i++) {
    let element = taskStatus[i];
    if (element == ticketStatus && i < taskStatus.length - 1) {
      data[id]["status"] = taskStatus[i + 1];
      {
        break;
      }
    }
  } 
  // Sende PATCH-Anfrage an das Backend, um den Status zu aktualisieren
 
 showTickets();
  showInResponsive();
  readyForOpenTask();
  saveData(); 
}

/**
 * get the todue and change it in "days left"
 * @param {string} due_date - date of todue
 * @param {string} id - ticket position in array
 * @returns - formated todue date in "days left", or "deadline has come"
 */
function getDate(due_date, id) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date();
  const secondDate = new Date(due_date);

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
  console.log('allTasksInResponsive', allTasks);
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
        <span id="date${id}" class="date">${getDate(currentArray["due_date"],id)}</span>
      </button>
      <div class="panel">
        <div id="iconAreaResponsive${id}" class="iconAreaBoard"></div>
        <span class="description">${currentArray["description"]}</span>
         <div>
            img src="src/img/back-to-backlog.png" title="put it back to Backlog" class="put-to-backlog" onclick="backToBacklog(${id})"></img>
            <div class="arrows">
              <img src="src/img/arrow-icon-left.png" onclick="moveTicketLeft(${id})">
              <img class="click-delete-icon" src="src/img/delete.png" onclick="deleteByClick(${id})">
              <img src="src/img/arrow-icon-right.png" onclick="moveTicketRight(${id})">
            </div>
          </div>
      </div>            
    </div>`;
}
 
function iconFit() {
  let icons = document.getElementsByClassName("user-icon");
  for (let i = 0; i < icons.length; i++) {
    let icon = icons[i];
    icon.classList.add("board-icons");
  }
}

function getAllAssignedUser(currentArray) {
  let allUsers = currentArray["assignedTo"];
  for (let i = 0; i < allUsers.length; i++) {
    let thatUser = allUsers[i];
    return createUserIcon(thatUser);
  }
}

function addIconsToBoard(task, id) {
  let target = document.getElementById("iconArea" + id);

  let allUsers = task["assignedTo"];  

// Fügen Sie Anführungszeichen um die Schlüssel und Werte hinzu
const validJSON = allUsers.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');


// Konvertieren Sie das gültige JSON in ein JavaScript-Array
const usersArray = JSON.parse(`[${validJSON}]`);


/* console.log('allUsers[0]',usersArray[0]); */ // {id: 1, first_name: "Herlina", last_name: "Pfeiffer"}*/
/* console.log('allUsers[1]',usersArray[1] );  */// {id: 10, first_name: "Andre", last_name: "Pfeiffer"}*/ 
 for (let i = 0; i < usersArray.length; i++) {
    let thatUser = usersArray[i];
    target.innerHTML += createUserIcon(thatUser);
  }  
}

function addIconsToBoardInResponsive(task, id) {
  let target = document.getElementById("iconAreaResponsive" + id);
  let allUsers = task["assignedTo"];
  // Fügen Sie Anführungszeichen um die Schlüssel und Werte hinzu
  const validJSON = allUsers.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');


  // Konvertieren Sie das gültige JSON in ein JavaScript-Array
  const usersArray = JSON.parse(`[${validJSON}]`);
  console.log('allUsers[0]',usersArray[0]); // {id: 1, first_name: "Herlina", last_name: "Pfeiffer"}
  console.log('allUsers[1]',usersArray[1] ); /// {id: 10, first_name: "Andre", last_name: "Pfeiffer"}
  for (let i = 0; i < usersArray.length; i++) {
    let thatUser = usersArray[i];
    target.innerHTML += createUserIcon(thatUser);
  } 
}
