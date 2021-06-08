#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;


int n, m;
vector<string> names;

int flags[10];
vector<string> ans;

void comb(int idx, int count) {
  if (count == n) {
    vector<string> res;
    for (size_t i = 0; i < names.size(); i++) {
      if (flags[i]) {
        res.push_back(names[i]);
      }
    }
    res.push_back("이택조");
    res.push_back("김영남");
    sort(res.begin(), res.end());
    
    string chunk = "";
    for (size_t i = 0; i < res.size(); i++) {
      chunk += res[i] + " ";
    }
    ans.push_back(chunk);
    return;
  }
  
  for (int i = idx; i < m; i++) {
    flags[i] = 1;
    comb(i + 1, count+1);
    flags[i] = 0;
  }
}

int main() {
  scanf("%d%d", &n, &m);

  for (int i = 0; i < m; i++) {
    char buffer[101];
    scanf("%s", buffer);
    string name(buffer);
    if (!(name == "이택조" || name == "김영남")) {
    	names.push_back(name);
    }
  }

  comb(0, 0);
  
  sort(ans.begin(), ans.end());
  for (size_t i = 0; i < ans.size(); i++) {
    printf("%s\n", ans[i].c_str());
  }
  return 0;
}
