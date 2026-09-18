/************************************************************
 * ADMIN LOGIN
 ************************************************************/

const form =
  document.getElementById("loginForm");


form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const scriptInput =
      document
        .getElementById("scriptId")
        .value
        .trim();


    const username =
      document
        .getElementById("username")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    const button =
      document.getElementById("loginButton");


    const message =
      document.getElementById("message");


    const scriptUrl =
      normalizeScriptUrl(scriptInput);


    if (!scriptUrl) {

      showMessage(
        "Invalid Google Apps Script ID or Web App URL.",
        false
      );

      return;

    }


    button.disabled = true;

    button.textContent =
      "Logging in...";


    showMessage(
      "Connecting to Google Apps Script...",
      true
    );


    try {

      /*
       * IMPORTANT:
       *
       * There is NO connection token.
       *
       * Only:
       *
       * action
       * username
       * password
       */

      const requestBody = {

        action:
          "adminLogin",

        username:
          username,

        password:
          password

      };


      console.log(
        "Admin Login URL:",
        scriptUrl
      );


      console.log(
        "Admin Login Action:",
        requestBody.action
      );


      const response =
        await fetch(
          scriptUrl,
          {

            method:
              "POST",

            body:
              JSON.stringify(
                requestBody
              )

          }
        );


      if (!response.ok) {

        throw new Error(
          "HTTP " +
          response.status
        );

      }


      const data =
        await response.json();


      console.log(
        "Admin Login Response:",
        data
      );


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
       * Store only:
       *
       * Script URL
       * Temporary admin session
       *
       * Username/password are NOT stored.
       */

      sessionStorage.setItem(
        "adminScriptUrl",
        scriptUrl
      );


      sessionStorage.setItem(
        "adminSession",
        data.sessionToken
      );


      /*
       * Remove any old values from
       * previous versions of the project.
       */

      localStorage.removeItem(
        "connectionToken"
      );


      localStorage.removeItem(
        "scannerToken"
      );


      localStorage.removeItem(
        "eventToken"
      );


      sessionStorage.removeItem(
        "connectionToken"
      );


      window.location.replace(
        "activation.html"
      );

    }

    catch (error) {

      console.error(
        "Admin Login Error:",
        error
      );


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
 * NORMALIZE SCRIPT URL
 ************************************************************/

function normalizeScriptUrl(value) {

  value =
    String(
      value || ""
    ).trim();


  /*
   * Complete Web App URL
   */

  if (
    /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/i
      .test(value)
  ) {

    /*
     * Remove query parameters if someone
     * pasted ?action=status, etc.
     */

    return value.split("?")[0];

  }


  /*
   * Deployment ID only
   */

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
