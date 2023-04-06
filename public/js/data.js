async function getBotMessage(userInput) {
    try {
        const response = await fetch('./chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: userInput })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const fullChatBox = document.querySelector(".full-box");

function setIsTyping(type) {
    const loadingDiv = document.createElement("div");
    const chatBox = document.querySelector(".chat-box");
    if (type === true) {
        loadingDiv.classList.add("loading", "chat", "chat-start", "justify-end");
        loadingDiv.innerHTML = '<div class="chat-image avatar"><div class="w-10 rounded-full"><img src="https://ui-avatars.com/api/?name=B" alt="assistant avatar"></div></div><div class="chat-header">Bot</div><div class="chat-bubble chat-bubble-primary">Loading..</div>';
        chatBox.appendChild(loadingDiv);
        fullChatBox.scrollTop = fullChatBox.scrollHeight;
    } else {
        const loadingElement = document.querySelector(".loading");
        loadingElement.remove();
    }
}

function setUserMessage(message) {
    const messageDiv = document.createElement("div");
    const chatBox = document.querySelector(".chat-box");
    messageDiv.classList.add("chat", "chat-end", "justify-end");
    messageDiv.innerHTML = `<div class="chat-image avatar"><div class="w-10 rounded-full"><img src="https://ui-avatars.com/api/?name=Me" alt="user avatar"></div></div><div class="chat-header">Me</div><div class="chat-bubble chat-bubble-secondary">${message}</div>`;
    chatBox.appendChild(messageDiv);
}

function setBotMessage(message) {
    console.log(message)

    // Check if the content has code block
    // ...

    const messageDiv = document.createElement("div");
    const chatBox = document.querySelector(".chat-box");
    messageDiv.classList.add("chat", "chat-start", "justify-end");
    messageDiv.innerHTML = `<div class="chat-image avatar"><div class="w-10 rounded-full"><img src="https://ui-avatars.com/api/?name=B" alt="assistant avatar"></div></div><div class="chat-header">Bot</div><div class="bot-message chat-bubble chat-bubble-primary">${message}</div>`;
    chatBox.appendChild(messageDiv);
    fullChatBox.scrollTop = fullChatBox.scrollHeight;
}

const form = document.querySelector("form");
const formInput = document.querySelector(".user-input");

async function afterSend() {
    // get user input
    const FD = new FormData(form);
    const messages = Object.fromEntries(FD).message;

    // clear input
    formInput.value = "";

    // if user message contains string
    if (messages !== undefined && messages !== "") {
        setUserMessage(messages);
        setTimeout(() => {
            setIsTyping(true);
        }, 500);
        const response = await getBotMessage(messages);
        const result = response.result.message.content;
        console.log(response);
        setIsTyping(false);
        setBotMessage(result);
    }
}

form.addEventListener('submit', (event) => {
    // stop browser from refreshing after form submit
    event.preventDefault();
    // 
    afterSend();
});





// let promptResponses = [];

// //Our call to the API
// const generateResponse = async () => {
//     //Get the user input field value
//     //Set loading spinner
//     loading.classList.remove("visually-hidden");
//     submit.classList.add("visually-hidden");
//     const input = userInput.value;
//     const response = await fetch('/chat', {
//         method: 'POST',
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{"role": "user", "content": input}],
//             temp: 0.6
//         }), 
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     const responseData = await response.json();
//     const message = responseData.result[0].message.content;
//     console.log(message);

//     //Store our previous messages
//     promptResponses.push({question: input, response: message});
//     //Clear both fields
//     userInput.value = "";

//     const historyElement = document.createElement('div');
//     historyElement.innerHTML = `<li class="list-group-item">Prompt: ${input}</li>
//     <li class="list-group-item"> Response: ${message}</li>`;
//     chatHistory.append(historyElement);

//     //Stop loading spinner
//     loading.classList.add("visually-hidden");
//     submit.classList.remove("visually-hidden");

// }

// //Assign onclick method
// submit.onclick = generateResponse;