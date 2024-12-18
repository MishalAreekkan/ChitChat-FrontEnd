import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const useCommunity = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['community'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/chat/community/');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community']);
    },
  });
};



export const useCreateCommunity = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (feed) => {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/chat/community/',
          feed,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
      } catch (error) {
        throw new Error('Failed to create community. Please try again.');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('communities');
      queryClient.setQueryData('communities', (oldData) => {
        return oldData ? [...oldData, data] : [data];  
      });
    },
  });
};


export function useMessageShow({ communityName }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['communityMessages', communityName],  
    queryFn: () => fetchMessages(communityName),     
    enabled: !!communityName,                       
  });
  return { data, error, isLoading, refetch };
}
async function fetchMessages(communityName) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/chat/community/${communityName}/`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch messages');
    }
    return response.data; // Axios returns data directly
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch messages');
  }
}

export const fetchNotifications = async () => {
  const response = await axios.get("/api/notifications/");
  return response.data;
};