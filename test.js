const axios = require('axios');

// Define the URL of the API you want to call
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDl5QFozlSIRJJ9BgL06cAIabXOp1g4mO4`;

const headers = {
    'Content-Type': 'application/json'
};

const postData = {
    "contents": [{
        "parts": [{ "text": "please create keywords for search of this message > video tell me how to play cricket." }]
    }]
}

// Make a GET request to the API
axios.post(apiUrl, postData, {
    headers
})
    .then(response => {
        // Handle successful response
        var inputString = (((response.data.candidates[0].content.parts[0].text)));
        const array = inputString.split('\n');

console.log(array.map(x => x.replace("* ", "")));
    })
    .catch(error => {
        // Handle error
        console.error('Error occurred:', error);
    });
