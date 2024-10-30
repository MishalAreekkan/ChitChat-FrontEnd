import React from 'react';
import { useSelector } from 'react-redux';
import { useFeedPost } from '../api/userside';
import { FaImage } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { MdOutlineGifBox } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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

function UserMind() {
    const baseUrl = "http://127.0.0.1:8000/";
    const { mutate: postfeed, isLoading } = useFeedPost();
    const [postContent, setPostContent] = React.useState('');
    const [file, setFile] = React.useState(null);
    const user = useSelector(state => state.auth.user);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState('');

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handlePost = () => {
        if (postContent.trim() || description.trim() || file) {
            const formData = new FormData();
            formData.append('content', postContent || description);
            formData.append('user', user.id);
            if (file) formData.append('post', file);
            postfeed(formData);
            setPostContent('');
            setFile(null);
            handleClose();
        }
    };

    return (
        <>
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
                        placeholder={`What’s on your mind, ${user?.username || 'User'}?`}
                        className="ml-4 flex-grow bg-gray-100 px-4 py-2 rounded-lg text-gray-600"
                    />
                </div>
                <div className='border-t-2 pt-4'>
                    <div className="flex justify-between mt-4">
                        <div className="flex space-x-4">
                            <button onClick={() => handleOpen('image')} className="flex items-center text-gray-500 hover:text-gray-700">
                                <FaImage />
                                <span className="ml-2">Image</span>
                            </button>
                            <button className="flex items-center text-gray-500 hover:text-gray-700">
                                <IoMdVideocam />
                                <span className="ml-2">Video call</span>
                            </button>
                            <button onClick={() => handleOpen('feeling')} className="flex items-center text-gray-500 hover:text-gray-700">
                                <MdOutlineGifBox />
                                <span className="ml-2">Feeling/Activity</span>
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
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                            {modalType === 'image' ? 'Create Post' : 'Feeling/Activity'}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {modalType === 'image' ? (
                                <Box component="div" sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                                    <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 mb-6 bg-white hover:shadow-lg transition flex items-center justify-center cursor-pointer">
                                        <input
                                            name="file"
                                            type="file"
                                            accept="image/*,video/*"
                                            className="hidden"
                                            id="fileUpload"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer">
                                            <FiUploadCloud size={32} className="text-gray-500" />
                                            <span className="text-gray-600 mt-2">Drag & drop media or click to browse</span>
                                        </label>
                                    </div>
                                    <TextField
                                        id="description"
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        placeholder="Add a description..."
                                        fullWidth
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                    />
                                    <button
                                        onClick={handlePost}
                                        disabled={isLoading}
                                        className={`bg-black text-white mt-2 px-4 py-2 rounded-lg hover:bg-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Posting...' : 'Post'}
                                    </button>
                                </Box>
                            ) : (
                                'What are you feeling or doing?'
                            )}
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default UserMind;
