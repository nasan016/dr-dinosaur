import { Client, IntentsBitField, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from 'discord.js'
import { guess } from './commands/guess.js'
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'guess') {
        const med_button = new ButtonBuilder()
            .setLabel('👨‍⚕️ Medical Term')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('doctor-button')

        const dino_button = new ButtonBuilder()
            .setLabel('🦖 Dinosaur')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('dino-button')
        
        const buttonRow = new ActionRowBuilder().addComponents(dino_button, med_button)
        const reply = await interaction.reply({embeds: [guess()], components: [buttonRow], ephemeral: true})

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
        })

        collector.on('collect', (interaction) => {
            if (interaction.customId === 'dino-button') {
                interaction.reply('dino')
            } else {
                interaction.reply('med')
            }
        })
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