
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

  const top1 = sorted[0][0];
  const top2 = (sorted.length > 1) ? sorted[1][0] : null;

  const positions = base
    .map((val, idx) => (val === top1 || val === top2) ? idx : -1)
    .filter(i => i !== -1);

  if (positions.length < 2) return '-';
  const [i1, i2] = positions;

  if (!comp[i1] || !comp[i2]) return '-';
  return (comp[i1] === comp[i2]) ? 'P' : 'B';
}

function analyze() {
  const input = document.getElementById('comboInput').value.toUpperCase();
  if (input.length !== 6) {
    alert("กรุณาใส่เค้าไพ่ 6 ตัว เช่น PBBPBP");
    return;
  }
  const major = input.slice(0, 3).split('');
  const secondary = input.slice(3).split('');

  const least = analyzeLeast(major, secondary);
  const most = analyzeMost(major, secondary);

  document.getElementById('leastResult').innerText = least;
  document.getElementById('mostResult').innerText = most;

  localStorage.setItem('currentLeast', least);
  localStorage.setItem('currentMost', most);
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
}
