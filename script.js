document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("trackingInput");
    const trackButton = document.getElementById("trackButton");
    const downloadButton = document.getElementById("DownloadButton");

    // Cria container de resultados
    const resultadoDiv = document.createElement("div");
    resultadoDiv.style.marginTop = "20px";
    resultadoDiv.style.color = "#000";
    document.querySelector(".rastreioPPN").appendChild(resultadoDiv);

    // Função para rastrear objetos
    async function rastrearObjetos() {
        const codigos = input.value.trim();

        if (!codigos) {
            resultadoDiv.innerHTML = `<p style="color: #000000;">⚠️ Digite ao menos um código de rastreio.</p>`;
            return;
        }

        try {
            resultadoDiv.innerHTML = `<p style="color: #000000;">🔄 Buscando dados...</p>`;

            const response = await fetch(`https://backend-ppn.onrender.com/rastrear?codigos=${encodeURIComponent(codigos)}`);
            const dados = await response.json();

            if (!Array.isArray(dados)) {
                resultadoDiv.innerHTML = "<p>❌ Erro ao buscar os dados. Tente novamente.</p>";
                return;
            }

            resultadoDiv.innerHTML = dados.map(item => {
                if (item.success) {
                    const obj = item.data.itens?.[0] || {};
                    const codigo = obj.codigoObjeto || item.codigo;
                    const cliente = obj.remetente?.nome || "Desconhecido";
                    const dataHora = obj.dataHoraPreAfericao || "N/A";
                    const peso = obj.pesoPreAfericao || "N/A";
                    const altura = obj.alturaPreAfericao || "N/A";
                    const largura = obj.larguraPreAfericao || "N/A";
                    const comprimento = obj.comprimentoPreAfericao || "N/A";
                    const cepDestino = obj.cepDestinoPreAfericao || "N/A";

                    return `
                        <div style="color: #000000; margin-bottom:10px; padding:10px; border:1px solid #fff; border-radius:5px; background-color:#ffffff;">
                            <strong>Rastreio:</strong> ${codigo}<br>
                            <strong>Cliente:</strong> ${cliente}<br>
                            <strong>Data Aferição:</strong> ${dataHora}<br>
                            <strong>Peso:</strong> ${peso}g<br>
                            <strong>Altura:</strong> ${altura}cm<br>
                            <strong>Largura:</strong> ${largura}cm<br>
                            <strong>Comprimento:</strong> ${comprimento}cm<br>
                            <strong>CEP Destino:</strong> ${cepDestino}
                        </div>
                    `;
                } else {
                    return `
                        <div style="color: #000000; margin-bottom:10px; padding:10px; border:1px solid #fff; border-radius:5px; background-color: #ffffff;">
                            <strong>Rastreio:</strong> ${item.codigo}<br>
                            <strong>Erro:</strong> ${item.error}
                        </div>
                    `;
                }
            }).join("");

        } catch (erro) {
            console.error(erro);
            resultadoDiv.innerHTML = "<p>❌ Erro de conexão com a API.</p>";
        }
    }

    // Função para baixar a planilha
    function baixarPlanilha() {
        const codigos = input.value.trim();

        if (!codigos) {
            alert("⚠️ Digite ao menos um código de rastreio antes de baixar.");
            return;
        }

        window.location.href = `https://backend-ppn.onrender.com/baixar-planilha?codigos=${encodeURIComponent(codigos)}`;
    }

    // Eventos
    trackButton.addEventListener("click", rastrearObjetos);
    downloadButton.addEventListener("click", baixarPlanilha);
});
