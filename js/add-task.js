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
    console.log(data);
    user = data; // put user data from Backend in user array
    console.log('user in array', user);
    generateUserSelection(user)})
  .catch(error => console.log('error', error));
}

async function saveTickets(user_profile) {
    
     let assignedUserNames = assignedUser.map(user => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        color: user.color
    }));
    console.log ('assignedUserNames',assignedUserNames)

    let assignedUserNamesString = assignedUserNames.map(user => `{id:${user.id}, first_name: '${user.first_name}', last_name: '${user.last_name}', color: '${user.color}'}`).join(',');

    let json_data = {
        "title": savedData[0],
        "category": savedData[1],
        "description": savedData[2],
        "date": "data",
        "due_date": savedData[4],
        "urgency": savedData[3],
        "status": "backlog",
    
        "assignedTo": assignedUserNamesString,
    };
    console.log('json_data', json_data)
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");

    var raw = JSON.stringify(json_data);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };


    fetch("http://127.0.0.1:8000/api/todos/", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function generateUserSelection() {
    document.getElementById('userSelection').innerHTML = ``;
     for (let i = 0; i < user.length; i++) {
        document.getElementById('userSelection').innerHTML += `
          <div onclick="assignUser(${user[i].id})" id="userSelection${[i]}" class="user-selection-user">
       ${createUserIcon(user[i])}
               <span>${user[i].first_name}</span>
                <span>${user[i].last_name}</span>    
           </div>
        `
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
    console.log('assignedUser is', assignedUser)
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

