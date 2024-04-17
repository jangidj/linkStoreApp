const urlMetadata = require('url-metadata');
const instareel = require("insta-reel");
const instagramReelUrl = 'https://www.instagram.com/reel/C5s4-t7Sos8/?utm_source=ig_web_copy_link';


// async function run() {
//     try {
//       const metadata = await urlMetadata(url);
//       console.log(metadata);
//     } catch (err) {
//       console.log(err);
//     }
// }


// run()

const axios = require('axios');
const cheerio = require('cheerio');

async function getImageUrlFromInstagramReelUrl(instagramReelUrl) {
    try {
        // Fetch the HTML content of the Instagram reel page
        const response = await axios.get(instagramReelUrl);
        const html = response.data;

        // Load the HTML content into cheerio
        const $ = cheerio.load(html);

        // Find the meta tag with property="og:image" to extract the image URL
        const imageUrl = $('meta[property="og:image"]').attr('content');

        // Return the image URL
        return imageUrl;
    } catch (error) {
        console.error('Error fetching Instagram reel URL:', error);
        return null;
    }
}

// Example usage:
// const instagramReelUrl = 'https://www.instagram.com/reel/EMDqH7LnOQs/';
getImageUrlFromInstagramReelUrl(instagramReelUrl)
    .then(imageUrl => {
        if (imageUrl) {
            console.log('Image URL:', imageUrl);
        } else {
            console.log('Unable to fetch image URL.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
