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
$backupFile = __DIR__ . '/../data/models.backup.json';

// Функция для чтения моделей
function loadModels($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $content = file_get_contents($filePath);
    $models = json_decode($content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON decode error: ' . json_last_error_msg());
        return [];
    }
    
    return $models ?: [];
}

// Функция для сохранения моделей
function saveModels($filePath, $models) {
    // Создаем резервную копию перед сохранением
    global $backupFile;
    if (file_exists($filePath)) {
        copy($filePath, $backupFile);
    }
    
    $json = json_encode($models, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if ($json === false) {
        error_log('JSON encode error: ' . json_last_error_msg());
        return false;
    }
    
    // Создаем директорию если она не существует
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    return file_put_contents($filePath, $json) !== false;
}

// Функция для генерации ID
function generateId() {
    return 'model_' . uniqid() . '_' . time();
}

// Основная логика
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    if (!isset($data['action'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Action required']);
        exit;
    }
    
    $models = loadModels($modelsFile);
    $action = $data['action'];
    
    switch ($action) {
        case 'add_model':
            if (!isset($data['model'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Model data required']);
                exit;
            }
            
            $newModel = $data['model'];
            
            // Генерируем ID если его нет
            if (empty($newModel['id'])) {
                $newModel['id'] = generateId();
            }
            
            // Проверяем уникальность ID
            foreach ($models as $model) {
                if ($model['id'] === $newModel['id']) {
                    // Генерируем новый ID если дублируется
                    $newModel['id'] = generateId();
                    break;
                }
            }
            
            // Добавляем временные метки
            $newModel['createdAt'] = date('c');
            $newModel['updatedAt'] = date('c');
            
            // Устанавливаем порядок
            if (!isset($newModel['order'])) {
                $newModel['order'] = count($models) + 1;
            }
            
            $models[] = $newModel;
            
            if (saveModels($modelsFile, $models)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Модель успешно добавлена',
                    'modelId' => $newModel['id']
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save model']);
            }
            break;
            
        case 'update_model':
            if (!isset($data['model'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Model data required']);
                exit;
            }
            
            $updatedModel = $data['model'];
            $modelId = $updatedModel['id'];
            $found = false;
            
            for ($i = 0; $i < count($models); $i++) {
                if ($models[$i]['id'] === $modelId) {
                    // Сохраняем дату создания
                    $updatedModel['createdAt'] = $models[$i]['createdAt'] ?? date('c');
                    $updatedModel['updatedAt'] = date('c');
                    
                    $models[$i] = $updatedModel;
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                http_response_code(404);
                echo json_encode(['error' => 'Model not found']);
                exit;
            }
            
            if (saveModels($modelsFile, $models)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Модель успешно обновлена'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update model']);
            }
            break;
            
        case 'delete_model':
            if (!isset($data['modelId'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Model ID required']);
                exit;
            }
            
            $modelId = $data['modelId'];
            $initialCount = count($models);
            
            $models = array_filter($models, function($model) use ($modelId) {
                return $model['id'] !== $modelId;
            });
            
            // Перенумеруем массив после удаления
            $models = array_values($models);
            
            if (count($models) === $initialCount) {
                http_response_code(404);
                echo json_encode(['error' => 'Model not found']);
                exit;
            }
            
            if (saveModels($modelsFile, $models)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Модель успешно удалена'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete model']);
            }
            break;
            
        case 'update_order':
            if (!isset($data['modelId']) || !isset($data['order'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Model ID and order required']);
                exit;
            }
            
            $modelId = $data['modelId'];
            $newOrder = intval($data['order']);
            $found = false;
            
            for ($i = 0; $i < count($models); $i++) {
                if ($models[$i]['id'] === $modelId) {
                    $models[$i]['order'] = $newOrder;
                    $models[$i]['updatedAt'] = date('c');
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                http_response_code(404);
                echo json_encode(['error' => 'Model not found']);
                exit;
            }
            
            // Сортируем по порядку
            usort($models, function($a, $b) {
                return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
            });
            
            if (saveModels($modelsFile, $models)) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Порядок модели обновлен'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update order']);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action: ' . $action]);
            break;
    }
    
} catch (Exception $e) {
    error_log('Save models error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?> 