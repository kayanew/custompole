<?php
header('Content-Type: application/json');
require_once '../../auth/config/db.php';

// ── GET — fetch products ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $filter      = trim($_GET['filter'] ?? 'pending');
    $statusWhere = $filter === 'all' ? "p.status != 'pending'" : "p.status = 'pending'";

    $result = $conn->query("
        SELECT
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            p.status,
            p.created_at,
            c.category_name  AS category,
            pt.type_name     AS product_type,
            u.fname          AS seller_name,
            u.email          AS seller_email
        FROM products p
        LEFT JOIN users         u  ON p.seller_id   = u.user_id
        LEFT JOIN categories    c  ON p.category_id = c.category_id
        LEFT JOIN product_types pt ON p.type_id     = pt.type_id
        WHERE $statusWhere
        ORDER BY p.created_at DESC
    ");

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $result->fetch_all(MYSQLI_ASSOC)]);
    exit;
}

// ── POST — approve / reject / delete ─────────────────────────────────────────
// Removed: suspend / activate actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $body       = json_decode(file_get_contents('php://input'), true);
    $product_id = isset($body['product_id']) ? (int) $body['product_id'] : 0;
    $action     = $body['action'] ?? '';

    // Only allow the three remaining actions
    if (!$product_id || !in_array($action, ['approve', 'reject', 'delete'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    if ($action === 'delete') {
        $stmt = $conn->prepare("DELETE FROM products WHERE product_id = ?");
        $stmt->bind_param("i", $product_id);

    } elseif ($action === 'approve') {
        $newStatus = 'approved';
        $stmt = $conn->prepare("UPDATE products SET status = ? WHERE product_id = ?");
        $stmt->bind_param("si", $newStatus, $product_id);

    } elseif ($action === 'reject') {
        $newStatus = 'rejected';
        $reason    = trim($body['reason'] ?? '');

        if ($reason !== '') {
            $stmt = $conn->prepare("UPDATE products SET status = ?, rejected_reason = ? WHERE product_id = ?");
            $stmt->bind_param("ssi", $newStatus, $reason, $product_id);
        } else {
            $stmt = $conn->prepare("UPDATE products SET status = ? WHERE product_id = ?");
            $stmt->bind_param("si", $newStatus, $product_id);
        }
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $stmt->error]);
    }

    $stmt->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
?>