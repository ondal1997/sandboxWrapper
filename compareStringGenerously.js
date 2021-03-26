/**
 * 문자열 '배열'을 트림한 복사본을 반환하는 함수
 */
const getVerticallyTrimmedStringArray = (strings) => {
    let i
    for (i = 0; i < strings.length; i++) {
        if (strings[i].trim() !== '') {
            break
        }
    }
    if (i === strings.length) {
        return []
    }

    let j
    for (j = strings.length - 1; j >= 0; j--) {
        if (strings[j].trim() !== '') {
            break
        }
    }
    return strings.slice(i, j + 1)
}

/**
 * 두 문자열을 관대하게 비교하여 동일 여부를 반환하는 함수
 */
const compareStringGenerously = (_a, _b) => {
    const a = getVerticallyTrimmedStringArray(_a.split('\n'))
    const b = getVerticallyTrimmedStringArray(_b.split('\n'))

    if (a.length !== b.length) {
        return false
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i].trim() !== b[i].trim()) {
            return false
        }
    }

    return true
}

module.exports = compareStringGenerously
