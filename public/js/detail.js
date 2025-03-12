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
      if (res.data.result) {
        axios
          .post("/detail/checkLike", { userid: res.data.id, postid: post.id })
          .then((r) => {
            if (r.data.result) {
              document.querySelector(".heartbox").classList.toggle("like");
            }
          });
      }
    });
    axios.get("/checkCookie").then((res) => {
      axios.post("/detail/commentRequest", { postid: post.id }).then((r) => {
        const cArea = document.querySelector(".commentarea");

        r.data.comments.map((v) => {
          if (v.parentid === null) {
            if (v.nickname === res.data.nickname) {
              cArea.innerHTML += `<div class = "commentBox"><div>${v.nickname}
                          <p>${v.content} </p>
                          <button  class = "reply-btn" onclick = "replyComment(${v.id},this)">대댓글</button><button class = "reply-btn"onclick = "removeComment()">삭제</button>
                          <div class = "comment-replyArea${v.id} replyArea"></div>
                      </div></div>`;
            } else {
              cArea.innerHTML += `<div class = "commentBox"><div>${v.nickname}
                          <p>${v.content} </p>
                          <button  class = "reply-btn" onclick = "replyComment(${v.id},this)">대댓글</button>
                          <div class = "comment-replyArea${v.id} replyArea"></div>
                      </div>`;
            }
          } else {
            const area = document.querySelector(
              `.comment-replyArea${v.parentid}`
            );
            if (area) {
              if (v.nickname === res.data.nickname) {
                area.innerHTML += `<div class = "commentBox"><div>${v.nickname}<p>${v.content} </p><button class = "reply-btn" onclick = "replyRComment(${v.parentid},this)">대대댓글</button><div class = "comment-replyArea-replyArea${v.parentid}"><button class = "reply-btn"onclick = "removeComment()">삭제</button></div></div>`;
              } else {
                area.innerHTML += `<div class = "commentBox"><div>${v.nickname}<p>${v.content} </p><button class = "reply-btn" onclick = "replyRComment(${v.parentid},this)">대대댓글</button><div class = "comment-replyArea-replyArea${v.parentid}"></div></div>`;
              }
            } else {
              const rarea = document.querySelector(
                `.comment-replyArea-replyArea${v.parentid}`
              );
              if (rarea) {
                if (v.nickname === res.data.nickname) {
                  rarea.innerHTML += `<div class = "commentBox"><div>${v.nickname}<p>${v.content} </p><button class = "reply-btn" onclick = "replyRComment(${v.id},this)">대대댓글</button><div class = "comment-replyArea-replyArea${v.id}"><button class = "reply-btn"onclick = "removeComment()">삭제</button></div></div>`;
                } else {
                  rarea.innerHTML += `<div class = "commentBox"><div>${v.nickname}<p>${v.content} </p><button class = "reply-btn" onclick = "replyRComment(${v.id},this)">대대댓글</button><div class = "comment-replyArea-replyArea${v.id}"></div></div>`;
                }
              }
            }
          }
        });
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
    console.error("error", error);
  }
}

const heartbox = document.querySelector(".heartbox");

function updateHeartBox() {
  if (window.scrollY !== 0) {
    heartbox.classList.add("heartRight");
  } else {
    heartbox.classList.remove("heartRight");
  }
}

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
function scroll() {
  return (
    document.documentElement.scrollHeight >
    document.documentElement.clientHeight
  );
}
window.onload = () => {
  fetchPostDetail(postId);
  if (scroll()) {
    updateHeartBox();
  } else {
    heartbox.classList.add("heartRight");
  }
  document.addEventListener("scroll", updateHeartBox);
};

function commentSubmit() {
  const commentText = document.querySelector("textarea").value;

  axios.get("/checkCookie").then((res) => {
    if (res.data.result && commentText.length > 0) {
      const userid = res.data.id;
      const postid = post.id;
      const content = commentText;
      const nickname = res.data.nickname;
      document.querySelector("textarea").value = "";
      axios
        .post("/detail/commentPush", {
          userid: userid,
          postid: postid,
          content: content,
          nickname: nickname,
        })
        .then((res) => {
          console.log(res.data);
          const cArea = document.querySelector(".commentarea");
          cArea.innerHTML += `<div class = "commentBox"><div>${res.data.comments.nickname}
                                  <p>${res.data.comments.content} </p>
                                  <button class = "reply-btn" onclick = "replyComment(${res.data.comments.id},this)">대댓글</button>
                                  <div class = "comment-replyArea${res.data.comments.id} replyArea"></div>
                              </div></div>`;
        });
    } else if (content.length === 0) {
      return;
    } else {
      alert("로그인 후 이용 가능합니다.");
    }
  });
}
let replychc = false;
function replyComment(id) {
  if (replychc === false) {
    const area = document.querySelector(`.comment-replyArea${id}`);
    replychc = true;
    area.innerHTML += `<input class = "replyInput${id}" type = "text"/><button class = "replyBtn${id} reply-btn"onclick = "replySubmit(${id})">작성</button>`;
  } else {
    return;
  }
}
function replyRComment(id) {
  if (replychc === false) {
    const area = document.querySelector(`.comment-replyArea-replyArea${id}`);
    replychc = true;
    area.innerHTML += `<input class = "replyInput${id}" type = "text"/><button class = "replyBtn${id} reply-btn"onclick = "replyRSubmit(${id})">작성</button>`;
  } else {
    return;
  }
}
function replySubmit(id) {
  if (replychc === true) {
    const area = document.querySelector(`.comment-replyArea${id}`);
    const input = document.querySelector(`.replyInput${id}`);
    const btn = document.querySelector(`.replyBtn${id}`);
    const commentText = input.value;
    const postid = post.id;
    axios.get("/checkCookie").then((res) => {
      if (res.data.result) {
        console.log(userData);
        axios
          .post("/detail/commentPush", {
            userid: res.data.id,
            postid: postid,
            content: commentText,
            nickname: res.data.nickname,
            parentid: id,
          })
          .then((res) => {
            replychc = false;
            input.remove();
            btn.remove();
            area.innerHTML += `<div class = "commentBox"><div>${res.data.comments.nickname}<p>${res.data.comments.content} </p><button class = "reply-btn"onclick = "replyRComment(${res.data.comments.id},this)">대대댓글</button><div class = "comment-replyArea-replyArea${res.data.comments.id}"></div></div></div>`;
          });
      } else {
        alert("로그인 후 이용가능합니다.");
      }
    });
  }
}
function replyRSubmit(id) {
  if (replychc === true) {
    const area = document.querySelector(`.comment-replyArea-replyArea${id}`);
    const input = document.querySelector(`.replyInput${id}`);
    const btn = document.querySelector(`.replyBtn${id}`);
    const commentText = input.value;
    const postid = post.id;
    axios.get("/checkCookie").then((res) => {
      if (res.data.result) {
        console.log(userData);
        axios
          .post("/detail/commentPush", {
            userid: res.data.id,
            postid: postid,
            content: commentText,
            nickname: res.data.nickname,
            parentid: id,
          })
          .then((res) => {
            replychc = false;
            input.remove();
            btn.remove();
            area.innerHTML += `<div class = "commentBox"><div>${res.data.comments.nickname}<p>${res.data.comments.content} </p><button class = "reply-btn"onclick = "replyRComment(${res.data.comments.id},this)">대대댓글</button><div class = "comment-replyArea-replyArea${res.data.comments.id}"></div></div></div>`;
          });
      } else {
        alert("로그인 후 이용가능합니다.");
      }
    });
  }
}
