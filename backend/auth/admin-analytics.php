<?php 


header('Content-Type: application/json');
require_once('../auth/config/db.php');
// if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin'){
//     http_response_code(403);
//     echo json_encode(["error" => "unauthorized"]);
//     exit();
// }

$responseData = [];
$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE status='active'");
$row = $result->fetch_assoc();
$responseData['total_users'] = (int) $row['total'];

//Total Sellers
$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role='seller' AND status='active'");
$row = $result->fetch_assoc();
$responseData['total_sellers'] = (int) $row['total'];

// Total Products
$result = $conn->query("SELECT COUNT(*) AS total FROM products");
if (!$result) { echo json_encode(["error" => $conn->error]); exit(); }
$responseData['total_products'] = (int) $result->fetch_assoc()['total'];

// Pending User Requests
$result = $conn->query("SELECT COUNT(*) AS total FROM sellers WHERE status = 'pending'");
if (!$result) { echo json_encode(["error" => $conn->error]); exit(); }
$responseData['pending_requests'] = (int) $result->fetch_assoc()['total'];

echo json_encode($responseData);
exit();
