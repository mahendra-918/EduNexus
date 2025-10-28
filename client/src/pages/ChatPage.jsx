import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';

let socket;

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Socket connected on client');
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && user) {
      const msgData = {
        name: user.name,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('sendMessage', msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      setMessage('');
    }
  };

  if (!user) {
    return <p>Please log in to join the chat.</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Chat</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.name === user.name ? styles.myMessage : styles.otherMessage),
            }}
          >
            <strong>{msg.name}</strong> <span style={styles.timestamp}>{msg.timestamp}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form style={styles.form} onSubmit={sendMessage}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  chatBox: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  message: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  myMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    color: '#333',
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: '0.7rem',
    marginLeft: '0.5rem',
    opacity: 0.8,
  },
  form: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '0.5rem',
  },
};

export default ChatPage;