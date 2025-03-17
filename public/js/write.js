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
  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";

  previewImageContainer.appendChild(img);
}

function updatePreview() {
  const previewTitle = document.getElementById("preview_title");
  const previewContent = document.getElementById("preview_content");
  const titleInput = document.querySelector("input#toast_title");

  previewTitle.textContent = titleInput.value; // 제목은 그대로 유지
  previewContent.innerHTML = editor.getHTML(); // 전체 내용을 미리보기에 반영
}
document.querySelector("input#toast_title").addEventListener("input", () => {
  updatePreview();
});

document.getElementById("publish_button").addEventListener("click", (event) => {
  event.preventDefault();

  document.querySelector(".publish-wrap").style.display = "block";
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

const fileInput = document.querySelector(".post_file");
const imgBox = document.querySelector(".imgBox");

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0]; // 첫 번째 파일 가져오기
  const BtnBox = document.querySelector(".BtnBox");
  BtnBox.innerHTML = `<div class = "removeBtn" onclick = "imgRemove()">제거</div>`;
  if (event.target.files.length !== 0) {
    if (file && file.type.startsWith("image/")) {
      // 이미지 파일인 경우
      const reader = new FileReader();

      reader.onload = function (e) {
        imgBox.innerHTML = `<img src="${e.target.result}"/>`;
      };

      reader.readAsDataURL(file);
    } else {
      alert("파일 형식이 올바르지 않습니다.");
    }
  } else {
    return;
  }
});

function imgchange() {
  fileInput.click();
}

function imgRemove() {
  const BtnBox = document.querySelector(".BtnBox");
  BtnBox.innerHTML = ``;

  fileInput.value = "";
  imgBox.innerHTML = `  <div class="imgUpload">300px * 160px</div>
              `;
}

const pub_cansle = document.querySelector(".publish_Button_Cansle");
pub_cansle.addEventListener("click", () => {
  document.querySelector(".publish-wrap").style.display = "none";
});
const textarea = document.querySelector(".post_intro");
const strCount = document.querySelector(".strCount");
const maxLength = 150;
textarea.addEventListener("input", () => {
  const currentLength =
    textarea.value.length < 150 ? textarea.value.length : 150; // 현재 입력된 글자 수
  strCount.textContent = `${currentLength}/${maxLength}`; // 글자 수 업데이트

  // 글자 수가 최대 길이를 초과하지 않도록 처리
  if (currentLength >= maxLength) {
    textarea.value = textarea.value.substring(0, maxLength); // 초과 글자 제거
    strCount.style.color = "red";
  } else {
    strCount.style.color = "black";
  }
});

document
  .querySelector(".publish_Button_Submit")
  .addEventListener("click", () => {
    const form = document.getElementById("toast_form").elements;
    const toast_title = form["toast_title"].value;
    const toast_ui_editor = editor.getMarkdown();

    const selectedCategory = document.querySelector(
      'input[name="category"]:checked'
    );
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }
    const toast_category = selectedCategory.value;
    const file = document.querySelector(".post_file").files[0];
    let imgsrc;
    if (file) {
      imgsrc = `/uploads/${file.name}`;
    } else {
      imgsrc = null;
    }
    const postIntro = document.querySelector(".post_intro").value;
    const comment = postIntro.length > 0 ? postIntro : "";

    const formData = new FormData();
    formData.append("title", toast_title);
    formData.append("content", toast_ui_editor);
    formData.append("categoryId", toast_category);
    formData.append("file", file);
    formData.append("imgsrc", imgsrc);
    formData.append("email", id);
    formData.append("comment", comment);

    axios
      .post("/write/saveData", formData)
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

function cancel() {
  window.location.href = "/";
}
