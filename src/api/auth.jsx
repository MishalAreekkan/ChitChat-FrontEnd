import { useMutation,QueryClient,useQueryClient,useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../slice/authSlice';

export const useRegister = () => {
    return useMutation({
        mutationFn: async (formdata) => {
            const response = await axios.post('http://127.0.0.1:8000/register/', formdata);
            return response.data;
        },
        onSuccess: (response) => {
            console.log(response,'response');
        },
        onError: (error) => {
            console.error('Error during registration:', error);
        },
    })
};

export const useLogin = () => {
    const dispatch = useDispatch();
    return useMutation({
      mutationFn: async (formdata) => {
        const response = await axios.post('http://127.0.0.1:8000/login/', formdata);
        return response.data;
      },
      onSuccess: (response) => {
        console.log(response,'lllllllllllljjjjjjjjjjjjjjjj');
        
        const token = response;
        dispatch(setAuthToken(token));
      },
      onError: (error) => {
        console.error('Error during login:', error);
      },
    });
  };

