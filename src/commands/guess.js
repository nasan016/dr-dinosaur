import { EmbedBuilder } from "discord.js"
import { meds, dinos } from "./read-lines.js"

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

export const guess = () => {
    const random_int = getRandomInt(2)
    let str

    if (random_int === 0) {
        const r = getRandomInt(dinos.length)
        str = dinos[r]
    } else {
        const r = getRandomInt(meds.length)
        str = meds[r]
    }

    const embed = new EmbedBuilder()
        .setTitle('Is this a Dinosaur or a Medical Term?')
        .setDescription(str)
        .setColor('Random')
    return embed
}