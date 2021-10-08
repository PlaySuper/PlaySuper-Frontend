$(document).ready(function () {
  const url = `https://playsuper.herokuapp.com/addPlayer`;
  $(".overlay").hide();
  $(".spinner").hide();

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  $("#submit-player").on("click", function (e) {
    e.preventDefault();

    $(".overlay").show();
    $(".spinner").show();

    const name = $("#name").val();
    const ACS = parseInt($("#acs").val());
    const KDRatio = parseFloat($("#kdratio").val());
    const kills = parseInt($("#kills").val());
    const deaths = parseInt($("#deaths").val());
    const assists = parseInt($("#assists").val());
    const teamName = $("#teamName").val();
    const totalGamesPlayed = 0;

    const data = {
      name,
      ACS,
      KDRatio,
      kills,
      deaths,
      assists,
      teamName,
      totalGamesPlayed,
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
          swal("Player added!", "You're all set!", "success");
          $("form").trigger("reset");
        }
      })
      .catch((e) => {
        swal("Oops something went wrong", "" + e.message, "error");
        console.log(e);
      });
  });
});
