import { axiosInstance } from "./axios";

export const registerUser = async (formData) => {
    const response = await axiosInstance.post('/auth/signup', formData);
    return response.data;
}

export const LoginUser = async (formData) => {
    const response = await axiosInstance.post('/auth/login', formData);
    return response.data;
}

export const logoutUser = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
}
export const FetchAuthUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/me')
        return response.data
    } catch (error) {
        if (error?.response?.status === 401) {
            // Not logged in is a valid state for route guards.
            return { user: null }
        }
        throw error
    }
}

export const completeOnboarding = async (formData) => {
    const response = await axiosInstance.post('/auth/onboarding', formData)
    return response.data
}

export const getUserFriends = async () => {
    const response = await axiosInstance.get('/users/friends')
    return response.data
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get('/users')
    console.log('Recommended Users:', response.data) // Log the response data
    return response.data
}

export const getOutgoingFriendRequests = async () => {
    const response = await axiosInstance.get('/users/friend-requests/outgoing')
    return response.data
}

export const getfriendsRequests = async () => {
    const response = await axiosInstance.get('/users/friend-requests')
    return response.data
}

export const acceptFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-requests/${requestId}/accept`)
    return response.data
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-requests/${userId}`)
    return response.data
}

export async function getStreamToken() {
    try {
        const res = await axiosInstance.get('/chat/token')
        return res.data
    } catch (err) {
        console.error("error to get stream token", err)
        throw err
    }
}

export const removeFriend = async (friendId) => {
  const response = await axios.delete(`/users/friends/${friendId}`);
  return response.data;
};