<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * @return void
 */
function ensure_orders_file(): void
{
    $dir = dirname(ORDERS_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }

    $handle = fopen(ORDERS_FILE, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Unable to open orders file for initialization.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Unable to lock orders file for initialization.');
        }

        $size = filesize(ORDERS_FILE);
        if ($size === false || $size === 0) {
            fwrite($handle, "[]\n");
            fflush($handle);
            @chmod(ORDERS_FILE, 0640);
        }

        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

/**
 * @return array<int, array<string, mixed>>
 */
function read_orders(): array
{
    ensure_orders_file();

    $handle = fopen(ORDERS_FILE, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Unable to open orders file for reading.');
    }

    try {
        if (!flock($handle, LOCK_SH)) {
            throw new RuntimeException('Unable to acquire shared lock for orders file.');
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        if ($contents === false || $contents === '') {
            $contents = "[]";
        }

        $orders = json_decode($contents, true);
        if (!is_array($orders)) {
            $orders = [];
        }

        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }

    return array_values($orders);
}

/**
 * @param array<int, array<string, mixed>> $orders
 * @return void
 */
function write_orders(array $orders): void
{
    ensure_orders_file();

    $handle = fopen(ORDERS_FILE, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Unable to open orders file for writing.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Unable to acquire exclusive lock for orders file.');
        }

        $encoded = json_encode(array_values($orders), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($encoded === false) {
            throw new RuntimeException('Unable to encode orders JSON.');
        }

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, $encoded . "\n");
        fflush($handle);

        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

/**
 * @param array<string, mixed> $order
 * @return array<string, mixed>
 */
function upsert_order(array $order): array
{
    if (!isset($order['orderId'])) {
        throw new InvalidArgumentException('Order must include orderId.');
    }

    $orderId = (string) $order['orderId'];

    ensure_orders_file();
    $handle = fopen(ORDERS_FILE, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Unable to open orders file for upsert.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Unable to acquire exclusive lock for upsert.');
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        if ($contents === false || $contents === '') {
            $contents = "[]";
        }

        $orders = json_decode($contents, true);
        if (!is_array($orders)) {
            $orders = [];
        }

        $found = false;
        foreach ($orders as $idx => $existing) {
            if (($existing['orderId'] ?? null) === $orderId) {
                $orders[$idx] = array_merge($existing, $order);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $orders[] = $order;
        }

        $encoded = json_encode(array_values($orders), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($encoded === false) {
            throw new RuntimeException('Unable to encode orders JSON during upsert.');
        }

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, $encoded . "\n");
        fflush($handle);

        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }

    return $order;
}

/**
 * @return array<string, mixed>|null
 */
function get_order(string $orderId): ?array
{
    $orders = read_orders();
    foreach ($orders as $order) {
        if (($order['orderId'] ?? null) === $orderId) {
            return $order;
        }
    }

    return null;
}
