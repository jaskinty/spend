function renderCats() {
  load();
  const list = document.getElementById('list');
  list.innerHTML = '';
  cats.forEach(c => {
    const div = document.createElement('div');
    div.className = 'item-row';
    div.onclick = () => location.href = `catform.html?id=${c.id}`;
    div.innerHTML = `
      <div class="circle" style="width:24px;height:24px;background:${c.color}"></div>
      <div class="col">
        <div style="font-weight:700">${c.title}</div>
      </div>`;
    list.appendChild(div);
  });
}

renderCats();