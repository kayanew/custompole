<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../auth/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT
                o.order_id,
                o.order_number,
                o.customer_id,
                u.fname AS customer_name,
                u.email AS customer_email,
                o.shipping_city,
                o.shipping_address,
                o.shipping_phone,
                o.subtotal,
                o.shipping_total,
                o.grand_total,
                o.payment_method,
                o.payment_status,
                o.order_status,
                o.placed_at
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            ORDER BY o.placed_at DESC";
    $result = $conn->query($sql);
    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $conn->error]);
        exit;
    }

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $order_id = (int) $row['order_id'];
        $items_res = $conn->query("SELECT product_name, quantity, unit_price, line_total, fulfillment_status FROM order_items WHERE order_id = $order_id");
        $items = [];
        if ($items_res) {
            while ($item = $items_res->fetch_assoc()) {
                $items[] = $item;
            }
        }
        $row['items'] = $items;
        $orders[] = $row;
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
    exit;
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $order_id = isset($body['order_id']) ? (int) $body['order_id'] : 0;
    $status = trim($body['status'] ?? '');

    $allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Partially Delivered'];
    if ($order_id <= 0 || !in_array($status, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE orders SET order_status = ? WHERE order_id = ?");
    $stmt->bind_param('si', $status, $order_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Order status updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $stmt->error]);
    }
    $stmt->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed']);
