/* C++ · Тема 10. Доп. лаба «Три формы по кругу» (делается в C++Builder 6 или во вкладке «C++Builder» сайта). Грузится перед c10.js */
(function(){ const R=String.raw;
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// код с разбором по строчкам: «код ⟦ объяснение»
const lines=src=>{ const rows=src.replace(/^\n/,'').split('\n').map(l=>{ const i=l.indexOf(' ⟦ '); return i<0?[l,'']:[l.slice(0,i).replace(/\s+$/,''),l.slice(i+3)]; });
  return '<pre class="cpp-code">'+esc(rows.map(r=>r[0]).join('\n'))+'</pre><p class="ru"><b>Разбираем по строчкам:</b></p><div class="tw"><table class="lbl"><tr><th>Строка кода</th><th>Что она делает</th></tr>'+
    rows.filter(r=>r[1]).map(r=>'<tr><td>'+esc(r[0].trim())+'</td><td>'+r[1]+'</td></tr>').join('')+'</table></div>'; };
const how=s=>'<div class="howto"><b>Что сделать в Builder:</b> '+s+'</div>';

const U1=String.raw`
#include <vcl.h>
#pragma hdrstop

#include "Unit1.h" ⟦ Заголовок своей формы — Builder пишет сам.
#include "Unit2.h" ⟦ Появилась после File → Include Unit Hdr → Unit2. Теперь Unit1 «знает» Form2 и её компоненты.
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;
//---------------------------------------------------------------------------
__fastcall TForm1::TForm1(TComponent* Owner)
        : TForm(Owner)
{
}
//---------------------------------------------------------------------------
void __fastcall TForm1::FormShow(TObject *Sender) ⟦ Событие OnShow формы 1 — срабатывает, когда главное окно появляется на экране при запуске.
{
  Form2->Show(); ⟦ Показать вторую форму. Без этого при запуске видно только Form1 (остальные формы созданы, но спрятаны).
  Form3->Show(); ⟦ Показать третью. Для этого Unit1 должен знать и Form3 — подключи Include Unit Hdr → Unit3 тоже.
}
//---------------------------------------------------------------------------
void __fastcall TForm1::Button1Click(TObject *Sender) ⟦ Нажали кнопку на первой форме.
{
  Form2->Label1->Caption = Label1->Caption + Edit1->Text; ⟦ Справа: надпись этой формы + текст из её поля (строки складываются плюсом, приклеиваются друг к другу). Слева: надпись <b>на Form2</b>. У чужой формы пишем путь через неё: <code>Form2-&gt;Label1</code>. Свои компоненты — просто <code>Label1</code>, <code>Edit1</code>.
}`;

const U2=String.raw`
#include "Unit2.h"
#include "Unit3.h" ⟦ Include Unit Hdr → Unit3: вторая форма отправляет в третью.

void __fastcall TForm2::Button1Click(TObject *Sender) ⟦ Кнопка на второй форме. Обрати внимание: класс уже <b>TForm2</b>, а не TForm1 — это файл Unit2.cpp.
{
  Form3->Label1->Caption = Label1->Caption + Edit1->Text; ⟦ Надпись второй формы + её текст → в надпись третьей формы. Label1 и Edit1 здесь — компоненты <b>второй</b> формы (у каждой формы свои Label1 и Edit1, имена могут совпадать).
}`;

const U3=String.raw`
#include "Unit3.h"
#include "Unit1.h" ⟦ Include Unit Hdr → Unit1: третья форма отправляет обратно в первую — круг замыкается.

void __fastcall TForm3::Button1Click(TObject *Sender) ⟦ Кнопка на третьей форме.
{
  Form1->Label1->Caption = Label1->Caption + Edit1->Text; ⟦ Надпись третьей формы + её текст → в надпись первой формы.
}`;

CPP.FORMS3_TASK={id:'c10-forms3',name:'Доп. лаба. Три формы по кругу',
 text:R`<p><b>Задание.</b> Сделать программу из трёх окон (форм). На каждой форме: поле ввода <b>Edit1</b>, надпись <b>Label1</b> и кнопка <b>Button1</b>.</p>
<ul><li>кнопка на <b>Form1</b>: надпись Form1 + текст из Edit1 Form1 → в надпись <b>Form2</b>;</li>
<li>кнопка на <b>Form2</b>: надпись Form2 + текст Form2 → в надпись <b>Form3</b>;</li>
<li>кнопка на <b>Form3</b>: надпись Form3 + текст Form3 → в надпись <b>Form1</b>;</li>
<li>и дальше по кругу — текст «путешествует» по окнам и растёт.</li></ul>
<p>Пример: в Form1 пишем «При», жмём — на Form2 надпись «При». В Form2 пишем «вет», жмём — на Form3 «Привет». В Form3 пишем «!», жмём — на Form1 «Привет!».</p>
<p class="ru">Эту лабу можно сделать в настоящем C++Builder 6 по шагам ниже или во вкладке <b>C++Builder</b> (после темы 15): там тоже есть File → New → Form, Include Unit Hdr и запуск нескольких окон. Готовый пример: «Три формы по кругу».</p>`,
 steps:R`<h4>Новое в этой лабе</h4>
<div class="tw"><table><tr><th>Что</th><th>Что значит</th></tr>
<tr><td>Несколько форм</td><td>Каждая форма — своё окно и свой модуль: Form1 → Unit1.cpp/Unit1.h, Form2 → Unit2.cpp/Unit2.h, Form3 → Unit3…</td></tr>
<tr><td>File → Include Unit Hdr (Alt+F11)</td><td>Подключить другую форму к текущему модулю. Builder допишет <code>#include "Unit2.h"</code>. Без этого в коде нельзя написать Form2 — будет ошибка <i>Undefined symbol 'Form2'</i> (неизвестное имя).</td></tr>
<tr><td><code>Form2-&gt;Label1-&gt;Caption</code></td><td>«Надпись Label1, которая лежит на Form2». Сначала форма, потом её компонент, потом свойство.</td></tr>
<tr><td><code>Form2-&gt;Show();</code></td><td>Показать форму (окно). <code>Hide()</code> — спрятать, <code>Close()</code> — закрыть.</td></tr>
<tr><td>Событие OnShow</td><td>Срабатывает, когда форма появляется на экране.</td></tr>
<tr><td>Строка + строка</td><td>Склеивание: "При" + "вет" = "Привет".</td></tr></table></div>

<h4>Шаг 1. Проект и три формы</h4>
${how('File → New → Application — появится Form1. Потом <b>File → New → Form</b> — появится Form2, ещё раз File → New → Form — Form3. Сразу сохрани всё: File → Save All (Shift+Ctrl+S) в отдельную папку, имена модулей оставь Unit1, Unit2, Unit3, проект — Project1.')}

<h4>Шаг 2. Компоненты на каждой форме</h4>
${how('на <b>каждую</b> из трёх форм положи с палитры Standard: <b>Edit</b>, <b>Label</b> и <b>Button</b> (как на картинке: поле сверху, надпись посередине, кнопка снизу). У каждой Label в Object Inspector сотри Caption (сделай пустым), у Edit сотри Text. Можно увеличить шрифт: Font → Size 12. Переключаться между формами: <b>View → Forms</b> (Shift+F12) или меню Window. На всех трёх формах компоненты будут называться одинаково — Edit1, Label1, Button1. Это нормально: у каждой формы свои.')}

<h4>Шаг 3. Связать формы (Include Unit Hdr)</h4>
${how('открой Form1 (щёлкни по ней), меню <b>File → Include Unit Hdr…</b> (Alt+F11), выбери <b>Unit2</b> → OK. Ещё раз Alt+F11 → <b>Unit3</b> → OK (Form1 нужна Form3, чтобы показать её при запуске). Потом открой Form2 → Alt+F11 → <b>Unit3</b>. Потом Form3 → Alt+F11 → <b>Unit1</b>. Получится круг: 1 знает 2 и 3, 2 знает 3, 3 знает 1.')}

<h4>Шаг 4. Показать все окна при запуске</h4>
${how('выдели Form1 (щёлкни по пустому месту формы), в Object Inspector вкладка <b>Events</b>, двойной щелчок по полю <b>OnShow</b> — появится FormShow. Впиши две строки (см. код ниже). Другой способ без кода: у Form2 и Form3 в Object Inspector поставить <b>Visible = true</b>.')}

<h4>Шаг 5. Кнопки — код</h4>
${how('на Form1 дважды щёлкни по Button1 и впиши строку из кода ниже. Так же на Form2 (откроется Unit2.cpp) и на Form3 (Unit3.cpp). Вставляй <b>только строку между { и }</b> — заголовок функции Builder уже написал.')}
<p><b>Unit1.cpp (первая форма) — весь файл:</b></p>
${lines(U1)}
<p><b>Unit2.cpp (вторая форма) — главное:</b></p>
${lines(U2)}
<p><b>Unit3.cpp (третья форма) — главное:</b></p>
${lines(U3)}

<h4>Шаг 6. Запуск</h4>
<p>F9. Появятся три окна. Напиши в первом «При» → кнопка: во втором окне надпись «При». Во втором напиши «вет» → кнопка: в третьем «Привет». В третьем «!» → кнопка: в первом «Привет!». И снова по кругу.</p>
<div class="trap"><b>[C++ Error] Undefined symbol 'Form2'</b> (или Form3, Form1) — этот модуль не подключён: открой форму, в которой ошибка, и сделай File → Include Unit Hdr → нужный Unit.</div>
<div class="trap"><b>При запуске видно только одно окно</b> — нет <code>Form2-&gt;Show(); Form3-&gt;Show();</code> в FormShow (или OnShow не привязан: проверь Events → OnShow у Form1).</div>
<div class="trap"><b>Текст уходит не в то окно</b> — перепутаны формы в строке: на Form1 пишем <code>Form2-&gt;…</code>, на Form2 — <code>Form3-&gt;…</code>, на Form3 — <code>Form1-&gt;…</code>.</div>
<div class="trap"><b>«Функция в функции» / Statement missing ;</b> — в заготовку вставлен целый обработчик с заголовком. Вставляй только строку между { }.</div>
<p><b>Попробуй сам (доп.):</b> 1) между частями ставить пробел: <code>Label1-&gt;Caption + " " + Edit1-&gt;Text</code>; 2) после нажатия очищать поле: <code>Edit1-&gt;Text = "";</code>; 3) в заголовке окна считать, сколько раз нажали кнопку: глобальная <code>int n = 0;</code>, в обработчике <code>n++; Caption = "Нажатий: " + IntToStr(n);</code>; 4) кнопка «Очистить всё» на Form1, которая стирает надписи на всех трёх формах.</p>`};
})();
