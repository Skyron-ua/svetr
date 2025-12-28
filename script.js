/* ========== CONFIG ========== */
const CONFIG = {
  PRICE: 999,
  PRODUCT_NAME: "Чоловічий светр на блискавці",
  CONTACT: {
    TG_USERNAME: "Skyron_ua",
    VIBER_INVITE: "https://invite.viber.com/?g2=AQBeex4BIEUJJlW4bdj1yeAO7w846m1dQ6AzkdYO2N%2Bt6FAv7rl5TWDkjrKKKt7t",
    SUPPORT_PHONE: "+380733337278"
  },
  COLORS: [
    { id: "graphite", name: "Графіт", hex: "#616267", images: ["img/3.png","img/4.png"], price: 999 },
    { id: "black", name: "Чорний", hex: "#111113ff", images: ["img/1.png","img/2.png"], price: 999 },
    { id: "beige", name: "Беж", hex: "#d6c7b1", images: ["img/5.png","img/6.png"], price: 999 },
    { id: "gray", name: "Сірий", hex: "#a5aaa1dc", images: ["img/7.png","img/8.png"], price: 999 }
  ],
  DELIVERY_TEXT: "Доставка: Нова Пошта, 1–3 дні"
};

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const encode = s => encodeURIComponent(s);

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  if ($("#priceValue")) $("#priceValue").textContent = `${CONFIG.PRICE} грн`;
  if ($("#supportPhone")) {
    $("#supportPhone").textContent = CONFIG.CONTACT.SUPPORT_PHONE.replace(/^(\+?)/, '+');
    $("#supportPhone").href = `tel:${CONFIG.CONTACT.SUPPORT_PHONE}`;
  }

  const swatches = $("#swatches");
  const catalogGrid = $("#catalogGrid");
  const colorSelect = $("#colorSelect");

  // build swatches / catalog / select
  CONFIG.COLORS.forEach((c, i) => {
    // swatch
    const sw = document.createElement("button");
    sw.className = "swatch";
    sw.style.background = c.hex;
    sw.dataset.id = c.id;
    sw.title = c.name;
    if (i === 0) sw.classList.add("active");
    swatches && swatches.appendChild(sw);

    // catalog card
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${c.images[0]}" alt="${c.name}">
      <div class="meta">
        <div class="name">${CONFIG.PRODUCT_NAME}</div>
        <div class="price">${c.price} грн</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:var(--muted);font-size:13px">${c.name}</div>
        <button class="btn btn-small btn-primary" data-color="${c.id}">Вибрати</button>
      </div>
    `;
    catalogGrid && catalogGrid.appendChild(card);

    // select option
    if (colorSelect) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      colorSelect.appendChild(opt);
    }
  });

  setupSwatches();
  bindCatalogButtons();
  selectColor(CONFIG.COLORS[0].id);
  setupForm();
  startCountdown(60 * 59);

  // footer links
  if ($("#tgLink")) $("#tgLink").href = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}`;
  if ($("#viberLink")) $("#viberLink").href = CONFIG.CONTACT.VIBER_INVITE;

  // consultation buttons: open CLEAN chat / invite link + track Contact
  $("#btnConsultTG")?.addEventListener("click", () => {
    try { ttq.track('Contact'); } catch(e){}
    const url = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}`;
    window.open(url, "_blank");
  });

  $("#btnConsultViber")?.addEventListener("click", () => {
    try { ttq.track('Contact'); } catch(e){}
    window.open(CONFIG.CONTACT.VIBER_INVITE, "_blank");
  });

  // quick order button
  $("#btnQuickOrder")?.addEventListener("click", () => {
    try { ttq.track('Contact'); } catch(e){}
    const text = encode("Хочу замовити");
    const url = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}?text=${text}`;
    window.open(url, "_blank");
  });

  // hero and nav buttons tracking
  $('.hero-cta .btn-primary')?.addEventListener('click', () => { try { ttq.track('ClickButton'); } catch(e){} });
  $('#btnPreview')?.addEventListener('click', () => { try { ttq.track('ClickButton'); } catch(e){} });
  $('.nav .btn-small')?.addEventListener('click', () => { try { ttq.track('ClickButton'); } catch(e){} });
});

/* ---------- color & carousel ---------- */
let activeImages = [];
let currentIndex = 0;

function selectColor(id) {
  const color = CONFIG.COLORS.find(c => c.id === id);
  if (!color) return;

  $$(".swatch").forEach(s => s.classList.toggle("active", s.dataset.id === id));

  activeImages = Array.isArray(color.images) && color.images.length ? color.images.slice() : ["images/placeholder_1080x1350.jpg"];
  currentIndex = 0;
  updateMainImage();

  if ($("#summaryColor")) $("#summaryColor").textContent = color.name;
  if ($("#priceValue")) $("#priceValue").textContent = `${color.price} грн`;
  if ($("#colorSelect")) $("#colorSelect").value = id;

  updateCarouselUI();
  updateSummary();
}

function updateMainImage() {
  const main = $("#mainImage");
  if (!main) return;
  main.src = activeImages[currentIndex];
  const color = CONFIG.COLORS.find(c => c.images && c.images.includes(activeImages[currentIndex]));
  main.alt = color ? color.name : CONFIG.PRODUCT_NAME;
  updateCarouselCounter();
}

function updateCarouselUI() {
  const controls = $("#carouselControls");
  const counter = $("#carouselCounter");
  if (!activeImages || activeImages.length <= 1) {
    if (controls) controls.style.display = "none";
    if (counter) counter.style.display = "none";
  } else {
    if (controls) controls.style.display = "flex";
    if (counter) counter.style.display = "block";
  }
  updateCarouselCounter();
}

function updateCarouselCounter(){
  const counter = $("#carouselCounter");
  if(!counter) return;
  counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
}

document.getElementById("nextImg")?.addEventListener("click", () => {
  if (!activeImages || activeImages.length === 0) return;
  currentIndex = (currentIndex + 1) % activeImages.length;
  updateMainImage();
});
document.getElementById("prevImg")?.addEventListener("click", () => {
  if (!activeImages || activeImages.length === 0) return;
  currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
  updateMainImage();
});

function setupSwatches() {
  $$(".swatch").forEach(s => {
    s.addEventListener("click", () => {
      try { ttq.track('ClickButton'); } catch(e){}
      selectColor(s.dataset.id);
    });
  });
}

function bindCatalogButtons() {
  $$("#catalogGrid .btn-primary").forEach(btn => {
    btn.addEventListener("click", () => {
      try { ttq.track('ClickButton'); } catch(e){}
      selectColor(btn.dataset.color);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---------- form ---------- */
function setupForm() {
  const form = $("#orderForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = gatherForm();
    if (!data) return;

    const lines = [
      `Замовлення: ${CONFIG.PRODUCT_NAME}`,
      `Колір: ${data.colorName}`,
      `Зріст: ${data.height} см`,
      `Вага: ${data.weight} кг`,
      `Кількість: ${data.qty}`,
      CONFIG.DELIVERY_TEXT
    ];
    const text = encode(lines.join("\n"));
    const tgUrl = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}?text=${text}`;

    // Track Lead BEFORE opening Telegram
    try {
      ttq.track('Lead', { value: CONFIG.PRICE * data.qty, currency: 'UAH' });
    } catch (err) { console.warn('ttq.track error', err); }

    window.open(tgUrl, "_blank");

    const res = $("#formResult");
    if (res) {
      res.textContent = "Заявка підготовлена — відкриваємо Telegram. Підтвердіть відправку у вікні Telegram.";
      setTimeout(() => res.textContent = "", 7000);
    }
  });

  // live update summary
  const height = $("#height");
  const weight = $("#weight");
  const qty = $("#qty");
  const colorSelect = $("#colorSelect");

  [height, weight, qty, colorSelect].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  });
}

function gatherForm() {
  const height = ($("#height") && $("#height").value.trim()) || "";
  const weight = ($("#weight") && $("#weight").value.trim()) || "";
  const qty = Number($("#qty") && $("#qty").value) || 1;
  const colorId = ($("#colorSelect") && $("#colorSelect").value) || "";

  if (!height || !weight || !colorId) {
    alert("Будь ласка, заповніть усі обов'язкові поля.");
    return null;
  }

  const color = CONFIG.COLORS.find(c => c.id === colorId) || { name: "—" };
  return { height, weight, qty, colorName: color.name };
}

function updateSummary() {
  const qty = Number($("#qty") && $("#qty").value) || 1;
  const height = ($("#height") && $("#height").value) || "—";
  const weight = ($("#weight") && $("#weight").value) || "—";
  const colorName = ($("#colorSelect") && $("#colorSelect").selectedOptions[0] && $("#colorSelect").selectedOptions[0].textContent) || "—";

  $("#summaryHeight") && ($("#summaryHeight").textContent = height);
  $("#summaryWeight") && ($("#summaryWeight").textContent = weight);
  $("#summaryColor") && ($("#summaryColor").textContent = colorName);
  $("#summaryTotal") && ($("#summaryTotal").textContent = `${CONFIG.PRICE * qty} грн`);
}

/* ---------- timer ---------- */
function startCountdown(seconds) {
  const el = $("#timer");
  if (!el) return;
  let s = Number(seconds) || 0;

  function tick() {
    if (s <= 0) {
      el.textContent = "00:00:00";
      return;
    }
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = `${hh}:${mm}:${ss}`;
    s = s - 1;
  }

  tick();
  const id = setInterval(() => {
    if (s <= 0) {
      clearInterval(id);
      tick();
    } else {
      tick();
    }
  }, 1000);
}