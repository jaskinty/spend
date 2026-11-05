let period = localStorage.getItem('period') || 'daily';

function setPeriod(p) {
  period = p;
  localStorage.setItem('period', p);
  renderMain();
}

function renderMain() {
  load();
  const mult = periods[period].mult;
  const sorted = [...exps].sort((a, b) => getCpd(b) - getCpd(a));
  const maxCpd = Math.max(0.01, ...sorted.map(getCpd));
  const totalDaily = exps.reduce((s, e) => s + getCpd(e), 0);
  const total = totalDaily * mult;
  const catMap = {};
  exps.forEach(e => { catMap[e.categoryId] = (catMap[e.categoryId] || 0) + getCpd(e); });
  const catList = Object.entries(catMap).map(([id, tot]) => ({...getCat(+id), total: tot * mult})).filter(Boolean).sort((a, b) => b.total - a.total);

  // periods radios
  document.querySelectorAll('#periods input').forEach(input => {
    input.checked = input.value === period;
    input.onchange = () => setPeriod(input.value);
  });

  // bars
  const bars = document.getElementById('bars');
  bars.innerHTML = '';
  sorted.forEach(e => {
    const cpd = getCpd(e);
    const w = (cpd / maxCpd) * 100;
    const col = getCat(e.categoryId)?.color || '#ccc';
    const div = document.createElement('div');
    div.className = 'bar-container';
    div.innerHTML = `
      <div class="cpd">${fmt(cpd * mult)}</div>
      <div class="bar-and-desc">
        <div class="bar" style="width:${w}%;background:${col}"></div>
        <div class="desc">${e.description}</div>
      </div>`;
    bars.appendChild(div);
  });

  // consumption
  document.getElementById('consumption-label').textContent = `${periods[period].label} Consumption`;
  document.getElementById('total').textContent = fmt(total);

  // ring
  document.getElementById('ring').innerHTML = renderRing(catList, total);

  // legend
  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  catList.forEach(c => {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = `
      <div class="swatch" style="background:${c.color}"></div>
      <div class="col">
        <div>${c.title}</div>
        <div>${fmt(c.total)}</div>
      </div>`;
    legend.appendChild(row);
  });
}

renderMain();