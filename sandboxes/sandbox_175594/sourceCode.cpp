#include <stdio.h>
int main() {
	int s1 = 0;
	scanf("%d", &s1);
	float a = s1 / 4.0;
	float t = s1 * (s1 - a) / 2;
	float c = a * a * 3.14;
	printf("%.1f", c + t);

	return 0;
}//%.1f