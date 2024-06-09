let data = JSON.parse(localStorage.getItem('foosball'));
let tabela;
if (data) {
    tabela = data.tabelaFinal;
}

const qualificados = [];
const finalistas = [];
if (tabela.length < 7) {
    qualificados.push(tabela[0]);
    qualificados.push(tabela[1]);
} else {
    qualificados.push(tabela[0]);
    qualificados.push(tabela[1]);
    qualificados.push(tabela[2]);
    qualificados.push(tabela[3]);
}
console.log(qualificados)

document.addEventListener('DOMContentLoaded', function () {
    if (qualificados.length == 4) {
        criarMeias(qualificados);
    } else {
        finalistas.push(qualificados[0].j1 + ' X ' + qualificados[0].j2);
        finalistas.push(qualificados[1].j1 + ' X ' + qualificados[1].j2);
        criarFinal(finalistas);
    }
});

function criarMeias(semiFinalistas) {
    document.getElementById('meias').classList.remove('d-none')
    const jogos1 = [];
    const jogos2 = [];
    jogos1.push({ equipa1: semiFinalistas[0].j1 + ' X ' + semiFinalistas[0].j2, equipa2: semiFinalistas[3].j1 + ' X ' + semiFinalistas[3].j2, vencedor: null })
    jogos1.push({ equipa1: semiFinalistas[0].j1 + ' X ' + semiFinalistas[0].j2, equipa2: semiFinalistas[3].j1 + ' X ' + semiFinalistas[3].j2, vencedor: null })
    jogos2.push({ equipa1: semiFinalistas[1].j1 + ' X ' + semiFinalistas[1].j2, equipa2: semiFinalistas[2].j1 + ' X ' + semiFinalistas[2].j2, vencedor: null })
    jogos2.push({ equipa1: semiFinalistas[1].j1 + ' X ' + semiFinalistas[1].j2, equipa2: semiFinalistas[2].j1 + ' X ' + semiFinalistas[2].j2, vencedor: null })

    data.jogos1 = jogos1
    data.jogos2 = jogos2
    localStorage.setItem('foosball', JSON.stringify(data));

    let Meias1 = '';
    jogos1.forEach((jogo, index) => {
        Meias1 += `  
            <div style="margin-bottom: -20px; display:flex">
                <div class="teamJogo home">${jogo.equipa1}</div>
                <input type="text" id="m1j${index + 1}e1" style="height: 35px; width: 30px; text-align:center" min="0">  - 
                <input type="text" id="m1j${index + 1}e2" style="height: 35px; width: 30px; text-align:center" min="0"> 
                <div class="teamJogo away">${jogo.equipa2}</div>
            </div>                
            <br>`
    });

    document.getElementById('meia-1').innerHTML = Meias1;

    let Meias2 = '';
    jogos2.forEach((jogo, index) => {
        Meias2 += `  
            <div style="margin-bottom: -20px; display:flex">
                <div class="teamJogo home">${jogo.equipa1}</div>
                <input type="text" id="m2j${index + 1}e1" style="height: 35px; width: 30px; text-align:center" min="0">  - 
                <input type="text" id="m2j${index + 1}e2" style="height: 35px; width: 30px; text-align:center" min="0"> 
                <div class="teamJogo away">${jogo.equipa2}</div>
            </div>                
            <br>`
    });

    document.getElementById('meia-2').innerHTML = Meias2;

}

function criarFinal(finalistas) {
    const finalissima = { equipa1: finalistas[0], equipa2: finalistas[1], vencedor: null };
    let Final = `            
    <div id="finalissima" style="display:flex; justify-content: center" class="final">
        <div class="home">${finalissima.equipa1}</div>
        <input type="text" id="final1" style="height: 60px; width: 60px; text-align:center" min="0">  - 
        <input type="text" id="final2" style="height: 60px; width: 60px; text-align:center" min="0"> 
        <div class="away">${finalissima.equipa2}</div>
    </div>                
    <br>
    `;

    data.finalissima = finalissima
    localStorage.setItem('foosball', JSON.stringify(data));
    document.getElementById('final').innerHTML = Final;
    document.getElementById('finalissima').classList.add('boxGold')
    document.getElementById('winner').classList.remove('d-none')

}

let finalista1 = null;
let finalista2 = null;


function processResults() {
    //meias 1
    let jogos1 = JSON.parse(localStorage.getItem('foosball')).jogos1;
    if (jogos1.length == 2) {
        jogos1.forEach((jogo, index) => {
            const e1 = document.getElementById(`m1j${index + 1}e1`).value;
            const e2 = document.getElementById(`m1j${index + 1}e2`).value;
            if (e1 == '' || e2 == '') {
            } else {
                if ((parseInt(e1)) > parseInt(e2)) {
                    jogo.vencedor = jogo.equipa1;
                }
                else {
                    jogo.vencedor = jogo.equipa2;
                }
            }
        });
        if (jogos1[0].vencedor == jogos1[1].vencedor) {
            finalista1 = jogos1[0].vencedor;
        } else if (jogos1[1].vencedor != null) {
            jogos1.push({ equipa1: jogos1[0].equipa1, equipa2: jogos1[0].equipa2, vencedor: null })
            let Negra1 = '';
            Negra1 += `  
            <div style="margin-bottom: -20px; display:flex">
                <div class="teamJogo home">${jogos1[2].equipa1}</div>
                <input type="text" id="n1e1" style="height: 35px; width: 30px; text-align:center" min="0">  - 
                <input type="text" id="n1e2" style="height: 35px; width: 30px; text-align:center" min="0"> 
                <div class="teamJogo away">${jogos1[2].equipa2}</div>
            </div>                
            <br>`
            document.getElementById('negra-1').innerHTML = Negra1;
            localStorage.setItem('jogos1', JSON.stringify(jogos1));
        }

    } else if (jogos1.length == 3) {
        console.log('jogos1 tem tamanho 3')
        for (let i = 0; i < 2; i++) {
            const jogo = jogos1[i];
            const index = i;
            const e1 = document.getElementById(`m1j${index + 1}e1`).value;
            const e2 = document.getElementById(`m1j${index + 1}e2`).value;
            if (e1 == '' || e2 == '') {
                console.log('jogo incompleto')
            } else {
                if (parseInt(e1) > parseInt(e2)) {
                    console.log(jogo.equipa1 + ' vence o jogo'+ index +' por ' + e1 + '-'+e2)
                    jogos1[i].vencedor = jogo.equipa1;
                }
                else {
                    console.log(jogo.equipa2 + ' vence o jogo'+ index +' por ' + e1 + '-'+e2)
                    jogos1[i].vencedor = jogo.equipa2;
                }
            }
            console.log(jogos1)
        }

        if (jogos1[0].vencedor == jogos1[1].vencedor) {
            finalista1 = jogos1[0].vencedor;
        } else {
            const e1 = document.getElementById(`n1e1`).value;
            const e2 = document.getElementById(`n1e2`).value;
            if (e1 == '' || e2 == '') {
                console.log('Jogo incompleto')
            } else {
                if (parseInt(e1) > parseInt(e2)) {
                    jogos1[2].vencedor = jogos1[2].equipa1;
                }
                else {
                    jogos1[2].vencedor = jogos1[2].equipa2;
                }
                finalista1 = jogos1[2].vencedor;
            }
        }
    }
    data.jogos1 = jogos1;
    localStorage.setItem('foosball', JSON.stringify(data));


    //meias 2
    let jogos2 = JSON.parse(localStorage.getItem('foosball')).jogos2;
    if (jogos2.length == 2) {
        jogos2.forEach((jogo, index) => {
            const e1 = document.getElementById(`m2j${index + 1}e1`).value;
            const e2 = document.getElementById(`m2j${index + 1}e2`).value;
            if (e1 == '' || e2 == '') {
            } else {
                if ((parseInt(e1)) > parseInt(e2)) {
                    jogo.vencedor = jogo.equipa1;
                }
                else {
                    jogo.vencedor = jogo.equipa2;
                }
            }
        });
        if (jogos2[0].vencedor == jogos2[1].vencedor) {
            finalista2 = jogos2[0].vencedor;
        } else if (jogos2[1].vencedor != null) {
            jogos2.push({ equipa1: jogos2[0].equipa1, equipa2: jogos2[0].equipa2, vencedor: null })
            let Negra2 = '';
            Negra2 += `  
                <div style="margin-bottom: -20px; display:flex">
                    <div class="teamJogo home">${jogos2[2].equipa1}</div>
                    <input type="text" id="n2e1" style="height: 35px; width: 30px; text-align:center" min="0">  - 
                    <input type="text" id="n2e2" style="height: 35px; width: 30px; text-align:center"min="0"> 
                    <div class="teamJogo away">${jogos2[2].equipa2}</div>
                </div>                
                <br>`
            document.getElementById('negra-2').innerHTML = Negra2;
        }

    } else if (jogos2.length == 3) {
        for (let i = 0; i < 2; i++) {
            const jogo = jogos1[i];
            const index = i;
            const e1 = document.getElementById(`m2j${index + 1}e1`).value;
            const e2 = document.getElementById(`m2j${index + 1}e2`).value;
            console.log(e1 + ' - ' + e2)
            if (e1 == '' || e2 == '') {
            } else {
                if ((parseInt(e1)) > parseInt(e2)) {
                    jogo.vencedor = jogo.equipa1;
                }
                else {
                    jogo.vencedor = jogo.equipa2;
                }
            }
        }

        if (jogos2[0].vencedor == jogos2[1].vencedor) {
            finalista2 = jogos2[0].vencedor;
        } else {
            const e1 = document.getElementById(`n2e1`).value;
            const e2 = document.getElementById(`n2e2`).value;
            if (e1 == '' || e2 == '') {
            } else {
                if ((parseInt(e1)) > parseInt(e2)) {
                    jogos2[2].vencedor = jogos2[2].equipa1;
                }
                else {
                    jogos2[2].vencedor = jogos2[2].equipa2;
                }
                finalista2 = jogos2[2].vencedor;
            }
        }
    }
    data.jogos2 = jogos2;
    localStorage.setItem('foosball', JSON.stringify(data));


    if (finalista1 != null && finalista2 != null) {
        // Remover todos os finalistas existentes
        finalistas.splice(0, finalistas.length);
        // Adicionar os novos finalistas
        finalistas.push(finalista1);
        finalistas.push(finalista2);
    }
    if (finalistas.length == 2) {
        criarFinal(finalistas);
    }

}

function gerarMeias() {
    let jogos1 = JSON.parse(localStorage.getItem('foosball')).jogos1;
    for (let i = 0; i < 2; i++) {
        const jogo = jogos1[i];
        const index = i;
        const e1 = document.getElementById(`m1j${index + 1}e1`).value = Math.floor(Math.random() * 7) + 1;
        const e2 = document.getElementById(`m1j${index + 1}e2`).value = 7 - e1;
    }
    if (jogos1.length == 3) {
        const en1 = document.getElementById(`n1e1`).value = Math.floor(Math.random() * 7) + 1;
        const en2 = document.getElementById(`n1e2`).value = 7 - en1;
    }

    let jogos2 = JSON.parse(localStorage.getItem('foosball')).jogos2;
    for (let i = 0; i < 2; i++) {
        const jogo = jogos2[i];
        const index = i;
        const e1 = document.getElementById(`m2j${index + 1}e1`).value = Math.floor(Math.random() * 7) + 1;
        const e2 = document.getElementById(`m2j${index + 1}e2`).value = 7 - e1;
    }
    if (jogos2.length == 3) {
        const en1 = document.getElementById(`n2e1`).value = Math.floor(Math.random() * 7) + 1;
        const en2 = document.getElementById(`n2e2`).value = 7 - en1;
    }
}

function findWinner() {
    let finalissima = JSON.parse(localStorage.getItem('foosball')).finalissima;
    console.log(finalissima)
    const e1 = document.getElementById(`final1`).value;
    const e2 = document.getElementById(`final2`).value;
    if (e1 == '' || e2 == '') {
    } else {
        if ((parseInt(e1)) > parseInt(e2)) {
            finalissima.vencedor = finalissima.equipa1;
        }
        else {
            finalissima.vencedor = finalissima.equipa2;
        }
        data.winner = finalissima.vencedor;
        localStorage.setItem('foosball', JSON.stringify(data));
    
        window.location.href = 'winner.html';
    }
}