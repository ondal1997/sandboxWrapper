const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/judge0316_0', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const Problem = require('./models/Problem')

new Problem({
    key: '16',
    ownerId: 'ondal1997',
    name: 'A+B+C',
    uploadTime: Date.now(),
    description: 'print A+B+C',
    timeLimit: 5000,
    memoryLimit: 128,
    examples: [],
    testcases: [
        {
            input: `3
4
7
10`,
            output: `7
44
274
`
        },
        {
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },{
            input: `3
4
7
10`,
            output: `7
44
274
`
        },
    ]
}).save().then(() => console.log('>>> 1 Problem is saved')).catch(() => console.log('>>> saving 1 Problem failed'))