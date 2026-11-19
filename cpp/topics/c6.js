/* C++ · Тема 6. Тип char. Строки: массивы символов и класс string */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 6 из УМКД (перевод) и моя лекция. В вопросах УМКД тема называется «char type and string class» (тип char и класс string), в плане лекций — «arrays of characters» (массивы символов); ниже есть оба способа.</aside>
  <h2 id="c6-lec">Лекция 6. Тип char. Строки в C++: массивы символов и класс string</h2>
  <p><b>Цель:</b> познакомить с типом char и представлением и обработкой строк как массивов символов в C++.</p>
  <p><b>Основные пункты:</b> тип char; символы и их коды; символьные константы; escape-последовательности; понятие строки; строка как массив символов; нулевой символ '\0'; объявление и инициализация массивов char; ввод и вывод строк; доступ к отдельным символам; основные операции; длина строки; копирование и сравнение; соединение; типичные ошибки.</p>
  <h3>1. Тип char</h3>
  <aside class="add"><span class="tag">дополнение · символ</span>
    <p><b>char</b> — тип для одного символа, 1 байт. В памяти хранится не буква, а её <b>код</b> — целое число (таблица ASCII, для русских букв в Windows — кодировка 1251). Поэтому с char можно считать как с числом:</p>
<pre class="cpp-code">char c = 'A';            // символьная константа — в одинарных кавычках
cout &lt;&lt; c;               // A
cout &lt;&lt; (int)c;          // 65 — код
cout &lt;&lt; c + 1;           // 66 — в выражении char становится int
cout &lt;&lt; (char)(c + 1);   // B
char d = '7'; int n = d - '0';   // n = 7 — цифра-символ в число</pre>
    <ul><li>Коды: '0'…'9' = 48…57, 'A'…'Z' = 65…90, 'a'…'z' = 97…122. Маленькая буква = большая + 32.</li>
      <li>Диапазон char в Builder: −128…127 (русские буквы имеют отрицательные коды: (int)'Я' = −33).</li>
      <li>Escape-последовательности — тоже символы: '\n', '\t', '\\', '\'', '\0'.</li>
      <li>ctype.h: <code>isdigit, isalpha, isspace, isupper, islower, toupper, tolower</code> (с латиницей).</li></ul>
  </aside>
  <h3>2. Строка как массив char</h3>
  <aside class="add"><span class="tag">дополнение · C-строка</span>
    <p><b>Символ и строка — разные вещи.</b> <code>'A'</code> — один символ (1 байт). <code>"A"</code> — строка: 2 байта, 'A' и <b>нулевой символ '\0'</b>, которым заканчивается любая строка.</p>
<pre class="cpp-code">char s[20] = "Hello";     // 'H','e','l','l','o','\0', остальное — нули
char t[] = "abc";         // размер 4 (3 буквы + '\0')
cout &lt;&lt; s;                // выводится до '\0'
cin &gt;&gt; s;                 // читает одно СЛОВО (до пробела)
cin.getline(s, 20);       // читает всю строку с пробелами (максимум 19 символов)
gets(s);                  // то же из stdio.h
s[0] = 'J';               // доступ к символу по индексу</pre>
    <p><b>Функции string.h</b> (их много в тестах — запоминай по английскому корню):</p>
    <div class="tw"><table><tr><th>Функция</th><th>Что делает</th></tr>
      <tr><td><code>strlen(s)</code></td><td>длина (без '\0'), <i>length</i></td></tr>
      <tr><td><code>strcpy(s1, s2)</code></td><td>копирует s2 в s1, <i>copy</i>. Присвоить <code>s1 = s2</code> нельзя!</td></tr>
      <tr><td><code>strncpy(s1, s2, k)</code></td><td>копирует первые k символов</td></tr>
      <tr><td><code>strcat(s1, s2)</code></td><td>дописывает s2 в конец s1, <i>concatenate</i></td></tr>
      <tr><td><code>strncat(s1, s2, k)</code></td><td>дописывает первые k символов s2</td></tr>
      <tr><td><code>strcmp(s1, s2)</code></td><td>сравнивает: 0 — равны, &lt;0 — s1 раньше по алфавиту, &gt;0 — позже, <i>compare</i></td></tr>
      <tr><td><code>strncmp(s1, s2, k)</code></td><td>сравнивает первые k символов</td></tr>
      <tr><td><code>stricmp(s1, s2)</code></td><td>сравнивает без учёта регистра, <i>ignore case</i></td></tr>
      <tr><td><code>strchr(s, ch)</code></td><td>ищет символ слева направо, возвращает указатель на него или NULL</td></tr>
      <tr><td><code>strrchr(s, ch)</code></td><td>ищет символ справа налево (с конца), <i>reverse</i></td></tr>
      <tr><td><code>strstr(s1, s2)</code></td><td>ищет строку s2 внутри s1</td></tr>
      <tr><td><code>strrev(s)</code></td><td>переворачивает строку</td></tr>
      <tr><td><code>strupr(s)</code>, <code>strlwr(s)</code></td><td>в верхний / нижний регистр (<i>upper / lower</i>)</td></tr>
      <tr><td><code>strset(s, ch)</code>, <code>strnset(s, ch, k)</code></td><td>заполняет символом ch всю строку / первые k символов</td></tr></table></div>
    <p><b>Типичные ошибки:</b> забыть место под '\0' (<code>char s[5] = "Hello"</code> — не влезет); сравнивать строки через <code>==</code> (сравниваются адреса, а не текст — нужен strcmp); присваивать <code>s = "текст"</code> вместо strcpy; читать фразу через <code>cin &gt;&gt;</code> (берёт только первое слово); после <code>cin &gt;&gt; n</code> сразу <code>getline</code> — получит пустую строку (нужен <code>cin.ignore()</code>).</p>
  </aside>
  <h3>3. Класс string</h3>
  <aside class="add"><span class="tag">дополнение · string</span>
    <p><code>string</code> (подключить <code>&lt;string&gt;</code> и <code>using namespace std;</code>) — строка-объект: сама следит за размером, присваивается через <code>=</code>, сравнивается через <code>==</code>, склеивается через <code>+</code>.</p>
<pre class="cpp-code">string a = "Hello", b;
b = a + ", World";              // соединение
if (a == "Hello") …             // сравнение: == != &lt; &gt;
a.length()  a.size()            // длина
a[0]  a.at(0)                   // символ
a.substr(7, 5)                  // подстрока: с позиции 7, 5 символов
a.find("lo")                    // позиция подстроки или string::npos (не нашли)
a.insert(5, "!!")  a.erase(0, 2)  a.replace(0, 1, "J")
getline(cin, a);                // ввести строку с пробелами
a.c_str()                       // как char* — для printf и strcpy</pre>
    <div class="tw"><table><tr><th>Действие</th><th>char[]</th><th>string</th></tr>
      <tr><td>присвоить</td><td><code>strcpy(s, "abc")</code></td><td><code>s = "abc"</code></td></tr>
      <tr><td>соединить</td><td><code>strcat(s, t)</code></td><td><code>s + t</code>, <code>s += t</code></td></tr>
      <tr><td>сравнить</td><td><code>strcmp(s, t) == 0</code></td><td><code>s == t</code></td></tr>
      <tr><td>длина</td><td><code>strlen(s)</code></td><td><code>s.length()</code></td></tr>
      <tr><td>ввод строки</td><td><code>cin.getline(s, 80)</code></td><td><code>getline(cin, s)</code></td></tr>
      <tr><td>размер</td><td>фиксированный, нужно следить</td><td>растёт сам</td></tr></table></div>
  </aside>
</div>`;
const L=[
 {id:'c6-z1',name:'Задание 1 (два способа)',cmp:'exact',text:R`<p>Ввести строку (с пробелами). Подсчитать количество слов в ней (слова разделены одним или несколькими пробелами). Решить двумя способами: массив char и класс string.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

int main()
{
  // способ 1: массив char
  char s[200];
  int words = 0;
  cout << "Строка: ";
  cin.getline(s, 200);
  for (int i = 0; s[i] != '\0'; i++)
    if (s[i] != ' ' && (i == 0 || s[i - 1] == ' '))   // начало слова
      words++;
  cout << "char[]: слов " << words << endl;

  // способ 2: string — та же строка
  string t = s;
  int w2 = 0;
  for (int i = 0; i < (int)t.length(); i++)
    if (t[i] != ' ' && (i == 0 || t[i - 1] == ' '))
      w2++;
  cout << "string: слов " << w2 << endl;
  getch();
  return 0;
}`, ins:[['фраза','Мама  мыла раму'],['пробелы по краям','  one two   three  ']],
  steps:R`<p>Слово начинается там, где символ не пробел, а перед ним пробел (или это начало строки). Считаем такие места. Строку читаем <code>cin.getline</code> — <code>cin &gt;&gt;</code> взял бы только первое слово. Цикл по char[] идёт до '\0', по string — до <code>length()</code>.</p>`},
 {id:'c6-z2',name:'Задание 2 (два способа)',cmp:'exact',text:R`<p>Ввести слово и проверить, является ли оно палиндромом (читается одинаково в обе стороны: «шалаш», «level»). Способ 1 — массив char и strrev/strcmp; способ 2 — string.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string.h>
#include <string>
using namespace std;

int main()
{
  char w[50], r[50];
  cout << "Слово: ";
  cin >> w;
  strcpy(r, w);          // копия
  strrev(r);             // перевернуть копию
  if (strcmp(w, r) == 0) cout << "char[]: палиндром" << endl;
  else cout << "char[]: не палиндром" << endl;

  string s = w;
  bool ok = true;
  int n = s.length();
  for (int i = 0; i < n / 2; i++)
    if (s[i] != s[n - 1 - i]) ok = false;
  cout << "string: " << (ok ? "палиндром" : "не палиндром") << endl;
  getch();
  return 0;
}`, ins:[['шалаш','шалаш'],['level','level'],['hello','hello']],
  steps:R`<ol><li>char[]: копируем слово (<code>strcpy</code>, не <code>=</code>!), переворачиваем копию <code>strrev</code> и сравниваем <code>strcmp(...) == 0</code>.</li><li>string: сравниваем символы с двух концов: i-й и (n−1−i)-й, до середины.</li></ol>`},
 {id:'c6-z3',name:'Задание 3',cmp:'exact',text:R`<p>Ввести строку. Подсчитать количество букв (латинских), цифр, пробелов и остальных символов (функции ctype.h).</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <ctype.h>

int main()
{
  char s[200];
  int let = 0, dig = 0, sp = 0, other = 0;
  cout << "Строка: ";
  cin.getline(s, 200);
  for (int i = 0; s[i]; i++)
  {
    if (isalpha(s[i])) let++;
    else if (isdigit(s[i])) dig++;
    else if (s[i] == ' ') sp++;
    else other++;
  }
  cout << "Букв: " << let << ", цифр: " << dig << ", пробелов: " << sp << ", других: " << other << endl;
  getch();
  return 0;
}`, ins:[['пример','C++ Builder 6 (2002)!']],
  steps:R`<p><code>isalpha</code> — буква, <code>isdigit</code> — цифра. Условие цикла <code>s[i]</code> — то же, что <code>s[i] != '\0'</code>: код '\0' равен 0, это ложь.</p>`},
 {id:'c6-z4',name:'Задание 4 (два способа)',cmp:'exact',text:R`<p>Ввести строку и символ. Заменить в строке все вхождения этого символа на '*' и вывести количество замен.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

int main()
{
  char s[200], c;
  int k = 0;
  cout << "Строка: ";
  cin.getline(s, 200);
  cout << "Символ: ";
  cin >> c;
  string t = s;                       // копия для второго способа
  for (int i = 0; s[i] != '\0'; i++)
    if (s[i] == c) { s[i] = '*'; k++; }
  cout << "char[]: " << s << " (замен: " << k << ")" << endl;
  int pos = t.find(c);
  while (pos != (int)string::npos)    // find ищет следующий, пока не вернёт npos
  {
    t.replace(pos, 1, "*");
    pos = t.find(c, pos + 1);
  }
  cout << "string: " << t << endl;
  getch();
  return 0;
}`, ins:[['a','banana split\na']],
  steps:R`<p>Способ 1: проход по символам и замена. Способ 2: <code>find</code> возвращает позицию или <code>string::npos</code>; заменяем и ищем дальше с позиции + 1.</p>`},
 {id:'c6-z5',name:'Задание 5 (поиск подстроки)',cmp:'exact',text:R`<p>Ввести текст и слово. Найти позицию первого вхождения слова (strstr) и количество всех вхождений.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string.h>

int main()
{
  char text[200], w[50];
  int k = 0;
  cout << "Текст: ";
  cin.getline(text, 200);
  cout << "Слово: ";
  cin.getline(w, 50);
  char *p = strstr(text, w);
  if (p == NULL) cout << "Не найдено" << endl;
  else
  {
    cout << "Первое вхождение с позиции " << p - text << endl;
    while (p != NULL)
    {
      k++;
      p = strstr(p + 1, w);     // ищем дальше, начиная со следующего символа
    }
    cout << "Всего вхождений: " << k << endl;
  }
  getch();
  return 0;
}`, ins:[['to be','to be or not to be\nbe'],['нет','hello world\nxyz']],
  steps:R`<p><code>strstr</code> возвращает <b>указатель</b> на найденное место или NULL. Позиция = указатель − начало строки (<code>p - text</code>). Следующее вхождение ищем, начиная с <code>p + 1</code>.</p>`},
 {id:'c6-z6',name:'Задание 6 (функции string.h и string)',cmp:'exact',text:R`<p>Ввести фамилию и имя (два слова). Составить строку «Фамилия Имя» с помощью strcpy/strcat и с помощью string; вывести длины; сравнить фамилию с «Иванов».</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string.h>
#include <string>
using namespace std;

int main()
{
  char f[30], n[30], full[61];
  cout << "Фамилия: "; cin >> f;
  cout << "Имя: "; cin >> n;
  strcpy(full, f);
  strcat(full, " ");
  strcat(full, n);
  cout << "char[]: " << full << ", длина " << strlen(full) << endl;
  string sf = f, sn = n;
  string all = sf + " " + sn;
  cout << "string: " << all << ", длина " << all.length() << endl;
  if (strcmp(f, "Иванов") == 0) cout << "Вы Иванов" << endl;
  else cout << "Вы не Иванов" << endl;
  getch();
  return 0;
}`, ins:[['Петров Иван','Петров\nИван'],['Иванов Сергей','Иванов\nСергей']],
  steps:R`<p>Массив full должен вместить обе части, пробел и '\0': 30 + 1 + 30. С string склеивание — просто <code>+</code>.</p>`},
 {id:'c6-z7',name:'Задание 7 (коды символов)',cmp:'exact',text:R`<p>Ввести слово латиницей. Вывести каждый символ и его код, затем зашифровать слово шифром Цезаря (каждая буква сдвигается на 3 вперёд по алфавиту, x→a, y→b, z→c).</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

int main()
{
  char w[50];
  cout << "Слово: ";
  cin >> w;
  for (int i = 0; w[i]; i++)
    cout << w[i] << " = " << (int)w[i] << endl;
  for (int i = 0; w[i]; i++)
    if (w[i] >= 'a' && w[i] <= 'z')
      w[i] = 'a' + (w[i] - 'a' + 3) % 26;
  cout << "Шифр: " << w << endl;
  getch();
  return 0;
}`, ins:[['hello','hello'],['xyz','xyz']],
  steps:R`<p>(int)c — код символа. Номер буквы в алфавите: <code>w[i] - 'a'</code> (0…25). Сдвиг по кругу: <code>(номер + 3) % 26</code>, и обратно в букву — прибавить 'a'.</p>`},
];
CPP.topic('c6',{n:6,
 title:'Тип char и класс string в C++. Строки как массивы символов',
 lecSub:'char и коды символов, C-строки и \\0, функции string.h, класс string, сравнение двух способов.',
 lecture:LECTURE,
 labs:[{id:'c6-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Тип char и класс string',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> выработать практические навыки обработки отдельных символов и строк с помощью типа char и класса string.</p><p><b>Что сделать:</b> объявить и инициализировать переменные char; работать с символьными константами и кодами символов; создавать и инициализировать строки; использовать класс string; вводить и выводить символьные и строковые данные; определять длину строки; соединять и сравнивать строки; искать символы и подстроки; изменять строки; разработать и проверить программу обработки текста.</p></div>`,
  note:R`<aside class="fix"><span class="tag">о лабе</span> Отдельного файла лабы по теме 6 нет — задания составлены по плану лабы и СРС УМКД («решать задачи двумя способами — массив char и string»).</aside>`,tasks:L}],
 umkd:[
  ['Что такое тип char?','Символьный тип, 1 байт; хранит код одного символа (−128…127 в Builder).'],
  ['Как символ представлен и хранится в памяти?','Как целое число — код символа в таблице ASCII / Windows-1251: \'A\' = 65, \'0\' = 48.'],
  ['Разница между символом и строкой?','Символ \'A\' — одно значение char (1 байт); строка "A" — массив символов, заканчивается \'\\0\' (2 байта).'],
  ['Для чего нужны escape-последовательности при работе с символами?','Чтобы записать особые символы: \'\\n\' (новая строка), \'\\t\', \'\\\\\', \'\\\'\', \'\\0\' (конец строки).'],
  ['Что такое строка в C++?','Последовательность символов: массив char с \'\\0\' в конце (C-строка) или объект класса string.'],
  ['Что такое класс string?','Класс стандартной библиотеки C++ для строк: сам управляет памятью, поддерживает =, +, ==, методы length, substr, find, insert, erase.'],
  ['Как объявить и инициализировать строку?','<code>char s[20] = "Hello";</code>, <code>char t[] = "abc";</code>, <code>string u = "World";</code>'],
  ['Как ввести и вывести строку?','Вывод — <code>cout &lt;&lt; s</code>. Ввод слова — <code>cin &gt;&gt; s</code>; строки с пробелами — <code>cin.getline(s, n)</code>, <code>gets(s)</code> или <code>getline(cin, str)</code>.'],
  ['Как соединить две строки?','char[]: <code>strcat(s1, s2)</code>; string: <code>s1 + s2</code> или <code>s1 += s2</code>.'],
  ['Как сравнить строки?','char[]: <code>strcmp(s1, s2)</code> (0 — равны); string: <code>==, !=, &lt;, &gt;</code>.'],
  ['Как определить длину строки?','<code>strlen(s)</code> для char[] (без \'\\0\'); <code>s.length()</code> или <code>s.size()</code> для string.'],
  ['Какие основные операции со строками?','Копирование, соединение, сравнение, длина, поиск символа и подстроки, вставка, удаление, замена, перевод регистра, разворот.'],
 ],
 srs:R`<aside class="add"><span class="tag">СРС к теме 6</span><ul><li>Конспект: разница между массивом char и string — таблица в п. 3.</li><li>Функции обработки строк — таблица string.h в п. 2.</li><li>Программы обработки текста двумя способами — задания 1, 2, 4, 6.</li></ul></aside>`,
 foot:'Источники: УМКД «Programming I», база 190 вопросов. Эталоны сверены с bcc32 из C++Builder 6.'
});
})();
