function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function search() {
  const typing = document.querySelector("input").value;
  axios.post("/write/search", { ty: typing }).then((res) => {});
}

const deboSearch = debounce(search, 500);

document.querySelector("input").addEventListener("input", () => {
  deboSearch;
});

document.querySelector(".input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    innerSearch();
  }
});
function innerSearch() {
  const text = document.querySelector(".input").value;
  const area = document.querySelector("#postsContainer");
  if (text.length > 0) {
    axios.post("/write/searchInput", { text: text }).then((res) => {
      if (res.data.result) {
        let posts = res.data.post;
        area.innerHTML = ``;
        posts.map((post) => {
          if (post.createdAt) {
            const createdAtDate = new Date(post.createdAt);
            const year = createdAtDate.getFullYear();
            const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
            const day = String(createdAtDate.getDate()).padStart(2, "0");
            createdAtText = `${year}년 ${month}월 ${day}일`;
          }
          //   const createdAtParagraph = document.createElement("p");
          //   createdAtParagraph.textContent = `${createdAtText}`;
          //   createdAtParagraph.classList.add("post-created-at"); // Add class for styling
          //   contentTextDiv.appendChild(createdAtParagraph);
          const commentCnt = post.commentCnt ? post.commentCnt : 0;
          const likecnt = post.likecnt ? post.likecnt : 0;
          const img =
            post.imgsrc !== null &&
            post.imgsrc !== undefined &&
            post.imgsrc !== "" &&
            post.imgsrc !== "null"
              ? post.imgsrc
              : "/public/img/noimage.jpeg";
          area.innerHTML += `
        <div class="post-content-container">
        <div class="post-thumbnail">
        <a href="/content/${post.id}"><img src="${img}" /></a>
        </div>
        <div class="post-title">
        ${post.title}
        </div>
        <div class="post-comment">
        ${post.comment}
        </div>
        <div class="post-footer-container">
        <div class="post-created-at">
        ${createdAtText}
        </div>
        <div class="post-comments">
        ${commentCnt}개의 댓글
        </div>
        <div class="post-likes">
        <img src="/public/img/heart.png" />
        ${likecnt}
        </div>
        </div>

        </div>
        `;
        });
      } else {
        area.innerHTML = `<span class = "noText">검색 결과가 없습니다.</span>`;
      }
    });
  } else {
    return;
  }
}
