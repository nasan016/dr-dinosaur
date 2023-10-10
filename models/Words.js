import { Schema, model } from 'mongoose'

const wordSchema = new Schema({
    wordId: {
        type: String,
        required: true
    },
    totalGuess: {
        type: Number,
        default: 0
    },
    correctGuess: {
        type: Number,
        default: 0
    }
})

export const Word = model("Word", wordSchema)