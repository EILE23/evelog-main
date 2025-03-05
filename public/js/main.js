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
      alert(`${res.data.message}`);
    } else {
      alert(`${res.data.message}`);
    }
  });
}
