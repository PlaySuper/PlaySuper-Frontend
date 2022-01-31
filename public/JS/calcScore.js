const playersBlock = $(".scores");

function createPlayersDiv(players) {
  let output = ``;
  let i = 1;

  players.forEach(player => {
    output += `
      <input type="text" class="player" id="name${i}" name="p${i}" value="${player}" readonly/>
      <input type="number" class="kills" id="kills${i}" name="kills${i}" placeholder="Player ${i} Kills" min="0" required/>
      <input type="number" id="assists${i}" name="assists${i}" placeholder="Player ${i} Assists" min="0" required/>`;
    i += 1;
  });

  playersBlock.empty();
  playersBlock.html(output);
}

function creditWinningsToWallet(matchID) {
  const url = `https://playsuper.herokuapp.com/amount/${matchID}`;

  let requestOptions = {
    method: "GET",
    headers: myHeaders
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      $(".overlay").hide();
      $(".spinner").hide();

      if (result.status == "failure")
        swal("Oops something went wrong", "" + result.error, "error");
      else {

      }
    })
    .catch((e) => {
      swal("Oops something went wrong", "" + e, "error");
      console.log(e);
    });
}

$(document).ready(function () {
  $(".overlay").hide();
  $(".spinner").hide();
  $("#submit-score").hide();
  $(".player-container").hide();

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const scoreFields = $(".scores");

  $('#fetch-match').on("click", function (e) {
    e.preventDefault();

    $(".overlay").show();
    $(".spinner").show();

    const matchID = $("#matchID").val();
    const url = `https://playsuper.herokuapp.com/players/match/${matchID}`;

    let requestOptions = {
      method: "GET",
      headers: myHeaders
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        $(".overlay").hide();
        $(".spinner").hide();

        if (result.status == "failure")
          swal("Oops something went wrong", "" + result.error, "error");
        else {
          createPlayersDiv(result.data.players);
          $("#submit-score").show();
          $(".player-container").show();
        }
      })
      .catch((e) => {
        swal("Oops something went wrong", "" + e, "error");
        console.log(e);
      });
  });

  $("#submit-score").on("click", function (e) {
    e.preventDefault();

    $(".overlay").show();
    $(".spinner").show();

    const url = `https://playsuper.herokuapp.com/calculateScore`;
    const matchID = $("#matchID").val();
    const mvp = $("#mvp").val();
    const winner = $("#winner").val();
    const players = [];

    let name = "";
    let kills = 0;
    let assists = 0;

    scoreFields.children("input").each(function () {
      if ($(this).hasClass("player")) {
        name = $(this).val();
      } else if ($(this).hasClass("kills")) {
        kills = parseInt($(this).val());
      } else {
        assists = parseInt($(this).val());
        let playerObj = {
          name,
          kills,
          assists,
        };

        players.push(playerObj);
      }
    });

    const data = {
      matchID,
      players,
      mvp,
      winner,
    };

    let json = JSON.stringify(data);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: json,
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status == "failure")
          swal("Oops something went wrong: ", "" + result.message, "error");
        else {
          creditWinningsToWallet(matchID);
          swal("Score calculated and added!", "You're all set!", "success");
          $("form").trigger("reset");
        }
      })
      .catch((e) => {
        swal("Oops something went wrong", "" + e, "error");
        console.log(e);
      });
  });
});
