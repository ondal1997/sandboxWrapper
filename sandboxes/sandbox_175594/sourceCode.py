n = int(input())

tmpList = [0 for _ in range(100)]

for i in range (n):
    curInput = int(input())
    tmpList[curInput-1] = 1


for i in range(100):
    if tmpList[i] == 0:
        print(i+1)


