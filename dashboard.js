function atualizarDashboard() {

  let total = 0;
  let alunos = 0;

  historico.forEach(r => {
    total += r.brutoTotal;
    alunos += r.curvelo.alunos + r.sete.alunos;
  });

  document.getElementById("totalMes").innerText = total.toFixed(2);
  document.getElementById("totalAlunos").innerText = alunos;

  new Chart(graficoPizza, {
    type: "pie",
    data: {
      labels: ["Curvelo", "Sete"],
      datasets: [{
        data: [
          historico.at(-1)?.curvelo.bruto || 0,
          historico.at(-1)?.sete.bruto || 0
        ]
      }]
    }
  });
}
