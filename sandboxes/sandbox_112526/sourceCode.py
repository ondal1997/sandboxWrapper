candidates = [];
answer = [];

def dfs(members, m, idx, d) :
    if (m == d) :
        res = candidates[:];
        res.append("이택조");
        res.append("김영남");
        answer.append((" ").join(sorted(res)));

    for i in range(idx + 1, len(members)) :
        candidates.append(members[i]);
        dfs(members, m, i, d + 1);
        candidates.pop();

m, n = map(int, input().split());

members = [];

c = n;

while c > 0 :
    name = input();
    if(name != '이택조' and name != '김영남') :
        members.append(name);
    c -= 1;

dfs(members, m - 2, -1, 0);

print(("\n").join(sorted(answer)));