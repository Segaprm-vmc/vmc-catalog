<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка OPTIONS запроса для CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Путь к файлу с моделями
$modelsFile = __DIR__ . '/../data/models.json';

try {
    if (!file_exists($modelsFile)) {
        // Если файл не существует, создаем пустой массив
        echo json_encode([]);
        exit;
    }
    
    $content = file_get_contents($modelsFile);
    
    if ($content === false) {
        error_log('Failed to read models file: ' . $modelsFile);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to read models file']);
        exit;
    }
    
    $models = json_decode($content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON decode error: ' . json_last_error_msg());
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON in models file']);
        exit;
    }
    
    // Проверяем что получен массив
    if (!is_array($models)) {
        $models = [];
    }
    
    // Сортируем модели по порядку (order) или по дате создания
    usort($models, function($a, $b) {
        // Сначала по order если есть
        if (isset($a['order']) || isset($b['order'])) {
            $orderA = $a['order'] ?? 999999;
            $orderB = $b['order'] ?? 999999;
            if ($orderA !== $orderB) {
                return $orderA <=> $orderB;
            }
        }
        
        // Затем по дате создания (новые сначала)
        $dateA = $a['createdAt'] ?? '1970-01-01';
        $dateB = $b['createdAt'] ?? '1970-01-01';
        return strtotime($dateB) <=> strtotime($dateA);
    });
    
    // Добавляем информацию о количестве
    $response = [
        'models' => $models,
        'count' => count($models),
        'lastUpdated' => file_exists($modelsFile) ? date('c', filemtime($modelsFile)) : null
    ];
    
    // Возвращаем массив моделей (для совместимости с существующим кодом)
    echo json_encode($models, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    error_log('Load models error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?> 