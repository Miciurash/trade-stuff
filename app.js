const STORAGE_KEY = 'tradeStuffListings';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function save(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

function render(filter = '') {
  const board = document.getElementById('board');
  const empty = document.getElementById('empty');
  const q = filter.toLowerCase().trim();
  const list = load().filter(t =>
    !q || t.have.toLowerCase().includes(q) || t.want.toLowerCase().includes(q) || (t.location || '').toLowerCase().includes(q)
  ).reverse();
  board.innerHTML = '';
  empty.style.display = list.length ? 'none' : 'block';
  list.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="have">${esc(t.have)}</div>
      <div class="arrow">&#8594;</div>
      <div class="want">${esc(t.want)}</div>
      <div class="meta">
        <span>${esc(t.name || 'Anonymous')}${t.location ? ' · ' + esc(t.location) : ''}</span>
        <button class="delete" data-i="${i}">remove</button>
      </div>`;
    board.appendChild(card);
  });
  board.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', () => {
      const arr = load();
      arr.splice(arr.length - 1 - Number(btn.dataset.i), 1);
      save(arr);
      render(document.getElementById('search').value);
    })
  );
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

document.getElementById('tradeForm').addEventListener('submit', e => {
  e.preventDefault();
  const have = document.getElementById('have').value.trim();
  const want = document.getElementById('want').value.trim();
  if (!have || !want) return;
  const list = load();
  list.push({
    have,
    want,
    name: document.getElementById('name').value.trim(),
    location: document.getElementById('location').value.trim(),
    at: Date.now()
  });
  save(list);
  e.target.reset();
  render(document.getElementById('search').value);
});

document.getElementById('search').addEventListener('input', e => render(e.target.value));
render();