import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("\nMongoDB connected :: ", connectionInstance.connection._connectionString)        
    } catch (error) {
        console.error("MONGODB connection failed :: ", error)
        process.exit(1)
    }
}

export {connectDB}