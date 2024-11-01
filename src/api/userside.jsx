import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const baseURL = "http://127.0.0.1:8000/"

export const useUserPost = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['listing'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/user/posts/');
            console.log(response.data,'response.data');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['listing']);
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


export const useStoryGet=(userId)=>{
    return useQuery({
        queryKey: ['userstory'],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:8000/user/story/`)
            // console.log(response.data,'storyyyyyyyyyyyyyy');
            return response.data;
        },
    });
}


export const useStoryPost = (userId) => {
  return useMutation({
      mutationFn: async (formData) => {
          const response = await axios.post(`${baseURL}/user/story/crd/${userId}/`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });
          return response.data;
      },
  },
  {
      onSuccess: () => {
          toast.success("Successfully Uploaded");
      },
      onError: () => {
          toast.error("Something went wrong");
      },
  });
};


export const useFollowUser = (user_id) => {
  console.log(user_id,'uuuuuserrrrrid');

  return useMutation({
    mutationFn: async (user_id) => {
      const response = await axios.post(`${baseURL}user/follow/${user_id}/`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    onSuccess: () => {
      toast.success("Successfully requested");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

export const userRequest=()=>{
  return useQuery({
      queryKey: ['userRequest'],
      queryFn: async () => {
          const response = await axios(`${baseURL}user/accept/`)
          console.log(response.data,'response.ddatadaa');
          return response.data;
      },
  });
}
export const useAccept = (follower_id) => {
  console.log(follower_id,'uuuuuserrrrrid');
  return useMutation({
    mutationFn: async (follower_id) => {
      const response = await axios.post(`${baseURL}user/accept/${follower_id}/`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    onSuccess: () => {
      toast.success("Successfully accepted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};

// export const useFollowUsers = () => {
//   return useMutation(
//     (userId) => axios.post(`http://127.0.0.1:8000/user/follow/${userId}/`),
//     {
//       onSuccess: (data) => {
//         console.log('Follow request sent successfully', data);
//       },
//       onError: (error) => {
//         console.error('Error sending follow request:', error);
//       },
//     }
//   );
// };


export const useFriendSuggest=()=>{
    return useQuery({
        queryKey:['suggestion'],
        queryFn:async()=>{
            const response = await axios.get('http://127.0.0.1:8000/user/suggestion/')
            console.log(response.data,'ssssssssssssssssss')
            return response.data
        }
    })
}


export const useCameraPicture = (userId) => {
    return useMutation({
      mutationFn: async (formData) => {
        const response = await axios.patch(
          `${baseURL}/camera/${userId}/`,
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
        toast.error("Something went wrong");
      },
    });
  };


export const useVideoList=()=>{
  const queryClient = useQueryClient()
  return useQuery({
    queryKey:['userVideo'],
    queryFn:async()=>{
      const response = await axios(`${baseURL}user/video/`)
      return response.data
    },onSuccess: () => {
      queryClient.invalidateQueries(['userVideo']);
  },
  })
}

export const useProfile=()=>{
  const queryClient = useQueryClient()
  return useQuery({
    queryKey:['profile'],
    queryFn:async()=>{
      const response = await axios(`${baseURL}follow/`)
      return response.data
      
    },onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
  },
  })
}