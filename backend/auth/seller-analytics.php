<?php 
session_start();
header('Content-Type: application/json');

require_once '../auth/config/db.php';

// Session validation
if(!isset($_SESSION['seller_id'])){
    http_response_code(403);
    echo json_encode(["error" => "unauthorized"]);
    exit();
}

$sid = $_SESSION['seller_id'];
$responseData = [];

// Seller-specific products
$stmt = $conn->prepare("SELECT COUNT(*) AS total FROM products WHERE oid = ?");
$stmt->bind_param("i", $sid);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$responseData['seller_products'] = (int) $row['total'];
$stmt->close();

// Total sellers
$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role = 'seller'");
$row = $result->fetch_assoc();
$responseData['total_sellers'] = (int) $row['total'];

// Total products
$result = $conn->query("SELECT COUNT(*) AS total FROM products");
$row = $result->fetch_assoc();
$responseData['total_products'] = (int) $row['total'];

// Pending user requests
$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role = 'pending'");
$row = $result->fetch_assoc();
$responseData['pending_requests'] = (int) $row['total'];

echo json_encode($responseData);
exit();