# gmail_imap.py

import imaplib
import email
from email.header import decode_header


def decode_mime_str(value):
    """Decode encoded email headers like =?utf-8?b?...?="""
    if not value:
        return ""
    parts = decode_header(value)
    decoded = ""
    for part, charset in parts:
        if isinstance(part, bytes):
            decoded += part.decode(charset or "utf-8", errors="ignore")
        else:
            decoded += part
    return decoded


def get_email_body(msg):
    """Extract plain text body from email message."""
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                charset = part.get_content_charset() or "utf-8"
                payload = part.get_payload(decode=True)
                if payload:
                    body = payload.decode(charset, errors="ignore")
                    break
    else:
        if msg.get_content_type() == "text/plain":
            charset = msg.get_content_charset() or "utf-8"
            payload = msg.get_payload(decode=True)
            if payload:
                body = payload.decode(charset, errors="ignore")
    return body.strip()


def fetch_gmail_imap(gmail_address: str, app_password: str, max_emails: int = 30):
    """
    Connect to Gmail via IMAP and return emails in the
    same shape as your existing parsed_emails pipeline.
    """
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(gmail_address, app_password)
        mail.select("inbox")

        # Fetch latest email IDs
        _, data = mail.search(None, "ALL")
        all_ids = data[0].split()
        # Take the most recent ones
        selected_ids = all_ids[-max_emails:]

        emails = []
        for i, eid in enumerate(reversed(selected_ids)):
            try:
                _, msg_data = mail.fetch(eid, "(RFC822)")
                raw = msg_data[0][1]
                msg = email.message_from_bytes(raw)

                subject = decode_mime_str(msg.get("Subject", "No Subject"))
                body = get_email_body(msg)

                emails.append({
                    "id": i + 1,
                    "subject": subject,
                    "body": body
                })
            except Exception as e:
                print(f"Skipping email {eid}: {e}")
                continue

        mail.logout()
        return {"success": True, "emails": emails}

    except imaplib.IMAP4.error as e:
        return {"success": False, "error": str(e)}