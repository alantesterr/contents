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
// разбор кода по строкам: в тексте каждая строка «код ⟦ объяснение»; без ⟦ — строка без пояснения
const lines=src=>{ const rows=src.replace(/^\n/,'').split('\n').map(l=>{ const i=l.indexOf(' ⟦ '); return i<0?[l,'']:[l.slice(0,i).replace(/\s+$/,''),l.slice(i+3)]; });
  return pre(rows.map(r=>r[0]).join('\n'))+'<p class="ru"><b>Разбираем по строчкам:</b></p><div class="tw"><table class="lbl"><tr><th>Строка кода</th><th>Что она делает</th></tr>'+
    rows.filter(r=>r[1]).map(r=>'<tr><td>'+esc(r[0].trim())+'</td><td>'+r[1]+'</td></tr>').join('')+'</table></div>'; };
const how=s=>'<div class="howto"><b>Что сделать в Builder:</b> '+s+'</div>';

const EX1=String.raw`
double acc = 0; ⟦ <b>Глобальная переменная</b> (объявлена вне всех функций) — живёт всё время, пока работает программа. Сюда запомним первое число. <code>double</code> — дробное число.
bool newNum = true; ⟦ <code>bool</code> — тип «да/нет» (true/false). true значит: «следующая нажатая цифра начинает новое число».

void __fastcall TForm1::Button1Click(TObject *Sender) ⟦ Заголовок обработчика. Его пишет сам Builder, когда дважды щёлкаешь по кнопке. Эта функция выполнится каждый раз, когда нажали Button1 (кнопку «1»).
{ ⟦ Начало функции.
  if (newNum) Label1->Caption = "1"; ⟦ <code>Label1-&gt;Caption</code> — текст надписи Label1 (то, что видно на экране калькулятора). Если начинаем новое число — текст заменяем на "1".
  else Label1->Caption = Label1->Caption + "1"; ⟦ Иначе (<code>else</code>) — к старому тексту приклеиваем "1" справа: было "12" — станет "121". Строки складываются плюсом.
  newNum = false; ⟦ Число уже начали набирать — следующие цифры надо дописывать, а не заменять.
} ⟦ Конец функции.

void __fastcall TForm1::Button3Click(TObject *Sender) ⟦ Обработчик кнопки «+».
{
  acc = StrToFloat(Label1->Caption); ⟦ <code>StrToFloat</code> превращает текст "12" в число 12 (с текстом считать нельзя). Число запоминаем в acc.
  newNum = true; ⟦ Следующая цифра начнёт второе число.
}

void __fastcall TForm1::Button4Click(TObject *Sender) ⟦ Обработчик кнопки «=».
{
  double b = StrToFloat(Label1->Caption); ⟦ Второе число — то, что сейчас на экране. <code>double b</code> — локальная переменная: существует только внутри этой функции.
  Label1->Caption = FloatToStr(acc + b); ⟦ Складываем и выводим. <code>FloatToStr</code> — обратное превращение: число → текст (Caption — это текст).
  newNum = true; ⟦ Если дальше нажмут цифру — начнётся новое число, а не допишется к ответу.
}`;

const GLOBALS=String.raw`
#include <math.h> ⟦ Подключаем библиотеку математики — в ней функция <code>sqrt</code> (корень). Строку можно поставить вверху файла, рядом с <code>#include &lt;vcl.h&gt;</code>.

double acc = 0; ⟦ Первое число (то, что набрали до знака операции).
int op = 0; ⟦ Какая операция нажата: 0 — никакой, 1 — плюс, 2 — минус, 3 — умножить, 4 — делить. Храним числом, так проще сравнивать.
bool newNum = true; ⟦ true — следующая цифра начинает новое число (так в самом начале, после знака операции и после «=»).`;

const DIGIT=String.raw`
void __fastcall TForm1::DigitClick(TObject *Sender) ⟦ Один обработчик на все 10 цифр. <code>Sender</code> — «отправитель»: указатель на ту кнопку, которую нажали.
{
  AnsiString d = ((TButton*)Sender)->Caption; ⟦ <code>AnsiString</code> — тип «строка» в C++Builder. <code>(TButton*)Sender</code> — говорим компилятору: «Sender — это кнопка». Тогда можно взять её Caption — надпись "0"…"9". Её и кладём в d.
  if (newNum || Label1->Caption == "0") ⟦ <code>||</code> — «или». Если начинаем новое число ИЛИ на экране стоит "0" (чтобы не было "07")…
    Label1->Caption = d; ⟦ …то заменяем текст на нажатую цифру.
  else ⟦ Иначе…
    Label1->Caption = Label1->Caption + d; ⟦ …дописываем цифру справа: "12" + "3" = "123".
  newNum = false; ⟦ Число набирается — следующие цифры дописываем.
}`;

const OP=String.raw`
double Calc(double a, int o, double b) ⟦ Своя функция (не обработчик): получает два числа и номер операции, возвращает ответ. Пишем её <b>выше</b> обработчиков, сразу после глобальных переменных, — функцию надо объявить раньше, чем её вызывают.
{
  switch (o) ⟦ <code>switch</code> — выбор по значению o (вместо цепочки if).
  {
    case 1: return a + b; ⟦ Если o == 1 — вернуть сумму. <code>return</code> сразу завершает функцию и отдаёт значение.
    case 2: return a - b; ⟦ 2 — разность.
    case 3: return a * b; ⟦ 3 — произведение.
    case 4: return a / b; ⟦ 4 — частное.
  }
  return b; ⟦ Если операции нет — просто вернуть второе число.
}

void __fastcall TForm1::OpClick(TObject *Sender) ⟦ Один обработчик на 4 кнопки: + − × ÷.
{
  double x = StrToFloat(Label1->Caption); ⟦ Число с экрана — в x.
  if (op != 0 && !newNum) ⟦ <code>!=</code> — «не равно», <code>&amp;&amp;</code> — «и», <code>!newNum</code> — «newNum ложно». То есть: операция уже была И после неё набрали второе число. Пример: «9 − 4» и теперь нажали «×».
  {
    x = Calc(acc, op, x); ⟦ Сначала досчитываем то, что было: 9 − 4 = 5 (так делает Windows).
    Label1->Caption = FloatToStr(x); ⟦ Показываем промежуточный ответ.
  }
  acc = x; ⟦ Запоминаем первое число для новой операции.
  op = ((TButton*)Sender)->Tag; ⟦ <code>Tag</code> — свойство-число у любого компонента, его можно задать в Object Inspector. У «+» мы поставили Tag = 1, у «−» 2 и т. д. Так узнаём, какая операция нажата.
  newNum = true; ⟦ Дальше пользователь набирает второе число.
}`;

const EQ=String.raw`
void __fastcall TForm1::EqClick(TObject *Sender) ⟦ Кнопка «=».
{
  if (op == 0) return; ⟦ Операцию не нажимали — считать нечего, выходим из функции.
  double b = StrToFloat(Label1->Caption); ⟦ Второе число.
  if (op == 4 && b == 0) ⟦ Делим (op == 4) и делитель равен 0?
  {
    Label1->Caption = "Деление на ноль невозможно"; ⟦ Делить на 0 нельзя — пишем сообщение, как Windows.
    acc = 0; op = 0; newNum = true; ⟦ Сбрасываем калькулятор, чтобы дальше можно было считать заново.
    return; ⟦ И выходим — до деления дело не дойдёт.
  }
  Label1->Caption = FloatToStr(Calc(acc, op, b)); ⟦ Считаем функцией Calc и выводим результат.
  op = 0; ⟦ Операция выполнена.
  newNum = true; ⟦ Следующая цифра — новое число.
}`;

const CLR=String.raw`
void __fastcall TForm1::CClick(TObject *Sender) ⟦ Кнопка C — стереть всё.
{
  acc = 0; op = 0; newNum = true; ⟦ «Память» в начальное состояние.
  Label1->Caption = "0"; ⟦ На экране 0.
}

void __fastcall TForm1::CEClick(TObject *Sender) ⟦ Кнопка CE — стереть только текущее число (первое число и операция остаются: «8 + 5», CE, «1» = 9).
{
  Label1->Caption = "0";
  newNum = true;
}`;

const BACK=String.raw`
void __fastcall TForm1::BackClick(TObject *Sender) ⟦ Кнопка &lt;- (Backspace) — стереть последнюю цифру.
{
  if (newNum) return; ⟦ Если на экране не набираемое число, а результат (newNum == true) — ничего не делаем: результат по цифре не стирают.
  AnsiString s = Label1->Caption; ⟦ Копируем текст с экрана в строковую переменную s, чтобы с ней работать.
  s.Delete(s.Length(), 1); ⟦ <code>s.Length()</code> — длина строки (сколько символов). <code>s.Delete(откуда, сколько)</code> — удалить символы. Удаляем 1 символ, начиная с последнего: "123" → "12". В AnsiString символы нумеруются <b>с 1</b>, поэтому последний — номер Length().
  if (s == "" || s == "-") s = "0"; ⟦ Если ничего не осталось (или остался один минус) — пусть будет "0".
  Label1->Caption = s; ⟦ Возвращаем строку на экран.
}`;

const ONE=String.raw`
void __fastcall TForm1::SqrClick(TObject *Sender) ⟦ Кнопка x² — квадрат.
{
  double x = StrToFloat(Label1->Caption); ⟦ Число с экрана.
  Label1->Caption = FloatToStr(x * x); ⟦ x² = x · x. Выводим.
  newNum = true; ⟦ Это результат — новая цифра начнёт новое число.
}

void __fastcall TForm1::SqrtClick(TObject *Sender) ⟦ Кнопка √x — корень.
{
  double x = StrToFloat(Label1->Caption);
  if (x < 0) { Label1->Caption = "Недопустимый ввод"; acc = 0; op = 0; newNum = true; return; } ⟦ Корня из отрицательного числа нет — сообщение (как Windows), сброс и выход. Фигурные скобки { } объединяют несколько команд под одним if.
  Label1->Caption = FloatToStr(sqrt(x)); ⟦ <code>sqrt</code> — корень, из math.h.
  newNum = true;
}

void __fastcall TForm1::InvClick(TObject *Sender) ⟦ Кнопка 1/x — «единица, делённая на x».
{
  double x = StrToFloat(Label1->Caption);
  if (x == 0) { Label1->Caption = "Деление на ноль невозможно"; acc = 0; op = 0; newNum = true; return; } ⟦ 1/0 — нельзя, та же защита.
  Label1->Caption = FloatToStr(1 / x); ⟦ 1/4 = 0,25.
  newNum = true;
}`;

const MISC=String.raw`
void __fastcall TForm1::NegClick(TObject *Sender) ⟦ Кнопка +/- — сменить знак.
{
  double x = StrToFloat(Label1->Caption);
  if (x != 0) Label1->Caption = FloatToStr(-x); ⟦ 5 → -5, -5 → 5. У нуля знак не меняем.
}

void __fastcall TForm1::PctClick(TObject *Sender) ⟦ Кнопка % — процент, как в Windows.
{
  double x = StrToFloat(Label1->Caption);
  if (op == 1 || op == 2) x = acc * x / 100; ⟦ При + и −: процент от первого числа. «200 + 10 %» → 10 % от 200 = 20, получится 200 + 20.
  else x = x / 100; ⟦ При × и ÷ (и без операции): просто x / 100. «50 × 10 %» → 50 × 0,1.
  Label1->Caption = FloatToStr(x);
  newNum = true;
}

void __fastcall TForm1::CommaClick(TObject *Sender) ⟦ Кнопка «,» — дробная часть.
{
  if (newNum) { Label1->Caption = "0"; newNum = false; } ⟦ Если начинаем новое число с запятой — будет «0,».
  if (Label1->Caption.Pos(",") == 0) ⟦ <code>Pos(",")</code> — номер символа «,» в строке, или 0, если его нет. Запятая в числе может быть только одна.
    Label1->Caption = Label1->Caption + ","; ⟦ Дописываем запятую. StrToFloat понимает «2,5»: в русской Windows дробь пишется через запятую.
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
<p>Жёлтая панель в окне ведёт по шагам. <b>Подробное объяснение — в «Разборе» ниже</b>: что нажимать в Builder для каждой кнопки и что значит каждая строка кода. Сначала попробуй сам, а «📋 Эталон» — чтобы свериться в конце.</p>`,
 vcl:CPP.WINCALC,
 note:R`<aside class="add"><span class="tag">в настоящем Builder</span> Всё то же самое: File → New → Application, компоненты с палитры Standard. 24 кнопки быстрее делать так: положи одну, задай размер (например 60 × 40), выдели её, Ctrl+C, щёлкни по форме, Ctrl+V — и так нужное число раз, потом растащи мышью. Символы × ÷ √ ² можно вставить из «Таблицы символов» Windows (Win+R → charmap) или писать * / sqrt x^2 — на работу не влияет. Чтобы окно не растягивалось — у формы BorderStyle = bsSingle.</aside>`,
 steps:R`<h4>Сначала — новые слова и команды</h4>
<p>В этой лабе много нового. Вот всё, что встретится в коде:</p>
<div class="tw"><table><tr><th>Что</th><th>Что значит</th><th>Пример</th></tr>
<tr><td>Компонент</td><td>Готовый элемент окна с палитры: Button (кнопка), Label (надпись), Edit (поле ввода).</td><td>Button1, Label1</td></tr>
<tr><td>Свойство (property)</td><td>Настройка компонента. Меняется в Object Inspector или в коде.</td><td>Caption — надпись, Tag — число «про запас»</td></tr>
<tr><td><code>-&gt;</code></td><td>«Стрелка» — обратиться к свойству компонента. Label1 — указатель на объект, поэтому стрелка, а не точка.</td><td><code>Label1-&gt;Caption = "0";</code></td></tr>
<tr><td>Событие и обработчик</td><td>Событие — «что случилось» (OnClick — щелчок). Обработчик — функция, которую Builder вызывает при событии. Создаётся двойным щелчком по кнопке.</td><td><code>void __fastcall TForm1::Button1Click(TObject *Sender)</code></td></tr>
<tr><td><code>AnsiString</code></td><td>Строка (текст) в C++Builder. Caption — тоже AnsiString.</td><td><code>AnsiString s = "12";</code></td></tr>
<tr><td><code>StrToFloat(текст)</code></td><td>Текст → дробное число. Нужно, чтобы считать: "12" нельзя сложить как число.</td><td><code>StrToFloat("2,5")</code> → 2.5</td></tr>
<tr><td><code>FloatToStr(число)</code></td><td>Число → текст, чтобы показать в Caption.</td><td><code>FloatToStr(19)</code> → "19"</td></tr>
<tr><td><code>s.Length()</code></td><td>Сколько символов в строке.</td><td>"123" → 3</td></tr>
<tr><td><code>s.Delete(откуда, сколько)</code></td><td>Удалить символы из строки. Нумерация с 1.</td><td>"123".Delete(3,1) → "12"</td></tr>
<tr><td><code>s.Pos("x")</code></td><td>Где в строке символ x (номер), 0 — если нет.</td><td>"2,5".Pos(",") → 2</td></tr>
<tr><td><code>Sender</code></td><td>Параметр обработчика — какой компонент вызвал событие (какую кнопку нажали).</td><td><code>((TButton*)Sender)-&gt;Caption</code></td></tr>
<tr><td>Глобальная переменная</td><td>Объявлена вне функций — сохраняет значение между нажатиями кнопок. Локальная (внутри функции) создаётся заново при каждом вызове.</td><td><code>double acc = 0;</code></td></tr>
<tr><td><code>bool</code>, <code>true</code>, <code>false</code></td><td>Тип «да/нет».</td><td><code>bool newNum = true;</code></td></tr>
<tr><td><code>return;</code></td><td>Выйти из функции сразу, дальше строки не выполняются.</td><td><code>if (op == 0) return;</code></td></tr>
<tr><td><code>&amp;&amp;</code>, <code>||</code>, <code>!</code></td><td>«и», «или», «не».</td><td><code>if (op == 4 &amp;&amp; b == 0)</code></td></tr></table></div>

<div class="trap"><b>Как правильно вставлять код из этого разбора (иначе будет [C++ Error]):</b><br>
1) Двойной щелчок по кнопке создаёт <b>пустую заготовку</b> — заголовок <code>void __fastcall TForm1::Button1Click(TObject *Sender)</code> и пустые <code>{ }</code>. В разборе функции показаны <b>целиком</b>, с заголовком. Поэтому: либо копируй в заготовку <b>только строки между { и }</b>, либо удали заготовку полностью и вставь функцию целиком на её место. Если вставить целую функцию внутрь <code>{ }</code> заготовки — получится «функция в функции», и будет ошибка «Пропущена ; после )» (в Builder — <i>Statement missing ;</i> / <i>Declaration syntax error</i>).<br>
2) Если имя заготовки другое (Builder назвал Button7Click, а в разборе DigitClick) — либо переименуй, либо оставь имя Builder, а код возьми только из { }.<br>
3) Глобальные переменные <code>double acc …</code>, <code>int op …</code>, <code>bool newNum …</code> пиши <b>один раз</b>. Если ты делал пример из шага 0, а потом вставил блок из шага 2 — у тебя acc и newNum объявлены дважды: ошибка «Multiple declaration for 'acc'». Удали повтор.<br>
4) Вспомогательные функции (Calc) — <b>вне</b> обработчиков, выше них.<br>
5) Если ошибка всё равно есть — смотри номер строки в <code>[C++ Error] Unit1.cpp(номер)</code>: эта строка подсвечивается красным слева в редакторе. Ошибка обычно в ней или строкой выше (часто — забытая <code>;</code> в конце строки или лишняя/недостающая <code>}</code>).</div>

<h4>Шаг 0. Пример: калькулятор из четырёх кнопок</h4>
${how('положи на форму Label (Caption = 0, Font → Size 20) и 4 кнопки Button. Подпиши их Caption: «1», «2», «+», «=». Дважды щёлкни по каждой кнопке — Builder создаст пустую функцию-обработчик (Button1Click, Button2Click…) и откроет Unit1.cpp. Внутрь фигурных скобок пиши код. Глобальные переменные пиши выше всех функций, сразу после строки <code>TForm1 *Form1;</code>.')}
${lines(EX1)}
<p>Button2Click («2») — точно такой же, как Button1Click, только "2" вместо "1". Набери «12», «+», «2», «=» — получится 14. Главная мысль: калькулятор <b>помнит</b> первое число (acc), а каждая кнопка — своя маленькая функция. Весь большой калькулятор — та же идея, просто кнопок больше.</p>

<h4>Шаг 1. Форма и экран</h4>
${how('у Form1 в Object Inspector: Caption = Калькулятор. С палитры Standard → <b>Label</b> → щёлкни вверху формы. У Label1: Caption = 0; Font → Size = 24, Style → fsBold (жирный). Чтобы число стояло справа, как в Windows: AutoSize = false, растяни надпись мышью на ширину формы, Alignment = taRightJustify.')}

<h4>Шаг 2. «Память» калькулятора</h4>
${how('открой Unit1.cpp (вкладка внизу окна) и после строки <code>TForm1 *Form1;</code> напиши:')}
${lines(GLOBALS)}

<h4>Шаг 3. Кнопки 0–9 — один обработчик на все</h4>
${how('положи 10 кнопок, у каждой Caption: 0, 1, … 9. Дважды щёлкни по кнопке «7» — появится функция, например Button7Click. Переименуй её: выдели кнопку, в Object Inspector вкладка <b>Events</b>, в поле <b>OnClick</b> впиши <b>DigitClick</b> и нажми Enter (функция переименуется). Теперь у каждой другой цифры: Events → OnClick → выбери из выпадающего списка <b>DigitClick</b>. Все 10 кнопок вызывают одну функцию.')}
${lines(DIGIT)}

<h4>Шаг 4. Кнопки + − × ÷</h4>
${how('положи 4 кнопки, Caption: + − × ÷ (можно - * /). Задай каждой свойство <b>Tag</b> (в Object Inspector, вкладка Properties): «+» → 1, «−» → 2, «×» → 3, «÷» → 4. Дважды щёлкни по «+», переименуй обработчик в <b>OpClick</b> (как в шаге 3), остальным трём выбери OpClick в Events → OnClick. Функцию Calc напиши выше всех обработчиков (после глобальных переменных).')}
${lines(OP)}

<h4>Шаг 5. Кнопка =</h4>
${how('кнопка с Caption «=», двойной щелчок — обработчик (назови EqClick или оставь как Builder назвал). Пиши внутри:')}
${lines(EQ)}
<p>Проверь: 12 + 7 = 19; 9 − 4 × 2 = 10; 5 ÷ 0 = «Деление на ноль невозможно».</p>

<h4>Шаг 6. Кнопки C и CE</h4>
${how('две кнопки с Caption «C» и «CE», у каждой двойной щелчок — свой обработчик.')}
${lines(CLR)}

<h4>Шаг 7. Кнопка &lt;- (стереть цифру)</h4>
${how('кнопка с Caption «&lt;-», двойной щелчок.')}
${lines(BACK)}

<h4>Шаг 8. Кнопки x², √x, 1/x</h4>
${how('три кнопки (Caption «x²» или «x^2», «√x» или «sqrt», «1/x»), у каждой двойной щелчок. Не забудь <code>#include &lt;math.h&gt;</code> из шага 2 — без него sqrt не найдётся (ошибка E2268 Call to undefined function).')}
${lines(ONE)}

<h4>Шаг 9. Кнопки +/-, % и запятая</h4>
${how('три кнопки (Caption «+/-», «%», «,»), у каждой двойной щелчок.')}
${lines(MISC)}

<h4>Шаг 10. Проверка</h4>
<p>F9 (▶ Run) — посчитай сам: 12 + 7 =, 9 − 4 × 2 =, 5 ÷ 0 =, 9 x², 16 √x, 200 + 10 % =. Потом «✓ Проверить» — тренажёр сам понажимает кнопки. Красный пункт подскажет, что не так. Частые ошибки:</p>
<div class="trap"><b>Цифры заменяют друг друга, а не дописываются</b> — забыл <code>newNum = false;</code> в DigitClick.</div>
<div class="trap"><b>«Call to undefined function 'sqrt'»</b> — нет <code>#include &lt;math.h&gt;</code>.</div>
<div class="trap"><b>«Call to undefined function 'Calc'» (вызов неизвестной функции)</b> — функция Calc написана ниже обработчиков; перенеси её выше.</div>
<div class="trap"><b>Операция всегда одна и та же</b> — не задан Tag у кнопок + − × ÷.</div>
<div class="trap"><b>Кнопка ничего не делает</b> — у неё не выбран обработчик в Events → OnClick.</div>
<p><b>Попробуй сам (доп.):</b> 1) вторая надпись сверху с выражением «12 + 7 =»; 2) кнопки памяти MC, MR, M+, M−, MS (ещё одна глобальная переменная <code>double mem</code>); 3) повторное «=» повторяет последнюю операцию (5 + 2 = = = → 11); 4) ввод с клавиатуры: у формы KeyPreview = true и обработчик OnKeyPress.</p>`};
})();
