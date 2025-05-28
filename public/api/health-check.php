<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка OPTIONS запроса для CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/**
 * Скрипт для проверки состояния системы и готовности к работе
 */

$results = [
    'timestamp' => date('c'),
    'checks' => [],
    'status' => 'ok',
    'errors' => [],
    'warnings' => []
];

// Проверка версии PHP
$phpVersion = phpversion();
$results['checks']['php_version'] = [
    'status' => version_compare($phpVersion, '7.4', '>=') ? 'ok' : 'error',
    'value' => $phpVersion,
    'required' => '7.4+'
];

if ($results['checks']['php_version']['status'] === 'error') {
    $results['errors'][] = 'PHP версия слишком старая';
    $results['status'] = 'error';
}

// Проверка необходимых PHP расширений
$requiredExtensions = ['json', 'mbstring'];
foreach ($requiredExtensions as $ext) {
    $results['checks']['extension_' . $ext] = [
        'status' => extension_loaded($ext) ? 'ok' : 'error',
        'required' => true
    ];
    
    if (!extension_loaded($ext)) {
        $results['errors'][] = "PHP расширение '$ext' не установлено";
        $results['status'] = 'error';
    }
}

// Проверка папки data
$dataDir = __DIR__ . '/../data';
$results['checks']['data_directory'] = [
    'status' => is_dir($dataDir) ? 'ok' : 'error',
    'path' => realpath($dataDir),
    'exists' => is_dir($dataDir)
];

if (!is_dir($dataDir)) {
    $results['errors'][] = "Папка data не существует: $dataDir";
    $results['status'] = 'error';
} else {
    // Проверка прав записи
    $results['checks']['data_writable'] = [
        'status' => is_writable($dataDir) ? 'ok' : 'error',
        'writable' => is_writable($dataDir)
    ];
    
    if (!is_writable($dataDir)) {
        $results['errors'][] = "Папка data недоступна для записи";
        $results['status'] = 'error';
    }
}

// Проверка файла models.json
$modelsFile = $dataDir . '/models.json';
$results['checks']['models_file'] = [
    'status' => 'ok',
    'path' => $modelsFile,
    'exists' => file_exists($modelsFile),
    'readable' => file_exists($modelsFile) ? is_readable($modelsFile) : false,
    'writable' => file_exists($modelsFile) ? is_writable($modelsFile) : false,
    'size' => file_exists($modelsFile) ? filesize($modelsFile) : 0
];

if (file_exists($modelsFile)) {
    // Проверка валидности JSON
    $content = file_get_contents($modelsFile);
    $decoded = json_decode($content, true);
    
    $results['checks']['models_json_valid'] = [
        'status' => $decoded !== null ? 'ok' : 'error',
        'json_error' => json_last_error_msg(),
        'models_count' => is_array($decoded) ? count($decoded) : 0
    ];
    
    if ($decoded === null) {
        $results['errors'][] = 'Файл models.json содержит невалидный JSON: ' . json_last_error_msg();
        $results['status'] = 'error';
    }
    
    if (!is_writable($modelsFile)) {
        $results['warnings'][] = 'Файл models.json недоступен для записи';
        $results['checks']['models_file']['status'] = 'warning';
        if ($results['status'] === 'ok') {
            $results['status'] = 'warning';
        }
    }
} else {
    $results['warnings'][] = 'Файл models.json не существует (будет создан автоматически)';
    $results['checks']['models_file']['status'] = 'warning';
    if ($results['status'] === 'ok') {
        $results['status'] = 'warning';
    }
}

// Проверка настроек PHP
$results['checks']['php_settings'] = [
    'post_max_size' => ini_get('post_max_size'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'max_execution_time' => ini_get('max_execution_time'),
    'memory_limit' => ini_get('memory_limit'),
    'error_reporting' => ini_get('error_reporting'),
    'display_errors' => ini_get('display_errors')
];

// Проверка доступности записи тестовым файлом
$testFile = $dataDir . '/test_write.tmp';
$writeTest = @file_put_contents($testFile, 'test');
$results['checks']['write_test'] = [
    'status' => $writeTest !== false ? 'ok' : 'error',
    'bytes_written' => $writeTest
];

if ($writeTest === false) {
    $results['errors'][] = 'Невозможно записать тестовый файл в папку data';
    $results['status'] = 'error';
} else {
    // Удаляем тестовый файл
    @unlink($testFile);
}

// Информация о сервере
$results['server_info'] = [
    'php_version' => $phpVersion,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
    'script_filename' => __FILE__,
    'current_time' => date('Y-m-d H:i:s T'),
    'timezone' => date_default_timezone_get()
];

// Рекомендации
$results['recommendations'] = [];

if ($results['status'] === 'error') {
    $results['recommendations'][] = 'Исправьте все ошибки перед использованием системы';
}

if (!empty($results['warnings'])) {
    $results['recommendations'][] = 'Рассмотрите устранение предупреждений для оптимальной работы';
}

if ($results['status'] === 'ok') {
    $results['recommendations'][] = 'Система готова к работе!';
}

// Установка HTTP статуса
if ($results['status'] === 'error') {
    http_response_code(500);
} elseif ($results['status'] === 'warning') {
    http_response_code(200); // Предупреждения не критичны
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 