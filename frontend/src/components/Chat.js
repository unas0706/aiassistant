import React, { useState } from 'react';
import { IoSendSharp, IoMicSharp } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { findProducts } from '../utils/queryExtractor';

const Chat = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you find the perfect product?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Initialize speech recognition
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

  const generateAIResponse = (query, matchingProducts, extractedQuery) => {
    let response = '';

    if (matchingProducts.length === 0) {
      return "I couldn't find any products matching your criteria. Could you please try with different specifications?";
    }

    // Build a more detailed response based on the extracted query
    response = "I found ";
    if (matchingProducts.length === 1) {
      response += "1 product";
    } else {
      response += `${matchingProducts.length} products`;
    }

    // Add query details to response
    const queryDetails = [];
    if (extractedQuery.category) {
      queryDetails.push(`in ${extractedQuery.category}`);
    }
    if (extractedQuery.color) {
      queryDetails.push(`in ${extractedQuery.color.join(' or ')} color`);
    }
    if (extractedQuery.priceConstraint) {
      queryDetails.push(`under $${extractedQuery.priceConstraint}`);
    }
    if (extractedQuery.features.length > 0) {
      queryDetails.push(`with ${extractedQuery.features.join(', ')}`);
    }

    if (queryDetails.length > 0) {
      response += ` ${queryDetails.join(', ')}`;
    }

    response += ". Here are the best matches:";
    return response;
  };

  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      setMessages(prev => [...prev, {
        text: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Process query and find matching products
      const { query, matches } = findProducts(message, products);
      
      // Log the extracted query object
      console.log('Extracted Query:', {
        message: message,
        extracted: query,
        matchCount: matches.length,
        matches: matches.map(m => m.name)
      });

      // Generate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: generateAIResponse(message, matches, query),
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          products: matches.slice(0, 3), // Show top 3 matching products
          queryDetails: query // Add extracted query details to message
        }]);
      }, 1000);

      setMessage('');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-container ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button onClick={onClose} className="close-button">
          <IoClose />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? 'user-message' : 'assistant-message'}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              {msg.products && msg.products.length > 0 && (
                <div className="product-suggestions">
                  {msg.products.map(product => (
                    <div 
                      key={product._id} 
                      className="suggested-product"
                      onClick={() => handleProductClick(product._id)}
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
      </div>
      
      <div className="chat-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (e.g., 'show me gaming keyboards under 150')"
          rows="1"
        />
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleMicClick}
        >
          <IoMicSharp />
        </button>
        <button className="send-button" onClick={handleSend}>
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};

export default Chat; 