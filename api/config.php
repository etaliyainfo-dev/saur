<?php
declare(strict_types=1);

define('PHONEPE_CLIENT_ID', 'YOUR_PHONEPE_CLIENT_ID');
define('PHONEPE_CLIENT_SECRET', 'YOUR_PHONEPE_CLIENT_SECRET');
define('PHONEPE_CLIENT_VERSION', 1);

define('PHONEPE_ENV', 'UAT');

define('SITE_BASE', 'https://viyog.in');
define('REDIRECT_URL', SITE_BASE . '/api/redirect.php');

define('AMOUNT_PAISE', 29900);
define('PRODUCT_NAME', 'Digital Product Vault');

define('DELIVERY_URL', 'https://docs.google.com/spreadsheets/d/1nVSCn8VwWv4PiTv1OzOwrtS003GaHsdYIgknJMRFTQ8/edit?gid=1118547901#gid=1118547901');

define('ORDERS_FILE', __DIR__ . '/../data/orders.json');
define('APP_SECRET', 'REPLACE_WITH_A_LONG_RANDOM_APP_SECRET');

define('PHONEPE_AUTH_SCHEME', 'O-Bearer');
define('ORDER_COOKIE', 'dpv_order');

date_default_timezone_set('Asia/Kolkata');

/**
 * Create an HMAC signature for an order and amount.
 */
function sign_order(string $orderId, int $amountPaise): string
{
    return hash_hmac('sha256', $orderId . '|' . $amountPaise, APP_SECRET);
}
