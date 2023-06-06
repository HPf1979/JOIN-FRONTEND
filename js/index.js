let user = [];

async function initIndex() {
    await init();
    await loadUsers();
    await loadEvents();
}


async function loadUsers() {
    user = users;
}

async function loadEvents() {
    var input = document.getElementById("password");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("logInButton").click();
        }
    });
}







function checkForm() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    
        checkForAvailableUser(email.value, password.value)
}


function checkForAvailableUser(email, password) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].email == email && user[i].password == password) {
            welcomePopup(user[i].first_name);
            return;
        }
    }
    wrongInputPopup()
}


function openSignUpPopup() {
    let signUpContainer = document.getElementById('signUpContainer');
    signUpContainer.classList.toggle('d-none');
    document.getElementById('signUpContent').classList.toggle('sign-up-container-animation');
}


async function checkFormSignUp() {
    let firstName = document.getElementById('signUpFirstName');
    let lastName = document.getElementById('signUpLastName');
    let email = document.getElementById('signUpEmail');
    let password = document.getElementById('signUpPassword');
    let color = document.getElementById('colorInput').value;
    let user = [];

    if (firstName.value && lastName.value && email.value && password.value) {
        console.log("Success");
        user = {
            "id": users.length,
            "first_name": firstName.value,
            "last_name": lastName.value,
            "email": email.value,
            "password": password.value,
            "color": color
        };
        console.log(user);
        users.push(user);
        await backend.setItem('users', JSON.stringify(users));
        openSignUpPopup()
        userCreatedPopUp()
    }
}

function setColorPreview() {
    let displayColor = document.getElementById('colorPreview');
    let color =  document.getElementById('colorInput').value;
    displayColor.style.backgroundColor = color;
}


function resetSignUpFields() {
    let firstName = document.getElementById('signUpFirstName');
    let lastName = document.getElementById('signUpLastName');
    let email = document.getElementById('signUpEmail');
    let password = document.getElementById('signUpPassword');
    let color = document.getElementById('colorInput');

    firstName.value = "";
    lastName.value = "";
    email.value = "";
    password.value = "";
    color.value = "";

    firstName.classList.remove('input-green');
    lastName.classList.remove('input-green');
    email.classList.remove('input-green');
    password.classList.remove('input-green');

    firstName.classList.remove('input-red');
    lastName.classList.remove('input-red');
    email.classList.remove('input-red');
    password.classList.remove('input-red');

    firstName.classList.add('input-neutral');
    lastName.classList.add('input-neutral');
    email.classList.add('input-neutral');
    password.classList.add('input-neutral');
}


function userCreatedPopUp() {
    let title = document.getElementById('popupTitle');
    let text = document.getElementById('popupText');
    togglePopup();
    document.getElementById('popupContent').classList.add('open-popup');

    title.innerHTML = 'User created!';
    text.innerHTML = 'You can now log in\nClick to continue';
}


function togglePopup() {
    document.getElementById('popupContainer').classList.toggle('d-none');
}


function welcomePopup(user) {
    let title = document.getElementById('popupTitle');
    let text = document.getElementById('popupText');
    togglePopup();
    document.getElementById('popupContent').classList.add('open-popup');

    title.innerHTML = `Welcome ${user}!`;
    text.innerHTML = '';
    setTimeout(function() {
        window.location.href = "./board.html";
    }, 1000);
}


function wrongInputPopup() {
    let title = document.getElementById('popupTitle');
    let text = document.getElementById('popupText');
    togglePopup();
    document.getElementById('popupContent').classList.add('open-popup');

    title.innerHTML = 'Wrong input!';
    text.innerHTML = 'Wrong e-mail oder password!';
}