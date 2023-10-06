import { EmbedBuilder } from "discord.js"

const getRandomInt = () => {
    return Math.floor(Math.random() * 2)
}

export const dino_med = () => {
    const random_int = getRandomInt()
    let str

    if (random_int === 0) {
        str = "dinosaur"
    } else {
        str = "medical"
    }

    const embed = new EmbedBuilder()
        .setTitle('Is this a Dinosaur or a Medical Term?')
        .setDescription(str)
        .setColor('Random')
    return embed
}