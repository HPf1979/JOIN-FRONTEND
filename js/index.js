async function initIndex() {
    await init();
    await loadUsers();
    await loadEvents();
}

async function loadUsers() {
   var myHeaders = new Headers();
    myHeaders.append("Cookie", "csrftoken=zyCgLVAO3oj5XUfvl0E7IzMGbrv6ZneD");
    
    // Sending an inquiry to backend with the url/endpoint to get the users
    var formdata = new FormData();

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

fetch("http://127.0.0.1:8000/api/users/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

async function loadEvents() {
    var input = document.getElementById("password");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {   //clicking Enter key will also able login
            event.preventDefault();
            document.getElementById("logInButton").click();
        }
    });
}

function checkForm() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
        checkForAvailableUser(email, password)
}

async function checkForAvailableUser(email, password) {
    var myHeaders = new Headers();
    myHeaders.append("X-CSRFToken", "2tvACqL5g2X0Q1nyTvrbawfSd16yRBun");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "csrftoken=2tvACqL5g2X0Q1nyTvrbawfSd16yRBun; sessionid=8eo2wtjvyuj9guwk41sniwf8qpx7ezak");

    var raw = JSON.stringify({
        "username": email,
        "password": password
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/login/", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('data', data);
             if (data.token) {
                const first_name = data.first_name; 
                welcomePopup(first_name);
            } else {
                wrongInputPopup();
            }  
        })
        .catch(error => console.log('error', error));
}

// Funktion zum Abrufen des CSRF-Tokens aus dem Cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* async function checkForAvailableUser(email, password) {
    const { url, csrfToken } = window.djangoReverse('api-login');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-CSRFToken", csrfToken);

    var raw = JSON.stringify({
        "username": email,
        "password": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.token) {
                const first_name = data.first_name;
                welcomePopup(first_name);
            } else {
                wrongInputPopup();
            }
        })
        .catch(error => console.log('error', error));
} */

function openSignUpPopup() {
    let signUpContainer = document.getElementById('signUpContainer');
    signUpContainer.classList.toggle('d-none');
    document.getElementById('signUpContent').classList.toggle('sign-up-container-animation');
}

async function checkFormSignUp() {
    let firstName = document.getElementById('signUpFirstName').value;
    let lastName = document.getElementById('signUpLastName').value;
    let email = document.getElementById('signUpEmail').value;
    let password = document.getElementById('signUpPassword').value;
    let color = document.getElementById('colorInput').value; 

    if (firstName && lastName && email && password) {
        console.log("Success");
    
        var myHeaders = new Headers();
        myHeaders.append("X-CSRFToken", "2tvACqL5g2X0Q1nyTvrbawfSd16yRBun");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "csrftoken=2tvACqL5g2X0Q1nyTvrbawfSd16yRBun; sessionid=8eo2wtjvyuj9guwk41sniwf8qpx7ezak");

        var raw = JSON.stringify({
        "color": color,
        "user": {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "password": "mona"
            }
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };


        fetch("http://127.0.0.1:8000/api/signup/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
        openSignUpPopup();
        userCreatedPopUp(); 
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

function welcomePopup(first_name) {
    let title = document.getElementById('popupTitle');
    let text = document.getElementById('popupText');
    togglePopup();
    document.getElementById('popupContent').classList.add('open-popup');

    title.innerHTML = `Welcome ${first_name}!`;
    text.innerHTML = '';
    setTimeout(function() {
        window.location.href = "./board.html";
    }, 1500); 
}

function wrongInputPopup() {
    let title = document.getElementById('popupTitle');
    let text = document.getElementById('popupText');
    togglePopup();
    document.getElementById('popupContent').classList.add('open-popup');

    title.innerHTML = 'Wrong input!';
    text.innerHTML = 'Wrong e-mail oder password!';
}