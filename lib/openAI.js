const axios = require('axios'); // for making HTTP requests

const sendMessageAndGetResponse = async function (message) {
    return new Promise((resolve) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDl5QFozlSIRJJ9BgL06cAIabXOp1g4mO4`;
    
        const headers = { 'Content-Type': 'application/json' };
    
        const postData = {
            "contents": [{
                "parts": [{ "text": "please create keywords for search of this message > video tell me how to play cricket." }]
            }]
        }
    
        axios.post(apiUrl, postData, {
            headers
        }).then(response => {
            // Handle successful response
            var inputString = (((response.data.candidates[0].content.parts[0].text)));
            const array = inputString.split('\n');
            return resolve(array.map(x => x.replace("* ", "")))
        }).catch(error => {
            // Handle error
            console.error('Error occurred:', error);
            return resolve("")
        });
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



module.exports = sendMessageAndGetResponse;