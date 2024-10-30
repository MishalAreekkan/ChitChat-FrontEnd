import React from 'react';
import UserNavbar from './userNavbar';
import { useVideoList } from '../api/userside';
import { useSelector } from 'react-redux';

function UserVideo() {
    const { data } = useVideoList();
    console.log(data);
    
    const formatDate = (dateString) => {
        const datePart = dateString.split('T')[0]; // Get the date part
        const [year, month, day] = datePart.split('-'); // Split into year, month, day
        return `${day}-${month}-${year}`; // Return formatted date
    };

    const baseURL = "http://127.0.0.1:8000/";
    const user = useSelector(state => state.auth.user);
    
    return (
        <div>
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen p-8">
                {data && data.userVideo && data.userVideo.length > 0 ? (
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                        {/* Main Video Section */}
                        <div className="flex-1">
                            {/* Display the first user video */}
                            {data.userVideo[0] && (
                                <div>
                                    {/* Video Description */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2">
                                            <img src={user?.picture?.startsWith('http') ? user.picture : `${baseURL}${user.picture}`}  alt="Profile" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <h3 className="font-semibold">{data.userVideo[0].username}</h3>
                                                <p className="text-gray-400 text-sm">{formatDate(data.userVideo[0].upload_date)}</p> {/* Use formatted date */}
                                            </div>
                                        </div>

                                        <h1 className="mt-4 text-xl font-bold">{data.userVideo[0].title}</h1>
                                        <p className="mt-2 text-gray-400 text-sm">{data.userVideo[0].description}</p>
                                        <video
                                            src={`${baseURL}${data.userVideo[0].video_file}`}
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
                                            <button className="flex items-center gap-1 text-gray-300 hover:text-white">
                                                <span>Share</span>
                                            </button>
                                            <button className="flex items-center gap-1 text-red-500">
                                                <span>Like</span>
                                            </button>
                                            <p className="text-gray-400 text-sm">125,908 views • 47,987 likes • 1,938,394 streaming</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <input
                                    type="text"
                                    placeholder="Write your message"
                                    className="mt-4 w-full bg-gray-700 p-2 rounded-lg placeholder-gray-400"
                                />
                            </div>

                            {/* Related Videos */}
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold">Related Videos</h2>
                                <div className="space-y-4 mt-4">
                                    {data.allVideo.map((video) => (
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
                                    See All related videos
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
