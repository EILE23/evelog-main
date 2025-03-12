function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function search() {
  const typing = document.querySelector("input").value;
  axios.post("/write/search", { ty: typing }).then((res) => {});
}

const deboSearch = debounce(search, 500);

document.querySelector("input").addEventListener("input", () => {
  deboSearch;
});
