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


document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.getElementById('ks-items');
  
  const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/preview/' + chatGroup + '/');

  chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      chatMessages.insertAdjacentHTML('beforeend', data.html);
  };

  chatSocket.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
  };

});
