let data = JSON.parse(localStorage.getItem('foosball'));
let teams;
if (data) {
    teams = data.teams;
    console.log(teams)
}
document.addEventListener('DOMContentLoaded', function () {
    criarJogos();
    criarTabela();
    exibirResultados();
});

function exibirResultados() {
    const results = JSON.parse(localStorage.getItem('foosball')).results;
    results.forEach((ronda) => {
        ronda.jogos.forEach((jogo, index) => {
            const golos1 = jogo.resultado.equipa1;
            const golos2 = jogo.resultado.equipa2;

            const celulaResultado1 = document.getElementById(`r${ronda.numero}j${index + 1}e1`).value = golos1;
            const celulaResultado2 = document.getElementById(`r${ronda.numero}j${index + 1}e2`).value = golos2;
        });
    });
}

function criarJogos() {
    const equipas = [...teams];
    const rondas = [];

    let numrondas = equipas.length - 1;
    if (equipas.length % 2 !== 0) {
        numrondas++;
    }



    // Percorre cada ronda
    for (let ronda = 1; ronda <= numrondas; ronda++) {
        const jogos = [];
        const metadeSuperior = equipas.slice(0, equipas.length / 2);
        const metadeInferior = equipas.slice(equipas.length / 2).reverse();

        for (let i = 0; i < metadeSuperior.length; i++) {
            const jogo = {
                equipa1: metadeSuperior[i],
                equipa2: metadeInferior[i]
            };
            jogos.push(jogo);
        }

        rondas.push({
            numero: ronda,
            jogos: jogos
        });

        // Rotaciona as equipas
        if (equipas.length % 2 !== 0) {
            const primeiraequipa = equipas.shift();
            equipas.push(primeiraequipa);
        } else {
            const ultimaEquipa = equipas.pop();
            equipas.splice(1, 0, ultimaEquipa);
        }
    }

    // Exibe as rondas e os jogos gerados
    const metadeJogos = (numrondas + numrondas % 2) / 2;

    let jogosList = '';
    rondas.forEach((ronda) => {
        jogosList += `<h3>Round ${ronda.numero}</h3>`
        ronda.jogos.forEach((jogo, index) => {
            jogosList += `  
            <div style="margin-bottom: -20px; display:flex">
                <div class="teamJogo home">${jogo.equipa1.j1} X ${jogo.equipa1.j2}</div>
                <input type="text" id="r${ronda.numero}j${index + 1}e1" style="height: 25px; width: 20px;" min="0">  - 
                <input type="text" id="r${ronda.numero}j${index + 1}e2" style="height: 25px; width: 20px;" min="0"> 
                <div class="teamJogo away">${jogo.equipa2.j1} X ${jogo.equipa2.j2}</div>
            </div>                
            <br>`
        });
        jogosList += '<br>'

        if (ronda.numero == metadeJogos) {
            document.getElementById('list-jogos-1').innerHTML = jogosList;
            jogosList = '';
        }
    });
    const lista = document.getElementById('list-jogos-2');
    lista.innerHTML = jogosList;

    data.rondas = rondas
    localStorage.setItem('foosball', JSON.stringify(data));
}

function criarTabela() {
    const dados = { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 };
    let tabela = teams.map(equipa => ({
            team: equipa.id,
            dados: { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 }
        }));
    tabela.forEach((equipa) => {
        equipa.dados = dados;
    });
    data.tabela = tabela;
    localStorage.setItem('foosball', JSON.stringify(data));


}

function processResults() {
    document.getElementById('playoffs').classList.remove('d-none');
    document.getElementById('winner').classList.remove('d-none');
    let tabela = JSON.parse(localStorage.getItem('foosball')).tabela;

    // meter a tabela a zeros
    tabela.forEach((equipa) => {
        equipa.dados = { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 };
    });

    let rondas = JSON.parse(localStorage.getItem('foosball')).rondas;

    rondas.forEach((ronda) => {
        ronda.jogos.forEach((jogo, index) => {
            const e1 = document.getElementById(`r${ronda.numero}j${index + 1}e1`).value;
            const e2 = document.getElementById(`r${ronda.numero}j${index + 1}e2`).value;
            if (e1 == '' || e2 == '') {
                console.log('Jogo incompleto')
            } else {
                // Acessar os dados da tabela de cada equipa
                const equipa1 = tabela.find((equipa) => equipa.team === jogo.equipa1.id);
                const equipa2 = tabela.find((equipa) => equipa.team === jogo.equipa2.id);
                // console.log(equipa1.id + ' (' + e1 + '-' + e2 + ') ' + equipa2.id)

                // Atualizar os dados da tabela com os resultados
                equipa1.dados.J += 1;
                equipa2.dados.J += 1;
                equipa1.dados.GM += parseInt(e1, 10);
                equipa1.dados.GS += parseInt(e2, 10);
                equipa1.dados.DG = equipa1.dados.GM - equipa1.dados.GS;
                equipa2.dados.GM += parseInt(e2, 10);
                equipa2.dados.GS += parseInt(e1, 10);
                equipa2.dados.DG = equipa2.dados.GM - equipa2.dados.GS;
                if (e1 > e2) {
                    equipa1.dados.V += 1;
                    equipa2.dados.D += 1;
                } else {
                    equipa2.dados.V += 1;
                    equipa1.dados.D += 1;
                }

                // Armazenar o resultado do jogo em rondas
                jogo.resultado = {
                    equipa1: parseInt(e1, 10),
                    equipa2: parseInt(e2, 10)
                };

            }
        });
        data.tabela = tabela;
        data.results = rondas;
        localStorage.setItem('foosball', JSON.stringify(data));
    });
    printTabela();

}

function gerarResultados() {
    let rondas = JSON.parse(localStorage.getItem('foosball')).rondas;

    rondas.forEach((ronda) => {
        ronda.jogos.forEach((jogo, index) => {
            const e1 = document.getElementById(`r${ronda.numero}j${index + 1}e1`).value = Math.floor(Math.random() * 7) + 1;
            const e2 = document.getElementById(`r${ronda.numero}j${index + 1}e2`).value = 7 - e1;
        });
    });
}

function cleanResults() {
    let rondas = JSON.parse(localStorage.getItem('foosball')).rondas;

    rondas.forEach((ronda) => {
        ronda.jogos.forEach((jogo, index) => {
            const e1 = document.getElementById(`r${ronda.numero}j${index + 1}e1`).value = '';
            const e2 = document.getElementById(`r${ronda.numero}j${index + 1}e2`).value = '';
        });
    });

    data.results = rondas;
    localStorage.setItem('foosball', JSON.stringify(data));

}

numQualificados = 4;

function printTabela() {
    let tabela = JSON.parse(localStorage.getItem('foosball')).tabela;

    // Ordenar a tabela pelo número de vitória, DG e GM
    tabela.sort((a, b) => {
        if (a.dados.V !== b.dados.V) {
            return b.dados.V - a.dados.V; // Ordenar por número de vitórias
        } else if (a.dados.DG !== b.dados.DG) {
            return b.dados.DG - a.dados.DG; // Em caso de empate, ordenar por DG
        } else {
            return b.dados.GM - a.dados.GM; // Em caso de empate, ordenar por GM
        }
    });

    //tabela final
    data.tabelaFinal = tabela
    localStorage.setItem('foosball', JSON.stringify(data));


    const table = document.getElementById('table');
    table.innerHTML = `
      <div class="row">
          <table class="tabela">
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>PL</th>
              <th>W</th>
              <th>L</th>
              <th>GD</th>
              <th>GF</th>
              <th>GA</th>
            </tr>
            ${getDataRows(tabela)}
            <tr>
            <td class="qualificado" colspan="2"></td>
            <td colspan="6">Qualified to the Play-offs</td>
            </tr>
            </table>
      </div>
    `;
}

function getDataRows(tabela) {
    let html = '';
    if (tabela.length < 7) {
        numQualificados = 2;
    }

    tabela.forEach((equipa, index) => {
        const classQualificado = index < numQualificados ? 'qualificado' : '';
        const j1 = teams.find(team => team.id === equipa.team).j1;
        const j2 = teams.find(team => team.id === equipa.team).j2;
        html += `
          <tr class="${classQualificado} linhas">
              <td>${index + 1}</td>
              <td>${j1} X ${j2}</td>
              <td>${equipa.dados.J}</td>
              <td>${equipa.dados.V}</td>
              <td>${equipa.dados.D}</td>
              <td>${equipa.dados.DG}</td>
              <td>${equipa.dados.GM}</td>
              <td>${equipa.dados.GS}</td>
            </tr>
          `;
    });

    return html;
}



function findWinner() {
    let tabela = JSON.parse(localStorage.getItem('foosball')).tabelaFinal;

    console.log(tabela[0])
    data.winner = tabela[0].j1 + ' X ' + tabela[0].j2;
    localStorage.setItem('foosball', JSON.stringify(data));
    window.location.href = 'winner.html';

}