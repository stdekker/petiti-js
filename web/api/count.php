<?php
header('Content-Type: application/json');

// Load configuration
$config = require __DIR__ . '/../../config.php';

// Set CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $config['cors']['allowed_origins'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Path to the submissions file
$submissionsFile = __DIR__ . '/../../data/submissions.json';

// Read submissions
$submissions = [];
if (file_exists($submissionsFile)) {
    $submissions = json_decode(file_get_contents($submissionsFile), true) ?? [];
}

// Return the count
echo json_encode([
    'count' => count($submissions),
    'last_submission' => !empty($submissions) ? end($submissions)['timestamp'] : null
]); 