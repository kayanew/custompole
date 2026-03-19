<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

require_once '../auth/config/db.php';

$order_id = isset($_POST['order_id']) ? (int) $_POST['order_id'] : 0;
if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid order ID.']);
    exit;
}

$customer_id = (int) $_SESSION['user_id'];

// Cancel only pending orders belonging to this user.
$sql = "UPDATE orders SET order_status = 'cancelled' WHERE order_id = ? AND customer_id = ? AND order_status = 'pending'";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
    exit;
}

mysqli_stmt_bind_param($stmt, 'ii', $order_id, $customer_id);
if (!mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => false, 'message' => 'Could not cancel order.']);
    exit;
}

$affected = mysqli_stmt_affected_rows($stmt);
mysqli_stmt_close($stmt);

if ($affected <= 0) {
    echo json_encode(['success' => false, 'message' => 'Order cannot be cancelled (only pending orders can be cancelled).']);
    exit;
}

// Get items to release stock
$items_sql = "SELECT product_id, quantity FROM order_items WHERE order_id = ?";
$stmt3 = mysqli_prepare($conn, $items_sql);
if ($stmt3) {
    mysqli_stmt_bind_param($stmt3, 'i', $order_id);
    mysqli_stmt_execute($stmt3);
    $items_res = mysqli_stmt_get_result($stmt3);
    $items = mysqli_fetch_all($items_res, MYSQLI_ASSOC);
    mysqli_stmt_close($stmt3);
    
    foreach ($items as $item) {
        $prod_id = (int)$item['product_id'];
        $qty     = (int)$item['quantity'];
        if ($prod_id > 0 && $qty > 0) {
            $update_stock = "UPDATE products SET stock = stock + ? WHERE product_id = ?";
            $u = mysqli_prepare($conn, $update_stock);
            if ($u) {
                mysqli_stmt_bind_param($u, 'ii', $qty, $prod_id);
                mysqli_stmt_execute($u);
                mysqli_stmt_close($u);
            }
        }
    }
}

// Update item fulfillment statuses to cancelled.
$updateItems = "UPDATE order_items SET fulfillment_status = 'cancelled' WHERE order_id = ?";
$stmt2 = mysqli_prepare($conn, $updateItems);
if ($stmt2) {
    mysqli_stmt_bind_param($stmt2, 'i', $order_id);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_close($stmt2);
}

echo json_encode(['success' => true, 'message' => 'Order cancelled successfully.']);
mysqli_close($conn);
