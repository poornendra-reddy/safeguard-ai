"""
=============================================================================
SAFEGUARD AI — Automated Backend Test Suite
Tests SSRF defenses, threat scoring engines, and FastAPI REST endpoints.
=============================================================================
"""

import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security import validate_url_for_ssrf


class TestSafeguardSecurityAndEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    # ------------------------------------------------------------------------
    # 1. SSRF Protection Tests
    # ------------------------------------------------------------------------
    def test_ssrf_protection_blocks_private_ips(self):
        """Ensure SSRF filter strictly blocks internal, loopback, and metadata ranges."""
        self.assertFalse(validate_url_for_ssrf("http://127.0.0.1/admin")[0])
        self.assertFalse(validate_url_for_ssrf("http://localhost:8080")[0])
        self.assertFalse(validate_url_for_ssrf("http://169.254.169.254/latest/meta-data")[0])
        self.assertFalse(validate_url_for_ssrf("http://10.0.0.1/internal")[0])
        self.assertFalse(validate_url_for_ssrf("http://192.168.1.1/router")[0])
        self.assertFalse(validate_url_for_ssrf("http://172.16.0.5/api")[0])

    def test_ssrf_protection_allows_valid_public_urls(self):
        """Ensure SSRF filter permits safe public internet endpoints."""
        is_safe, msg, ip = validate_url_for_ssrf("https://www.google.com")
        self.assertTrue(is_safe, f"Safe URL was falsely blocked: {msg}")

    # ------------------------------------------------------------------------
    # 2. Health Check Endpoint
    # ------------------------------------------------------------------------
    def test_health_endpoint(self):
        """Verify GET /api/py/health returns 200 OK and valid status."""
        response = self.client.get("/api/py/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("service"), "SAFEGUARD AI")

    # ------------------------------------------------------------------------
    # 3. URL Scanner Endpoint
    # ------------------------------------------------------------------------
    def test_scan_url_phishing_detection(self):
        """Verify URL scanner flags known suspicious/typosquatted domains."""
        payload = {"url": "http://secure-login-paypal.xyz/auth"}
        response = self.client.post("/api/py/scan/url", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 70)
        self.assertIn("phishing", data.get("threatLabel", "").lower())

    def test_scan_url_ssrf_interception(self):
        """Verify URL scanner intercepts SSRF target with blocked risk response."""
        payload = {"url": "http://169.254.169.254/metadata"}
        response = self.client.post("/api/py/scan/url", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 90)
        self.assertTrue(data.get("details", {}).get("ssrf_blocked"))

    # ------------------------------------------------------------------------
    # 4. Message Scanner Endpoint
    # ------------------------------------------------------------------------
    def test_scan_message_scam_detection(self):
        """Verify Message scanner catches lottery & OTP harvesting traps."""
        payload = {
            "message": "CONGRATULATIONS! You won ₹25,00,000 lottery! Share your bank account and OTP to claim immediately."
        }
        response = self.client.post("/api/py/scan/message", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 75)
        self.assertEqual(data.get("riskLevel"), "high")

    # ------------------------------------------------------------------------
    # 5. Email Scanner Endpoint
    # ------------------------------------------------------------------------
    def test_scan_email_spoofing(self):
        """Verify Email scanner catches impersonated senders and urgency."""
        payload = {
            "sender": "security-alert@paypal-verify.xyz",
            "subject": "URGENT: Your PayPal account has been compromised",
            "body": "Your account will be suspended within 24 hours unless you verify identity."
        }
        response = self.client.post("/api/py/scan/email", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 75)

    # ------------------------------------------------------------------------
    # 6. QR Scanner Endpoint
    # ------------------------------------------------------------------------
    def test_scan_qr_upi_trap(self):
        """Verify QR scanner catches UPI debit schemes."""
        payload = {
            "payload": "upi://pay?pa=fake.electricity.board@ybl&pn=QuickRefund&am=2500"
        }
        response = self.client.post("/api/py/scan/qr", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 85)

    # ------------------------------------------------------------------------
    # 7. Password Strength & Breach Check
    # ------------------------------------------------------------------------
    def test_scan_password_weak_and_strong(self):
        """Verify password testing handles weak common passwords properly."""
        # Weak
        res_weak = self.client.post("/api/py/scan/password", json={"password": "Password123!"})
        self.assertEqual(res_weak.status_code, 200)
        self.assertGreaterEqual(res_weak.json().get("riskScore"), 60)

        # Strong
        res_strong = self.client.post("/api/py/scan/password", json={"password": "Kx9#mQ!99zL@w01_Pzq7"})
        self.assertEqual(res_strong.status_code, 200)
        self.assertLessEqual(res_strong.json().get("riskScore"), 25)

    # ------------------------------------------------------------------------
    # 8. Malicious File Analyzer Endpoint
    # ------------------------------------------------------------------------
    def test_scan_file_double_extension(self):
        """Verify file scanner identifies masked executable extensions."""
        payload = {"filename": "invoice_urgent.pdf.exe", "filesize": 245000, "mimetype": "application/x-msdownload"}
        response = self.client.post("/api/py/scan/file", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data.get("riskScore"), 85)

    # ------------------------------------------------------------------------
    # 9. Browser Permission Scanner Endpoint
    # ------------------------------------------------------------------------
    def test_scan_browser_permissions(self):
        """Verify browser scanner flags excessive manifest permissions."""
        manifest = '{"name": "Scraper", "permissions": ["<all_urls>", "cookies", "clipboardRead"]}'
        response = self.client.post("/api/py/scan/browser", json={"manifest": manifest})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json().get("riskScore"), 70)

    # ------------------------------------------------------------------------
    # 10. Public Wi-Fi Risk Endpoint
    # ------------------------------------------------------------------------
    def test_scan_network_open_wifi(self):
        """Verify network scanner flags open unencrypted public Wi-Fi."""
        payload = {"ssid": "Airport_Free_WiFi", "auth_type": "Open / No Encryption", "is_public": True}
        response = self.client.post("/api/py/scan/network", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json().get("riskScore"), 65)

    # ------------------------------------------------------------------------
    # 11. Ransomware Pattern Detector Endpoint
    # ------------------------------------------------------------------------
    def test_scan_ransomware_shadow_copy_deletion(self):
        """Verify ransomware scanner identifies shadow copy deletion attempts."""
        cmd = "vssadmin delete shadows /all /quiet && bcdedit /set {default} bootstatuspolicy ignoreallfailures"
        response = self.client.post("/api/py/scan/ransomware", json={"commands": cmd})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json().get("riskScore"), 90)

    # ------------------------------------------------------------------------
    # 12. Spam / Vishing Call Detector Endpoint
    # ------------------------------------------------------------------------
    def test_scan_call_digital_arrest(self):
        """Verify call scanner detects police impersonation & digital arrest."""
        payload = {
            "phone_number": "+91 98210 54321",
            "transcript": "Caller claimed to be from Mumbai Police & CBI stating an illegal narcotics package was found. Demanding digital arrest."
        }
        response = self.client.post("/api/py/scan/call", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json().get("riskScore"), 80)

    # ------------------------------------------------------------------------
    # 13. Cyberbullying & Toxicity Detector Endpoint
    # ------------------------------------------------------------------------
    def test_scan_cyberbullying_toxicity(self):
        """Verify cyberbullying scanner flags abusive harassment."""
        payload = {"text": "You are worthless and nobody likes you. Stop posting or we will target you every day."}
        response = self.client.post("/api/py/scan/cyberbullying", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.json().get("riskScore"), 75)

    # ------------------------------------------------------------------------
    # 14. AI Assistant Chat Endpoint
    # ------------------------------------------------------------------------
    def test_chat_assistant_response(self):
        """Verify conversational assistant responds to security queries."""
        payload = {"message": "How do I report a cyber crime in India?", "history": []}
        response = self.client.post("/api/py/chat/assistant", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("1930", data.get("reply", ""))

    # ------------------------------------------------------------------------
    # 15. History Audit Log Endpoint
    # ------------------------------------------------------------------------
    def test_history_audit_log(self):
        """Verify history entries are stored and retrievable."""
        response = self.client.get("/api/py/history")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)


if __name__ == "__main__":
    unittest.main()
