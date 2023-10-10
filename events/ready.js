import * as fs from 'fs'
import { ActivityType } from 'discord.js'

const once = true;
const name = 'ready'

async function invoke(client) {
    client.user.setActivity({
        name: 'a big asteroid. ☄️',
        type: ActivityType.Watching,
    })

    const commands = fs
        .readdirSync('./events/commands')
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.slice(0, -3))

    const arr_commands = []

    for (let command of commands) {
        const command_file = await import(`#commands/${command}`)
        arr_commands.push(command_file.create())
    }

    client.application.commands.set(arr_commands)
    console.log(`${client.user.tag} is online!`)
}

export { once, name, invoke }