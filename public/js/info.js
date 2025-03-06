function cookieCheck() {
  axios({
    method: "get",
    url: "/checkCookie",
  }).then((res) => {
    if (res.data.result) {
      let userData = res.data.email;
      axios.post("/idInfo", { email: userData }).then((res) => {
        console.log(res.data);
      });
    } else {
      console.error(`${res.data.message}`);
    }
  });
}

window.onload = () => {
  cookieCheck();
};
