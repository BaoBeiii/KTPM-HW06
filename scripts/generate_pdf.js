const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cssStyle = `
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #24292e;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 18pt;
    color: #1f4e79;
    border-bottom: 2px solid #1f4e79;
    padding-bottom: 6px;
    margin-top: 20px;
    page-break-after: avoid;
  }
  h2 {
    font-size: 14pt;
    color: #1f4e79;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 4px;
    margin-top: 18px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12pt;
    color: #2b579a;
    margin-top: 14px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11pt;
    color: #333333;
    margin-top: 10px;
    page-break-after: avoid;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 9.5pt;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th, td {
    border: 1px solid #d1d5db;
    padding: 6px 10px;
    text-align: left;
    vertical-align: middle;
  }
  th {
    background-color: #f1f5f9;
    color: #1e293b;
    font-weight: 600;
  }
  tr:nth-child(even) {
    background-color: #f8fafc;
  }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 9pt;
    background-color: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    color: #b91c1c;
  }
  pre {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
    overflow-x: auto;
    font-size: 8.5pt;
    line-height: 1.45;
  }
  pre code {
    background-color: transparent;
    padding: 0;
    color: #334155;
  }
  blockquote {
    margin: 10px 0;
    padding: 8px 16px;
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e3a8a;
    font-style: italic;
  }
  hr {
    height: 1px;
    background-color: #e2e8f0;
    border: none;
    margin: 16px 0;
  }
  ul, ol {
    margin: 8px 0;
    padding-left: 24px;
  }
  li {
    margin-bottom: 4px;
  }
`;

function convertMarkdownToPdf(mdFilePath, outputPdfPath) {
  console.log(`Converting: ${mdFilePath} -> ${outputPdfPath}...`);
  const mdContent = fs.readFileSync(mdFilePath, 'utf8');
  const htmlBody = marked.parse(mdContent);

  const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${path.basename(outputPdfPath, '.pdf')}</title>
  <style>${cssStyle}</style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

  const tempHtmlPath = path.resolve(__dirname, `../reports/temp_${Date.now()}.html`);
  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  try {
    const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "file:///${tempHtmlPath.replace(/\\\\/g, '/')}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`[Success] Created PDF: ${outputPdfPath}`);
  } catch (err) {
    console.error(`Error generating PDF for ${outputPdfPath}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  // 1. Convert REPORT.md -> REPORT.pdf
  const reportMd = path.join(rootDir, 'REPORT.md');
  const reportPdf = path.join(rootDir, 'REPORT.pdf');
  convertMarkdownToPdf(reportMd, reportPdf);

  // 2. Convert AI_AUDIT_REPORT.md -> AI_AUDIT_REPORT.pdf
  const auditMd = path.join(rootDir, 'AI_AUDIT_REPORT.md');
  const auditPdf = path.join(rootDir, 'AI_AUDIT_REPORT.pdf');
  convertMarkdownToPdf(auditMd, auditPdf);
}

main();
