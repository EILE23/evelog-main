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
            <button class = "newWrite" onclick = "newWrite()" type = "button">새 글 작성</button>
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
        const myInfo = document.querySelector(".myInfo");
        const dropdown = document.querySelector(".dropdown");
        document.addEventListener("click", (event) => {
          if (
            !myInfo.contains(event.target) &&
            !dropdown.contains(event.target)
          ) {
            dropdown.classList.remove("show");
          }
        });
        myInfo.addEventListener("click", () => {
          dropdown.classList.toggle("show");
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
            <button class = "newWrite" onclick = "newWrite()" type = "button">새 글 작성</button>
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
        const myInfo = document.querySelector(".myInfo");
        const dropdown = document.querySelector(".dropdown");
        document.addEventListener("click", (event) => {
          if (
            !myInfo.contains(event.target) &&
            !dropdown.contains(event.target)
          ) {
            dropdown.classList.remove("show");
          }
        });
        myInfo.addEventListener("click", () => {
          dropdown.classList.toggle("show");
        });
      } else if (res.data.social == "google") {
        userData = res.data.email;
        let src = res.data.src
          ? res.data.src
          : "/public/img/user-thumbnail.png";

        loginWrap.innerHTML = `<div class="title">evelog</div>
          <div class="iconBox">
            <img class="icon" onclick="login()" src="/public/img/alam.png" />
            <img class="icon" onclick="search()" src="/public/img/search.png" />
            <button class = "newWrite" onclick = "newWrite()" type = "button">새 글 작성</button>
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
        const myInfo = document.querySelector(".myInfo");
        const dropdown = document.querySelector(".dropdown");
        document.addEventListener("click", (event) => {
          if (
            !myInfo.contains(event.target) &&
            !dropdown.contains(event.target)
          ) {
            dropdown.classList.remove("show");
          }
        });
        myInfo.addEventListener("click", () => {
          dropdown.classList.toggle("show");
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
            <input class="findInput findIdValue" type = "text" placeholder = "휴대폰 번호를 입력해주세요"/>
            <button class = "findButton" onclick = "findIDsubmit()"type = "button">찾기</button>
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
  <div class="find"><input class="findInput findPwValue" type = "text" placeholder = "이메일을 입력해주세요"/>
  <button class = "findButton"onclick = "findPWsubmit()"type = "button">찾기</button></div>`;
}

function findPWsubmit() {
  const emailR = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let email = document.querySelector(".findPwValue").value;
  if (emailR.test(email)) {
    axios.post("/findPass", { email: email }).then((res) => {
      if (res.data.result) {
        if (res.data.social !== "local") {
          alert(`${res.data.social}로 가입되어 있는 회원입니다.`);
        } else {
          const loginBox = document.querySelector(".loginInbox");
          loginBox.innerHTML = ` <div class="close" onclick="loginClose()">x</div>
        <div><h3>비밀번호 변경</h3><input class = "findInput"type = "password" name = "password" />
        <input class = "findInput"type = "passcheck" name = "passchc"/>
        <button class = "findButton"onclick = "findPwChange(${res.data.id})"type = "button">변경하기</button></div>`;
        }
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
          <input
            name="password"
            class="textInput textInputPassword"
            type="password"
          />
          <div class="socialBtnBox">
            <div id="naverIdLogin"></div>
             <div id="googleLogin"></div>
          </div>
          <div class="findBox">
            <span onclick="findID()">아이디 찾기</span
            ><span onclick="findPW()">비밀번호 찾기</span>
          </div>

          <div class="joinText">
            아직 회원이 아니신가요? <a href="/join">회원가입</a>
          </div>`;
    naverLogin.init();
    window.google.accounts.id.renderButton(
      document.getElementById("googleLogin"),
      {
        type: "icon",
        theme: "outline",
        size: "large",
      }
    );
  }, 300);
}

function newWrite() {
  window.location.href = "/write";
}

//네이버 로그인
const naverLogin = new naver.LoginWithNaverId({
  clientId: "Q5BIVkykzWdlsrohoFLp",
  callbackUrl: "http://localhost:3000/check",
  buttonType: 2,
  loginButton: { color: "green", type: 1, height: 40 },
});

naverLogin.init();

function naverLogout() {
  naverLogin.logout();
  axios({
    method: "get",
    url: "/logout",
  });
  window.location.href = "/";
}

//구글 로그인
window.handleCredentialResponse = function (response) {
  const payload = decode(response.credential); // credential에 데이터를 받아오네요 google은

  sendGooglelogin(payload.name, payload.email);
};

//google은 data를 jwt형식으로 주기 때문에 decoding이 필요함
function decode(id_token) {
  console.log(id_token);
  const base64Url = id_token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

//data 보내는 곳
function sendGooglelogin(name, email) {
  axios.post("/idcheck", { email: email }).then((res) => {
    if (!res.data.result) {
      axios.post("/accessToken", { email: email }).then((res) => {
        window.location.reload();
      });
    } else {
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
          const udata = { name: name, email: email, social: "google" };
          axios.post("/joinData", { userInfo: udata }).then((res) => {
            window.location.href = "/join";
          });
        } else {
          axios({
            method: "get",
            url: "/logout",
          }).then((res) => (window.location.href = "/"));
        }
      });
    }
  });
}
