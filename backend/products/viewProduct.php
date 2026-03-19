<?php
session_start();
header('Content-Type: application/json');
require_once '../../auth/config/db.php';

// ── Auth guard ────────────────────────────────────────────────────────────────
if (!isset($_SESSION['seller_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
    exit;
}

$seller_id = (int) $_SESSION['seller_id'];
session_write_close(); // Release session lock immediately


// ── GET — Fetch this seller's products ───────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = $conn->prepare("
        SELECT
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.weight,
            p.image,
            p.status,
            p.created_at,
            c.category_name  AS category,
            pt.type_name     AS product_type
        FROM products p
        LEFT JOIN categories    c  ON p.category_id = c.category_id
        LEFT JOIN product_types pt ON p.type_id     = pt.type_id
        WHERE p.seller_id = ?
        ORDER BY p.created_at DESC
    ");

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Query prepare failed: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('i', $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    echo json_encode([
        'success' => true,
        'data'    => $result->fetch_all(MYSQLI_ASSOC)
    ]);

    $stmt->close();
    exit;
}


// ── POST — Delete product ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $body       = json_decode(file_get_contents('php://input'), true);
    $product_id = isset($body['product_id']) ? (int) $body['product_id'] : 0;
    $action     = trim($body['action'] ?? '');

    if (!$product_id || !in_array($action, ['delete', 'update_stock'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    // ── Delete — seller can only delete their own product ─────────────────────
    if ($action === 'delete') {
        $stmt = $conn->prepare(
            "DELETE FROM products WHERE product_id = ? AND seller_id = ?"
        );
        $stmt->bind_param('ii', $product_id, $seller_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                echo json_encode(['success' => false, 'message' => 'Product not found or access denied.']);
            } else {
                echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Delete failed: ' . $stmt->error]);
        }

        $stmt->close();
        exit;
    }

    // ── Update stock ──────────────────────────────────────────────────────────
    if ($action === 'update_stock') {
        $new_stock = isset($body['stock']) ? (int) $body['stock'] : -1;

        if ($new_stock < 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid stock value.']);
            exit;
        }

        $stmt = $conn->prepare(
            "UPDATE products SET stock = ? WHERE product_id = ? AND seller_id = ?"
        );
        $stmt->bind_param('iii', $new_stock, $product_id, $seller_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                echo json_encode(['success' => false, 'message' => 'Product not found or access denied.']);
            } else {
                echo json_encode(['success' => true, 'message' => 'Stock updated successfully.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Stock update failed: ' . $stmt->error]);
        }

        $stmt->close();
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Method not allowed.']);