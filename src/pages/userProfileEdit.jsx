import UserNavbar from './userNavbar'
import { FaCamera } from "react-icons/fa";
import { useSelector } from 'react-redux';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useProfileEdit } from '../api/userside';

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


function UserProfileEdit() {
    const user = useSelector(state => state.auth.user)
    console.log(user,'uuuuuuuuuu');
    const baseUrl = "http://127.0.0.1:8000/"
    const [open, setOpen] = React.useState(false);
    const { mutate: editProfile, isLoading } = useProfileEdit()
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [picture, setPicture] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
        setUsername(user.username);
        setEmail(user.email);
    };
    const handleClose = () => setOpen(false);

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

    return (<>
        <div>
            <UserNavbar />
            <div className="flex flex-col items-center w-full p-6 bg-gray-100">
                <div className='flex justify-center gap-x-60'>
                    <div className="relative">
                        <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
                            <img
                                className="w-40 h-40 rounded-full flex items-center justify-center"
                                src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`}
                                alt="Profile"
                            />
                        </div>
                        <div className="absolute top-5 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                            <button>
                                <FaCamera />
                            </button>
                        </div>
                    </div>


                    <div className="mt-4 text-center">
                        <h1 className="font-bold text-lg">{user.username}</h1>
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
                            <button className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded">View archive</button>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <div>
                                <h2 className="font-bold">0</h2>
                                <p className="text-gray-500 text-sm">Posts</p>
                            </div>
                            <div>
                                <h2 className="font-bold">0</h2>
                                <p className="text-gray-500 text-sm">Followers</p>
                            </div>
                            <div>
                                <h2 className="font-bold">0</h2>
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
                <div className="mt-8 w-full flex justify-around border-t border-gray-300 pt-4">
                    <button className="text-gray-500">POSTS</button>
                    <button className="text-gray-500">SAVED</button>
                    <button className="text-gray-500">TAGGED</button>
                </div>
            </div>
        </div>
    </>)
}

export default UserProfileEdit
