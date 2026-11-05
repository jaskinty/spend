function renderCatForm() {
  load();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') ? +params.get('id') : null;
  const c = id ? cats.find(x => x.id === id) : {title:'', color:'#888'};

  document.getElementById('form-title').textContent = id ? 'Edit Category' : 'New Category';
  const form = document.getElementById('cat-form');
  form.title.value = c.title;
  form.color.value = c.color;

  const delBtn = document.getElementById('delete-btn');
  if (id) {
    delBtn.style.display = '';
    delBtn.onclick = () => delCat(id);
  } else {
    delBtn.style.display = 'none';
  }

  form.onsubmit = (ev) => saveCat(ev, id);
}

function saveCat(ev, id) {
  ev.preventDefault();
  const f = ev.target;
  const data = {title: f.title.value, color: f.color.value};
  if (id) {
    Object.assign(cats.find(c => c.id === id), data);
  } else {
    data.id = Date.now();
    cats.push(data);
  }
  save();
  location.href = 'cats.html';
}
function delCat(id) {
  cats = cats.filter(c => c.id !== id);
  save();
  location.href = 'cats.html';
}

renderCatForm();