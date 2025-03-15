const fileInput = document.querySelector(".input_file");
let id;
let data;
function cookieCheck() {
  axios({
    method: "get",
    url: "/checkCookie",
  }).then((res) => {
    if (res.data.result) {
      let userData = res.data.email;
      axios
        .post("/idInfo", { email: userData })
        .then((res) => {
          data = res.data;
          id = res.data.id;
        })
        .then((res) => {
          const editArea = document.querySelector(".editArea");
          const nicknameInput = editArea.querySelector("h4");
          const commentInput = editArea.querySelector("p");
          nicknameInput.innerHTML = `${data.nickname}`;
          commentInput.innerHTML = `${data.comment}`;
          const img_input = document.querySelector(".img_File");
          const titleChange = document.querySelector(".titleChange");
          titleChange.innerHTML = `<h3>${data.title}</h3><div class="titleCbtn btn" onclick="titleChange()">수정</div>`;
          img_input.src = data.imgsrc
            ? data.imgsrc
            : "/public/img/user-thumbnail.png";
        });
    } else {
      console.error(`${res.data.message}`);
    }
  });
}

window.onload = () => {
  cookieCheck();
  loadContent();
};

function fileUpload() {
  fileInput.click();
}

fileInput.addEventListener("change", (event) => {
  function fileChange() {
    let file = event.target.files[0];
    let fileUrl = "/uploads/" + event.target.files[0].name;
    let str = fileUrl.split(".").pop();

    if (str !== "png" && str !== "jpeg" && str !== "jpg") {
      alert("이미지 파일 형식은 png,jpeg,jpg 파일만 가능합니다.");

      return;
    }
    let form = new FormData();
    form.append("file", file);
    form.append("src", fileUrl);
    form.append("id", id);
    axios
      .post("/update/getFile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.result) {
          const img_input = document.querySelector(".img_File");
          if (res.data.src === null) {
            img_input.src = "/public/img/user-thumbnail.png";
            window.location.reload();
          } else {
            img_input.src = res.data.src;
            window.location.reload();
          }
        }
      });
  }
  fileChange();
});

function fileRemove() {
  fileInput.value = "";
  axios
    .delete("/update/delFile", { data: { src: null, id: id } })
    .then((res) => {
      if (res.data.result) {
        window.location.reload();
      } else {
        alert("파일 수정 실패");
      }
    });
}

function editChange() {
  const editArea = document.querySelector(".editArea");
  const nicknameInput = editArea.querySelector("h4");
  const commentInput = editArea.querySelector("p");
  const btnArea = editArea.querySelector(".editBtnArea");
  const nicknameText = nicknameInput.textContent;
  const commentText = commentInput.textContent;

  btnArea.innerHTML = `<div class="editCbtn btn" onclick="editSubmit()">수정완료</div>`;
  nicknameInput.innerHTML = `<input class = "editInput"type = "text" name = "nickname" value = "${nicknameText}"/>`;
  commentInput.innerHTML = `<input class = "editInput" type = "text" name = "comment" value = "${
    commentText ? commentText : "나"
  }"/>`;
}

function editSubmit() {
  const nickname = document.querySelector("input[name='nickname']").value;
  const comment = document.querySelector("input[name='comment']").value;
  const editArea = document.querySelector(".editArea");
  const btnArea = editArea.querySelector(".editBtnArea");
  const nicknameInput = editArea.querySelector("h4");
  const commentInput = editArea.querySelector("p");
  nicknameInput.innerHTML = `${nickname}`;
  commentInput.innerHTML = `${comment}`;
  btnArea.innerHTML = `<div class="editCbtn btn" onclick="editChange()">수정</div`;
  axios.post("/update/updateEdit", {
    nickname: nickname,
    comment: comment,
    id: id,
  });
}

function passChange() {
  const pwInput = document.querySelector(".passwordChange");
  pwInput.innerHTML = `<div class = "passContainer"><input type = "password" name = "pass" /><input type = "password" name = "passChc" />
                        <div class = "btnContainer"><div class = "btn" onclick = "passCancel()">취소</div><div class="passSbtn btn" onclick="passSubmit()">수정완료</div></div></div>`;
}
function passCancel() {
  const pwInput = document.querySelector(".passwordChange");
  pwInput.innerHTML = `<div class="passCbtn btn" onclick="passChange()">수정</div>`;
}

function passSubmit() {
  const passwordR =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=])[A-Za-z\d!@#$%^&*()\-_+=]{8,}$/;

  const pass = document.querySelector("input[name='pass']").value;
  const passChc = document.querySelector("input[name='passChc']").value;

  if (passwordR.test(pass) && pass == passChc) {
    axios.post("/update/updatePass", { password: pass, id: id });
    const pwInput = document.querySelector(".passwordChange");
    pwInput.innerHTML = `<div class="passCbtn btn" onclick="passChange()">수정</div>`;
  } else if (!passwordR.test(pass)) {
    alert("비밀번호는 대소문자, 특수문자 포함 8자리 이상이어야합니다.");
  } else if (pass !== passChc) {
    alert("비밀번호가 다릅니다");
  } else {
    alert("비밀번호가 다릅니다.");
  }
}

function addressChange() {
  axios.get(`/getAddress/${id}`).then((res) => {
    const address = res.data.address.split(":");
    console.log(address);

    if (address.length > 0) {
      const addressDetail = address[2] ? address[2] : "";
      const addressInput = document.querySelector(".addressChange");
      addressInput.innerHTML = `<div class ="addressContainer"><div class = "address_Sub_Container"><input type="text" value ="${address[0]}"onclick="sample4_execDaumPostcode(8)" id="sample4_postcode" placeholder="우편번호" />
            <input
              type="div"
              onclick="sample4_execDaumPostcode(8)"
              value="우편번호 찾기"
              class = "postalCode"
            /><br />
            <input
              type="text"
              name="RoadAddress"
              id="sample4_roadAddress"
              placeholder="도로명주소"
              onclick="sample4_execDaumPostcode(8)"
              value="${address[1]}"
            />
            <span id="guide" style="color: #999; display: none"></span>
            <input
              type="text"
              name="detailAddress"
              id="sample4_detailAddress"
              placeholder="상세주소"
              value="${addressDetail}"
            /></div> <div class = "btnContainer"><div class = "btn" onclick = "addressCancel()">취소</div><div class="addressSbtn btn" onclick="addressSubmit()">
              수정완료
            </div></div></div>`;
    } else {
      const addressInput = document.querySelector(".addressChange");
      addressInput.innerHTML = `<div class ="addressContainer"><div class = "address_Sub_Container"><input type="text" onclick="sample4_execDaumPostcode(8)" id="sample4_postcode" placeholder="우편번호" />
            <input
              type="div"
              onclick="sample4_execDaumPostcode(8)"
              value="우편번호 찾기"
              class = "postalCode"
            /><br />
            <input
              type="text"
              name="RoadAddress"
              id="sample4_roadAddress"
              placeholder="도로명주소"
              onclick="sample4_execDaumPostcode(8)"
            />
            <span id="guide" style="color: #999; display: none"></span>
            <input
              type="text"
              name="detailAddress"
              id="sample4_detailAddress"
              placeholder="상세주소"
            /> </div><div class = "btnContainer"><div class = "btn" onclick = "addressCancel()">취소</div><div class="addressSbtn btn" onclick="addressSubmit()">
              수정완료
            </div></div></div>`;
    }
  });
}
function addressCancel() {
  const addressInput = document.querySelector(".addressChange");
  addressInput.innerHTML = ` <div class="addressCbtn btn" onclick="addressChange()">
              정보 등록
            </div>`;
}
function addressSubmit() {
  const pAddress = document.querySelector("#sample4_postcode").value;
  const dAddress = document.querySelector(
    "input[name = 'detailAddress']"
  ).value;
  const rAddress = document.querySelector("input[name = 'RoadAddress']").value;
  const address = pAddress + ":" + rAddress + ":" + dAddress;

  axios.post("/update/updateAddress", { address: address, id: id });
  alert("등록이 완료되었습니다.");
  const addressInput = document.querySelector(".addressChange");
  addressInput.innerHTML = ` <div class="addressCbtn btn" onclick="addressChange()">
              정보 등록
            </div>`;
}

function sample4_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var roadAddr = data.roadAddress; // 도로명 주소 변수
      var extraRoadAddr = ""; // 참고 항목 변수

      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }

      if (data.buildingName !== "" && data.apartment === "Y") {
        extraRoadAddr +=
          extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
      }

      if (extraRoadAddr !== "") {
        extraRoadAddr = " (" + extraRoadAddr + ")";
      }

      document.getElementById("sample4_postcode").value = data.zonecode;
      document.getElementById("sample4_roadAddress").value = roadAddr;
    },
  }).open();
}

function titleChange() {
  const titleInput = document.querySelector(".titleChange");
  const titleText = titleInput.querySelector("h3");
  titleInput.innerHTML = `<input type = "text" name = "title" value = "${titleText.textContent}" />
                          <div class="titleSbtn btn" onclick="titleSubmit()">수정완료</div>`;
}

function titleSubmit() {
  const titleInput = document.querySelector("input[name='title']").value;
  axios.post("/update/updateTitle", { title: titleInput, id: id }).then(() => {
    const titleChange = document.querySelector(".titleChange");
    titleChange.innerHTML = `<h3>${titleInput}</h3><div class="titleCbtn btn" onclick="titleChange()">수정</div>`;
  });
}

function userDestroy() {
  Swal.fire({
    title: "정말로 탈퇴하시겠습니까?",
    text: "회원을 탈퇴하게 되면 작성했던 글은 모두 사라지게됩니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "탈퇴에 성공했습니다!",
        icon: "success",
      });
      axios.get("/logout").then((res) => {
        axios
          .post("/update/userDestroy", { email: data.email, des: true })
          .then((res) => {
            if (res.data.result) {
              localStorage.removeItem("com.naver.nid.oauth.state_token");
              setTimeout(() => {
                window.location.href = "/";
              }, 500);
            } else {
              alert(`res.data.message`);
            }
          });
      });
    }
  });
}

const loadContent = () => {
  setTimeout(() => {
    const body = document.querySelector("body");

    body.classList.remove("blurred-text");
  }, 120);
};

function phoneChange() {
  const phoneBox = document.querySelector(".phoneChange");
  phoneBox.innerHTML = `<div class = "phoneContainer"><input type = "text" name = "phone" placeholder = "휴대폰 번호를 입력해주세요."/>
                        <div class = "btnContainer"><div class = "btn" onclick = "phoneCancel()">취소</div><div class="passSbtn btn" onclick="phoneSubmit()">등록</div></div></div>`;
}

function phoneSubmit() {
  const phoneR = /-/g;
  const phone = document.querySelector("input[name = 'phone']").value;

  if (!phoneR.test(phone) && phone.length !== 11) {
    alert("올바른 휴대폰 번호 형식을 입력해주세요");
  } else {
    axios
      .post("/update/updatePhone", {
        phone: phone,
        id: id,
      })
      .then((res) => {
        const phoneBox = document.querySelector(".phoneChange");
        phoneBox.innerHTML = `<div class="btn" onclick="phoneChange()">수정</div>`;
      });
  }
}

function phoneCancel() {
  const phoneBox = document.querySelector(".phoneChange");
  phoneBox.innerHTML = `<div class="btn" onclick="phoneChange()">수정</div>`;
}
