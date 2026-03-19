<?php
session_start();
header('Content-Type: application/json');
session_unset();
session_destroy();
// header('Cache-Control: no-store, no-cache, must-revalidate');
// header('Pragma: no-cache');
// header('Location: public/index.php');
echo json_encode(["status" => "success"]);
exit();