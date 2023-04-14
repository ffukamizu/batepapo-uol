let userName, lastArray, lasUserArray, statusUpdate, userUpdate, msgUpdate;

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

function logIn() {
  userName = String(userNameAdress.value);

  const name = { name: userName };

  const promise = axios.post(apiUser, name);

  promise.then(welcomeScreen);
  promise.then(userStatus);
  promise.then(messageHistory);
  promise.then(userList);
  promise.then(intervalUpdates);

  promise.catch(welcomeScreenError);

  document.getElementById("user-name").value = "";
}

function resetLogIn() {
  intervalCancel();

  window.location.reload();
}

function intervalUpdates() {
  statusUpdate = setInterval(userStatus, 5000);
  userUpdate = setInterval(userListUpdate, 3000);
  msgUpdate = setInterval(messageHistoryUpdate, 3000);
}

function intervalCancel() {
  clearInterval(statusUpdate);
  clearInterval(userUpdate);
  clearInterval(msgUpdate);
}

function userStatus() {
  const name = { name: userName };

  const promise = axios.post(apiStatus, name);

  promise.catch(intervalCancel);
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
      <li class="${entry.type}" data-test="message">
        <p class="time-sent">(${entry.time})</p>
        <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
      </li>
      `;
    }

    element.lastElementChild.scrollIntoView();
  }
}

function messageDestination(userId) {
  console.log(userId);
}

function messageHistoryUpdate() {
  const element = document.querySelector(".message-container");

  const promise = axios.get(apiMsg);

  promise.then(getLastMessageContent);

  function getLastMessageContent(array) {
    const currentArray = array.data;

    if (JSON.stringify(lastArray) !== JSON.stringify(array.data)) {
      element.innerHTML = "";

      for (const entry of currentArray) {
        element.innerHTML += `
        <li class="${entry.type}" data-test="message">
          <p class="time-sent">(${entry.time})</p>
          <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
        </li>
        `;
      }

      lastArray = currentArray;
    } else {
      null;
    }

    element.lastElementChild.scrollIntoView();
  }
}

function userList() {
  const element = document.querySelector("#user-list");

  const promise = axios.get(apiUser);

  promise.then(getUserList);

  function getUserList(array) {
    element.innerHTML = ` 
      <div class="contact-selection" onclick="messageDestination('Todos')" data-test="all">
        <ion-icon name="people"></ion-icon><button>Todos</button>
        <div class="checkmark checkmark-hide"><ion-icon name="checkmark-outline"></ion-icon></div>
      </div>`;

    for (const entry of array.data) {
      element.innerHTML += `
      <div onclick="messageDestination('${entry.name}')" data-test="participant">
        <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
        <div class="checkmark checkmark-hide"><ion-icon name="checkmark-outline"></ion-icon></div>
      </div>
      `;
    }
  }
}

function userListUpdate() {
  const element = document.querySelector("#user-list");

  const promise = axios.get(apiUser);

  promise.then(getUserList);

  function getUserList(array) {
    if (JSON.stringify(lastUserArray) !== JSON.stringify(array.data)) {
      const currentArray = array.data;

      element.innerHTML = ` 
      <div class="contact-selection" onclick="messageDestination('Todos')" data-test="all">
        <ion-icon name="people"></ion-icon><button>Todos</button>
        <div class="checkmark checkmark-hide"><ion-icon name="checkmark-outline"></ion-icon></div>
      </div>
      `;

      for (const entry of currentArray) {
        element.innerHTML += `
        <div onclick="messageDestination('${entry.name}')" data-test="participant">
          <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
          <div class="checkmark checkmark-hide"><ion-icon name="checkmark-outline"></ion-icon></div>
        </div>
        `;
      }

      lastUserArray = currentArray;
    } else {
      null;
    }
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
