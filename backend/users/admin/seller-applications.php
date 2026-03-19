<?php
header("Content-Type: application/json");
require_once "../../auth/config/db.php";

try {
    $sql = "
        SELECT
            s.seller_id,
            u.fname          AS user_name,
            u.email          AS user_email,
            sh.store_name    AS shop_name,
            sh.address,
            sh.city,
            s.status,
            s.created_at
        FROM sellers s
        JOIN users u  ON s.user_id   = u.user_id
        JOIN shop sh ON sh.seller_id = s.seller_id
        WHERE s.status = 'pending'
        ORDER BY s.created_at DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $applications = [];
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data"    => $applications
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}