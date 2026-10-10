import ipaddress
import socket
import urllib.parse
from typing import Tuple, Optional

# Forbidden private and internal network blocks to prevent Server-Side Request Forgery (SSRF)
FORBIDDEN_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),      # Loopback
    ipaddress.ip_network("10.0.0.0/8"),       # Private RFC1918
    ipaddress.ip_network("172.16.0.0/12"),    # Private RFC1918
    ipaddress.ip_network("192.168.0.0/16"),   # Private RFC1918
    ipaddress.ip_network("169.254.0.0/16"),   # Link-Local (AWS/Azure/GCP metadata)
    ipaddress.ip_network("100.64.0.0/10"),    # Carrier-grade NAT
    ipaddress.ip_network("0.0.0.0/8"),        # Current network
    ipaddress.ip_network("240.0.0.0/4"),      # Reserved
    ipaddress.ip_network("::1/128"),          # IPv6 Loopback
    ipaddress.ip_network("fc00::/7"),         # IPv6 Unique Local
    ipaddress.ip_network("fe80::/10"),        # IPv6 Link-Local
]

FORBIDDEN_HOSTNAMES = {
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "metadata.google.internal",
    "instance-data",
}

def validate_url_for_ssrf(url_str: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Validates a URL against Server-Side Request Forgery (SSRF) vectors and DNS rebinding risks.
    Returns: (is_safe, error_reason, resolved_ip)
    """
    if not url_str or not isinstance(url_str, str):
        return False, "URL cannot be empty", None

    clean_url = url_str.strip()
    
    # 1. Scheme check
    try:
        parsed = urllib.parse.urlparse(clean_url)
    except Exception as e:
        return False, f"Malformed URL structure: {str(e)}", None

    scheme = (parsed.scheme or "").lower()
    if scheme not in ("http", "https"):
        return False, f"Unsupported scheme '{scheme}'. Only HTTP and HTTPS are permitted.", None

    hostname = (parsed.hostname or "").lower()
    if not hostname:
        return False, "URL does not contain a valid hostname.", None

    # 2. Hostname blacklisting
    if hostname in FORBIDDEN_HOSTNAMES or hostname.endswith(".local") or hostname.endswith(".internal"):
        return False, f"Target hostname '{hostname}' resolves to a restricted internal domain.", None

    # 3. Direct IP check
    try:
        ip_obj = ipaddress.ip_address(hostname)
        for net in FORBIDDEN_NETWORKS:
            if ip_obj in net:
                return False, f"Target IP address '{hostname}' is within restricted range ({net}).", str(ip_obj)
        # Direct public IP
        return True, None, str(ip_obj)
    except ValueError:
        # Not a raw IP; it is a domain name. Resolve via DNS to inspect target IP.
        pass

    # 4. DNS Resolution & Rebinding check
    try:
        addr_info = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for family, _, _, _, sockaddr in addr_info:
            ip_str = sockaddr[0]
            try:
                ip_obj = ipaddress.ip_address(ip_str)
                for net in FORBIDDEN_NETWORKS:
                    if ip_obj in net:
                        return False, f"Hostname '{hostname}' resolves to private/internal IP '{ip_str}' which is prohibited.", ip_str
            except ValueError:
                continue
    except socket.gaierror:
        # Host could not be resolved; valid for analysis purposes (e.g. dead phishing domain)
        return True, None, None
    except Exception as e:
        return False, f"DNS validation error: {str(e)}", None

    return True, None, None
