
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
    // Function to create a WebSocket connection for each chat item
    function createWebSocketConnection(groupName) {
        const socket = new WebSocket(`ws://${window.location.host}/ws/chat/preview/${groupName}/`);

        socket.onopen = function (event) {
            console.info(`WebSocket connection opened for group: ${groupName}`);
        };

        socket.onmessage = function (event) {
            handleWebSocketMessage(event);
        };

        socket.onclose = function (event) {
            console.warn(`WebSocket closed for group: ${groupName}`);
        };

        socket.onerror = function (error) {
            console.error(`WebSocket error for group: ${groupName}`, error);
        };

        return socket;
    }

    // Function to handle incoming WebSocket messages
    function handleWebSocketMessage(event) {
        try {
            const data = JSON.parse(event.data);

            if (data.html) {
                const parser = new DOMParser();
                const newLiElement = parser.parseFromString(data.html, 'text/html').querySelector('li');

                if (newLiElement) {
                    const newChatId = newLiElement.getAttribute('data-chat-id');
                    const oldLiElement = document.querySelector(`li[data-chat-id="${newChatId}"]`);
                    
                    if (oldLiElement) {
                        oldLiElement.replaceWith(newLiElement);
                    } else {
                        console.warn(`Old chat element not found for ID: ${newChatId}`);
                    }
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

    // Function to reorder chat items based on timestamp
    function reorderChatItems() {
        const chatList = document.querySelector('#chat-list'); // Assuming your chat items are inside an element with ID 'chat-list'
        const chatItems = Array.from(chatList.querySelectorAll('li[data-chat-id]'));

        // Sort chat items by timestamp
        chatItems.sort((a, b) => {
            return new Date(b.getAttribute('data-timestamp')) - new Date(a.getAttribute('data-timestamp'));
        });

        // Clear the list and append sorted items
        chatList.innerHTML = '';
        chatItems.forEach(item => chatList.appendChild(item));
    }

    // Initialize WebSocket connections for each chat item
    const chatItems = document.querySelectorAll('li[data-chat-id]');
    
    chatItems.forEach(function (chatItem) {
        const groupName = chatItem.getAttribute('data-chat-id');
        createWebSocketConnection(groupName);
    });
});