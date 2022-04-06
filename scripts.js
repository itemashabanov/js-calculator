const prevResult = document.getElementsByClassName('prev-result')[0];
const curResult = document.getElementsByClassName('cur-result')[0];

class Calculator {
  constructor(elem, prevResult, curResult) {
    elem.onclick = this.onClick.bind(this);
    this.prevResult = prevResult
    this.curResult = curResult
    this.performType = undefined;
  }

  numeral(num) {
    if(num === '.' && this.curResult.innerText.includes(num)) return false;

    if(this.curResult.innerText === 'Error') this.curResult.innerText = '';

    this.curResult.innerText = this.curResult.innerText.toString() + num.toString();
  }

  clear() {
    if(this.prevResult.innerText.length || this.curResult.innerText.length) {
      this.prevResult.innerText = this.curResult.innerText = '';
      this.performType = undefined;
    } else return;
  }

  delete() {
    this.curResult.innerText = curResult.innerText.toString().slice(0, -1);
  }

  equel() {
    if(!this.performType) return false;

    let perform;
    const prev = parseFloat(this.prevResult.innerText),
      current = parseFloat(this.curResult.innerText);
      
    if ((isNaN(prev) || isNaN(current)) && this.performType !== '√') return false;
    
    switch (this.performType) {
      case '÷':
        current === 0 ? perform = 'Error' : perform = prev / current;
        break
      case '*':
        perform = prev * current
        break
      case '+':
        perform = prev + current
        break
      case '-':
        perform = prev - current
        break
      case '^':
        perform = Math.pow(prev, current)
        break
      case '√':
        current < 0 ? perform = 'Error' : perform = Math.sqrt(current);
        this.performType = undefined;
        break
      default:
        return
    }

    if(typeof perform === 'number') {
      perform = +perform.toFixed(10)

      if(!perform.toString().includes('.')) perform = +Math.floor(perform);

      perform.toString().includes('.') ? perform = this.sliceer(perform, 0, 11) : perform = this.sliceer(perform, 0, 10);
      
      if(perform.split('')[perform.length - 1] === '.') perform = this.sliceer(perform, 0, -1);

      perform = parseFloat(perform);
    } else perform;

    this.curResult.innerText = perform;
    this.prevResult.innerText = '';
  }

  sliceer(s, f, l) {
    return s.toString().slice(f, l);
  }

  perform(performType) {
    if(!this.curResult.innerText.length && performType !== '-') return false;

    if(this.prevResult.innerText.length) this.equel(performType);

    if(this.curResult.innerText === 'Error') {
      this.curResult.innerText = '';
      return;
    }

    if(performType === '√') {
      this.performType = performType;
      this.equel(performType);
    }

    if(performType !== '√') {
      if(performType === '-' && !this.curResult.innerText.length)
        this.curResult.innerText = '-';
      else {
        if(this.curResult.innerText === '-') {
          this.curResult.innerText = '';
          return false;
        } else
          this.prevResult.innerText = this.curResult.innerText + ' ' + performType;

        this.curResult.innerText = '';
        this.performType = performType;
      }
    }
  }

  onClick(event) {
    const action = event.target.dataset.action,
      num = event.target.dataset.numeral,
      performType = event.target.dataset.perform;
    
    action ? this[action]() : (num ? this.numeral(num) : (performType ? this.perform(performType) : false))
  }
}

new Calculator(calculator, prevResult, curResult);