
let dnaLeast = [];
let dnaMost = [];
let round = 0;

function countFreq(arr) {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function analyzeLeast(major, secondary) {
  const freqM = countFreq(major);
  const freqS = countFreq(secondary);
  const diversityM = Object.keys(freqM).length;
  const diversityS = Object.keys(freqS).length;

  let base = (diversityM <= diversityS) ? major : secondary;
  let comp = (base === major) ? secondary : major;

  const freq = countFreq(base);
  const sorted = Object.entries(freq).sort((a, b) => a[1] - b[1]);
  if (sorted.length === 0) return '-';
  const least = sorted[0][0];

  const index = base.indexOf(least);
  if (index === -1 || !comp[index]) return '-';
  return (comp[index] === least) ? 'P' : 'B';
}

function analyzeMost(major, secondary) {
  const freqM = countFreq(major);
  const freqS = countFreq(secondary);
  const diversityM = Object.keys(freqM).length;
  const diversityS = Object.keys(freqS).length;

  let base = (diversityM <= diversityS) ? major : secondary;
  let comp = (base === major) ? secondary : major;

  const freq = countFreq(base);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  if (sorted.length < 1) return '-';

  // pick a top value with count>=2 if exists, else fallback to next
  let topVal = sorted[0][0];
  for (let [val, cnt] of sorted) {
    if (cnt >= 2) { topVal = val; break; }
  }
  // collect positions with that value; if still <2, add next value
  let positions = base.map((v, idx) => v === topVal ? idx : -1).filter(i => i !== -1);
  if (positions.length < 2 && sorted.length > 1) {
    const secondVal = sorted.find(x => x[0] !== topVal)[0];
    positions = positions.concat(base.map((v, idx) => v === secondVal ? idx : -1).filter(i => i !== -1));
  }
  if (positions.length < 2) return '-';
  const [i1, i2] = positions.slice(0,2);

  const val1 = comp[i1];
  const val2 = comp[i2];
  return (val1 === val2) ? 'P' : 'B';
}

function buildTraceTable(combo) {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const val = combo[i];
    const group = (i < 3) ? 'หลัก' : 'รอง';
    const pos = (i % 3) + 1;
    rows.push(`<tr><td>${i+1}</td><td>${val}</td><td>${group}</td><td>${pos}</td></tr>`);
  }
  return `
    <table class="trace-table">
      <thead><tr><th>ตัวที่</th><th>ค่า</th><th>ฝ่าย</th><th>ช่องที่</th></tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  `;
}

function analyze() {
  const combo = document.getElementById('comboInput').value.toUpperCase();
  if (combo.length !== 6 || /[^PB]/.test(combo)) {
    alert("กรุณาใส่เค้าไพ่ 6 ตัว (P หรือ B เท่านั้น) เช่น PBBPBP");
    return;
  }
  const major = combo.slice(0, 3).split('');
  const secondary = combo.slice(3).split('');

  const least = analyzeLeast(major, secondary);
  const most = analyzeMost(major, secondary);

  document.getElementById('leastResult').innerText = least;
  document.getElementById('mostResult').innerText = most;

  localStorage.setItem('currentLeast', least);
  localStorage.setItem('currentMost', most);

  // build trace table
  document.getElementById('traceTable').innerHTML = buildTraceTable(combo);
}

function recordResult(actual) {
  round++;
  if (round === 1) return;

  const least = localStorage.getItem('currentLeast');
  const most = localStorage.getItem('currentMost');

  dnaLeast.push((least === actual) ? '⚪️' : (actual === 'T' ? '✕' : '🔴'));
  dnaMost.push((most === actual) ? '⚪️' : (actual === 'T' ? '✕' : '🔴'));

  document.getElementById('leastDNA').innerText = dnaLeast.join('');
  document.getElementById('mostDNA').innerText = dnaMost.join('');

  document.getElementById('comboInput').value = '';
}

function resetDNA() {
  dnaLeast = [];
  dnaMost = [];
  round = 0;
  document.getElementById('leastDNA').innerText = '';
  document.getElementById('mostDNA').innerText = '';
  document.getElementById('traceTable').innerHTML = '— ยังไม่มีข้อมูล —';
}
