import * as fs from 'fs'
import { dirname } from 'path'
import { fileURLtoPath } from 'node:url'

const __dirname = dirname(fileURLtoPath(import.meta.url))

const arr = () => {fs.readFile(__dirname + 'dinosaur.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err)
    }
    console.log(data.toString())
})
}
arr()
