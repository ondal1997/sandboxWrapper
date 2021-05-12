const mongoose = require('mongoose')

// coj-BE와 같아야함!!
module.exports = mongoose.model('Problem', {
    key: { type: Number, required: true, index: true },
    ownerId: { type: String, required: true, index: true },
    uploadTime: { type: Date, required: true },
    version: { type: Number, required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: [
        {
            type: String
        }
    ],
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
