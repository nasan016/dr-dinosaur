import { config } from 'dotenv'
import * as fs from 'fs'
import { Client, GatewayIntentBits } from 'discord.js'
import mongoose from 'mongoose'
config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

const events = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

async function connectDb() {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.DB_PASSWORD, { keepAlive: true })
        console.log("connected to DB.")
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}
connectDb()

for (let event of events) {
    const event_file = await import(`#events/${event}`)
    if (event_file.once) {
        client.once(event_file.name, (...args) => {
            event_file.invoke(...args)
        })
    } else {
        client.on(event_file.name, (...args) => {
            event_file.invoke(...args)
        })
    }
}

client.login(process.env.DISCORD_TOKEN)