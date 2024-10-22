import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const baseURL = "http://127.0.0.1:8000/"

export const useUserPost = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['listing'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/user/posts/');
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
            const response = await axios.post('http://127.0.0.1:8000/user/posts/', feed);
            return response.data;
        },
        onError: (error) => {
            console.error('Error posting data:', error);
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

const followUser = async (userId) => {
    const response = await axiosInstance.post(`/follow/${userId}/`);
    return response.data;
  };
  
export const useFollowUser = () => {
    return useMutation({
      mutationFn: (userId) => followUser(userId),
      onSuccess: (data) => {
        console.log('Follow request sent:', data);
        alert(data.detail);
      },
      onError: (error) => {
        console.error('Error following user:', error);
        alert(error.response?.data?.detail || 'An error occurred');
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
        toast.success("updated Successfully Uploaded");
      },
      onError: () => {
        toast.error("Somthing went wrong");
      },
    });
  };


export const useUserStory=()=>{
    return useQuery({
        queryKey: ['userstory'],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:8000/user/story/`)
            return response.data;
        },
    });
}