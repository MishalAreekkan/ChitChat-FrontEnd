import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const baseURL = "http://127.0.0.1:8000/"

export const useUserPost = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['listing'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/user/posts/');
      console.log(response.data, 'response.data');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['listing']);
    },
  });
};


export const usePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post_id) => {
      const response = await axios.post(`http://127.0.0.1:8000/user/like/${post_id}/`);
      console.log(response.data, 'like');
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries('userPosts');
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    },
  });
};

export const usePostDiLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post_id) => {
      const response = await axios.post(`http://127.0.0.1:8000/user/dislike/${post_id}/`);
      console.log(response.data, 'dislike');
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries('userPosts');
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    },
  });
};

export const useFeedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feed) => {
      const response = await axios.post('http://127.0.0.1:8000/user/posts/', feed, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Error posting data:', error);
      alert('Failed to post. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};


export const useComment = (postid) => {
  console.log(postid, 'postid');

  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['comment'],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/user/comment/${postid}/`);
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
};


export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, commentText }) => {
      const response = await axios.post(`http://127.0.0.1:8000/user/comment/${postId}/`, {
        comments: commentText,
      });
      console.log(response.data, 'ffffffffffffffffffffffff');
      return response.data;
    },
    onSuccess: () => {
      console.log('Comment posted successfully:');
      queryClient.invalidateQueries('comment');
    },
    onError: (error) => {
      console.error('Error comment data:', error);
      alert('Failed to comment. Please try again.');
    },
  });
}


export const useChat = () => {
  return useMutation({
    mutationFn: async (userInput) => {
      const response = await axios.post('http://127.0.0.1:8000/user/chat/', { message: userInput });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Chat response:', data);
    },
    onError: (error) => {
      console.error('Error fetching chat response:', error);
    },
  });
};


export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/update/${userId}/`)
      return response.data;
    },
  });
};


export const useProfileEdit = (userId) => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.patch(`
          ${baseURL}/update/${userId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Successfully Uploaded");
    },
    onError: () => {
      toast.error("Somthing went wrong");
    },
  });
};


export const useStoryGet = () => {
  return useQuery({
    queryKey: ['userstory'],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/user/story/`)
      // console.log(response.data,'storyyyyyyyyyyyyyy');
      return response.data;
    },
  });
}

export const useStoryPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: async (formData) => {
          return axios.post('http://127.0.0.1:8000/user/story/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
      },
      onSuccess: () => {
          queryClient.invalidateQueries('stories');
      },
      onError: (error) => {
          console.error('Error uploading story:', error);
      },
  });
};


export const userList = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['userList'],
    queryFn: async () => {
      const response = await axios(`${baseURL}user/follow/`)
      return response.data;
    }, onSuccess: () => {
      console.log("Data fetched successfully");
      queryClient.invalidateQueries('anotherQueryKey');
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
  });
}


export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user_id) => {
      const response = await axios.post(`${baseURL}user/follow/${user_id}/`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    onSuccess: () => {
      toast.success("Successfully requested");
      queryClient.invalidateQueries('requested');
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

export const userRequest = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['userRequest'],
    queryFn: async () => {
      const response = await axios(`${baseURL}user/accept/`)
      console.log(response.data, 'response.ddatadaa');
      return response.data;
    }, onSuccess: () => {
      console.log("Data fetched successfully");
      queryClient.invalidateQueries('anotherQueryKey');
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
  });
}


export const useAccept = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (follower_id) => {
      const response = await axios.post(`${baseURL}user/accept/${follower_id}/`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    onSuccess: () => {
      toast.success("Successfully accepted");
      queryClient.invalidateQueries('followers');
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

export const useFriendSuggest = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['suggestion'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/user/suggestion/')
      console.log(response.data, 'ssssssssssssssssss')
      return response.data
    }, onSuccess: () => {
      console.log("Successfully fetched suggestions");
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: (error) => {
      console.error("An error occurred while fetching suggestions:", error);
    },
  })
}


export const useVideoList = () => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['userVideo'],
    queryFn: async () => {
      const response = await axios(`${baseURL}user/video/`)
      return response.data
    }, onSuccess: () => {
      queryClient.invalidateQueries(['userVideo']);
    },
  })
}


export const useVideoLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video_id) => {
      const response = await axios.post(`http://127.0.0.1:8000/user/likevideo/${video_id}/`);
      console.log(response.data, 'like');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('userPosts');
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    },
  });
};

export const useVideoDisLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video_id) => {
      const response = await axios.post(`http://127.0.0.1:8000/user/dislikevideo/${video_id}/`);
      console.log(response.data, 'dislike');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('userPosts');
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    },
  });
};


// export const useCommentVideo = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ postId, commentText }) => {
//       const response = await axios.post(`http://127.0.0.1:8000/user/comment/${postId}/`, {
//         comments: commentText,
//       });
//       console.log(response.data, 'ffffffffffffffffffffffff');
//       return response.data;
//     },
//     onSuccess: () => {
//       console.log('Comment posted successfully:');
//       queryClient.invalidateQueries('comment');
//     },
//     onError: (error) => {
//       console.error('Error comment data:', error);
//       alert('Failed to comment. Please try again.');
//     },
//   });
// }

export const useProfile = () => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios(`${baseURL}user/follow/`)
      console.log(response.data, 'ccccccccccccccccccttttttttttttt');
      return response.data
    }, onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
    },
  })
}

