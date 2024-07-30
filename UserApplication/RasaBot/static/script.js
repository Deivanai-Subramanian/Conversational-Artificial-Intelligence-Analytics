// DOM elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatbotLogo = document.getElementById('chatbot-logo');
const chatWidget = document.getElementById('chat-widget');
const voiceInputButton = document.getElementById('voice-input');

console.log('JS loaded');
let widgetVisible = false; // Track the visibility state of the widget

// Event listener for voice input button
voiceInputButton.addEventListener('click', () => {
    startVoiceInput();
});

// Function to display bot responses with a microphone button


function startVoiceInput() {
    const recognition = new webkitSpeechRecognition(); // Create a new SpeechRecognition instance
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log('Voice recognition started...');
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        displayMessage('user', result); // Display user's voice input in the chat
        sendMessageToRasa(result); // Send the voice input to Rasa

        // Convert the bot's response to speech
        //textToSpeech('Hello, this is the bot response.');
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };

    recognition.onend = () => {
        console.log('Voice recognition ended.');
    };

    recognition.start();
}

// Function to convert text to speech
function textToSpeech(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Optionally, you can configure the voice here
    // utterance.voice = synth.getVoices()[0];

    synth.speak(utterance);
}


chatbotLogo.addEventListener('click', () => {
    if (widgetVisible) {
        chatWidget.style.display = 'none'; // Hide the widget
    } else {
        chatWidget.style.display = 'block'; // Show the widget
        //chatWidget.style.right = '20px'; // Adjust the right position as needed
        //chatWidget.style.bottom = '120px'; // Adjust the bottom position as needed
    }
    widgetVisible = !widgetVisible; // Toggle the visibility state
});

// Function to scroll chat history to the bottom
function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Function to display a welcome message from the bot
function displayWelcomeMessage() {
    const welcomeMessage = "Welcome to Aspirants! How can I help you?";
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.textContent = welcomeMessage;
    chatHistory.appendChild(messageElement);

    // Scroll to the bottom after displaying the welcome message
    scrollToBottom();
}

// Function to display messages in the chat history
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);

    // Scroll to the bottom after displaying a new message
    scrollToBottom();
}

// Event listener for sending messages
sendButton.addEventListener('click', () => {
    const userMessage = userInput.value;

    // Display the user's message in the chat history
    displayMessage('user', userMessage);

    // Send the user's message to the Rasa chatbot API
    sendMessageToRasa(userMessage);

    // Clear the input field
    userInput.value = '';

    // Scroll to the bottom after a new message is sent
    scrollToBottom();
});

// Initialize the chat with a welcome message
displayWelcomeMessage();


// Function to display messages in the chat history
function displayBotResponse(response) {
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot-message');
    botMessage.innerHTML = response; // Use innerHTML to render HTML tags
    chatHistory.appendChild(botMessage);

    // Scroll to the bottom after displaying the bot's response
    scrollToBottom();
}



// Function to display messages in the chat history with voice support
function displayBotResponseWithMic(response) {
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot-message');
    
    // Create a microphone button
    const micButton = document.createElement('button');
    micButton.textContent = '🎙️'; // You can use any microphone emoji or icon you prefer

    // Add an event listener to the microphone button
    console.log('Adding event listener to micButton');
    // Function to handle the click event
    function handleMicButtonClick() {
        console.log('mic is clicked');
        textToSpeech(response);
    }
    
    
    micButton.addEventListener('click', handleMicButtonClick);
    //document.body.appendChild(micButton);
    // Append the microphone button to the current botMessage

    
    // Append the response to the chat history
    botMessage.innerHTML += response; // Use innerHTML to render HTML tags
    botMessage.appendChild(micButton);
    chatHistory.appendChild(botMessage);

    // Scroll to the bottom after displaying the bot's response
    scrollToBottom();
}





// Modify the sendMessageToRasa function to handle multiple responses
function sendMessageToRasa(message) {
    // Make an HTTP POST request to your Rasa API endpoint
    // Example code for making an API request using fetch:
    
    fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: 'user',
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the Rasa chatbot
        const botResponses = data.map(response => response.text); // Extract text from each response
        botResponses.forEach(response => {
            //textToSpeech(response);
            //displayBotResponse(response);
            displayBotResponseWithMic(response);
        });
    })
    .catch(error => {
        console.error('Error sending message to Rasa:', error);
    });
}










