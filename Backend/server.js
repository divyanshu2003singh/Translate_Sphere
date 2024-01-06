// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { translate } = require('@vitalets/google-translate-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// MongoDB connection (replace 'YOUR_MONGODB_URI' with your MongoDB connection string)
mongoose.connect('mongo_url', { useNewUrlParser: true, useUnifiedTopology: true });

//models
const translationSchema = new mongoose.Schema({
  originalText: String,
  translatedText: String,
});


const Translation = mongoose.model('Translation', translationSchema);

//apis
app.post('/api/translate', async (req, res) => {
  const { originalText, targetLanguage } = req.body;

  try {
    const { text: translatedText } = await translate(originalText, { to: targetLanguage });

    // Save the translation to MongoDB
    const translation = new Translation({ originalText, translatedText });
    await translation.save();

    res.json({ translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Serve static files from the React app
app.use(express.static('client/build'));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
