<?php
// ob_start();
session_start();
header('Content-Type: application/json');

require 'config/db.php';
require 'config/sanitizedata.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    ob_end_flush();
    exit;
}

$lemail = sanitizeData($_POST["log-email"] ?? '');
$lpass  = $_POST["log-pass"] ?? '';

if (empty($lemail) || empty($lpass)) {
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    ob_end_flush();
    exit;
}

$stmt = $conn->prepare("SELECT user_id, fname, email, password, role FROM users WHERE email = ?");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "DB prepare failed."]);
    ob_end_flush();
    exit;
}

$stmt->bind_param("s", $lemail);
$stmt->execute();
$stmt->bind_result($userId, $username, $userMail, $dbpassword, $role);
$found = $stmt->fetch();
$stmt->close();

if (!$found) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    ob_end_flush();
    exit;
}

if (!password_verify($lpass, $dbpassword)) {
    echo json_encode(["status" => "incorrect_password"]);
    ob_end_flush();
    exit;
}

$_SESSION['user_id']   = $userId;
$_SESSION['username']  = $username;
$_SESSION['usermail']  = $userMail;
$_SESSION['role']      = $role;
$_SESSION['logged-in'] = true;

if ($role === 'admin') {

    echo json_encode(["status" => "redirect_admin"]);

} elseif ($role === 'seller') {

    $sellerStmt = $conn->prepare("SELECT seller_id FROM sellers WHERE user_id = ?");
    if (!$sellerStmt) {
        echo json_encode(["status" => "error", "message" => "DB prepare failed for seller."]);
        ob_end_flush();
        exit;
    }

    $sellerStmt->bind_param("i", $userId);
    $sellerStmt->execute();
    $sellerStmt->bind_result($sellerId);
    $sellerStmt->fetch();
    $sellerStmt->close();

    if (!$sellerId) {
        echo json_encode(["status" => "error", "message" => "Seller account not found."]);
        ob_end_flush();
        exit;
    }

    $_SESSION['seller_id'] = $sellerId;
    echo json_encode(["status" => "redirect_seller"]);

} else {

    echo json_encode(["status" => "redirect_user"]);

}

$conn->close();
ob_end_flush();
exit;