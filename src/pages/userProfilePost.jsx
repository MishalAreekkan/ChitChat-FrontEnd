import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useUserPost } from '../api/userside';
// import './UserProfilePost.css'; 


function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
          size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
      };
}

function UserProfilePost() {
    const baseUrl = "http://127.0.0.1:8000/";
    const { data: post } = useUserPost(); // Assuming useUserPost provides loading and error states
    console.log(post);
    
    return (
        <>
            <div className="mt-8 w-full flex justify-around border-t border-gray-300 pt-4">
                <button className="text-gray-500">POSTS</button>
                <button className="text-gray-500">SAVED</button>
                <button className="text-gray-500">TAGGED</button>
            </div>

            <div className="mt-4 bg-red-600">
                <div class="container">
                </div>
                <ImageList
      sx={{ width: 500, height: 450 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
                    {post?.user_posts?.length ? (
                        post.user_posts.map((item) => (
                            <ImageListItem key={item.id} cols={item.cols || 1} rows={item.rows || 1}>
                                <img
                                    {...srcset(`${baseUrl}${item.post}`, 121, item.rows, item.cols)} // Ensure 'post' has the correct image URL
                                    alt={item.content || 'User Post'} // Default alt text
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))
                    ) : (
                        <div>No posts available</div> // Message when there are no posts
                    )}
                </ImageList>
            </div>
        </>
    );
}

export default UserProfilePost;
