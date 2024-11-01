import React, { useState } from 'react';
import { usePostDiLike, usePostLike, useUserPost } from '../api/userside';
import { SlLike } from "react-icons/sl";
import { FaRegCommentDots } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { SlDislike } from "react-icons/sl";
import MenuItem from "@mui/material/MenuItem";

function UserFeed() {
    const baseurl = "http://127.0.0.1:8000/";
    const { data: posts, isLoading, error } = useUserPost();  // Handle loading and error states
    const { mutate: liked } = usePostLike();
    const { mutate: disliked } = usePostDiLike();
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const toggleDropdownMenu = (postId) => {
        setOpenDropdownId((prev) => (prev === postId ? null : postId));
    };

    const handleOptionSelect = (value) => {
        console.log("Selected Option:", value);
        setOpenDropdownId(null);
    };

    const formatDate = (dateString) => {
        const datePart = dateString?.split('T')[0];
        if (!datePart) return "";
        const [year, month, day] = datePart.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleLike = (postId) => {
        liked(postId, {
            onSuccess: (data) => {
                console.log('Liked post:', data);
            },
            onError: (error) => {
                console.error('Like action failed:', error);
            },
        });
    };

    const handleDisLike = (postId) => {
        disliked(postId, {
            onSuccess: (data) => {
                console.log('DisLiked post:', data);
            },
            onError: (error) => {
                console.error('DisLike action failed:', error);
            },
        });
    };

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p>Error fetching posts: {error.message}</p>;

    return (
        <div className="p-6 rounded-lg w-full h-full mt-4">
            {posts?.all_posts?.length > 0 ? (
                <div>
                    {posts.all_posts.map((post) => (
                        <div key={post.id} className="mb-6 border-2 shadow-md border-gray rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex space-x-4">
                                    <img
                                        src={`${baseurl}${post.picture || 'default_profile_pic_url'}`}
                                        alt={post.username || 'Unknown User'}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{post.username || 'Unknown User'}</h4>
                                        <p className="text-sm text-gray-600">{formatDate(post.created_at || '')}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => toggleDropdownMenu(post.id)} className="ml-2">
                                        <CiMenuKebab />
                                    </button>
                                    {openDropdownId === post.id && (
                                        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded shadow-lg z-10">
                                            <MenuItem onClick={() => handleOptionSelect(1)}>Report Post</MenuItem>
                                            <MenuItem onClick={() => handleOptionSelect(2)}>Not interested in {post.username || 'Unknown User'}'s Post</MenuItem>
                                            <MenuItem onClick={() => handleOptionSelect(3)}>Unfollow {post.username || 'Unknown User'}</MenuItem>
                                            <MenuItem onClick={() => setOpenDropdownId(null)} className="text-red px-4 py-2 rounded-lg">Close</MenuItem>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p>{post.content}</p>
                            </div>
                            {post.post && (
                                <div className="mt-4">
                                    <img
                                        src={`${baseurl}${post.post}`}
                                        alt="Post content"
                                        className="rounded-lg w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex space-x-6">
                                    <button onClick={() => handleLike(post.id)} className="flex items-center text-gray-600 space-x-2">
                                        <SlLike />
                                        <span>{post.total_likes || 0}</span>
                                    </button>
                                    <button onClick={() => handleDisLike(post.id)} className="flex items-center text-gray-600 space-x-2">
                                    <SlDislike />
                                    </button>
                                    <button className="flex items-center text-gray-600 space-x-2">
                                        <FaRegCommentDots />
                                        <span>{post.commentsCount || 0}</span>
                                    </button>
                                    <button className="flex items-center text-gray-600 space-x-2">
                                        <MdSaveAlt />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Write your comment"
                                    className="flex-grow p-2 border border-gray-300 rounded-full"
                                />
                                <button className="ml-2">
                                    <i className="fas fa-paper-plane text-gray-600"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
}

export default UserFeed;
