<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/store.php';

$orderId = $_COOKIE[ORDER_COOKIE] ?? ($_GET['merchantOrderId'] ?? '');
$orderId = is_string($orderId) ? trim($orderId) : '';

if ($orderId === '') {
    header('Location: /api/failed.php?reason=missing_order');
    exit;
}

$order = get_order($orderId);
if ($order === null) {
    header('Location: /api/failed.php?reason=unknown_order');
    exit;
}

upsert_order([
    'orderId' => $orderId,
    'status' => 'REDIRECTED',
    'redirectQuery' => $_GET,
    'updatedAt' => date(DATE_ATOM),
]);

$storedSig = (string) ($order['sig'] ?? '');
$expectedSig = sign_order($orderId, AMOUNT_PAISE);
if ($storedSig === '' || !hash_equals($expectedSig, $storedSig)) {
    header('Location: /api/failed.php?reason=bad_signature');
    exit;
}

$sig = $storedSig;
$target = '/api/success.php?orderId=' . rawurlencode($orderId) . '&sig=' . rawurlencode($sig);

header('Location: ' . $target);
exit;
