<?php 
    function validateData($data, $conn){
    $errors = [];

    $fname = sanitizeData($_POST["fname"]);
    $email = sanitizeData($_POST["reg-email"]);
    $password = $_POST["new-pass"];
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    if(empty($fname) || !preg_match("/*/^[a-zA-Z ]+$/", $fname)){
        $errors[] = "Name is required and can only contain letters and spaces.";
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        $errors[] = "Invalid Email Format";
    }
    else{
        $check = $conn->prepare("SELECT user_id FROM users WHERE email=? LIMIT 1");
        if (!$check) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();
        if($stmt->num_rows > 0){
            $errors[] = "Email is already registered.";
        }
        $stmt->close();
    }

    return empty($errors) ? true : $empty;
}

?>