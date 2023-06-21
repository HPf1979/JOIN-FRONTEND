let availableUsers = [];
let taskData = [];

async function initBacklog() {
  await init();
  await setData();
  await loadUsers() 
  generateTask();

}

async function loadUsers() {
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

  var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };

  fetch("http://127.0.0.1:8000/api/users/", requestOptions)
  .then(response => response.json())
  .then(data => {
    availableUsers = data;}) 
  .catch(error => console.log('error', error));
}

async function setData() {
    const backlog = 'backlog'; // Statuswert für den Backlog
 try {
    const response = await fetch(`http://127.0.0.1:8000/api/todos/?status=${backlog}`);
    const data = await response.json();
    taskData = data;
   console.log('taskData', taskData);  
      
  } catch (error) {
    console.log('Error:', error);
  }  
}

function openTicket(index) {
  let allTasks = taskData;
  console.log('allTasks', allTasks);
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
   
   if (task.status == "backlog") {
      document.getElementById("taskContent").innerHTML += taskHtml(i);
      document
        .getElementById("ticketButton" + i)
        .classList.add(checkPriority(task));
      renderAssignedUser(i);
       id = task.id;
          addIconsToBacklog(task, id,i); 
    }
  }
}

function taskHtml(i) {
  let task = taskData[i];
  return /*html*/ `
    <div ondblclick="closeTicket(${i})" class="task-ticket-container undraggable">
    <div class="task-ticket" id="taskTicket">
        <div onclick="closeEveryTicketExceptLast(${i})" id="ticketButton${i}" class="ticket-button">
            <span>EXPAND TO EDIT</span>
        </div>
        <div class="ticket-user-img" id="assignedUser${i}">
        </div>
        <div class="d-none" id="userSelection${i}"> </div>
        <div id="ticketTitle${i}"  class="ticket-details ticket-title">
            <span>${task.title}</span>
        </div>
        <div id="ticketCategory${i}" class="ticket-category ticket-details">
            <span>${task.category}</span>
        </div>
        <div id="ticketDetails${i}" class="ticket-details">
            <span id="ticketDescription${i}">${task.description}</span>
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
// with the zIndex one can be sure that the users will be shown in 
// correct sequence if they overlap or are next to each other
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

function addIconsToBacklog(task,id,i) {
  let target = document.getElementById("iconArea" + i);
  let allUsers = task["assignedTo"]; 

  // add quotes around the keys and values
  const validJSON = allUsers.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');

  // Convert the valid JSON to a JavaScript array
  const usersArray = JSON.parse(`[${validJSON}]`);

  /*console.log('allUsers[0]',usersArray[0]); // {id: 1, first_name: "Herlina", last_name: "Pfeiffer"}*/
  /*console.log('allUsers[1]',usersArray[1]/* ); // {id: 10, first_name: "Andre", last_name: "Pfeiffer"}*/ 

  for (let i = 0; i < usersArray.length; i++) {
    let thatUser = usersArray[i];
    let firstName = thatUser.first_name;
    target.innerHTML += createUserIcon(thatUser);  
  } 
}

function createUserIcon(currentUser) {
  let firstName = currentUser.first_name;
  let secondName = currentUser.last_name;
  let firstLetter = firstName.charAt(0).toUpperCase();
  let secondLetter = secondName.charAt(0).toUpperCase();
  return `
    <div class="user-icon small-icon" id="userIcon">
        <span class="first-letter">${firstLetter}</span>
        <span class="second-letter">${secondLetter}</span>
    </div>
        `; 
}

function showAssignedUserInSelection(index) {
  checkIfUserIsAssigned(index);
}

function checkIfUserIsAssigned(index) {
  for (let i = 0; i < taskData[index].assignedTo.length; i++) {}
}

function moveTaskToBoard(index) {
  const task = taskData[index];
  const taskId = task.id;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

  var raw = JSON.stringify({
  "status": "todo"
  });

  var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
  };

  fetch(`http://127.0.0.1:8000/api/todos/statusUpdate/${taskId}/`, requestOptions)
  .then(response => response.text())
  .then(result => {console.log(result),
     console.log('revised allTasks', taskData );
    })
  .catch(error => console.log('error', error));
  
  taskData.splice(index, 1);
  generateTask()

} 

function deleteTask(index) {
  const task = taskData[index];
  const taskId = task.id;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

  var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
  };

  fetch(`http://127.0.0.1:8000/api/todos/${taskId}/`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  taskData.splice(index, 1);
  generateTask()
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
 
  const task = taskData[index];
  const taskId = task.id;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

  var raw = JSON.stringify({
  "title": title,
  "category": category,
  "description": description
  });

  var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
  };

  fetch(`http://127.0.0.1:8000/api/todos/update/${taskId}/`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

function closeEveryTicketExceptLast(index) {
  for (let i = 0; i < taskData.length; i++) {
    closeTicket(i);
  }
  openTicket(index);  
} 
