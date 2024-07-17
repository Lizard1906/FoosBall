let data = JSON.parse(localStorage.getItem('foosball'));
let teams;
if (data) {
    teams = data.teams;
    console.log(teams)
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

document.addEventListener('DOMContentLoaded', function () {
    dividirGrupos();
    criarJogos();
    criarTabela();
    exibirResultados();
    // gerarResultados();
    // processResults();
});

data.grupos = [];

function dividirGrupos() {
    // 4-8 equipas -> 2 grupos
    // 9-12 equipas -> 3 grupos
    // 13-16 equipas -> 4 grupos


    const numTeams = teams.length;
    let numGroups;

    if (numTeams <= 8) {
        numGroups = 2;
    } else if (numTeams <= 12) {
        numGroups = 3;
    } else {
        numGroups = 4;
    }

    const groupSize = Math.ceil(numTeams / numGroups);

    for (let i = 0; i < numGroups; i++) {
        data.grupos.push(
            {
                group: letters[i],
                teams: teams.slice(i * groupSize, (i + 1) * groupSize)
            }
        );
    }

    localStorage.setItem('foosball', JSON.stringify(data));
}

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
    const grupoRondas = [];

    data.grupos.forEach(grupo => {
        const teams = [...grupo.teams];
        const rondas = [];
        let numrondas = teams.length - 1;
        if (teams.length % 2 !== 0) {
            numrondas++;
        }
        for (let ronda = 1; ronda <= numrondas; ronda++) {
            const jogos = [];
            const metadeSuperior = teams.slice(0, teams.length / 2);
            const metadeInferior = teams.slice(teams.length / 2).reverse();
            for (let i = 0; i < metadeSuperior.length; i++) {
                const jogo = {
                    equipa1: metadeSuperior[i],
                    equipa2: metadeInferior[i],
                    grupo: grupo.group
                };
                jogos.push(jogo);
            }
            rondas.push({
                numero: ronda,
                jogos: jogos
            });
            if (teams.length % 2 !== 0) {
                const primeiraequipa = teams.shift();
                teams.push(primeiraequipa);
            } else {
                const ultimaEquipa = teams.pop();
                teams.splice(1, 0, ultimaEquipa);
            }
        }
        grupoRondas.push({ nome: grupo.nome, rondas: rondas });
    });

    let rondas = []
    grupoRondas.forEach(grupo => {
        grupo.rondas.forEach(ronda => {
            if (ronda.numero > rondas.length) {
                rondas.push(ronda)
            } else {
                ronda.jogos.forEach(jogo => {
                    rondas[ronda.numero - 1].jogos.push(jogo)
                })
            }
        })
    })

    const metadeJogos = (rondas.length + rondas.length % 2) / 2;

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
            document.getElementById(`list-jogos-1`).innerHTML = jogosList;
            jogosList = '';
        }
    });
    const lista = document.getElementById(`list-jogos-2`);
    lista.innerHTML = jogosList;

    data.rondas = rondas;
    localStorage.setItem('foosball', JSON.stringify(data));
}

function criarTabela() {
    data.tabelas = []
    data.grupos.forEach(grupo => {
        let tabela = grupo.teams.map(equipa => ({
            team: equipa.id,
            dados: { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 }
        }));
        const dados = { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 };
        tabela.forEach((equipa) => {
            equipa.dados = dados;
        });
        data.tabelas.push(
            {
                group: grupo.group,
                tabela: tabela,
            }
        )
        localStorage.setItem('foosball', JSON.stringify(data));
    });
    exibirTabelas();
}

function exibirTabelas() {

    data.tabelas.forEach(grupo => {
        grupo.tabela.sort((a, b) => {
            if (a.dados.V !== b.dados.V) {
                return b.dados.V - a.dados.V; // Ordenar por número de vitórias
            } else if (a.dados.DG !== b.dados.DG) {
                return b.dados.DG - a.dados.DG; // Em caso de empate, ordenar por DG
            } else {
                return b.dados.GM - a.dados.GM; // Em caso de empate, ordenar por GM
            }
        })
    })

    localStorage.setItem('foosball', JSON.stringify(data))

    const numQualificados = 2;

    data.tabelas.forEach(grupo => {
        const tabela = [...grupo.tabela];
        let tabelaHtml = `
        <div class="row">
            <table class="tabela">
                <tr>
                    <th>${grupo.group}</th>
                    <th>Team</th>
                    <th>PL</th>
                    <th>W</th>
                    <th>L</th>
                    <th>GD</th>
                    <th>GF</th>
                    <th>GA</th>
                </tr>
                ${tabela.map((equipa, index) => {
            const classQualificado = index < numQualificados ? 'qualificado' : '';
            const j1 = teams.find(team => team.id === equipa.team).j1;
            const j2 = teams.find(team => team.id === equipa.team).j2;
            return `
                        <tr class="${classQualificado}">
                            <th scope="row">${index + 1}</th>
                            <td>${j1} X ${j2}</td>
                            <td>${equipa.dados.J}</td>
                            <td>${equipa.dados.V}</td>
                            <td>${equipa.dados.D}</td>
                            <td>${equipa.dados.DG}</td>
                            <td>${equipa.dados.GM}</td>
                            <td>${equipa.dados.GS}</td>
                        </tr>
                    `;
        }).join('')}
                <tr>
                    <td class="qualificado" colspan="2"></td>
                    <td colspan="6">Qualified to the Play-offs</td>
                </tr>
            </table>
        </div>
        `;
        document.getElementById(`table${grupo.group.toUpperCase()}`).innerHTML = tabelaHtml;
    });
}

function processResults() {
    document.getElementById('playoffs').classList.remove('d-none');

    let tabelas = JSON.parse(localStorage.getItem('foosball')).tabelas;
    // meter as tabelas a zeros
    tabelas.forEach((tabela) => {
        tabela.tabela.forEach((equipa) => {
            equipa.dados = { J: 0, V: 0, D: 0, DG: 0, GM: 0, GS: 0 };
        });
    })
    let resultados = JSON.parse(localStorage.getItem('foosball')).rondas;

    resultados.forEach((ronda) => {
        ronda.jogos.forEach((jogo, index) => {
            const golos1 = parseInt(document.getElementById(`r${ronda.numero}j${index + 1}e1`).value);
            const golos2 = parseInt(document.getElementById(`r${ronda.numero}j${index + 1}e2`).value);
            const equipa1 = jogo.equipa1;
            const equipa2 = jogo.equipa2;

            if (isNaN(golos1) || isNaN(golos2)) return;

            const tabelaToFind = tabelas.find(tabela => tabela.group === jogo.grupo)
            const tabelaGrupo = tabelaToFind.tabela
            const equipa1dados = tabelaGrupo.find(e => e.team === equipa1.id);
            const equipa2dados = tabelaGrupo.find(e => e.team === equipa2.id);

            equipa1dados.dados.J++;
            equipa2dados.dados.J++;

            equipa1dados.dados.GM += golos1;
            equipa1dados.dados.GS += golos2;

            equipa2dados.dados.GM += golos2;
            equipa2dados.dados.GS += golos1;

            equipa1dados.dados.DG = equipa1dados.dados.GM - equipa1dados.dados.GS;
            equipa2dados.dados.DG = equipa2dados.dados.GM - equipa2dados.dados.GS;

            if (golos1 > golos2) {
                equipa1dados.dados.V++;
                equipa2dados.dados.D++;
            } else if (golos1 < golos2) {
                equipa2dados.dados.V++;
                equipa1dados.dados.D++;
            }

            // Armazenar o resultado do jogo em rondas
            jogo.resultado = {
                equipa1: parseInt(golos1, 10),
                equipa2: parseInt(golos2, 10)
            };
        });
        data.tabelas = tabelas;
        data.results = resultados;
        console.log(data)
        localStorage.setItem('foosball', JSON.stringify(data));
    });

    exibirTabelas();
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
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.value = '';
    });
}
