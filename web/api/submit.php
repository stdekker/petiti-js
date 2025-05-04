<?php
header('Content-Type: application/json');

// Load configuration
$config = require __DIR__ . '/../../config.php';

// Set CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $config['cors']['allowed_origins'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the submitted data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = ['email', 'naam', 'telefoonnummer'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Validate share IDs if present
function validateShareId($id) {
    if (empty($id)) return null;
    // Only allow alphanumeric characters, exactly 6 characters long
    $sanitized = strtolower(preg_replace('/[^a-z0-9]/', '', $id));
    return strlen($sanitized) === 6 ? $sanitized : null;
}

// Sanitize phone number by removing spaces and dashes
function sanitizePhoneNumber($phoneNumber) {
    // Remove spaces, dashes, and parentheses
    $sanitized = preg_replace('/[\s\-\(\)]/', '', $phoneNumber);
    
    // Handle international format: convert +31 to 0 for Dutch numbers
    if (substr($sanitized, 0, 3) === '+31') {
        $sanitized = '0' . substr($sanitized, 3);
    }
    
    return $sanitized;
}

// Sanitize postcode
function sanitizePostcode($postcode) {
    if (empty($postcode)) return null;
    // Remove spaces and convert to uppercase
    $sanitized = strtoupper(preg_replace('/\s+/', '', $postcode));
    // Validate format: 4 digits followed by 2 letters
    return preg_match('/^[1-9][0-9]{3}[A-Z]{2}$/', $sanitized) ? $sanitized : null;
}

$shareId = validateShareId($data['shareId'] ?? null);
$sourceShareId = validateShareId($data['sourceShareId'] ?? null);
$sanitizedPhone = sanitizePhoneNumber($data['telefoonnummer']);
$sanitizedPostcode = sanitizePostcode($data['postcode'] ?? null);

// Calculate basic bot score (0-100)
$botScore = 0;
if (empty($data['fingerprint'])) {
    $botScore += 50; // Missing fingerprint
}
if (empty($_SERVER['HTTP_USER_AGENT'])) {
    $botScore += 50; // Missing user agent
}

// Add timestamp and submission data
$submission = [
    'timestamp' => date('Y-m-d H:i:s'),
    'fingerprint' => $data['fingerprint'] ?? null,
    'bot_score' => $botScore,
    'share_id' => $shareId,
    'source_share_id' => $sourceShareId,
    'ip_hash' => $config['rate_limit']['enabled'] ? hash('sha256', $_SERVER['REMOTE_ADDR'] . $config['rate_limit']['salt']) : null,
    'data' => [
        'email' => $data['email'],
        'naam' => $data['naam'],
        'telefoonnummer' => $sanitizedPhone,
        'postcode' => $sanitizedPostcode
    ]
];

// Path to the submissions file (outside web root)
$submissionsFile = __DIR__ . '/../../data/submissions.json';

// Create data directory if it doesn't exist
if (!file_exists(dirname($submissionsFile))) {
    mkdir(dirname($submissionsFile), 0755, true);
}

// Read existing submissions
$submissions = [];
if (file_exists($submissionsFile)) {
    $submissions = json_decode(file_get_contents($submissionsFile), true) ?? [];
}

// Check rate limiting if enabled
if ($config['rate_limit']['enabled']) {
    $windowStart = strtotime('-' . $config['rate_limit']['window'] . ' hours');
    
    // Hash the IP address for privacy
    $ipHash = hash('sha256', $_SERVER['REMOTE_ADDR'] . $config['rate_limit']['salt']);
    
    // Count submissions from this IP in the time window
    $recentSubmissions = array_filter($submissions, function($sub) use ($ipHash, $windowStart) {
        $submissionTime = strtotime($sub['timestamp']);
        return $sub['ip_hash'] === $ipHash && $submissionTime > $windowStart;
    });

    if (count($recentSubmissions) >= $config['rate_limit']['max_submissions']) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Too many submissions from this IP. Please try again later.',
            'retry_after' => $config['rate_limit']['window'] * 3600  // Convert hours to seconds
        ]);
        exit;
    }
}

// Add new submission
$submissions[] = $submission;

// Save back to file
if (file_put_contents($submissionsFile, json_encode($submissions, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true,
        'bot_score' => $botScore,
        'share_id' => $submission['share_id']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save submission']);
} 