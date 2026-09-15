/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * TechBETA 2026 - Google Sheets Backup + Email Confirmation Webhook
 *
 * INSTRUCTIONS:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Paste this entire script, save & deploy as Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the Web App URL into .env as GOOGLE_SHEETS_WEBHOOK_URL
 *
 * Each participant automatically gets a personalized HTML confirmation email
 * with their unique Entry Pass QR Code and WhatsApp group join button.
 * Free quota: 100 emails/day (Gmail), 1500/day (Google Workspace)
 */

// CONFIG - update before deploying
var WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/DUMMY_LINK_REPLACE_ME';
var CONTACT_EMAIL       = 'brigitz.it@sxcce.edu.in';
var EVENT_DATE          = 'October 13, 2026';
var SYMPOSIUM_NAME      = 'TechBETA 2026 2.0';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp (IST)', 'Team ID', 'Team Name', 'Member #', 'Full Name',
        'Email', 'Mobile', 'Department', 'Year', 'College',
        'Technical Events', 'Non-Technical Events', 'Payment UTR / Ref',
        'Amount (INR)', 'Email Sent?'
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#e2e8f0');
    }

    var data = JSON.parse(e.postData.contents);
    var rows = data.rows || [];

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var emailSent = 'No';

      sheet.appendRow([
        r.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        r.teamId || '', r.teamName || '', r.memberNumber || '', r.name || '',
        r.email || '', r.phone || '', r.department || '', r.year || '',
        r.college || '', r.technicalEvents || '', r.nonTechnicalEvents || '',
        r.paymentUtr || '', r.amount || 200, 'Pending'
      ]);

      if (r.email && r.email.indexOf('@') !== -1) {
        try {
          MailApp.sendEmail({
            to: r.email,
            subject: 'Registration Confirmed! ' + SYMPOSIUM_NAME,
            htmlBody: buildEmailHtml(r),
            name: 'TechBETA 2026 2.0 - SXCCE'
          });
          emailSent = 'Sent';
        } catch (mailErr) {
          emailSent = 'Failed: ' + mailErr.toString();
        }
        sheet.getRange(sheet.getLastRow(), 15).setValue(emailSent);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', count: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function buildEmailHtml(r) {
  var techEvents = r.technicalEvents    || 'None registered';
  var nonTech    = r.nonTechnicalEvents || 'None registered';
  var firstName  = (r.name || 'Participant').split(' ')[0];

  var html = '';
  html += '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TechBETA 2026 2.0 Registration Confirmation</title></head>';
  html += '<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Arial,sans-serif;">';
  html += '<div style="max-width:600px;margin:0 auto;padding:20px 12px;">';

  // Header
  html += '<div style="background:linear-gradient(135deg,#0f172a,#1e3a5f,#0369a1);padding:28px;border-radius:16px 16px 0 0;text-align:center;">';
  html += '<p style="margin:0 0 4px;font-size:10px;color:#7dd3fc;text-transform:uppercase;letter-spacing:3px;">St. Xavier\'s Catholic College of Engineering</p>';
  html += '<h1 style="margin:0;font-size:30px;font-weight:900;color:#fff;letter-spacing:2px;">TechBETA <span style="color:#38bdf8;">2026 2.0</span></h1>';
  html += '<p style="margin:6px 0 0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;">Dept. of Information Technology &bull; Brigitz</p>';
  html += '</div>';

  // Confirmed banner
  html += '<div style="background:#fff;padding:20px 24px;text-align:center;border:1px solid #e2e8f0;border-top:none;">';
  html += '<div style="display:inline-block;background:#f0fdf4;border:1px solid #86efac;border-radius:40px;padding:7px 16px;margin-bottom:14px;">';
  html += '<span style="color:#16a34a;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:1px;">&#10003; Registration Confirmed</span>';
  html += '</div>';
  html += '<h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0f172a;">Hey ' + firstName + ', you\'re in! &#127881;</h2>';
  html += '<p style="margin:0;color:#475569;font-size:13px;line-height:1.7;">Your registration for <strong>TechBETA 2026 2.0</strong> is confirmed.<br>Show the QR code below at the Registration Desk on arrival!</p>';
  html += '</div>';

  // Entry Pass header (NO ID shown to participant)
  var qrData = encodeURIComponent((r.teamId || 'TB26') + '|' + (r.name || '') + '|' + (r.college || ''));
  var qrUrl  = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=0f172a&bgcolor=ffffff&qzone=2&data=' + qrData;

  html += '<div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:20px 24px;">';
  html += '<div style="background:linear-gradient(90deg,#0f172a,#1e3a5f);padding:16px 24px;border-radius:12px;">';
  html += '<p style="margin:0 0 2px;font-size:9px;color:#7dd3fc;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Official Entry Pass</p>';
  html += '<p style="margin:0;font-size:22px;font-weight:900;color:#fff;letter-spacing:2px;">TechBETA <span style="color:#38bdf8;">2026 2.0</span></p>';
  html += '<p style="margin:4px 0 0;font-size:10px;color:#cbd5e1;">Conference Hall &bull; St. Xavier\'s Catholic College of Engineering, Nagercoil &bull; 9:00 AM</p>';
  html += '</div>';

  // Entry Gate QR Code
  html += '<div style="text-align:center;padding:18px 0 10px;background:#ffffff;">';
  html += '<div style="display:inline-block;padding:10px;background:#ffffff;border:2px solid #0f172a;border-radius:14px;box-shadow:0 3px 10px rgba(15,23,42,0.08);">';
  html += '<img src="' + qrUrl + '" alt="Entry Gate QR Code" width="140" height="140" style="display:block;margin:0 auto;width:140px;height:140px;border-radius:4px;" />';
  html += '</div>';
  html += '<p style="margin:8px 0 2px;font-size:11px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:1.5px;">&#128274; Scan at Entrance Gate</p>';
  html += '<p style="margin:0;font-size:11px;color:#64748b;">Show this QR code at the Registration Desk on arrival</p>';
  html += '<p style="margin:6px 0 0;"><a href="' + qrUrl + '" target="_blank" style="font-size:11px;color:#0284c7;font-weight:600;text-decoration:underline;">Click to view or download QR Code</a></p>';
  html += '</div>';

  html += '<table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:12px;">';
  html += '<tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Participant Name</span><strong style="color:#0f172a;font-size:14px;">' + r.name + '</strong></td></tr>';
  html += '<tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">College</span><span style="color:#1e293b;font-weight:700;">' + (r.college || 'St. Xavier\'s Catholic College of Engineering') + '</span></td></tr>';
  html += '<tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;"><span style="display:block;font-size:9px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Technical Events</span><span style="color:#0c4a6e;font-weight:700;">' + techEvents + '</span></td></tr>';
  html += '<tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;"><span style="display:block;font-size:9px;color:#7e22ce;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Non-Technical Events</span><span style="color:#581c87;font-weight:700;">' + nonTech + '</span></td></tr>';
  html += '<tr><td style="padding:6px 0;"><span style="display:block;font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Reporting Time &amp; Venue</span><span style="color:#0f172a;font-weight:700;">' + EVENT_DATE + ' &bull; 9:00 AM &bull; Conference Hall, St. Xavier\'s Catholic College of Engineering, Nagercoil</span></td></tr>';
  html += '</table>';
  html += '<div style="background:#f8fafc;margin-top:14px;padding:10px 14px;border-radius:8px;display:table;width:100%;box-sizing:border-box;">';
  html += '<div style="display:table-cell;font-size:11px;color:#64748b;">Buffet Lunch &bull; Certificate &bull; Event Entry</div>';
  html += '<div style="display:table-cell;text-align:right;font-size:15px;font-weight:900;color:#0f172a;">&#8377;200 <span style="font-size:10px;color:#94a3b8;font-weight:400;">paid</span></div>';
  html += '</div></div>';

  // WhatsApp card
  html += '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;">';
  html += '<div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:14px;padding:22px;text-align:center;">';
  html += '<div style="font-size:26px;margin-bottom:8px;">&#128172;</div>';
  html += '<h3 style="margin:0 0 8px;font-size:15px;font-weight:800;color:#14532d;">Join the Official TechBETA 2.0 WhatsApp Group</h3>';
  html += '<p style="margin:0 0 16px;font-size:12px;color:#166534;line-height:1.6;">Get live updates &mdash; event rooms, schedules, food coupons &amp; last-minute announcements!</p>';
  html += '<a href="' + WHATSAPP_GROUP_LINK + '" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:40px;font-size:13px;font-weight:800;">Join WhatsApp Group</a>';
  html += '<p style="margin:10px 0 0;font-size:10px;color:#4ade80;">Critical updates are shared here on event day!</p>';
  html += '</div></div>';

  // Footer
  html += '<div style="background:#0f172a;padding:20px 24px;border-radius:0 0 16px 16px;text-align:center;">';
  html += '<p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Questions? Contact the Brigitz team.</p>';
  html += '<a href="mailto:' + CONTACT_EMAIL + '" style="color:#38bdf8;font-size:12px;font-weight:600;text-decoration:none;">' + CONTACT_EMAIL + '</a>';
  html += '<p style="margin:12px 0 0;font-size:10px;color:#475569;">&copy; 2026 TechBETA 2.0 &bull; Dept. of IT &bull; SXCCE, Nagercoil</p>';
  html += '</div>';
  html += '</div></body></html>';
  return html;
}