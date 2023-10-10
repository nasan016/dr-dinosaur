import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from 'discord.js';
import { User } from '../../models/User.js';
import { Word } from '../../models/Words.js';
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

    if (dinos.includes(term)) {
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

    collector.on('collect', async (interaction) => {
        let choice
        let incorrect_msg
        let correct_msg
        let total, correct_clicks

        const query = {
            userId: interaction.user.id   
           }
   
        const word_query = {
            wordId: term
        }
   
        if (interaction.customId === 'dino-button') {
            choice = 0
            incorrect_msg = "medical term"
            correct_msg = "dinosaur"
        } else {
            choice = 1
            incorrect_msg = "dinosaur"
            correct_msg = "medical term"
        }
        
        try {
            const WORD = await Word.findOne(word_query)
            if (WORD) {
                if (correct === choice) {
                    WORD.correctGuess += 1
                }
                WORD.totalGuess += 1
                total = WORD.totalGuess
                correct_clicks = WORD.correctGuess
                await WORD.save()
            } else {
                const newWORD = new Word({
                    wordId: term,
                })
                if (correct === choice) {
                    newWORD.correctGuess += 1
                }
                newWORD.totalGuess += 1
                total = newWORD.totalGuess
                correct_clicks = newWORD.correctGuess
                await newWORD.save()
            }
        } catch (e) {
            console.log(`couldnt log word: ${e}`)
        }

        const correct_embed = new EmbedBuilder()
        .setTitle("Correct!")
        .setDescription(`It is a *${correct_msg}!*`)
        .addFields({
            name: " ", 
            value: `**${total === 0 ? 0 : Math.floor((correct_clicks / total) * 100)}%** of students got this right.`
        })
        .setColor(0x00eb00)
    
        const incorrect_embed = new EmbedBuilder()
            .setTitle("Incorrect.")
            .setDescription(`It is a *${incorrect_msg}*`)
            .addFields({
                name: " ", 
                value: `**${total === 0 ? 0 : Math.floor((correct_clicks / total) * 100)}%** of students got this right.`
            })
            .setColor(0xff0000)
            
        if (choice === correct) {
            interaction.reply({
                embeds: [correct_embed],
                ephemeral: true
            })

            try {
                const USER = await User.findOne(query)
                if(USER) { //correct: 0 => dinos | correct: 1 => meds
                    if (correct === 0) { USER.correctDino += 1 } 
                    else { USER.correctMed += 1 }
                     await USER.save()
                } else {
                    const newUSER = new User({
                        userId: interaction.user.id,
                        dinoQuestion: 0,
                        medQuestion: 0,
                        correctDino: 0,
                        correctMed: 0,
                    })
                    if (correct === 0) { newUSER.correctDino += 1}
                    else { newUSER.correctMed += 1 }
                    await newUSER.save()
                }
            } catch (e) {
                console.log(`Error logging question: ${e}`)
            }
        } else {
            interaction.reply({
                embeds: [incorrect_embed],
                ephemeral: true
            })
            try {
                const USER = await User.findOne(query)
                if(!USER) {
                    const newUSER = new User({
                        userId: interaction.user.id,
                    })
                    await newUSER.save()
                }
            } catch (e) {
                console.log(e)
            }
        }

        try {
            const USER = await User.findOne(query)
            if (correct === 0) { USER.dinoQuestion += 1 } 
            else { USER.medQuestion += 1 }
            await USER.save()
        } catch (e) {
            console.log(`Error logging question: ${e} 2`)
        }

        reply.delete()
    })
}

export { create, invoke }