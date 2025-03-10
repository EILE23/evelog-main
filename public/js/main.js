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
      console.log(nowDate, contentDate);
      const nowTime = new Date(nowDate);
      const contentTime = new Date(contentDate);
      const time = Math.abs(nowTime - contentTime);
      const result = Math.floor(time / 86400000);
      console.log(item.date);
      let date =
        result < 5
          ? `${result}일 전`
          : `${contentDate.split("-")[0]}년 ${contentDate.split("-")[1]}월 ${
              contentDate.split("-")[2]
            }일`;

      if (date === `0일 전`) {
        date = "오늘";
      }
      console.log(result);

      const img = item.img ? item.img : "/public/img/brokenimg.png";
      console.log(img);

      mainwrap.innerHTML += `
        <div class = "content-box" onclick = detailPage(${item.id})>
          <img src="${img}" />
          <h3>${item.title}</h3>
          <p>${removeTags(item.text).slice(20, 70)}</p>
          <div>${date}</div>
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

function detailPage(id) {
  window.location.href = `/content/${id}`;
}
