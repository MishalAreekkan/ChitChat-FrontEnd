import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import UserNavbar from '../../pages/userNavbar';
import { userList } from '../../api/userside';
import axios from 'axios';

function UserChat() {
    const user = useSelector((state) => state.auth.user);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const messageInputRef = useRef(null);
    const socketRef = useRef(null);
    const baseUrl = "http://127.0.0.1:8000/";
    const { data: userData } = userList();
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    const fetchPreviousMessages = async (otherUserId, page = 1) => {
        if (!hasMoreMessages) return;
    
        try {
            const response = await axios.get(`${baseUrl}chat/private/${user.user_id}/${otherUserId}/`);            
            setMessages(prevMessages => 
                page === 1 
                ? response.data.results 
                : [...response.data.results, ...prevMessages]
            );
            
            setHasMoreMessages(response.data.next !== null);
        } catch (error) {
            console.error('Failed to fetch previous messages', error);
            setError('Could not load previous messages');
        }
    };

    // Handle chat selection and WebSocket connection
    const handleChatClick = (chat) => {
        const { id, username } = chat;

        if (socketRef.current) {
            socketRef.current.close();
        }

        fetchPreviousMessages(id);

        const ws = new WebSocket(`ws://localhost:8001/ws/chat/${user.user_id}_${id}/`);

        ws.onopen = () => {
            console.log('WebSocket connection established');
            setError(null);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: data.sent_by_user,
                    message: data.message,
                    timestamp: new Date().toISOString(),
                },
            ]);
        };


        ws.onerror = (err) => {
            console.error('WebSocket error', err);
            setError('Failed to connect to chat. Please try again later.');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socketRef.current = ws;
        setSelectedChat(id);
        setUsername(username);
    };

    const sendMessage = () => {
        const messageText = messageInputRef.current.value.trim();

        if (!messageText) {
            setError('Message cannot be empty');
            return;
        }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messageData = {
                message: messageText,
                sent_by_user: user.user_id,
                recipient: selectedChat,
            };

            socketRef.current.send(JSON.stringify(messageData));
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: user.user_id, message: messageText, timestamp: new Date().toISOString() },
            ]);
            console.log(messages, 'messagesmessages');


            messageInputRef.current.value = '';
            setError(null);
        } else {
            setError('WebSocket connection is not open. Reconnecting...');
            handleChatClick({ id: selectedChat, username });
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    return (
        <>
            <UserNavbar />
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-1/5 bg-gray-200 p-4">
                    <div className="text-center mb-4">
                        <img
                            src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`}
                            alt="Profile"
                            className="w-20 h-20 rounded-full mx-auto"
                        />
                        <h2 className="text-xl font-semibold mt-2">{user.username}</h2>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold mb-2">Chats</h3>
                        {userData?.following?.map((chat, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-300 rounded-lg mb-2 cursor-pointer"
                                onClick={() => handleChatClick(chat)}
                            >
                                <span>{chat.username}</span>
                                <IoChatbubbleEllipsesOutline />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {selectedChat ? username : 'Select a user to chat'}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white p-2 rounded-lg border">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex mb-2 ${msg.sender === user.user_id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-2 rounded-lg ${msg.sender === user.user_id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    <p>{msg.message}</p>
                                    <span className="text-xs opacity-50 block text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="flex-1 overflow-y-auto bg-white p-2 rounded-lg border">
                            {/* existing message rendering */}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    <div className="flex items-center mt-4">
                        <input
                            type="text"
                            placeholder="Type here..."
                            ref={messageInputRef}
                            onKeyPress={handleKeyPress}
                            className="w-full p-3 border rounded-lg focus:outline-none"
                        />
                        <button onClick={sendMessage} className="p-3 bg-orange-500 text-white rounded-lg ml-2">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserChat;
