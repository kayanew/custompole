<?php
session_start();
header('Content-Type: application/json');
require_once '../../auth/config/db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method.");
    }
    $seller_id = isset($_SESSION['seller_id']) ? (int)$_SESSION['seller_id'] : 0;
    $category_id  = isset($_POST['category'])     ? (int)$_POST['category']     : 0;
    $name         = isset($_POST['name'])         ? trim($_POST['name'])        : '';
    $description  = isset($_POST['description'])  ? trim($_POST['description']) : '';
    $price        = isset($_POST['price'])        ? (float)$_POST['price']      : 0;
    $stock        = isset($_POST['stock'])        ? (int)$_POST['stock']        : 0;

    $errors = [];
    if (!$seller_id)                     $errors[] = "Invalid seller.";
    if (!$category_id)                   $errors[] = "Please select a category.";
    if (empty($name))                    $errors[] = "Product name is required.";
    if (empty($description))             $errors[] = "Description is required.";
    if ($price <= 0)                     $errors[] = "Price must be greater than 0.";
    if ($stock < 0)                      $errors[] = "Stock cannot be negative.";
    if (empty($_FILES['image']['name'])) $errors[] = "Product image is required.";

    if (!empty($errors)) {
        echo json_encode(["status" => "error", "message" => $errors]);
        exit();
    }

    // ─── Image Upload ─────────────────────────────────────────
    $image = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize = 2 * 1024 * 1024;

    if (!in_array($image['type'], $allowedTypes)) {
        throw new Exception("Only JPG, PNG, and WEBP images are allowed.");
    }
    if ($image['size'] > $maxSize) {
        throw new Exception("Image must be under 2MB.");
    }

    $uploadDir = '../../../public/assets/images/products/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
    $filename = uniqid('product_', true) . '.' . $ext;

    if (!move_uploaded_file($image['tmp_name'], $uploadDir . $filename)) {
        throw new Exception("Failed to save image. Check folder permissions.");
    }

    $imagePath = 'assets/images/products/' . $filename;  // Relative URL for DB

    // ─── Insert Product ───────────────────────────────────────
    $status = 'pending';
    $stmt = $conn->prepare("
        INSERT INTO products (seller_id, category_id, name, description, price, stock, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);

    $stmt->bind_param("iissdiss", $seller_id, $category_id, $name, $description, $price, $stock, $imagePath, $status);

    if (!$stmt->execute()) throw new Exception("Execute failed: " . $stmt->error);
    $stmt->close();

    echo json_encode([
        "status"  => "success",
        "message" => "Product submitted successfully. Waiting for admin approval."
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
