const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/judge0316_0', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const Solution = require('./models/Solution')

new Solution({
    problemKey: '11',
    ownerId: '하하하',
    uploadTime: Date.now(),
    sourceCode: `test_case=int(input())

input_list=[]
for i in range(test_case):
    input_list.append(int(input()))
dp=[1,2,4]

for i in range(3,max(input_list)):
    dp.append(dp[i-1]+dp[i-2]+dp[i-3])

for i in input_list:
    print(dp[i-1])`,
    state: 'idle',
    testcaseHitCount: 0
}).save().then(() => console.log('>>> 1 Solution is saved')).catch(() => console.log('>>> saving 1 Solution failed')).finally(() => mongoose.connection.close())
