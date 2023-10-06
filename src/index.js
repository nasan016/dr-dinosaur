import { Client, IntentsBitField, ActivityType} from 'discord.js'
import { dino_med } from './commands/guess.js'
import { stats } from './commands/stats.js'
import { config } from 'dotenv'
config()

const TOKEN = process.env.DISCORD_TOKEN
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`)

    client.user.setActivity({
        name: 'a big asteroid.',
        type: ActivityType.Watching,
    })
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'guess') {
        interaction.reply({embeds: [dino_med()], ephemeral: true})
    }
    
    if (interaction.commandName === 'stats') {
        interaction.reply({embeds: [
            stats(interaction.user.globalName, 
                interaction.user.displayAvatarURL({dynamic: true}), 
                12, 
                12
            )]})
    }
})

client.login(TOKEN)