// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import crypto from 'crypto';

interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

function getConfig(): IyzicoConfig {
  return {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    baseUrl: process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com',
  };
}

/**
 * İyzico v2 Authorization Header (IYZWSv2) oluşturucu
 */
function generateAuthHeaderV2(apiKey: string, secretKey: string, uriPath: string, body: any, randomString: string): string {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body || {});
  const dataToSign = randomString + uriPath + bodyString;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('hex');

  const authorizationParams = [
    `apiKey:${apiKey}`,
    `randomKey:${randomString}`,
    `signature:${signature}`,
  ];

  return `IYZWSv2 ${Buffer.from(authorizationParams.join('&')).toString('base64')}`;
}

/**
 * İyzico API'sine güvenli POST isteği atar
 */
async function callIyzicoApi(path: string, body: any) {
  const config = getConfig();

  const randomString = Date.now().toString() + Math.random().toString(36).substring(2, 10);
  const authHeader = generateAuthHeaderV2(config.apiKey, config.secretKey, path, body, randomString);

  const url = `${config.baseUrl.replace(/\/$/, '')}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-iyzi-rnd': randomString,
      'x-iyzi-client-version': 'iyzipay-node-2.0.71',
      'Authorization': authHeader,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
}

/**
 * İyzico Checkout Formunu başlatır
 */
export async function initializeCheckoutForm(requestData: any): Promise<any> {
  const path = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
  return await callIyzicoApi(path, requestData);
}

/**
 * İyzico Checkout Form sonucunu sorgular
 */
export async function retrieveCheckoutForm(token: string): Promise<any> {
  const path = '/payment/iyzipos/checkoutform/auth/ecom/detail';
  return await callIyzicoApi(path, {
    locale: 'tr',
    token,
  });
}
