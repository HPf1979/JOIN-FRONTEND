function showUserControl() {
    document.getElementById('userOverview').classList.remove('d-none');
}


function showTaskControl() {
    document.getElementById('userOverview').classList.add('d-none');
}


function showUserSelection() {
    let userAmount = user.length;
    document.getElementById('registerUserMenu').classList.add('d-none');
    document.getElementById('userAmountSelection').classList.remove('d-none');
    document.getElementById('userInfo').classList.remove('d-none');
    document.getElementById('userAmountSelection').innerHTML = ``;
    for (let i = 0; i < userAmount; i++) {
        document.getElementById('userAmountSelection').innerHTML += ` <span onclick="showUserInfo(${i})">${i}</span> `;
    }
}


function showUserInfo(id) {
    document.getElementById('userInfo').innerHTML = `
        <br>
        <span><u>User Info:</u></span>
        <span>Id: ${user[id].id}</span>
        <span>1st Name: ${user[id].first_name}</span>
        <span>2nd Name: ${user[id].last_name}</span>
        <span>Email: ${user[id].email}</span>
        <span>img: ${user[id].img}</span>
    `;
}


function showRegisterUser() {
    document.getElementById('userAmountSelection').classList.add('d-none');
    document.getElementById('userInfo').classList.add('d-none');
    document.getElementById('registerUserMenu').classList.remove('d-none');
    
}

async function DEV_saveUser() {
    let userImg = document.getElementById('reg-user_img').value
    user = {
        "id": user.length,
        "first_name": document.getElementById('reg-first_name').value,
        "last_name": document.getElementById('reg-last_name').value,
        "email": document.getElementById('reg-email').value,
        "img": `./src/img/user/${userImg}.png`,
    };
    users.push(user);
    await backend.setItem('users', JSON.stringify(users));
    await loadUsers();
}