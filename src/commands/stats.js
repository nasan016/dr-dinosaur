import { EmbedBuilder } from 'discord.js'

export function stats(user, image, med_percent, dino_percent) {
    const embed = new EmbedBuilder()
        .setTitle(`${user}'s Report Card`)
        .setThumbnail(image)
        .addFields({
            name: "Intro to Medicine 👨‍⚕️",
            value: `${med_percent}%`
        })
        .addFields({
            name: "Dinosaur 101 🦖",
            value: `${dino_percent}%`
        })
        .setColor('Random')

    return embed
}