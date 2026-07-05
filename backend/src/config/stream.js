import {StreamChat} from "stream-chat"

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key and secret are required in the environment variables.");
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try{
        await streamClient.upsertUsers([userData])
        return userData
    }catch(err){
        console.error("Error upserting Stream user:", err);
    }
}


export const generateStreamToken=async(userId)=>{
    try{
        const userIdString = userId.toString();
        const token = streamClient.createToken(userIdString)
        return token
    }catch(err){
        console.error("Error generating Stream token:", err);
        throw err
    }
}