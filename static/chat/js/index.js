console.log("JavaScript file loaded successfully");

// Scroll to bottom on the initial load
window.onload = function() {
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
};

const input = document.getElementById("message-input");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); 
    document.getElementById("send-message-button").click();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const messageContainer = document.getElementById("message-container");
  const chatMessages = document.getElementById("chat-messages");
  const chatGroup = chatMessages.getAttribute("data-group");

  // Determine WebSocket protocol based on page protocol (http or https)
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  // Main WebSocket for the current chat
  const chatSocket = new WebSocket(`${protocol}://${window.location.host}/ws/chat/${chatGroup}/`);
  
  chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    chatMessages.insertAdjacentHTML("beforeend", data.html);

    // Check if messageContainer exists and scroll it to the bottom
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  chatSocket.onclose = function() {
    console.error("Chat socket closed unexpectedly");
  };

  // WebSocket for each chat item in the preview list
  const chatItems = document.querySelectorAll("li[data-chat-id]");
  chatItems.forEach(chatItem => {
    const groupName = chatItem.getAttribute("data-chat-id");
    createWebSocketConnection(groupName);
  });

  function createWebSocketConnection(groupName) {
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/chat/preview/${groupName}/`);

    socket.onopen = () => console.info(`WebSocket connection opened for group: ${groupName}`);
    
    socket.onmessage = handleWebSocketMessage;

    socket.onclose = () => console.warn(`WebSocket closed for group: ${groupName}`);
    socket.onerror = error => console.error(`WebSocket error for group: ${groupName}`, error);
  }

  // Handle incoming WebSocket messages for chat previews
  function handleWebSocketMessage(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.html, "text/html");
        const newLiElement = doc.querySelector("li");

        if (newLiElement) {
          const newChatId = newLiElement.getAttribute("data-chat-id");
          const oldLiElement = document.querySelector(`li[data-chat-id="${newChatId}"]`);
          
          if (oldLiElement) {
            oldLiElement.replaceWith(newLiElement);
          } else {
            console.warn(`Old chat element not found for ID: ${newChatId}`);
          }

          reorderChatItems(); // Reorder chat items after updating
        } else {
          console.error("New <li> element not found in the received HTML.");
        }
      } else {
        console.error("No HTML content in the WebSocket message.");
      }
    } catch (e) {
      console.error("Error parsing WebSocket data:", e);
    }
  }
});
