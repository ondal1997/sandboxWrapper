# BFS로 풀어야 하기 때문에 queue 자료 구조가 필요하다.
# queue 를 list로 구현해서 사용한다.

from collections import deque


search = deque()
visit =[0 for i in range(0, 200001)]
result = 0

def BFS():
  global result
  if result:
    search.popleft()
    return
  if visit[K]:
    result=visit[K]
  tmp = search[0]
  search.popleft()
  if tmp>=1 and not visit[tmp-1]:
    visit[tmp-1] = visit[tmp]+1
    search.append(tmp-1)
  if tmp<K and not visit[tmp+1]:
    visit[tmp+1] = visit[tmp]+1
    search.append(tmp+1)
  if 2*tmp<=K+1 and not visit[2*tmp]:
    visit[2*tmp] = visit[tmp]+1
    search.append(2*tmp)


def init():
  global N, K
  N, K = map(int, input().split())
  search.append(N)

init()

if N==K:
  print(0)
else:
  while search :
    BFS()
  print(result)