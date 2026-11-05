function renderForm() {
  load();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') ? +params.get('id') : null;
  const e = id ? exps.find(x => x.id === id) : {description:'', categoryId: cats[0]?.id || 1, cost:'', duration:30};

  document.getElementById('form-title').textContent = id ? 'Edit Expense' : 'New Expense';
  const form = document.getElementById('exp-form');
  form.description.value = e.description;
  form.cost.value = e.cost;
  form.duration.value = e.duration;

  const select = document.getElementById('cat-select');
  select.innerHTML = '';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.title;
    if (c.id === e.categoryId) opt.selected = true;
    select.appendChild(opt);
  });

  const delBtn = document.getElementById('delete-btn');
  if (id) {
    delBtn.style.display = '';
    delBtn.onclick = () => delExp(id);
  } else {
    delBtn.style.display = 'none';
  }

  form.onsubmit = (ev) => saveExp(ev, id);
}

function saveExp(ev, id) {
  ev.preventDefault();
  const f = ev.target;
  const data = {
    description: f.description.value,
    categoryId: +f.categoryId.value,
    cost: +f.cost.value,
    duration: +f.duration.value
  };
  if (id) {
    Object.assign(exps.find(e => e.id === id), data);
  } else {
    data.id = Date.now();
    exps.push(data);
  }
  save();
  location.href = 'edit.html';
}
function delExp(id) {
  exps = exps.filter(e => e.id !== id);
  save();
  location.href = 'edit.html';
}

renderForm();