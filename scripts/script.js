function welcomeScreen() {
  const userName = String(document.getElementById("user-name").value);

  axios.post(apiUser, userName);

  userStatus(userName);

  document.querySelector(".welcome-screen").classList.add("welcome-screen-display");
}

function sideMenu() {
  document.querySelector(".backdrop").classList.toggle("backdrop-display");
}

function userStatus(userName) {
  axios.post(apiStatus, userName);

  console.log(userName);
}

class Message {
  constructor(from, to, text, type, time) {
    this.from = from;
    this.to = to;
    this.text = text;
    this.type = type;
    this.time = time;
  }

  sendMessage() {}
}
