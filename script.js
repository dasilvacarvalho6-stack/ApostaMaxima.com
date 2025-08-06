
let apostasSelecionadas = [];
let totalOdds = 0;

fetch("jogos.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("jogos-container");
    const dias = {};

    data.forEach(jogo => {
      if (!dias[jogo.dia]) dias[jogo.dia] = [];
      dias[jogo.dia].push(jogo);
    });

    Object.keys(dias).forEach(dia => {
      const bloco = document.createElement("div");
      bloco.innerHTML = `<h2>${dia}</h2>`;

      dias[dia].forEach(jogo => {
        const linha = document.createElement("div");
        linha.innerHTML = `
          <strong>${jogo.time1} x ${jogo.time2}</strong><br>
          Horário: ${jogo.horario} <br>
          <button onclick="selecionarJogo('${jogo.id}', ${jogo.odd})">Odd: ${jogo.odd}</button>
        `;
        bloco.appendChild(linha);
      });

      container.appendChild(bloco);
    });
  });

function selecionarJogo(id, odd) {
    if (apostasSelecionadas.includes(id)) return alert("Jogo já selecionado!");
    if (apostasSelecionadas.length >= 20) return alert("Máximo de 20 jogos!");

    apostasSelecionadas.push(id);
    totalOdds = apostasSelecionadas.reduce((total, _, i) => total * (i === 0 ? odd : 1.5), 1); // odds simuladas
    document.getElementById("total-odds").textContent = totalOdds.toFixed(2);
    atualizarRetorno();
}

function atualizarRetorno() {
    const valor = parseFloat(document.getElementById("valor-aposta").value || 0);
    document.getElementById("retorno").textContent = (valor * totalOdds).toFixed(2);
}

function irParaPagamento() {
    const valor = parseFloat(document.getElementById("valor-aposta").value || 0);
    if (valor <= 0 || apostasSelecionadas.length === 0) {
        alert("Informe o valor da aposta e selecione pelo menos um jogo.");
        return;
    }
    window.location.href = `pagamento.html?valor=${valor}&odds=${totalOdds.toFixed(2)}`;
}
