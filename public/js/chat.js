const socket = io();

const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.getElementById('send-location');

socket.on('message', (message) => {
    console.warn(message);
});

socket.on('sendMessage', (message) => {
    console.warn(message);
});

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const messageInputValue = event.target.elements.message.value;

    socket.emit('message', messageInputValue, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }

        console.log('Message delivered');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {

        $sendLocationButton.removeAttribute('disabled');
        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
        }, () => {
            console.log('location send');
        });
    });
});
