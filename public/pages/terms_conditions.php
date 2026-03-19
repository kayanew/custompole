<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Seller Terms & Agreement</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
    }

    body {
        background: #f0f2f5;
        display: flex;
        justify-content: center;
        padding: 50px 20px;
        color: #333;
    }

    .terms-container {
        max-width: 900px;
        width: 100%;
    }

    .terms-card {
        background: #fff;
        padding: 50px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border-left: 6px solid #2c6e49;
    }

    h1 {
        color: #2c6e49;
        font-size: 2.2rem;
        margin-bottom: 10px;
    }

    .update {
        color: #888;
        font-size: 0.9rem;
        margin-bottom: 30px;
    }

    section {
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    h3 {
        font-size: 1.2rem;
        margin-bottom: 8px;
        color: #1f4d35;
    }

    p {
        font-size: 1rem;
        line-height: 1.8;
        color: #555;
    }

    .back-btn {
        margin-top: 40px;
        text-align: center;
    }

    .back-btn a {
        display: inline-block;
        text-decoration: none;
        background: #2c6e49;
        color: #fff;
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .back-btn a:hover {
        background: #1f4d35;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }

    /* Responsive */
    @media(max-width:768px) {
        .terms-card {
            padding: 30px;
            border-left-width: 4px;
        }
        h1 { font-size: 1.8rem; }
        h3 { font-size: 1.1rem; }
        p { font-size: 0.95rem; }
    }

    @media(max-width:480px) {
        .terms-card { padding: 20px; }
        .back-btn a { width: 100%; padding: 12px; }
    }
</style>
</head>
<body>

<div class="terms-container">
    <div class="terms-card">
        <h1>Seller Terms & Agreement</h1>
        <p class="update">Last updated: January 2026</p>

        <section>
            <h3>1. Seller Account Responsibility</h3>
            <p>By registering as a seller, you agree to provide accurate business and personal information.
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activities that occur under your account.</p>
        </section>

        <section>
            <h3>2. Product Listing Policy</h3>
            <p>Sellers must ensure that all listed products are legal, authentic, and accurately described.
            Any misleading, counterfeit, or prohibited items may result in account suspension or removal.</p>
        </section>

        <section>
            <h3>3. Payments & Commission</h3>
            <p>The platform may charge a small commission on successful sales. Sellers agree to comply with
            the payment policies and provide valid banking or payment details for transactions.</p>
        </section>

        <section>
            <h3>4. Prohibited Activities</h3>
            <p>Sellers must not engage in fraudulent activities, fake orders, spam listings, or any behavior
            that harms customers or the platform’s reputation.</p>
        </section>

        <section>
            <h3>5. Account Termination</h3>
            <p>We reserve the right to suspend or terminate seller accounts that violate our policies
            without prior notice.</p>
        </section>

        <section>
            <h3>6. Agreement</h3>
            <p>By registering as a seller, you acknowledge that you have read, understood, and agreed
               to these terms and conditions.</p>
        </section>

        <div class="back-btn">
            <a href="seller_registration.php">Back to Registration</a>
        </div>
    </div>
</div>

</body>
</html>
