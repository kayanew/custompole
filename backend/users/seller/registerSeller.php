<?php
header('Content-Type: application/json');
require_once('../../auth/config/db.php');
require '../../auth/config/sanitizedata.php';

$transactionStarted = false;

try {
    // if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    //     throw new Exception("Invalid Request");
    // }

    $result = validateSeller($_POST, $conn);

    if (isset($result[0])) {
        echo json_encode(["status" => "error", "message" => $result]);
        exit;
    }

    $shopName       = $result['shopName'];
    $ownerName      = $result['ownerName'];
    $shopAddress    = $result['shopAddress'];
    $city           = $result['city'];
    $sellerEmail    = $result['sellerEmail'];
    $contact        = $result['contact'];
    $hashed_password = $result['password'];

    $role   = "seller";
    $status = "pending";

    $conn->begin_transaction();
    $transactionStarted = true;

    // Insert into users
    $stmt1 = $conn->prepare("INSERT INTO users(fname, email, password, role) VALUES(?, ?, ?, ?)");
    if (!$stmt1) throw new Exception($conn->error);
    $stmt1->bind_param("ssss", $ownerName, $sellerEmail, $hashed_password, $role);
    if (!$stmt1->execute()) throw new Exception($stmt1->error);
    $user_id = $conn->insert_id;
    $stmt1->close();

    // Insert into sellers
    $stmt2 = $conn->prepare("INSERT INTO sellers(user_id, business_phone, status) VALUES(?, ?, ?)");
    if (!$stmt2) throw new Exception($conn->error);
    $stmt2->bind_param("iss", $user_id, $contact, $status);
    if (!$stmt2->execute()) throw new Exception($stmt2->error);
    $seller_id = $conn->insert_id;
    $stmt2->close();

    // Insert into shop
    $stmt3 = $conn->prepare("INSERT INTO shop(seller_id, store_name, address, city) VALUES(?, ?, ?, ?)");
    if (!$stmt3) throw new Exception($conn->error);
    $stmt3->bind_param("isss", $seller_id, $shopName, $shopAddress, $city);
    if (!$stmt3->execute()) throw new Exception($stmt3->error);
    $stmt3->close();

    $conn->commit();

    echo json_encode([
        "status"  => "success",
        "message" => "Registration successful. Wait for admin approval."
    ]);

} catch (Throwable $e) {
    if ($transactionStarted) {
        $conn->rollback();
    }
    error_log($e->getMessage());
    echo json_encode([
        "status"  => "error",
        "message" => "Something went wrong. Try again later."
    ]);
}


function validateSeller($data, $conn) {
    $errors = [];

    $shopName    = sanitizeData($data['shop_name']   ?? '');
    $ownerName   = sanitizeData($data['owner_name']  ?? '');
    $shopAddress = sanitizeData($data['shop_address'] ?? '');
    $city        = sanitizeData($data['city']        ?? '');
    $sellerEmail = sanitizeData($data['email']       ?? '');
    $contact     = sanitizeData($data['phone']       ?? '');
    $rawPassword = $data['password']                 ?? '';

    $textRegex = "/^[a-zA-Z ]+$/";

    if (empty($shopName)) {
        $errors[] = "Provide shop name";
    } elseif (!preg_match($textRegex, $shopName)) {
        $errors[] = "Use letters and spaces for shop name";
    }

    if (empty($ownerName)) {
        $errors[] = "Provide owner name";
    } elseif (!preg_match($textRegex, $ownerName)) {
        $errors[] = "Use letters and spaces for owner name";
    }

    if (empty($shopAddress)) {
        $errors[] = "Shop address is required";
    }

    if (empty($city)) {
        $errors[] = "City is required";
    }

    if (empty($contact)) {
        $errors[] = "Contact number is required";
    } elseif (!preg_match('/^(97|98)\d{8}$/', $contact)) {
        $errors[] = "Use a valid Nepali phone number (starts with 97 or 98)";
    }

    if (empty($sellerEmail)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($sellerEmail, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Use a valid email format";
    }

    if (strlen($rawPassword) < 8) {
        $errors[] = "Password must be at least 8 characters";
    }

    if (empty($errors)) {
        $check = $conn->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
        if (!$check) throw new Exception("Prepare failed: " . $conn->error);
        $check->bind_param("s", $sellerEmail);
        if (!$check->execute()) throw new Exception("Execution failed: " . $check->error);
        $check->store_result();
        if ($check->num_rows > 0) {
            $errors[] = "Email already registered";
        }
        $check->close();
    }

    if (!empty($errors)) {
        return $errors;
    }

    return [
        'shopName'    => $shopName,
        'ownerName'   => $ownerName,
        'shopAddress' => $shopAddress,
        'city'        => $city,
        'sellerEmail' => $sellerEmail,
        'contact'     => $contact,
        'password'    => password_hash($rawPassword, PASSWORD_DEFAULT)
    ];
}