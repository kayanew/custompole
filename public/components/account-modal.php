<div class="account-modal">
  <!-- Guest Section -->
  <div class="guest-account">
    <div class="guest-info">
      <div class="guest-welcome"><strong>Welcome, Guest</strong></div>
      <div class="guest-text">You’re not signed in</div><hr>
    </div>

    <div class="guest-menu">
      <div class="guest-menu-item">
        <ion-icon name="log-in-outline" class="icon-login"></ion-icon>
        <button class="log-modal">Login</button>
      </div>
      <div class="guest-menu-item">
        <ion-icon name="person-add-outline" class="icon-create"></ion-icon>
        <span class="menu-text"><a href="/mvp/public/pages/user-register.php">Create an account</a></span>
      </div>
      <div class="guest-menu-item">
        <ion-icon name="briefcase-outline" class="icon-seller"></ion-icon>
        <span class="menu-text"><a href="/mvp/public/pages/seller-register.php">Become a Seller</a></span>
      </div>
    </div>
  </div>
  <!-- User Section -->
  <div class="user-account">
    <div class="user-info">
      <div class="user-name-text"><?php echo $_SESSION['username']?><hr></div>
    </div>

    <div class="user-menu">
      <!-- <div class="user-menu-item">
        <ion-icon name="person-outline" class="icon-profile"></ion-icon>
        <span class="menu-text">Profile</span>
      </div> -->
      <div class="user-menu-item">
        <ion-icon name="receipt-outline"></ion-icon> 
        <span class="menu-text"><a href="../public/pages/user-orders.php">Orders</a></span>
      </div>
      <div class="user-menu-item">
        <ion-icon name="settings-outline" class="icon-settings"></ion-icon>
        <span class="menu-text">Settings</span>
      </div>
      <div class="menu-divider"></div>
      <div class="user-menu-item logout">
        <ion-icon name="log-out-outline" class="icon-logout"></ion-icon>
        <button type="button" class="log-out-btn">Logout</button>
        <!-- class="menu-btn" -->
      </div>
    </div>
  </div>
</div>