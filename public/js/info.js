const fileInput = document.querySelector(".input_file");
let id;
function cookieCheck() {
  axios({
    method: "get",
    url: "/checkCookie",
  }).then((res) => {
    if (res.data.result) {
      let userData = res.data.email;
      axios.post("/idInfo", { email: userData }).then((res) => {
        console.log(res.data);
        id = res.data.id;
      });
    } else {
      console.error(`${res.data.message}`);
    }
  });
}

window.onload = () => {
  cookieCheck();
};

function fileUpload() {
  fileInput.click();
}

fileInput.addEventListener("change", (event) => {
  function fileChange() {
    let file = event.target.files[0];
    let fileUrl = "/uploads/" + event.target.files[0].name;
    let form = new FormData();
    form.append("file", file);
    form.append("src", fileUrl);
    form.append("id", id);
    axios
      .post("/getFile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.result) {
          const img_input = document.querySelector(".img_File");
          if (res.data.src === null) {
            img_input.src = "/public/img/user-thumbnail.png";
          } else {
            img_input.src = res.data.src;
          }
        }
      });
  }
  fileChange();
});

function fileRemove() {
  fileInput.value = "";
  axios.delete("/delFile", { data: { src: null, id: id } }).then((res) => {
    if (res.data.result) {
      window.location.reload();
    } else {
      alert("파일 수정 실패");
    }
  });
}
