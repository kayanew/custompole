<?php
header('Content-Type: application/json');
require_once $_SERVER['DOCUMENT_ROOT'] . '/mvp/backend/auth/config/db.php';
require $_SERVER['DOCUMENT_ROOT'] . '/mvp/backend/auth/config/sanitizedata.php';

try {
    if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $result = validateUser($_POST, $conn);

    if (!$result['success']) {
        echo json_encode(["status" => "error", "message" => $result['errors']]);
        exit;
    }

    $fname          = $result['fname'];
    $email          = $result['email'];
    $hashedPassword = $result['password'];

    $stmt = $conn->prepare("INSERT INTO users(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    echo json_encode(["status" => "success", "message" => "Signup Successful"]);

} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(["status" => "error", "message" => "Something went wrong"]);
    exit;
}

function validateUser($data, $conn) {
    $errors = [];

    $fname    = sanitizeData($data['fname']      ?? '');
    $email    = sanitizeData($data['reg-email']  ?? '');
    $password = $data['new-pass']                ?? '';

    $nameRegex = "/^[a-zA-ZÀ-ÿ]+([ '-][a-zA-ZÀ-ÿ]+)*$/u";
    if (empty($fname)) {
        $errors[] = "Name field is required";
    } elseif (!preg_match($nameRegex, $fname)) {
        $errors[] = "Invalid name. Only letters, spaces, hyphens, and apostrophes are allowed";
    } elseif (strlen($fname) < 2 || strlen($fname) > 50) {
        $errors[] = "Name must be 2–50 characters long";
    }

    if (empty($email)) {
        $errors[] = "Email field is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    } elseif (strlen($email) > 254) {
        $errors[] = "Email address is too long";
    }

    if (empty($password)) {
        $errors[] = "Password field is required";
    } elseif (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters";
    } elseif (strlen($password) > 72) {
        $errors[] = "Password must not exceed 72 characters";
    } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/', $password)) {
        $errors[] = "Password must include uppercase, lowercase, number, and special character";
    }

    if (empty($errors)) {
        $check = $conn->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
        if (!$check) throw new Exception("Prepare failed: " . $conn->error);
        $check->bind_param("s", $email);
        if (!$check->execute()) throw new Exception("Execute failed: " . $check->error);
        $check->store_result();
        if ($check->num_rows > 0) {
            $errors[] = "Email is already registered";
        }
        $check->close();
    }

    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }

    return [
        'success'  => true,
        'fname'    => $fname,
        'email'    => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT)
    ];
}
?>