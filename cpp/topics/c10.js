/* C++ · Тема 10. Создание проекта. Работа с формами. Дизайнер форм */
(function(){ const R=String.raw; const H=CPP.H;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 10 из УМКД (перевод) и моя лекция.</aside>
  <h2 id="c10-lec">Лекция 10. Создание проекта. Работа с формами. Дизайнер форм</h2>
  <p><b>Цель:</b> научить создавать проект и разрабатывать графический интерфейс пользователя с помощью форм и дизайнера форм.</p>
  <p><b>Основные пункты:</b> понятие проекта в C++Builder; создание нового проекта; базовая структура проекта; основные файлы проекта; понятие формы; форма как основа графического интерфейса; создание и сохранение форм; дизайнер форм; палитра компонентов; добавление компонентов на форму; перемещение, изменение размеров и выравнивание; связь формы с программным кодом; создание простого графического приложения.</p>
  <aside class="add"><span class="tag">дополнение · проект и форма</span>
    <p><b>Создание проекта:</b> File → New → Application. Builder сразу создаёт пустую форму Form1 и модуль Unit1. Сохранять лучше в отдельную папку: File → Save All — сначала спросит имя Unit1.cpp, потом Project1.bpr.</p>
    <div class="tw"><table><tr><th>Файл</th><th>Что внутри</th></tr>
      <tr><td>Project1.bpr</td><td>настройки проекта</td></tr><tr><td>Project1.cpp</td><td>главная функция WinMain: создаёт формы и запускает приложение (<code>Application-&gt;Run()</code>)</td></tr>
      <tr><td>Unit1.cpp</td><td>код формы — обработчики событий</td></tr><tr><td>Unit1.h</td><td>объявление класса TForm1: компоненты и обработчики (Builder пишет сам)</td></tr>
      <tr><td>Unit1.dfm</td><td>описание вида формы: какие компоненты, где лежат, их свойства</td></tr><tr><td>Project1.res</td><td>ресурсы: значок программы</td></tr></table></div>
    <p><b>Форма (Form)</b> — главный элемент любого приложения: окно, контейнер, на котором размещаются все визуальные и невизуальные компоненты. Каждая форма — объект класса TForm1, наследника TForm. Пользователь работает с программой через формы — это и есть <b>графический интерфейс пользователя (GUI)</b>: окна, кнопки, поля, меню, которыми управляют мышью и клавиатурой.</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · дизайнер форм</span>
    <ul><li><b>Добавить компонент:</b> щёлкнуть его на палитре, затем по форме (или двойной щелчок на палитре — компонент встанет в центр).</li>
      <li><b>Переместить</b> — перетащить мышью или стрелками с Ctrl; <b>размер</b> — потянуть за чёрные квадратики (или Shift+стрелки). Точная настройка — свойствами Left, Top, Width, Height в Object Inspector.</li>
      <li><b>Выравнивание:</b> выделить несколько компонентов (Shift+щелчок) → правая кнопка → Align (по левому краю, по центру…), Size (одинаковый размер). Свойство <b>Align</b> прижимает компонент к краю родителя (alTop, alBottom, alLeft, alRight, alClient — заполнить всё).</li>
      <li><b>Связь формы с кодом:</b> каждый компонент — поле класса формы (<code>TButton *Button1;</code> в Unit1.h). Двойной щелчок по компоненту создаёт обработчик его главного события в Unit1.cpp. Свойства можно менять и в Object Inspector (при проектировании), и в коде (во время работы).</li>
      <li><b>Этапы создания простого приложения:</b> 1) новый проект; 2) разместить компоненты; 3) настроить свойства; 4) написать обработчики событий; 5) сохранить; 6) запустить и проверить (F9).</li>
      <li><b>Несколько форм:</b> File → New → Form добавляет Form2; в Unit1.cpp подключить <code>#include "Unit2.h"</code>; открыть — <code>Form2-&gt;Show();</code> (можно работать с обеими) или <code>Form2-&gt;ShowModal();</code> (пока Form2 открыта, первая недоступна); закрыть — <code>Close();</code>. Без стандартного метода: <code>Form2-&gt;Visible = true;</code></li></ul>
  </aside>
</div>`;
const BG={form:{Caption:'Мигалка',Width:320,Height:200},comps:[],code:'',
  ref:{form:{Caption:'Мигалка',Width:320,Height:200},comps:[{type:'TTimer',Name:'Timer1',Left:16,Top:16,Interval:500,events:{OnTimer:'Timer1Timer'}}],
    code:H('Timer1Timer','  static int k = 0;                       // static: значение сохраняется между вызовами\n  TColor c[3] = {clRed, clGreen, clBlue};\n  Form1->Color = c[k % 3];\n  k++;')},
  checks:[{name:'1-й тик таймера — красный',act:[['tick','Timer1',1]],exp:[['Form1','Color','clRed']]},{name:'2-й тик — зелёный, 3-й — синий',act:[['tick','Timer1',3]],exp:[['Form1','Color','clBlue']]}],
  steps:[{t:'Вкладка <b>System</b> → <b>Timer</b> → щёлкни по форме.',c:{comp:'TTimer'}},
    {t:'У Timer1 в Object Inspector поставь <b>Interval = 500</b> (полсекунды).',c:{prop:['Timer1','Interval',500]}},
    {t:'Двойной щелчок по Timer1 → обработчик <code>Timer1Timer</code>.',c:{handler:'Timer1Timer'}},
    {t:'Внутри напиши: <code>static int k = 0;</code> <code>TColor c[3] = {clRed, clGreen, clBlue};</code> <code>Form1-&gt;Color = c[k % 3];</code> <code>k++;</code>',c:{check:1}},
    {t:'F9 — фон формы меняет цвет каждые полсекунды.',c:{run:true}},
    {t:'Попробуй сам: случайный цвет <code>Form1-&gt;Color = RGB(random(256), random(256), random(256));</code> (нужен <code>#include &lt;stdlib.h&gt;</code> — в vcl.h он уже есть).',c:{code:'RGB\\s*\\('}}],
  palette:['TTimer','TButton','TLabel']};
const CALC_REF={form:{Caption:'Простейший калькулятор',Width:360,Height:230},
  comps:[{type:'TEdit',Name:'Edit1',Left:16,Top:16,Width:120,Text:''},{type:'TEdit',Name:'Edit2',Left:16,Top:48,Width:120,Text:''},
    {type:'TButton',Name:'Button1',Left:152,Top:16,Width:40,Caption:'+',events:{OnClick:'Button1Click'}},{type:'TButton',Name:'Button2',Left:200,Top:16,Width:40,Caption:'-',events:{OnClick:'Button2Click'}},
    {type:'TButton',Name:'Button3',Left:248,Top:16,Width:40,Caption:'*',events:{OnClick:'Button3Click'}},{type:'TButton',Name:'Button4',Left:296,Top:16,Width:40,Caption:'/',events:{OnClick:'Button4Click'}},
    {type:'TLabel',Name:'Label1',Left:16,Top:88,Caption:'Результат',Font:{Size:14}},{type:'TBitBtn',Name:'BitBtn1',Left:248,Top:144,Kind:'bkClose',Caption:'BitBtn1'}],
  code:H('Button1Click','  double a = StrToFloat(Edit1->Text);\n  double b = StrToFloat(Edit2->Text);\n  Label1->Caption = FloatToStr(a + b);\n  Edit1->SetFocus();')+H('Button2Click','  double a = StrToFloat(Edit1->Text);\n  double b = StrToFloat(Edit2->Text);\n  Label1->Caption = FloatToStr(a - b);\n  Edit1->SetFocus();')+
    H('Button3Click','  double a = StrToFloat(Edit1->Text);\n  double b = StrToFloat(Edit2->Text);\n  Label1->Caption = FloatToStr(a * b);\n  Edit1->SetFocus();')+H('Button4Click','  double a = StrToFloat(Edit1->Text);\n  double b = StrToFloat(Edit2->Text);\n  if (b == 0) Label1->Caption = "Деление на 0!";\n  else Label1->Caption = FloatToStr(a / b);\n  Edit1->SetFocus();')};
const CALC_CHECKS=[{name:'6 + 3 = 9',act:[['set','Edit1','Text','6'],['set','Edit2','Text','3'],['click','Button1']],exp:[['Label1','Caption','9']]},
  {name:'6 − 3 = 3',act:[['set','Edit1','Text','6'],['set','Edit2','Text','3'],['click','Button2']],exp:[['Label1','Caption','3']]},
  {name:'6 * 3 = 18',act:[['set','Edit1','Text','6'],['set','Edit2','Text','3'],['click','Button3']],exp:[['Label1','Caption','18']]},
  {name:'7 / 2 = 3,5 (дробное деление)',act:[['set','Edit1','Text','7'],['set','Edit2','Text','2'],['click','Button4']],exp:[['Label1','Caption',3.5]]},
  {name:'На 0 делить нельзя — без вылета программы',act:[['set','Edit1','Text','5'],['set','Edit2','Text','0'],['click','Button4']],exp:[['Label1','Caption',{re:'0|ноль|нельзя'}]]}];
const CALC={form:{Caption:'Form1',Width:360,Height:230},comps:[],code:'',ref:CALC_REF,checks:CALC_CHECKS,
  steps:[{t:'Положи на форму два <b>Edit</b> (поля ввода чисел).',c:{comp:'TEdit',count:2}},
    {t:'Положи четыре <b>Button</b> и одну <b>Label</b> (для результата).',c:{comp:'TButton',count:4}},
    {t:'Подпиши кнопки (Caption): <b>+ − * /</b> по порядку Button1…Button4. У Edit1 и Edit2 сотри Text.',c:{prop:['Button4','Caption','/']}},
    {t:'Двойной щелчок по «+». Программа берёт текст из полей и превращает в числа: <code>double a = StrToFloat(Edit1-&gt;Text);</code> <code>double b = StrToFloat(Edit2-&gt;Text);</code> <code>Label1-&gt;Caption = FloatToStr(a + b);</code>',c:{check:0}},
    {t:'Так же для «−» и «*» (двойной щелчок по каждой кнопке).',c:{check:2}},
    {t:'Для «/» проверь деление на 0: <code>if (b == 0) Label1-&gt;Caption = "Деление на 0!"; else …</code>',c:{check:4}},
    {t:'С вкладки <b>Additional</b> положи <b>BitBtn</b>, свойство <b>Kind = bkClose</b> — кнопка «Close» закрывает программу без единой строки кода.',c:{comp:'TBitBtn'}},
    {t:'F9 и посчитай. Попробуй ввести букву — Builder покажет исключение EConvertError (так и в настоящем Builder).',c:{run:true}}],
  palette:['TLabel','TEdit','TButton','TBitBtn','TMemo','TStaticText']};
const ONE_EDIT={form:{Caption:'Калькулятор',Width:360,Height:200},
  comps:[{type:'TEdit',Name:'Edit1',Left:16,Top:16,Width:200,Text:''},{type:'TButton',Name:'Button1',Left:232,Top:14,Caption:'=',events:{OnClick:'Button1Click'}},{type:'TLabel',Name:'Label1',Left:16,Top:56,Caption:'',Font:{Size:14}},{type:'TMemo',Name:'Memo1',Left:16,Top:88,Width:300,Height:60,Lines:[]}],
  code:'',
  ref:{form:{Caption:'Калькулятор',Width:360,Height:200},
    comps:[{type:'TEdit',Name:'Edit1',Left:16,Top:16,Width:200,Text:''},{type:'TButton',Name:'Button1',Left:232,Top:14,Caption:'=',events:{OnClick:'Button1Click'}},{type:'TLabel',Name:'Label1',Left:16,Top:56,Caption:'',Font:{Size:14}},{type:'TMemo',Name:'Memo1',Left:16,Top:88,Width:300,Height:60,Lines:[]}],
    code:H('Button1Click','  AnsiString s = Edit1->Text;          // например "12*3"\n  int p = 0;\n  for (int i = 2; i <= s.Length(); i++)  // ищем знак (первый символ может быть минусом)\n    if (s[i] == \'+\' || s[i] == \'-\' || s[i] == \'*\' || s[i] == \'/\') { p = i; break; }\n  if (p == 0) { Label1->Caption = "Нет знака операции"; return; }\n  double a = StrToFloat(Trim(s.SubString(1, p - 1)));\n  double b = StrToFloat(Trim(s.SubString(p + 1, s.Length() - p)));\n  double r;\n  switch (s[p])\n  {\n    case \'+\': r = a + b; break;\n    case \'-\': r = a - b; break;\n    case \'*\': r = a * b; break;\n    case \'/\': if (b == 0) { Label1->Caption = "Деление на 0"; return; } r = a / b; break;\n  }\n  Label1->Caption = FloatToStr(r);\n  Memo1->Lines->Add(s + " = " + FloatToStr(r));   // история операций')},
  checks:[{name:'12*3 = 36 и запись в историю',act:[['set','Edit1','Text','12*3'],['click','Button1']],exp:[['Label1','Caption','36'],['Memo1','Lines','12*3 = 36']]},{name:'7/2 = 3,5',act:[['set','Edit1','Text','7/2'],['click','Button1']],exp:[['Label1','Caption',3.5]]},{name:'-5+8 = 3',act:[['set','Edit1','Text','-5+8'],['click','Button1']],exp:[['Label1','Caption','3']]}],
  palette:['TLabel','TEdit','TButton','TMemo']};
const SA_COMPS=[{type:'TLabel',Name:'Label1',Left:136,Top:40,Caption:'simple label',Font:{Name:'Times New Roman',Size:18}},
  {type:'TButton',Name:'Button1',Left:160,Top:112,Width:40,Caption:'up',events:{OnClick:'Button1Click'}},{type:'TButton',Name:'Button2',Left:160,Top:160,Width:40,Caption:'down',events:{OnClick:'Button2Click'}},
  {type:'TButton',Name:'Button3',Left:112,Top:136,Width:40,Caption:'left',events:{OnClick:'Button3Click'}},{type:'TButton',Name:'Button4',Left:208,Top:136,Width:40,Caption:'right',events:{OnClick:'Button4Click'}},
  {type:'TButton',Name:'Button5',Left:24,Top:200,Width:110,Caption:'increase font size',events:{OnClick:'Button5Click'}},{type:'TButton',Name:'Button6',Left:144,Top:200,Width:110,Caption:'decrease font size',events:{OnClick:'Button6Click'}},
  {type:'TButton',Name:'Button7',Left:264,Top:200,Width:90,Caption:'hide text',events:{OnClick:'Button7Click'}}];
const SIMPLE={form:{Caption:'Simple application',Width:390,Height:270},comps:SA_COMPS,
  code:H('Button1Click','  Label1->Top = Label1->Top - 5;')+H('Button2Click','')+H('Button3Click','')+H('Button4Click','')+H('Button5Click','  Label1->Font->Size += 2;')+H('Button6Click','')+H('Button7Click',''),
  ref:{form:{Caption:'Simple application',Width:390,Height:270},comps:SA_COMPS,
    code:H('Button1Click','  if (Label1->Top - 5 >= 0) Label1->Top = Label1->Top - 5;      // не выходить за верх формы')+
      H('Button2Click','  if (Label1->Top + Label1->Height + 5 <= ClientHeight) Label1->Top = Label1->Top + 5;')+
      H('Button3Click','  if (Label1->Left - 5 >= 0) Label1->Left = Label1->Left - 5;')+
      H('Button4Click','  if (Label1->Left + Label1->Width + 5 <= ClientWidth) Label1->Left = Label1->Left + 5;')+
      H('Button5Click','  Label1->Font->Size += 2;\n  if (Label1->Font->Size >= 40) Button5->Enabled = false;\n  Button6->Enabled = true;')+
      H('Button6Click','  Label1->Font->Size -= 2;\n  if (Label1->Font->Size <= 8) Button6->Enabled = false;\n  Button5->Enabled = true;')+
      H('Button7Click','  if (Label1->Visible)\n  {\n    Label1->Visible = false;\n    Button7->Caption = "show text";\n  }\n  else\n  {\n    Label1->Visible = true;\n    Button7->Caption = "hide text";\n  }')},
  checks:[{name:'up двигает вверх на 5',act:[['click','Button1']],exp:[['Label1','Top',35]]},{name:'down — вниз на 5',act:[['click','Button2']],exp:[['Label1','Top',45]]},
    {name:'left и right',act:[['click','Button3'],['click','Button3'],['click','Button4']],exp:[['Label1','Left',131]]},
    {name:'Метка не уходит за верх формы',act:[['set','Label1','Top',3],['click','Button1']],exp:[['Label1','Top',3]]},
    {name:'increase: +2, на 40 кнопка выключается',act:[['set','Label1','Top',40],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5'],['click','Button5']],exp:[['Label1','Font.Size',40],['Button5','Enabled',false]]},
    {name:'decrease: −2, на 8 кнопка выключается',act:[['click','Button6'],['click','Button6'],['click','Button6'],['click','Button6'],['click','Button6']],exp:[['Label1','Font.Size',8],['Button6','Enabled',false]]},
    {name:'hide text / show text',act:[['click','Button7']],exp:[['Label1','Visible',false],['Button7','Caption','show text']]}],
  palette:['TLabel','TButton','TEdit','TRadioGroup']};
const T=[
 {id:'c10-bg',name:'Обучалка 2. Фон формы по таймеру',wtitle:'Обучалка: цвет фона меняется по таймеру',text:R`<p>Научимся менять свойства формы <b>во время работы</b> программы. Фон формы будет по кругу становиться красным, зелёным и синим — каждые полсекунды.</p>`,vcl:BG,
  steps:R`<ul><li><code>Form1-&gt;Color</code> — свойство «цвет фона». Цвета VCL: clRed, clGreen, clBlue, clYellow, clWhite, clBtnFace (серый по умолчанию)…, тип <b>TColor</b>.</li><li>Обработчик OnTimer вызывается снова и снова, а нам надо помнить, какой цвет был. Обычная локальная переменная каждый раз создавалась бы заново, поэтому <code>static int k</code> — она сохраняет значение между вызовами (тема 5).</li><li><code>k % 3</code> даёт 0, 1, 2, 0, 1, 2… — индекс в массиве цветов.</li><li><code>RGB(r, g, b)</code> — любой цвет из красной, зелёной и синей составляющих (0…255).</li></ul>`},
 {id:'c10-calc',name:'Обучалка 3 = ООП-лаба 1-2, контрольное задание 1. Простейший калькулятор',wtitle:'«Простейший калькулятор» (Simplest Calculator)',text:R`<p><b>Контрольные задания и вопросы (ООП-лаба 1-2):</b></p><ol><li>Создайте программу «Простейший калькулятор» (Simplest Calculator), которая выполняет простейшие арифметические действия. Положите на форму 4 кнопки Button (+, -, *, /), 2 поля Edit (для ввода чисел) и 1 надпись Label (для вывода результата).</li><li>Напишите обработчики события OnClick для каждой кнопки.</li><li>Добавьте кнопку BitBtn (вкладка Additional) для выхода (вид кнопки задаётся свойством Kind). Узнайте, для чего свойство Glyph (картинка на кнопке).</li><li>С помощью FocusControl поставьте курсор в нужное поле, а методом SetFocus переводите фокус (focus — активное поле ввода) в другое поле.</li></ol><details class="en"><summary>Оригинал (англ.)</summary><ol><li>Create the «Simplest Calculator» program, which performs the simplest arithmetic operations. Add 4 Button objects to the form (+,-,*,/), 2 objects Edit (for data input) and 1 objects Label (for display of result).</li><li>Write the onClick event handlers for each button.</li><li>Add a BitBtn object (Additional tab) to exit (Use the Kind property to set the desired button view). Learn what this object's Gliph property is for.</li><li>Use the FocusControl method to set the cursor on the desired field, and use the SetFocus method to transfer focus to another input field.</li></ol></details>`,vcl:CALC,
  steps:R`<ul><li><b>Edit1-&gt;Text</b> — строка (AnsiString). Чтобы посчитать, её превращают в число: <code>StrToFloat</code> (для целых — <code>StrToInt</code>). Обратно в строку — <code>FloatToStr</code> / <code>IntToStr</code>.</li><li>Если в поле буквы, StrToFloat выбросит исключение <b>EConvertError</b> «'abc' is not a valid floating point value».</li><li><b>BitBtn</b> — кнопка с картинкой. Свойство <b>Kind</b> задаёт готовый вид (bkOK, bkClose…); <b>Glyph</b> — своя картинка (bmp) на кнопке. bkClose закрывает форму сама.</li><li><code>Edit1-&gt;SetFocus();</code> — перевести курсор (фокус ввода) в поле Edit1. <b>FocusControl</b> — свойство Label: какое поле получит фокус, если нажать Alt + подчёркнутую букву надписи (Caption «&amp;Число»).</li></ul>`},
 {id:'c10-one',name:'Доп. задания к калькулятору (практическая «Digital clock - calendar», 3–5)',wtitle:'Калькулятор с одним полем и историей',text:R`<ol start="3"><li>Пользователь может менять размер окна — запретите это.</li><li>Добавьте в программу историю — например, компонент Memo, куда записываются все операции за сеанс.</li><li>Улучшите калькулятор: уберите одно поле Edit — теперь всё выражение вводится в одно поле.</li></ol><details class="en"><summary>Оригинал (англ.)</summary><ol start="3"><li>The user can resize the window, prevent him from doing this</li><li>Add a history to the program - for example, a Memo component, in which all session operations will be written.</li><li>Improve your calculator. get rid of one edit - now numbers will be entered in one edit.</li></ol></details>`,vcl:ONE_EDIT,
  note:R`<aside class="add"><span class="tag">подсказка</span> Запрет менять размер окна (п. 3): у формы <b>BorderStyle = bsSingle</b> (или bsDialog) и в BorderIcons убрать biMaximize. В тренажёре — свойство BorderStyle.</aside>`,
  steps:R`<ol><li>Вся строка «12*3» в <code>AnsiString s</code>. У AnsiString нумерация символов <b>с 1</b>: <code>s[1]</code> — первый, <code>s.Length()</code> — длина.</li><li>Ищем знак операции, начиная со 2-го символа (первый может быть минусом числа).</li><li><code>s.SubString(начало, длина)</code> — часть строки; <code>Trim</code> убирает пробелы.</li><li><code>switch</code> по символу операции; история — <code>Memo1-&gt;Lines-&gt;Add(...)</code>.</li></ol>`},
 {id:'c10-simple',name:'Доп. лаба «C++ Builder IDE: main components» (основные компоненты; simple application — простое приложение)',wtitle:'Простое приложение (Simple application)',text:R`<p>Сделайте графический интерфейс как на рисунке ниже: положите на форму один компонент Label и 7 кнопок Button. Свойство Caption у Label — “simple label”, свойство Font — Times New Roman 18. Назначение кнопок:</p><ol><li>“up” (вверх) — двигает Label вверх</li><li>“down” (вниз) — двигает Label вниз</li><li>“left” (влево) — двигает Label влево</li><li>“right” (вправо) — двигает Label вправо</li><li>“increase font size” (увеличить шрифт) — увеличивает размер шрифта Label на 2</li><li>“decrease font size” (уменьшить шрифт) — уменьшает размер шрифта на 2</li><li>“hide text” (скрыть текст) — делает Label невидимой (или видимой, если она скрыта)</li></ol>
<p>Обработчик щелчка по кнопке “up”: <code>Label1-&gt;Top=Label1-&gt;Top - 5;</code></p>
<p><b>Задание.</b> Обратите внимание: надпись может уйти за пределы формы. Измените код, чтобы этого не было. Самостоятельно напишите обработчики для кнопок «down», «left», «right». Измените код так: когда размер текста станет 40 пикселей, кнопка “increase font size” должна стать недоступной (Enabled = false). Напишите обработчик для «decrease font size» (кнопка недоступна, когда размер текста 8). Напишите обработчик для «hide»: если надпись видна — скрыть её, а текст кнопки поменять с “hide text” на “show text” (показать текст); если надпись скрыта — показать её.</p>
<p>Добавьте на форму кнопки для смены цвета формы (например, красный, синий, зелёный). *Добавьте компонент RadioGroup. Через его свойство Items создайте список названий цветов. Напишите обработчик, меняющий цвет шрифта надписи. Добавьте Edit и Button: по щелчку на кнопке текст из Edit записывается в Label.</p>
<p><b>Вопросы.</b> Для чего у RadioGroup свойство ItemIndex? Какие значения может принимать свойство Color у визуального компонента (например, Form, Label)?</p>
<details class="en"><summary>Оригинал (англ.)</summary><p>Design the graphical user interface like you can see below: place to the form a Label component and 7 Button components. Set up the value of Label component’s Caption property to “simple label”, Font property to Times New Roman 18. Functions of the buttons:</p><ol><li>“up” button – moving Label to the top</li><li>“down” button - moving Label to the bottom</li><li>“left” button - moving Label to the left</li><li>“right” button - moving Label to the right</li><li>“increase font size” button – increasing font size by 2 (Label)</li><li>“decrease font size” button – decreasing font size by 2 (Label)</li><li>“hide text” button – make Label component nonvisual (or visual if it is not)</li></ol>
<p>Let’s write the event handler for mouse clicking on the “up” button: <code>Label1-&gt;Top=Label1-&gt;Top - 5;</code></p>
<p><b>Task.</b> Pay attention that your button can leave the area of the form. Change the code to avoid this effect. Independently describe the event handlers for the buttons «down», «left», «right». Change your code in the following way: after the text become of 40 pixels in size, the “increase font size” button must become disabled (not enabled). Independently describe the event handlers for the button «decrease font size» (the button must become disabled when the size of the text is 8). Independently describe the event handlers for the button «hide»: if a label is visible it must become nonvisible, and the label of the button must change from “hide text” to “show text”. If a label is nonvisible it must become visible.</p>
<p>Add to the form the buttons to change the color of the form (for example, red, blue, green). *Add to the form a RadioGroup component. Using its Items property, create a list with the names of colors. Write an event handler to change the color of the label’s font. Add to the form an Edit and a Button component. After user’s click on the button, the text from the Edit to be written to the Label.</p>
<p><b>Questions.</b> What the ItemIndex property of the RadioGroup component intended for? What values may take the Color property of a visual component (for example, Form, Label)?</p></details>`,vcl:SIMPLE,
  note:R`<aside class="add"><span class="tag">ответы на вопросы</span> <b>ItemIndex</b> у RadioGroup — номер выбранного пункта (с 0; −1 — ничего не выбрано): <code>switch (RadioGroup1-&gt;ItemIndex) { case 0: Label1-&gt;Font-&gt;Color = clRed; break; … }</code>. <b>Color</b> принимает значения типа TColor: константы clRed, clBlue, clGreen, clYellow, clWhite, clBlack, clBtnFace, clWindow… или <code>RGB(r,g,b)</code>.</aside>`,
  steps:R`<ul><li>Top — расстояние от верха формы до метки. «Не выходить за форму»: перед сдвигом проверяем, что новое значение не меньше 0 и что низ метки (Top + Height) не больше высоты клиентской части формы (<code>ClientHeight</code>).</li><li><code>Button5-&gt;Enabled = false;</code> — кнопка становится серой и не нажимается.</li><li>Скрыть/показать: свойство <code>Visible</code>; надпись на кнопке меняем через её Caption.</li></ul>`},
 {id:'c10-forms',name:'Доп. лаба «C++ Builder IDE: dealing with forms» (работа с формами, несколько форм)',text:R`<p>Форма (Form) — главный элемент Windows-приложения. В каждом приложении одна главная форма (main form) и, возможно, несколько дополнительных (secondary forms). Главная форма загружается автоматически при запуске. Форма состоит из двух частей: клиентская область (client area) — часть формы со всеми визуальными компонентами; неклиентская область (nonclient area) — строка заголовка, рамки и т. п.</p>
<p>Некоторые свойства и методы формы: (свойства) Left, Top — координаты формы на экране; Align — выравнивание; AlphaBlend — включает прозрачность (если true); AlphaBlendValue — степень прозрачности (от 0 до 255); BorderStyle — вид рамки; (методы) Close — закрыть форму; Show, ShowModal — показать форму (ShowModal — модально, пока её не закроют, другие окна недоступны); Hide — спрятать форму.</p>
<p>Запустите C++ Builder. Добавьте в проект вторую форму. Подключите модуль (unit) второй формы к первой. На Form1 положите: Edit1 (ширина второй формы), Edit2 (высота), Edit3 (отступ слева), Edit4 (отступ сверху), Button1 (показывает вторую форму с заданными в полях параметрами), Label1 (сколько раз открывали вторую форму); на Form2 — Button1 (закрывает вторую форму). Показать вторую форму: <code>Form2-&gt;Show();</code> Закрыть: <code>Close();</code> Изменить ширину: <code>Form2-&gt;Width=StrToInt(Edit1-&gt;Text);</code></p>
<p><b>Задание.</b> Измените проект так, чтобы первая форма была невидима, пока видна вторая. Добавьте третью форму с полем Edit, куда пользователь вводит прозрачность первой формы (AlphaBlend и AlphaBlendValue). Самостоятельно выведите число открытий второй формы.</p>
<details class="en"><summary>Оригинал (англ.)</summary><p>A Form is a main element of the Windows application. Every application has one main form and (potentially) several subforms (secondary forms). The main form is automatically loaded when the application starts. Each form consists of two parts: client area – a part of the form that consists all visual components; nonclient area – a header row, frames and so on.</p>
<p>Some properties and methods of the Form: (property) Left, Top – coordinates of the form on a screen; Align; AlphaBlend – sets the transparency mode (if true); AlphaBlendValue – the transparency level (from 0 to 255); BorderStyle; (method) Close – closes the form; Show, ShowModal – show the form; Hide – hides the form.</p>
<p>Run C++ Builder. Add to the project the second form. Include the unit of the second form to the first form. Place on Form1: Edit1 (width of the second form), Edit2 (height), Edit3 (distance from the left), Edit4 (distance from the top), Button1 (shows the second form with all parameters given in edits), Label1 (the number of openings of the second form); on Form2: Button1 (closes the second form). To show the second form: <code>Form2-&gt;Show();</code> To close: <code>Close();</code> To change the width: <code>Form2-&gt;Width=StrToInt(Edit1-&gt;Text);</code></p>
<p><b>Task.</b> Change the project so that the first form to be invisible when the second form is visible. Add the edit component to the third form, in which user may enter the value of transparency of the first form (AlphaBlend and AlphaBlendValue). Independently write a code to display the number of openings of the second form.</p></details>`,
  note:R`<aside class="fix"><span class="tag">о тренажёре</span> Тренажёр работает с одной формой, поэтому вторую форму делаем в настоящем Builder: File → New → Form, затем в Unit1.cpp <code>#include "Unit2.h"</code>. Код ниже — эталон.</aside>
<pre class="cpp-code">// Unit1.cpp (Form1)
#include "Unit2.h"
int count = 0;                                  // сколько раз открывали Form2
void __fastcall TForm1::Button1Click(TObject *Sender)
{
  Form2-&gt;Width  = StrToInt(Edit1-&gt;Text);
  Form2-&gt;Height = StrToInt(Edit2-&gt;Text);
  Form2-&gt;Left   = StrToInt(Edit3-&gt;Text);
  Form2-&gt;Top    = StrToInt(Edit4-&gt;Text);
  count++;
  Label1-&gt;Caption = "Форма 2 открыта " + IntToStr(count) + " раз";
  Form1-&gt;Hide();                                // первая форма прячется
  Form2-&gt;Show();
}
// Unit2.cpp (Form2)
#include "Unit1.h"
void __fastcall TForm2::Button1Click(TObject *Sender)
{
  Close();
  Form1-&gt;Show();                                // вернуть первую форму
}
// Form3: прозрачность первой формы
void __fastcall TForm3::Button1Click(TObject *Sender)
{
  Form1-&gt;AlphaBlend = true;
  Form1-&gt;AlphaBlendValue = StrToInt(Edit1-&gt;Text);   // 0 — невидима, 255 — непрозрачна
  Close();
  Form1-&gt;Show();
}</pre>`},
];
CPP.topic('c10',{n:10,
 title:'Создание проекта. Работа с формами. Дизайнер форм',
 intro:R`<aside class="fix"><span class="tag">как работать</span> Окно «C++Builder 6» в заданиях работает как настоящее: палитра → форма → Object Inspector → двойной щелчок → Unit1.cpp → ▶ Run (F9). Кнопка «✓ Проверить» сама прогонит программу на тестах из задания. «📋 Эталон» загрузит готовое решение.</aside>`,
 lecSub:'Проект и его файлы, форма и GUI, дизайнер форм, добавление и выравнивание компонентов, связь формы с кодом, несколько форм.',
 lecture:LECTURE,
 labs:[{id:'c10-lab',short:'Обучалки и лабы',title:'Обучалки и ООП-лаба 1-2 (продолжение): фон по таймеру, калькулятор',show:2,tasks:T.slice(0,3)}],
 dop:[{id:'c10-dop',short:'Доп. лабы',title:'Доп. лабы: калькулятор как в Windows, simple application, несколько форм, три формы по кругу',show:1,tasks:[CPP.WINCALC_TASK].concat(T.slice(3),[CPP.FORMS3_TASK])}],
 umkd:[
  ['Что такое проект в C++Builder?','Совокупность файлов одной программы (.bpr, Project1.cpp, Unit1.cpp/.h/.dfm, .res), из которых собирается exe.'],
  ['Основные шаги создания нового проекта?','File → New → Application; разместить компоненты на форме; настроить свойства; написать обработчики; File → Save All; F9.'],
  ['Что такое форма?','Окно приложения, главный элемент и контейнер для визуальных и невизуальных компонентов; объект класса-наследника TForm.'],
  ['Назначение формы в визуальном приложении?','Быть интерфейсом программы: через форму и её компоненты пользователь вводит данные и получает результат.'],
  ['Что такое дизайнер форм?','Режим/окно IDE, в котором мышью размещают и настраивают компоненты на форме.'],
  ['Как добавить компоненты на форму?','Выбрать компонент на палитре компонентов и щёлкнуть по форме (или дважды щёлкнуть по значку на палитре).'],
  ['Как менять положение и размер компонента?','Перетаскиванием мышью и маркерами размера или свойствами Left, Top, Width, Height в Object Inspector; Align — прижать к краю.'],
  ['Связь формы и программного кода?','Компоненты формы — поля класса TForm1 (Unit1.h), события компонентов связаны с методами-обработчиками в Unit1.cpp; вид формы хранится в Unit1.dfm.'],
  ['Что такое графический интерфейс пользователя?','Окна, кнопки, поля ввода, меню и другие элементы, через которые пользователь управляет программой мышью и клавиатурой.'],
  ['Основные этапы создания простого визуального приложения?','Создать проект → разработать форму (компоненты) → задать свойства → написать обработчики событий → сохранить → запустить и проверить.'],
 ],
 srs:R`<aside class="add"><span class="tag">СРС к темам 10–11</span><ul><li>Свойства формы при проектировании и во время работы — обучалка 2, задание simple application.</li><li>Свойства только для чтения (например ClientWidth, ComponentCount, Handle): их можно читать в коде, но не задавать.</li><li>Обработчики щелчка по форме, изменения размера (OnClick, OnResize) — тема 11.</li><li>Приложение с двумя формами — доп. лаба «dealing with forms».</li></ul></aside>`,
 foot:'Источники: УМКД «Programming I» (тема 10), ООП-лаба 1-2, практическая «Digital clock - calendar», доп. лабы «main components» и «dealing with forms».'
});
})();
