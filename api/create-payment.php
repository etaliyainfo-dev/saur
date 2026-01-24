<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/store.php';
require_once __DIR__ . '/phonepe.php';

header('Content-Type: application/json');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

try {
    $attempts = 0;
    do {
        $orderId = sprintf('DPV-%s-%s', date('Ymd-His'), bin2hex(random_bytes(3)));
        $attempts++;
        $existing = get_order($orderId);
    } while ($existing !== null && $attempts < 5);

    if ($existing !== null) {
        throw new RuntimeException('Unable to allocate a unique order id.');
    }

    $sig = sign_order($orderId, AMOUNT_PAISE);

    $order = [
        'orderId' => $orderId,
        'status' => 'CREATED',
        'amount' => AMOUNT_PAISE,
        'sig' => $sig,
        'deliveryUrl' => DELIVERY_URL,
        'createdAt' => date(DATE_ATOM),
        'updatedAt' => date(DATE_ATOM),
        'events' => [
            [
                'type' => 'ORDER_CREATED',
                'at' => date(DATE_ATOM),
            ],
        ],
    ];
    upsert_order($order);

    setcookie(ORDER_COOKIE, $orderId, [
        'expires' => time() + 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    $token = phonepe_get_token();
    $paymentResponse = phonepe_create_payment($token, $orderId, AMOUNT_PAISE);

    upsert_order([
        'orderId' => $orderId,
        'status' => 'PENDING_REDIRECT',
        'redirectUrl' => $paymentResponse['redirectUrl'],
        'phonepeCreateResponse' => $paymentResponse,
        'updatedAt' => date(DATE_ATOM),
        'events' => array_merge(
            $order['events'],
            [
                [
                    'type' => 'PHONEPE_PAY_CREATED',
                    'at' => date(DATE_ATOM),
                ],
            ]
        ),
    ]);

    echo json_encode([
        'ok' => true,
        'redirectUrl' => $paymentResponse['redirectUrl'],
    ], JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($orderId)) {
        upsert_order([
            'orderId' => $orderId,
            'status' => 'CREATE_FAILED',
            'createError' => $e->getMessage(),
            'updatedAt' => date(DATE_ATOM),
        ]);
    }
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'payment_init_failed',
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_SLASHES);
}
