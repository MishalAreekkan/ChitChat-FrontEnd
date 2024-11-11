import React, { useState, useEffect, useRef } from 'react';
import UserNavbar from '../../pages/userNavbar';
import { useSelector } from 'react-redux';
import { userList } from '../../api/userside';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function UserChat() {
    const user = useSelector(state => state.auth.user);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const messageInputRef = useRef(null);
    const socketRef = useRef(null); // Store the WebSocket in a ref
    const baseUrl = "http://127.0.0.1:8000/";
    const { data } = userList();

    const handleChatClick = (username) => {
        // Close existing WebSocket connection if it exists
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Establish a new WebSocket connection
        const ws = new WebSocket(`ws://localhost:8001/ws/chat/${username}_${user.username}/`);
        
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setError(null); // Reset error message if the connection is successful
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
            // Optional: Add reconnection logic here
        };

        socketRef.current = ws; // Store the WebSocket instance in the ref
        setSelectedChat(username);
    };

    const sendMessage = () => {
        if (socketRef.current && messageInputRef.current.value.trim()) {
            const messageData = {
                message: messageInputRef.current.value,
                username: user.username
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessages((prevMessages) => [...prevMessages, messageData]);
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
                                        onClick={() => handleChatClick(chat.username)}
                                        className="flex items-center bg-red-700 w-full p-2 rounded-lg cursor-pointer"
                                    >
                                        {chat.username} <IoChatbubbleEllipsesOutline />
                                    </div>
                                    <span className="text-xs text-gray-500">{chat.time}</span>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {selectedChat ? selectedChat : 'Select a user to chat'}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white p-2 rounded-lg border">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 ${msg.username === user.username ? 'text-right' : ''}`}>
                                <p><strong>{msg.username}:</strong> {msg.message}</p>
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



// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { FaPhoneAlt, FaSmile, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import { useGetLiveClassChats } from "../../../api/StudentApi"; // Custom hook to fetch live class chats
// import BaseURL from "../../../AppConfig/AppConstants";
// import videojs from 'video.js'; // Import video.js
// import 'video.js/dist/video-js.css';

// const LiveClass = () => {
//     const { user } = useSelector((state) => state.auth);
//     const { WebSocket_URL, streamURL } = useSelector((state) => state.student); // Fetching WebSocket URL and stream URL from Redux
//     const user_id = user.user_id;

//     const [isChatVisible, setIsChatVisible] = useState(true);
//     const { chats, refetch } = useGetLiveClassChats(); // Hook to get live class chats
//     const [error, setError] = useState(null);

//     const [socket, setSocket] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [isStreaming, setIsStreaming] = useState(false); // To manage streaming state
//     const [tutorStreaming, setTutorStreaming] = useState(false); // To check if tutor is streaming
//     const [studentsJoined, setStudentsJoined] = useState([]); // To track students joining the class

//     const messageInputRef = useRef(null);
//     const messagesEndRef = useRef(null);
//     const videoRef = useRef(null); // Reference for the video player

//     const toggleChat = () => {
//         setIsChatVisible(!isChatVisible);
//     };

//     // WebSocket connection logic to handle tutor actions and student messages
//     const connectWebSocket = () => {
//         if (!WebSocket_URL) {
//             console.error("Invalid WebSocket URL");
//             setError("Invalid WebSocket URL");
//             return;
//         }

//         const ws = new WebSocket(WebSocket_URL);

//         ws.onopen = () => {
//             console.log("WebSocket connection established");
//             setError(null);
//         };

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             // Update messages array with new messages
//             setMessages((prevMessages) => [
//                 ...prevMessages,
//                 { message: data.message, user: data.username }
//             ]);

//             // Handle specific messages, such as student joining notification
//             if (data.type === 'class_started') {
//                 // Notify all connected students that they can join the class
//                 setTutorStreaming(true);  // Update state when class starts
//                 setStudentsJoined((prev) => [...prev, data.username]); // Add the tutor to students joined
//             }

//             refetch(); // Refetch chats whenever a new message is received
//         };

//         ws.onerror = (error) => {
//             console.error("WebSocket error", error);
//             setError("WebSocket connection error");
//         };

//         setSocket(ws);
//     };

//     useEffect(() => {
//         connectWebSocket();

//         return () => {
//             if (socket) {
//                 socket.close();
//             }
//         };
//     }, [WebSocket_URL]);

//     const sendMessage = () => {
//         if (socket && messageInputRef.current.value.trim()) {
//             socket.send(JSON.stringify({ message: messageInputRef.current.value, user_id }));
//             messageInputRef.current.value = "";
//         } else {
//             setError("Message cannot be empty");
//         }
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === "Enter") {
//             sendMessage();
//         }
//     };

//     // Triggered when tutor starts the class streaming
//     const startClass = () => {
//         if (socket) {
//             socket.send(JSON.stringify({ type: "class_started", username: user.username })); // Broadcast class start
//             setTutorStreaming(true);  // Set the class as active
//         }
//     };

//     useEffect(() => {
//         // Scroll to the latest message
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     useEffect(() => {
//         // Initialize video player when class starts
//         if (tutorStreaming && videoRef.current) {
//             const player = videojs(videoRef.current, {
//                 autoplay: true,
//                 controls: true,
//                 responsive: true,
//                 fluid: true,
//                 sources: [
//                     {
//                         src: streamURL, // The stream URL
//                         type: 'application/x-mpegURL', // For HLS stream
//                     },
//                 ],
//             });

//             player.ready(() => {
//                 if (player.tech_.hls) {
//                     player.tech_.hls.on('error', (e) => {
//                         console.error('Error in HLS stream:', e);
//                         setError('Unable to load HLS stream.');
//                     });
//                 }
//             });

//             // Error handling for video loading issues
//             player.on('error', (e) => {
//                 console.error('Video.js error:', e);
//                 setError('No compatible source was found for this media.');
//             });

//             // Clean up the player when the component unmounts or class stops
//             return () => {
//                 if (player) {
//                     player.dispose();
//                 }
//             };
//         }
//     }, [tutorStreaming, streamURL]);

//     return (
//         <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
//     <div className="w-16 bg-gradient-to-b from-gray-800 to-gray-700 flex flex-col items-center p-4 space-y-6 shadow-lg">
//         <div className="flex flex-col items-center">
//             <FaUserCircle className="text-gray-400 w-10 h-10 hover:text-white transition-all" />
//             <span className="text-sm mt-2 text-gray-400">User</span>
//         </div>
//         {error && <div className="text-red-500 text-center p-2">{error.message || error}</div>}
//         <div className="flex-grow"></div>
//         {!isChatVisible && (
//             <div>
//                 <button onClick={closeConnection} className="bg-red-600 p-2 rounded-full hover:bg-red-500 transition-all shadow-md mb-4 flex items-center justify-center w-10 h-10">
//                     <FaPhoneAlt className="w-6 h-6 text-white" />
//                 </button>
//             </div>
//         )}
//     </div>

//     <div className={flex-1 flex flex-col transition-all duration-300 ${isChatVisible ? "p-6" : "p-0"}}>
//         <div className={flex-1 bg-gray-700 relative overflow-hidden shadow-lg transition-all duration-300 ${isChatVisible ? "mb-6 rounded-xl" : "h-full rounded-none"}}>
//             <div className="h-full w-full flex justify-center items-center bg-gray-800">
//                 <video className="h-full w-full object-cover" controls>
//                     <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video>
//             </div>
//         </div>

//         <div className="flex justify-center space-x-6 mt-6">
//             {isChatVisible ? (
//                 <button  className="bg-red-600 p-4 rounded-full hover:bg-red-500 transition-all shadow-md">
//                     <FaPhoneAlt className="w-6 h-6 text-white" />
//                 </button>
//             ) : null}
//         </div>
//     </div>

//     <div className={transition-all duration-300 ${isChatVisible ? "w-96 bg-gray-800 p-6 shadow-lg relative" : "w-0 overflow-hidden"}}>
//         {isChatVisible && (
//             <button
//                 onClick={toggleChat}
//                 className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full hover:bg-gray-500 transition-all"
//             >
//                 <FaChevronLeft className="w-5 h-5 text-white" />
//             </button>
//         )}

//         <div className="flex flex-col h-full space-y-4">
//             <div className="flex-1 overflow-y-scroll space-y-4 pr-2">
//                 {chats?.map((chat, index) => (
//                     <div key={index} className="relative bg-gray-900 p-2 rounded-lg shadow-md text-sm transition-all duration-200">
//                         <div className="font-bold">{chat.username}</div>
//                         <div className="text-xs mt-1">{chat.message}</div>
//                         <div className="absolute top-2 right-2 text-xs text-gray-400">{chat.timestamp}</div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             <div className="flex space-x-4">
//                 <input
//                     type="text"
//                     ref={messageInputRef} // Attach the ref to the input
//                     onKeyPress={handleKeyPress}
//                     placeholder="Write message here..."
//                     className="flex-1 bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 shadow-inner"
//                 />
//                 <button onClick={sendMessage} className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-all shadow-md">
//                     <FiSend className="w-5 h-5 text-white" />
//                 </button>
//                 <button className="bg-gray-600 p-2 rounded-lg hover:bg-gray-500 transition-all shadow-md">
//                     <FaSmile className="w-5 h-5 text-white" />
//                 </button>
//             </div>
//         </div>
//     </div>

//     {!isChatVisible && (
//         <button
//             onClick={toggleChat}
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full hover:bg-gray-500 transition-all"
//         >
//             <FaChevronRight className="w-5 h-5 text-white" />
//         </button>
//     )}
// </div>

//     );
// };

// export default LiveClass;