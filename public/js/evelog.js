const urlParam = new URLSearchParams(window.location.search);
const hsh2 = urlParam.get("hsh");

function fetchPosts() {
  axios.post("/update/getmypost", { vUrl: hsh2 }).then((res) => {
    const posts = res.data.post;
    const user = res.data.user;

    console.log("posts", posts);

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
        createdAtText = `${year}년${month}월${day}일`;
      }
      //   const createdAtParagraph = document.createElement("p");
      //   createdAtParagraph.textContent = `${createdAtText}`;
      //   createdAtParagraph.classList.add("post-created-at"); // Add class for styling
      //   contentTextDiv.appendChild(createdAtParagraph);

      const img =
        post.imgsrc !== null &&
        post.imgsrc !== undefined &&
        post.imgsrc !== "" &&
        post.imgsrc !== "null"
          ? post.imgsrc
          : "/public/img/noimage.jpeg";

      //   container.innerHTML += `<a href = /detail/post/${post.id}> <img src="${post.imgsrc}"/></a>`;
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
        <div class="post-created-at">
        ${createdAtText}
        </div>
        <div class="post-comments">
        ${post.commentCnt}개의 댓글
        </div>
        <div class="post-likes">
        <img src="/public/img/heart.png" />
        ${post.likecnt}
        </div>
        </div>

        </div>
        `;
    });
  });

  //   posts.forEach((post) => {
  //     const postDiv = document.createElement("div");
  //     postDiv.classList.add("post");

  //     // Thumbnail (imgsrc) first
  //     if (post.imgsrc) {
  //       const img = document.createElement("img");
  //       img.src = post.imgsrc;
  //       img.alt = "Post Image";
  //       img.classList.add("post-thumbnail"); // Add class for styling
  //       postDiv.appendChild(img);
  //     }

  //     const contentTextDiv = document.createElement("div"); // Div to hold text content
  //     contentTextDiv.classList.add("post-content-text");
  //     postDiv.appendChild(contentTextDiv);

  //     // Title
  //     const titleHeader = document.createElement("h3");
  //     titleHeader.textContent = post.title || "Untitled";
  //     titleHeader.classList.add("post-title"); // Add class for styling
  //     contentTextDiv.appendChild(titleHeader);

  //     // Content
  //     const parts = post.content.split("!");
  //     const textContent = parts[0] || "";
  //     const textParagraph = document.createElement("p");
  //     textParagraph.textContent = textContent;
  //     textParagraph.classList.add("post-content"); // Add class for styling
  //     contentTextDiv.appendChild(textParagraph);

  //     // Image in content
  //     if (parts.length > 1) {
  //       const imgMatch = parts[1].match(/\[Uploaded Image]\((.*?)\)/);
  //       if (imgMatch && imgMatch[1]) {
  //         const contentImg = document.createElement("img");
  //         contentImg.src = imgMatch[1];
  //         contentImg.alt = "Content Image";
  //         contentImg.classList.add("post-content-image");
  //         contentTextDiv.appendChild(contentImg);
  //       }
  //     }
}

// Initial fetch
fetchPosts();
