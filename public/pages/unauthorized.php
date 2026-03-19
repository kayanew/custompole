<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Access Denied</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Lottie Web Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>
    <style>
        /* Reset & base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f0f0f0;
            color: #333;
        }

        /* Container */
        .error-container {
            text-align: center;
            padding: 30px;
            max-width: 420px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* Lottie animation */
        #lottieAnimation {
            width: 100%;
            max-width: 300px;
            margin-bottom: 20px;
        }

        /* Headings and text */
        .error-container h1 {
            color: #ff4b2b;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .error-container p {
            font-size: 16px;
            opacity: 0.85;
            margin-bottom: 25px;
            line-height: 1.5;
        }

        /* Button */
        .error-container a {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff4b2b;
            color: #fff;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: background 0.3s ease;
        }

        .error-container a:hover {
            background-color: #ff2e00;
        }

        /* Responsive adjustments */
        @media(max-width:480px) {
            .error-container {
                padding: 20px;
            }

            .error-container h1 {
                font-size: 28px;
            }

            .error-container p {
                font-size: 14px;
            }
        }
</style>
</head>
<body>

<div class="error-container">
    <!-- Lottie Animation Container -->
    <div id="lottieAnimation"></div>

    <!-- Error Text -->
    <h1>403 | Access Denied</h1>
<p>            You don’t have permission to access this page.<br>
Please log in with the correct account.
</p>
<!-- Redirect Button -->
<a href="/mvp/public/index.php">Go to Login</a>
</div>
<script>
        // Load Lottie animation
        lottie.loadAnimation({
            container: document.getElementById('lottieAnimation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '../assets/animation/error404.json' // Path to your Lottie JSON
        });
    </script>
</body>
</html>
