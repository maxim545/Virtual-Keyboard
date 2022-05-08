import en from './export/en';
import ru from './export/ru';

export default class MakeKeyboard {
  constructor(capsLock, shift, shiftAndCaps = true) {
    this.obj = { eng: en, rus: ru };
    this.capsLock = capsLock;
    this.shift = shift;
    this.shiftAndCaps = shiftAndCaps;
    this.numberOfKeys = [14, 15, 13, 13, 9];
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'eng');
      this.lang = this.obj[localStorage.getItem('lang')];
    } else { this.lang = this.obj[localStorage.getItem('lang')]; }
  }

  init() {
    const body = document.querySelector('body');
    const container = document.createElement('div');
    const keyboard = document.createElement('div');
    const textarea = document.createElement('textarea');
    const title = document.createElement('div');
    container.classList.add('container');
    keyboard.classList.add('keyboard');
    textarea.classList.add('textarea');
    title.classList.add('title');
    body.prepend(container);
    container.appendChild(keyboard);
    body.prepend(textarea);
    body.prepend(title);
    title.innerHTML = 'Клавиатура создана в операционной системе Windows Переключение языка осущетсвляется через: левыe Ctrl + Alt';
    this.createRows(keyboard);
  }

  createRows(keyboard) {
    let rows = [];
    rows = this.numberOfKeys.map(() => '<div class="keyboard__row"></div>').join('');
    keyboard.insertAdjacentHTML('beforeEnd', rows);
    this.createKeys();
  }

  createKeys() {
    let keyboardRows = [];
    keyboardRows = document.querySelectorAll('.keyboard__row');
    const keys = [[], [], [], [], []];
    let count = 0;
    let sum = 0;
    this.numberOfKeys.forEach((num, i) => {
      sum += num;
      while (count < sum) {
        keys[i].push(this.lang[count]);
        count += 1;
      }
    });
    const insertKey = (keyCode, className) => `<div class="keyboard__key${className}" data-code="${keyCode}"></div>`;
    const makeKey = (i) => keys[i].map((key) => {
      let className = '';
      if (!key.caps) { className = ' inv'; }
      if (key.small.match(/Enter|Shift|CapsLock|Backspace/)) { className += ' long-2fr'; }
      if (key.code === 'Space') { className = ' inv long-5fr'; }
      return insertKey(key.code, className);
    }).join('');
    keyboardRows.forEach((a, i) => a.insertAdjacentHTML('beforeEnd', makeKey(i)));
    this.creatLetters();
  }

  creatLetters() {
    let allKeys = document.querySelectorAll('.keyboard__key');
    allKeys = [...allKeys];
    this.lang.forEach((key, i) => {
      if (!this.shiftAndCaps && key.shift) {
        allKeys[i].innerHTML = key.shift;
      } else if (this.capsLock && key.caps) {
        allKeys[i].innerHTML = key.caps;
      } else if (this.shift && key.shift) {
        allKeys[i].innerHTML = key.shift;
      } else { allKeys[i].innerHTML = key.small; }
    });
  }
}
const key = new MakeKeyboard();
key.init();
