import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../../models/User.js';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Here\'s your report card.')

	return command.toJSON();
}

const invoke = async (interaction) => {
	let dino_percent, dino_total
	let med_percent, med_total

	const query = {
		userId: interaction.user.id
	}

	try {
		const USER = await User.findOne(query)
		if (USER) {
			dino_percent = USER.correctDino
			dino_total = USER.dinoQuestion
			med_percent = USER.correctMed
			med_total = USER.medQuestion
		} else {
			const newUSER = new User({
				userId: interaction.user.id,
			})

			await newUSER.save()
			dino_percent = newUSER.correctDino
			dino_total = newUSER.dinoQuestion
			med_percent = newUSER.correctMed
			med_total = newUSER.medQuestion
		}
	} catch (e) {
		console.log(`${e}`)
	}

	const embed = new EmbedBuilder()
		.setTitle(`${interaction.user.globalName}'s Report Card`)
		.setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
		.addFields({
			name: "Intro to Medicine 👨‍⚕️",
			value: `${med_percent === 0 ? 0 : Math.floor((med_percent / med_total) * 100)}%`
		})
		.addFields({
			name: "Dinosaur 101 🦖",
			value: `${dino_percent === 0 ? 0 : Math.floor((dino_percent / dino_total) * 100)}%`
		})
		.addFields({
			name: "Correct Answers / Total Questions 📝",
			value: `${dino_percent + med_percent} / ${dino_total + med_total}`
		})
		.setColor('Random')

	interaction.reply({embeds: [embed]})
}

export { create, invoke }