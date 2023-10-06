import { config } from 'dotenv'
import { REST, Routes } from 'discord.js'
config()

const commands = [
    {
        name: 'guess',
        description: 'Dinosaur or Medical Term?',
    },
    {
        name: 'stats',
        description: "Here's your report card.",
    }
]

const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_TOKEN)

async function main() {
    try {
        console.log('registering slash commands ...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )

        console.log('Slash commands were registered successfully')
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

main()