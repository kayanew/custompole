<?php
session_start();
require_once '../../backend/auth/config/db.php'; // adjust path if needed

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Get action from POST
$action = $_POST['action'] ?? '';

switch ($action) {
    case 'fetch':
        fetchCart($conn);
        break;

    case 'add':
        addToCart($conn);
        break;

    case 'update':
        updateCart();
        break;

    case 'delete':
        deleteFromCart();
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

// ── Fetch cart contents from DB ───────────────────────────────────────────────
function fetchCart($conn) {
    $cart = $_SESSION['cart'];

    if (empty($cart)) {
        echo json_encode(['cart' => [], 'total' => 0]);
        return;
    }

    $cartData = [];
    $total    = 0;

    // Build a safe IN clause from session cart IDs
    $ids         = array_keys($cart);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $types        = str_repeat('i', count($ids));

    $stmt = $conn->prepare(
        "SELECT product_id, name, price, image FROM products WHERE product_id IN ($placeholders)"
    );
    $stmt->bind_param($types, ...$ids);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($product = $result->fetch_assoc()) {
        $id = $product['product_id'];
        if (isset($cart[$id])) {
            $qty          = $cart[$id]['quantity'];
            $cartData[$id] = [
                'id'       => $id,
                'name'     => $product['name'],
                'price'    => $product['price'],
                'image'    => $product['image'],
                'quantity' => $qty,
            ];
            $total += $product['price'] * $qty;
        }
    }
    $stmt->close();

    echo json_encode(['cart' => $cartData, 'total' => $total]);
}

// ── Add item to cart (validates against DB) ───────────────────────────────────
function addToCart($conn) {
    $id       = isset($_POST['id'])       ? (int)$_POST['id']       : 0;
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
        return;
    }

    // Verify product exists in DB and is approved
    $stmt = $conn->prepare(
        "SELECT product_id, name FROM products WHERE product_id = ? AND status = 'approved' LIMIT 1"
    );
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result  = $stmt->get_result();
    $product = $result->fetch_assoc();
    $stmt->close();

    if (!$product) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        return;
    }

    // If already in cart, increment quantity
    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]['quantity'] += $quantity;
        echo json_encode([
            'success'    => false,
            'status'     => 'already_in_cart',
            'message'    => 'Product already in cart — quantity updated',
            'cart_count' => count($_SESSION['cart']),
        ]);
        return;
    }

    // Add new item
    $_SESSION['cart'][$id] = ['quantity' => $quantity];

    echo json_encode([
        'success'    => true,
        'message'    => 'Product added to cart',
        'cart_count' => count($_SESSION['cart']),
    ]);
}

// ── Update cart quantities ────────────────────────────────────────────────────
function updateCart() {
    $quantities = $_POST['quantities'] ?? [];

    foreach ($quantities as $id => $quantity) {
        $id       = (int)$id;
        $quantity = (int)$quantity;

        if (isset($_SESSION['cart'][$id])) {
            if ($quantity > 0) {
                $_SESSION['cart'][$id]['quantity'] = $quantity;
            } else {
                unset($_SESSION['cart'][$id]);
            }
        }
    }

    echo json_encode(['success' => true, 'message' => 'Cart updated']);
}

// ── Delete item from cart ─────────────────────────────────────────────────────
function deleteFromCart() {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

    if ($id && isset($_SESSION['cart'][$id])) {
        unset($_SESSION['cart'][$id]);
        echo json_encode([
            'success'    => true,
            'message'    => 'Item removed from cart',
            'cart_count' => count($_SESSION['cart']),
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
    }
}
?>