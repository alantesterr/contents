/* C++ · Тема 15. Создание пользовательского компонента. ООП-лаба 3-4 «Текстовый редактор» */
(function(){ const R=String.raw; const H=CPP.H;
const LECTURE=R`<div class="read">
  <aside class="fix"><span class="tag">о материалах</span> План лекции 15 из УМКД (перевод) и моя лекция с полным кодом компонента для C++Builder 6.</aside>
  <h2 id="c15-lec">Лекция 15. Создание пользовательского компонента</h2>
  <p><b>Цель:</b> познакомить с принципами разработки пользовательских компонентов в C++Builder и научить создавать повторно используемые компоненты.</p>
  <p><b>Основные пункты:</b> понятие компонента; отличие компонента, объекта и класса; стандартные и пользовательские компоненты; зачем создавать свои компоненты; наследование компонентов; выбор базового компонента; создание класса компонента; добавление своих свойств; добавление методов; создание и обработка событий; регистрация компонента; установка на палитру; использование на формах; повторное использование в разных проектах; тестирование и отладка; основные этапы разработки компонента.</p>
  <aside class="add"><span class="tag">дополнение · компонент</span>
    <p><b>Компонент</b> — самостоятельный «строительный блок» (self-contained building block), который кладут на форму: класс-наследник <b>TComponent</b> с published-свойствами и событиями, которые видны в Object Inspector.</p>
    <ul><li><b>Класс</b> — описание (тип). <b>Объект</b> — экземпляр класса в памяти. <b>Компонент</b> — класс особого вида (наследник TComponent), который зарегистрирован в IDE, лежит на палитре и настраивается мышью при проектировании.</li>
      <li><b>Стандартные</b> компоненты — из VCL (Button, Edit…). <b>Пользовательские</b> — созданные программистом, обычно наследованием от стандартных.</li>
      <li><b>Зачем свои:</b> один раз сделать элемент с нужным поведением (поле только для чисел, метка-счётчик, кнопка с подсветкой) и использовать во многих формах и проектах.</li>
      <li><b>Роль наследования:</b> новый компонент наследует всё от базового и добавляет своё. <b>Выбор базового:</b> берут самый близкий по поведению: на основе TLabel (надпись), TEdit (поле ввода), TButton (кнопка); TGraphicControl — свой рисованный элемент без окна; TWinControl/TCustomControl — с окном и фокусом; TComponent — невизуальный.</li></ul>
  </aside>
  <aside class="add"><span class="tag">дополнение · этапы создания (C++Builder 6)</span>
    <ol><li><b>Component → New Component</b>: Ancestor type — базовый класс (например TLabel), Class Name — TMyLabel, Palette Page — вкладка палитры (например Samples). Builder создаёт MyLabel.cpp и MyLabel.h.</li>
      <li>Описать класс: поля, методы, свойства в секции <code>__published</code> (тогда они появятся в Object Inspector), события — свойства типа TNotifyEvent.</li>
      <li>Функция <code>Register()</code> вызывает <code>RegisterComponents("Samples", classes, 0)</code> — так компонент регистрируется.</li>
      <li><b>Component → Install Component</b> → в пакет (dclusr.bpk) → Compile → компонент появляется на <b>палитре</b>.</li>
      <li>Положить на форму, настроить свойства, проверить в программе; при ошибке — исправить, пересобрать пакет.</li></ol>
<pre class="cpp-code">// MyLabel.h
class PACKAGE TMyLabel : public TLabel          // наследуем стандартную надпись
{
private:
  AnsiString FText;                             // поле для свойства
  int FClicks;
  TNotifyEvent FOnTextChanged;                  // поле события
  void __fastcall SetText(AnsiString v);
protected:
  DYNAMIC void __fastcall Click();              // переопределяем реакцию на щелчок
public:
  __fastcall TMyLabel(TComponent* Owner);
  void __fastcall Reset();                      // свой метод
__published:                                    // видно в Object Inspector
  __property AnsiString Text = {read = FText, write = SetText};
  __property int Clicks = {read = FClicks};
  __property TNotifyEvent OnTextChanged = {read = FOnTextChanged, write = FOnTextChanged};
};

// MyLabel.cpp
__fastcall TMyLabel::TMyLabel(TComponent* Owner) : TLabel(Owner)
{ FText = "Text"; FClicks = 0; Caption = FText; }

void __fastcall TMyLabel::SetText(AnsiString v)
{
  FText = v;
  Caption = FText + " (" + IntToStr(FClicks) + ")";
  if (FOnTextChanged) FOnTextChanged(this);     // вызвать событие, если к нему привязан обработчик
}
void __fastcall TMyLabel::Click() { FClicks++; SetText(FText); TLabel::Click(); }
void __fastcall TMyLabel::Reset() { FClicks = 0; SetText(FText); }

namespace Mylabel
{
  void __fastcall PACKAGE Register()
  {
    TComponentClass classes[1] = {__classid(TMyLabel)};
    RegisterComponents("Samples", classes, 0);
  }
}</pre>
    <p><b>Свойства</b> компонента — __property с read/write (тема 14). <b>Методы</b> — обычные функции класса. <b>События компонента</b> — свойства-указатели на обработчики (TNotifyEvent); компонент «вызывает» событие, когда что-то произошло, а обработчик пишет пользователь компонента. Повторное использование: установленный компонент доступен в любом проекте с палитры.</p>
  </aside>
</div>`;
const ED_COMPS=[
  {type:'TMemo',Name:'Memo1',Left:8,Top:8,Width:300,Height:230,Lines:[],ScrollBars:'ssBoth',PopupMenu:'PopupMenu1'},
  {type:'TBitBtn',Name:'BitBtn1',Left:320,Top:8,Width:90,Caption:'Открыть',Cursor:'crHandPoint',events:{OnClick:'Open1Click'}},
  {type:'TBitBtn',Name:'BitBtn2',Left:320,Top:40,Width:90,Caption:'Сохранить',Cursor:'crHandPoint',events:{OnClick:'Save1Click'}},
  {type:'TBitBtn',Name:'BitBtn3',Left:320,Top:72,Width:90,Caption:'Шрифт',Cursor:'crHandPoint',events:{OnClick:'Font1Click'}},
  {type:'TMainMenu',Name:'MainMenu1',Left:330,Top:120,Items:[{Caption:'&File',Name:'File1',items:[{Caption:'&Open',Name:'Open1',OnClick:'Open1Click'},{Caption:'&Save',Name:'Save1',OnClick:'Save1Click'}]},{Caption:'&Edit',Name:'Edit1',items:[{Caption:'&Font',Name:'Font1',OnClick:'Font1Click'},{Caption:'&Clear',Name:'Clear1',OnClick:'Clear1Click'}]}]},
  {type:'TPopupMenu',Name:'PopupMenu1',Left:366,Top:120,Items:[{Caption:'Font',Name:'Font2',OnClick:'Font1Click'},{Caption:'Clear',Name:'Clear2',OnClick:'Clear1Click'}]},
  {type:'TOpenDialog',Name:'OpenDialog1',Left:330,Top:160,Filter:'Текстовые файлы|*.txt|Все файлы|*.*'},
  {type:'TSaveDialog',Name:'SaveDialog1',Left:366,Top:160,Filter:'Текстовые файлы|*.txt|Все файлы|*.*'},
  {type:'TFontDialog',Name:'FontDialog1',Left:330,Top:200}];
const ED_FORM={Caption:'Текстовый редактор',Width:430,Height:310,Position:'poDesigned',PopupMenu:'PopupMenu1'};
const ED_CODE=H('Open1Click','if (OpenDialog1->Execute()) Memo1->Lines->LoadFromFile(OpenDialog1->FileName);')+H('Save1Click','  if (SaveDialog1->Execute()) Memo1->Lines->SaveToFile(SaveDialog1->FileName);')+
  H('Font1Click','  if (FontDialog1->Execute()) Memo1->Font=FontDialog1->Font;')+H('Clear1Click','Memo1->Clear();');
const EDITOR={form:ED_FORM,comps:ED_COMPS,code:H("Open1Click","")+H("Save1Click","")+H("Font1Click","")+H("Clear1Click",""),
  ref:{form:ED_FORM,comps:ED_COMPS,code:ED_CODE},
  checks:[{name:'File → Open загружает файл в Memo',act:[['answer',{name:'C:\\Мои документы\\список.txt'}],['menu','Open1']],exp:[['Memo1','Lines','молоко|хлеб|сыр']]},
    {name:'Кнопка «Открыть» делает то же (одна функция на три способа)',act:[['answer',{name:'C:\\Мои документы\\пример.txt'}],['click','BitBtn1']],exp:[['Memo1','Lines','Привет из файла!|Вторая строка']]},
    {name:'Edit → Font меняет шрифт Memo',act:[['answer',{Name:'Arial',Size:14,Color:255,Style:0}],['menu','Font1']],exp:[['Memo1','Font.Size',14]]},
    {name:'Edit → Clear очищает Memo',act:[['set','Memo1','Lines',['a','b']],['menu','Clear1']],exp:[['Memo1','Lines','']]},
    {name:'Контекстное меню Clear тоже очищает',act:[['set','Memo1','Lines',['x']],['menu','Clear2']],exp:[['Memo1','Lines','']]}],
  steps:[{t:'Компоненты уже на форме (рис. 1 лабы). Выдели <b>MainMenu1</b> → в Object Inspector свойство Items «…» — посмотри пункты File (Open, Save) и Edit (Font, Clear).',c:{comp:'TMainMenu'}},
    {t:"Builder уже создал пустые обработчики пунктов меню (Open1Click, Save1Click, Font1Click, Clear1Click). Впиши в <b>Open1Click</b>: <code>if (OpenDialog1-&gt;Execute()) Memo1-&gt;Lines-&gt;LoadFromFile(OpenDialog1-&gt;FileName);</code>",c:{code:"LoadFromFile"}},
    {t:"Допиши Save1Click (SaveToFile), Font1Click (Memo1-&gt;Font = FontDialog1-&gt;Font) и Clear1Click (Memo1-&gt;Clear()).",c:{code:"Clear\s*\(\s*\)"}},
    {t:'Проверь: File → Open — файл загрузился.',c:{check:0}},
    {t:'Доп. задание 1: кнопки и контекстное меню вызывают те же функции (Events → OnClick → выбрать Open1Click).',c:{check:1}}],
  palette:['TMemo','TButton','TBitBtn','TMainMenu','TPopupMenu','TOpenDialog','TSaveDialog','TFontDialog','TStatusBar','TDateTimePicker','TLabel','TEdit']};
const ED2_COMPS=ED_COMPS.map(c=>c.type==='TMainMenu'?Object.assign({},c,{Items:[{Caption:'&File',Name:'File1',items:[{Caption:'&New',Name:'New1',OnClick:'New1Click'},{Caption:'&Open',Name:'Open1',OnClick:'Open1Click'},{Caption:'&Save',Name:'Save1',OnClick:'Save1Click'},{Caption:'E&xit',Name:'Exit1',OnClick:'Exit1Click'}]},{Caption:'&Edit',Name:'Edit1',items:[{Caption:'&Font',Name:'Font1',OnClick:'Font1Click'},{Caption:'&Clear',Name:'Clear1',OnClick:'Clear1Click'},{Caption:'&Date_Time',Name:'DateTime1',OnClick:'DateTime1Click'}]},{Caption:'&Help',Name:'Help1',items:[{Caption:'&About',Name:'About1',OnClick:'About1Click'}]}]}):c)
  .concat([{type:'TStatusBar',Name:'StatusBar1',Panels:['NoName']},{type:'TDateTimePicker',Name:'DateTimePicker1',Left:320,Top:250,Width:100}]);
const ED2_CODE=H('Open1Click','  if (OpenDialog1->Execute())\n  {\n    Memo1->Lines->LoadFromFile(OpenDialog1->FileName);\n    StatusBar1->Panels->Items[0]->Text = OpenDialog1->FileName;\n  }')+
  H('Save1Click','  if (SaveDialog1->Execute())\n  {\n    Memo1->Lines->SaveToFile(SaveDialog1->FileName);\n    StatusBar1->Panels->Items[0]->Text = SaveDialog1->FileName;\n  }')+
  H('Font1Click','  if (FontDialog1->Execute()) Memo1->Font = FontDialog1->Font;')+H('Clear1Click','  Memo1->Clear();')+
  H('New1Click','  if (Memo1->Lines->Count > 0)\n  {\n    int ind = Application->MessageBox("Do you want to save a file?", "Save", MB_YESNOCANCEL);\n    if (ind == IDYES) { Save1Click(Sender); Memo1->Clear(); StatusBar1->Panels->Items[0]->Text = "NoName"; }\n    else if (ind == IDNO) { Memo1->Clear(); StatusBar1->Panels->Items[0]->Text = "NoName"; }\n    else return;\n  }')+
  H('DateTime1Click','  Memo1->Lines->Add(DateTimePicker1->DateTime.DateString() + " " + Now().TimeString());')+
  H('Exit1Click','  if (Memo1->Lines->Count > 0 && Application->MessageBox("Save the text?", "Exit", MB_YESNO) == IDYES)\n    Save1Click(Sender);\n  Close();')+
  H('About1Click','  ShowMessage("Текстовый редактор. Автор: студент группы ...");');
const EDITOR2={form:ED_FORM,comps:ED2_COMPS,code:ED_CODE,
  ref:{form:ED_FORM,comps:ED2_COMPS,code:ED2_CODE},
  checks:[{name:'Open пишет имя файла в StatusBar',act:[['answer',{name:'C:\\Мои документы\\пример.txt'}],['menu','Open1']],exp:[['StatusBar1','Panels.0','C:\\Мои документы\\пример.txt']]},
    {name:'New с ответом «No» очищает и пишет NoName',act:[['set','Memo1','Lines',['abc']],['answer',7],['menu','New1']],exp:[['Memo1','Lines',''],['StatusBar1','Panels.0','NoName']]},
    {name:'Edit → Date_Time добавляет строку с датой',act:[['menu','DateTime1']],exp:[['Memo1','Lines',{re:'\\d{2}\\.\\d{2}\\.\\d{4}'}]]}],
  palette:EDITOR.palette};
const T=[
 {id:'c15-ed',name:'ООП-лаба 3-4. Текстовый редактор',wtitle:'Лабораторная работа №3-4: «Текстовый редактор»',text:R`<p><b>Тема:</b> Палитра VCL-компонентов. Основные невизуальные компоненты.</p><p><b>Цель работы:</b> Создание программы «Текстовый редактор».</p><p><b>Вопросы для самостоятельной подготовки:</b> невизуальные компоненты палитры Dialogs, их свойства, методы и события.</p>
<div class="tw"><table><tr><th>Компонент</th><th>Свойство</th><th>Значение свойства</th></tr><tr><td>Form1</td><td>Caption / Position / PopupMenu</td><td>Текстовый редактор / poDesigned (это обеспечит размещение формы по центру экрана) / PopupMenu1</td></tr>
<tr><td>Memo1</td><td>Lines-TStrings, ScrollBars, PopupMenu</td><td>ssBoth, PopupMenu1</td></tr><tr><td>MainMenu1</td><td>Items</td><td>Пункт &amp;File (подпункты &amp;Open и &amp;Save), пункт &amp;Edit (подпункты &amp;Font и &amp;Clear)</td></tr>
<tr><td>BitButton1, 2, 3</td><td>Caption, Cursor</td><td>Открыть, Сохранить, Шрифт; crHandPoint</td></tr><tr><td>OpenDialog1</td><td>Filter</td><td>(рис. 2) FilterName – строка пояснения, Filter – расширения файлов (через точку с запятой).</td></tr>
<tr><td>SaveDialog1</td><td></td><td>Аналогично (как для OpenDialog1)</td></tr><tr><td>FontDialog1</td><td></td><td>Options -&gt;fdShowHelp=true</td></tr><tr><td>PopupMenu1</td><td></td><td>(рис. 3) Аналогично (как для MainMenu1)</td></tr></table></div>
<p>Для команды главного меню Open: <code>if (OpenDialog1-&gt;Execute()) Memo1-&gt;Lines-&gt;LoadFromFile(OpenDialog1-&gt;FileName);</code> Save: <code>if (SaveDialog1-&gt;Execute()) Memo1-&gt;Lines-&gt;SaveToFile(SaveDialog1-&gt;FileName);</code> Font: <code>if (FontDialog1-&gt;Execute()) Memo1-&gt;Font=FontDialog1-&gt;Font;</code> Clear: <code>Memo1-&gt;Clear();</code></p>
<p><b>Дополнительные задания:</b> 1) операции (открытие, сохранение, шрифт, очистка) должны выполняться 3 способами: с помощью главного меню, кнопок и контекстного меню. Правильнее создать функцию один раз, а затем задавать её выполнение другим компонентам с помощью инспектора объектов: щелкнуть по кнопке Open, выбрать в инспекторе объектов вкладку Events, раскрыть список в событии OnClick и выбрать в нем строку Open1Click. 2) Добавьте в пункте Edit подпункт Date_Time, при нажатии на который к тексту на объекте Memo1 должны добавляться текущие дата и время (Timer и DateTimePicker — в чём их отличие?)</p>`,vcl:EDITOR,
  note:R`<aside class="add"><span class="tag">как работают диалоги в тренажёре</span> OpenDialog/SaveDialog открывают окно с «папкой» C:\Мои документы (там уже есть пример.txt и список.txt). Сохранённые файлы остаются в этой папке до перезагрузки страницы. Пункты меню редактируются кнопкой «…» у свойства Items: строка «Заголовок | Имя | Обработчик», подпункт — с двумя пробелами.</aside>`,
  steps:R`<ul><li><b>Невизуальные компоненты</b> (диалоги, меню, таймер) видны на форме только при проектировании маленькими значками.</li><li><code>OpenDialog1-&gt;Execute()</code> показывает окно выбора файла и возвращает true, если нажали «Open»; выбранный путь — в <code>FileName</code>.</li><li><code>Memo1-&gt;Lines-&gt;LoadFromFile(имя)</code> / <code>SaveToFile(имя)</code> — прочитать/записать весь текст Memo.</li><li><code>Memo1-&gt;Font = FontDialog1-&gt;Font;</code> — скопировать выбранный шрифт.</li><li>Один обработчик на три способа: у кнопки и у пункта PopupMenu в Events → OnClick выбрать уже существующий Open1Click.</li><li>Timer обновляет время сам по таймеру, DateTimePicker — компонент выбора даты пользователем (свойство DateTime).</li></ul>`},
 {id:'c15-ed2',name:'Контрольные задания к лабе 3-4 и доп. лаба «text editor»',wtitle:'Редактор: New, StatusBar, Date_Time, Exit, About',text:R`<p>1) Добавьте на форму компоненты с вкладки Win32: а) StatusBar — для создания строки состояния: используя свойство “Panels”, приведите «Редактор панелей» к виду с одной панелью; б) ToolBar — панель инструментов с кнопками, дублирующими пункты главного меню. 2) Оформите инструментальную панель: ImageList с рисунками, свойству Images компонента ToolBar1 присвойте ImageList1. Что можно сделать, если рисунки расположились не в том порядке? Какое свойство отвечает за это? 3) Создайте обработчики событий для инструментальной панели и пункта главного меню «New».</p>
<p><b>Доп. лаба «Visual components library. Non-visual components»:</b> when opening an existing document, the status bar contains the full file name: <code>StatusBar1-&gt;Panels-&gt;Items[0]-&gt;Text=OpenDialog1-&gt;FileName;</code> For the New item — a message window suggests to save the document (Yes / No / Cancel). Add an "Exit" button, which closes the application and asks to save the text, if there is a text in a Memo. Add the item "Help" → "About" with information about the developer. Add sub-items of the context menu: Copy, Paste, Cut (CutToClipboard(); CopyToClipboard(); PasteFromClipboard()). Add the item View → "&amp;Panel" which shows and hides the toolbar.</p>`,vcl:EDITOR2,
  note:R`<aside class="fix"><span class="tag">о коде</span> В доп. лабе MessageBox вызывается как <code>MessageBox(NULL,(LPCWSTR)L"Do you want to save a file?",(LPCWSTR)L"Save",MB_YESNOCANCEL)</code> — это вариант Unicode-API из новых версий Builder; в C++Builder 6 проще и правильнее <code>Application-&gt;MessageBox("Do you want to save a file?", "Save", MB_YESNOCANCEL)</code>. ToolBar и ImageList тренажёр не рисует — их делай в настоящем Builder: правая кнопка по ToolBar → New Button, у кнопки ImageIndex — номер картинки (порядок картинок меняют в редакторе ImageList или свойством ImageIndex).</aside>`,
  steps:R`<ul><li><code>StatusBar1-&gt;Panels-&gt;Items[0]-&gt;Text</code> — текст первой панели строки состояния.</li><li><code>Application-&gt;MessageBox(текст, заголовок, MB_YESNOCANCEL)</code> возвращает IDYES, IDNO или IDCANCEL.</li><li>Из одного обработчика можно вызвать другой: <code>Save1Click(Sender);</code></li><li><code>Close();</code> закрывает форму (и программу, если форма главная).</li><li><code>ShowMessage("…")</code> — простое окно с сообщением и кнопкой OK.</li></ul>`},
];
const COMP_CONSOLE=[{id:'c15-cls',name:'Задание (идея компонента в консоли)',cmp:'exact',text:R`<p>Тренажёр не умеет регистрировать компоненты на палитре, поэтому принцип компонента проверим на консольной модели: класс TCounterLabel «наследует» надпись, у него свойство Text (__property с проверкой), счётчик щелчков только для чтения, метод Reset. Событие (OnTextChanged) — в коде настоящего компонента в лекции.</p>`,
  ref:R`#include <iostream.h>
#include <conio.h>
#include <string>
using namespace std;

class TLabelModel                      // упрощённая «стандартная надпись»
{
protected:
  string FCaption;
public:
  TLabelModel() { FCaption = "Label"; }
  void Paint() { cout << "[" << FCaption << "]" << endl; }
};

class TCounterLabel : public TLabelModel   // «свой компонент» на основе надписи
{
private:
  string FText;
  int FClicks;
  void SetText(string v)
  {
    if (v == "") { cout << "Text не может быть пустым" << endl; return; }
    FText = v; Update();
  }
  int GetClicks() { return FClicks; }
  void Update() { FCaption = FText + " (" + char('0' + FClicks % 10) + ")"; }
public:
  TCounterLabel() { FText = "Text"; FClicks = 0; Update(); }
  __property string Text = {read = FText, write = SetText};
  __property int Clicks = {read = GetClicks};
  void Click() { FClicks++; Update(); }
  void Reset() { FClicks = 0; Update(); }
};

int main()
{
  TCounterLabel lbl;
  lbl.Paint();
  lbl.Text = "Счёт";
  lbl.Click(); lbl.Click();
  lbl.Paint();
  cout << "Clicks = " << lbl.Clicks << endl;
  lbl.Text = "";
  lbl.Reset();
  lbl.Paint();
  getch();
  return 0;
}`, ins:[['Без ввода','']],
  steps:R`<p>Здесь те же части, что у настоящего компонента: наследование от «стандартного» класса, своё свойство Text (__property с проверкой в SetText), свойство только для чтения Clicks, метод Reset. События (указатели на обработчики) в тренажёре не поддерживаются — в Builder это свойство типа TNotifyEvent, код в лекции.</p>`}];
CPP.topic('c15',{n:15,
 title:'Создание пользовательского компонента',
 lecSub:'Компонент и его отличие от класса и объекта, наследование от стандартного, свои свойства, методы, события, регистрация, установка на палитру.',
 lecture:LECTURE,
 labs:[{id:'c15-lab',short:'ООП-лаба 3-4',title:'Лабораторная работа №3-4. Палитра VCL-компонентов. Основные невизуальные компоненты. «Текстовый редактор»',show:2,tasks:T},
  {id:'c15-comp',short:'Свой компонент',title:'СРС УМКД: свой визуальный компонент на основе VCL со свойством Text',show:1,
   orig:R`<div class="lab-task"><span class="tl">Оригинал УМКД · СРС</span><p>Create your own visual component based on standard components from the VCL library. Add a text property and demonstrate how to use it.</p><p><i>Создать свой визуальный компонент на основе стандартного компонента VCL, добавить свойство Text и показать, как им пользоваться.</i></p></div>`,
   note:R`<aside class="add"><span class="tag">как сдать в Builder</span> Полный код компонента TMyLabel (на основе TLabel) со свойством Text — в лекции выше. Порядок: Component → New Component (Ancestor TLabel, Class TMyLabel, Palette Samples) → вставить код → Component → Install Component → Compile → TMyLabel на вкладке Samples → положить на форму, в Object Inspector задать Text, в обработчике кнопки <code>MyLabel1-&gt;Text = Edit1-&gt;Text;</code></aside>`,tasks:COMP_CONSOLE}],
 umkd:[
  ['Что такое компонент в C++Builder?','Самостоятельный строительный блок приложения — класс-наследник TComponent, который размещается на форме и настраивается в Object Inspector.'],
  ['Разница между классом, объектом и компонентом?','Класс — описание типа; объект — экземпляр класса в памяти; компонент — особый класс (наследник TComponent), зарегистрированный в IDE и размещаемый на палитре и форме.'],
  ['Что такое пользовательский компонент?','Компонент, созданный программистом (обычно наследованием от стандартного VCL-компонента) и установленный на палитру.'],
  ['Зачем создают свои компоненты?','Чтобы один раз реализовать нужное поведение и повторно использовать его в разных формах и проектах.'],
  ['Роль наследования при создании компонента?','Новый компонент наследует свойства, методы и события базового и добавляет свои — не нужно писать всё заново.'],
  ['Как выбирается базовый компонент?','Берут ближайший по поведению: TLabel, TEdit, TButton для доработки стандартных; TGraphicControl или TCustomControl для своих рисуемых; TComponent для невизуальных.'],
  ['Какие свойства можно добавить в компонент?','Любые данные с доступом через __property (read/write); в секции __published они видны в Object Inspector.'],
  ['Как добавить методы в компонент?','Объявить функции-члены в классе компонента и описать их; можно переопределять виртуальные методы базового (Click, Paint).'],
  ['Что такое события компонента?','Свойства-указатели на обработчики (TNotifyEvent и др.), которые компонент вызывает при определённых действиях; обработчик пишет пользователь компонента.'],
  ['Как регистрируется компонент в C++Builder?','Функцией Register() с вызовом RegisterComponents("Страница", классы, n) в модуле компонента.'],
  ['Как добавить компонент на палитру?','Component → Install Component → выбрать пакет → Compile/Install; компонент появится на указанной странице палитры.'],
  ['Основные этапы создания и проверки компонента?','Выбор базового класса → New Component → свойства, методы, события → Register → установка в пакет → размещение на форме → тестирование и отладка.'],
 ],
 foot:'Источники: УМКД «Programming I» (тема 15 и СРС), лабораторная работа №3-4 (ООП), доп. лабы «non-visual components» и «text editor».'
});
})();
