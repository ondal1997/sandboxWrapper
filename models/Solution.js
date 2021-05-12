const mongoose = require('mongoose')

// coj-BE와 같아야함!!
module.exports = mongoose.model('Solution', {
    key: { type: Number, required: true },
    ownerId: { type: String, required: true, index: true },
    uploadTime: { type: Date, required: true },

    state: { type: String, required: true },
    lastUpdateTime: { type: Date }, // 마지막으로 judger로부터 가져와진 시간
    testcaseHitCount: { type: Number, required: true },
    testcaseSize: { type: Number, required: true },
    maxTime: { type: Number, required: true },
    maxMemory: { type: Number, required: true },
    judgeError: { type: String, required: true },

    problemKey: { type: Number, required: true, index: true },
    problemVersion: { type: Number, required: true },
    language: { type: String, require: true },
    sourceCode: { type: String, required: true }
})
