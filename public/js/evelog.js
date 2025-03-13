const urlParam = new URLSearchParams(window.location.search);
const hsh2 = urlParam.get("hsh");

let page = 1; // Start with page 1
const limit = 10; // Number of posts per page
let isLoading = false; // Prevent multiple requests

function fetchPosts() {
  if (isLoading) return; // Prevent concurrent requests
  isLoading = true;

  axios
    .post("/update/getmypost", { vUrl: hsh2 })
    .then((res) => {
      const posts = res.data.post;
      const container = document.getElementById("postsContainer");

      if (!container) {
        console.error("Container element not found.");
        return;
      }

      container.innerHTML = "";

      if (!Array.isArray(posts) || posts.length === 0) {
        const noPostsMessage = document.createElement("p");
        noPostsMessage.textContent = "No posts found.";
        container.appendChild(noPostsMessage);
        return;
      }

      posts.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Thumbnail (imgsrc) first
        if (post.imgsrc) {
          const img = document.createElement("img");
          img.src = post.imgsrc;
          img.alt = "Post Image";
          img.classList.add("post-thumbnail"); // Add class for styling
          postDiv.appendChild(img);
        }

        const contentTextDiv = document.createElement("div"); // Div to hold text content
        contentTextDiv.classList.add("post-content-text");
        postDiv.appendChild(contentTextDiv);

        // Title
        const titleHeader = document.createElement("h3");
        titleHeader.textContent = post.title || "Untitled";
        titleHeader.classList.add("post-title"); // Add class for styling
        contentTextDiv.appendChild(titleHeader);

        // Content
        const parts = post.content.split("!");
        const textContent = parts[0] || "";
        const textParagraph = document.createElement("p");
        textParagraph.textContent = textContent;
        textParagraph.classList.add("post-content"); // Add class for styling
        contentTextDiv.appendChild(textParagraph);

        // Image in content
        if (parts.length > 1) {
          const imgMatch = parts[1].match(/\[Uploaded Image]\((.*?)\)/);
          if (imgMatch && imgMatch[1]) {
            const contentImg = document.createElement("img");
            contentImg.src = imgMatch[1];
            contentImg.alt = "Content Image";
            contentImg.classList.add("post-content-image");
            contentTextDiv.appendChild(contentImg);
          }
        }

        // Created At
        let createdAtText = "Unknown";
        if (post.createdAt) {
          const createdAtDate = new Date(post.createdAt);
          const year = createdAtDate.getFullYear();
          const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
          const day = String(createdAtDate.getDate()).padStart(2, "0");
          createdAtText = `${year}년${month}월${day}일`;
        }
        const createdAtParagraph = document.createElement("p");
        createdAtParagraph.textContent = `${createdAtText}`;
        createdAtParagraph.classList.add("post-created-at"); // Add class for styling
        contentTextDiv.appendChild(createdAtParagraph);

        container.appendChild(postDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      const container = document.getElementById("postsContainer");
      if (container) {
        container.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching posts.";
        container.appendChild(errorMessage);
      }
    });
}

// Initial fetch
fetchPosts();

// Scroll event listener
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 200 // Trigger when near the bottom
  ) {
    fetchPosts();
  }
});
