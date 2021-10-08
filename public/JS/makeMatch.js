const playerFields = $(".players");
const playerCredContainer = $(".player-cred-container");

function createTeamPlayerDiv(teamA, teamB, length) {
  let output = ``;

  const fullPlayers = teamA.concat(teamB);
  
  for (let i = 0; i < length; i++) {
    output += `
      <input type="text" class="player" id="name${i+1}" value="${fullPlayers[i].name}" readonly/>
      <input type="number" id="credits${i+1}" placeholder="Player ${i+1} Credits" min="0" required />`;
  }

  playerFields.empty();
  playerFields.html(output);
  playerCredContainer.show();
}

$(document).ready(function () {
  const url = `https://playsuper.herokuapp.com/addMatch`;
  $(".overlay").hide();
  $(".spinner").hide();
  $("#submit-match").hide();
  playerCredContainer.hide();

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const subpoolFields = $(".subpool");

  $('#fetch-players').on("click", function (e) {
    e.preventDefault();

    $(".overlay").show();
    $(".spinner").show();

    const teamA = $("#teamA").val();
    const teamB = $("#teamB").val();

    if (teamA && teamB){
    const urlA = `https://playsuper.herokuapp.com/player/${teamA}`;
    const urlB = `https://playsuper.herokuapp.com/player/${teamB}`;

    let requestOptions = {
      method: "GET",
      headers: myHeaders
    };

    fetch(urlA, requestOptions)
      .then((responseA) => responseA.json())
      .then((resultA) => {
        $(".overlay").hide();
        $(".spinner").hide();

        if (resultA.status == "failure")
          swal("Oops something went wrong", "" + resultA.error, "error");
        else {
          fetch(urlB, requestOptions)
            .then((responseB) => responseB.json())
            .then((resultB) => {
              $(".overlay").hide();
              $(".spinner").hide();

              if (resultB.status == "failure")
                swal("Oops something went wrong", "" + resultB.error, "error");
              else {
                createTeamPlayerDiv(resultA.players, resultB.players, resultA.length + resultB.length);
                $("#submit-match").show();
              }
            })
            .catch((e2) => {
              swal("Oops something went wrong", "" + e2, "error");
              console.log(e2);
            });
        }
      })
      .catch((e1) => {
        swal("Oops something went wrong", "" + e1, "error");
        console.log(e1);
      });
    } else {
      swal("Please fill the team fields", "Check the teamA and teamB fields");
      $(".overlay").hide();
        $(".spinner").hide();
    }
  });

  $("#submit-match").on("click", function (e) {
    $(".overlay").show();
    $(".spinner").show();
    const entryFee = [];
    const prizePool = [];
    const players = [];
    e.preventDefault();

    const game = $("#game").val();
    const timeOfStart = $("#timeOfStart").val();
    const teamA = $("#teamA").val();
    const teamB = $("#teamB").val();
    const tournament = $("#tournament").val();

    subpoolFields.children("input").each(function () {
      if ($(this).hasClass("prize")) {
        prizePool.push(parseInt($(this).val()));
      } else {
        entryFee.push(parseInt($(this).val()));
      }
    });

    let name = "";
    let credits = 0;

    playerFields.children("input").each(function () {
      if ($(this).hasClass("player")) {
        name = $(this).val();
      } else {
        credits = parseInt($(this).val());
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
      players,
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
        $(".overlay").hide();
        $(".spinner").hide();
        console.log(result);
        if (result.status == "failure")
          swal("Oops something went wrong: ", "" + result.message, "error");
        else {
          swal("Match added!", "You're all set!", "success");
          $("form").trigger("reset");
        }
      })
      .catch((e) => {
        swal("Oops something went wrong", "" + e, "error");
        console.log(e);
      });
  });
});
