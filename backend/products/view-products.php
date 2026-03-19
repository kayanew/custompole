<?php
session_start();
header('Content-Type: application/json');

require_once '../auth/config/db.php';

if (!isset($_SESSION['seller_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Seller login required.']);
    exit;
}

$seller_id = $_SESSION['seller_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // action comes from $_POST for multipart/form-data (update_product),
    // or from json body for delete / update_stock (application/json)
    $action = $_POST['action'] ?? '';

    if (!$action) {
        // Fallback: try JSON body (delete / update_stock still send JSON)
        $input  = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    if ($action === 'delete') {
        $input      = $input ?? json_decode(file_get_contents('php://input'), true);
        $product_id = (int)($input['product_id'] ?? 0);
        $stmt = mysqli_prepare($conn, "DELETE FROM products WHERE product_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($stmt, "ii", $product_id, $seller_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete product.']);
        }
        exit;
    }

    // ── UPDATE STOCK ──────────────────────────────────────────────────────────
    if ($action === 'update_stock') {
        $input      = $input ?? json_decode(file_get_contents('php://input'), true);
        $product_id = (int)($input['product_id'] ?? 0);
        $stock      = (int)($input['stock']      ?? 0);
        $stmt = mysqli_prepare($conn, "UPDATE products SET stock = ? WHERE product_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($stmt, "iii", $stock, $product_id, $seller_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Stock updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update stock.']);
        }
        exit;
    }

    // ── UPDATE PRODUCT (multipart/form-data — supports image replace) ─────────
    // JS sends FormData: text fields in $_POST, optional new image in $_FILES['image'].
    // If no new image is uploaded, the existing image filename in the DB is untouched.
    // If a new image IS uploaded, the old file is overwritten in-place (same filename),
    // so the image column in the DB never needs to change for existing products.
    if ($action === 'update_product') {
        $product_id  = (int)($_POST['product_id']  ?? 0);
        $name        = trim($_POST['name']          ?? '');
        $description = trim($_POST['description']   ?? '');
        $price       = (float)($_POST['price']      ?? 0);
        $stock       = (int)($_POST['stock']        ?? 0);
        $category_id = !empty($_POST['category_id']) ? (int)$_POST['category_id'] : null;
        $type_id     = !empty($_POST['type_id'])     ? (int)$_POST['type_id']     : null;
        $weight      = isset($_POST['weight']) && $_POST['weight'] !== ''
                           ? (float)$_POST['weight'] : null;

        if (strlen($name) < 2) {
            echo json_encode(['success' => false, 'message' => 'Product name must be at least 2 characters.']);
            exit;
        }
        if ($price <= 0) {
            echo json_encode(['success' => false, 'message' => 'Price must be greater than zero.']);
            exit;
        }

        // ── IMAGE REPLACE ─────────────────────────────────────────────────────
        // Only executed when a new file was actually chosen (size > 0).
        if (!empty($_FILES['image']['size'])) {
            $file     = $_FILES['image'];
            $allowed  = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
            $maxBytes = 2 * 1024 * 1024; // 2 MB

            // Validate MIME via finfo (more reliable than $_FILES['type'])
            $finfo    = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($file['tmp_name']);

            if (!array_key_exists($mimeType, $allowed)) {
                echo json_encode(['success' => false, 'message' => 'Image must be JPG, PNG, or WEBP.']);
                exit;
            }
            if ($file['size'] > $maxBytes) {
                echo json_encode(['success' => false, 'message' => 'Image must be smaller than 2MB.']);
                exit;
            }

            $uploadDir = '../../uploads/products/';

            // Fetch the current image filename so we can reuse it (overwrite in place)
            $stmtImg = mysqli_prepare($conn,
                "SELECT image FROM products WHERE product_id = ? AND seller_id = ?");
            mysqli_stmt_bind_param($stmtImg, "ii", $product_id, $seller_id);
            mysqli_stmt_execute($stmtImg);
            $rowImg = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtImg));

            if (!empty($rowImg['image'])) {
                // Reuse same filename — new file overwrites old one at the same path.
                // No DB image-column update needed because the path stays identical.
                $newFilename = $rowImg['image'];
            } else {
                // Product had no image yet — generate a unique name
                $ext         = $allowed[$mimeType];
                $newFilename = 'product_' . $product_id . '_' . uniqid() . '.' . $ext;
            }

            $destPath = $uploadDir . $newFilename;

            if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                echo json_encode(['success' => false, 'message' => 'Failed to save image. Check upload directory permissions.']);
                exit;
            }

            // Update image column only when product had no prior image
            if (empty($rowImg['image'])) {
                $stmtImgUpd = mysqli_prepare($conn,
                    "UPDATE products SET image = ? WHERE product_id = ? AND seller_id = ?");
                mysqli_stmt_bind_param($stmtImgUpd, "sii", $newFilename, $product_id, $seller_id);
                mysqli_stmt_execute($stmtImgUpd);
            }
        }
        // ── END IMAGE REPLACE ─────────────────────────────────────────────────

        // Update all text/numeric fields
        $stmt = mysqli_prepare($conn,
            "UPDATE products
             SET name = ?, description = ?, price = ?, stock = ?,
                 category_id = ?, type_id = ?, weight = ?
             WHERE product_id = ? AND seller_id = ?"
        );
        mysqli_stmt_bind_param($stmt, "ssdiiddii",
            $name, $description, $price, $stock,
            $category_id, $type_id, $weight,
            $product_id, $seller_id
        );

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update product: ' . mysqli_error($conn)]);
        }
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Unknown action.']);
    exit;
}

// ── FETCH PRODUCTS via GET ────────────────────────────────────────────────────
// Confirmed column names: categories.category_name, product_types.type_name
$sql = "
    SELECT
        p.*,
        c.category_name  AS category,
        pt.type_name     AS product_type
    FROM products p
    LEFT JOIN categories    c  ON c.category_id = p.category_id
    LEFT JOIN product_types pt ON pt.type_id    = p.type_id
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Query prepare failed: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "i", $seller_id);
mysqli_stmt_execute($stmt);
$result   = mysqli_stmt_get_result($stmt);
$products = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode(['success' => true, 'data' => $products]);
?>