function infoPage() {
  window.location.href = "/infoPage";
}
function likePage() {
  window.location.href = "/likePage";
}

function logout() {
  axios({
    method: "get",
    url: "/logout",
  }).then((res) => {
    cookieCheck();
    window.location.href = "/";
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
      if (res.data.social === "local" || res.data.social === null) {
        userData = res.data.email;
        let src = res.data.src
          ? res.data.src
          : "/public/img/user-thumbnail.png";

        loginWrap.innerHTML = `<div class="title">evelog</div>
          <div class="iconBox">
            <img class="icon" onclick="login()" src="/public/img/alam.png" />
            <img class="icon" onclick="search()" src="/public/img/search.png" />
            <button class = "newWrite" onclick = "newWrite()" type = "button">새글작성</button>
            <div class="myInfo">
                <img class="icon_person" src="${src}" />
                <img class="icon_drop"src="/public/img/arrowdrop.png"/>
                
                   <div class = "dropdown">
                      <div onclick = "infoPage()">내 정보</div>
                      <div onclick = "likePage()">읽기 목록</div>
                      <div onclick = "search()">검색</div>
                      <div onclick = "logout()">로그아웃</div>
                   </div>
            </div>
  
          </div>`;
        const head = document.querySelector(".title");
        head.addEventListener("click", () => {
          window.location.href = "/";
        });
      } else if (res.data.social == "naver") {
        userData = res.data.email;
        let src = res.data.src
          ? res.data.src
          : "/public/img/user-thumbnail.png";

        loginWrap.innerHTML = `<div class="title">evelog</div>
          <div class="iconBox">
            <img class="icon" onclick="login()" src="/public/img/alam.png" />
            <img class="icon" onclick="search()" src="/public/img/search.png" />
            <button class = "newWrite" onclick = "newWrite()" type = "button">새글작성</button>
            <div class="myInfo">
                <img class="icon_person" src="${src}" />
                <img class="icon_drop"src="/public/img/arrowdrop.png"/>
                
                   <div class = "dropdown">
                      <div onclick = "infoPage()">내 정보</div>
                      <div onclick = "likePage()">읽기 목록</div>
                      <div onclick = "search()">검색</div>
                      <div onclick = "naverLogout()">로그아웃</div>
                   </div>
            </div>
  
          </div>`;
        const head = document.querySelector(".title");
        head.addEventListener("click", () => {
          window.location.href = "/";
        });
      }
    } else {
      console.error(`${res.data.message}`);
      loginWrap.innerHTML = `<div class="title">evelog   </div>
          <div class="iconBox">
            <img class="icon" onclick="login()" src="/public/img/alam.png" />
            <img class="icon" onclick="search()" src="/public/img/search.png" />
            <button class="loginBtn" type="button" onclick="login()">
              로그인
            </button>
          </div>`;
      const head = document.querySelector(".title");
      head.addEventListener("click", () => {
        window.location.href = "/";
      });
    }
  });
}

function findID() {
  const loginBox = document.querySelector(".loginInbox");

  loginBox.innerHTML = ` <div class="close" onclick="loginClose()">x</div>
        <div class="find">
            <input class="findIdValue" type = "text" placeholder = "휴대폰 번호를 입력해주세요"/>
            <button onclick = "findIDsubmit()"type = "button">아이디 찾기</button>
        </div>`;
}
function findIDsubmit() {
  const phoneR = /-/g;
  let phone = document.querySelector(".findIdValue").value;
  phone = phone.replace(phoneR, "");

  if (phone.length !== 11) {
    alert("올바른 형식의 휴대폰 번호가 아닙니다.");
    window.location.href = "/";
    return;
  } else {
    axios.post("/findEmail", { phone: phone }).then((res) => {
      if (res.data.result) {
        alert(`해당하는 이메일은 ${res.data.email} 입니다.`);
        window.location.reload();
      } else {
        alert("등록되지 않은 번호입니다.");
        window.location.reload();
      }
    });
  }
}

function findPW() {
  const loginBox = document.querySelector(".loginInbox");

  loginBox.innerHTML = ` <div class="close" onclick="loginClose()">x</div>
  <div class="find"><input class="findPwValue" type = "text" placeholder = "이메일을 입력해주세요"/>
  <button onclick = "findPWsubmit()"type = "button">아이디 찾기</button></div>`;
}

function findPWsubmit() {
  const emailR = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let email = document.querySelector(".findPwValue").value;
  if (emailR.test(email)) {
    axios.post("/findPass", { email: email }).then((res) => {
      if (res.data.result) {
        const loginBox = document.querySelector(".loginInbox");
        loginBox.innerHTML = ` <div class="close" onclick="loginClose()">x</div>
        <div><h3>비밀번호 변경</h3><input type = "password" name = "password" />
        <input type = "passcheck" name = "passchc"/>
        <button onclick = "findPwChange(${res.data.id})"type = "button">변경하기</button></div>`;
      } else {
        alert(`${res.data.message}`);
        window.location.reload();
      }
    });
  } else {
    alert("등록되지 않은 이메일입니다.");
    window.location.href = "/";
  }
}

function findPwChange(id) {
  const passwordR =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=])[A-Za-z\d!@#$%^&*()\-_+=]{8,}$/;
  const password = document.querySelector("input[name ='password']").value;
  const passchc = document.querySelector("input[name='passchc']").value;
  if (passwordR.test(password) && password == passchc) {
    axios.post("/passwordChange", { pw: password, id: id }).then((res) => {
      if (res.data.result) {
        alert("비밀번호 변경이 완료되었습니다.");
        window.location.reload();
      } else {
        alert(`${res.data.message}`);
      }
    });
  } else if (password !== passchc) {
    alert("동일한 비밀번호를 입력해주세요.");
  } else {
    alert("비밀번호는 대소문자특수문자 숫자 포함 8자리 이상이어야 합니다. ");
  }
}

cookieCheck();

function loginClose() {
  const loginWrap = document.querySelector(".loginBackground");
  const loginBox = document.querySelector(".loginInbox");

  loginBox.classList.remove("active");
  setTimeout(() => {
    loginWrap.style.display = "none";
    loginBox.innerHTML = `
        <div class="loginInput">
          <div class="close" onclick="loginClose()">x</div>
          <h2>로그인</h2>

          <div class="email-text">
            <input
              class="textInput"
              placeholder="이메일을 입력하세요"
              type="text"
              name="email"
            /><button onclick="checkLogin()">로그인</button>
          </div>
          <input name="password" class="textInput" type="password" />
            <div onclick="naverInit()" id="naverIdLogin"></div>
          <div class="findBox">
            <span onclick="findID()">아이디 찾기</span
            ><span onclick="findPW()">비밀번호 찾기</span>
          </div>

          <div>아직 회원이 아니신가요? <a href="/join">회원가입</a></div>`;
    naverLogin.init();
  }, 300);
}

function newWrite() {
  window.location.href = "/write";
}

const naverLogin = new naver.LoginWithNaverId({
  clientId: "TszMj1_6QxbXSBEx3B5e",
  callbackUrl: "http://localhost:3000/check",
  buttonType: 2,
  loginButton: { color: "green", type: 1, height: 40 },
});

naverLogin.init();
naverLogin.getLoginStatus(function (status) {
  if (status) {
    console.log("status", status);
    const userInfo = {
      email: naverLogin.user.getEmail(),
      age: naverLogin.user.getAge(),
      birthyear: naverLogin.user.getBirthyear(),
      gender: naverLogin.user.getGender() === "M" ? "남자" : "여자",
      name: naverLogin.user.getName(),
      social: "naver",
    };
    axios.post("/idCheck", { email: userInfo.email }).then((res) => {
      if (res.data.result) {
        console.log("data", res.data.result);
        Swal.fire({
          text: "회원이 아니시네요",
          title: "회원가입 하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "green",
          cancelButtonColor: "#black",
          confirmButtonText: "YES",
        }).then((result) => {
          if (result.isConfirmed) {
            axios.post("/joinData", { userInfo }).then((res) => {
              if (res.data.result) {
                window.location.href = "/join";
              } else {
                console.log(res.data.error);
              }
            });
          } else {
            naverLogin.logout();
            axios({
              method: "get",
              url: "/logout",
            }).then((res) => (window.location.href = "/"));
          }
        });
      } else {
        axios
          .post("/accessToken", { email: userInfo.email })
          .then((res) => cookieCheck());
      }
    });
  }
});
function naverLogout() {
  naverLogin.logout();
  axios({
    method: "get",
    url: "/logout",
  });
  window.location.href = "/";
}

//
//kakaotalk login
//
function kakaoLogin() {
  window.location.href = "/auth/kakao";
}

function getUserInfo() {
  axios
    .get("/auth/user")
    .then((response) => {
      if (response.data.user) {
        // User is logged in, no need for messages
      } else {
        // User is not logged in, no need for messages
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

getUserInfo();

function logout() {
  axios
    .get("/auth/logout")
    .then(() => {
      window.location.href = "/"; // Redirect to home page
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}
