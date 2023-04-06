const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const port = process.env.PORT || 5000;
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/chat', async (req, res) => {
    const message = req.body.messages;
    const system = req.body.system || "";
    // const system = req.body.system || "";
    const temp = req.body.temp || 0;

    try {
        const response = await fetch("https://api.pawan.krd/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                // "max_tokens": 3000,
                "temperature": temp,
                "messages": [
                    {
                        role: "user",
                        content: message
                    },
                    {
                        "role": "system",
                        "content": system
                    },
                ]
            })
        });
        const data = await response.json();
        res.status(200).json({ result: data.choices[0] });
        console.log(data.choices);
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`server booting on port ${port}`)
})