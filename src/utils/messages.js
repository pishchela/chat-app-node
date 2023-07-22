
const generateMessage = (text, username) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    }
}

const generateLocationMessage = (location, username) => {
    return {
        username,
        url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime(),
    }
}



module.exports = {
    generateMessage,
    generateLocationMessage,
};
