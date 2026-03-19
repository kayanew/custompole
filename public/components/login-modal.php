<div id="login-modal" class="login-modal">
    <div class="login-bar">
      <button class="close-btn" style="font-size: 1.9rem">&times;</button>
      <form name="login-form" class="login-form" id="login-form" action="../../backend/login.php" method="POST">
        <label for="log-email">Email</label>
        <input type="email" id="login-email" name="log-email" placeholder="abc@example.com" required />
        <label for="log-pass">Password<span class="pass-error">Invalid Password</span></label>
        <input type="password" id="login-pass" name="log-pass" placeholder="my password" required />
        
        <div class="btn">
          <button type="submit" class="login-btn"><strong>Login</strong></button>
        </div>
        <a href="#main" id="fp">Forgot password?</a>
        <hr />
        <div class="reg-btn">
          <a href="/mvp/public/pages/user-register.php" class="register-link">Create an account</a>
        </div>
      </form>
    </div>
</div>