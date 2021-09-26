$(document).ready(function () {
  const url = `https://playsuper.herokuapp.com/addPlayer`;

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  $("#submit-player").on("click", function (e) {
    e.preventDefault();

    const name = $("#name").val();
    const credits = parseInt($("#credits").val());
    const ACS = parseInt($("#acs").val());
    const KDRatio = parseInt($("#kdratio").val());
    const teamName = $("#teamName").val();
    const totalGamesPlayed = 0;

    const data = {
      name,
      credits,
      ACS,
      KDRatio,
      teamName,
      totalGamesPlayed,
    };

    let json = JSON.stringify(data);
    console.log(json);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: json,
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
  });
});
