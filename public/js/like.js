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
  likedBtn.click();
};

likedBtn.addEventListener("click", () => {
  underline(likedBtn);
  likedBtn.style.color = "black";
  recentBtn.style.color = "grey";

  axios.get("/checkCookie").then((res) => {
    if (res.data.result) {
      axios.post("/write/likeP", { id: res.data.id }).then((likedPages) => {
        console.log(likedPages.data);
        const likedPosts = likedPages.data;
        const likedContainer = document.querySelector(".likedPagesContainer");
        const recentContainer = document.querySelector(".recentPagesContainer");

        likedContainer.classList.remove("hidden"); // Show liked
        recentContainer.classList.add("hidden"); // Hide recent

        likedContainer.innerHTML = ``;
        likedPosts.map((post) => {
          //createdAt
          let createdAtText = "Unknown";
          if (post.createdAt) {
            const createdAtDate = new Date(post.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - createdAtDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              createdAtText = "1일전";
            } else if (diffDays > 1 && diffDays < 5) {
              createdAtText = `${diffDays}일 전`;
            } else if (diffDays === 0) {
              createdAtText = "오늘";
            } else {
              const year = createdAtDate.getFullYear();
              const month = String(createdAtDate.getMonth() + 1).padStart(
                2,
                "0"
              );
              const day = String(createdAtDate.getDate()).padStart(2, "0");
              createdAtText = `${year}년 ${month}월 ${day}일`;
            }
          }

          const img =
            post.imgsrc !== null &&
            post.imgsrc !== undefined &&
            post.imgsrc !== "" &&
            post.imgsrc !== "null"
              ? post.imgsrc
              : "/public/img/noimage.jpeg";

          const likes =
            post.likecnt !== null &&
            post.likecnt !== undefined &&
            post.likecnt !== "" &&
            post.likecnt !== "null"
              ? post.likecnt
              : "0";

          const comments =
            post.commentCnt !== null &&
            post.commentCnt !== undefined &&
            post.commentCnt !== "" &&
            post.commentCnt !== "null"
              ? post.commentCnt
              : "0";

          likedContainer.innerHTML += `
          <div class = "content-box" onclick = detailPage(${post.id})>
          <img src=${img} />
          <h3>${post.title}</h3>
          <p>${post.comment}</p>
          <div class = "timeComment"><div>${createdAtText}</div><div>${comments}개의 댓글</div></div>
          <div class = "hr"><hr/></div>
           </div>
          `;
        });
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
    const recentContainer = document.querySelector(".recentPagesContainer");
    const likedContainer = document.querySelector(".likedPagesContainer");

    recentContainer.classList.remove("hidden"); // Show recent
    likedContainer.classList.add("hidden"); // Hide liked

    const recentPosts = res.data;
    console.log("localhost saved pages", recentPosts);

    recentContainer.innerHTML = ``;
    recentPosts.map((post) => {
      //createdAt
      let createdAtText = "Unknown";
      if (post.createdAt) {
        const createdAtDate = new Date(post.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdAtDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          createdAtText = "1일전";
        } else if (diffDays > 1 && diffDays < 5) {
          createdAtText = `${diffDays}일 전`;
        } else if (diffDays === 0) {
          createdAtText = "오늘";
        } else {
          const year = createdAtDate.getFullYear();
          const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
          const day = String(createdAtDate.getDate()).padStart(2, "0");
          createdAtText = `${year}년${month}월${day}일`;
        }
      }

      const img =
        post.imgsrc !== null &&
        post.imgsrc !== undefined &&
        post.imgsrc !== "" &&
        post.imgsrc !== "null"
          ? post.imgsrc
          : "/public/img/noimage.jpeg";

      const likes =
        post.likecnt !== null &&
        post.likecnt !== undefined &&
        post.likecnt !== "" &&
        post.likecnt !== "null"
          ? post.likecnt
          : "0";

      const comments =
        post.commentCnt !== null &&
        post.commentCnt !== undefined &&
        post.commentCnt !== "" &&
        post.commentCnt !== "null"
          ? post.commentCnt
          : "0";

      recentContainer.innerHTML += `
      <div class = "content-box" onclick = detailPage(${post.id})>
      <img src=${img} />
      <h3>${post.title}</h3>
      <p>${post.comment}</p>
      <div class = "timeComment"><div>${createdAtText}</div><div>${comments}개의 댓글</div></div>
      <div class = "hr"><hr/></div>
       </div>
      `;
    });
  });
});

function detailPage(id) {
  window.location.href = `/content/${id}`;
}
