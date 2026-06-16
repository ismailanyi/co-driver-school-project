const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use('/assets', express.static(path.join(__dirname, '../assets')))
app.use('/auth', require('./routes/jwtAuth'))
app.use('/quiz', require('./routes/quiz'))
app.use('/upload', require('./routes/upload'))
app.use('/feedback', require('./routes/feedback'))
app.use("/intakes", require("./routes/intakes"));
app.get('/', (req,res) => {
    res.json({
        message: 'Welcome to the Co-Driver Backend API'
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`)
})