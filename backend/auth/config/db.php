<?php 
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project_db";

// $conn = new mysqli($servername, $username, $password, $dbname);
// if($conn->connect_error){
//     die("Connection Failed: ". $conn->connect_error);
// }
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    header("Content-Type: application/json");
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Connection Failed: " . $conn->connect_error
    ]));
}
