let veiculos = {
  curvelo: [],
  sete: []
};

function addVeiculo(tipo) {
  const container = document.getElementById(
    tipo === "curvelo" ? "veiculosCurvelo" : "veiculosSete"
  );

  const div = document.createElement("div");

  div.innerHTML = `
    <input placeholder="Nome veículo">
    <input type="number" placeholder="Diária">
    <input type="number" placeholder="Dias">
  `;

  container.appendChild(div);
}

function calcular() {
  const auxTotal =
    Number(auxDinheiro.value) + Number(auxCombustivel.value);

  const curvelo = calcularRota("curvelo");
  const sete = calcularRota("sete");

  const brutoTotal = curvelo.bruto + sete.bruto;

  const percCurvelo = curvelo.bruto / brutoTotal;
  const percSete = sete.bruto / brutoTotal;

  const auxCurvelo = auxTotal * percCurvelo;
  const auxSete = auxTotal * percSete;

  let liquidoCurvelo = curvelo.bruto - auxCurvelo - curvelo.passagem;
  let liquidoSete = sete.bruto - auxSete - sete.passagem;

  const valorAlunoCurvelo =
    liquidoCurvelo / curvelo.alunosEquivalentes;

  const valorAlunoSete =
    liquidoSete / sete.alunosEquivalentes;

  document.getElementById("resultado").innerHTML = `
    <h2>Resultado</h2>
    Curvelo: R$ ${valorAlunoCurvelo.toFixed(2)} <br>
    Sete Lagoas: R$ ${valorAlunoSete.toFixed(2)}
  `;

  gerarGrafico(curvelo.bruto, sete.bruto);
}

function calcularRota(tipo) {
  let prefixo = tipo === "curvelo" ? "curvelo" : "sete";

  const integrais = Number(document.getElementById(prefixo + "Integrais").value);
  const descQtd = Number(document.getElementById(prefixo + "DescontoQtd").value);
  const descPerc = Number(document.getElementById(prefixo + "DescontoPerc").value) / 100;

  const passagem = Number(document.getElementById(prefixo + "PassValor").value);

  let brutoVeiculos = 0;

  const container = document.getElementById(
    tipo === "curvelo" ? "veiculosCurvelo" : "veiculosSete"
  );

  container.querySelectorAll("div").forEach(div => {
    const inputs = div.querySelectorAll("input");
    const diaria = Number(inputs[1].value);
    const dias = Number(inputs[2].value);
    brutoVeiculos += diaria * dias;
  });

  const alunosEquivalentes =
    integrais + descQtd * (1 - descPerc);

  return {
    bruto: brutoVeiculos,
    passagem,
    alunosEquivalentes
  };
}

function gerarGrafico(curvelo, sete) {
  new Chart(document.getElementById("grafico"), {
    type: "pie",
    data: {
      labels: ["Curvelo", "Sete Lagoas"],
      datasets: [{
        data: [curvelo, sete]
      }]
    }
  });
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório de Rateio", 10, 10);
  doc.text(document.getElementById("resultado").innerText, 10, 20);

  doc.addPage();
  doc.text("Dashboard (Gráfico)", 10, 10);

  doc.addPage();
  doc.text("Veículos", 10, 10);

  doc.save("rateio.pdf");
}
