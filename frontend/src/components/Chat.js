import React, { useState } from 'react';
import { IoSendSharp, IoMicSharp } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { findProducts } from '../utils/queryExtractor';
import { endpoints } from '../config/api';

const Chat = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you find the perfect product?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Get product matches
      const { matches } = findProducts(message, products);
      
      console.log('Sending request to:', endpoints.chat);
      console.log('Request payload:', {
        message,
        chatHistory: messages
      });

      // Get AI response
      const response = await fetch(endpoints.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatHistory: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to get response');
      }
      
      const data = await response.json();
      console.log('AI response:', data);
      
      const aiMessage = {
        text: data.message,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: matches.slice(0, 3)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        stack: error.stack
      });
      const errorMessage = {
        text: `Error: ${error.message}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Speech recognition handlers
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const handleMicClick = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  const formattedResponse = {
    title: "Recommended 1.5 Ton AC Models",
    models: [
      {
        brand: "LG",
        model: "1.5 Ton 5 Star Inverter Split AC",
        features: [
          "Dual Inverter Compressor",
          "Low noise operation",
          "Energy efficient",
          "Smart diagnosis system"
        ]
      },
      {
        brand: "Voltas",
        model: "1.5 Ton 5 Star Inverter Split AC",
        features: [
          "Adjustable cooling",
          "Anti-dust filter",
          "Copper condenser",
          "High energy efficiency"
        ]
      },
      {
        brand: "Daikin",
        model: "1.5 Ton 5 Star Inverter Split AC",
        features: [
          "Power Chill operation",
          "Coanda airflow",
          "Econo mode",
          "Premium build quality"
        ]
      },
      {
        brand: "Blue Star",
        model: "1.5 Ton 5 Star Inverter Split AC",
        features: [
          "Precision cooling",
          "Self-diagnosis",
          "Dust filter",
          "Hydrophilic coating"
        ]
      }
    ],
    note: "All models feature 5-star energy ratings and inverter technology for optimal performance."
  };

  // You can then use this to display in your chat interface:
  const displayResponse = `Here are some highly recommended 1.5 ton AC models:

  ${formattedResponse.models.map((ac, index) => `
  ${index + 1}. ${ac.brand} ${ac.model}
     Key Features:
     ${ac.features.map(feature => `• ${feature}`).join('\n     ')}
  `).join('\n')}

  Note: ${formattedResponse.note}`;

  return (
    <div className={`chat-container ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>AI Shopping Assistant</h3>
        <button onClick={onClose} className="close-button">
          <IoClose />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              <p>{msg.text}</p>
              {msg.products && msg.products.length > 0 && (
                <div className="product-suggestions">
                  {msg.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="suggested-product"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <img src={product.images[0]} alt={product.name} />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-price">${product.price}</p>
                        {product.specs && (
                          <p className="product-specs">
                            {product.specs.slice(0, 2).join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span className="message-time">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant-message">
            <div className="message-content">
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows="1"
          disabled={loading}
        />
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleMicClick}
          disabled={loading}
        >
          <IoMicSharp />
        </button>
        <button 
          className="send-button" 
          onClick={handleSend}
          disabled={loading || !message.trim()}
        >
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};

export default Chat; 