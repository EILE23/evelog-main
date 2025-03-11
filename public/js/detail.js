let post, user;

async function fetchPostDetail(postId) {
  try {
    const response = await axios.get(`/detail/post/${postId}`);
    // ... process the response.data
    // console.log(response.data);
    post = response.data.post;
    user = response.data.user;
    console.log(post, user);
    // Display the post details on the page
    axios.get("/checkCookie").then((res) => {
      axios
        .post("/detail/checkLike", { userid: res.data.id, postid: post.id })
        .then((r) => {
          if (r.data.result) {
            document.querySelector(".heartbox").classList.toggle("like");
          }
        });
    });
    const data = new Date(post.createdAt).toLocaleString().split(".");
    const date = `${data[0]}년 ${data[1]}월 ${data[2]}일`;
    document.getElementById("post-title").textContent = post.title;
    document.getElementById(
      "post-author"
    ).innerHTML = `<div>By <span class = "nickname">${user.nickname}</span> - ${date}</div>`;
    document.getElementById("post-image").src = post.imgsrc;
    document.getElementById("post-content").innerHTML = post.content;
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

window.onload = () => {
  fetchPostDetail(postId);
};

const heartbox = document.querySelector(".heartbox");

document.addEventListener("scroll", (e) => {
  if (window.scrollY !== 0) {
    heartbox.classList.add("heartRight");
  } else {
    heartbox.classList.toggle("heartRight");
  }
});

heartbox.addEventListener("click", () => {
  heartbox.classList.toggle("like");

  const Liked = heartbox.classList.contains("like");

  axios.get("/checkCookie").then((res) => {
    if (res.data.result) {
      if (Liked) {
        axios
          .post("/detail/like", { userid: res.data.id, postid: post.id })
          .then((res) => {
            if (res.data.result) {
              console.log("좋아요 추가 성공");
            } else {
              console.log(res.data);
            }
          });
      } else {
        axios
          .delete("/detail/likeDel", {
            data: { userid: res.data.id, postid: post.id },
          })
          .then((res) => {
            if (res.data.result) {
              console.log("좋아요 취소 성공");
            } else {
              console.log(res.data);
            }
          });
      }
    } else {
      alert("로그인이 필요합니다");
      return;
    }
  });
});
