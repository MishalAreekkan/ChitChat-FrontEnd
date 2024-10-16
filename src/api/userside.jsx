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
