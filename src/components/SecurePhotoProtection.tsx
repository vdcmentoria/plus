import React, { useEffect, useRef, useState } from 'react';
import { db } from '../lib/firebase';
import { 
  collection as firestoreCollection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { Shield, ShieldAlert, Eye, Lock, RefreshCw, AlertTriangle, UserCheck } from 'lucide-react';

// ==========================================
// 1. SIGNED TOKEN SYSTEM (Obfuscated Lifetime URLs)
// ==========================================

export function generateLocalSessionSecret() {
  if (typeof window !== 'undefined') {
    let secret = sessionStorage.getItem('gallery_session_secret');
    if (!secret) {
      secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('gallery_session_secret', secret);
    }
    return secret;
  }
  return 'fallback-secret-key';
}

export function generateSignedToken(imageIndex: number, clientEmail: string, sessionSecret: string, expirationMs: number = 15 * 60 * 1000) {
  const expires = Date.now() + expirationMs;
  const str = `${imageIndex}-${clientEmail.trim().toLowerCase()}-${expires}-${sessionSecret}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return {
    expires,
    signature: Math.abs(hash).toString(36)
  };
}

export function verifySignedToken(imageIndex: number, clientEmail: string, expires: number, signature: string, sessionSecret: string) {
  if (Date.now() > expires) return false;
  const str = `${imageIndex}-${clientEmail.trim().toLowerCase()}-${expires}-${sessionSecret}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36) === signature;
}


// ==========================================
// 2. AUDIT LOG INTERFACES & LOGGER
// ==========================================

export interface AuditLogEntry {
  id?: string;
  timestamp: any;
  clientEmail: string;
  clientName: string;
  sessionId: string;
  action: string; // 'login' | 'view_image' | 'devtools_attempt' | 'print_attempt' | 'screenshot_attempt' | 'blur_tab' | 'focus_tab' | 'purchase' | 'download'
  imageIndex?: number | null;
  severity: 'info' | 'warning' | 'danger';
  details?: string;
  userAgent?: string;
  screenWidth?: number;
}

export async function addAuditLog(collectionId: string, entry: Omit<AuditLogEntry, 'timestamp'>) {
  // Completely disabled by user request to remove Firestore logging
  return;
}

// Fetch helper for admin logs dashboard
export async function fetchAuditLogs(collectionId: string, resultsLimit: number = 100): Promise<AuditLogEntry[]> {
  return [];
}


// ==========================================
// 3. SECURITY ENFORCER REACT HOOK
// ==========================================

export interface SecurityEnforcerOpts {
  collectionId: string;
  antiPrintEnabled: boolean;
  clientEmail: string;
  clientName: string;
  sessionId: string;
  onBlockStatusChange: (status: boolean) => void;
  onDevtoolsDetected?: (detected: boolean) => void;
}

export function useSecurityEnforcer({
  collectionId,
  antiPrintEnabled,
  clientEmail,
  clientName,
  sessionId,
  onBlockStatusChange,
  onDevtoolsDetected
}: SecurityEnforcerOpts) {

  const hasLoggedDevtools = useRef(false);
  const hasLoggedPrint = useRef(false);

  useEffect(() => {
    if (!antiPrintEnabled) return;

    // A. Intercept standard Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Block Print Screen / Printing keys
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        onBlockStatusChange(true);
        if (!hasLoggedPrint.current) {
          addAuditLog(collectionId, {
            clientEmail,
            clientName,
            sessionId,
            action: 'print_attempt',
            severity: 'danger',
            details: 'PrintScreen key pressed.'
          });
          hasLoggedPrint.current = true;
          setTimeout(() => { hasLoggedPrint.current = false; }, 3000);
        }
      }

      // 2. Block Command+P / Ctrl+P (Printing)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        onBlockStatusChange(true);
        if (!hasLoggedPrint.current) {
          addAuditLog(collectionId, {
            clientEmail,
            clientName,
            sessionId,
            action: 'print_attempt',
            severity: 'danger',
            details: 'Print shortcut (Ctrl/Cmd + P) intercepted.'
          });
          hasLoggedPrint.current = true;
          setTimeout(() => { hasLoggedPrint.current = false; }, 3000);
        }
      }

      // 3. Block Devtools Hotkeys: F12, Ctrl+Shift+I, Cmd+Opt+I, Ctrl+Shift+C etc.
      if (
        e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) || // View Source
        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C' || e.key === 'j' || e.key === 'J'))
      ) {
        e.preventDefault();
        if (!hasLoggedDevtools.current) {
          addAuditLog(collectionId, {
            clientEmail,
            clientName,
            sessionId,
            action: 'devtools_attempt',
            severity: 'warning',
            details: `Developer tools hotkey intercepted (${e.key}).`
          });
          hasLoggedDevtools.current = true;
          setTimeout(() => { hasLoggedDevtools.current = false; }, 4000);
        }
      }
    };

    // B. Intercept mouse events & text selection
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addAuditLog(collectionId, {
        clientEmail,
        clientName,
        sessionId,
        action: 'print_attempt',
        severity: 'warning',
        details: 'Attempted to copy content.'
      });
    };

    // Listeners assignment
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('copy', handleCopy, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('copy', handleCopy, { capture: true });
    };
  }, [collectionId, antiPrintEnabled, clientEmail, clientName, sessionId]);


  // C. TAB FOCUS / BLUR LISTENER (Blur optionally on inactive tab to block screen-clipper grab background)
  useEffect(() => {
    if (!antiPrintEnabled) return;

    let totalBlurs = 0;
    const handleBlur = () => {
      totalBlurs++;
    };

    const handleFocus = () => {};

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [collectionId, antiPrintEnabled, clientEmail, clientName, sessionId]);


  // D. DEVTOOLS DETECTOR
  useEffect(() => {
    if (!antiPrintEnabled) return;
  }, [collectionId, antiPrintEnabled, clientEmail, clientName, sessionId, onDevtoolsDetected]);
}


// ==========================================
// 4. SECURE CANVAS IMAGE VIEW & WATERMARK
// ==========================================

export interface SecureCanvasViewerProps {
  imageIndex: number;
  url: string;
  clientEmail: string;
  clientName: string;
  sessionId: string;
  sessionSecret: string;
  expires: number;
  signature: string;
  antiPrintEnabled: boolean;
  collectionId: string;
  isPurchased: boolean;
  imageRounding?: string;
  aspectRatioClass?: string;
  onDirectClick?: () => void;
  onAuditLogged?: () => void;
}

export function SecureCanvasViewer({
  imageIndex,
  url,
  clientEmail,
  clientName,
  sessionId,
  sessionSecret,
  expires,
  signature,
  antiPrintEnabled,
  collectionId,
  isPurchased,
  imageRounding = 'rounded-none',
  aspectRatioClass = 'aspect-[3/4]',
  onDirectClick,
  onAuditLogged
}: SecureCanvasViewerProps) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error' | 'expired'>('idle');
  const [useFallbackElement, setUseFallbackElement] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [tabIsBlurred, setTabIsBlurred] = useState(false);
  const triggerLogOnce = useRef(false);

  // Parse limited low resolution source dynamically
  const getLowResUrl = (rawUrl: string) => {
    if (isPurchased) return rawUrl; // Return full if purchased
    
    // Unsplash supports dynamic width
    if (rawUrl.includes('unsplash.com')) {
      let cleaned = rawUrl;
      // strip standard and add max-width limit parameters (800w, 65q)
      cleaned = cleaned.replace(/w=\d+/g, 'w=850').replace(/q=\d+/g, 'q=60');
      if (!cleaned.includes('w=')) {
        cleaned += '&w=850&q=60';
      }
      return cleaned;
    }
    return rawUrl;
  };

  // Blur layout during local tab focus changes
  useEffect(() => {
    if (!antiPrintEnabled) return;
    const checkBlur = () => {
      setTabIsBlurred(document.hidden || !document.hasFocus());
    };
    
    window.addEventListener('blur', checkBlur);
    window.addEventListener('focus', checkBlur);
    document.addEventListener('visibilitychange', checkBlur);
    
    return () => {
      window.removeEventListener('blur', checkBlur);
      window.removeEventListener('focus', checkBlur);
      document.removeEventListener('visibilitychange', checkBlur);
    };
  }, [antiPrintEnabled]);

  // Main Canvas Render
  useEffect(() => {
    if (loadState === 'expired') return;

    // Verify Signed URL Validity
    const isValid = verifySignedToken(imageIndex, clientEmail, expires, signature, sessionSecret);
    if (!isValid && !isPurchased) {
      setLoadState('expired');
      return;
    }

    setLoadState('loading');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setLoadState('error');
      setUseFallbackElement(true);
      return;
    }

    const img = new Image();
    // Do not set crossOrigin="anonymous" to avoid CORS failures across external image servers
    img.src = getLowResUrl(url);

    img.onload = () => {
      setLoadState('success');
      
      // Determine canvas sizes fitting responsive design
      const containerWidth = containerRef.current?.getBoundingClientRect().width || 400;
      const containerHeight = containerRef.current?.getBoundingClientRect().height || 500;
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // Calculate responsive best fit
      const fitFactor = Math.min(containerWidth / imgWidth, containerHeight / imgHeight, 1);
      const drawWidth = imgWidth * fitFactor;
      const drawHeight = imgHeight * fitFactor;

      // Adjust pixel density elements
      canvas.width = drawWidth * 1.5;
      canvas.height = drawHeight * 1.5;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.scale(1.5, 1.5);

      // Draw Base Low-Res Image
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

      // Render SECURITY WATERMARK (Removed by user request to keep image normal)

      // Trigger Audit Log view precisely ONCE per mount to avoid firing on minor state updates
      if (!triggerLogOnce.current && collectionId) {
        addAuditLog(collectionId, {
          clientEmail,
          clientName,
          sessionId,
          action: 'view_image',
          imageIndex,
          severity: 'info',
          details: `Foto #${imageIndex + 1} renderizada com sucesso em Canvas seguro.`
        });
        triggerLogOnce.current = true;
        onAuditLogged?.();
      }
    };

    img.onerror = () => {
      console.warn("CORS/Fetch error on canvas block. Proceeding with hybrid layout overlay.");
      setLoadState('success');
      setUseFallbackElement(true); // Falls back to standard image block with pointer disables + watermarked canvas background

      if (!triggerLogOnce.current && collectionId) {
        addAuditLog(collectionId, {
          clientEmail,
          clientName,
          sessionId,
          action: 'view_image',
          imageIndex,
          severity: 'info',
          details: `Foto #${imageIndex + 1} renderizada com sucesso em elemento hídrico pós-CORS.`
        });
        triggerLogOnce.current = true;
      }
    };

  }, [imageIndex, url, clientEmail, clientName, sessionId, sessionSecret, expires, signature, isPurchased, antiPrintEnabled, collectionId]);

  // Handle minor zooms for stellar interactive UX (double-click zoom)
  const handleDoubleTap = () => {
    setCanvasZoom(prev => prev === 1 ? 1.4 : 1);
  };

  return (
    <div 
      ref={containerRef}
      onDoubleClick={handleDoubleTap}
      onClick={onDirectClick}
      className={`relative select-none overflow-hidden ${aspectRatioClass} ${imageRounding} bg-neutral-900 border border-neutral-800 flex items-center justify-center transition-all ${tabIsBlurred ? 'blur-[18px]' : ''}`}
      style={{
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >


      {loadState === 'expired' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 p-6 text-center text-white z-10">
          <Lock className="w-8 h-8 text-amber-500 mb-3" />
          <h4 className="text-sm font-black uppercase tracking-wider text-amber-500">Acesso Expirado</h4>
          <p className="text-[11px] text-gray-400 mt-1 max-w-[185px]">Sua sessão para esta foto expirou por segurança. Recarregue a página.</p>
        </div>
      )}

      {loadState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 p-6 text-center text-white z-10">
          <ShieldAlert className="w-8 h-8 text-red-500 mb-3" />
          <h4 className="text-sm font-black uppercase tracking-wider text-red-500">Erro de Transmissão</h4>
          <p className="text-[11px] text-gray-400 mt-1">Carregue novamente.</p>
        </div>
      )}

      {/* Primary Canvas Drawing Element */}
      {!useFallbackElement ? (
        <canvas 
          ref={canvasRef}
          className="max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300"
          style={{ 
            pointerEvents: 'none',
            transform: `scale(${canvasZoom})` 
          }}
        />
      ) : (
        /* Dynamic Hybrid Fallback for general non-CORS images */
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={getLowResUrl(url)} 
            className="w-full h-full object-cover select-none pointer-events-none"
            alt="Protected preview"
            draggable={false}
            referrerPolicy="no-referrer"
            style={{ 
              userSelect: 'none', 
              WebkitUserSelect: 'none',
              transform: `scale(${canvasZoom})`
            }}
          />
          {/* Strict structural watermarks overlay burned dynamically (Removed) */}
        </div>
      )}

      {/* Small UI visual key stating it is canvas protected (Removed) */}

      {tabIsBlurred && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md text-center p-4">
          <Lock className="w-7 h-7 text-amber-500 mb-2 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Proteção Omitida no Desfocado</span>
          <p className="text-[9px] text-gray-400 mt-1">Toque de volta para reativar visualização.</p>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 5. AUDIT LOGS DISPLAY PANEL (For photographer's reference)
// ==========================================

export function SecureAuditLogsDashboard({ collectionId }: { collectionId: string }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const loadLogs = async () => {
    setLoading(true);
    const fetched = await fetchAuditLogs(collectionId, 100);
    setLogs(fetched);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();

    // Listen to local log updates happening in same session without waiting for db roundtrip
    const handleNewLocalLog = (e: any) => {
      if (e.detail) {
        setLogs(prev => [e.detail, ...prev].slice(0, 100));
      }
    };

    window.addEventListener('secure-add-local-audit-log', handleNewLocalLog);
    return () => {
      window.removeEventListener('secure-add-local-audit-log', handleNewLocalLog);
    };
  }, [collectionId]);

  const filtered = logs.filter(log => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'danger': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Trilha de Auditoria & Logs de Segurança</h3>
            <p className="text-xs text-gray-500 mt-0.5">Histórico completo de acessos, de visualizações e de capturas bloqueadas em tempo real.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs font-semibold border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D05634] dark:bg-neutral-800 dark:text-white"
          >
            <option value="all">Todas as Severidades</option>
            <option value="info">Informações (Acessos)</option>
            <option value="warning">Avisos (Intercepções)</option>
            <option value="danger">Alertas Críticos (Prints/Dev)</option>
          </select>
          <button 
            onClick={loadLogs}
            className="p-1.5 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-gray-100 dark:border-neutral-800 text-gray-500"
            title="Atualizar Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin text-[#D05634] mb-2" />
          <span className="text-xs font-medium">Sincronizando trilha de auditoria...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Shield className="w-12 h-12 mx-auto opacity-15 mb-2.5" />
          <p className="text-xs font-bold uppercase tracking-wider">Nenhum Log Encontrado</p>
          <p className="text-[11px] text-gray-500 mt-0.5">As interações de segurança correspondentes aparecerão aqui.</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="py-2.5 px-3">Data/Hora</th>
                <th className="py-2.5 px-3">Cliente / Sessão</th>
                <th className="py-2.5 px-3">Evento</th>
                <th className="py-2.5 px-3">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50 text-xs">
              {filtered.map((log: AuditLogEntry, i) => {
                const formattedDate = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Sem data';
                return (
                  <tr key={log.id || i} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/10">
                    <td className="py-3 px-3 whitespace-nowrap text-gray-400 font-mono text-[10px]">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900 dark:text-white leading-normal">{log.clientName || 'Cliente Autônomo'}</div>
                      <div className="text-[10px] text-gray-400 leading-normal">{log.clientEmail}</div>
                      <div className="text-[9px] font-mono text-gray-400 mt-0.5">SESS: {log.sessionId?.substring(0, 8)}...</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none ${getSeverityStyles(log.severity)}`}>
                          {log.action?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300 font-medium max-w-[280px] break-words leading-relaxed text-[11px]">
                      {log.details}
                      {log.imageIndex !== undefined && log.imageIndex !== null && (
                        <span className="font-bold text-amber-500 ml-1"> (Foto #{log.imageIndex + 1})</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center gap-1.5 justify-end">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Trilha Ativa & Criptografada</span>
      </div>
    </div>
  );
}
