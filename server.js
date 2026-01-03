const express = require('express');
const cors = require('cors');
require('dotenv').config();

const spotifyRoutes = require('./routes/spotify.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req,res) => {
    res.json({message: 'Server is running!'});
});

app.use('/api/spotify', spotifyRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


