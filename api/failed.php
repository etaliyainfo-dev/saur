<?php
declare(strict_types=1);

$reason = isset($_GET['reason']) && is_string($_GET['reason']) ? $_GET['reason'] : 'payment_failed';
$reason = preg_replace('/[^a-zA-Z0-9_\-]/', '', $reason) ?: 'payment_failed';
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Payment Failed</title>
  <style>
    :root {
      --bg: #07090f;
      --card: #10141f;
      --text: #eef1f7;
      --muted: #9aa4b2;
      --accent: #ffd44d;
      --accent-ink: #1a1a1a;
      --border: #1a2234;
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
    .card {
      width: min(460px, 100%);
      background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px 22px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.45);
      text-align: center;
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(26px, 6vw, 34px);
      letter-spacing: -0.02em;
    }
    p {
      margin: 0 0 16px;
      color: var(--muted);
      line-height: 1.6;
      font-size: 15px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 16px;
      border-radius: 12px;
      background: var(--accent);
      color: var(--accent-ink);
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      margin-top: 10px;
    }
    .reason {
      margin: 8px 0 0;
      font-size: 13px;
      color: var(--muted);
      opacity: 0.85;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>❌ Payment Failed</h1>
    <p>We couldn't confirm your payment. Please try again.</p>
    <a class="btn" href="/">Try Again</a>
    <div class="reason">Reason: <?php echo htmlspecialchars($reason, ENT_QUOTES, 'UTF-8'); ?></div>
  </main>
</body>
</html>
