const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/map', async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  try {
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving', {
      params: {
        start: `${startLng},${startLat}`,
        goal: `${endLng},${endLat}`,
        option: 'trafast', // 경로 옵션. 'trafast'는 가장 빠른 경로를 의미
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching directions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
