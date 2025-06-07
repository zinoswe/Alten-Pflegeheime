let orte = [];
let stiftungen = [];

// Daten laden
async function ladeDaten() {
  const [orteRes, stiftungenRes] = await Promise.all([
    fetch('orte.json'),
    fetch('stiftungen.json')
  ]);
  orte = await orteRes.json();
  stiftungen = await stiftungenRes.json();
}

ladeDaten();

function sucheFoerderungen() {
  const ort = document.getElementById('ort').value.trim();
  const ergebnisBox = document.getElementById('ergebnisse');
  ergebnisBox.innerHTML = '';

  const ortEintrag = orte.find(o => o.ort.toLowerCase() === ort.toLowerCase());
  const bundesland = ortEintrag ? ortEintrag.bundesland : null;

  const lokale = ortEintrag ? stiftungen.filter(s => s.gebiet.toLowerCase() === ort.toLowerCase()) : [];
  const regionale = ortEintrag ? stiftungen.filter(s => s.gebiet === bundesland) : [];
  const bundesweit = stiftungen.filter(s => s.gebiet === 'bundesweit');

  if (!ortEintrag) {
    const hinweis = document.createElement('p');
    hinweis.className = 'highlight-box text-red-600 font-semibold';
    hinweis.innerText = 'Dieser Ort konnte nicht gefunden werden. Hier sind bundesweite Finanzierungsquellen:';
    ergebnisBox.appendChild(hinweis);
    zeigeKategorie("🌐 Bundesweite Angebote", bundesweit, ergebnisBox);
  } else {
    const info = document.createElement('p');
    info.className = 'highlight-box font-semibold';
    info.innerHTML = `Gefundene Förderungen für <strong>${ortEintrag.ort}</strong> (${bundesland}):`;
    ergebnisBox.appendChild(info);
    if (lokale.length) zeigeKategorie(`📍 Lokale Angebote (${ort})`, lokale, ergebnisBox);
    if (regionale.length) zeigeKategorie(`🏳️ Regionale Angebote (${bundesland})`, regionale, ergebnisBox);
    zeigeKategorie("🌐 Bundesweite Angebote", bundesweit, ergebnisBox);
  }
}

function zeigeKategorie(titel, eintraege, container) {
  const farben = {
    "Staatliche Förderung": "bg-green-100",
    "Soziallotterie": "bg-yellow-100",
    "Stiftung": "bg-blue-100"
  };

  const block = document.createElement('div');
  const titelBox = document.createElement('h2');
  titelBox.className = "text-xl font-bold highlight-box";
  titelBox.textContent = titel;
  block.appendChild(titelBox);

  eintraege.forEach(e => {
    const farbe = farben[e.typ] || 'bg-gray-100';
    const div = document.createElement('div');
    div.className = `p-4 mt-2 rounded shadow ${farbe}`;
    div.innerHTML = `
      <h3 class="font-semibold text-lg">${e.name}</h3>
      <p class="mb-2">${e.beschreibung}</p>
      ${e.links?.antrag ? `<a href="${e.links.antrag}" target="_blank" class="text-blue-700 underline">Antrag</a><br>` : ''}
      ${e.links?.richtlinien ? `<a href="${e.links.richtlinien}" target="_blank" class="text-blue-700 underline">Förderrichtlinien</a>` : ''}
    `;
    block.appendChild(div);
  });
  container.appendChild(block);
}
