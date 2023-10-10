import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from 'discord.js';
import * as fs from 'fs'

const dino_file = fs.readFileSync('./events/commands/txt/dinosaur.txt', 'utf-8')
const med_file = fs.readFileSync('./events/commands/txt/medicine.txt', 'utf-8')

const create_arr = (f) => {
    let arr = f.split("\n")
    for(let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace("\r", "")
    }

    return arr
}

const dinos = create_arr(dino_file)
const meds = create_arr(med_file)

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Ready to begin your exam?')

    return command.toJSON()
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

const pick_term = () => {
    const random_int = getRandomInt(2)
    let str

    if (random_int === 0) {
        const r = getRandomInt(dinos.length)
        str = dinos[r]
    } else {
        const r = getRandomInt(meds.length)
        str = meds[r]
    }

    return str
}

async function invoke(interaction){
    const term = pick_term()
    let correct

    if (term in dinos) {
        correct = 0
    } else {
        correct = 1
    }

    const embed = new EmbedBuilder()
        .setTitle('Is this a Dinosaur or a Medical Term?')
        .setDescription(term) //fill this with the get thing function
        .setColor('Random')

    const med_button = new ButtonBuilder()
        .setLabel('👨‍⚕️ Medical Term')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('doctor-button')

    const dino_button = new ButtonBuilder()
        .setLabel('🦖 Dinosaur')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('dino-button')

    const buttonRow = new ActionRowBuilder().addComponents(dino_button, med_button)

    const reply = await interaction.reply({
        embeds: [embed],
        components: [buttonRow],
        ephemeral: true
    })

    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button
    })

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
            .setTitle("Correct!")
            .setDescription(`It is a ${correct_msg}!`)
            .setColor(0x00eb00)
        
        const incorrect_embed = new EmbedBuilder()
            .setTitle("Incorrect.")
            .setDescription(`It is a ${incorrect_msg}`)
            .setColor(0xff0000)
        
        if (choice === correct) {
            interaction.reply({
                embeds: [correct_embed],
                ephemeral: true
            })
        } else {
            interaction.reply({
                embeds: [incorrect_embed],
                ephemeral: true
            })
        }
        reply.delete()
    })
}
export { create, invoke }