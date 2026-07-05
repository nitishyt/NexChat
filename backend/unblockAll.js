import { StreamChat } from 'stream-chat'
import dotenv from 'dotenv'
dotenv.config()

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
)

// List every user ID you've tested with — add/remove as needed
const userIds = [
  '6a416c96b85bc8150aab7bfb', // Nitish
  '6a441049d0318a85aedfcdd4', // Test User 2
  // add any other test users here
]

const run = async () => {
  for (const userId of userIds) {
    const { blocks } = await serverClient.getBlockedUsers(userId)
    console.log(`${userId} has ${blocks.length} blocked user(s):`, blocks)

    for (const block of blocks) {
      await serverClient.unBlockUser(block.blocked_user_id, userId)
      console.log(`  → unblocked ${block.blocked_user_id} for ${userId}`)
    }
  }
  console.log('Done.')
}

run().catch(console.error)