async function fetchPostDetail(postId) {
  try {
    const response = await axios.get(`/detail/post/${postId}`);
    // ... process the response.data
    // console.log(response.data);
    const post = response.data.post;
    const user = response.data.user;

    // Display the post details on the page
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
