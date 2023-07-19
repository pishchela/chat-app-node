const socket = io();
const formElement = document.getElementById('message-form');
socket.on('message', (message) => {
    console.warn(message);
});

socket.on('sendMessage', (message) => {
    console.warn(message);
});

formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageInputValue = event.target.elements.message.value;
    socket.emit('message', messageInputValue);
});
