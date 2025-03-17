let post, user;
let likechc = false;

const heartbox = document.querySelector(".upHeart");
const heart = document.querySelector(".heartbox");
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
        const img =
          post.imgsrc !== null &&
          post.imgsrc !== undefined &&
          post.imgsrc !== "" &&
          post.imgsrc !== "null"
            ? `<img src = "${post.imgsrc}"/>`
            : "";
        const cnt = post.likecnt ? post.likecnt : 0;
        const data = new Date(post.createdAt).toLocaleString().split(",");
        const newData = data[0].split("/");
        const year = newData[2];
        const month = newData[1];
        const day = newData[0];
        const date = `${year}년 ${month}월 ${day}일`;
        document.getElementById("post-title").textContent = post.title;
        if (user.id === res.data.id) {
          document.getElementById(
            "post-author"
          ).innerHTML = `<div> <span class = "nickname">${user.nickname}</span> - ${date}</div><div class="upbtnBox"><div onclick = "edit(${post.id})">수정</div><div onclick = "remove(${post.id})">삭제</div></div>`;
          document.querySelector(".upHeart").style.display = "none";
        } else {
          document.getElementById(
            "post-author"
          ).innerHTML = `<div> <span class = "nickname">${user.nickname}</span> - ${date}</div><div class = "likeBox"><span>${cnt}</span><img onclick = "likePost()"src = "/public/img/like_heart.png"/></div>`;
        }

        document.getElementById("imgBox").innerHTML = img;
        document.getElementById("post-content").innerHTML = post.content;
        axios
          .post("/detail/checkLike", { userid: res.data.id, postid: post.id })
          .then((r) => {
            if (r.data.result) {
              likechc = true;
              document.querySelector(".heartbox").classList.toggle("like");
              document.querySelector(".heartbox").src =
                "/public/img/like_heartfill.png";
              document.querySelector(".likeBox img").src =
                "/public/img/like_heartfill.png";
              document.querySelector(".likeBox img").classList.toggle("like");
            }
          });
      } else {
        const img =
          post.imgsrc !== null &&
          post.imgsrc !== undefined &&
          post.imgsrc !== "" &&
          post.imgsrc !== "null"
            ? `<img src = "${post.imgsrc}"/>`
            : "";
        const data = new Date(post.createdAt).toLocaleString().split(",");
        const newData = data[0].split("/");
        const year = newData[2];
        const month = newData[1];
        const day = newData[0];
        const date = `${year}년 ${month}월 ${day}일`;
        document.getElementById("post-title").textContent = post.title;

        document.getElementById(
          "post-author"
        ).innerHTML = `<div> <span class = "nickname">${user.nickname}</span> - ${date}</div>`;

        document.getElementById("imgBox").innerHTML = img;
        document.getElementById("post-content").innerHTML = post.content;
      }
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
          const img = ct.User.imgsrc
            ? ct.User.imgsrc
            : "/public/img/user-thumbnail.png";
          cArea.innerHTML += `<div class="reply-container reply-wrap${ct.id}">
  <div class="reply-box">
    <div class="comment-profile">
      <a href="/detail/evelog/?hsh=${ct.User.vUrl}">
        <img src="${img}" />
      </a>
      <div class="cmt-profile-text">
        <a href="/detail/evelog/?hsh=${ct.User.vUrl}">
          <h4>${ct.nickname}</h4>
        </a>
        <p class = "timeText">${date}</p>
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
          const img = ct.User.imgsrc
            ? ct.User.imgsrc
            : "/public/img/user-thumbnail.png";
          replyArea.innerHTML += `<div class="nested-zone">
                <div class="comment-profile">
                  <a href="/detail/evelog/?hsh=${ct.User.vUrl}"
                    ><img src="${img}"
                  /></a>
                  <div class="cmt-profile-text">
                    <a href="/detail/evelog/?hsh=${ct.User.vUrl}"><h4>${ct.nickname}</h4></a>
                    <p class = "timeText">${date}</p>
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
  } catch (error) {
    console.error("error", error);
  }
}

function updateHeartBox() {
  console.log(window.scrollY);
  if (window.scrollY > 300) {
    heartbox.classList.add("heartRight");
  } else {
    heartbox.classList.remove("heartRight");
  }
}

window.onload = () => {
  loadContent();
  const pathname = window.location.pathname;
  const postId = pathname.split("/").pop();
  fetchPostDetail(postId);

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

function likePost() {
  const like = document.querySelector(".likeBox img");

  axios.get("/checkCookie").then((res) => {
    if (res.data.result) {
      like.classList.toggle("like");

      const Liked = like.classList.contains("like");
      if (likechc == false) {
        likechc = true;
        like.src = "/public/img/like_heartfill.png";
        heart.src = "/public/img/like_heartfill.png";
        axios
          .post("/detail/like", { userid: res.data.id, postid: post.id })
          .then((res) => {
            if (res.data.result) {
              document.querySelector(
                ".likeBox span"
              ).innerHTML = `${res.data.post.likecnt}`;
            } else {
              alert("좋아요 추가 실패");
            }
          });
      } else {
        likechc = false;
        like.src = "/public/img/like_heart.png";
        heart.src = "/public/img/like_heart.png";
        axios
          .delete("/detail/likeDel", {
            data: { userid: res.data.id, postid: post.id },
          })
          .then((res) => {
            if (res.data.result) {
              document.querySelector(
                ".likeBox span"
              ).innerHTML = `${res.data.post.likecnt}`;
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
}
