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

    promise.catch(console.error());
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
  promise.catch(welcomeScreenError);

  document.getElementById("user-name").value = "";
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
  const element = document.querySelector(".message-container");

  const promise = axios.get(apiMsg);

  promise.then(getMessageContent);

  promise.catch(console.error());

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
  if (userName !== undefined) {
    const element = document.querySelector(".message-container");

    const promise = axios.get(apiMsg);

    promise.then(getLastMessageContent);

    promise.catch(console.error());

    function getLastMessageContent(array) {
      const currentArray = array.data

      let difference = currentArray.filter((x) => !lastArray.includes(x));

      if (JSON.stringify(lastArray) !== JSON.stringify(array.data)) {
        for (const entry of difference) {
          element.innerHTML += `
            <section class="${entry.type}">
              <p class="time-sent">${entry.time}</p>
              <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
            </section>
            `;

          lastArray = currentArray;

          console.log("repetindo");
        }
      } else {
        null;
      }
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

messageHistory();

setInterval(userStatus, 5000);
setInterval(messageHistoryUpdate, 3000);
