const editor = new toastui.Editor({
  el: document.querySelector("#toast_ui_editor"),
  height: "100%",
  initialEditType: "wysiwyg",
});

document.getElementById("publish_button").addEventListener("click", (event) => {
  event.preventDefault();
  const form = document.getElementById("toast_form").elements;
  const toast_title = form["toast_title"].value;
  const toast_ui_editor = editor.getMarkdown();
  const toast_images = extractImages();

  // Get the selected category ID directly
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  );
  if (!selectedCategory) {
    alert("Please select a category.");
    return;
  }
  const toast_category = selectedCategory.value; // Get the category ID

  // Send data to the server (no need for extra /categories request)
  axios
    .post("/write/saveData", {
      title: toast_title,
      content: toast_ui_editor,
      categoryId: toast_category, // Send the category ID
      imgsrc: toast_images.markdown.join(","),
    })
    .then((response) => {
      console.log("Data saved:", response.data);
      if (response.data.result) {
        window.location.href = "/";
      } else {
        alert(`${response.data.message}`);
      }
      alert("Data saved successfully!");
    })
    .catch((error) => {
      console.error("Error saving data:", error);
      alert("Error saving data.");
    });
});

function extractImages() {
  const markdownContent = editor.getMarkdown();
  const htmlContent = editor.getHTML();

  // Extract images from Markdown
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  let markdownImageUrls = [];
  let markdownMatch;
  while ((markdownMatch = markdownImageRegex.exec(markdownContent)) !== null) {
    markdownImageUrls.push(markdownMatch[1]);
  }

  // Extract images from HTML
  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/g;
  let htmlImageUrls = [];
  let htmlMatch;
  while ((htmlMatch = htmlImageRegex.exec(htmlContent)) !== null) {
    htmlImageUrls.push(htmlMatch[1]);
  }

  console.log("Markdown Image URLs:", markdownImageUrls);
  console.log("HTML Image URLs:", htmlImageUrls);

  return {
    markdown: markdownImageUrls,
    html: htmlImageUrls,
  };
}

axios
  .get("/write/categories")
  .then((response) => {
    const categories = response.data;
    console.log(categories);

    const categoryDiv = document.getElementById("toast_category");
    categories.forEach((category, index) => {
      const categoryName = category.name;
      const id = `category-${index}`;
      const radioDiv = document.createElement("div");
      radioDiv.innerHTML = `
                        <input type="radio" id="${id}" name="category" value="${categoryName}">
                        <label for="${id}">${categoryName}</label>
                    `;
      categoryDiv.appendChild(radioDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

//
//
const modeSwitch = document.querySelector(".toastui-editor-mode-switch");
const parent = modeSwitch.parentElement;
if (parent) {
  parent.removeChild(modeSwitch);
}
