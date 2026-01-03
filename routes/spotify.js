const express = require('express');
const axios = require('axios');
const router = express.Router();

async function getAccessToken(){
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    try {
        const reponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':'+ clientSecret).toString('base64') 
                }
            }
        );
        return reponse.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

router.get('/music', async(req, res) => {
    const { mood } = req.query;
    const moodToSearch = {
         'happy': 'happy upbeat pop dance party feel good',
         'sad': 'sad melancholy acoustic indie folk emotional',
         'energetic': 'workout pump up rock electronic high energy',
         'romantic': 'love songs romantic R&B soul slow',
         'motivated': 'motivational inspiring hip hop rap confident',
         'nostalgic': 'nostalgic throwback 90s 2000s indie alternative'
    };

    if (!mood || !moodToSearch[mood]) {
        return res.status(400).json({error: 'Invalid mood parameter'});
    }
    try {
        const accessToken = await getAccessToken();
        const searchQuery = moodToSearch[mood];
        const response = await axios.get(
            'https://api.spotify.com/v1/search',{
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                params: {
                    q: searchQuery,
                    type: 'album',
                    market: 'US',
                    limit: 20
                }
            });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching music data:', error);
        res.status(500).json({error: 'Failed to fetch music data'});
    }
});

module.exports = router;
