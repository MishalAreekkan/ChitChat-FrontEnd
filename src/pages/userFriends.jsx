import React from 'react'
import { IoMdPersonAdd } from "react-icons/io";
import { useAccept, useFollowUser, useFriendSuggest, userRequest } from '../api/userside';

function UserFriends({ user_id }) {
    const baseurl = "http://127.0.0.1:8000/";


    const { mutate: followUser, isLoading } = useFollowUser(user_id);
    const { data: friends } = userRequest()

    const { mutate: accept } = useAccept()

    const { data: users } = useFriendSuggest()

    const handleFollowClick = (user_id) => {
        followUser(user_id);
    };

    const handleAcceptClick = (friendId) => {
        accept(friendId);
        console.log(`Follow request for user ID: ${friendId}`);
    };

    const handleDenyClick = (userId) => {
        // Implement deny action here
        console.log(`Deny request for user ID: ${userId}`);
    };
    return (
        <div className='w-full h-full p-5 overflow-auto'>
            <div className="w-full shadow-md rounded-lg border-2">
                <marquee>Friend Requests {friends?.requested_users_count}</marquee>

                <div className="p-5 border-t">
                    {friends?.requested_users?.map((friend, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={`${baseurl}${friend?.picture}`}
                                    alt={friend?.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <p className="text-sm">{friend?.username}</p>
                                    <p className="text-gray-500 text-sm">{friend.profession}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAcceptClick(friend.id)}
                                     className="border border-gray-300 p-1 text-sm rounded-full"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleDenyClick(friend.id)}
                                    className="border border-gray-300 p-1 text-sm rounded-full"
                                >
                                    Deny
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Friend Suggestion  */}

            <div className="w-full shadow-md rounded-lg border-2 mt-6">
                <marquee >Friend Suggestion</marquee>

                <div className="p-5 border-t">

                    {users?.map((user, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={`${baseurl}${user?.picture}`} alt={user?.username} className="w-12 h-12 rounded-full object-cover" />
                                <div className="ml-4">
                                    <p className="text-sm">{user?.name}</p>
                                    <p className="text-gray-500 text-sm ">{user?.username}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2 ">
                                <IoMdPersonAdd onClick={() => handleFollowClick(user.id)} />
                                {/* {followUserMutation.isLoading ? 'Requesting...' : 'Requested'} */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default UserFriends
