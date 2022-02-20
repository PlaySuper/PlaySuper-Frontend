$(document).ready(function () {
    const url = `https://playsuper.herokuapp.com/notifications`;
    $(".overlay").hide();
    $(".spinner").hide();
  
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
  
    $("#submit-notif").on("click", function (e) {
      e.preventDefault();
  
      $(".overlay").show();
      $(".spinner").show();
  
      const title = $("#notif-title").val();
      const body = $("#notif-body").val();
  
      const data = {
        title,
        body,
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
            swal("Notification sent!", "All notifications sent to everyone", "success");
            $("form").trigger("reset");
          }
        })
        .catch((e) => {
          swal("Oops something went wrong", "" + e.message, "error");
          console.log(e);
        });
    });
  });
  