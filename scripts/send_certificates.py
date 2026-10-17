"""
TechBETA 2026 2.0 - Automated Participant Certificate Email Dispatcher
St. Xavier's Catholic College of Engineering

Usage:
  1. Dry Run (Inspect all 109 recipients and attachments without sending):
     python scripts/send_certificates.py --dry-run

  2. Send Test Email to Yourself:
     python scripts/send_certificates.py --test your_email@gmail.com

  3. Dispatch All Certificates:
     python scripts/send_certificates.py --send-all

  4. Resume Interrupted Dispatch:
     python scripts/send_certificates.py --send-all --resume
"""

import os
import sys
import json
import time
import csv
import smtplib
import argparse
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_JSON = os.path.join(BASE_DIR, "src", "data", "certificates.json")
CERT_DIR = os.path.join(BASE_DIR, "Certificates")
LOG_CSV = os.path.join(os.path.dirname(__file__), "email_dispatch_log.csv")
ENV_FILE = os.path.join(BASE_DIR, ".env")

# Default SMTP Configuration
DEFAULT_SMTP_HOST = "smtp.gmail.com"
DEFAULT_SMTP_PORT = 587
DEFAULT_FROM_NAME = "TechBETA 2026 2.0 | SXCCE"
DEFAULT_CONTACT_EMAIL = "techbeta2k26@gmail.com"
PORTAL_BASE_URL = "https://techbeta2026.vercel.app"

def load_env():
    """Load environment variables from .env file"""
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def get_grouped_recipients():
    """Load certificates from JSON and group by recipient email"""
    if not os.path.exists(DATA_JSON):
        print(f"Error: {DATA_JSON} not found. Run python scripts/build_certificates_data.py first.")
        sys.exit(1)

    with open(DATA_JSON, "r", encoding="utf-8") as f:
        records = json.load(f)

    recipients = {}
    for r in records:
        email = r["email"].strip().lower()
        if not email:
            continue
        if email not in recipients:
            recipients[email] = {
                "email": email,
                "name": r["name"],
                "college": r["college"],
                "certificates": []
            }
        recipients[email]["certificates"].append(r)

    return recipients

def generate_email_html(recipient, portal_link):
    """Generate professional, mobile-responsive HTML email"""
    name = recipient["name"]
    college = recipient["college"] or "St. Xavier's Catholic College of Engineering"
    certs = recipient["certificates"]

    events_html = ""
    for c in certs:
        badge_color = "#3b82f6" if c.get("eventType") == "Technical" else "#f59e0b"
        events_html += f"""
        <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 14px 18px; margin-bottom: 10px;">
            <div style="margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: {badge_color}; letter-spacing: 0.5px;">
                    {c.get('eventType', 'Event')}
                </span>
            </div>
            <div style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-top: 4px;">
                {c.get('event', '')}
            </div>
            <div style="font-size: 12px; color: #14b8a6; margin-top: 4px;">
                ✓ Certificate Attached (PNG)
            </div>
        </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TechBETA 2026 2.0 Participation Certificate</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #020617; padding: 30px 15px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #0b1329; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                        <!-- Header Banner -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%); padding: 32px 30px; text-align: center;">
                                <div style="font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #99f6e4; margin-bottom: 6px;">
                                    ST. XAVIER'S CATHOLIC COLLEGE OF ENGINEERING
                                </div>
                                <div style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                                    TechBETA 2026 2.0
                                </div>
                                <div style="font-size: 13px; font-weight: 600; color: #e0e7ff; margin-top: 4px;">
                                    National Level Technical Symposium
                                </div>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td style="padding: 35px 30px;">
                                <h1 style="font-size: 20px; font-weight: 800; color: #f8fafc; margin: 0 0 16px 0;">
                                    Dear {name},
                                </h1>
                                <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 22px 0;">
                                    Thank you for participating and showcasing your skills at <strong>TechBETA 2026 2.0</strong>, organized by the Department of Information Technology at St. Xavier’s Catholic College of Engineering.
                                </p>
                                <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 25px 0;">
                                    Your Participation Certificate(s) are attached directly to this email in pristine high-resolution PNG format.
                                </p>

                                <!-- Event Details Box -->
                                <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin-bottom: 25px;">
                                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; letter-spacing: 0.5px;">
                                        Participant Information
                                    </div>
                                    <div style="font-size: 14px; color: #f1f5f9; margin-bottom: 6px;">
                                        <strong>Participant:</strong> {name}
                                    </div>
                                    <div style="font-size: 14px; color: #94a3b8; margin-bottom: 16px;">
                                        <strong>College:</strong> {college}
                                    </div>

                                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; letter-spacing: 0.5px;">
                                        Events Certified ({len(certs)})
                                    </div>
                                    {events_html}
                                </div>

                                <!-- Help / Contact Notice -->
                                <div style="background-color: #030712; border: 1px dashed #334155; border-radius: 12px; padding: 14px 18px; margin: 24px 0; text-align: center;">
                                    <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                                        If your certificate is not found or has incorrect details, please contact:<br>
                                        <strong style="color: #38bdf8; font-size: 14px;">
                                            <a href="tel:9385675451" style="color: #38bdf8; text-decoration: none;">9385675451</a>, 
                                            <a href="tel:8300870670" style="color: #38bdf8; text-decoration: none;">8300870670</a>
                                        </strong>
                                    </div>
                                </div>

                                <!-- Call to Action Button -->
                                <div style="text-align: center; margin: 25px 0 15px 0;">
                                    <a href="{portal_link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 30px; border-radius: 12px; box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4);">
                                        View on Certificate Portal →
                                    </a>
                                </div>
                                <div style="text-align: center; font-size: 13px; color: #94a3b8; margin-bottom: 6px;">
                                    Official Website: <a href="https://techbeta2026.vercel.app" target="_blank" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">https://techbeta2026.vercel.app</a>
                                </div>
                                <div style="text-align: center; font-size: 11px; color: #64748b;">
                                    You can also claim and re-download your certificates anytime from the website portal.
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #020617; border-top: 1px solid #1e293b; padding: 25px 30px; text-align: center;">
                                <div style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 8px;">
                                    <strong>St. Xavier's Catholic College of Engineering</strong><br>
                                    Chunkankadai, Nagercoil, Kanyakumari District, Tamil Nadu - 629003
                                </div>
                                <div style="font-size: 11px; color: #64748b;">
                                    Have questions? Contact us at <a href="mailto:{DEFAULT_CONTACT_EMAIL}" style="color: #14b8a6; text-decoration: none;">{DEFAULT_CONTACT_EMAIL}</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return html

def get_already_sent():
    """Read log file and get set of already sent emails"""
    sent = set()
    if os.path.exists(LOG_CSV):
        with open(LOG_CSV, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 4 and row[3] == "SENT":
                    sent.add(row[1].strip().lower())
    return sent

def log_result(email, name, events_str, status, details=""):
    """Append result to dispatch log"""
    file_exists = os.path.exists(LOG_CSV)
    with open(LOG_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Timestamp", "Email", "Participant Name", "Status", "Events", "Details"])
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            email,
            name,
            status,
            events_str,
            details
        ])

def send_one_email(server, sender_email, recipient, dry_run=False):
    """Compose and send email with attached certificate PNG files"""
    recipient_email = recipient["email"]
    name = recipient["name"]
    certs = recipient["certificates"]
    events_str = ", ".join(c["event"] for c in certs)

    portal_link = f"{PORTAL_BASE_URL}/?q={recipient_email}#claim-certificates"
    html_content = generate_email_html(recipient, portal_link)

    msg = MIMEMultipart()
    msg["From"] = f"{DEFAULT_FROM_NAME} <{sender_email}>"
    msg["To"] = recipient_email
    msg["Subject"] = f"Your Participation Certificate(s) - TechBETA 2026 2.0 | SXCCE"

    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # Attach all certificates
    attached_count = 0
    for c in certs:
        folder = c["folder"]
        filename = c["filename"]
        filepath = os.path.join(CERT_DIR, folder, filename)

        if not os.path.exists(filepath):
            print(f"  [ERROR] File not found: {filepath}")
            continue

        with open(filepath, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
            encoders.encode_base64(part)
            clean_filename = f"TechBETA_2026_{c['event']}_{name}.png".replace(" ", "_")
            part.add_header("Content-Disposition", f'attachment; filename="{clean_filename}"')
            msg.attach(part)
            attached_count += 1

    if dry_run:
        print(f"  [DRY RUN] Would send to: {recipient_email} ({name}) | Attachments: {attached_count} file(s)")
        return True, "Dry run validated"

    server.sendmail(sender_email, recipient_email, msg.as_string())
    return True, f"Sent with {attached_count} attachment(s)"

def main():
    parser = argparse.ArgumentParser(description="TechBETA 2026 Participant Certificate Email Dispatcher")
    parser.add_argument("--dry-run", action="store_true", help="Simulate dispatch without sending emails")
    parser.add_argument("--test", metavar="EMAIL", help="Send a single test email to your personal address")
    parser.add_argument("--send-all", action="store_true", help="Dispatch certificates to all 109 participants")
    parser.add_argument("--resume", action="store_true", help="Skip recipients already logged as SENT")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between emails in seconds (default: 1.5s)")
    args = parser.parse_args()

    recipients = get_grouped_recipients()
    print("=" * 65)
    print("TechBETA 2026 2.0 - CERTIFICATE EMAIL DISPATCHER")
    print(f"Total Unique Recipients Loaded: {len(recipients)}")
    print("=" * 65)

    # 1. DRY RUN
    if args.dry_run:
        print("\n🔍 EXECUTING DRY RUN (Validating attachments and recipient records)...")
        missing_files = 0
        total_attachments = 0

        for idx, (email, data) in enumerate(recipients.items(), 1):
            names = data["name"]
            certs = data["certificates"]
            total_attachments += len(certs)
            for c in certs:
                p = os.path.join(CERT_DIR, c["folder"], c["filename"])
                if not os.path.exists(p):
                    print(f"  ❌ Missing: {p}")
                    missing_files += 1

        print(f"\nDry Run Complete:")
        print(f"  Recipients:   {len(recipients)}")
        print(f"  Certificates: {total_attachments}")
        print(f"  Missing:      {missing_files}")
        if missing_files == 0:
            print("  Status:       ✓ 100% READY FOR DISPATCH!")
        return

    # Load credentials from .env or prompt
    env = load_env()
    smtp_user = env.get("EMAIL_USER") or env.get("SMTP_USER")
    smtp_pass = env.get("EMAIL_PASS") or env.get("SMTP_PASS") or env.get("EMAIL_PASSWORD")
    if smtp_pass:
        smtp_pass = smtp_pass.replace(" ", "")

    if not smtp_user or not smtp_pass:
        print("\n⚠️ Email credentials not found in .env!")
        print("Please configure in .env:")
        print("  EMAIL_USER=techbeta2k26@gmail.com")
        print("  EMAIL_PASS=your_16_char_gmail_app_password")
        print("\nOr you can enter them right now:")
        smtp_user = smtp_user or input("Enter Gmail address: ").strip()
        smtp_pass = smtp_pass or input("Enter Gmail App Password: ").strip()

    if not smtp_user or not smtp_pass:
        print("Error: Missing credentials. Aborting.")
        sys.exit(1)

    # 2. TEST EMAIL
    if args.test:
        test_email = args.test.strip()
        print(f"\n📧 Sending test email to: {test_email}...")
        
        # Pick the first recipient as sample data
        sample_key = next(iter(recipients))
        sample_data = dict(recipients[sample_key])
        sample_data["email"] = test_email  # override recipient email to test address
        
        try:
            print("Connecting to Gmail SMTP server...")
            server = smtplib.SMTP(DEFAULT_SMTP_HOST, DEFAULT_SMTP_PORT, timeout=30)
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)

            success, detail = send_one_email(server, smtp_user, sample_data)
            server.quit()
            print(f"✓ TEST EMAIL SENT SUCCESSFULLY to {test_email}!")
            print(f"  Details: {detail}")
            print("  Check your inbox (and spam/promotions folder) to inspect formatting and attachment.")
        except Exception as e:
            print(f"❌ Failed to send test email: {e}")
        return

    # 3. DISPATCH ALL
    if args.send_all:
        already_sent = get_already_sent() if args.resume else set()
        queue = [r for e, r in recipients.items() if e not in already_sent]
        
        print(f"\n🚀 Beginning Dispatch to {len(queue)} participants...")
        if already_sent:
            print(f"  Skipping {len(already_sent)} already sent recipients (--resume active).")

        confirm = input(f"Are you sure you want to send {len(queue)} emails now? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("Dispatch aborted by user.")
            return

        try:
            print("Connecting to Gmail SMTP server...")
            server = smtplib.SMTP(DEFAULT_SMTP_HOST, DEFAULT_SMTP_PORT, timeout=30)
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            print("✓ SMTP Authentication successful. Dispatching emails...\n")

            sent_count = 0
            failed_count = 0

            for i, r in enumerate(queue, 1):
                email = r["email"]
                name = r["name"]
                events = ", ".join(c["event"] for c in r["certificates"])
                print(f"[{i}/{len(queue)}] Sending to: {name} <{email}> ({events})...", end="", flush=True)

                try:
                    success, detail = send_one_email(server, smtp_user, r)
                    log_result(email, name, events, "SENT", detail)
                    print(" ✓ Sent")
                    sent_count += 1
                except Exception as e:
                    log_result(email, name, events, "FAILED", str(e))
                    print(f" ❌ Failed: {e}")
                    failed_count += 1

                if i < len(queue):
                    time.sleep(args.delay)

            server.quit()
            print("\n" + "=" * 65)
            print(f"DISPATCH FINISHED!")
            print(f"  Successfully Sent: {sent_count}")
            print(f"  Failed:            {failed_count}")
            print(f"  Log File:          {LOG_CSV}")
            print("=" * 65)

        except Exception as e:
            print(f"❌ SMTP Connection or Authentication Error: {e}")
        return

    # If no flags provided, print helpful instructions
    parser.print_help()

if __name__ == "__main__":
    main()
