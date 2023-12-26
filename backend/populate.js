// this file was only created upload data to database so its easy to work with it not create each job, and the main reason is for the stats page which needs different published times
// this only runs once to populate DATA (fake data)
import { readFile } from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js'
import Job from './Models/Job.js'

const start = async () => {
  try {
    await connectDB(process.env.DB_URL, process.env.DB_PASSWORD)
    await Job.deleteMany()

    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    )
    await Job.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()