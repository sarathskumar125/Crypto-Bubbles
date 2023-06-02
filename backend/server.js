// server.js
const express = require('express');
const path = require('path')
const cors = require('cors');
const  data  = require('./data');



const app = express();
 
app.use(cors());
app.use(express.json());

// MongoDB connection setup
// mongoose.connect('mongodb://0.0.0.0:27017/bubble_chart_db', { 
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// API routes for fetching and creating bubble chart data
app.get('/api/cryptocurrencies', async (req, res) => {
  try {
    // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
    // const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

app.post('/api/bubbles', async (req, res) => {
  try {
    const { x, y, radius } = req.body; 
    const bubble = new Bubble({ x, y, radius });
    await bubble.save();
    res.json(bubble);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' }); 
  }
});

const _dirname=path.resolve();
app.use(express.static(path.join(_dirname,'/frontend/build')))
app.get('*',(req,res)=>{
  res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
