import PDFDocument from 'pdfkit';
import { ReportData } from '../src/types';

// PDF Report Generator using pdfkit
export function generatePDF(report: ReportData, res: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="website_report_${report.id}.pdf"`);
  doc.pipe(res);

  // Title Banner
  doc.rect(0, 0, 595.28, 120).fill('#1e1b4b');
  doc.fillColor('#ffffff');
  doc.fontSize(22).text('Vantage AI Website Audit Report', 50, 30);
  doc.fontSize(10).fillColor('#94a3b8').text(`Target URL: ${report.url}`, 50, 65);
  doc.text(`Scan Date: ${new Date(report.date).toLocaleString()}`, 50, 80);

  // Overview section
  doc.fillColor('#1e293b');
  doc.fontSize(14).text('Audit Executive Overview', 50, 140);
  
  // Custom overall score card
  doc.rect(50, 165, 500, 60).fill('#f1f5f9');
  doc.fillColor('#1e1b4b').fontSize(12).text('Overall Health Score', 70, 180);
  doc.fontSize(24).fillColor('#4f46e5').text(`${report.overallScore} / 100`, 70, 195);
  
  // Status text based on score
  let statusText = 'Excellent';
  let statusColor = '#10b981';
  if (report.overallScore < 50) {
    statusText = 'Critical Action Required';
    statusColor = '#ef4444';
  } else if (report.overallScore < 85) {
    statusText = 'Needs Improvement';
    statusColor = '#f59e0b';
  }
  doc.fontSize(11).fillColor('#475569').text('Current Evaluation Status:', 320, 180);
  doc.fontSize(14).fillColor(statusColor).text(statusText, 320, 195);

  // Category Scores Table
  doc.fontSize(13).fillColor('#1e293b').text('Categorical Health Percentages', 50, 245);
  let y = 270;
  
  const categoriesList = [
    { label: 'Performance / Speed', val: report.categories.performance },
    { label: 'Search Engine Optimization (SEO)', val: report.categories.seo },
    { label: 'Accessibility Standards (W3C)', val: report.categories.accessibility },
    { label: 'Platform Security Headers', val: report.categories.security },
    { label: 'Code Quality & DOM Sizes', val: report.categories.codeQuality },
    { label: 'Best Practices Validation', val: report.categories.bestPractices },
    { label: 'Mobile Device Friendliness', val: report.categories.responsive },
    { label: 'Broken Asset Checker', val: report.categories.brokenLinks }
  ];

  categoriesList.forEach((cat) => {
    doc.fontSize(9).fillColor('#475569').text(cat.label, 50, y);
    doc.fontSize(9).fillColor('#1e1b4b').text(`${cat.val} %`, 240, y);
    
    // Draw micro percentage bar
    doc.rect(280, y - 1, 200, 8).fill('#e2e8f0');
    const color = cat.val >= 90 ? '#10b981' : cat.val >= 50 ? '#f59e0b' : '#ef4444';
    doc.rect(280, y - 1, cat.val * 2, 8).fill(color);
    
    y += 18;
  });

  // Page Break for Detailed Issues List
  doc.addPage();
  doc.rect(0, 0, 595.28, 40).fill('#1e1b4b');
  doc.fillColor('#ffffff').fontSize(12).text('Vantage AI - Actionable Recommendations & Errors', 50, 15);
  
  doc.fillColor('#1e293b');
  let currentY = 60;
  doc.fontSize(13).text('Detected Code Anomalies & Remediation Actions', 50, currentY);
  currentY += 25;

  report.aiRecommendations.forEach((rec, idx) => {
    // Page constraints checker
    if (currentY > 700) {
      doc.addPage();
      currentY = 40;
    }

    const severityColor = rec.severity === 'critical' ? '#ef4444' : rec.severity === 'high' ? '#f97316' : rec.severity === 'medium' ? '#f59e0b' : '#64748b';
    
    doc.rect(50, currentY, 500, 2).fill('#e2e8f0');
    currentY += 10;

    // Severity & category headers
    doc.fontSize(8).fillColor(severityColor).text(`[${rec.severity.toUpperCase()} SEVERITY]`, 50, currentY);
    doc.fillColor('#4f46e5').text(`CATEGORY: ${rec.category.toUpperCase()} | SCORE IMPACT: -${rec.scoreImpact} PTS`, 160, currentY);
    currentY += 14;

    // Problem Statement
    doc.fontSize(10).fillColor('#1e293b').text(rec.problem, 50, currentY, { width: 500, bold: true } as any);
    currentY += 14;

    // Why it matters
    doc.fontSize(8.5).fillColor('#475569').text(`Why it is a problem: ${rec.whyItMatters}`, 50, currentY, { width: 500 });
    currentY += doc.heightOfString(`Why it is a problem: ${rec.whyItMatters}`, { width: 500 }) + 6;

    // Recommended Fix
    doc.fontSize(8.5).fillColor('#059669').text(`How to fix correctly: ${rec.howToFix}`, 50, currentY, { width: 500 });
    currentY += doc.heightOfString(`How to fix correctly: ${rec.howToFix}`, { width: 500 }) + 15;
  });

  // Draw footer text on pages
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(7).fillColor('#94a3b8').text(
      `Vantage AI Website Analyzer Node • Generated on ${new Date(report.date).toLocaleDateString()} • Page ${i + 1} of ${pages.count}`,
      50,
      800,
      { align: 'center', width: 500 }
    );
  }

  doc.end();
}

// DOCX Report Generator (Styled MS Word-compliant HTML)
export function generateDocx(report: ReportData, res: any) {
  res.setHeader('Content-Type', 'application/msword');
  res.setHeader('Content-Disposition', `attachment; filename="website_report_${report.id}.doc"`);

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Vantage AI Website Error Audit</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #333333; margin: 40px; line-height: 1.5; }
        h1 { color: #1e1b4b; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; font-size: 24px; }
        h2 { color: #4f46e5; font-size: 18px; margin-top: 30px; }
        h3 { color: #111827; font-size: 14px; margin-top: 20px; }
        .meta-box { background-color: #f3f4f6; border-left: 4px solid #1e1b4b; padding: 15px; margin-bottom: 20px; }
        .score-circle { font-size: 28px; font-weight: bold; color: #4f46e5; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #4f46e5; color: #ffffff; text-align: left; padding: 8px; font-size: 12px; }
        td { border-bottom: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
        .code-block { font-family: Consolas, monospace; background-color: #0f172a; color: #f8fafc; padding: 10px; border-radius: 5px; font-size: 11px; margin: 10px 0; }
        .correct-code { color: #34d399; }
        .error-code { color: #f87171; }
        .badge { display: inline-block; padding: 2px 6px; font-weight: bold; border-radius: 3px; font-size: 10px; text-transform: uppercase; }
        .badge-critical { background-color: #fef2f2; color: #ef4444; }
        .badge-high { background-color: #fff7ed; color: #f97316; }
        .badge-medium { background-color: #fffbeb; color: #f59e0b; }
        .badge-low { background-color: #f8fafc; color: #64748b; }
      </style>
    </head>
    <body>
      <h1>Vantage AI Error Analyzer Report</h1>
      <div class="meta-box">
        <strong>Target Website:</strong> ${report.url}<br/>
        <strong>Audit ID:</strong> ${report.id}<br/>
        <strong>Scan Timestamp:</strong> ${new Date(report.date).toLocaleString()}
      </div>

      <h2>Executive Summary</h2>
      <p>Our scanning crawlers analyzed the HTML, structural nodes, CSS styling properties, and external security parameters. Based on our indexing checklist, the website received an overall score of <span class="score-circle">${report.overallScore}/100</span>.</p>

      <h2>Categorical Quality Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Diagnostic Category</th>
            <th>Calculated Health %</th>
            <th>Lighthouse Evaluation</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Performance & Asset Delivery Speed</td><td>${report.categories.performance}%</td><td>${report.categories.performance >= 90 ? 'Good' : report.categories.performance >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Search Engine Optimization (SEO)</td><td>${report.categories.seo}%</td><td>${report.categories.seo >= 90 ? 'Good' : report.categories.seo >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Accessibility Compliance Standards</td><td>${report.categories.accessibility}%</td><td>${report.categories.accessibility >= 90 ? 'Good' : report.categories.accessibility >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Security Parameters & Headers</td><td>${report.categories.security}%</td><td>${report.categories.security >= 90 ? 'Good' : report.categories.security >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Code Quality & Asset Sizes</td><td>${report.categories.codeQuality}%</td><td>${report.categories.codeQuality >= 90 ? 'Good' : report.categories.codeQuality >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Best Practices Compliance</td><td>${report.categories.bestPractices}%</td><td>${report.categories.bestPractices >= 90 ? 'Good' : report.categories.bestPractices >= 50 ? 'Warning' : 'Critical'}</td></tr>
          <tr><td>Responsive Mobile Viewports</td><td>${report.categories.responsive}%</td><td>${report.categories.responsive >= 90 ? 'Good' : report.categories.responsive >= 50 ? 'Warning' : 'Critical'}</td></tr>
        </tbody>
      </table>

      <h2>Detailed Actionable AI Recommendations</h2>
      ${report.aiRecommendations.map((rec, index) => `
        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px;">
          <h3>Recommendation #${index + 1}: ${rec.problem}</h3>
          <p>
            <strong>Severity:</strong> <span class="badge badge-${rec.severity}">${rec.severity}</span> | 
            <strong>Category:</strong> ${rec.category.toUpperCase()} | 
            <strong>Health Score Impact:</strong> -${rec.scoreImpact} points
          </p>
          <p><strong>Why This is an Issue:</strong> ${rec.whyItMatters}</p>
          <p><strong>How to Remediate:</strong> ${rec.howToFix}</p>
          
          <div class="code-block">
            <strong class="error-code">// Identified Webpage Code Omission:</strong><br/>
            <code>${rec.exampleCode.current.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
          </div>

          <div class="code-block">
            <strong class="correct-code">// Corrected Code Solution:</strong><br/>
            <code>${rec.exampleCode.correct.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
          </div>
          
          <p><small>Reference Guidelines: <a href="${rec.referenceDocs}">${rec.referenceDocs}</a></small></p>
        </div>
      `).join('')}

      <h2>Line-by-Line Code Errors Log</h2>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Line</th>
            <th>Type</th>
            <th>Error Message</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${report.lineByLineReport.map(issue => `
            <tr>
              <td><code>${issue.fileName}</code></td>
              <td><strong>${issue.lineNumber}</strong></td>
              <td>${issue.type.toUpperCase()}</td>
              <td>${issue.error}</td>
              <td><span class="badge badge-${issue.severity === 'high' ? 'critical' : issue.severity}">${issue.severity}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <hr/>
      <p style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 50px;">
        Generated by Vantage AI Website Analyzer Node. No accounts or premium subscriptions required.
      </p>
    </body>
    </html>
  `;
  res.send(html);
}

// Excel Spreadsheet Generator (Styled Table-compatible HTML structure)
export function generateExcel(report: ReportData, res: any) {
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.setHeader('Content-Disposition', `attachment; filename="website_report_${report.id}.xls"`);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Audit Summary</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; }
        .header { background-color: #1e1b4b; color: #ffffff; font-weight: bold; font-size: 16px; height: 35px; text-align: center; }
        .meta-label { font-weight: bold; background-color: #f3f4f6; }
        .score { font-size: 14px; font-weight: bold; color: #4f46e5; text-align: center; }
        th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; }
        td { border: 1px solid #cbd5e1; padding: 6px; }
        .critical { color: #ef4444; font-weight: bold; }
        .high { color: #f97316; font-weight: bold; }
        .medium { color: #f59e0b; font-weight: bold; }
        .low { color: #64748b; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="7" class="header" valign="middle">Vantage AI Website Diagnostic Audit Excel Sheet</td>
        </tr>
        <tr>
          <td colspan="2" class="meta-label">Website URL:</td>
          <td colspan="5">${report.url}</td>
        </tr>
        <tr>
          <td colspan="2" class="meta-label">Audit ID:</td>
          <td colspan="5">${report.id}</td>
        </tr>
        <tr>
          <td colspan="2" class="meta-label">Scan Date:</td>
          <td colspan="5">${new Date(report.date).toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="2" class="meta-label">Overall Health Score:</td>
          <td colspan="5" class="score">${report.overallScore} / 100</td>
        </tr>
        <tr><td colspan="7"></td></tr>
        
        <tr>
          <th colspan="7">CATEGORICAL SUMMARY SCORES</th>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Performance & Loading Deliveries</td>
          <td colspan="4" align="right">${report.categories.performance}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Search Engine Optimization (SEO)</td>
          <td colspan="4" align="right">${report.categories.seo}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Accessibility Standards Compliance</td>
          <td colspan="4" align="right">${report.categories.accessibility}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Security Parameters & Headers</td>
          <td colspan="4" align="right">${report.categories.security}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Code Quality Quality Index</td>
          <td colspan="4" align="right">${report.categories.codeQuality}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Best Practices Core Requirements</td>
          <td colspan="4" align="right">${report.categories.bestPractices}%</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Mobile Friendly Viewports Matrix</td>
          <td colspan="4" align="right">${report.categories.responsive}%</td>
        </tr>
        <tr><td colspan="7"></td></tr>

        <tr>
          <th colspan="7">DETAILED RECTIFICATION CHECKS LIST</th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Category</th>
          <th>Severity</th>
          <th>Score Impact</th>
          <th>Identified Problem Code</th>
          <th>Suggested Remedy Fix Action</th>
          <th>Priority</th>
        </tr>
        ${report.aiRecommendations.map((rec, idx) => `
          <tr>
            <td align="center">${idx + 1}</td>
            <td align="center"><b>${rec.category.toUpperCase()}</b></td>
            <td align="center" class="${rec.severity}">${rec.severity.toUpperCase()}</td>
            <td align="right">-${rec.scoreImpact} pts</td>
            <td>${rec.problem}</td>
            <td>${rec.howToFix}</td>
            <td align="center">${rec.priority.toUpperCase()}</td>
          </tr>
        `).join('')}
        <tr><td colspan="7"></td></tr>

        <tr>
          <th colspan="7">LINE-BY-LINE HTML, CSS, JS CODE AUDIT LOGS</th>
        </tr>
        <tr>
          <th>No.</th>
          <th>File Path</th>
          <th>Line #</th>
          <th>Type</th>
          <th>Diagnostic Error Message</th>
          <th>Current Code Snippet</th>
          <th>Corrected Recommended Code</th>
        </tr>
        ${report.lineByLineReport.map((issue, idx) => `
          <tr>
            <td align="center">${idx + 1}</td>
            <td><code>${issue.fileName}</code></td>
            <td align="right"><b>${issue.lineNumber}</b></td>
            <td align="center">${issue.type.toUpperCase()}</td>
            <td>${issue.error}</td>
            <td><code>${issue.currentCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></td>
            <td><code>${issue.correctCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;
  res.send(html);
}

// CSV Document Generator (Standard comma-separated text)
export function generateCsv(report: ReportData, res: any) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="website_report_${report.id}.csv"`);

  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  csvContent += `Vantage AI Website Diagnostic Report\n`;
  csvContent += `Website URL,${report.url}\n`;
  csvContent += `Audit ID,${report.id}\n`;
  csvContent += `Scan Date,${new Date(report.date).toISOString()}\n`;
  csvContent += `Overall Health Score,${report.overallScore} / 100\n\n`;

  csvContent += `CATEGORY SUMMARY HEALTH SCORES\n`;
  csvContent += `Category,Health Percentage (%)\n`;
  Object.entries(report.categories).forEach(([name, val]) => {
    csvContent += `"${name.toUpperCase()}",${val}%\n`;
  });
  csvContent += `\n`;

  csvContent += `DETAILED ACTIONABLE CODES RECOMMENDATIONS\n`;
  csvContent += `Severity,Category,Problem,Impact,Fix Recommendation,Documentation Link\n`;
  report.aiRecommendations.forEach(rec => {
    csvContent += `"${rec.severity.toUpperCase()}","${rec.category.toUpperCase()}","${rec.problem.replace(/"/g, '""')}",-${rec.scoreImpact},"${rec.howToFix.replace(/"/g, '""')}","${rec.referenceDocs}"\n`;
  });
  csvContent += `\n`;

  csvContent += `LINE-BY-LINE SYSTEM ERROR CHECKLISTS\n`;
  csvContent += `File Name,Line Number,Type,Error Description,Current Code,Correct Code\n`;
  report.lineByLineReport.forEach(issue => {
    csvContent += `"${issue.fileName}",${issue.lineNumber},"${issue.type.toUpperCase()}","${issue.error.replace(/"/g, '""')}","${issue.currentCode.replace(/"/g, '""')}","${issue.correctCode.replace(/"/g, '""')}"\n`;
  });

  res.send(csvContent);
}

// JSON format downloader (Standard parsed structure)
export function generateJson(report: ReportData, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="website_report_${report.id}.json"`);
  res.send(JSON.stringify(report, null, 2));
}
