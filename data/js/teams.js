const names = ["Alex", "Bernard", "Charles", "David", "Edward", "Frank", "Gordon", "Henry", "Isaac", "John", "Kevin", "Liam", "Michael", "Nathan", "Oscar", "Peter", "Quentin", "Robert", "Steven", "Thomas", "Ulysses", "Victor", "William", "Xavier", "Yankee", "Zulu"]

const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
numDeletes = 0;
console.log(alphabet);

document.addEventListener('DOMContentLoaded', function () {
    listEquipas();
});

let data = JSON.parse(localStorage.getItem('foosball'));
let teams = [];
let players = [];
if (data) {
    teams = data.teams;
    players = data.players;
} else {
    data = {};
}

function newTeam(p1, p2) {
    teams.push({ id: alphabet[teams.length + numDeletes], j1: p1, j2: p2 });
    players.push({name:p1, avatar: Math.floor(Math.random() * 5 + 1) })
    players.push({name:p2, avatar: Math.floor(Math.random() * 5 + 1) })
    saveEquipas();
    listEquipas();
    cleanResults();
}

function listEquipas() {
    const lista = document.getElementById('list-teams');
    let teamsList = '';
    teams.forEach(team => {
        teamsList += `
            <div class="d-flex" style="margin: 5px 0; justify-content: space-between"> ${team.j1} X ${team.j2}
            <button class="btn btn-danger fas fa-trash" onclick="deleteTeam('${team.id}')"></button>
            </div>
        `;
    });
    lista.innerHTML = teamsList;
}

function saveEquipas() {
    console.log(data)
    data.teams = teams
    data.players = players
    localStorage.setItem('foosball', JSON.stringify(data));
}

function resetEquipas() {
    teams = [];
    players = [];
    saveEquipas();
    listEquipas();
}

function gerarEquipas() {
    resetEquipas();
    let players = names;
    let numPlayers = players.length;
    let numTeams = 12;
    let i = 0;
    while (i < numTeams) {
        let j1 = players[Math.floor(Math.random() * numPlayers)];
        let j2 = players[Math.floor(Math.random() * numPlayers)];
        if (j1 !== j2) {
            newTeam(j1, j2);
            i++;
        }
    }

    cleanResults();
    saveEquipas();
    listEquipas();
}


function cleanResults() {
    let rondas = JSON.parse(localStorage.getItem('foosball')).rondas;
    console.log(rondas)

    rondas = [];
    data.rondas = [];
    localStorage.setItem('foosball', JSON.stringify(data));

}

function deleteTeam(letra) {
    const index = teams.findIndex(team => team.id === letra.toUpperCase());
    if (index !== -1) {
        teams.splice(index, 1);
        numDeletes++;
    }
    listEquipas();
    saveEquipas();
}

