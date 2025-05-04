<?php
/**
 * Default configuration file for PetitJS
 * 
 * Copy this file to config.php and adjust the values for your environment.
 * Never commit config.php to version control!
 */

return [
    // IP hashing salt - MUST be changed in production!
    // Use a long, random string for security
    'ip_hash_salt' => 'change-this-to-a-secure-random-string',

    // Rate limiting settings
    'rate_limit' => [
        'enabled' => true,     // Set to false to disable rate limiting
        'window' => 1/60,      // Time window in hours (1 minute)
        'max_submissions' => 1 // Maximum submissions per IP in the time window
    ],

    // CORS settings
    'cors' => [
        'allowed_origins' => [
            'http://localhost',           // Development
            'http://localhost:8080',      // Alternative development port
            'https://petitjs.ddev.site',  // DDEV development
            'https://your-domain.com'     // Production - replace with your domain
        ]
    ],

    // Cache settings
    'cache' => [
        'counter_duration' => 300,  // Counter cache duration in seconds (5 minutes)
        'thank_you_duration' => 300 // Thank you message duration in seconds (5 minutes)
    ],

    // Share ID settings
    'share_id' => [
        'length' => 6,           // Length of share IDs
        'chars' => '23456789abcdefghjkmnpqrstuvwxyz' // Characters to use (excluding similar looking ones)
    ]
]; 