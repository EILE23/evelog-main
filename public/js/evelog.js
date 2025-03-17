const urlParam = new URLSearchParams(window.location.search);
const hsh2 = urlParam.get("hsh");

function fetchPosts() {
  axios.post("/update/getmypost", { vUrl: hsh2 }).then((res) => {
    const posts = res.data.post;
    const user = res.data.user;

    const profile = document.getElementById("userContainer");
    const img =
      user.imgsrc !== null &&
      user.imgsrc !== undefined &&
      user.imgsrc !== "" &&
      user.imgsrc !== "null"
        ? user.imgsrc
        : "/public/img/user-thumbnail.png";
    profile.innerHTML = `
        <div class="profileContainer">
        <div class="profilePicture">
        <img src="${img}" />
        </div>
        
        <div class="namesContainer">
        <div class="username">
        ${user.nickname}
        </div>
        <div class="nickname">
        ${user.comment}
        </div>
        </div>
        </div>
    `;

    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    if (!container) {
      console.error("Container element not found.");
      return;
    }

    posts.map((post) => {
      // Created At
      let createdAtText = "Unknown";
      if (post.createdAt) {
        const createdAtDate = new Date(post.createdAt);
        const year = createdAtDate.getFullYear();
        const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
        const day = String(createdAtDate.getDate()).padStart(2, "0");
        createdAtText = `${year}년 ${month}월 ${day}일`;
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

      container.innerHTML += `
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
        <div class="footer-wrap">
        <div class="post-created-at">
        ${createdAtText}
        </div>
        <div class="post-comments">
        ${comments}개의 댓글
        </div>
        <div class="post-likes">
        <img src="/public/img/heart.png" />
        ${likes}
        </div>
        </div>
    
        <div class="buttons-container">
        <div class="edit-button">
        <button onclick = "edit(${post.id})">수정</button>
        </div>
        <div class="delete-button">
        <button onclick = "remove(${post.id})">삭제</button>
        </div>
        </div>
        </div>
        </div>
        `;
    });
  });
}
function remove(id) {
  Swal.fire({
    title: "정말로 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("/update/postDestroy", { id: id }).then((res) => {
        console.log("삭제 성공");
        window.location.href = "/";
      });
    } else {
      return;
    }
  });
}

function edit(id) {
  window.location.href = `/update/edit/?i=${id}`;
}
// Initial fetch
fetchPosts();
