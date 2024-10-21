import React from 'react';
import { useUserPost } from '../api/userside';
import { SlLike } from "react-icons/sl";
import { FaRegCommentDots } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { useSelector } from 'react-redux';

function UserFeed() {
    const baseurl = "http://127.0.0.1:8000/";
    const { data: posts } = useUserPost();
    console.log(posts, 'Posts data');
    return (
        <div className="p-6 rounded-lg w-full h-full mt-4">
            {posts?.length > 0 ? (
                posts.map((post, index) => {
                    const username = post?.users?.[0]?.username || 'Unknown User';
                    const content = post?.content || '';
                    const postImg = post?.post || '';
                    const userImage = post?.users?.[0]?.picture || 'default_profile_pic_url';

                    return (
                        <div key={index} className="mb-6 border-2 shadow-md border-gray rounded-lg p-4">
                            {/* Post Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex space-x-4">
                                    <img
                                        src={userImage}
                                        alt={username}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{username}</h4>
                                        <p className="text-sm text-gray-600">User Info</p>
                                    </div>
                                </div>
                                <button className="text-gray-400">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </div>

                            {/* Post Content */}
                            <div className="mt-4">
                                <p>{content}</p>
                            </div>

                            {/* Post Image */}
                            {postImg && (
                                <div className="mt-4">
                                    <img
                                        src={`${baseurl}${postImg}`}
                                        alt="Post content"
                                        className="rounded-lg w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Post Actions */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex space-x-6">
                                    <button className="flex items-center text-gray-600 space-x-2">
                                    <SlLike />
                                        <span>1</span>
                                    </button>
                                    <button className="flex items-center text-gray-600 space-x-2">
                                    <FaRegCommentDots />
                                    <span>1</span>
                                    </button>
                                    <button className="flex items-center text-gray-600 space-x-2">
                                    <MdSaveAlt />
                                    </button>
                                </div>
                            </div>

                            {/* Comment Box */}
                            <div className="mt-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Write your comment"
                                    className="flex-grow p-2 border border-gray-300 rounded-full"
                                />
                                <button className="ml-2">
                                    <i className="fas fa-paper-plane text-gray-600"></i> {/* Send icon */}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
}

export default UserFeed;
