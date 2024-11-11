import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FaCamera } from "react-icons/fa";
import Stories from 'react-insta-stories';
import { useStoryGet, useStoryPost } from '../api/userside';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'white',
    borderRadius: '8px',
    boxShadow: 24,
};

function UserStory() {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { data, isLoading, error } = useStoryGet();
    const { mutate: uploadStory } = useStoryPost();

    const baseurl = "http://127.0.0.1:8000/";

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const createdAt = new Date(dateString);
        const diffInSeconds = Math.floor((now - createdAt) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    useEffect(() => {
        if (data && data.all_serializer) {
            const formattedStories = data.all_serializer.map(story => ({
                url: `${baseurl}${story.story}`,
                duration: 3000,
                header: {
                    heading: story.username,
                    subheading: formatTimeAgo(story.created_at || ''),
                },
            }));
            setStories(formattedStories);
        }
    }, [data]);

    const handleStoryClick = (index) => {
        setSelectedStory(index);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedStory(null);
    };

    const handleStoryEnd = () => {
        if (selectedStory < stories.length - 1) {
            setSelectedStory(selectedStory + 1);
        } else {
            handleClose();
        }
    };

    const handleUploadOpen = () => {
        setIsUploadOpen(true);
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
    };

    const handleUploadSubmit = async (formData) => {
        uploadStory(formData, {
            onSuccess: () => {
                console.log('Story uploaded successfully');
                handleUploadClose();
            },
            onError: (error) => {
                console.error('Error uploading story:', error);
            },
        });
    };

    return (
        <div className="w-full bg-white">
            <div className="w-full overflow-x-auto flex p-2 gap-2 scrollbar-hide">
                <div className="relative border-2 border-black border-dashed rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                    <button onClick={handleUploadOpen}>
                        <FaCamera className="absolute text-gray-500 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </button>
                </div>

                <Modal
                    open={isOpen}
                    onClose={handleClose}
                    aria-labelledby="story-title"
                    aria-describedby="story-description"
                >
                    <Box sx={style}>
                        {selectedStory !== null && (
                            <div className="w-full h-full">
                                {isLoading ? (
                                    <p>Loading stories...</p>
                                ) : error ? (
                                    <p>Error loading stories!</p>
                                ) : (
                                    stories.length > 0 ? (
                                        <Stories
                                            stories={[stories[selectedStory]]}
                                            defaultInterval={3000}
                                            width={'100%'}
                                            onStoryEnd={handleStoryEnd}
                                            storyContent={{
                                                width: '100%',
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                margin: 'auto',
                                            }}
                                        />
                                    ) : (
                                        <p>No stories available.</p>
                                    )
                                )}
                            </div>
                        )}
                    </Box>
                </Modal>

                {stories.map((story, index) => (
                    <div key={index} className="border-2 border-black rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                        <button onClick={() => handleStoryClick(index)}>
                            <img
                                src={story.url}
                                alt={`Story ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    </div>
                ))}
            </div>

            {/* Upload Story Modal */}
            <Modal
                open={isUploadOpen}
                onClose={handleUploadClose}
                aria-labelledby="upload-story-title"
                aria-describedby="upload-story-description"
            >
                <Box sx={style} >
                    <div className="p-5">
                        <h2 id="upload-story-title" className="text-xl font-semibold mb-6 text-gray-800 text-center">Upload Story</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const fileInput = e.target.elements.file;
                                const file = fileInput.files[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('story', file);
                                    handleUploadSubmit(formData);
                                }
                            }}
                        >
                            <input
                                type="file"
                                name="file"
                                accept="image/*,video/*"
                                className="mb-6 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleUploadClose}
                                    className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 focus:outline-none transition duration-200 ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none transition duration-200 ease-in-out"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default UserStory;
