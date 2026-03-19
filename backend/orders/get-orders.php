<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

require_once '../auth/config/db.php';

$customer_id = (int) $_SESSION['user_id'];

$order_sql = "SELECT order_id, order_number, shipping_city, shipping_address, subtotal, shipping_total, grand_total, payment_method, payment_status, order_status, placed_at FROM orders WHERE customer_id = ? ORDER BY placed_at DESC";
$stmt = mysqli_prepare($conn, $order_sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, 'i', $customer_id);
if (!mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => false, 'message' => 'Database error on execute.']);
    exit;
}

$result = mysqli_stmt_get_result($stmt);
$orders = mysqli_fetch_all($result, MYSQLI_ASSOC);
mysqli_stmt_close($stmt);

if (empty($orders)) {
    echo json_encode(['success' => true, 'orders' => []]);
    exit;
}

$orderIds = array_column($orders, 'order_id');
$idsCsv = implode(',', array_map('intval', $orderIds));

$item_sql = "SELECT oi.order_id, oi.product_id, oi.product_name, oi.product_weight, oi.sku, oi.quantity, oi.unit_price, oi.line_total, oi.fulfillment_status, p.stock AS current_stock FROM order_items oi LEFT JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id IN ($idsCsv) ORDER BY oi.order_item_id ASC";
$item_res = mysqli_query($conn, $item_sql);
if ($item_res === false) {
    echo json_encode(['success' => false, 'message' => 'Could not fetch order items.']);
    exit;
}

$itemsByOrder = [];
while ($item = mysqli_fetch_assoc($item_res)) {
    $item['current_stock'] = isset($item['current_stock']) ? (int)$item['current_stock'] : null;
    $itemsByOrder[$item['order_id']][] = $item;
}

foreach ($orders as &$order) {
    $order['items'] = $itemsByOrder[$order['order_id']] ?? [];
}
unset($order);

echo json_encode(['success' => true, 'orders' => $orders]);

mysqli_close($conn);
?>
