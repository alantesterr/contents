/* C++ · Тема 11. Работа с формами: свойства, методы, события */
(function(){ const R=String.raw; const H=CPP.H;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 11 из УМКД (перевод), определения преподавателя (свойство, метод, событие, обработчик) и моя лекция.</aside>
  <h2 id="c11-lec">Лекция 11. Работа с формами: свойства и методы</h2>
  <p><b>Цель:</b> выработать практические навыки работы со свойствами, методами и событиями формы в C++Builder.</p>
  <p><b>Основные пункты:</b> понятие свойства объекта; понятие метода; работа с Object Inspector; основные свойства формы: Caption, Name, Width, Height, Color, Position, Visible, Enabled; изменение свойств при проектировании; изменение свойств программно; методы форм и компонентов; понятие события; обработчики событий; связь событий с методами; обработка основных событий формы; создание интерактивных графических приложений.</p>
  <aside class="add"><span class="tag">дополнение · свойства формы</span>
    <p><b>Свойство</b> (property) — характеристика объекта, определяющая, как он выглядит и работает. <b>Метод</b> — действие, которое объект умеет выполнять. <b>Разница:</b> свойство — «какой», его читают и присваивают (<code>Form1-&gt;Width = 300;</code>), метод — «что делает», его вызывают со скобками (<code>Form1-&gt;Close();</code>).</p>
    <div class="tw"><table><tr><th>Свойство</th><th>Смысл</th><th>Пример в коде</th></tr>
      <tr><td>Caption</td><td>текст в заголовке окна</td><td><code>Form1-&gt;Caption = "Калькулятор";</code></td></tr>
      <tr><td>Name</td><td>имя объекта в программе (меняют только в Object Inspector)</td><td>Form1</td></tr>
      <tr><td>Width, Height</td><td>ширина и высота в пикселях</td><td><code>Width = Width + 50;</code></td></tr>
      <tr><td>Left, Top</td><td>положение на экране</td><td><code>Left = 0;</code></td></tr>
      <tr><td>Color</td><td>цвет фона (TColor)</td><td><code>Color = clYellow;</code></td></tr>
      <tr><td>Position</td><td>где появится окно: poDesigned (как в дизайнере), poScreenCenter (по центру экрана), poDesktopCenter…</td><td></td></tr>
      <tr><td>Visible</td><td>видимо ли окно/компонент</td><td><code>Label1-&gt;Visible = false;</code></td></tr>
      <tr><td>Enabled</td><td>доступно ли (false — серое, не реагирует)</td><td><code>Button1-&gt;Enabled = false;</code></td></tr>
      <tr><td>BorderStyle, FormStyle, AlphaBlend…</td><td>рамка, «поверх всех», прозрачность</td><td></td></tr></table></div>
    <p><b>Изменение свойств:</b> при проектировании — в Object Inspector (вкладка Properties), во время работы — программно, присваиванием в обработчике. Внутри методов формы можно писать просто <code>Color = clRed;</code> (это свойство своей формы) или <code>Form1-&gt;Color = clRed;</code>.</p>
    <p><b>Методы форм и компонентов:</b> Show(), ShowModal(), Hide(), Close() у формы; Clear() у Memo и Edit; SetFocus() — передать фокус ввода; Lines-&gt;Add(…), Items-&gt;Add(…) у списков.</p>
  </aside>
  <aside class="add"><span class="tag">дополнение · события и обработчики</span>
    <p><b>Событие</b> (event) — сообщение операционной системы приложению о том, что что-то произошло: щелчок, нажатие клавиши, движение мыши, срабатывание таймера, изменение размера окна. <b>Обработчик события</b> — специальная функция, которая выполняется в ответ на событие.</p>
    <p><b>Связь события с методом:</b> в Object Inspector на вкладке <b>Events</b> напротив события стоит имя метода. Двойной щелчок создаёт новый метод; из выпадающего списка можно выбрать уже существующий — так одна функция обслуживает несколько кнопок и пунктов меню (параметр <code>Sender</code> подскажет, кто вызвал).</p>
    <div class="tw"><table><tr><th>Событие</th><th>Когда</th></tr>
      <tr><td>OnCreate</td><td>форма создаётся при запуске (начальные настройки)</td></tr>
      <tr><td>OnShow / OnActivate</td><td>форма показана / стала активной</td></tr>
      <tr><td>OnClick, OnDblClick</td><td>щелчок / двойной щелчок</td></tr>
      <tr><td>OnMouseMove, OnMouseDown, OnMouseUp</td><td>движение мыши, нажатие и отпускание кнопки мыши (X, Y, Shift)</td></tr>
      <tr><td>OnKeyPress, OnKeyDown</td><td>нажатие клавиши (Key)</td></tr>
      <tr><td>OnResize</td><td>изменился размер формы</td></tr>
      <tr><td>OnClose</td><td>форма закрывается</td></tr>
      <tr><td>OnChange</td><td>у Edit/Memo изменился текст, у ScrollBar — позиция</td></tr></table></div>
    <p><b>Обработка действий пользователя:</b> программа «ничего не делает», пока не произойдёт событие; весь код — в обработчиках. Так строится <b>событийно-управляемое</b> интерактивное приложение.</p>
  </aside>
</div>`;
const GRAM_COMPS=[{type:'TPanel',Name:'Panel1',Align:'alBottom',Height:150,Caption:''},{type:'TPanel',Name:'Panel2',Align:'alLeft',Width:220,Caption:''},
  {type:'TMemo',Name:'Memo1',Align:'alClient',Lines:[]},
  {type:'TLabel',Name:'Label1',parent:'Panel2',Left:24,Top:24,Caption:'Введите значение в граммах'},{type:'TEdit',Name:'Edit1',parent:'Panel2',Left:40,Top:48,Width:80,Text:''},
  {type:'TScrollBar',Name:'ScrollBar1',parent:'Panel2',Left:40,Top:76,Width:80,Min:-1000,Max:1000,Position:0,events:{OnScroll:'ScrollBar1Scroll'}},
  {type:'TListBox',Name:'ListBox1',parent:'Panel1',Left:16,Top:8,Width:120,Height:100,Items:['Фунт','Пуд','Унция','Драхм','Гран'],events:{OnClick:'ListBox1Click'}},
  {type:'TGroupBox',Name:'GroupBox1',parent:'Panel1',Left:160,Top:8,Width:150,Height:100,Caption:'GroupBox1'},
  {type:'TCheckBox',Name:'CheckBox1',parent:'GroupBox1',Left:16,Top:20,Caption:'Красный цвет',events:{OnClick:'CheckBox1Click'}},
  {type:'TCheckBox',Name:'CheckBox2',parent:'GroupBox1',Left:16,Top:52,Width:120,Caption:'Увеличить размер',events:{OnClick:'CheckBox2Click'}},
  {type:'TBitBtn',Name:'BitBtn1',parent:'Panel1',Left:120,Top:116,Kind:'bkClose',Caption:'BitBtn1'}];
const GRAM_CODE=H('ListBox1Click',R`float x,y;
 int i;
{
if (Edit1->Text=="") return;            // в лабе: if (Edit1->Text==' ') exit;
x=StrToFloat(Edit1->Text);
switch (ListBox1->ItemIndex)
{ case 0: y=x/100; break;
 case 1: y=x/16420; break;
 case 2: y=x/21525; break;
 case 3: y=x/212456; break;
 case 4: y=x/0.0648; break;              // в лабе «Гран» нет — добавлено
}
Memo1->Lines->Add(FloatToStr(y)+(ListBox1->Items->Strings[ListBox1->ItemIndex]));
}`)+H('CheckBox1Click',R`if (CheckBox1->State==cbChecked) Memo1->Font->Color=clRed;
 else                    Memo1->Font->Color=clGreen;`)+H('CheckBox2Click',R` if (CheckBox2->State==cbChecked)
 Memo1->Font->Size=StrToInt(Memo1->Font->Size)+3;
 else
 Memo1->Font->Size=StrToInt(Memo1->Font->Size)-3;`)+H('ScrollBar1Scroll',R`float x;
{
x=ScrollBar1->Position;
Edit1->Text=FloatToStr(x);
}`,'TObject *Sender,\n      TScrollCode ScrollCode, int &ScrollPos');
const GRAM={form:{Caption:'Form1',Width:470,Height:340},comps:GRAM_COMPS,code:'',
  ref:{form:{Caption:'Form1',Width:470,Height:340},comps:GRAM_COMPS,code:GRAM_CODE},
  checks:[{name:'1000 г → фунт: в Memo строка «10Фунт»',act:[['set','Edit1','Text','1000'],['select','ListBox1',0]],exp:[['Memo1','Lines','10Фунт']]},
    {name:'CheckBox1 — красный шрифт, снять — зелёный',act:[['click','CheckBox1']],exp:[['Memo1','Font.Color','clRed']]},
    {name:'CheckBox2 — шрифт +3',act:[['click','CheckBox2']],exp:[['Memo1','Font.Size',11]]},
    {name:'ScrollBar пишет позицию в Edit1',act:[['scroll','ScrollBar1',250]],exp:[['Edit1','Text','250']]}],
  steps:[{t:'Компоненты уже разложены по таблице из лабы (Panel1 alBottom, Panel2 alLeft, Memo1 alClient). Посмотри их свойства в Object Inspector.',c:{comp:'TMemo'}},
    {t:'Двойной щелчок по ListBox1 → <code>ListBox1Click</code>. Перепиши код из лабы (окно ниже задания).',c:{handler:'ListBox1Click'}},
    {t:'Обработчики CheckBox1Click и CheckBox2Click (двойной щелчок по флажкам).',c:{handler:'CheckBox2Click'}},
    {t:'ScrollBar1: в Object Inspector → <b>Events</b> → двойной щелчок по <b>OnScroll</b>.',c:{handler:'ScrollBar1Scroll'}},
    {t:'F9: введи 1000, выбери «Фунт» — в Memo появится результат.',c:{check:0}}],
  palette:['TLabel','TEdit','TMemo','TButton','TCheckBox','TListBox','TScrollBar','TGroupBox','TPanel','TBitBtn']};
const LITR_COMPS=[{type:'TLabel',Name:'Label1',Left:16,Top:16,Caption:'Введите объём в литрах'},{type:'TEdit',Name:'Edit1',Left:16,Top:36,Width:100,Text:''},
  {type:'TListBox',Name:'ListBox1',Left:16,Top:68,Width:120,Height:90,Items:['баррель','галлон','кварта','пинта','гилл'],events:{OnClick:'ListBox1Click'}},
  {type:'TMemo',Name:'Memo1',Left:150,Top:16,Width:200,Height:142,Lines:[]}];
const LITR={form:{Caption:'Литры',Width:380,Height:220},comps:LITR_COMPS,code:'',
  ref:{form:{Caption:'Литры',Width:380,Height:220},comps:LITR_COMPS,
    code:H('ListBox1Click',R`  if (Edit1->Text == "" || ListBox1->ItemIndex < 0) return;
  double x = StrToFloat(Edit1->Text), y;
  switch (ListBox1->ItemIndex)
  {
    case 0: y = x / 119.24; break;          // 1 баррель США = 119,24 л
    case 1: y = x / 3.785; break;           // 1 галлон США = 3,785 л
    case 2: y = x / (2 * 6 * 0.02957); break; // 1 кварта = 2 пинты = 12 жидких унций
    case 3: y = x / (6 * 0.02957); break;   // 1 пинта = 6 жидких унций (по лабе)
    case 4: y = x / 0.1183; break;          // 1 гилл США = 0,1183 л
  }
  Memo1->Lines->Add(FloatToStr(y) + " " + ListBox1->Items->Strings[ListBox1->ItemIndex]);`)},
  checks:[{name:'119.24 л = 1 баррель',act:[['set','Edit1','Text','119.24'],['select','ListBox1',0]],exp:[['Memo1','Lines','1 баррель']]},
    {name:'0.1183 л = 1 гилл',act:[['set','Edit1','Text','0.1183'],['select','ListBox1',4]],exp:[['Memo1','Lines','1 гилл']]}],
  palette:['TLabel','TEdit','TListBox','TMemo','TCheckBox','TScrollBar','TBitBtn']};
const EV1_COMPS=[{type:'TButton',Name:'Button1',Left:16,Top:16,events:{OnMouseMove:'Button1MouseMove'}},{type:'TEdit',Name:'Edit1',Left:112,Top:18,Width:100,events:{OnMouseMove:'Edit1MouseMove'}},
  {type:'TPanel',Name:'Panel1',Left:16,Top:56,Width:120,Height:60,events:{OnMouseMove:'Panel1MouseMove'}},{type:'TMemo',Name:'Memo1',Left:150,Top:56,Width:120,Height:60,events:{OnMouseMove:'Memo1MouseMove'}},
  {type:'TLabel',Name:'Label1',Left:16,Top:140,Caption:'A mouse pointer over the Form'}];
const MM='TObject *Sender, TShiftState Shift, int X, int Y';
const EV1={form:{Caption:'Events',Width:310,Height:210,events:{OnMouseMove:'FormMouseMove'}},comps:EV1_COMPS,code:'',
  ref:{form:{Caption:'Events',Width:310,Height:210,events:{OnMouseMove:'FormMouseMove'}},comps:EV1_COMPS,
    code:H('Button1MouseMove','  Label1->Caption = "A mouse pointer over the button";\n  if (Shift.Contains(ssShift)) Label1->Caption = Label1->Caption + " + Shift";\n  if (Shift.Contains(ssAlt)) Label1->Caption = Label1->Caption + " + Alt";\n  if (Shift.Contains(ssCtrl)) Label1->Caption = Label1->Caption + " + Ctrl";',MM)+
      H('Edit1MouseMove','  Label1->Caption = "A mouse pointer over the edit";',MM)+H('Panel1MouseMove','  Label1->Caption = "A mouse pointer over the panel";',MM)+
      H('Memo1MouseMove','  Label1->Caption = "A mouse pointer over the memo";',MM)+H('FormMouseMove','  Label1->Caption = "A mouse pointer over the Form";',MM)},
  checks:[{name:'Мышь над кнопкой',act:[['move','Button1']],exp:[['Label1','Caption','A mouse pointer over the button']]},{name:'Мышь над панелью, потом над формой',act:[['move','Panel1'],['move','Form1']],exp:[['Label1','Caption','A mouse pointer over the Form']]},
    {name:'Мышь над кнопкой с Shift',act:[['move','Button1',5,5,1]],exp:[['Label1','Caption',{re:'Shift'}]]}],
  palette:['TLabel','TButton','TEdit','TPanel','TMemo']};
const EV2_COMPS=[{type:'TPanel',Name:'Panel1',Left:8,Top:8,Width:380,Height:40,Caption:''},
  {type:'TButton',Name:'Button1',parent:'Panel1',Left:8,Top:8,Width:85,Caption:'text color',events:{OnClick:'Button1Click',OnMouseMove:'Button1MouseMove'}},
  {type:'TButton',Name:'Button2',parent:'Panel1',Left:100,Top:8,Width:85,Caption:'text size',events:{OnClick:'Button2Click',OnMouseMove:'Button2MouseMove'}},
  {type:'TButton',Name:'Button3',parent:'Panel1',Left:192,Top:8,Width:85,Caption:'letters case',events:{OnClick:'Button3Click',OnMouseMove:'Button3MouseMove'}},
  {type:'TButton',Name:'Button4',parent:'Panel1',Left:284,Top:8,Width:85,Caption:'reverse chars',events:{OnClick:'Button4Click',OnMouseMove:'Button4MouseMove'}},
  {type:'TLabel',Name:'Label1',Left:16,Top:56,Caption:'смена цвета',Visible:false},{type:'TLabel',Name:'Label2',Left:108,Top:56,Caption:'размер ±2',Visible:false},
  {type:'TLabel',Name:'Label3',Left:200,Top:56,Caption:'регистр',Visible:false},{type:'TLabel',Name:'Label4',Left:292,Top:56,Caption:'наоборот',Visible:false},
  {type:'TEdit',Name:'Edit1',Left:16,Top:88,Width:300,Text:'Hello World'}];
const hideAll='  Label1->Visible = false; Label2->Visible = false; Label3->Visible = false; Label4->Visible = false;\n';
const EV2={form:{Caption:'Properties and events',Width:410,Height:170,events:{OnMouseMove:'FormMouseMove'}},comps:EV2_COMPS,code:'',
  ref:{form:{Caption:'Properties and events',Width:410,Height:170,events:{OnMouseMove:'FormMouseMove'}},comps:EV2_COMPS,
    code:H('Button1Click','  if (Edit1->Font->Color == clRed) Edit1->Font->Color = clBlack;\n  else Edit1->Font->Color = clRed;')+
      H('Button2Click','  static bool bigger = true;\n  if (bigger) Edit1->Font->Size += 2; else Edit1->Font->Size -= 2;\n  bigger = !bigger;')+
      H('Button3Click','  if (Edit1->Text == UpperCase(Edit1->Text)) Edit1->Text = LowerCase(Edit1->Text);\n  else Edit1->Text = UpperCase(Edit1->Text);')+
      H('Button4Click','  AnsiString s = Edit1->Text, r = "";\n  for (int i = s.Length(); i >= 1; i--)\n    r = r + s[i];\n  Edit1->Text = r;')+
      H('Button1MouseMove',hideAll+'  Label1->Visible = true;',MM)+H('Button2MouseMove',hideAll+'  Label2->Visible = true;',MM)+H('Button3MouseMove',hideAll+'  Label3->Visible = true;',MM)+H('Button4MouseMove',hideAll+'  Label4->Visible = true;',MM)+
      H('FormMouseMove',hideAll.replace(/\n$/,''),MM)},
  checks:[{name:'text color: чёрный → красный → чёрный',act:[['click','Button1']],exp:[['Edit1','Font.Color','clRed']]},{name:'text size +2',act:[['click','Button2']],exp:[['Edit1','Font.Size',10]]},
    {name:'letters case: всё большими, потом маленькими',act:[['click','Button3']],exp:[['Edit1','Text','HELLO WORLD']]},{name:'reverse chars',act:[['click','Button4']],exp:[['Edit1','Text','dlroW olleH']]},
    {name:'подсказка видна над кнопкой и прячется над формой',act:[['move','Button2'],['move','Form1']],exp:[['Label2','Visible',false]]}],
  palette:['TLabel','TButton','TEdit','TPanel']};
const T=[
 {id:'c11-gram',name:'ООП-лаба 2. Пересчёт граммов',wtitle:'Лабораторная работа №2: граммы → фунты, пуды…',text:R`<p><b>Тема:</b> Создание проекта. Работа с формами.</p><p><b>Цель работы:</b> знакомство с основными визуальными компонентами палитры Standart: Panel, GroupBox, CheckBox, ScrollBar), создание программы, которая пересчитывает граммы и литры в другие меры веса и меры жидких тел соответственно.</p><p><b>Вопросы для самостоятельной подготовки:</b> основные свойства и методы компонентов палитры Standart.</p><p><b>Постановка задачи:</b> Написать программу, которую можно будет использовать для пересчета грамм и литров.</p>
<div class="tw"><table><tr><th>Компонент</th><th>Свойства</th><th>События</th></tr><tr><td>Panel1</td><td>Align- AlBottom</td><td>-</td></tr><tr><td>Panel2</td><td>Align- AlLeft</td><td>-</td></tr><tr><td>Memo1</td><td>Align-alClient, Lines=TString(очистить)</td><td></td></tr><tr><td>Label1</td><td>Caption-Введите значение в граммах</td><td>-</td></tr><tr><td>Edit1</td><td>Text-“”</td><td>-</td></tr><tr><td>ListBox1</td><td>Items-String[...] Фунт, Пуд, Унция, Драхм, Гран</td><td>OnClick</td></tr><tr><td>GroupBox1</td><td>Caption- очистка</td><td>-</td></tr><tr><td>CheckBox1</td><td>Caption- "Красный цвет"</td><td>OnClick</td></tr><tr><td>CheckBox2</td><td>Caption- ”Увеличить размер"</td><td>OnClick</td></tr><tr><td>BitBtn1</td><td>Kind-bkclose</td><td>-</td></tr><tr><td>ScrollBar1</td><td>max =1000 min=-1000</td><td>-OnScrool</td></tr></table></div>
<p>Для компонентов ListBox1, CheckBox1, CheckBox2, ScrollBar1 напишите соответствующие обработчики событий (код из лабы — в «Разборе»).</p>
<p><b>Дополнительные задания:</b> 1) Используя свойство Enable, сделайте так, чтобы при загрузке формы CheckBox1 и CheckBox2 были недоступны, а после выбора значений из списка – доступны. 2) Узнайте с помощью справки назначение свойств Default и Cancel и поэкспериментируйте с их значениями.</p>`,
  vcl:GRAM,
  note:R`<aside class="fix"><span class="tag">поправка</span> 1) В коде лабы <code>if (Edit1-&gt;Text==' ') exit;</code> — <code>exit</code> без скобок ничего не делает (Builder предупредит «Code has no effect»), а сравнение с пробелом не ловит пустое поле. Правильно: <code>if (Edit1-&gt;Text == "") return;</code>. 2) Для «Гран» (5-й пункт) в лабе нет case — y остаётся мусором; в эталоне добавлен. 3) Коэффициенты в лабе условные: на самом деле 1 русский фунт ≈ 409,5 г, пуд = 16 380 г, унция ≈ 28,35 г, драхм ≈ 3,9 г, гран ≈ 0,0648 г. Эталон оставлен как в лабе, чтобы совпало с ответом преподавателя.</aside>`,
  steps:R`<ul><li><b>Align</b> раскладывает панели: Panel1 прижата к низу, Panel2 — к левому краю, Memo1 (alClient) занимает остальное.</li><li><code>ListBox1-&gt;ItemIndex</code> — номер выбранной строки списка (с 0); <code>ListBox1-&gt;Items-&gt;Strings[i]</code> — сама строка.</li><li><code>Memo1-&gt;Lines-&gt;Add(…)</code> — добавить строку в Memo.</li><li>CheckBox: <code>State == cbChecked</code> (или <code>Checked == true</code>) — флажок стоит.</li><li><code>Memo1-&gt;Font-&gt;Size</code> — размер шрифта (Size уже число, StrToInt в лабе лишний, но работает).</li><li>ScrollBar: <code>Position</code> — положение ползунка от Min до Max; событие OnScroll.</li><li>Доп. задание 1: в OnCreate формы <code>CheckBox1-&gt;Enabled = false; CheckBox2-&gt;Enabled = false;</code>, а в ListBox1Click — <code>= true</code>. Default = true — кнопка нажимается клавишей Enter, Cancel = true — клавишей Esc.</li></ul>`},
 {id:'c11-litr',name:'Контрольное задание к лабе 2. Литры',wtitle:'Пересчёт литров',text:R`<p>Создайте аналогичный проект для пересчета литров в следующие меры жидкости: баррель, галлон, кварта, пинта, гилл.</p><p>Для сведения: 1 баррель США = 119,24 л; 1 галлон США = 3,785 л; 1 кварта США = 2 пинты США; 1 пинта США = 6 жидких унций США; 1 гилл США = 0,1183 л; 1 жидкая унция США = 0,02957 л.</p>`,vcl:LITR,
  note:R`<aside class="fix"><span class="tag">поправка</span> На самом деле 1 пинта США = 16 жидких унций (0,473 л), а не 6. Эталон сделан по данным лабы.</aside>`,
  steps:R`<p>Тот же приём: число из Edit1 делим на объём единицы в литрах. Кварта и пинта выражены через жидкую унцию: пинта = 6 × 0,02957 л, кварта = 2 пинты.</p>`},
 {id:'c11-ev1',name:'Доп. лаба «main components properties and events» (свойства и события основных компонентов, 1)',wtitle:'OnMouseMove: где мышь?',text:R`<p>Событие OnClick возникает, когда пользователь щёлкает (нажимает и отпускает кнопку мыши) по компоненту. OnMouseDown — когда пользователь нажимает кнопку мыши над компонентом. OnMouseUp — когда отпускает кнопку мыши. OnMouseMove — когда двигает мышь над компонентом. OnKeyPress — при нажатии клавиши (символа). OnKeyUp / OnKeyDown — когда клавишу отпускают / нажимают.</p>
<p>Положите на форму TButton, TEdit, TPanel и TMemo. Внизу формы — TLabel, его Caption = “A mouse pointer over the Form” («указатель мыши над формой»). Когда пользователь ведёт мышь над одним из компонентов, в надписи должно появляться соответствующее сообщение. Например, над TButton: “A mouse pointer over the button” («указатель над кнопкой») и т. д. Когда мышь уходит с компонентов, надпись возвращается к исходной. Как сделать: создайте обработчик OnMouseMove для TButton и в нём меняйте Caption; чтобы вернуть исходный текст, создайте обработчик OnMouseMove для формы и задайте там значение по умолчанию.</p>
<p><b>Задание.</b> Если пользователь двигает мышь с зажатой Shift, Alt или Ctrl, в надписи должно быть соответствующее сообщение.</p>
<p class="ru">Тексты надписей оставлены на английском, как в лабе, — автопроверка ждёт именно их.</p>
<details class="en"><summary>Оригинал (англ.)</summary><p>OnClick event occurs when the user clicks (presses and releases) the control. OnMouseDown occurs when the user presses a mouse button with the mouse pointer over a control. OnMouseUp occurs when the user releases a mouse button. OnMouseMove occurs when the user moves the mouse pointer while the mouse pointer is over a control. OnKeyPress occurs when key pressed. OnKeyUp / OnKeyDown occur when the user releases / presses a key.</p>
<p>Place a TButton, a TEdit, a TPanel, a TMemo component to the form. Place a TLabel component to the bottom of the form and set the value of its Caption property to “A mouse pointer over the Form”. When a user moves the mouse pointer over one of the controls, on a label must be written a corresponding message. For example, when a mouse pointer over the TButton component: “A mouse pointer over the button” and so on. When a user moves the mouse pointer off the buttons area, a Caption property must become default. To do that: generate the OnMouseMove event handler for the TButton component; in the event handler change the Caption property; to return the Caption property to the default state generate the OnMouseMove event handler for the form and set up the default value.</p>
<p><b>Task.</b> If a user moves a mouse pointer with Shift, Alt or Ctrl keys, the Caption property (of a Label) should contain corresponding message.</p></details>`,vcl:EV1,
  steps:R`<p>Обработчик OnMouseMove получает <code>Shift</code> — набор нажатых клавиш-модификаторов. Проверка: <code>Shift.Contains(ssShift)</code>, <code>ssAlt</code>, <code>ssCtrl</code>. X и Y — координаты мыши внутри компонента. Когда мышь уходит с компонента на форму, срабатывает OnMouseMove формы — там возвращаем текст по умолчанию.</p>`},
 {id:'c11-ev2',name:'Доп. лаба «properties and events» (свойства и события, 2)',wtitle:'Четыре кнопки на панели',text:R`<p>Сделайте интерфейс: компонент TPanel и на нём четыре кнопки TButton; четыре надписи TLabel; одно поле TEdit. У всех TLabel поставьте Visible = false. Надпись становится видимой, когда пользователь наводит мышь на соответствующую кнопку (над которой она стоит). Когда мышь уходит с кнопок, надпись снова прячется.</p>
<p>Напишите обработчики щелчков по кнопкам: 1) “text color” (цвет текста) — меняет цвет шрифта TEdit на красный, если он чёрный, и наоборот; 2) “text size” (размер текста) — увеличивает/уменьшает размер шрифта TEdit на 2; 3) “letters case” (регистр букв) — делает все маленькие буквы большими, при повторном нажатии — большие маленькими; 4) “reverse chars” (наоборот) — переставляет буквы в обратном порядке.</p>
<p><b>Задание.</b> Когда пользователь наводит мышь на кнопку, размер кнопки увеличивается на 5, а размер её шрифта — на 2. Сделайте так для всех кнопок.</p>
<details class="en"><summary>Оригинал (англ.)</summary><p>Design the graphical user interface: a TPanel component and the four TButton components on it; the four TLabel components; a TEdit component. Set the value of a Visible property of the all TLabel components to false. They will become visible when a user moves a mouse pointer to corresponding (placed above) button. When a user moves the mouse pointer off the buttons area, a label must become non-visual again.</p>
<p>Write the event handlers for clicking the buttons: 1) “text color” button – changing the font color of the TEdit component to red if it is black, and vise versa; 2) “text size” button – increasing/decreasing by 2 the font size of the TEdit component; 3) “letters case” button – changing all lowercase letters on uppercase letters. When pressed again, changing all uppercase letters on lowercase letters; 4) “reverse chars” button - rearranges the letters in reverse order.</p>
<p><b>Task.</b> When a user moves a mouse pointer on the button, the size of the button increases by 5, the font size of the button increases by 2. Make the similar actions to all buttons.</p></details>`,vcl:EV2,
  steps:R`<ul><li>Цвет шрифта Edit: <code>Edit1-&gt;Font-&gt;Color</code>; сравнение с clRed — и переключение.</li><li>«Туда-обратно» размер: static-переменная bigger помнит, что делали в прошлый раз.</li><li>Регистр: <code>UpperCase(s)</code>, <code>LowerCase(s)</code> из SysUtils. Если строка уже вся большая — делаем маленькой.</li><li>Разворот: у AnsiString символы с 1 до Length(); собираем строку с конца.</li><li>Задание «кнопка растёт»: в OnMouseMove кнопки <code>Button1-&gt;Width += 5; Button1-&gt;Font-&gt;Size += 2;</code>, а в OnMouseMove формы вернуть размеры (запомнить исходные).</li></ul>`},
];
CPP.topic('c11',{n:11,
 title:'Работа с формами: свойства и методы. События',
 lecSub:'Свойство и метод, Object Inspector, свойства формы (Caption, Name, Width, Height, Color, Position, Visible, Enabled), события и обработчики.',
 lecture:LECTURE,
 labs:[{id:'c11-lab',short:'ООП-лаба 2',title:'Лабораторная работа №2. Создание проекта. Работа с формами (Panel, GroupBox, CheckBox, ScrollBar)',show:2,tasks:T.slice(0,2)}],
 dop:[{id:'c11-dop',short:'Доп. лаба events',title:'Доп. лаба. C++ Builder IDE: main components properties and events (свойства и события основных компонентов)',show:2,tasks:T.slice(2)}],
 umkd:[
  ['Что такое свойство объекта?','Характеристика объекта (переменная), определяющая его вид и поведение: Caption, Width, Color.'],
  ['Что такое метод?','Функция объекта — действие, которое он умеет выполнять: Show(), Close(), Clear().'],
  ['Разница между свойством и методом?','Свойство описывает состояние, его читают и присваивают; метод выполняет действие, его вызывают со скобками.'],
  ['Как менять свойства формы в Object Inspector?','Выделить форму, на вкладке Properties выбрать свойство и ввести/выбрать новое значение.'],
  ['Как менять свойства формы программно?','Присваиванием в коде во время работы: <code>Form1-&gt;Color = clRed;</code>, <code>Width = 500;</code>'],
  ['Основные свойства формы?','Caption, Name, Width, Height, Left, Top, Color, Position, Visible, Enabled, BorderStyle, FormStyle, Font.'],
  ['Что такое событие?','Сообщение ОС приложению о произошедшем действии (щелчок, клавиша, таймер, изменение размера).'],
  ['Что такое обработчик события?','Метод формы, который выполняется в ответ на событие: <code>void __fastcall TForm1::Button1Click(TObject *Sender)</code>.'],
  ['Как события связываются с методами?','В Object Inspector на вкладке Events напротив события указывается имя метода-обработчика (двойной щелчок создаёт новый, можно выбрать существующий).'],
  ['Типичные события формы?','OnCreate, OnShow, OnActivate, OnClick, OnDblClick, OnMouseMove, OnKeyPress, OnResize, OnClose, OnPaint.'],
  ['Как обрабатываются действия пользователя в визуальном приложении?','Каждое действие порождает событие; программа реагирует, выполняя связанный с ним обработчик (событийно-управляемое программирование).'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 11), лабораторная работа №2 (ООП), доп. лаба «main components properties and events», «Полезная инфа».'
});
})();
