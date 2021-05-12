#include <iostream>

using namespace std;

int main()
{
  int a = 7;
  delete[] a;
  delete[] a;
  delete[] a;
  delete[] a;
  delete[] a;
}