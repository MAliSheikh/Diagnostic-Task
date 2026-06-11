import os
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Flask, jsonify, request, send_from_directory

# Project root is one level above this file
ROOT_DIR = os.path.join(os.path.dirname(__file__), "..")

app = Flask(__name__)


# ── Static file serving (local dev only — Vercel handles this via CDN) ──
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def static_files(path):
    target = os.path.join(ROOT_DIR, path)
    if path and os.path.exists(target) and os.path.isfile(target):
        directory = os.path.dirname(target)
        filename  = os.path.basename(target)
        return send_from_directory(directory, filename)
    return send_from_directory(ROOT_DIR, "index.html")


# ── POST /api/submit ──
@app.route("/api/submit", methods=["POST"])
def submit():
    data         = request.get_json(silent=True) or {}
    name         = data.get("name", "").strip()
    organisation = data.get("organisation", "").strip()
    communication = data.get("communication", "").strip()

    if not name or not organisation or not communication:
        return jsonify({"error": "Missing required fields"}), 400

    email    = os.environ.get("EMAIL")
    password = os.environ.get("PASSWORD")

    subject = f"SKA Task Submission — {name}"

    body = (
        f"New diagnostic submission received via the Thrive by Design platform.\n\n"
        f"\n"
        f"Name:          {name}\n"
        f"Organisation:  {organisation}\n"
        f"Communication: {communication}\n"
        f"\n\n"
        f"Submitted on: {datetime.now().strftime('%d %b %Y, %I:%M %p')} (PKT)"
    )

    try:
        msg = MIMEMultipart()
        msg["From"]    = f"MUHAMMAD ALI FAROOQ <{email}>"
        msg["To"]      = "work97464@gmail.com"
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(email, password)
        server.sendmail(email, "work97464@gmail.com", msg.as_string())
        server.quit()

        return jsonify({"success": True}), 200

    except Exception as e:
        print(f"Email send error: {e}")
        return jsonify({"error": "Failed to send email"}), 500


# ── Local entry point ──
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(ROOT_DIR, ".env"))
    app.run(debug=True, port=3000)
