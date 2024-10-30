import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

function UserFeedEdit({ isOpen, onClose, post }) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="edit-post-title"
            aria-describedby="edit-post-description"
        >
            <Box sx={style}>
                <Typography id="edit-post-title" variant="h6" component="h2">
                    Edit Post
                </Typography>
                <Typography id="edit-post-description" sx={{ mt: 2 }}>
                    {/* Render post content here */}
                    Content: {post?.content}
                </Typography>
                <Button onClick={onClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

export default UserFeedEdit;
