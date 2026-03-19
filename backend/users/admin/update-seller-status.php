<?php
header("Content-Type: application/json");
require_once "../../auth/config/db.php";

try {
    $body = json_decode(file_get_contents("php://input"), true);

    $seller_id = intval($body['seller_id'] ?? 0);
    $status    = $body['status'] ?? '';

    // Validate inputs
    if (!$seller_id) {
        throw new Exception("Invalid seller ID.");
    }

    $allowed = ['approved', 'rejected', 'suspended'];
    if (!in_array($status, $allowed)) {
        throw new Exception("Invalid status value. Allowed: " . implode(', ', $allowed));
    }

    $stmt = $conn->prepare("UPDATE sellers SET status = ? WHERE seller_id = ?");
    $stmt->bind_param("si", $status, $seller_id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        throw new Exception("Seller not found or status unchanged.");
    }

    echo json_encode([
        "success" => true,
        "message" => "Seller status updated to '$status'."
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}