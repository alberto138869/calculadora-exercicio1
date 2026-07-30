const calcDisplay = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calc-button');
const calcClear = document.getElementById('calcClear');
const calcDel = document.getElementById('calcDel');
const calcEquals = document.getElementById('calcEquals');

function appendToCalc(v){
  if(!calcDisplay.value || calcDisplay.value === '0' || calcDisplay.value === 'Erro') calcDisplay.value = '';
  calcDisplay.value += v;
}

calcButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    appendToCalc(btn.dataset.value || btn.textContent);
  });
});

calcClear.addEventListener('click', ()=> calcDisplay.value = '');
calcDel.addEventListener('click', ()=> calcDisplay.value = calcDisplay.value.slice(0,-1));
calcEquals.addEventListener('click', evaluateCalc);

// Enter key triggers evaluation
document.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') evaluateCalc(); });

function evaluateCalc(){
  let expr = calcDisplay.value;
  if(!expr.trim()) return;
  expr = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/\^/g,'**');
  expr = expr.replace(/sqrt\(/g,'Math.sqrt(').replace(/√\(/g,'Math.sqrt(');
  expr = expr.replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(');
  expr = expr.replace(/ln\(/g,'Math.log(');
  // log base 10: use Math.log10 if available, otherwise divide by LN10
  expr = expr.replace(/log\(/g,'(Math.log10?Math.log10:(x=>Math.log(x)/Math.LN10))(');
  expr = expr.replace(/exp\(/g,'Math.exp(');
  expr = expr.replace(/pi/gi,'Math.PI').replace(/e(?![a-z0-9_])/gi,'Math.E');

  // basic safety: allow only expected characters and Math identifiers
  const safeRe = /^[0-9+\-*/().,\sMathPIElnsgtacoxrb**]+$/i;
  if(!safeRe.test(expr)) { calcDisplay.value = 'Erro'; return; }

  try{
    const result = Function('"use strict"; return (' + expr + ')')();
    if(typeof result === 'number' && isFinite(result)) calcDisplay.value = String(result);
    else calcDisplay.value = 'Erro';
  } catch(e){ calcDisplay.value = 'Erro'; }
}
