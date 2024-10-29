let stompClient = null;

function connect() {
  const socket = new SockJS("http://localhost:8080/chat-websocket");
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/messages", function (message) {
        showMessage(JSON.parse(message.body));
      });
    },
    function (error) {
      console.error("STOMP error: " + error);
    }
  );
}

function sendMessage() {
  const sender = document.getElementById("sender").value;
  const content = document.getElementById("content").value;
  if (sender && content) {
    stompClient.send(
      "/app/chat",
      {},
      JSON.stringify({ sender: sender, content: content })
    );
    document.getElementById("content").value = "";
  } else {
    alert("Please enter your name and a message.");
  }
}

function showMessage(message) {
  const messageDisplay = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className =
    "chat-message " +
    (message.sender === document.getElementById("sender").value
      ? "sender"
      : "receiver");
  messageElement.innerText = `${message.sender}: ${message.content}`;
  messageDisplay.appendChild(messageElement);
  messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

window.onload = connect;
