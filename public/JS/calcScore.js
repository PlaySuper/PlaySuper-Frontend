$(document).ready(function () {
  const url = `https://playsuper.herokuapp.com/calculateScore`;
  $(".overlay").hide();
  $(".spinner").hide();

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const scoreFields = $(".scores");

  $("#submit-score").on("click", function (e) {
    e.preventDefault();

    $(".overlay").show();
    $(".spinner").show();

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
        $(".overlay").hide();
        $(".spinner").hide();
        console.log(result);
        if (result.status == "failure")
          swal("Oops something went wrong", "" + result.error, "error");
        else {
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
