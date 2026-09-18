const form =
  document.getElementById(
    "loginForm"
  );


form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const scriptInput =
      document
        .getElementById(
          "scriptId"
        )
        .value
        .trim();


    const username =
      document
        .getElementById(
          "username"
        )
        .value
        .trim();


    const password =
      document
        .getElementById(
          "password"
        )
        .value;


    const button =
      document.getElementById(
        "loginButton"
      );


    const message =
      document.getElementById(
        "message"
      );


    const scriptUrl =
      normalizeScriptUrl(
        scriptInput
      );


    if (!scriptUrl) {

      showMessage(
        "Invalid Google Apps Script ID or URL.",
        false
      );

      return;

    }


    button.disabled = true;

    button.textContent =
      "Logging in...";


    message.textContent =
      "Connecting...";


    try {

      const response =
        await fetch(
          scriptUrl,
          {

            method: "POST",

            body:
              JSON.stringify({

                action:
                  "adminLogin",

                username:
                  username,

                password:
                  password

              })

          }
        );


      const data =
        await response.json();


      if (
        !data.success ||
        !data.sessionToken
      ) {

        showMessage(

          data.message ||
          "Login failed.",

          false

        );

        return;

      }


      /*
       * Store only temporary information.
       *
       * Password is NOT stored.
       */

      sessionStorage.setItem(
        "adminScriptUrl",
        scriptUrl
      );


      sessionStorage.setItem(
        "adminSession",
        data.sessionToken
      );


      window.location.href =
        "activation.html";

    }

    catch (error) {

      console.error(error);


      showMessage(
        "Unable to connect to Google Apps Script.",
        false
      );

    }

    finally {

      button.disabled = false;

      button.textContent =
        "Login";

    }

  }
);


/************************************************************
 * NORMALIZE SCRIPT ID
 ************************************************************/

function normalizeScriptUrl(value) {

  value =
    String(
      value || ""
    ).trim();


  if (
    /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/i
      .test(value)
  ) {

    return value;

  }


  if (
    /^[A-Za-z0-9_-]+$/
      .test(value)
  ) {

    return (

      "https://script.google.com/macros/s/" +

      value +

      "/exec"

    );

  }


  return "";

}


/************************************************************
 * MESSAGE
 ************************************************************/

function showMessage(
  text,
  success
) {

  const message =
    document.getElementById(
      "message"
    );


  message.className =
    "message " +
    (
      success
        ? "success"
        : "error"
    );


  message.textContent =
    text;

}
