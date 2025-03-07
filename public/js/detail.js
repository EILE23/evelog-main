async function fetchPostDetail(postId) {
  try {
    const response = await axios.get(`/detail/post/${postId}`);
    // ... process the response.data
    // console.log(response.data);
    const post = response.data.post;
    const user = response.data.user;

    // Display the post details on the page
    document.getElementById("post-title").textContent = post.title;
    document.getElementById(
      "post-author"
    ).textContent = `By ${user.nickname} - ${user.title}`;
    document.getElementById("post-image").src = post.imgsrc;
    document.getElementById("post-content").innerHTML = post.content;
    document.getElementById("post-date").textContent = new Date(
      post.createdAt
    ).toLocaleString();
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

// Get postId from URL
const pathSegments = window.location.pathname.split("/");
const postId = pathSegments[3];

fetchPostDetail(postId);
