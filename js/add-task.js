let taskData = [];
let check = '';
let savedData = [];
let user = [];
let assignedUser = [];

async function initAddTask() {
    await init();
    await loadUsers();
    generateUserSelection();
    getActuallyDate();
}

async function loadUsers() {
    user = users;
}

async function saveTickets() {
    let json_data = {
        "id": data.length,
        "title": savedData[0],
        "category": savedData[1],
        "description": savedData[2],
        "date": "data",
        "dueTo": savedData[4],
        "urgency": savedData[3],
        "status": "backlog",
        "assignedTo": assignedUser,
    };
    data.push(json_data);
/*     await backend.setItem('tickets', JSON.stringify(data)); */

    //NEU NEW ADDED
        // Code zum Senden der Daten an das Backend (POST-Anfrage)
    fetch('/api/todos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json_data),
    })
      .then(response => response.json())
      .then(result => {   
        console.log(result);
      })
      .catch(error => {
        console.error(error);
      });
}


function generateUserSelection() {
    document.getElementById('userSelection').innerHTML = ``;
    for (let i = 0; i < user.length; i++) {


        document.getElementById('userSelection').innerHTML += /*html*/ `
            <div onclick="assignUser(${user[i].id})" id="userSelection${[i]}" class="user-selection-user">
                ${createUserIcon(user[i])}
                <span>${user[i].first_name}</span>
                <span>${user[i].last_name}</span>
            </div>
        `;

    //setColor(user[i]);
        
    if (assignedUser.includes(user[i])) {
            document.getElementById(`userSelection${i}`).classList.add('user-selection-user-selected');
        }

    }
}


function getData() { //reading value from input fields
    let arr = ['title', 'tasks', 'description', 'urgency', 'dueTo'];
    for (let i = 0; i < arr.length; i++) {
        taskData[i] = document.getElementById(arr[i]);
        savedData.push(taskData[i].value)
    }
    //return;
}


function saveData() {
    if (check == 'success') {
        saveTickets();
    } else {
        console.log('failed to save data')
    }
}


function checkForm() {
    getData();
    let popupText = document.getElementById('popupText');
    let popupTitle = document.getElementById('popupTitle');
   for (let i = 0; i < taskData.length; i++) {
       if (taskData[i].value == '') {
           fail(i);
           popupFailed(popupText, popupTitle);
           check = 'failed';
       } if (!taskData[i].value == '') {
           success(i);
           openPopup();
           popupSuccess(popupText, popupTitle);
           check = 'success';
       }
   }
    saveData(taskData);
}


function fail(i) {
    taskData[i].classList.remove('green-border');
    taskData[i].classList.add('red-border');
    return;
}


function success(i) {
    taskData[i].classList.remove('red-border');
    taskData[i].classList.add('green-border');
}


function popupFailed(popupText, popupTitle) {
    popupTitle.innerHTML = `Failed!`;
    popupTitle.classList.add('red-text');
    popupTitle.classList.remove('green-text');
    popupText.innerHTML = `Please fill in the missing fields!`;
    return;
}


function popupSuccess(popupText, popupTitle) {
    popupTitle.innerHTML = `Success!`;
    popupTitle.classList.add('green-text');
    popupTitle.classList.remove('red-text');
    popupText.innerHTML = `Task successfully added to <a id="linkToBacklog" href="backlog.html">backlog</a>!`;
    return;
}


function openPopup() {
    document.getElementById('popup').classList.remove('d-none');
}


function closePopup() {
    document.getElementById('popup').classList.add('d-none');
    if (check == 'success') {
        reloadPage();
    }
}


function reloadPage() {
    document.location.reload(true);
}


let openCheck = false;
function openUserSelection() {
    if (openCheck == true) {
        closeUserSelection();
        openCheck = false;
        document.getElementById('userSelectionBtn').classList.remove('rotate45')
    } else {
        document.getElementById('userSelectionContainer').classList.remove('d-none');
        openCheck = true;
        document.getElementById('userSelectionBtn').classList.add('rotate45')
    }
}


function closeUserSelection() {
    document.getElementById('userSelectionContainer').classList.add('user-selection-container-closed');
    setTimeout(function () {
        document.getElementById('userSelectionContainer').classList.add('d-none');
        document.getElementById('userSelectionContainer').classList.remove('user-selection-container-closed');
    }, 500);
}


function assignUser(userId) {
    let filtered = user.filter(function (ele) {
        return ele.id == userId;
    });

    for (let i = 0; i < assignedUser.length; i++) {
        let selection = assignedUser[i];
        if (userId == selection.id) {
            assignedUser.splice(i, 1);
            generateAssignedUser();
            generateUserSelection();
            return;
        }
    }
    assignedUser.push(filtered[0]);
    generateAssignedUser();
    generateUserSelection();
}


function generateAssignedUser() {
    let assign = document.getElementById('assignedUserContainer');
    let username;
    clearAssignedUser();
    if (assignedUser) {
        for (let i = 0; i < assignedUser.length; i++) {
            username = assignedUser[i].first_name + "<br>" + assignedUser[i].last_name;
            let currentUser = assignedUser[i];
            assign.innerHTML += `
            <div id="assignedUser${i}" class="assigned-user">
            </div> 
            `;
            document.getElementById('assignedUser' + i).innerHTML += createUserIcon(currentUser);
            document.getElementById('assignedUser' + i).innerHTML += `<span>${username}</span>`;
            //setColor(currentUser);

            
        }
    }
}


function clearAssignedUser() {
    document.getElementById('assignedUserContainer').innerHTML = '';
}

function getActuallyDate() {
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("dueTo").value = y + "-" + m + "-" + d;
}

