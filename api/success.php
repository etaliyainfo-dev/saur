<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/store.php';
require_once __DIR__ . '/phonepe.php';

/**
 * @param string $value
 * @return string
 */
function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/**
 * @param mixed $data
 * @return array<int, string>
 */
function collect_status_values($data): array
{
    $values = [];
    $keysOfInterest = [
        'status',
        'state',
        'paymentStatus',
        'orderStatus',
        'paymentState',
        'transactionStatus',
        'payment_status',
        'payment_state',
    ];

    $walker = function ($node) use (&$walker, &$values, $keysOfInterest): void {
        if (!is_array($node)) {
            return;
        }

        foreach ($node as $key => $value) {
            if (is_string($key) && is_string($value)) {
                $normalizedKey = strtolower($key);
                if (
                    in_array($key, $keysOfInterest, true)
                    || in_array($normalizedKey, $keysOfInterest, true)
                    || str_ends_with($normalizedKey, 'status')
                    || str_ends_with($normalizedKey, 'state')
                ) {
                    $values[] = $value;
                }
            }

            if (is_array($value)) {
                $walker($value);
            }
        }
    };

    $walker($data);

    return $values;
}

$orderId = isset($_GET['orderId']) && is_string($_GET['orderId']) ? trim($_GET['orderId']) : '';
$sig = isset($_GET['sig']) && is_string($_GET['sig']) ? trim($_GET['sig']) : '';

if ($orderId === '' || $sig === '') {
    http_response_code(400);
    echo 'Invalid request.';
    exit;
}

$order = get_order($orderId);
if ($order === null) {
    header('Location: /api/failed.php?reason=unknown_order');
    exit;
}

$storedSig = (string) ($order['sig'] ?? '');
$expectedSig = sign_order($orderId, AMOUNT_PAISE);
if (
    $storedSig === ''
    || !hash_equals($expectedSig, $storedSig)
    || !hash_equals($storedSig, $sig)
) {
    http_response_code(403);
    echo 'Forbidden.';
    exit;
}

$statusResponse = [];
$statusValues = [];
$primaryStatus = 'UNKNOWN';
$isPaid = false;
$errorMessage = '';

try {
    $token = phonepe_get_token();
    $statusResponse = phonepe_order_status($token, $orderId);
    $statusValues = collect_status_values($statusResponse);

    $successStates = ['PAYMENT_SUCCESS', 'SUCCESS', 'COMPLETED'];
    $pendingStates = ['PENDING', 'PAYMENT_PENDING', 'IN_PROGRESS', 'PROCESSING', 'INITIATED'];
    $normalized = array_map(static fn(string $s): string => strtoupper(trim($s)), $statusValues);
    $isPaid = count(array_intersect($successStates, $normalized)) > 0;

    $primaryStatus = $normalized[0]
        ?? strtoupper((string) ($statusResponse['state'] ?? $statusResponse['status'] ?? $statusResponse['data']['state'] ?? 'UNKNOWN'));

    upsert_order([
        'orderId' => $orderId,
        'lastStatusCheck' => date(DATE_ATOM),
        'phonepeStatusResponse' => $statusResponse,
        'statusValues' => $statusValues,
        'statusSummary' => [
            'primaryStatus' => $primaryStatus,
            'isPaid' => $isPaid,
            'isPending' => count(array_intersect($pendingStates, $normalized)) > 0,
        ],
        'updatedAt' => date(DATE_ATOM),
    ]);

    if ($isPaid) {
        upsert_order([
            'orderId' => $orderId,
            'status' => 'PAID',
            'paidAt' => date(DATE_ATOM),
            'updatedAt' => date(DATE_ATOM),
        ]);
        $order = get_order($orderId) ?? $order;
    }
} catch (Throwable $e) {
    $errorMessage = $e->getMessage();
    upsert_order([
        'orderId' => $orderId,
        'status' => 'STATUS_CHECK_FAILED',
        'statusCheckError' => $errorMessage,
        'lastStatusCheck' => date(DATE_ATOM),
        'updatedAt' => date(DATE_ATOM),
    ]);
}

$refreshUrl = '/api/success.php?orderId=' . rawurlencode($orderId) . '&sig=' . rawurlencode($storedSig);
$backUrl = '/';
$deliveryUrl = (string) ($order['deliveryUrl'] ?? DELIVERY_URL);

?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Payment Status • <?php echo h(PRODUCT_NAME); ?></title>
  <style>
    :root {
      --bg: #07090f;
      --card: #10141f;
      --text: #eef1f7;
      --muted: #9aa4b2;
      --accent: #ffd44d;
      --accent-ink: #1a1a1a;
      --border: #1a2234;
      --glow: rgba(255, 212, 77, 0.25);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Inter", "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(circle at top, #11162a 0%, var(--bg) 55%);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px 48px;
    }
    .wrap {
      width: min(480px, 100%);
    }
    .card {
      background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px 22px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.45);
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(26px, 6vw, 34px);
      letter-spacing: -0.02em;
    }
    p {
      margin: 0 0 16px;
      color: var(--muted);
      line-height: 1.6;
      font-size: 15px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255, 212, 77, 0.12);
      border: 1px solid rgba(255, 212, 77, 0.25);
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .status-line {
      margin: 14px 0 4px;
      font-weight: 600;
      color: var(--text);
    }
    .actions {
      display: grid;
      gap: 10px;
      margin-top: 20px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid transparent;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--accent);
      color: var(--accent-ink);
      box-shadow: 0 16px 40px var(--glow);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
    }
    .btn-ghost {
      background: transparent;
      border-color: var(--border);
      color: var(--text);
    }
    .btn-ghost:hover {
      border-color: rgba(255,255,255,0.25);
    }
    .meta {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px dashed var(--border);
      font-size: 13px;
      color: var(--muted);
      word-break: break-word;
    }
    .error {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 99, 99, 0.35);
      background: rgba(255, 99, 99, 0.12);
      color: #ffb3b3;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="card">
      <?php if ($isPaid): ?>
        <div class="badge">✅ Payment Successful</div>
        <h1>You're all set!</h1>
        <p>Your payment has been verified. Tap below to unlock the vault.</p>
        <div class="actions">
          <a class="btn btn-primary" href="<?php echo h($deliveryUrl); ?>" target="_blank" rel="noopener">Download Now</a>
          <a class="btn btn-ghost" href="<?php echo h($backUrl); ?>">Back to website</a>
        </div>
      <?php else: ?>
        <div class="badge">⏳ Payment Processing</div>
        <h1>We're confirming your payment…</h1>
        <p>It can take a few moments for the payment gateway to finalize the status. You can refresh the status below.</p>
        <p class="status-line">Current status: <?php echo h($primaryStatus); ?></p>
        <div class="actions">
          <a class="btn btn-primary" href="<?php echo h($refreshUrl); ?>">Refresh Status</a>
          <a class="btn btn-ghost" href="<?php echo h($backUrl); ?>">Back to website</a>
        </div>
        <?php if ($errorMessage !== ''): ?>
          <div class="error">Status check failed: <?php echo h($errorMessage); ?></div>
        <?php endif; ?>
      <?php endif; ?>
      <div class="meta">
        Order ID: <?php echo h($orderId); ?><br>
        Amount: ₹<?php echo h(number_format(AMOUNT_PAISE / 100, 2)); ?>
      </div>
    </section>
  </main>
</body>
</html>
