<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    $basePath = dirname($_SERVER['SCRIPT_NAME']);
    $basePath = $basePath === '/' ? '' : $basePath;
    ?>
    <base href="<?php echo htmlspecialchars($basePath); ?>/">
    <title>Petitie</title>
    
    <!-- Resource Hints -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://esm.sh">
    <link rel="dns-prefetch" href="https://esm.sh">
    
    <!-- Critical CSS -->
    <style>
        <?php print(file_get_contents('css/critical.css')); ?>
    </style>
    
    <!-- Non-critical CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <div id="app">
        <div class="app-container">
            <main class="app-content"></main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@4/dist/fp.min.js"></script>
    
    <!-- Application Script -->
    <script src="src/main.js" type="module"></script>
</body>
</html>
