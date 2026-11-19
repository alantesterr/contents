/* C++ · Тема 10. Лаба «Калькулятор как в Windows» (добавляется в доп. лабы темы 10; файл грузится перед c10.js) */
(function(){ const R=String.raw, H=CPP.H;
// кнопки 4 x 6, как в «Обычном» калькуляторе Windows
const W=60, HB=40, X0=8, Y0=88, G=4;
const GRID=[
  [['BPct','%','PctClick'],['BCE','CE','CEClick'],['BC','C','CClick'],['BBack','<-','BackClick']],
  [['BInv','1/x','InvClick'],['BSqr','x²','SqrClick'],['BSqrt','√x','SqrtClick'],['BDiv','÷','OpClick',4]],
  [['B7','7','DigitClick'],['B8','8','DigitClick'],['B9','9','DigitClick'],['BMul','×','OpClick',3]],
  [['B4','4','DigitClick'],['B5','5','DigitClick'],['B6','6','DigitClick'],['BMinus','−','OpClick',2]],
  [['B1','1','DigitClick'],['B2','2','DigitClick'],['B3','3','DigitClick'],['BPlus','+','OpClick',1]],
  [['BNeg','+/-','NegClick'],['B0','0','DigitClick'],['BComma',',','CommaClick'],['BEq','=','EqClick']]];
const BTNS=[]; GRID.forEach((row,r)=>row.forEach(([Name,Caption,ev,Tag],c)=>BTNS.push(Object.assign(
  {type:'TButton',Name,Left:X0+c*(W+G),Top:Y0+r*(HB+G),Width:W,Height:HB,Caption,Font:{Size:12,Style:Caption==='='?1:0},events:{OnClick:ev}},Tag?{Tag}:{}))));
const DISPLAY=[
  {type:'TLabel',Name:'Label2',Left:8,Top:8,Width:252,Height:20,AutoSize:false,Alignment:'taRightJustify',Caption:'',Font:{Size:10,Color:0x808080}},
  {type:'TLabel',Name:'Label1',Left:8,Top:30,Width:252,Height:48,AutoSize:false,Alignment:'taRightJustify',Caption:'0',Font:{Size:26,Style:1}}];
const FORM={Caption:'Калькулятор',Width:276,Height:390,BorderStyle:'bsSingle'};
const SEP='//---------------------------------------------------------------------------\n';
const CODE=SEP+R`
#include <vcl.h>
#include <math.h>
#pragma hdrstop

#include "Unit1.h"
` + SEP + R`#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;

// «Память» калькулятора — глобальные переменные модуля
double acc = 0;        // первое число (то, что было до знака операции)
int op = 0;            // операция: 0 — нет, 1 «+», 2 «−», 3 «×», 4 «÷» (берём из Tag кнопки)
bool newNum = true;    // true — следующая цифра начинает новое число

AnsiString OpSign(int o)            // знак операции для верхней строки
{
  switch (o)
  {
    case 1: return "+";
    case 2: return "-";
    case 3: return "*";
    case 4: return "/";
  }
  return "";
}

double Calc(double a, int o, double b)   // a (o) b
{
  switch (o)
  {
    case 1: return a + b;
    case 2: return a - b;
    case 3: return a * b;
    case 4: return a / b;
  }
  return b;
}

void Reset()                        // как кнопка C
{
  acc = 0; op = 0; newNum = true;
  Form1->Label1->Caption = "0";
  Form1->Label2->Caption = "";
}

void Error(AnsiString msg)          // ошибка: показать текст и начать заново
{
  Reset();
  Form1->Label1->Caption = msg;
}

void ShowNum(double x)              // вывести число на экран
{
  Form1->Label1->Caption = FloatToStr(x);
  newNum = true;                    // следующая цифра — уже новое число
}

double Cur()                        // число, которое сейчас на экране
{
  return StrToFloat(Form1->Label1->Caption);
}
` + SEP + R`__fastcall TForm1::TForm1(TComponent* Owner)
  : TForm(Owner)
{
}
` + SEP +
H('DigitClick','  if (!newNum && Label1->Caption.Length() >= 16) return;   // не больше 16 знаков\n  AnsiString d = ((TButton*)Sender)->Caption;   // какая кнопка нажата: "0"…"9"\n  if (newNum || Label1->Caption == "0")\n    Label1->Caption = d;                     // начинаем новое число\n  else\n    Label1->Caption = Label1->Caption + d;   // дописываем цифру справа\n  newNum = false;') +
H('CommaClick','  if (newNum) { Label1->Caption = "0"; newNum = false; }\n  if (Label1->Caption.Pos(",") == 0 && Label1->Caption.Pos(".") == 0)\n    Label1->Caption = Label1->Caption + ",";   // запятая только одна') +
H('OpClick','  double x = Cur();\n  if (op != 0 && !newNum)                 // 2 + 3 + … — сначала досчитать 2 + 3\n  {\n    if (op == 4 && x == 0) { Error("Деление на ноль невозможно"); return; }\n    x = Calc(acc, op, x);\n    ShowNum(x);\n  }\n  acc = x;\n  op = ((TButton*)Sender)->Tag;           // 1 +, 2 −, 3 ×, 4 ÷\n  Label2->Caption = FloatToStr(acc) + " " + OpSign(op);\n  newNum = true;') +
H('EqClick','  if (op == 0) return;                    // нечего считать\n  double b = Cur();\n  if (op == 4 && b == 0) { Error("Деление на ноль невозможно"); return; }\n  Label2->Caption = FloatToStr(acc) + " " + OpSign(op) + " " + FloatToStr(b) + " =";\n  ShowNum(Calc(acc, op, b));\n  op = 0;') +
H('CClick','  Reset();                                // стереть всё') +
H('CEClick','  Label1->Caption = "0";                  // стереть только текущее число\n  newNum = true;') +
H('BackClick','  if (newNum) return;                     // результат стирать по цифре нельзя\n  AnsiString s = Label1->Caption;\n  s.Delete(s.Length(), 1);                // убрать последний символ\n  if (s == "" || s == "-") s = "0";\n  Label1->Caption = s;') +
H('NegClick','  double x = Cur();\n  if (x == 0) return;\n  Label1->Caption = FloatToStr(-x);       // сменить знак') +
H('InvClick','  double x = Cur();\n  if (x == 0) { Error("Деление на ноль невозможно"); return; }\n  ShowNum(1 / x);') +
H('SqrClick','  double x = Cur();\n  ShowNum(x * x);') +
H('SqrtClick','  double x = Cur();\n  if (x < 0) { Error("Недопустимый ввод"); return; }\n  ShowNum(sqrt(x));                       // sqrt — из math.h') +
H('PctClick','  double x = Cur();\n  if (op == 1 || op == 2) x = acc * x / 100;   // 200 + 10% → 200 + 20\n  else x = x / 100;                             // 50 × 10% → 50 × 0,1\n  ShowNum(x);');

// автопроверки: нажимаем кнопки, как пользователь
const k=s=>s.split(' ').map(n=>['click',n]);
const CHECKS=[
  {name:'Цифры набираются: 1, 2, 3 → 123',act:k('B1 B2 B3'),exp:[['Label1','Caption','123']]},
  {name:'12 + 7 = 19, сверху «12 + 7 =»',act:k('B1 B2 BPlus B7 BEq'),exp:[['Label1','Caption','19'],['Label2','Caption','12 + 7 =']]},
  {name:'9 − 4 × 2 = 10 (считает по порядку, как Windows)',act:k('B9 BMinus B4 BMul B2 BEq'),exp:[['Label1','Caption','10']]},
  {name:'7 ÷ 2 = 3,5',act:k('B7 BDiv B2 BEq'),exp:[['Label1','Caption',3.5]]},
  {name:'5 ÷ 0 — «Деление на ноль невозможно», без вылета',act:k('B5 BDiv B0 BEq'),exp:[['Label1','Caption',{re:'[Дд]елени'}]]},
  {name:'Запятая: 2,5 × 2 = 5',act:k('B2 BComma B5 BMul B2 BEq'),exp:[['Label1','Caption','5']]},
  {name:'Стереть цифру: 1 2 3 ← → 12',act:k('B1 B2 B3 BBack'),exp:[['Label1','Caption','12']]},
  {name:'C — сброс всего',act:k('B8 BPlus B2 BC'),exp:[['Label1','Caption','0'],['Label2','Caption','']]},
  {name:'CE — стереть только текущее: 8 + 5 CE 1 = 9',act:k('B8 BPlus B5 BCE B1 BEq'),exp:[['Label1','Caption','9']]},
  {name:'x²: 9 → 81',act:k('B9 BSqr'),exp:[['Label1','Caption','81']]},
  {name:'√x: 1 6 → 4',act:k('B1 B6 BSqrt'),exp:[['Label1','Caption','4']]},
  {name:'1/x: 4 → 0,25',act:k('B4 BInv'),exp:[['Label1','Caption',0.25]]},
  {name:'+/−: 5 → −5',act:k('B5 BNeg'),exp:[['Label1','Caption','-5']]},
  {name:'%: 200 + 10 % = 220',act:k('B2 B0 B0 BPlus B1 B0 BPct BEq'),exp:[['Label1','Caption','220']]},
  {name:'√ из отрицательного — «Недопустимый ввод»',act:k('B9 BNeg BSqrt'),exp:[['Label1','Caption',{re:'[Нн]едопустим'}]]}];

// пустая заготовка: форма с кнопками уже разложена (раскладывать 24 кнопки — долго), обработчики пустые
const EMPTY=['DigitClick','CommaClick','OpClick','EqClick','CClick','CEClick','BackClick','NegClick','InvClick','SqrClick','SqrtClick','PctClick'].map(n=>H(n,'')).join('');
const START=SEP+R`
#include <vcl.h>
#include <math.h>
#pragma hdrstop

#include "Unit1.h"
` + SEP + R`#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;

double acc = 0;        // первое число
int op = 0;            // операция (1 +, 2 −, 3 ×, 4 ÷)
bool newNum = true;    // следующая цифра начинает новое число
` + SEP + R`__fastcall TForm1::TForm1(TComponent* Owner)
  : TForm(Owner)
{
}
` + SEP + EMPTY;

CPP.WINCALC={
  form:FORM, comps:DISPLAY.concat(BTNS), unit:START,
  ref:{form:FORM, comps:DISPLAY.concat(BTNS), unit:CODE},
  checks:CHECKS,
  palette:['TLabel','TButton','TEdit','TPanel']};

CPP.WINCALC_TASK={id:'c10-wincalc',name:'Лаба. Полноценный калькулятор как в Windows',wtitle:'Калькулятор (как «Обычный» в Windows)',
 text:R`<p><b>Задание.</b> Сделать в C++Builder рабочий калькулятор, похожий на «Обычный» калькулятор Windows:</p>
<ul><li>экран: крупное число справа (Label1) и над ним маленькая строка с выражением, например «12 +» (Label2);</li>
<li>кнопки цифр <b>0–9</b> и запятая <b>,</b>;</li>
<li>операции <b>+ − × ÷</b> и <b>=</b>; цепочка «9 − 4 × 2 =» считается по порядку, как в Windows: (9 − 4) × 2 = 10;</li>
<li><b>C</b> (Clear — стереть всё), <b>CE</b> (Clear Entry — стереть только текущее число), <b>&lt;-</b> (Backspace — стереть последнюю цифру);</li>
<li><b>x²</b> (квадрат), <b>√x</b> (корень), <b>1/x</b> (дробь «единица делить на x»), <b>%</b> (процент), <b>+/-</b> (сменить знак);</li>
<li>деление на ноль и корень из отрицательного числа не должны «ронять» программу — вывести сообщение, как Windows: «Деление на ноль невозможно», «Недопустимый ввод».</li></ul>
<p>В окне ниже форма с 24 кнопками уже разложена (имена B0…B9, BPlus, BEq и т. д.), и события кнопок уже привязаны к обработчикам. Осталось написать код в Unit1.cpp. «✓ Проверить» нажимает кнопки сама и сверяет результат. Ход работы — в «Разборе» по шагам.</p>`,
 vcl:CPP.WINCALC,
 note:R`<aside class="add"><span class="tag">как сделать в настоящем Builder</span>
<ol><li>File → New → Application. У формы: Caption = «Калькулятор», BorderStyle = bsSingle (окно не растягивается), Width = 276, Height = 390.</li>
<li><b>Экран.</b> Две Label. У обеих AutoSize = false, Alignment = taRightJustify (текст прижат вправо), Width = 252. Label2 (выражение) — сверху, Font: размер 10, серый (clGray), Caption пустой. Label1 (число) — под ней, Font: размер 26, жирный (fsBold), Caption = 0.</li>
<li><b>Кнопки.</b> Положи одну Button, задай Width = 60, Height = 40, Font — размер 12. Потом выдели её, Ctrl+C и Ctrl+V — 24 раза, и расставь сеткой 4 × 6 как на картинке Windows. Каждой задай Name и Caption (см. таблицу ниже).</li>
<li><b>Один обработчик на 10 цифр.</b> Двойной щелчок по «7» — Builder создаст B7Click; переименуй его в DigitClick (вкладка Events, поле OnClick). Теперь выдели остальные цифры (Shift+щелчок) и во вкладке <b>Events</b> у OnClick выбери из списка <b>DigitClick</b>. Так же один <b>OpClick</b> на четыре кнопки + − × ÷.</li>
<li><b>Tag.</b> У кнопок операций задай свойство Tag: «+» = 1, «−» = 2, «×» = 3, «÷» = 4 — по нему OpClick узнаёт, какую операцию нажали.</li>
<li>Остальным кнопкам — свой обработчик двойным щелчком (EqClick, CClick, CEClick, BackClick, NegClick, InvClick, SqrClick, SqrtClick, PctClick, CommaClick).</li>
<li>В Unit1.cpp допиши <code>#include &lt;math.h&gt;</code> (для sqrt) и код из «Разбора». F9.</li></ol>
<div class="tw"><table><tr><th>Ряд</th><th colspan="4">Кнопки: Caption (Name → обработчик OnClick)</th></tr>
<tr><td>1</td><td>% (BPct → PctClick)</td><td>CE (BCE → CEClick)</td><td>C (BC → CClick)</td><td>&lt;- (BBack → BackClick)</td></tr>
<tr><td>2</td><td>1/x (BInv → InvClick)</td><td>x² (BSqr → SqrClick)</td><td>√x (BSqrt → SqrtClick)</td><td>÷ (BDiv → OpClick, Tag 4)</td></tr>
<tr><td>3</td><td>7 (B7 → DigitClick)</td><td>8 (B8)</td><td>9 (B9)</td><td>× (BMul → OpClick, Tag 3)</td></tr>
<tr><td>4</td><td>4 (B4)</td><td>5 (B5)</td><td>6 (B6)</td><td>− (BMinus → OpClick, Tag 2)</td></tr>
<tr><td>5</td><td>1 (B1)</td><td>2 (B2)</td><td>3 (B3)</td><td>+ (BPlus → OpClick, Tag 1)</td></tr>
<tr><td>6</td><td>+/- (BNeg → NegClick)</td><td>0 (B0 → DigitClick)</td><td>, (BComma → CommaClick)</td><td>= (BEq → EqClick)</td></tr></table></div>
<p>Символы × ÷ − √ ² можно вставить в Caption через «Таблицу символов» Windows (Win+R → charmap) или просто писать * / - sqrt — на работу это не влияет, операция берётся из Tag.</p></aside>`,
 steps:R`<p><b>Как думает калькулятор.</b> Ему нужно помнить три вещи, поэтому в начале Unit1.cpp — три глобальные переменные (вне функций, чтобы значение сохранялось между нажатиями):</p>
<ul><li><code>double acc</code> — первое число (то, что набрали до знака операции);</li>
<li><code>int op</code> — какая операция нажата (0 — никакой, 1 +, 2 −, 3 ×, 4 ÷);</li>
<li><code>bool newNum</code> — «следующая цифра начинает новое число» (true после знака, после = и в самом начале).</li></ul>
<p><b>Шаг 1. Цифры — DigitClick.</b> Один обработчик на 10 кнопок. Какую нажали — узнаём через <code>Sender</code> (это указатель на нажатую кнопку): <code>((TButton*)Sender)-&gt;Caption</code> — её надпись "7". Если начинаем новое число (или на экране «0») — заменяем, иначе дописываем справа: <code>Label1-&gt;Caption = Label1-&gt;Caption + d;</code></p>
<p><b>Шаг 2. Операция — OpClick.</b> Запоминаем число с экрана в acc, а операцию — из <code>Tag</code> кнопки; в Label2 пишем «12 +»; <code>newNum = true</code>, чтобы следующая цифра начала второе число. Если операция уже была (набрали «9 − 4» и жмём «×»), сначала досчитываем 9 − 4 = 5 — так делает Windows.</p>
<p><b>Шаг 3. Равно — EqClick.</b> b — число на экране, результат <code>Calc(acc, op, b)</code> — функция со <code>switch (op)</code>. Перед делением проверяем b == 0. Сверху пишем всё выражение «12 + 7 =».</p>
<p><b>Шаг 4. Стирание.</b> C — <code>Reset()</code>: всё в ноль. CE — только <code>Label1-&gt;Caption = "0"</code>. &lt;- — у AnsiString есть <code>Delete(откуда, сколько)</code>: <code>s.Delete(s.Length(), 1)</code> убирает последний символ; если ничего не осталось — «0».</p>
<p><b>Шаг 5. Функции одного числа.</b> x² — <code>x * x</code>; √x — <code>sqrt(x)</code> из math.h (для x &lt; 0 — «Недопустимый ввод»); 1/x — <code>1 / x</code> (для 0 — ошибка); +/- — <code>-x</code>; % — как в Windows: при + и − это процент от первого числа (200 + 10% = 200 + 20), при × и ÷ — просто x / 100.</p>
<p><b>Шаг 6. Запятая.</b> Добавляем «,» только если её ещё нет: <code>Label1-&gt;Caption.Pos(",") == 0</code> (Pos возвращает номер символа или 0). StrToFloat понимает запятую (в русской Windows дробная часть отделяется запятой).</p>
<p><b>Вспомогательные функции</b> (Calc, Reset, Error, ShowNum, Cur) написаны <b>вне класса</b>, поэтому к компонентам они обращаются через форму: <code>Form1-&gt;Label1-&gt;Caption</code>. Внутри обработчиков TForm1 можно писать просто <code>Label1</code>.</p>
<p><b>Попробуй сам (доп.):</b> 1) кнопки памяти MC, MR, M+, M−, MS (ещё одна глобальная переменная <code>double mem</code>); 2) повторное «=» повторяет последнюю операцию (5 + 2 = = = → 11); 3) ввод с клавиатуры: у формы KeyPreview = true и обработчик OnKeyPress.</p>`};
})();
