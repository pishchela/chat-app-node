const socket = io();
const incrementButton = document.querySelector('#increment');

socket.on('countUpdated', (count) => {
    console.log('chat just updated', count);
});

incrementButton.addEventListener('click', () => {
    socket.emit('increment');
});
