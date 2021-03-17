const mongoose = require('mongoose')

// TODO : lang 추가
module.exports = mongoose.model('Solution', {
    problemKey: { type: String, required: true },
    ownerId: { type: String, required: true },
    uploadTime: { type: Date, required: true },
    sourceCode: { type: String, required: true },
    state: { type: String, required: true },
    testcaseHitCount: { type: Number, required: true }
})
