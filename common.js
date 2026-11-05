const expCSV = `description,category,cost,duration
rent,housing,237.25,30
isotretinoin tablets,supplements,116.99,30
Tesla self-driving,software,109.15,30
protein powder,calories,214.20,65.46
utilities,housing,48.66,30
extra virgin olive oil,calories,70,50
collagen powder,calories,114.75,90
canned black beans,calories,0.89,1
omega-3 softgels,supplements,23.76,30
macadamia nuts,calories,22.99,30
cocoa powder,calories,41,60
Zellie's® dental gum,toiletries,58,100
frozen banana slices,calories,3.86,6.80
2% milk,calories,5.23,9.75
YouTube Premium,software,15.99,30
astaxanthin softgels,supplements,27.95,60
Aquaphor® ointment,toiletries,12.19,30
creatine powder,supplements,40,100
phone connectivity,software,11.57,30
lycopene softgels,supplements,34.95,120
Amazon Prime,software,7.71,30
beta carotene softgels,supplements,21.99,90
minoxidil tablets,supplements,10,90
dutasteride tablets,supplements,10,90
tadalafil capsules,supplements,10,90
melatonin tablets,supplements,9.55,120
Attitude™ shampoo,toiletries,12.87,180
Attitude™ laundry detergent,toiletries,19.95,280
Dr. Bronner's® eucalyptus soap,toiletries,9.99,180
toothpaste,toiletries,9.88,180
100 gigabytes Google storage,software,19.99,365
caffeine capsules,supplements,11.95,250
vitamin D softgels,supplements,12.91,360
floss picks,toiletries,3.09,90
toilet paper,toiletries,5.68,180
fiber Wi-Fi,housing,15,30
deodorant,toiletries,6.96,240`;

const catCSV = `title,color
housing,#08f
calories,#4a4
supplements,#98e
software,#f91
toiletries,#f87
medications,#c54
transportation,#b76`;

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const vals = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = vals[i]?.trim());
    return obj;
  });
}

function initData() {
  if (localStorage.getItem('cats')) return;
  const catData = parseCSV(catCSV).map((c, i) => ({id: i + 1, title: c.title, color: c.color}));
  const catMap = Object.fromEntries(catData.map(c => [c.title, c.id]));
  const expData = parseCSV(expCSV).map((e, i) => ({
    id: i + 1,
    description: e.description,
    categoryId: catMap[e.category] || 1,
    cost: parseFloat(e.cost),
    duration: parseFloat(e.duration)
  }));
  localStorage.setItem('cats', JSON.stringify(catData));
  localStorage.setItem('exps', JSON.stringify(expData));
}

let cats = [], exps = [];
function load() {
  cats = JSON.parse(localStorage.getItem('cats') || '[]');
  exps = JSON.parse(localStorage.getItem('exps') || '[]');
}
function save() {
  localStorage.setItem('cats', JSON.stringify(cats));
  localStorage.setItem('exps', JSON.stringify(exps));
}
function getCpd(e) { return e.cost / e.duration; }
function getCat(id) { return cats.find(c => c.id === id); }
function fmt(n) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

const periods = {
  daily: {label: 'Daily', mult: 1},
  weekly: {label: 'Weekly', mult: 7},
  biweekly: {label: 'Biweekly', mult: 14},
  monthly: {label: 'Monthly', mult: 30},
  annual: {label: 'Annual', mult: 365}
};

function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function renderRing(catList, total) {
  if (!total) return '';
  const cx = 50, cy = 50, ro = 50, ri = 25;
  let svg = '<svg viewBox="0 0 100 100">';
  let ang = 0;
  catList.forEach(c => {
    const sweep = (c.total / total) * 360;
    const end = ang + sweep;
    const [x1, y1] = polar(cx, cy, ro, ang);
    const [x2, y2] = polar(cx, cy, ro, end);
    const [x3, y3] = polar(cx, cy, ri, end);
    const [x4, y4] = polar(cx, cy, ri, ang);
    const large = sweep > 180 ? 1 : 0;
    const d = `M${x1},${y1} A${ro},${ro} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${large} 0 ${x4},${y4}Z`;
    svg += `<path d="${d}" fill="${c.color}"/>`;
    ang = end;
  });
  ang = 0;
  catList.forEach(c => {
    const [lx1, ly1] = polar(cx, cy, ri - 1, ang);
    const [lx2, ly2] = polar(cx, cy, ro + 1, ang);
    svg += `<line x1="${lx1}" y1="${ly1}" x2="${lx2}" y2="${ly2}" stroke="#fff" stroke-width="2"/>`;
    ang += (c.total / total) * 360;
  });
  svg += '</svg>';
  return svg;
}

initData();
load();
