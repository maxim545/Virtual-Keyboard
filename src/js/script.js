import '../style.css';

import en from './export/en';
import ru from './export/ru';
import Init from './init';

class ChangeValues {
  constructor() {
    this.obj = { eng: en, rus: ru };
    this.lang = localStorage.getItem('lang');
    this.capsLock = false;
    this.shift = false;
    this.shiftAndCaps = true;
    this.keyPressed = {};
    this.keysPress = {};
    this.text = '';
    this.curentKey = null;
    this.eventType = null;
    this.indexKey = null;
    this.code = null;
    this.count = 0;
    this.repeat = false;
    this.isKey = false;
    this.typeIsDown = false;
    this.mouseDownKeyIs = null;
    this.isAlt = null;
  }

  catchEvent() {
    document.addEventListener('keydown', (e) => { this.detecteKey(e); });
    document.addEventListener('keyup', (e) => { this.detecteKey(e); });
    document.addEventListener('mousedown', (e) => { this.detecteKey(e); });
    document.addEventListener('mouseup', (e) => { this.detecteKey(e); });
  }

  detecteKey(e) {
    const existKeys = [];
    let allKeys = document.querySelectorAll('.keyboard__key');
    allKeys = [...allKeys];
    allKeys.forEach((key, i) => {
      if (key.dataset.code === e.code || key.dataset.code === e.target.dataset.code || e.type === 'mouseup') {
        if (e.type === 'keydown' || e.type === 'keyup') {
          this.curentKey = key;
          this.eventType = e.type;
          this.code = e.code;
          this.indexKey = i;
          this.repeat = e.repeat;
          this.isKey = true;
          if (e.type === 'keydown') {
            this.typeIsDown = e.code;
            this.keysPress[e.code] = true;
          }
          if (e.type === 'keyup') {
            this.typeIsDown = false;
            this.keysPress[e.code] = false;
          }
        }
        if ((e.type === 'mousedown' || e.type === 'mouseup') && (this.typeIsDown !== e.target.dataset.code) && (!this.keysPress[e.target.dataset.code])) {
          if (e.type === 'mousedown') {
            this.mouseDownKeyIs = key;
            this.eventType = 'keydown';
            this.curentKey = key;
            this.code = e.target.dataset.code;
            this.indexKey = i;
            this.isKey = true;
          }
          if (e.type === 'mouseup' && this.isKey) {
            this.eventType = 'keyup';
          }
        }
      }
    });
    if (e.type === 'mouseup' && this.isKey && e.target.dataset.code !== this.curentKey && this.mouseDownKeyIs) {
      this.mouseDownKeyIs.classList.remove('active');
    }
    if (e.type === 'mousedown') {
      this.isAlt = e.target.dataset.code;
    }
    if (e.type === 'mouseup' && !e.target.dataset.code) {
      this.keyPressed[this.isAlt] = false;
    }
    this.obj[this.lang].forEach((key) => existKeys.push(key.code));
    if ((this.eventType === 'keydown' || this.eventType === 'keyup') && this.isKey && existKeys.includes(e.code || e.target.dataset.code)) {
      if (((this.code === 'ControlLeft' || this.code === 'AltLeft') && !this.repeat) || (e.type === 'mouseup' || e.type === 'mousedown')) {
        this.changeLang(e);
      }
      this.switchKeys();
      this.changeActive(e);
      if (!this.code.match(/ShiftLeft|ShiftRight|ControlRight|ControlLeft|AltLeft|AltRight|MetaLeft|CapsLock/g)) {
        this.changeTextinput();
      }
      if (e.type === 'mouseup') { this.isKey = false; }
    }
  }

  changeLang(e) {
    if ((this.eventType === 'keydown' || e.type === 'mousedown') && (this.code === 'ControlLeft' || this.code === 'AltLeft')) {
      this.keyPressed[this.code] = true;
      if (this.keyPressed.ControlLeft && this.keyPressed.AltLeft) {
        if (localStorage.getItem('lang') === 'eng') {
          localStorage.setItem('lang', 'rus');
        } else { localStorage.setItem('lang', 'eng'); }
        this.lang = localStorage.getItem('lang');
        this.create();
      }
    }
    if (e.type === 'keyup') { this.keyPressed[this.code] = false; }
    if (e.type === 'mouseup') { this.keyPressed[e.target.dataset.code] = false; }
  }

  switchKeys() {
    if (this.eventType === 'keydown' && this.code.match(/ShiftLeft|ShiftRight/g) && !this.shift) {
      if (!this.repeat) {
        this.shift = !this.shift;
        this.capsLock = !this.capsLock;
        this.shiftAndCaps = !this.shiftAndCaps;
        this.create();
      }
    } else if (this.eventType === 'keydown' && this.code === 'CapsLock') {
      if (!this.repeat) {
        this.capsLock = !this.capsLock;
        this.create();
      }
    }
    if (this.eventType === 'keyup' && this.code.match(/ShiftLeft|ShiftRight/g) && this.shift) {
      if (!this.repeat) {
        this.shift = !this.shift;
        this.capsLock = !this.capsLock;
        this.shiftAndCaps = !this.shiftAndCaps;
        this.create();
      }
    }
  }

  changeActive(e) {
    const shiftLeft = document.querySelector("[data-code='ShiftLeft']");
    const shiftRight = document.querySelector("[data-code='ShiftRight']");
    if (this.eventType === 'keyup' && this.curentKey.dataset.code === 'CapsLock') {
      this.eventType = null;
    }
    if (this.eventType === 'keydown') {
      if (this.curentKey.dataset.code === 'CapsLock' && this.curentKey.classList.contains('active_capslock') && !this.repeat) {
        this.curentKey.classList.remove('active_capslock');
      } else if (this.curentKey.dataset.code === 'CapsLock' && !this.curentKey.classList.contains('active_capslock') && !this.repeat) {
        this.curentKey.classList.add('active_capslock');
      }
      if (this.curentKey.dataset.code !== 'CapsLock' && !this.curentKey.classList.contains('active')) {
        this.curentKey.classList.add('active');
      }
    } else if (this.eventType === 'keyup' || e.type === 'mouseup') {
      if (e.code) {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          shiftLeft.classList.remove('active');
          shiftRight.classList.remove('active');
          this.keysPress.ShiftRight = false;
          this.keysPress.ShiftLeft = false;
        } else { this.curentKey.classList.remove('active'); }
      }
      if (e.target.dataset.code) {
        e.target.classList.remove('active');
      }
    }
  }

  changeTextinput() {
    const textarea = document.querySelector('textarea');
    textarea.focus();
    const objKey = this.obj[this.lang][this.indexKey];
    let left = textarea.selectionStart;
    let right = textarea.selectionEnd;
    if (this.eventType === 'keydown' && objKey.caps) {
      this.text = this.curentKey.textContent;
    }
    const obj1 = {
      Backspace: () => {
        left -= 1;
      },
      Del: () => {
        right += 1;
      },
      Enter: () => {
        this.text = '\n';
      },
      Tab: () => {
        this.text = '\t';
      },
      Space: () => {
        this.text = ' ';
      },
      ArrowLeft: () => {
        this.text = '◄';
      },
      ArrowRight: () => {
        this.text = '►';
      },
      ArrowUp: () => {
        this.text = '▲';
      },
      ArrowDown: () => {
        this.text = '▼';
      },
    };
    if (this.eventType === 'keydown' && objKey.code === 'Backspace' && left > 0) {
      obj1.Backspace();
    }
    if (this.eventType === 'keydown' && objKey.code === 'Delete') {
      obj1.Del();
    }
    if ((this.eventType === 'keydown' && objKey.code === 'Enter') || (left - textarea.value.lastIndexOf('\n', left - 1) === 72 && !objKey.code.match(/ArrowUp|ArrowDown|ArrowLeft|Backspace|Delete|ArrowRight/g))) {
      obj1.Enter();
    }
    if (this.eventType === 'keydown' && objKey.code === 'Tab') {
      obj1.Tab();
    }
    if (this.eventType === 'keydown' && objKey.code === 'Space') {
      obj1.Space();
    }
    if (this.eventType === 'keydown' && objKey.code === 'ArrowLeft') {
      obj1.ArrowLeft();
    }
    if (this.eventType === 'keydown' && objKey.code === 'ArrowRight') {
      obj1.ArrowRight();
    }
    if (this.eventType === 'keydown' && objKey.code === 'ArrowUp') {
      obj1.ArrowUp();
    }
    if (this.eventType === 'keydown' && objKey.code === 'ArrowDown') {
      obj1.ArrowDown();
    }
    textarea.setRangeText(this.text, left, right, 'end');
    this.text = '';
  }

  create() {
    const key = new Init(this.capsLock, this.shift, this.shiftAndCaps);
    key.creatLetters();
  }

  refresh() {
    this.capsLock = false;
    this.shift = false;
    this.shiftAndCaps = true;
    this.keyPressed = {};
    this.text = '';
    this.curentKey = null;
    this.eventType = null;
    this.indexKey = null;
    this.code = null;
    this.repeat = false;
    this.isKey = false;
    this.typeIsDown = false;
    this.mouseDownKeyIs = null;
    this.create();
    let allKeys = document.querySelectorAll('.keyboard__key');
    allKeys = [...allKeys];
    allKeys.forEach((key) => {
      if (key.classList.contains('active_capslock')) {
        key.classList.remove('active_capslock');
      }
      if (key.classList.contains('active')) {
        key.classList.remove('active');
      }
    });
  }
}
const value = new ChangeValues();
value.catchEvent();

function disable() { document.onkeydown = () => false; } disable();
window.addEventListener('blur', () => { value.refresh(); });
