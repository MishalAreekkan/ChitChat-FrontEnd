import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useCommunity, useCreateCommunity, useMessageShow } from '../../api/userChat';
import UserNavbar from '../../pages/userNavbar';
import { userList } from '../../api/userside';

function GroupChat() {
  const user = useSelector((state) => state.auth.user);
  const baseUrl = "http://127.0.0.1:8000/";
  const { mutate: createGroup } = useCreateCommunity();
  const { data: communityList } = useCommunity();
  const { data: userListData } = userList();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityName, setCommunityName] = useState('');
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notificationSocket = useRef(null);

  // Fetching messages for selected community
  const { data: communityMessage, isLoading: isMessagesLoading, error: messageError, refetch } = useMessageShow({
    communityName: selectedCommunity?.name,
  });
  console.log(messages,'messages');
  
  // WebSocket Connection for Chat
  useEffect(() => {
    if (!selectedCommunity) return;

    const ws = new WebSocket(`ws://localhost:8001/ws/community/${selectedCommunity.name}/`);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      setMessages((prevMessages) => [
        ...(Array.isArray(prevMessages) ? prevMessages : []),
        data.message,
      ]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      alert('WebSocket connection error!');
    };

    ws.onclose = () => console.log('WebSocket closed');

    setSocket(ws);

    return () => ws.close();
  }, [selectedCommunity]);

  // Send message to the community
  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const messageData = {
        message: inputMessage.trim(),
        sender_id: user.id,
        sender_name: user.username || 'Anonymous',
        timestamp: new Date().toISOString(),
        picture: user.picture,
      };
      socket.send(JSON.stringify(messageData));
      setInputMessage('');
      refetch(); // Refetch messages after sending a new one
    }
  };

  // Create a new community
  const handleCreateCommunity = (e) => {
    e.preventDefault();
    setIsLoading(true);
    createGroup(
      { name: communityName, members: users },
      {
        onSuccess: () => {
          setCommunityName('');
          setUsers([]);
          setIsModalOpen(false);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Error creating community:', error);
          setError('Failed to create community. Please try again.');
          setIsLoading(false);
        },
      }
    );
  };

  // Add users to the community
  const handleAddUser = (id) => {
    if (!users.includes(id)) setUsers((prevUsers) => [...prevUsers, id]);
  };

  // Update messages when new data is fetched
  useEffect(() => {
    if (communityMessage) {
      console.log('Fetched messages:', communityMessage);
      setMessages(communityMessage);
    }
  }, [communityMessage]);

  // Notification WebSocket for new messages
  useEffect(() => {
    if (user && user.username) {
      notificationSocket.current = new WebSocket(`ws://localhost:8001/ws/notifications/${user.username}/`);

      notificationSocket.current.onopen = () => {
        console.log('Notification WebSocket connected');
      };

      notificationSocket.current.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log('Message received:', data);
        if (data.type === 'new_message') {
          setMessages((prevMessages) => {
            if (Array.isArray(prevMessages)) {
              return [...prevMessages, data.message];
            }
            return [data.message]; // Ensure it's an array
          });
        }
      };

      notificationSocket.current.onclose = () => {
        console.log('WebSocket closed');
      };

      return () => {
        if (notificationSocket.current) {
          notificationSocket.current.close();
        }
      };
    }
  }, [user]);
  console.log(communityMessage,'commmunity mesage');
  
  return (
    <div>
      <UserNavbar />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-4 border-r">
          <div className="items-center mb-6">
            <img
              className="w-20 h-20 rounded-full mx-auto"
              alt="User Avatar"
              src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user?.picture || '/default-avatar.png'}`}
            />
            <p className="text-lg text-center text-gray-500">{user?.username || 'User'}</p>
          </div>
          <div>
            <input
              type="search"
              placeholder="Search a group"
              className="w-full p-2 border mb-2"
            />
            <button className="w-full p-2 bg-blue-500 text-white">Search</button>

            <h2 className="mt-4 font-semibold">Create Community</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full p-2 bg-green-500 text-white"
            >
              Create
            </button>
            {error && <p className="text-red-500">{error}</p>}

            <h4 className="mt-4 font-semibold">Your Communities</h4>
            <ul>
              {communityList?.map((community) => (
                <li
                  key={community.id}
                  onClick={() => setSelectedCommunity(community)}
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  {community.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 p-4">
          {selectedCommunity ? (
            <>
              <header className="flex justify-between items-center border-b pb-2 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCommunity.name}</h2>
                  <p className="text-sm text-gray-500">{messages.length} messages</p>
                </div>
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  Leave Community
                </button>
              </header>
              <div className="overflow-y-auto max-h-96 border rounded-lg p-4 bg-gray-50 shadow-lg">
                {isMessagesLoading ? (
                  <p className="text-center text-lg text-gray-500">Loading messages...</p>
                ) : messageError ? (
                  <p className="text-center text-lg text-red-500">Error loading messages</p>
                ) : !Array.isArray(communityMessage.results) || communityMessage.results.length === 0 ? (
                  <p className="text-center text-lg text-gray-400">No messages yet</p>
                ) : (
                  communityMessage.results.map((msg, index) => (
                    <div key={index} className="mb-4 p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="flex items-start space-x-4">
                        {/* Sender's profile picture */}
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                          {msg.sender_name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-gray-800">{msg.sender_name}</p>
                            <span className="text-sm text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="mt-2 text-gray-700">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="w-full p-2 border rounded-l-md"
                  placeholder="Type a message"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-500 text-white rounded-r-md"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Select a community to join</p>
          )}
        </main>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Create Community</h2>
            <form onSubmit={handleCreateCommunity}>
              <input
                type="text"
                className="w-full p-2 border mb-4"
                placeholder="Community name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
              />
              <div className="mb-4">
                <p>Add users:</p>
                {userListData?.map((userItem) => (
                  <div key={userItem.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={users.includes(userItem.id)}
                      onChange={() => handleAddUser(userItem.id)}
                    />
                    <span className="ml-2">{userItem.username}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`p-2 rounded-md ${isLoading ? 'bg-gray-300' : 'bg-green-500'} text-white`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupChat;
