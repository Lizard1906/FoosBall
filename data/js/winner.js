let winner = JSON.parse(localStorage.getItem('foosball')).winner;
let players = JSON.parse(localStorage.getItem('foosball')).players;

console.log(players)

document.addEventListener('DOMContentLoaded', function () {
    console.log(winner)
    const winners = winner.split(' X ');
    console.log(winners)

    document.getElementById('winner1').textContent = winners[0];
    document.getElementById('winner2').textContent = winners[1];

    //foto 1
    let winner1 = players.find(player => player.name === winners[0]);
    document.getElementById('winner1img').src = `data/jogadores/${winner1.avatar}.png`;
    let winner2 = players.find(player => player.name === winners[1]);
    document.getElementById('winner2img').src = `data/jogadores/${winner2.avatar}.png`;
    });


function reset() {
    window.location.href = 'teams.html';
}
