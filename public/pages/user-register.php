<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Create an Account</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/user-register.css">
    <link rel="stylesheet" href="../assets/css/toast.css">
    <link rel="stylesheet" href="../assets/css/mediaqueries.css">
    <link rel="stylesheet" href="../assets/css/loader.css">
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  </head>
  <body>
    <div class="main-page">
      <div class="auth-info">
        <h2>Join us Today</h2>
        <p>
          Create an account to unlock faster checkout, exclusive deals, and
          priority access to new arrivals and limited-time offers. Don't miss
          out—sign up now for a smarter, more personalized shopping experience!
        </p>
      </div>
      <div class="auth-container">
        <div class="card">
          <h2>Create your account</h2>
          <p class="subtitle">Join us and get started in minutes</p>
          <form action="../backend/userDetails.php" method="post" id="signupForm">

            <div class="field">
              <label for="fname">Full Name</label>
              <input type="text" id="fname" name="fname" placeholder="Enter your name" required/>
                <b><span id="nameError" class="errorInfo"></span></b>
            </div>

            <div class="field">
              <label for="reg-email">Email
                <b><span id="emailError" class="errorInfo">Invalid Email</span></b>
              </label>
              <input type="email" id="reg-email" name="reg-email" placeholder="Your email address" required/>
            </div>

            <div class="field">
              <label for="new-pass">Password
                <b><span id="invalid-pass" class="errorInfo">Use strong password</span></b>
                <b><span id="pass-length" class="errorInfo">At least 8 letters</span></b>
              </label>
              <div class="input-wrapper">
                <input type="password" name="new-pass" id="new-pass" placeholder="New password" required/>
                <span class="toggle-icon" onclick="toggleField('new-pass', this)">
                  <ion-icon name="eye-outline"></ion-icon>
                </span>
              </div>
            </div>

            <div class="field">
              <label for="confirm-password">Confirm Password
                <span id="not-confirm" class="errorInfo"><b>Passwords do not match</b></span>
              </label>
              <div class="input-wrapper">
                <input type="password" id="confirm-password" placeholder="Re-enter your password" required/>
                <span class="toggle-icon" onclick="toggleField('confirm-password', this)">
                  <ion-icon name="eye-outline"></ion-icon>
                </span>
              </div>
            </div>

            <button type="submit">Create Account <div class="loader"><div></div></div></button>
          </form>
          <p class="footer-text">
            Already have an account? <a href="../index.php">Login</a>
          </p>
        </div>
      </div>
    </div>
    <div class="toast" id="toast"></div>
    <script src="../assets/js/signup.js"></script>
  </body>
</html>