let post, user;

function myevelog(vUrl) {
  window.location.href = `/detail/evelog/?hsh=${vUrl}`;
}

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
        const cArea = document.querySelector(".comment-areaBox");
        const noParent = r.data.comments.filter(
          (item) => item.parentid === null
        );
        const Parent = r.data.comments.filter((item) => item.parentid !== null);
        console.log(noParent, Parent);
        noParent.map((ct) => {
          const nowDate = new Date().toISOString().split("T")[0];
          const contentDate = ct.updatedAt.split("T")[0];

          const nowTime = new Date(nowDate);
          const contentTime = new Date(contentDate);
          const time = Math.abs(nowTime - contentTime);
          const result = Math.floor(time / 86400000);

          let date =
            result < 5
              ? `${result}일 전`
              : `${contentDate.split("-")[0]}년 ${
                  contentDate.split("-")[1]
                }월 ${contentDate.split("-")[2]}일`;

          if (date === `0일 전`) {
            date = "오늘";
          }
          const cnt =
            ct.replyCnt > 0
              ? `<span>${ct.replyCnt}개의 답글</span>`
              : `<span>답글 달기</span>`;
          cArea.innerHTML += `<div class="reply-container reply-wrap${ct.id}">
  <div class="reply-box">
    <div class="comment-profile">
      <a href="/detail/evelog/?hsh=${ct.User.vUrl}">
        <img src="${ct.User.imgsrc}" />
      </a>
      <div class="cmt-profile-text">
        <a href="/detail/evelog/?hsh=${ct.User.vUrl}">
          <h4>${ct.nickname}</h4>
        </a>
        <p>${date}</p>
      </div>
    </div>
    <p>${ct.content}</p>
  </div>

  <div onclick="nestedBoxOn(${ct.id})" class="nestedBtnBox nestedAdd${ct.id}">
    <img src="/public/img/plusbox.png" />
    ${cnt}
  </div>

  <div onclick="nestedBoxOff(${ct.id})" class="nestedBtnBox nestedCancel${ct.id} none">
    <img src="/public/img/minusBox.png" />
    <span>숨기기</span>
  </div>

  <div class="commentarea${ct.id} none">
    <div class="replyArea">
      <textarea class="replyText${ct.id}" placeholder="답글을 작성해주세요"></textarea>
      <div class="btnArea">
        <div class="reply-cbtn" onclick="nestedBoxOff(${ct.id})">취소</div>
        <div class="reply-sbtn" onclick="replySubmit(${ct.id})">답글 달기</div>
      </div>
    </div>
    <div class="nested-box${ct.id} nested-zone"></div>
  </div>
  <hr/>
</div>`;
        });

        Parent.map((ct) => {
          const replyArea = document.querySelector(`.nested-box${ct.parentid}`);
          const nowDate = new Date().toISOString().split("T")[0];
          const contentDate = ct.updatedAt.split("T")[0];

          const nowTime = new Date(nowDate);
          const contentTime = new Date(contentDate);
          const time = Math.abs(nowTime - contentTime);
          const result = Math.floor(time / 86400000);

          let date =
            result < 5
              ? `${result}일 전`
              : `${contentDate.split("-")[0]}년 ${
                  contentDate.split("-")[1]
                }월 ${contentDate.split("-")[2]}일`;

          if (date === `0일 전`) {
            date = "오늘";
          }
          replyArea.innerHTML += `<div class="nested-zone">
                <div class="comment-profile">
                  <a href="/detail/evelog/?hsh=${ct.User.vUrl}"
                    ><img src="${ct.User.imgsrc}"
                  /></a>
                  <div class="cmt-profile-text">
                    <a href="/detail/evelog/?hsh=${ct.User.vUrl}"><h4>${ct.nickname}</h4></a>
                    <p>${date}</p>
                  </div>
                </div>
                <p>${ct.content}</p>
              </div>`;
        });
        document.querySelector(".cmtCnt").textContent =
          Number(post.commentCnt) > 0 ? post.commentCnt : 0;
        document.querySelector(
          ".profile-text h3"
        ).innerHTML = `<a href = "/detail/evelog/?hsh=${user.vUrl}">${user.nickname}</a>`;
        document.querySelector(".profile-area img").src = user.imgsrc
          ? user.imgsrc
          : "/public/img/user-thumbnail.png";
        document
          .querySelector(".profile-area img")
          .addEventListener("click", (e) => {
            myevelog(user.vUrl);
          });
        document.querySelector(
          ".profile-text p"
        ).innerHTML = `<a href = "/detail/evelog/?hsh=${user.vUrl}">${user.comment}</a>`;
      });
    });

    const data = new Date(post.createdAt).toLocaleString().split(".");
    const date = `${data[0]}년 ${data[1]}월 ${data[2]}일`;
    document.getElementById("post-title").textContent = post.title;
    document.getElementById(
      "post-author"
    ).innerHTML = `<div>By <span class = "nickname">${user.nickname}</span> - ${date}</div>`;
    document.getElementById("imgBox").innerHTML = post.imgsrc
      ? ` <img id="post-image" src="${post.imgsrc}" alt="Post Image" />`
      : "";
    document.getElementById("post-content").innerHTML = post.content;
  } catch (error) {
    console.error("error", error);
  }
}

const heartbox = document.querySelector(".upHeart");
const heart = document.querySelector(".heartbox");
function updateHeartBox() {
  if (window.scrollY !== 0) {
    heartbox.classList.add("heartRight");
  } else {
    heartbox.classList.remove("heartRight");
  }
}

heart.addEventListener("click", () => {
  heart.classList.toggle("like");

  const Liked = heart.classList.contains("like");

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
  loadContent();
  fetchPostDetail(postId);
  if (scroll()) {
    updateHeartBox();
  } else {
    heartbox.classList.add("heartRight");
  }
  document.addEventListener("scroll", updateHeartBox);
  document.querySelector(".upbox").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

function commentSubmit() {
  const commentText = document.querySelector("textarea").value;

  axios.get("/checkCookie").then((res) => {
    if (res.data.result && commentText.length > 0) {
      const userid = res.data.id;
      const postid = post.id;
      const content = commentText;
      const nickname = res.data.nickname;
      const vUrl = res.data.vUrl;
      const src = res.data.src;
      document.querySelector("textarea").value = "";
      axios
        .post("/detail/commentPush", {
          userid: userid,
          postid: postid,
          content: content,
          nickname: nickname,
        })
        .then((res) => {
          window.location.reload();
          //   let ct = res.data.comments;

          //   const nowDate = new Date().toISOString().split("T")[0];
          //   const contentDate = ct.updatedAt.split("T")[0];

          //   const nowTime = new Date(nowDate);
          //   const contentTime = new Date(contentDate);
          //   const time = Math.abs(nowTime - contentTime);
          //   const result = Math.floor(time / 86400000);

          //   let date =
          //     result < 5
          //       ? `${result}일 전`
          //       : `${contentDate.split("-")[0]}년 ${
          //           contentDate.split("-")[1]
          //         }월 ${contentDate.split("-")[2]}일`;

          //   if (date === `0일 전`) {
          //     date = "오늘";
          //   }

          //   const cArea = document.querySelector(".comment-areaBox");
          //   cArea.innerHTML += `<div class="reply-container reply-wrap${ct.id}">
          //   <div class="reply-box">
          //     <div class="comment-profile">
          //       <a href="/detail/evelog/?hsh=${vUrl}"
          //         ><img src="${src}"
          //       /></a>
          //       <div class="cmt-profile-text">
          //         <a href="/detail/evelog/?hsh=${vUrl}"><h4>${ct.nickname}</h4></a>
          //         <p>${date}</p>
          //       </div>
          //     </div>
          //     <p>${ct.content}</p>
          //   </div>
          //   <div onclick = "nestedBoxOn(${ct.id})"class="nestedBtnBox nestedAdd${ct.id}">
          //     <img src="/public/img/plusbox.png" />
          //     <span>답글 달기</span>
          //   </div>
          //   <div onclick = "nestedBoxOff(${ct.id})"class="nestedBtnBox nestedCancel${ct.id} none">
          //     <img src="/public/img/minusBox.png" />
          //     <span>숨기기</span>
          //   </div>
          //   <div class="commentarea${ct.id} none">
          //     <div class="replyArea">
          //       <textarea class = "replyText${ct.id}"placeholder="답글을 작성해주세요"></textarea>
          //       <div class="btnArea">
          //         <div class="reply-cbtn" onclick = "nestedBoxOff(${ct.id})">취소</div>
          //         <div class="reply-sbtn" onclick="replySubmit(${ct.id})">
          //           답글 달기
          //         </div>
          //       </div>
          //     </div>
          //     <div class="nested-box${ct.id}"></div>
          // </div>`;
        });
    } else if (commentText.length === 0) {
      return;
    } else {
      alert("로그인 후 이용 가능합니다.");
    }
  });
}

function nestedBoxOn(id) {
  const area = document.querySelector(`.commentarea${id}`);
  const cancelBtn = document.querySelector(`.nestedCancel${id}`);
  const addBtn = document.querySelector(`.nestedAdd${id}`);
  addBtn.classList.add("none");
  cancelBtn.classList.remove("none");
  area.classList.remove("none");
}

function nestedBoxOff(id) {
  const area = document.querySelector(`.commentarea${id}`);
  const cancelBtn = document.querySelector(`.nestedCancel${id}`);
  const addBtn = document.querySelector(`.nestedAdd${id}`);
  addBtn.classList.remove("none");
  cancelBtn.classList.add("none");
  area.classList.add("none");

  document.querySelector(`.replyText${id}`).value = "";
}

function replySubmit(id) {
  const text = document.querySelector(`.replyText${id}`).value;

  axios.get("/checkCookie").then((res) => {
    if (res.data.result && text.length > 0) {
      const userid = res.data.id;
      const postid = post.id;
      const content = text;
      const nickname = res.data.nickname;
      const parentid = id;
      const vUrl = res.data.vUrl;
      const src = res.data.src;
      axios
        .post("/detail/commentPush", {
          userid: userid,
          postid: postid,
          content: content,
          nickname: nickname,
          parentid: parentid,
        })
        .then((res) => {
          window.location.reload();
          // const replyArea = document.querySelector(`.nested-box${id}`);
          // const nowDate = new Date().toISOString().split("T")[0];
          // const contentDate = res.data.comments.updatedAt.split("T")[0];

          // const nowTime = new Date(nowDate);
          // const contentTime = new Date(contentDate);
          // const time = Math.abs(nowTime - contentTime);
          // const result = Math.floor(time / 86400000);

          // let date =
          //   result < 5
          //     ? `${result}일 전`
          //     : `${contentDate.split("-")[0]}년 ${
          //         contentDate.split("-")[1]
          //       }월 ${contentDate.split("-")[2]}일`;

          // if (date === `0일 전`) {
          //   date = "오늘";
          // }
          // replyArea.innerHTML += `<div class="reply-box">
          //       <div class="comment-profile">
          //         <a href="/detail/evelog/?hsh=${vUrl}"
          //           ><img src="${src}"
          //         /></a>
          //         <div class="cmt-profile-text">
          //           <a href="/detail/evelog/?hsh=${vUrl}"><h4>${res.data.comments.nickname}</h4></a>
          //           <p>${date}</p>
          //         </div>
          //       </div>
          //       <p>${res.data.comments.content}</p>
          //     </div>`;
        });
    } else if (text.length === 0) {
      return;
    } else {
      alert("로그인이 필요합니다.");
      return;
    }
  });
}
const loadContent = () => {
  setTimeout(() => {
    const body = document.querySelector("body");

    body.classList.remove("blurred-text");
  }, 1);
};
