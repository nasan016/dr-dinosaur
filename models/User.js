import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    dinoQuestion: {
        type: Number,
        default: 0
    },
    medQuestion: {
        type: Number,
        default: 0
    },
    correctDino: {
        type: Number,
        default: 0
    },
    correctMed: {
        type: Number,
        default: 0
    },
})

export const User = model("User", userSchema)