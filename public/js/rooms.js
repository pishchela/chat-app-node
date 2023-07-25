const socket = io();

const roomsDropdownTemplate = document.querySelector('#dropdown-template').innerHTML;

socket.on('getRooms', (rooms) => {
    if (!rooms) {
        return;
    }
    renderRooms(rooms);
});

socket.emit('getRooms', {}, (rooms) => {
    if (!rooms) {
        return;
    }
    renderRooms(rooms);
});


function renderRooms(rooms) {
    const html = Mustache.render(roomsDropdownTemplate, {
        rooms,
    });
    document.querySelector('#select-room').innerHTML = html;
}
