let data = JSON.parse(window.localStorage.getItem("readingPage"));

let content = new Set([...data]);

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

window.onload = () => underline(likedBtn);

likedBtn.addEventListener("click", (e) => {
  underline(likedBtn);
  axios.get("/checkCookie").then((res) => {
    if (res.data.result) {
      axios.post("/update/likeP", { id: res.data.id }).then((r) => {
        const likeP = document.querySelector(".content-container");
        r.data.map((item) => {
          likeP.innerHTML += item.title;
        });
      });
    }
  });
});

recentBtn.addEventListener("click", (e) => {
  underline(recentBtn);
  axios.post("/update/recentP", { post: content }).then((res) => {
    if (res.data.result) {
    }
  });
});
