/* C++ · Тема 7. Основные понятия и принципы ООП */
(function(){ const R=String.raw;
CPP.DEFS_ORIG=R`<details class="lab-orig"><summary>Определения преподавателя («Полезная инфа», оригинал на английском, под каждым — перевод)</summary><div class="body">
<p>Some definitions of OOP</p>
<p class="ru">Некоторые определения ООП</p>
<p>In Object-oriented programming, Class is a set of data and methods to manipulate the data.</p>
<p class="ru">В ООП класс (Class) — это набор данных и методов (methods) для работы с этими данными.</p>
<p>In Object-oriented programming: class is the definitions for the data format and available functions for a given type.</p>
<p class="ru">В ООП класс — это описание формата данных и доступных функций для данного типа.</p>
<p>Classes in C++ are the abstractions that describes methods, properties of objects that do not exist yet. A class is a blueprint for creating objects that have similar attributes and behaviors.</p>
<p class="ru">Классы в C++ — это абстракции, описывающие методы и свойства ещё не существующих объектов. Класс — это «чертёж» (blueprint) для создания объектов с похожими атрибутами (attributes) и поведением (behaviors).</p>
<p>With the help of one class you can create objects as many as needed.</p>
<p class="ru">С помощью одного класса можно создать сколько угодно объектов.</p>
<p>A class defines the properties and behaviors of objects, whereas an object is an instance of a class.</p>
<p class="ru">Класс задаёт свойства (properties) и поведение (behaviors) объектов, а объект — это экземпляр (instance) класса.</p>
<p>Object is an instance of a class in a memory and it is created with the help of concrete class.</p>
<p class="ru">Объект (Object) — это экземпляр класса в памяти; он создаётся по конкретному классу.</p>
<p>Objects are the instances of classes or a variable of the data type defined by the class.</p>
<p class="ru">Объекты — это экземпляры классов, то есть переменные того типа, который задан классом.</p>
<p>In OOP, Object is an instance of a class in a memory.</p>
<p class="ru">В ООП объект — экземпляр класса в памяти.</p>
<p>Abstraction is the major principle of an OOP that denotes a model, a view, or some other focused representation for an actual item.</p>
<p class="ru">Абстракция (Abstraction) — главный принцип ООП: модель, вид или иное упрощённое представление реального предмета (берём только существенное).</p>
<p>Encapsulation is a principle of OOP, a mechanism that links together the code and the data it manipulates. Encapsulation is a principle of OOP, a special mechanism that protects data from arbitrary access of other external codes. Encapsulation is the major principle of OOP which means that the internal representation of an object is generally hidden from view outside of the object’s definition.</p>
<p class="ru">Инкапсуляция (Encapsulation) — принцип ООП, механизм, который связывает вместе код и данные, с которыми он работает. Это особый механизм, защищающий данные от произвольного доступа внешнего кода. Инкапсуляция означает, что внутреннее устройство объекта скрыто от всего, что находится вне описания объекта.</p>
<p>Encapsulation is the process of hiding the implementation details of a class and only exposing the necessary interfaces to the outside world.</p>
<p class="ru">Инкапсуляция — это скрытие деталей реализации класса и открытие наружу только нужного интерфейса (interface).</p>
<p>Polymorphism is a principle of OOP, a mechanism that allows to use the same interface for a common class of actions. In polymorphism principle: selecting of needed method (for specific object) is performed by compiler. Polymorphism is the major principle of an OOP that allows using same names of identifiers for the different functionality.</p>
<p class="ru">Полиморфизм (Polymorphism) — принцип ООП, механизм, позволяющий использовать один интерфейс для общего класса действий. При полиморфизме выбор нужного метода (для конкретного объекта) выполняет компилятор (compiler). Полиморфизм позволяет использовать одинаковые имена для разной функциональности.</p>
<p>Inheritance is a principle of OOP, a mechanism by which one object (of a derived class) acquires the properties of another object (parent, base class). Inheritance is the major principle of an OOP that allows using attributes and behavior from pre-existing classes.</p>
<p class="ru">Наследование (Inheritance) — принцип ООП, механизм, при котором один объект (производного класса, derived class) получает свойства другого объекта (родителя, базового класса — parent, base class). Наследование позволяет использовать атрибуты и поведение уже существующих классов.</p>
<p>Method is a special function of a class that specifies operations on objects data (specifies its behavior). Methods are the actions performed by the component (what a component can do).</p>
<p class="ru">Метод (Method) — специальная функция класса, задающая операции над данными объекта (его поведение). Методы — это действия, которые выполняет компонент (что он умеет).</p>
<p>In object-oriented programming: method is a function associated with a class.</p>
<p class="ru">В ООП метод — функция, связанная с классом.</p>
<p>Method is an action that an object is able to perform.</p>
<p class="ru">Метод — действие, которое объект умеет выполнять.</p>
<p>Constructor is a special method that is called once when a class’ instance is created. The initialization of all elements of a class (common for all class instances) is made in constructor.</p>
<p class="ru">Конструктор (Constructor) — специальный метод, который вызывается один раз при создании экземпляра класса. Инициализация всех элементов класса (общая для всех экземпляров) делается в конструкторе.</p>
<p>In OOP, property is a variable of some type that characterizes internal status of an object. Properties are the component attributes which determine how a component displayed on the screen and how it operates.</p>
<p class="ru">В ООП свойство (property) — переменная какого-то типа, описывающая внутреннее состояние объекта. Свойства — это атрибуты компонента, определяющие, как он выглядит на экране и как работает.</p>
<p>OOP: Event is a message from the operating system to an application that if occurs when some external actions are made. Event is a message which occurs at various points in the executable code when certain conditions are performed.</p>
<p class="ru">Событие (Event) — сообщение от операционной системы приложению, возникающее при каких-то внешних действиях. Событие — сообщение, возникающее в разных местах выполняемого кода при выполнении определённых условий.</p>
<p>Event handler is a special procedure/function that is used to react at some actions (usually made by user).</p>
<p class="ru">Обработчик события (Event handler) — специальная процедура/функция для реакции на какие-то действия (обычно пользователя).</p>
<p>Form is the main element of any application; the container that hosts all other visual and non-visual components.</p>
<p class="ru">Форма (Form) — главный элемент любого приложения; контейнер, в котором находятся все остальные визуальные и невизуальные компоненты.</p>
<p>Object Inspector is a part of C++ Builder IDE that is used to examine and edit the properties and events for the currently selected object. A component’s properties are set in Object Inspector</p>
<p class="ru">Object Inspector (инспектор объектов) — часть среды C++ Builder (IDE — среда разработки) для просмотра и изменения свойств и событий выбранного объекта. Свойства компонента задаются в Object Inspector.</p>
<p>Code Editor is a part of a C++ Builder IDE that holds the set of a program commands.</p>
<p class="ru">Code Editor (редактор кода) — часть среды C++ Builder, где хранится набор команд программы.</p>
<p>Components are the self-contained building blocks that are carried on the form to create your applications.</p>
<p class="ru">Компоненты (Components) — самостоятельные «кирпичики», которые кладут на форму, чтобы собрать приложение.</p>
<p>The components that look the same at the design stage and during the application execution are called the Visual components. Visual components are also called Controls.</p>
<p class="ru">Компоненты, которые выглядят одинаково при проектировании (design stage) и во время работы программы, называются визуальными (Visual components). Их ещё называют элементами управления (Controls).</p>
<p>The components that invisible during the application execution are called Non-visual.</p>
<p class="ru">Компоненты, невидимые во время работы программы, называются невизуальными (Non-visual).</p>
</div></details>`;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 7 из УМКД (перевод) + определения преподавателя из файла «Полезная инфа» — их формулировки почти дословно бывают в тестах, учи их. Остальное — мои пояснения.</aside>
  <h2 id="c7-lec">Лекция 7. Основные понятия и принципы объектно-ориентированного программирования</h2>
  <p><b>Цель:</b> познакомить с объектно-ориентированным подходом, его основными понятиями и принципами.</p>
  <p><b>Основные пункты:</b> понятие ООП; отличия процедурного и объектно-ориентированного программирования; основные понятия ООП: объект, класс, атрибут, метод; принципы ООП: инкапсуляция, наследование, полиморфизм, абстракция; состояние и поведение объекта; моделирование объектов реального мира; взаимодействие объектов; преимущества ООП; области применения.</p>
  ${''}
</div>
<div class="read">` + CPP.DEFS_ORIG + R`
  <h3>1. Процедурный и объектный подход</h3>
  <aside class="add"><span class="tag">дополнение · ООП</span>
    <p><b>Объектно-ориентированное программирование (ООП)</b> — подход, при котором программа строится из <b>объектов</b>, а каждый объект объединяет <b>данные</b> (что он знает) и <b>методы</b> (что он умеет).</p>
    <div class="tw"><table><tr><th></th><th>Процедурный подход (темы 1–6)</th><th>ООП (темы 7–15)</th></tr>
      <tr><td>Основа</td><td>функции и последовательность действий</td><td>объекты и их взаимодействие</td></tr>
      <tr><td>Данные</td><td>отдельно от функций, часто глобальные</td><td>внутри объекта, защищены</td></tr>
      <tr><td>Пример</td><td><code>double area(double w, double h)</code></td><td><code>Rect r(3,4); r.area();</code></td></tr>
      <tr><td>Для больших программ</td><td>трудно сопровождать</td><td>проще расширять и переиспользовать</td></tr></table></div>
  </aside>
  <h3>2. Класс, объект, атрибут, метод</h3>
  <aside class="add"><span class="tag">дополнение · основные понятия</span>
    <ul>
      <li><b>Класс (class)</b> — набор данных и методов для работы с этими данными; «чертёж» (blueprint) для создания объектов с одинаковыми свойствами и поведением. Сам класс — это описание, объектов ещё нет.</li>
      <li><b>Объект (object)</b> — экземпляр (instance) класса в памяти. По одному классу можно создать сколько угодно объектов: класс Dog → объекты rex, buddy.</li>
      <li><b>Атрибут / поле / свойство</b> — переменная внутри класса, описывает <b>состояние</b> объекта (имя, порода, возраст).</li>
      <li><b>Метод</b> — функция класса, описывает <b>поведение</b> объекта — действие, которое объект умеет выполнять (bark(), walk()).</li>
      <li><b>Состояние</b> объекта — текущие значения его полей; <b>поведение</b> — набор его методов.</li>
    </ul>
<pre class="cpp-code">class Dog                     // класс — чертёж
{
public:
  string name, breed;         // атрибуты (состояние)
  void bark()                 // метод (поведение)
  { cout &lt;&lt; name &lt;&lt; ": Woof!" &lt;&lt; endl; }
};
Dog rex;                      // объект — экземпляр класса
rex.name = "Rex"; rex.bark();</pre>
  </aside>
  <h3>3. Четыре принципа ООП</h3>
  <aside class="add"><span class="tag">дополнение · принципы</span>
    <ul>
      <li><b>Инкапсуляция (encapsulation)</b> — объединение данных и кода, который с ними работает, в одном объекте и <b>защита данных</b> от произвольного доступа извне. Детали реализации скрыты (private), наружу открыт только нужный интерфейс (public методы get/set).</li>
      <li><b>Наследование (inheritance)</b> — механизм, при котором объект производного (дочернего) класса получает свойства и поведение базового (родительского) класса и может добавить свои. Poodle наследует Dog.</li>
      <li><b>Полиморфизм (polymorphism)</b> — «один интерфейс — много реализаций»: одинаковые имена методов для разных действий. make_sound() у собаки лает, у кошки мяукает. Нужный метод выбирается для конкретного объекта.</li>
      <li><b>Абстракция (abstraction)</b> — модель реального предмета, в которой оставлено только важное для задачи. Для библиотеки у книги важны название и автор, а цвет обложки — нет.</li>
    </ul>
    <p><b>Инкапсуляция и абстракция — в чём разница:</b> абстракция решает, <b>что</b> показать (какие свойства и действия есть у модели); инкапсуляция — <b>как спрятать</b> всё остальное и защитить данные.</p>
    <p><b>Преимущества ООП:</b> программа ближе к реальному миру; код переиспользуется через наследование; данные защищены; легко расширять (новый класс-наследник), командная разработка. <b>Где применяется:</b> программы с окнами (C++Builder: форма, кнопки — это объекты), игры, базы данных, моделирование.</p>
  </aside>
</div>`;
const T=[
 {id:'c7-z1',name:'Задание 1 (СРС УМКД)',cmp:'exact',text:R`<p>Создайте класс Dog со свойствами (properties) name (кличка) и breed (порода) и методом bark() (лаять). Создайте несколько объектов Dog (например, my_dog = Dog("Buddy", "Golden Retriever")) и убедитесь, что это разные экземпляры (instances) одного класса.</p><details class="en"><summary>Оригинал (англ.)</summary><p>Create a Dog class with properties like name and breed, and methods like bark(). Instantiate multiple Dog objects (e.g., my_dog = Dog("Buddy", "Golden Retriever")) to see how they are distinct instances of the same class.</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Dog
{
public:
  string name, breed;
  Dog(string n, string b) { name = n; breed = b; }   // конструктор
  void bark() { cout << name << " (" << breed << "): Woof!" << endl; }
};

int main()
{
  Dog my_dog("Buddy", "Golden Retriever");
  Dog other("Rex", "German Shepherd");
  my_dog.bark();
  other.bark();
  other.name = "Max";            // меняем только один объект
  my_dog.bark();
  other.bark();
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ol><li>Класс объявляется словом <code>class</code>, внутри — поля и методы, после <code>}</code> — точка с запятой.</li><li><code>public:</code> — члены доступны снаружи.</li><li>Конструктор <code>Dog(string n, string b)</code> заполняет поля при создании: <code>Dog my_dog("Buddy", "Golden Retriever");</code></li><li>У каждого объекта свои поля: изменили имя у other — my_dog не изменился.</li></ol>`},
 {id:'c7-z2',name:'Задание 2 (инкапсуляция, СРС УМКД)',cmp:'exact',text:R`<p>В классе Dog сделайте атрибут name закрытым (private). Создайте метод get_name() (получить имя) и метод set_name() (изменить имя), чтобы имя нельзя было менять напрямую. От себя: set_name не должен принимать пустое имя.</p><details class="en"><summary>Оригинал (англ.)</summary><p>In your Dog class, make the name attribute private. Create a get_name() method to retrieve the name and a set_name() method to change it, preventing direct modification of the name.</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Dog
{
private:
  string name;                   // напрямую снаружи не изменить
public:
  string breed;
  Dog(string n, string b) { name = n; breed = b; }
  string get_name() { return name; }
  void set_name(string n)
  {
    if (n == "") cout << "Имя не может быть пустым" << endl;
    else name = n;
  }
};

int main()
{
  Dog d("Buddy", "Golden Retriever");
  cout << d.get_name() << endl;
  d.set_name("Charlie");
  cout << d.get_name() << endl;
  d.set_name("");
  cout << d.get_name() << endl;
  // d.name = "X";   — ошибка: 'Dog::name' is not accessible
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Это и есть инкапсуляция: поле закрыто, а методы-«ворота» проверяют данные. Раскомментируй строку <code>d.name = "X";</code> и запусти — Builder выдаст E2247 «is not accessible» («недоступен»).</p>`},
 {id:'c7-z3',name:'Задание 3 (абстракция, СРС УМКД)',cmp:'exact',text:R`<p>В классе Dog создайте метод perform_action() (выполнить действие), который вызывает другие закрытые (private) методы, например walk() (гулять) или fetch() (принести палку). Пользователю достаточно вызвать perform_action(), не зная, как устроены методы внутри.</p><details class="en"><summary>Оригинал (англ.)</summary><p>In the Dog class, create a perform_action() method that calls other private methods like walk() or fetch(). Users only need to call perform_action() without knowing the details of the underlying methods.</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Dog
{
private:
  string name;
  void walk() { cout << name << " гуляет" << endl; }
  void fetch() { cout << name << " приносит мяч" << endl; }
public:
  Dog(string n) { name = n; }
  void perform_action()
  {
    walk();                      // внутри класса закрытые методы доступны
    fetch();
    cout << name << " доволен!" << endl;
  }
};

int main()
{
  Dog d("Buddy");
  d.perform_action();            // walk() и fetch() снаружи не видны
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Снаружи видна только простая «кнопка» perform_action(), а как она работает — скрыто. Это абстракция: пользователь видит главное, детали спрятаны.</p>`},
 {id:'c7-z4',name:'Задание 4 (наследование, СРС УМКД)',cmp:'exact',text:R`<p>Создайте класс Poodle (пудель), который наследует (inherits) Dog. Дайте ему свои атрибуты (например, coat_type — тип шерсти) и поведение (например, does_grooming() — стрижётся ли), при этом он получает все свойства и методы класса Dog.</p><details class="en"><summary>Оригинал (англ.)</summary><p>Create a Poodle class that inherits from Dog. Give Poodle its own unique attributes (like coat_type) and behaviors (like does_grooming()), while also getting all the properties and methods of the Dog class.</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Dog
{
public:
  string name, breed;
  Dog(string n, string b) { name = n; breed = b; }
  void bark() { cout << name << ": Woof!" << endl; }
};

class Poodle : public Dog          // Poodle — наследник Dog
{
public:
  string coat_type;
  Poodle(string n, string coat) : Dog(n, "Poodle") { coat_type = coat; }
  void does_grooming() { cout << name << " стрижётся, шерсть: " << coat_type << endl; }
};

int main()
{
  Poodle p("Fifi", "кудрявая");
  p.bark();                        // метод унаследован от Dog
  p.does_grooming();               // свой метод
  cout << p.name << " — порода " << p.breed << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ol><li><code>class Poodle : public Dog</code> — Poodle получает всё открытое из Dog.</li><li>Конструктор наследника вызывает конструктор базового в списке инициализации: <code>: Dog(n, "Poodle")</code>.</li><li>Объекту Poodle доступны и <code>bark()</code> (из Dog), и <code>does_grooming()</code> (свой).</li></ol>`},
 {id:'c7-z5',name:'Задание 5 (полиморфизм, СРС УМКД)',cmp:'exact',text:R`<p>В классе Dog создайте метод make_sound() (издать звук). В классе Cat (тоже Animal — животное) создайте свой метод make_sound(). При вызове make_sound() у объекта Dog должно быть "bark" (гав), а у объекта Cat — "meow" (мяу). Как сделать: базовый класс Animal с виртуальным (virtual) make_sound(), Dog и Cat его переопределяют; вызов через указатель на Animal сам выбирает нужный метод.</p><details class="en"><summary>Оригинал (англ.)</summary><p>In the Dog class, create a make_sound() method. In a Cat class (also an Animal), create its own make_sound() method. When you call make_sound() on a Dog object, it should "bark," and on a Cat object, it should "meow".</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Animal
{
public:
  string name;
  Animal(string n) { name = n; }
  virtual void make_sound() { cout << name << ": ..." << endl; }
};

class Dog : public Animal
{
public:
  Dog(string n) : Animal(n) {}
  void make_sound() { cout << name << ": Woof! (bark)" << endl; }
};

class Cat : public Animal
{
public:
  Cat(string n) : Animal(n) {}
  void make_sound() { cout << name << ": Meow!" << endl; }
};

int main()
{
  Dog d("Buddy");
  Cat c("Tom");
  Animal *zoo[2] = { &d, &c };      // указатели на базовый класс
  for (int i = 0; i < 2; i++)
    zoo[i]->make_sound();           // вызывается метод настоящего класса объекта
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Метод в базовом классе помечен <code>virtual</code>. Тогда вызов <code>zoo[i]-&gt;make_sound()</code> через указатель на Animal выбирает метод <b>настоящего</b> объекта: для Dog — лай, для Cat — мяуканье. Убери <code>virtual</code> — оба напечатают «...».</p>`},
];
CPP.topic('c7',{n:7,
 title:'Основные понятия и принципы объектно-ориентированного программирования',
 lecSub:'ООП и процедурный подход, класс, объект, атрибут, метод, инкапсуляция, наследование, полиморфизм, абстракция, определения преподавателя.',
 lecture:LECTURE,
 labs:[{id:'c7-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Основные понятия и принципы ООП — Dog, Poodle, Cat',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> познакомить с основными понятиями и принципами ООП и научить применять их к задачам программирования.</p><p><b>Что сделать:</b> выделить объекты предметной области; определить свойства и поведение объектов; проанализировать разницу процедурного и объектного подходов; выделить классы и их связи; применить инкапсуляцию, абстракцию, наследование, полиморфизм; разработать концептуальную модель простого ОО-приложения; описать взаимодействие объектов.</p></div>`,
  note:R`<aside class="fix"><span class="tag">о лабе</span> Задания — из СРС УМКД к теме 7 (на английском, с переводом). В УМКД у них синтаксис Python (my_dog = Dog(...)) — у нас всё на C++.</aside>`,tasks:T}],
 umkd:[
  ['Что такое объектно-ориентированное программирование?','Подход, в котором программа строится из объектов — экземпляров классов, объединяющих данные и методы для работы с ними.'],
  ['Основные понятия ООП?','Класс, объект, атрибут (свойство, поле), метод; принципы — инкапсуляция, наследование, полиморфизм, абстракция.'],
  ['Что такое класс?','Набор данных и методов для работы с ними; шаблон (чертёж), по которому создаются объекты с одинаковыми свойствами и поведением.'],
  ['Что такое объект?','Экземпляр класса в памяти — переменная типа, определённого классом.'],
  ['Что такое инкапсуляция?','Объединение данных и кода, работающего с ними, в одном объекте и защита данных от произвольного доступа извне (скрытие реализации).'],
  ['Что такое наследование?','Механизм, при котором производный класс получает свойства и поведение базового и может добавить свои.'],
  ['Что такое полиморфизм?','Возможность использовать один интерфейс (одно имя метода) для разных действий; нужный метод выбирается для конкретного объекта.'],
  ['Что такое абстракция?','Модель реального предмета, отражающая только важные для задачи свойства и поведение.'],
  ['Чем отличаются инкапсуляция и абстракция?','Абстракция определяет, что показать (существенные свойства), инкапсуляция — прячет детали реализации и защищает данные.'],
  ['Преимущества объектно-ориентированного подхода?','Близость к реальному миру, повторное использование кода (наследование), защита данных, простота расширения и сопровождения больших программ.'],
  ['Разница между процедурным и объектно-ориентированным подходом?','Процедурный — программа как набор функций над отдельными данными; ООП — набор взаимодействующих объектов, в которых данные и функции объединены.'],
  ['Как сущности реального мира представляются объектами и классами?','Общие свойства и действия группы предметов описываются классом (поля и методы), конкретные предметы — объекты этого класса со своими значениями полей.'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 7 и задания СРС), файл «Полезная инфа» (определения преподавателя). Эталоны сверены с bcc32.'
});
})();
