import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function fixDatabaseIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI!)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db()
    const usersCollection = db.collection('users')
    
    // List current indexes
    const indexes = await usersCollection.indexes()
    console.log('Current indexes:', indexes)
    
    // Drop the problematic username indexes if they exist
    const indexesToDrop = ['username_1', 'userName_1']
    
    for (const indexName of indexesToDrop) {
      try {
        await usersCollection.dropIndex(indexName)
        console.log(`Dropped ${indexName} index`)
      } catch (error: any) {
        if (error.code === 27) {
          console.log(`${indexName} index does not exist`)
        } else {
          console.log(`Error dropping ${indexName} index:`, error.message)
        }
      }
    }
    
    // Clear any existing users with null username fields
    await usersCollection.deleteMany({ username: null })
    console.log('Cleared users with null username')
    
    // Ensure proper indexes exist
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    console.log('Created unique email index')
    
    console.log('Database indexes fixed successfully!')
    
  } catch (error) {
    console.error('Error fixing database indexes:', error)
  } finally {
    await client.close()
  }
}

fixDatabaseIndexes()
