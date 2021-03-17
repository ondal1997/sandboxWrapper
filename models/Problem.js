const mongoose = require('mongoose')

// TODO : langs[], categories[] 추가
module.exports = mongoose.model('Problem', {
    key: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    name: { type: String, required: true },
    uploadTime: { type: Date, required: true },
    description: { type: String, required: true },
    timeLimit: { type: Number, require: true },
    memoryLimit: { type: Number, require: true },
    examples: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],
    testcases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ]
})
