/* C++ · Тема 14. Пользовательский класс: свойства */
(function(){ const R=String.raw;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 14 из УМКД (перевод) и моя лекция. <code>__property</code> — расширение языка в C++Builder (в обычном C++ его нет).</aside>
  <h2 id="c14-lec">Лекция 14. Создание пользовательского класса: свойства</h2>
  <p><b>Цель:</b> научить создавать пользовательские классы с инкапсулированными данными и контролируемым доступом к свойствам объекта.</p>
  <p><b>Основные пункты:</b> понятие свойства; инкапсуляция данных класса; закрытые поля; методы доступа get и set; чтение и изменение свойств; проверка значений свойств; доступ public, private, protected; разделение интерфейса и реализации класса; создание свойств в C++Builder; работа со свойствами в Object Inspector; программный доступ к свойствам; проектирование класса с набором свойств.</p>
  <aside class="add"><span class="tag">дополнение · свойство, get и set</span>
    <p><b>Свойство</b> — характеристика объекта (переменная некоторого типа), описывающая его внутреннее состояние: возраст, цвет, ширина. Хорошая практика — хранить её в закрытом поле, а читать и менять через методы.</p>
<pre class="cpp-code">class Person
{
private:
  int age;                                  // данные спрятаны
public:
  int getAge() const { return age; }        // getter — чтение
  void setAge(int a)                        // setter — изменение с проверкой
  {
    if (a &gt;= 0 &amp;&amp; a &lt;= 150) age = a;
    else cout &lt;&lt; "Неверный возраст" &lt;&lt; endl;
  }
};</pre>
    <ul><li><b>Зачем инкапсулировать:</b> нельзя записать неверное значение (возраст −5), можно менять внутреннее устройство класса, не трогая код, который его использует.</li>
      <li><b>Getter</b> возвращает значение поля; <b>setter</b> принимает новое и проверяет его.</li>
      <li>Свойство «только для чтения» — есть getter, нет setter.</li>
      <li><b>Public-поле</b> можно изменить как угодно; <b>инкапсулированное свойство</b> — только через проверку.</li>
      <li><b>Интерфейс и реализация:</b> объявление класса (что он умеет — в .h) отдельно от определения методов (как — в .cpp).</li></ul>
  </aside>
  <aside class="add"><span class="tag">дополнение · свойства в C++Builder: __property</span>
<pre class="cpp-code">class TPerson
{
private:
  int FAge;                                 // поле (в VCL принято начинать с F)
  void SetAge(int v) { if (v &gt;= 0) FAge = v; }
public:
  __property int Age = { read = FAge, write = SetAge };
};
TPerson p;
p.Age = 20;        // на самом деле вызывается SetAge(20)
cout &lt;&lt; p.Age;     // читается FAge</pre>
    <p>Снаружи свойство выглядит как обычное поле, а внутри read и write указывают поле или метод. Без write — свойство только для чтения. Если свойство объявить в секции <code>__published</code> у компонента, оно появляется в <b>Object Inspector</b> (тема 15). Все свойства компонентов (Caption, Width, Color…) устроены именно так: <code>Form1-&gt;Width = 300;</code> вызывает метод, который перерисовывает форму.</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · для теста на английском</span>
    <p>Своё свойство в C++Builder объявляют ключевым словом <b>__property</b>: оно даёт чтение и запись закрытого (private) поля через read/write, например <code>__property int Age = {read = FAge, write = SetAge};</code></p>
  </aside>
</div>`;
const T=[
 {id:'c14-z1',name:'Задание 1 (get/set с проверкой)',cmp:'exact',text:R`<p>Класс «Сотрудник»: закрытые поля имя, возраст (18…65), зарплата (&gt; 0). Get- и set-методы с проверкой; свойство «стаж» только для чтения (вычисляется по году приёма). Проверить класс на правильных и неправильных значениях.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class Employee
{
private:
  string name;
  int age;
  double salary;
  int hireYear;
public:
  Employee(string n, int y) { name = n; age = 18; salary = 100000; hireYear = y; }
  string getName() const { return name; }
  int getAge() const { return age; }
  double getSalary() const { return salary; }
  int getExperience() const { return 2026 - hireYear; }      // только чтение
  void setAge(int a)
  {
    if (a >= 18 && a <= 65) age = a;
    else cout << "Ошибка: возраст " << a << " вне 18..65" << endl;
  }
  void setSalary(double s)
  {
    if (s > 0) salary = s;
    else cout << "Ошибка: зарплата должна быть > 0" << endl;
  }
};

int main()
{
  Employee e("Нурлан", 2019);
  e.setAge(30);
  e.setAge(15);
  e.setSalary(350000);
  e.setSalary(-1);
  cout << e.getName() << ", " << e.getAge() << " лет, зарплата " << e.getSalary()
       << ", стаж " << e.getExperience() << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Сеттер не меняет поле, если значение неверное, и сообщает об ошибке — объект остаётся в правильном состоянии. Стаж не хранится, а вычисляется в getter — и сеттера у него нет, поэтому это свойство только для чтения.</p>`},
 {id:'c14-z2',name:'Задание 2 (__property в C++Builder)',cmp:'exact',text:R`<p>Класс «Температура»: поле FCelsius, свойство Celsius (чтение — поле, запись — метод с проверкой ≥ −273.15) и свойство Fahrenheit (чтение и запись через методы-пересчёты). Записывать и читать свойства как обычные поля.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class TTemperature
{
private:
  double FCelsius;
  void SetCelsius(double v)
  {
    if (v >= -273.15) FCelsius = v;
    else cout << "Ниже абсолютного нуля нельзя" << endl;
  }
  double GetF() { return FCelsius * 9 / 5 + 32; }
  void SetF(double f) { SetCelsius((f - 32) * 5 / 9); }
public:
  TTemperature() { FCelsius = 0; }
  __property double Celsius = { read = FCelsius, write = SetCelsius };
  __property double Fahrenheit = { read = GetF, write = SetF };
};

int main()
{
  TTemperature t;
  t.Celsius = 25;
  cout << t.Celsius << " C = " << t.Fahrenheit << " F" << endl;
  t.Fahrenheit = 212;
  cout << t.Celsius << " C = " << t.Fahrenheit << " F" << endl;
  t.Celsius = -300;
  cout << "Осталось: " << t.Celsius << " C" << endl;
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Запись <code>t.Celsius = 25</code> на самом деле вызывает SetCelsius(25), а чтение <code>t.Fahrenheit</code> — GetF(). Снаружи это неотличимо от поля, а проверка работает. Это код C++Builder: в других компиляторах <code>__property</code> нет.</p>`},
 {id:'c14-z3',name:'Задание 3 (класс с набором свойств)',cmp:'exact',text:R`<p>Спроектировать класс «Прямоугольник» со свойствами Width и Height (запись только положительных) и свойствами только для чтения Area и Perimeter. Ввести размеры с клавиатуры и вывести все свойства.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>

class TRect
{
private:
  double FW, FH;
  void SetW(double v) { if (v > 0) FW = v; else cout << "Ширина должна быть > 0" << endl; }
  void SetH(double v) { if (v > 0) FH = v; else cout << "Высота должна быть > 0" << endl; }
  double GetArea() { return FW * FH; }
  double GetPerim() { return 2 * (FW + FH); }
public:
  TRect() { FW = 1; FH = 1; }
  __property double Width = { read = FW, write = SetW };
  __property double Height = { read = FH, write = SetH };
  __property double Area = { read = GetArea };          // только чтение
  __property double Perimeter = { read = GetPerim };
};

int main()
{
  TRect r;
  double w, h;
  cout << "Ширина: "; cin >> w;
  cout << "Высота: "; cin >> h;
  r.Width = w;
  r.Height = h;
  cout << "Width = " << r.Width << ", Height = " << r.Height << endl;
  cout << "Area = " << r.Area << ", Perimeter = " << r.Perimeter << endl;
  getch();
  return 0;
}`, ins:[['3 и 4','3\n4'],['−2 и 5','-2\n5']],
  steps:R`<p>Area и Perimeter объявлены только с read — попытка <code>r.Area = 10;</code> даст ошибку компиляции. Неверная ширина отклоняется сеттером и остаётся прежней (1).</p>`},
];
CPP.topic('c14',{n:14,
 title:'Создание пользовательского класса: свойства',
 lecSub:'Свойство, инкапсуляция, getter и setter, проверка значений, только для чтения, __property в C++Builder.',
 lecture:LECTURE,
 labs:[{id:'c14-lab',short:'Лаба',title:'Лабораторная работа (по УМКД). Пользовательский класс: свойства',show:3,
  orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · цель и что сделать</span><p><b>Цель:</b> выработать навыки создания свойств пользовательских классов и применения инкапсуляции для управления доступом к данным класса.</p><p><b>Что сделать:</b> объявить private-поля; создать getter и setter методы; реализовать свойства класса; управлять доступом к данным; проверять значения свойств; изменять и получать свойства объекта; использовать свойства в логике программы; проверить класс на разных значениях; применить принципы инкапсуляции.</p></div>`,tasks:T}],
 umkd:[
  ['Что такое свойство класса?','Характеристика (атрибут) объекта, описывающая его состояние; хранится в поле и обычно читается/изменяется через методы доступа.'],
  ['Почему данные класса обычно инкапсулируют?','Чтобы защитить их от неверных значений и случайных изменений и иметь возможность менять реализацию без изменения внешнего кода.'],
  ['Что такое getter и setter?','Методы доступа: getter возвращает значение поля, setter записывает новое значение (с проверкой).'],
  ['Назначение getter?','Дать возможность прочитать значение закрытого поля.'],
  ['Назначение setter?','Дать возможность изменить закрытое поле контролируемо — с проверкой допустимости значения.'],
  ['Как setter проверяет данные?','Сравнивает новое значение с допустимым диапазоном и записывает его только если оно верное, иначе сообщает об ошибке.'],
  ['Разница между public-полем и инкапсулированным свойством?','Public-поле можно изменить любым значением напрямую; инкапсулированное — только через методы, которые проверяют значение.'],
  ['Как реализуются свойства в пользовательском классе?','Private-поле + public get/set методы; в C++Builder — <code>__property тип Имя = {read = …, write = …};</code>'],
  ['Как обращаться к свойствам извне класса?','Через вызов методов <code>obj.getAge()</code>, <code>obj.setAge(20)</code> или, для __property, как к полю: <code>obj.Age = 20</code>.'],
  ['Преимущества свойств и инкапсуляции?','Корректность данных, защита, скрытие реализации, простота изменения класса, возможность свойств только для чтения.'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 14). Эталоны сверены с bcc32 (__property — расширение C++Builder).'
});
})();
