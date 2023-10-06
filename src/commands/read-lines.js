import * as fs from 'fs'

const dino_file = fs.readFileSync('src/commands/txt/dinosaur.txt', 'utf8')
const med_file = fs.readFileSync('src/commands/txt/medicine.txt', 'utf8')

const create_arr = (f) => {
    let arr = f.split("\n")
    for(let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace("\r", "")
    }

    return arr
}

export const dinos = create_arr(dino_file)
export const meds = create_arr(med_file)