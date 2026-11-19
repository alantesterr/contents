/* C++ · Тема 8. ООП: объекты и классы */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 8 из УМКД (перевод) и моя лекция по пунктам.</aside>
  <h2 id="c8-lec">Лекция 8. ООП: объекты и классы</h2>
  <p><b>Цель:</b> научить определять классы и создавать объекты, описывать и использовать их данные и методы.</p>
  <p><b>Основные пункты:</b> понятие класса; объект как экземпляр класса; структура класса в C++; поля и методы; спецификаторы доступа public, private, protected; инкапсуляция данных; создание объектов; доступ к членам класса; вызов методов; указатель this; статические члены класса; передача объектов в функции; взаимодействие объектов разных классов.</p>
  <h3>1. Объявление класса</h3>
  <aside class="add"><span class="tag">дополнение · структура класса</span>
<pre class="cpp-code">class Rect                        // имя класса — новый тип
{
private:                          // закрытые члены: доступны только методам класса
  double w, h;                    // поля (data members)
public:                           // открытые члены: доступны всем
  Rect(double a, double b)        // конструктор (тема 13)
  { w = a; h = b; }
  double area() { return w * h; } // метод (member function), описан внутри
  void show();                    // только объявлен
};                                // ; после } обязательна!

void Rect::show()                 // метод описан вне класса: Класс::метод
{ cout &lt;&lt; w &lt;&lt; " x " &lt;&lt; h &lt;&lt; endl; }</pre>
    <ul><li><b>Поля</b> — переменные класса, <b>методы</b> — функции класса. Вместе — <b>члены класса</b>.</li>
      <li><b>Спецификаторы доступа:</b> <code>public</code> — всем; <code>private</code> — только методам этого класса (по умолчанию в class); <code>protected</code> — этому классу и наследникам (тема 12).</li>
      <li><b>Инкапсуляция в классе:</b> поля делают private, а для работы с ними дают public-методы.</li>
      <li><code>struct</code> — то же, что class, но по умолчанию всё public.</li></ul>
  </aside>
  <h3>2. Создание объектов и доступ к членам</h3>
  <aside class="add"><span class="tag">дополнение · объекты</span>
<pre class="cpp-code">Rect r(3, 4);          // объект в стеке
cout &lt;&lt; r.area();      // доступ через точку
Rect *p = &amp;r;          // указатель на объект
cout &lt;&lt; p-&gt;area();     // доступ через стрелку (= (*p).area())
Rect *q = new Rect(1, 2);   // объект в динамической памяти
q-&gt;show(); delete q;
Rect arr[3] = { Rect(1,1), Rect(2,2), Rect(3,3) };   // массив объектов</pre>
    <p>Связь класса и объекта: класс — тип (описание), объект — переменная этого типа. У каждого объекта <b>свои</b> поля, а методы общие.</p>
  </aside>
  <h3>3. Указатель this, статические члены, объекты в функциях</h3>
  <aside class="add"><span class="tag">дополнение</span>
    <ul><li><b>this</b> — скрытый указатель внутри метода на объект, для которого метод вызван. Нужен, когда параметр называется как поле: <code>void setW(double w) { this-&gt;w = w; }</code>, и чтобы вернуть сам объект: <code>return *this;</code></li>
      <li><b>static-поле</b> — одно на весь класс (общее для всех объектов), например счётчик созданных объектов. Объявляется в классе <code>static int count;</code> и определяется вне: <code>int Rect::count = 0;</code>. <b>static-метод</b> вызывается без объекта: <code>Rect::getCount()</code>, this в нём нет.</li>
      <li><b>Передача объекта в функцию:</b> по значению (копия), по ссылке <code>void f(Rect &amp;r)</code> (можно менять), по константной ссылке <code>void f(const Rect &amp;r)</code> (без копии и без изменений — тогда вызывать можно только const-методы).</li>
      <li><b>Взаимодействие объектов:</b> метод одного объекта получает другой объект как параметр: <code>a.transfer(b, 100)</code>.</li></ul>
  </aside>
</div>`;
const T=[
 {id:'c8-z1',name:'Задание 1',cmp:'exact',text:R`<p>Описать класс «Прямоугольник» с закрытыми полями ширина и высота и открытыми методами: задать размеры (с проверкой &gt; 0), площадь, периметр, вывод. Создать два объекта, вывести их данные и сравнить площади.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Rect
{
private:
  double w, h;
public:
  void set(double a, double b)
  {
    if (a > 0 && b > 0) { w = a; h = b; }
    else { w = 1; h = 1; cout << "Размеры должны быть > 0, поставлено 1 x 1" << endl; }
  }
  double area() { return w * h; }
  double perimeter() { return 2 * (w + h); }
  void show();
};

void Rect::show()
{
  cout << w << " x " << h << ": S = " << area() << ", P = " << perimeter() << endl;
}

int main()
{
  Rect a, b;
  a.set(3, 4);
  b.set(5, -2);
  a.show();
  b.show();
  if (a.area() > b.area()) cout << "Первый больше" << endl;
  else cout << "Второй не меньше первого" << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ol><li>Поля private — менять их можно только через <code>set</code>, который проверяет данные.</li><li>Метод <code>show</code> объявлен в классе, а описан снаружи через <code>Rect::show</code> — внутри него поля и другие методы доступны напрямую.</li><li>Объекты a и b — разные, у каждого свои w и h.</li></ol>`},
 {id:'c8-z2',name:'Задание 2 (взаимодействие объектов)',cmp:'exact',text:R`<p>Описать класс «Банковский счёт» (владелец, баланс — закрыт). Методы: пополнить, снять (нельзя уйти в минус), перевести деньги на другой счёт, показать. Создать два счёта и продемонстрировать перевод.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Account
{
private:
  string owner;
  double balance;
public:
  Account(string o, double b) { owner = o; balance = b; }
  void deposit(double s) { if (s > 0) balance += s; }
  bool withdraw(double s)
  {
    if (s <= 0 || s > balance) { cout << owner << ": недостаточно средств" << endl; return false; }
    balance -= s;
    return true;
  }
  void transfer(Account &to, double s)      // объект-получатель — по ссылке
  {
    if (withdraw(s)) { to.deposit(s); cout << owner << " -> " << to.owner << ": " << s << endl; }
  }
  void show() { cout << owner << ": " << balance << endl; }
};

int main()
{
  Account a("Айгерим", 1000), b("Данияр", 200);
  a.transfer(b, 300);
  b.transfer(a, 5000);
  a.show();
  b.show();
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Метод transfer получает другой объект <b>по ссылке</b> <code>Account &amp;to</code> — иначе пополнилась бы копия. Внутри метода можно обращаться к закрытым полям <b>другого</b> объекта того же класса (<code>to.owner</code>) — доступ проверяется по классу, а не по объекту.</p>`},
 {id:'c8-z3',name:'Задание 3 (this и static)',cmp:'exact',text:R`<p>Класс «Студент» (имя, средний балл). Параметры сеттеров называются так же, как поля (использовать this). Статическое поле — количество созданных студентов, статический метод для его получения. Цепочка вызовов через возврат *this.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Student
{
private:
  string name;
  double gpa;
  static int count;                     // одно на весь класс
public:
  Student() { name = "?"; gpa = 0; count++; }
  Student& setName(string name) { this->name = name; return *this; }
  Student& setGpa(double gpa) { this->gpa = gpa; return *this; }
  void show() { cout << name << ", GPA " << gpa << endl; }
  static int getCount() { return count; }
};

int Student::count = 0;                 // определение static-поля вне класса

int main()
{
  Student a, b;
  a.setName("Асель").setGpa(3.67);      // цепочка: каждый метод возвращает сам объект
  b.setName("Ерлан").setGpa(2.9);
  a.show();
  b.show();
  Student c;
  cout << "Создано студентов: " << Student::getCount() << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ul><li><code>this-&gt;name = name</code>: слева поле объекта, справа параметр.</li><li><code>return *this;</code> — вернуть сам объект (по ссылке <code>Student&amp;</code>), поэтому можно писать вызовы цепочкой.</li><li>static count увеличивается в конструкторе — у всех объектов он общий. Вызов без объекта: <code>Student::getCount()</code>.</li></ul>`},
 {id:'c8-z4',name:'Задание 4 (массив объектов, объект в функцию)',cmp:'exact',text:R`<p>Ввести данные о N товарах (название, цена, количество) в массив объектов. Функция, получающая объект по константной ссылке, печатает его; найти самый дорогой товар и общую стоимость склада.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Item
{
public:
  string name;
  double price;
  int qty;
  double total() const { return price * qty; }   // const-метод: не меняет объект
};

void print(const Item &it)                       // без копии и без права изменять
{
  cout << it.name << ": " << it.price << " x " << it.qty << " = " << it.total() << endl;
}

int main()
{
  const int N = 3;
  Item a[N];
  double sum = 0;
  int best = 0;
  for (int i = 0; i < N; i++)
  {
    cout << "Товар " << i + 1 << " (название цена количество): ";
    cin >> a[i].name >> a[i].price >> a[i].qty;
  }
  for (int i = 0; i < N; i++)
  {
    print(a[i]);
    sum += a[i].total();
    if (a[i].price > a[best].price) best = i;
  }
  cout << "Самый дорогой: " << a[best].name << endl;
  cout << "Всего на складе: " << sum << endl;
  getch();
  return 0;
}`, ins:[['3 товара','Хлеб 150 20\nМолоко 420 10\nСыр 2500 3']],
  steps:R`<p>Массив объектов: <code>Item a[N];</code>, поле i-го — <code>a[i].price</code>. Функция print принимает <code>const Item &amp;</code>: объект не копируется и не может быть изменён; поэтому total() помечен <code>const</code> — иначе его нельзя вызвать у const-объекта.</p>`},
 {id:'c8-z5',name:'Задание 5 (private / public / protected)',cmp:'exact',text:R`<p>Проверить, как работают спецификаторы доступа: класс с полями в разных секциях; из main обращаться к public-полю напрямую, к private — только через метод. Раскомментируй запрещённые строки и прочитай ошибки компилятора.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Box
{
private:
  int secret;
protected:
  int forKids;
public:
  int open;
  Box() { secret = 1; forKids = 2; open = 3; }
  int getSecret() { return secret; }
};

int main()
{
  Box b;
  cout << "open = " << b.open << endl;              // public — можно
  cout << "secret = " << b.getSecret() << endl;     // private — только через метод
  // cout << b.secret;    — ошибка: 'Box::secret' is not accessible
  // cout << b.forKids;   — ошибка: protected тоже закрыт для main
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>private и protected снаружи одинаково недоступны. Разница проявляется только при наследовании: protected-члены видны в методах класса-наследника (тема 12).</p>`},
];
CPP.topic('c8',{n:8,
 title:'ООП: объекты и классы',
 lecSub:'Объявление класса, поля и методы, public/private/protected, создание объектов, . и ->, this, static, объекты в функциях.',
 lecture:LECTURE,
 labs:[{id:'c8-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Объекты и классы',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> выработать практические навыки создания классов и объектов и реализации их свойств и методов в C++.</p><p><b>Что сделать:</b> описать пользовательский класс; создать поля и методы; использовать спецификаторы public, private, protected; создать объекты; инициализировать данные объекта; обращаться к свойствам и методам; реализовать методы обработки данных; создать несколько объектов одного класса; показать взаимодействие объектов; проверить класс в программе.</p></div>`,tasks:T}],
 umkd:[
  ['Что такое класс в C++?','Пользовательский тип, объединяющий поля (данные) и методы (функции); объявляется словом class.'],
  ['Что такое объект?','Экземпляр класса — переменная типа класса со своими значениями полей.'],
  ['Связь класса и объекта?','Класс — описание (тип), объект — конкретный экземпляр, созданный по этому описанию; по одному классу — сколько угодно объектов.'],
  ['Что такое поля и методы класса?','Поля (data members) — переменные класса, хранят состояние; методы (member functions) — функции класса, задают поведение.'],
  ['Как объявить класс в C++?','<code>class Имя { private: поля; public: методы; };</code> — с точкой с запятой в конце.'],
  ['Что такое спецификаторы public, private, protected?','public — доступ всем; private — только методам самого класса; protected — методам класса и его наследников.'],
  ['Что такое инкапсуляция в классе C++?','Поля делаются private, работа с ними — через public-методы, которые проверяют данные.'],
  ['Как создать объект?','Объявить переменную типа класса: <code>Rect r;</code>, <code>Rect r(3,4);</code> или динамически: <code>Rect *p = new Rect(3,4);</code>'],
  ['Как обратиться к членам класса?','Через точку у объекта (<code>r.area()</code>) или через стрелку у указателя (<code>p-&gt;area()</code>); внутри методов — просто по имени.'],
  ['Назначение указателя this?','Скрытый указатель на текущий объект внутри метода; нужен, чтобы отличить поле от параметра с тем же именем и вернуть сам объект (*this).'],
  ['Что такое статические члены класса?','Члены, общие для всех объектов класса (static); static-поле определяется вне класса, static-метод вызывается через Класс::метод() без объекта.'],
  ['Как объекты одного класса взаимодействуют друг с другом?','Метод одного объекта получает другой объект (обычно по ссылке) и вызывает его методы или читает его поля — внутри класса доступны даже private-поля другого объекта того же класса.'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 8). Эталоны сверены с bcc32.'
});
})();
