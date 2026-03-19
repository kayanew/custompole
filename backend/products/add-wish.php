<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "You need to login first"]);
    exit();
}

if (!isset($_SESSION['wish'])) {
    $_SESSION['wish'] = [];
}

$products = [
    1 => ["id" => 1, "name" => "Monge Adult Food", "price" => 2200, "category" => "Dog Food", "description" => "High-quality adult dog food made with balanced nutrients for healthy growth and coat.", "image" => "/mvp/public/assets/images/dogProducts/dog-chain.png"],
    2 => ["id" => 2, "name" => "Monge Puppy Dog", "price" => 3200, "category" => "Dog Food", "description" => "Nutritious puppy food to support development and energy levels during early growth stages.", "image" => "/mvp/public/assets/images/dogProducts/collar.png"],
    3 => ["id" => 3, "name" => "Drools Balls", "price" => 2200, "category" => "Toys", "description" => "Durable chew balls to keep your dog active and entertained while promoting dental health.", "image" => "/mvp/public/assets/images/dogProducts/play-balls.png"],
    4 => ["id" => 4, "name" => "Fur Scrubber", "price" => 1200, "category" => "Grooming", "description" => "Soft fur scrubber for easy grooming and removal of loose hair and dirt from your dog's coat.", "image" => "assets/images/dogProducts/cleaner.png"],
    5 => ["id" => 5, "name" => "Dog Leash", "price" => 900, "category" => "Accessories", "description" => "Sturdy and comfortable leash for daily walks, made with durable material for safety.", "image" => "assets/images/dogProducts/dog-leash.png"]
];

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'fetch':
        fetchCart($products);
        break;
    case 'add':
        addToCart($products);
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

function fetchCart($products) {
    $cart = $_SESSION['cart'] ?? [];
    $cartData = [];
    $total = 0;

    foreach ($cart as $id => $item) {
        if (isset($products[$id])) {
            $product = $products[$id];
            $cartData[$id] = [
                'id' => $id,
                'name' => $product['name'],
                'price' => $product['price'],
                'image' => $product['image'],
                'quantity' => $item['quantity']
            ];
            $total += $product['price'] * $item['quantity'];
        }
    }

    echo json_encode(['cart' => $cartData, 'total' => $total]);
}

function addToCart($products) {
    $id = $_POST['id'] ?? null;
    $quantity = $_POST['quantity'] ?? 1;

    if (!$id || !isset($products[$id])) {
        echo json_encode(['success' => false, 'message' => 'Invalid product']);
        return;
    }

    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]['quantity'] += (int)$quantity;
        echo json_encode(['success' => false, 'status' => 'error', 'message' => 'Product already in cart']);
        return;
    } else {
        $_SESSION['cart'][$id] = ['quantity' => (int)$quantity];
        echo json_encode(['success' => true, 'message' => 'Product added to cart', 'cart_count' => count($_SESSION['cart'])]);
    }
}

function updateCart() {
    $quantities = $_POST['quantities'] ?? [];

    foreach ($quantities as $id => $quantity) {
        if (isset($_SESSION['cart'][$id])) {
            if ($quantity > 0) {
                $_SESSION['cart'][$id]['quantity'] = (int)$quantity;
            } else {
                unset($_SESSION['cart'][$id]);
            }
        }
    }

    echo json_encode(['success' => true, 'message' => 'Cart updated']);
}

function deleteFromCart() {
    $id = $_POST['id'] ?? null;

    if ($id && isset($_SESSION['cart'][$id])) {
        unset($_SESSION['cart'][$id]);
        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Item not found']);
    }
}
?>