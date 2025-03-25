function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const resumeContext = {
  background: `Arjit Bhardwaj is a MERN Stack Developer and ML/NLP enthusiast, 
  currently pursuing Electrical Engineering at Malaviya National Institute of Technology with minors in Computer Science. 
  He is the Treasurer at IEEE Student Branch MNIT and has developed projects like FreeLync 
  and the IEEE SB Website.`,
  skills: [
    "Full Stack Development: HTML, CSS, JavaScript, MongoDB, Express.js, React.js, Bootstrap, MySQL",
    "Programming Languages: C++, Python",
    "Data Science: Matplotlib, Numpy, Pandas",
    "Other Skills: GitHub, Machine Learning, NLP"
  ],
  projects: [
    {
      name: "FreeLync",
      description: "A freelancer-hirer platform where freelancer can show their work and hirer can book freelancer with detailed earnings project completions and ratings. ",
      technologies: "MERN Stack"
    },
    {
      name: "IEEE SB Website",
      description: "Official website for IEEE Student Branch MNIT developed for events display registration and all activities.",
      technologies: "Web Development"
    },
    {
      name: "BnB",
      description: "A MVC framework model where users can view different bnbs and rate them write reviews and add their own.",
      technologies: "Web Technologies"
    }
  ],
  contact: "Email: arjit.bhardwaj2004@gmail.com, LinkedIn: linkedin.com/in/arjit-bhardwaj-83610a253"
};

class PortfolioChatbot {
  constructor() {
      this.chatContainer = document.getElementById('chatbot-container');
      this.chatMessages = document.getElementById('chat-messages');
      this.chatInput = document.getElementById('chat-input');
      this.chatSend = document.getElementById('chat-send');
      this.closeChat = document.getElementById('close-chat');

      this.groqApiKey = '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'; 
      this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

      this.createToggleButton();
      this.setupEventListeners();
  }

  createToggleButton() {
      const existingToggle = document.getElementById('chatbot-toggle');
      if (existingToggle) {
          console.log("Toggle button already exists");
          return;
      }

      const toggleButton = document.createElement('button');
      toggleButton.id = 'chatbot-toggle';
      toggleButton.textContent = '💬';
      toggleButton.style.position = 'fixed';
      toggleButton.style.bottom = '2rem';
      toggleButton.style.right = '2rem';
      toggleButton.style.zIndex = '1000';
      toggleButton.style.padding = '10px';
      toggleButton.style.borderRadius = '50%';
      toggleButton.style.border = 'none';
      toggleButton.style.backgroundColor = '#007bff';
      toggleButton.style.color = 'white';
      toggleButton.style.cursor = 'pointer';

      toggleButton.addEventListener('click', () => this.toggleChat());

      document.body.appendChild(toggleButton);
  }

  toggleChat() {
      if (!this.chatContainer) {
          console.error("Chat container not found");
          return;
      }
      
      if (this.chatContainer.style.display === 'none' || this.chatContainer.style.display === '') {
          this.chatContainer.style.display = 'flex';
      } else {
          this.chatContainer.style.display = 'none';
      }
  }

  setupEventListeners() {
      this.chatSend.addEventListener('click', () => this.handleUserMessage());
      this.chatInput.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
              this.handleUserMessage();
          }
      });
      this.closeChat.addEventListener('click', () => this.toggleChat());
  }

  async handleUserMessage() {
      const userMessage = this.chatInput.value.trim();
      if (userMessage === '') return;

      this.addMessageToChat('user', userMessage);
      this.chatInput.value = '';

      
      this.addMessageToChat('bot', 'Thinking...');

      try {
          
          const botResponse = await this.getGroqResponse(userMessage);
          
          
          this.chatMessages.removeChild(this.chatMessages.lastChild);
          
          
          this.addMessageToChat('bot', botResponse);
      } catch (error) {
          console.error('Error getting Groq response:', error);
          this.addMessageToChat('bot', 'Sorry, there was an error processing your message.');
      }
  }

  async getGroqResponse(userMessage) {
      
      const context = `
      You are an AI assistant for Arjit Bhardwaj's portfolio. 
      Background: ${resumeContext.background}
      Skills: ${resumeContext.skills.join(', ')}
      Projects: ${resumeContext.projects.map(p => `${p.name}: ${p.description}`).join('; ')}
      Contact: ${resumeContext.contact}
      
      User asked: ${userMessage}
      `;

      const response = await fetch(this.groqApiUrl, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${this.groqApiKey}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [
                  {
                      role: "system",
                      content: context
                  },
                  {
                      role: "user",
                      content: userMessage
                  }
              ],
              temperature: 0.7,
              max_tokens: 300
          })
      });

      if (!response.ok) {
          const errorBody = await response.text();
          console.error('Error response:', errorBody);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
  }

  addMessageToChat(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message', `${sender}-message`);
      messageElement.textContent = message;
      this.chatMessages.appendChild(messageElement);
      
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
      new PortfolioChatbot();
  } catch (error) {
      console.error("Error initializing chatbot:", error);
  }
});