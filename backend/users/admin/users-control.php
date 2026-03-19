<?php
header('Content-Type: application/json');
require_once '../../auth/config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $sql = "SELECT u.user_id, u.fname, u.email, u.role, u.status, u.created_at, s.seller_id, s.status AS seller_status, sh.store_name, sh.city AS shop_city FROM users u LEFT JOIN sellers s ON s.user_id = u.user_id LEFT JOIN shop sh ON sh.seller_id = s.seller_id ORDER BY u.created_at DESC";
        $result = $conn->query($sql);

        if (!$result) throw new Exception("Query failed: " . $conn->error);

        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        echo json_encode(["success" => true, "data" => $users]);

    } elseif ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['user_id']) || !isset($body['action'])) {
            throw new Exception("Missing user_id or action");
        }

        $user_id = (int) $body['user_id'];
        $action  = $body['action'];

        if ($action === 'delete') {
            $password = $body['password'] ?? '';
            if (!$password) {
                echo json_encode(['success' => false, 'message' => 'Password is required.']);
                exit;
            }

            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Session expired. Please log in again.']);
                exit;
            }

            $admin_id = (int) $_SESSION['user_id'];
            $stmt = $conn->prepare("SELECT password FROM users WHERE user_id = ?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("i", $admin_id);
            $stmt->execute();
            $adminData = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if (!$adminData || !password_verify($password, $adminData['password'])) {
                echo json_encode(['success' => false, 'reason' => 'wrong_password', 'message' => 'Incorrect password.']);
                exit;
            }

            $conn->begin_transaction();
            try {
                $stmt = $conn->prepare("SELECT seller_id FROM sellers WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $sellerData = $stmt->get_result()->fetch_assoc();
                $stmt->close();

                if ($sellerData) {
                    $seller_id = $sellerData['seller_id'];

                    $stmt = $conn->prepare("DELETE FROM products WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();

                    $stmt = $conn->prepare("DELETE FROM shop WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();

                    $stmt = $conn->prepare("DELETE FROM sellers WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();
                }

                $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode(["success" => true, "message" => "User and all related data deleted successfully."]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Delete failed: " . $e->getMessage());
            }

        } elseif ($action === 'suspend') {
            $conn->begin_transaction();
            try {
                $status = 'suspended';
                $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                $stmt = $conn->prepare("UPDATE sellers SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                $productStatus = 'rejected';
                $stmt = $conn->prepare("UPDATE products SET status = ? WHERE seller_id = (SELECT seller_id FROM sellers WHERE user_id = ?)");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $productStatus, $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode(["success" => true, "message" => "User suspended and products unpublished."]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Suspend failed: " . $e->getMessage());
            }

        } elseif ($action === 'activate') {
            $conn->begin_transaction();
            try {
                $status = 'active';
                $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                $stmt = $conn->prepare("UPDATE sellers SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode(["success" => true, "message" => "User activated successfully."]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Activate failed: " . $e->getMessage());
            }

        } else {
            throw new Exception("Invalid action: " . $action);
        }

    } else {
        throw new Exception("Invalid request method.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>