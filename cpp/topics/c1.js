CPP.LAB1_VARIANTS=[
{id:'c1-v1',name:'Вариант 1',wtitle:'Вариант 1 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span>2cos(x − <span class="fr"><span>2</span><span>3</span></span>)</span><span><span class="fr"><span>1</span><span>2</span></span> + sin<sup>2</sup>y</span></span>·(1 + <span class="fr"><span>z<sup>2</sup></span><span>3 − z<sup>2</sup>/5</span></span>)</p><p>При x = 14.26; y = −1.22; z = 3.5×10<sup>−2</sup> ответ s = 0.749155.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = 2*cos(x - 2.0/3);
  b = 0.5 + pow(sin(y),2);
  c = 1 + z*z/(3 - z*z/5);
  s = a/b*c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`14.26
-1.22
3.5e-2`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = 2*cos(x - 2.0/3);</code></li><li><code>b = 0.5 + pow(sin(y),2);</code></li><li><code>c = 1 + z*z/(3 - z*z/5);</code></li><li><code>s = a/b*c;</code></li></ol><div class="trap"><b>Ловушка:</b> <code>2/3</code> и <code>1/2</code> в C++ — целое деление, оба дают 0. Пиши <code>2.0/3</code> и <code>0.5</code>.</div><p>Ответ: <span class="answer">s = 0.749155</span></p>`},
{id:'c1-v2',name:'Вариант 2',wtitle:'Вариант 2 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span><span class="rt"><sup>3</sup>√<span class="ov">9 + (x − y)<sup>2</sup></span></span></span><span>x<sup>2</sup> + y<sup>2</sup> + 2</span></span> − e<sup>|x−y|</sup>tg<sup>3</sup>z</p><p>При x = −4.5; y = 0.75×10<sup>−4</sup>; z = −0.845×10<sup>2</sup> ответ s = −3.23765.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(9 + pow(x-y,2), 1/3.);
  b = x*x + y*y + 2;
  c = exp(fabs(x-y))*pow(tan(z),3);
  s = a/b - c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`-4.5
0.75e-4
-0.845e2`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(9 + pow(x-y,2), 1/3.);</code></li><li><code>b = x*x + y*y + 2;</code></li><li><code>c = exp(fabs(x-y))*pow(tan(z),3);</code></li><li><code>s = a/b - c;</code></li></ol><div class="trap"><b>Ловушка:</b> tg<sup>3</sup>z — это (tg z)³, то есть <code>pow(tan(z),3)</code>, а не <code>tan(pow(z,3))</code>.</div><p>Ответ: <span class="answer">s = −3.23765</span></p>`},
{id:'c1-v3',name:'Вариант 3',wtitle:'Вариант 3 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span>1 + sin<sup>2</sup>(x + y)</span><span>|x − <span class="fr"><span>2y</span><span>1 + x<sup>2</sup>y<sup>2</sup></span></span>|</span></span>·x<sup>|y|</sup> + cos<sup>2</sup>(arctg <span class="fr"><span>1</span><span>z</span></span>)</p><p>При x = 3.74×10<sup>−2</sup>; y = −0.825; z = 0.16×10<sup>2</sup> ответ s = 1.05534.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, d, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = 1 + pow(sin(x+y),2);
  b = fabs(x - 2*y/(1 + x*x*y*y));
  c = pow(x, fabs(y));
  d = pow(cos(atan(1/z)),2);
  s = a/b*c + d;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`3.74e-2
-0.825
0.16e2`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, d, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = 1 + pow(sin(x+y),2);</code></li><li><code>b = fabs(x - 2*y/(1 + x*x*y*y));</code></li><li><code>c = pow(x, fabs(y));</code></li><li><code>d = pow(cos(atan(1/z)),2);</code></li><li><code>s = a/b*c + d;</code></li></ol><div class="trap"><b>Ловушка:</b> Степень x<sup>|y|</sup> записывается <code>pow(x, fabs(y))</code>; модуль дробного — только <code>fabs</code>.</div><p>Ответ: <span class="answer">s = 1.05534</span></p>`},
{id:'c1-v4',name:'Вариант 4',wtitle:'Вариант 4 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = |cos x − cos y|<sup>(1+2sin<sup>2</sup>y)</sup>·(1 + z + <span class="fr"><span>z<sup>2</sup></span><span>2</span></span> + <span class="fr"><span>z<sup>3</sup></span><span>3</span></span> + <span class="fr"><span>z<sup>4</sup></span><span>4</span></span>)</p><p>При x = 0.4×10<sup>4</sup>; y = −0.875; z = −0.475×10<sup>−3</sup> ответ s = 1.98727.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(fabs(cos(x)-cos(y)), 1 + 2*pow(sin(y),2));
  b = 1 + z + z*z/2 + pow(z,3)/3 + pow(z,4)/4;
  s = a*b;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`0.4e4
-0.875
-0.475e-3`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(fabs(cos(x)-cos(y)), 1 + 2*pow(sin(y),2));</code></li><li><code>b = 1 + z + z*z/2 + pow(z,3)/3 + pow(z,4)/4;</code></li><li><code>s = a*b;</code></li></ol><div class="trap"><b>Ловушка:</b> Вся степень (1 + 2sin²y) — второй аргумент pow, её нужно взять целиком.</div><p>Ответ: <span class="answer">s = 1.98727</span></p>`},
{id:'c1-v5',name:'Вариант 5',wtitle:'Вариант 5 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = ln(y<sup>−<span class="rt">√<span class="ov">|x|</span></span></sup>)·(x − <span class="fr"><span>y</span><span>2</span></span>) + sin<sup>2</sup>(arctg(z))</p><p>При x = −15.246; y = 4.642×10<sup>−2</sup>; z = 21 ответ s = −182.038.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = log(pow(y, -sqrt(fabs(x))));
  b = x - y/2;
  c = pow(sin(atan(z)),2);
  s = a*b + c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`-15.246
4.642e-2
21`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = log(pow(y, -sqrt(fabs(x))));</code></li><li><code>b = x - y/2;</code></li><li><code>c = pow(sin(atan(z)),2);</code></li><li><code>s = a*b + c;</code></li></ol><div class="trap"><b>Ловушка:</b> x отрицательный — под корнем обязательно <code>fabs(x)</code>, иначе sqrt вернёт NAN.</div><p>Ответ: <span class="answer">s = −182.038</span></p>`},
{id:'c1-v6',name:'Вариант 6',wtitle:'Вариант 6 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="rt">√<span class="ov">10(<span class="rt"><sup>3</sup>√<span class="ov">x</span></span> + x<sup>y+2</sup>)</span></span>·(arcsin<sup>2</sup>z − |x − y|)</p><p>При x = 16.55×10<sup>−3</sup>; y = −2.75; z = 0.15 ответ s = −40.6307.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = sqrt(10*(pow(x,1/3.) + pow(x,y+2)));
  b = pow(asin(z),2) - fabs(x-y);
  s = a*b;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`16.55e-3
-2.75
0.15`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = sqrt(10*(pow(x,1/3.) + pow(x,y+2)));</code></li><li><code>b = pow(asin(z),2) - fabs(x-y);</code></li><li><code>s = a*b;</code></li></ol><div class="trap"><b>Ловушка:</b> arcsin<sup>2</sup>z = (arcsin z)² → <code>pow(asin(z),2)</code>.</div><p>Ответ: <span class="answer">s = −40.6307</span></p>`},
{id:'c1-v7',name:'Вариант 7',wtitle:'Вариант 7 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = 5arctg(x) − <span class="fr"><span>1</span><span>4</span></span>arccos(x)·<span class="fr"><span>x + 3|x − y| + x<sup>2</sup></span><span>|x − y|z + x<sup>2</sup></span></span></p><p>При x = 0.1722; y = 6.33; z = 3.25×10<sup>−4</sup> ответ s = −205.306.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = 5*atan(x);
  b = 0.25*acos(x);
  c = (x + 3*fabs(x-y) + x*x)/(fabs(x-y)*z + x*x);
  s = a - b*c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`0.1722
6.33
3.25e-4`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = 5*atan(x);</code></li><li><code>b = 0.25*acos(x);</code></li><li><code>c = (x + 3*fabs(x-y) + x*x)/(fabs(x-y)*z + x*x);</code></li><li><code>s = a - b*c;</code></li></ol><div class="trap"><b>Ловушка:</b> <code>1/4</code> = 0 в целых числах. Пиши <code>0.25</code> или <code>1.0/4</code>.</div><p>Ответ: <span class="answer">s = −205.306</span></p>`},
{id:'c1-v8',name:'Вариант 8',wtitle:'Вариант 8 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span>e<sup>|x−y|</sup>|x − y|<sup>x+y</sup></span><span>arctg(x) + arctg(z)</span></span> + <span class="rt"><sup>3</sup>√<span class="ov">x<sup>6</sup> + ln<sup>2</sup>y</span></span></p><p>При x = −2.235×10<sup>−2</sup>; y = 2.23; z = 15.221 ответ s = 39.3741.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = exp(fabs(x-y))*pow(fabs(x-y), x+y);
  b = atan(x) + atan(z);
  c = pow(pow(x,6) + pow(log(y),2), 1/3.);
  s = a/b + c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`-2.235e-2
2.23
15.221`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = exp(fabs(x-y))*pow(fabs(x-y), x+y);</code></li><li><code>b = atan(x) + atan(z);</code></li><li><code>c = pow(pow(x,6) + pow(log(y),2), 1/3.);</code></li><li><code>s = a/b + c;</code></li></ol><div class="trap"><b>Ловушка:</b> ln<sup>2</sup>y = (ln y)² → <code>pow(log(y),2)</code>; ln — это <code>log</code>.</div><p>Ответ: <span class="answer">s = 39.3741</span></p>`},
{id:'c1-v9',name:'Вариант 9',wtitle:'Вариант 9 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = |x<sup>y/x</sup> − <span class="rt"><sup>3</sup>√<span class="ov"><span class="fr"><span>y</span><span>x</span></span></span></span>| + (y − x)·<span class="fr"><span>cos y − <span class="fr"><span>z</span><span>(y − x)</span></span></span><span>1 + (y − x)<sup>2</sup></span></span></p><p>При x = 1.825×10<sup>2</sup>; y = 18.225; z = −3.298×10<sup>−2</sup> ответ s = 1.21308.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = fabs(pow(x, y/x) - pow(y/x, 1/3.));
  b = cos(y) - z/(y-x);
  c = 1 + pow(y-x,2);
  s = a + (y-x)*b/c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`1.825e2
18.225
-3.298e-2`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = fabs(pow(x, y/x) - pow(y/x, 1/3.));</code></li><li><code>b = cos(y) - z/(y-x);</code></li><li><code>c = 1 + pow(y-x,2);</code></li><li><code>s = a + (y-x)*b/c;</code></li></ol><div class="trap"><b>Ловушка:</b> Дробь в дроби: сначала посчитай внутреннюю <code>z/(y-x)</code>, отдельной переменной проще.</div><p>Ответ: <span class="answer">s = 1.21308</span></p>`},
{id:'c1-v10',name:'Вариант 10',wtitle:'Вариант 10 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = 2<sup>−x</sup><span class="rt">√<span class="ov">x + <span class="rt"><sup>4</sup>√<span class="ov">|y|</span></span></span></span><span class="rt"><sup>3</sup>√<span class="ov">e<sup>x−1/sin z</sup></span></span></p><p>При x = 3.981×10<sup>−2</sup>; y = −1.625×10<sup>3</sup>; z = 0.512 ответ s = 1.26185.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(2, -x);
  b = sqrt(x + pow(fabs(y), 0.25));
  c = pow(exp(x - 1/sin(z)), 1/3.);
  s = a*b*c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`3.981e-2
-1.625e3
0.512`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(2, -x);</code></li><li><code>b = sqrt(x + pow(fabs(y), 0.25));</code></li><li><code>c = pow(exp(x - 1/sin(z)), 1/3.);</code></li><li><code>s = a*b*c;</code></li></ol><div class="trap"><b>Ловушка:</b> ⁴√|y| = <code>pow(fabs(y), 0.25)</code>. Здесь <code>1/sin(z)</code> — нормально: sin(z) дробный, деление уже не целое.</div><p>Ответ: <span class="answer">s = 1.26185</span></p>`},
{id:'c1-v11',name:'Вариант 11',wtitle:'Вариант 11 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = y<sup><span class="rt"><sup>3</sup>√<span class="ov">|x|</span></span></sup> + cos<sup>3</sup>(y)·<span class="fr"><span>|x − y|(1 + <span class="fr"><span>sin<sup>2</sup>z</span><span><span class="rt">√<span class="ov">x + y</span></span></span></span>)</span><span>e<sup>|x−y|</sup> + <span class="fr"><span>x</span><span>2</span></span></span></span></p><p>При x = 6.251; y = 0.827; z = 25.001 ответ s = 0.712122.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, d, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(y, pow(fabs(x),1/3.));
  b = pow(cos(y),3);
  c = fabs(x-y)*(1 + pow(sin(z),2)/sqrt(x+y));
  d = exp(fabs(x-y)) + x/2;
  s = a + b*c/d;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`6.251
0.827
25.001`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, d, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(y, pow(fabs(x),1/3.));</code></li><li><code>b = pow(cos(y),3);</code></li><li><code>c = fabs(x-y)*(1 + pow(sin(z),2)/sqrt(x+y));</code></li><li><code>d = exp(fabs(x-y)) + x/2;</code></li><li><code>s = a + b*c/d;</code></li></ol><div class="trap"><b>Ловушка:</b> Степень сама вычисляется через pow — получается pow внутри pow, это нормально.</div><p>Ответ: <span class="answer">s = 0.712122</span></p>`},
{id:'c1-v12',name:'Вариант 12',wtitle:'Вариант 12 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = 2<sup>(y<sup>x</sup>)</sup> + (3<sup>x</sup>)<sup>y</sup> − <span class="fr"><span>y(arctg z − <span class="fr"><span>1</span><span>3</span></span>)</span><span>|x| + <span class="fr"><span>1</span><span>y<sup>2</sup> + 1</span></span></span></span></p><p>При x = 3.251; y = 0.325; z = 0.466×10<sup>−4</sup> ответ s = 4.23655.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, d, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(2, pow(y,x));
  b = pow(pow(3,x), y);
  c = y*(atan(z) - 1/3.);
  d = fabs(x) + 1/(y*y + 1);
  s = a + b - c/d;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`3.251
0.325
0.466e-4`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, d, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(2, pow(y,x));</code></li><li><code>b = pow(pow(3,x), y);</code></li><li><code>c = y*(atan(z) - 1/3.);</code></li><li><code>d = fabs(x) + 1/(y*y + 1);</code></li><li><code>s = a + b - c/d;</code></li></ol><div class="trap"><b>Ловушка:</b> <code>1/3</code> → <code>1/3.</code>. А <code>1/(y*y + 1)</code> уже правильно: y дробный.</div><p>Ответ: <span class="answer">s = 4.23655</span></p>`},
{id:'c1-v13',name:'Вариант 13',wtitle:'Вариант 13 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span><span class="rt"><sup>4</sup>√<span class="ov">y + <span class="rt"><sup>3</sup>√<span class="ov">x − 1</span></span></span></span></span><span>|x − y|(sin<sup>2</sup>z + tg z)</span></span></p><p>При x = 17.421; y = 10.365×10<sup>−3</sup>; z = 0.828×10<sup>5</sup> ответ s = 0.330564.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(y + pow(x-1, 1/3.), 0.25);
  b = fabs(x-y)*(pow(sin(z),2) + tan(z));
  s = a/b;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`17.421
10.365e-3
0.828e5`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(y + pow(x-1, 1/3.), 0.25);</code></li><li><code>b = fabs(x-y)*(pow(sin(z),2) + tan(z));</code></li><li><code>s = a/b;</code></li></ol><div class="trap"><b>Ловушка:</b> Корень 4-й степени = степень 0.25. Весь знаменатель — в одну переменную b, тогда скобки не потеряются.</div><p>Ответ: <span class="answer">s = 0.330564</span></p>`},
{id:'c1-v14',name:'Вариант 14',wtitle:'Вариант 14 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span>y<sup>x+1</sup></span><span><span class="rt"><sup>3</sup>√<span class="ov">|y − 2|</span></span> + 3</span></span> + <span class="fr"><span>x + <span class="fr"><span>y</span><span>2</span></span></span><span>2|x + y|</span></span>(x + 1)<sup>−1/sin z</sup></p><p>При x = 12.3×10<sup>−1</sup>; y = 15.4; z = 0.252×10<sup>3</sup> ответ s = 82.8256.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = pow(y, x+1)/(pow(fabs(y-2), 1/3.) + 3);
  b = (x + y/2)/(2*fabs(x+y));
  c = pow(x+1, -1/sin(z));
  s = a + b*c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`12.3e-1
15.4
0.252e3`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = pow(y, x+1)/(pow(fabs(y-2), 1/3.) + 3);</code></li><li><code>b = (x + y/2)/(2*fabs(x+y));</code></li><li><code>c = pow(x+1, -1/sin(z));</code></li><li><code>s = a + b*c;</code></li></ol><div class="trap"><b>Ловушка:</b> Показатель степени −1/sin z — второй аргумент pow: <code>pow(x+1, -1/sin(z))</code>.</div><p>Ответ: <span class="answer">s = 82.8256</span></p>`},
{id:'c1-v15',name:'Вариант 15',wtitle:'Вариант 15 — напиши программу',cmp:'approx',text:String.raw`<p class="fx">s = <span class="fr"><span>x<sup>y+1</sup> + e<sup>y−1</sup></span><span>1 + x|y − tg z|</span></span>(1 + |y − x|) + <span class="fr"><span>|y − x|<sup>2</sup></span><span>2</span></span> − <span class="fr"><span>|y − x|<sup>3</sup></span><span>3</span></span></p><p>При x = 2.444; y = 0.869×10<sup>−2</sup>; z = −0.13×10<sup>3</sup> ответ s = −0.498707.</p>`,ref:String.raw`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, z, a, b, c, s;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  cout << "Vvedite z: ";
  cin >> z;
  a = (pow(x,y+1) + exp(y-1))/(1 + x*fabs(y - tan(z)));
  b = 1 + fabs(y-x);
  c = pow(fabs(y-x),2)/2 - pow(fabs(y-x),3)/3;
  s = a*b + c;
  cout << "Result s= " << s << endl;
  getch();
  return 0;
}`,ins:[['Данные варианта',String.raw`2.444
0.869e-2
-0.13e3`]],steps:String.raw`<p>Объявляем <code>double x, y, z, a, b, c, s;</code>, вводим x, y, z (числа вида 3.5×10⁻² вводим как <code>3.5e-2</code>). Формулу делим на части:</p><ol><li><code>a = (pow(x,y+1) + exp(y-1))/(1 + x*fabs(y - tan(z)));</code></li><li><code>b = 1 + fabs(y-x);</code></li><li><code>c = pow(fabs(y-x),2)/2 - pow(fabs(y-x),3)/3;</code></li><li><code>s = a*b + c;</code></li></ol><div class="trap"><b>Ловушка:</b> Эта формула почти как в примере лабы — начни с кода примера и поменяй части.</div><p>Ответ: <span class="answer">s = −0.498707</span></p>`},
];
/* C++ · Тема 1 */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> Отдельного файла лекции по теме 1 нет. Оригинал ниже — план лекции из УМКД (переведён, английские термины в скобках — так они звучат в тестах). Сама лекция написана мной по каждому пункту плана (бледные блоки).</aside>

  <h2 id="c1-lec">Лекция 1. Парадигмы программирования. Классификация языков программирования. Алгоритм. Способы задания алгоритмов. Синтаксис языка C++</h2>
  <p><b>Цель:</b> познакомить с основными понятиями программирования, алгоритмами, классификацией языков программирования, синтаксисом и структурой программ на C++.</p>
  <p><b>Основные пункты лекции:</b></p>
  <ul>
    <li>Понятие программирования и парадигмы программирования (programming paradigms).</li>
    <li>Классификация языков программирования.</li>
    <li>Понятие и свойства алгоритма.</li>
    <li>Способы задания алгоритмов: словесное описание, псевдокод, блок-схемы и программный код.</li>
    <li>Графическое представление алгоритмов с помощью блок-схем (flowcharts).</li>
    <li>Алфавит C++ и лексические элементы.</li>
    <li>Идентификаторы, ключевые слова, константы и специальные символы.</li>
    <li>Управляющие последовательности (escape sequences) и комментарии.</li>
    <li>Общая структура программы на C++.</li>
    <li>Структура программы в Borland C++.</li>
    <li>Структура «следование» (sequence structure).</li>
    <li>Основные типы данных C++.</li>
    <li>Перечислимый тип (enumerated type).</li>
    <li>Массивы и множества данных (multiplicity).</li>
    <li>Указатели и адреса памяти.</li>
  </ul>
  <details class="lab-orig"><summary>Оригинал УМКД (на английском; перевод — выше)</summary><div class="body">
    <p>1. Programming paradigms. Classification of programming languages. Algorithm. Specifying algorithms. A graphical presentation of types of algorithms. The syntax of a C++ programming language: an alphabet, an identifier, a keyword, a constant, esc-sequences, a comment. Structure of program in the BORLAND C ++ programming language. Sequence structure. Data types: simple data types, enumerated type, multiplicity, pointers.</p>
    <p>Goal: To introduce students to the basic concepts of programming, algorithms, programming language classification, and the syntax and structure of C++ programs.</p>
    <p>Main points of the lecture: Concept of programming and programming paradigms. Classification of programming languages. Concept and properties of an algorithm. Methods of specifying algorithms: verbal description, pseudocode, flowcharts, and program code. Graphical representation of algorithms using flowcharts. C++ alphabet and lexical elements. Identifiers, keywords, constants, and special symbols. Escape sequences and comments. General structure of a C++ program. Structure of a program in Borland C++. Sequence structure of an algorithm. Basic data types in C++. Enumerated data type. Arrays and multiplicity of data. Pointers and memory addresses.</p>
  </div></details>

  <h3>1. Программирование и парадигмы</h3>
  <aside class="add"><span class="tag">дополнение · программирование</span>
    <p><b>Программирование</b> — это составление программы: точной инструкции для компьютера на языке, который он может выполнить. Программа = алгоритм, записанный на языке программирования.</p>
    <p><b>Парадигма программирования</b> — общий подход, «стиль мышления», в котором пишут программу:</p>
    <ul>
      <li><b>Процедурная (структурная)</b> — программа это последовательность действий и вызовов функций. Так пишут на C, Pascal, на C++ в темах 1–6.</li>
      <li><b>Объектно-ориентированная (ООП)</b> — программа строится из <b>объектов</b>: данные и действия над ними объединены в классы. C++, Java, C#, Delphi. Это темы 7–15.</li>
      <li><b>Функциональная</b> — программа как набор математических функций без изменения переменных (Haskell, Lisp).</li>
      <li><b>Логическая</b> — описываются факты и правила, а решение ищет сама система (Prolog).</li>
    </ul>
    <p>C++ — <b>мультипарадигменный</b> язык: на нём можно писать и процедурно, и объектно-ориентированно.</p>
  </aside>

  <h3>2. Классификация языков программирования</h3>
  <aside class="add"><span class="tag">дополнение · уровни языков</span>
    <div class="tw"><table>
      <tr><th>Уровень</th><th>Что это</th><th>Примеры</th></tr>
      <tr><td>Машинный код</td><td>команды процессора в двоичном виде, 0 и 1</td><td><code>10110000 01100001</code></td></tr>
      <tr><td>Низкого уровня</td><td>мнемоники команд процессора, привязаны к конкретному процессору</td><td>ассемблер: <code>MOV AL, 61h</code></td></tr>
      <tr><td>Высокого уровня</td><td>понятные человеку конструкции, не зависят от процессора; переводятся компилятором</td><td>C, C++, Pascal, Java, C#, Python</td></tr>
    </table></div>
    <p><b>Компилируемые</b> языки (C, C++, Pascal): вся программа заранее переводится компилятором в машинный код — получается .exe. <b>Интерпретируемые</b> (Python, JavaScript): программа выполняется построчно интерпретатором.</p>
    <p><b>История, которую спрашивают в тестах:</b> язык <b>C</b> создал <b>Деннис Ритчи</b> в 1972 году для написания операционной системы <b>UNIX</b> — это первый большой системный продукт на C. Язык <b>C++</b> создал <b>Бьёрн Страуструп</b> в 1983 году как «C с классами». Pascal — Никлаус Вирт.</p>
    <p><b>Среды и компиляторы C++:</b> Borland C++Builder 6 (наш курс), Embarcadero C++Builder, Microsoft Visual Studio, Code::Blocks, Dev-C++; онлайн — repl.it, codingrooms.com, onlinegdb.com. Окно на этом сайте — тоже маленький «онлайн-компилятор», настроенный под Builder 6.</p>
  </aside>

  <h3>3. Алгоритм и его свойства</h3>
  <aside class="add"><span class="tag">дополнение · алгоритм</span>
    <p><b>Алгоритм</b> — точное, понятное исполнителю описание конечной последовательности действий, которая приводит от исходных данных к результату.</p>
    <p><b>Свойства алгоритма</b> (их часто спрашивают по одному):</p>
    <ul>
      <li><b>Дискретность</b> — алгоритм разбит на отдельные шаги.</li>
      <li><b>Понятность</b> — каждый шаг понятен исполнителю (компьютер «понимает» только команды своего языка).</li>
      <li><b>Определённость (детерминированность)</b> — каждый шаг однозначен: при одних и тех же данных — один и тот же результат.</li>
      <li><b>Конечность (результативность)</b> — алгоритм заканчивается за конечное число шагов и даёт результат.</li>
      <li><b>Массовость</b> — алгоритм решает не одну задачу, а целый класс задач при разных исходных данных.</li>
    </ul>
    <p><b>Способы задания алгоритма:</b> словесный (обычным языком), <b>псевдокод</b> (полуформальный язык: «ввести x; если x&gt;0 то…»), <b>блок-схема</b> (графически) и <b>программа</b> на языке программирования.</p>
    <p>Пример — один алгоритм четырьмя способами. Задача: найти площадь круга по радиусу.</p>
    <ul>
      <li>Словесно: «Узнать радиус. Умножить 3,14 на радиус в квадрате. Сообщить результат».</li>
      <li>Псевдокод: <code>ввод r; S := 3.14·r²; вывод S</code>.</li>
      <li>Программа: <code>cin &gt;&gt; r; S = 3.14*r*r; cout &lt;&lt; S;</code></li>
    </ul>
  </aside>

  <h3>4. Блок-схемы и типы алгоритмов</h3>
  <aside class="add"><span class="tag">дополнение · блок-схемы</span>
    <p><b>Блок-схема</b> (flowchart) — графическое изображение алгоритма: блоки соединены стрелками в порядке выполнения. Основные символы (ГОСТ 19.701):</p>
    <div class="tw"><table>
      <tr><th>Фигура</th><th>Название</th><th>Что означает</th></tr>
      <tr><td>Овал (скруглённый прямоугольник)</td><td>Терминатор</td><td>Начало и конец алгоритма</td></tr>
      <tr><td>Параллелограмм</td><td>Данные</td><td>Ввод и вывод данных (<code>cin</code>, <code>cout</code>)</td></tr>
      <tr><td>Прямоугольник</td><td>Процесс</td><td>Вычисление, присваивание (<code>s = a + b</code>)</td></tr>
      <tr><td>Ромб</td><td>Решение</td><td>Проверка условия, два выхода: «да» и «нет»</td></tr>
      <tr><td>Шестиугольник</td><td>Подготовка (модификация)</td><td>Заголовок цикла с параметром (<code>for</code>)</td></tr>
      <tr><td>Прямоугольник с двойными боковыми линиями</td><td>Предопределённый процесс</td><td>Вызов функции (подпрограммы)</td></tr>
      <tr><td>Кружок</td><td>Соединитель</td><td>Переход на другое место схемы</td></tr>
    </table></div>
    <p><b>Три базовых типа алгоритмов</b> (из них строится любой алгоритм):</p>
    <ul>
      <li><b>Линейный (следование, sequence)</b> — действия выполняются строго одно за другим. Лаба 1 — линейные алгоритмы.</li>
      <li><b>Разветвляющийся (ветвление, selection)</b> — есть проверка условия, и дальше выполняется одна из ветвей. В C++ — <code>if</code>, <code>switch</code> (тема 3).</li>
      <li><b>Циклический (повторение, repetition)</b> — группа действий повторяется. В C++ — <code>for</code>, <code>while</code>, <code>do…while</code> (темы 3–4).</li>
    </ul>
  </aside>
</div>
<div class="diagram"><div style="display:flex;flex-wrap:wrap;gap:28px;justify-content:center">
  <div class="flow" aria-label="Линейный алгоритм"><b style="margin-bottom:6px">Следование</b>
    <div class="fb term">Начало</div><div class="ar"></div><div class="fb io"><span>Ввод r</span></div><div class="ar"></div><div class="fb">S = 3.14·r·r</div><div class="ar"></div><div class="fb io"><span>Вывод S</span></div><div class="ar"></div><div class="fb term">Конец</div></div>
  <div class="flow" aria-label="Ветвление"><b style="margin-bottom:6px">Ветвление</b>
    <div class="fb term">Начало</div><div class="ar"></div><div class="fb io"><span>Ввод x</span></div><div class="ar"></div><div class="fb dec"><span>x &gt; 0 ?</span></div>
    <div style="display:flex;gap:18px;font-size:12.5px"><div class="flow"><span>да</span><div class="ar"></div><div class="fb io" style="min-width:110px"><span>«плюс»</span></div></div><div class="flow"><span>нет</span><div class="ar"></div><div class="fb io" style="min-width:110px"><span>«не плюс»</span></div></div></div>
    <div class="ar"></div><div class="fb term">Конец</div></div>
  <div class="flow" aria-label="Цикл"><b style="margin-bottom:6px">Цикл</b>
    <div class="fb term">Начало</div><div class="ar"></div><div class="fb">i = 1</div><div class="ar"></div><div class="fb dec"><span>i ≤ 5 ?</span></div>
    <div style="display:flex;gap:18px;font-size:12.5px"><div class="flow"><span>да</span><div class="ar"></div><div class="fb io" style="min-width:90px"><span>Вывод i</span></div><div class="ar"></div><div class="fb" style="min-width:90px">i = i + 1</div><span>↺ к проверке</span></div><div class="flow"><span>нет</span><div class="ar"></div><div class="fb term" style="min-width:90px">Конец</div></div></div></div>
</div></div>
<div class="read">

  <h3>5. Алфавит C++ и лексемы</h3>
  <aside class="add"><span class="tag">дополнение · алфавит и лексемы</span>
    <p><b>Алфавит C++</b> — символы, из которых можно составлять программу:</p>
    <ul>
      <li>прописные и строчные <b>латинские буквы</b> A–Z, a–z и знак подчёркивания <code>_</code>;</li>
      <li><b>арабские цифры</b> 0–9;</li>
      <li><b>специальные символы</b>: <code>+ - * / % = &lt; &gt; ! &amp; | ^ ~ ? : ; , . ' " ( ) [ ] { } # \</code>;</li>
      <li>пробельные символы: пробел, табуляция, перевод строки.</li>
    </ul>
    <p><b>Русские буквы в алфавит НЕ входят</b> — их можно писать только внутри строк <code>"…"</code> и в комментариях. Имя переменной <code>сумма</code> — ошибка (это вопрос из базы).</p>
    <p><b>Лексема</b> (token) — наименьшая смысловая единица языка, «слово» программы. Компилятор сначала разбивает текст на лексемы. Виды лексем: <b>идентификаторы</b>, <b>ключевые слова</b>, <b>константы</b> (литералы), <b>знаки операций</b>, <b>разделители</b> (<code>; , { } ( )</code>).</p>
    <p>Строка <code>sum = a + 15;</code> состоит из 6 лексем: <code>sum</code>, <code>=</code>, <code>a</code>, <code>+</code>, <code>15</code>, <code>;</code>. <b>Зачем нужны лексемы:</b> по ним компилятор понимает, где имя, где число, где операция.</p>
  </aside>

  <h3>6. Идентификаторы и ключевые слова</h3>
  <aside class="add"><span class="tag">дополнение · идентификаторы</span>
    <p><b>Идентификатор</b> — имя объекта программы: переменной, константы, типа, функции, класса.</p>
    <p><b>Правила:</b></p>
    <ol>
      <li>Состоит из латинских букв, цифр и <code>_</code>.</li>
      <li>Начинается с буквы или <code>_</code>, <b>не с цифры</b>.</li>
      <li><b>Большие и маленькие буквы различаются</b>: <code>Sum</code>, <code>sum</code> и <code>SUM</code> — три разных имени.</li>
      <li>Не может совпадать с ключевым словом.</li>
      <li>Без пробелов и дефисов. В Borland значимы первые 250 символов.</li>
    </ol>
    <div class="tw"><table><tr><th>Правильно</th><th>Неправильно</th><th>Почему</th></tr>
      <tr><td><code>sum</code>, <code>x1</code>, <code>_count</code>, <code>maxValue</code></td><td><code>1x</code></td><td>начинается с цифры</td></tr>
      <tr><td><code>my_sum</code></td><td><code>my-sum</code>, <code>my sum</code></td><td>дефис и пробел запрещены</td></tr>
      <tr><td><code>Int</code>, <code>Float</code></td><td><code>int</code>, <code>float</code></td><td>ключевые слова</td></tr>
      <tr><td><code>summa</code></td><td><code>сумма</code></td><td>русских букв нет в алфавите</td></tr></table></div>
    <p><b>Ключевые (зарезервированные) слова</b> — слова из специального набора, которые компилятор понимает по-своему; использовать их как имена нельзя. Главные: <code>int char float double bool void short long unsigned signed const if else switch case default for while do break continue return goto struct class public private protected new delete this true false sizeof enum typedef</code>.</p>
  </aside>

  <h3>7. Константы, escape-последовательности, комментарии</h3>
  <aside class="add"><span class="tag">дополнение · константы</span>
    <div class="tw"><table><tr><th>Вид константы</th><th>Примеры</th><th>Тип</th></tr>
      <tr><td>Целая десятичная</td><td><code>25</code>, <code>-7</code>, <code>0</code></td><td>int</td></tr>
      <tr><td>Целая восьмеричная (начинается с 0)</td><td><code>017</code> = 15</td><td>int</td></tr>
      <tr><td>Целая шестнадцатеричная (0x…)</td><td><code>0x1F</code> = 31</td><td>int</td></tr>
      <tr><td>Вещественная</td><td><code>3.14</code>, <code>.5</code>, <code>2.</code></td><td>double</td></tr>
      <tr><td>Вещественная в экспоненциальной форме</td><td><code>1.5e-3</code> = 1,5·10⁻³, <code>0.423e-2</code></td><td>double</td></tr>
      <tr><td>С суффиксом</td><td><code>3.5f</code> — float, <code>100L</code> — long, <code>10u</code> — unsigned</td><td></td></tr>
      <tr><td>Символьная (в одинарных кавычках)</td><td><code>'A'</code>, <code>'7'</code>, <code>'\n'</code></td><td>char</td></tr>
      <tr><td>Строковая (в двойных кавычках)</td><td><code>"Hello"</code> — в памяти 6 байт: 5 букв и <code>'\0'</code></td><td>массив char</td></tr>
      <tr><td>Логическая</td><td><code>true</code>, <code>false</code></td><td>bool</td></tr></table></div>
    <p><b>Именованные константы</b> — значение нельзя менять:</p>
<pre class="cpp-code">const double PI = 3.14159;   // константа с типом — так правильнее в C++
#define N 10                 // макрос препроцессора: перед компиляцией N заменится на 10</pre>
    <p>Если написать <code>const int a = 5; a++;</code> — программа <b>не скомпилируется</b>: «Cannot modify a const object» (вопрос из базы).</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · escape-последовательности</span>
    <p><b>Управляющая (escape) последовательность</b> — обратная косая черта <code>\</code> и символ после неё. Записывает внутри строки или символа то, что нельзя набрать напрямую.</p>
    <div class="tw"><table><tr><th>Запись</th><th>Что делает</th></tr>
      <tr><td><code>\n</code></td><td>переход на новую строку (new line)</td></tr>
      <tr><td><code>\t</code></td><td>горизонтальная табуляция — прыжок к следующей позиции, кратной 8</td></tr>
      <tr><td><code>\a</code></td><td>звуковой сигнал (alert)</td></tr>
      <tr><td><code>\b</code></td><td>шаг назад (backspace)</td></tr>
      <tr><td><code>\r</code></td><td>возврат каретки в начало строки</td></tr>
      <tr><td><code>\f</code>, <code>\v</code></td><td>новая страница, вертикальная табуляция</td></tr>
      <tr><td><code>\\</code> <code>\'</code> <code>\"</code></td><td>сами символы \ ' "</td></tr>
      <tr><td><code>\0</code></td><td>нулевой символ — конец строки</td></tr>
      <tr><td><code>\x41</code>, <code>\101</code></td><td>символ по коду (hex / восьмеричный): тут оба — 'A'</td></tr></table></div>
    <p><b>Комментарии</b> — пояснения для человека, компилятор их пропускает: <code>// до конца строки</code> и <code>/* можно на несколько строк */</code>.</p>
  </aside>

  <h3>8. Структура программы в Borland C++</h3>
  <aside class="add"><span class="tag">дополнение · структура программы</span>
    <p>Любая программа на C++ состоит из <b>директив препроцессора</b>, объявлений и <b>функций</b>. Выполнение <b>всегда начинается с функции <code>main()</code></b>.</p>
<pre class="cpp-code">#include &lt;iostream.h&gt;   // 1. директивы препроцессора: подключаем библиотеки
#include &lt;conio.h&gt;
#include &lt;math.h&gt;

const double PI = 3.14159; // 2. глобальные объявления (необязательно)

int main()                 // 3. главная функция — с неё начинается выполнение
{                          //    тело функции — в фигурных скобках { }
  double r, s;             // 4. объявление переменных
  cout &lt;&lt; "r = ";          // 5. операторы, каждый заканчивается точкой с запятой
  cin &gt;&gt; r;
  s = PI * r * r;
  cout &lt;&lt; "S = " &lt;&lt; s &lt;&lt; endl;
  getch();                 // ждём нажатия клавиши, чтобы окно не закрылось
  return 0;                // 6. возвращаем 0 — «программа завершилась нормально»
}</pre>
    <ul>
      <li><code>#include &lt;файл.h&gt;</code> — вставляет в программу <b>заголовочный файл</b> (.h) с описаниями библиотечных функций. Сами функции лежат в <b>библиотечных файлах</b> (.lib).</li>
      <li><code>iostream.h</code> — ввод-вывод: <code>cout</code> (вывод, «си-аут»), <code>cin</code> (ввод), <code>endl</code> (конец строки).</li>
      <li><code>conio.h</code> — консоль: <code>getch()</code> ждёт клавишу и не показывает её, <code>clrscr()</code> очищает экран.</li>
      <li><code>math.h</code> — математика: <code>sqrt, pow, sin, fabs…</code></li>
      <li>Переменные объявляют <b>в любом месте, но до первого использования</b>.</li>
    </ul>
    <p>В C++Builder консольную программу создают так: <b>File → New → Other… → Console Wizard</b>. Builder сам пишет заготовку с <code>#include &lt;vcl.h&gt;</code>, <code>#pragma hdrstop</code> и <code>int main(int argc, char* argv[])</code> — подробно в лабе 1 ниже.</p>
    <p><b>Русский текст в консоли.</b> Окно консоли Windows по умолчанию работает в кодировке 866, а Builder сохраняет строки в 1251 — русские буквы превращаются в «кракозябры». Поэтому в примерах лаб подсказки пишут латиницей: <code>"Vvedite x: "</code>. На этом сайте русский текст показывается нормально.</p>
  </aside>

  <h3>9. Типы данных</h3>
  <aside class="add"><span class="tag">дополнение · простые типы (Borland C++Builder, 32 бита)</span>
    <div class="tw"><table><tr><th>Тип</th><th>Байт</th><th>Диапазон</th><th>Пример</th></tr>
      <tr><td><code>char</code></td><td class="n">1</td><td class="n">−128 … 127</td><td>символ: <code>char c = 'A';</code></td></tr>
      <tr><td><code>unsigned char</code></td><td class="n">1</td><td class="n">0 … 255</td><td></td></tr>
      <tr><td><code>short</code> (short int)</td><td class="n">2</td><td class="n">−32 768 … 32 767</td><td></td></tr>
      <tr><td><code>unsigned short</code></td><td class="n">2</td><td class="n">0 … 65 535</td><td></td></tr>
      <tr><td><code>int</code></td><td class="n">4</td><td class="n">−2 147 483 648 … 2 147 483 647</td><td>целое: <code>int n = 5;</code></td></tr>
      <tr><td><code>unsigned int</code></td><td class="n">4</td><td class="n">0 … 4 294 967 295</td><td></td></tr>
      <tr><td><code>long</code> (long int)</td><td class="n">4</td><td class="n">как int</td><td></td></tr>
      <tr><td><code>float</code></td><td class="n">4</td><td class="n">±3.4·10<sup>±38</sup>, 7 цифр</td><td>вещественное одинарной точности</td></tr>
      <tr><td><code>double</code></td><td class="n">8</td><td class="n">±1.7·10<sup>±308</sup>, 15 цифр</td><td>вещественное двойной точности</td></tr>
      <tr><td><code>long double</code></td><td class="n">10</td><td class="n">±3.4·10<sup>±4932</sup>, 19 цифр</td><td></td></tr>
      <tr><td><code>bool</code></td><td class="n">1</td><td class="n">true / false (1 / 0)</td><td>логический: <code>bool ok = true;</code></td></tr>
      <tr><td><code>void</code></td><td class="n">—</td><td>«нет значения»</td><td>функция ничего не возвращает</td></tr></table></div>
    <p><b>Модификаторы</b> меняют размер и знак: <code>signed</code> / <code>unsigned</code> (со знаком / без знака), <code>short</code> / <code>long</code>. В C++ <code>true</code> — это 1, <code>false</code> — 0, а любое ненулевое число в условии считается истиной.</p>
    <p><b>Переполнение.</b> Если значение выходит за диапазон, оно «перескакивает» на другой конец: <code>short s = 32767; s++;</code> → −32768. Ошибки нет — программа молча считает неправильно. Это задание СРС «Check what happens when a variable overflows» («проверь, что будет при переполнении переменной») — запусти пример ниже.</p>
  </aside>
</div>
<div class="cppw" data-id="c1-demo-overflow" data-cmp="none" data-title="Пример: переполнение (СРС) — просто запусти">
<script type="text/x-cpp" data-role="ref">
#include <iostream.h>
#include <conio.h>

int main()
{
  short s = 32767;            // максимум для short
  s++;
  cout << "short: 32767 + 1 = " << s << endl;

  unsigned int u = 0;
  u--;                        // меньше нуля без знака не бывает
  cout << "unsigned: 0 - 1 = " << u << endl;

  int big = 2147483647;
  big = big + 1;
  cout << "int: 2147483647 + 1 = " << big << endl;

  char c = 127;
  c++;
  cout << "char: 127 + 1 = " << (int)c << endl;
  getch();
  return 0;
}
</script>
<script type="text/x-cpp" data-role="start">
#include <iostream.h>
#include <conio.h>

int main()
{
  short s = 32767;            // максимум для short
  s++;
  cout << "short: 32767 + 1 = " << s << endl;

  unsigned int u = 0;
  u--;                        // меньше нуля без знака не бывает
  cout << "unsigned: 0 - 1 = " << u << endl;

  int big = 2147483647;
  big = big + 1;
  cout << "int: 2147483647 + 1 = " << big << endl;

  char c = 127;
  c++;
  cout << "char: 127 + 1 = " << (int)c << endl;
  getch();
  return 0;
}
</script>
</div>
<div class="read">
  <aside class="add"><span class="tag">дополнение · enum, массивы, указатели (кратко — подробно в темах 2 и 4)</span>
    <p><b>Перечислимый тип</b> <code>enum</code> — свой тип с именованными целыми константами:</p>
<pre class="cpp-code">enum Color { RED, GREEN, BLUE };      // RED = 0, GREEN = 1, BLUE = 2
enum Day { MON = 1, TUE, WED };        // TUE = 2, WED = 3 — дальше по +1
Color c = GREEN;
cout &lt;&lt; c;                              // напечатает 1</pre>
    <p><b>Множество однотипных данных</b> (multiplicity) хранят в <b>массиве</b> — последовательности значений одного типа под одним именем: <code>int a[5];</code>, номера (индексы) с 0 до 4. Встроенного типа «множество», как set в Pascal, в C++ нет.</p>
    <p><b>Указатель</b> — переменная, в которой хранится <b>адрес</b> другой переменной в памяти: <code>int x = 5; int *p = &amp;x;</code> — <code>&amp;x</code> «адрес x», <code>*p</code> «значение по адресу».</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · ввод-вывод и переменные</span>
    <p><b>Переменная</b> — именованная область памяти, где хранится значение определённого типа; значение может меняться во время работы программы. Объявление: <code>тип имя;</code> или сразу с начальным значением <code>int n = 0;</code>, несколько сразу: <code>double x, y, z;</code>.</p>
    <p><b>Вывод</b> <code>cout &lt;&lt; "x = " &lt;&lt; x &lt;&lt; endl;</code> — текст в кавычках печатается как есть (он нужен только для понятности), переменная — своим значением. <b>Ввод</b> <code>cin &gt;&gt; x;</code> — программа ждёт, пока пользователь наберёт число и нажмёт Enter. Числа можно вводить и в экспоненциальной форме: <code>-0.423e-2</code>.</p>
    <p><b>Как C++ печатает дробные числа</b> через <code>cout</code>: максимум 6 значащих цифр, лишние нули отбрасываются: 6.9465, 0.333333, 1.23457e+06 (= 1 234 570).</p>
  </aside>

</div>`;
const QA=R`
  <h2 id="c1-q">Вопросы УМКД к теме 1 — с ответами</h2>
  <p>Это вопросы к рубежному контролю 1 и экзамену (из УМКД). Ответы короткие, чтобы можно было выучить.</p>
  <aside class="add"><span class="tag">ответы · вопросы УМКД 1–10</span>
    <ol>
      <li><b>Что такое алгоритм? Основные свойства?</b> (What is an algorithm?) — Точное конечное описание последовательности действий, ведущей от исходных данных к результату. Свойства: дискретность, понятность, определённость, конечность (результативность), массовость.</li>
      <li><b>Основные способы задания алгоритма?</b> — Словесный, псевдокод, блок-схема, программа на языке программирования.</li>
      <li><b>Что такое блок-схема, основные символы?</b> — Графическая запись алгоритма. Овал — начало/конец, параллелограмм — ввод/вывод, прямоугольник — действие, ромб — условие, шестиугольник — цикл с параметром, стрелки — порядок.</li>
      <li><b>Основные типы алгоритмов?</b> — Линейный (следование), разветвляющийся (ветвление), циклический (повторение).</li>
      <li><b>Разница между последовательным, разветвляющимся и циклическим?</b> — В линейном все действия выполняются один раз подряд; в разветвляющемся по условию выполняется одна из ветвей; в циклическом группа действий повторяется, пока выполняется условие или заданное число раз.</li>
      <li><b>Общая структура программы на C++?</b> — Директивы препроцессора (<code>#include</code>), глобальные объявления, функции; обязательна <code>main()</code> — с неё начинается выполнение; тело функции в <code>{ }</code>, операторы через <code>;</code>, в конце <code>return 0;</code>.</li>
      <li><b>Основные элементы синтаксиса C++?</b> — Алфавит (латинские буквы, цифры, спецсимволы) и лексемы: идентификаторы, ключевые слова, константы, знаки операций, разделители; комментарии.</li>
      <li><b>Что такое идентификаторы, ключевые слова, константы и переменные?</b> — Идентификатор — имя объекта программы. Ключевое слово — зарезервированное слово языка (int, if, return…). Константа — значение, которое не меняется (25, 'A', <code>const double PI</code>). Переменная — именованная область памяти, значение которой можно менять.</li>
      <li><b>Что такое комментарии и escape-последовательности? Примеры.</b> — Комментарий — текст для человека, компилятор его пропускает: <code>// …</code>, <code>/* … */</code>. Escape-последовательность — <code>\</code> + символ для особых знаков: <code>\n</code> новая строка, <code>\t</code> табуляция, <code>\\</code>, <code>\"</code>, <code>\0</code>.</li>
      <li><b>Основные типы данных C++?</b> — Целые <code>char, short, int, long</code> (signed/unsigned), вещественные <code>float, double, long double</code>, логический <code>bool</code>, <code>void</code>; составные — массивы, указатели, перечисления <code>enum</code>, структуры и классы.</li>
    </ol>
  </aside>
  <aside class="add"><span class="tag">СРС к теме 1 — что сдать</span>
    <ul>
      <li>Найти примеры языков низкого и высокого уровня, кратко описать — таблица в п. 2.</li>
      <li>Описать правила составления идентификаторов и зачем нужны лексемы — п. 5–6.</li>
      <li>Спецификаторы типов и диапазоны значений с модификаторами — таблица в п. 9.</li>
      <li>Нарисовать блок-схемы следования, ветвления и повторения — п. 4.</li>
      <li>Компиляторы C++: IDE и онлайн — п. 2.</li>
      <li>Примеры идентификаторов, ключевых слов, констант разных типов — п. 6–7.</li>
      <li>Объявление переменных, диапазоны, что будет при переполнении — пример «переполнение» выше.</li>
    </ul>
  </aside>
`;
const LAB1_ORIG=R`
  <div class="lab-task"><span class="tl">Оригинал · цель</span>
    <p><b>Тема:</b> «Структура программы на языке BORLAND C++. Линейный алгоритм. Типы данных: простые типы данных, перечислимый тип, множества, указатели».</p>
    <p><b>Цель работы:</b> знакомство со средой разработки консольных приложений. Написание простых линейных алгоритмов.</p>
  </div>
  <details class="lab-orig"><summary>Порядок выполнения работы (оригинал)</summary><div class="body">
    <p>Первым шагом в написании программы является запуск самой среды программирования C++ Builder (Исходный текст программы приведен для версии 6.0). Затем выберем File → New → Other… Вы попадете в окно выбора типа вашего проекта (Это может быть как приложение под платформы DOS/Windows, либо DLL библиотеки или иные компоненты).</p>
    <p>Все объекты объединены в следующие группы:</p>
    <ul>
      <li><b>New</b> — встроенные базовые объекты, используемые при разработке приложений.</li>
      <li><b>ActiveX</b> — объекты COM и OLE, элементы ActiveX, активные серверные страницы (ASP).</li>
      <li><b>Multiter</b> — объекты многопоточного приложения (CORBA и др.)</li>
      <li><b>Project1</b> — формы создаваемого приложения.</li>
      <li><b>Forms</b> — формы.</li>
      <li><b>Dialogs</b> — диалоговые окна (открытие файла, диалог печати, сохранение и т.д.)</li>
      <li><b>Projects</b> — проекты одно- и многодокументных приложений.</li>
      <li><b>Data Modules</b> — модули данных.</li>
      <li><b>Business</b> — Мастера форм баз данных и Web-приложений.</li>
      <li><b>Web Documents</b> — Web-документы (HTML, XHTML, WML, XSL).</li>
      <li><b>WebSnap</b> — WebSnap-приложения и модули.</li>
      <li><b>WebServices</b> — приложение, модуль и интерфейс для SOAP.</li>
      <li><b>IntraWeb</b> — приложения и формы Web.</li>
      <li><b>Corba</b> — CORBA-приложения.</li>
    </ul>
    <p>Взглянув на рисунок окна, сразу понимаешь, что среда имеет богатейшие возможности выбора для разработки приложений. Итак, для создания консольного приложения необходимо выбрать в открывшемся окне Console Wizard и даблкликнуть на нем.</p>
    <p>В окне все необходимые галочки уже стоят, однако поясню их назначение: Source Type обозначает язык, на котором вы собираетесь создавать приложение. Use VCL/CLX позволяет установить тип библиотеки, которую используем. Жмем Ok и получаем код, автоматически сгенерированный системой:</p>
<pre class="cpp-code">//---------------------------------------------------------------------------

#include &lt;vcl.h&gt;
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        return 0;
}
//---------------------------------------------------------------------------</pre>
    <p>Разберемся, что же автоматически сгенерировала нам среда:</p>
    <p><b>#include &lt;vcl.h&gt;</b> — директива, с помощью которой выполняется включение текстовых файлов (*.h, *.cpp и т.д.) в текст программы.</p>
    <p><b>#pragma hdrstop</b> — указывает компилятору, что в данном месте нужно прекратить генерацию предварительно скомпилированных заголовочных файлов. Расположенные после директивы заголовочные файлы будут компилироваться при каждой компиляции данного модуля, а те что расположены выше — не будут. Перед этой директивой рекомендуется располагать те заголовочные файлы, которые являются общими для двух и более модулей, чтобы избежать их повторной компиляции. Включение данной директивы в коды больших проектов способствует уменьшению времени компиляции.</p>
    <p><b>int main()</b> — функция которая должна присутствовать во всех консольных приложениях.</p>
    <p>Итак, все основные моменты данного кода мы разобрали, теперь перейдем к продолжению написания программы. Нам осталось добавить всего пару строк:</p>
    <p><b>#include &lt;iostream.h&gt;</b> — директива, необходимая для работы команд ввода/вывода на экран.<br><b>cout&lt;&lt;"Hello world!";</b> — собственно сам вывод на экран строки Hello world!</p>
    <p>Ну вот и все! Программа готова. Но: при запуске программы на компиляцию (кнопка F9) вы увидите, что на экране только мигнуло какое-то окно и все, поэтому добавим еще строку <code>Sleep(1000);</code> между cout и return 0; Sleep — задержка выполнения программы, в скобках указано время в миллисекундах.</p>
    <h4>Функции библиотеки math.lib</h4>
    <p>Функции для расчета математических выражений находятся в библиотеке math.lib (подключение библиотеки: <b>#include math.h</b>). Все аргументы в тригонометрических функциях задаются в радианах. Параметры и аргументы всех остальных функций имеют тип <b>double</b> (кроме abs(x)).</p>
    <div class="tw"><table><tr><th>Математическая функция</th><th>Функция библиотеки math.lib</th><th>Описание</th></tr>
      <tr><td>|x|</td><td><b>abs(x)</b></td><td>Вычисление абсолютного значения (<b>только для целых чисел!</b>)</td></tr>
      <tr><td>arccos(x)</td><td><b>acos(x)</b></td><td>Вычисление значения арккосинуса x</td></tr>
      <tr><td>arctg(x)</td><td><b>atan(x)</b></td><td>Вычисление значения арктангенса x</td></tr>
      <tr><td>arctg(x/y)</td><td><b>atan2(x,y)</b></td><td>Вычисление значения арктангенса двух аргументов x и y</td></tr>
      <tr><td>Округление к большему</td><td><b>ceil(x)</b></td><td>Функция возвращает действительное значение, соответствующее наименьшему целому числу, которое больше или равно x</td></tr>
      <tr><td>cos(x)</td><td><b>cos(x)</b></td><td>Вычисление косинуса x</td></tr>
      <tr><td>ch(x) = (e<sup>x</sup>+e<sup>−x</sup>)/2</td><td><b>cosh(x)</b></td><td>Вычисление косинуса гиперболического x</td></tr>
      <tr><td>e<sup>x</sup></td><td><b>exp(x)</b></td><td>Вычисление экспоненты числа x</td></tr>
      <tr><td>|x|</td><td><b>fabs(x)</b></td><td>Вычисление абсолютного значения x</td></tr>
      <tr><td>Округление к меньшему</td><td><b>floor(x)</b></td><td>Функция возвращает действительное значение, соответствующее наибольшему целому числу, которое меньше или равно x</td></tr>
      <tr><td>Остаток от деления x на y</td><td><b>fmod(x,y)</b></td><td>Функция возвращает действительное значение, соответствующее остатку от целочисленного деления x на y</td></tr>
      <tr><td>ln(x)</td><td><b>log(x)</b></td><td>Вычисление натурального логарифма x</td></tr>
      <tr><td>lg<sub>10</sub>(x)</td><td><b>log10(x)</b></td><td>Вычисление десятичного логарифма x</td></tr>
      <tr><td>x<sup>y</sup></td><td><b>pow(x, y)</b></td><td>Возведение x в степень y</td></tr>
      <tr><td>sin(x)</td><td><b>sin(x)</b></td><td>Вычисление синуса x</td></tr>
      <tr><td>sh(x) = (e<sup>x</sup>−e<sup>−x</sup>)/2</td><td><b>sinh(x)</b></td><td>Вычисление синуса гиперболического x</td></tr>
      <tr><td>√x</td><td><b>sqrt(x)</b></td><td>Вычисление квадратного корня x</td></tr>
      <tr><td>tg(x)</td><td><b>tan(x)</b></td><td>Вычисление тангенса x</td></tr>
      <tr><td>tgh(x)</td><td><b>tanh(x)</b></td><td>Вычисление тангенса гиперболического x</td></tr></table></div>
    <p>Для запуска программы нажмите клавишу <b>F9</b>. Для сохранения сочетание клавиш <b>Shift+Ctrl+S</b>.</p>
  </div></details>
  <aside class="add"><span class="tag">дополнение · как переводить формулу в C++</span>
    <div class="tw"><table><tr><th>В математике</th><th>В C++</th><th>Ловушка</th></tr>
      <tr><td>x², x³, xʸ</td><td><code>x*x</code>, <code>pow(x,3)</code>, <code>pow(x,y)</code></td><td><code>^</code> — это НЕ степень (это «исключающее или»)</td></tr>
      <tr><td>√x</td><td><code>sqrt(x)</code></td><td></td></tr>
      <tr><td>∛x, ⁴√x</td><td><code>pow(x, 1/3.)</code>, <code>pow(x, 0.25)</code></td><td><code>1/3</code> — целое деление, даёт <b>0</b>! Нужна точка: <code>1/3.</code> или <code>1.0/3</code></td></tr>
      <tr><td>|x|</td><td><code>fabs(x)</code></td><td><code>abs()</code> — только для целых: <code>abs(-2.7)</code> даст 2</td></tr>
      <tr><td>sin²y</td><td><code>pow(sin(y),2)</code></td><td></td></tr>
      <tr><td>tg z, arctg z</td><td><code>tan(z)</code>, <code>atan(z)</code></td><td>углы — в радианах</td></tr>
      <tr><td>ln z, lg z</td><td><code>log(z)</code>, <code>log10(z)</code></td><td><code>log</code> — натуральный, не десятичный</td></tr>
      <tr><td>eˣ</td><td><code>exp(x)</code></td><td></td></tr>
      <tr><td>2/3, 1/2</td><td><code>2.0/3</code>, <code>0.5</code></td><td><code>2/3</code> = 0, <code>1/2</code> = 0</td></tr>
      <tr><td>дробь <span class="fr"><span>a + b</span><span>c + d</span></span></td><td><code>(a + b)/(c + d)</code></td><td>без скобок <code>a + b/c + d</code> — совсем другое</td></tr>
      <tr><td>3,5·10⁻²</td><td>в программе <code>3.5e-2</code>, при вводе тоже <code>3.5e-2</code></td><td>дробная часть через точку, не запятую</td></tr></table></div>
    <p><b>Совет из примера лабы:</b> длинную формулу разбей на части — <code>a</code> (числитель), <code>b</code> (знаменатель), <code>c</code> (остальное), — а потом собери <code>h = a/b + c</code>. Так легче найти ошибку: можно вывести каждую часть отдельно.</p>
  </aside>

`;
const LAB1_EX=R`<div class="read">
  <div class="lab-task ex"><span class="tl">Пример из лабы</span>
    <p><b>Условие:</b> написать программу для вычисления линейного арифметического выражения</p>
    <p class="fx">h = <span class="fr"><span>x<sup>2y</sup> + e<sup>y−1</sup></span><span>1 + x|y − tg z|</span></span> + 10·<span class="rt"><sup>3</sup>√<span class="ov">x</span></span> − ln(z)</p>
    <p>При x = 2.45, y = −0.423×10⁻², z = 1.232×10³ ответ h = 6.9465.</p>
    <p>Текст программы:</p>
<pre class="cpp-code">#include &lt;iostream.h&gt;
#include &lt;conio.h&gt;
int main ()
{
double x,y,z,a,b,c,h;
cout &lt;&lt; "Vvedite x: ";
cin &gt;&gt; x;
cout &lt;&lt; "Vvedite y: ";
cin &gt;&gt; y;
cout &lt;&lt; "Vvedite z: ";
cin &gt;&gt; z;
a = pow(x,2*y)+exp(y-1);
b = 1+x*fabs(y-tan(z));
c = 10*pow(x,1/3.)-log(z);
h = a/b+c;
cout &lt;&lt; "Result h= " &lt;&lt; h &lt;&lt; endl;
getch()
return 0;
}</pre>
  </div>
  <aside class="fix"><span class="tag">поправка</span> В тексте программы из лабы две ошибки — в C++Builder 6 она <b>не скомпилируется</b>. 1) Нет <code>#include &lt;math.h&gt;</code>, а без него <code>pow</code>, <code>exp</code>, <code>fabs</code>, <code>tan</code>, <code>log</code> неизвестны: «E2268 Call to undefined function 'pow'» (проверено на bcc32 из Builder 6). 2) После <code>getch()</code> пропущена точка с запятой. Нажми «▶ Запустить» ниже — увидишь первую ошибку. Исправь обе и добейся h = 6.9465.</aside>
</div>
<div class="cppw" data-id="c1-l1-ex" data-cmp="approx" data-title="Пример из лабы: исправь и запусти">
<script type="text/x-cpp" data-role="ref">
#include <iostream.h>
#include <conio.h>
#include <math.h>
int main ()
{
double x,y,z,a,b,c,h;
cout << "Vvedite x: ";
cin >> x;
cout << "Vvedite y: ";
cin >> y;
cout << "Vvedite z: ";
cin >> z;
a = pow(x,2*y)+exp(y-1);
b = 1+x*fabs(y-tan(z));
c = 10*pow(x,1/3.)-log(z);
h = a/b+c;
cout << "Result h= " << h << endl;
getch();
return 0;
}
</script>
<script type="text/x-cpp" data-role="start">
#include <iostream.h>
#include <conio.h>
int main ()
{
double x,y,z,a,b,c,h;
cout << "Vvedite x: ";
cin >> x;
cout << "Vvedite y: ";
cin >> y;
cout << "Vvedite z: ";
cin >> z;
a = pow(x,2*y)+exp(y-1);
b = 1+x*fabs(y-tan(z));
c = 10*pow(x,1/3.)-log(z);
h = a/b+c;
cout << "Result h= " << h << endl;
getch()
return 0;
}
</script>
<script type="text/plain" data-role="in" data-name="Данные из лабы">2.45
-0.423e-2
1.232e3</script>
</div>
<div class="read">
  <details class="sol"><summary>Разбор примера по шагам</summary><div class="solve">
    <ol>
      <li><b>Подключаем библиотеки:</b> <code>iostream.h</code> (cout, cin), <code>conio.h</code> (getch), <code>math.h</code> (pow, exp, fabs, tan, log).</li>
      <li><b>Объявляем переменные</b> <code>double</code> — числа дробные: x, y, z (данные), a, b, c (части формулы), h (ответ).</li>
      <li><b>Вводим данные:</b> перед каждым <code>cin</code> — подсказка <code>cout</code>, чтобы пользователь знал, что вводить. y = −0.423×10⁻² вводим как <code>-0.423e-2</code>.</li>
      <li><b>Делим формулу на части.</b> Числитель дроби x<sup>2y</sup> + e<sup>y−1</sup> → <code>a = pow(x,2*y)+exp(y-1);</code>. Знаменатель 1 + x|y − tg z| → <code>b = 1+x*fabs(y-tan(z));</code>. Хвост 10·∛x − ln z → <code>c = 10*pow(x,1/3.)-log(z);</code></li>
      <li><b>Собираем:</b> <code>h = a/b+c;</code> — деление выполнится раньше сложения, скобки не нужны.</li>
      <li><b>Выводим</b> и ждём клавишу <code>getch();</code>, иначе окно консоли в Builder закроется сразу.</li>
    </ol>
    <div class="trap"><b>Частая ошибка:</b> <code>pow(x,1/3)</code> вместо <code>pow(x,1/3.)</code>. 1/3 — целое деление = 0, и ∛x превратится в x⁰ = 1. Ответ получится 22.3…, а не 6.9465.</div>
    <p>Ответ: <span class="answer">Result h= 6.9465</span></p>
  </div></details>
  <details class="sol"><summary>Эталонный код</summary><div class="solve ref" data-ref-for="c1-l1-ex"></div></details>

  <h3 id="c1-var">Контрольные задания: 15 вариантов</h3>
  <div class="lab-task"><span class="tl">Оригинал · задание</span><p>Вычислить значение выражения при заданных исходных данных. Сравнить полученное значение с указанным правильным результатом.</p></div>
  <aside class="add"><span class="tag">как проверяется</span> Делай свой вариант. Окно сравнивает <b>числа</b> твоего вывода с эталоном (с точностью до 5 знаков), поэтому подсказки можешь писать своими словами. Порядок ввода — x, затем y, затем z. Данные варианта уже вписаны в поле «Ввод».</aside>
</div>
`;
const DOP=[
 {id:'c1-d1',name:'Задание 1',cmp:'approx',text:R`<p>Рассчитать S по формуле:</p><p class="fx">S = <span class="rt">√<span class="ov">t<sup>2</sup> + 1</span></span>, где t = ln(x<sup>2</sup> + y<sup>2</sup>) + cos<sup>2</sup>(y<sup>3</sup>)</p><p>Ответ: x=7, y=9, S=5.9299788E+00</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, t, S;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  t = log(x*x + y*y) + pow(cos(pow(y,3)), 2);
  S = sqrt(t*t + 1);
  cout << "S = " << S << endl;
  getch();
  return 0;
}`, ins:[['x=7, y=9','7\n9']],
  steps:R`<p>Сначала считаем вспомогательную t, потом S — порядок важен: S использует t.</p><ol><li><code>t = log(x*x + y*y) + pow(cos(pow(y,3)), 2);</code> — cos²(y³) = (cos(y³))²;</li><li><code>S = sqrt(t*t + 1);</code></li></ol><p><code>cout</code> печатает 6 значащих цифр: <span class="answer">S = 5.92998</span> — это то же число, что 5.9299788E+00.</p>`},
 {id:'c1-d2',name:'Задание 2',cmp:'approx',text:R`<p>Рассчитать t по формуле:</p><p class="fx">t = ln(u<sup>2</sup> + v<sup>2</sup>), где u = x + 5cos(2y), v = <span class="fr"><span>e<sup>x</sup> + 2y + 3</span><span>3x + <span class="rt">√<span class="ov">x<sup>2</sup> + y<sup>2</sup></span></span></span></span></p><p>Ответ: x=4, y=5, t=2.60494496E+00</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, u, v, t;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  u = x + 5*cos(2*y);
  v = (exp(x) + 2*y + 3)/(3*x + sqrt(x*x + y*y));
  t = log(u*u + v*v);
  cout << "t = " << t << endl;
  getch();
  return 0;
}`, ins:[['x=4, y=5','4\n5']],
  steps:R`<ol><li><code>u = x + 5*cos(2*y);</code> — знак * между 5 и cos обязателен;</li><li><code>v = (exp(x) + 2*y + 3)/(3*x + sqrt(x*x + y*y));</code> — числитель и знаменатель в скобках;</li><li><code>t = log(u*u + v*v);</code></li></ol><p>Ответ: <span class="answer">t = 2.60494</span></p>`},
 {id:'c1-d3',name:'Задание 3',cmp:'approx',text:R`<p>Рассчитать U по формуле:</p><p class="fx">U = V<sup>2</sup> + W, где W = <span class="rt">√<span class="ov">e<sup>x</sup></span></span> + 2y + 3tg x, V = <span class="fr"><span>3x + (ln(2y))<sup>2</sup> + 3</span><span>e<sup>x/2</sup> + cos(y<sup>2</sup>)</span></span></p><p>Ответ: x=5, y=3, U=1.1582103E+01</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double x, y, W, V, U;
  cout << "Vvedite x: ";
  cin >> x;
  cout << "Vvedite y: ";
  cin >> y;
  W = sqrt(exp(x)) + 2*y + 3*tan(x);
  V = (3*x + pow(log(2*y),2) + 3)/(exp(x/2) + cos(y*y));
  U = V*V + W;
  cout << "U = " << U << endl;
  getch();
  return 0;
}`, ins:[['x=5, y=3','5\n3']],
  steps:R`<ol><li><code>W = sqrt(exp(x)) + 2*y + 3*tan(x);</code></li><li><code>V = (3*x + pow(log(2*y),2) + 3)/(exp(x/2) + cos(y*y));</code> — <code>x/2</code> дробное, потому что x объявлен double;</li><li><code>U = V*V + W;</code></li></ol><div class="trap"><b>Ловушка:</b> если объявить <code>int x, y;</code>, то <code>x/2</code> станет целым делением: 5/2 = 2. Для формул всегда <code>double</code>.</div><p>Ответ: <span class="answer">U = 11.5821</span></p>`},
 {id:'c1-d4',name:'Задание 4',cmp:'nums',wtitle:'Задание 4: минуты → часы и минуты',text:R`<p>Написать программу пересчёта величины временного интервала, заданного в минутах, в величину, выраженную в часах и минутах. При работе программы, экран должен выглядеть, как показано ниже:</p><pre>Введите величину временного интервала (в минутах)
и нажмите  &lt;Enter&gt;
- &gt;  150
150 минут – это 2 ч. 30 мин.</pre>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int m;
  cout << "Введите величину временного интервала (в минутах)" << endl;
  cout << "и нажмите  <Enter>" << endl;
  cout << "- >  ";
  cin >> m;
  cout << m << " минут – это " << m/60 << " ч. " << m%60 << " мин." << endl;
  getch();
  return 0;
}`, ins:[['150','150'],['59','59'],['600','600']],
  steps:R`<p>Минуты целые — <code>int m;</code>. Всё решают две операции:</p><ul><li><code>m/60</code> — целое деление: полные часы. 150/60 = 2.</li><li><code>m%60</code> — остаток: оставшиеся минуты. 150%60 = 30.</li></ul><p>Ответ: <span class="answer">150 минут – это 2 ч. 30 мин.</span></p>`},
 {id:'c1-d4b',name:'Задание 4 (продолжение)',cmp:'nums',wtitle:'Задание 4б: секунды → дни, часы, минуты, секунды',text:R`<p>Преобразуйте программу, чтобы она по введённому количеству секунд, вычисляла количество дней, часов, минут и секунд. Экран должен выглядеть так:</p><pre>Введите величину временного интервала (в секундах)
и нажмите  &lt;Enter&gt;
- &gt;  458745
458745 секунд – это 5 д.  7 ч. 25 мин. 45 сек.</pre>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int s, d, h, m, sec;
  cout << "Введите величину временного интервала (в секундах)" << endl;
  cout << "и нажмите  <Enter>" << endl;
  cout << "- >  ";
  cin >> s;
  d = s / 86400;            // 86400 секунд в сутках
  h = s % 86400 / 3600;     // 3600 секунд в часе
  m = s % 3600 / 60;
  sec = s % 60;
  cout << s << " секунд – это " << d << " д.  " << h << " ч. " << m << " мин. " << sec << " сек." << endl;
  getch();
  return 0;
}`, ins:[['458745','458745'],['3661','3661'],['86399','86399']],
  steps:R`<ol><li>Дни: <code>s / 86400</code> — 458745 / 86400 = 5.</li><li>Часы: остаток суток <code>s % 86400</code> = 26745, делим на 3600 → 7.</li><li>Минуты: <code>s % 3600</code> = 1545, делим на 60 → 25.</li><li>Секунды: <code>s % 60</code> = 45.</li></ol><p><code>%</code> и <code>/</code> одного приоритета и выполняются слева направо: <code>s % 86400 / 3600</code> = (s % 86400) / 3600.</p><p>Ответ: <span class="answer">458745 секунд – это 5 д.  7 ч. 25 мин. 45 сек.</span></p>`},
 {id:'c1-d5',name:'Задание 5',cmp:'nums',wtitle:'Задание 5: денежный формат',text:R`<p>Написать программу, которая преобразует введённое с клавиатуры дробное число в денежный формат. Экран при работе программы должен выглядеть следующим образом:</p><pre>Преобразование числа в денежный формат.
Введите дробное число - &gt;  23.6
23.6 руб. – это 23 руб. 60 коп.</pre>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  double x;
  int rub, kop;
  cout << "Преобразование числа в денежный формат." << endl;
  cout << "Введите дробное число - >  ";
  cin >> x;
  rub = (int)x;                       // целая часть — рубли
  kop = (int)((x - rub)*100 + 0.5);   // дробная часть * 100, с округлением
  cout << x << " руб. – это " << rub << " руб. " << kop << " коп." << endl;
  getch();
  return 0;
}`, ins:[['23.6','23.6'],['5.29','5.29'],['100.05','100.05']],
  steps:R`<ol><li><code>(int)x</code> — приведение типа: отбрасывает дробную часть, 23.6 → 23 рубля.</li><li><code>x - rub</code> = 0.6 — копейки в долях рубля, × 100 → 60.</li><li><code>+ 0.5</code> перед (int) — округление.</li></ol><div class="trap"><b>Зачем +0.5:</b> 5.29 − 5 = 0.28999999…, × 100 = 28.999999…, и без округления (int) даст <b>28</b>. Убери <code>+ 0.5</code> и запусти тест «5.29».</div><p>Ответ: <span class="answer">23.6 руб. – это 23 руб. 60 коп.</span></p>`},
];
CPP.topic('c1',{n:1,
 title:'Алгоритм. Графическое представление алгоритмов. Синтаксис языка C++. Типы данных',
 intro:R`<aside class="fix"><span class="tag">как работать</span> Сразу ниже — задания лабы. Под каждым окно: пишешь код, жмёшь <b>▶ Запустить</b> (или F9, как в Builder) и видишь рядом «Должно быть» и «Твой вывод». Программа выполняется прямо в браузере и ведёт себя как в C++Builder 6. Сначала показаны главные задания, остальные — кнопкой «Показать ещё задание». Теория свёрнута в «Лекцию».</aside>`,
 lecSub:'Всё по УМКД: алгоритмы и блок-схемы, алфавит и лексемы C++, структура программы, типы данных.',
 lecture:LECTURE,
 labs:[{id:'c1-lab',short:'Лаба 1',title:'Лабораторная работа №1. Структура программы на языке BORLAND C++. Линейный алгоритм. Типы данных',orig:LAB1_ORIG,html:LAB1_EX,show:3,tasks:CPP.LAB1_VARIANTS}],
 dop:[{id:'c1-dop',short:'Доп. лаба',title:'Доп. лаба (может быть у нас). Линейный алгоритм',show:2,
   note:R`<aside class="fix"><span class="tag">о материалах</span> Лаба из папки «ЛАБЫ ДОП…» (взята у студентов). Ответы в ней посчитаны с меньшей точностью — последняя цифра может отличаться на 1 (5.9299789 вместо 5.9299788). Окно сравнивает числа с допуском — это засчитается.</aside>`,tasks:DOP}],
 qa:QA,
 foot:'Источники: УМКД «Programming I» (Irina Zhak, 2026), лабораторная работа №1, доп. лаба «Линейный алгоритм», база 190 вопросов. Все эталонные программы проверены компилятором bcc32 из C++Builder 6.'
});
})();
