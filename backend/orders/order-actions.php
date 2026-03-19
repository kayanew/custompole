<?php
session_start();
header('Content-Type: application/json');
require_once '../auth/config/db.php';

if (!isset($_SESSION['seller_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
    exit;
}

$seller_id = (int) $_SESSION['seller_id'];
$action = trim($_REQUEST['action'] ?? '');

switch ($action) {

    case 'fetch_orders':
        $status_filter = trim($_GET['status'] ?? '');
        $status_sql = '';
        $bind_types = 'i';
        $bind_vals = [$seller_id];

        $allowed_statuses = ['pending','processing','shipped','delivered','cancelled'];
        if (in_array(strtolower($status_filter), $allowed_statuses)) {
            $status_sql = 'AND oi.fulfillment_status = ?';
            $bind_types .= 's';
            $bind_vals[] = strtolower($status_filter);
        }

        $sql = "SELECT
                    o.order_id, o.order_number, o.placed_at, o.order_status,
                    o.shipping_name, o.shipping_city, o.shipping_phone,
                    SUM(oi.line_total) AS seller_subtotal,
                    COUNT(oi.order_item_id) AS item_count,
                    CASE WHEN COUNT(DISTINCT oi.fulfillment_status) = 1
                         THEN MAX(oi.fulfillment_status)
                         ELSE 'mixed' END AS fulfillment_status
                FROM orders o
                INNER JOIN order_items oi
                    ON o.order_id = oi.order_id
                    AND oi.seller_id = ? $status_sql
                GROUP BY o.order_id, o.order_number, o.placed_at,
                         o.order_status, o.shipping_name, o.shipping_city,
                         o.shipping_phone
                ORDER BY o.placed_at DESC";

        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) { echo json_encode(['success' => false, 'message' => 'Query prepare failed: ' . mysqli_error($conn)]); exit; }
        mysqli_stmt_bind_param($stmt, $bind_types, ...$bind_vals);
        if (!mysqli_stmt_execute($stmt)) { echo json_encode(['success' => false, 'message' => 'Query execute failed: ' . mysqli_stmt_error($stmt)]); exit; }
        $result = mysqli_stmt_get_result($stmt);

        $orders = [];
        while ($row = mysqli_fetch_assoc($result)) $orders[] = $row;
        mysqli_stmt_close($stmt);

        echo json_encode(['success' => true, 'orders' => $orders, 'count' => count($orders)]);
        break;

    case 'fetch_detail':
        $order_id = (int) ($_GET['order_id'] ?? 0);
        if ($order_id <= 0) { echo json_encode(['success' => false, 'message' => 'Invalid order ID.']); exit; }

        $check = mysqli_prepare($conn, "SELECT COUNT(*) AS cnt FROM order_items WHERE order_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($check, 'ii', $order_id, $seller_id);
        mysqli_stmt_execute($check);
        $check_row = mysqli_fetch_assoc(mysqli_stmt_get_result($check));
        mysqli_stmt_close($check);

        if ((int)$check_row['cnt'] === 0) { echo json_encode(['success' => false, 'message' => 'Order not found or access denied.']); exit; }

        $stmt_order = mysqli_prepare($conn, "SELECT order_id, order_number, placed_at, order_status, payment_status, payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_country, notes FROM orders WHERE order_id = ?");
        mysqli_stmt_bind_param($stmt_order, 'i', $order_id);
        mysqli_stmt_execute($stmt_order);
        $order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt_order));
        mysqli_stmt_close($stmt_order);

        $stmt_items = mysqli_prepare($conn, "SELECT order_item_id, product_id, product_name, product_weight, quantity, unit_price, line_total, commission_rate, commission_amount, seller_payout_amount, fulfillment_status FROM order_items WHERE order_id = ? AND seller_id = ? ORDER BY order_item_id ASC");
        mysqli_stmt_bind_param($stmt_items, 'ii', $order_id, $seller_id);
        mysqli_stmt_execute($stmt_items);
        $items_result = mysqli_stmt_get_result($stmt_items);

        $items = [];
        while ($row = mysqli_fetch_assoc($items_result)) $items[] = $row;
        mysqli_stmt_close($stmt_items);

        echo json_encode(['success' => true, 'order' => $order, 'items' => $items]);
        break;

    case 'update_status':
        $raw = json_decode(file_get_contents('php://input'), true);
        $order_item_id = (int) ($raw['order_item_id'] ?? 0);
        $new_status = trim($raw['new_status'] ?? '');
        $allowed = ['pending','processing','shipped','delivered','cancelled'];

        if ($order_item_id <= 0 || !in_array(strtolower($new_status), $allowed)) {
            echo json_encode(['success' => false, 'message' => 'Invalid input.']); exit;
        }

        $stmt_update = mysqli_prepare($conn, "UPDATE order_items SET fulfillment_status = ? WHERE order_item_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($stmt_update, 'sii', $new_status, $order_item_id, $seller_id);
        mysqli_stmt_execute($stmt_update);
        if (mysqli_stmt_affected_rows($stmt_update) === 0) { mysqli_stmt_close($stmt_update); echo json_encode(['success' => false, 'message' => 'Item not found or access denied.']); exit; }
        mysqli_stmt_close($stmt_update);

        $stmt_check = mysqli_prepare($conn, "SELECT COUNT(*) AS total, SUM(fulfillment_status='delivered') AS delivered, SUM(fulfillment_status='cancelled') AS cancelled FROM order_items WHERE order_id = (SELECT order_id FROM order_items WHERE order_item_id = ?)");
        mysqli_stmt_bind_param($stmt_check, 'i', $order_item_id);
        mysqli_stmt_execute($stmt_check);
        $counts = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt_check));
        mysqli_stmt_close($stmt_check);

        $total = (int)$counts['total'];
        $delivered = (int)$counts['delivered'];
        $cancelled = (int)$counts['cancelled'];

        $new_order_status = null;
        if ($delivered === $total) $new_order_status = 'Delivered';
        elseif ($cancelled === $total) $new_order_status = 'Cancelled';
        elseif ($delivered + $cancelled === $total && $delivered > 0) $new_order_status = 'Partially Delivered';
        elseif (strtolower($new_status) === 'shipped') $new_order_status = 'Shipped';
        elseif (strtolower($new_status) === 'processing') $new_order_status = 'Processing';

        if ($new_order_status) {
            $stmt_ord_update = mysqli_prepare($conn, "UPDATE orders SET order_status = ? WHERE order_id = (SELECT order_id FROM order_items WHERE order_item_id = ?)");
            mysqli_stmt_bind_param($stmt_ord_update, 'si', $new_order_status, $order_item_id);
            mysqli_stmt_execute($stmt_ord_update);
            mysqli_stmt_close($stmt_ord_update);
        }

        echo json_encode(['success' => true, 'message' => 'Status updated to "' . ucfirst($new_status) . '".', 'new_status' => $new_status]);
        break;

    case 'fetch_counts':
        $stmt_counts = mysqli_prepare($conn, "SELECT COUNT(DISTINCT o.order_id) AS total_orders, SUM(oi.fulfillment_status='pending') AS pending, SUM(oi.fulfillment_status='delivered') AS delivered, COALESCE(SUM(oi.seller_payout_amount),0) AS total_earnings FROM order_items oi INNER JOIN orders o ON oi.order_id=o.order_id WHERE oi.seller_id=?");
        mysqli_stmt_bind_param($stmt_counts, 'i', $seller_id);
        mysqli_stmt_execute($stmt_counts);
        $counts = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt_counts));
        mysqli_stmt_close($stmt_counts);

        echo json_encode(['success' => true, 'counts' => $counts]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action: ' . htmlspecialchars($action)]);
        break;
}

mysqli_close($conn);
?>