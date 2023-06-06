function openBigImg(subject) {
  if (subject == "img1") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
          <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/login.JPG" style="height:70%; cursor:pointer" alt="Log-in">
         </div>
        `;
  } else if (subject == "img2") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/signup.JPG" style="width:400px; cursor:pointer" alt="SignUp">
          </div>
         `;
  } else if (subject == "img3") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/addTask_resp.JPG" style="height:100%;margin-top:50px; cursor:pointer"alt="AddTask">
          </div>
         `;
  } else if (subject == "img4") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/backlog-big.JPG" style="height:28%;margin-top:50px; cursor:pointer"alt="Backlog">
          </div>
         `;
  } else if (subject == "img5") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/backlog_resp.JPG" style="height:35%;margin-top:50px; cursor:pointer"alt="Backlog">
          </div>
         `;
  } else if (subject == "img6") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/edit-big.JPG" style="height:40%;margin-top:50px; cursor:pointer"alt="Backlog">
          </div>
         `;
  } else if (subject == "img7") {
    document.getElementById("imgBig").classList.add("overlay-bg");
    document.getElementById("imgBig").classList.remove("d-none");
    document.getElementById("imgBig").innerHTML = /*html*/ `
           <div onclick="closeImgBig()" class="overlay-imgBig">      
          <img src="src/img/board-responsive.JPG" style="height:45%;margin-top:50px; cursor:pointer"alt="Backlog">
          </div>
         `;
  }
}

function closeImgBig() {
  document.getElementById("imgBig").classList.remove("overlay-imgBig");
  document.getElementById("imgBig").classList.add("d-none");
}
