#include <iostream>

using namespace std;

int main()
{
  int* a = new int[2];
  delete[] a;
  delete[] a;
  delete[] a;
  delete[] a;
  delete[] a;
}