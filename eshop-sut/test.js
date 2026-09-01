const TEST_LABEL = 'quick_start';
const DEFAULT_MAX_USERS = 1;

export const options = {
  scenarios: {
    quick_start: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      gracefulStop: '5s',
      exec: 'e2eCheckoutCoupon',
    },
  },
  thresholds: {
    checks: ['rate>0.95'],
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.01'],
  },
  cloud: {
    name: 'EShop Quick Start - Coupon Checkout - 1VU',
  },
};

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://eshop-backend-tung.onrender.com';
const PASSWORD = __ENV.PASSWORD || 'Test1234!';
const MAX_USERS = Number(__ENV.MAX_USERS || DEFAULT_MAX_USERS);
const MIN_COUPON_TOTAL = Number(__ENV.MIN_COUPON_TOTAL || 300001);
const RUN_ID = `${Date.now()}`;

function jsonHeaders(token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers };
}

function safeJson(res) {
  try {
    return res.json();
  } catch (_) {
    return {};
  }
}

function extractList(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.products)) return body.products;
  if (Array.isArray(body.data)) return body.data;
  if (body.data && Array.isArray(body.data.products)) return body.data.products;
  return [];
}

function extractToken(body) {
  return (
    body.token ||
    body.accessToken ||
    body.access_token ||
    body.jwt ||
    (body.data && (body.data.token || body.data.accessToken || body.data.access_token)) ||
    null
  );
}

function extractUserId(body, fallback) {
  return (
    (body.user && body.user.id) ||
    body.user_id ||
    body.id ||
    (body.data && body.data.user && body.data.user.id) ||
    fallback
  );
}

function extractCouponId(body) {
  return (
    body.coupon_id ||
    (body.coupon && body.coupon.id) ||
    (body.data && body.data.coupon_id) ||
    (body.data && body.data.coupon && body.data.coupon.id) ||
    null
  );
}

function extractFinalAmount(body, fallback) {
  return Number(
    body.final_amount ||
    body.finalAmount ||
    (body.data && (body.data.final_amount || body.data.finalAmount)) ||
    fallback
  );
}

function extractOrderId(body) {
  return (
    body.orderId ||
    body.order_id ||
    (body.order && body.order.id) ||
    (body.data && body.data.orderId) ||
    (body.data && body.data.order_id) ||
    (body.data && body.data.order && body.data.order.id) ||
    null
  );
}

export function setup() {
  const users = [];

  for (let i = 1; i <= MAX_USERS; i += 1) {
    const email = `k6_${TEST_LABEL}_${RUN_ID}_${i}@eshop.local`;
    const payload = JSON.stringify({
      name: `k6 ${TEST_LABEL} User ${i}`,
      email,
      password: PASSWORD,
    });

    const res = http.post(`${BASE_URL}/api/register`, payload, jsonHeaders());

    check(res, {
      'setup register status is acceptable': (r) =>
        [200, 201, 400, 409].includes(r.status),
    });

    users.push({ email, password: PASSWORD });
  }

  return { users };
}

export function e2eCheckoutCoupon(data) {
  const user = data.users[(__VU - 1) % data.users.length];

  let token = null;
  let userId = __VU;
  let product = null;
  let quantity = 1;
  let totalAmount = 0;
  let finalAmount = 0;
  let couponId = null;
  let orderId = null;

  group('1. User dang nhap', () => {
    const res = http.post(
      `${BASE_URL}/api/login`,
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      jsonHeaders()
    );

    const body = safeJson(res);

    check(res, {
      'login status is 200': (r) => r.status === 200,
      'login returns token': () => Boolean(extractToken(body)),
    });

    token = extractToken(body);
    userId = extractUserId(body, __VU);
  });

  if (!token) return;

  group('2. User lay danh sach va chon san pham', () => {
    const res = http.get(
      `${BASE_URL}/api/products`,
      jsonHeaders(token)
    );

    const body = safeJson(res);
    const products = extractList(body);

    check(res, {
      'products status is 200': (r) => r.status === 200,
      'products list is not empty': () => products.length > 0,
    });

    if (products.length > 0) {
      product =
        products.find((item) => Number(item.price) >= MIN_COUPON_TOTAL) ||
        products[0];

      const price = Number(product.price || 0);
      quantity = Math.max(1, Math.ceil(MIN_COUPON_TOTAL / Math.max(price, 1)));
      totalAmount = price * quantity;
    }
  });

  if (!product) return;

  group('3. User them san pham vao gio hang', () => {
    const payload = JSON.stringify({
      id: product.id,
      product_id: product.id,
      name: product.name || 'EShop Product',
      price: Number(product.price || 0),
      quantity,
    });

    const res = http.post(
      `${BASE_URL}/api/cart`,
      payload,
      jsonHeaders(token)
    );

    check(res, {
      'add cart status is 200 or 201': (r) =>
        [200, 201].includes(r.status),
    });
  });

  group('4. User ap dung coupon SAVE10', () => {
    const res = http.post(
      `${BASE_URL}/api/apply-coupon`,
      JSON.stringify({
        code: 'SAVE10',
        total_amount: totalAmount,
      }),
      jsonHeaders(token)
    );

    const body = safeJson(res);

    check(res, {
      'coupon status is 200': (r) => r.status === 200,
      'coupon returns final amount': () =>
        Boolean(
          body.final_amount ||
          body.finalAmount ||
          (body.data &&
            (body.data.final_amount || body.data.finalAmount))
        ),
    });

    finalAmount = extractFinalAmount(body, totalAmount);
    couponId = extractCouponId(body);
  });

  group('5. User thanh toan', () => {
    const res = http.post(
      `${BASE_URL}/api/checkout`,
      JSON.stringify({
        total_amount: finalAmount || totalAmount,
        shipping_address: '123 Le Loi, Quan 1, TP.HCM',
      }),
      jsonHeaders(token)
    );

    const body = safeJson(res);

    check(res, {
      'checkout status is 200 or 201': (r) =>
        [200, 201].includes(r.status),
    });

    orderId = extractOrderId(body);
  });

  if (couponId) {
    group('6. Ghi nhan luot dung coupon', () => {
      const res = http.post(
        `${BASE_URL}/api/coupon-usage`,
        JSON.stringify({
          coupon_id: couponId,
          order_id: orderId,
          user_id: userId,
        }),
        jsonHeaders(token)
      );

      check(res, {
        'coupon usage status is acceptable': (r) =>
          [200, 201].includes(r.status),
      });
    });
  }

  sleep(1);
}
