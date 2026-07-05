import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"

export const getRecommendedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const user = req.user

        const recommendedUsers = await User.find({
            _id: {
                $ne: userId,
                $nin: user.friends
            },
            isOnboarded: true
        }).select('-password')

        if (recommendedUsers.length === 0) {
            return res.status(200).json({ message: "No recommended users found" })
        }
        res.status(200).json(recommendedUsers || [])
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('friends').populate('friends', 'fullName image language location skill')
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("error in getMyFriends:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: recipientId } = req.params

        if (myId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" })
        }

        //check if the recipient user exists
        const recipient = await User.findById(recipientId)
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found" })
        }

        //check if the recipient is already a friend
        if (recipient.friends.some((friendId) => friendId.toString() === myId.toString())) {
            return res.status(400).json({ message: "You are already connected with this user" })
        }

        //check if there is already a pending request in either direction
        const existingPendingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
            status: 'pending'
        })
        if (existingPendingRequest) {
            return res.status(400).json({ message: "Friend request already sent" })
        }

        // Clean up any stale non-pending records for this user pair before creating a new request.
        await FriendRequest.deleteMany({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
            status: { $ne: 'pending' }
        })

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })
        res.status(201).json({ message: 'Friend request sent successfully', friendRequest })

    } catch (error) {
        console.error("error in sendFriendRequest:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}



export const acceptFriendRequest = async (req,res)=>{
    try {
        const {id:requestId}=req.params

        const friendRequest = await FriendRequest.findById(requestId)
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"})
        }

        //check if the recipient is the logged in user
        if(friendRequest.recipient.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to accept this friend request"})
        }

        //update the status of the friend request to accepted
        friendRequest.status='accepted'
        await friendRequest.save()

        //add each other to the friends list of both users
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })
        res.status(200).json({message:"Friend request accepted successfully"})
    }catch (error) {
        console.error("error in acceptFriendRequest:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const getFriendRequests = async (req,res)=>{
    try {
        const incomingRequests = await FriendRequest.find({
            recipient:req.user._id,
            status:'pending'
        }).populate('sender','fullName image language location skill bio')

         const acceptedRequests = await FriendRequest.find({
            recipient:req.user._id,
            status:'accepted'
        }).populate('recipient','fullName image')
    
    res.status(200).json({incomingRequests,acceptedRequests})

    }catch (error) {
        console.error("error in getFriendRequests:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getOutgoingFriendRequests = async (req,res)=>{
    try {
        const outgoingRequests = await FriendRequest.find({
            sender:req.user._id,
            status:'pending'
        }).populate('recipient','fullName image language location skill bio')
        res.status(200).json(outgoingRequests)
    }catch (error) {
        console.error("error in getOutgoingFriendRequests:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const removeFriend = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: friendId } = req.params;

    // Check if the friend exists
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Check if they are actually friends
    const me = await User.findById(myId);

    if (!me.friends.includes(friendId)) {
      return res.status(400).json({
        message: "Users are not friends",
      });
    }

    // Remove each other from friends list
    await User.findByIdAndUpdate(myId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: myId },
    });

    // Delete friend request document
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("removeFriend:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};