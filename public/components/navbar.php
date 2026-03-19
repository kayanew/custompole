<header class="navbar-container">
  <div class="header-main" style="background-color: #fafafa; height: 8rem;">
    <div class="logo-container">
      <a href="/mvp/public/index.php"><strong>Pupkit</strong></a>
    </div>

    <form class="search-bar" action="/mvp/public/pages/product-catalog.php" method="GET">
      <input 
        type="search" 
        name="search" 
        class="search-field" 
        placeholder="Enter your product name..." 
        required
      />
      <button type="submit" class="search-btn">
        <img src="/mvp/public/assets/images/index/search.svg" alt="search-btn" style="height: 20px; width: 30px;">
      </button>
    </form>

    <div class="top-right-icons">
      <button class="action-btn">
        <img src="/mvp/public/assets/images/index/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn">
        <img src="/mvp/public/assets/images/index/cart.svg" alt="cart" class="show-cart ion-icon">
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn user-login">
        <img src="/mvp/public/assets/images/index/usericon.svg" alt="userIcon" class="ion-icon">
      </button>
    </div>
  </div>

  <!-- Mobile Bottom Nav -->
  <div class="mobile-bottom-navigation">
      <button class="action-btn"><ion-icon name="menu-outline"></ion-icon></button>
      <button class="action-btn">
        <img src="/mvp/public/assets/images/index/cart.svg" alt="cart" class="show-cart ion-icon">
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn" onclick="window.location.href='index.html'">
        <ion-icon name="home-outline"></ion-icon>
      </button>
      <button class="action-btn">
        <img src="/mvp/public/assets/images/index/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn user-login">
        <img src="/mvp/public/assets/images/index/usericon.svg" alt="userIcon" class="ion-icon">
      </button>
  </div>
</header>