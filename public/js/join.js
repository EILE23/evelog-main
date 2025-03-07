const passwordR =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=])[A-Za-z\d!@#$%^&*()\-_+=]{8,}$/;
let userData;
const emailR = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneR = /-/g;
let checkArea = Array(7).fill(false);
//본 예제에서는 도로명 주소 표기 방식에 대한 법령에 따라, 내려오는 데이터를 조합하여 올바른 주소를 구성하는 방법을 설명합니다.
function sample4_execDaumPostcode(num) {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var roadAddr = data.roadAddress; // 도로명 주소 변수
      var extraRoadAddr = ""; // 참고 항목 변수

      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== "" && data.apartment === "Y") {
        extraRoadAddr +=
          extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraRoadAddr !== "") {
        extraRoadAddr = " (" + extraRoadAddr + ")";
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("sample4_postcode").value = data.zonecode;
      document.getElementById("sample4_roadAddress").value = roadAddr;

      // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.

      //   var guideTextBox = document.getElementById("guide");
      // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
      //   if (data.autoRoadAddress) {
      //     var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
      //     guideTextBox.innerHTML = "(예상 도로명 주소 : " + expRoadAddr + ")";
      //     guideTextBox.style.display = "block";
      //   } else {
      //     guideTextBox.innerHTML = "";
      //     guideTextBox.style.display = "none";
      //   }
    },
  }).open();
  checkArea[Number(num)] = true;
}

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

function userInfo() {
  axios.get("/userGet").then((res) => {
    if (res.data !== null) {
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
    </div><button type = "button" onclick = "join()">가입하기</button>`;
    }
  });
}
function join() {
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
        social: "naver",
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

userInfo();

const naverLogin = new naver.LoginWithNaverId({
  clientId: "TszMj1_6QxbXSBEx3B5e",
  callbackUrl: "http://localhost:3000/join",
  buttonType: 2,
  loginButton: { color: "green", type: 1, height: 40 },
});

naverLogin.init();
naverLogin.getLoginStatus(function (status) {
  if (status) {
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
        axios.get("/logout").then((res) => {
          axios.post("/joinData", { userInfo });
        });
      } else {
        alert("이미 가입되어 있는 회원입니다.");
        naverLogin.logout();
        window.location.href = "/";
      }
    });
  }
});
