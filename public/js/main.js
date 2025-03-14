let userData;
let cate = "all",
  ud = "up";

function removeTags(item) {
  return item.replace(/<\/?[^>]+(>|$)/g, ""); // 태그를 모두 제거
}
function categoryGet() {
  axios({
    method: "get",
    url: "/categories",
  }).then((res) => {
    const categoryBox = document.querySelector(".categoryBox");

    const allBtn = document.createElement("div");
    allBtn.classList.add("categoryBtn");
    allBtn.textContent = "ALL";
    allBtn.onclick = function () {
      const buttons = document.querySelectorAll(".categoryBtn");
      buttons.forEach((button) => {
        button.classList.remove("active");
        button.classList.add("inactive");
      });

      allBtn.classList.add("active");
      allBtn.classList.remove("inactive");

      contentGet("all", ud);
      cate = "all";
    };
    categoryBox.appendChild(allBtn);

    res.data.category.forEach((item) => {
      const categoryBtn = document.createElement("div");
      categoryBtn.classList.add("categoryBtn");
      categoryBtn.textContent = item.name;
      categoryBtn.onclick = function () {
        const buttons = document.querySelectorAll(".categoryBtn");
        buttons.forEach((button) => {
          button.classList.remove("active");
          button.classList.add("inactive");
        });

        categoryBtn.classList.add("active");
        categoryBtn.classList.remove("inactive");

        contentGet(item.id, ud);
        cate = item.id;
      };
      categoryBox.appendChild(categoryBtn);
    });
    allBtn.click();
  });
}

function contentGet(id, ud) {
  axios({
    method: "get",
    url: "/contentGet",
    params: { categoryid: id, ud: ud },
  }).then((res) => {
    const mainwrap = document.querySelector(".main-container");
    mainwrap.innerHTML = ``;
    res.data.map((item) => {
      const nowDate = new Date().toISOString().split("T")[0];
      const contentDate = item.date.split("T")[0];

      const nowTime = new Date(nowDate);
      const contentTime = new Date(contentDate);
      const time = Math.abs(nowTime - contentTime);
      const result = Math.floor(time / 86400000);

      let date =
        result < 5
          ? `${result}일 전`
          : `${contentDate.split("-")[0]}년 ${contentDate.split("-")[1]}월 ${
              contentDate.split("-")[2]
            }일`;

      if (date === `0일 전`) {
        date = "오늘";
      }

      const img =
        item.img !== null &&
        item.img !== undefined &&
        item.img !== "" &&
        item.img !== "null"
          ? item.img
          : "/public/img/noimage.jpeg";
      console.log(img);
      let cnt = item.commentCnt > 0 ? item.commentCnt : 0;
      let lcnt = item.likecnt ? item.likecnt : 0;
      let text = item.text;
      mainwrap.innerHTML += `
        <div class = "content-box" onclick = detailPage(${item.id})>
          <img src=${img} />
          <h3>${item.title}</h3>
          <p>${text}</p>
          <div class = "timeComment">
           <div><div>${date}</div><div>${cnt}개의 댓글</div></div>
          
           <div><img class = "lcnt"src = "/public/img/like_heartfill.png"/><div>${lcnt}</div></div>
          </div>
          <div class = "hr"><hr/></div>
          <div class = "nickname"/><img class = "profileImg"src = "${
            item.nickname.img
              ? item.nickname.img
              : "/public/img/user-thumbnail.png"
          }" /><span class = "profileText">by </span><span class = "profileName">${
        item.nickname.n
      }</span></div>
        </div>
      `;
    });
  });
}

window.onload = () => {
  categoryGet();

  document
    .querySelector(".select")
    .addEventListener("change", function (event) {
      const sV = event.target.value;

      if (sV === "1") {
        ud = "up";
        contentGet(cate, ud);
      } else if (sV === "2") {
        ud = "down";
        contentGet(cate, ud);
      }
    });
};

let arr = JSON.parse(window.localStorage.getItem("readingPage")) || [];

function detailPage(id) {
  window.location.href = `/content/${id}`;
  arr.push(id);
  window.localStorage.setItem("readingPage", JSON.stringify(arr));
}
