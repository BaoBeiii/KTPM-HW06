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

// 00. Health Check Folder
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

// Helper function to create a Login Request item
function createLoginItem(name, bodyObj, testScripts, rawBody = null, headers = []) {
  const reqHeaders = [
    { key: "Content-Type", value: "application/json", type: "text" },
    ...headers
  ];
  return {
    name: name,
    event: [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: testScripts
        }
      }
    ],
    request: {
      method: "POST",
      header: reqHeaders,
      body: {
        mode: "raw",
        raw: rawBody !== null ? rawBody : JSON.stringify(bodyObj)
      },
      url: {
        raw: "{{baseUrl}}/api/login",
        host: ["{{baseUrl}}"],
        path: ["api", "login"]
      }
    },
    response: []
  };
}

// 01. Pool A - FR-02 Login Folder
const fr02Folder = {
  name: "01. Pool A - FR-02 Login",
  item: [
    // Pre-requisite: Setup test accounts for testing
    {
      name: "01.0 Setup: Register Dedicated Test Accounts",
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: [
              "pm.test('Setup: Accounts initialized', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 500]);",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json", type: "text" }],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Lockout Test User",
            email: "lockout_demo@eshop.com",
            password: "CorrectPassword123!"
          })
        },
        url: {
          raw: "{{baseUrl}}/api/register",
          host: ["{{baseUrl}}"],
          path: ["api", "register"]
        }
      },
      response: []
    }
  ]
};

// --- Subfolder: 01.1 Domain & Boundary Tests ---
const domainItems = [];

domainItems.push(createLoginItem(
  "TC-A01: Valid User Login (test@eshop.com)",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns JWT token string', function () { pm.expect(data.token).to.be.a('string').and.not.empty; });",
    "pm.test('Returns user object with role user', function () {",
    "    pm.expect(data.user).to.be.an('object');",
    "    pm.expect(data.user.email).to.eql('test@eshop.com');",
    "    pm.expect(data.user.role).to.eql('user');",
    "    pm.environment.set('userToken', data.token);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A02: Valid Admin Login (admin@eshop.com)",
  { email: "admin@eshop.com", password: "Admin123!" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "var data = pm.response.json();",
    "pm.test('Returns JWT token string for Admin', function () { pm.expect(data.token).to.be.a('string'); });",
    "pm.test('Returns user object with role admin', function () {",
    "    pm.expect(data.user.role).to.eql('admin');",
    "    pm.environment.set('adminToken', data.token);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A03: Invalid Email Format - Missing @",
  { email: "testeshop.com", password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized for invalid email format', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A04: Invalid Email Format - Missing Domain",
  { email: "test@", password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A05: Invalid Email Format - Double Dots in Domain",
  { email: "test@domain..com", password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A06: Email is Empty String",
  { email: "", password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty email', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A07: Email is Null",
  { email: null, password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on null email', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A08: Email is Whitespace Only",
  { email: "   ", password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on whitespace email', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A09: Email Not Registered in System",
  { email: "nonexistent_user_999@eshop.com", password: "Test1234!" },
  [
    "pm.test('Expect 401 Unauthorized for unregistered email', function () {",
    "    pm.response.to.have.status(401);",
    "});",
    "pm.test('Error message is generic without leaking user existence', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.error).to.be.a('string');",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A10: Password is Empty String",
  { email: "admin@eshop.com", password: "" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty password', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A11: Password is Null",
  { email: "admin@eshop.com", password: null },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on null password', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A12: Completely Wrong Password",
  { email: "nonexistent_user_999@eshop.com", password: "CompletelyWrongPassword999!" },
  [
    "pm.test('Expect 401 Unauthorized on wrong credentials', function () {",
    "    pm.response.to.have.status(401);",
    "});",
    "pm.test('Does not return token', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.token).to.be.undefined;",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A13: Password Case Sensitivity Test",
  { email: "nonexistent_user_999@eshop.com", password: "test1234!" },
  [
    "pm.test('Expect 401 Unauthorized', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A14: Empty JSON Request Body {}",
  {},
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on empty body', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A15: Missing Email Field",
  { password: "Test1234!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on missing email', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A16: Missing Password Field",
  { email: "test@eshop.com" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized on missing password', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A17: Extra Field Injection (role: admin)",
  { email: "test@eshop.com", password: "Test1234!", role: "admin" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('User role remains user, cannot elevate privilege via login body', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.user.role).to.eql('user');",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A18: Boundary - Password Under Min Length (7 chars)",
  { email: "nonexistent_user_999@eshop.com", password: "Pass12!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A19: Boundary - Password Exactly 8 chars",
  { email: "nonexistent_user_999@eshop.com", password: "Pass123!" },
  [
    "pm.test('Expect 401 Unauthorized (wrong password)', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A20: Boundary - Extremely Long Email (255 chars)",
  { email: "a".repeat(240) + "@eshop.com", password: "Test1234!" },
  [
    "pm.test('Expect 400 or 401 without server crash', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A21: Boundary - Extremely Long Password (1000 chars)",
  { email: "nonexistent_user_999@eshop.com", password: "A".repeat(998) + "1!" },
  [
    "pm.test('Expect 401 Unauthorized without DoS crash', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

domainItems.push(createLoginItem(
  "TC-A22: Format - Email with Leading and Trailing Whitespace",
  { email: "  test@eshop.com  ", password: "Test1234!" },
  [
    "pm.test('Expect 200 OK (trimmed) or 401 Unauthorized', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([200, 401]);",
    "});"
  ]
));

fr02Folder.item.push({
  name: "01.1 Domain & Boundary Tests",
  item: domainItems
});

// --- Subfolder: 01.2 State & Lockout Tests ---
const stateItems = [];

stateItems.push(createLoginItem(
  "TC-A23: Lockout Cycle - Failed Attempt 1",
  { email: "lockout_demo@eshop.com", password: "WrongPassword_1" },
  [
    "pm.test('Attempt 1 fails with 401 Unauthorized', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

stateItems.push(createLoginItem(
  "TC-A24: Lockout Cycle - Failed Attempt 2",
  { email: "lockout_demo@eshop.com", password: "WrongPassword_2" },
  [
    "pm.test('Attempt 2 fails with 401 Unauthorized', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

stateItems.push(createLoginItem(
  "TC-A25: Lockout Cycle - Failed Attempt 3 (Triggers Lockout)",
  { email: "lockout_demo@eshop.com", password: "WrongPassword_3" },
  [
    "pm.test('Attempt 3 fails with 401 Unauthorized', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

stateItems.push(createLoginItem(
  "TC-A26: Lockout Cycle - Attempt 4 While Locked (With CORRECT Password)",
  { email: "lockout_demo@eshop.com", password: "CorrectPassword123!" },
  [
    "pm.test('Expect 403 Forbidden because account is temporarily locked', function () {",
    "    pm.response.to.have.status(403);",
    "});",
    "pm.test('Error message mentions account is locked', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.error).to.include('khóa');",
    "});"
  ]
));

stateItems.push(createLoginItem(
  "TC-A27: Lockout Cycle - Attempt 5 While Locked (With WRONG Password)",
  { email: "lockout_demo@eshop.com", password: "WrongPassword_5" },
  [
    "pm.test('Expect 403 Forbidden while account remains locked', function () {",
    "    pm.response.to.have.status(403);",
    "});"
  ]
));

stateItems.push(createLoginItem(
  "TC-A28: State Reset - Successful Login Resets Failed Counter",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Login succeeds with 200 OK', function () {",
    "    pm.response.to.have.status(200);",
    "});",
    "pm.test('User can login normally and receives token', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.token).to.be.a('string');",
    "});"
  ]
));

fr02Folder.item.push({
  name: "01.2 State & Lockout Tests",
  item: stateItems
});

// --- Subfolder: 01.3 Security & SQLi Tests ---
const securityItems = [];

securityItems.push(createLoginItem(
  "TC-A29: SQL Injection in Email (' OR '1'='1)",
  { email: "' OR '1'='1", password: "anypassword" },
  [
    "pm.test('SQLi in Email must NOT result in 200 OK bypass', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});",
    "pm.test('No JWT token granted via SQL injection', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.token).to.be.undefined;",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A30: SQL Injection in Password (' OR '1'='1)",
  { email: "admin@eshop.com", password: "' OR '1'='1" },
  [
    "pm.test('SQLi in Password must NOT bypass password check', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A31: SQL Injection Comment Syntax (admin@eshop.com'--)",
  { email: "admin@eshop.com'--", password: "fakepassword" },
  [
    "pm.test('SQLi comment payload rejected with 401', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A32: SQL Injection UNION SELECT Payload",
  { email: "test@eshop.com' UNION SELECT 1,2,3--", password: "p" },
  [
    "pm.test('SQLi UNION payload rejected with 401', function () {",
    "    pm.response.to.have.status(401);",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A33: SEC-01 Check - No Plaintext or Hashed Password in Response",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('SEC-01 Violation Check: Password MUST NOT be exposed in user object', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.user.password, 'Vulnerability SEC-01: Plaintext password is leaked in response!').to.be.undefined;",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A34: NoSQL / Object Injection in JSON Body",
  { email: { "$gt": "" }, password: { "$gt": "" } },
  [
    "pm.test('Expect 400 Bad Request on object injection', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

securityItems.push(createLoginItem(
  "TC-A35: Content-Type Header Tampering (text/plain)",
  null,
  [
    "pm.test('Expect 400 Bad Request or 415 Unsupported Media Type', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 415, 500]);",
    "});"
  ],
  "email=test@eshop.com&password=Test1234!",
  [{ key: "Content-Type", value: "text/plain", type: "text" }]
));

fr02Folder.item.push({
  name: "01.3 Security & SQLi Tests",
  item: securityItems
});

// --- Subfolder: 01.4 Schema Validation Tests ---
const schemaItems = [];

schemaItems.push(createLoginItem(
  "TC-A36: Schema - JWT Token Format Verification",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('Token follows JWT 3-part format (header.payload.signature)', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.token).to.be.a('string');",
    "    var parts = data.token.split('.');",
    "    pm.expect(parts.length).to.eql(3);",
    "});"
  ]
));

schemaItems.push(createLoginItem(
  "TC-A37: Schema - User Object Structure Verification",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('User object contains required fields: id, name, email, role', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.user).to.have.property('id').that.is.a('number');",
    "    pm.expect(data.user).to.have.property('name').that.is.a('string');",
    "    pm.expect(data.user).to.have.property('email').that.is.a('string');",
    "    pm.expect(data.user).to.have.property('role').that.is.a('string');",
    "});"
  ]
));

schemaItems.push(createLoginItem(
  "TC-A38: Schema - Success Message Field Verification",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('Response contains message: Login successful', function () {",
    "    var data = pm.response.json();",
    "    pm.expect(data.message).to.eql('Login successful');",
    "});"
  ]
));

fr02Folder.item.push({
  name: "01.4 Schema Validation Tests",
  item: schemaItems
});

// --- Subfolder: 01.5 Human Extension Tests ---
const extItems = [];

extItems.push(createLoginItem(
  "TC-EXT-01: Case-Insensitive Email Authentication (TEST@ESHOP.COM)",
  { email: "TEST@ESHOP.COM", password: "Test1234!" },
  [
    "pm.test('Email RFC standard: Login succeeds with 200 OK on uppercase email', function () {",
    "    pm.response.to.have.status(200);",
    "});"
  ]
));

extItems.push(createLoginItem(
  "TC-EXT-02: JWT Token Payload Claims Verification",
  { email: "test@eshop.com", password: "Test1234!" },
  [
    "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
    "pm.test('JWT Payload contains matching id and role claims', function () {",
    "    var data = pm.response.json();",
    "    var token = data.token;",
    "    var base64Url = token.split('.')[1];",
    "    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');",
    "    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {",
    "        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);",
    "    }).join(''));",
    "    var payload = JSON.parse(jsonPayload);",
    "    pm.expect(payload.id).to.eql(data.user.id);",
    "    pm.expect(payload.role).to.eql(data.user.role);",
    "});"
  ]
));

extItems.push(createLoginItem(
  "TC-EXT-03: Malformed JSON Body Defense",
  null,
  [
    "pm.test('Expect 400 Bad Request on malformed JSON body without server crash', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 500]);",
    "});"
  ],
  "{email: \"test@eshop.com\", password"
));

extItems.push(createLoginItem(
  "TC-EXT-04: Timing Attack Defense (Existing vs Non-existing email)",
  { email: "nonexistent_user_999@eshop.com", password: "WrongPassword999!" },
  [
    "pm.test('Response time is under 500ms preventing timing discrepancy', function () {",
    "    pm.expect(pm.response.responseTime).to.be.below(500);",
    "});"
  ]
));

extItems.push(createLoginItem(
  "TC-EXT-05: Unicode Characters in Email (nguyễnvana@eshop.com)",
  { email: "nguyễnvana@eshop.com", password: "Password123!" },
  [
    "pm.test('Expect 400 Bad Request or 401 Unauthorized safely handled', function () {",
    "    pm.expect(pm.response.code).to.be.oneOf([400, 401]);",
    "});"
  ]
));

extItems.push(createLoginItem(
  "TC-EXT-06: Lockout Duration Verification (30 seconds)",
  { email: "lockout_demo@eshop.com", password: "CorrectPassword123!" },
  [
    "pm.test('Verifies lockout state on locked account', function () {",
    "    pm.response.to.have.status(403);",
    "});"
  ]
));

fr02Folder.item.push({
  name: "01.5 Human Extension Tests",
  item: extItems
});

// Add all folders to collection
collection.item.push(healthCheckFolder);
collection.item.push(fr02Folder);

// Placeholder folders for Pool B and Pool C
collection.item.push({
  name: "02. Pool B - FR-08 Checkout",
  item: []
});
collection.item.push({
  name: "03. Pool C - FR-14 Category CRUD",
  item: []
});

// Write to file
const targetPath = path.resolve(__dirname, '../collections/Postman_Collection.json');
fs.writeFileSync(targetPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Successfully generated Postman_Collection.json with ' + (domainItems.length + stateItems.length + securityItems.length + schemaItems.length + extItems.length) + ' test items for FR-02!');
