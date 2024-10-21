import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const profileEdit = async (userId, formData) => {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.patch(`http://127.0.0.1:8000/update/${userId}/`, formData, config);
    return response.data;
};

export const useProfileEdit = () => {
    return useMutation({
        mutationFn: ({ userId, formData }) => profileEdit(userId, formData),
        onSuccess: (data) => {
            console.log('Profile updated successfully:', data);
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
        },
    });
};