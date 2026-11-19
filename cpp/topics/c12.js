/* C++ · Тема 12. Иерархия классов */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 12 из УМКД (перевод) и моя лекция. Плакат иерархии VCL из СРС (scribd «Delphi VCL Hierarchy Poster») — главные ветки пересказаны ниже.</aside>
  <h2 id="c12-lec">Лекция 12. Иерархия классов</h2>
  <p><b>Цель:</b> познакомить с наследованием и иерархической организацией классов в ООП.</p>
  <p><b>Основные пункты:</b> понятие наследования; базовые и производные классы; иерархия классов; связь базового и производного класса; синтаксис наследования в C++; одиночное наследование; множественное наследование; управление доступом при наследовании; public, protected и private наследование; повторное использование кода; переопределение методов; виртуальные функции; основы полиморфизма; иерархии классов в C++Builder.</p>
  <h3>1. Наследование</h3>
  <aside class="add"><span class="tag">дополнение · база и наследник</span>
<pre class="cpp-code">class Animal                       // базовый (родительский) класс
{
protected:
  string name;                     // видно в наследниках
public:
  Animal(string n) : name(n) {}
  void eat() { cout &lt;&lt; name &lt;&lt; " ест" &lt;&lt; endl; }
};
class Dog : public Animal          // производный (дочерний) класс
{
public:
  Dog(string n) : Animal(n) {}     // вызов конструктора базового класса
  void bark() { cout &lt;&lt; name &lt;&lt; ": Гав" &lt;&lt; endl; }
};</pre>
    <ul><li><b>Иерархия классов</b> — дерево: базовый класс наверху, наследники ниже, у наследника могут быть свои наследники.</li>
      <li>Наследник получает все поля и методы базового и добавляет свои — <b>повторное использование кода</b>.</li>
      <li><b>Одиночное</b> наследование — один базовый класс; <b>множественное</b> — несколько: <code>class Amphibian : public Car, public Boat</code>.</li>
      <li>Порядок: при создании объекта сначала работает конструктор базового класса, потом наследника; деструкторы — в обратном порядке.</li></ul>
  </aside>
  <h3>2. Доступ при наследовании</h3>
  <aside class="add"><span class="tag">дополнение · public / protected / private</span>
    <div class="tw"><table><tr><th>Член базового</th><th>public-наследование</th><th>protected-наследование</th><th>private-наследование</th></tr>
      <tr><td>public</td><td>public</td><td>protected</td><td>private</td></tr>
      <tr><td>protected</td><td>protected</td><td>protected</td><td>private</td></tr>
      <tr><td>private</td><td>недоступен</td><td>недоступен</td><td>недоступен</td></tr></table></div>
    <p>private-члены базового класса существуют в наследнике, но обращаться к ним напрямую он не может — только через методы базового. Обычно используют <b>public</b>-наследование.</p>
  </aside>
  <h3>3. Переопределение и виртуальные функции</h3>
  <aside class="add"><span class="tag">дополнение · virtual и полиморфизм</span>
    <ul><li><b>Переопределение (overriding)</b> — в наследнике метод с тем же именем и параметрами, что в базовом.</li>
      <li><b>Виртуальный метод</b> (<code>virtual</code>) — при вызове через указатель или ссылку на базовый класс вызывается версия настоящего класса объекта. Без virtual — версия базового класса (по типу указателя).</li>
      <li><b>Чисто виртуальный</b> метод <code>virtual double area() = 0;</code> — без реализации; класс с ним <b>абстрактный</b>: создать его объект нельзя, только наследников.</li>
      <li>Связь с полиморфизмом: наследование + virtual позволяют обрабатывать разные объекты одним кодом через указатели на базовый класс.</li>
      <li>Если класс используется полиморфно, его деструктор делают <code>virtual</code>, чтобы <code>delete</code> через указатель на базовый вызвал деструктор наследника.</li></ul>
  </aside>
  <h3>4. Иерархия классов VCL в C++Builder</h3>
  <aside class="add"><span class="tag">дополнение · TObject и его наследники</span>
<pre>TObject                    — корень: создание/удаление объектов, информация о типе (RTTI), ClassName()
 └ TPersistent             — умеет сохранять свойства (в файл формы .dfm)
    └ TComponent           — компонент: Name, Owner, Tag; можно положить на форму
       ├ TTimer, TOpenDialog, TMainMenu …   невизуальные компоненты
       └ TControl          — видимый элемент: Left, Top, Width, Height, Visible, Caption, OnClick
          ├ TGraphicControl — без своего окна: TLabel, TImage, TShape, TSpeedButton
          └ TWinControl     — с окном Windows, может получать фокус и содержать другие
             ├ TButton, TCheckBox, TRadioButton (через TButtonControl)
             ├ TEdit, TMemo (через TCustomEdit)
             ├ TListBox, TComboBox
             ├ TPanel, TGroupBox — контейнеры
             └ TForm (через TScrollingWinControl → TCustomForm)</pre>
    <p><b>TObject</b> — базовый класс всех классов VCL: даёт создание и уничтожение объектов (Create/Free, управление памятью) и информацию о типе во время работы (ClassName, ClassParent).</p>
    <p><b>Контейнеры</b> (TPanel, TGroupBox, TPageControl, сама форма) — компоненты, на которых лежат другие: дочерние компоненты двигаются вместе с контейнером, их координаты отсчитываются от него, Visible/Enabled контейнера действуют на всех детей. Свойство <code>Parent</code> у компонента — его контейнер. Создать компонент в программе: <code>TButton *b = new TButton(this); b-&gt;Parent = Panel1;</code>, удалить — <code>delete b;</code>.</p>
  </aside>
</div>`;
const T=[
 {id:'c12-z1',name:'Задание 1 (иерархия, virtual)',cmp:'exact',text:R`<p>Создать абстрактный базовый класс «Фигура» с чисто виртуальными методами площадь и имя; наследники «Круг», «Прямоугольник» и «Квадрат» (наследник прямоугольника). Хранить разные фигуры в массиве указателей на базовый класс и вывести их площади одним циклом.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <math.h>

class Shape
{
public:
  virtual double area() = 0;               // чисто виртуальный: Shape — абстрактный
  virtual const char* name() = 0;
  virtual ~Shape() {}
};

class Circle : public Shape
{
  double r;
public:
  Circle(double r0) { r = r0; }
  double area() { return M_PI * r * r; }
  const char* name() { return "Круг"; }
};

class Rect : public Shape
{
protected:
  double w, h;
public:
  Rect(double a, double b) { w = a; h = b; }
  double area() { return w * h; }
  const char* name() { return "Прямоугольник"; }
};

class Square : public Rect                 // наследник наследника
{
public:
  Square(double a) : Rect(a, a) {}
  const char* name() { return "Квадрат"; }
};

int main()
{
  Shape *f[3];
  f[0] = new Circle(1);
  f[1] = new Rect(2, 5);
  f[2] = new Square(3);
  for (int i = 0; i < 3; i++)
    cout << f[i]->name() << ": " << f[i]->area() << endl;
  for (int i = 0; i < 3; i++)
    delete f[i];
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ol><li><code>= 0</code> делает метод чисто виртуальным, класс Shape — абстрактным (<code>Shape s;</code> — ошибка).</li><li>Каждый наследник переопределяет area и name. Square не переопределяет area — берёт от Rect (w·h).</li><li>Массив указателей на базовый класс хранит разные фигуры; через virtual вызывается метод настоящего объекта.</li></ol>`},
 {id:'c12-z2',name:'Задание 2 (порядок конструкторов и деструкторов)',cmp:'exact',text:R`<p>Иерархия из трёх классов (Транспорт → Автомобиль → Грузовик), в каждом конструкторе и деструкторе вывести сообщение. Создать объект грузовика в блоке и посмотреть порядок вызовов.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Vehicle
{
public:
  Vehicle() { cout << "Vehicle()" << endl; }
  ~Vehicle() { cout << "~Vehicle()" << endl; }
};

class Car : public Vehicle
{
public:
  Car() { cout << "Car()" << endl; }
  ~Car() { cout << "~Car()" << endl; }
};

class Truck : public Car
{
public:
  Truck() { cout << "Truck()" << endl; }
  ~Truck() { cout << "~Truck()" << endl; }
};

int main()
{
  {
    Truck t;
    cout << "--- объект создан ---" << endl;
  }                                    // здесь t уничтожается
  cout << "--- после блока ---" << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Конструкторы — сверху вниз по иерархии (сначала база: «фундамент», потом «этажи»), деструкторы — снизу вверх. Объект уничтожается на закрывающей <code>}</code> блока.</p>`},
 {id:'c12-z3',name:'Задание 3 (virtual и без virtual)',cmp:'exact',text:R`<p>Показать разницу между переопределением обычного и виртуального метода при вызове через указатель на базовый класс.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Base
{
public:
  void plain() { cout << "Base::plain" << endl; }
  virtual void virt() { cout << "Base::virt" << endl; }
};

class Derived : public Base
{
public:
  void plain() { cout << "Derived::plain" << endl; }
  void virt() { cout << "Derived::virt" << endl; }
};

int main()
{
  Derived d;
  Base *p = &d;          // указатель на базовый класс, объект — Derived
  p->plain();            // без virtual — по типу указателя: Base
  p->virt();             // с virtual — по настоящему объекту: Derived
  d.plain();             // через сам объект — его метод
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Без virtual компилятор выбирает метод по типу <b>указателя</b> (Base*), с virtual — по типу <b>объекта</b> во время работы. Это и есть полиморфизм.</p>`},
 {id:'c12-z4',name:'Задание 4 (доступ при наследовании)',cmp:'exact',text:R`<p>Базовый класс с private, protected и public полями. Показать, какие из них доступны в методе наследника и в main.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Base
{
private:   int a;
protected: int b;
public:    int c;
  Base() { a = 1; b = 2; c = 3; }
  int getA() { return a; }
};

class Child : public Base
{
public:
  void show()
  {
    // cout << a;          — ошибка: private базового недоступен даже наследнику
    cout << "a через метод: " << getA() << endl;
    cout << "b (protected): " << b << endl;
    cout << "c (public): " << c << endl;
  }
};

int main()
{
  Child ch;
  ch.show();
  cout << "из main c = " << ch.c << endl;
  // cout << ch.b;       — ошибка: protected из main недоступен
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>protected — «для своих и для детей»: наследник видит b, а main — нет. private не видит даже наследник, только через public-метод getA().</p>`},
 {id:'c12-z5',name:'Задание 5 (множественное наследование)',cmp:'exact',text:R`<p>Класс «Амфибия» наследует от «Автомобиль» и «Лодка». Показать, что объекту доступны методы обоих базовых классов.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Car
{
public:
  void drive() { cout << "Еду по дороге" << endl; }
};

class Boat
{
public:
  void swim() { cout << "Плыву по воде" << endl; }
};

class Amphibian : public Car, public Boat     // два базовых класса
{
public:
  void travel() { drive(); swim(); }
};

int main()
{
  Amphibian a;
  a.drive();
  a.swim();
  cout << "---" << endl;
  a.travel();
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Базовые классы перечисляются через запятую, у каждого свой спецификатор: <code>: public Car, public Boat</code>.</p>`},
];
CPP.topic('c12',{n:12,
 title:'Иерархия классов',
 lecSub:'Наследование, базовый и производный класс, доступ, virtual, абстрактные классы, иерархия VCL от TObject.',
 lecture:LECTURE,
 labs:[{id:'c12-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Иерархия классов',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> понять наследование и иерархии классов и применить их при создании связанных классов.</p><p><b>Что сделать:</b> создать базовый класс; создать производные классы; установить связи между классами; унаследовать свойства и методы базового; добавить новые свойства и методы в производные; переопределить унаследованные методы; использовать разные уровни доступа при наследовании; создать простую иерархию; проверить поведение объектов разных классов.</p></div>`,tasks:T}],
 umkd:[
  ['Что такое иерархия классов?','Система классов, связанных наследованием: базовые классы наверху, производные — ниже (дерево).'],
  ['Что такое наследование?','Механизм создания нового класса на основе существующего: производный класс получает свойства и методы базового и добавляет свои.'],
  ['Что такое базовый класс?','Класс, от которого наследуют (родительский).'],
  ['Что такое производный класс?','Класс, созданный наследованием от базового (дочерний): <code>class Dog : public Animal</code>.'],
  ['Преимущества наследования?','Повторное использование кода, меньше дублирования, логичная структура, расширение без изменения базового класса, полиморфизм.'],
  ['Что такое одиночное наследование?','У класса один базовый класс.'],
  ['Что такое множественное наследование?','У класса несколько базовых классов: <code>class C : public A, public B</code>.'],
  ['Как наследование влияет на public, protected и private?','private базового недоступны наследнику; protected доступны в наследнике, но не снаружи; при public-наследовании public остаются public; при private-наследовании всё становится private.'],
  ['Что такое переопределение метода?','Определение в производном классе метода с той же сигнатурой, что в базовом, чтобы изменить его поведение.'],
  ['Что такое виртуальный метод?','Метод, объявленный virtual; при вызове через указатель/ссылку на базовый класс вызывается версия настоящего класса объекта.'],
  ['Как наследование связано с полиморфизмом?','Наследники переопределяют виртуальные методы базового, и через указатель на базовый класс одним кодом обрабатываются объекты разных классов.'],
  ['Как представить иерархию классов в программе?','Описать базовый класс и производные с указанием базового (class B : public A), при необходимости — virtual-методы; в C++Builder — иерархия VCL от TObject.'],
 ],
 srs:R`<aside class="add"><span class="tag">СРС к теме 12</span><ul><li>TObject и его наследники: у TButton, TEdit, TLabel найти родителей до TObject — схема в п. 4 (TButton → TButtonControl → TWinControl → TControl → TComponent → TPersistent → TObject; TLabel → TCustomLabel → TGraphicControl → TControl → …).</li><li>Назначение TObject — п. 4.</li><li>Контейнеры TPanel, TGroupBox, TPageControl и добавление компонентов в программе — п. 4 и тема 10 (эмулятор).</li></ul></aside>`,
 foot:'Источники: УМКД «Programming I» (тема 12). Эталоны сверены с bcc32.'
});
})();
