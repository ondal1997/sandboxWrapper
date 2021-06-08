a = int(input())

b = 5

i = 0
while True :
  b += i * 5
  i += 1
  if i == a :
    break

print(b)