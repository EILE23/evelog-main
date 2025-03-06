let userData;

function removeTags(item) {
  return item.replace(/<\/?[^>]+(>|$)/g, ""); // 태그를 모두 제거
}

function categoryGet() {
  axios({
    method: "get",
    url: "/getCategory",
  }).then((res) => {
    const categoryBox = document.querySelector(".categoryBox");
    categoryBox.innerHTML = `<div class = "categoryBtn"><img class = "icon_category"src = "../public/img/circle.png"/>ALL</div>`;
    res.data.category.map((item) => {
      categoryBox.innerHTML += `<div class = "categoryBtn"><img class = "icon_category"src = "../public/img/circle.png"/>${item.name}</div>`;
    });
  });
}

function contentGet() {
  axios({
    method: "get",
    url: "/contentGet",
  }).then((res) => {
    console.log(res.data);
    const mainwrap = document.querySelector(".main-container");

    res.data.map((item) => {
      console.log(item.text);
      mainwrap.innerHTML += `
        <div class = "content-box">
          <img src="${item.img}" />
          <h3>${item.title}</h3>
          <p>${removeTags(item.text).slice(0, 30)}</p>
        </div>
      `;
    });
  });
}

function newWrite() {
  window.location.href = "/write";
}

window.onload = () => {
  categoryGet();
  contentGet();
};
