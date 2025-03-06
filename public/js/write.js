const editor = new toastui.Editor({
  el: document.querySelector("#toast_ui_editor"),
  height: "100%",
  initialEditType: "wysiwyg",
  hooks: {
    addImageBlobHook: async (blob, callback) => {
      try {
        const imageUrl = await convertBlobToDataURL(blob); // Convert blob to data URL
        displayImagePreview(imageUrl);
        callback("", "Uploaded Image");
        // updatePreview();
        return false;
      } catch (error) {
        console.error("Image processing error:", error);
        alert("Image processing failed.");
        return false;
      }
    },
  },
  events: {
    change: function () {
      updatePreview();
    },
  },
});

async function convertBlobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
const previewImageContainer = document.getElementById("preview_image");
function displayImagePreview(imageUrl) {
  // const imageDiv = document.createElement("div");
  // imageDiv.style.backgroundImage = `url(${imageUrl})`;
  // imageDiv.style.backgroundSize = "contain";
  // imageDiv.style.backgroundRepeat = "no-repeat";
  // imageDiv.style.width = "200px";
  // imageDiv.style.height = "150px";
  // previewImageContainer.appendChild(imageDiv);

  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  previewImageContainer.innerHTML = ""; // Clear previous images
  previewImageContainer.appendChild(img);
}

function updatePreview() {
  const previewTitle = document.getElementById("preview_title");
  const previewContent = document.getElementById("preview_content");
  const previewImageContainer = document.getElementById("preview_image");
  const titleInput = document.querySelector("input#toast_title"); // Get the input element

  // Update title
  previewTitle.textContent = titleInput.value; // Get the value from the input

  // Update content
  previewContent.innerHTML = editor.getHTML();

  // Clear existing images and re-add them (if needed)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  let markdownImageUrls = [];
  let markdownMatch;
  let markdownContent = editor.getMarkdown();

  while ((markdownMatch = markdownImageRegex.exec(markdownContent)) !== null) {
    markdownImageUrls.push(markdownMatch[1]);
  }

  markdownImageUrls.forEach((url) => displayImagePreview(url));
}
document.querySelector("input#toast_title").addEventListener("input", () => {
  updatePreview();
});

document.getElementById("publish_button").addEventListener("click", (event) => {
  event.preventDefault();
  const form = document.getElementById("toast_form").elements;
  const toast_title = form["toast_title"].value;
  const toast_ui_editor = editor.getMarkdown();
  const toast_images = extractImages().markdown
    ? extractImages().markdown
    : extractImages().html;

  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  );
  if (!selectedCategory) {
    alert("Please select a category.");
    return;
  }
  const toast_category = selectedCategory.value;
  const imgsrc = document.querySelector("#preview_image");
  const src = imgsrc.querySelector("img").s;
  rc;
  axios
    .post("/write/saveData", {
      title: toast_title,
      content: toast_ui_editor,
      categoryId: toast_category,
      imgsrc: src, // Save image URLs to the database
      userid: id,
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

  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  let markdownImageUrls = [];
  let markdownMatch;
  while ((markdownMatch = markdownImageRegex.exec(markdownContent)) !== null) {
    markdownImageUrls.push(markdownMatch[1]);
  }

  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/g;
  let htmlImageUrls = [];
  let htmlMatch;
  while ((htmlMatch = htmlImageRegex.exec(htmlContent)) !== null) {
    htmlImageUrls.push(htmlMatch[1]);
  }

  return {
    markdown: markdownImageUrls,
    html: htmlImageUrls,
  };
}

//
//
//

// const editor = new toastui.Editor({
//   el: document.querySelector("#toast_ui_editor"),
//   height: "100%",
//   initialEditType: "wysiwyg",
// });

// document.getElementById("publish_button").addEventListener("click", (event) => {
//   event.preventDefault();
//   const form = document.getElementById("toast_form").elements;
//   const toast_title = form["toast_title"].value;
//   const toast_ui_editor = editor.getMarkdown();
//   const toast_images = extractImages();

//   // Get the selected category ID directly
//   const selectedCategory = document.querySelector(
//     'input[name="category"]:checked'
//   );
//   if (!selectedCategory) {
//     alert("Please select a category.");
//     return;
//   }
//   const toast_category = selectedCategory.value; // Get the category ID

//   // Send data to the server (no need for extra /categories request)
//   axios
//     .post("/write/saveData", {
//       title: toast_title,
//       content: toast_ui_editor,
//       categoryId: toast_category, // Send the category ID
//       imgsrc: toast_images.markdown.join(","),
//     })
//     .then((response) => {
//       console.log("Data saved:", response.data);
//       if (response.data.result) {
//         window.location.href = "/";
//       } else {
//         alert(`${response.data.message}`);
//       }
//       alert("Data saved successfully!");
//     })
//     .catch((error) => {
//       console.error("Error saving data:", error);
//       alert("Error saving data.");
//     });
// });

// function extractImages() {
//   const markdownContent = editor.getMarkdown();
//   const htmlContent = editor.getHTML();

//   // Extract images from Markdown
//   const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
//   let markdownImageUrls = [];
//   let markdownMatch;
//   while ((markdownMatch = markdownImageRegex.exec(markdownContent)) !== null) {
//     markdownImageUrls.push(markdownMatch[1]);
//   }

//   // Extract images from HTML
//   const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/g;
//   let htmlImageUrls = [];
//   let htmlMatch;
//   while ((htmlMatch = htmlImageRegex.exec(htmlContent)) !== null) {
//     htmlImageUrls.push(htmlMatch[1]);
//   }

//   console.log("Markdown Image URLs:", markdownImageUrls);
//   console.log("HTML Image URLs:", htmlImageUrls);

//   return {
//     markdown: markdownImageUrls,
//     html: htmlImageUrls,
//   };
// }

axios
  .get("/write/categories")
  .then((response) => {
    const categories = response.data;

    const categoryDiv = document.getElementById("toast_category");
    categories.forEach((category, index) => {
      const categoryName = category.name;
      const id = `category-${index}`;
      const radioDiv = document.createElement("div");
      radioDiv.innerHTML = `
                        <input type="radio" id="${id}" name="category" value="${category.id}">
                        <label for="${id}">${categoryName}</label>
                    `;
      categoryDiv.appendChild(radioDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

//
//this is to delete tab options at the bottom of the default toast editor
const modeSwitch = document.querySelector(".toastui-editor-mode-switch");
const parent = modeSwitch.parentElement;
if (parent) {
  parent.removeChild(modeSwitch);
}

let id = 0;

window.onload = () => {
  function cookieCheck() {
    axios({
      method: "get",
      url: "/checkCookie",
    }).then((res) => {
      if (res.data.result) {
        let userData = res.data.email;
        axios.post("/idInfo", { email: userData }).then((res) => {
          console.log(res.data);
          id = userData;
        });
      } else {
        console.error(`${res.data.message}`);
        window.location.href = "/";
      }
    });
  }
  cookieCheck();
};
