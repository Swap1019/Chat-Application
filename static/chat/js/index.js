
console.log("JavaScript file loaded successfully");
// scroll to bottom on the intial load
window.onload = function() {
  const messageContainer = document.getElementById("message-container");
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const input = document.getElementById("message-input");

input.addEventListener("keypress", function(event) {

  // If Enter is pressed without Shift
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); 
    document.getElementById("send-message-button").click();
  }

  // If Shift+Enter is pressed
  else if (event.key === "Enter" && event.shiftKey) {
    // defualt behavior
  }
});


document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const messageContainer = document.getElementById('message-container');
    const chatGroup = chatMessages.getAttribute('data-group');
    
    const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + chatGroup + '/');

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        chatMessages.insertAdjacentHTML('beforeend', data.html);

        // Scroll to the bottom when a new message is added
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

});


document.addEventListener('DOMContentLoaded', function () {
    const chatItems = document.querySelectorAll('li[data-chat-id]');
    

    chatItems.forEach(function (chatItem) {
        const groupName = chatItem.getAttribute('data-chat-id');
        const socket = new WebSocket(`ws://${window.location.host}/ws/chat/preview/${groupName}/`);

        socket.onopen = function (event) {
            console.log(`WebSocket connection opened for group: ${groupName}`, event);
        };

        socket.onmessage = function (event) {
            console.log("Received data from WebSocket:", event.data);

            try {
                const data = JSON.parse(event.data);
                console.log("Parsed data:", data);

                if (data.html) {
                    const parser = new DOMParser();
                    const newLiElement = parser.parseFromString(data.html, 'text/html').querySelector('li');

                    if (newLiElement) {
                        const newChatId = newLiElement.getAttribute('data-chat-id');
                        const oldLiElement = document.querySelector(`li[data-chat-id="${newChatId}"]`);
                        
                        if (oldLiElement) {
                            oldLiElement.replaceWith(newLiElement);
                            console.log("Replaced old chat element with new one");
                        } else {
                            console.warn("Old chat element not found for ID:", newChatId);
                        }
                    } else {
                        console.error("New li element not found in the received HTML");
                    }
                } else {
                    console.error("No HTML content in the WebSocket message");
                }
            } catch (e) {
                console.error("Error parsing WebSocket data:", e);
            }
        };

        socket.onclose = function (event) {
            console.log(`WebSocket closed for group: ${groupName}`, event);
        };

        socket.onerror = function (error) {
            console.error(`WebSocket error for group: ${groupName}`, error);
        };
    });
});
