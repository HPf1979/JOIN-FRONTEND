let availableUsers = [];
let taskData = [];

async function initBacklog() {
  await init();
  setData();
  generateTask();
}

function setData() {
  availableUsers = users;
  taskData = data;
}

function openTicket(index) {
  let allTasks = data;
  let task = allTasks[index];
  let ticketExpanded = document.getElementById(`ticketExpanded${index}`);
  document.getElementById(`ticketButton${index}`).classList.add("d-none");
  ticketExpanded.classList.remove("d-none");
  ticketExpanded.classList.add(checkPriority(task));
  expandTicketDetails(index);
}

function closeTicket(index) {
  document.getElementById(`ticketExpanded${index}`).classList.add("d-none");
  document.getElementById(`ticketButton${index}`).classList.remove("d-none");
  closeTicketDetails(index);
  closeEditMode(index);
}

function expandTicketDetails(index) {
  let ticketTitle = document.getElementById(`ticketTitle${index}`);
  let ticketCategory = document.getElementById(`ticketCategory${index}`);
  let ticketDetails = document.getElementById(`ticketDetails${index}`);

  ticketTitle.classList.toggle("ticket-details");
  ticketTitle.classList.toggle("ticket-details-expanded");
  ticketCategory.classList.toggle("ticket-details");
  ticketCategory.classList.toggle("ticket-details-expanded");
  ticketDetails.classList.toggle("ticket-details");
  ticketDetails.classList.toggle("ticket-details-expanded");
  ticketDetails.style.zIndex = 11;
  document.getElementById(`ticketExpanded${index}`).style.zIndex = 10;
}

function closeTicketDetails(index) {
  let ticketDetails = document.getElementById(`ticketDetails${index}`);
  let ticketTitle = document.getElementById(`ticketTitle${index}`);
  ticketDetails.classList.add("ticket-details");
  ticketDetails.classList.remove("ticket-details-expanded");
  ticketTitle.classList.add("ticket-details");
  ticketTitle.classList.remove("ticket-details-expanded");
  ticketDetails.style.zIndex = 9;
  document.getElementById(`ticketExpanded${index}`).style.zIndex = 8;
}

function textShow(content, index) {
  document.getElementById(`textOptions${index}`).innerHTML = content;
  document.getElementById(`textOptions${index}`).classList.toggle("text-anim");
}

function generateTask() {
  document.getElementById("taskContent").innerHTML = ``;
  for (let i = 0; i < taskData.length; i++) {
    let task = taskData[i];
    if (taskData[i].status == "backlog") {
      document.getElementById("taskContent").innerHTML += taskHtml(i);
      document
        .getElementById("ticketButton" + i)
        .classList.add(checkPriority(task));
      renderAssignedUser(i);
      addIconsToBacklog(task, i);
      //renderUserSelection(i);
    }
  }
}

function taskHtml(i) {
  return /*html*/ `
    <div ondblclick="closeTicket(${i})" class="task-ticket-container undraggable">
    <div class="task-ticket" id="taskTicket">
        <div onclick="closeEveryTicketExceptLast(${i})" id="ticketButton${i}" class="ticket-button">
            <span>EXPAND TO EDIT</span>
        </div>
        <div class="ticket-user-img" id="assignedUser${i}">
        </div>
        <div class="d-none" id="userSelection${i}">
        
</div>
        <div id="ticketTitle${i}"  class="ticket-details ticket-title">
            <span>${taskData[i].title}</span>
        </div>
        <div id="ticketCategory${i}" class="ticket-category ticket-details">
            <span>${taskData[i].category}</span>
        </div>
        <div id="ticketDetails${i}" class="ticket-details">
            <span id="ticketDescription${i}">${taskData[i].description}</span>
        </div>
        <div id="ticketExpanded${i}" class="ticket-expanded d-none">
            <div class="expanded-user-settings">
                <div class="user-selection-container">
                    
                </div>
            </div>
            <div class="ticket-options-container">
                <div class="ticket-options">
                    <div class="delete-img-cont" onmouseover="textShow('delete Task', ${i})" 
                            onmouseleave="textShow('choose an option or doubleclick to close details or doubleclick to close expansion', ${i})"
                            onclick="deleteTask(${i})">
                        <img class="delete-img" src="./src/img/delete.png">
                    </div>
                    <div class="send-to-board-img-cont" onmouseover="textShow('move to board', ${i})" 
                            onmouseleave="textShow('choose an option or doubleclick to close expansion', ${i})"
                            onclick="moveTaskToBoard(${i})">
                        <img class="send-to-board-img" src="./src/img/send_to_board.png">
                    </div>
                    <div id="editIconDiv${i}" class="send-to-board-img-cont" onmouseover="textShow('edit task', ${i})" 
                            onmouseleave="textShow('choose an option or doubleclick to close expansion', ${i})"
                            onclick="openEditMode(${i})">
                        <img id="editIcon${i}" class="send-to-board-img" src="./src/img/edit.png">
                        
                    </div>
                    
                </div>
                <div class="responsive-explanation">
                    <span id="textOptions${i}">choose an option or doubleclick to close expansion</span>
                    
                </div>
            </div>
            <div class="expanded-urgency-settings">
                <span></span>
            </div>
        </div>
    </div>
</div>
    `;
}

//function renderUserSelection(index) {
//    document.getElementById(`userSelection${index}`).innerHTML = ``;
//    for (let i = 0; i < availableUsers.length; i++) {
//        document.getElementById(`userSelection${index}`).innerHTML += /*html*/ `
//            <div class="user-selection-user" id="userSelectionItem${index}">
//                <img src="${availableUsers[i].img}">
//                <span>${availableUsers[i].first_name} ${availableUsers[i].last_name}</span>
//            </div>
//        `;
//        showAssignedUserInSelection(index);
//    }
//}

function renderAssignedUser(index) {
  let zIndex = taskData[index].assignedTo.length;
  let left = 0;
  document.getElementById(`assignedUser${index}`).innerHTML = ``;
  if (taskData[index].assignedTo) {
    for (let i = 0; i < taskData[index].assignedTo.length; i++) {
      if (taskData[index].assignedTo) {
        document.getElementById(`assignedUser${index}`).innerHTML += /*html*/ `
                    <!--<img style="left: ${left}px; z-index: ${zIndex};" src="${taskData[index].assignedTo[i].img}">-->
                    <div id="iconArea${index}" class="iconAreaBacklog new-scrollbar">
                    </div>
            `;
        zIndex--;
        left += 32;
      }
    }
  }
}

function addIconsToBacklog(task, id) {
  let target = document.getElementById("iconArea" + id);
  let allUsers = task["assignedTo"];
  for (let i = 0; i < allUsers.length; i++) {
    let thatUser = allUsers[i];
    target.innerHTML += createUserIcon(thatUser);
  }
}

function showAssignedUserInSelection(index) {
  checkIfUserIsAssigned(index);
}

//
function checkIfUserIsAssigned(index) {
  for (let i = 0; i < taskData[index].assignedTo.length; i++) {}
}

function moveTaskToBoard(index) {
  taskData[index].status = "todo";
  saveDataToServer();
  generateTask();
}

async function saveDataToServer() {
  await backend.setItem("tickets", JSON.stringify(taskData));
}

function deleteTask(index) {
  taskData.splice(index, 1);
  resetIdInData();
  generateTask();
  saveDataToServer();
}

function replaceTagDescription(index) {
  document.getElementById(
    `ticketDetails${index}`
  ).innerHTML = `<textarea id="ticketDescription${index}">${taskData[index].description}</textarea>`;
  document
    .getElementById(`ticketDescription${index}`)
    .classList.add("ticket-textarea");
}

function replaceTagCategory(index) {
  document.getElementById(
    `ticketCategory${index}`
  ).innerHTML = `<select id="ticketCategorySelect${index}" name="ticketCategory${index}>
            ${rendertaskCategoryOption()}
        </select>`;
  document
    .getElementById(`ticketCategory${index}`)
    .classList.add("form-category");
}

function replaceTagTitle(index) {
  document.getElementById(
    `ticketTitle${index}`
  ).innerHTML = `<input id="ticketTitleText${index}">`;
  document.getElementById(
    `ticketTitleText${index}`
  ).value = `${taskData[index].title}`;
  document
    .getElementById(`ticketTitle${index}`)
    .classList.add("ticket-title-input");
}

function revertTagDescription(index) {
  document.getElementById(
    `ticketDetails${index}`
  ).innerHTML = `<span id="ticketDescription${index}">${taskData[index].description}</span>`;
  document
    .getElementById(`ticketDescription${index}`)
    .classList.remove("ticket-textarea");
}

function revertTagTitle(index) {
  document.getElementById(
    `ticketTitle${index}`
  ).innerHTML = `<span>${taskData[index].title}</span>`;
  document
    .getElementById(`ticketTitle${index}`)
    .classList.remove("ticket-title-input");
}

function revertTagCategory(index) {
  document.getElementById(
    `ticketCategory${index}`
  ).innerHTML = `<span>${taskData[index].category}</span>`;
  document
    .getElementById(`ticketCategory${index}`)
    .classList.remove("form-category");
}

function openEditMode(index) {
  //addUserSelection(index);
  replaceTagDescription(index);
  replaceTagTitle(index);
  replaceTagCategory(index);
  changeEditIconToSave(index);
}

function addUserSelection(index) {
  let userIcons = document.getElementById("assignedUser" + index);
  let userSelection = document.getElementById("userSelection" + index);
  userIcons.classList.add("d-none");
  userSelection.classList.remove("d-none");
  userSelection.innerHTML = Selection(index);
  addAvailableUsersInSelection(index);
}

function addAvailableUsersInSelection(index) {
  let target = document.getElementById("selection" + index);
  for (let i = 0; i < users.length; i++) {
    let availableUser = users[i];
    let fullName = availableUser["first_name"] + availableUser["last_name"];
    target.innerHTML += `
        <option>${fullName}</option>
        
        `;
  }
}

function Selection(index) {
  return `
    <select id="selection${index}" multiple>
    
    </select>
    `;
}

function closeEditMode(index) {
  revertTagDescription(index);
  revertTagTitle(index);
  revertTagCategory(index);
  revertChangeEditIconToSave(index);
}

function saveChangedTicket(index) {
  getDataFromTicketEdit(index);
  generateTask();
}

function changeEditIconToSave(index) {
  document.getElementById(`editIcon${index}`).src = "./src/img/save.png";
  document
    .getElementById(`editIconDiv${index}`)
    .setAttribute(`onmouseover`, `textShow('save changes', ${index})`);
  document
    .getElementById(`editIconDiv${index}`)
    .setAttribute(`onclick`, `saveChangedTicket(${index})`);
}

function revertChangeEditIconToSave(index) {
  document.getElementById(`editIcon${index}`).src = "./src/img/edit.png";
  document
    .getElementById(`editIconDiv${index}`)
    .setAttribute(`onmouseover`, `textShow('edit task', ${index})`);
  document
    .getElementById(`editIconDiv${index}`)
    .setAttribute(`onclick`, `openEditMode(${index})`);
}

function rendertaskCategoryOption() {
  let options;
  for (let i = 0; i < taskCategories.name.length; i++) {
    options += `
            <option value"${taskCategories.value[i]}">${taskCategories.name[i]}</option>
        `;
  }
  return options;
}

function getDataFromTicketEdit(index) {
  let title = document.getElementById(`ticketTitleText${index}`).value;
  let category = document.getElementById(`ticketCategorySelect${index}`).value;
  let description = document.getElementById(`ticketDescription${index}`).value;
  taskData[index]["title"] = title;
  taskData[index]["category"] = category;
  taskData[index]["description"] = description;
  saveDataToServer();
}

function closeEveryTicketExceptLast(index) {
  sortTicketsInBacklog();
  for (let i = 0; i < sorted.length; i++) {
    closeTicket(sorted[i]);
  }
  openTicket(index);
}

let sorted = [];
function sortTicketsInBacklog() {
  sorted = [];
  for (let i = 0; i < taskData.length; i++) {
    if (taskData[i].status == "backlog") {
      sorted.push(taskData[i].id);
    }
  }
}

/*function editTask() {
   return `
 
 
   <div class="content-container">
            <div class="content-container-title">
                <h1>Add Task</h1>
                <span>Learning Management System Project</span>
            </div>
            <div class="task-container">
                <div class="task-container-content">
                    <form onsubmit="checkForm(); return false">
                        <div class="form-left">
                            <div class="task-title">
                                <label class="title-label">TITLE</label>
                                <input required type="text" id="title" required>
                            </div>
                            <div class="form-category">
                                <label class="title-label">CATEGORY</label>
                                <select required name="Tasks" id="tasks" required>
                                    <option value="">-- Select task --</option>
                                    <option value="management">Management</option>
                                    <option value="programming">Programming</option>
                                    <option value="design">Design</option>
                                </select>
                            </div>
                            <div class="form-description">
                                <label class="title-label">DESCRIPTION</label>
                                <textarea required type="text" id="description" rows="6" required></textarea>
                            </div>
                        </div>
                        <div class="form-right">
                            <div class="form-due-date">
                                <label class="title-label">DUE DATE</label>
                                <input type="date" id="dueTo" required>
                            </div>
                            <div class="form-urgency">
                                <label class="title-label">URGENCY</label>
                                <select name="Tasks" id="urgency" required>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="form-assigned-to">
                                <label class="title-label">ASSIGNED TO</label>
                                <div class="content-assigned-to">
                                    </div>
                                    <div class="assigned-to-user-img">
                                        <img id="userSelectionBtn" onclick="openUserSelection()" class="assigned-to-user-img-add-user" src="./src/img/icon plus.png">
                                        <div>
                                            <div id="assignedUserContainer" class="assigned-user-container"></div>
                                        </div>
                                        <div id="userSelectionContainer" class="user-selection-container d-none">
                                            <div id="userSelection" class="user-selection-content">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="assigned-to-buttons">
                                    <button type="button" onclick="reloadPage()" class="btn-1">CANCEL</button>
                                    <button type="submit" class="btn-2">CREATE TASK</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>   `;
}*/
