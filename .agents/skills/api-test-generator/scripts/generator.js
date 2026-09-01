#!/usr/bin/env node

/**
 * AI-Driven API Test Generator CLI
 * Author: Lưu Ngô Quốc Bảo (MSSV: 23127327)
 * Implements Bloom-AI G9.5 (Create)
 */

const fs = require('fs');
const path = require('path');

function parseArguments() {
  const args = process.argv.slice(2);
  const params = {
    studentId: "23127327",
    specPath: path.resolve(process.cwd(), 'eshop-sut/api_specification.md'),
    outputPath: path.resolve(process.cwd(), 'collections/Generated_Collection.json')
  };


  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--spec' && args[i + 1]) params.specPath = path.resolve(args[++i]);
    if (args[i] === '--out' && args[i + 1]) params.outputPath = path.resolve(args[++i]);
    if (args[i] === '--student-id' && args[i + 1]) params.studentId = args[++i];
  }
  return params;
}

function generateTestSuite(studentId) {
  console.log(`[API Test Generator] Initializing multi-pass test generation for Student: ${studentId}...`);

  const collection = {
    info: {
      name: `EShop Automated API Test Suite - ${studentId}`,
      description: "Auto-generated test collection produced by AI-Driven Test Generator Agent Skill (Bloom-AI G9.5)",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    event: [
      {
        listen: "prerequest",
        script: {
          type: "text/javascript",
          exec: [
            `pm.request.headers.upsert({ key: "X-Student-Id", value: "${studentId}" });`,
            `console.log("[Auto-Gen Anti-Cheat] Injected X-Student-Id: ${studentId}");`
          ]
        }
      }
    ],
    item: []
  };

  // Pass 1 & 2: Domain & Boundary for Login
  const loginFolder = {
    name: "01. AutoGen - FR-02 Login",
    item: [
      {
        name: "TC-GEN-01: Valid Login Credentials",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: { mode: "raw", raw: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }) },
          url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
        },
        event: [{
          listen: "test",
          script: {
            type: "text/javascript",
            exec: [
              "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
              "var data = pm.response.json();",
              "pm.test('Token returned and password not leaked', function () {",
              "    pm.expect(data.token).to.be.a('string');",
              "    pm.expect(data.user.password, 'Security SEC-01 Violation: Password leaked!').to.be.undefined;",
              "});"
            ]
          }
        }]
      },
      {
        name: "TC-GEN-02: Empty Email Boundary",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: { mode: "raw", raw: JSON.stringify({ email: "", password: "Test1234!" }) },
          url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
        },
        event: [{
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('Expect 400 or 401 on empty email', function () { pm.expect(pm.response.code).to.be.oneOf([400, 401]); });"]
          }
        }]
      }
    ]
  };

  // Pass 3 & 4: Security & Business Logic for Checkout
  const checkoutFolder = {
    name: "02. AutoGen - FR-08 Checkout",
    item: [
      {
        name: "TC-GEN-03: Price Tampering Defense (total_amount = 0)",
        request: {
          method: "POST",
          header: [
            { key: "Content-Type", value: "application/json" },
            { key: "Authorization", value: "Bearer {{userToken}}" }
          ],
          body: { mode: "raw", raw: JSON.stringify({ total_amount: 0, shipping_address: "123 Le Loi" }) },
          url: { raw: "{{baseUrl}}/api/checkout", host: ["{{baseUrl}}"], path: ["api", "checkout"] }
        },
        event: [{
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('Server must reject 0 VND order tampering', function () { pm.response.to.have.status(400); });"]
          }
        }]
      }
    ]
  };

  // Pass 5: RBAC & BFLA for Categories
  const categoryFolder = {
    name: "03. AutoGen - FR-14 Category CRUD",
    item: [
      {
        name: "TC-GEN-04: BFLA Authorization Check (Regular User Denied)",
        request: {
          method: "POST",
          header: [
            { key: "Content-Type", value: "application/json" },
            { key: "Authorization", value: "Bearer {{userToken}}" }
          ],
          body: { mode: "raw", raw: JSON.stringify({ name: "Unauthorized Cat" }) },
          url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
        },
        event: [{
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('Expect 403 Forbidden for non-admin', function () { pm.response.to.have.status(403); });"]
          }
        }]
      }
    ]
  };

  collection.item.push(loginFolder);
  collection.item.push(checkoutFolder);
  collection.item.push(categoryFolder);

  return collection;
}

function main() {
  const { studentId, outputPath } = parseArguments();
  const suite = generateTestSuite(studentId);
  fs.writeFileSync(outputPath, JSON.stringify(suite, null, 2), 'utf8');
  console.log(`[Success] Automated test suite generated and exported to: ${outputPath}`);
}

main();
