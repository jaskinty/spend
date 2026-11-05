function renderEditList() {
  load();
  const sorted = [...exps].sort((a, b) => getCpd(b) - getCpd(a));
  const maxCpd = Math.max(0.01, ...exps.map(getCpd));
  const list = document.getElementById('list');
  list.innerHTML = '';
  sorted.forEach(e => {
    const cpd = getCpd(e);
    const sz = 4 + (cpd / maxCpd) * 36;
    const col = getCat(e.categoryId)?.color || '#ccc';
    const div = document.createElement('div');
    div.className = 'item-row';
    div.onclick = () => location.href = `form.html?id=${e.id}`;
    div.innerHTML = `
      <div style="width: 40px; display: flex; justify-content: right;">
      <div class="circle" style="width:${sz}px;height:${sz}px;background:${col};"></div>
      </div>
      <div class="col">
        <div style="font-weight:700">${e.description}</div>
        <div>${fmt(e.cost)} every ${e.duration.toFixed(2)} days</div>
      </div>`;
    list.appendChild(div);
  });
}

renderEditList();