import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const create = () => {
	const command = new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Here\'s your report card.')

	return command.toJSON();
}

const invoke = (interaction) => {
	const user = interaction.options.getUser('user')

	const embed = new EmbedBuilder()
		.setTitle(`${user.globalName}'s Report Card`)
		.setThumbnail(user.displayAvatarURL({dynamic: true}))
		.addFields({
			name: "Intro to Medicine 👨‍⚕️",
			value: "12%"
		})
		.addFields({
			name: "Dinosaur 101",
			value: "12%"
		})
		.setColor('Random')

	interaction.reply({embeds: [embed]})
}

export { create, invoke }