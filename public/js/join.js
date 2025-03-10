const passwordR =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=])[A-Za-z\d!@#$%^&*()\-_+=]{8,}$/;
const emailR = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneR = /-/g;
let checkArea = Array(7).fill(false);
//조건
let userData; // social login시 넣을 데이터

function dataOn() {
  const form = document.forms["data"];
  const formdata = new FormData(form);
  const some = !checkArea.some((i) => i === false);

  if (some) {
    axios({
      method: "post",
      url: "/getData",
      data: formdata,
    }).then((res) => {
      if (res.data.result) {
        window.location.href = "/";
      } else {
        alert(`${res.data.message}`);
      }
    });
  } else {
    alert("올바른 형식으로 작성해주세요.");
    return;
  }
}

//중복검사 함수
function redundancy(num) {
  const userId = document.querySelector("input[name='userid']").value;
  if (!emailR.test(userId)) {
    alert("올바른 형식의 이메일이 아닙니다.");
    checkArea[Number(num)] = false;
    return;
  } else {
    checkArea[Number(num)] = true;
  }

  axios({
    method: "post",
    url: "/idCheck",
    data: { email: userId },
  }).then((res) => {
    if (res.data.result) {
      alert(`${res.data.message}`);
    } else {
      alert(`${res.data.message}`);
    }
  });
}

//onkeyup
function textCheck(input, type, num) {
  if (type === "email") {
    const errorP = input.parentElement.querySelector(".errorCode");
    if (!emailR.test(input.value) && input.value.length > 0) {
      checkArea[Number(num)] = false;
      errorP.textContent = "올바른 형식이 아닙니다.";
    } else {
      checkArea[Number(num)] = true;
      errorP.textContent = "";
    }
  }
  if (type === "pass") {
    const errorP = input.parentElement.querySelector(".errorCode");
    if (!passwordR.test(input.value) && input.value.length > 0) {
      errorP.textContent =
        "비밀번호는 대소문자특수문자 숫자 포함 8자리 이상이어야 합니다.";
      checkArea[Number(num)] = false;
    } else {
      checkArea[Number(num)] = true;
      errorP.textContent = "";
    }
  }
  if (type === "passCheck") {
    const errorP = input.parentElement.querySelector(".errorCode");
    const pass = document.querySelector("input[name='password']").value;
    if (pass !== input.value && input.value.length > 0) {
      errorP.textContent = "비밀번호가 다릅니다.";
      checkArea[Number(num)] = false;
    } else {
      checkArea[Number(num)] = true;
      errorP.textContent = "";
    }
  }
  if (type === "name") {
    const errorP = input.parentElement.querySelector(".errorCode");
    if (input.value.length > 0) {
      checkArea[Number(num)] = true;
    } else {
      checkArea[Number(num)] = false;
    }
  }
  if (type === "nickname") {
    const errorP = input.parentElement.querySelector(".errorCode");
    if (input.value.length > 0) {
      checkArea[Number(num)] = true;
    } else {
      checkArea[Number(num)] = false;
    }
  }
  if (type === "age") {
    const errorP = input.parentElement.querySelector(".errorCode");
    if (input.value.length > 0) {
      checkArea[Number(num)] = true;
    } else {
      checkArea[Number(num)] = false;
    }
  }
  if (type === "phone") {
    const errorP = input.parentElement.querySelector(".errorCode");
    const phoneNumber = input.value.replace(phoneR, "");
    console.log(phoneNumber.length);
    if (input.value.length > 0 && phoneNumber.length == 11) {
      checkArea[Number(num)] = true;
      errorP.textContent = "";
    } else {
      checkArea[Number(num)] = false;
      errorP.textContent = "올바른 휴대폰 번호 형식이 아닙니다.";
    }
  }
  console.log(checkArea);
}

//social 로그인시 사용하는 onclick
function join(social) {
  const nickname = document.querySelector("input[name='nickname']").value;

  if (nickname.length == 0) {
    alert("닉네임을 입력해주세요.");
  } else {
    axios
      .post("/getData", {
        userid: userData.email,
        nickname: nickname,
        name: userData.name,
        gender: userData.gender,
        social: social,
        age: new Date().getFullYear() - Number(userData.birthyear),
      })
      .then((res) => {
        axios.get("/logout").then((res) => {
          naverLogin.logout();
          window.location.href = "/";
        });
      });
  }
}

const naverLogin = new naver.LoginWithNaverId({
  clientId: "Q5BIVkykzWdlsrohoFLp",
  callbackUrl: "http://localhost:3000/join/check",
  buttonType: 2,
  loginButton: { color: "green", type: 1, height: 40 },
});

naverLogin.init();

function userInfo() {
  axios.get("/userGet").then((res) => {
    if (res.data.social == "naver") {
      userData = res.data;
      console.log(userData);
      const form = document.querySelector(".main-wrap");
      form.innerHTML = `<div>
      별명
      <input
        type="text"
        name="nickname"
      />
      <p class="errorCode"></p>
    </div><button type = "button" onclick = "join('naver')">가입하기</button>`;
    } else if (res.data.social == "google") {
      userData = res.data;
      console.log(userData);
      const form = document.querySelector(".main-wrap");
      form.innerHTML = `<div>
      별명
      <input
        type="text"
        name="nickname"
      />
      <p class="errorCode"></p>
    </div><button type = "button" onclick = "join('google')">가입하기</button>`;
    } else {
      return;
    }
  });
}

userInfo();

window.handleCredentialResponse = function (response) {
  console.log("handleCredentialResponse 호출");
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
        alert("이미 가입되어 있는 회원입니다.");
        window.location.href = "/";
      });
    } else {
      const udata = { name: name, email: email, social: "google" };
      axios.post("/joinData", { userInfo: udata }).then((res) => {
        window.location.href = "/join";
      });
    }
  });
}
