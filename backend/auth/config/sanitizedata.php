<?php 
function sanitizeData($data) {
    return htmlspecialchars(strip_tags(stripslashes(trim($data))));
}
