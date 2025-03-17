let post;
let user;
function search() {
  window.location.href = "/write/search";
}

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

const urlParams = new URLSearchParams(window.location.search);
const hsh = urlParams.get("hsh");

axios
  .get(`/detail/getPost?hsh=${hsh}`)
  .then((res) => {
    if (res.data.result) {
      post = res.data.post;
      axios.get("/checkCookie").then((res) => {
        if (res.data.result) {
          cookieCheck(post, res.data);
        } else {
          let user = null;
          cookieCheck(post, user);
        }
      });
    } else {
      alert(`${res.data.message}`);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    // alert("로그인이 필요합니다.");
    // window.location.href = "/";
  });

function cookieCheck(post, user) {
  const loginWrap = document.querySelector(".navibar");
  if (user) {
    userData = post.email;
    let src = user.src ? user.src : "/public/img/user-thumbnail.png";

    loginWrap.innerHTML = `<div class = "head">
                                        <img class = "logo title"src = "/public/img/iconBanner.jpeg">
                                        <a class = "hA bold" href = "/detail/evelog/?hsh=${
                                          post.vUrl
                                        }">
                                        <span class = "head">${
                                          post.title
                                        }</span>
                                        </a>
                                </div>
            <div class="iconBox">
              <img class="icon alam" onclick="login()" src="/public/img/alam.png" />
              <img class="icon" onclick="search()" src="/public/img/search.png" />
              <button class = "newWrite" onclick = "newWrite()" type = "button">새 글 작성</button>
              <div class="myInfo">
                  <img class="icon_person" src="${src}" />
                  <img class="icon_drop"src="/public/img/arrowdrop.png"/>
                  
                     <div class = "dropdown">
                        <div onclick = "myVelog('${post.vUrl.trim()}')">내 블로그</div>
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
      if (!myInfo.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    });
    myInfo.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
  } else {
    loginWrap.innerHTML = `<div class = "head">
                                      <img class = "logo title"src = "/public/img/iconBanner.jpeg">
                                      <a class = "hA bold" href = "/detail/evelog/?hsh=${post.vUrl}">
                                      <span class = "head">${post.title}</span>
                                      </a>
                              </div>
          <div class="iconBox">
            <img class="icon alam" onclick="login()" src="/public/img/alam.png" />
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
}

function findID() {
  const loginBox = document.querySelector(".loginInput");
  loginBox.classList.add("none");
  document.querySelector(".find-id-wrap").classList.remove("none");
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
  const loginBox = document.querySelector(".loginInput");
  loginBox.classList.add("none");
  document.querySelector(".find-pw-wrap").classList.remove("none");
}

function findPWsubmit() {
  document.querySelector(".find-pw-wrap").classList.add("none");
  const emailR = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let email = document.querySelector(".findPwValue").value;
  if (emailR.test(email)) {
    axios.post("/findPass", { email: email }).then((res) => {
      if (res.data.result) {
        if (res.data.social !== "local") {
          alert(`${res.data.social}로 가입되어 있는 회원입니다.`);
        } else {
          const inBox = document.querySelector(".find-pw-wrap-local");
          inBox.classList.remove("none");
          document.querySelector(".USERID").textContent = `${res.data.id}`;
        }
      } else {
        alert(`${res.data.message}`);
        window.location.reload();
      }
    });
  } else {
    alert("등록되지 않은 이메일입니다.");
  }
}

function findPwChange() {
  let id = document.querySelector(".USERID").textContent;
  id = Number(id);
  document.querySelector(".USERID").textContent = "";
  const passwordR =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=])[A-Za-z\d!@#$%^&*()\-_+=]{8,}$/;
  const password = document.querySelector("input[name ='password2']").value;
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

function loginClose() {
  const a = document.querySelector(".find-pw-wrap-local");
  const b = document.querySelector(".find-pw-wrap");
  const c = document.querySelector(".find-id-wrap");
  const loginBox = document.querySelector(".loginInput");
  a.classList.add("none");
  b.classList.add("none");
  c.classList.add("none");
  loginBox.classList.remove("none");
  const loginBoxBox = document.querySelector(".loginInbox");
  loginBoxBox.classList.remove("active");
  setTimeout(() => {
    document.querySelector(".loginBackground").style.display = "none";
  }, 150);
}
function newWrite() {
  window.location.href = "/write";
}

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

//
//kakaotalk login
//
Kakao.init("9bc00597a75e81014f1853097d2c171f");
function kakaoLogin() {
  const REST_API_KEY = "9bc00597a75e81014f1853097d2c171f"; // 카카오 REST API 키
  const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback"; // 리디렉트 URI
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoLoginUrl; // 로그인 페이지로 이동
}

//구글 로그인
window.handleCredentialResponse = function (response) {
  const payload = decode(response.credential); // credential에 데이터를 받아오네요 google은

  sendGooglelogin(payload.name, payload.email);
};
function decode(id_token) {
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

function myVelog(hsh) {
  window.location.href = `/detail/evelog/?hsh=${hsh.trim()}`;
}

const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");

email.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    checkLogin();
  }
});

password.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    checkLogin();
  }
});
