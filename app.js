// mongoose 추가
const mongoose = require("mongoose");

const Problem = require("./models/Problem");
const Solution = require("./models/Solution");

require("dotenv").config();

// fileSync, execSync 추가
const fs = require("fs");
const { writeFileSync, readFileSync } = require("fs");
const { execSync } = require("child_process");

const compareStringGenerously = require("./compareStringGenerously");

// TODO : github에 올리기, 언어확장(컴파일 로직 추가-컴파일 에러처리)

// 우선 순위가 낮은 TODOs :
//        원클릭 배포
//        채점서버통합감시시스템
//        채점 병렬처리

// ================
// ================
// ================

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error) => {
    process.exit(1);
  });

// ================
// ================
// ================

const sandboxPath = __dirname + "/sandboxes" + `/sandbox_${process.pid}`;
if (!fs.existsSync(sandboxPath)) {
  fs.mkdirSync(sandboxPath);
}

// 전처리
const getExePath = (language, sourceCode) => {
  let exePath = "";

  switch (language) {
    case "c++":
      writeFileSync(`${sandboxPath}/sourceCode.cpp`, sourceCode);
      const complieScript = `${process.env.GPP_PATH} ${sandboxPath}/sourceCode.cpp -o ${sandboxPath}/a.o -std=c++17 `;
      try {
        execSync(complieScript).toString();
      } catch (err) {
        throw err.stderr.toString().split('\n').map((line) => {
            if (!line.includes('sourceCode.cpp')) {
                return line;
            }
            return line.splice(line.indexOf('error: '));
        });
      }
      exePath = `--exe_path=${sandboxPath}/a.o `;
      break;
    case "python3":
    default:
      writeFileSync(`${sandboxPath}/sourceCode.py`, sourceCode);
      exePath = `--exe_path=${process.env.PY3_PATH} --args=${sandboxPath}/sourceCode.py `;
  }

  return exePath;
};

const judgeSolution = async (solution) => {
  console.log(solution);

  const problem = await Problem.findOne({ key: solution.problemKey });

  if (!problem || problem.version !== solution.problemVersion) {
    console.log("대응하는 문제 정보 없음");
    await Solution.findOneAndUpdate(
      {
        _id: solution._id,
        state: solution.state,
        testcaseHitCount: solution.testcaseHitCount,
      },
      { state: 8 }
    );
    return;
  }

  const { timeLimit, memoryLimit, testcases } = problem;
  const { sourceCode, testcaseHitCount, language } = solution;

  // 전처리 : 소스코드 컴파일을 이곳에서 한다.
  let exePath;
  try {
    exePath = getExePath(language, sourceCode);
  } catch (err) {
    console.log("컴파일 에러 발생");
    console.error(err);
    await Solution.findOneAndUpdate(
      {
        _id: solution._id,
        state: solution.state,
        testcaseHitCount: solution.testcaseHitCount,
      },
      { state: 6, judgeError: err }
    );
    return;
  }

  let targetState = 2; // 맞았습니다
  let judgeError = `no error`;

  let seccompRule;
  switch (language) {
    case "c++":
      seccompRule = "c_cpp";
      break;
    case "python3":
    default:
      seccompRule = "general";
  }

  for (let i = testcaseHitCount; i < testcases.length; i++) {
    console.log(">>>>>> 테스트케이스 " + i);
    const testcase = testcases[i];

    // 테스트케이스 인풋 작성
    writeFileSync(`${sandboxPath}/input.txt`, testcase.input);

    // 테스트케이스 실행
    const sandboxScript =
      `${__dirname}/sandbox.so ` +
      `--log_path=${sandboxPath}/sandbox.log ` + // 샌드박스 로그
      `--seccomp_rule_name=${seccompRule} ` +
      `${exePath}` +
      `--max_cpu_time=${timeLimit} --max_memory=${memoryLimit * 1024 * 1024} ` +
      `--input_path=${sandboxPath}/input.txt ` +
      `--output_path=${sandboxPath}/res.txt ` +
      `--error_path=${sandboxPath}/error.txt`; // 에러

    const sandboxStdout = JSON.parse(execSync(sandboxScript).toString());

    //////////////////////
    // 구동 결과 분기
    console.log(sandboxStdout);
    if (sandboxStdout.result === 1 || sandboxStdout.result === 2) {
      targetState = 4; // 시간 초과
      break;
    }

    if (sandboxStdout.result === 3) {
      targetState = 5; // 메모리 초과
      break;
    }

    if (sandboxStdout.result === 4) {
      targetState = 7; // 런타임 에러
      judgeError = readFileSync(`${sandboxPath}/error.txt`)
        .toString()
        .split("\n")
        .map((line) => {
          if (!line.includes("/sourceCode.py")) {
            return line;
          }
          return `  ${line.split(", ")[1]}`;
        })
        .join("\n");
      break;
    }

    if (sandboxStdout.result !== 0) {
      targetState = 9; // 서버 실패
      break;
    }

    const curMemory = Number.parseInt(sandboxStdout.memory / (1024 * 1024));
    const curTime = Number.parseInt(sandboxStdout.cpu_time);

    // 테스트케이스 결과 비교
    const res = readFileSync(`${sandboxPath}/res.txt`).toString();

    if (compareStringGenerously(res, testcase.output)) {
      const maxMemory =
        solution.maxMemory > curMemory ? solution.maxMemory : curMemory;
      const maxTime = solution.maxTime > curTime ? solution.maxTime : curTime;

      solution = await Solution.findOneAndUpdate(
        {
          _id: solution._id,
          state: solution.state,
          testcaseHitCount: solution.testcaseHitCount,
        },
        { testcaseHitCount: i + 1, maxMemory, maxTime },
        { new: true }
      );

      if (!solution) {
        console.log("solution 선점 당함");
        return;
      }
    } else {
      targetState = 3; // 틀렸습니다
      break;
    }
  }

  console.log(targetState);
  console.log(judgeError);
  await Solution.findOneAndUpdate(
    {
      _id: solution._id,
      state: solution.state,
      testcaseHitCount: solution.testcaseHitCount,
    },
    { state: targetState, judgeError }
  );
};

const tryToJudge = async () => {
  try {
    // 새로운 솔루션을 찾는다.
    let solution = await Solution.findOneAndUpdate(
      { state: 0 },
      { state: 1 },
      { sort: { uploadTime: 1 }, new: true }
    );

    if (!solution) {
      // 솔루션을 선점한다.
      solution = await Solution.findOne(
        { state: 1 },
        {},
        { sort: { uploadTime: 1 } }
      );
    }

    if (!solution) {
      return false;
    }

    // 해당 솔루션을 채점한다.
    console.log("tryToJudge(): 채점 개시");
    await judgeSolution(solution);
    console.log("tryToJudge(): 채점 종료");
  } catch (error) {
    console.error(error);
  }

  return true;
};

const loop = async () => {
  if (await tryToJudge()) {
    setTimeout(loop);
  } else {
    console.log("대기 중");
    setTimeout(loop, 1000);
  }
};

loop();
