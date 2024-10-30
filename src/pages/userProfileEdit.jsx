import UserNavbar from './userNavbar';
import { FaCamera } from "react-icons/fa";
import { useSelector } from 'react-redux';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useCameraPicture, useProfile, useProfileEdit, useStoryGet, useUserProfile, } from '../api/userside';
import UserProfilePost from './userProfilePost';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const archiveStyle = {
    ...style,
    width: 600,
};

function UserProfileEdit() {
    const logged_user = useSelector(state => state.auth.user);
    const { data: user } = useUserProfile(logged_user.user_id);
    const baseUrl = "http://127.0.0.1:8000/";
    const [open, setOpen] = React.useState(false);
    const [openArchive, setOpenArchive] = React.useState(false);

    const [selectedFile, setSelectedFile] = React.useState(null);
    const mutation = useCameraPicture(logged_user.user_id)
    const [openCameraModal, setOpenCameraModal] = React.useState(false);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const { mutate: editProfile, isLoading } = useProfileEdit(logged_user.user_id);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [picture, setPicture] = React.useState(null);

    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const { data } = useStoryGet();
    const { data:count} = useProfile()
    console.log(count,'lllllllllllllll');
    
    const stories = data?.stories || [];
    const archived_stories = data?.archived_stories || [];
    const handleOpen = () => {
        setOpen(true);
        setUsername(user.username);
        setEmail(user.email);
    };
    const handleClose = () => setOpen(false);
    const handleOpenArchive = () => setOpenArchive(true);
    const handleCloseArchive = () => setOpenArchive(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (picture) {
            formData.append('picture', picture);
        }
        editProfile(formData, {
            onSuccess: () => {
                handleClose();
            },
        });
    };


    // const handleOpenCameraModal = () => {
    //     setOpenCameraModal(true);
    //     handleCameraStart(); // Start the camera
    // };

    // const handleCloseCameraModal = () => {
    //     if (videoRef.current) {
    //         const stream = videoRef.current.srcObject;
    //         if (stream) {
    //             stream.getTracks().forEach(track => track.stop());
    //         }
    //     }
    //     setOpenCameraModal(false);
    //     setPicture(null);
    // };

    // const handleCameraStart = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //         videoRef.current.srcObject = stream;
    //     } catch (error) {
    //         console.error("Error accessing the camera: ", error);
    //     }
    // };


    // const handleCapture = () => {
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext('2d');
    //     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    //     canvas.toBlob(blob => {
    //         const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
    //         setPicture(file); // Update here to use setPicture
    //     });
    // };

    // const handleCameraUpload = async (e) => {
    //     e.preventDefault();
    //     if (!picture) {
    //         alert("No image captured.");
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('picture', picture); // Use the captured picture
    //     mutation.mutate(formData, {
    //         onSuccess: () => {
    //             alert("Profile picture updated successfully!");
    //             handleCloseCameraModal();
    //         },
    //         onError: (error) => {
    //             alert("Error updating profile picture: " + error.message);
    //         },
    //     });
    // };
    // const handleUpload = (e) => {
    //     e.preventDefault();
    //     if (!selectedFile) {
    //         alert("Please select a file first.");
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('picture', selectedFile);
    //     mutation.mutate(formData, {
    //         onSuccess: () => {
    //             alert("Profile picture updated successfully!");
    //             handleCloseCameraModal();
    //         },
    //         onError: (error) => {
    //             alert("Error updating profile picture: " + error.message);
    //         },
    //     });
    // };

    return (
        <>
            <div>
                <UserNavbar />
                <div className="flex flex-col items-center w-full p-6 bg-gray-100">
                    <div className='flex justify-center gap-x-60'>
                        <div className="relative">
                            <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
                                <img
                                    className="w-40 h-40 rounded-full flex items-center justify-center"
                                    src={user ? (user.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`) : 'default-image-url.jpg'}
                                    alt="Profile"
                                />
                            </div>
                            <div className="absolute top-5 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                {/* <button onClick={handleOpenCameraModal}> */}
                                <button >
                                    <FaCamera />
                                </button>
                            </div>
                        </div>


                        <div className="mt-4 text-center">
                            <h1 className="font-bold text-lg">{user?.username}</h1>
                            <div className="mt-2 space-x-2">
                                <Button onClick={handleOpen}>Edit</Button>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <form onSubmit={handleSubmit}>
                                            <Box
                                                component="div"
                                                sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                                            >
                                                <TextField
                                                    id="username"
                                                    label="Username"
                                                    variant="standard"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                    fullWidth
                                                />
                                                <TextField
                                                    id="email"
                                                    label="Email"
                                                    variant="standard"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    fullWidth
                                                />
                                                <TextField
                                                    id="picture"
                                                    type="file"
                                                    variant="standard"
                                                    onChange={(e) => setPicture(e.target.files[0])}
                                                    fullWidth
                                                />
                                            </Box>
                                            <Box sx={{ mt: 2 }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                                </Button>
                                                <Button
                                                    onClick={handleClose}
                                                    variant="outlined"
                                                    color="secondary"
                                                    sx={{ ml: 2 }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </form>
                                    </Box>
                                </Modal>
                                <Button onClick={handleOpenArchive} className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded">View archive</Button>
                                {/* Archive Modal */}
                                <Modal
                                    open={openArchive}
                                    onClose={handleCloseArchive}
                                    aria-labelledby="archive-modal-title"
                                    aria-describedby="archive-modal-description"
                                >
                                    <Box sx={archiveStyle}>
                                        <Typography id="archive-modal-title" variant="h6" component="h2">
                                            Archived Stories
                                        </Typography>
                                        <Typography id="archive-modal-description" sx={{ mt: 2 }}>
                                            <div className="mt-4">
                                                {archived_stories && archived_stories.length > 0 ? (
                                                    archived_stories.map((storyItem) => (
                                                        <div key={storyItem.id} className="p-4 border-b border-gray-300">
                                                            <img
                                                                src={`${baseUrl}${storyItem.story}`}
                                                                alt={`Story by ${storyItem.user.username}`}
                                                                className="w-full h-auto rounded"
                                                            />
                                                            <p className="text-gray-600 mt-2">Created at: {new Date(storyItem.created_at).toLocaleString()}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No archived stories found.</p>
                                                )}
                                            </div>
                                        </Typography>
                                        <Button onClick={handleCloseArchive} variant="outlined" color="secondary" sx={{ mt: 2 }}>
                                            Close
                                        </Button>
                                    </Box>
                                </Modal>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <div>
                                    <h2 className="font-bold">0</h2>
                                    <p className="text-gray-500 text-sm">Posts</p>
                                </div>
                                <div>
                                    <h2 className="font-bold">{count?.following_count}</h2>
                                    <p className="text-gray-500 text-sm">Followers</p>
                                </div>
                                <div>
                                    <h2 className="font-bold">{count?.followers_count}</h2>
                                    <p className="text-gray-500 text-sm">Following</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-4 text-center">
                            <div className=''>
                                <button>
                                    <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                                        <FaCamera />
                                    </div>
                                    New!
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-6 space-y-4">
                        <h2 className="font-bold text-lg">Share Photos</h2>
                        <p className="text-gray-500 text-center text-sm">
                            When you share photos, they will appear on your profile.
                        </p>
                    </div>
                    <div>
                    </div>
                    {/* Tabs */}
                    <UserProfilePost/>
                </div>
                {/* <Modal open={openCameraModal} onClose={handleCloseCameraModal}>
                    <Box sx={{ width: 400, height: 300, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Capture Profile Picture</Typography>
                        <video
                            ref={videoRef}
                            autoPlay
                            style={{ width: '320px', height: '240px', border: '1px solid black' }} // Set the size of the video
                        ></video>
                        <Button onClick={handleCapture} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Capture Image
                        </Button>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </Box>
                </Modal> */}

            </div>
        </>
    );
}

export default UserProfileEdit;
