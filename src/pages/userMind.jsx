import React from 'react';
import { useSelector } from 'react-redux';
import { useFeedPost, useUserPost } from '../api/userside';
import { FaImage } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { MdOutlineGifBox } from "react-icons/md";

function UserMind() {
    const baseUrl = "http://127.0.0.1:8000/"
    const { mutate: postfeed, isLoading } = useFeedPost();
    const [postContent, setPostContent] = React.useState('');
    const user = useSelector(state => state.auth.user);

    const handlePost = () => {
        if (postContent.trim()) {
            postfeed({ content: postContent, user: user.id });
            setPostContent(''); 
        }
    };

    return (
        <div className="m-4 p-6 rounded-lg bg-white shadow-lg">
            <div className="flex items-center mb-4">
                <img
                    className="w-12 h-12 rounded-full"
                    src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`}
                    alt="Profile"
                />
                <input
                    type="text"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={`What’s on your mind, ${user.username}?`}
                    className="ml-4 flex-grow bg-gray-100 px-4 py-2 rounded-lg text-gray-600"
                />
            </div>
            <div className='border-t-2 pt-4'>
                <div className="flex justify-between mt-4">
                    <div className="flex space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <FaImage />
                            <span className="ml-2">Image</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <IoMdVideocam />
                            <span className="ml-2">Video</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                            <MdOutlineGifBox />
                            <span className="ml-2">Gif</span>
                        </button>
                    </div>
                    <button
                        onClick={handlePost}
                        disabled={isLoading}
                        className={`bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserMind;
