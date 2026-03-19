<?php

function uploadImage(array $file, int $category_id): string
{
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Image upload error. Code: ' . $file['error']);
    }

    if ($file['size'] > 2 * 1024 * 1024) {
        throw new Exception('Image size exceeds 2MB.');
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowedTypes)) {
        throw new Exception('Invalid image type. Only JPG, PNG, and WEBP are allowed.');
    }

    $categoryMap = [
        1 => 'dog-products',
        2 => 'cat-products',
        3 => 'fish-products',
        4 => 'bird-products',
    ];

    if (!array_key_exists($category_id, $categoryMap)) {
        throw new Exception('Invalid category ID: ' . $category_id);
    }

    $uploadDir = __DIR__ . '/../../public/assets/images/' . $categoryMap[$category_id] . '/';

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create upload directory.');
        }
    }

    $mimeToExt = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];
    
    $extension = $mimeToExt[$mime];
    $fileName  = uniqid('product_', true) . '.' . $extension;

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
        throw new Exception('Failed to move uploaded file.');
    }

    return '/mvp/public/assets/images/' . $categoryMap[$category_id] . '/' . $fileName;
}