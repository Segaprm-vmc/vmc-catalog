<?php
// Простой тест PHP
echo "PHP работает!";
echo "<br>Время: " . date('Y-m-d H:i:s');
echo "<br>Версия PHP: " . phpversion();

// Проверка прав доступа к папке data
$dataDir = __DIR__ . '/data';
echo "<br>Папка data существует: " . (is_dir($dataDir) ? 'ДА' : 'НЕТ');
echo "<br>Папка data доступна для записи: " . (is_writable($dataDir) ? 'ДА' : 'НЕТ');

// Проверка файла models.json
$modelsFile = $dataDir . '/models.json';
echo "<br>Файл models.json существует: " . (file_exists($modelsFile) ? 'ДА' : 'НЕТ');
if (file_exists($modelsFile)) {
    echo "<br>Размер файла: " . filesize($modelsFile) . " байт";
}
?> 