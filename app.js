// mongoose 추가
const mongoose = require('mongoose')

const Problem = require('./models/Problem')
const Solution = require('./models/Solution')

// fileSync, execSync 추가
const { writeFileSync, readFileSync } = require('fs')
const { execSync } = require('child_process')

const { compareStringGenerously } = require('./utils')

// TODO : github에 올리기, reconnect 설정 / 언어확장, 솔루션 결과스키마 추가(시간복잡도, 공간복잡도)
//        채점서버통합감시시스템, judgeSolution병렬처리

// ================
// ================
// ================

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

// ================
// ================
// ================

const uniquePath = Date.now()
const hostSystemPath = '/Users/eojin/dockerContainerLink'
const dockerContainerPath = '/dockerContainerLink'

const judgeSolution = async (solution) => {
    console.log(solution)

    const problem = await Problem.findOne({ key: solution.problemKey })

    if (!problem) {
        console.log('대응하는 문제 정보 없음')
        await Solution.findOneAndUpdate({ _id: solution._id, state: solution.state, testcaseHitCount: solution.testcaseHitCount }, { state: '문제 유실' })
        return
    }

    const { timeLimit, memoryLimit, testcases } = problem
    const { sourceCode, testcaseHitCount } = solution

    // 전처리 : 소스코드 컴파일
    writeFileSync(hostSystemPath + '/' + uniquePath + 'sourceCode.py', sourceCode)

    let targetState = '맞았습니다'

    for (let i = testcaseHitCount; i < testcases.length; i++) {
        console.log('>>>>>> 테스트케이스 ' + i)
        const testcase = testcases[i]

        // 테스트케이스 인풋 작성
        writeFileSync(hostSystemPath + '/' + uniquePath + 'input.txt', testcase.input)

        // 테스트케이스 실행
        const script =
            `docker exec makeJudger2 /usr/lib/judger/libjudger.so ` +
            // problem
            `--log_path=${__dirname}/sandbox.log ` + 
            `--exe_path=${process.env.PY3_PATH} --seccomp_rule_name=general ` +
            `--max_cpu_time=${timeLimit} --max_memory=${memoryLimit * 1024 * 1024} ` +
            `--input_path=${dockerContainerPath + '/' + uniquePath + 'input.txt'} ` +
            // solution
            `--args=${dockerContainerPath + '/' + uniquePath + 'sourceCode.py'} ` +
            `--output_path=${dockerContainerPath + '/' + uniquePath + 'res.txt'} --error_path=${dockerContainerPath + '/' + uniquePath + 'error.txt'}`

        const stdout = JSON.parse(execSync(script).toString())

        //////////////////////
        // 구동 결과 분기
        if (stdout.result === 1 || stdout.result === 2) {
            targetState = '시간 초과'
            break
        }

        if (stdout.result === 3) {
            targetState = '메모리 초과'
            break
        }

        if (stdout.result === 4) {
            targetState = '런타임 에러'
            break
        }

        if (stdout.result === 5) {
            targetState = '서버 에러'
            break
        }

        // 테스트케이스 결과 비교
        const res = readFileSync(hostSystemPath + '/' + uniquePath + 'res.txt').toString()

        if (compareStringGenerously(res, testcase.output)) {
            solution = await Solution.findOneAndUpdate({ _id: solution._id, state: solution.state, testcaseHitCount: solution.testcaseHitCount }, { testcaseHitCount: i + 1 }, { new: true })

            if (!solution) {
                console.log('solution 선점 당함')
                return
            }
        }
        else {
            targetState = '틀렸습니다'
            break
        }
    }

    console.log(targetState)
    await Solution.findOneAndUpdate({ _id: solution._id, state: solution.state, testcaseHitCount: solution.testcaseHitCount }, { state: targetState })
}

const tryToJudge = async () => {
    try {
        let solution = await Solution.findOneAndUpdate({ state: 'idle' }, { state: 'judging' }, { sort: { uploadTime: 1 }, new: true })

        if (!solution) {
            solution = await Solution.findOne({ state: 'judging' }, {}, { sort: { uploadTime: 1 } })
        }

        if (!solution) {
            return false
        }

        console.log('tryToJudge(): 채점 개시')
        await judgeSolution(solution)
        console.log('tryToJudge(): 채점 종료')
    }
    catch (error) {
        console.error(error)
    }

    return true
}

const loop = async () => {
    if (await tryToJudge()) {
        setTimeout(loop)
    }
    else {
        console.log('대기 중')
        setTimeout(loop, 1000)
    }
}

loop()

// TODO : 예외 처리 추가
// db-query-fail, 채점 중 problem 수정, 삭제 등
