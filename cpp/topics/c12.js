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
  <aside class="add"><span class="tag">дополнение · для теста на английском</span>
    <p><b>protected</b> — поле или метод видит сам класс и все классы-наследники (<i>the class itself and any classes derived from it</i>). <b>private</b> — только сам класс. <b>public</b> — любой код.</p>
  </aside>
  <h3 id="c12-l12">Слайды преподавателя: «Class Hierarchy» — базовые классы VCL</h3>
  <aside class="fix"><span class="tag">оригинал · лекция 12 (eng) — перевод</span>
    <p><i>The purpose of lesson is to learn the basic classes; consider the elements inherited from the ancestor classes.</i> — Цель: изучить базовые классы и элементы, которые наследуются от классов-предков.</p>
    <p><b>Корень дерева классов VCL</b> (The root of the VCL class hierarchy tree):</p>
<pre>TObject
 ├ Exception    ├ TStream    ├ TPrinter    ├ TList
 └ TPersistent
    ├ TGraphic   ├ TGraphicObject   ├ TCanvas   ├ TPicture   ├ TStrings
    └ TComponent
       ├ TTimer  ├ TScreen  ├ TMenuItem  ├ TMenu  ├ TCommonDialog
       ├ TGlobalComponent ─ TApplication
       └ TControl
          ├ TGraphicControl
          └ TWinControl
             ├ TButtonControl   ├ TCustomControl   ├ TCustomEdit
             └ TScrollingWinControl ─ TCustomForm ─ TForm</pre>
    <div class="tw"><table><tr><th>Класс</th><th>Что о нём на слайдах</th></tr>
      <tr><td><b>TObject</b></td><td>общие элементы (поведение) всех объектов VCL. Если при создании класса <b>базовый класс не указан</b>, предком автоматически становится <b>TObject</b>.</td></tr>
      <tr><td><b>TComponent</b></td><td>предок всех <b>компонентов</b> VCL; все его наследники можно добавить на <b>палитру компонентов</b>. Позволяет задать <b>родителя (parent)</b> и <b>владельца (owner)</b> компонента.</td></tr>
      <tr><td><b>TControl</b></td><td>базовый класс всех <b>элементов управления</b> (controls), включая окно формы; видимы во время работы. Даёт положение, подсказку (hint), рисование и перемещение, события мыши.</td></tr>
      <tr><td><b>TWinControl</b></td><td>базовый класс всех <b>оконных</b> элементов управления (window controls).</td></tr>
      <tr><td><b>TApplication</b></td><td>объект «Windows-приложение», связь программиста со средой Windows. В каждом приложении автоматически создаётся один объект <code>Application</code>. Его нет в палитре и у него нет публикуемых свойств; чтобы ловить события приложения в IDE, кладут на форму <b>TApplicationEvents</b>.</td></tr>
      <tr><td><b>TScreen</b></td><td>глобальная переменная <code>Screen</code>; доступа из Object Inspector нет. Даёт сведения об экране: разрешение, курсоры, шрифты, список форм и <b>активная форма</b>.</td></tr>
      <tr><td><b>TForm</b></td><td>базовый класс окна-формы; каждая новая форма — наследник TForm (<code>class TForm1 : public TForm</code>). Форма бывает: главным окном приложения, диалоговым окном, дочерним окном MDI.</td></tr>
      <tr><td><b>TMainMenu</b></td><td>строка меню формы и выпадающие меню.</td></tr>
      <tr><td><b>TMenuItem</b></td><td>пункт меню; его контейнер — TMainMenu или TPopupMenu.</td></tr>
      <tr><td><b>TPopupMenu</b></td><td>контекстное (всплывающее) меню по правой кнопке мыши; базовый класс — <b>TMenu</b>.</td></tr></table></div>
    <p><b>Parent и Owner.</b> <b>Родитель (parent)</b> — компонент, <b>на котором непосредственно лежит</b> компонент. <b>Владелец (owner)</b> всех компонентов формы — <b>сама форма</b>; владелец всех форм — <b>приложение</b> (Application). Если компонент лежит не прямо на форме, а, например, на <b>TPanel</b>, то родитель (панель) и владелец (форма) — <b>разные</b> компоненты.</p>
    <p><b>Свойства TComponent:</b></p>
    <ul>
      <li><b>ComponentCount</b> — сколько компонентов принадлежит этому компоненту;</li>
      <li><b>ComponentIndex</b> — номер компонента в массиве Components его владельца (первый — 0);</li>
      <li><b>Components</b> — список всех принадлежащих компонентов: обращение по номеру или перебор в цикле;</li>
      <li><b>Name</b> — имя компонента в коде; Builder даёт его сам по имени класса (Button1, Edit1…);</li>
      <li><b>Owner</b> — владелец. <b>Компонент всегда удаляется (память освобождается), когда удаляется его владелец.</b></li>
    </ul>
<pre class="cpp-code">for (int i = 0; i &lt; ComponentCount; i++)          // все компоненты формы
  if (TEdit *e = dynamic_cast&lt;TEdit*&gt;(Components[i]))
    e-&gt;Text = "";                                   // очистить все Edit</pre>
    <p><b>Свойства TControl:</b></p>
    <div class="tw"><table><tr><th>Свойство</th><th>Смысл</th></tr>
      <tr><td>Action</td><td>действие (action), связанное с элементом</td></tr>
      <tr><td>AutoSize</td><td>менять ли размер автоматически при изменении содержимого</td></tr>
      <tr><td>Caption</td><td>строка-заголовок окна или надпись. Знак <b>&amp;</b> подчёркивает следующую букву — это <b>клавиша-ускоритель</b>: Alt + буква переносит фокус на элемент. <code>Caption = "&amp;Open"</code> → <u>O</u>pen</td></tr>
      <tr><td>Color, ParentColor</td><td>цвет фона; если <b>ParentColor = true</b>, фон меняется вместе с фоном родителя</td></tr>
      <tr><td>Enabled</td><td>доступен ли элемент</td></tr>
      <tr><td>Font</td><td>шрифт: тип букв, размер и т. д.</td></tr>
      <tr><td>Height, Width</td><td>высота и ширина в пикселях</td></tr>
      <tr><td>HelpType</td><td>как задаётся тема справки: htContext → номер в HelpContext, htKeyword → слово в HelpKeyword</td></tr>
      <tr><td>Hint, ShowHint</td><td>всплывающая подсказка; видна, только если <b>ShowHint = true</b></td></tr>
      <tr><td>Left, Top</td><td>сколько пикселей от левого / верхнего края <b>родителя</b></td></tr>
      <tr><td>Parent</td><td>родительский элемент</td></tr>
      <tr><td>ParentColor, ParentFont</td><td>true — брать цвет и шрифт родителя</td></tr>
      <tr><td>PopupMenu</td><td>контекстное меню элемента. Если у TPopupMenu <b>AutoPopup = true</b>, меню появляется само; если false — его вызывают методом Popup в обработчике OnContextPopup</td></tr>
      <tr><td>Text</td><td>текстовая строка в элементе</td></tr>
      <tr><td>Visible</td><td>виден ли компонент</td></tr></table></div>
    <p><b>Методы TControl:</b> <code>Click</code> — вызывает событие OnClick (<code>Label1-&gt;Click();</code>); <code>Create</code> — создаёт экземпляр и задаёт свойства; <code>DblClick</code> — вызывает OnDblClick; <code>Hide</code> — прячет (Visible = false): <code>Button1-&gt;Visible = false;</code> то же, что <code>Button1-&gt;Hide();</code>; <code>Refresh</code> — перерисовывает элемент, вызывая Repaint; <code>Show</code> — делает видимым (Visible = true).</p>
    <p><b>Свойства TWinControl:</b> <b>ControlCount</b> — число дочерних элементов; <b>Controls</b> — список дочерних элементов; <b>TabOrder</b> — номер элемента в порядке обхода клавишей Tab внутри родителя.</p>
    <p><b>Свойства TApplication:</b> <b>HelpFile</b> — файл справки; <b>Icon</b> — значок в заголовке рядом с именем приложения; <b>MainForm</b> — главная форма: когда она закрывается, закрывается и приложение; <b>ShowMainForm</b> — по умолчанию true: главное окно показывается при запуске (чтобы скрыть его, в Project1.cpp до <code>Application-&gt;Run()</code> пишут <code>Application-&gt;ShowMainForm = false;</code> и у главной формы Visible = false); <b>Title</b> — заголовок приложения.</p>
    <p><b>Свойства TForm:</b> <b>Active</b> — активна ли форма; <b>ActiveControl</b> — элемент с <b>фокусом ввода</b>; <b>ActiveMDIChild</b> — активное дочернее MDI-окно; <b>BorderStyle</b> — вид и поведение рамки; <b>FormStyle</b>:</p>
    <ul>
      <li><code>fsNormal</code> — обычная SDI-форма (не дочернее и не родительское MDI-окно);</li>
      <li><code>fsMDIChild</code> — дочернее MDI-окно;</li>
      <li><code>fsMDIForm</code> — родительское MDI-окно;</li>
      <li><code>fsStayOnTop</code> — «всегда сверху» над формами проекта без этого стиля.</li>
    </ul>
    <p>Ещё: <b>HelpFile</b>; <b>Icon</b> — значок в заголовке окна; <b>MDIChildCount</b> — число открытых дочерних MDI-форм; <b>MDIChildren</b> — их список; <b>Menu / PopupMenu</b> — главное и контекстное меню; <b>Parent</b> — у формы без родителя равен <b>nil</b> (NULL); <b>Position</b> — размер и положение при первом показе; <b>WindowState</b> — свёрнута, развёрнута на весь экран или обычная.</p>
    <p><b>Методы TForm</b> (для MDI): <b>Cascade</b> — расставить дочерние окна каскадом; <b>Next</b> / <b>Previous</b> — сделать активным следующее / предыдущее дочернее окно; <b>Tile</b> — расставить дочерние окна одинакового размера мозаикой на всю клиентскую область. Класс формы — контейнер для всех компонентов на ней.</p>
    <p><b>TMainMenu.</b> Меню формы создают в три шага: 1) положить на форму компонент <b>TMainMenu</b>; 2) <b>двойной щелчок</b> по нему — в редакторе меню вписать заголовки пунктов строки меню и выпадающих меню; 3) написать обработчик события для каждого пункта. Свойства: <b>AutoMerge</b> — можно ли сливать меню (как именно — зависит от GroupIndex пунктов); <b>Handle</b> — дескриптор меню для функций Windows API.</p>
    <p><b>TMenuItem.</b> При создании меню в дизайнере для каждой команды автоматически создаётся объект TMenuItem. Свойства:</p>
    <ul>
      <li><b>Action</b> — связанное действие. По умолчанию у пункта событие <b>OnClick</b>, имя обработчика строится из имени формы и пункта (TForm1::Item12Click); одно «действие» можно использовать для разных объектов;</li>
      <li><b>AutoHotkeys</b> — назначать ли клавиши-ускорители подпунктам автоматически;</li>
      <li><b>Bitmap</b> — картинка слева от заголовка; <b>Break</b> — начать ли с пункта новый столбец меню;</li>
      <li><b>Caption</b> — текст пункта; буква после <b>&amp;</b> — ускоритель (Alt + буква);</li>
      <li><b>Checked</b> — пункт как флажок (галочка слева); <b>Default</b> — пункт по умолчанию (выполняется по двойному щелчку на родительском подменю, выделен жирным); <b>Enabled</b> — доступен ли;</li>
      <li><b>HelpContext</b>, <b>Hint</b> — справка и подсказка; <b>ImageIndex</b> — номер картинки из списка Images родителя;</li>
      <li><b>Items</b> — подпункты; <b>MenuIndex</b> — номер пункта в родительском меню; <b>Parent</b> — родительское меню; <b>Visible</b> — виден ли.</li>
    </ul>
    <p>Методы TMenuItem: <b>Add</b> — добавить пункт(ы) в конец Items; <b>Clear</b> — удалить все подпункты; <b>Click</b> — вызвать OnClick; <b>Create</b> — создать пункт; <b>Delete</b> — удалить пункт с номером; <b>IndexOf</b> — номер пункта в Items; <b>Insert</b> — вставить пункт.</p>
    <p><b>Общее «действие» для пункта меню и кнопки</b>: положить на форму <b>TActionList</b> → двойной щелчок → в редакторе добавить действие (TAction) → двойной щелчок по нему откроет код обработчика → у пункта меню выбрать это действие в свойстве <b>Action</b>.</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · из учебника МГУ (Волкова, Иванов, Карпов) · наследование глубже</span>
    <ul>
      <li><b>Что не наследуется:</b> конструкторы, деструктор, операция присваивания. Конструктор базового класса с параметрами вызывают только в <b>списке инициализации</b>: <code>Dog(string n) : Animal(n) {}</code>.</li>
      <li>Объекту базового типа можно присвоить объект наследника — скопируется только «базовая часть». Указатель на наследника <b>безопасно</b> превращается в указатель на базовый (<code>A *pa = pb;</code>); обратно — только явно и небезопасно: <code>pb = (B*)pa;</code>.</li>
      <li>Если тип наследования не указан: у <code>class</code> — <b>private</b>, у <code>struct</code> — <b>public</b>.</li>
      <li><b>Перекрытие имён</b>: метод наследника с тем же именем закрывает метод базового, но тот остаётся доступен через квалификатор: <code>A::f(1);</code> или <code>pc-&gt;A::f(1);</code>. Без virtual вызов через указатель решает <b>тип указателя</b>.</li>
      <li><b>Виртуальные функции</b>: вызов через указатель/ссылку решает <b>тип объекта</b> (динамический полиморфизм). Класс хотя бы с одной virtual-функцией — <b>полиморфный</b>. Реализация — <b>таблица виртуальных методов (ТВМ, VMT)</b>: в каждом полиморфном объекте есть скрытый указатель на таблицу адресов виртуальных методов его класса; в таблице наследника адреса переопределённых методов заменены, новые дописаны в конец.</li>
      <li><b>Виртуальный деструктор</b>: <code>A *p = new C; delete p;</code> — без <code>virtual ~A()</code> вызовется только ~A(), и память наследника не освободится; с virtual — сначала ~C(), потом ~A(). Конструктор виртуальным быть не может.</li>
      <li><b>Абстрактный класс</b> — есть хотя бы одна <b>чистая виртуальная функция</b> <code>virtual void f() = 0;</code>. Объекты создавать нельзя, указатели — можно. <b>Интерфейс</b> — абстрактный класс без полей, только с открытыми чистыми виртуальными функциями.</li>
      <li><b>Множественное наследование</b>: <code>class Z : public X, public Y</code>. Одинаковые имена в X и Y дают неоднозначность — пишут <code>z1.X::i1 = 5;</code>. Если X и Y унаследованы от общего W и нужен один экземпляр W — <b>виртуальное наследование</b>: <code>class X : public virtual W</code>.</li>
      <li><b>RTTI</b>: <code>dynamic_cast&lt;B*&gt;(p)</code> — безопасное приведение в иерархии (вернёт NULL, если объект не того типа; для ссылки — исключение <code>bad_cast</code>); <code>typeid(x).name()</code> — имя типа.</li>
    </ul>
  </aside>
  <aside class="add"><span class="tag">для теста на английском</span>
    <ul>
      <li><i>If the base class is not specified, the ancestor is</i> — <b>TObject</b>.</li>
      <li><i>Ancestor class for all components of VCL</i> — <b>TComponent</b>; <i>base class of all controls</i> — <b>TControl</b>; <i>of all window controls</i> — <b>TWinControl</b>; <i>base class for creating a form window</i> — <b>TForm</b>.</li>
      <li><i>The owner of all components located in the form is</i> — <b>the form itself</b>; <i>the owner of all forms is</i> — <b>the application</b>.</li>
      <li><i>The component is always deleted when</i> — <b>its owner is deleted</b>.</li>
      <li><i>The &amp; sign in Caption</i> — the next character is underlined and is the <b>accelerator key</b> (Alt + key).</li>
      <li><i>fsStayOnTop</i> — the form is <b>always on top</b>; <i>fsMDIChild</i> — child MDI window; <i>fsMDIForm</i> — parent MDI window.</li>
      <li><i>Base class of TPopupMenu</i> — <b>TMenu</b>; <i>pop-up menu appears automatically if</i> — <b>AutoPopup = True</b>.</li>
    </ul>
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
