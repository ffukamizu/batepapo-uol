let userName;

const userNameAdress = document.getElementById("user-name");
const messageAdress = document.getElementById("user-text");

class Message {
  constructor(from, to, text, type, time) {
    this.from = from;
    this.to = to;
    this.text = text;
    this.type = type;
    this.time = time;
  }

  sendToServer() {
    const promise = axios.post(apiMsg, this);

    promise.catch(console.error());
  }
}

function logIn() {
  userName = String(userNameAdress.value);

  const name = { name: userName };

  const promise = axios.post(apiUser, name);

  promise.then(welcomeScreen);
  promise.then(userStatus);
  promise.catch(welcomeScreenError);

  document.getElementById("user-name").value = "";
}

function welcomeScreen() {
  document.querySelector(".welcome-screen").classList.add("welcome-screen-display");
}

function welcomeScreenError() {
  document.querySelector(".error-message").classList.add("error-message-display");
}

function sideMenu() {
  document.querySelector(".backdrop").classList.toggle("backdrop-display");
}

function userStatus() {
  if (userName !== undefined) {
    const name = { name: userName };

    const promise = axios.post(apiStatus, name);

    promise.catch(console.error());
  } else {
    null;
  }
}

function messageUser() {
  const message = String(messageAdress.value);

  const textToBeSent = new Message(userName, "Todos", message, "message");

  textToBeSent.sendToServer();

  document.getElementById("user-text").value = "";
}

function messageHistory() {
  if (userName !== undefined) {
    const promise = axios.get(apiMsg);

    promise.then(getMessageContent);

    function getMessageContent(array) {
      for (const entry of array.data) {
        const element = document.querySelector(".message-container");
        element.innerHTML += `
            <section class="${entry.type}">
              <p class="time-sent">${entry.time}</p>
              <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
            </section>
          `;
        // element.lastChild.scrollIntoView();
      }
    }
  } else {
    null;
  }
}

userNameAdress.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    document.getElementById("user-name-button").click();
  }
});

messageAdress.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    document.getElementById("send-text-button").click();
  }
});

setInterval(userStatus, 5000);
setInterval(messageHistory, 3000);
