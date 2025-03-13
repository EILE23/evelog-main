let data = JSON.parse(window.localStorage.getItem("readingPage"));

const likedBtn = document.getElementById("likedBtn");
const recentBtn = document.getElementById("recentBtn");
const underLine = document.getElementById("underLine");

// 초기 설정: 첫 번째 버튼에 언더라인을 위치시키기
const underline = (button) => {
  const buttonRect = button.getBoundingClientRect();
  underLine.style.width = `${buttonRect.width}px`;
  underLine.style.left = `${
    buttonRect.left - button.offsetParent.getBoundingClientRect().left
  }px`;
};

window.onload = () => {
  underline(likedBtn);
};

likedBtn.addEventListener("click", () => {
  underline(likedBtn);
  likedBtn.style.color = "black";
  recentBtn.style.color = "grey";
  axios.get("/checkCookie").then((res) => {
    if (res.data.result) {
      axios.post("/write/likeP", { id: res.data.id }).then((r) => {
        console.log(r.data);
      });
    }
  });
});

recentBtn.addEventListener("click", (e) => {
  underline(recentBtn);
  likedBtn.style.color = "grey";
  recentBtn.style.color = "black";
  let content = new Set([...data]);
  axios.post("/write/recentP", { post: content }).then((res) => {
    console.log(res.data);
  });
});
