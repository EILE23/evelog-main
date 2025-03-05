let userData;
function logout() {
  axios({
    method: "get",
    url: "/logout",
  }).then((res) => {
    cookieCheck();
  });
}
function login() {
  const loginWrap = document.querySelector(".loginBackground");
  const loginBox = document.querySelector(".loginInbox");

  loginWrap.style.display = "block";
  setTimeout(() => {
    loginBox.classList.add("active");
  }, 10);
}
function loginClose() {
  const loginWrap = document.querySelector(".loginBackground");
  const loginBox = document.querySelector(".loginInbox");

  loginBox.classList.remove("active");
  setTimeout(() => {
    loginWrap.style.display = "none";
  }, 300);
}

function checkLogin() {
  const email = document.querySelector("input[name='email']").value;
  const password = document.querySelector("input[name='password']").value;

  axios({
    method: "post",
    url: "/login",
    data: { email: email, password: password },
  }).then((res) => {
    if (res.data.result) {
      window.location.reload();
    } else {
      alert(`${res.data.message}`);
    }
  });
}

function cookieCheck() {
  axios({
    method: "get",
    url: "/checkCookie",
  }).then((res) => {
    const loginWrap = document.querySelector(".navibar");
    if (res.data.result) {
      userData = res.data.email;
      loginWrap.innerHTML = `<div class="title">evelog</div>
        <div class="iconBox">
          <img class="icon" onclick="login()" src="../public/img/alam.png" />
          <img class="icon" onclick="login()" src="../public/img/search.png" />
          <button class = "newWrite" onclick = "newWrite()" type = "button">새글작성</button>
          
          <div class="myInfo">
             <img class="icon_person" src="../public/img/user-thumbnail.png" />
             <img class="icon_drop"src="../public/img/arrowdrop.png"/>
                 <div class = "dropdown">
                   <div>내 정보</div>
                   <div>찜한 목록</div>
                   <div>설정</div>
                   <div>검색</div>
                 </div>
          </div>

        </div>`;
    } else {
      console.error(`${res.data.message}`);
      loginWrap.innerHTML = `<div class="title">evelog</div>
        <div class="iconBox">
          <img class="icon" onclick="login()" src="../public/img/alam.png" />
          <img class="icon" onclick="login()" src="../public/img/search.png" />
          <img class="icon" onclick="login()" src="../public/img/menu.png" />

          <button class="loginBtn" type="button" onclick="login()">
            로그인
          </button>
        </div>`;
    }
  });
}

window.onload = () => {
  cookieCheck();
};
