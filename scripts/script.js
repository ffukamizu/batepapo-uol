let userName, lastArray, lastUserArray, statusUpdate, userUpdate, msgUpdate;

let userNameFriend = "Todos";
let msgType = "message";

let lastUser = document.querySelector(".contact-selection").childNodes[1];
let lastType = document.querySelector(".type-selection").childNodes[1];
let checkUser = false;
let checkType = false;

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
  promise.then(messageRecipient);

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

  promise.catch(resetLogIn);
}

function messageUser() {
  const message = String(messageAdress.value);

  const textToBeSent = new Message(userName, userNameFriend, message, msgType);

  textToBeSent.sendToServer();

  document.getElementById("user-text").value = "";
}

function messageDestination(id, element) {
  userNameFriend = String(id);

  if (checkUser === true && element !== lastUser) {
    element.childNodes[4].classList.add("checkmark-display");

    lastUser.childNodes[4].classList.remove("checkmark-display");

    lastUser = element; 
    
    userList();
    
    checkUser = false;
    
    messageRecipient();
  } else if (checkUser === false && element !== lastUser) {
    element.childNodes[4].classList.add("checkmark-display");

    lastUser.childNodes[4].classList.remove("checkmark-display");

    lastUser = element;
    
    userList();
    
    checkUser = true;
    
    messageRecipient();
  } else {
    null;
  }
}

function messageType(id, element) {
  msgType = String(id);

  if (checkType === true && element !== lastType) {
    element.childNodes[4].classList.add("checkmark-display");

    lastType.childNodes[4].classList.remove("checkmark-display");

    checkType = false;

    lastType = element;

    messageRecipient();
  } else if (checkType === false && element !== lastType) {
    element.childNodes[4].classList.add("checkmark-display");

    lastType.childNodes[4].classList.remove("checkmark-display");

    checkType = true;

    lastType = element;

    messageRecipient();
  } else {
    null;
  }
}

function messageRecipient() {
  const element = document.querySelector(".recipient");

  switch (msgType) {
    case "message":
      element.innerHTML = `Enviando mensagem para ${lastUser.innerText}`;

      break;
    case "private_message":
      element.innerHTML = `Enviando mensagem para ${lastUser.innerText} (Reservadamente)`;

      break;
  }
}

function messageHistory() {
  const promise = axios.get(apiMsg);

  promise.then(getMessageContent);
}

function getMessageContent(array) {
  lastArray = array.data;

  const element = document.querySelector(".message-container");

  for (const entry of array.data) {
    if (entry.type === "private_message" && entry.to !== userName && entry.from !== userName) {
      null;
    } else {
      element.innerHTML += `
      <li class="${entry.type}" data-test="message">
        <p class="time-sent">(${entry.time})</p>
        <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
      </li>
      `;
    }
  }

  element.lastElementChild.scrollIntoView();
}

function messageHistoryUpdate() {
  const promise = axios.get(apiMsg);

  promise.then(getLastMessageContentUpdate);
}

function getLastMessageContentUpdate(array) {
  const element = document.querySelector(".message-container");

  if (JSON.stringify(lastArray) !== JSON.stringify(array.data)) {
    const currentArray = array.data;

    element.innerHTML = "";

    for (const entry of currentArray) {
      if (entry.type === "private_message" && entry.to !== userName && entry.from !== userName) {
        null;
      } else {
        element.innerHTML += `
      <li class="${entry.type}" data-test="message">
        <p class="time-sent">(${entry.time})</p>
        <p class="user-message">${entry.from} para ${entry.to}: ${entry.text}</p>
      </li>
      `;
      }
    }

    lastArray = currentArray;
  } else {
    null;
  }

  element.lastElementChild.scrollIntoView();
}

function userList() {
  const promise = axios.get(apiUser);

  promise.then(getUserList);
}

function getUserList(array) {
  lastUserArray = array.data;

  const element = document.querySelector("#user-list");

  element.innerHTML = "";

  for (const entry of array.data) {
    if (entry.name !== lastUser.innerText.trim()) {
      element.innerHTML += `
        <div onclick="messageDestination('${entry.name}', this)" data-test="participant">
          <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
          <div class="checkmark"><ion-icon name="checkmark-outline" data-test="check"></ion-icon></div>
        </div>
        `;
    } else {
      element.innerHTML += `
        <div onclick="messageDestination('${entry.name}', this)" data-test="participant">
          <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
          <div class="checkmark checkmark-display"><ion-icon name="checkmark-outline" data-test="check"></ion-icon></div>
        </div>
        `;
    }
  }
}

function userListUpdate() {
  const promise = axios.get(apiUser);

  promise.then(getUserListUpdate);
}

function getUserListUpdate(array) {
  if (JSON.stringify(lastUserArray) !== JSON.stringify(array.data)) {
    const currentArray = array.data;

    const element = document.querySelector("#user-list");

    element.innerHTML = "";

    for (const entry of currentArray) {
      if (entry.name !== lastUser.innerText.trim()) {
        element.innerHTML += `
        <div onclick="messageDestination('${entry.name}', this)" data-test="participant">
          <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
          <div class="checkmark"><ion-icon name="checkmark-outline" data-test="check"></ion-icon></div>
        </div>
        `;
      } else {
        element.innerHTML += `
        <div onclick="messageDestination('${entry.name}', this)" data-test="participant">
          <ion-icon name="person-circle"></ion-icon><button>${entry.name}</button>
          <div class="checkmark checkmark-display"><ion-icon name="checkmark-outline" data-test="check"></ion-icon></div>
        </div>
        `;
      }
    }

    lastUserArray = currentArray;
  } else {
    null;
  }
}

function welcomeScreen() {
  document.querySelector(".welcome-screen").classList.remove("welcome-screen-display");
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
