/**
 * SAFEGUARD AI — Centralized API Client
 * Connects frontend tools to the FastAPI backend.
 * Configurable via NEXT_PUBLIC_API_URL or defaults to same-origin relative '/api/py'.
 */

import { AnalysisResult } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/py';
const DEFAULT_TIMEOUT_MS = 12000;

export class APIError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new APIError(`Request timed out after ${timeoutMs / 1000}s. Please check your network and try again.`, 408);
    }
    throw new APIError(err?.message || 'Network error communicating with Safeguard AI backend.', 0);
  } finally {
    clearTimeout(id);
  }
}

async function postJSON<T = any>(endpoint: string, payload: any): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    let details = null;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errJson.detail || errorMsg;
      details = errJson.details || null;
    } catch {
      // Non-JSON error body
    }
    throw new APIError(errorMsg, response.status, details);
  }

  return response.json();
}

export const safeguardAPI = {
  /**
   * Health Check
   */
  async getHealth() {
    const res = await fetchWithTimeout(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) throw new APIError('Backend service unhealthy', res.status);
    return res.json();
  },

  /**
   * 1. URL Scanner
   */
  async scanURL(targetUrl: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/url', { url: targetUrl });
  },

  /**
   * 2. Message / SMS / Chat Scanner
   */
  async scanMessage(message: string, channel: string = 'SMS'): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/message', { message, channel });
  },

  /**
   * 3. Email Phishing Analyzer
   */
  async scanEmail(
    senderOrParams: string | { sender: string; subject: string; body: string; links?: string | string[] },
    subject?: string,
    body?: string,
    links?: string[]
  ): Promise<AnalysisResult> {
    if (typeof senderOrParams === 'object') {
      const pLinks = Array.isArray(senderOrParams.links)
        ? senderOrParams.links
        : senderOrParams.links ? [senderOrParams.links] : [];
      return postJSON<AnalysisResult>('/scan/email', {
        sender: senderOrParams.sender,
        subject: senderOrParams.subject,
        body: senderOrParams.body,
        links: pLinks,
      });
    }
    return postJSON<AnalysisResult>('/scan/email', {
      sender: senderOrParams,
      subject: subject || '',
      body: body || '',
      links: links || [],
    });
  },

  /**
   * 4. Evidence / Screenshot Analyzer (Transmits file to Python backend)
   */
  async scanImage(file: File | Blob, extractedText?: string): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file, (file as File).name || 'screenshot_evidence.png');
    if (extractedText) {
      formData.append('extracted_text', extractedText);
    }

    const res = await fetchWithTimeout(`${API_BASE}/scan/image`, {
      method: 'POST',
      body: formData,
    }, 20000); // 20s timeout for image uploads

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Image analysis failed' }));
      throw new APIError(err.message || err.detail || 'Image analysis failed', res.status);
    }

    return res.json();
  },

  /**
   * 5. QR Code Scanner
   */
  async scanQR(payloadOrParams: string | { qr_content?: string; payload?: string; qr_type?: string }): Promise<AnalysisResult> {
    const payload = typeof payloadOrParams === 'object'
      ? (payloadOrParams.payload || payloadOrParams.qr_content || '')
      : payloadOrParams;
    return postJSON<AnalysisResult>('/scan/qr', { payload });
  },

  /**
   * 6. Password Strength & Breach Check
   */
  async scanPassword(password: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/password', { password });
  },

  /**
   * 7. Malicious File Analyzer
   */
  async scanFile(
    fileOrName: File | string | { filename: string; filesize?: number; mimetype?: string },
    filesize: number = 0,
    mimetype: string = ''
  ): Promise<AnalysisResult> {
    if (typeof fileOrName === 'object') {
      if ('name' in fileOrName && typeof (fileOrName as any).size === 'number') {
        const f = fileOrName as File;
        return postJSON<AnalysisResult>('/scan/file', {
          filename: f.name,
          filesize: f.size,
          mimetype: f.type || 'application/octet-stream',
        });
      }
      return postJSON<AnalysisResult>('/scan/file', fileOrName);
    }
    return postJSON<AnalysisResult>('/scan/file', { filename: fileOrName, filesize, mimetype });
  },

  /**
   * 8. Browser Extension Permission Scanner
   */
  async scanBrowser(manifest: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/browser', { manifest });
  },

  /**
   * 9. Wi-Fi Network Risk Scanner
   */
  async scanNetwork(
    ssidOrParams: string | { ssid: string; auth_type?: string; authType?: string; is_public?: boolean; isPublic?: boolean },
    authType: string = 'Open / No Encryption',
    isPublic: boolean = false
  ): Promise<AnalysisResult> {
    if (typeof ssidOrParams === 'object') {
      return postJSON<AnalysisResult>('/scan/network', {
        ssid: ssidOrParams.ssid,
        auth_type: ssidOrParams.auth_type || ssidOrParams.authType || 'Open / No Encryption',
        is_public: ssidOrParams.is_public ?? ssidOrParams.isPublic ?? false,
      });
    }
    return postJSON<AnalysisResult>('/scan/network', { ssid: ssidOrParams, auth_type: authType, is_public: isPublic });
  },

  /**
   * 10. Deepfake Audio/Video Analyzer
   */
  async scanDeepfake(
    fileOrName: File | string | { filename: string; filetype?: string; filesize?: number },
    filetype: string = 'audio/wav',
    filesize: number = 0
  ): Promise<AnalysisResult> {
    if (typeof fileOrName === 'object') {
      if ('name' in fileOrName && typeof (fileOrName as any).size === 'number') {
        const f = fileOrName as File;
        return postJSON<AnalysisResult>('/scan/deepfake', {
          filename: f.name,
          filetype: f.type || filetype,
          filesize: f.size,
        });
      }
      return postJSON<AnalysisResult>('/scan/deepfake', fileOrName);
    }
    return postJSON<AnalysisResult>('/scan/deepfake', { filename: fileOrName, filetype, filesize });
  },

  /**
   * 11. Ransomware Pattern Detector
   */
  async scanRansomware(commands: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/ransomware', { commands });
  },

  /**
   * 12. Website Reputation Checker
   */
  async scanWebsite(domainOrUrl: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/website', { domain_or_url: domainOrUrl });
  },

  /**
   * 13. Spam / Vishing Call Analyzer
   */
  async scanCall(
    phoneOrParams: string | { phone_number?: string; phoneNumber?: string; transcript?: string },
    transcript?: string
  ): Promise<AnalysisResult> {
    if (typeof phoneOrParams === 'object') {
      return postJSON<AnalysisResult>('/scan/call', {
        phone_number: phoneOrParams.phone_number || phoneOrParams.phoneNumber || '',
        transcript: phoneOrParams.transcript || '',
      });
    }
    return postJSON<AnalysisResult>('/scan/call', { phone_number: phoneOrParams, transcript: transcript || '' });
  },

  /**
   * 14. Cyberbullying & Toxicity Detector
   */
  async scanCyberbullying(text: string): Promise<AnalysisResult> {
    return postJSON<AnalysisResult>('/scan/cyberbullying', { text });
  },

  /**
   * 15. AI Security Assistant
   */
  async chatAssistant(msgOrParams: string | { message: string; history?: any[] }, history: any[] = []) {
    if (typeof msgOrParams === 'object') {
      return postJSON('/assistant', { message: msgOrParams.message, history: msgOrParams.history || [] });
    }
    return postJSON('/assistant', { message: msgOrParams, history });
  },

  /**
   * Threat History Audit Records
   */
  async getHistory(limit: number = 50, filter: string = 'all'): Promise<AnalysisResult[]> {
    const res = await fetchWithTimeout(`${API_BASE}/history?filter=${encodeURIComponent(filter)}&limit=${limit}`, { method: 'GET' });
    if (!res.ok) throw new APIError('Failed to fetch history', res.status);
    return res.json();
  },

  async clearHistory() {
    const res = await fetchWithTimeout(`${API_BASE}/history`, { method: 'DELETE' });
    if (!res.ok) throw new APIError('Failed to clear history', res.status);
    return res.json();
  }
};
