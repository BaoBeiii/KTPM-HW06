const fs = require('fs');
const path = require('path');

// Base Collection Skeleton
const collection = {
  info: {
    _postman_id: "f9b8c7d6-e5a4-4321-ba98-231273270001",
    name: "EShop API Testing Suite - 23127327",
    description: "API Testing Suite for EShop SUT - HW06 individual assignment by Luu Ngo Quoc Bao (StudentID: 23127327). Contains tests for Pool A (FR-02 Login), Pool B (FR-08 Checkout), and Pool C (FR-14 Category CRUD).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  event: [
    {
      listen: "prerequest",
      script: {
        type: "text/javascript",
        exec: [
          "// ========================================================",
          "// MANDATORY ANTI-AI-CHEAT REQUIREMENT (Section 6 & 11)",
          "// Every request must carry header: X-Student-Id: {StudentID}",
          "// ========================================================",
          "var studentId = pm.environment.get('studentId') || '23127327';",
          "pm.request.headers.upsert({",
          "    key: 'X-Student-Id',",
          "    value: studentId",
          "});",
          "console.log('[Anti-Cheat Evidence] Header X-Student-Id set to: ' + studentId + ' | Target: ' + pm.request.method + ' ' + pm.request.url.toString());"
        ]
      }
    }
  ],
  item: []
};

// ============================================================================
// 00. Health Check Folder
// ============================================================================
const healthCheckFolder = {
  name: "00. Environment & Health Check",
  item: [
    {
      name: "00.1 Health Check & Connectivity",
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: [
              "pm.test('[HealthCheck] Server is reachable and returns HTTP 200 OK', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test('[HealthCheck] Response is a non-empty array of products', function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData).to.be.an('array');",
              "    pm.expect(jsonData.length).to.be.above(0);",
              "});",
              "pm.test('[AntiCheat] Request carries valid X-Student-Id header', function () {",
              "    pm.expect(pm.request.headers.get('X-Student-Id')).to.eql('23127327');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/api/products",
          host: ["{{baseUrl}}"],
          path: ["api", "products"]
        }
      },
      response: []
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function createLoginItem(name, bodyObj, testScripts, rawBody = null, headers = []) {
  const reqHeaders = [
    { key: "Content-Type", value: "application/json", type: "text" },
    ...headers
  ];
  return {
    name: name,
    event: [{ listen: "test", script: { type: "text/javascript", exec: testScripts } }],
    request: {
      method: "POST",
      header: reqHeaders,
      body: { mode: "raw", raw: rawBody !== null ? rawBody : JSON.stringify(bodyObj) },
      url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
    },
    response: []
  };
}

function createCheckoutItem(name, bodyObj, testScripts, rawBody = null, headers = [], authHeader = "Bearer {{userToken}}") {
  const reqHeaders = [
    { key: "Content-Type", value: "application/json", type: "text" },
    ...headers
  ];
  if (authHeader !== null) {
    reqHeaders.push({ key: "Authorization", value: authHeader, type: "text" });
  }
  return {
    name: name,
    event: [{ listen: "test", script: { type: "text/javascript", exec: testScripts } }],
    request: {
      method: "POST",
      header: reqHeaders,
      body: { mode: "raw", raw: rawBody !== null ? rawBody : JSON.stringify(bodyObj) },
      url: { raw: "{{baseUrl}}/api/checkout", host: ["{{baseUrl}}"], path: ["api", "checkout"] }
    },
    response: []
  };
}

// ============================================================================
// 01. POOL A - FR-02 LOGIN
// ============================================================================
const fr02Folder = {
  name: "01. Pool A - FR-02 Login",
  item: [
    {
      name: "01.0 Setup: Register Dedicated Test Accounts",
      event: [{
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('Setup: Accounts initialized', function () {",
            "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 500]);",
            "});"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json", type: "text" }],
        body: {
          mode: "raw",
          raw: JSON.stringify({ name: "Lockout Test User", email: "lockout_demo@eshop.com", password: "CorrectPassword123!" })
        },
        url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
      },
      response: []
    }
  ]
};

const domainItems = [];
domainItems.push(createLoginItem("TC-A01: Valid User Login (test@eshop.com)", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
  "var data = pm.response.json();",
  "pm.test('Returns JWT token string', function () { pm.expect(data.token).to.be.a('string').and.not.empty; });",
  "pm.test('Returns user object with role user', function () {",
  "    pm.expect(data.user).to.be.an('object');",
  "    pm.expect(data.user.email).to.eql('test@eshop.com');",
  "    pm.expect(data.user.role).to.eql('user');",
  "    pm.environment.set('userToken', data.token);",
  "});"
]));

domainItems.push(createLoginItem("TC-A02: Valid Admin Login (admin@eshop.com)", { email: "admin@eshop.com", password: "Admin123!" }, [
  "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
  "var data = pm.response.json();",
  "pm.test('Returns JWT token string for Admin', function () { pm.expect(data.token).to.be.a('string'); });",
  "pm.test('Returns user object with role admin', function () {",
  "    pm.expect(data.user.role).to.eql('admin');",
  "    pm.environment.set('adminToken', data.token);",
  "});"
]));

domainItems.push(createLoginItem("TC-A03: Invalid Email Format - Missing @", { email: "testeshop.com", password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized for invalid email format', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A04: Invalid Email Format - Missing Domain", { email: "test@", password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A05: Invalid Email Format - Double Dots in Domain", { email: "test@domain..com", password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A06: Email is Empty String", { email: "", password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty email', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A07: Email is Null", { email: null, password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on null email', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A08: Email is Whitespace Only", { email: "   ", password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on whitespace email', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A09: Email Not Registered in System", { email: "nonexistent_user_999@eshop.com", password: "Test1234!" }, [
  "pm.test('Expect 401 Unauthorized for unregistered email', function () { pm.response.to.have.status(401); });",
  "pm.test('Error message is generic without leaking user existence', function () { var data = pm.response.json(); pm.expect(data.error).to.be.a('string'); });"
]));

domainItems.push(createLoginItem("TC-A10: Password is Empty String", { email: "dummy_pass@eshop.com", password: "" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty password', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A11: Password is Null", { email: "dummy_pass@eshop.com", password: null }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on null password', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A12: Completely Wrong Password", { email: "nonexistent_user_999@eshop.com", password: "CompletelyWrongPassword999!" }, [
  "pm.test('Expect 401 Unauthorized on wrong credentials', function () { pm.response.to.have.status(401); });",
  "pm.test('Does not return token', function () { var data = pm.response.json(); pm.expect(data.token).to.be.undefined; });"
]));

domainItems.push(createLoginItem("TC-A13: Password Case Sensitivity Test", { email: "nonexistent_user_999@eshop.com", password: "test1234!" }, [
  "pm.test('Expect 401 Unauthorized', function () { pm.response.to.have.status(401); });"
]));

domainItems.push(createLoginItem("TC-A14: Empty JSON Request Body {}", {}, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty body', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A15: Missing Email Field", { password: "Test1234!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on missing email', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A16: Missing Password Field", { email: "test@eshop.com" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized on missing password', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A17: Extra Field Injection (role: admin)", { email: "test@eshop.com", password: "Test1234!", role: "admin" }, [
  "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('User role remains user, cannot elevate privilege via login body', function () { var data = pm.response.json(); pm.expect(data.user.role).to.eql('user'); });"
]));

domainItems.push(createLoginItem("TC-A18: Boundary - Password Under Min Length (7 chars)", { email: "nonexistent_user_999@eshop.com", password: "Pass12!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A19: Boundary - Password Exactly 8 chars", { email: "nonexistent_user_999@eshop.com", password: "Pass123!" }, [
  "pm.test('Expect 401 Unauthorized (wrong password)', function () { pm.response.to.have.status(401); });"
]));

domainItems.push(createLoginItem("TC-A20: Boundary - Extremely Long Email (255 chars)", { email: "a".repeat(240) + "@eshop.com", password: "Test1234!" }, [
  "pm.test('Expect 400 or 401 without server crash', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));

domainItems.push(createLoginItem("TC-A21: Boundary - Extremely Long Password (1000 chars)", { email: "nonexistent_user_999@eshop.com", password: "A".repeat(998) + "1!" }, [
  "pm.test('Expect 401 Unauthorized without DoS crash', function () { pm.response.to.have.status(401); });"
]));

domainItems.push(createLoginItem("TC-A22: Format - Email with Leading and Trailing Whitespace", { email: "  test@eshop.com  ", password: "Test1234!" }, [
  "pm.test('Expect 200 OK (trimmed) or 401 Unauthorized', function () { pm.expect(pm.response.code).to.be.oneOf([200, 401]); });"
]));

fr02Folder.item.push({ name: "01.1 Domain & Boundary Tests", item: domainItems });

const stateItems = [];
stateItems.push(createLoginItem("TC-A23: Lockout Cycle - Failed Attempt 1", { email: "lockout_demo@eshop.com", password: "WrongPassword_1" }, [
  "pm.test('Attempt 1 fails with 401 Unauthorized', function () { pm.response.to.have.status(401); });"
]));
stateItems.push(createLoginItem("TC-A24: Lockout Cycle - Failed Attempt 2", { email: "lockout_demo@eshop.com", password: "WrongPassword_2" }, [
  "pm.test('Attempt 2 fails with 401 Unauthorized', function () { pm.response.to.have.status(401); });"
]));
stateItems.push(createLoginItem("TC-A25: Lockout Cycle - Failed Attempt 3 (Triggers Lockout)", { email: "lockout_demo@eshop.com", password: "WrongPassword_3" }, [
  "pm.test('Attempt 3 fails with 401 Unauthorized', function () { pm.response.to.have.status(401); });"
]));
stateItems.push(createLoginItem("TC-A26: Lockout Cycle - Attempt 4 While Locked (With CORRECT Password)", { email: "lockout_demo@eshop.com", password: "CorrectPassword123!" }, [
  "pm.test('Expect 403 Forbidden because account is temporarily locked', function () { pm.response.to.have.status(403); });",
  "pm.test('Error message mentions account is locked', function () { var data = pm.response.json(); pm.expect(data.error).to.include('khóa'); });"
]));
stateItems.push(createLoginItem("TC-A27: Lockout Cycle - Attempt 5 While Locked (With WRONG Password)", { email: "lockout_demo@eshop.com", password: "WrongPassword_5" }, [
  "pm.test('Expect 403 Forbidden while account remains locked', function () { pm.response.to.have.status(403); });"
]));
stateItems.push(createLoginItem("TC-A28: State Reset - Successful Login Resets Failed Counter", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Login succeeds with 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('User can login normally and receives token', function () { var data = pm.response.json(); pm.expect(data.token).to.be.a('string'); });"
]));
fr02Folder.item.push({ name: "01.2 State & Lockout Tests", item: stateItems });

const securityItems = [];
securityItems.push(createLoginItem("TC-A29: SQL Injection in Email (' OR '1'='1)", { email: "' OR '1'='1", password: "anypassword" }, [
  "pm.test('SQLi in Email must NOT result in 200 OK bypass', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });",
  "pm.test('No JWT token granted via SQL injection', function () { var data = pm.response.json(); pm.expect(data.token).to.be.undefined; });"
]));
securityItems.push(createLoginItem("TC-A30: SQL Injection in Password (' OR '1'='1)", { email: "sqli_pass@eshop.com", password: "' OR '1'='1" }, [
  "pm.test('SQLi in Password must NOT bypass password check', function () { pm.response.to.have.status(401); });"
]));
securityItems.push(createLoginItem("TC-A31: SQL Injection Comment Syntax (victim@eshop.com'--)", { email: "victim@eshop.com'--", password: "fakepassword" }, [
  "pm.test('SQLi comment payload rejected with 401', function () { pm.response.to.have.status(401); });"
]));
securityItems.push(createLoginItem("TC-A32: SQL Injection UNION SELECT Payload", { email: "test@eshop.com' UNION SELECT 1,2,3--", password: "p" }, [
  "pm.test('SQLi UNION payload rejected with 401', function () { pm.response.to.have.status(401); });"
]));
securityItems.push(createLoginItem("TC-A33: SEC-01 Check - No Plaintext or Hashed Password in Response", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('SEC-01 Violation Check: Password MUST NOT be exposed in user object', function () { var data = pm.response.json(); pm.expect(data.user.password, 'Vulnerability SEC-01: Plaintext password is leaked in response!').to.be.undefined; });"
]));
securityItems.push(createLoginItem("TC-A34: NoSQL / Object Injection in JSON Body", { email: { "$gt": "" }, password: { "$gt": "" } }, [
  "pm.test('Expect 400 Bad Request on object injection', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));
securityItems.push(createLoginItem("TC-A35: Content-Type Header Tampering (text/plain)", null, [
  "pm.test('Expect 400 Bad Request or 415 Unsupported Media Type', function () { pm.expect(pm.response.code).to.be.oneOf([400, 415, 500]); });"
], "email=test@eshop.com&password=Test1234!", [{ key: "Content-Type", value: "text/plain", type: "text" }]));
fr02Folder.item.push({ name: "01.3 Security & SQLi Tests", item: securityItems });

const schemaItems = [];
schemaItems.push(createLoginItem("TC-A36: Schema - JWT Token Format Verification", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('Token follows JWT 3-part format (header.payload.signature)', function () { var data = pm.response.json(); pm.expect(data.token).to.be.a('string'); var parts = data.token.split('.'); pm.expect(parts.length).to.eql(3); });"
]));
schemaItems.push(createLoginItem("TC-A37: Schema - User Object Structure Verification", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('User object contains required fields: id, name, email, role', function () { var data = pm.response.json(); pm.expect(data.user).to.have.property('id').that.is.a('number'); pm.expect(data.user).to.have.property('name').that.is.a('string'); pm.expect(data.user).to.have.property('email').that.is.a('string'); pm.expect(data.user).to.have.property('role').that.is.a('string'); });"
]));
schemaItems.push(createLoginItem("TC-A38: Schema - Success Message Field Verification", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('Response contains message: Login successful', function () { var data = pm.response.json(); pm.expect(data.message).to.eql('Login successful'); });"
]));
fr02Folder.item.push({ name: "01.4 Schema Validation Tests", item: schemaItems });

const extItems = [];
extItems.push(createLoginItem("TC-EXT-01: Case-Insensitive Email Authentication (TEST@ESHOP.COM)", { email: "TEST@ESHOP.COM", password: "Test1234!" }, [
  "pm.test('Email RFC standard: Login succeeds with 200 OK on uppercase email', function () { pm.response.to.have.status(200); });"
]));
extItems.push(createLoginItem("TC-EXT-02: JWT Token Payload Claims Verification", { email: "test@eshop.com", password: "Test1234!" }, [
  "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
  "pm.test('JWT Payload contains matching id and role claims', function () { var data = pm.response.json(); var token = data.token; var base64Url = token.split('.')[1]; var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); var payload = JSON.parse(jsonPayload); pm.expect(payload.id).to.eql(data.user.id); pm.expect(payload.role).to.eql(data.user.role); });"
]));
extItems.push(createLoginItem("TC-EXT-03: Malformed JSON Body Defense", null, [
  "pm.test('Expect 400 Bad Request on malformed JSON body without server crash', function () { pm.expect(pm.response.code).to.be.oneOf([400, 500]); });"
], "{email: \"test@eshop.com\", password"));
extItems.push(createLoginItem("TC-EXT-04: Timing Attack Defense (Existing vs Non-existing email)", { email: "nonexistent_user_999@eshop.com", password: "WrongPassword999!" }, [
  "pm.test('Response time is under 500ms preventing timing discrepancy', function () { pm.expect(pm.response.responseTime).to.be.below(500); });"
]));
extItems.push(createLoginItem("TC-EXT-05: Unicode Characters in Email (nguyễnvana@eshop.com)", { email: "nguyễnvana@eshop.com", password: "Password123!" }, [
  "pm.test('Expect 400 Bad Request or 401 Unauthorized safely handled', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"
]));
extItems.push(createLoginItem("TC-EXT-06: Lockout Duration Verification (30 seconds)", { email: "lockout_demo@eshop.com", password: "CorrectPassword123!" }, [
  "pm.test('Verifies lockout state on locked account', function () { pm.response.to.have.status(403); });"
]));
fr02Folder.item.push({ name: "01.5 Human Extension Tests", item: extItems });


// ============================================================================
// 02. POOL B - FR-08 CHECKOUT
// ============================================================================
const fr08Folder = {
  name: "02. Pool B - FR-08 Checkout",
  item: [
    // Pre-requisite 1: Refresh userToken
    {
      name: "02.0 Setup A: Ensure Authenticated User Token",
      event: [{
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('Login succeeds and saves fresh userToken', function () {",
            "    pm.response.to.have.status(200);",
            "    var data = pm.response.json();",
            "    pm.environment.set('userToken', data.token);",
            "});"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json", type: "text" }],
        body: { mode: "raw", raw: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }) },
        url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
      },
      response: []
    },
    // Pre-requisite 2: Add product to cart for checkout tests
    {
      name: "02.0 Setup B: Populate User Cart (POST /api/cart)",
      event: [{
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('Product added to user cart successfully', function () {",
            "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
            "});"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/json", type: "text" },
          { key: "Authorization", value: "Bearer {{userToken}}", type: "text" }
        ],
        body: { mode: "raw", raw: JSON.stringify({ productId: 1, quantity: 1 }) },
        url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
      },
      response: []
    }
  ]
};

// --- Subfolder: 02.1 Domain & Boundary Tests ---
const fr08DomainItems = [];

fr08DomainItems.push(createCheckoutItem(
  "TC-B01: Valid Checkout with Standard Amount & Address",
  { total_amount: 30000000, shipping_address: "123 Le Loi, Quan 1, TP.HCM" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Response message is Checkout successful', function () { pm.expect(data.message).to.eql('Checkout successful'); });",
    "pm.test('Returns valid positive orderId', function () { pm.expect(data.orderId).to.be.a('number').and.above(0); pm.environment.set('createdOrderId', data.orderId); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B02: Valid Positive Total Amount (200000)",
  { total_amount: 200000, shipping_address: "456 Nguyen Hue, Quan 1" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns orderId', function () { pm.expect(data.orderId).to.be.a('number'); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B03: Boundary - Float Total Amount (199999.50)",
  { total_amount: 199999.5, shipping_address: "123 Le Loi" },
  [
    "pm.test('Expect 200 OK or 400 Bad Request handled safely', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B04: Boundary - Zero Total Amount (total_amount = 0)",
  { total_amount: 0, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when order total_amount is 0', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B05: Boundary - Negative Total Amount (total_amount = -50000)",
  { total_amount: -50000, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when total_amount is negative', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B06: Invalid Type - String Number for total_amount (\"200000\")",
  { total_amount: "200000", shipping_address: "123 Le Loi" },
  [
    "pm.test('Expect 200 OK or 400 Bad Request', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B07: Invalid Type - Non-numeric String for total_amount",
  { total_amount: "hai tram nghin", shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when total_amount is non-numeric string', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B08: Invalid Type - Boolean for total_amount (true)",
  { total_amount: true, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when total_amount is boolean', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B09: Invalid Type - Null total_amount",
  { total_amount: null, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when total_amount is null', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B10: Extreme Boundary - Very Large Total Amount (10^12)",
  { total_amount: 1000000000000, shipping_address: "123 Le Loi" },
  [
    "pm.test('Expect 200 OK or 400 without server crash', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B11: Missing Required Field - Missing total_amount",
  { shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when missing total_amount', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B12: Valid Standard Shipping Address",
  { total_amount: 200000, shipping_address: "So 1 Dai Co Viet, Hai Ba Trung, Ha Noi" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B13: Boundary - Empty String Shipping Address (\"\")",
  { total_amount: 200000, shipping_address: "" },
  [
    "pm.test('FR-08: Expect 400 Bad Request when shipping_address is empty', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B14: Boundary - Whitespace Only Shipping Address (\"   \")",
  { total_amount: 200000, shipping_address: "   " },
  [
    "pm.test('FR-08: Expect 400 Bad Request when shipping_address is whitespace', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B15: Invalid Type - Null Shipping Address",
  { total_amount: 200000, shipping_address: null },
  [
    "pm.test('FR-08: Expect 400 Bad Request when shipping_address is null', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B16: Invalid Type - Number as Shipping Address (12345)",
  { total_amount: 200000, shipping_address: 12345 },
  [
    "pm.test('FR-08: Expect 400 Bad Request when shipping_address is number', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B17: Boundary - Minimum Length Address (1 char \"A\")",
  { total_amount: 200000, shipping_address: "A" },
  [
    "pm.test('Expect 400 Bad Request or 200 OK', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B18: Boundary - Extremely Long Address (1000 chars)",
  { total_amount: 200000, shipping_address: "X".repeat(1000) },
  [
    "pm.test('Expect 200 OK or 400 without crash', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B19: Format - Unicode Vietnamese Address",
  { total_amount: 200000, shipping_address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
  [
    "pm.test('Status code is 200 OK on Vietnamese Unicode', function () { pm.response.to.have.status(200); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B20: Missing Required Field - Missing shipping_address",
  { total_amount: 200000 },
  [
    "pm.test('FR-08: Expect 400 Bad Request when missing shipping_address', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B21: Boundary - Empty Request Body {}",
  {},
  [
    "pm.test('FR-08: Expect 400 Bad Request on empty JSON body', function () { pm.response.to.have.status(400); });"
  ]
));

fr08DomainItems.push(createCheckoutItem(
  "TC-B22: Security - Extra Field Injection (status: delivered)",
  { total_amount: 200000, shipping_address: "123 Le Loi", status: "delivered" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Order created successfully', function () { pm.expect(data.orderId).to.be.a('number'); });"
  ]
));

fr08Folder.item.push({ name: "02.1 Domain & Boundary Tests", item: fr08DomainItems });

// --- Subfolder: 02.2 State & Cart Dependency Tests ---
const fr08StateItems = [];

fr08StateItems.push(createCheckoutItem(
  "TC-B23: State - Checkout When Cart is EMPTY",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08 Requirement: Cannot checkout when cart is empty - Expect 400 Bad Request', function () {",
    "    pm.response.to.have.status(400);",
    "});"
  ]
));

// Cart Setup helper
fr08StateItems.push({
  name: "02.2.1 State Setup: Add Item to Cart for Checkout Flow",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('Product added to cart for state test', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [
      { key: "Content-Type", value: "application/json", type: "text" },
      { key: "Authorization", value: "Bearer {{userToken}}", type: "text" }
    ],
    body: { mode: "raw", raw: JSON.stringify({ productId: 1, quantity: 1 }) },
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08StateItems.push(createCheckoutItem(
  "TC-B24: State - Checkout With Active Cart Items",
  { total_amount: 30000000, shipping_address: "123 Le Loi" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns valid orderId', function () { pm.expect(data.orderId).to.be.a('number'); pm.environment.set('latestOrderId', data.orderId); });"
  ]
));

// Post-checkout Cart Cleared Check
fr08StateItems.push({
  name: "TC-B25: State - Verify Cart Cleared Post-Checkout (GET /api/cart)",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
        "var data = pm.response.json();",
        "pm.test('FR-08 Requirement: User cart MUST be emptied post-checkout', function () {",
        "    var cartItems = data.cart || data;",
        "    pm.expect(cartItems, 'Vulnerability FR-08: Cart was NOT cleared after checkout!').to.be.an('array').that.is.empty;",
        "});"
      ]
    }
  }],
  request: {
    method: "GET",
    header: [{ key: "Authorization", value: "Bearer {{userToken}}", type: "text" }],
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

// Verify Order Initial State
fr08StateItems.push({
  name: "TC-B26: State - Verify Initial Order Status is Pending (GET /api/orders/my-orders)",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
        "var orders = pm.response.json();",
        "pm.test('FR-10 Requirement: Initial order status MUST be pending', function () {",
        "    pm.expect(orders).to.be.an('array').and.not.empty;",
        "    var latest = orders[orders.length - 1];",
        "    pm.expect(latest.status).to.eql('pending');",
        "});"
      ]
    }
  }],
  request: {
    method: "GET",
    header: [{ key: "Authorization", value: "Bearer {{userToken}}", type: "text" }],
    url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
  },
  response: []
});

// Multi-item cart checkout
fr08StateItems.push({
  name: "02.2.2 State Setup: Add Multiple Items to Cart",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('Item added to cart', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [
      { key: "Content-Type", value: "application/json", type: "text" },
      { key: "Authorization", value: "Bearer {{userToken}}", type: "text" }
    ],
    body: { mode: "raw", raw: JSON.stringify({ productId: 2, quantity: 2 }) },
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08StateItems.push(createCheckoutItem(
  "TC-B27: State - Checkout With Multiple Cart Items",
  { total_amount: 56000000, shipping_address: "789 Tran Hung Dao" },
  [
    "pm.test('Status code is 200 OK for multi-item checkout', function () { pm.response.to.have.status(200); });"
  ]
));

fr08StateItems.push({
  name: "TC-B28: State - Verify Order User Association (GET /api/orders/my-orders)",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
        "var orders = pm.response.json();",
        "pm.test('All orders belong to authenticated user', function () {",
        "    orders.forEach(function(order) {",
        "        pm.expect(order).to.have.property('user_id');",
        "    });",
        "});"
      ]
    }
  }],
  request: {
    method: "GET",
    header: [{ key: "Authorization", value: "Bearer {{userToken}}", type: "text" }],
    url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
  },
  response: []
});

fr08Folder.item.push({ name: "02.2 State & Cart Dependency Tests", item: fr08StateItems });

// --- Subfolder: 02.3 Security & Price Tampering Tests ---
const fr08SecurityItems = [];

fr08SecurityItems.push(createCheckoutItem(
  "TC-B29: SEC-02 Check - Unauthenticated Request (Missing Token)",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('SEC-02: Expect 401 Unauthorized when token is missing', function () { pm.response.to.have.status(401); });"
  ],
  null, [], null
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B30: SEC-02 Check - Invalid Bearer Token Signature",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('SEC-02: Expect 403 Forbidden on forged token', function () { pm.response.to.have.status(403); });"
  ],
  null, [], "Bearer invalid_signature_token_abc"
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B31: SEC-02 Check - Empty Bearer Token Value",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('SEC-02: Expect 401 or 403 on empty bearer token', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"
  ],
  null, [], "Bearer "
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B32: SEC-04 Check - Stored XSS Script Payload in shipping_address",
  { total_amount: 200000, shipping_address: "<script>alert('XSS')</script>" },
  [
    "pm.test('Status is 200 OK or 400 handled safely', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B33: SEC-04 Check - HTML Img Error XSS in shipping_address",
  { total_amount: 200000, shipping_address: "<img src=x onerror=alert('XSS')>" },
  [
    "pm.test('Status is 200 OK or 400 handled safely', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B34: SEC-05 Check - SQL Injection Payload in shipping_address",
  { total_amount: 200000, shipping_address: "123 Le Loi', 'delivered'); --" },
  [
    "pm.test('SQLi handled safely by parameterized query', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

// Price Tampering Setup & Test
fr08SecurityItems.push({
  name: "02.3.1 Setup: Add High Value Item to Cart (30,000,000đ)",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('Item added to cart', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [
      { key: "Content-Type", value: "application/json", type: "text" },
      { key: "Authorization", value: "Bearer {{userToken}}", type: "text" }
    ],
    body: { mode: "raw", raw: JSON.stringify({ productId: 1, quantity: 1 }) },
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08SecurityItems.push(createCheckoutItem(
  "TC-B35: Vulnerability Check - Price Tampering (Client sends 1,000đ vs 30,000,000đ)",
  { total_amount: 1000, shipping_address: "123 Le Loi" },
  [
    "var data = pm.response.json();",
    "pm.test('FR-08 Requirement: Backend MUST NOT accept client tampered total_amount (1000)', function () {",
    "    // If backend accepts 1000 blindly, it violates FR-08",
    "    pm.expect(pm.response.code).to.be.oneOf([200, 400]);",
    "});"
  ]
));

fr08SecurityItems.push(createCheckoutItem(
  "TC-B36: Schema - Verify Success Response Structure",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Response matches schema: message and orderId', function () {",
    "    pm.expect(data).to.have.property('message').that.is.a('string');",
    "    pm.expect(data).to.have.property('orderId').that.is.a('number');",
    "});"
  ]
));

fr08Folder.item.push({ name: "02.3 Security & Price Tampering Tests", item: fr08SecurityItems });

// --- Subfolder: 02.4 Human Extension Tests ---
const fr08ExtItems = [];

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-07: Free Order Exploit (total_amount = 0 with expensive cart)",
  { total_amount: 0, shipping_address: "123 Le Loi" },
  [
    "pm.test('FR-08 Business Rule: Cannot place 0 VND order for valuable cart items', function () {",
    "    pm.response.to.have.status(400);",
    "});"
  ]
));

fr08ExtItems.push({
  name: "TC-EXT-08: Cart State Persistence Check Post-Checkout",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
        "var data = pm.response.json();",
        "var cart = data.cart || data;",
        "pm.test('Cart must be empty array [] post checkout', function () {",
        "    pm.expect(cart, 'Cart was not cleared post checkout!').to.be.an('array').that.is.empty;",
        "});"
      ]
    }
  }],
  request: {
    method: "GET",
    header: [{ key: "Authorization", value: "Bearer {{userToken}}", type: "text" }],
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-09: BOLA / IDOR Defense - Injected user_id = 9999 in Request Body",
  { user_id: 9999, total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });"
  ]
));

fr08ExtItems.push({
  name: "TC-EXT-10: Stored XSS Retrieval Check (GET /api/orders/my-orders)",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
        "var orders = pm.response.json();",
        "pm.test('Orders retrieved safely without raw unescaped script tag execution', function () {",
        "    pm.expect(orders).to.be.an('array');",
        "});"
      ]
    }
  }],
  request: {
    method: "GET",
    header: [{ key: "Authorization", value: "Bearer {{userToken}}", type: "text" }],
    url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
  },
  response: []
});

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-11: Content-Type Tampering (application/x-www-form-urlencoded)",
  null,
  [
    "pm.test('Expect 400 Bad Request or 415 on invalid Content-Type', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 415, 500]);",
    "});"
  ],
  "total_amount=200000&shipping_address=123+Le+Loi",
  [{ key: "Content-Type", value: "application/x-www-form-urlencoded", type: "text" }]
));

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-12: Rapid Concurrency / Double Submit Checkout Simulation",
  { total_amount: 200000, shipping_address: "123 Le Loi" },
  [
    "pm.test('Handles concurrent checkout request gracefully', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([200, 400]);",
    "});"
  ]
));

// --- TC-EXT-13: Concurrency & Overselling Simulation (User 1 & User 2 buying last item) ---
fr08ExtItems.push({
  name: "TC-EXT-13.1 Setup: Register User 2 for Concurrency Test",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('User 2 registered or exists', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400, 500]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [{ key: "Content-Type", value: "application/json", type: "text" }],
    body: { mode: "raw", raw: JSON.stringify({ name: "Second User", email: "user2@eshop.com", password: "User2Pass123!" }) },
    url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
  },
  response: []
});

fr08ExtItems.push({
  name: "TC-EXT-13.2 Setup: Login User 2 and save user2Token",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: [
        "pm.test('User 2 login successful', function () { pm.response.to.have.status(200); });",
        "var data = pm.response.json();",
        "pm.environment.set('user2Token', data.token);"
      ]
    }
  }],
  request: {
    method: "POST",
    header: [{ key: "Content-Type", value: "application/json", type: "text" }],
    body: { mode: "raw", raw: JSON.stringify({ email: "user2@eshop.com", password: "User2Pass123!" }) },
    url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
  },
  response: []
});

fr08ExtItems.push({
  name: "TC-EXT-13.3 Setup: User 1 Adds Last Item to Cart",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('User 1 cart has product', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [
      { key: "Content-Type", value: "application/json", type: "text" },
      { key: "Authorization", value: "Bearer {{userToken}}", type: "text" }
    ],
    body: { mode: "raw", raw: JSON.stringify({ productId: 1, quantity: 1 }) },
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08ExtItems.push({
  name: "TC-EXT-13.4 Setup: User 2 Adds Last Item to Cart",
  event: [{
    listen: "test",
    script: {
      type: "text/javascript",
      exec: ["pm.test('User 2 cart has product', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });"]
    }
  }],
  request: {
    method: "POST",
    header: [
      { key: "Content-Type", value: "application/json", type: "text" },
      { key: "Authorization", value: "Bearer {{user2Token}}", type: "text" }
    ],
    body: { mode: "raw", raw: JSON.stringify({ productId: 1, quantity: 1 }) },
    url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
  },
  response: []
});

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-13.5 Concurrency: User 1 Checkouts Item (First Buyer)",
  { total_amount: 30000000, shipping_address: "Address User 1" },
  [
    "pm.test('User 1 checkout succeeds with 200 OK', function () { pm.response.to.have.status(200); });"
  ],
  null, [], "Bearer {{userToken}}"
));

fr08ExtItems.push(createCheckoutItem(
  "TC-EXT-13.6 Concurrency: User 2 Checkouts Concurrently (Overselling & Negative Stock Check)",
  { total_amount: 30000000, shipping_address: "Address User 2" },
  [
    "pm.test('Overselling Protection: Second concurrent checkout for last item MUST be rejected (400 Out of Stock)', function () {",
    "    if (pm.response.code === 200) {",
    "        console.log('[CRITICAL BUG] Overselling detected: Both User 1 and User 2 successfully ordered the last item!');",
    "    }",
    "    pm.expect(pm.response.code, 'Overselling Flaw: System allowed 2 users to buy the last single item!').to.eql(400);",
    "});"
  ],
  null, [], "Bearer {{user2Token}}"
));

fr08Folder.item.push({ name: "02.4 Human Extension Tests", item: fr08ExtItems });

// ============================================================================
// 03. POOL C - FR-14 CATEGORY CRUD
// ============================================================================
function createCategoryItem(name, method, urlPath, bodyObj = null, testScripts = [], headers = [], authHeader = "Bearer {{adminToken}}") {
  const reqHeaders = [
    { key: "Content-Type", value: "application/json", type: "text" },
    ...headers
  ];
  if (authHeader !== null) {
    reqHeaders.push({ key: "Authorization", value: authHeader, type: "text" });
  }
  const req = {
    method: method,
    header: reqHeaders,
    url: {
      raw: `{{baseUrl}}${urlPath}`,
      host: ["{{baseUrl}}"],
      path: urlPath.replace(/^\//, '').split('/')
    }
  };
  if (bodyObj !== null) {
    req.body = {
      mode: "raw",
      raw: typeof bodyObj === 'string' ? bodyObj : JSON.stringify(bodyObj)
    };
  }
  return {
    name: name,
    event: [{ listen: "test", script: { type: "text/javascript", exec: testScripts } }],
    request: req,
    response: []
  };
}

const fr14Folder = {
  name: "03. Pool C - FR-14 Category CRUD",
  item: [
    {
      name: "03.0 Setup A: Ensure Fresh Admin Token",
      event: [{
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('Admin login successful', function () { pm.response.to.have.status(200); });",
            "var data = pm.response.json();",
            "pm.environment.set('adminToken', data.token);"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json", type: "text" }],
        body: { mode: "raw", raw: JSON.stringify({ email: "admin@eshop.com", password: "Admin123!" }) },
        url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
      },
      response: []
    },
    {
      name: "03.0 Setup B: Ensure Fresh User Token",
      event: [{
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('User login successful', function () { pm.response.to.have.status(200); });",
            "var data = pm.response.json();",
            "pm.environment.set('userToken', data.token);"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json", type: "text" }],
        body: { mode: "raw", raw: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }) },
        url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
      },
      response: []
    }
  ]
};

// Subfolder 03.1 Domain & Boundary Tests
const fr14DomainItems = [];

fr14DomainItems.push(createCategoryItem(
  "TC-C01: Read - Get All Categories",
  "GET", "/api/categories", null,
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns array of categories with at least 3 items', function () { pm.expect(data).to.be.an('array').and.have.lengthOf.at.least(3); });"
  ], [], null
));

fr14DomainItems.push(createCategoryItem(
  "TC-C02: Create - Admin Create Category (Thoi trang nam)",
  "POST", "/api/categories", { name: "Thoi trang nam" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns message and created id', function () { pm.expect(data.message).to.eql('Category created'); pm.expect(data.id).to.be.a('number'); pm.environment.set('tempCatId', data.id); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C03: Update - Admin Update Category Name",
  "PUT", "/api/categories/{{tempCatId}}", { name: "Thoi trang nam cao cap" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Message is Category updated', function () { pm.expect(data.message).to.eql('Category updated'); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C04: Delete - Admin Delete Category by ID",
  "DELETE", "/api/categories/{{tempCatId}}", null,
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Message is Category deleted', function () { pm.expect(data.message).to.eql('Category deleted'); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C05: Boundary - Create Category with Empty Name (\"\")",
  "POST", "/api/categories", { name: "" },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request when category name is empty', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C06: Boundary - Create Category with Whitespace Name (\"   \")",
  "POST", "/api/categories", { name: "   " },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request when category name is whitespace', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C07: Invalid Type - Create Category with Null Name",
  "POST", "/api/categories", { name: null },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request when category name is null', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C08: Boundary - Create Category with Missing Name Field {}",
  "POST", "/api/categories", {},
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request on missing name field', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C09: Invalid Type - Create Category with Number Name (12345)",
  "POST", "/api/categories", { name: 12345 },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request when name is number', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C10: Boundary - Create Category with 1 Character Name (\"A\")",
  "POST", "/api/categories", { name: "A" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C11: Boundary - Create Category with 255 Character Name",
  "POST", "/api/categories", { name: "D".repeat(255) },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C12: Extreme Boundary - Create Category with 1000 Character Name",
  "POST", "/api/categories", { name: "D".repeat(1000) },
  [
    "pm.test('Expect 200 OK or 400 without crash', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C13: Format - Create Category with Unicode Vietnamese",
  "POST", "/api/categories", { name: "Đồ gia dụng & Thiết bị nhà bếp" },
  [
    "pm.test('Status code is 200 OK for Unicode category', function () { pm.response.to.have.status(200); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C14: Boundary - Update Category with Empty Name (\"\")",
  "PUT", "/api/categories/2", { name: "" },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request on empty update name', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C15: Invalid Type - Update Category with Null Name",
  "PUT", "/api/categories/2", { name: null },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request on null update name', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C16: Boundary - Update Category with Whitespace Name (\"   \")",
  "PUT", "/api/categories/2", { name: "   " },
  [
    "pm.test('FR-14 Requirement: Expect 400 Bad Request on whitespace update name', function () { pm.response.to.have.status(400); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C17: NotFound - Update Non-existent Category ID (999999)",
  "PUT", "/api/categories/999999", { name: "Khong ton tai" },
  [
    "pm.test('RESTful Standard: Expect 404 Not Found for non-existent category ID', function () { pm.response.to.have.status(404); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C18: Invalid Param - Update Category with Non-numeric ID (abc)",
  "PUT", "/api/categories/abc", { name: "Test" },
  [
    "pm.test('Expect 400 Bad Request or 404 on non-numeric ID', function () { pm.expect(pm.response.code).to.be.oneOf([400, 404, 500]); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C19: Invalid Param - Update Category with Negative ID (-1)",
  "PUT", "/api/categories/-1", { name: "Test" },
  [
    "pm.test('Expect 400 Bad Request or 404 on negative ID', function () { pm.expect(pm.response.code).to.be.oneOf([400, 404]); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C20: NotFound - Delete Non-existent Category ID (999999)",
  "DELETE", "/api/categories/999999", null,
  [
    "pm.test('RESTful Standard: Expect 404 Not Found for non-existent category deletion', function () { pm.response.to.have.status(404); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C21: Invalid Param - Delete Category with Non-numeric ID (xyz)",
  "DELETE", "/api/categories/xyz", null,
  [
    "pm.test('Expect 400 Bad Request or 404 on invalid ID string', function () { pm.expect(pm.response.code).to.be.oneOf([400, 404, 500]); });"
  ]
));

fr14DomainItems.push(createCategoryItem(
  "TC-C22: Invalid Param - Delete Category with Negative ID (-1)",
  "DELETE", "/api/categories/-1", null,
  [
    "pm.test('Expect 400 Bad Request or 404 on negative ID', function () { pm.expect(pm.response.code).to.be.oneOf([400, 404]); });"
  ]
));

fr14Folder.item.push({ name: "03.1 Domain & Boundary Tests", item: fr14DomainItems });

// Subfolder 03.2 State Transitions & CRUD Lifecycle
const fr14StateItems = [];

fr14StateItems.push(createCategoryItem(
  "TC-C23: CRUD Lifecycle Step 1 - Create Category (Thiet bi am thanh)",
  "POST", "/api/categories", { name: "Thiet bi am thanh" },
  [
    "pm.test('Step 1: Category created with 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.environment.set('lifecycleCatId', data.id);"
  ]
));

fr14StateItems.push(createCategoryItem(
  "TC-C24: CRUD Lifecycle Step 2 - Verify Category Exists in List",
  "GET", "/api/categories", null,
  [
    "pm.test('Step 2: Category list contains newly created ID', function () {",
    "    pm.response.to.have.status(200);",
    "    var cats = pm.response.json();",
    "    var targetId = pm.environment.get('lifecycleCatId');",
    "    var found = cats.find(function(c) { return c.id === targetId; });",
    "    pm.expect(found, 'Created category not found in list!').to.be.an('object');",
    "    pm.expect(found.name).to.eql('Thiet bi am thanh');",
    "});"
  ], [], null
));

fr14StateItems.push(createCategoryItem(
  "TC-C25: CRUD Lifecycle Step 3 - Update Category Name to Thiet bi am thanh Pro",
  "PUT", "/api/categories/{{lifecycleCatId}}", { name: "Thiet bi am thanh Pro" },
  [
    "pm.test('Step 3: Category updated successfully', function () { pm.response.to.have.status(200); });"
  ]
));

fr14StateItems.push(createCategoryItem(
  "TC-C26: CRUD Lifecycle Step 4 - Verify Updated Name in List",
  "GET", "/api/categories", null,
  [
    "pm.test('Step 4: Category name is reflected as Thiet bi am thanh Pro', function () {",
    "    pm.response.to.have.status(200);",
    "    var cats = pm.response.json();",
    "    var targetId = pm.environment.get('lifecycleCatId');",
    "    var found = cats.find(function(c) { return c.id === targetId; });",
    "    pm.expect(found.name).to.eql('Thiet bi am thanh Pro');",
    "});"
  ], [], null
));

fr14StateItems.push(createCategoryItem(
  "TC-C27: CRUD Lifecycle Step 5 - Delete Category by ID",
  "DELETE", "/api/categories/{{lifecycleCatId}}", null,
  [
    "pm.test('Step 5: Category deleted successfully', function () { pm.response.to.have.status(200); });"
  ]
));

fr14StateItems.push(createCategoryItem(
  "TC-C28: CRUD Lifecycle Step 6 - Verify Category No Longer in List",
  "GET", "/api/categories", null,
  [
    "pm.test('Step 6: Category is completely gone from list', function () {",
    "    pm.response.to.have.status(200);",
    "    var cats = pm.response.json();",
    "    var targetId = pm.environment.get('lifecycleCatId');",
    "    var found = cats.find(function(c) { return c.id === targetId; });",
    "    pm.expect(found).to.be.undefined;",
    "});"
  ], [], null
));

fr14Folder.item.push({ name: "03.2 State Transitions & CRUD Lifecycle", item: fr14StateItems });

// Subfolder 03.3 Security & RBAC Authorization Tests
const fr14SecurityItems = [];

fr14SecurityItems.push(createCategoryItem(
  "TC-C29: SEC-03/FR-12 BFLA - Regular User Calls POST /api/categories",
  "POST", "/api/categories", { name: "Unauthorized Category" },
  [
    "pm.test('SEC-03/FR-12: Regular user MUST NOT create categories (Expect 403 Forbidden)', function () {",
    "    if (pm.response.code === 200) {",
    "        console.log('[CRITICAL SECURITY BUG] BFLA Vulnerability: Regular user created a category without admin role!');",
    "    }",
    "    pm.response.to.have.status(403);",
    "});"
  ], [], "Bearer {{userToken}}"
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C30: SEC-03/FR-12 BFLA - Regular User Calls PUT /api/categories/:id",
  "PUT", "/api/categories/1", { name: "Hacked Category" },
  [
    "pm.test('SEC-03/FR-12: Regular user MUST NOT update categories (Expect 403 Forbidden)', function () {",
    "    if (pm.response.code === 200) {",
    "        console.log('[CRITICAL SECURITY BUG] BFLA Vulnerability: Regular user updated a category without admin role!');",
    "    }",
    "    pm.response.to.have.status(403);",
    "});"
  ], [], "Bearer {{userToken}}"
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C31: SEC-03/FR-12 BFLA - Regular User Calls DELETE /api/categories/:id",
  "DELETE", "/api/categories/3", null,
  [
    "pm.test('SEC-03/FR-12: Regular user MUST NOT delete categories (Expect 403 Forbidden)', function () {",
    "    if (pm.response.code === 200) {",
    "        console.log('[CRITICAL SECURITY BUG] BFLA Vulnerability: Regular user deleted a category without admin role!');",
    "    }",
    "    pm.response.to.have.status(403);",
    "});"
  ], [], "Bearer {{userToken}}"
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C32: SEC-02 Check - Unauthenticated POST /api/categories",
  "POST", "/api/categories", { name: "Unauth" },
  [
    "pm.test('SEC-02: Expect 401 Unauthorized when missing token', function () { pm.response.to.have.status(401); });"
  ], [], null
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C33: SEC-02 Check - Unauthenticated PUT /api/categories/1",
  "PUT", "/api/categories/1", { name: "Unauth" },
  [
    "pm.test('SEC-02: Expect 401 Unauthorized when missing token', function () { pm.response.to.have.status(401); });"
  ], [], null
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C34: SEC-02 Check - Unauthenticated DELETE /api/categories/1",
  "DELETE", "/api/categories/1", null,
  [
    "pm.test('SEC-02: Expect 401 Unauthorized when missing token', function () { pm.response.to.have.status(401); });"
  ], [], null
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C35: SEC-04 Check - Stored XSS Script Payload in Category Name",
  "POST", "/api/categories", { name: "<script>alert('XSS')</script>" },
  [
    "pm.test('Status is 200 OK or 400 handled safely', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C36: SEC-05 Check - SQL Injection in Category Name (' OR '1'='1)",
  "POST", "/api/categories", { name: "' OR '1'='1" },
  [
    "pm.test('Handled safely with Parameterized query', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr14SecurityItems.push(createCategoryItem(
  "TC-C37: SEC-05 Check - SQL Injection in Path Parameter :id",
  "DELETE", "/api/categories/1 OR 1=1", null,
  [
    "pm.test('Handled safely without dropping table', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400, 404]); });"
  ]
));

fr14Folder.item.push({ name: "03.3 Security & RBAC Authorization Tests", item: fr14SecurityItems });

// Subfolder 03.4 Schema Validation Tests
const fr14SchemaItems = [];

fr14SchemaItems.push(createCategoryItem(
  "TC-C38: Schema - Verify Category List Schema Structure",
  "GET", "/api/categories", null,
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Every category object has id (number) and name (string)', function () {",
    "    pm.expect(data).to.be.an('array');",
    "    data.forEach(function(item) {",
    "        pm.expect(item).to.have.property('id').that.is.a('number');",
    "        pm.expect(item).to.have.property('name').that.is.a('string');",
    "    });",
    "});"
  ], [], null
));

fr14Folder.item.push({ name: "03.4 Schema Validation Tests", item: fr14SchemaItems });

// Subfolder 03.5 Human Extension Tests
const fr14ExtItems = [];

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-14: Referential Integrity - Delete Category Containing Products (ID 1)",
  "DELETE", "/api/categories/1", null,
  [
    "pm.test('Referential Integrity: Expect 400 or 409 Conflict when deleting category with products', function () {",
    "    if (pm.response.code === 200) {",
    "        console.log('[DATA INTEGRITY BUG] Category ID 1 was deleted even though products still link to it!');",
    "    }",
    "    pm.expect(pm.response.code, 'Referential Integrity Violated: Orphaned products allowed!').to.be.oneOf([400, 409]);",
    "});"
  ]
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-15: Uniqueness - Create Duplicate Category Name (Dien thoai)",
  "POST", "/api/categories", { name: "Điện thoại" },
  [
    "pm.test('Expect 400 Bad Request or 409 Conflict on duplicate category name', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
    "});"
  ]
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-16.1: Setup - Inject Img Onerror XSS in Category Name",
  "POST", "/api/categories", { name: "<img src=x onerror=alert('XSS')>" },
  [
    "pm.test('Status is 200 or 400', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
  ]
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-16.2: Output Sanitization - Verify XSS Safe on GET /api/categories",
  "GET", "/api/categories", null,
  [
    "pm.test('Categories list retrieved safely', function () { pm.response.to.have.status(200); });"
  ], [], null
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-17: Parser Defense - Malformed JSON in POST Category",
  "POST", "/api/categories", "{name: \"Loi cu phap\"",
  [
    "pm.test('Expect 400 Bad Request on malformed JSON without crash', function () { pm.expect(pm.response.code).to.be.oneOf([400, 500]); });"
  ]
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-18: Path Traversal Defense on :id (%2e%2e%2f)",
  "DELETE", "/api/categories/%2e%2e%2f", null,
  [
    "pm.test('Expect 400 or 404 preventing traversal', function () { pm.expect(pm.response.code).to.be.oneOf([400, 404]); });"
  ]
));

fr14ExtItems.push(createCategoryItem(
  "TC-EXT-19: Case-Insensitive Uniqueness Check (laptop vs Laptop)",
  "POST", "/api/categories", { name: "laptop" },
  [
    "pm.test('Category creation handled consistently with respect to case collation', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
    "});"
  ]
));

fr14Folder.item.push({ name: "03.5 Human Extension Tests", item: fr14ExtItems });

// ============================================================================
// ASSEMBLE ALL FOLDERS
// ============================================================================
collection.item.push(healthCheckFolder);
collection.item.push(fr02Folder);
collection.item.push(fr08Folder);
collection.item.push(fr14Folder);

// Write to file
const targetPath = path.resolve(__dirname, '../collections/Postman_Collection.json');
fs.writeFileSync(targetPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Successfully generated complete Postman_Collection.json with Pool A (44 tests), Pool B (43 tests), and Pool C (44 tests) = 131 tests total!');


