const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const fs = require('fs');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const port = process.env.PORT || 8080;
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/chat', async (req, res) => {
    const message = req.body.messages;
    const system = req.body.system || "You are a helpful assistant.";
    const temp = req.body.temp || 0;

    try {
        const response = await fetch("https://api.pawan.krd/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                // max_tokens: 3000,
                temperature: temp,
                messages: [
                    {
                        role: "assistant",
                        content: "Omar Abdulaziz is the creator of this chat App, and He is known as an adventurous pirate, who fights battles with his mighty weapon."
                    },
                    {
                        role: "user",
                        content: message
                    },
                    {
                        role: "system",
                        content: system
                    },
                ]
            })
        });
        const botText = await response.json();
        let botTextResult;
        let result = [];

        if (botText?.choices[0]) {
            botTextResult = botText.choices[0].message.content;
        } else {
            botTextResult = "There was an error creating the bot text for this message.";
        }

        const textToSpeech = new TextToSpeechV1({
            authenticator: new IamAuthenticator({
                apikey: process.env.TTS_API_KEY,
            }),
            serviceUrl: process.env.TTS_SERVICE_URL,
        });
        
        const synthesizeParams = {
            text: botTextResult,
            accept: 'audio/mp3',
            voice: 'en-US_AllisonExpressive',
        };
        let chatDate = Date.now();

        await textToSpeech.synthesize(synthesizeParams).then(response => {
            return new Promise((fulfill, reject) => {
                const audio = response.result;
                let stream = audio.pipe(fs.createWriteStream(`./public/audio/chat-${chatDate}.mp3`));
                stream.on('finish', fulfill);
                stream.on('error', reject);
            });
        }).catch(error => {
            console.log('Speech Error:', error);
        });
        result.push({chat: botTextResult, chatDate: chatDate});

        res.status(200).json(result[0]);
        console.log(botTextResult);
    } catch (error) {
        console.log("Fetch Error", error);
        res.json(result[0]);
    }
});

app.listen(port, () => console.log(`server booting on port ${port}`));