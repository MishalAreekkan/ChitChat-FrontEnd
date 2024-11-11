import React from 'react';
import UserNavbar from './userNavbar';
import { useVideoDisLike, useVideoLike, useVideoList } from '../api/userside';
import { useSelector } from 'react-redux';
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";

function UserVideo() {
    const { data } = useVideoList();
    const { mutate: like } = useVideoLike();
    const { mutate: dislike } = useVideoDisLike();
    const user = useSelector(state => state.auth.user);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}-${month}-${year}`;
    };

    const baseURL = "http://127.0.0.1:8000/";

    const handleLike = (postId) => {
        like(postId, {
            onSuccess: (data) => console.log('Liked post:', data),
            onError: (error) => console.error('Like action failed:', error),
        });
    };

    const handleDisLike = (postId) => {
        dislike(postId, {
            onSuccess: (data) => console.log('Disliked post:', data),
            onError: (error) => console.error('Dislike action failed:', error),
        });
    };
    console.log(like,'lliieeeeekee');
    
    const toggleModal = (postId) => {

    };

    return (
        <div>
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen p-8">
                {data?.allVideo?.length > 0 ? (
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                        {/* Main Video Section */}
                        <div className="flex-1 overflow-auto h-screen">
                            {data.allVideo.map((video) => (
                                <div key={video.id} className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <h3 className="font-semibold">{video.username}</h3>
                                            <p className="text-gray-400 text-sm">
                                                {formatDate(video.upload_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <h1 className="mt-4 text-xl font-bold">{video.title}</h1>
                                    <p className="mt-2 text-gray-400 text-sm">{video.description}</p>
                                    <video
                                        src={`${baseURL}${video.video_file}`}
                                        controls
                                        controlsList="nodownload"
                                        width="640"
                                        height="360"
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                    {/* Video Actions */}
                                    <div className="flex items-center gap-4 mt-4">
                                        <button onClick={() => handleLike(video.id)} className="flex items-center text-gray-600 space-x-2">
                                            <BiSolidLike />
                                            <span>{video.total_likes || 0}</span>
                                        </button>
                                        <button onClick={() => handleDisLike(video.id)} className="flex items-center text-gray-600 space-x-2">
                                            <BiSolidDislike />
                                        </button>
                                        <button
                                            onClick={() => toggleModal(video.id)}
                                            className="flex items-center text-gray-600 space-x-2"
                                        >
                                            <FaRegCommentDots />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8">
                            {/* Live Chat */}
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold">Trending Now!</h2>
                                <div className="space-y-2">
                                    {["Wijaya Abadi", "Johny Wise", "Budi Hakim", "Thomas Hope"].map((user, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <p className="text-gray-300">{user}</p>
                                        </div>
                                    ))}
                                </div>
                                <button>
                                    <div>
                                        Watch Now
                                    </div>
                                </button>
                            </div>

                            {/* Related Videos */}
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold">My Videos</h2>
                                <div className="space-y-4 mt-4">
                                    {data.userVideo && data.userVideo.map((video) => (
                                        <div key={video.id} className="flex items-center gap-4">
                                            <img
                                                src={video.thumbnail || '/path/to/default-thumbnail.jpg'}
                                                alt="Related video"
                                                className="w-16 h-16 rounded-lg"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{video.title}</h3>
                                                <p className="text-gray-400 text-sm">{video.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 w-full text-center bg-gray-700 py-2 rounded-lg">
                                    Upload Reel
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">No videos found.</div>
                )}
            </div>
        </div>
    );
}

export default UserVideo;
