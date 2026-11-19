/* C++ · Тема 2. Операции и выражения. Библиотеки. Память и указатели */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> Оригинал — план лекции 2 из УМКД (переведён) и слайды «Лекция 6. Указатели в C++» от преподавателя (на английском, ниже — перевод почти дословно). Остальное — мои дополнения.</aside>
  <h2 id="c2-lec">Лекция 2. Операции: арифметические, сравнения, присваивания, логические, побитовые, запятая, ?:, sizeof, ::, доступ «.» и «-&gt;»</h2>
  <p><b>Цель:</b> познакомить с основными операциями C++ и научить использовать их в выражениях и программах.</p>
  <p><b>Основные пункты лекции:</b></p>
  <ul><li>Понятие операции, операнда и выражения.</li><li>Арифметические операции: +, -, *, /, %.</li><li>Операции равенства и сравнения.</li><li>Присваивание и составное присваивание.</li><li>Логические операции: &amp;&amp;, ||, !.</li><li>Побитовые логические операции.</li><li>Операция «запятая».</li><li>Условная операция ?:.</li><li>Операция sizeof.</li><li>Операция разрешения области видимости ::.</li><li>Операции доступа к элементам класса и объекта: . и -&gt;.</li><li>Приоритет и ассоциативность операций.</li><li>Преобразование типов в операциях.</li><li>Операции в сложных выражениях.</li></ul>

  <h3>1. Выражение, операция, операнд</h3>
  <aside class="add"><span class="tag">дополнение · выражение</span>
    <p><b>Выражение</b> — запись из <b>операндов</b> (переменных, констант, вызовов функций), <b>знаков операций</b> и скобок, которая вычисляется в значение определённого типа. В <code>s = a + 15</code>: операнды a, 15, s; операции + и =.</p>
    <p>Операции бывают <b>унарные</b> (один операнд: <code>-x</code>, <code>!a</code>, <code>++i</code>), <b>бинарные</b> (два: <code>a + b</code>) и одна <b>тернарная</b> (три: <code>a ? b : c</code>).</p>
  </aside>
  <h3>2. Арифметика</h3>
  <aside class="add"><span class="tag">дополнение · арифметические операции</span>
    <div class="tw"><table><tr><th>Операция</th><th>Смысл</th><th>Пример</th><th>Результат</th></tr>
      <tr><td><code>+ - *</code></td><td>сложение, вычитание, умножение</td><td><code>7*2</code></td><td>14</td></tr>
      <tr><td><code>/</code></td><td>деление. <b>Целое / целое = целое</b> (дробь отбрасывается)</td><td><code>7/2</code>, <code>7/2.0</code></td><td>3 и 3.5</td></tr>
      <tr><td><code>%</code></td><td>остаток от деления, <b>только для целых</b></td><td><code>7%2</code>, <code>-7%3</code></td><td>1 и −1</td></tr>
      <tr><td><code>++</code></td><td>инкремент: +1</td><td><code>i++</code>, <code>++i</code></td><td></td></tr>
      <tr><td><code>--</code></td><td>декремент: −1</td><td><code>i--</code>, <code>--i</code></td><td></td></tr></table></div>
    <p><b>Префикс и постфикс.</b> <code>++i</code> — сначала увеличить, потом использовать значение. <code>i++</code> — сначала использовать старое значение, потом увеличить. <code>int i=10; cout&lt;&lt;i++;</code> напечатает 10 (i стало 11), а затем <code>cout&lt;&lt;++i;</code> напечатает 12. Инкремент применяют только к переменным, не к константам и выражениям.</p>
    <p>Целую часть от деления (как div в Pascal) даёт <code>/</code> для целых, остаток (mod) — <code>%</code>. Для дробных остаток — функция <code>fmod(x,y)</code>.</p>
  </aside>
  <h3>3. Сравнение и логика</h3>
  <aside class="add"><span class="tag">дополнение · сравнение, логика, истина</span>
    <p>Сравнения: <code>==</code> (равно), <code>!=</code> (не равно), <code>&lt; &gt; &lt;= &gt;=</code>. Результат — <b>true (1)</b> или <b>false (0)</b>. Знак <code>=</code> — это присваивание, а не сравнение: <code>if (x = 5)</code> присвоит 5 и всегда будет истиной.</p>
    <p>Логические: <code>&amp;&amp;</code> — «И» (логическое умножение), <code>||</code> — «ИЛИ» (логическая сумма), <code>!</code> — «НЕ» (отрицание). В C++ <b>0 — ложь, любое не 0 — истина</b>; true = 1, false = 0.</p>
    <div class="tw"><table><tr><th>a</th><th>b</th><th>a &amp;&amp; b</th><th>a || b</th><th>!a</th></tr>
      <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
      <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr></table></div>
    <p><b>Сокращённое вычисление:</b> в <code>a &amp;&amp; b</code> b не вычисляется, если a ложно; в <code>a || b</code> — если a истинно.</p>
    <p>Двойное неравенство 0 &lt; x &lt; 10 пишут так: <code>x &gt; 0 &amp;&amp; x &lt; 10</code>. Запись <code>0 &lt; x &lt; 10</code> компилируется, но означает <code>(0 &lt; x) &lt; 10</code> — всегда истина.</p>
  </aside>
  <h3>4. Присваивание в стиле C</h3>
  <aside class="add"><span class="tag">дополнение · присваивание</span>
    <div class="tw"><table><tr><th>Запись</th><th>Равносильно</th></tr>
      <tr><td><code>s += x</code></td><td><code>s = s + x</code></td></tr><tr><td><code>s -= x</code></td><td><code>s = s - x</code></td></tr>
      <tr><td><code>s *= x</code></td><td><code>s = s * x</code> — «умножить и присвоить»</td></tr><tr><td><code>s /= x</code></td><td><code>s = s / x</code></td></tr>
      <tr><td><code>n %= 3</code></td><td><code>n = n % 3</code></td></tr><tr><td><code>a &amp;= b, a |= b, a ^= b, a &lt;&lt;= 1, a &gt;&gt;= 1</code></td><td>побитовые</td></tr></table></div>
    <p>Справа сначала вычисляется всё выражение: <code>x=2; x *= (x+1);</code> → x = 2·3 = 6. Присваивание само имеет значение, поэтому можно <code>a = b = c = 0;</code> (справа налево).</p>
  </aside>
  <h3>5. Побитовые операции, запятая, ?:, sizeof, ::, . и -&gt;</h3>
  <aside class="add"><span class="tag">дополнение · остальные операции</span>
    <ul>
      <li><b>Побитовые</b> (над каждым битом целого): <code>&amp;</code> И, <code>|</code> ИЛИ, <code>^</code> исключающее ИЛИ, <code>~</code> инверсия, <code>&lt;&lt;</code> сдвиг влево (×2), <code>&gt;&gt;</code> вправо (÷2). 5 &amp; 3 = 0101 &amp; 0011 = 0001 = 1; 5 | 3 = 7; 5 ^ 3 = 6; 1 &lt;&lt; 4 = 16.</li>
      <li><b>Запятая</b>: вычисляет выражения слева направо, значение — последнее. <code>for (i=0, j=10; i&lt;j; i++, j--)</code>.</li>
      <li><b>Условная (тернарная) операция</b> <code>условие ? выражение1 : выражение2</code> — простейшее «если». <code>max = a &gt; b ? a : b;</code> Вложенная: <code>s = x&gt;0 ? 1 : (x&lt;0 ? -1 : 0);</code></li>
      <li><b>sizeof</b> — размер в байтах: <code>sizeof(int)</code> = 4, <code>sizeof(x)</code>, для массива — весь размер. Запись: <code>sizeof (type)</code>.</li>
      <li><b>::</b> — разрешение области видимости: <code>::g</code> — глобальная g, когда есть локальная с тем же именем; <code>Book::show</code> — метод класса.</li>
      <li><b>.</b> и <b>-&gt;</b> — доступ к полю/методу объекта: <code>obj.name</code> для объекта, <code>p-&gt;name</code> для указателя на объект (= <code>(*p).name</code>).</li>
    </ul>
  </aside>
  <h3>6. Приоритет и преобразование типов</h3>
  <aside class="add"><span class="tag">дополнение · приоритет (сверху — выше)</span>
    <div class="tw"><table><tr><th>Операции</th><th>Порядок</th></tr>
      <tr><td><code>::</code></td><td></td></tr>
      <tr><td><code>()  []  .  -&gt;  x++  x--</code></td><td>слева направо</td></tr>
      <tr><td><code>++x --x  !  ~  -x  +x  *p  &amp;x  (тип)  sizeof  new delete</code></td><td>справа налево</td></tr>
      <tr><td><code>*  /  %</code></td><td>слева направо</td></tr><tr><td><code>+  -</code></td><td>слева направо</td></tr>
      <tr><td><code>&lt;&lt;  &gt;&gt;</code></td><td></td></tr><tr><td><code>&lt;  &lt;=  &gt;  &gt;=</code></td><td></td></tr><tr><td><code>==  !=</code></td><td></td></tr>
      <tr><td><code>&amp;</code>, затем <code>^</code>, затем <code>|</code></td><td></td></tr><tr><td><code>&amp;&amp;</code>, затем <code>||</code></td><td></td></tr>
      <tr><td><code>?:</code></td><td>справа налево</td></tr><tr><td><code>=  +=  -=  *= …</code></td><td>справа налево</td></tr><tr><td><code>,</code></td><td>слева направо</td></tr></table></div>
    <p><b>Преобразование типов в выражениях.</b> Если операнды разных типов, «меньший» тип превращается в «больший»: char, short → int; int → long → float → double. float + double = double, long + float = float, short + int = int. Поэтому <code>7/2.0</code> = 3.5. Явное приведение: <code>(double)a/b</code>, <code>(int)3.99</code> = 3 (дробь отбрасывается, не округляется).</p>
  </aside>
  <h3>7. Дополнительные библиотеки</h3>
  <aside class="add"><span class="tag">дополнение · что в каком заголовке (Borland C++Builder 6)</span>
    <p><b>Директива препроцессора</b> — команда, которая выполняется до компиляции и начинается с <code>#</code>. <code>#include &lt;файл&gt;</code> вставляет заголовочный файл (.h) с прототипами функций; сами функции лежат в библиотечных файлах (.lib) и подключаются компоновщиком.</p>
    <div class="tw"><table><tr><th>Заголовок</th><th>Что даёт</th></tr>
      <tr><td><code>iostream.h</code></td><td><code>cout &lt;&lt;</code> вывод, <code>cin &gt;&gt;</code> ввод, <code>endl</code></td></tr>
      <tr><td><code>iomanip.h</code></td><td><code>setw(n)</code> ширина, <code>setprecision(n)</code> точность, <code>setiosflags(ios::fixed)</code></td></tr>
      <tr><td><code>stdio.h</code></td><td><code>printf, scanf, puts, gets, getchar, sprintf</code>; файлы <code>fopen, fclose, fprintf, fscanf, fgets, fputs</code></td></tr>
      <tr><td><code>conio.h</code></td><td><code>getch()</code> — ждать клавишу (без показа), <code>clrscr()</code> — очистить экран, <code>textcolor, cprintf, gotoxy</code></td></tr>
      <tr><td><code>math.h</code></td><td><code>sqrt, pow, sin, cos, tan, asin, acos, atan, exp, log, log10, fabs, ceil, floor, fmod</code>, константа <code>M_PI</code></td></tr>
      <tr><td><code>stdlib.h</code></td><td><code>rand(), srand, random(n), randomize(), abs, atoi, atof, itoa, exit</code></td></tr>
      <tr><td><code>string.h</code></td><td>строковые функции <code>strlen, strcpy, strcat, strcmp…</code> (тема 6)</td></tr>
      <tr><td><code>ctype.h</code></td><td><code>isdigit, isalpha, toupper, tolower</code></td></tr>
      <tr><td><code>time.h</code></td><td><code>time(NULL)</code></td></tr></table></div>
    <p><b>Случайные числа в Borland:</b> <code>random(n)</code> даёт целое от 0 до n−1. Диапазон [a; b] — <code>random(b-a+1)+a</code>; например [−20; 50] — <code>random(70)-20</code> (так в базе тестов; строго нужно random(71)−20). <code>randomize();</code> запускает генератор от часов, чтобы при каждом запуске числа были разные.</p>
    <p><b>Форматы printf:</b> <code>%d</code> целое, <code>%f</code> вещественное, <code>%e</code> экспоненциальная форма, <code>%c</code> символ, <code>%s</code> строка, <code>%u</code> беззнаковое, <code>%o</code> восьмеричное, <code>%x</code> шестнадцатеричное. <code>%.2f</code> — 2 знака после точки, <code>%5d</code> — ширина 5. Для scanf перед переменной ставят <code>&amp;</code>: <code>scanf("%d", &amp;x);</code></p>
    <p><b>Округление:</b> <code>ceil(3.226)</code> = 4 (вверх), <code>floor(3.63)</code> = 3 (вниз). <b>Модуль:</b> <code>abs</code> — для целых, <code>fabs</code> — для дробных.</p>
  </aside>
</div>
<div class="read">
  <h2 id="c2-mem">Работа с памятью. Указатели (лекция 6 преподавателя)</h2>
  <details class="lab-orig"><summary>Оригинал слайдов (English)</summary><div class="body">
    <p><b>6.1 Subject: Pointers in C++.</b> The purpose of a lesson is to learn the basic principles of using pointers in C++.</p>
    <p>Every variable is a memory location and every memory location has its address defined. A <b>pointer</b> is a variable whose value is the address of another variable. Like any variable or constant, a pointer must be declared before using it in a program. The general form of a pointer variable declaration: <code>type *var-name;</code> Where, <b>type</b> is the pointer's base type (the type of a value that is stored in a cell); <b>var-name</b> is the name of the pointer variable.</p>
    <p>Some valid pointer declarations: <code>int *ip; double *dp; float *fp; char *ch;</code> The actual data type of the value of all pointers (whether integer, float, character, or otherwise) is the same, a long hexadecimal number that represents a memory address. The only difference between pointers of different data types is the data type of the variable or constant that the pointer points to.</p>
    <p><b>Pointers: reference operator (&amp;).</b> To know where the data is stored, C++ has an &amp; operator. The &amp; (reference) operator gives you the address occupied by a variable. If a1 is a variable then, &amp;a1 gives the address of that variable in a memory.</p>
    <p><b>Pointers: dereference operator (*).</b> To get the value stored in the memory address, we use the dereference operator (* - asterisk).</p>
    <p><b>Pointers and arrays.</b> Let's see the example: <code>int A[4]; int *ptr;</code> Suppose, we need to hold the address of third element of an array, i.e. we need the pointer ptr to point to third array's element.</p>
    <p><b>Solve the problems:</b> Define the array of 10 integers. Create 2 pointers and set the address of first arrays element into first pointer, the last arrays element into second pointer. Define the array of 100 real numbers. Output the addresses of all arrays elements.</p>
  </div></details>
  <p>Каждая переменная — это участок памяти, и у каждого участка есть адрес. <b>Указатель</b> — переменная, значение которой — адрес другой переменной. Как любую переменную, указатель нужно объявить до использования: <code>тип *имя;</code>, где тип — базовый тип указателя (тип значения в ячейке), имя — имя указателя.</p>
  <p>Правильные объявления: <code>int *ip; double *dp; float *fp; char *ch;</code> Сам адрес у всех указателей одинаковый по виду — длинное шестнадцатеричное число. Разница только в типе того, на что указатель указывает.</p>
  <p><b>Операция взятия адреса &amp;</b> показывает, где лежит переменная: если a1 — переменная, то &amp;a1 — её адрес в памяти. <b>Операция разыменования *</b> даёт значение, которое лежит по адресу.</p>
<pre class="cpp-code">int *pc, c;
c = 5;
pc = &amp;c;
cout &lt;&lt; "Address that pointer pc holds: " &lt;&lt; pc &lt;&lt; endl;
cout &lt;&lt; "Content of the address pointer pc holds: " &lt;&lt; *pc &lt;&lt; endl;</pre>
  <aside class="add"><span class="tag">дополнение · указатели простыми словами</span>
    <ul>
      <li>Память — длинная улица из байтов, у каждого номер (адрес). <code>int x</code> занимает 4 байта, и <code>&amp;x</code> — номер первого.</li>
      <li><code>int *p = &amp;x;</code> — p хранит адрес x. <code>*p = 10;</code> — записать 10 туда, куда смотрит p, то есть в x.</li>
      <li><b>Через указатель можно менять переменную</b>, не называя её по имени — так функции меняют чужие переменные (тема 5).</li>
      <li><b>Указатели и массивы.</b> Имя массива — адрес его первого элемента: <code>int *p = A;</code> — то же, что <code>&amp;A[0]</code>. <code>p+2</code> — адрес A[2] (сдвиг на 2 элемента, а не на 2 байта), <code>*(p+2)</code> = <code>A[2]</code> = <code>p[2]</code>.</li>
      <li>Адрес третьего элемента: <code>ptr = &amp;A[2];</code> (нумерация с 0!).</li>
      <li><code>NULL</code> (0) — «указатель никуда». Разыменовывать его нельзя — программа упадёт (Access violation).</li>
      <li>В Borland <code>cout &lt;&lt; p</code> печатает адрес <b>десятичным числом</b>, например 1769276, а <code>printf("%p", p)</code> — шестнадцатеричным 001AFF3C. Адреса при каждом запуске могут быть другими.</li>
      <li><b>Динамическая память:</b> <code>int *a = new int[n];</code> — массив нужного размера во время работы; освобождать <code>delete[] a;</code></li>
    </ul>
  </aside>
</div>`;

const H=(s)=>s; // для читаемости
const LAB=[
 {id:'c2-z1',name:'Задание 1',cmp:'exact',text:R`<p>Дано трёхзначное целое число. Используя операции <code>/</code> и <code>%</code>, вывести его цифры, сумму цифр и число, записанное наоборот. Экран:</p><pre>Введите трёхзначное число: 375
Цифры: 3 7 5
Сумма цифр = 15
Наоборот: 573</pre>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int n, a, b, c;
  cout << "Введите трёхзначное число: ";
  cin >> n;
  a = n / 100;          // сотни
  b = n / 10 % 10;      // десятки
  c = n % 10;           // единицы
  cout << "Цифры: " << a << " " << b << " " << c << endl;
  cout << "Сумма цифр = " << a + b + c << endl;
  cout << "Наоборот: " << c * 100 + b * 10 + a << endl;
  getch();
  return 0;
}`, ins:[['375','375'],['908','908'],['100','100']],
  steps:R`<ol><li>Сотни — целое деление на 100: 375/100 = 3.</li><li>Десятки — сначала убрать единицы (/10 → 37), потом остаток от 10: 37%10 = 7. Записывается одной строкой <code>n / 10 % 10</code> (слева направо).</li><li>Единицы — остаток от деления на 10: 375%10 = 5.</li><li>Наоборот: c·100 + b·10 + a = 573.</li></ol><div class="trap"><b>Ловушка:</b> для 100 «наоборот» получится 1, а не 001 — это правильно: ведущие нули у числа не печатаются.</div>`},
 {id:'c2-z2',name:'Задание 2',cmp:'exact',text:R`<p>Даны вещественные x и y. Вычислить и вывести значения логических выражений (1 — истина, 0 — ложь): 1) x принадлежит отрезку [−5; 5]; 2) x и y одного знака; 3) точка (x, y) лежит в круге радиуса 2 с центром в начале координат; 4) x не равно y.</p><pre>x = 3
y = -1
x в [-5;5]: 1
одного знака: 0
в круге: 0
x != y: 1</pre>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  double x, y;
  cout << "x = ";
  cin >> x;
  cout << "y = ";
  cin >> y;
  cout << "x в [-5;5]: " << (x >= -5 && x <= 5) << endl;
  cout << "одного знака: " << (x * y > 0) << endl;
  cout << "в круге: " << (x * x + y * y <= 4) << endl;
  cout << "x != y: " << (x != y) << endl;
  getch();
  return 0;
}`, ins:[['3 и −1','3\n-1'],['1 и 1','1\n1'],['−6 и −0.5','-6\n-0.5']],
  steps:R`<ol><li>«Принадлежит отрезку» — два условия через И: <code>x &gt;= -5 &amp;&amp; x &lt;= 5</code>.</li><li>Одного знака — произведение положительно: <code>x * y &gt; 0</code>.</li><li>В круге радиуса 2: x² + y² ≤ 2² → <code>x*x + y*y &lt;= 4</code>.</li><li>Логическое выражение в <code>cout</code> обязательно в скобках — у <code>&lt;&lt;</code> приоритет выше, чем у <code>&amp;&amp;</code> и сравнений.</li></ol><div class="trap"><b>Ловушка:</b> без скобок <code>cout &lt;&lt; x &gt;= -5</code> не скомпилируется или посчитает не то.</div>`},
 {id:'c2-z3',name:'Задание 3 (указатели, из лекции 6)',cmp:'exact',text:R`<p>Объявить массив из 10 целых чисел. Создать 2 указателя: в первый записать адрес первого элемента массива, во второй — адрес последнего. Через указатели вывести первый и последний элементы, затем все элементы от первого до последнего, и разность указателей.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int a[10] = {5, 8, -3, 12, 0, 7, 21, -6, 4, 9};
  int *first = &a[0];    // то же самое: int *first = a;
  int *last = &a[9];
  cout << "Первый: " << *first << endl;
  cout << "Последний: " << *last << endl;
  cout << "Все: ";
  for (int *p = first; p <= last; p++)
    cout << *p << " ";
  cout << endl;
  cout << "last - first = " << last - first << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ol><li><code>&amp;a[0]</code> — адрес первого элемента (или просто <code>a</code>), <code>&amp;a[9]</code> — последнего (индексы с 0 до 9).</li><li><code>*first</code> — значение по адресу.</li><li>Цикл по указателю: <code>p++</code> сдвигает его на следующий элемент (на 4 байта для int).</li><li><code>last - first</code> = 9 — разность указателей считается в элементах, а не в байтах.</li></ol>`},
 {id:'c2-z4',name:'Задание 4',cmp:'exact',text:R`<p>Даны два целых числа a и b. С помощью условной операции <code>?:</code> найти большее из них и модуль разности.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int a, b, mx, d;
  cout << "a = ";
  cin >> a;
  cout << "b = ";
  cin >> b;
  mx = a > b ? a : b;
  d = a - b >= 0 ? a - b : b - a;
  cout << "max = " << mx << endl;
  cout << "|a - b| = " << d << endl;
  getch();
  return 0;
}`, ins:[['7 и 12','7\n12'],['5 и −3','5\n-3']],
  steps:R`<p><code>условие ? значение_если_да : значение_если_нет</code>. <code>a &gt; b ? a : b</code> — если a больше, берём a, иначе b. Модуль без функций: если разность неотрицательна — она сама, иначе наоборот.</p>`},
 {id:'c2-z5',name:'Задание 5',cmp:'exact',text:R`<p>Переменной a присвоить начальное значение (ввести с клавиатуры) и выполнить по очереди <code>a += 5; a *= 2; a -= 3; a /= 4; a %= 3;</code> — после каждой операции выводить a. Объяснить, какой простой записью можно заменить каждую составную операцию.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int a;
  cout << "a = ";
  cin >> a;
  a += 5;  cout << "a += 5  ->  " << a << endl;   // a = a + 5
  a *= 2;  cout << "a *= 2  ->  " << a << endl;   // a = a * 2
  a -= 3;  cout << "a -= 3  ->  " << a << endl;   // a = a - 3
  a /= 4;  cout << "a /= 4  ->  " << a << endl;   // a = a / 4 (целое деление)
  a %= 3;  cout << "a %= 3  ->  " << a << endl;   // a = a % 3
  getch();
  return 0;
}`, ins:[['10','10'],['1','1']],
  steps:R`<p>Для a = 10: 10+5 = 15 → 15·2 = 30 → 30−3 = 27 → 27/4 = 6 (целое!) → 6%3 = 0. Каждая составная операция <code>a ⊕= b</code> равна <code>a = a ⊕ b</code>.</p>`},
 {id:'c2-z6',name:'Задание 6',cmp:'exact',text:R`<p>С помощью операции <code>sizeof</code> вывести размеры в байтах типов char, short, int, long, float, double, long double, bool и массива <code>double m[10]</code>.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  double m[10];
  cout << "char: " << sizeof(char) << endl;
  cout << "short: " << sizeof(short) << endl;
  cout << "int: " << sizeof(int) << endl;
  cout << "long: " << sizeof(long) << endl;
  cout << "float: " << sizeof(float) << endl;
  cout << "double: " << sizeof(double) << endl;
  cout << "long double: " << sizeof(long double) << endl;
  cout << "bool: " << sizeof(bool) << endl;
  cout << "double m[10]: " << sizeof(m) << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>В 32-битном Builder: 1, 2, 4, 4, 4, 8, 10, 1. Для массива sizeof даёт весь размер: 10 × 8 = 80. Число элементов массива так и находят: <code>sizeof(m)/sizeof(m[0])</code>.</p>`},
 {id:'c2-z7',name:'Задание 7 (math.h)',cmp:'approx',text:R`<p>Даны катеты прямоугольного треугольника a и b. Найти гипотенузу, площадь и острые углы в градусах (функции sqrt, atan, константа M_PI).</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <math.h>

int main()
{
  double a, b, c, s, alpha, beta;
  cout << "a = ";
  cin >> a;
  cout << "b = ";
  cin >> b;
  c = sqrt(a * a + b * b);
  s = a * b / 2;
  alpha = atan(a / b) * 180 / M_PI;   // радианы -> градусы
  beta = 90 - alpha;
  cout << "c = " << c << endl;
  cout << "S = " << s << endl;
  cout << "alpha = " << alpha << endl;
  cout << "beta = " << beta << endl;
  getch();
  return 0;
}`, ins:[['3 и 4','3\n4'],['1 и 1','1\n1']],
  steps:R`<ol><li>По Пифагору <code>c = sqrt(a*a + b*b)</code>.</li><li>Тангенс угла против катета a: tg α = a/b, значит α = atan(a/b) — в <b>радианах</b>.</li><li>В градусы: × 180 / π (<code>M_PI</code> есть в math.h).</li></ol>`},
 {id:'c2-z8',name:'Задание 8 (printf)',cmp:'exact',text:R`<p>Ввести целое число и вывести его через printf в десятичном, восьмеричном и шестнадцатеричном виде; ввести вещественное и вывести его форматами %f, %.2f, %e и %g.</p>`,
  ref:R`#include <stdio.h>
#include <conio.h>

int main()
{
  int n;
  double x;
  printf("n = ");
  scanf("%d", &n);
  printf("x = ");
  scanf("%lf", &x);
  printf("%%d: %d   %%o: %o   %%x: %x\n", n, n, n);
  printf("%%f: %f\n", x);
  printf("%%.2f: %.2f\n", x);
  printf("%%e: %e\n", x);
  printf("%%g: %g\n", x);
  getch();
  return 0;
}`, ins:[['255 и 1234.5678','255\n1234.5678'],['8 и 0.00012','8\n0.00012']],
  steps:R`<ul><li><code>%d %o %x</code> — целое в 10-й, 8-й и 16-й системе: 255 → 255, 377, ff.</li><li><code>%f</code> — 6 знаков после точки, <code>%.2f</code> — 2, <code>%e</code> — экспоненциальная форма 1.234568e+03, <code>%g</code> — короче из двух.</li><li>Чтобы напечатать сам знак %, пишут <code>%%</code>.</li><li>В scanf для double — <code>%lf</code> и <code>&amp;</code> перед переменной.</li></ul>`},
 {id:'c2-z9',name:'Задание 9 (указатели, из лекции 6)',cmp:'none',text:R`<p>Объявить массив из 100 вещественных чисел. Вывести адреса всех элементов массива (покажем первые 5 и последний) и убедиться, что соседние адреса отличаются на sizeof(double).</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  double m[100];
  for (int i = 0; i < 5; i++)
    cout << "&m[" << i << "] = " << &m[i] << endl;
  cout << "..." << endl;
  cout << "&m[99] = " << &m[99] << endl;
  cout << "Шаг адресов: " << (int)&m[1] - (int)&m[0] << " байт" << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  note:R`<aside class="add"><span class="tag">почему «просто запусти»</span> Адреса зависят от компьютера и запуска, поэтому сравнивать их с эталоном нельзя. Главное — шаг между соседними адресами: 8 байт.</aside>`,
  steps:R`<p><code>&amp;m[i]</code> — адрес i-го элемента. Builder печатает адрес десятичным числом. Чтобы посчитать разность в байтах, адреса приводят к int: <code>(int)&amp;m[1] - (int)&amp;m[0]</code> = 8. А <code>&amp;m[1] - &amp;m[0]</code> без приведения даст 1 — разность указателей в элементах.</p>`},
 {id:'c2-z10',name:'Задание 10 (указатели)',cmp:'exact',text:R`<p>Даны две целые переменные. Через указатели (не обращаясь к переменным по имени) увеличить первую в 2 раза, к второй прибавить 10, затем поменять их значения местами.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  int a, b, t;
  int *pa = &a, *pb = &b;
  cout << "a = ";
  cin >> a;
  cout << "b = ";
  cin >> b;
  *pa = *pa * 2;
  *pb += 10;
  cout << "После изменения: a = " << a << ", b = " << b << endl;
  t = *pa;
  *pa = *pb;
  *pb = t;
  cout << "После обмена: a = " << a << ", b = " << b << endl;
  getch();
  return 0;
}`, ins:[['3 и 5','3\n5']],
  steps:R`<p><code>*pa</code> — это сама переменная a, только «через адрес». <code>*pa = *pa * 2</code> удваивает a. Обмен — через временную переменную t, как с обычными переменными.</p>`},
 {id:'c2-z11',name:'Задание 11 (случайные числа)',cmp:'none',text:R`<p>Получить 10 случайных целых чисел из диапазона [−20; 50] и вывести их, а также их сумму. Использовать randomize() и random().</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <stdlib.h>

int main()
{
  int x, s = 0;
  randomize();                    // чтобы числа каждый раз были разные
  for (int i = 0; i < 10; i++)
  {
    x = random(71) - 20;          // 0..70 -> -20..50
    cout << x << " ";
    s += x;
  }
  cout << endl << "Сумма = " << s << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  note:R`<aside class="add"><span class="tag">почему «просто запусти»</span> Числа случайные — у тебя и у эталона они разные. Проверь сам: все ли числа в [−20; 50].</aside>`,
  steps:R`<p><code>random(n)</code> даёт 0…n−1. Чтобы получить [a; b], берут <code>random(b - a + 1) + a</code>: [−20; 50] → <code>random(71) - 20</code>. Без <code>randomize()</code> при каждом запуске будут одни и те же числа.</p><div class="trap"><b>В базе тестов</b> ответ — <code>random(70)-20</code> (тогда 50 никогда не выпадет). На тесте выбирай его.</div>`},
];
CPP.topic('c2',{n:2,
 title:'Выражения и операции. Присваивание в стиле C. Дополнительные библиотеки. Работа с памятью',
 intro:R`<aside class="fix"><span class="tag">о лабе</span> Отдельного файла лабы по теме 2 нет. Задания ниже составлены по плану лабы УМКД («Expressions and operators. Additional libraries. Memory routine») и задачам из лекции 6 преподавателя про указатели.</aside>`,
 lecSub:'Все операции C++, приоритет, преобразование типов, библиотеки (math, stdio, conio, stdlib), указатели — лекция 6 преподавателя.',
 lecture:LECTURE,
 labs:[{id:'c2-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Выражения и операции. Дополнительные библиотеки. Работа с памятью',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> выработать практические навыки использования выражений и операций C++, стандартных библиотек и простых операций с памятью.</p><p><b>Что сделать:</b> объявить и инициализировать переменные; составить и вычислить арифметические и логические выражения; использовать присваивание и составное присваивание; применить арифметические, сравнения и логические операции; подключить и использовать дополнительные библиотеки и математические функции; исследовать адреса переменных; использовать указатели и разыменование; изменить данные через указатели; проверить программы на разных входных данных.</p></div>`,
  tasks:LAB}],
 umkd:[
  ['Что такое выражение в C++?','Запись из операндов, знаков операций и скобок, которая вычисляется в значение определённого типа: <code>a + b*2</code>.'],
  ['Что такое операции и операнды?','Операция — действие (+, *, =, &amp;&amp;…), операнд — то, над чем действие выполняется (переменная, константа, результат другой операции).'],
  ['Какие арифметические операции есть в C++?','<code>+ - * / %</code>, а также <code>++</code> и <code>--</code>. Деление целых даёт целое, % — только для целых.'],
  ['Какие операции сравнения и логические используются?','Сравнения <code>== != &lt; &gt; &lt;= &gt;=</code>; логические <code>&amp;&amp;</code> (И), <code>||</code> (ИЛИ), <code>!</code> (НЕ). Результат — true (1) или false (0).'],
  ['Что такое присваивание и составное присваивание?','<code>=</code> записывает значение в переменную; составное <code>+= -= *= /= %=</code> — сокращение: <code>s += x</code> ≡ <code>s = s + x</code>.'],
  ['Что такое приоритет и ассоциативность операций?','Приоритет — какая операция выполняется раньше (* раньше +); ассоциативность — порядок для одинакового приоритета: обычно слева направо, у присваивания и унарных — справа налево. Скобки меняют порядок.'],
  ['Что такое дополнительные библиотеки и зачем они нужны?','Готовые наборы функций: math.h (математика), stdio.h (printf/scanf, файлы), conio.h (консоль), stdlib.h (случайные числа, преобразования), string.h (строки). Не нужно писать всё самому.'],
  ['Что такое директива препроцессора? Зачем #include?','Команда препроцессору, выполняется до компиляции, начинается с #. <code>#include &lt;файл.h&gt;</code> вставляет заголовочный файл с описаниями библиотечных функций.'],
  ['Что такое память компьютера и как в ней хранятся данные?','Последовательность пронумерованных байтов; номер — адрес. Переменная занимает несколько подряд идущих байтов (int — 4) в двоичном виде.'],
  ['Что такое указатель?','Переменная, в которой хранится адрес другой переменной: <code>int *p = &amp;x;</code>'],
  ['В чём разница между операциями &amp; и *?','<code>&amp;x</code> — взять адрес переменной; <code>*p</code> — взять значение по адресу (разыменование). Они обратные: <code>*&amp;x</code> = x.'],
  ['Как обратиться к переменной через указатель?','Записать адрес в указатель <code>p = &amp;x;</code>, затем читать и менять через <code>*p</code>: <code>*p = 10;</code> меняет x.'],
 ],
 srs:R`<aside class="add"><span class="tag">СРС к теме 2</span><ul><li>Запись математических выражений в C++ (линейная форма) — таблица «как переводить формулу» в теме 1 и задание 7.</li><li>Составное присваивание и его аналоги через простое — задание 5.</li><li>Библиотеки math, iostream, stdio — п. 7 лекции, задания 7–8.</li><li>Логические операции и сравнения — задание 2.</li><li>Условная операция ?: и вложенные ?: — задание 4 и п. 5 лекции.</li><li>Побитовые операции — п. 5 лекции.</li></ul></aside>`,
 foot:'Источники: УМКД «Programming I», лекция 6 «Pointers in C++» (преподаватель), база 190 вопросов. Эталоны проверены интерпретатором, совпадающим с bcc32 из C++Builder 6.'
});
})();
