
let apostasSelecionadas = [];
let totalOdds = 0;
let jogosPorDia = {};

fetch("jogos.json")
  .then(res => res.json())
  .then(data => {
    const dias = {};
    data.forEach(jogo => {
      if (!dias[jogo.dia]) dias[jogo.dia] = [];
      dias[jogo.dia].push(jogo);
    });
    jogosPorDia = dias;
    filtrarPorDia('Hoje'); // carregar jogos de hoje inicialmente
  });

function filtrarPorDia(dia) {
    const container = document.getElementById("jogos-container");
    const titulo = document.getElementById("titulo-dia");
    container.innerHTML = "";
    titulo.textContent = `Jogos de ${dia}`;
    const jogos = jogosPorDia[dia] || [];
    jogos.forEach(jogo => {
        const bloco = document.createElement("div");
        bloco.className = "jogo-bloco";
        bloco.innerHTML = `
            <strong>${jogo.time1} x ${jogo.time2}</strong><br>
            Horário: ${jogo.horario}<br>
            <div class="odds-linha">
                <button onclick="selecionarJogo('${jogo.id}_1', ${jogo.odd1})">${jogo.time1} (${jogo.odd1})</button>
                <button onclick="selecionarJogo('${jogo.id}_X', ${jogo.oddX})">Empate (${jogo.oddX})</button>
                <button onclick="selecionarJogo('${jogo.id}_2', ${jogo.odd2})">${jogo.time2} (${jogo.odd2})</button>
            </div>
            <button onclick="toggleMercados(this)">Mais Mercados</button>
            <div class="mercados-extras" style="display: none;">
                <p><strong>Dupla Chance:</strong></p>
                <button onclick="selecionarJogo('${jogo.id}_1X', ${jogo.dupla1X})">1X (${jogo.dupla1X})</button>
                <button onclick="selecionarJogo('${jogo.id}_12', ${jogo.dupla12})">12 (${jogo.dupla12})</button>
                <button onclick="selecionarJogo('${jogo.id}_X2', ${jogo.duplaX2})">X2 (${jogo.duplaX2})</button>
                <p><strong>Gols:</strong></p>
                <button onclick="selecionarJogo('${jogo.id}_g1.5', ${jogo.gol15})">+1.5 Gols (${jogo.gol15})</button>
                <button onclick="selecionarJogo('${jogo.id}_g2.5', ${jogo.gol25})">+2.5 Gols (${jogo.gol25})</button>
                <p><strong>Escanteios:</strong></p>
                <button onclick="selecionarJogo('${jogo.id}_esc7.5', ${jogo.escanteio75})">+7.5 (${jogo.escanteio75})</button>
            </div>
        `;
        container.appendChild(bloco);
    });
}

function selecionarJogo(id, odd) {
  if (apostasSelecionadas.includes(id)) return alert("Jogo já selecionado!");
  if (apostasSelecionadas.length >= 20) return alert("Máximo de 20 jogos!");
  apostasSelecionadas.push(id);
  totalOdds = apostasSelecionadas.reduce((total, _, i) => total * (i === 0 ? odd : 1.5), 1);
  document.getElementById("total-odds").textContent = totalOdds.toFixed(2);
  atualizarRetorno();
}

function atualizarRetorno() {
  const valor = parseFloat(document.getElementById("valor-aposta").value || 0);
  document.getElementById("retorno").textContent = (valor * totalOdds).toFixed(2);
}

function irParaPagamento() {
  alert("Aposta finalizada (simulação).");
}

function toggleMercados(btn) {
  const div = btn.nextElementSibling;
  div.style.display = div.style.display === "none" ? "block" : "none";
}
