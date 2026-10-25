const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const columns = {
  esgo: 'es_go', tipo: 'tipo', corr: 'key_resp_experimental.corr',
  keys_: 'key_resp_experimental.keys', rt: 'key_resp_experimental.rt',
};

function app() {
  const elements = new Map();
  function element() {
    return {
      style: {}, value: '', innerHTML: '', textContent: '',
      classList: { add() {}, remove() {} },
      appendChild(option) { if (option.selected) this.value = option.value; },
      addEventListener() {},
    };
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element,
    querySelectorAll: () => [],
  };
  class FileReader {
    readAsText(file) { this.onload({ target: { result: file.contents } }); }
  }
  const context = vm.createContext({ document, FileReader, requestAnimationFrame() {} });
  vm.runInContext(script, context);
  return { context, document };
}

function fixture() {
  // Solo datos sintéticos: 20 ensayos de práctica, 80 experimentales y 6 pantallas.
  const headers = ['es_go_p', 'tipo_p', 'es_go', 'tipo', columns.keys_, columns.corr, columns.rt, 'screen'];
  const records = [];
  for (let i = 0; i < 20; i++) records.push([i < 16 ? 1 : 0, i < 16 ? 'go' : 'nogo', '', '', '', '', '', '']);
  for (let i = 0; i < 64; i++) records.push(['', '', 1, 'go', i < 60 ? 'space' : 'None', i < 60 ? 1 : 0, i < 60 ? 0.2 : '', '']);
  for (let i = 0; i < 16; i++) records.push(['', '', 0, 'nogo', i < 15 ? 'space' : 'None', i < 15 ? 0 : 1, i < 15 ? 0.1 : '', '']);
  for (let i = 0; i < 6; i++) records.push(['', '', '', '', '', '', '', 'instrucciones']);
  return [headers.join(','), ...records.map(row => row.join(','))].join('\r\n');
}

test('excluye práctica y pantallas; calcula las cuatro medidas y los aciertos', () => {
  const { context } = app();
  const rows = context.parseCSV(fixture());
  assert.equal(rows.length, 106);
  const data = context.processData(rows, columns);
  assert.equal(data.trials.length, 80);
  assert.equal(data.goTrials.length, 64);
  assert.equal(data.nogoTrials.length, 16);
  assert.equal(data.goCorrect.length, 60);
  assert.equal(data.nogoCorrect.length, 1);
  assert.equal(data.omissionErrors.length, 4);
  assert.equal(data.commissionErrors.length, 15);
  assert.equal(data.globalAcc, 76.25);
  assert.equal(data.avgRt, 200);
  assert.equal(data.omissionRate, 6.25);
  assert.equal(data.commissionRate, 93.75);
});

test('lee BOM, CRLF, comas entrecomilladas, comillas escapadas y campos multilínea', () => {
  const { context } = app();
  const rows = context.parseCSV('\uFEFFimagen,es_go,notes\r\n"media/stim/circulo,verde.png",1,"Dijo ""sí""\ny continuó"\r\n');
  assert.equal(rows[0].imagen, 'media/stim/circulo,verde.png');
  assert.equal(rows[0].es_go, '1');
  assert.equal(rows[0].notes, 'Dijo "sí"\ny continuó');
});

test('detecta punto y coma y tabulaciones; ignora líneas vacías y encabezados vacíos finales', () => {
  const { context } = app();
  for (const separator of [';', '\t']) {
    const rows = context.parseCSV(`id${separator}es_go${separator}\r\n1${separator}0${separator}\r\n\r\n`);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].es_go, '0');
    assert.equal(Object.keys(rows[0]).length, 2);
  }
});

test('rechaza archivos incompletos o con registros desalineados', () => {
  const { context } = app();
  for (const text of ['', 'id,es_go', 'id,es_go\n"sin cerrar,1', 'id,es_go\n1',
    'id,id\n1,1', 'id,es_go\n"1"texto,1', 'id,es_go\nabc"def,1']) {
    assert.throws(() => context.parseCSV(text));
  }
});

test('muestra un error de carga sin avanzar cuando el CSV es inválido', () => {
  const { context, document } = app();
  context.handleFile({ name: 'prueba.csv', contents: 'id,es_go\n"sin cerrar,1' });
  assert.equal(document.getElementById('error-msg').style.display, 'block');
  assert.match(document.getElementById('error-msg').textContent, /comillas sin cerrar/);
  assert.equal(vm.runInContext('_rows', context), null);
});

test('exige la columna de teclas en la interfaz y en el procesador', () => {
  const { context, document } = app();
  const rows = context.parseCSV(fixture());
  context.showColSelector(rows);
  document.getElementById('sel-keys').value = '';
  context.confirmColumns();
  assert.equal(document.getElementById('col-error').style.display, 'block');
  assert.match(document.getElementById('col-error').textContent, /tecla presionada/);
  assert.equal(vm.runInContext('_data', context), null);
  assert.match(context.processData(rows, { ...columns, keys_: '' }).error, /tecla presionada/);
  assert.match(context.processData(rows, { ...columns, keys_: 'columna_inexistente' }).error, /tecla presionada/);
});

test('distingue cero errores de una tasa no calculable y un RT no disponible', () => {
  const { context } = app();
  const headers = [columns.esgo, columns.tipo, columns.keys_, columns.corr, columns.rt].join(',');
  const onlyNoGo = context.processData(context.parseCSV(headers + '\n0,nogo,None,1,'), columns);
  assert.equal(onlyNoGo.commissionRate, 0);
  assert.equal(onlyNoGo.omissionRate, null);
  assert.equal(onlyNoGo.avgRt, null);
  const onlyGo = context.processData(context.parseCSV(headers + '\n1,go,None,0,'), columns);
  assert.equal(onlyGo.omissionRate, 100);
  assert.equal(onlyGo.commissionRate, null);
  assert.equal(onlyGo.avgRt, null);
});
