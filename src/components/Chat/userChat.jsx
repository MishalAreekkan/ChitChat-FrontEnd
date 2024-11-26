import React, { useState, useEffect, useRef } from 'react';
import UserNavbar from '../../pages/userNavbar';
import { useSelector } from 'react-redux';
import { userList } from '../../api/userside';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function UserChat() {
    const user = useSelector(state => state.auth.user);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username,setUserName]=useState('')
    const [error, setError] = useState(null);
    const messageInputRef = useRef(null);
    const socketRef = useRef(null);
    const baseUrl = "http://127.0.0.1:8000/";
    const { data } = userList();    
    
    const handleChatClick = (chat) => {
        // Close existing WebSocket connection if it exists
        const {id,username}=chat
        if (socketRef.current) {
            socketRef.current.close();
        }
    
        // Establish a new WebSocket connection with dynamic usernames
        const ws = new WebSocket(`ws://localhost:8001/ws/chat/${user.user_id}_${id}/`);
    
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setError(null); // Reset error message if connection is successful
        };
    
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
    
        ws.onerror = (error) => {
            console.error("WebSocket error", error);
            setError("Failed to connect to chat. Please try again later.");
        };
    
        ws.onclose = (event) => {
            console.log("WebSocket connection closed", event);
            setError("Connection lost. Attempting to reconnect...");
        };
    
        socketRef.current = ws;
        setSelectedChat(id);
        setUserName(username)
    };
    
    const sendMessage = () => {
        if (socketRef.current && messageInputRef.current.value.trim()) {
            const messageData = {
                message: messageInputRef.current.value,
                sent_by_user: user.user_id,       
                sent_to_user: selectedChat       
            };
            socketRef.current.send(JSON.stringify(messageData));
            console.log(messageData,'meeagedata');
            
            // setMessages((prevMessages) => [...prevMessages, messageData]);
            messageInputRef.current.value = "";
        } else {
            setError("Message cannot be empty or connection is lost");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
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
    console.log(username,'thismessage');
    
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
                        <h3 className="text-sm font-semibold mb-2">Teams</h3>
                        <div className="flex space-x-2">
                            {/* Replace icons with team logos */}
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="w-8 h-8 bg-gray-400 rounded-full"></span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold mb-2">Chats</h3>
                        {data?.following?.map((chat, index) => (
                            <ul key={index}>
                                <li className="flex items-center justify-between p-2 bg-gray-300 rounded-lg mb-2">
                                    <div
                                        onClick={() => handleChatClick(chat)}
                                        className="flex items-center w-full p-2 rounded-lg cursor-pointer"
                                    >
                                        {chat.username} <IoChatbubbleEllipsesOutline />
                                    </div>
                                    {/* <span className="text-xs text-gray-500">{chat.time}</span> */}
                                </li>
                            </ul>
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
                            <div key={index} className={`p-2 ${msg.sent_by_user === user.user_id ? 'text-right' : ''}`}>
                                <p><strong>{msg.sent_by_user === user.user_id ? user.username : username}:</strong> {msg.message}</p>
                            </div>
                        ))}
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

                {/* User Info */}
                <div className="w-1/5 bg-gray-200 p-4">
                    <div className="text-center">
                        <img
                            src="kristin.jpg"
                            alt="Kristin"
                            className="w-20 h-20 rounded-full mx-auto"
                        />
                        <h2 className="text-xl font-semibold mt-2">Kristin Watson</h2>
                        <p className="text-gray-500">@I_am_Kris</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm"><strong>Phone:</strong> +7 (800) 555-35-35</p>
                        <p className="text-sm"><strong>Date of birth:</strong> 17 March 1990</p>
                        <p className="text-sm"><strong>Gender:</strong> Male</p>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold mb-2">Shared files</h3>
                        <ul>
                            <li className="text-xs text-gray-500 mb-2">forward_statement.txt - 1.9 MB</li>
                            <li className="text-xs text-gray-500 mb-2">picture1.jpg - 1.9 MB</li>
                            <li className="text-xs text-gray-500 mb-2">legal-tune.pdf - 1.9 MB</li>
                            <li className="text-xs text-gray-500">document_1.pdf - 1.9 MB</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserChat;
