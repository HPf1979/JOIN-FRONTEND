setURL("https://gruppe-256.developerakademie.net/smallest_backend_ever"); 
let data = [];
let users = [];

let taskCategories = {
  value: ["0", "management", "programming", "design"],
  name: ["none", "management", "programming", "design"],
};

async function init() {
await downloadBackend();
await includeHTML();  
  currentPage();
  resetIdInData();
}

function openDevTools() {
  document.getElementById("devTools").classList.toggle("d-none");
}



// Mini Backend
async function downloadBackend() {
  await downloadFromServer();
  data = JSON.parse(backend.getItem("tickets")) || [];
  users = JSON.parse(backend.getItem("users")) || [];
}

// Mini Backend end

async function includeHTML() {
  let includeElements = document.querySelectorAll("[include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("include-html");
    let response = await fetch(file);
    if (response.ok) {
      element.innerHTML = await response.text();
    } else {
      element.innerHTML = "404 Page not found";
    }
  }
}  

function currentPage() {
  let activePage = window.location.pathname;
  console.log(activePage);

  if (activePage.includes("board")) {
    document.getElementById("boardId").classList.add("nav-active");
  }
  if (activePage.includes("backlog")) {
    document.getElementById("backlogId").classList.add("nav-active");
  }
  if (activePage.includes("add-task")) {
    document.getElementById("addTaskId").classList.add("nav-active");
  }
  if (activePage.includes("help")) {
    document.getElementById("helpId").classList.add("nav-active");
  }
}

/**
 * for bugfixing, reset the data[i]['id'].
 *
 */
function resetIdInData() {
  for (let i = 0; i < data.length; i++) {
    let element = data[i];
    element["id"] = i;
  }
}

let navbarState = false;
function showNavbar() {
  document.getElementById("menubar").classList.toggle("hide-mobile");
  document.getElementById("menubar").classList.add("navbar-animation");
  if (navbarState == true) {
    document.getElementById("menuButton").src = "./src/img/menu.svg";
    navbarState = false;
  } else {
    document.getElementById("menuButton").src = "./src/img/x_white.png";
    navbarState = true;
  }
}

function closeNavbar() {
  document.getElementById("menubar").classList.add("hide-mobile");
}

/**
 *
 *
 *
 * @param {Array} currentUser - the userarray with all important informations
 * @returns the usericon as HTML
 * get the first letters of the first and lastname and the color to create a usericon
 */
function createUserIcon(currentUser) {
  let firstName = currentUser.first_name;
  let secondName = currentUser.last_name;
  let firstLetter = firstName.charAt(0).toUpperCase();
  let secondLetter = secondName.charAt(0).toUpperCase();
  return `
    <div class="user-icon small-icon ${currentUser["color"]}" id="userIcon${currentUser.id}">
        <span class="first-letter">${firstLetter}</span>
        <span class="second-letter">${secondLetter}</span>
    </div>
        `;
}

function changeIcon(firstLetter, secondLetter) {
  let userIcon = document.getElementById("userIcon");
  userIcon.innerHTML = ``;
  userIcon.classList.add(useColor());
  userIcon.innerHTML += `
    <span class="first-letter">${firstLetter}</span>
    <span class="second-letter">${secondLetter}</span>
    `;
}

function useColor() {
  let usedColor = document.getElementById("iconColor").value;
  return usedColor;
}

/**
 * check the urgency for choosing the border-color
 *
 */
function checkPriority(currentArray) {
  priority = currentArray["urgency"];
  if (priority == "low") {
    return "low-task";
  }
  if (priority == "medium") {
    return "medium-task";
  }
  if (priority == "high") {
    return "high-task";
  }
}

//function setColor() {
//    let allIcons = document.getElementsByClassName('user-icon');
//    for (let i = 0; i < allIcons.length; i++) {
//        let icon = allIcons[i];
//        icon.classList.add()
//        console.log(icon);
//    }
//
//
//}
