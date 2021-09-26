$(document).ready(function () {
  const entryFee = [];
  const prizePool = [];
  const players = [];
  const url = `https://playsuper.herokuapp.com/addMatch`;

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Access-Control-Allow-Origin', '*');

  const subpoolFields = $('.subpool');
  const playerFields = $('.players');

  $('#submit-match').on('click', function (e) {
    e.preventDefault();

		const game = $('#game').val();
  	const timeOfStart = $('#timeOfStart').val();
  	const teamA = $('#teamA').val();
  	const teamB = $('#teamB').val();
  	const tournament = $('#tournament').val();

    subpoolFields.children('input').each(function () {
      if ($(this).hasClass('prize')) {
        prizePool.push($(this).val());
      } else {
        entryFee.push($(this).val());
      }
    });

    let name = '';
    let credits = '';

    playerFields.children('input').each(function () {
      if ($(this).hasClass('player')) {
        name = $(this).val();
      } else {
        credits = $(this).val();
        let playerObj = {
          name,
          credits,
        };

        players.push(playerObj);
      }
    });

    const data = {
      prizePool,
      entryFee,
      game,
      tournament,
      timeOfStart,
      teamA,
      teamB,
      players
    };

    let json = JSON.stringify(data);
    console.log(json);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: json,
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        location.reload();
      });
  });
});
