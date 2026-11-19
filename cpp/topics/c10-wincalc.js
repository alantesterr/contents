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


// автопроверки: нажимаем кнопки по их надписи (Caption), как пользователь. Имена и расположение кнопок — любые.
const BTN={'+':'@+','-':'@−|-','*':'@×|*|x','/':'@÷|/|:','=':'@=',C:'@c',CE:'@ce',BS:'@<-|←|⌫|<|bs|back|backspace|del',
  SQR:'@x²|x^2|x2|sqr|x*x',SQRT:'@√x|√|sqrt|sqrt(x)|корень',INV:'@1/x',NEG:'@+/-|±|-/+|+/−',PCT:'@%',',':'@,|.'};
const k=s=>s.split(' ').map(n=>['click',BTN[n]||'@'+n]);
const CHECKS=[
  {name:'Цифры набираются: 1, 2, 3 → 123',act:k('1 2 3'),exp:[['Label1','Caption','123']]},
  {name:'12 + 7 = 19',act:k('1 2 + 7 ='),exp:[['Label1','Caption','19']]},
  {name:'9 − 4 × 2 = 10 (считает по порядку, как Windows)',act:k('9 - 4 * 2 ='),exp:[['Label1','Caption','10']]},
  {name:'7 ÷ 2 = 3,5',act:k('7 / 2 ='),exp:[['Label1','Caption',3.5]]},
  {name:'5 ÷ 0 — «Деление на ноль невозможно», без вылета',act:k('5 / 0 ='),exp:[['Label1','Caption',{re:'[Дд]елени'}]]},
  {name:'C — сброс всего: 8 + 2 C → 0',act:k('8 + 2 C'),exp:[['Label1','Caption','0']]},
  {name:'CE — стереть только текущее: 8 + 5 CE 1 = 9',act:k('8 + 5 CE 1 ='),exp:[['Label1','Caption','9']]},
  {name:'Стереть цифру: 1 2 3 ← → 12',act:k('1 2 3 BS'),exp:[['Label1','Caption','12']]},
  {name:'x²: 9 → 81',act:k('9 SQR'),exp:[['Label1','Caption','81']]},
  {name:'√x: 1 6 → 4',act:k('1 6 SQRT'),exp:[['Label1','Caption','4']]},
  {name:'√ из отрицательного — «Недопустимый ввод»',act:k('9 NEG SQRT'),exp:[['Label1','Caption',{re:'[Нн]едопустим'}]]},
  {name:'1/x: 4 → 0,25',act:k('4 INV'),exp:[['Label1','Caption',0.25]]},
  {name:'+/−: 5 → −5',act:k('5 NEG'),exp:[['Label1','Caption','-5']]},
  {name:'%: 200 + 10 % = 220',act:k('2 0 0 + 1 0 PCT ='),exp:[['Label1','Caption','220']]},
  {name:'Запятая: 2,5 × 2 = 5',act:k('2 , 5 * 2 ='),exp:[['Label1','Caption','5']]}];

// пошаговая обучалка в жёлтой панели (шаг отмечается ✓, когда условие выполнено)
const STEPS=[
  {t:'Форма: в Object Inspector у <b>Form1</b> поставь <b>Caption = Калькулятор</b>.',c:{prop:['Form1','Caption','Калькулятор']}},
  {t:'Экран: положи <b>Label</b> (Label1) вверху формы, <b>Caption = 0</b>. Сделай шрифт крупным (Font → Size 20–26). Для красоты: AutoSize = false, растянуть на ширину формы, Alignment = taRightJustify (число справа, как в Windows).',c:{prop:['Label1','Caption','0']}},
  {t:'Цифры: положи 10 кнопок <b>Button</b> и подпиши (Caption) <b>0 1 2 … 9</b>. Ровно — не обязательно, главное работа.',c:{comp:'TButton',count:10}},
  {t:'В Unit1.cpp после <code>TForm1 *Form1;</code> объяви «память»: <code>double acc = 0;</code> <code>int op = 0;</code> <code>bool newNum = true;</code>',c:{code:'bool\\s+newNum'}},
  {t:'Двойной щелчок по «7» → в обработчике <code>AnsiString d = ((TButton*)Sender)-&gt;Caption;</code> и дописывание цифры (см. «Разбор», шаг 3). Потом всем остальным цифрам во вкладке <b>Events → OnClick</b> выбери этот же обработчик.',c:{check:0}},
  {t:'Кнопки <b>+ − × ÷</b> (Caption можно * и /) и <b>=</b>. У «+» Tag = 1, «−» = 2, «×» = 3, «÷» = 4. Общий обработчик операций и обработчик «=» — шаг 4–5 «Разбора». Проверь 12 + 7 = 19.',c:{check:1}},
  {t:'Цепочка: 9 − 4 × 2 = должно дать 10 (сначала досчитать 9 − 4).',c:{check:2}},
  {t:'Деление на ноль: перед делением <code>if (b == 0) …</code> — вывести «Деление на ноль невозможно».',c:{check:4}},
  {t:'Кнопки <b>C</b>, <b>CE</b> и <b>&lt;-</b> (стереть цифру) — шаг 6.',c:{check:7}},
  {t:'Кнопки <b>x²</b>, <b>√x</b>, <b>1/x</b> — шаг 7. Для sqrt допиши <code>#include &lt;math.h&gt;</code>.',c:{check:11}},
  {t:'Кнопки <b>+/-</b>, <b>%</b> и <b>,</b> (запятая) — шаг 8.',c:{check:14}},
  {t:'F9 — посчитай что-нибудь сам, потом «✓ Проверить» — все пункты должны стать зелёными.',c:{run:true}}];

CPP.WINCALC={
  form:{Caption:'Form1',Width:300,Height:420}, comps:[], code:'',
  ref:{form:FORM, comps:DISPLAY.concat(BTNS), unit:CODE},
  checks:CHECKS, steps:STEPS,
  palette:['TLabel','TButton','TEdit','TPanel','TBitBtn']};

const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const pre=s=>'<pre class="cpp-code">'+esc(s)+'</pre>';
const EXAMPLE=String.raw`double acc = 0;        // первое число
bool newNum = true;    // следующая цифра начинает новое число

void __fastcall TForm1::Button1Click(TObject *Sender)   // кнопка «1»
{
  if (newNum) Label1->Caption = "1";             // начинаем новое число
  else Label1->Caption = Label1->Caption + "1";  // дописываем справа
  newNum = false;
}

void __fastcall TForm1::Button2Click(TObject *Sender)   // кнопка «2» — то же самое
{
  if (newNum) Label1->Caption = "2";
  else Label1->Caption = Label1->Caption + "2";
  newNum = false;
}

void __fastcall TForm1::Button3Click(TObject *Sender)   // кнопка «+»
{
  acc = StrToFloat(Label1->Caption);   // запомнили первое число
  newNum = true;                       // дальше набираем второе
}

void __fastcall TForm1::Button4Click(TObject *Sender)   // кнопка «=»
{
  double b = StrToFloat(Label1->Caption);
  Label1->Caption = FloatToStr(acc + b);
  newNum = true;
}`;

CPP.WINCALC_TASK={id:'c10-wincalc',name:'Лаба. Полноценный калькулятор как в Windows',wtitle:'Калькулятор (как «Обычный» в Windows)',
 text:R`<p><b>Задание.</b> С чистого листа сделать в C++Builder рабочий калькулятор, похожий на «Обычный» калькулятор Windows:</p>
<ul><li>экран — надпись <b>Label1</b> с числом (сначала «0»);</li>
<li>кнопки цифр <b>0–9</b> и запятая <b>,</b>;</li>
<li>операции <b>+ − × ÷</b> и <b>=</b>; цепочка «9 − 4 × 2 =» считается по порядку, как в Windows: (9 − 4) × 2 = 10;</li>
<li><b>C</b> (Clear — стереть всё), <b>CE</b> (Clear Entry — стереть только текущее число), <b>&lt;-</b> (Backspace — стереть последнюю цифру);</li>
<li><b>x²</b> (квадрат), <b>√x</b> (корень), <b>1/x</b> (дробь «единица делить на x»), <b>%</b> (процент), <b>+/-</b> (сменить знак);</li>
<li>деление на ноль и корень из отрицательного числа не должны «ронять» программу — вывести сообщение, как Windows: «Деление на ноль невозможно», «Недопустимый ввод».</li></ul>
<p>Форма в окне ниже пустая — всё собираешь сам: кнопки, надписи, код. Расставить ровно не обязательно, главное — чтобы работало. Имена кнопок любые: «✓ Проверить» ищет кнопки по надписи (Caption) — «7», «+», «=», «C», «x²» (можно «sqr»), «√x» (можно «sqrt»), «&lt;-» и т. д. Число должно быть в <b>Label1</b>.</p>
<p>Жёлтая панель в окне ведёт по шагам, полное объяснение с кодом — в «Разборе» ниже. Сначала попробуй сам, а «📋 Эталон» — чтобы свериться в конце.</p>`,
 vcl:CPP.WINCALC,
 note:R`<aside class="add"><span class="tag">в настоящем Builder</span> Всё то же самое: File → New → Application, компоненты с палитры Standard. 24 кнопки быстрее делать так: положи одну, задай размер (например 60 × 40), выдели её, Ctrl+C, щёлкни по форме, Ctrl+V — и так нужное число раз, потом растащи мышью. Символы × ÷ √ ² можно вставить из «Таблицы символов» Windows (Win+R → charmap) или писать * / sqrt x^2 — на работу не влияет. Чтобы окно не растягивалось — у формы BorderStyle = bsSingle.</aside>`,
 steps:R`<h4>Шаг 0. Пример: калькулятор из четырёх кнопок</h4>
<p>Сначала разберём маленький пример — кнопки «1», «2», «+», «=» и надпись Label1 («0»). Весь калькулятор строится на той же идее, просто кнопок больше.</p>
${pre(EXAMPLE)}
<p>Главная мысль: калькулятор <b>помнит</b> первое число (acc) и то, начали ли мы набирать новое число (newNum). Такие переменные объявляют <b>вне функций</b> (глобально), чтобы они не исчезали между нажатиями кнопок. Обработчики — это обычные функции: каждый раз, когда нажали кнопку, выполняется её функция.</p>
<p>Попробуй: набери «12», «+», «2», «=» — будет 14. Дальше делаем по-взрослому.</p>

<h4>Шаг 1. Форма и экран</h4>
<p>У формы Caption = «Калькулятор». Положи <b>Label</b> вверху — это экран: Caption = 0, Font → Size 24, жирный. Чтобы число стояло справа, как в Windows: AutoSize = false, растяни надпись на ширину формы, Alignment = taRightJustify. (Можно положить вторую Label сверху мелким шрифтом — туда писать выражение «12 +», это по желанию.)</p>

<h4>Шаг 2. Кнопки и «память»</h4>
<p>Положи 10 кнопок и подпиши 0…9, потом + − × ÷ =, C, CE, &lt;-, x², √x, 1/x, %, +/-, «,». Удобно сеткой 4 × 6, как в Windows. В Unit1.cpp после строки <code>TForm1 *Form1;</code> добавь:</p>
${pre(`#include <math.h>      // для sqrt (можно поставить вверху, рядом с vcl.h)

double acc = 0;        // первое число (до знака операции)
int op = 0;            // операция: 0 — нет, 1 +, 2 −, 3 ×, 4 ÷
bool newNum = true;    // true — следующая цифра начинает новое число`)}

<h4>Шаг 3. Один обработчик на все цифры</h4>
<p>Писать 10 одинаковых функций скучно. Сделаем одну: двойной щелчок по «7» — Builder создаст функцию; во вкладке <b>Events</b> переименуй её в <b>DigitClick</b> (поле OnClick). Потом выдели остальные цифры (Shift + щелчок) и в Events → OnClick выбери из списка <b>DigitClick</b>. Какую кнопку нажали, функция узнаёт через <b>Sender</b> — это указатель на нажатую кнопку:</p>
${pre(`void __fastcall TForm1::DigitClick(TObject *Sender)
{
  AnsiString d = ((TButton*)Sender)->Caption;   // надпись нажатой кнопки: "0"…"9"
  if (newNum || Label1->Caption == "0")
    Label1->Caption = d;                     // начинаем новое число
  else
    Label1->Caption = Label1->Caption + d;   // дописываем цифру справа
  newNum = false;
}`)}
<p><code>(TButton*)Sender</code> — «считай, что Sender — кнопка», после этого можно взять её Caption.</p>

<h4>Шаг 4. Операции + − × ÷</h4>
<p>Тоже один обработчик <b>OpClick</b> на четыре кнопки. Чтобы знать, какая операция, у кнопок задай свойство <b>Tag</b>: «+» = 1, «−» = 2, «×» = 3, «÷» = 4. Вспомогательная функция Calc считает «a операция b» — её пишем <b>выше</b> обработчиков, вне класса:</p>
${pre(`double Calc(double a, int o, double b)
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

void __fastcall TForm1::OpClick(TObject *Sender)
{
  double x = StrToFloat(Label1->Caption);
  if (op != 0 && !newNum)          // уже было «9 −» и набрали 4 — сначала досчитать 9 − 4
  {
    x = Calc(acc, op, x);
    Label1->Caption = FloatToStr(x);
  }
  acc = x;                          // запомнили первое число
  op = ((TButton*)Sender)->Tag;     // и операцию (1…4)
  newNum = true;                    // дальше набирают второе число
}`)}

<h4>Шаг 5. Равно и деление на ноль</h4>
${pre(`void __fastcall TForm1::EqClick(TObject *Sender)
{
  if (op == 0) return;                         // операции не было — нечего считать
  double b = StrToFloat(Label1->Caption);
  if (op == 4 && b == 0)
  {
    Label1->Caption = "Деление на ноль невозможно";
    acc = 0; op = 0; newNum = true;
    return;
  }
  Label1->Caption = FloatToStr(Calc(acc, op, b));
  op = 0;
  newNum = true;
}`)}
<p>Если ошибку деления на ноль нужно выводить из разных мест, удобно сделать функцию <code>void Error(AnsiString msg)</code> — как в эталоне. Вне класса к надписи обращаются через форму: <code>Form1-&gt;Label1-&gt;Caption</code>.</p>

<h4>Шаг 6. Стирание: C, CE, &lt;-</h4>
${pre(`void __fastcall TForm1::CClick(TObject *Sender)    // C — стереть всё
{
  acc = 0; op = 0; newNum = true;
  Label1->Caption = "0";
}

void __fastcall TForm1::CEClick(TObject *Sender)   // CE — только текущее число
{
  Label1->Caption = "0";
  newNum = true;
}

void __fastcall TForm1::BackClick(TObject *Sender) // <- — последняя цифра
{
  if (newNum) return;                 // результат по цифре не стирают
  AnsiString s = Label1->Caption;
  s.Delete(s.Length(), 1);            // Delete(с какого символа, сколько)
  if (s == "" || s == "-") s = "0";
  Label1->Caption = s;
}`)}
<p>У AnsiString символы нумеруются <b>с 1</b>, поэтому последний — <code>s.Length()</code>.</p>

<h4>Шаг 7. x², √x, 1/x — действия с одним числом</h4>
${pre(`void __fastcall TForm1::SqrClick(TObject *Sender)
{
  double x = StrToFloat(Label1->Caption);
  Label1->Caption = FloatToStr(x * x);
  newNum = true;
}

void __fastcall TForm1::SqrtClick(TObject *Sender)
{
  double x = StrToFloat(Label1->Caption);
  if (x < 0) { Label1->Caption = "Недопустимый ввод"; acc = 0; op = 0; newNum = true; return; }
  Label1->Caption = FloatToStr(sqrt(x));     // sqrt — из math.h
  newNum = true;
}

void __fastcall TForm1::InvClick(TObject *Sender)
{
  double x = StrToFloat(Label1->Caption);
  if (x == 0) { Label1->Caption = "Деление на ноль невозможно"; acc = 0; op = 0; newNum = true; return; }
  Label1->Caption = FloatToStr(1 / x);
  newNum = true;
}`)}

<h4>Шаг 8. +/-, % и запятая</h4>
${pre(`void __fastcall TForm1::NegClick(TObject *Sender)      // сменить знак
{
  double x = StrToFloat(Label1->Caption);
  if (x != 0) Label1->Caption = FloatToStr(-x);
}

void __fastcall TForm1::PctClick(TObject *Sender)      // процент, как в Windows
{
  double x = StrToFloat(Label1->Caption);
  if (op == 1 || op == 2) x = acc * x / 100;   // 200 + 10% → 200 + 20
  else x = x / 100;                             // 50 × 10% → 50 × 0,1
  Label1->Caption = FloatToStr(x);
  newNum = true;
}

void __fastcall TForm1::CommaClick(TObject *Sender)    // запятая
{
  if (newNum) { Label1->Caption = "0"; newNum = false; }
  if (Label1->Caption.Pos(",") == 0)            // Pos — номер символа или 0, если нет
    Label1->Caption = Label1->Caption + ",";
}`)}
<p>В русской Windows дробная часть пишется через запятую, и StrToFloat понимает «2,5».</p>

<h4>Шаг 9. Проверка</h4>
<p>F9 — посчитай сам: 12 + 7 =, 9 − 4 × 2 =, 5 ÷ 0 =, 9 x², 16 √x. Потом «✓ Проверить» — тренажёр сам понажимает кнопки. Красный пункт подскажет, что не так.</p>
<p><b>Попробуй сам (доп.):</b> 1) вторая надпись сверху с выражением «12 + 7 =»; 2) кнопки памяти MC, MR, M+, M−, MS (ещё одна глобальная переменная <code>double mem</code>); 3) повторное «=» повторяет последнюю операцию (5 + 2 = = = → 11); 4) ввод с клавиатуры: у формы KeyPreview = true и обработчик OnKeyPress.</p>`};
})();
