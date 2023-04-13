let userName, lastArray;

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

    promise.then(messageHistoryUpdate);

    promise.catch(resetLogIn);
  }
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

function logIn() {
  userName = String(userNameAdress.value);

  const name = { name: userName };

  const promise = axios.post(apiUser, name);

  promise.then(welcomeScreen);
  promise.then(userStatus);
  promise.then(messageHistory);
  promise.then(setInterval(userStatus, 4000));
  promise.then(setInterval(messageHistoryUpdate, 3000));

  promise.catch(welcomeScreenError);

  document.getElementById("user-name").value = "";
}

function resetLogIn() {
  window.location.reload();
}

function userStatus() {
  const name = { name: userName };

  axios.post(apiStatus, name);
}

function messageUser() {
  const message = String(messageAdress.value);

  const textToBeSent = new Message(userName, "Todos", message, "message");

  textToBeSent.sendToServer();

  document.getElementById("user-text").value = "";
}

function messageHistory() {
  const element = document.querySelector(".message-container");

  const promise = axios.get(apiMsg);

  promise.then(getMessageContent);

  function getMessageContent(array) {
    lastArray = array.data;

    for (const entry of array.data) {
      element.innerHTML += `
            <section class="${entry.type}">
              <p class="time-sent">${entry.time}</p>
              <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
            </section>
            `;
    }

    element.lastElementChild.scrollIntoView();
  }
}

function messageHistoryUpdate() {
  const element = document.querySelector(".message-container");

  const promise = axios.get(apiMsg);

  promise.then(getLastMessageContent);

  function getLastMessageContent(array) {
    const currentArray = array.data;

    const difference = currentArray.filter((x) => !lastArray.includes(x));

    if (JSON.stringify(lastArray) !== JSON.stringify(array.data)) {
      for (const entry of difference) {
        element.innerHTML += `
            <section class="${entry.type}" data-test="message">
              <p class="time-sent">${entry.time}</p>
              <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
            </section>
            `;

        lastArray = currentArray;
      }
    } else {
      null;
    }

    element.lastElementChild.scrollIntoView();
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
