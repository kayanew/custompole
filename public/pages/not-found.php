<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Product Not Found</title>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(232, 237, 232, 0.45);
    padding: 20px;
}

.not-found-container {
    max-width: 650px;
    width: 100%;
    text-align: center;
    background: 
        radial-gradient(ellipse at 20% 50%, rgba(7, 52, 32, 0.07) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(7, 52, 32, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 80%, rgba(7, 52, 32, 0.04) 0%, transparent 40%),
        linear-gradient(135deg, rgba(7, 52, 32, 0.03) 0%, transparent 50%, rgba(7, 52, 32, 0.06) 100%);
    padding: 60px 35px;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.not-found-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 45px rgba(0,0,0,0.12);
}

.not-found-icon {
    font-size: 80px;
    margin-bottom: 25px;
    animation: bounce 1.2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.not-found-title {
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #2c6e49;
}

.not-found-text {
    color: #555;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 35px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}

.actions a {
    text-decoration: none;
    padding: 13px 22px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #111;
    color: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-outline {
    border: 2px solid #111;
    color: #111;
}

.btn-primary:hover {
    background: #333;
}

.btn-outline:hover {
    background: #111;
    color: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
    .not-found-title {
        font-size: 28px;
    }
    .not-found-text {
        font-size: 15px;
    }
    .actions a {
        font-size: 14px;
        padding: 11px 18px;
    }
}
</style>
</head>

<body>
<div class="not-found-container">

    <div class="not-found-icon">🐾</div>

    <h1 class="not-found-title">Product Not Found</h1>

    <p class="not-found-text">
        Oops! The product you're looking for doesn't exist or may have been removed.
    </p>

    <div class="actions">
        <a href="../pages/product-catalog.php" class="btn-outline">Browse Products</a>
        <a href="../index.php" class="btn-primary">Go Home</a>
    </div>

</div>
</body>
</html>