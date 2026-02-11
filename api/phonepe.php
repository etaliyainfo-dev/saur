<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * @return array{pg:string, identity:string}
 */
function phonepe_base_urls(): array
{
    if (PHONEPE_ENV === 'UAT') {
        return [
            'pg' => 'https://api-preprod.phonepe.com/apis/pg-sandbox',
            'identity' => 'https://api-preprod.phonepe.com/apis/identity-manager',
        ];
    }

    return [
        'pg' => 'https://api.phonepe.com/apis/hermes',
        'identity' => 'https://api.phonepe.com/apis/identity-manager',
    ];
}

/**
 * @param array<string, mixed>|string|null $payload
 * @param array<int, string> $headers
 * @return array<string, mixed>
 */
function http_json(string $method, string $url, $payload = null, array $headers = []): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        throw new RuntimeException('Unable to initialize curl.');
    }

    $methodUpper = strtoupper($method);
    $finalHeaders = array_merge([
        'Accept: application/json',
    ], $headers);

    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $methodUpper,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => $finalHeaders,
        CURLOPT_TIMEOUT => 30,
    ]);

    if ($payload !== null && $methodUpper !== 'GET') {
        if (is_array($payload)) {
            $json = json_encode($payload, JSON_UNESCAPED_SLASHES);
            if ($json === false) {
                throw new RuntimeException('Failed to encode JSON payload.');
            }

            $finalHeaders[] = 'Content-Type: application/json';
            curl_setopt($ch, CURLOPT_HTTPHEADER, $finalHeaders);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        } elseif (is_string($payload)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        } else {
            throw new InvalidArgumentException('Unsupported payload type.');
        }
    }

    $body = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        throw new RuntimeException('Curl request failed: ' . $curlErr);
    }

    $decoded = json_decode($body, true);
    $response = is_array($decoded) ? $decoded : ['raw' => $body];
    $response['_meta'] = [
        'httpCode' => $httpCode,
        'url' => $url,
    ];

    if ($httpCode < 200 || $httpCode >= 300) {
        throw new RuntimeException(sprintf('HTTP %d error from %s: %s', $httpCode, $url, $body));
    }

    return $response;
}

/**
 * @return string
 */
function phonepe_get_token(): string
{
    $urls = phonepe_base_urls();
    $url = $urls['identity'] . '/v1/oauth/token';

    $payload = http_build_query([
        'grant_type' => 'client_credentials',
        'client_id' => PHONEPE_CLIENT_ID,
        'client_secret' => PHONEPE_CLIENT_SECRET,
        'client_version' => PHONEPE_CLIENT_VERSION,
    ], '', '&', PHP_QUERY_RFC3986);

    $response = http_json('POST', $url, $payload, [
        'Content-Type: application/x-www-form-urlencoded',
    ]);

    $token = $response['access_token']
        ?? $response['token']
        ?? ($response['data']['access_token'] ?? null)
        ?? ($response['data']['token'] ?? null)
        ?? null;

    if (!is_string($token) || $token === '') {
        $body = json_encode($response, JSON_UNESCAPED_SLASHES);
        throw new RuntimeException('Unable to find access token in response: ' . ($body ?: 'unknown'));
    }

    return $token;
}

/**
 * @return array<string, mixed>
 */
function phonepe_create_payment(string $token, string $merchantOrderId, int $amountPaise): array
{
    $urls = phonepe_base_urls();
    $url = $urls['pg'] . '/pg/v1/pay';

    $payload = [
        'merchantOrderId' => $merchantOrderId,
        'amount' => $amountPaise,
        'expireAfter' => 900,
        'metaInfo' => [
            'productName' => PRODUCT_NAME,
        ],
        'paymentFlow' => [
            'type' => 'PG_CHECKOUT',
            'merchantUrls' => [
                'redirectUrl' => REDIRECT_URL,
            ],
        ],
    ];

    $headers = [
        'Authorization: ' . PHONEPE_AUTH_SCHEME . ' ' . $token,
    ];

    $response = http_json('POST', $url, $payload, $headers);

    $redirectUrl = $response['data']['redirectUrl']
        ?? $response['data']['paymentUrl']
        ?? ($response['data']['instrumentResponse']['redirectInfo']['url'] ?? null)
        ?? ($response['redirectUrl'] ?? null)
        ?? null;

    if (!is_string($redirectUrl) || $redirectUrl === '') {
        $body = json_encode($response, JSON_UNESCAPED_SLASHES);
        throw new RuntimeException('Redirect URL missing in create payment response: ' . ($body ?: 'unknown'));
    }

    $response['redirectUrl'] = $redirectUrl;

    return $response;
}

/**
 * @return array<string, mixed>
 */
function phonepe_order_status(string $token, string $merchantOrderId): array
{
    $urls = phonepe_base_urls();
    $url = $urls['pg'] . '/pg/v1/status/' . rawurlencode(PHONEPE_CLIENT_ID) . '/' . rawurlencode($merchantOrderId);

    $headers = [
        'Authorization: ' . PHONEPE_AUTH_SCHEME . ' ' . $token,
    ];

    return http_json('GET', $url, null, $headers);
}
