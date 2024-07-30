// DOM elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatbotLogo = document.getElementById('chatbot-logo');
const chatWidget = document.getElementById('chat-widget');
const voiceInputButton = document.getElementById('voice-input');
const micIcon = document.getElementById('voice-input');

console.log('JS loaded');
//let widgetVisible = true; // Track the visibility state of the widget

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., new line)
        sendButton.click(); // Trigger the click event of the send button
    }
});

// Event listener for voice input button
voiceInputButton.addEventListener('click', () => {
    startVoiceInput();
});

// Function to display bot responses with a microphone button


function startVoiceInput() {
    const recognition = new webkitSpeechRecognition(); // Create a new SpeechRecognition instance
    recognition.continuous = false;
    recognition.interimResults = false;

    micIcon.style.color = 'red';

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
        micIcon.style.color = '';
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

async function fetchUserPlanDetailsAndDisplayWelcomeMessage() {
    try {
        const response = await fetch(`/get-user-plan-details`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // Display the welcome message
            displayWelcomeMessage();
            console.log("Hello");

            if (data.existing_plan != null) {
                // Display the user's plan details if available
                const planDetailsMessage = `Hi ${data.Name} Your Current plan is: ${data.existing_plan}, Validity till: ${data.validity}`;
                console.log("Hey");
                displayBotResponseWithMic(planDetailsMessage);
            }
            else{
                console.log("NOT LOGGED IN")
            }
        } else {
            // Handle the case where the request failed or no data was returned
            console.error("Failed to retrieve user plan details.");
            displayWelcomeMessage(); // Display welcome message even if plan details are not available
        }
    } catch (error) {
        console.error("Error while fetching user plan details:", error);
        displayWelcomeMessage(); // Display welcome message even if there's an error
    }
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
//displayWelcomeMessage();
fetchUserPlanDetailsAndDisplayWelcomeMessage();


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
    micButton.style.backgroundColor = 'transparent'; // Remove button background color
    micButton.style.border = 'none'; // Remove button border
    micButton.style.padding = '0'; // Remove button padding
    micButton.style.fontSize = '24px'; // Adjust the font size
    micButton.style.color = '#007BFF';
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
            if(response == "NEW_SIM"){
                // Modify the response message
                var modifiedResponse = "It's been our pleasure serving you with the new sim kindly, <a href='/NewSIM.html'>click here</a>";
                displayBotResponseWithMic(modifiedResponse);
            }
            else if(response == "LOST SIM"){
                var modresponse = "NO issues. You can easily get your SIM back kindly, <a href='/go_to_lost_sim'>click here</a>";
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "CANCEL SIM"){
                var modresponse = "Sorry to hear this from you. for further proceeding with your cancellation process kindly, <a href='/go_to_cancel_sim'>click here</a>";
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "ISSUE"){
                var modresponse = "Sorry to hear that, To get resolved of your issue kindly, <a href='/go_to_issue'>click here</a>";
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "RECHARGE"){
                var modresponse = "Choose the best plan which matchs you needs and Recharge, <a href='/PlansAndRecharge.html'>Recharge</a> Or else You can Customize your own plan, <a href='/customizedPlan.html'>Customized Plan</a>"
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "ADDON"){
                var modresponse = "Choose the best AddOn plan which suits you from here, <a href='/PlansAndRecharge.html'>Add On</a> Or else You can Customize your own plan, <a href='/customizedPlan.html'>Customized Plan</a>"
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "CHOSEN ADDRESS"){
                var modresponse = "If you want to Change the address in the profile, <a href='/go_to_change_address'>Click here</a>";
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "OFFERS"){
                console.log("OFFER");
                var modresponse = "Here are the latest offers:<br>1. Rs.2999 - Unlimited calls, 2.5GB data/day, 100 SMS/day, 365 days<br>2. Rs.2878 - Unlimited calls, 2GB data/day, 100 SMS/day, 365 days<br>3. Rs.2545 - Unlimited calls, 1.5GB data/day, 100 SMS/day, 365 days <br> Choose the best plan that matches your needs and recharge: <a href='/PlansAndRecharge.html'>Recharge</a> Or, you can customize your own plan: <a href='/customizedPlan.html'>Customized Plan</a>"
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "PORTING"){
                var modresponse = "Welcome to Aspirants Telecom, You can easily Port your number to our Network, Kindly <a href='/portNumber'>Click here</a>"
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "CHANGE PLAN"){
                var modresponse = "You can easily Change your plan, Kindly <a href='/PlansAndRecharge.html'>Click here</a>"
                displayBotResponseWithMic(modresponse);
            }
            else if(response == "CUSTOMIZE PLAN"){
                var modresponse = "You can Customize the plan based on your needs, Kindly <a href='/customizedPlan.html'>Click here</a>"
                displayBotResponseWithMic(modresponse);
            }
            else{
                displayBotResponseWithMic(response);
            }
        });
    })
    .catch(error => {
        console.error('Error sending message to Rasa:', error);
    });
}
// Always show the chat widget when the page is loaded
//chatWidget.style.display = 'block';
