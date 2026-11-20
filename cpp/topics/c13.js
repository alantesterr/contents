/* C++ · Тема 13. Пользовательский класс. Конструктор и деструктор */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 13 из УМКД (перевод), задание Book из СРС УМКД, моя лекция.</aside>
  <h2 id="c13-lec">Лекция 13. Создание пользовательского класса. Конструктор и деструктор</h2>
  <p><b>Цель:</b> научить создавать пользовательские классы и управлять созданием и уничтожением объектов с помощью конструкторов и деструкторов.</p>
  <p><b>Основные пункты:</b> проектирование класса; объявление и определение класса; поля и методы; понятие и назначение конструктора; конструктор по умолчанию; конструктор с параметрами; конструктор копирования; перегрузка конструкторов; вызов конструкторов при создании объектов; понятие и назначение деструктора; синтаксис деструктора; освобождение ресурсов; время жизни объекта; вызов деструктора при уничтожении объекта.</p>
  <aside class="add"><span class="tag">дополнение · конструктор</span>
    <p><b>Конструктор</b> — специальный метод, который вызывается <b>один раз автоматически при создании объекта</b> и инициализирует его поля. Имя = имя класса, <b>типа результата нет</b> (даже void).</p>
<pre class="cpp-code">class Book
{
  string title; int year;
public:
  Book() : title("Unknown"), year(0) {}                  // по умолчанию (без параметров)
  Book(string t, int y) { title = t; year = y; }         // с параметрами
  Book(const Book &amp;b) { title = b.title; year = b.year; } // копирования
  ~Book() { cout &lt;&lt; "~Book " &lt;&lt; title &lt;&lt; endl; }        // деструктор
};
Book a;                    // Book()
Book b("1984", 1949);      // Book(string, int)
Book c = b;                // конструктор копирования
Book *p = new Book("X", 2000);  …  delete p;   // деструктор при delete</pre>
    <ul><li><b>По умолчанию</b> — без параметров (или все с умолчаниями). Если не написать ни одного конструктора, компилятор создаст пустой. Если написан только конструктор с параметрами — <code>Book a;</code> уже нельзя.</li>
      <li><b>Список инициализации</b> <code>: title("Unknown"), year(0)</code> — поля инициализируются до входа в тело; обязателен для const-полей, ссылок и вызова конструктора базового класса.</li>
      <li><b>Перегрузка конструкторов</b> — несколько конструкторов с разными параметрами; выбирается по аргументам.</li>
      <li><b>Конструктор копирования</b> <code>Класс(const Класс &amp;)</code> вызывается, когда объект создаётся из другого: <code>Book c = b;</code>, передача объекта в функцию по значению, возврат по значению.</li>
      <li><b>Когда вызывается конструктор:</b> при объявлении объекта, при <code>new</code>, при создании временного объекта <code>Book("A", 1)</code>, для каждого элемента массива объектов.</li></ul>
  </aside>
  <aside class="add"><span class="tag">дополнение · деструктор и время жизни</span>
    <p><b>Деструктор</b> <code>~Имя()</code> — вызывается автоматически при уничтожении объекта: без параметров и типа, один на класс. Назначение — освободить ресурсы: память, выделенную через new (<code>delete[]</code>), открытые файлы.</p>
    <p><b>Когда вызывается:</b> локальный объект — при выходе из блока <code>{ }</code> (в обратном порядке создания); глобальный — после завершения main; динамический — при <code>delete</code>; параметр по значению — при выходе из функции.</p>
    <p><b>Жизненный цикл объекта:</b> выделение памяти → конструктор → использование (вызов методов) → деструктор → освобождение памяти.</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · для теста на английском</span>
    <ul>
      <li><b>Constructor</b> (конструктор) — <i>a special method that is called once when a class' instance is created</i> (вызывается один раз при создании объекта). <i>The initialization of all elements of a class is made in the constructor</i> — начальные значения полей задают в конструкторе.</li>
      <li><b>Destructor</b> (деструктор) — вызывается при уничтожении объекта, имя с тильдой: <code>~TBook()</code>. У формы: <code>__fastcall ~TForm1();</code></li>
    </ul>
  </aside>
  <h3 id="c13-book">Из учебника МГУ: конструкторы и деструкторы подробно</h3>
  <aside class="add"><span class="tag">книга преподавателя · глава 4 кратко</span>
    <p>Конструктор — «то, что область памяти превращает в объект» (Страуструп). Имя = имя класса, тип результата не пишут. Деструктор <code>~Имя()</code> — без параметров, один на класс.</p>
    <div class="tw"><table><tr><th>Вид конструктора</th><th>Прототип для класса X</th><th>Пример объявления объекта</th></tr>
      <tr><td>умолчания (без параметров)</td><td><code>X()</code> или все параметры по умолчанию</td><td><code>X x1;</code></td></tr>
      <tr><td>преобразования (один параметр другого типа)</td><td><code>X(T)</code>, <code>X(T&amp;)</code>, <code>X(const T&amp;)</code></td><td><code>box b3(5);</code></td></tr>
      <tr><td>копирования</td><td><code>X(X&amp;)</code>, <code>X(const X&amp;)</code></td><td><code>box b6 = b5;</code> или <code>box b7(b5);</code></td></tr>
      <tr><td>с двумя и более параметрами</td><td><code>X(int, int, int)</code></td><td><code>box b2(1,2,3);</code></td></tr></table></div>
    <ul>
      <li><b>explicit</b> запрещает неявный вызов конструктора преобразования: без него <code>stack st1 = 15;</code> молча создаст стек на 15 элементов.</li>
      <li><b>Поверхностное копирование</b> — почленное копирование полей (так работает конструктор копирования, который компилятор создаёт сам). Если в классе есть память из <code>new</code>, нужно <b>глубокое копирование</b>: выделить новую память и скопировать содержимое, иначе два объекта будут указывать на один массив.</li>
      <li><code>box b2 = b3;</code> при объявлении — конструктор копирования; <code>b2 = b3;</code> для уже созданного — <b>операция присваивания</b> (её тоже придётся перегрузить для глубокого копирования).</li>
      <li><b>Что создаётся само:</b> если нет ни одного конструктора — пустой конструктор умолчания; если описан хоть один конструктор — конструктора умолчания уже <b>не будет</b>. Конструктор копирования (поверхностный) и пустой деструктор создаются всегда, если их не описали.</li>
      <li><b>Список инициализации</b> <code>Point(int x1, int y1) : x(x1), y(y1) {}</code> — единственный способ вызвать конструктор с параметрами для поля-объекта и для базового класса. Писать <code>Point p2(2,3);</code> прямо в описании класса нельзя.</li>
      <li><b>Порядок вызова конструкторов</b>: базовые классы → поля-объекты (в порядке объявления в классе) → собственный конструктор. <b>Деструкторы</b> — в обратном порядке.</li>
      <li><b>Конструктор копирования вызывается</b>: при инициализации объекта другим объектом; временным объектом <code>box c = box(3,4,5);</code>; при передаче объекта в функцию <b>по значению</b>; при возврате объекта из функции.</li>
      <li><b>Деструктор вызывается</b>: при выходе из блока, где объявлен объект; для временных объектов сразу после выражения; при <code>delete</code>; при завершении программы — для глобальных и static-объектов.</li>
      <li>Для массива объектов <code>X *x1 = new X[10];</code> нужен конструктор умолчания, а удалять надо <code>delete [] x1;</code>.</li>
    </ul>
  </aside>
</div>`;
const BOOK=R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Book
{
private:
  string title;
  string author;
  int publicationYear;
  string isbn;
  bool isAvailable;
public:
  // Default Constructor
  Book() : title("Unknown"), author("Unknown"), publicationYear(0), isbn("Unknown"), isAvailable(true) {}
  // Parameterized Constructor
  Book(string t, string a, int y, string i)
  {
    title = t; author = a; publicationYear = y; isbn = i; isAvailable = true;
  }
  // Accessors (Getters)
  string getTitle() const { return title; }
  string getAuthor() const { return author; }
  int getPublicationYear() const { return publicationYear; }
  string getISBN() const { return isbn; }
  bool getAvailability() const { return isAvailable; }
  // Mutators (Setters)
  void setPublicationYear(int year)
  {
    if (year >= 1000 && year <= 2026) publicationYear = year;
    else cout << "Error: year " << year << " is not between 1000 and 2026" << endl;
  }
  void setIsbn(const string& newIsbn) { isbn = newIsbn; }
  void setTitle(const string& t) { title = t; }
  void setAuthor(const string& a) { author = a; }
  // Additional Member Functions
  void displayBookInfo() const
  {
    cout << "Title: " << title << ", Author: " << author << ", Year: " << publicationYear
         << ", ISBN: " << isbn << ", " << (isAvailable ? "Available" : "Checked Out") << endl;
  }
  void checkOut()
  {
    if (isAvailable) { isAvailable = false; cout << title << " has been successfully checked out." << endl; }
    else cout << title << " is unavailable (already checked out)." << endl;
  }
  void returnBook()
  {
    if (!isAvailable) { isAvailable = true; cout << title << " has been successfully returned." << endl; }
    else cout << title << " is already in the library." << endl;
  }
};

int main()
{
  Book b1;                                                   // default
  Book b2("1984", "George Orwell", 1949, "978-0451524935");  // parameterized
  Book b3("Abai Zholy", "Mukhtar Auezov", 1942, "978-6010101");
  b1.displayBookInfo();
  b2.displayBookInfo();
  b3.displayBookInfo();
  cout << "--- checkOut / returnBook ---" << endl;
  b2.checkOut();
  b2.checkOut();          // edge case: already checked out
  b2.returnBook();
  b2.returnBook();        // edge case: already in the library
  cout << "--- setPublicationYear validation ---" << endl;
  b1.setPublicationYear(500);
  b1.setPublicationYear(2001);
  b1.setTitle("Untitled");
  b1.setIsbn("000-0");
  b1.displayBookInfo();
  cout << "Getter: " << b3.getTitle() << " by " << b3.getAuthor() << ", " << b3.getPublicationYear() << endl;
  getch();
  return 0;
}`;
const T=[
 {id:'c13-z1',name:'Задание 1 (класс Book из УМКД)',cmp:'exact',text:R`<p><b>Создайте класс Book (книга), моделирующий настоящую книгу.</b> В классе должны быть закрытые (private) поля: <code>std::string title;</code> (название) <code>std::string author;</code> (автор) <code>int publicationYear;</code> (год издания) <code>std::string isbn;</code> (номер ISBN) <code>bool isAvailable;</code> (есть ли в библиотеке).</p>
<p><b>Конструкторы (public):</b> конструктор по умолчанию (Default Constructor) — ставит title, author и isbn в "Unknown" (неизвестно), publicationYear в 0, isAvailable в true. Конструктор с параметрами (Parameterized Constructor) — принимает title, author, publicationYear и isbn и полностью заполняет объект.</p>
<p><b>Геттеры (Accessors / Getters — методы чтения):</b> константные (const) методы для всех закрытых полей: getTitle(), getAuthor(), getPublicationYear(), getISBN(), getAvailability().</p>
<p><b>Сеттеры (Mutators / Setters — методы изменения):</b> <code>void setPublicationYear(int year);</code> (меняет год, только если он от 1000 до текущего года; иначе печатает сообщение об ошибке), <code>void setIsbn(const std::string&amp; newIsbn);</code></p>
<p><b>Дополнительно:</b> <code>void displayBookInfo() const;</code> — печатает все данные книги и "Available" (в наличии) или "Checked Out" (выдана). <code>void checkOut();</code> (выдать книгу) — ставит isAvailable в false и печатает "[Title] has been successfully checked out." («книга успешно выдана»), только если книга была в наличии, иначе — сообщение, что её нет. <code>void returnBook();</code> (вернуть книгу) — ставит isAvailable в true и печатает "[Title] has been successfully returned." («книга успешно возвращена»), только если она была выдана, иначе — что она уже в библиотеке.</p>
<p>Создайте минимум три объекта Book, используя оба конструктора. Покажите работу всех public-методов, включая крайние случаи и проверку в setPublicationYear(). Используйте хотя бы один геттер.</p>
<p><i>Что оценивается (Grading Focus): правильная структура класса, private/public, конструкторы, геттеры, сеттеры, логика checkOut и returnBook.</i></p>
<details class="en"><summary>Оригинал (англ.)</summary><p><b>Create a class named Book to model a physical book.</b> Your class must include the following private data members: <code>std::string title; std::string author; int publicationYear; std::string isbn; bool isAvailable;</code></p>
<p><b>Constructors (Public):</b> Default Constructor: Initializes title, author, and isbn to "Unknown", publicationYear to 0, and isAvailable to true. Parameterized Constructor: Takes arguments for title, author, publicationYear, and isbn to fully initialize a book object.</p>
<p><b>Accessors (Getters):</b> constant getter methods for all private data members: getTitle(), getAuthor(), getPublicationYear(), getISBN(), getAvailability().</p>
<p><b>Mutators (Setters):</b> <code>void setPublicationYear(int year);</code> (only if the year is between 1000 and the current year; otherwise, print an error message), <code>void setIsbn(const std::string&amp; newIsbn);</code></p>
<p><b>Additional:</b> <code>void displayBookInfo() const;</code> — prints all book information and "Available" or "Checked Out". <code>void checkOut();</code> — sets isAvailable to false, prints "[Title] has been successfully checked out." only if the book was available, otherwise a message that it's unavailable. <code>void returnBook();</code> — sets isAvailable to true, prints "[Title] has been successfully returned." only if it was checked out, otherwise that it's already in the library.</p>
<p>Create at least three Book objects using a mix of the default and parameterized constructors. Demonstrate the use of all public methods, including edge cases and validation in setPublicationYear(). Use at least one getter.</p>
<p><i>Grading Focus: correct class structure, private/public, constructors, getters, setters, logic of checkOut and returnBook.</i></p></details>`,
  note:R`<aside class="add"><span class="tag">как проверяется</span> Это задание из СРС УМКД (на английском, как у преподавателя). Окно сравнивает вывод построчно. Тексты сообщений можно сделать своими — тогда смотри на логику, а не на ✗. Текущий год — 2026.</aside>`,
  ref:BOOK, ins:[['Без ввода','']],
  steps:R`<ol><li><b>private</b> — все пять полей; <b>public</b> — конструкторы и методы.</li><li>Конструктор по умолчанию — через список инициализации; с параметрами — присваиванием в теле (оба способа правильные).</li><li>Getters — <code>const</code>: они только читают объект.</li><li>setPublicationYear проверяет диапазон 1000…2026 — пример проверки данных в сеттере.</li><li>checkOut/returnBook сначала смотрят текущее состояние isAvailable — это и есть «edge cases».</li><li>В main: b1 — конструктор по умолчанию, b2 и b3 — с параметрами; вызваны все методы.</li></ol>`},
 {id:'c13-z2',name:'Задание 2 (порядок вызовов, время жизни)',cmp:'exact',text:R`<p>Класс с конструктором по умолчанию, с параметром, копирования и деструктором; каждый печатает сообщение. Создать локальные объекты, объект в блоке, динамический, передать объект в функцию по значению и посмотреть порядок вызовов.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Tracer
{
  int id;
public:
  Tracer() { id = 0; cout << "ctor default #" << id << endl; }
  Tracer(int n) { id = n; cout << "ctor(int) #" << id << endl; }
  Tracer(const Tracer &t) { id = t.id * 10; cout << "copy #" << t.id << " -> #" << id << endl; }
  ~Tracer() { cout << "dtor #" << id << endl; }
};

void f(Tracer t)                     // по значению: копия
{
  cout << "внутри f" << endl;
}                                    // копия t уничтожается здесь

int main()
{
  cout << "--- main ---" << endl;
  Tracer a;
  Tracer b(2);
  {
    Tracer c(3);
  }                                  // c уничтожается здесь
  f(b);
  Tracer *p = new Tracer(4);
  delete p;                          // деструктор динамического объекта
  cout << "--- конец main ---" << endl;
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<div class="trap"><b>Важно про Builder:</b> глобальный объект, который в конструкторе печатает через <code>cout</code>, в C++Builder 6 роняет программу при запуске — глобальные объекты создаются раньше, чем готов <code>cout</code> (проверено на bcc32). Поэтому глобального объекта в примере нет.</div><p>Порядок: локальные — по мере объявления; при выходе из блока — деструктор; при передаче по значению работает конструктор копирования, а копия удаляется при выходе из функции; динамический живёт до delete; в конце main локальные уничтожаются в обратном порядке (b, потом a).</p>`},
 {id:'c13-z3',name:'Задание 3 (ресурсы в деструкторе)',cmp:'exact',text:R`<p>Класс «Динамический массив»: конструктор выделяет память под n чисел через new, деструктор её освобождает. Методы: заполнить, сумма, вывод.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class IntArray
{
  int *data;
  int n;
public:
  IntArray(int size)
  {
    n = size;
    data = new int[n];                // захват ресурса
    cout << "выделено " << n << " чисел" << endl;
  }
  ~IntArray()
  {
    delete[] data;                    // освобождение ресурса
    cout << "память освобождена" << endl;
  }
  void fill() { for (int i = 0; i < n; i++) data[i] = (i + 1) * (i + 1); }
  int sum() { int s = 0; for (int i = 0; i < n; i++) s += data[i]; return s; }
  void show() { for (int i = 0; i < n; i++) cout << data[i] << " "; cout << endl; }
};

int main()
{
  int n;
  cout << "n = ";
  cin >> n;
  {
    IntArray a(n);
    a.fill();
    a.show();
    cout << "Сумма = " << a.sum() << endl;
  }
  cout << "Готово" << endl;
  getch();
  return 0;
}`, ins:[['5','5'],['10','10']],
  steps:R`<p>Классический пример: конструктор <b>захватывает</b> ресурс (new), деструктор <b>освобождает</b> (delete[]). Пользователь класса про память вообще не думает — она освободится сама при выходе из блока.</p>`},
 {id:'c13-z4',name:'Задание 4 (СРС УМКД: член класса в public / private / protected)',cmp:'exact',text:R`<p>Создайте класс с тремя членами: конструктор, целое поле (int) и метод, который меняет это поле. Посмотрите, как меняется поведение программы, если члены класса поместить в секции public (открытая), private (закрытая) и protected (защищённая).</p><p><i>Попробуй перенести конструктор, поле и метод в разные секции и прочитай ошибки компилятора.</i></p><details class="en"><summary>Оригинал (англ.)</summary><p>Create a class with three class members: a constructor, an integer field, and a method that modifies that field. Explore how the program's behavior changes when class members are placed in public, private, and protected sections.</p></details>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class Counter
{
private:
  int value;                 // поле закрыто: снаружи только через метод
public:
  Counter() { value = 0; }   // если конструктор private — объект создать нельзя
  void add(int d) { value += d; cout << "value = " << value << endl; }
};

int main()
{
  Counter c;                 // нужен public-конструктор
  c.add(5);
  c.add(3);
  // c.value = 100;          — ошибка E2247: 'Counter::value' is not accessible
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<ul><li>Перенеси <code>Counter()</code> в private — строка <code>Counter c;</code> перестанет компилироваться: конструктор недоступен.</li><li>Перенеси <code>value</code> в public — заработает <code>c.value = 100;</code>, но защита пропадёт.</li><li>Перенеси <code>add</code> в protected — вызвать его из main нельзя (только из наследника).</li></ul><p>Проверь каждый вариант кнопкой «Запустить» — тренажёр выдаёт те же ошибки, что Builder.</p>`},
];
CPP.topic('c13',{n:13,
 title:'Создание пользовательского класса. Конструктор и деструктор',
 lecSub:'Конструктор по умолчанию, с параметрами, копирования, список инициализации, перегрузка, деструктор, время жизни объекта.',
 lecture:LECTURE,
 labs:[{id:'c13-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Пользовательский класс, конструктор и деструктор',show:2,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> выработать практические навыки создания пользовательских классов и использования конструкторов и деструкторов для управления жизненным циклом объектов.</p><p><b>Что сделать:</b> описать класс; создать private и public члены; реализовать конструктор по умолчанию и с параметрами; создать объекты разными конструкторами; инициализировать данные; реализовать деструктор; пронаблюдать создание и уничтожение объектов; проверить класс в программе.</p></div>`,tasks:T}],
 umkd:[
  ['Что такое пользовательский класс?','Класс, созданный программистом для своей задачи (Book, Student), а не взятый из библиотеки.'],
  ['Основные части пользовательского класса?','Поля (данные), методы, конструкторы, деструктор, спецификаторы доступа.'],
  ['Что такое конструктор?','Специальный метод с именем класса и без типа результата, автоматически вызывается при создании объекта.'],
  ['Назначение конструктора?','Инициализировать поля объекта и подготовить его к работе (выделить ресурсы).'],
  ['Что такое конструктор по умолчанию?','Конструктор без параметров (или со всеми параметрами по умолчанию): <code>Book()</code>.'],
  ['Что такое конструктор с параметрами?','Конструктор, принимающий значения для инициализации полей: <code>Book(string t, int y)</code>.'],
  ['Что такое конструктор копирования?','Конструктор вида <code>Класс(const Класс &amp;)</code>, создаёт объект как копию другого.'],
  ['Что такое перегрузка конструкторов?','Несколько конструкторов в классе с разными параметрами; нужный выбирается по аргументам.'],
  ['Когда вызывается конструктор?','При создании объекта: объявление переменной, new, временный объект, элементы массива, передача по значению (копирования).'],
  ['Что такое деструктор?','Специальный метод <code>~Имя()</code> без параметров и типа, вызывается автоматически при уничтожении объекта.'],
  ['Назначение деструктора?','Освободить ресурсы объекта: память (delete), файлы и т. п.'],
  ['Когда вызывается деструктор?','При выходе локального объекта из области видимости (}), при delete, после завершения main для глобальных.'],
  ['Что такое жизненный цикл объекта?','Создание (память + конструктор) → использование → уничтожение (деструктор + освобождение памяти).'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 13, задание Book и задание СРС). Эталоны сверены с bcc32.'
});
})();
