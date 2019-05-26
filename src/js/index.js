import './svgpolyfill';

window.onload = init;

const model = {
  answer: [],
  sumLength: 0,
  counter: 0,
  whiteColor: 'rgb(255,255,255)',
  inputColor: 'rgb(51,51,51)',
  activeBtnColor: 'rgb(248,228,126)',
  arrowColor: 'rgb(173,20,87)',
  errorColor: 'rgb(255,0,0)',
  clueColor: 'rgb(240,230,140)',

  random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  createQuestion() {
    const firstNum = this.random([6, 7, 8, 9]);
    const sum = this.random([11, 12, 13, 14]);

    const secondNum = sum - firstNum;

    this.answer.push(firstNum, secondNum, sum);
    this.sumLength = sum.toString().length;

    [firstNum, secondNum].forEach(
      (num, ind) => (document.getElementById(`number-${ind}`).innerHTML = num),
    );
  },
  createDiv(className, idName) {
    const newDiv = document.createElement('div');
    newDiv.classList.add(className);
    newDiv.id = idName;
    return newDiv;
  },
  createBlockInput(className, idName) {
    const newInput = document.createElement('input');
    newInput.classList.add('input', className);
    newInput.id = idName;
    newInput.setAttribute('type', 'text');
    return newInput;
  },
  setSvgAttr(pathName, fill, stroke, strokeWidth) {
    pathName.setAttribute('fill', fill);
    pathName.setAttribute('stroke', stroke);
    pathName.setAttribute('stroke-width', strokeWidth);
  },
  createBlock() {
    const container = document.getElementById('axis-first-part');

    const newBlock = this.createDiv('axis-block', `axis-block-${this.counter}`);
    container.appendChild(newBlock);

    const inputArea = this.createDiv('input-area', `input-area-${this.counter}`);
    newBlock.appendChild(inputArea);

    const svgArea = this.createDiv('svg-area', `svg-area-${this.counter}`);
    newBlock.appendChild(svgArea);

    model.createArrow();
    model.createInput();
  },
  createArrow() {
    const svgArea = document.getElementById(`svg-area-${this.counter}`);

    const step = 39 * this.answer[this.counter];
    const curve = 5 * this.answer[this.counter];

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', step);
    svg.classList.add('svg-image');

    svgArea.appendChild(svg);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(
      null,
      'd',
      `M0,100 C${curve}, ${100 - step / 3} ${step - curve}, ${100 - step / 3} ${step},100`,
    );

    this.setSvgAttr(path, 'none', model.arrowColor, 2);
    svg.appendChild(path);

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    if (this.answer[this.counter] >= 4) {
      polyline.setAttributeNS(null, 'points', `${step - 13},86 ${step},100 ${step - 4},80`);
    } else {
      polyline.setAttributeNS(null, 'points', `${step - 13},92 ${step},100 ${step - 2},87`);
    }

    this.setSvgAttr(polyline, 'none', model.arrowColor, 2);
    svg.appendChild(polyline);
    document.getElementById(`axis-block-${this.counter}`).style.width = `${step}px`;
  },
  createInput() {
    const inputArea = document.getElementById(`input-area-${this.counter}`);
    const newInput = this.createBlockInput('input-text', `input-numb-${this.counter}`);
    inputArea.appendChild(newInput);
    newInput.focus();

    newInput.addEventListener('input', function() {
      const output = document.getElementById(`number-${model.counter}`);
      newInput.style.color = model.inputColor;
      output.style.backgroundColor = model.whiteColor;
      if (!newInput.value.match(/^\d+$/) || newInput.value.length > model.sumLength) {
        newInput.value = '';
      }

      if (output.textContent === newInput.value) {
        const inputArea = document.getElementById(`input-area-${model.counter}`);
        const newElem = document.createElement('div');
        newElem.classList.add('input-numb');
        newElem.innerHTML = newInput.value;
        inputArea.removeChild(newInput);
        inputArea.appendChild(newElem);
        model.counter += 1;
        if (model.counter <= 1) {
          model.createBlock();
        } else if (model.counter === 2) {
          model.createAnswer();
        }
      } else {
        newInput.style.color = model.errorColor;
        output.style.backgroundColor = model.clueColor;
      }
    });
  },
  createAnswer() {
    const sum = document.getElementById('sum');
    sum.innerHTML = '';
    const newInput = this.createBlockInput('input-answer', `input-numb-${this.counter}`);
    sum.appendChild(newInput);
    newInput.focus();

    newInput.addEventListener('input', function() {
      const output = model.answer[model.counter].toString();
      newInput.style.color = model.inputColor;
      if (!newInput.value.match(/^\d+$/) || newInput.value.length > model.sumLength) {
        newInput.value = '';
      }

      if (output === newInput.value) {
        const sum = document.getElementById('sum');
        const newElem = document.createElement('div');
        newElem.classList.add('symbol');
        newElem.innerHTML = newInput.value;
        sum.removeChild(newInput);
        sum.appendChild(newElem);
        document.getElementById('nextQuestion').style.backgroundColor = model.activeBtnColor;
        document.getElementById('nextQuestion').style.borderColor = model.inputColor;
      } else if (newInput.value.length === model.sumLength && output !== newInput.value) {
        newInput.style.color = model.errorColor;
      }
    });
  },
};

function init() {
  model.createQuestion();
  model.createBlock();
}

function openNextQuestion() {
  location.href = 'index.html';
}

const nextQuestion = document.getElementById('nextQuestion');
nextQuestion.onclick = openNextQuestion;
