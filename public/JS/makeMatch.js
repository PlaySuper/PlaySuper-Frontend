$(document).ready(function () {
  const url = `https://playsuper.herokuapp.com/addMatch`;
  $(".overlay").hide();
  $(".spinner").hide();

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const subpoolFields = $(".subpool");
  const playerFields = $(".players");

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
          swal("Oops something went wrong", "" + result.error, "error");
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
