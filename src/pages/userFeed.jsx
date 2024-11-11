import React, { useEffect, useState } from 'react';
import { useComment, useCommentPost, usePostDiLike, usePostLike, useUserPost } from '../api/userside';
import { SlLike, SlDislike } from "react-icons/sl";
import { FaRegCommentDots } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import MenuItem from "@mui/material/MenuItem";

function UserFeed() {
    const baseurl = "http://127.0.0.1:8000/";
    const { data: posts } = useUserPost();
    const { mutate: liked } = usePostLike();
    const { mutate: disliked } = usePostDiLike();
    const { mutate: comment } = useCommentPost();
    const [postid, setPostid] = useState(null);
    const { data: getComment, refetch: refetchComments } = useComment(postid);
    const [commentText, setCommentText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState({});
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        if (postid) {
            refetchComments();
        }
    }, [postid, refetchComments]);

    const toggleModal = (postId) => {
        setIsModalOpen((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
        if (!isModalOpen[postId]) {
            setPostid(postId); 
        }
    };

    const toggleDropdownMenu = (postId) => {
        setOpenDropdownId((prev) => (prev === postId ? null : postId));
    };

    const handleLike = (postId) => {
        liked(postId, {
            onSuccess: (data) => console.log('Liked post:', data),
            onError: (error) => console.error('Like action failed:', error),
        });
    };

    const handleDisLike = (postId) => {
        disliked(postId, {
            onSuccess: (data) => console.log('Disliked post:', data),
            onError: (error) => console.error('Dislike action failed:', error),
        });
    };

    const handleCommentSubmit = (postId) => {
        if (!commentText) return; 
            console.log("Submitting comment:", { postId, commentText });
        
        comment({ postId, commentText }, {
            onSuccess: () => {
                setCommentText('');
                refetchComments();
            },
            onError: (error) => console.error('Comment submission failed:', error),
        });
    };

    const formatDate = (dateString) => {
        const datePart = dateString?.split('T')[0];
        if (!datePart) return "";
        const [year, month, day] = datePart.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="p-6 rounded-lg w-full h-full mt-4">
            {posts?.follow_post?.length > 0 ? (
                <div>
                    {posts.follow_post.map((post) => (
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
                                    <button
                                        onClick={() => toggleModal(post.id)} // Toggle the modal for the specific post
                                        className="flex items-center text-gray-600 space-x-2"
                                    >
                                        <FaRegCommentDots />
                                    </button>
                                    <button className="flex items-center text-gray-600 space-x-2">
                                        <MdSaveAlt />
                                    </button>
                                </div>
                            </div>
                            {/* Modal */}
                            {isModalOpen[post.id] && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-out overflow-auto">
                                    <div className="bg-white flex flex-col md:flex-row w-full max-w-3xl rounded-lg shadow-lg overflow-hidden relative">
                                        <div className="bg-green-300 w-full md:w-1/2 flex items-center justify-center">
                                            <img
                                                src={`${baseurl}${post.post}`}
                                                alt="Post content"
                                                className="rounded-lg h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 h-full flex flex-col p-4">
                                            <div className="flex items-center mb-4">
                                                <img
                                                    src={`${baseurl}${post.picture || 'http://127.0.0.1:8000/profile_pictures/25739136.jpg'}`}
                                                    alt={post.username || 'Unknown User'}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <span className="ml-3 font-semibold">Comment on {post.username}'s Post</span>
                                            </div>
                                            <div className="flex-grow overflow-auto mb-4 max-h-60">
                                                {getComment && getComment.map((comment) => (
                                                    <div key={comment.id}>
                                                        <p>{comment.comments}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 border-t">
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="w-full h-24 p-2 border rounded mb-4"
                                                />
                                                <div className="flex justify-between w-full">
                                                    <button
                                                        onClick={() => handleCommentSubmit(post.id)}
                                                        className="bg-blue-500 text-white rounded px-4 py-2"
                                                    >
                                                        Submit Comment
                                                    </button>
                                                    <button
                                                        onClick={() => toggleModal(post.id)}
                                                        className="bg-gray-500 text-white rounded px-4 py-2"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
}

export default UserFeed;
