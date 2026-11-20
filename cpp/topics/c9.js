/* C++ · Тема 9. Среда C++Builder (IDE) */
(function(){ const R=String.raw;
const SEP='//---------------------------------------------------------------------------\n';
CPP.H=(name,body,sig)=>`void __fastcall TForm1::${name}(${sig||'TObject *Sender'})\n{\n${body}\n}\n${SEP}`;
const H=CPP.H;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 9 из УМКД (перевод) и моя лекция. Окно «C++Builder 6» в заданиях ниже — тренажёр, повторяющий настоящую среду: палитра компонентов, форма, Object Inspector, Unit1.cpp, запуск по F9.</aside>
  <h2 id="c9-lec">Лекция 9. Интегрированная среда разработки Borland C++Builder</h2>
  <p><b>Цель:</b> познакомить со средой Borland C++Builder и её основными инструментами для разработки, компиляции, запуска и отладки приложений.</p>
  <p><b>Основные пункты:</b> понятие и назначение IDE; основные компоненты C++Builder; главное меню и панели инструментов; редактор исходного кода; менеджер проекта; инспектор объектов; палитра компонентов; дизайнер форм; окна сообщений; создание, открытие и сохранение проектов; компиляция и запуск; поиск и исправление ошибок; синтаксические, семантические и логические ошибки; основные приёмы отладки.</p>
  <aside class="add"><span class="tag">дополнение · что такое IDE и C++Builder</span>
    <p><b>IDE (Integrated Development Environment)</b> — интегрированная среда разработки: в одной программе редактор кода, компилятор, компоновщик, отладчик и визуальный дизайнер.</p>
    <p><b>Borland C++Builder</b> — среда <b>быстрой разработки приложений (RAD)</b> на C++ для Windows: окна программы «рисуют» мышью из готовых компонентов библиотеки <b>VCL</b> (Visual Component Library), а код пишут только для реакции на события. Версия 6 вышла в 2002 году; сейчас среда принадлежит Embarcadero.</p>
    <div class="tw"><table><tr><th>Часть IDE</th><th>Для чего</th></tr>
      <tr><td>Главное меню и панели инструментов (Speedbar)</td><td>File (New, Open, Save All), Edit, Search, View, Project (Options, Compile), Run (Run F9, Step Over F8, Trace Into F7, Program Reset Ctrl+F2), Component, Tools, Help</td></tr>
      <tr><td><b>Component Palette</b> (палитра компонентов)</td><td>вкладки Standard, Additional, Win32, System, Data Access, Dialogs… — готовые «кирпичики» для формы</td></tr>
      <tr><td><b>Form Designer</b> (дизайнер форм)</td><td>окно Form1 с сеткой точек — на нём раскладывают компоненты</td></tr>
      <tr><td><b>Object Inspector</b></td><td>свойства (Properties) и события (Events) выбранного объекта; здесь задают Caption, Color, Width…</td></tr>
      <tr><td><b>Code Editor</b> (редактор кода)</td><td>текст программы Unit1.cpp и Unit1.h, подсветка синтаксиса</td></tr>
      <tr><td>Object TreeView</td><td>дерево компонентов формы</td></tr>
      <tr><td>Project Manager</td><td>файлы проекта</td></tr>
      <tr><td>Окно сообщений (Messages)</td><td>ошибки и предупреждения компилятора: [C++ Error] Unit1.cpp(25): E2379 Statement missing ;</td></tr></table></div>
  </aside>
  <aside class="add"><span class="tag">дополнение · проект, компиляция, запуск</span>
    <ul><li><b>Проект</b> — набор файлов программы: Project1.bpr (проект), Project1.cpp (главный файл с WinMain), Unit1.cpp (код формы), Unit1.h (объявление класса формы), Unit1.dfm (вид формы), Project1.res (ресурсы, значок).</li>
      <li>Создать: <b>File → New → Application</b> (оконное) или <b>File → New → Other → Console Wizard</b> (консольное). Сохранить всё: <b>File → Save All</b> (Shift+Ctrl+S); открыть: File → Open Project.</li>
      <li><b>Этапы:</b> препроцессор (#include) → компиляция каждого .cpp в .obj → компоновка (линковка) с библиотеками → Project1.exe → запуск. <b>F9</b> делает всё сразу; Ctrl+F9 — только собрать (Make).</li>
      <li><b>Release-сборка</b> (из ООП-лабы 1-2): чтобы exe работал на компьютере без Builder, в Project → Options снять «Build with runtime packages» (Packages) и «Use dynamic RTL» (Linker).</li></ul>
  </aside>
  <aside class="add"><span class="tag">дополнение · ошибки и отладка</span>
    <ul><li><b>Синтаксическая</b> — нарушены правила языка (нет ;, опечатка в слове, лишняя скобка). Находит компилятор, программа не собирается.</li>
      <li><b>Семантическая</b> — запись правильная, но смысл недопустим: необъявленная переменная, несовместимые типы, вызов функции с неверными аргументами. Тоже находит компилятор.</li>
      <li><b>Логическая</b> — программа собирается и работает, но результат неверный (не та формула, 1/3 вместо 1/3.). Компилятор не находит — ищут тестированием и отладкой.</li>
      <li><b>Отладка (debugging)</b> — поиск и исправление ошибок: точка останова (щелчок на поле слева от строки или F5), пошаговое выполнение F8 (Step Over) и F7 (Trace Into), просмотр переменных (Ctrl+F7 Evaluate/Modify, Watch), Run to Cursor (F4).</li></ul>
  </aside>
  <aside class="add"><span class="tag">дополнение · для теста на английском</span>
    <div class="tw"><table><tr><th>Термин</th><th>Что это</th></tr>
      <tr><td><b>Borland C++ Builder 6</b></td><td>Integrated Development Environment, IDE (интегрированная среда разработки): редактор, дизайнер форм, компилятор и отладчик вместе.</td></tr>
      <tr><td><b>Object Inspector</b> (инспектор объектов)</td><td>Здесь смотрят и меняют <i>properties and events</i> (свойства и события) выделенного объекта. Свойства компонента задают именно здесь.</td></tr>
      <tr><td><b>Code Editor</b> (редактор кода)</td><td>Хранит набор команд программы (текст Unit1.cpp).</td></tr>
      <tr><td><b>Component Palette</b> (палитра компонентов)</td><td>Вкладки Standard, Additional, System… с компонентами.</td></tr>
      <tr><td><b>Components</b> (компоненты)</td><td><i>Self-contained building blocks</i> (самостоятельные «кирпичики»), которые кладут на форму.</td></tr>
      <tr><td><b>Visual components = Controls</b> (визуальные компоненты = элементы управления)</td><td>Выглядят одинаково при проектировании и во время работы: Button, Edit, Label.</td></tr>
      <tr><td><b>Non-visual components</b> (невизуальные)</td><td>Не видны во время работы: Timer, MainMenu, OpenDialog. У них нет Width и Height.</td></tr>
      <tr><td><b>.bpr</b></td><td>Файл проекта в Builder 6 (Project1.bpr). Unit1.cpp — код, Unit1.h — объявление класса формы, Unit1.dfm — вид формы.</td></tr></table></div>
    <p><b>Компоненты из лабы с часами:</b></p>
    <ul>
      <li><b>StaticText</b>: <code>Alignment</code> — выравнивание текста; <code>BorderStyle = sbsSunken</code> — вдавленная рамка (sbsNone — без рамки, sbsSingle — линия); <code>AutoSize = true</code> — размер подгоняется под текст.</li>
      <li><b>BitBtn</b> (кнопка с картинкой, вкладка Additional): <code>Kind</code> — готовый вид кнопки (bkOK, bkCancel, bkClose…); <code>Glyph</code> — картинка на кнопке.</li>
      <li>Текущее время: <code>Now().TimeString()</code>, дата — <code>Date().DateString()</code>.</li>
      <li><code>FormStyle = fsStayOnTop</code> — форма всегда поверх других окон.</li>
    </ul>
  </aside>
</div>`;
const FIRST={
  form:{Caption:'Form1',Width:320,Height:200},comps:[],code:'',
  ref:{form:{Caption:'Form1',Width:320,Height:200},comps:[{type:'TLabel',Name:'Label1',Left:24,Top:24,Caption:'Label1'},{type:'TButton',Name:'Button1',Left:24,Top:64,Caption:'Нажми',events:{OnClick:'Button1Click'}}],
    code:H('Button1Click','  Label1->Caption = "Привет!";')},
  checks:[{name:'Нажатие кнопки меняет надпись',act:[['click','Button1']],exp:[['Label1','Caption','Привет!']]}],
  steps:[{t:'На палитре (вкладка <b>Standard</b>) выбери <b>Label</b> (значок «A») и щёлкни по форме.',c:{comp:'TLabel'}},
    {t:'Так же положи на форму <b>Button</b> (значок «OK»).',c:{comp:'TButton'}},
    {t:'Выдели кнопку и в <b>Object Inspector</b> (слева) поменяй свойство <b>Caption</b> на «Нажми».',c:{prop:['Button1','Caption','Нажми']}},
    {t:'Сделай <b>двойной щелчок</b> по кнопке — Builder сам создаст обработчик <code>Button1Click</code> и откроет его в Unit1.cpp.',c:{handler:'Button1Click'}},
    {t:'Между { и } напиши: <code>Label1-&gt;Caption = "Привет!";</code>',c:{code:'Label1\\s*->\\s*Caption\\s*=\\s*"Привет!"'}},
    {t:'Нажми <b>▶ Run</b> (F9). В запущенной программе нажми кнопку — надпись изменится. Закрой окно крестиком.',c:{check:0}}],
  palette:['TLabel','TButton','TEdit']};
const CLOCK_TBL=R`<div class="tw"><table><tr><th>Свойство (Property)</th><th>Назначение</th><th>Значение</th></tr>
<tr><td>Name</td><td>Имя объекта</td><td>StaticText1</td></tr><tr><td>Caption</td><td>Надпись на объекте</td><td></td></tr>
<tr><td>Alignment</td><td>Выравнивание текста внутри объекта (taCenter — по центру)</td><td>taCenter</td></tr><tr><td>BorderStyle</td><td>Стиль рамки (sbsSunken — «вдавленная»)</td><td>sbsSunken</td></tr>
<tr><td>AutoSize</td><td>Автоподбор размера</td><td>True</td></tr><tr><td>Font</td><td>Шрифт</td><td>Times New Roman, синий (blue), 30</td></tr>
<tr><td>Name</td><td></td><td>Timer1</td></tr><tr><td>Enable(d)</td><td>Включён</td><td>True</td></tr>
<tr><td>Interval</td><td>Период срабатывания таймера (каждые 1000 мс = 1 с)</td><td>1000</td></tr><tr><td>Tag</td><td></td><td>0</td></tr>
<tr><td>Name</td><td></td><td>Form1</td></tr><tr><td>Caption</td><td></td><td></td></tr><tr><td>AutoSize</td><td></td><td>True</td></tr></table></div>`;
const CLOCK={
  form:{Caption:'Form1',Width:300,Height:150},comps:[],code:'',
  ref:{form:{Caption:'',Width:300,Height:150,AutoSize:true},comps:[{type:'TStaticText',Name:'StaticText1',Left:16,Top:16,Caption:'',Alignment:'taCenter',BorderStyle:'sbsSunken',AutoSize:true,Font:{Name:'Times New Roman',Color:0xFF0000,Size:30}},
    {type:'TTimer',Name:'Timer1',Left:240,Top:8,Interval:1000,events:{OnTimer:'Timer1Timer'}}],
    code:H('Timer1Timer','  StaticText1->Caption=Now().TimeString();\n  Form1->Caption=Now().DateString();')},
  checks:[{name:'Каждую секунду: время в StaticText1 и дата в заголовке',act:[['tick','Timer1',1]],exp:[['StaticText1','Caption',{re:'^\\d{1,2}:\\d{2}:\\d{2}$'}],['Form1','Caption',{re:'^\\d{2}\\.\\d{2}\\.\\d{4}$'}]]},
    {name:'Шрифт Times New Roman, синий, 30',act:[],exp:[['StaticText1','Font.Size',30],['StaticText1','Font.Color','clBlue']]}],
  steps:[{t:'Вкладка <b>Additional</b> → <b>StaticText</b> → щёлкни по форме.',c:{comp:'TStaticText'}},
    {t:'Вкладка <b>System</b> → <b>Timer</b> (часики) → на форму. Это невизуальный компонент: при работе программы его не видно.',c:{comp:'TTimer'}},
    {t:'У StaticText1 в Object Inspector: Alignment = taCenter, BorderStyle = sbsSunken, Font → Name = Times New Roman, Size = 30, Color = clBlue.',c:{prop:['StaticText1','Font.Size',30]}},
    {t:'Проверь у Timer1: Enabled = true, Interval = 1000 (раз в секунду).',c:{prop:['Timer1','Interval',1000]}},
    {t:'Двойной щелчок по Timer1 — откроется обработчик <code>Timer1Timer</code>.',c:{handler:'Timer1Timer'}},
    {t:'Впиши две строки: <code>StaticText1-&gt;Caption=Now().TimeString();</code> и <code>Form1-&gt;Caption=Now().DateString();</code>',c:{check:0}},
    {t:'F9 — часы пошли: время в окне, дата в заголовке.',c:{run:true}}],
  palette:['TLabel','TButton','TStaticText','TTimer']};
const STAY={form:{Caption:'Form1',Width:300,Height:150},
  comps:[{type:'TStaticText',Name:'StaticText1',Left:16,Top:16,Caption:'',Alignment:'taCenter',BorderStyle:'sbsSunken',Font:{Name:'Times New Roman',Color:0xFF0000,Size:30}},{type:'TTimer',Name:'Timer1',Left:240,Top:8,events:{OnTimer:'Timer1Timer'}}],
  code:H('Timer1Timer','  StaticText1->Caption=Now().TimeString();\n  Form1->Caption=Now().DateString();'),
  ref:{form:{Caption:'Form1',Width:300,Height:150,FormStyle:'fsStayOnTop'},comps:[{type:'TStaticText',Name:'StaticText1',Left:16,Top:16,Caption:'',Alignment:'taCenter',BorderStyle:'sbsSunken',Font:{Name:'Times New Roman',Color:0xFF0000,Size:30}},{type:'TTimer',Name:'Timer1',Left:240,Top:8,events:{OnTimer:'Timer1Timer'}}],
    code:H('Timer1Timer','  StaticText1->Caption=Now().TimeString();\n  Form1->Caption=Now().DateString();')},
  checks:[{name:'FormStyle = fsStayOnTop',act:[],exp:[['Form1','FormStyle',3]]}],
  steps:[{t:'Щёлкни по пустому месту формы (выделится Form1), в Object Inspector найди <b>FormStyle</b> и выбери <b>fsStayOnTop</b>.',c:{check:0}}],
  palette:['TStaticText','TTimer']};
const L12=[
 {id:'c9-first',name:'Обучалка 1. Первая оконная программа',wtitle:'Обучалка: кнопка меняет надпись',text:R`<p>Познакомимся со средой: положим на форму надпись и кнопку, напишем первый обработчик события и запустим программу. Иди по шагам в жёлтой панели — выполненный шаг отмечается ✓.</p>`,vcl:FIRST,
  steps:R`<ul><li><b>Компонент</b> — готовый «кирпичик» с палитры. У каждого есть <b>свойства</b> (Caption — надпись, Name — имя в программе) и <b>события</b> (OnClick — щелчок).</li><li><b>Обработчик события</b> — функция, которую Builder вызывает, когда событие произошло. Её заголовок Builder пишет сам: <code>void __fastcall TForm1::Button1Click(TObject *Sender)</code>.</li><li><code>Label1-&gt;Caption = "Привет!";</code> — свойству Caption объекта Label1 присвоили строку. Label1 — указатель на объект, поэтому стрелка <code>-&gt;</code>.</li></ul>`},
 {id:'c9-clock',name:'ООП-лаба 1-2. Цифровые часы-календарь',wtitle:'Лабораторная № 1-2: цифровые часы-календарь (Digital clock - calendar)',text:R`<p><b>Цель работы (The purpose of work):</b> знакомство со средой быстрой разработки приложений C++Builder (RAD — rapid application development) и основными визуальными и невизуальными компонентами (Label, Button, Timer), создание линейной программы «Цифровые часы-календарь» (Digital Clock - Calendar).</p>
<p><b>Вопросы для самоподготовки:</b> основные принципы ООП, визуальные (visual) и невизуальные (non-visual) компоненты стандартной палитры компонентов.</p>
<p><b>Постановка задачи:</b> написать программу, которая показывает текущие дату и время.</p>
<p><b>Порядок выполнения:</b></p><ol><li>Создайте новый проект: File → New → Application (Файл → Создать → Приложение).</li><li>Положите на форму компоненты: StaticText (вкладка Additional) и Timer (вкладка System).</li><li>Задайте свойства объектов по таблице:</li></ol>${CLOCK_TBL}
<ol start="4"><li>Дважды щёлкните по значку Timer — в открывшемся окне редактора кода нужно написать обработчик события (event handler). Он состоит из двух строк:<br><b><code>StaticText1-&gt;Caption=Now().TimeString();</code><br><code>Form1-&gt;Caption=Now().DateString();</code></b></li>
<li>Сохраните программу (File → Save All или Shift+Ctrl+S), имя проекта — TIMEDATE. Запустите клавишей F9 (или Run → Run).</li><li>После компиляции на экране появится окно с часами.</li></ol>
<details class="en"><summary>Оригинал (англ.)</summary><p><b>The purpose of work:</b> Acquaintance with the C++Builder is a rapid application development (RAD) environment and the basic visual and non-visual components (Label, Button, Timer), creation of the linear program “Digital Clock - Calendar”.</p>
<p><b>Questions for self-training:</b> The basic principles of object-oriented programming, visual and non-visual components from the standard component palette.</p>
<p><b>Formulation of the problem:</b> Write a program that can be used to display the current date and time.</p>
<p><b>The order of performance:</b> 1) Create a new project by selecting File-&gt;New-&gt;Application 2) Place the following components on the form: StaticText (select from TAB Additional) and Timer (select from TAB System). 3) Set the properties of the objects in accordance with the data from the table. 4) Double-click on the Timer icon, in the opened window of the code inspector you need to write a program - an event handler. The text will consist of two lines. 5) Save the program (click on the File –&gt; save all or shift+ctrl+s) and specify the name of the project TIMEDATE. Run the program using the key F9 (or Run-&gt;Run) 6) After the project is broadcast, a clock window will appear on the monitor screen.</p></details>`,
  vcl:CLOCK,
  steps:R`<ul><li><b>Timer</b> — невизуальный компонент: на форме при работе его не видно, но он каждые Interval миллисекунд вызывает событие <b>OnTimer</b>.</li><li><code>Now()</code> — функция VCL, возвращает текущие дату и время (тип TDateTime). <code>.TimeString()</code> — время строкой «11:08:52», <code>.DateString()</code> — дата «19.11.2026».</li><li>Первая строка пишет время в StaticText1, вторая — дату в заголовок формы (свойство Caption формы — это текст в синей полосе окна).</li><li>Обработчик вызывается раз в секунду — поэтому часы «идут».</li></ul>`},
 {id:'c9-stay',name:'Доп. задание 1 (Additional task 1)',wtitle:'Доп. задание 1: окно поверх всех',text:R`<p>Измените свойство FormStyle объекта Form1 на fsStayOnTop («всегда сверху»). Убедитесь, что часы теперь находятся поверх окон других программ.</p><details class="en"><summary>Оригинал (англ.)</summary><p>Change the FormStyle property of the Form1 object to fsStayOnTop. Make sure the clock is now on top of the rest of the windows of other programs.</p></details>`,vcl:STAY,
  steps:R`<p><b>FormStyle</b> — стиль формы. <b>fsStayOnTop</b> — окно всегда поверх остальных окон Windows (как «липкие» часы). В тренажёре это видно только по свойству; в настоящем Builder проверь, переключаясь на другие программы.</p>`},
 {id:'c9-icon',name:'Доп. задания 2–4 (иконка и Release)',text:R`<ol start="2"><li>Обратите внимание: у всех созданных программ одинаковая иконка (значок). Измените её встроенным редактором Image Editor: в главном меню Tools → Image Editor. Создайте новую иконку, нарисуйте любую картинку на пустом поле и сохраните её в папку с программой часов-календаря. Чтобы встроить иконку в программу: Project → Options → Application → Load Icon и выберите файл иконки.</li>
<li>Программы, собранные с настройками «по умолчанию», могут не запускаться на компьютерах без Borland C++ Builder 6: им нужны файлы библиотек (*.dll, *.lib, *.bpl). Чтобы нужные библиотеки вошли прямо в exe-файл, измените настройки: а) Project → Options → Compiler, нажмите кнопку Release; б) на вкладке Packages снимите галочку Build with runtime packages («собирать с пакетами времени выполнения»); в) на вкладке Linker снимите галочку Use dynamic RTL («использовать динамическую библиотеку RTL»).</li>
<li>Сохраните и пересоберите весь проект. Полученный exe-файл будет работать на всех компьютерах!</li></ol>
<details class="en"><summary>Оригинал (англ.)</summary><ol start="2"><li>Note that when you create programs, they all have an icon with the same pattern in the form of a block of blue houses. Modify the icon with the built-in Image Editor tool. From the main menu of the program, choose Tools-&gt;Image Editor. Create a new icon using the tools of a graphical editor, draw an arbitrary picture on an empty field. Save it in the directory with the digital calendar clock program. To embed the icon you created in the program, you must in the menu Project-&gt;Options-&gt;Application-&gt;Load Icon and select the desired icon file.</li>
<li>Programs obtained in the development environment with "default" settings may not work on computers where Borland C Builder 6 is not installed. This is because programs require some library files for their work (*.dll,*.lib,*.bpl). To solve this problem, you must change the development environment settings so that the required library files are packaged in the program executable file: a) Choose Project-&gt; Options-&gt; Compiler and press the Release softkey. b) Click the Packages tab and clear the check box in front of the line Build with runtime packages c) Click the Linker tab and clear the check box in front of the line Use dynamic RTL</li>
<li>Save and recompile the entire project. The resulting program file will work on all computers!</li></ol></details>`,
  note:R`<aside class="add"><span class="tag">как сделать</span> Эти пункты выполняются только в настоящем C++Builder (тренажёр не создаёт exe-файл). Порядок: Tools → Image Editor → File → New → Icon File (.ico) → нарисовать → Save; Project → Options → вкладка Application → Load Icon. Для переносимого exe: Project → Options → Compiler → кнопка Release; Packages → снять «Build with runtime packages»; Linker → снять «Use dynamic RTL»; Project → Build Project1.</aside>`},
];
CPP.topic('c9',{n:9,
 title:'Интегрированная среда разработки Borland C++Builder',
 intro:R`<aside class="fix"><span class="tag">как работать</span> С этой темы программы оконные. В заданиях — тренажёр <b>«C++Builder 6»</b>: слева Object Inspector, сверху палитра компонентов, в центре форма, ниже Unit1.cpp. Выбери компонент на палитре → щёлкни по форме → настрой свойства → двойной щелчок для обработчика → <b>▶ Run (F9)</b>. Кнопка «✓ Проверить» сама «понажимает» твою программу и скажет, работает ли она как в задании.</aside>`,
 lecSub:'IDE, части C++Builder (палитра, форма, Object Inspector, редактор кода), проект, компиляция, ошибки и отладка.',
 lecture:LECTURE,
 labs:[{id:'c9-lab',short:'ООП-лаба 1-2',title:'Обучалка и ООП-лаба 1-2. Создание проекта. Работа с формами. «Цифровые часы-календарь»',show:3,tasks:L12}],
 umkd:[
  ['Что такое интегрированная среда разработки (IDE)?','Программа, объединяющая все инструменты разработки: редактор кода, компилятор, компоновщик, отладчик, визуальный дизайнер.'],
  ['Что такое Borland C++Builder?','Среда быстрой разработки (RAD) приложений Windows на C++ с визуальным дизайнером форм и библиотекой компонентов VCL.'],
  ['Основные компоненты IDE C++Builder?','Главное меню и панели инструментов, палитра компонентов, дизайнер форм, Object Inspector, Object TreeView, редактор кода, Project Manager, окно сообщений.'],
  ['Назначение редактора исходного кода (Code Editor)?','Писать и править текст программы (Unit1.cpp, Unit1.h) с подсветкой синтаксиса; это часть IDE, где хранятся команды программы.'],
  ['Что такое Object Inspector?','Окно IDE для просмотра и изменения свойств (Properties) и событий (Events) выбранного объекта.'],
  ['Что такое палитра компонентов (Component Palette)?','Панель с вкладками готовых компонентов (Standard, Additional, Win32, System, Dialogs…), которые кладут на форму.'],
  ['Что такое дизайнер форм (Form Designer)?','Окно, где визуально строят интерфейс: размещают, двигают и меняют размеры компонентов на форме.'],
  ['Что такое проект в C++Builder?','Набор файлов одной программы: .bpr, Project1.cpp, Unit1.cpp, Unit1.h, Unit1.dfm, .res; из него собирается exe.'],
  ['Основные этапы компиляции и запуска?','Сохранение → препроцессор → компиляция .cpp в .obj → компоновка с библиотеками в .exe → запуск (F9).'],
  ['Что такое отладка?','Поиск и исправление ошибок с помощью точек останова, пошагового выполнения (F7, F8) и просмотра значений переменных.'],
  ['Разница между синтаксической, семантической и логической ошибкой?','Синтаксическая — нарушение правил записи (компилятор не соберёт); семантическая — недопустимый смысл, например необъявленная переменная или несовместимые типы (тоже ловит компилятор); логическая — программа работает, но неверно (ищется тестированием и отладкой).'],
 ],
 srs:R`<aside class="add"><span class="tag">СРС к теме 9</span> Установить пробную версию C++Builder (embarcadero.com/products/cbuilder), настроить и изучить интерфейс IDE — по таблице частей IDE в лекции.</aside>`,
 foot:'Источники: УМКД «Programming I» (тема 9), лабораторная работа LABORATORY WORK # 1-2 «Create a project. Work with forms» (создание проекта, работа с формами; оригинал на английском), доп. практическая «Digital clock - calendar», «Полезная инфа».'
});
})();
