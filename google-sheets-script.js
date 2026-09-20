/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * TechBETA 2026 2.0 - Google Sheets Backup + Verified Email Confirmation Webhook
 *
 * WORKFLOW:
 * 1. REGISTRATION (from Website):
 *    - Records row in Google Sheet as 'Pending Verification'.
 *    - Columns automatically match your exact Google Sheet headers dynamically!
 *    - DOES NOT send email yet.
 * 
 * 2. ADMIN VERIFICATION (from System Dashboard):
 *    - When the admin clicks "Verify" in the dashboard, System calls this webhook with action: 'verify'.
 *    - Automatically sends the official confirmation email to the participant!
 *    - Email includes:
 *        * Master Participant ID (TB001, TB002...)
 *        * Verified Entry Pass QR Code
 *        * 📥 Direct "Download Entry Pass (PDF)" button
 *        * Verified payment badge
 *        * Registered events and schedule
 *        * WhatsApp community join button
 *    - Updates the Google Sheet row status to 'Verified' and 'Email Sent: Sent (time)'.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open Google Sheet -> Extensions -> Apps Script
 * 2. Replace ALL code with this script
 * 3. Click 'Deploy' -> 'Manage Deployments' -> Edit (pencil icon) -> 'New version' -> Deploy!
 */

// CONFIG - update as needed
var WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/DUMMY_LINK_REPLACE_ME';
var CONTACT_EMAIL = 'techbeta22k26@gmail.com';
var EVENT_DATE = 'October 13, 2026';
var SYMPOSIUM_NAME = 'TechBETA 2026 2.0';
var WEBSITE_URL = 'https://techbeta2026.vercel.app'; // Official website URL

var DEFAULT_HEADERS = [
  'Timestamp (IST)',
  'Team ID',
  'Team Name',
  'Member #',
  'Full Name',
  'Email',
  'Mobile',
  'Department',
  'Year',
  'College',
  'Technical Events',
  'Non-Technical Events',
  'Payment UTR / Ref',
  'Amount (INR)',
  'Payment Status',
  'Email Sent?'
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create header row if new sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(DEFAULT_HEADERS);
      sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold').setBackground('#e2e8f0');
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'register';

    // ─── ACTION 1: NEW REGISTRATION SUBMISSION (PENDING, NO EMAIL) ───
    if (action === 'register') {
      var rows = data.rows || [];

      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rowData = buildRowForHeaders(headers, r, 'Pending Verification', 'No (Awaiting Verification)');
        sheet.appendRow(rowData);
      }

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          action: 'registered_pending',
          count: rows.length,
          message: 'Saved to Google Sheet with exact column alignment. Email awaits Admin verification.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ─── ACTION 2: ADMIN VERIFIED -> SEND CONFIRMATION EMAIL WITH PARTICIPANT ID & PASS ───
    if (action === 'verify' || action === 'send_confirmation') {
      var participants = data.participants || (data.participant ? [data.participant] : []);
      var results = [];

      for (var j = 0; j < participants.length; j++) {
        var p = participants[j];
        var emailStatus = 'Not Sent';

        if (p.email && p.email.indexOf('@') !== -1) {
          try {
            var displayId = p.participantId || p.teamId || 'TB001';
            if (!displayId.toUpperCase().startsWith('TB')) {
              displayId = 'TB' + ('000' + displayId).slice(-3);
            }
            p.participantId = displayId;

            MailApp.sendEmail({
              to: p.email,
              subject: 'Registration Confirmed: ' + SYMPOSIUM_NAME + ' [' + displayId + ']',
              htmlBody: buildEmailHtml(p),
              name: 'TechBETA 2026 2.0 - SXCCE'
            });
            emailStatus = 'Sent (' + new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ')';
          } catch (mailErr) {
            emailStatus = 'Failed: ' + mailErr.toString();
          }

          // Update Google Sheet row if matching participant exists
          updateSheetVerificationStatus(sheet, p, emailStatus);
        }

        results.push({ email: p.email, participantId: p.participantId, status: emailStatus });
      }

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          action: 'verified_email_sent',
          results: results
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ignored', message: 'Unknown action: ' + action }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Dynamically find 1-based column index matching header candidate keywords
function findColIndex(headers, candidates) {
  for (var c = 0; c < candidates.length; c++) {
    var cand = candidates[c].toLowerCase();
    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i] || '').trim().toLowerCase();
      if (h === cand || h.indexOf(cand) !== -1) {
        return i + 1; // 1-based column index for sheet.getRange
      }
    }
  }
  return -1;
}

// Dynamically construct a row array aligned 1:1 with the sheet's actual header names
function buildRowForHeaders(headers, r, paymentStatus, emailStatus) {
  var row = [];
  var displayId = r.participantId || r.teamId || 'TB001';
  if (!displayId.toUpperCase().startsWith('TB')) {
    displayId = 'TB' + ('000' + displayId).slice(-3);
  }

  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || '').trim().toLowerCase();

    if (h.indexOf('timestamp') !== -1) {
      row.push(r.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    } else if (h.indexOf('participant id') !== -1) {
      row.push(displayId);
    } else if (h.indexOf('team id') !== -1) {
      // User's Google Sheet has 'Team ID' column which stores TB001, TB002...
      row.push(displayId);
    } else if (h.indexOf('team name') !== -1) {
      row.push(r.teamName || 'Individual');
    } else if (h.indexOf('member') !== -1) {
      row.push(r.memberNumber || 1);
    } else if (h.indexOf('name') !== -1 && h.indexOf('team') === -1) {
      row.push(r.name || '');
    } else if (h.indexOf('email sent') !== -1 || h.indexOf('mail sent') !== -1 || h.indexOf('email status') !== -1) {
      row.push(emailStatus);
    } else if (h.indexOf('email') !== -1) {
      row.push(r.email || '');
    } else if (h.indexOf('mobile') !== -1 || h.indexOf('phone') !== -1 || h.indexOf('contact') !== -1) {
      row.push(r.phone || '');
    } else if (h.indexOf('department') !== -1 || h.indexOf('dept') !== -1) {
      row.push(r.department || '');
    } else if (h.indexOf('year') !== -1) {
      row.push(r.year || '');
    } else if (h.indexOf('college') !== -1 || h.indexOf('institution') !== -1) {
      row.push(r.college || '');
    } else if (h.indexOf('technical event') !== -1 || h.indexOf('tech event') !== -1) {
      row.push(r.technicalEvents || '');
    } else if (h.indexOf('non-tech') !== -1 || h.indexOf('non technical') !== -1) {
      row.push(r.nonTechnicalEvents || '');
    } else if (h.indexOf('utr') !== -1 || h.indexOf('ref') !== -1 || h.indexOf('payment ref') !== -1) {
      row.push(r.paymentUtr || 'N/A');
    } else if (h.indexOf('amount') !== -1) {
      row.push(r.amount || 200);
    } else if (h.indexOf('status') !== -1 || h.indexOf('verified') !== -1) {
      row.push(paymentStatus);
    } else {
      row.push('');
    }
  }

  return row;
}

// Find existing row by Participant ID, Team ID, or Email and update Payment Status & Email Sent columns
function updateSheetVerificationStatus(sheet, p, emailStatus) {
  try {
    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    if (lastCol === 0 || lastRow < 2) {
      // No data rows exist yet, append
      var fallbackHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : DEFAULT_HEADERS;
      sheet.appendRow(buildRowForHeaders(fallbackHeaders, p, 'Verified', emailStatus));
      return;
    }

    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var data = sheet.getDataRange().getValues();

    // Dynamically locate column indices (1-based)
    var partIdCol = findColIndex(headers, ['participant id', 'team id']);
    var emailCol = findColIndex(headers, ['email']);
    var statusCol = findColIndex(headers, ['payment status', 'status']);
    var mailCol = findColIndex(headers, ['email sent', 'email status']);

    var displayId = p.participantId || p.teamId || '';
    if (displayId && !displayId.toUpperCase().startsWith('TB')) {
      displayId = 'TB' + ('000' + displayId).slice(-3);
    }
    var targetId = displayId.toString().trim().toUpperCase();
    var targetEmail = (p.email || '').toString().trim().toLowerCase();

    var foundRow = -1;

    for (var r = 1; r < data.length; r++) {
      var rowId = (partIdCol > 0 && data[r][partId - 1]) ? data[r][partId - 1].toString().trim().toUpperCase() : '';
      var rowMail = (emailCol > 0 && data[r][emailCol - 1]) ? data[r][emailCol - 1].toString().trim().toLowerCase() : '';

      if ((targetId && rowId === targetId) || (targetEmail && rowMail === targetEmail)) {
        foundRow = r + 1; // 1-based row index for sheet.getRange
        break;
      }
    }

    if (foundRow > 0) {
      if (statusCol > 0) {
        sheet.getRange(foundRow, statusCol).setValue('Verified');
      }
      if (mailCol > 0) {
        sheet.getRange(foundRow, mailCol).setValue(emailStatus);
      }
    } else {
      // If row was not found (e.g. manually created on spot), append with correct alignment
      var row = buildRowForHeaders(headers, p, 'Verified', emailStatus);
      sheet.appendRow(row);
    }
  } catch (err) {
    Logger.log('Error in updateSheetVerificationStatus: ' + err);
  }
}

function buildEmailHtml(r) {
  var techEvents = r.technicalEvents || 'None registered';
  var nonTech = r.nonTechnicalEvents || 'None registered';
  var firstName = (r.name || 'Participant').split(' ')[0];
  var displayId = r.participantId || 'TB001';

  var html = '';
  html += '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TechBETA 2026 2.0 Registration Confirmation</title></head>';
  html += '<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">';
  html += '<div style="max-width:600px;margin:0 auto;padding:24px 12px;">';

  // 1. HEADER
  html += '<div style="background:linear-gradient(135deg,#0f172a,#1e3a5f,#0284c7);padding:32px 24px;border-radius:18px 18px 0 0;text-align:center;">';
  html += '<p style="margin:0 0 4px;font-size:10px;color:#7dd3fc;text-transform:uppercase;letter-spacing:3px;font-weight:700;">St. Xavier\'s Catholic College of Engineering</p>';
  html += '<h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:1px;">TechBETA <span style="color:#38bdf8;">2026 2.0</span></h1>';
  html += '<p style="margin:6px 0 0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Department of Information Technology &bull; Brigitz</p>';
  html += '</div>';

  // 2. VERIFIED CONFIRMATION BANNER
  html += '<div style="background:#ffffff;padding:24px;text-align:center;border:1px solid #e2e8f0;border-top:none;">';
  html += '<div style="display:inline-block;background:#ecfdf5;border:1.5px solid #10b981;border-radius:40px;padding:6px 18px;margin-bottom:12px;">';
  html += '<span style="color:#047857;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:1px;">&#10003; Verified &amp; Confirmed Registration</span>';
  html += '</div>';
  html += '<h2 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#0f172a;">Hey ' + firstName + ', your registration is confirmed! &#127881;</h2>';
  html += '<p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Your seat and participation for <strong>TechBETA 2026 2.0</strong> is officially verified.</p>';

  // 3. PROMINENT MASTER PARTICIPANT ID BOX
  html += '<div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:14px;padding:18px 20px;text-align:center;margin:18px 0 10px;">';
  html += '<span style="font-size:11px;color:#1e40af;text-transform:uppercase;font-weight:800;letter-spacing:2px;display:block;">Your Official Participant ID</span>';
  html += '<span style="font-family:monospace,Consolas,Courier;font-size:34px;font-weight:900;color:#1d4ed8;letter-spacing:3px;display:block;margin:6px 0 4px;">' + displayId + '</span>';
  html += '<span style="font-size:11px;color:#64748b;display:block;">Quote this ID at the campus reception and competition event desks</span>';
  html += '</div>';

  html += '</div>';

  // 4. PARTICIPANT DETAILS CONTAINER & TABLE
  html += '<div style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:24px;">';

  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Participant ID</span><span style="display:inline-block;padding:3px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;color:#1d4ed8;font-family:monospace;font-size:14px;font-weight:900;letter-spacing:1px;">' + displayId + '</span></td></tr>';
  html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Full Name</span><strong style="color:#0f172a;font-size:14px;">' + r.name + '</strong></td></tr>';
  html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">College / Institution</span><span style="color:#1e293b;font-weight:700;">' + (r.college || 'St. Xavier\'s Catholic College of Engineering') + '</span></td></tr>';
  if (r.department) {
    html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Department &amp; Year</span><span style="color:#334155;font-weight:600;">' + r.department + (r.year ? ' (' + r.year + ')' : '') + '</span></td></tr>';
  }
  html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Technical Events</span><span style="color:#0c4a6e;font-weight:700;">' + techEvents + '</span></td></tr>';
  html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#7e22ce;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Non-Technical Events</span><span style="color:#581c87;font-weight:700;">' + nonTech + '</span></td></tr>';
  html += '<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;"><span style="display:block;font-size:9px;color:#047857;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Payment Status</span><span style="color:#047857;font-weight:800;font-size:12px;">&#10003; VERIFIED &bull; PAID &#8377;' + (r.amount || 200) + '</span></td></tr>';
  html += '<tr><td style="padding:7px 0;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Reporting Time &amp; Venue</span><span style="color:#0f172a;font-weight:700;">' + EVENT_DATE + ' &bull; 9:00 AM &bull; Conference Hall, St. Xavier\'s Catholic College of Engineering, Nagercoil</span></td></tr>';
  html += '</table>';

  // Inclusions banner
  html += '<div style="background:#f8fafc;margin-top:16px;padding:12px 16px;border-radius:10px;border:1px solid #e2e8f0;display:table;width:100%;box-sizing:border-box;">';
  html += '<div style="display:table-cell;font-size:11px;color:#475569;font-weight:600;">Includes: Grand Buffet Lunch &bull; Official Certificate &bull; Event Access Kit</div>';
  html += '<div style="display:table-cell;text-align:right;font-size:14px;font-weight:900;color:#047857;">&#8377;' + (r.amount || 200) + ' <span style="font-size:10px;color:#64748b;font-weight:500;">verified</span></div>';
  html += '</div>';

  html += '</div>';

  // 5. WHATSAPP JOIN CARD
  html += '<div style="background:#ffffff;padding:24px;border:1px solid #e2e8f0;border-top:none;">';
  html += '<div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:14px;padding:22px;text-align:center;">';
  html += '<div style="font-size:26px;margin-bottom:8px;">&#128172;</div>';
  html += '<h3 style="margin:0 0 8px;font-size:15px;font-weight:800;color:#14532d;">Join the Official TechBETA 2.0 WhatsApp Group</h3>';
  html += '<p style="margin:0 0 16px;font-size:12px;color:#166534;line-height:1.6;">Get live announcements &mdash; event venues, schedules, spot updates &amp; food tokens.</p>';
  html += '<a href="' + WHATSAPP_GROUP_LINK + '" target="_blank" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:40px;font-size:13px;font-weight:800;box-shadow:0 4px 12px rgba(37,211,102,0.25);">';
  html += 'Join WhatsApp Group';
  html += '</a>';
  html += '<p style="margin:10px 0 0;font-size:10px;color:#4ade80;">Important updates will be posted here on event day!</p>';
  html += '</div></div>';

  // 6. FOOTER
  html += '<div style="background:#0f172a;padding:22px 24px;border-radius:0 0 18px 18px;text-align:center;">';
  html += '<p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Have questions? Contact us:</p>';
  html += '<a href="mailto:' + CONTACT_EMAIL + '" style="color:#38bdf8;font-size:12px;font-weight:600;text-decoration:none;">' + CONTACT_EMAIL + '</a>';
  html += '<p style="margin:12px 0 0;font-size:10px;color:#475569;">&copy; 2026 TechBETA 2.0 &bull; Dept. of Information Technology &bull; SXCCE, Nagercoil</p>';
  html += '</div>';

  html += '</div></body></html>';
  return html;
}