// MIDWAYZZ — Perfect offline HTML/CSS/JS system
const OWNER = { name: 'LALET', display: 'Boss', phones: ['+254724821096', '+254726954750'], local: ['0724821096','0726954750'] };
const ADMIN_PASS = 'midwayzzadmin';

// LocalStorage keys
const LS_MENU = 'midwayzz_menu_v2';
const LS_ROOMS = 'midwayzz_rooms_v2';
const LS_BOOKINGS = 'midwayzz_bookings_v2';
const LS_AUTH = 'midwayzz_admin_auth_v2';
const LS_LANG = 'midwayzz_lang_v2';

// Translations (English and Kiswahili)
const TRANS = {
  en: {
    heroSub: 'Opposite SHEBA CLUB — Bomet Town. Restaurant, grill, and rooms available. Visitors from outside Kenya welcome.',
    bookNow: 'Confirm Booking',
    menuTitle: 'Menu — All meals available',
    roomsTitle: 'Rooms & Rates'
  },
  sw: {
    heroSub: 'Kinyume na SHEBA CLUB — Mji wa Bomet. Mgahawa, grill, na chumba zinapatikana. Wageni kutoka nje ya Kenya wameruhusiwa.',
    bookNow: 'Thibitisha Kyleo',
    menuTitle: 'Menu — Vyakula vyote vinapatikana',
    roomsTitle: 'Vyumba & Viwango'
  }
}

// Utility helpers
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function save(key, v){ localStorage.setItem(key, JSON.stringify(v)); }
function load(key, def){ try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; } catch(e){ return def; } }
function csvEscape(v){ return '\"' + String(v).replace(/\"/g,'\"\"') + '\"'; }

// Seed initial data
function seedIfEmpty(){
  if(!load(LS_MENU, null)){
    save(LS_MENU, [
      {id:uid(), name:'Full Kenyan Breakfast (eggs, mandazi, tea/coffee)', category:'Breakfast', price:500},
      {id:uid(), name:'Nyama Choma Plate', category:'Lunch', price:900},
      {id:uid(), name:'Grilled Fish with Veggies', category:'Dinner', price:1100},
      {id:uid(), name:'Chicken Alfredo Pasta', category:'Dinner', price:950},
      {id:uid(), name:'Samosas (3 pcs)', category:'Snacks', price:150},
      {id:uid(), name:'Fresh Juice', category:'Drinks', price:200},
      {id:uid(), name:'Mandazi / Cake', category:'Dessert', price:250}
    ]);
  }
  if(!load(LS_ROOMS, null)){
    save(LS_ROOMS, [
      {id:uid(), name:'Single Room', capacity:1, price:1800, count:3},
      {id:uid(), name:'Double Room', capacity:2, price:3000, count:4},
      {id:uid(), name:'Family Room', capacity:4, price:5000, count:2}
    ]);
  }
  if(!load(LS_BOOKINGS, null)){
    save(LS_BOOKINGS, []);
  }
}

seedIfEmpty();

// Navigation & language
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const langEnBtn = document.getElementById('lang-en');
const langSwBtn = document.getElementById('lang-sw');
const waTop = document.getElementById('wa-top');
const waHero = document.getElementById('wa-hero');
const waFloat = document.getElementById('wa-float');
const waBookBtn = document.getElementById('btn-wa-book');

function setLang(l){
  save(LS_LANG, l);
  document.getElementById('hero-sub').textContent = TRANS[l].heroSub;
  document.getElementById('book')?.querySelector('button[type=submit]')?.textContent = TRANS[l].bookNow;
  langEnBtn.classList.toggle('active', l==='en');
  langSwBtn.classList.toggle('active', l==='sw');
}
const curLang = load(LS_LANG, 'en');
setLang(curLang);

langEnBtn.addEventListener('click', ()=>setLang('en'));
langSwBtn.addEventListener('click', ()=>setLang('sw'));

// WhatsApp links
function waLink(num, text){ return `https://wa.me/${String(num).replace(/^\+/, '')}?text=${encodeURIComponent(text)}`; }
waTop.href = waLink(OWNER.phones[0], 'Hello Boss, I need assistance with MIDWAYZZ.');
waHero.href = waTop.href;
waFloat.href = waTop.href;
document.getElementById('btn-wa-book').addEventListener('click', ()=>{ window.open(waTop.href, '_blank'); });

// Navigation handling
navButtons.forEach(b=>b.addEventListener('click', ()=>{
  navButtons.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const view = b.getAttribute('data-nav');
  pages.forEach(p=>p.classList.add('hidden'));
  document.getElementById(view).classList.remove('hidden');
  if(view === 'menu'){ renderMenuGrid(); }
  if(view === 'rooms'){ renderRoomsGrid(); }
}));

// Menu render
const menuGrid = document.getElementById('menu-grid');
function renderMenuGrid(){
  const items = load(LS_MENU, []);
  menuGrid.innerHTML = '';
  items.forEach(it=>{
    const el = document.createElement('div'); el.className = 'menu-item card';
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><strong>${it.name}</strong><div class="muted">KES ${it.price}</div></div><div class="muted">${it.category}</div>`;
    menuGrid.appendChild(el);
  });
}

// Rooms render
const roomsGrid = document.getElementById('rooms-grid');
const bkRoomSelect = document.getElementById('bk-room');
function renderRoomsGrid(){
  const rooms = load(LS_ROOMS, []);
  roomsGrid.innerHTML = '';
  bkRoomSelect.innerHTML = '';
  rooms.forEach(r=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<h4>${r.name}</h4><div class="muted">Capacity: ${r.capacity} • KES ${r.price} • x${r.count}</div><div style="margin-top:8px"><button class="btn" onclick="quickBook('${r.id}')">Book this</button></div>`;
    roomsGrid.appendChild(el);
    const opt = document.createElement('option'); opt.value = r.id; opt.textContent = `${r.name} — KES ${r.price} (x${r.count})`; bkRoomSelect.appendChild(opt);
  });
}
function quickBook(roomId){ document.querySelector('.nav-btn[data-nav="book"]').click(); bkRoomSelect.value = roomId; window.scrollTo({top:0,behavior:'smooth'}); }

// Booking form
const bookingForm = document.getElementById('booking-form');
const bookingResult = document.getElementById('booking-result');
bookingForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('bk-name').value.trim();
  const phone = document.getElementById('bk-phone').value.trim();
  const roomId = document.getElementById('bk-room').value;
  const checkIn = document.getElementById('bk-checkin').value;
  const nights = parseInt(document.getElementById('bk-nights').value,10) || 1;
  if(!name||!phone||!roomId||!checkIn){ bookingResult.textContent = 'Please fill all fields'; return; }
  const rooms = load(LS_ROOMS, []);
  const room = rooms.find(r=>r.id===roomId);
  if(!room){ bookingResult.textContent = 'Room not found'; return; }
  const bookings = load(LS_BOOKINGS, []);
  const used = bookings.filter(b=>b.roomId===roomId && b.status==='booked').length;
  if(used >= room.count){ bookingResult.textContent = 'No rooms available'; return; }
  const newB = { id: uid(), name, phone, roomId, checkIn, nights, createdAt: new Date().toISOString(), status:'booked' };
  bookings.push(newB); save(LS_BOOKINGS, bookings);
  bookingForm.reset(); renderBookingsTable(); renderRoomsGrid();
  bookingResult.textContent = 'Booked — Ref: ' + newB.id;
});

// Admin login & area
const adminLoginForm = document.getElementById('admin-login');
const adminPassInput = document.getElementById('admin-pass');
const adminArea = document.getElementById('admin-area');
const adminLoginCard = document.getElementById('admin-login-card');
const btnLogout = document.getElementById('btn-logout');
const tblBookings = document.getElementById('tbl-bookings');
const roomsListDiv = document.getElementById('rooms-list');
const roomForm = document.getElementById('room-form');
const menuForm = document.getElementById('menu-form');
const menuAdminList = document.getElementById('menu-admin-list');
const btnExport = document.getElementById('btn-export');

function isAdmin(){ return load(LS_AUTH, false) === true; }
function setAdmin(v){ save(LS_AUTH, !!v); }
adminLoginForm.addEventListener('submit',(e)=>{ e.preventDefault(); if(adminPassInput.value === ADMIN_PASS){ setAdmin(true); adminPassInput.value=''; showAdminArea(); } else alert('Invalid password'); });
btnLogout.addEventListener('click', ()=>{ setAdmin(false); showAdminArea(); });

function showAdminArea(){ if(isAdmin()){ adminArea.classList.remove('hidden'); adminLoginCard.classList.add('hidden'); renderBookingsTable(); renderRoomsAdmin(); renderMenuAdmin(); } else { adminArea.classList.add('hidden'); adminLoginCard.classList.remove('hidden'); } }
showAdminArea();

// Bookings table
function renderBookingsTable(){
  const bookings = load(LS_BOOKINGS, []);
  const rooms = load(LS_ROOMS, []);
  let html = '<tr><th>Ref</th><th>Guest</th><th>Phone</th><th>Room</th><th>Check-in</th><th>Nights</th><th>Status</th><th>Action</th></tr>';
  bookings.slice().reverse().forEach(b=>{
    const room = rooms.find(r=>r.id===b.roomId);
    html += `<tr><td>${b.id}</td><td>${b.name}</td><td>${b.phone}</td><td>${room?room.name:'-'}</td><td>${b.checkIn}</td><td>${b.nights}</td><td>${b.status}</td><td>${b.status!=='cancelled'?`<button class="btn small" onclick="adminCancel('${b.id}')">Cancel</button>`:''}<button class="btn small" onclick="printReceipt('${b.id}')" style="margin-left:6px">Print</button></td></tr>`;
  });
  tblBookings.innerHTML = html;
  window.adminCancel = function(id){ const bookings = load(LS_BOOKINGS, []); const b = bookings.find(x=>x.id===id); if(b){ b.status='cancelled'; save(LS_BOOKINGS, bookings); renderBookingsTable(); } }
}

// Rooms admin
roomForm.addEventListener('submit', (e)=>{ e.preventDefault(); const name=document.getElementById('room-name').value.trim(); const capacity=parseInt(document.getElementById('room-cap').value,10)||1; const price=parseInt(document.getElementById('room-price').value,10)||0; const count=parseInt(document.getElementById('room-count').value,10)||1; const rooms=load(LS_ROOMS,[]); rooms.push({id:uid(),name,capacity,price,count}); save(LS_ROOMS,rooms); roomForm.reset(); renderRoomsAdmin(); renderRoomsGrid(); });
function renderRoomsAdmin(){ const rooms = load(LS_ROOMS,[]); roomsListDiv.innerHTML = rooms.map(r=>`<div><strong>${r.name}</strong> — KES ${r.price} (x${r.count}) <button class="btn small" onclick="delRoom('${r.id}')">Delete</button></div>`).join('') || '<div class="muted">No rooms</div>'; window.delRoom=function(id){ let rooms=load(LS_ROOMS,[]); rooms=rooms.filter(r=>r.id!==id); save(LS_ROOMS,rooms); renderRoomsAdmin(); renderRoomsGrid(); }; }

// Menu admin
menuForm.addEventListener('submit',(e)=>{ e.preventDefault(); const name=document.getElementById('menu-name').value.trim(); const cat=document.getElementById('menu-cat').value.trim(); const price=parseInt(document.getElementById('menu-price').value,10)||0; const menu=load(LS_MENU,[]); menu.push({id:uid(),name,category:cat,price}); save(LS_MENU,menu); menuForm.reset(); renderMenuAdmin(); renderMenuGrid(); });
function renderMenuAdmin(){ const menu=load(LS_MENU,[]); menuAdminList.innerHTML = menu.map(m=>`<div><strong>${m.name}</strong> — ${m.category} — KES ${m.price} <button class="btn small" onclick="delMenu('${m.id}')">Delete</button></div>`).join('') || '<div class="muted">No menu items</div>'; window.delMenu=function(id){ let menu=load(LS_MENU,[]); menu=menu.filter(m=>m.id!==id); save(LS_MENU,menu); renderMenuAdmin(); renderMenuGrid(); }; }

// Export bookings CSV
btnExport.addEventListener('click', ()=>{
  const bookings = load(LS_BOOKINGS,[]);
  if(bookings.length===0){ alert('No bookings'); return; }
  const rooms = load(LS_ROOMS,[]);
  const headers = ['id','name','phone','room','checkIn','nights','status','createdAt'];
  const rows = bookings.map(b=>{ const room=rooms.find(r=>r.id===b.roomId); return [b.id,b.name,b.phone,(room?room.name:''),b.checkIn,b.nights,b.status,b.createdAt]; });
  let csv = headers.map(csvEscape).join(',') + '\n';
  rows.forEach(r=>{ csv += r.map(csvEscape).join(',') + '\n'; });
  const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='bookings.csv'; a.click(); URL.revokeObjectURL(url);
});

// Receipt printing and PDF suggestion
function printReceipt(bookingId){
  const bookings = load(LS_BOOKINGS,[]); const rooms = load(LS_ROOMS,[]);
  const b = bookings.find(x=>x.id===bookingId); if(!b){ alert('Booking not found'); return; }
  const room = rooms.find(r=>r.id===b.roomId) || {name:'',price:0};
  const tpl = document.getElementById('receipt-template');
  const bodyHtml = `<div><strong>Booking Ref:</strong> ${b.id}</div>
    <div class="line"><div>Guest</div><div>${b.name}</div></div>
    <div class="line"><div>Phone</div><div>${b.phone}</div></div>
    <div class="line"><div>Room</div><div>${room.name}</div></div>
    <div class="line"><div>Check-in</div><div>${b.checkIn}</div></div>
    <div class="line"><div>Nights</div><div>${b.nights}</div></div>
    <div class="line"><div>Price/night</div><div>KES ${room.price}</div></div>
    <div class="line total"><div>Total</div><div>KES ${Number(room.price)*Number(b.nights)}</div></div>
    <div style="margin-top:8px" class="muted">Created: ${new Date(b.createdAt).toLocaleString()}</div>`;
  const style = tpl.querySelector('style').outerHTML;
  const inner = tpl.innerHTML.replace('<section id="rcpt-body"></section>','<section id="rcpt-body">'+bodyHtml+'</section>');
  const doc = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${b.id}</title>${style}</head><body>${inner}</body></html>`;
  const w = window.open('','_blank','noopener');
  w.document.open(); w.document.write(doc); w.document.close();
  setTimeout(()=>{ w.focus(); w.print(); }, 300);
}

// Init views
renderMenuGrid(); renderRoomsGrid(); renderBookingsTable(); renderRoomsAdmin(); renderMenuAdmin();

// Expose some helpers globally
window.printReceipt = printReceipt;
window.quickBook = quickBook;
