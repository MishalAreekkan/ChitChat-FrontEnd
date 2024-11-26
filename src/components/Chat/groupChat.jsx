import React, { useState, useEffect } from 'react';
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

  console.log(selectedCommunity, "kkkkkkkkkk");


  // Updated useMessageShow hook call
  const { data: communityMessage, isLoading: isMessagesLoading, error: messageError, refetch } = useMessageShow({
    communityName: selectedCommunity?.name
  });
  console.log(communityMessage, "communityMessage");

  // WebSocket Connection
  useEffect(() => {
    if (!selectedCommunity) return;

    const ws = new WebSocket(`ws://localhost:8001/ws/community/${selectedCommunity.name}/`);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      alert('WebSocket connection error!');
    };
    ws.onclose = () => console.log('WebSocket closed');

    setSocket(ws);

    // Cleanup WebSocket connection on component unmount or community change
    return () => ws.close();
  }, [selectedCommunity]);

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
      refetch();
    }
  };

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

  const handleAddUser = (id) => {
    if (!users.includes(id)) setUsers((prevUsers) => [...prevUsers, id]);
  };

  useEffect(() => {
    if (communityMessage) {
      setMessages(communityMessage);
    }
  }, [communityMessage]);

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
              <div className="overflow-y-auto max-h-96 border rounded-lg p-4">
                {isMessagesLoading ? (
                  <p>Loading messages...</p>
                ) : messageError ? (
                  <p className="text-red-500">Error loading messages</p>
                ) : messages.length === 0 ? (
                  <p>No messages yet</p>
                ) : (
                  communityMessage
                    ?.filter(
                      (msg) => msg.nestedcommunity.name === selectedCommunity.name
                    )
                    .map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${msg.sender_id === user.id ? "text-right" : ""
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{msg.sender_name}</strong>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp}
                            </span>
                          </div>
                          {msg.picture && (
                            <img
                              src={msg.picture}
                              alt="user"
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                        </div>
                        <p>{msg.message}</p>
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
            <h2 className="text-lg font-semibold mb-4">Create a New Community</h2>
            <form onSubmit={handleCreateCommunity}>
              <input
                type="text"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full p-2 mb-2 border rounded-md"
                placeholder="Community Name"
                required
              />
              <div className="mb-4">
                <h4 className="font-semibold">Add Members</h4>
                {userListData?.map((userItem) => (
                  <div key={userItem.id} className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={() => handleAddUser(userItem.id)}
                      checked={users.includes(userItem.id)}
                    />
                    <span className="ml-2">{userItem.username}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 text-gray-700 p-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`p-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupChat;
