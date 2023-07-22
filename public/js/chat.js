const socket = io();

// Elements
const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById('send-location');
const $messages = document.getElementById('messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss A'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (locationMessage) => {
    const html = Mustache.render(locationTemplate, {
        username: locationMessage.username,
        location: 'My current location',
        locationLink: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm:ss A'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
})


$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const messageInputValue = event.target.elements.message.value;

    socket.emit('sendMessage', messageInputValue, (error) => {
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
