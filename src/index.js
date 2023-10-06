import { Client, IntentsBitField, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } from 'discord.js'
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
        const guess_comp = guess()
        const reply = await interaction.reply({embeds: [guess_comp[0]], components: [buttonRow], ephemeral: true})

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
        })

        const correct = guess_comp[1]
        collector.on('collect', (interaction) => {
            let choice
            let incorrect_msg
            let correct_msg
            if (interaction.customId === 'dino-button') {
                choice = 0
                incorrect_msg = "medical term"
                correct_msg = "dinosaur"
            } else {
                choice = 1
                incorrect_msg = "dinosaur"
                correct_msg = "medical term"
            }

            const correct_embed = new EmbedBuilder()
                .setTitle(`Correct!`)
                .setDescription(`It is a ${correct_msg}!`)
                .setColor(0x00eb00)
            
            const incorrect_embed = new EmbedBuilder()
                .setTitle(`Incorrect.`)
                .setDescription(`It is a ${incorrect_msg}...`)
                .setColor(0xff0000)

            if (choice === correct) {
                interaction.reply({embeds: [correct_embed], ephemeral: true})
            } else {
                interaction.reply({embeds: [incorrect_embed], ephemeral: true})
            }
            reply.delete()
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