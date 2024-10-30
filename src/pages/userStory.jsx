import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FaCamera } from "react-icons/fa";
import Stories from 'react-insta-stories';
import { useStoryGet } from '../api/userside';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
};

function UserStory() {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);  // State to hold the selected story index
    const [isOpen, setIsOpen] = useState(false);  // State to control the modal
    const { data, isLoading, error } = useStoryGet();
    const baseurl = "http://127.0.0.1:8000/";

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const createdAt = new Date(dateString);
        const diffInSeconds = Math.floor((now - createdAt) / 1000); // Difference in seconds
    
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);
    
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`; // Return days if more than 1
        }
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`; // Return hours if more than 1
        }
        if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`; // Return minutes if more than 1
        }
        return 'Just now'; // For less than a minute
    };
    

    useEffect(() => {
        if (data && data.all_serializer) {
            const formattedStories = data.all_serializer.map(story => ({
                url: `${baseurl}${story.story}`,  // Construct the full URL of the story image
                duration: 3000, 
                header: {
                    heading:story.username,
                    subheading:formatTimeAgo(story.created_at || ''),
                    // profileImage: 'https://picsum.photos/100/100',
                }, 
            }));
            setStories(formattedStories);
        }
    }, [data]);

    const handleStoryClick = (index) => {
        setSelectedStory(index);  // Set the selected story index when a button is clicked
        setIsOpen(true);  // Open the modal
    };

    const handleClose = () => {
        setIsOpen(false);  // Close the modal
        setSelectedStory(null);  // Reset the selected story index
    };

    const handleStoryEnd = () => {
        if (selectedStory < stories.length - 1) {
            setSelectedStory(selectedStory + 1);  // Move to the next story
        } else {
            handleClose();  // Close modal if at the last story
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="w-full overflow-x-auto flex p-2 gap-2 scrollbar-hide">

                {/* Camera Icon for story upload */}
                <div className="relative border-2 border-black border-dashed rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                    <FaCamera className="absolute text-gray-500 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Stories Component Modal */}
                <Modal
                    open={isOpen}
                    onClose={handleClose}  // Close modal on backdrop click
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
                                            stories={[stories[selectedStory]]}  // Pass only the selected story
                                            defaultInterval={1500}
                                            width={'100%'}  // Set width equal to modal width
                                            // height={100} // Adjust height as needed
                                            onStoryEnd={handleStoryEnd} // Automatically advance to the next story
                                            storyContent={{
                                                width: '100%',  // Full width of the modal
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

                {/* Additional Story Avatars */}
                {stories.map((story, index) => (
                    <div key={index} className="border-2 border-black rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                        <button onClick={() => handleStoryClick(index)}>
                            <img
                                src={story.url}  // Use the URL from the story object
                                alt={`Story ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserStory;
