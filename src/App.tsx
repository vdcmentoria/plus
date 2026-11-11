import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { get, set } from 'idb-keyval';
import { 
  Moon, 
  Sun,
  ArrowRight, 
  Check, 
  Grid, 
  List, 
  FolderPlus, 
  Folder,
  FolderMinus,
  FolderUp,
  Plus, 
  Image as ImageIcon, 
  MoreVertical, 
  ExternalLink,
  Sparkles,
  Settings,
  Home,
  X,
  ArrowLeft,
  PanelLeftClose,
  LayoutTemplate,
  Store,
  Palette,
  Lock,
  Download,
  ArrowDownUp,
  ZoomIn,
  ZoomOut,
  Pencil,
  Trash,
  Upload,
  Type,
  Smartphone,
  Monitor,
  Layout,
  LayoutGrid,
  Columns,
  Rows,
  LayoutDashboard,
  Grid3X3,
  Maximize,
  ChevronDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Globe,
  Key,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Truck,
  MapPin,
  Info,
  Clock,
  CreditCard,
  Database,
  Instagram,
  Twitter,
  Github,
  Users,
  HardDrive,
  Search,
  RotateCcw,
  Link,
  Shuffle,
  RefreshCcw,
  RefreshCw,
  Share2,
  Award
} from 'lucide-react';

import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db, checkConnection } from './lib/firebase';
import { LojaSidebar } from './components/LojaSidebar';
import { PublicWebsiteView } from './components/PublicWebsiteView';
import { SiteBuilderView } from './components/SiteBuilderView';
import { OFFICIAL_ASSOCIATION_SEALS, getAssociationSealLogoUrl } from './components/ScrollytellingThemes';
import { 
  SecureCanvasViewer, 
  useSecurityEnforcer, 
  SecureAuditLogsDashboard, 
  addAuditLog, 
  generateSignedToken, 
  generateLocalSessionSecret 
} from './components/SecurePhotoProtection';
import { 
  isUserAdmin, 
  calculateUserStorage, 
  getCollectionStorageBytes, 
  StorageInfo,
  isTrialExpired,
  getTrialDaysRemaining
} from './lib/storageUtils';
import { convertToWebP } from './utils/imageOptimizer';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isQuotaError = error instanceof Error && (error.message.includes('Quota exceeded') || (error as any).code === 'resource-exhausted');
  
  if (isQuotaError) {
    console.warn("Firestore Quota Exceeded. Switching to local-only mode for this session.");
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('firestore_quota_exceeded', 'true');
        (window as any).isFirestoreQuotaExceeded = true;
        window.dispatchEvent(new CustomEvent('firestore-quota-exceeded'));
      }
    } catch (e) {}
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const primaryColor = '#D05634';

function Navbar({ 
  activeTab, 
  setActiveTab, 
  user,
  userProfile,
  storageInfo,
  isAdmin,
  onLogout,
  globalTheme,
  onToggleGlobalTheme
}: { 
  activeTab: string; 
  setActiveTab: (t: string) => void; 
  user: any | null;
  userProfile?: any;
  storageInfo?: StorageInfo;
  isAdmin?: boolean;
  onLogout?: () => void;
  globalTheme?: 'light' | 'dark';
  onToggleGlobalTheme?: () => void;
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: 'inicio', label: 'INÍCIO' },
    { id: 'planos', label: 'PLANOS' },
    { id: 'colecoes', label: 'COLEÇÕES' },
    { id: 'site', label: 'SITE' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('inicio')}>
        <img 
          src="https://cdn.plus.framepro.click/uploads/m30bw01epp9ab69/1778538221316-logo%20frame%20plus.png" 
          alt="Frame+" 
          className="h-10 w-auto"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-[#FFF0EB] text-[#D05634]' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Global Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            if (onToggleGlobalTheme) {
              onToggleGlobalTheme();
            }
          }}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
          title={globalTheme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
          {globalTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {user ? (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-200"
            >
              <img 
                src={user.photoURL || userProfile?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            </button>
            
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 text-sm"
                >
                  <div className="pb-4 border-b border-gray-100 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">{user.displayName || userProfile?.displayName || 'Usuário'}</p>
                      {isAdmin && (
                        <span className="text-[10px] bg-[#FFF0EB] text-[#D05634] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      SSO FramePro Conectado
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-gray-700 mb-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Database className="w-3.5 h-3.5 text-[#D05634]" />
                        <span>Armazenamento</span>
                      </div>
                      <span className="font-bold text-[#D05634]">{storageInfo?.formattedPercent || '0.0%'}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mb-2">
                      {storageInfo?.formattedUsed || '0 MB'} de {storageInfo?.formattedLimit || '3 GB'} usado
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${storageInfo?.isOverLimit ? 'bg-red-500' : 'bg-[#D05634]'}`} 
                        style={{ width: `${Math.min(100, storageInfo?.percent || 0)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button onClick={() => { setActiveTab('colecoes'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                      <Grid className="w-4 h-4" /> Coleções
                    </button>
                    <button onClick={() => { setActiveTab('site'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                      <Globe className="w-4 h-4 text-[#D05634]" /> Meu Site Pro
                    </button>
                    <button onClick={() => { setActiveTab('configuracoes'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                      <Settings className="w-4 h-4" /> Configurações
                    </button>
                    <a
                      href="https://crm.framepro.click/hub"
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      <Globe className="w-4 h-4 text-[#D05634]" /> Ecossistema Frame (Hub)
                    </a>
                    {isAdmin && (
                      <button onClick={() => { setActiveTab('admin'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#FFF0EB] text-[#D05634] font-medium">
                        <Shield className="w-4 h-4" /> Painel Admin
                      </button>
                    )}
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onLogout) onLogout();
                        else signOut(auth);
                      }} 
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <ArrowLeft className="w-4 h-4" /> Sair
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('login')}
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#D05634] transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => setActiveTab('cadastro')}
              className="bg-[#D05634] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#b84a2b] transition-colors shadow-sm"
            >
              Cadastrar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function AuthForm({ 
  mode, 
  onToggleMode, 
  onToggleRecovery,
  onAuthSuccess
}: { 
  mode: 'login' | 'register' | 'recovery'; 
  onToggleMode: () => void; 
  onToggleRecovery: (v: boolean) => void;
  onAuthSuccess?: (userObj: any) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        // 1. Primary: Unified Login against FramePro CRM database
        const fpRes = await fetch('/api/auth/framepro-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const fpData = await fpRes.json().catch(() => ({}));

        if (fpRes.ok && fpData.user) {
          if (onAuthSuccess) {
            onAuthSuccess(fpData.user);
          }
          return;
        }

        // 2. Fallback: Check if user has a legacy Firebase account and sync it
        try {
          const fbCred = await signInWithEmailAndPassword(auth, email, password);
          const syncRes = await fetch(`/api/users/${fbCred.user.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: fbCred.user.uid,
              email: fbCred.user.email,
              displayName: fbCred.user.displayName || email.split('@')[0],
              photoURL: fbCred.user.photoURL || ''
            })
          });
          const syncedUser = syncRes.ok ? await syncRes.json() : {
            uid: fbCred.user.uid,
            email: fbCred.user.email,
            displayName: fbCred.user.displayName || email.split('@')[0]
          };
          if (onAuthSuccess) {
            onAuthSuccess(syncedUser);
          }
          return;
        } catch {
          throw new Error(fpData.error || 'Usuário não encontrado ou senha incorreta.');
        }
      } else if (mode === 'register') {
        // Unified Registration in FramePro CRM database + FramePlus
        const fpRes = await fetch('/api/auth/framepro-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        const fpData = await fpRes.json().catch(() => ({}));

        if (!fpRes.ok) {
          throw new Error(fpData.error || 'Não foi possível criar a conta.');
        }

        if (fpData.requireVerification) {
          setSuccess('Conta criada no Ecossistema FramePro! Verifique seu e-mail ou faça login.');
          return;
        }

        if (fpData.user && onAuthSuccess) {
          onAuthSuccess(fpData.user);
          return;
        }
      } else if (mode === 'recovery') {
        const fpRes = await fetch('/api/auth/framepro-reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (fpRes.ok) {
          setSuccess('E-mail de recuperação enviado pelo FramePro! Verifique sua caixa de entrada.');
        } else {
          await sendPasswordResetEmail(auth, email);
          setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') setError('Usuário não encontrado.');
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.');
      else if (err.code === 'auth/email-already-in-use') setError('E-mail já está em uso.');
      else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
      else setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Create/Update user doc on Server (links by email if already in FramePro)
      try {
        const res = await fetch(`/api/users/${result.user.uid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
        });
        if (res.ok) {
          const userData = await res.json();
          if (onAuthSuccess) onAuthSuccess(userData);
        }
      } catch (e) {
        console.error("Error setting user profile on server:", e);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pt-20 px-4 pb-16">
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <img 
            src="https://cdn.plus.framepro.click/uploads/m30bw01epp9ab69/1778538221316-logo%20frame%20plus.png" 
            alt="Frame+" 
            className="h-12 w-auto cursor-pointer mb-3"
            onClick={() => onToggleRecovery(false)}
            referrerPolicy="no-referrer"
          />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF0EB] text-[#D05634] tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D05634]"></span>
            Login Unificado Ecossistema FramePro
          </span>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Crie sua conta' : 'Recuperar Senha'}
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm px-4">
          {mode === 'login' 
            ? 'Entre com a mesma conta e senha do seu FramePro CRM' 
            : mode === 'register' 
              ? 'Sua conta funcionará integrada no FramePro e no Frame+' 
              : 'Informe seu e-mail e enviaremos instruções para redefinir sua senha.'}
        </p>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João Silva"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do FramePro</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50"
            />
          </div>

          {mode !== 'recovery' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => onToggleRecovery(true)} className="text-xs text-[#D05634] font-medium hover:underline">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••••••'}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D05634] text-white py-4 rounded-2xl font-bold hover:bg-[#b84a2b] transition-all transform active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? 'Autenticando...' : mode === 'login' ? 'Entrar com FramePro' : mode === 'register' ? 'Criar Conta Unificada' : 'Enviar Instruções'}
          </button>
        </form>

        {mode !== 'recovery' && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-medium">Ou continue com</span></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-all hover:border-gray-300"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Entrar com Google
              </button>

              <a
                href="https://crm.framepro.click/hub"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-zinc-900 text-white rounded-2xl font-medium text-sm hover:bg-zinc-800 transition-all"
              >
                <Globe className="w-4 h-4 text-[#D05634]" />
                Acessar pelo Hub FramePro (SSO)
              </a>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-gray-500 font-medium">
              Não tem uma conta? <button onClick={onToggleMode} className="text-[#D05634] hover:underline">Cadastre-se grátis</button>
            </p>
          ) : mode === 'register' ? (
            <p className="text-sm text-gray-500 font-medium">
              Já tem uma conta? <button onClick={onToggleMode} className="text-[#D05634] hover:underline">Faça login</button>
            </p>
          ) : (
            <button onClick={() => onToggleRecovery(false)} className="text-sm text-[#D05634] font-medium hover:underline flex items-center justify-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" /> Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeView({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const [isAnnualPlan, setIsAnnualPlan] = useState(true);

  const plansRow1 = [
    { name: "Basic", storage: "3GB de Armazenamento", annualPrice: "10,00", monthlyPrice: "12,00", list: ["3GB de armazenamento", "Galeria básica"] },
    { name: "Crop", storage: "15GB de Armazenamento", annualPrice: "37,00", monthlyPrice: "46,00", list: ["15GB de armazenamento", "Galeria avançada", "Compartilhamento"] },
    { name: "Luz", storage: "30GB de Armazenamento", annualPrice: "47,00", monthlyPrice: "59,00", list: ["30GB de armazenamento", "Galeria premium", "Compartilhamento avançado"] },
    { name: "Shoot", storage: "50GB de Armazenamento", annualPrice: "57,00", monthlyPrice: "71,00", list: ["50GB de armazenamento", "Galeria profissional", "Suporte prioritário"] },
  ];

  const plansRow2 = [
    { name: "Click", storage: "100GB de Armazenamento", annualPrice: "77,00", monthlyPrice: "96,00", list: ["100GB de armazenamento", "Galeria profissional", "Suporte 24/7", "Downloads ilimitados"], recommended: true },
    { name: "Plus", storage: "500GB de Armazenamento", annualPrice: "97,00", monthlyPrice: "121,00", list: ["500GB de armazenamento", "Galeria enterprise", "Suporte dedicado", "API access"] },
    { name: "PRO", storage: "2048GB de Armazenamento", annualPrice: "197,00", monthlyPrice: "246,00", list: ["2TB de armazenamento", "Galeria enterprise", "Suporte dedicado", "API access", "Integrações customizadas"] },
    { name: "Founder", storage: "4096GB de Armazenamento", annualPrice: "297,00", monthlyPrice: "371,00", list: ["4TB de armazenamento", "Galeria enterprise", "Suporte dedicado 24/7", "API access", "Integrações customizadas", "Consultoria"] },
  ];

  const renderPlanCard = (p: any) => {
    const price = isAnnualPlan ? p.annualPrice : p.monthlyPrice;
    return (
      <div 
        key={p.name}
        className={`bg-white rounded-3xl p-8 border transition-all flex flex-col relative ${p.recommended ? 'border-2 border-[#D05634] shadow-lg shadow-[#D05634]/5' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
      >
        {p.recommended && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D05634] text-white text-[9px] font-black tracking-widest px-4 py-1 rounded-full uppercase shadow-sm">
            Recomendado
          </span>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
          <p className="text-xs text-gray-400 font-medium italic mt-0.5">{p.storage}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-400">R$</span>
            <span className="text-3xl font-black text-gray-900 tracking-tight">{price}</span>
            <span className="text-xs font-semibold text-gray-400">/mês</span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
            {isAnnualPlan ? 'faturado anualmente' : 'faturado mensalmente'}
          </p>
        </div>
        
        <ul className="space-y-3 mb-8 flex-1">
          {p.list.map((feat: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#D05634]" />
              </div>
              <span className="text-gray-600 text-xs font-medium leading-tight">{feat}</span>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => setActiveTab('cadastro')}
          className={`w-full py-3 rounded-full font-bold transition-all text-xs uppercase tracking-widest ${p.recommended ? 'bg-[#D05634] text-white hover:bg-[#b84a2b] shadow-md shadow-[#D05634]/10' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          Escolher Plano
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* 1. Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#FFF0EB] text-[#D05634] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 rounded-full bg-[#D05634]"></div>
            A plataforma definitiva para fotógrafos
          </div>
          
          <h1 className="text-[3.5rem] font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Entregue<br />
            galerias incríveis<br />
            em segundos.
          </h1>
          
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            A escolha dos profissionais para entrega de imagens. Faça upload de fotos em alta resolução, personalize sua marca e compartilhe links privados lindos com seus clientes de forma rápida e segura.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('cadastro')}
              className="bg-[#D05634] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#b84a2b] transition-colors flex items-center gap-2 shadow-lg shadow-[#D05634]/20"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('login')}
              className="border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Acessar Conta
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full lg:max-w-xl">
          <div className="bg-[#111111] rounded-[2rem] shadow-2xl p-6 aspect-[4/3] flex flex-col relative overflow-hidden border-8 border-gray-900">
            {/* Mock app UI Header */}
            <div className="flex items-center justify-between text-gray-400 mb-6 text-sm">
              <div className="flex items-center gap-4">
                <span>3:50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-500 rounded-sm"></span>
                <span>LTE</span>
              </div>
            </div>
            
            <div className="text-white text-sm text-center mb-6">Number selected: 0</div>
            
            <div className="flex items-center gap-2 text-white mb-4">
              <span className="text-xs">▾</span>
              <span className="text-sm font-medium">Mar. 3, 2020 (18)</span>
            </div>

            {/* Mock Grid */}
            <div className="grid grid-cols-4 gap-2 flex-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-[#222222] rounded overflow-hidden relative group">
                  <div className="absolute top-1 left-1 w-4 h-4 border border-white/50 rounded-full z-10"></div>
                  <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full z-10 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-[10px]">Q</span>
                  </div>
                  {/* Randomly fill some mock images */}
                  <div className="w-full h-full bg-cover bg-center opacity-80" 
                    style={{
                      backgroundImage: i % 3 === 0 ? 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=80)' : 
                                     i % 5 === 0 ? 'url(https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=200&q=80)' : 'none',
                      backgroundColor: i % 3 !== 0 && i % 5 !== 0 ? '#333' : 'transparent'
                    }}>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Bottom Tab Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 text-xs text-white/70 bg-black/80 px-8 py-3 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-1"><Grid className="w-5 h-5 text-white" /><span className="text-white">View</span></div>
              <div className="flex flex-col items-center gap-1 opacity-50"><ArrowRight className="w-5 h-5" /><span>Jump</span></div>
              <div className="flex flex-col items-center gap-1 opacity-50"><FolderPlus className="w-5 h-5" /><span>Import</span></div>
              <div className="flex flex-col items-center gap-1 opacity-50"><Settings className="w-5 h-5" /><span>Apps</span></div>
              <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-5 h-5 block text-center leading-none">🗑</span><span>Delete</span></div>
            </div>
          </div>
          
          {/* Soft blob shadow behind the device */}
          <div className="absolute top-10 right-10 w-full h-full bg-[#FFF0EB] rounded-full blur-[100px] -z-10 opacity-70"></div>
        </div>
      </div>

      {/* 2. First Fold: Tudo o que você precisa */}
      <div className="max-w-7xl mx-auto px-8 py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Tudo o que você precisa para<br />gerenciar seu negócio de fotografia
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Pare de lutar com armazenamento em nuvem genérico. Criado especificamente para as necessidades de fotógrafos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="w-12 h-12 bg-[#FFF0EB] rounded-2xl flex items-center justify-center text-[#D05634] shadow-sm border border-[#FFF0EB]">
              <ImageIcon className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Galerias lindas e personalizáveis
            </h3>
            
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              Apresente seu trabalho exatamente como você imaginou. Escolha entre layouts de alvenaria, grade ou apresentação de slides. Personalize cores e tipografia para combinar com a identidade única da sua marca.
            </p>

            <ul className="space-y-4 pt-4 border-t border-gray-100">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Marca e cores personalizadas</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Múltiplas opções de layout</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Visualização otimizada para celular</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex gap-4 items-end">
                <div className="w-[60%]">
                  <img 
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" 
                    className="rounded-3xl w-full h-48 object-cover shadow-sm hover:scale-[1.01] transition-transform"
                    alt="Casamento sparklers"
                  />
                </div>
                <div className="w-[40%]">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" 
                    className="rounded-3xl w-full h-64 object-cover shadow-sm hover:scale-[1.01] transition-transform"
                    alt="Casamento pôr do sol"
                  />
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1519225495810-7517c31d2d32?auto=format&fit=crop&w=1200&q=80" 
                  className="rounded-3xl w-full h-40 object-cover shadow-sm hover:scale-[1.005] transition-transform"
                  alt="Comemoração casamento"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Second Fold: Rastreamento de armazenamento transparente */}
      <div className="max-w-7xl mx-auto px-8 py-24 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-center max-w-sm w-full mx-auto">
              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <span className="font-sans font-semibold text-gray-800">Armazenamento</span>
                <span className="text-gray-500 font-medium">750 GB de 1 TB</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium text-center mt-4">
                Acompanhe seu uso em tempo real e nunca fique sem espaço.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 lg:pl-8">
            <div className="w-12 h-12 bg-[#FFF0EB] rounded-2xl flex items-center justify-center text-[#D05634] shadow-sm border border-[#FFF0EB]">
              <Database className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Rastreamento de armazenamento transparente
            </h3>
            
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              Nunca adivinhe quanto espaço você ainda tem. Nosso painel intuitivo fornece insights em tempo real sobre o uso do seu armazenamento em todas as galerias de clientes.
            </p>

            <ul className="space-y-4 pt-4 border-t border-gray-100">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Arquivos originais em alta resolução</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Geração automática de tamanho web</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#D05634]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Métricas de uso claras</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Third Fold: Planos de Armazenamento */}
      <div className="max-w-7xl mx-auto px-8 py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-none mb-4">
            Planos de Armazenamento
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Comece de graça, atualize quando precisar de mais espaço.
          </p>
          
          {/* Toggle billing */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <span className={`text-sm font-semibold transition-colors ${!isAnnualPlan ? 'text-gray-900' : 'text-gray-400'}`}>
              Mensal
            </span>
            <button 
              onClick={() => setIsAnnualPlan(!isAnnualPlan)}
              className="w-14 h-8 bg-[#D05634] rounded-full p-1 cursor-pointer transition-colors flex items-center relative"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${isAnnualPlan ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold transition-colors ${isAnnualPlan ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                Anual
              </span>
              <span className="bg-[#FFF0EB] text-[#D05634] text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                Economize 20%
              </span>
            </div>
          </div>
        </div>

        {/* Row 1 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plansRow1.map(p => renderPlanCard(p))}
        </div>

        {/* Row 2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansRow2.map(p => renderPlanCard(p))}
        </div>

        {/* Bottom link */}
        <div className="text-center mt-12">
          <button 
            onClick={() => setActiveTab('planos')}
            className="inline-flex items-center gap-2 text-[#D05634] font-bold text-sm tracking-tight hover:underline transition-all group"
          >
            Ver todos os planos 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5. Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://cdn.plus.framepro.click/uploads/m30bw01epp9ab69/1778538221316-logo%20frame%20plus.png" 
              alt="Frame+" 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs text-gray-400 font-semibold">
              © 2026 Todos os direitos reservados.
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-wider">
            <button onClick={() => setActiveTab('inicio')} className="hover:text-gray-900 transition-colors">
              Início
            </button>
            <button onClick={() => setActiveTab('planos')} className="hover:text-gray-900 transition-colors">
              Planos
            </button>
            <button onClick={() => setActiveTab('inicio')} className="hover:text-gray-900 transition-colors">
              Termos
            </button>
            <button onClick={() => setActiveTab('inicio')} className="hover:text-gray-900 transition-colors">
              Privacidade
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-gray-600 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-gray-600 transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface Plan {
  id: string;
  name: string;
  storageGB: number;
  priceMonthly: string;
  priceAnnual: string;
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
  features: string[];
  ctaText: string;
  displayOrder: number;
  isRecommended: boolean;
  category: 'top' | 'bottom';
}

const pricingPlansTop = [
  { price: "10,00", storage: "3GB de armazenamento", features: ["Galeria básica"] },
  { price: "37,00", storage: "15GB de armazenamento", features: ["Galeria avançada", "Compartilhamento"] },
  { price: "47,00", storage: "30GB de armazenamento", features: ["Galeria premium", "Compartilhamento avançado"] },
  { price: "57,00", storage: "50GB de armazenamento", features: ["Galeria profissional", "Suporte prioritário"] },
];

const pricingPlansBottom = [
  { 
    name: "Click", storageText: "100GB de Armazenamento", price: "77,00", 
    features: ["100GB de armazenamento", "Galeria profissional", "Suporte 24/7", "Downloads ilimitados"],
    recommended: true
  },
  { 
    name: "Plus", storageText: "500GB de Armazenamento", price: "97,00", 
    features: ["500GB de armazenamento", "Galeria enterprise", "Suporte dedicado", "API access"],
  },
  { 
    name: "PRO", storageText: "2048GB de Armazenamento", price: "197,00", 
    features: ["2TB de armazenamento", "Galeria enterprise", "Suporte dedicado", "API access", "Integrações customizadas"],
  },
  { 
    name: "Founder", storageText: "4096GB de Armazenamento", price: "297,00", 
    features: ["4TB de armazenamento", "Galeria enterprise", "Suporte dedicado 24/7", "API access", "Integrações customizadas", "Consultoria"],
  },
];

function PlanSettingsModal({ 
  plan, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  plan: Partial<Plan>, 
  onClose: () => void, 
  onSave: (data: any) => Promise<void>, 
  onDelete?: (id: string) => Promise<void> 
}) {
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: '',
    storageGB: 0,
    priceMonthly: '',
    priceAnnual: '',
    stripePriceIdMonthly: '',
    stripePriceIdAnnual: '',
    features: [''],
    ctaText: 'Escolher Plano',
    displayOrder: 0,
    isRecommended: false,
    category: 'bottom',
    ...plan
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all scale-100">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900">
            Configurar Plano de Armazenamento: <span className="text-[#D05634]">{formData.name || 'Novo'}</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nome do Plano</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="Ex: Click"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Armazenamento (GB)</label>
              <input
                type="number"
                value={formData.storageGB}
                onChange={(e) => setFormData({ ...formData, storageGB: Number(e.target.value) })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="Ex: 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Preço Mensal (Ex: R$50,00)</label>
              <input
                type="text"
                value={formData.priceMonthly}
                onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="Ex: 92,40"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Preço Anual (Ex: R$500,00)</label>
              <input
                type="text"
                value={formData.priceAnnual}
                onChange={(e) => setFormData({ ...formData, priceAnnual: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="Ex: 77,00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Stripe Price ID (Mensal)</label>
              <input
                type="text"
                value={formData.stripePriceIdMonthly}
                onChange={(e) => setFormData({ ...formData, stripePriceIdMonthly: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="price_..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Stripe Price ID (Anual)</label>
              <input
                type="text"
                value={formData.stripePriceIdAnnual}
                onChange={(e) => setFormData({ ...formData, stripePriceIdAnnual: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                placeholder="price_..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Features</label>
            <div className="space-y-3">
              {(formData.features || []).map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
                    placeholder="Ex: 100GB de armazenamento"
                  />
                  <button 
                    onClick={() => removeFeature(idx)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={addFeature}
                className="flex items-center gap-2 text-[#D05634] font-bold text-sm bg-[#FFF0EB] px-6 py-3 rounded-xl hover:bg-[#ffe0d6] transition-all"
              >
                <Plus className="w-4 h-4" /> Adicionar Feature
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Texto do Botão (CTA)</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Ordem de Exibição</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] bg-gray-50/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isRecommended}
                onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D05634]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-[#D05634]"></div>
            </label>
            <span className="text-sm font-bold text-gray-700">Destacar este plano (Recomendado)</span>
          </div>
        </div>

        <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center gap-4">
          {onDelete && formData.id && (
            <button 
              onClick={() => onDelete(formData.id!)}
              className="bg-red-500 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Trash className="w-5 h-5" /> Deletar
            </button>
          )}
          <div className="flex gap-4 ml-auto">
            <button 
              onClick={onClose}
              className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="bg-[#D05634] text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-[#b84a2b] transition-all shadow-lg shadow-[#D05634]/20"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingCard({ plan, isTopRow = false, onEdit, isAdmin, onDelete, isAnnualPlan }: { 
  plan: any, 
  isTopRow?: boolean, 
  onEdit?: () => void, 
  isAdmin?: boolean, 
  onDelete?: () => void, 
  key?: any,
  isAnnualPlan: boolean
}) {
  const currentPrice = isAnnualPlan ? (plan.price || plan.priceYearly || '') : (plan.priceMonthly || '');
  return (
    <div className={`relative bg-white rounded-[1.5rem] p-8 flex flex-col items-start h-full ${
      plan.recommended || plan.isRecommended
        ? 'border-2 border-[#D05634] shadow-lg shadow-[#D05634]/10' 
        : 'border border-gray-200'
    }`}>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-gray-400 hover:text-[#D05634] hover:bg-[#FFF0EB] p-2 rounded-full transition-all hover:scale-110 active:scale-95"
              title="Editar Plano"
            >
              <Settings className="w-5 h-5"/>
            </button>
          )}
          {onDelete && plan.id && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
              title="Excluir Plano"
            >
              <Trash className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      {(plan.recommended || plan.isRecommended) && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D05634] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap z-10">
          <Sparkles className="w-3 h-3" /> RECOMENDADO
        </div>
      )}
      
      <div className="flex justify-between items-start w-full mb-6 relative">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{plan.name || (plan.storage)}</h3>
          <p className="text-sm text-gray-500 mt-1">{plan.storageText || (isTopRow ? plan.storage : '')}</p>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-[2.5rem] font-bold tracking-tight text-gray-900">R${currentPrice}</span>
        <span className="text-gray-500 font-medium">/mês</span>
      </div>
      <p className="text-sm text-gray-500 mb-8 font-medium">{isAnnualPlan ? 'faturado anualmente' : 'faturado mensalmente'}</p>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature: string, idx: number) => (
          feature.trim() && (
            <li key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#D05634] shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          )
        ))}
      </ul>

      <button className={`w-full py-4 rounded-full font-bold transition-all transform active:scale-[0.98] ${
        plan.recommended || plan.isRecommended
          ? 'bg-[#D05634] text-white hover:bg-[#b84a2b] shadow-md' 
          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}>
        {plan.ctaText || 'Escolher Plano'}
      </button>
    </div>
  );
}

function PricingView({ plans, isAdmin, onEditPlan, onAddPlan, onDeletePlan }: { 
  plans: Plan[], 
  isAdmin: boolean, 
  onEditPlan: (p: Plan) => void,
  onAddPlan: (category: 'top' | 'bottom') => void,
  onDeletePlan: (id: string) => void
}) {
  const [isAnnualPlan, setIsAnnualPlan] = useState(true);
  const topPlans = plans.filter(p => p.category === 'top').sort((a, b) => a.displayOrder - b.displayOrder);
  const bottomPlans = plans.filter(p => p.category === 'bottom').sort((a, b) => a.displayOrder - b.displayOrder);

  // Fallback if no plans in DB yet
  const displayTop = topPlans.length > 0 ? topPlans : pricingPlansTop.map((p, i) => ({ ...p, category: 'top', displayOrder: i }));
  const displayBottom = bottomPlans.length > 0 ? bottomPlans : pricingPlansBottom.map((p, i) => ({ ...p, category: 'bottom', displayOrder: i }));

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Planos de Armazenamento
          {isAdmin && <span className="text-[10px] bg-[#FFF0EB] text-[#D05634] px-2 py-0.5 rounded uppercase">Admin</span>}
        </h2>
        {isAdmin && (
          <div className="flex gap-3">
            <button 
              onClick={() => onAddPlan('top')}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Plano Topo
            </button>
            <button 
              onClick={() => onAddPlan('bottom')}
              className="bg-[#D05634] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b84a2b] transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Plano Principal
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <span className={`text-sm font-semibold transition-colors ${!isAnnualPlan ? 'text-gray-900' : 'text-gray-400'}`}>
          Mensal
        </span>
        <button 
          onClick={() => setIsAnnualPlan(!isAnnualPlan)}
          className="w-14 h-8 bg-[#D05634] rounded-full p-1 cursor-pointer transition-colors flex items-center relative"
        >
          <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${isAnnualPlan ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold transition-colors ${isAnnualPlan ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
            Anual
          </span>
          <span className="bg-[#FFF0EB] text-[#D05634] text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
            Economize 20%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTop.map((plan: any, i) => (
          <PricingCard 
            key={plan.id || `top-${i}`} 
            plan={plan} 
            isTopRow={true} 
            isAdmin={isAdmin} 
            onEdit={() => onEditPlan(plan)} 
            onDelete={() => plan.id && onDeletePlan(plan.id)}
            isAnnualPlan={isAnnualPlan}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBottom.map((plan: any, i) => (
          <PricingCard 
            key={plan.id || `bottom-${i}`} 
            plan={plan} 
            isAdmin={isAdmin} 
            onEdit={() => onEditPlan(plan)} 
            onDelete={() => plan.id && onDeletePlan(plan.id)}
            isAnnualPlan={isAnnualPlan}
          />
        ))}
      </div>
    </div>
  );
}

const initialCollections: any[] = [];

function CollectionsView({ 
  setActiveTab, 
  collections, 
  setCollections, 
  setCurrentCollectionId,
  user,
  userProfile,
  storageInfo
}: { 
  setActiveTab: (t: string) => void,
  collections: any[],
  setCollections: any,
  setCurrentCollectionId: any,
  user: User | null,
  userProfile?: any,
  storageInfo?: StorageInfo
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [folderCoverModalOpen, setFolderCoverModalOpen] = useState(false);
  const [selectedFolderForCover, setSelectedFolderForCover] = useState<any>(null);
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newGalleryDesc, setNewGalleryDesc] = useState('');
  const [newGalleryDate, setNewGalleryDate] = useState('2026-05-01');

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'loose' | 'dense'>('loose');
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<any>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const executeDelete = async (id: string | number) => {
    const idStr = id.toString();
    console.log("[Wipe] Iniciando exclusão de:", idStr);
    
    // Encontrar o item no estado atual mais recente
    const item = collections.find(c => c.id.toString() === idStr);
    if (!item) {
      console.warn("[Wipe] Item não encontrado no estado local:", idStr);
      return;
    }
    
    const previousCollections = [...collections];

    // Função recursiva robusta para pegar todos os descendentes
    const getDescendants = (targetParentId: string, state: any[]): string[] => {
      if (!targetParentId) return [];
      const children = state.filter(c => c.parentId?.toString() === targetParentId);
      let ids = children.map(c => c.id.toString());
      children.forEach(child => {
        if (child.type === 'folder') {
          ids = [...ids, ...getDescendants(child.id.toString(), state)];
        }
      });
      return ids;
    };

    const idsToDelete = [idStr];
    if (item.type === 'folder') {
      const descendants = getDescendants(idStr, collections);
      idsToDelete.push(...descendants);
      console.log(`[Wipe] Folder ${idStr} has ${descendants.length} descendants.`);
    }

    // Se estivermos dentro da pasta que vai ser deletada (ou um de seus descendentes), voltamos para o root
    if (currentFolderId?.toString() === idStr || idsToDelete.includes(currentFolderId?.toString() || '')) {
      console.log("[Wipe] Reseting currentFolderId to null because the current folder (or its parent) is being deleted.");
      setCurrentFolderId(null);
    }

    // 2. Atualização Otimista da Interface
    setCollections((prev: any[] | null) => {
      if (!prev) return prev;
      
      const getDescendantsInternal = (targetParentId: string, state: any[]): string[] => {
        if (!targetParentId) return [];
        const children = state.filter(c => c.parentId?.toString() === targetParentId);
        let nestedIds = children.map(c => c.id.toString());
        children.forEach(child => {
          if (child.type === 'folder') {
            nestedIds = [...nestedIds, ...getDescendantsInternal(child.id.toString(), state)];
          }
        });
        return nestedIds;
      };

      const finalIdsToDelete = [idStr];
      if (item.type === 'folder') {
        finalIdsToDelete.push(...getDescendantsInternal(idStr, prev));
      }

      console.log("[Wipe] Removendo", finalIdsToDelete.length, "itens do estado local.");
      (window as any)._lastWipeIds = finalIdsToDelete;

      return prev.filter((c: any) => !finalIdsToDelete.includes(c.id.toString()));
    });

    if (user) {
      try {
        const res = await fetch('/api/collections/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: idStr })
        });
        if (!res.ok) {
          throw new Error("HTTP error deleting from server");
        }
        console.log("[Wipe] Servidor sincronizado e fotos excluídas do Cloudflare R2.");
      } catch (err: any) {
        console.error("[Wipe] Erro crítico ao deletar galeria:", err);
        setCollections(previousCollections);
        alert("Erro ao excluir do servidor. Revertendo alterações.");
      }
    }
  };

  const handleCreate = async () => {
    if (!newGalleryName.trim()) return;
    if ((window as any).isFirestoreQuotaExceeded || sessionStorage.getItem('firestore_quota_exceeded') === 'true') {
      alert("Limite de cota do Firebase atingido. Não é possível criar novas coleções agora.");
      return;
    }
    const slug = newGalleryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCollection = {
      title: newGalleryName,
      date: newGalleryDate.split('-').reverse().join('/') || '01/05/2026',
      status: 'Rascunho',
      image: null,
      media: [],
      type: 'collection',
      slug,
      parentId: currentFolderId,
      ownerId: user?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (user) {
      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCollection)
        });
        if (response.ok) {
          const savedDoc = await response.json();
          setCollections((prev: any) => [savedDoc, ...prev]);
          setCurrentCollectionId(savedDoc.id);
          setActiveTab('editor');
        } else {
          throw new Error("HTTP error creating collection");
        }
      } catch (err) {
        console.error("Error creating collection:", err);
        alert("Erro ao salvar nova coleção no servidor.");
      }
    } else {
      const collWithId = { ...newCollection, id: `guest_${Date.now()}` };
      setCollections((prev: any) => [collWithId, ...prev]);
      setCurrentCollectionId(collWithId.id);
      setActiveTab('editor');
    }
    
    setIsModalOpen(false);
    setNewGalleryName('');
    setNewGalleryDesc('');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const slug = newFolderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newFolder = {
      title: newFolderName,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Pública',
      tags: ["Pasta"],
      image: null,
      type: 'folder',
      slug,
      parentId: currentFolderId,
      ownerId: user?.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (user) {
      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFolder)
        });
        if (response.ok) {
          const savedDoc = await response.json();
          setCollections((prev: any) => [savedDoc, ...prev]);
        } else {
          throw new Error("HTTP error creating folder");
        }
      } catch (err) {
        console.error("Error creating folder:", err);
        alert("Erro ao criar nova pasta no servidor.");
      }
    } else {
      setCollections((prev: any) => [{ ...newFolder, id: Date.now() }, ...prev]);
    }

    setIsFolderModalOpen(false);
    setNewFolderName('');
  };

  const handleMoveToRoot = async (e: React.MouseEvent, itemId: string | number) => {
    e.stopPropagation();
    e.preventDefault();
    
    const idStr = itemId.toString();
    const item = collections.find(c => c.id.toString() === idStr);
    if (!item) return;

    // Atualização Otimista
    setCollections((prev: any[]) => prev.map(c => 
      c.id.toString() === idStr ? { ...c, parentId: null } : c
    ));

    if (user) {
      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...item,
            id: idStr,
            parentId: null
          })
        });
        if (!response.ok) {
          throw new Error("HTTP error moving folder to root");
        }
      } catch (err) {
        console.error("[MoveToRoot] Error:", err);
        // Reverte em caso de erro
        setCollections((prev: any[]) => prev.map(c => 
          c.id.toString() === idStr ? { ...c, parentId: item.parentId } : c
        ));
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('itemId', item.id.toString());
  };

  const handleDragOver = (e: React.DragEvent, targetFolder: any) => {
    e.preventDefault();
    setDragOverFolderId(targetFolder.id);
  };

  const handleDragLeave = (e: React.DragEvent, targetFolder: any) => {
    e.preventDefault();
    setDragOverFolderId(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolder: any) => {
    e.preventDefault();
    setDragOverFolderId(null);
    const itemIdString = e.dataTransfer.getData('itemId');
    if (!itemIdString) return;
    const itemId = itemIdString;
    if (itemId === targetFolder.id) return; 

    setCollections((prev: any) => {
      if (!prev) return prev;
      return prev.map((c: any) => c.id.toString() === itemId.toString() ? { ...c, parentId: targetFolder.id } : c);
    });
  };

  const visibleCollections = (collections || []).filter(c => {
    const itemParentId = c.parentId?.toString() || null;
    const folderId = currentFolderId?.toString() || null;
    return itemParentId === folderId;
  });

  const computedStorage = storageInfo || calculateUserStorage(collections, userProfile);
  const isExpired = isTrialExpired(userProfile);
  const trialDaysRemaining = getTrialDaysRemaining(userProfile);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {userProfile && !isUserAdmin(user, userProfile) && (
        <div className="mb-6">
          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4 text-red-800 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 text-sm text-left">
                <p className="font-bold text-base mb-0.5 text-red-800">Seu período de teste gratuito expirou!</p>
                <p className="text-red-700">Seu plano foi travado e novos uploads de fotos não são permitidos. Ative um plano de assinatura para continuar entregando galerias impecáveis para seus clientes.</p>
              </div>
              <button 
                onClick={() => setActiveTab('planos')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Ver Planos
              </button>
            </div>
          ) : trialDaysRemaining <= 3 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4 text-yellow-800 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                <Clock className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex-1 text-sm text-left">
                <p className="font-bold text-base mb-0.5 text-yellow-800">Período de teste quase expirando!</p>
                <p className="text-yellow-700">Restam apenas {trialDaysRemaining} {trialDaysRemaining === 1 ? 'dia útil' : 'dias úteis'} de teste gratuito. Para evitar o travamento dos uploads e de suas coleções, ative um plano antes do vencimento.</p>
              </div>
              <button 
                onClick={() => setActiveTab('planos')}
                className="bg-[#D05634] hover:bg-[#b84a2b] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Ativar Plano
              </button>
            </div>
          ) : (
            <div className="bg-[#FFF0EB] border border-[#D05634]/10 rounded-2xl p-5 flex items-center gap-4 text-[#D05634] animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#D05634] shrink-0 border border-[#D05634]/10">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 text-sm text-left">
                <p className="font-bold text-base mb-0.5 text-[#D05634]">Você está no período de teste gratuito!</p>
                <p className="text-[#D05634]/80">Seu plano inicial é o {userProfile.planName || 'Basic (3 GB)'} com {userProfile.trialDays || 7} dias grátis. Aproveite e explore todas as funcionalidades. Restam {trialDaysRemaining} dias.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Storage Bar */}
      <div className="border border-gray-200 rounded-2xl p-6 mb-12 bg-white shadow-sm">
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${computedStorage.isOverLimit ? 'bg-red-500' : 'bg-[#D05634]'} animate-pulse`}></div>
            <span className="font-bold text-gray-700">Uso de Armazenamento</span>
            {userProfile?.planName && (
              <span className="text-[11px] bg-[#FFF0EB] text-[#D05634] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Plano {userProfile.planName}
              </span>
            )}
          </div>
          <span className={`font-bold ${computedStorage.isOverLimit ? 'text-red-500' : 'text-gray-600'}`}>
            {computedStorage.formattedUsed} de {computedStorage.formattedLimit} usado ({computedStorage.formattedPercent})
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              computedStorage.isOverLimit 
                ? 'bg-red-500' 
                : 'bg-gradient-to-r from-[#D05634] to-[#f4744d] shadow-[0_0_10px_rgba(208,86,52,0.3)]'
            }`} 
            style={{ width: `${Math.min(100, computedStorage.percent)}%` }}
          ></div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[2rem] font-medium text-gray-900 mb-2">
            {currentFolderId 
              ? collections.find(c => c.id === currentFolderId)?.title 
              : 'Suas Coleções'}
          </h2>
          <div className="flex items-center text-sm text-gray-500 gap-1.5">
            <button onClick={() => setCurrentFolderId(null)} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <Home className="w-4 h-4" />
              <span>Início</span>
            </button>
            {currentFolderId && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{collections.find(c => c.id === currentFolderId)?.title}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 rounded-xl p-1 gap-1 border border-gray-100 shadow-inner">
            <button 
              onClick={() => setViewMode('loose')}
              className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'loose' ? 'bg-white shadow-sm text-[#D05634]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('dense')}
              className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'dense' ? 'bg-white shadow-sm text-[#D05634]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsFolderModalOpen(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-50"
          >
            <FolderPlus className="w-4 h-4" />
            Pasta
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#D05634] text-white px-5 py-2 rounded-full font-medium hover:bg-[#b84a2b]"
          >
            <Plus className="w-4 h-4" />
            Coleção
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid transition-all duration-500 ${
        viewMode === 'dense' 
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      }`}>
        {visibleCollections.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <div className="mb-6">
              <img 
                src="https://cdn.plus.framepro.click/uploads/m30bw01epp9ab69/1778538219920-favicon%20fplus.webp" 
                alt="Favicon" 
                className="w-[90px] h-[90px] object-contain grayscale opacity-25 animate-in fade-in zoom-in-95"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentFolderId ? 'Esta pasta está vazia' : 'Você ainda não tem coleções'}
            </h3>
            <p className="text-gray-500 max-w-xs mb-8">
              {currentFolderId 
                ? 'Mova coleções para cá ou crie uma nova aqui dentro.' 
                : 'Comece criando sua primeira galeria de fotos para compartilhar com seus clientes.'}
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#D05634] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b84a2b] transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Criar Coleção
            </button>
          </div>
        ) : (
          visibleCollections.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col group cursor-pointer relative animate-in fade-in slide-in-from-bottom-4 duration-500" 
              draggable={item.type === 'collection'}
              onDragStart={item.type === 'collection' ? (e) => handleDragStart(e, item) : undefined}
              onDragOver={item.type === 'folder' ? (e) => handleDragOver(e, item) : undefined}
              onDragLeave={item.type === 'folder' ? (e) => handleDragLeave(e, item) : undefined}
              onDrop={item.type === 'folder' ? (e) => handleDrop(e, item) : undefined}
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentFolderId(item.id);
                } else {
                  setCurrentCollectionId(item.id);
                  setActiveTab('editor');
                }
              }}
            >
              {item.type === 'folder' ? (
                <div className={`border-2 rounded-[2rem] bg-white flex flex-col relative shadow-sm hover:shadow-xl transition-all duration-300 ${viewMode === 'dense' ? 'h-[240px]' : 'h-[320px]'} ${dragOverFolderId === item.id ? 'border-[#D05634] ring-4 ring-[#D05634]/10 scale-105' : 'border-gray-50 hover:border-gray-100'}`}>
                  <div className={`${viewMode === 'dense' ? 'h-[100px]' : 'h-[160px]'} bg-gray-50 relative w-full overflow-hidden rounded-t-[1.85rem]`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none" 
                        style={{ objectPosition: `${item?.coverPositionX ?? 50}% ${item?.coverPositionY ?? 50}%` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center pointer-events-none">
                        <Folder className={viewMode === 'dense' ? "w-8 h-8 text-orange-200" : "w-14 h-14 text-orange-200"} />
                      </div>
                    )}
                  </div>
                  <div className={`${viewMode === 'dense' ? 'p-3' : 'p-6'} flex-1 flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className={`font-bold ${viewMode === 'dense' ? 'text-xs' : 'text-lg'} text-gray-900 group-hover:text-[#D05634] transition-colors line-clamp-1 pr-4`}>{item.title}</h3>
                         <div className="relative" onClick={(e) => e.stopPropagation()}>
                           <button 
                             onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                             className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                           >
                             <MoreVertical className="w-5 h-5" />
                           </button>
                           {openMenuId === item.id && (
                              <div className="absolute top-8 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[70]">
                                 <button onClick={() => { setSelectedFolderForCover(item); setFolderCoverModalOpen(true); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                    <ImageIcon className="w-4 h-4"/> Capa da Pasta
                                 </button>
                                 <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                    <Link className="w-4 h-4"/> Link Público
                                  </button>
                                 {item.parentId && (
                                    <button 
                                       onClick={(e) => { handleMoveToRoot(e, item.id); setOpenMenuId(null); }} 
                                       className="w-full flex items-center gap-3 px-4 py-2 hover:bg-orange-50 text-sm text-[#D05634]"
                                    >
                                       <FolderUp className="w-4 h-4"/> Mover para Início
                                    </button>
                                 )}
                                 <button 
                                    onClick={() => { setItemToDelete(item); setOpenMenuId(null); }} 
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm text-red-500"
                                 >
                                    <Trash className="w-4 h-4"/> Excluir Pasta
                                 </button>
                              </div>
                           )}
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="bg-[#FFF0EB] text-[#D05634] px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">Pasta</span>
                        {item.status === "Pública" && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">Ativa</span>}
                      </div>
                      {viewMode !== 'dense' && (
                        <div className="text-[11px] text-gray-400 truncate font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/50">
                          {window.location.host}/?gallery={item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`flex flex-col ${viewMode === 'dense' ? 'gap-2' : 'gap-4'}`}>
                  <div className={`aspect-[3/4] rounded-[2rem] bg-white border-2 overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500 cursor-pointer border-gray-50 group-hover:border-white group-hover:-translate-y-1`}>
                    {/* Overlaid Association Seals on Gallery Card */}
                    {item.associationSeals && item.associationSeals.length > 0 && (
                      <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 max-w-[70%] pointer-events-none">
                        {item.associationSeals.map((seal: any, idx: number) => {
                          const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                          return (
                            <div 
                              key={seal.id || idx}
                              className={`px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1 shadow-md ${
                                viewMode === 'dense' ? 'text-[8px]' : 'text-[9px]'
                              }`}
                            >
                              {resolvedLogo ? (
                                <img src={resolvedLogo} alt={seal.name} className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                              ) : (
                                <Award className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              )}
                              <span className="font-bold truncate max-w-[80px]">{seal.name}</span>
                              {seal.badgeText && viewMode !== 'dense' && (
                                <span className="text-[7.5px] uppercase tracking-wider text-[#FF9E80] font-extrabold truncate max-w-[50px]">
                                  · {seal.badgeText}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 duration-300">
                      {item.parentId && (
                        <button 
                          onClick={(e) => handleMoveToRoot(e, item.id)}
                          className="p-2 bg-white/90 backdrop-blur-md hover:bg-orange-50 text-gray-700 hover:text-[#D05634] rounded-full shadow-lg transition-all hover:scale-110"
                          title="Mover de Volta para o Início (Raiz)"
                        >
                          <FolderUp className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentCollectionId(item.id); setActiveTab('editor'); }}
                        className="p-2 bg-white/90 backdrop-blur-md hover:bg-[#FFF0EB] text-gray-700 hover:text-[#D05634] rounded-full shadow-lg transition-all hover:scale-110"
                        title="Editar Coleção"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToDelete(item); }}
                        className="p-2 bg-white/90 backdrop-blur-md hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-full shadow-lg transition-all hover:scale-110"
                        title="Excluir Coleção"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none" 
                        style={{ objectPosition: `${item?.coverPositionX ?? 50}% ${item?.coverPositionY ?? 50}%` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 pointer-events-none">
                        <ImageIcon className={viewMode === 'dense' ? "w-8 h-8 text-gray-200" : "w-14 h-14 text-gray-200"} />
                      </div>
                    )}
                    <div className={`absolute ${viewMode === 'dense' ? 'bottom-2 left-2 right-2' : 'bottom-4 left-4 right-4'} z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}>
                      <a 
                        href={`${window.location.origin}${window.location.pathname}?gallery=${item.slug || item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white/90 backdrop-blur-md ${viewMode === 'dense' ? 'px-2 py-1' : 'px-4 py-2'} rounded-xl flex items-center justify-between shadow-lg hover:bg-white transition-colors cursor-pointer`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className={`${viewMode === 'dense' ? 'text-[8px]' : 'text-[10px]'} font-bold text-gray-900 uppercase text-center flex-1`}>Ver Galeria</span>
                        <ExternalLink className={`${viewMode === 'dense' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#D05634] ml-1`} />
                      </a>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className={`font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#D05634] transition-colors ${viewMode === 'dense' ? 'text-sm' : 'text-lg'}`}>{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-gray-400 font-medium text-[10px]">Publicado:</span>
                        <span className={`text-gray-500 font-medium leading-none ${viewMode === 'dense' ? 'text-[10px]' : 'text-xs'}`}>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${viewMode === 'dense' ? 'text-[8px]' : 'text-[10px]'} ${item.status === 'Rascunho' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          <span className={`rounded-full ${viewMode === 'dense' ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${item.status === 'Rascunho' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          {item.status}
                        </span>
                        {(item.storeEnabled || (item.tags && item.tags.includes("Loja"))) && (
                          <span className={`bg-[#22C55E] text-white rounded-full font-bold uppercase tracking-wide ${viewMode === 'dense' ? 'px-1.5 py-0.5 text-[8px]' : 'px-2.5 py-1 text-[9px]'}`}>Loja</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-bold text-gray-900">Nova Galeria</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 pt-2">
              <p className="text-sm text-gray-500 mb-6">
                Preencha os detalhes básicos da sua nova galeria. Você poderá alterar tudo depois.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Galeria <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newGalleryName}
                    onChange={(e) => setNewGalleryName(e.target.value)}
                    placeholder="Ex: Casamento da Maria e João" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (Opcional)
                  </label>
                  <textarea 
                    value={newGalleryDesc}
                    onChange={(e) => setNewGalleryDesc(e.target.value)}
                    placeholder="Uma breve descrição da galeria..." 
                    rows={3} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634] resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Publicação (Opcional)
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newGalleryDate}
                      onChange={(e) => setNewGalleryDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors bg-white">
                Cancelar
              </button>
              <button 
                onClick={handleCreate}
                disabled={!newGalleryName.trim()}
                className="px-6 py-2.5 bg-[#D05634] text-white rounded-full font-medium hover:bg-[#b84a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Galeria
              </button>
            </div>
          </div>
        </div>
      )}

      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-bold text-gray-900">Nova Pasta</h2>
              <button 
                onClick={() => setIsFolderModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 pt-2">
              <p className="text-sm text-gray-500 mb-6">
                Crie uma pasta para organizar suas galerias.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Pasta <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ex: Casamentos 2026" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setIsFolderModalOpen(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors bg-white">
                Cancelar
              </button>
              <button 
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-6 py-2.5 bg-[#D05634] text-white rounded-full font-medium hover:bg-[#b84a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Pasta
              </button>
            </div>
          </div>
        </div>
      )}

      {folderCoverModalOpen && selectedFolderForCover && (
        <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFolderCoverModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Selecionar Capa: {selectedFolderForCover.title}</h2>
              <button onClick={() => setFolderCoverModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const availableFolderImages = collections
                  .filter(c => c.parentId === selectedFolderForCover.id && c.type === 'collection')
                  .flatMap(c => c.media || []);
                
                if (availableFolderImages.length === 0) {
                   return <div className="py-12 text-center text-gray-400">Não há fotos nas galerias desta pasta.</div>;
                }

                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {availableFolderImages.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCollections((prev: any[]) => prev.map(c => 
                            c.id === selectedFolderForCover.id ? { ...c, image: url } : c
                          ));
                          if (user) {
                            fetch('/api/collections', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...selectedFolderForCover,
                                image: url,
                                id: selectedFolderForCover.id.toString()
                              })
                            }).catch(err => console.error(err));
                          }
                          setFolderCoverModalOpen(false);
                          setSelectedFolderForCover(null);
                        }}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-4 hover:ring-[#D05634]/50 transition-all border border-gray-100"
                      >
                        <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8 text-center text-gray-900">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {itemToDelete.type === 'folder' 
                  ? "Gostaria mesmo de deletar essa pasta?" 
                  : "Gostaria mesmo de deletar essa coleçao?"}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {itemToDelete.type === 'folder'
                  ? `A pasta "${itemToDelete.title}" e tudo o que estiver dentro dela será removido permanentemente.`
                  : `A coleção "${itemToDelete.title}" e todas as suas fotos serão removidas permanentemente.`}
              </p>
            </div>
            <div className="p-6 bg-gray-50 flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all text-lg"
              >
                Não
              </button>
              <button 
                onClick={() => {
                  executeDelete(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="flex-1 bg-red-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-lg"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditorView({ 
  setActiveTab, 
  collection,
  onUpdateCollection,
  userProfile,
  storageInfo
}: { 
  key?: React.Key;
  setActiveTab: (t: string) => void;
  collection: any;
  onUpdateCollection: (id: number | string, updates: any) => void;
  userProfile?: any;
  storageInfo?: StorageInfo;
}) {
  const getThemeVars = (themeId?: string) => {
    const theme = themeId || collection?.theme || 'light';
    switch (theme) {
      case 'gold': return { bg: '#FCF8F2', text: '#242424', primary: '#C5A059', isDark: false };
      case 'rose': return { bg: '#FFF5F5', text: '#4A3131', primary: '#B06D6D', isDark: false };
      case 'terracotta': return { bg: '#FFF2EE', text: '#3E2723', primary: '#D05634', isDark: false };
      case 'sand': return { bg: '#F8F5F0', text: '#4A4A4A', primary: '#C2B280', isDark: false };
      case 'olive': return { bg: '#F2F4F0', text: '#2F3E2F', primary: '#708238', isDark: false };
      case 'agave': return { bg: '#F0F4F4', text: '#2C3E50', primary: '#82A3A1', isDark: false };
      case 'sea': return { bg: '#F0F4F8', text: '#1E3A5F', primary: '#4682B4', isDark: false };
      case 'dark': return { bg: '#121212', text: '#FFFFFF', primary: '#FFFFFF', isDark: true };
      case 'light':
      default: return { bg: '#FFFFFF', text: '#111827', primary: '#111827', isDark: false };
    }
  };

  const previewTheme = getThemeVars();
  const [media, setMedia] = useState<string[]>(collection?.media || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [draggedMediaIndex, setDraggedMediaIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastUpdateRef = useRef<string>(JSON.stringify(collection?.media || []));
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('Ordem Manual');
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [selectedClientDetails, setSelectedClientDetails] = useState<any | null>(null);
  const [showAuditDashboard, setShowAuditDashboard] = useState(false);
  const [isR2Configured, setIsR2Configured] = useState<boolean | null>(null);

  // Association Seals State for Gallery Cover
  const [sealNameInput, setSealNameInput] = useState('');
  const [sealBadgeTextInput, setSealBadgeTextInput] = useState('');
  const [isUploadingSeal, setIsUploadingSeal] = useState(false);
  const sealFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if Cloudflare R2 is configured and update state
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsR2Configured(!!data.r2Configured);
      })
      .catch((err) => {
        console.error('Erro ao verificar status do R2:', err);
        setIsR2Configured(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (type: string) => {
    setCurrentSort(type);
    setIsSortMenuOpen(false);
    
    setMedia(prev => {
      const sorted = [...prev];
      if (type === 'Hora: Novo → Antigo' || type === 'Hora: Antigo → Novo') {
        sorted.reverse();
      } else if (type === 'Nome: A-Z') {
        sorted.sort((a, b) => a.localeCompare(b));
      } else if (type === 'Nome: Z-A') {
        sorted.sort((a, b) => b.localeCompare(a));
      }
      return sorted;
    });
  };

  useEffect(() => {
    if (collection?.media && !isUploading) {
      const mediaStr = JSON.stringify(collection.media);
      if (mediaStr !== lastUpdateRef.current) {
        setMedia(collection.media);
        lastUpdateRef.current = mediaStr;
      }
    }
  }, [collection?.media, isUploading]);

  const [selectedMediaIndices, setSelectedMediaIndices] = useState<number[]>([]);
  const [editorTab, setEditorTab] = useState<'midia' | 'design' | 'layout' | 'loja' | 'aparencia' | 'privacidade' | 'download' | 'album'>('midia');
  const [editorZoom, setEditorZoom] = useState(100);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editorLightboxIndex, setEditorLightboxIndex] = useState<number | null>(null);
  const [showPhotobook, setShowPhotobook] = useState(false);
  const [photobookImages, setPhotobookImages] = useState<string[]>([]);

  useEffect(() => {
    if (collection && !isUploading) {
      const mediaStr = JSON.stringify(media);
      if (mediaStr !== lastUpdateRef.current) {
        onUpdateCollection(collection.id, { media });
        lastUpdateRef.current = mediaStr;
      }
    }
  }, [media, isUploading]);

  const toggleMediaSelection = (index: number) => {
    setSelectedMediaIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  const handleMediaDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedMediaIndex(index);
  };

  const handleMediaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleMediaDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedMediaIndex === null || draggedMediaIndex === targetIndex) return;

    setCurrentSort('Ordem Manual');
    setMedia(prev => {
      const newMedia = [...prev];
      const [draggedItem] = newMedia.splice(draggedMediaIndex, 1);
      newMedia.splice(targetIndex, 0, draggedItem);
      return newMedia;
    });
    setDraggedMediaIndex(null);
  };

  const handleMediaDragEnd = () => {
    setDraggedMediaIndex(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isR2Configured === false) {
        alert(
          "⚠️ O Cloudflare R2 não está configurado!\n\nPor favor, configure suas credenciais de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) no painel de Configurações/Secrets do Google AI Studio para ativar uploads de arquivos grandes.\n\nConsulte o guia passo a passo em laranja exibido na parte superior da tela."
        );
        return;
      }
      
      if (userProfile && isTrialExpired(userProfile)) {
        alert("⚠️ Seu período de teste gratuito expirou! Seu plano foi travado e novos uploads não são permitidos. Ative um plano pago para liberar espaço e novos uploads.");
        return;
      }
      
      const files = Array.from(e.target.files);
      setUploadQueue(files);
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentFileIndex(0);
      setShowToast(false);
      
      const currentSizes: Record<string, number> = { ...(collection?.mediaSizes || {}) };
      const currentMeta: any[] = Array.isArray(collection?.mediaMetadata) ? [...collection.mediaMetadata] : [];
      const newUrls: string[] = [];
      let totalBytesAdded = 0;
      const totalFiles = files.length;
      
      for (let i = 0; i < totalFiles; i++) {
        setCurrentFileIndex(i);
        setUploadProgress(10);
        const rawFile = files[i] as File;
        const file = await convertToWebP(rawFile, { quality: 0.92 });

        // Check remaining quota
        if (storageInfo && (storageInfo.totalBytes + totalBytesAdded + file.size) > (storageInfo.limitMB * 1024 * 1024)) {
          alert(`Limite de armazenamento (${storageInfo.formattedLimit}) atingido! O arquivo "${file.name}" ultrapassa sua cota disponível. Faça upgrade do seu plano para liberar mais espaço.`);
          break;
        }
        
        let r2Url = '';
        let fileSize = file.size;
        try {
          const formData = new FormData();
          formData.append('file', file);
          setUploadProgress(40);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          setUploadProgress(85);
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Erro ao enviar ${file.name}`);
          }
          const data = await response.json();
          r2Url = data.url;
          if (typeof data.size === 'number' && data.size > 0) {
            fileSize = data.size;
          }
        } catch (uploadErr: any) {
          console.error(`Erro no R2 upload de ${file.name}:`, uploadErr);
          alert(`Erro ao fazer upload de ${file.name}: ${uploadErr?.message || 'Erro de conexão'}`);
        }
        
        setUploadProgress(100);
        if (r2Url) {
          newUrls.push(r2Url);
          currentSizes[r2Url] = fileSize;
          currentMeta.push({
            url: r2Url,
            size: fileSize,
            name: file.name,
            type: file.type,
            uploadedAt: new Date().toISOString()
          });
          totalBytesAdded += fileSize;
        }
        
        // Allow UI to update
        await new Promise(r => setTimeout(r, 40));
      }

      if (newUrls.length > 0) {
        const updatedMedia = [...media, ...newUrls];
        setMedia(updatedMedia);
        const newTotalBytes = updatedMedia.reduce((sum, u) => sum + (currentSizes[u] || 3.5 * 1024 * 1024), 0);
        onUpdateCollection(collection.id, {
          media: updatedMedia,
          mediaSizes: currentSizes,
          mediaMetadata: currentMeta,
          totalStorageBytes: newTotalBytes
        });
      }
      
      setIsUploading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadQueue([]);
    setUploadProgress(0);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)] border-t border-gray-200 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="text-sm font-semibold text-gray-900 pr-2">Mídia enviada com sucesso</span>
        </div>
      )}

      {/* Upload Modal Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-white/70 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-[#FFF0EB] text-[#D05634] rounded-lg">
                 <ImageIcon className="w-6 h-6"/>
              </div>
              <div className="flex-1">
                 <h3 className="text-gray-900 font-medium text-base mb-0.5">Enviando Imagens</h3>
                 <p className="text-gray-500 text-xs">Arquivo {currentFileIndex + 1} de {uploadQueue.length}</p>
              </div>
              <div className="font-medium text-2xl text-gray-900">{uploadProgress}%</div>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#D05634] transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="text-center text-xs text-gray-400 mb-8 truncate">
               {uploadQueue[currentFileIndex]?.name || 'arquivo'}
            </div>

            <button onClick={handleCancelUpload} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium">
               <X className="w-4 h-4"/> Cancelar Upload
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        accept="image/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        onClick={(e) => (e.target as HTMLInputElement).value = ''}
      />

      {/* Secondary Topbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow-sm z-10 shrink-0 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('colecoes')}
            className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-800">{collection?.title || 'Galeria'}</span>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${collection?.status === 'Público' || collection?.status === 'Publicado' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-500 bg-gray-50 border-gray-200'}`}>
            <Check className="w-3 h-3" />
            {collection?.status || 'Salvo'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors rounded"
          >
            <Plus className="w-4 h-4" />
            Adicionar Mídia
          </button>
          <a 
            href={`${window.location.origin}${window.location.pathname}?gallery=${collection?.slug || collection?.id || (collection?.title || 'galeria').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              let slug = collection?.slug;
              if (!slug) {
                slug = (collection?.title || 'galeria').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              }
              onUpdateCollection(collection?.id, { status: 'Público', slug });
              if (bc) { bc.postMessage({ type: 'sync', ts: Date.now() }); }
            }}
            className="bg-[#D05634] text-white px-4 py-2 text-sm font-medium hover:bg-[#b84a2b] transition-colors rounded inline-flex items-center"
          >
            Ver Galeria
          </a>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col py-4 shrink-0 shadow-sm z-0 transition-all duration-300 overflow-x-hidden`}>
          <div className="flex flex-col space-y-6">
            <div>
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-auto' : 'justify-between px-6'} mb-4`}>
                {!isSidebarCollapsed && <span className="font-bold text-gray-900 text-lg">Menu</span>}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="text-gray-400 hover:text-gray-600 border border-gray-200 rounded p-1"
                >
                  <PanelLeftClose className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}/>
                </button>
              </div>
            </div>

            <div className={`px-3 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
              {!isSidebarCollapsed && <h4 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Editor</h4>}
              <div className={`space-y-1 ${isSidebarCollapsed ? 'w-full px-1' : ''}`}>
                <button 
                  onClick={() => setEditorTab('midia')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'midia' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Mídia" : undefined}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Mídia</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('design')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'design' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Design da Capa" : undefined}
                >
                  <Grid className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Design da Capa</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('layout')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'layout' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Layout" : undefined}
                >
                  <LayoutTemplate className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Layout</span>}
                </button>
              </div>
            </div>

            <div className={`px-3 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
              {!isSidebarCollapsed && <h4 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Configurações</h4>}
              <div className={`space-y-1 ${isSidebarCollapsed ? 'w-full px-1' : ''}`}>
                <button 
                  onClick={() => setEditorTab('loja')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'loja' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Loja" : undefined}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Loja</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('aparencia')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'aparencia' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Aparência" : undefined}
                >
                  <Palette className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Aparência</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('privacidade')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'privacidade' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Privacidade" : undefined}
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Privacidade</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('download')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'download' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Download" : undefined}
                >
                  <Download className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Download</span>}
                </button>
                <button 
                  onClick={() => setEditorTab('album')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'} font-medium text-sm rounded transition-colors ${editorTab === 'album' ? 'bg-[#D05634] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={isSidebarCollapsed ? "Álbum" : undefined}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Álbum</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        {editorTab === 'midia' ? (
          <div className="flex-1 bg-[#fcfcfc] flex flex-col p-8 min-w-0 overflow-y-auto">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 shrink-0">
              {selectedMediaIndices.length > 0 ? (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedMediaIndices([])}>
                    <div className="w-4 h-4 rounded-full border border-[#D05634] flex items-center justify-center transition-colors bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#D05634]"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{selectedMediaIndices.length} selecionadas</span>
                  </label>
                  
                  {selectedMediaIndices.length === 1 && (
                    <button 
                      onClick={() => {
                        onUpdateCollection(collection.id, { image: media[selectedMediaIndices[0]] });
                        setSelectedMediaIndices([]);
                        setEditorTab('design');
                      }}
                      className="flex items-center gap-2 bg-[#D05634] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b84a2b] transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Usar como Capa
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      const deletedUrls = selectedMediaIndices.map(i => media[i]).filter(Boolean);
                      const newMedia = media.filter((_, i) => !selectedMediaIndices.includes(i));
                      
                      const newMediaSizes = { ...(collection?.mediaSizes || {}) };
                      deletedUrls.forEach(u => delete newMediaSizes[u]);
                      
                      const newMediaMetadata = Array.isArray(collection?.mediaMetadata)
                        ? collection.mediaMetadata.filter((m: any) => !deletedUrls.includes(m?.url))
                        : [];
                      
                      const newTotalBytes = newMedia.reduce((sum, u) => {
                        return sum + (newMediaSizes[u] || 3.5 * 1024 * 1024);
                      }, 0);

                      setMedia(newMedia);
                      setSelectedMediaIndices([]);

                      onUpdateCollection(collection.id, { 
                        media: newMedia,
                        mediaSizes: newMediaSizes,
                        mediaMetadata: newMediaMetadata,
                        totalStorageBytes: newTotalBytes
                      });

                      if (deletedUrls.length > 0) {
                        fetch('/api/delete-files', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ urls: deletedUrls })
                        }).catch(e => console.warn('R2 delete error:', e));
                      }
                    }}
                    className="flex items-center gap-2 bg-[#D05634] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b84a2b] transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedMediaIndices(media.map((_, i) => i))}>
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-[#D05634] flex items-center justify-center transition-colors"></div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Selecionar tudo</span>
                </label>
              )}
              
              <div className="flex items-center gap-6">
                <div className="relative" ref={sortMenuRef}>
                  <div 
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className="flex items-center gap-2 text-sm text-[#D05634] bg-[#FFF0EB] border border-transparent hover:border-[#D05634]/30 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors"
                  >
                    <ArrowDownUp className="w-4 h-4" />
                    <span>{currentSort}</span>
                    <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                  </div>

                  {isSortMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2 mb-2 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Ordenar Arquivos
                      </div>
                      {['Hora: Novo → Antigo', 'Hora: Antigo → Novo', 'Nome: A-Z', 'Nome: Z-A'].map(option => (
                        <button 
                          key={option}
                          onClick={() => handleSort(option)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#FFF0EB] transition-colors ${currentSort === option ? 'text-[#D05634] bg-[#FFF0EB]/30 font-bold' : 'text-gray-700'}`}
                        >
                          {option}
                          {currentSort === option && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEditorZoom(prev => Math.max(50, prev - 10))}
                    className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full border border-transparent focus:outline-none"
                  >
                    <ZoomOut className="w-3.5 h-3.5"/>
                  </button>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={editorZoom} 
                    onChange={e => setEditorZoom(Number(e.target.value))}
                    className="w-24 accent-[#D05634] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  />
                  <button 
                    onClick={() => setEditorZoom(prev => Math.min(150, prev + 10))}
                    className="text-gray-900 hover:text-black bg-gray-100 p-1 rounded-full border border-transparent focus:outline-none"
                  >
                    <ZoomIn className="w-3.5 h-3.5"/>
                  </button>
                  <span className="text-sm text-gray-500 font-medium w-10 text-right">{editorZoom}%</span>
                </div>
                
                <span className="text-xs text-gray-400 whitespace-nowrap">Máx. 100MB/arquivo</span>
              </div>
            </div>

            {/* Editor Content Area */}
            {isR2Configured === false && (
              <div id="cloudflare-r2-setup-guide" className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm max-w-4xl mx-auto w-full shadow-sm">
                <div className="flex gap-3">
                  <div className="p-1 px-2.5 rounded-full bg-orange-100 text-orange-850 font-bold self-start mt-0.5">⚠️</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-1">Sincronização com Cloudflare R2 Pendente</h4>
                    <p className="text-orange-700 leading-relaxed">
                      Sua conta Cloudflare R2 está pronta para ser sincronizada. Para liberar uploads de fotos em alta resolução de até 100MB por arquivo, insira os valores de acesso do seu Cloudflare no painel de <strong>Secrets</strong> (clicando no botão de engrenagem / menu de Secrets no topo direito do Google AI Studio).
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-orange-950 font-medium">
                      <div className="bg-orange-100/50 p-3 rounded-lg border border-orange-200/50">
                        <strong className="block text-orange-900 mb-1">1. Obter R2_ACCOUNT_ID:</strong>
                        No painel da Cloudflare, acesse o menu lateral <strong>R2</strong>. No canto direito inferior, no box <strong>Account Details</strong> (Detalhes da Conta), copie o código de <strong>Account ID</strong> (uma string de 32 caracteres).
                      </div>
                      <div className="bg-orange-100/50 p-3 rounded-lg border border-orange-200/50">
                        <strong className="block text-orange-900 mb-1">2. Gerar Chaves de API:</strong>
                        Abaixo do Account ID, clique no link <strong>Manage R2 API Tokens</strong> (Gerenciar tokens de API da R2). Clique em "Create API Token" com permissão <strong>Object Read &amp; Write</strong> (Editar). Ao salvar, copie os valores:
                        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-orange-900 font-normal">
                          <li><strong>Access Key ID</strong> (coloque no segredo: <code>R2_ACCESS_KEY_ID</code>)</li>
                          <li><strong>Secret Access Key</strong> (coloque no segredo: <code>R2_SECRET_ACCESS_KEY</code>)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {media.length === 0 ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    fileInputRef.current!.files = e.dataTransfer.files;
                    handleFileSelect({ target: { files: e.dataTransfer.files } } as any);
                  }
                }}
                className="flex-1 min-h-[400px] border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center hover:bg-gray-50/50 transition-colors overflow-hidden max-w-4xl mx-auto w-full"
              >
                <div className="w-16 h-16 bg-gray-50 shadow-sm rounded-2xl flex items-center justify-center mb-6 border border-gray-100 pointer-events-none">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 pointer-events-none">Nenhuma mídia ainda</h3>
                <p className="text-gray-500 mb-6 max-w-sm text-center text-sm leading-relaxed pointer-events-none">
                  Arraste imagens ou vídeos para cá ou clique no botão abaixo para fazer upload. (Máx. 100MB por arquivo)
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#D05634] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b84a2b] transition-colors relative z-10"
                >
                  Procurar arquivos
                </button>
              </div>
            ) : (
              <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    fileInputRef.current!.files = e.dataTransfer.files;
                    handleFileSelect({ target: { files: e.dataTransfer.files } } as any);
                  }
                }}
                className="grid gap-[2px] content-start min-h-[400px]"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${200 * (100 / editorZoom)}px, 1fr))` }}
              >
                {media.map((url, i) => (
                  <div 
                    key={url + i} 
                    draggable
                    onDragStart={(e) => handleMediaDragStart(e, i)}
                    onDragOver={handleMediaDragOver}
                    onDrop={(e) => handleMediaDrop(e, i)}
                    onDragEnd={handleMediaDragEnd}
                    onClick={() => toggleMediaSelection(i)}
                    className={`aspect-[4/3] sm:aspect-square border relative group cursor-grab active:cursor-grabbing transition-all duration-200 ${draggedMediaIndex === i ? 'opacity-30 border-dashed border-[#D05634] scale-95' : selectedMediaIndices.includes(i) ? 'border-[#D05634] ring-1 ring-[#D05634]' : 'border-gray-200 hover:border-[#D05634]'} bg-white shadow-sm hover:shadow-md flex items-center justify-center p-1`}
                  >
                    <img src={url} className="max-h-full max-w-full object-contain" />
                    <div className={`absolute top-4 left-4 w-5 h-5 rounded-full border ${selectedMediaIndices.includes(i) ? 'border-[#D05634] bg-[#D05634] text-white' : 'border-gray-300 bg-white/90 opacity-0 group-hover:opacity-100'} transition-opacity flex items-center justify-center shadow-sm`}>
                      {selectedMediaIndices.includes(i) && <Check className="w-3 h-3" strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : editorTab === 'design' || editorTab === 'layout' || editorTab === 'privacidade' || editorTab === 'download' || editorTab === 'aparencia' || editorTab === 'loja' || editorTab === 'album' ? (
          <div className="flex-1 flex overflow-hidden bg-[#fafafa]">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto p-6 space-y-8 shrink-0">
              {editorTab === 'design' ? (

                <>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Ajuste de Posição da Capa</h4>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-24 flex items-center">
                      <input 
                        type="range" 
                        min="0" max="100"
                        value={collection?.coverPositionY ?? 50}
                        onChange={(e) => onUpdateCollection(collection.id, { coverPositionY: Number(e.target.value) })}
                        className="w-24 -rotate-90 appearance-none bg-gray-200 h-1 rounded-lg accent-[#D05634]" 
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium uppercase mt-2">Y: {collection?.coverPositionY ?? 50}%</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-6">
                    <input 
                      type="range" 
                      min="0" max="100"
                      value={collection?.coverPositionX ?? 50}
                      onChange={(e) => onUpdateCollection(collection.id, { coverPositionX: Number(e.target.value) })}
                      className="w-full accent-[#D05634] h-1 bg-gray-200 rounded-lg appearance-none" 
                    />
                    <span className="text-[10px] text-gray-500 font-medium text-center uppercase">X: {collection?.coverPositionX ?? 50}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-6 leading-relaxed">Arraste os controles para ajustar o enquadramento da imagem de capa. As alterações são salvas automaticamente.</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-[#D05634] mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem de Capa
                </h4>
                <div className="aspect-[3/2] rounded-lg bg-gray-100 overflow-hidden mb-4 border border-gray-200">
                  {collection?.image ? (
                    <img 
                      src={collection.image} 
                      className="w-full h-full object-cover" 
                      style={{ objectPosition: `${collection?.coverPositionX ?? 50}% ${collection?.coverPositionY ?? 50}%` }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                      <ImageIcon className="w-6 h-6 opacity-50" />
                      <span className="text-xs">Sem Capa</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditorTab('midia')} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    Trocar
                  </button>
                  <button 
                    onClick={() => onUpdateCollection(collection.id, { image: null })}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    title="Remover Capa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-[#D05634] mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Exibição na Capa
                </h4>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-gray-900">Mostrar Título na Capa</div>
                      <div className="text-xs text-gray-500 mt-0.5">Exibe o título da galeria sobre a imagem de capa</div>
                    </div>
                    <div 
                      onClick={() => onUpdateCollection(collection.id, { showTitleOnCover: !(collection?.showTitleOnCover ?? true) })}
                      className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection?.showTitleOnCover !== false ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection?.showTitleOnCover !== false ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <div className="text-sm font-medium text-gray-900">Mostrar Data do Evento na Capa</div>
                      <div className="text-xs text-gray-500 mt-0.5">Exibe a data do evento sobre a imagem de capa</div>
                    </div>
                    <div 
                      onClick={() => onUpdateCollection(collection.id, { showDateOnCover: !(collection?.showDateOnCover ?? true) })}
                      className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection?.showDateOnCover !== false ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection?.showDateOnCover !== false ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-[#D05634] mb-4 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Layout da Capa
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'centered' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'centered' || !collection?.coverLayout ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center justify-center shadow-sm">
                      <div className="w-4 h-1.5 bg-current rounded-sm"></div>
                    </div>
                    <span className="text-xs font-medium">Centralizado</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'left-aligned' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'left-aligned' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center justify-start px-1.5 shadow-sm">
                      <div className="w-4 h-1.5 bg-current rounded-sm"></div>
                    </div>
                    <span className="text-xs font-medium">Esquerda</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'novela' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'novela' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex flex-col items-center justify-end pb-1 shadow-sm">
                      <div className="w-5 h-1 bg-current rounded-sm"></div>
                    </div>
                    <span className="text-xs font-medium">Novela</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'vintage' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'vintage' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center justify-center shadow-sm">
                      <div className="w-4 h-4 border border-current rounded-full flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-current"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Vintage</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'moldura' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'moldura' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center justify-center p-1 shadow-sm">
                       <div className="w-full h-full border border-current rounded-sm flex items-center justify-center">
                         <div className="w-3 h-0.5 bg-current"></div>
                       </div>
                    </div>
                    <span className="text-xs font-medium">Moldura</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'faixa' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'faixa' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center shadow-sm">
                       <div className="w-full h-2 bg-current/20 flex items-center justify-center">
                         <div className="w-4 h-0.5 bg-current"></div>
                       </div>
                    </div>
                    <span className="text-xs font-medium">Faixa</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'divisor' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'divisor' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex flex-col items-center justify-center gap-1 shadow-sm">
                       <div className="w-4 h-px bg-current"></div>
                       <div className="w-3 h-0.5 bg-current"></div>
                       <div className="w-4 h-px bg-current"></div>
                    </div>
                    <span className="text-xs font-medium">Divisor</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'diario' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'diario' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-end justify-start p-1 shadow-sm">
                       <div className="w-3 h-1 bg-current rounded-sm"></div>
                    </div>
                    <span className="text-xs font-medium">Diário</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'selo' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'selo' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded relative shadow-sm">
                       <div className="absolute top-1 right-1 w-3 h-3 border border-current rounded-sm flex items-center justify-center">
                         <div className="w-1.5 h-0.5 bg-current"></div>
                       </div>
                    </div>
                    <span className="text-xs font-medium">Selo</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { coverLayout: 'contorno' })} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${collection?.coverLayout === 'contorno' ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <div className="w-8 h-6 border-2 border-current rounded flex items-center justify-center shadow-sm">
                       <div className="w-5 h-3 border border-current rounded-sm flex items-center justify-center bg-transparent">
                         <div className="w-3 h-0.5 bg-current"></div>
                       </div>
                    </div>
                    <span className="text-xs font-medium">Contorno</span>
                  </button>
                </div>
              </div>

              {/* SELOS DE ASSOCIAÇÕES (BRIDE, INSPIRATION, ETC.) COM UPLOAD E TEXTO */}
              <div className="border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#D05634] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D05634]" />
                    Selos de Associações
                  </h4>
                  <span className="text-[10px] font-bold bg-[#FFF0EB] text-[#D05634] px-2 py-0.5 rounded-full uppercase">
                    {(collection?.associationSeals || []).length} ativos
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Adicione selos de associações que aparecerão automaticamente sobrepostos no card da galeria e na capa do evento.
                </p>

                {/* Upload de Imagem do Selo */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Upload do Selo / Logo
                  </label>
                  <input 
                    type="file"
                    ref={sealFileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={async (e) => {
                      const rawFile = e.target.files?.[0];
                      if (!rawFile) return;
                      try {
                        setIsUploadingSeal(true);
                        const file = await convertToWebP(rawFile, { quality: 0.92 });
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const uploadedUrl = data.url;
                          const name = sealNameInput.trim() || file.name.replace(/\.[^/.]+$/, '').toUpperCase();
                          const currentSeals = collection?.associationSeals || [];
                          const newSeal = {
                            id: `seal_${Date.now()}`,
                            name,
                            badgeText: sealBadgeTextInput.trim() || undefined,
                            iconUrl: uploadedUrl
                          };
                          onUpdateCollection(collection.id, {
                            associationSeals: [...currentSeals, newSeal]
                          });
                          setSealNameInput('');
                          setSealBadgeTextInput('');
                        }
                      } catch (err) {
                        console.error('Erro ao enviar imagem do selo:', err);
                      } finally {
                        setIsUploadingSeal(false);
                        if (sealFileInputRef.current) sealFileInputRef.current.value = '';
                      }
                    }}
                  />
                  <button 
                    type="button"
                    disabled={isUploadingSeal}
                    onClick={() => sealFileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border border-dashed border-gray-300 hover:border-[#D05634] rounded-xl text-xs font-semibold text-gray-700 hover:text-[#D05634] flex items-center justify-center gap-2 transition-all bg-gray-50 hover:bg-[#FFF0EB]/40 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-[#D05634]" />
                    <span>{isUploadingSeal ? 'Enviando Selo...' : 'Upload de Imagem do Selo (PNG / SVG)'}</span>
                  </button>
                </div>

                {/* Campo de Texto para Nome do Selo */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Nome da Associação / Selo
                    </label>
                    <input 
                      type="text"
                      placeholder="Ex: Bride Association, Inspiration Photographers"
                      value={sealNameInput}
                      onChange={(e) => setSealNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && sealNameInput.trim()) {
                          e.preventDefault();
                          const currentSeals = collection?.associationSeals || [];
                          const newSeal = {
                            id: `seal_${Date.now()}`,
                            name: sealNameInput.trim(),
                            badgeText: sealBadgeTextInput.trim() || undefined
                          };
                          onUpdateCollection(collection.id, {
                            associationSeals: [...currentSeals, newSeal]
                          });
                          setSealNameInput('');
                          setSealBadgeTextInput('');
                        }
                      }}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#D05634] bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Texto do Badge (Opcional)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Ex: Membro, Awarded, Fearless"
                        value={sealBadgeTextInput}
                        onChange={(e) => setSealBadgeTextInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#D05634] bg-white text-gray-900"
                      />
                      <button 
                        type="button"
                        disabled={!sealNameInput.trim()}
                        onClick={() => {
                          if (!sealNameInput.trim()) return;
                          const currentSeals = collection?.associationSeals || [];
                          const newSeal = {
                            id: `seal_${Date.now()}`,
                            name: sealNameInput.trim(),
                            badgeText: sealBadgeTextInput.trim() || undefined
                          };
                          onUpdateCollection(collection.id, {
                            associationSeals: [...currentSeals, newSeal]
                          });
                          setSealNameInput('');
                          setSealBadgeTextInput('');
                        }}
                        className="px-4 py-2 bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selos Rápidos Pré-configurados (Presets) */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Selos Populares (Clique para Alternar)
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {OFFICIAL_ASSOCIATION_SEALS.map((preset) => {
                      const currentSeals: any[] = collection?.associationSeals || [];
                      const isSelected = currentSeals.some((s: any) => s.name?.toLowerCase() === preset.name.toLowerCase());
                      const logoUrl = getAssociationSealLogoUrl(preset.id, preset.iconUrl);

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            let nextSeals = [...currentSeals];
                            if (isSelected) {
                              nextSeals = nextSeals.filter((s: any) => s.name?.toLowerCase() !== preset.name.toLowerCase());
                            } else {
                              nextSeals.push({
                                id: `preset_${preset.id}_${Date.now()}`,
                                name: preset.name,
                                badgeText: preset.badgeText,
                                iconUrl: preset.iconUrl || undefined
                              });
                            }
                            onUpdateCollection(collection.id, { associationSeals: nextSeals });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-between gap-2 ${
                            isSelected 
                              ? 'bg-[#D05634] text-white border-[#D05634] shadow-sm' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {logoUrl ? (
                              <img src={logoUrl} alt={preset.name} className="w-7 h-7 rounded-md object-contain bg-black shrink-0" />
                            ) : (
                              <Award className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{preset.name}</span>
                          </div>
                          <span className="text-[10px] font-extrabold shrink-0">
                            {isSelected ? '✓ Ativo' : '+ Usar'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lista de Selos Ativos da Galeria */}
                {(collection?.associationSeals || []).length > 0 && (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Selos Ativos nesta Galeria
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {(collection?.associationSeals || []).map((seal: any, idx: number) => {
                        const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                        return (
                          <div 
                            key={seal.id || idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              {resolvedLogo ? (
                                <img src={resolvedLogo} alt={seal.name} className="w-6 h-6 rounded object-contain bg-black border border-gray-200 shrink-0" />
                              ) : (
                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                              )}
                              <div className="truncate">
                                <span className="font-bold text-gray-900 truncate block">{seal.name}</span>
                                {seal.badgeText && (
                                  <span className="text-[10px] text-[#D05634] font-semibold block">{seal.badgeText}</span>
                                )}
                              </div>
                            </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextSeals = (collection?.associationSeals || []).filter((_: any, i: number) => i !== idx);
                              onUpdateCollection(collection.id, { associationSeals: nextSeals });
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Remover Selo"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : editorTab === 'layout' ? (
            <>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Estilos de Grade</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'mosaico' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'mosaico' || !collection?.layoutStyle ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Mosaico</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'vertical' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'vertical' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <Columns className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Vertical</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'horizontal' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'horizontal' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <Rows className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Horizontal</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'assimetrico' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'assimetrico' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Assimétrico</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'dinamico' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'dinamico' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <Maximize className="w-6 h-6 shrink-0" />
                    <span className="text-[10px] uppercase font-bold tracking-wider truncate mx-[-10px] max-w-[80px]">Dinâmico</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'equilibrado' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'equilibrado' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <Grid3X3 className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider shrink-0 max-w-[80px] break-all truncate mx-[-10px]">Equilibrado</span>
                  </button>
                  <button onClick={() => onUpdateCollection(collection.id, { layoutStyle: 'fluido' })} className={`p-4 rounded-xl flex flex-col items-center gap-2 border ${collection?.layoutStyle === 'fluido' ? 'border-[#D05634] text-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <LayoutTemplate className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Fluido</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Arredondamento das Imagens</h4>
                <div className="relative">
                  <select 
                    value={collection?.imageRounding || 'none'}
                    onChange={(e) => onUpdateCollection(collection.id, { imageRounding: e.target.value })}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634] transition-colors"
                  >
                    <option value="none">Cantos Retos</option>
                    <option value="sm">Cantos Suaves</option>
                    <option value="md">Cantos Arredondados</option>
                    <option value="lg">Extra Arredondados</option>
                    <option value="full">Círculos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Espaçamento das Imagens</h4>
                  <span className="text-sm text-gray-500">{collection?.imageSpacing !== undefined ? collection.imageSpacing : 2}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  step="2"
                  value={collection?.imageSpacing !== undefined ? collection.imageSpacing : 2}
                  onChange={(e) => onUpdateCollection(collection.id, { imageSpacing: Number(e.target.value) })}
                  className="w-full accent-[#D05634] h-1.5 bg-gray-200 rounded-lg appearance-none" 
                />
              </div>
            </>
          ) : editorTab === 'privacidade' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Privacidade e Acesso</h3>
                <p className="text-sm text-gray-500">Controle quem pode ver e acessar sua galeria.</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-blue-600 shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Galeria Pública</div>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">Quando ativado, qualquer pessoa com o link poderá acessar a galeria.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => onUpdateCollection(collection.id, { isPublic: !(collection?.isPublic ?? true) })}
                    className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection?.isPublic !== false ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection?.isPublic !== false ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Proteção Anti-Print</div>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">Bloqueia capturas de tela e gravação nas galerias públicas.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => onUpdateCollection(collection.id, { antiPrintEnabled: !(collection?.antiPrintEnabled ?? false) })}
                    className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection?.antiPrintEnabled ? 'bg-red-500' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection?.antiPrintEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>



              <div className={`border rounded-xl p-4 shadow-sm bg-white transition-all ${!collection.storeEnabled ? 'opacity-50 grayscale' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#D05634] shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Proteção por Senha</div>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">
                        {collection.storeEnabled ? 'Exija uma senha para ver as fotos.' : 'Ative a Loja para usar proteção por senha.'}
                      </p>
                    </div>
                 </div>
                  <div 
                    onClick={() => {
                      if (!collection.storeEnabled) return;
                      onUpdateCollection(collection.id, { passwordEnabled: !collection.passwordEnabled });
                    }}
                    className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection.passwordEnabled && collection.storeEnabled ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection.passwordEnabled && collection.storeEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
                {collection.passwordEnabled && collection.storeEnabled && (
                  <div className="mt-2 pl-14">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D05634]"
                      placeholder="Digite a senha..."
                      value={collection.password || ''}
                      onChange={(e) => onUpdateCollection(collection.id, { password: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : editorTab === 'download' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Download className="w-5 h-5 text-[#D05634]" /> Downloads</h3>
                <p className="text-sm text-gray-500">Configure como os clientes podem baixar as fotos da galeria.</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center text-green-600 shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Permitir Downloads</div>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">Habilite para permitir que os visitantes baixem as imagens da galeria.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      const newAllowDownload = !(collection?.allowDownload !== false);
                      onUpdateCollection(collection.id, { 
                        allowDownload: newAllowDownload,
                        storeEnabled: newAllowDownload ? false : collection?.storeEnabled
                      });
                    }}
                    className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection?.allowDownload !== false ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection?.allowDownload !== false ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Tamanhos Disponíveis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'small', label: 'Pequeno (Web)', desc: 'Ideal para redes sociais' },
                    { id: 'medium', label: 'Médio', desc: 'Boa qualidade, tamanho reduzido' },
                    { id: 'large', label: 'Grande', desc: 'Alta resolução' },
                    { id: 'original', label: 'Original', desc: 'Resolução máxima sem perdas' }
                  ].map(sizeObj => {
                    const isSelected = (collection.downloadSizes || ['original']).includes(sizeObj.id);
                    return (
                      <div 
                        key={sizeObj.id} 
                          onClick={() => {
                            // Single selection behavior
                            onUpdateCollection(collection.id, { downloadSizes: [sizeObj.id] });
                          }}
                        className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${isSelected ? 'border-[#D05634] bg-[#FFF0EB]' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center mx-auto mb-2 ${isSelected ? 'bg-[#D05634] text-white' : 'border border-gray-300'}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div className={`text-sm font-medium ${isSelected ? 'text-[#D05634]' : ''}`}>{sizeObj.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-[#D05634]/70' : 'text-gray-500'}`}>{sizeObj.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#D05634] shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Proteção por PIN</div>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">Exija um PIN para baixar fotos.</p>
                    </div>
                 </div>
                  <div 
                    onClick={() => onUpdateCollection(collection.id, { downloadPinEnabled: !collection.downloadPinEnabled })}
                    className={`w-10 h-6 rounded-full flex items-center px-1 shrink-0 cursor-pointer transition-colors ${collection.downloadPinEnabled ? 'bg-[#D05634]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${collection.downloadPinEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
                {collection.downloadPinEnabled && (
                  <div className="mt-2 pl-14">
                    <input
                      type="text"
                      maxLength={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D05634] tracking-widest text-center"
                      placeholder="PIN (4 dígitos)"
                      value={collection.downloadPin || ''}
                      onChange={(e) => onUpdateCollection(collection.id, { downloadPin: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : editorTab === 'album' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#D05634]" /> Configuração de Álbum</h3>
                <p className="text-sm text-gray-500">Visualize as seleções de fotos para álbuns e defina o preço por foto.</p>
              </div>

              {/* Preço do álbum */}
              <div className="bg-[#FFF0EB] rounded-2xl p-5 border border-[#D05634]/20 shadow-sm">
                <label className="block text-xs font-bold text-[#D05634] mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Preço por Foto no Álbum (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={collection.albumPhotoPrice || 0}
                    onChange={(e) => onUpdateCollection(collection.id, { albumPhotoPrice: Number(e.target.value) })}
                    className="w-full border border-gray-200/80 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D05634]/50 focus:border-[#D05634] font-medium"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-normal">Valor cobrado por cada foto selecionada pelo cliente para o álbum impresso.</p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Álbuns Escolhidos pelos Clientes</h4>
              </div>

              {collection.clientSelections && Object.keys(collection.clientSelections).some(k => collection.clientSelections[k].selection?.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(collection.clientSelections).filter(([_, data]: [any, any]) => data.selection?.length > 0).map(([key, data]: [string, any]) => {
                    const photoCount = data.selection?.length || 0;
                    return (
                      <div 
                        key={key} 
                        onClick={() => setSelectedClientDetails({key, data})}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#D05634] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-center p-5 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-[#D05634]/30 group-hover:bg-[#FFF0EB] transition-colors shrink-0">
                            <span className="text-[#D05634] font-bold text-sm">
                              {(data.email || key.replace(/_/g, '.')).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate group-hover:text-[#D05634] transition-colors">
                              {data.email || key.replace(/_/g, '.')}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                              {photoCount} fotos selecionadas
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] py-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="text-gray-900 font-bold mb-2">Nenhum álbum em construção</h4>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">Assim que os clientes começarem a selecionar fotos para o álbum na galeria pública, elas aparecerão aqui.</p>
                </div>
              )}
            </div>
          ) : editorTab === 'aparencia' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Palette className="w-5 h-5 text-[#D05634]" /> Aparência da Galeria</h3>
                <p className="text-sm text-gray-500">Escolha as cores e o estilo visual da sua galeria pública.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { id: 'light', name: 'Light', colors: ['#FFFFFF', '#D1D5DB', '#000000'] },
                  { id: 'gold', name: 'Gold', colors: ['#FFFFFF', '#333333', '#C5A059'] },
                  { id: 'rose', name: 'Rose', colors: ['#FFF5F5', '#4A3131', '#B06D6D'] },
                  { id: 'terracotta', name: 'Terracotta', colors: ['#FFFFFF', '#BC4749', '#3E2723'] },
                  { id: 'sand', name: 'Sand', colors: ['#FFFFFF', '#7B7167', '#A69080'] },
                  { id: 'olive', name: 'Olive', colors: ['#FFFFFF', '#4F5D2F', '#708238'] },
                  { id: 'agave', name: 'Agave', colors: ['#FFFFFF', '#457B9D', '#82A3A1'] },
                  { id: 'sea', name: 'Sea', colors: ['#FFFFFF', '#1E3A5F', '#4682B4'] },
                  { id: 'dark', name: 'Dark', colors: ['#000000', '#333333', '#FFFFFF'] },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateCollection(collection.id, { theme: theme.id })}
                    className={`flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${
                      (collection.theme || 'light') === theme.id 
                        ? 'border-[#D05634] bg-white shadow-xl scale-[1.02] z-10' 
                        : 'border-gray-50 bg-white hover:border-gray-200 text-gray-400 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex gap-2.5 justify-center mb-1">
                      {theme.colors.map((color, i) => (
                        <div 
                           key={i} 
                           className="w-5 h-5 rounded-full border border-gray-100 shadow-sm transition-transform group-hover:scale-110"
                           style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className={`text-[13px] font-bold ${ (collection.theme || 'light') === theme.id ? 'text-[#D05634]' : 'text-gray-500' }`}>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : editorTab === 'loja' ? (
            <LojaSidebar collection={collection} onUpdateCollection={onUpdateCollection} />
          ) : null}
        </div>

        {/* Design Preview */}
        <div className="flex-1 overflow-y-auto p-8 relative flex justify-center">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white p-1 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-700 z-10">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"><Smartphone className="w-4 h-4"/> Mobile</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0EB] text-[#D05634] transition-colors"><Monitor className="w-4 h-4"/> Desktop</button>
              </div>

              <div 
                className="w-full max-w-4xl mt-16 shadow-xl rounded-t-2xl border border-gray-200 overflow-y-auto flex flex-col h-[800px] scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent transition-colors duration-300"
                style={{ backgroundColor: previewTheme.bg }}
              >
                <div className="relative w-full h-[500px] bg-gray-100 shrink-0">
                  {collection?.image ? (
                    <img 
                      src={collection.image} 
                      className="w-full h-full object-cover" 
                      style={{ objectPosition: `${collection?.coverPositionX ?? 50}% ${collection?.coverPositionY ?? 50}%` }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                      <p>Adicione uma imagem de capa selecionando uma mídia</p>
                    </div>
                  )}
                  {collection?.image && (
                    <div className={`absolute inset-0 bg-black/20 flex flex-col ${
                      collection.coverLayout === 'left-aligned' ? 'items-start justify-center px-16' :
                      collection.coverLayout === 'novela' ? 'items-center justify-end pb-16' :
                      collection.coverLayout === 'diario' ? 'items-start justify-end p-8' :
                      collection.coverLayout === 'selo' ? 'items-end justify-start p-8' :
                      'items-center justify-center px-4'
                    }`}>
                      <div className={`flex flex-col ${
                        collection.coverLayout === 'left-aligned' ? 'items-start' :
                        collection.coverLayout === 'novela' ? 'items-center space-y-1' :
                        collection.coverLayout === 'moldura' ? 'border-2 border-white/40 p-6 md:p-10 backdrop-blur-sm items-center' :
                        collection.coverLayout === 'faixa' ? 'w-full bg-black/30 py-8 backdrop-blur-md items-center' :
                        collection.coverLayout === 'divisor' ? 'items-center' :
                        collection.coverLayout === 'selo' ? 'bg-white/10 backdrop-blur-md p-4 border border-white/20 items-end' :
                        'items-center'
                      }`}>
                        {collection.coverLayout === 'divisor' && <div className="w-10 h-0.5 bg-white mb-4 opacity-60"></div>}
                        
                        {collection.showTitleOnCover !== false && (
                          <h1 className={`font-bold text-white tracking-tight leading-tight ${
                            collection.coverLayout === 'left-aligned' ? 'text-3xl md:text-5xl text-left max-w-xl' :
                            collection.coverLayout === 'novela' ? 'text-4xl md:text-6xl uppercase text-center' :
                            collection.coverLayout === 'diario' ? 'text-2xl md:text-4xl font-light text-left' :
                            collection.coverLayout === 'contorno' ? 'text-4xl md:text-7xl text-transparent [-webkit-text-stroke:1px_white] text-center' :
                            'text-3xl md:text-5xl text-center max-w-xl'
                          }`}>
                            {collection.title}
                          </h1>
                        )}
                        
                        {collection.showDateOnCover !== false && collection.date && (
                          <p className={`text-white/90 font-medium ${
                            collection.coverLayout === 'novela' ? 'text-lg tracking-[0.15em] uppercase mt-3' :
                            collection.coverLayout === 'vintage' ? 'mt-3 border-t border-b border-white/30 py-1 px-4 italic text-sm' :
                            collection.coverLayout === 'diario' ? 'text-xs mt-1 opacity-60 font-mono' :
                            'text-sm mt-3'
                          }`}>
                            {collection.date}
                          </p>
                        )}

                        {collection.coverLayout === 'divisor' && <div className="w-10 h-0.5 bg-white mt-4 opacity-60"></div>}

                        {/* Overlaid Association Seals on Cover */}
                        {collection?.associationSeals && collection.associationSeals.length > 0 && (
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-20">
                            {collection.associationSeals.map((seal: any, idx: number) => {
                              const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                              return (
                                <div 
                                  key={seal.id || idx}
                                  className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white flex items-center gap-2 shadow-lg"
                                >
                                  {resolvedLogo ? (
                                    <img src={resolvedLogo} alt={seal.name} className="w-5 h-5 rounded object-contain shrink-0" />
                                  ) : (
                                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  )}
                                  <span className="text-[11px] font-bold tracking-tight">{seal.name}</span>
                                  {seal.badgeText && (
                                    <span className="text-[9px] uppercase tracking-wider text-[#FF9E80] font-extrabold ml-0.5">· {seal.badgeText}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-8 pt-6 pb-20 flex flex-col min-h-screen">
                  <div 
                    className="flex items-center justify-center gap-6 mb-8 w-full sticky top-0 z-10 py-4 shadow-sm border-b border-gray-50 transition-colors duration-300"
                    style={{ backgroundColor: previewTheme.bg, color: previewTheme.text, borderColor: previewTheme.bg === '#FFFFFF' ? '#F9FAFB' : `${previewTheme.text}10` }}
                  >
                    <ImageIcon className="w-5 h-5 cursor-pointer hover:opacity-70" />
                    {collection?.allowDownload !== false && (
                      <Download className="w-5 h-5 cursor-pointer hover:opacity-70" />
                    )}
                  </div>
                  
                  <div className="w-full px-4">
                    <GalleryGrid 
                      collection={collection} 
                      media={media} 
                      onImageClick={(index) => setEditorLightboxIndex(index)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {editorLightboxIndex !== null && (
              <div className="fixed inset-0 z-[1000] bg-black animate-in fade-in duration-300 flex items-center justify-center p-4">
                <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                  <button 
                    onClick={() => setEditorLightboxIndex(null)}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditorLightboxIndex(prev => (prev! - 1 + media.length) % media.length);
                  }}
                  className="absolute left-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 z-50"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center" onClick={() => setEditorLightboxIndex(null)}>
                  <motion.img 
                    key={editorLightboxIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={media[editorLightboxIndex]} 
                    className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                    onClick={(e) => e.stopPropagation()}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditorLightboxIndex(prev => (prev! + 1) % media.length);
                  }}
                  className="absolute right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 z-50"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {selectedClientDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedClientDetails(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="text-xl font-black text-gray-900 truncate pr-8">
                {selectedClientDetails.data.email || selectedClientDetails.key.replace(/_/g, '.')}
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
                Atualizado em: {selectedClientDetails.data.updatedAt ? new Date(selectedClientDetails.data.updatedAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-5 gap-2 mb-6">
                {selectedClientDetails.data.selection?.slice(0, 10).map((idx: number) => (
                  <div key={idx} className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative">
                    <img 
                      src={collection.media[idx]} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
                {(selectedClientDetails.data.selection?.length || 0) > 10 && (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                    +{(selectedClientDetails.data.selection?.length || 0) - 10}
                  </div>
                )}
              </div>
              
              {(collection.albumPhotoPrice || 0) > 0 && (
                <div className="mb-6 p-4 bg-[#FFF0EB] rounded-2xl flex items-center justify-between border border-[#D05634]/10">
                   <div className="text-xs font-bold uppercase tracking-widest text-[#D05634]">Valor Total</div>
                   <div className="text-xl font-black text-[#D05634]">R$ {((selectedClientDetails.data.selection?.length || 0) * (collection.albumPhotoPrice || 0)).toFixed(2).replace('.', ',')}</div>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setPhotobookImages(selectedClientDetails.data.selection.map((idx: number) => collection.media[idx]).filter(Boolean));
                  setSelectedClientDetails(null);
                  setShowPhotobook(true);
                }}
                className="w-full bg-[#D05634] text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#D05634]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Gerar Prova de Álbum
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhotobook && (
        <PhotobookMockup 
          collection={collection} 
          images={photobookImages} 
          onClose={() => setShowPhotobook(false)} 
          onFinish={() => setShowPhotobook(false)}
          onUpdateCollection={onUpdateCollection}
        />
      )}

      {showAuditDashboard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-end">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auditoria de Logs & Rastreabilidade</h2>
              </div>
              <button 
                onClick={() => setShowAuditDashboard(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-850 rounded-full transition-colors cursor-pointer text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SecureAuditLogsDashboard collectionId={collection.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageWrap({
  url,
  imgClassName,
  photobookSelection,
  togglePhotobookSelection,
  collection,
  onClick,
  clientEmail
}: {
  url: string;
  imgClassName?: string;
  photobookSelection?: string[];
  togglePhotobookSelection?: (url: string) => void;
  key?: React.Key;
  collection?: any;
  onClick?: () => void;
  clientEmail?: string;
}) {
  const isSelected = photobookSelection?.includes(url);
  const showIcon = photobookSelection !== undefined;
  
  const IconComponent = collection?.storeEnabled ? Store : BookOpen;
  const accentColor = collection?.theme === 'dark' ? '#FFFFFF' : '#D05634';

  const clientKey = clientEmail?.replace(/\./g, '_');
  const localSyncKey = clientKey ? `acquired_${collection?.id}_${clientKey}` : null;
  const localDownloadedIndices = localSyncKey ? JSON.parse(localStorage.getItem(localSyncKey) || '[]') : [];
  const firestoreDownloadedIndices = clientKey ? collection?.clientSelections?.[clientKey]?.downloadedIndices || [] : [];
  const downloadedIndices = Array.from(new Set([...firestoreDownloadedIndices, ...localDownloadedIndices]));
  const isPurchased = collection?.media && downloadedIndices.includes(collection.media.indexOf(url));

  const isAntiPrint = !!collection?.antiPrintEnabled;
  const clientName = localStorage.getItem(`client_name_${collection?.id}`) || clientEmail?.split('@')[0] || 'Cliente';
  const sessionSecret = useRef(generateLocalSessionSecret()).current;
  const sessionId = useRef('SES-' + Math.random().toString(36).substring(2, 9).toUpperCase()).current;
  const imageIndex = collection?.media ? collection.media.indexOf(url) : -1;
  const signedToken = generateSignedToken(imageIndex, clientEmail || 'anon@anon.com', sessionSecret);

  const roundingClass = {
    'none': 'rounded-none',
    'sm': 'rounded-md',
    'md': 'rounded-xl',
    'lg': 'rounded-3xl',
    'full': 'rounded-full'
  }[collection?.imageRounding || 'none'] || 'rounded-none';

  return (
    <div className={`relative group w-full h-full cursor-pointer`} onClick={onClick}>
      {isAntiPrint ? (
        <SecureCanvasViewer
          imageIndex={imageIndex}
          url={url}
          clientEmail={clientEmail || 'anon@anon.com'}
          clientName={clientName}
          sessionId={sessionId}
          sessionSecret={sessionSecret}
          expires={signedToken.expires}
          signature={signedToken.signature}
          antiPrintEnabled={isAntiPrint}
          collectionId={collection?.id}
          isPurchased={isPurchased}
          imageRounding={roundingClass}
          aspectRatioClass={imgClassName?.includes('aspect-square') ? 'aspect-square' : imgClassName?.includes('aspect-[4/3]') ? 'aspect-[4/3]' : imgClassName?.includes('aspect-[3/4]') ? 'aspect-[3/4]' : 'aspect-auto'}
        />
      ) : (
        <img src={url} className={imgClassName} loading="lazy" referrerPolicy="no-referrer" draggable={false} style={{ userSelect: 'none', WebkitUserSelect: 'none' }} />
      )}
      
      {isPurchased && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm bg-emerald-500/90">
            <Check className="w-2.5 h-2.5" />
            Adquirida
          </div>
        </div>
      )}
      
      {collection?.watermarkType && collection?.storeEnabled && typeof collection.watermarkOpacity === 'number' && (
        <div 
          className="absolute inset-0 pointer-events-none flex"
          style={{ 
            opacity: collection.watermarkOpacity / 100,
            alignItems: (collection.watermarkPosition || 'center').includes('center') ? 'center' : (collection.watermarkPosition || '').includes('bottom') ? 'flex-end' : 'flex-start',
            justifyContent: (collection.watermarkPosition || 'center').includes('center') ? 'center' : (collection.watermarkPosition || '').includes('right') ? 'flex-end' : 'flex-start',
            padding: '5%'
          }}
        >
          {collection.watermarkType === 'image' && collection.watermarkImage ? (
            <img src={collection.watermarkImage} className="max-w-[50%] max-h-[50%] object-contain" />
          ) : (
             <div className="font-bold text-center drop-shadow-md text-3xl sm:text-4xl" style={{ color: collection.watermarkColor || '#FFFFFF' }}>{collection.watermarkText || 'Cópia não autorizada'}</div>
          )}
        </div>
      )}

      {showIcon && (
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            togglePhotobookSelection && togglePhotobookSelection(url); 
          }}
          className={`absolute bottom-3 right-3 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors shadow-sm backdrop-blur-sm z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <IconComponent className={`w-5 h-5 transition-colors ${isSelected ? `text-[${accentColor}] fill-[${accentColor}]` : 'text-white/90'}`} />
        </button>
      )}
    </div>
  );
}

function GalleryGrid({ 
  collection, 
  media,
  photobookSelection,
  togglePhotobookSelection,
  onImageClick,
  clientEmail
}: { 
  collection: any, 
  media: string[],
  photobookSelection?: string[],
  togglePhotobookSelection?: (url: string) => void,
  onImageClick?: (index: number) => void,
  clientEmail?: string
}) {
  if (!media || media.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg">Nenhuma mídia disponível nesta galeria.</p>
      </div>
    );
  }

  const roundingClass = {
    'none': 'rounded-none',
    'sm': 'rounded-md',
    'md': 'rounded-xl',
    'lg': 'rounded-3xl',
    'full': 'rounded-full'
  }[collection?.imageRounding || 'none'] || 'rounded-none';

  const gapValue = collection?.imageSpacing !== undefined ? collection.imageSpacing : 2; 

  const layout = collection?.layoutStyle || 'mosaico';

  if (layout === 'vertical') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => (
          <ImageWrap key={i} url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full aspect-[3/4] object-cover ${roundingClass}`} clientEmail={clientEmail} />
        ))}
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => (
          <ImageWrap key={i} url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full aspect-[4/3] object-cover ${roundingClass}`} clientEmail={clientEmail} />
        ))}
      </div>
    );
  }

  if (layout === 'assimetrico') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => (
          <div key={i} className={i % 5 === 0 || i % 7 === 0 ? "col-span-2 row-span-2" : "col-span-1"}>
            <ImageWrap url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full h-full object-cover ${roundingClass}`} clientEmail={clientEmail} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'dinamico') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => {
          return (
            <div key={i} className={i % 3 === 0 ? "col-span-2 row-span-2" : "col-span-1"}>
              <ImageWrap url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full h-full object-cover ${roundingClass}`} clientEmail={clientEmail} />
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === 'equilibrado') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => (
          <ImageWrap key={i} url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full aspect-square object-cover ${roundingClass}`} clientEmail={clientEmail} />
        ))}
      </div>
    );
  }

  if (layout === 'fluido') {
    return (
      <div className="flex flex-wrap" style={{ gap: `${gapValue}px` }}>
        {media.map((url: string, i: number) => (
          <div key={i} className="flex-auto" style={{ width: i % 3 === 0 ? '40%' : i % 2 === 0 ? '30%' : '20%' }}>
             <ImageWrap url={url} collection={collection} photobookSelection={photobookSelection} togglePhotobookSelection={togglePhotobookSelection} onClick={() => onImageClick?.(i)} imgClassName={`w-full h-64 md:h-80 object-cover ${roundingClass}`} clientEmail={clientEmail} />
          </div>
        ))}
      </div>
    );
  }

  // default to mosaico
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4" style={{ columnGap: `${gapValue}px` }}>
      {media.map((url: string, i: number) => (
        <div key={i} className="break-inside-avoid" style={{ marginBottom: `${gapValue}px` }}>
          <ImageWrap 
            url={url}
            collection={collection}
            photobookSelection={photobookSelection} 
            togglePhotobookSelection={togglePhotobookSelection} 
            onClick={() => onImageClick?.(i)}
            imgClassName={`w-full h-auto ${roundingClass}`} 
            clientEmail={clientEmail}
          />
        </div>
      ))}
    </div>
  );
}

function StoreCartModal({ 
  images, 
  collection: galleryCollection, 
  onClose,
  themeVars,
  clientEmail,
  isAlbum = false,
  onUpdateCollection
}: { 
  images: string[], 
  collection: any, 
  onClose: () => void,
  themeVars: any,
  clientEmail: string,
  isAlbum?: boolean,
  onUpdateCollection?: (id: any, updates: any) => void
}) {
  const [localEmail, setLocalEmail] = useState(clientEmail || '');
  const finalEmail = (clientEmail || localEmail || '').trim();
  const clientKey = finalEmail.replace(/\./g, '_');

  const freePhotos = isAlbum ? 0 : (galleryCollection.freePhotos || 0);
  const photoPrice = isAlbum ? (galleryCollection.albumPhotoPrice || 0) : (galleryCollection.photoPrice || 0);
  
  const clientData = galleryCollection.clientSelections?.[clientKey] || {};
  
  const localSyncKey = `acquired_${galleryCollection.id}_${clientKey}`;
  const localDownloadedIndices = JSON.parse(localStorage.getItem(localSyncKey) || '[]');
  const firestoreDownloadedIndices = clientData.downloadedIndices || [];
  
  const downloadedIndices = Array.from(new Set([...firestoreDownloadedIndices, ...localDownloadedIndices]));
  const currentIndices = images.map(url => galleryCollection.media.indexOf(url)).filter(i => i !== -1);
  const alreadyDownloadedIndices = isAlbum ? [] : currentIndices.filter(idx => downloadedIndices.includes(idx));
  const newIndices = isAlbum ? currentIndices : currentIndices.filter(idx => !downloadedIndices.includes(idx));

  const totalCount = images.length;
  const usedFreeCount = downloadedIndices.length;
  const remainingFreeCount = Math.max(0, freePhotos - usedFreeCount);
  const billableCount = Math.max(0, newIndices.length - remainingFreeCount);
  const totalPrice = billableCount * photoPrice;

  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Summary, 1: Data, 2: Payment, 3: Gateway Processing Screen
  const [albumDetails, setAlbumDetails] = useState({
    nome: galleryCollection.albumSettings?.nome || '',
    endereco: galleryCollection.albumSettings?.endereco || '',
    tamanho: galleryCollection.albumSettings?.tamanho || '20x20',
    status: galleryCollection.albumSettings?.status || 'Em edição'
  });

  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true);

  useEffect(() => {
    if (galleryCollection?.ownerId) {
      fetch(`/api/users/${galleryCollection.ownerId}`)
        .then(res => res.json())
        .then(data => {
          setOwnerProfile(data);
          setIsLoadingOwner(false);
        })
        .catch(err => {
          console.error("Error loading owner profile from API:", err);
          setIsLoadingOwner(false);
        });
    } else {
      setIsLoadingOwner(false);
    }
  }, [galleryCollection?.ownerId]);

  const isPixActive = ownerProfile ? ownerProfile.pixEnabled : (galleryCollection.pixEnabled !== false);
  const isCardActive = ownerProfile ? ownerProfile.cardEnabled : galleryCollection.cardEnabled;

  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'card'>('pix');

  useEffect(() => {
    if (!isLoadingOwner) {
      if (isPixActive) {
        setSelectedMethod('pix');
      } else if (isCardActive) {
        setSelectedMethod('card');
      }
    }
  }, [isLoadingOwner, isPixActive, isCardActive]);

  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    // Sync with collection settings if available
    if (galleryCollection.albumSettings) {
      setAlbumDetails({
        nome: galleryCollection.albumSettings.nome || '',
        endereco: galleryCollection.albumSettings.endereco || '',
        tamanho: galleryCollection.albumSettings.tamanho || '20x20',
        status: galleryCollection.albumSettings.status || 'Em edição'
      });
    }
  }, [galleryCollection.albumSettings]);

  const simulateConfirmPayment = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const completeFully = async () => {
    if (!isAlbum) {
      if (galleryCollection.downloadPinEnabled) {
        const pin = prompt('Digite o PIN de download:');
        if (pin !== galleryCollection.downloadPin) {
          alert('PIN incorreto!');
          return;
        }
      }

      if (newIndices.length > 0) {
        const updatedLocal = Array.from(new Set([...localDownloadedIndices, ...newIndices]));
        localStorage.setItem(localSyncKey, JSON.stringify(updatedLocal));
      }

      images.forEach((url, i) => {
        const a = document.createElement('a');
        a.href = url;
        const filename = url.split('/').pop()?.split('?')[0] || `foto-${i+1}.jpg`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      if (newIndices.length > 0 && finalEmail) {
        try {
          const sanitizedKey = finalEmail.replace(/\./g, '_');
          const currentSelections = galleryCollection.clientSelections?.[sanitizedKey] || {};
          const oldDl = currentSelections.downloadedIndices || [];
          const updatedDl = Array.from(new Set([...oldDl, ...newIndices]));

          const newSelections = {
            ...(galleryCollection.clientSelections || {}),
            [sanitizedKey]: {
              ...currentSelections,
              downloadedIndices: updatedDl,
              updatedAt: new Date().toISOString(),
              email: finalEmail
            }
          };

          if (onUpdateCollection) {
            onUpdateCollection(galleryCollection.id, { clientSelections: newSelections });
          }
        } catch (err: any) {
          console.error("Non-blocking sync error:", err);
        }
      }
      onClose();
    } else {
      alert(`Obrigado pelo seu pedido do álbum "${albumDetails.nome}"! O status agora é "Produzindo". Estimativa de 20 dias para entrega no endereço: ${albumDetails.endereco}`);
      
      const updatedDetails = { ...albumDetails, status: 'Produzindo' };
      setAlbumDetails(updatedDetails);
      await set(`album_details_${galleryCollection.id}_${clientKey}`, updatedDetails);

      if (finalEmail) {
        try {
          const sanitizedKey = finalEmail.replace(/\./g, '_');
          const currentSelections = galleryCollection.clientSelections?.[sanitizedKey] || {};

          const newSelections = {
            ...(galleryCollection.clientSelections || {}),
            [sanitizedKey]: {
              ...currentSelections,
              selection: currentIndices,
              albumDetails: updatedDetails,
              updatedAt: new Date().toISOString(),
              email: finalEmail,
              name: albumDetails.nome || ''
            }
          };

          if (onUpdateCollection) {
            onUpdateCollection(galleryCollection.id, { clientSelections: newSelections });
          }

          // Store identified credentials
          localStorage.setItem(`client_email_${galleryCollection.id}`, finalEmail);
          if (albumDetails.nome) {
            localStorage.setItem(`client_name_${galleryCollection.id}`, albumDetails.nome);
          }
        } catch (err: any) {
          console.error("Non-blocking sync error:", err);
        }
      }
      onClose();
      // Force reload to let the view reflect identification
      window.location.reload();
    }
  };

  const handleAction = async () => {
    if (checkoutStep === 0) {
      setCheckoutStep(1);
      return;
    }
    
    if (checkoutStep === 1) {
      setCheckoutStep(2);
      return;
    }

    // Now in payment step (index 2)
    if (totalPrice === 0 && !isAlbum) {
      if (galleryCollection.downloadPinEnabled) {
        const pin = prompt('Digite o PIN de download:');
        if (pin !== galleryCollection.downloadPin) {
          alert('PIN incorreto!');
          return;
        }
      }

      if (newIndices.length > 0) {
        const updatedLocal = Array.from(new Set([...localDownloadedIndices, ...newIndices]));
        localStorage.setItem(localSyncKey, JSON.stringify(updatedLocal));
      }

      images.forEach((url, i) => {
        const a = document.createElement('a');
        a.href = url;
        const filename = url.split('/').pop()?.split('?')[0] || `foto-${i+1}.jpg`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      if (newIndices.length > 0 && finalEmail) {
        try {
          const sanitizedKey = finalEmail.replace(/\./g, '_');
          const currentSelections = galleryCollection.clientSelections?.[sanitizedKey] || {};
          const oldDl = currentSelections.downloadedIndices || [];
          const updatedDl = Array.from(new Set([...oldDl, ...newIndices]));

          const newSelections = {
            ...(galleryCollection.clientSelections || {}),
            [sanitizedKey]: {
              ...currentSelections,
              downloadedIndices: updatedDl,
              updatedAt: new Date().toISOString(),
              email: finalEmail
            }
          };

          if (onUpdateCollection) {
            onUpdateCollection(galleryCollection.id, { clientSelections: newSelections });
          }
        } catch (err: any) {
          console.error("Non-blocking sync error:", err);
        }
      }
      onClose();
    } else {
      // Go to simulation step 3
      setCheckoutStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${checkoutStep >= 0 ? 'bg-[#D05634] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${checkoutStep === 0 ? 'text-[#D05634]' : 'text-gray-400'}`}>Resumo</span>
              </div>
              <div className="w-4 h-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${checkoutStep >= 1 ? 'bg-[#D05634] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${checkoutStep === 1 ? 'text-[#D05634]' : 'text-gray-400'}`}>Dados</span>
              </div>
              <div className="w-4 h-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${checkoutStep >= 2 ? 'bg-[#D05634] text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${checkoutStep >= 2 ? 'text-[#D05634]' : 'text-gray-400'}`}>Pagamento</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFF0EB] rounded-xl text-[#D05634]">
                {isAlbum ? <BookOpen className="w-6 h-6" /> : <Store className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">
                  {checkoutStep === 0 ? (isAlbum ? 'Resumo do Álbum' : 'Seu Carrinho') : checkoutStep === 1 ? 'Dados de Entrega' : checkoutStep === 2 ? 'Pagamento' : 'Checkout Seguro'}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {checkoutStep === 0 ? 'Confira os itens do seu pedido' : checkoutStep === 1 ? 'Informe os detalhes para entrega' : checkoutStep === 2 ? 'Escolha como deseja pagar' : 'Aguardando liquidação'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-red-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {checkoutStep === 3 ? (
            <div className="max-w-xl mx-auto py-8 animate-in slide-in-from-right-4 duration-300">
               {paymentSuccess ? (
                  <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Pagamento Transacionado!</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-sm">
                      O pagamento de <span className="font-bold text-gray-950">R$ {totalPrice.toFixed(2).replace('.', ',')}</span> foi liquidado e aprovado com sucesso através do gateway <span className="font-bold text-gray-950">{selectedMethod === 'pix' ? (ownerProfile?.pixProvider || 'Mercado Pago') : (ownerProfile?.cardProvider || 'Stripe')}</span>.
                    </p>
                    <div className="p-4 bg-white border border-emerald-100 rounded-2xl w-full text-left space-y-2 mb-6">
                      <p className="text-xs text-gray-500 flex justify-between"><span>Transação:</span> <span className="font-mono text-[10px] font-bold text-gray-700 font-sans">TX_{Math.floor(Math.random()*10000000)}</span></p>
                      <p className="text-xs text-gray-500 flex justify-between"><span>E-mail:</span> <span className="font-semibold text-gray-700">{finalEmail}</span></p>
                      <p className="text-xs text-gray-500 flex justify-between"><span>Status:</span> <span className="font-bold text-emerald-600">Aprovado</span></p>
                    </div>
                    <button 
                      onClick={completeFully}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all font-sans"
                    >
                      {isAlbum ? 'Concluir Álbum' : 'Baixar Fotos Selecionadas'}
                    </button>
                  </div>
               ) : processingPayment ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center py-24">
                     <div className="w-12 h-12 border-4 border-[#D05634] border-t-transparent rounded-full animate-spin mb-6"></div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans">Comunicação com Gateway</h3>
                     <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                        Iniciando transação com o provedor de pagamento <span className="font-bold text-gray-900">{selectedMethod === 'pix' ? (ownerProfile?.pixProvider || 'Mercado Pago') : (ownerProfile?.cardProvider || 'Stripe')}</span> do fotógrafo...
                     </p>
                  </div>
               ) : selectedMethod === 'pix' ? (
                  <div className="p-6 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                       pix
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-900 font-sans">Pagamento Pix QRCode</h3>
                       <p className="text-xs text-gray-500 mt-1">Escaneie o código abaixo com o app do seu banco ou use a chave Copia e Cola.</p>
                     </div>

                     {/* Visual QR Code placeholder */}
                     <div className="p-4 bg-gray-50 border border-gray-100 rounded-3xl relative">
                       <svg className="w-44 h-44 text-gray-950" viewBox="0 0 100 100">
                         <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                         <rect x="8" y="8" width="14" height="14" fill="white" />
                         <rect x="11" y="11" width="8" height="8" fill="currentColor" />

                         <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                         <rect x="78" y="8" width="14" height="14" fill="white" />
                         <rect x="81" y="11" width="8" height="8" fill="currentColor" />

                         <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                         <rect x="8" y="78" width="14" height="14" fill="white" />
                         <rect x="11" y="81" width="8" height="8" fill="currentColor" />

                         <rect x="35" y="10" width="5" height="5" fill="currentColor" />
                         <rect x="45" y="15" width="5" height="10" fill="currentColor" />
                         <rect x="55" y="5" width="10" height="5" fill="currentColor" />

                         <rect x="30" y="30" width="10" height="10" fill="currentColor" />
                         <rect x="45" y="40" width="15" height="5" fill="currentColor" />
                         <rect x="5" y="35" width="10" height="5" fill="currentColor" />

                         <rect x="70" y="35" width="10" height="10" fill="currentColor" />
                         <rect x="85" y="45" width="5" height="15" fill="currentColor" />

                         <rect x="35" y="60" width="5" height="15" fill="currentColor" />
                         <rect x="50" y="55" width="15" height="10" fill="currentColor" />
                         <rect x="30" y="80" width="15" height="5" fill="currentColor" />
                         <rect x="55" y="80" width="10" height="10" fill="currentColor" />
                         <rect x="70" y="65" width="15" height="5" fill="currentColor" />
                       </svg>
                       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-xl border shadow-sm">
                         <div className="font-bold text-[8px] tracking-tighter text-[#D05634] uppercase font-sans">Pix</div>
                       </div>
                     </div>

                     <div className="w-full space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left block">Código Copia e Cola PIX</label>
                       <div className="flex gap-2">
                          <input 
                             type="text" 
                             readOnly 
                             value="00020101021226830014br.gov.bcb.pix25610211029302192039120930129302190312903" 
                             className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-500 overflow-hidden text-ellipsis shadow-inner outline-none"
                          />
                          <button 
                             onClick={() => {
                               navigator.clipboard.writeText("00020101021226830014br.gov.bcb.pix25610211029302192039120930129302190312903");
                               setCopiedPix(true);
                               setTimeout(() => setCopiedPix(false), 2000);
                             }}
                             className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 font-sans"
                          >
                             {copiedPix ? 'Copiado!' : 'Copiar'}
                          </button>
                       </div>
                     </div>

                     <div className="border border-amber-100 bg-amber-50/50 p-4 rounded-2xl text-left flex gap-3 text-amber-800 text-[11px] leading-relaxed">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="font-bold">Modo de Demonstração Ativo</p>
                          <p>O Pix real usará o gateway <span className="font-bold">{ownerProfile?.pixProvider || 'Mercado Pago'}</span> do fotógrafo. Para testar o fluxo simulado de liberação, clique no botão abaixo.</p>
                        </div>
                     </div>

                     <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => setCheckoutStep(2)}
                          className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-bold uppercase transition-all font-sans"
                        >
                          Voltar
                        </button>
                        <button 
                          onClick={simulateConfirmPayment}
                          className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 font-sans"
                        >
                          <Check className="w-4 h-4" /> Confirmar Pagamento Simulado
                        </button>
                     </div>
                  </div>
               ) : (
                  <form onSubmit={handleCardSubmit} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col space-y-6">
                     <div className="text-center">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                         <CreditCard className="w-6 h-6" />
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 font-sans">Cartão de Crédito</h3>
                       <p className="text-xs text-gray-500">Insira os dados do cartão fictício para simular o recebimento.</p>
                     </div>

                     <div className="space-y-4">
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nome no Cartão</label>
                         <input 
                           type="text" 
                           required
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] rounded-xl text-xs font-medium outline-none"
                           placeholder="Ex: JOAO DA SILVA"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Número do Cartão</label>
                         <input 
                           type="text" 
                           required
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] rounded-xl text-xs font-medium outline-none font-mono"
                           placeholder="4000 1234 5678 9010"
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block font-sans">Validade</label>
                           <input 
                             type="text" 
                             required
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] rounded-xl text-xs font-medium outline-none font-mono"
                             placeholder="MM/AA"
                           />
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block font-sans">Código CVV</label>
                           <input 
                             type="text" 
                             required
                             maxLength={4}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] rounded-xl text-xs font-medium outline-none font-mono"
                             placeholder="123"
                           />
                         </div>
                       </div>
                     </div>

                     <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-2xl text-left flex gap-3 text-blue-800 text-[11px] leading-relaxed">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <p className="font-bold">Processamento via {ownerProfile?.cardProvider || 'Stripe'}</p>
                          <p>Em produção real, as chaves API PK e SK configuradas globalmente carregarão as credenciais do seu estúdio de fotos.</p>
                        </div>
                     </div>

                     <div className="flex gap-3 pt-2">
                        <button 
                          type="button"
                          onClick={() => setCheckoutStep(2)}
                          className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-bold uppercase transition-all font-sans"
                        >
                          Voltar
                        </button>
                        <button 
                          type="submit"
                          className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 font-sans"
                        >
                          <CreditCard className="w-4 h-4" /> Concluir e Processar Cartão
                        </button>
                     </div>
                  </form>
               )}
            </div>
          ) : checkoutStep === 1 ? (
            <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nome Completo</label>
                    <input 
                      type="text" 
                      value={albumDetails.nome}
                      onChange={(e) => setAlbumDetails({ ...albumDetails, nome: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                      placeholder="Nome para entrega"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Endereço de Entrega</label>
                    <textarea 
                      value={albumDetails.endereco}
                      onChange={(e) => setAlbumDetails({ ...albumDetails, endereco: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium h-32 resize-none"
                      placeholder="Rua, Número, Bairro, Cidade, CEP..."
                    />
                  </div>

                  {isAlbum && (
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tamanho do Álbum</label>
                      <select 
                        value={albumDetails.tamanho}
                        onChange={(e) => setAlbumDetails({ ...albumDetails, tamanho: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium appearance-none"
                      >
                        <option value="20x20">20x20 cm</option>
                        <option value="25x25">25x25 cm</option>
                        <option value="30x30">30x30 cm</option>
                      </select>
                    </div>
                  )}

                  {!clientEmail && (
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Seu E-mail (Para salvar seu progresso)</label>
                      <input 
                        type="email" 
                        value={localEmail}
                        onChange={(e) => setLocalEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                        placeholder="seu@e-mail.com (Obrigatório)"
                      />
                    </div>
                  )}

                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-600 font-medium leading-relaxed">
                      O prazo estimado de produção e entrega é de 20 dias úteis após a confirmação do pagamento.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCheckoutStep(0)}
                      className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all font-sans"
                    >
                      Voltar
                    </button>
                    <button 
                      disabled={!albumDetails.nome || !albumDetails.endereco || (!clientEmail && !localEmail)}
                      onClick={() => setCheckoutStep(2)}
                      className="flex-[2] py-4 bg-[#111827] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans"
                    >
                      Próximo Passo <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
          ) : checkoutStep === 2 ? (
            <div className="max-w-xl mx-auto py-8 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#FFF0EB] rounded-2xl flex items-center justify-center mb-6 text-[#D05634]">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">Método de Pagamento</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-xs">
                    Selecione como deseja finalizar o pagamento do seu pedido de <span className="font-bold text-gray-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>.
                  </p>

                  <div className="grid grid-cols-1 gap-3 w-full mb-8">
                     {/* PIX Option */}
                     {isPixActive ? (
                       <button 
                         onClick={() => setSelectedMethod('pix')}
                         className={`flex items-center justify-between p-5 bg-white border-2 rounded-2xl transition-all group ${selectedMethod === 'pix' ? 'border-[#D05634] shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                       >
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase">PIX</div>
                             <div className="text-left">
                                 <p className="text-sm font-bold text-gray-900">Pix à Vista</p>
                                 <p className="text-[10px] text-emerald-500 font-bold uppercase">Liberação Imediata</p>
                             </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === 'pix' ? 'border-[#D05634] bg-[#D05634]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                             {selectedMethod === 'pix' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                       </button>
                     ) : (
                       <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl opacity-40 cursor-not-allowed">
                          <div className="flex items-center gap-4 py-1">
                             <div className="p-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs uppercase">PIX</div>
                             <div className="text-left">
                                 <p className="text-sm font-bold text-gray-400">Pix Indisponível</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">Fotógrafo não habilitou globalmente</p>
                             </div>
                          </div>
                       </div>
                     )}
                     
                     {/* Credit Card Option */}
                     {isCardActive ? (
                       <button 
                         type="button"
                         onClick={() => setSelectedMethod('card')}
                         className={`flex items-center justify-between p-5 bg-white border-2 rounded-2xl transition-all group ${selectedMethod === 'card' ? 'border-[#D05634] shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                       >
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-[#EBF5FF] text-[#0080FF] rounded-xl">
                                <CreditCard className="w-5 h-5" />
                             </div>
                             <div className="text-left">
                                 <p className="text-sm font-bold text-gray-900">Cartão de Crédito</p>
                                 <p className="text-[10px] text-blue-500 font-bold uppercase">Até 12x</p>
                             </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === 'card' ? 'border-[#D05634] bg-[#D05634]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                             {selectedMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                       </button>
                     ) : (
                       <div className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl opacity-40 cursor-not-allowed">
                          <div className="flex items-center gap-4 py-1">
                             <div className="p-3 bg-gray-100 text-gray-400 rounded-xl">
                                <CreditCard className="w-5 h-5" />
                             </div>
                             <div className="text-left">
                                 <p className="text-sm font-bold text-gray-400">Cartão de Crédito Indisponível</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase font-sans">Fotógrafo não habilitou globalmente</p>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>

                  {(!isPixActive && !isCardActive) && (
                    <p className="text-xs text-red-500 font-bold mb-6 font-sans">⚠️ Nenhum método de pagamento está configurado no momento pelo fotógrafo.</p>
                  )}

                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                    >
                      Voltar
                    </button>
                    <button 
                      onClick={handleAction}
                      disabled={!isPixActive && !isCardActive}
                      className="flex-[2] py-4 bg-[#D05634] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#D05634]/20 flex items-center justify-center gap-2 font-sans disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" /> Finalizar Pedido
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
              {/* Images Grid */}
              <div className="flex-1 space-y-8">
                {isAlbum && albumDetails.nome && (
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Truck className="w-6 h-6 text-[#D05634]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                         {albumDetails.nome}
                         <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500">{albumDetails.tamanho}</span>
                      </p>
                      <p className="text-xs text-gray-400 truncate">{albumDetails.endereco || 'Endereço não informado'}</p>
                    </div>
                    <button 
                      onClick={() => setCheckoutStep(1)}
                      className="ml-auto text-[10px] font-black text-[#D05634] uppercase tracking-widest hover:underline"
                    >
                      Alterar
                    </button>
                  </div>
                )}

                {newIndices.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                       {isAlbum ? 'Fotos no Álbum' : 'Novas Escolhas'} <span className="bg-[#D05634] text-white text-[10px] px-2 py-0.5 rounded-full">{newIndices.length}</span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                      {newIndices.map((idx, i) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                          <img src={galleryCollection.media[idx]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-white text-[10px] font-bold">#{idx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

            {alreadyDownloadedIndices.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-emerald-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                  Minhas Fotos <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">{alreadyDownloadedIndices.length}</span>
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  {alreadyDownloadedIndices.map((idx, i) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden ring-2 ring-emerald-500 ring-offset-1 relative group">
                      <img src={galleryCollection.media[idx]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                         <span className="text-white text-[10px] font-bold">#{idx + 1}</span>
                         <span className="text-[8px] bg-emerald-500 text-white px-1 rounded font-bold uppercase">Já Adquirida</span>
                      </div>
                      <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-emerald-600 mt-2 font-medium">Fotos já adquiridas podem ser baixadas novamente sem custo.</p>
              </section>
            )}

            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Store className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Carrinho vazio.</p>
              </div>
            )}
          </div>

          {/* Resume */}
          <div className="w-full md:w-80 bg-gray-50 rounded-2xl p-6 h-fit border border-gray-100 shrink-0">
            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">{isAlbum ? 'Resumo do Álbum' : 'Resumo do Pedido'}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">{isAlbum ? 'Fotos selecionadas' : 'Total de fotos'}</span>
                <span className="font-bold text-gray-900">{totalCount}</span>
              </div>

              {isAlbum && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium italic">Tamanho</span>
                  <span className="font-bold text-gray-900">{albumDetails.tamanho} cm</span>
                </div>
              )}

              {alreadyDownloadedIndices.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 font-medium italic">Já adquiridas</span>
                  <span className="font-bold text-emerald-600">-{alreadyDownloadedIndices.length}</span>
                </div>
              )}
              
              {remainingFreeCount > 0 && newIndices.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#D05634] font-medium">Fotos gratuitas restantes</span>
                  <span className="font-bold text-[#D05634]">-{Math.min(newIndices.length, remainingFreeCount)}</span>
                </div>
              )}

              {remainingFreeCount === 0 && freePhotos > 0 && newIndices.length > 0 && (
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700 font-medium leading-tight">
                  Limite de fotos gratuitas atingido. Adicionais custam R$ {photoPrice.toFixed(2)} cada.
                </div>
              )}

              <div className="flex justify-between text-sm pt-4 border-t border-gray-200">
                <span className="text-gray-500 font-medium">{isAlbum ? 'Total de fotos no álbum' : 'Fotos a pagar'}</span>
                <span className="font-bold text-gray-900">{isAlbum ? totalCount : billableCount}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>{isAlbum ? 'Preço por foto impressa' : 'Preço por foto'}</span>
                <span>R$ {photoPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-dashed border-gray-200 mb-8">
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total a Pagar</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Lock className="w-3 h-3" /> Seguro
                    </p>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleAction}
              className="w-full bg-[#D05634] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#D05634]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              style={{ backgroundColor: themeVars.primary }}
            >
              {checkoutStep === 2 ? 'Concluir Pedido' : 'Finalizar Compra'}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
              {isAlbum 
                ? 'Ao finalizar, você confirma que as fotos e o endereço de entrega estão corretos.'
                : 'Ao continuar, você concorda com os termos de uso e entrega digital das imagens.'}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
);
}

function PhotobookMockup({ images, onClose, onFinish, collection, onUpdateCollection }: { images: string[], onClose: () => void, onFinish: () => void, collection: any, onUpdateCollection?: (id: any, updates: any) => void }) {
  const hasExistingConfig = Boolean(collection.albumPages && collection.albumPages.length > 0);
  const [step, setStep] = useState<'format' | 'templates' | 'editor'>(hasExistingConfig ? 'editor' : 'format');

  const [albumFormat, setAlbumFormat] = useState<'square'|'landscape'|'portrait'>('square');
  const [albumSize, setAlbumSize] = useState('30x30');
  
  const [templateFilter, setTemplateFilter] = useState('Todos os Templates');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [borderType, setBorderType] = useState('Nenhuma');
  const [gapSize, setGapSize] = useState('Fina');

  const [showAutoBuildModal, setShowAutoBuildModal] = useState(false);
  const [autoBuildSpreads, setAutoBuildSpreads] = useState(Math.max(1, Math.ceil(images.length / 4)));

  const sizeOptions = {
    square: ['20x20', '25x25', '30x30'],
    landscape: ['30x20', '40x30'],
    portrait: ['20x30', '30x40']
  };

  const [bookPages, setBookPages] = useState<string[][]>(() => {
    if (collection.albumPagesObj) {
      return collection.albumPagesObj.map((p: any) => p.images || []);
    }
    if (collection.albumPages) return collection.albumPages;
    return [];
  });
  const [pageLayouts, setPageLayouts] = useState<Record<number, number>>(() => {
    if (collection.albumPageLayouts) return collection.albumPageLayouts;
    return {};
  });
  const [currentPage, setCurrentPage] = useState(0); 
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(0);
  const [showGuides, setShowGuides] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [panoSpreads, setPanoSpreads] = useState<number[]>([]);
  const [draggedItem, setDraggedItem] = useState<{pageIndex: number, imageIndex: number, src: string} | null>(null);
  const [imageFits, setImageFits] = useState<Record<string, 'cover' | 'contain'>>({});
  const [dockImageSize, setDockImageSize] = useState(80);

  const toggleImageFit = (src: string) => {
    setImageFits(prev => ({
      ...prev,
      [src]: prev[src] === 'contain' ? 'cover' : 'contain'
    }));
  };

  const handleDropImage = (e: React.DragEvent, targetPageIndex: number, targetImageIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { pageIndex: sourcePageIndex, imageIndex: sourceImageIndex } = draggedItem;

    if (sourcePageIndex === targetPageIndex && sourceImageIndex === targetImageIndex) return;

    const newPages = [...bookPages];

    if (sourcePageIndex === targetPageIndex) {
      const page = [...newPages[sourcePageIndex]];
      const temp = page[sourceImageIndex];
      page[sourceImageIndex] = page[targetImageIndex];
      page[targetImageIndex] = temp;
      newPages[sourcePageIndex] = page;
    } else {
      const sourcePage = [...newPages[sourcePageIndex]];
      const targetPage = [...newPages[targetPageIndex]];
      const sourceSrc = sourcePage[sourceImageIndex];
      const targetSrc = targetPage[targetImageIndex];

      sourcePage[sourceImageIndex] = targetSrc;
      targetPage[targetImageIndex] = sourceSrc;

      newPages[sourcePageIndex] = sourcePage;
      newPages[targetPageIndex] = targetPage;
    }
    
    handleUpdatePages(newPages);
    setDraggedItem(null);
  };

  // Layout definitions based on professional album styles - mathematically constrained to prevent margin overflow
  const getLayoutClasses = (numPhotos: number, layoutIdx: number = 0) => {
    if (numPhotos <= 1) return 'flex items-center justify-center w-full h-full';
    
    if (numPhotos === 2) {
      const layouts = [
        'grid-cols-2 grid-rows-1', // Side by side verticals
        'grid-rows-2 grid-cols-1', // Stacked horizontals
        'grid-cols-[2fr_1fr] grid-rows-1', // Big left, small right
        'grid-cols-[1fr_2fr] grid-rows-1', // Small left, big right
        'grid-rows-[2fr_1fr] grid-cols-1', // Big top, small bottom
        'grid-rows-[1fr_2fr] grid-cols-1', // Small top, big bottom
        'grid-cols-3 grid-rows-1 [&>*:first-child]:col-span-2', 
        'grid-cols-3 grid-rows-1 [&>*:last-child]:col-span-2',
      ];
      return 'grid gap-3 md:gap-4 w-full h-full ' + layouts[layoutIdx % layouts.length];
    }
    
    if (numPhotos === 3) {
      const layouts = [
        'grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2', // Large left, 2 small stacked right
        'grid-cols-2 grid-rows-2 grid-flow-col [&>*:last-child]:row-span-2', // 2 small stacked left, large right (grid-flow-col makes it safe)
        'grid-rows-2 grid-cols-2 [&>*:first-child]:col-span-2', // Large top, 2 small side-by-side bottom
        'grid-rows-2 grid-cols-2 [&>*:last-child]:col-span-2', // 2 small side-by-side top, large bottom
        'grid-cols-3 grid-rows-1', // 3 tall verticals
        'grid-rows-3 grid-cols-1', // 3 short horizontals
      ];
      return 'grid gap-3 md:gap-4 w-full h-full ' + layouts[layoutIdx % layouts.length];
    }
    
    if (numPhotos === 4) {
      const layouts = [
        'grid-cols-2 grid-rows-2', // 2x2 grid
        'grid-cols-[2fr_1fr] grid-rows-3 [&>*:first-child]:row-span-3', // Large left, 3 small stacked right
        'grid-cols-[1fr_2fr] grid-rows-3 grid-flow-col [&>*:last-child]:row-span-3', // 3 small left, large right
        'grid-rows-[2fr_1fr] grid-cols-3 [&>*:first-child]:col-span-3', // Large top, 3 small bottom
        'grid-rows-[1fr_2fr] grid-cols-3 [&>*:last-child]:col-span-3', // 3 small top, large bottom
        'grid-cols-4 grid-rows-1', // 4 slices
      ];
      return 'grid gap-3 md:gap-4 w-full h-full ' + layouts[layoutIdx % layouts.length];
    }
    
    if (numPhotos === 5) {
      const layouts = [
        'grid-cols-3 grid-rows-2 [&>*:first-child]:col-span-2', // 1 large top left + 1 top right + 3 bottom
        'grid-cols-3 grid-rows-2 [&>*:last-child]:col-span-2',  // 3 top + 1 bottom left + 1 large bottom right
        'grid-cols-3 grid-rows-2 [&>*:nth-child(2)]:row-span-2', // Center vertical takes 2 rows
        'grid-cols-4 grid-rows-2 [&>*:first-child]:col-span-4', // 1 massive top + 4 bottom
        'grid-cols-4 grid-rows-2 [&>*:last-child]:col-span-4', // 4 top + 1 massive bottom
        'grid-cols-5 grid-rows-1', // 5 slices
      ];
      return 'grid gap-3 md:gap-4 w-full h-full ' + layouts[layoutIdx % layouts.length];
    }
    
    if (numPhotos === 6) {
      const layouts = [
        'grid-cols-3 grid-rows-2',
        'grid-cols-2 grid-rows-3',
        'grid-cols-4 grid-rows-2 [&>*:first-child]:col-span-3', // 1 large top left + 1 top right + 4 bottom
        'grid-cols-4 grid-rows-2 [&>*:last-child]:col-span-3', 
        'grid-cols-6 grid-rows-1',
      ];
      return 'grid gap-3 md:gap-4 w-full h-full ' + layouts[layoutIdx % layouts.length];
    }

    // Generic fallback for 7+ photos to ensure they never break layout margins
    // We compute a safe generic grid dynamically using inline styles, but returning a generic class template for tailwind parsing
    const cols = Math.ceil(Math.sqrt(numPhotos));
    const layoutStrs = [
      `grid-cols-3`,
      `grid-cols-4`,
      `grid-cols-5`
    ];
    return `grid gap-2 md:gap-3 w-full h-full ${layoutStrs[layoutIdx % layoutStrs.length]}`;
  };

  const handleUpdatePagesAndLayouts = (newPages: string[][], newLayouts?: Record<number, number>) => {
    setBookPages(newPages);
    if (newLayouts) setPageLayouts(newLayouts);
    if (onUpdateCollection) {
      onUpdateCollection(collection.id, { 
        albumPagesObj: newPages.map(images => ({ images })),
        ...(newLayouts ? { albumPageLayouts: newLayouts } : null)
      });
    }
  };
  const [settings, setSettings] = useState(() => ({
    tamanho: collection.albumSettings?.tamanho || '20x20',
    nome: collection.albumSettings?.nome || '',
    endereco: collection.albumSettings?.endereco || '',
    status: collection.albumSettings?.status || 'Em edição'
  }));
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCollection) {
      await onUpdateCollection(collection.id, { 
        albumSettings: settings 
      });
    }
    setShowSettingsModal(false);
  };

  const handleUpdatePages = (newPages: string[][]) => {
    setBookPages(newPages);
    if (onUpdateCollection) {
      onUpdateCollection(collection.id, { albumPagesObj: newPages.map(images => ({ images })) });
    }
  };

  useEffect(() => {
    // Initial distribution: empty pages if not already initialized
    if (images.length > 0 && bookPages.length === 0) {
      // Start with the same number of pages as images, but empty, so the user can drag and drop
      handleUpdatePages(images.map(() => []));
    }
  }, [images, bookPages.length]);

  const totalSpreads = Math.ceil(bookPages.length / 2);

  const nextSpread = () => {
    const nextS = Math.min(totalSpreads - 1, currentPage + 1);
    setCurrentPage(nextS);
    setSelectedPageIndex(nextS * 2);
  };
  
  const prevSpread = () => {
    const prevS = Math.max(0, currentPage - 1);
    setCurrentPage(prevS);
    setSelectedPageIndex(prevS * 2);
  };

  const addImageToPage = (imageUrl: string) => {
    if (selectedPageIndex === null) return;
    const next = [...bookPages];
    if (next[selectedPageIndex]) {
      // Limit to 4 images per page for reasonable layout
      if (next[selectedPageIndex].length < 4) {
        next[selectedPageIndex] = [...next[selectedPageIndex], imageUrl];
      }
    }
    handleUpdatePages(next);
  };

  const removeImageFromPage = (pageIndex: number, imgIndex: number) => {
    const next = [...bookPages];
    if (next[pageIndex]) {
      next[pageIndex] = next[pageIndex].filter((_, i) => i !== imgIndex);
    }
    handleUpdatePages(next);
  };

  const addEmptyPage = () => {
    handleUpdatePages([...bookPages, []]);
  };

  const removePage = (pageIndex: number) => {
    if (bookPages.length <= 1) return;
    const next = bookPages.filter((_, i) => i !== pageIndex);
    handleUpdatePages(next);
    if (currentPage >= Math.ceil((bookPages.length - 1) / 2)) {
      setCurrentPage(Math.max(0, Math.ceil((bookPages.length - 1) / 2) - 1));
    }
  };

  const shuffleCurrentPage = () => {
    if (selectedPageIndex === null || !bookPages[selectedPageIndex]) return;
    const pageImages = [...bookPages[selectedPageIndex]];
    if (pageImages.length <= 1) return;
    
    // Cycle the layout index
    const currentLayoutIdx = pageLayouts[selectedPageIndex] || 0;
    const newLayouts = { ...pageLayouts, [selectedPageIndex]: currentLayoutIdx + 1 };
    
    // Also randomly scatter images
    for (let i = pageImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pageImages[i], pageImages[j]] = [pageImages[j], pageImages[i]];
    }
    
    const next = [...bookPages];
    next[selectedPageIndex] = pageImages;
    handleUpdatePagesAndLayouts(next, newLayouts);
  };

  const shuffleCurrentSpread = () => {
    const leftPgIndex = currentPage * 2;
    const rightPgIndex = currentPage * 2 + 1;
    
    const leftImages = bookPages[leftPgIndex] || [];
    const rightImages = bookPages[rightPgIndex] || [];
    const allImages = [...leftImages, ...rightImages];
    if (allImages.length <= 1) return;
    
    // Cycle layout index for BOTH pages
    const nextLayouts = { ...pageLayouts };
    
    // Randomly shuffle layouts completely instead of just +1
    nextLayouts[leftPgIndex] = Math.floor(Math.random() * 15);
    nextLayouts[rightPgIndex] = Math.floor(Math.random() * 15);
    
    // Randomly shuffle images across the entire spread
    for (let i = allImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
    }
    
    // Randomly determine split
    let minPerPg = 0;
    // Don't leave total blank empty pages unless the user asked
    let possibleLeftCounts = [];
    for (let i = 0; i <= allImages.length; i++) {
        if (i <= 6 && (allImages.length - i) <= 6) {
             possibleLeftCounts.push(i);
        }
    }
    
    let leftCount = possibleLeftCounts.length > 0
        ? possibleLeftCounts[Math.floor(Math.random() * possibleLeftCounts.length)]
        : leftImages.length;
        
    // Optionally trigger panorama if it's currently NOT pano, and we randomly decide to test it
    // But let's avoid toggling state variables inside this without explicit user command, 
    // simply redistributing photos across left/right is enough variety!
    
    const shuffledLeft = allImages.slice(0, leftCount);
    const shuffledRight = allImages.slice(leftCount);
    
    const next = [...bookPages];
    next[leftPgIndex] = shuffledLeft;
    next[rightPgIndex] = shuffledRight;
    handleUpdatePagesAndLayouts(next, nextLayouts);
  };

  const renderPage = (pageIndex: number) => {
    const pageImages = bookPages[pageIndex];
    if (pageIndex >= bookPages.length) return (
      <div className="flex-1 bg-[#F9FAFB] border-dashed border-2 border-gray-200 m-1 flex items-center justify-center">
        <button onClick={addEmptyPage} className="flex flex-col items-center gap-2 text-gray-300 hover:text-[#D05634] transition-colors group">
          <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Nova Página</span>
        </button>
      </div>
    );

    const isSelected = selectedPageIndex === pageIndex;

    return (
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedPageIndex(pageIndex)}
        className={`exportable-spread flex-1 bg-white relative overflow-hidden flex flex-col shadow-inner transition-all duration-300 ${isSelected ? 'ring-2 ring-inset ring-[#D05634] z-10' : 'z-0'} ${pageIndex % 2 === 0 ? 'rounded-l-[2px]' : 'rounded-r-[2px]'}`}
      >
        {/* Safe Margin Guides (Visual) */}
        {showGuides && (
          <div className="absolute inset-[14px] pointer-events-none z-20 border border-dashed border-blue-500/40"></div>
        )}

        <div className={`flex-1 h-full w-full relative z-0 ${showGuides ? 'p-4 md:p-8' : 'p-0'} ${getLayoutClasses(pageImages.length, pageLayouts[pageIndex] || 0)}`}>
          {pageImages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 text-gray-200 col-span-full row-span-full place-self-center">
               <ImageIcon className="w-16 h-16 opacity-10" />
               <p className="text-[9px] uppercase font-bold tracking-[0.3em]">Arraste uma foto aqui</p>
            </div>
          ) : (
            pageImages.map((src, idx) => (
              <motion.div 
                layout 
                key={`${src}-${idx}`}
                draggable
                onDragStart={(e) => {
                  setDraggedItem({ pageIndex, imageIndex: idx, src });
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropImage(e, pageIndex, idx)}
                onDoubleClick={(e) => { e.stopPropagation(); toggleImageFit(src); }}
                className={`relative group/img w-full h-full flex items-center justify-center cursor-move transition-transform min-h-0 min-w-0 overflow-hidden ${draggedItem?.src === src ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'}`}
              >
                <img 
                  src={src} 
                  className={`w-full h-full filter drop-shadow-sm pointer-events-none rounded-[1px] ${imageFits[src] === 'contain' ? 'object-contain' : 'object-cover'}`} 
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImageFromPage(pageIndex, idx);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Page Footer Navigation Info */}
        <div className={`absolute bottom-6 ${pageIndex % 2 === 0 ? 'left-10' : 'right-10'} text-[9px] font-bold text-gray-300 tracking-[0.3em] uppercase pointer-events-none`}>
          Pag {pageIndex + 1}
        </div>
        
        {/* Spine/Gutter Shadow Overlay (Realistic Crease) */}
        <div className={`absolute inset-y-0 ${pageIndex % 2 === 0 ? 'right-0 w-[40px] bg-gradient-to-l' : 'left-0 w-[40px] bg-gradient-to-r'} from-black/20 via-black/5 to-transparent z-10 pointer-events-none opacity-60`} />
        
        {/* Subtle page texture/sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/5 pointer-events-none" />
      </motion.div>
    );
  };

  if (step === 'format') {
    return (
      <div className="fixed inset-0 bg-[#F4F4F5] z-[100] flex flex-col items-center justify-center animate-in fade-in duration-300 p-6 select-none">
        <div className="absolute top-6 right-6">
          <button onClick={onClose} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 border border-transparent hover:border-red-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-10 max-w-3xl w-full shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-500">
          <h2 className="text-[22px] font-bold text-gray-900 mb-10 font-sans text-center">Formato e Tamanho do Álbum (cm):</h2>
          
          <div className="flex gap-10 sm:gap-14 mb-10 justify-center flex-wrap">
            <button 
              onClick={() => { setAlbumFormat('square'); setAlbumSize(sizeOptions.square[0]); }}
              className={`flex flex-col items-center gap-4 transition-all group`}
            >
              <div className={`w-32 h-32 rounded-lg border-4 flex items-center justify-center transition-all bg-gray-50 group-hover:bg-gray-100 ${albumFormat === 'square' ? 'border-[#0ab0c4] shadow-md' : 'border-gray-300'}`}>
                <div className={`w-14 h-14 border-[3px] rounded-sm transition-all ${albumFormat === 'square' ? 'border-[#0ab0c4]' : 'border-gray-400'}`}></div>
              </div>
            </button>
            <button 
              onClick={() => { setAlbumFormat('landscape'); setAlbumSize(sizeOptions.landscape[0]); }}
              className={`flex flex-col items-center gap-4 transition-all group`}
            >
              <div className={`w-40 h-32 rounded-lg border-4 flex items-center justify-center transition-all bg-gray-50 group-hover:bg-gray-100 ${albumFormat === 'landscape' ? 'border-[#0ab0c4] shadow-md' : 'border-gray-300'}`}>
                <div className={`w-[72px] h-12 border-[3px] rounded-sm transition-all ${albumFormat === 'landscape' ? 'border-[#0ab0c4]' : 'border-gray-400'}`}></div>
              </div>
            </button>
            <button 
              onClick={() => { setAlbumFormat('portrait'); setAlbumSize(sizeOptions.portrait[0]); }}
              className={`flex flex-col items-center gap-4 transition-all group`}
            >
              <div className={`w-[104px] h-32 rounded-lg border-4 flex items-center justify-center transition-all bg-gray-50 group-hover:bg-gray-100 ${albumFormat === 'portrait' ? 'border-[#0ab0c4] shadow-md' : 'border-gray-300'}`}>
                <div className={`w-10 h-14 border-[3px] rounded-sm transition-all ${albumFormat === 'portrait' ? 'border-[#0ab0c4]' : 'border-gray-400'}`}></div>
              </div>
            </button>
          </div>

          <div className="w-full max-w-[160px] mb-12 border-b-2 border-[#0ab0c4] focus-within:border-[#0999a9]">
            <select 
              value={albumSize}
              onChange={(e) => setAlbumSize(e.target.value)}
              className="w-full text-xl font-medium text-gray-800 pb-2 bg-transparent focus:outline-none cursor-pointer text-center appearance-none"
            >
              {sizeOptions[albumFormat].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setStep('templates')}
            className="self-end px-10 py-3.5 bg-[#fcd436] hover:bg-[#ebd24b] text-gray-900 font-bold rounded shadow-sm text-sm uppercase tracking-wide transition-all active:scale-95"
          >
            Próximo
          </button>
        </div>
      </div>
    );
  }

  if (step === 'templates') {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-300 select-none overflow-y-auto">
        <div className="w-full bg-[#f0f0f0] py-6 px-4 text-center font-bold text-[22px] text-gray-900 shadow-sm z-10 shrink-0">
          Biblioteca de Templates e Configurações de Aparência
        </div>
        
        <div className="absolute top-6 right-6 z-20">
          <button onClick={onClose} className="p-3 bg-white/50 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm transition-all active:scale-95 border border-transparent hover:border-red-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 flex flex-col gap-10 pb-32">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-bold text-gray-900 text-lg">Filtro da Biblioteca:</span>
              <select 
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="w-48 text-sm font-medium border-b border-gray-300 pb-1 bg-transparent focus:outline-none text-gray-700"
              >
                <option>Todos os Templates</option>
                <option>Apenas Selecionados</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
               {[
                 ['1','1','1'], 
                 ['1','1'], 
                 ['grid'], 
                 ['large-right'], 
                 ['large-left'], 
                 ['horizontal'], 
                 ['vertical'], 
                 ['grid-asym'], 
                 ['horizontal-split'], 
                 ['large-bottom']
               ].map((type, i) => (
                 <div key={i} className="aspect-[3/2] bg-white border border-gray-200 shadow-sm rounded-sm flex items-center justify-center p-2 hover:border-[#0ab0c4] hover:shadow-md transition-all cursor-pointer group">
                   <div className="w-full h-full flex flex-col sm:flex-row gap-1 bg-gray-50 p-1 group-hover:bg-cyan-50">
                      {type[0] === '1' && (
                        <>
                          <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                          {type.length > 1 && <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>}
                          {type.length > 2 && <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>}
                        </>
                      )}
                      {type[0] === 'grid' && (
                         <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1">
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="col-span-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                         </div>
                      )}
                      {type[0] === 'large-right' && (
                         <div className="w-full h-full flex gap-1">
                            <div className="w-1/3 flex flex-col gap-1">
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            </div>
                            <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                         </div>
                      )}
                      {type[0] === 'large-left' && (
                         <div className="w-full h-full flex gap-1">
                            <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            <div className="w-1/3 flex flex-col gap-1">
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            </div>
                         </div>
                      )}
                      {type[0] === 'horizontal' && (
                         <div className="w-full h-full flex flex-col justify-end">
                            <div className="h-2/3 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                         </div>
                      )}
                      {type[0] === 'large-bottom' && (
                         <div className="w-full h-full flex flex-col gap-1">
                            <div className="flex gap-1 h-3/4">
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="w-1/3"></div>
                            </div>
                         </div>
                      )}
                      {type[0] === 'horizontal-split' && (
                         <div className="w-full h-full flex gap-1 items-end pt-[20%]">
                            <div className="flex-[2] bg-[#86d7e3] opacity-80 rounded-[2px] h-full"></div>
                            <div className="flex-[1] flex flex-col gap-1 h-full">
                               <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                               <div className="flex-1"></div>
                            </div>
                         </div>
                      )}
                      {type[0] === 'vertical' && (
                         <div className="w-full h-full flex flex-col justify-center items-center">
                            <div className="w-2/3 h-full flex flex-col gap-1">
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="flex-[2] bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            </div>
                         </div>
                      )}
                      {type[0] === 'grid-asym' && (
                         <div className="w-full h-full flex gap-1">
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex-[2] bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex-1 bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                              <div className="flex-[2] bg-[#86d7e3] opacity-80 rounded-[2px]"></div>
                            </div>
                         </div>
                      )}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
             <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Aparência</h3>
             
             <div className="flex items-center gap-6">
               <span className="w-40 text-sm text-gray-700 font-medium">Cor do Fundo:</span>
               <div className="w-10 h-10 border border-gray-300 rounded cursor-pointer shadow-sm relative group bg-white overflow-hidden">
                 <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="absolute -inset-2 w-20 h-20 cursor-pointer" />
               </div>
             </div>

             <div className="flex items-center gap-6">
               <span className="w-40 text-sm text-gray-700 font-medium">Borda das Imagens:</span>
               <select value={borderType} onChange={(e) => setBorderType(e.target.value)} className="w-32 border-b border-gray-300 text-sm pb-1 bg-transparent focus:outline-none">
                 <option>Nenhuma</option>
                 <option>Fina</option>
                 <option>Grossa</option>
               </select>
               <span className="text-sm font-bold text-gray-500 w-10 text-right">0 pt</span>
               <div className="w-10 h-10 border border-gray-300 rounded bg-black cursor-pointer shadow-sm ml-2"></div>
             </div>

             <div className="flex items-center gap-6">
               <span className="w-40 text-sm text-gray-700 font-medium">Espaço entre imagens:</span>
               <select value={gapSize} onChange={(e) => setGapSize(e.target.value)} className="w-32 border-b border-gray-300 text-sm pb-1 bg-transparent focus:outline-none">
                 <option>Sem espaço</option>
                 <option>Fina</option>
                 <option>Média</option>
               </select>
               <span className="text-sm font-bold text-gray-500 w-10 text-right">8 pt</span>
             </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 py-6 px-10 bg-white flex justify-end items-center gap-6 z-20" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
           <button onClick={() => setStep('format')} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Voltar</button>
           <button onClick={() => setStep('editor')} className="px-10 py-3 bg-[#fcd436] hover:bg-[#ebd24b] text-gray-900 font-bold rounded shadow-sm text-sm uppercase tracking-wide transition-all active:scale-95">Começar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#353535] z-[100] flex flex-col animate-in fade-in duration-300 select-none">
      {/* Header with Navigation and Tools */}
      <div className="min-h-16 p-3 md:px-6 flex flex-col md:flex-row justify-between items-center bg-[#2d2d2d] border-b border-[#1a1a1a] shrink-0 z-50 gap-4 shadow-md">
        {/* Left Side: Logo/Info */}
        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
          <div className="w-10 h-10 bg-[#FFF0EB] rounded-xl flex items-center justify-center shadow-sm hidden md:flex">
            <BookOpen className="w-5 h-5 text-[#D05634]" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-white tracking-tight leading-none mb-1">{settings.nome || 'Meu Fotolivro'}</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">{images.length} fotos no projeto</p>
          </div>
        </div>

        {/* Center: Pagination & Primary Options */}
        <div className="flex flex-col items-center flex-[2] gap-3">
           <div className="flex items-center gap-6 bg-white rounded-full px-6 py-1.5 shadow-lg border border-gray-100/10">
              <button 
                disabled={currentPage === 0} 
                onClick={prevSpread} 
                className="p-1 hover:text-[#D05634] disabled:opacity-20 transition-all active:scale-75 text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center w-36">
                <span className="text-gray-900 text-sm font-black tracking-widest tabular-nums leading-none mt-1">
                  {currentPage * 2 + 1}—{Math.min(currentPage * 2 + 2, bookPages.length)}
                </span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 mb-1">Total {bookPages.length} Páginas</span>
              </div>
              <button 
                disabled={currentPage >= Math.ceil(bookPages.length / 2) - 1} 
                onClick={nextSpread} 
                className="p-1 hover:text-[#D05634] disabled:opacity-20 transition-all active:scale-75 text-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           
           <div className="flex items-center gap-3">
             <button 
               onClick={shuffleCurrentPage} 
               disabled={selectedPageIndex === null || !bookPages[selectedPageIndex] || bookPages[selectedPageIndex].length <= 1}
               className="text-[9px] uppercase tracking-wider font-bold text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 transition-colors py-1 px-3 rounded-full flex items-center gap-1.5 border border-white/5 bg-white/5"
             >
               <RefreshCcw className="w-3 h-3" /> Embaralhar Página
             </button>
             <button 
               onClick={shuffleCurrentSpread} 
               disabled={(() => {
                 const leftCount = bookPages[currentPage * 2]?.length || 0;
                 const rightCount = bookPages[currentPage * 2 + 1]?.length || 0;
                 return (leftCount + rightCount) <= 1;
               })()}
               className="text-[9px] uppercase tracking-wider font-bold text-[#fcd436] hover:text-[#ebd24b] disabled:opacity-30 disabled:hover:text-[#fcd436] transition-colors py-1 px-3 rounded-full flex items-center gap-1.5 border border-[#fcd436]/10 bg-[#fcd436]/10"
             >
               <RefreshCw className="w-3 h-3" /> Embaralhar Lâmina
             </button>
             <button 
               onClick={() => {
                 if (panoSpreads.includes(currentPage)) {
                    setPanoSpreads(panoSpreads.filter(p => p !== currentPage));
                 } else {
                    setPanoSpreads([...panoSpreads, currentPage]);
                 }
               }} 
               className={`text-[9px] uppercase tracking-wider font-bold py-1 px-3 rounded-full flex items-center gap-1.5 transition-colors border ${panoSpreads.includes(currentPage) ? 'bg-[#0ab0c4]/20 text-[#0ab0c4] border-[#0ab0c4]/30' : 'bg-white/5 text-gray-300 hover:text-white border-white/5'}`}
             >
               <Maximize className="w-3 h-3" /> Lâmina Panorâmica
             </button>
           </div>
        </div>
        
        {/* Right Side: Tools & Actions */}
        <div className="flex flex-1 items-center justify-end gap-3 flex-wrap w-full md:w-auto">
          <label className="flex flex-col items-center gap-1 cursor-pointer group text-center mr-2">
            <div className={`w-6 h-3 rounded-full border transition-colors relative ${showGuides ? 'bg-[#0ab0c4] border-[#0ab0c4]' : 'border-[#666] bg-transparent'}`}>
              <div className={`absolute top-[2px] w-1.5 h-1.5 rounded-full bg-white transition-all ${showGuides ? 'left-3.5' : 'left-0.5'}`}></div>
            </div>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-200">Margem</span>
            <input type="checkbox" checked={showGuides} onChange={e => setShowGuides(e.target.checked)} className="sr-only" />
          </label>

          <button onClick={() => setShowAutoBuildModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fcd436] text-[#2d2d2d] rounded-sm text-[9px] font-bold uppercase tracking-wider hover:bg-[#ebd24b] transition-all">
            <Sparkles className="w-3 h-3" /> Auto Build
          </button>
          
          <button onClick={() => setShowSettingsModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white rounded-sm text-[9px] font-bold uppercase tracking-wider hover:bg-white/20 transition-all border border-white/10">
            <Settings className="w-3 h-3" /> Ajustes
          </button>

          <button onClick={onClose} className="p-1.5 bg-[#444] text-gray-300 hover:text-red-400 hover:bg-[#555] rounded-lg shadow-sm transition-all active:scale-95 ml-2 hidden">
            <X className="w-4 h-4" />
          </button>
          <button 
             onClick={onFinish}
             className="flex items-center gap-1.5 px-4 py-1.5 ml-2 bg-[#D05634] text-white rounded-sm text-[9px] font-bold uppercase tracking-wider hover:bg-[#b04a2d] transition-all shadow-md active:scale-95"
          >
            <Check className="w-3 h-3" />
            Finalizar Pedido
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Main Content */}
        <div className="flex-1 flex flex-col items-center pt-10 pb-32 px-8 md:px-12 lg:px-20 overflow-y-auto bg-[#353535] relative custom-scrollbar">
          
          <div 
            className="relative w-full max-w-6xl flex group h-auto shrink-0 mx-auto z-10 mb-20 shadow-2xl transition-all duration-500"
            style={{ 
              aspectRatio: '2 / 1',
              maxWidth: settings.tamanho === '30x30' ? '1200px' : settings.tamanho === '25x25' ? '1000px' : '800px'
            }}
          >
            {/* Visual Guides: Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/10 z-30 -translate-x-1/2" title="Vinco Central" />
            
            {/* Hardcover Frame */}
            <div className="absolute inset-[-18px] md:inset-[-32px] bg-[#1a1a1a] rounded-[8px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-15px_rgba(0,0,0,0.6)] z-0" />
            <div className="absolute inset-[-6px] bg-[#222] rounded-[4px] z-1 shadow-inner" />

            {/* The Pages Spread Container */}
            <div className="relative flex-1 bg-white flex perspective-2000 shadow-2xl overflow-hidden z-20 rounded-[2px] border border-gray-100">
              
              <AnimatePresence mode="wait" initial={false}>
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, x: 20, filter: "brightness(0.9)" }}
                  animate={{ opacity: 1, x: 0, filter: "brightness(1)" }}
                  exit={{ opacity: 0, x: -20, filter: "brightness(0.9)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-1 h-full w-full"
                >
                  {panoSpreads.includes(currentPage) ? (
                    <div className="flex-1 bg-white relative overflow-hidden flex flex-col shadow-inner z-0">
                      {/* Spine Crease / Binding inside pano */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-2 md:w-3.5 bg-black/10 z-30 -translate-x-1/2 pointer-events-none drop-shadow-sm flex">
                        <div className="w-1/2 h-full bg-gradient-to-r from-black/20 to-transparent" />
                        <div className="w-[1px] h-full bg-black/30" />
                        <div className="w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent" />
                      </div>
                      
                      <div className="absolute inset-y-0 right-0 w-[40px] bg-gradient-to-l from-black/20 via-black/5 to-transparent z-10 pointer-events-none opacity-60" />
                      <div className="absolute inset-y-0 left-0 w-[40px] bg-gradient-to-r from-black/20 via-black/5 to-transparent z-10 pointer-events-none opacity-60" />

                      {(() => {
                        const leftPageImgs = bookPages[currentPage * 2] || [];
                        const rightPageImgs = bookPages[currentPage * 2 + 1] || [];
                        const allPanoImgs = [...leftPageImgs, ...rightPageImgs];
                        
                        return (
                          <div className={`flex-1 h-full w-full relative z-0 ${showGuides ? 'p-4 md:p-8' : 'p-0'} ${getLayoutClasses(allPanoImgs.length, pageLayouts[currentPage * 2] || 0)}`}>
                            {allPanoImgs.length === 0 ? (
                              <div className="flex flex-col items-center gap-4 text-gray-200 col-span-full row-span-full place-self-center">
                                 <ImageIcon className="w-16 h-16 opacity-10" />
                                 <p className="text-[9px] uppercase font-bold tracking-[0.3em]">Arraste uma foto aqui</p>
                              </div>
                            ) : (
                              allPanoImgs.map((src, absoluteIdx) => {
                                const srcPageIndex = absoluteIdx < leftPageImgs.length ? currentPage * 2 : currentPage * 2 + 1;
                                const srcImageIndex = absoluteIdx < leftPageImgs.length ? absoluteIdx : absoluteIdx - leftPageImgs.length;
                                return (
                                  <motion.div 
                                    layout 
                                    key={`${src}-${absoluteIdx}`}
                                    draggable
                                    onDragStart={(e) => {
                                      setDraggedItem({ pageIndex: srcPageIndex, imageIndex: srcImageIndex, src });
                                      e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDropImage(e, srcPageIndex, srcImageIndex)}
                                    onDoubleClick={(e) => { e.stopPropagation(); toggleImageFit(src); }}
                                    className={`relative group/img w-full h-full flex items-center justify-center cursor-move transition-transform min-h-0 min-w-0 overflow-hidden ${draggedItem?.src === src ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'}`}
                                  >
                                    <img 
                                      src={src} 
                                      className={`w-full h-full filter drop-shadow-sm pointer-events-none rounded-[1px] ${imageFits[src] === 'contain' ? 'object-contain' : 'object-cover'}`} 
                                      referrerPolicy="no-referrer"
                                      alt=""
                                    />
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImageFromPage(srcPageIndex, srcImageIndex);
                                      }}
                                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <>
                      {/* Left Page Spread */}
                      {renderPage(currentPage * 2)}
                      
                      {/* Spine Crease / Binding */}
                      <div className="relative w-2 md:w-3.5 bg-[#E5E7EB] z-30 flex">
                        <div className="w-1/2 h-full bg-gradient-to-r from-black/25 to-transparent" />
                        <div className="w-[1px] h-full bg-black/15" />
                        <div className="w-1/2 h-full bg-gradient-to-l from-black/25 to-transparent" />
                      </div>

                      {/* Right Page Spread */}
                      {renderPage(currentPage * 2 + 1)}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-gray-100 to-transparent z-40 opacity-20" />
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-gray-100 to-transparent z-40 opacity-20" />
            </div>
          </div>



        </div>

        {/* Bottom Bar - Photos Dock */}
        <div className="bg-[#282828] border-t border-[#1a1a1a] flex flex-col shrink-0 overflow-hidden shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-40 relative">
          <div className="p-3 md:px-6 border-b border-[#3a3a3a] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-gray-200 uppercase tracking-[0.2em] hidden md:block">Imagens do Projeto</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight hidden lg:block">Arraste ou clique para adicionar</p>
              
              <div className="flex items-center gap-2">
                <ZoomOut className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="range" 
                  min="40" 
                  max="160" 
                  value={dockImageSize}
                  onChange={(e) => setDockImageSize(Number(e.target.value))}
                  className="w-20 md:w-32 accent-[#fcd436]"
                />
                <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
            {(() => {
              const usedCount = new Set(bookPages.flat()).size;
              return (
                <div className="flex gap-1.5" title={`${usedCount} usadas, ${images.length - usedCount} restantes`}>
                  {usedCount > 0 && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">{usedCount} usadas</span>}
                  <span className="bg-[#D05634] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">{images.length - usedCount} restantes</span>
                </div>
              );
            })()}
          </div>
          <div className="overflow-x-auto overflow-y-hidden p-4 pb-6 custom-scrollbar" style={{ minHeight: '120px' }}>
            <div className="grid grid-flow-col gap-3 w-max auto-cols-max" style={{ gridTemplateRows: 'repeat(2, auto)' }}>
              {images.map((img, i) => {
                const isUsed = new Set(bookPages.flat()).has(img);
                return (
                  <button 
                    key={img + i} 
                    onClick={() => addImageToPage(img)}
                    style={{ width: `${dockImageSize}px`, height: `${dockImageSize * 0.666}px` }}
                    className={`group relative rounded overflow-hidden bg-[#222] border-2 transition-all hover:scale-105 active:scale-95 shadow-md flex-shrink-0 ${isUsed ? 'border-emerald-500/80 opacity-40 grayscale-[50%]' : 'border-transparent hover:border-[#D05634]'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {isUsed && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                    {!isUsed && (
                      <div className="absolute inset-0 bg-[#D05634]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white p-2 rounded-full shadow-xl">
                          <Plus className="w-3 h-3 text-[#D05634]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFF0EB] rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-[#D05634]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Configurações</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Detalhes do seu projeto</p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tamanho</label>
                      <select 
                        value={settings.tamanho}
                        onChange={(e) => setSettings({ ...settings, tamanho: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium appearance-none"
                      >
                        <option value="20x20">20x20 cm</option>
                        <option value="25x25">25x25 cm</option>
                        <option value="30x30">30x30 cm</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                      <div className="w-full px-5 py-4 bg-[#FFF0EB] text-[#D05634] font-black uppercase text-[10px] tracking-widest rounded-2xl border border-[#D05634]/10 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {settings.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex gap-4 mt-6">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-600 font-bold leading-relaxed">
                        Prazo de Entrega: <span className="underline">20 dias úteis</span>
                      </p>
                      <p className="text-[10px] text-blue-500/80 font-medium leading-relaxed mt-1">
                        Após a confirmação do pagamento, seu álbum entrará automaticamente em produção.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowSettingsModal(false)}
                      className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-[#D05634] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-[#D05634]/20 transition-all active:scale-[0.98]"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto Build Modal */}
      <AnimatePresence>
        {showAutoBuildModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 w-full">Auto Construir - {images.length} imagens</h2>
              </div>

              <div className="flex gap-4 mb-6">
                 <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-center">
                    <div className="text-3xl font-black text-gray-900 leading-none mb-1">{autoBuildSpreads}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lâminas ({autoBuildSpreads * 2} Pág)</div>
                 </div>
                 <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-center">
                    <div className="text-3xl font-black text-gray-900 leading-none mb-1">1 to 7</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Imagens X Lâmina</div>
                 </div>
              </div>

              <div className="mb-6">
                 <input 
                    type="range" 
                    min={Math.ceil(images.length / 7)} 
                    max={images.length} 
                    value={autoBuildSpreads}
                    onChange={(e) => setAutoBuildSpreads(parseInt(e.target.value))}
                    className="w-full cursor-grab active:cursor-grabbing h-1 bg-gray-200 rounded-full appearance-none outline-none focus:outline-none accent-[#0ab0c4]"
                 />
              </div>

              <div className="space-y-4 text-sm text-gray-700 bg-gray-50 border border-gray-100 p-4 rounded-sm">
                 <div className="flex justify-between font-bold border-b border-gray-200 pb-2 mb-2">
                    <span>Agrupamento de Imagens:</span>
                 </div>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="grouping" defaultChecked className="accent-[#0ab0c4] w-4 h-4 cursor-pointer" />
                    <span>Agrupamento Inteligente</span>
                 </label>
                 <div className="pl-6 space-y-2 opacity-80">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                       <input type="checkbox" defaultChecked className="accent-[#0ab0c4] cursor-pointer rounded-sm" />
                       Blocos de tempo
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                       <input type="checkbox" defaultChecked className="accent-[#0ab0c4] cursor-pointer rounded-sm" />
                       Preto e branco
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                       <input type="checkbox" defaultChecked className="accent-[#0ab0c4] cursor-pointer rounded-sm" />
                       Metadados
                    </label>
                 </div>
                 <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input type="radio" name="grouping" className="accent-[#0ab0c4] w-4 h-4 cursor-pointer" />
                    <span>Especificar Média</span>
                 </label>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                 <button onClick={() => setShowAutoBuildModal(false)} className="px-6 py-2.5 text-gray-600 font-bold text-sm bg-gray-100 hover:bg-gray-200 rounded shadow-sm transition-all text-center">
                    Cancelar
                 </button>
                 <button 
                    onClick={() => {
                      const used = new Set(bookPages.flat().filter(Boolean));
                      const unused = images.filter(img => !used.has(img));
                      const existingFilledPages = bookPages.filter(page => page.length > 0);
                      
                      if (unused.length === 0 && existingFilledPages.length > 0) {
                        alert('Todas as fotos já estão no fotolivro!');
                        handleUpdatePagesAndLayouts(existingFilledPages, pageLayouts);
                        setShowAutoBuildModal(false);
                        return;
                      }
                      
                      const newPages = [...existingFilledPages];
                      const imgsPerSpread = Math.ceil(unused.length / autoBuildSpreads);
                      let maxImagePtr = 0;
                      
                      for (let i = 0; i < autoBuildSpreads; i++) {
                         if (maxImagePtr >= unused.length) break;
                         let spreadImgs = unused.slice(maxImagePtr, maxImagePtr + imgsPerSpread);
                         // divide spreadImgs into left/right pages
                         const left = spreadImgs.slice(0, Math.ceil(spreadImgs.length / 2));
                         const right = spreadImgs.slice(Math.ceil(spreadImgs.length / 2));
                         newPages.push(left);
                         newPages.push(right);
                         maxImagePtr += imgsPerSpread;
                      }
                      
                      // Make sure we have an even number of pages
                      if (newPages.length % 2 !== 0) {
                          newPages.push([]);
                      }

                      handleUpdatePagesAndLayouts(newPages, pageLayouts);
                      setShowAutoBuildModal(false);
                    }} 
                    className="px-6 py-2.5 bg-[#fcd436] hover:bg-[#ebd24b] text-gray-900 font-bold rounded shadow-sm text-sm uppercase tracking-wide transition-all text-center"
                 >
                    Auto Construir
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PublicFolderView({ folder, collections }: { folder: any, collections: any[] }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {folder.image && (
        <div className="w-full h-[40vh] relative mb-12 shadow-md">
          <img 
            src={folder.image} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{folder.title}</h1>
            {folder.date && <p className="text-white/80 font-medium text-lg">{folder.date}</p>}
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-6 ${folder.image ? 'py-0 pb-16' : 'py-16'}`}>
        {!folder.image && (
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{folder.title}</h1>
            {folder.date && <p className="text-gray-500 font-medium">{folder.date}</p>}
          </div>
        )}

        {collections.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Esta pasta está vazia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map(col => (
               <a 
                 key={col.id} 
                 href={`?gallery=${col.slug || col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                 className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 block"
               >
                 <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {col.image ? (
                       <img src={col.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    ) : col.media && col.media.length > 0 ? (
                       <img src={col.media[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400">Vazio</div>
                    )}
                    {col.status === "Público" || col.status === "Pública" ? (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
                        Público
                      </div>
                    ) : null}
                 </div>
                 <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#D05634] transition-colors line-clamp-1">{col.title}</h3>
                    <div className="mt-2 flex items-end justify-between">
                       <div className="flex flex-col">
                         <span className="text-gray-400 font-medium text-[10px]">Publicado:</span>
                         <span className="text-gray-500 font-medium text-xs leading-none">{col.date || 'Sem data'}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-[10px] text-emerald-500">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                           Publicado
                         </span>
                         {col.storeEnabled && (
                           <span className="bg-[#22C55E] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wide text-[9px]">Loja</span>
                         )}
                       </div>
                    </div>
                 </div>
               </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function resizeImage(url: string, targetSize: number | null): Promise<Blob> {
  const response = await fetch(url);
  const blob = await response.blob();
  
  if (!targetSize) return blob;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const { width, height } = img;
      const longestSide = Math.max(width, height);

      if (longestSide <= targetSize) {
        resolve(blob);
        URL.revokeObjectURL(img.src);
        return;
      }

      const ratio = targetSize / longestSide;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error('Canvas toBlob failed'));
        URL.revokeObjectURL(img.src);
      }, 'image/jpeg', 0.95);
    };
    img.onerror = () => {
      reject(new Error('Image load failed'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(blob);
  });
}

function PublicGalleryView({ collection, parentFolder, onUpdateCollection }: { collection: any, parentFolder?: any, onUpdateCollection?: (id: any, updates: any) => void }) {
  const [photobookSelection, setPhotobookSelection] = useState<string[]>([]);
  const [showPhotobook, setShowPhotobook] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartIsAlbum, setCartIsAlbum] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorInput, setErrorInput] = useState(false);
  const [clientError, setClientError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isBlackout, setIsBlackout] = useState(false);
  const modifierKeys = useRef({ shift: false, meta: false, ctrl: false });

  const [sessionId] = useState(() => 'SES-' + Math.random().toString(36).substring(2, 9).toUpperCase());
  const [sessionSecret] = useState(() => generateLocalSessionSecret());
  const [devtoolsBlockActive, setDevtoolsBlockActive] = useState(false);

  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [localInputEmail, setLocalInputEmail] = useState('');
  const [localInputName, setLocalInputName] = useState('');
  const [identityError, setIdentityError] = useState('');

  useSecurityEnforcer({
    collectionId: collection?.id,
    antiPrintEnabled: !!collection?.antiPrintEnabled,
    clientEmail: clientEmail || 'anon@anon.com',
    clientName: localStorage.getItem(`client_name_${collection?.id}`) || clientEmail?.split('@')[0] || 'Cliente',
    sessionId,
    onBlockStatusChange: (status) => setIsBlackout(status),
    onDevtoolsDetected: (detected) => setDevtoolsBlockActive(detected)
  });
  const [pendingSelectionUrl, setPendingSelectionUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!collection?.antiPrintEnabled) {
      setIsBlackout(false);
      return;
    }

    const removeBlackout = () => {
      if (
        (modifierKeys.current.meta && modifierKeys.current.shift) ||
        (modifierKeys.current.ctrl && modifierKeys.current.shift)
      ) {
        return; // Don't remove blackout if screenshot modifiers are still held down
      }
      setIsBlackout(false);
    };

    const handleScreenshotKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') modifierKeys.current.shift = true;
      if (e.key === 'Meta') modifierKeys.current.meta = true;
      if (e.key === 'Control') modifierKeys.current.ctrl = true;

      if (
        e.key === 'PrintScreen' || 
        (e.metaKey && e.shiftKey) || 
        (e.ctrlKey && e.shiftKey) || // Broader check if both are held
        (e.ctrlKey && e.key === 'p')
      ) {
        setIsBlackout(true);
        try { navigator.clipboard.writeText('Captura de tela protegida.'); } catch(e) {}
      }
    };

    const handleScreenshotKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') modifierKeys.current.shift = false;
      if (e.key === 'Meta') modifierKeys.current.meta = false;
      if (e.key === 'Control') modifierKeys.current.ctrl = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      modifierKeys.current.shift = e.shiftKey;
      modifierKeys.current.meta = e.metaKey;
      modifierKeys.current.ctrl = e.ctrlKey;
    };

    const handleCopy = (e: ClipboardEvent) => {
       e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
       e.preventDefault();
    };

    const handleBlur = () => {
      setIsBlackout(true);
    };
    
    const handleFocus = () => {
      setTimeout(removeBlackout, 2000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlackout(true);
      } else {
        setTimeout(removeBlackout, 2000);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsBlackout(true);
      }
    };

    const handleMouseEnter = () => {
      setTimeout(removeBlackout, 1500);
    };

    window.addEventListener('keydown', handleScreenshotKeyDown);
    window.addEventListener('keyup', handleScreenshotKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleScreenshotKeyDown);
      window.removeEventListener('keyup', handleScreenshotKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [collection?.antiPrintEnabled]);

  const [quotaExceeded, setQuotaExceeded] = useState(() => {
    try {
      return sessionStorage.getItem('firestore_quota_exceeded') === 'true' || (window as any).isFirestoreQuotaExceeded === true;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('firestore-quota-exceeded', handleQuota);
    return () => window.removeEventListener('firestore-quota-exceeded', handleQuota);
  }, []);

  // Try to load cached identification on mount
  useEffect(() => {
    try {
      const cachedEmail = localStorage.getItem(`client_email_${collection.id}`);
      if (cachedEmail) {
        setClientEmail(cachedEmail);
        setIsClientAuthenticated(true);
      }
    } catch (_) {}
  }, [collection.id]);

  // Sync selections with Server for client (works for both store and regular select)
  useEffect(() => {
    if (isClientAuthenticated && clientEmail) {
      const selections = photobookSelection.map(url => collection.media.indexOf(url)).filter(i => i !== -1);
      
      const updateSelection = async () => {
        try {
          const sanitizedKey = clientEmail.trim().replace(/\./g, '_');
          const cachedName = localStorage.getItem(`client_name_${collection.id}`) || '';
          
          // Verify if selections actually changed compared to currently stored selections to avoid update loops
          const storedData = collection.clientSelections?.[sanitizedKey];
          const storedSelections = storedData?.selection || [];
          const isSame = storedSelections.length === selections.length && 
                         storedSelections.every((val: number, idx: number) => val === selections[idx]);
          
          if (isSame) {
            return; // Skip if no change in selections
          }

          const newSelections = {
            ...(collection.clientSelections || {}),
            [sanitizedKey]: {
              ...(collection.clientSelections?.[sanitizedKey] || {}),
              selection: selections,
              updatedAt: new Date().toISOString(),
              email: clientEmail,
              ...(cachedName ? { name: cachedName } : {})
            }
          };

          if (onUpdateCollection) {
            onUpdateCollection(collection.id, { clientSelections: newSelections });
          }
        } catch (err: any) {
          console.error("Error updating local client selection:", err);
        }
      };

      // Debounce the update
      const timer = setTimeout(updateSelection, 3000);
      return () => clearTimeout(timer);
    }
  }, [photobookSelection, isClientAuthenticated, clientEmail, collection.id, collection.media, onUpdateCollection]);

  // Load initial selections if any
  useEffect(() => {
    if (isClientAuthenticated && clientEmail && collection.clientSelections) {
      const key = clientEmail.replace(/\./g, '_');
      const data = collection.clientSelections[key];
      if (data && data.selection) {
        const urls = data.selection.map((idx: number) => collection.media[idx]).filter(Boolean);
        // Only update state if URLs list is different to avoid state-trigger loop
        if (JSON.stringify(urls) !== JSON.stringify(photobookSelection)) {
          setPhotobookSelection(urls);
        }
      }
    }
  }, [isClientAuthenticated, clientEmail, collection.clientSelections, collection.media, photobookSelection]);

  const startBatchDownload = async () => {
    if (!collection.media || collection.media.length === 0) return;
    
    // Resolution logic from user requirements
    const sizesPriority = ['original', 'large', 'medium', 'small'];
    const activeSizes = collection.downloadSizes || ['original'];
    const targetSizeKey = sizesPriority.find(s => activeSizes.includes(s)) || 'original';
    
    let targetPx: number | null = null;
    if (targetSizeKey === 'small') targetPx = 900;
    else if (targetSizeKey === 'medium') targetPx = 1920;
    else if (targetSizeKey === 'large') targetPx = 4000;

    let directoryHandle: any = null;
    const supportsFileSystemAccess = 'showDirectoryPicker' in window;

    try {
      if (supportsFileSystemAccess) {
        // Desktop: Try to open directory picker
        directoryHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite'
        });
      } else {
        // Mobile/Unsupported: Browser-level confirmation
        const confirmed = confirm(`Deseja iniciar o download das fotos (Resolução: ${targetSizeKey})? Elas serão salvas na sua pasta padrão de downloads.`);
        if (!confirmed) return;
      }
    } catch (err) {
      console.warn('Seleção de pasta cancelada ou não suportada:', err);
      // If user cancelled or it failed (e.g. iframe restrictions), we stop here
      return;
    }
    
    setIsDownloadingAll(true);
    setDownloadProgress(0);

    for (let i = 0; i < collection.media.length; i++) {
      try {
        const url = collection.media[i];
        const fileName = `foto-${i + 1}.jpg`;

        // Resize the image according to the specified rules
        const processedBlob = await resizeImage(url, targetPx);

        if (directoryHandle) {
          // Direct file writing approach
          try {
            const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(processedBlob);
            await writable.close();
          } catch (writeError) {
            console.error('Erro ao escrever arquivo (CORS ou Permissão):', writeError);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(processedBlob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
          }
        } else {
          // Standard anchor download fallback (Mobile)
          const link = document.createElement('a');
          link.href = URL.createObjectURL(processedBlob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        }
        
        // Update progress
        setDownloadProgress(Math.round(((i + 1) / collection.media.length) * 100));
        
        // directoryHandle writes can be faster as they don't trigger browser download UI
        await new Promise(resolve => setTimeout(resolve, directoryHandle ? 100 : 800));
      } catch (err) {
        console.error('Erro ao baixar foto:', err);
      }
    }

    // Success state
    setTimeout(() => {
      setIsDownloadingAll(false);
      setDownloadProgress(0);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev! + 1) % (collection.media?.length || 1));
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev! - 1 + (collection.media?.length || 1)) % (collection.media?.length || 1));
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, collection.media?.length]);
  useEffect(() => {
    // If mounted and empty, ask for sync just in case
    if (collection && (!collection.media || collection.media.length === 0)) {
      const timer = setTimeout(() => {
        bc.postMessage({ type: 'request_sync' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [collection?.media?.length]);

  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = localInputEmail.trim();
    if (!cleanedEmail) {
      setIdentityError('Por favor, informe seu e-mail.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      setIdentityError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      localStorage.setItem(`client_email_${collection.id}`, cleanedEmail);
      if (localInputName.trim()) {
        localStorage.setItem(`client_name_${collection.id}`, localInputName.trim());
      }
    } catch (_) {}

    setClientEmail(cleanedEmail);
    setIsClientAuthenticated(true);
    setShowIdentityModal(false);

    // Apply the pending selection if there is one
    if (pendingSelectionUrl) {
      setPhotobookSelection(prev => 
        prev.includes(pendingSelectionUrl) ? prev : [...prev, pendingSelectionUrl]
      );
      setPendingSelectionUrl(null);
    }
  };

  const togglePhotobookSelection = (url: string) => {
    if (!clientEmail) {
      setPendingSelectionUrl(url);
      setLocalInputEmail('');
      setLocalInputName('');
      setIdentityError('');
      setShowIdentityModal(true);
      return;
    }
    setPhotobookSelection(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Galeria não encontrada
      </div>
    );
  }

  const getThemeVars = (themeId?: string) => {
    const theme = themeId || collection?.theme || 'light';
    switch (theme) {
      case 'gold': return { bg: '#FCF8F2', text: '#242424', primary: '#C5A059', isDark: false };
      case 'rose': return { bg: '#FFF5F5', text: '#4A3131', primary: '#B06D6D', isDark: false };
      case 'terracotta': return { bg: '#FFF2EE', text: '#3E2723', primary: '#D05634', isDark: false };
      case 'sand': return { bg: '#F8F5F0', text: '#4A4A4A', primary: '#C2B280', isDark: false };
      case 'olive': return { bg: '#F2F4F0', text: '#2F3E2F', primary: '#708238', isDark: false };
      case 'agave': return { bg: '#F0F4F4', text: '#2C3E50', primary: '#82A3A1', isDark: false };
      case 'sea': return { bg: '#F0F4F8', text: '#1E3A5F', primary: '#4682B4', isDark: false };
      case 'dark': return { bg: '#121212', text: '#FFFFFF', primary: '#FFFFFF', isDark: true };
      case 'light':
      default: return { bg: '#FFFFFF', text: '#111827', primary: '#111827', isDark: false };
    }
  };

  const themeVars = getThemeVars();

  // Local sync for already purchased items
  const clientKey = clientEmail.replace(/\./g, '_');
  const clientData = collection.clientSelections?.[clientKey] || {};
  const localSyncKey = `acquired_${collection.id}_${clientKey}`;
  const localDownloadedIndices = JSON.parse(localStorage.getItem(localSyncKey) || '[]');
  const firestoreDownloadedIndices = clientData.downloadedIndices || [];
  const downloadedIndices = Array.from(new Set([...firestoreDownloadedIndices, ...localDownloadedIndices]));
  const purchasedPhotosUrls = downloadedIndices.map(idx => collection.media[idx]).filter(Boolean);

  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'purchased' | 'album'>('all');
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFotolivroClick = () => {
    if (activeGalleryTab === 'album') {
      setActiveGalleryTab('all');
    } else {
      if (!clientEmail) {
        setLocalInputEmail('');
        setLocalInputName('');
        setIdentityError('');
        setPendingSelectionUrl(null);
        setShowIdentityModal(true);
        return;
      }
      setActiveGalleryTab('album');
    }
  };

  const handleDownloadAllClick = () => {
    if (collection.downloadPinEnabled) {
      const pin = prompt('Digite o PIN de download:');
      if (pin !== collection.downloadPin) {
        alert('PIN incorreto!');
        return;
      }
    }
    startBatchDownload();
  };

  // Quota Warning
  const QuotaWarning = quotaExceeded ? (
    <div className="bg-red-600 py-3 px-4 flex items-center justify-center gap-3 text-white text-xs font-black uppercase tracking-widest animate-pulse sticky top-0 z-[9999] shadow-lg">
      <AlertTriangle className="w-5 h-5" />
      <span>⚠️ Atenção: Cota do Firebase esgotada. Suas alterações serão salvas apenas localmente neste navegador até a renovação da cota (diária).</span>
    </div>
  ) : null;

  // Authentication Gates
  if (collection.storeEnabled) {
    // 1. Mandatory Store Identification/Login
    if (!isClientAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col bg-gray-50" style={{ backgroundColor: themeVars.bg, color: themeVars.text }}>
          {QuotaWarning}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-6 text-[#D05634]">
              <Store className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Loja VIP</h2>
            <p className="text-gray-500 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
              Identifique-se para acessar a galeria e salvar suas escolhas de compra.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (clientEmail.trim() === (collection.storeLogin || '') && clientPassword === (collection.storePassword || '')) {
                setIsClientAuthenticated(true);
                setClientError(false);
              } else {
                setClientError(true);
              }
            }} className="space-y-4">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634] mb-1.5 ml-1">Login / Identificação</label>
                <input 
                  type="text"
                  placeholder="Seu login de acesso"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl border focus:outline-none transition-all ${clientError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]'}`}
                />
              </div>
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634] mb-1.5 ml-1">Senha</label>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="Sua senha secreta"
                    value={clientPassword}
                    onChange={e => setClientPassword(e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border focus:outline-none transition-all ${clientError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]'}`}
                  />
                </div>
                {clientError && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">Login ou senha inválidos. Verifique com o fotógrafo.</p>}
              </div>
              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#D05634]/20"
                style={{ backgroundColor: themeVars.primary }}
              >
                Entrar na Loja
              </button>
            </form>
            
            <p className="mt-8 text-[10px] text-gray-400 font-medium">Protegido por criptografia de ponta a ponta.</p>
          </div>
        </div>
      </div>
      );
    }

    // 2. Secondary Password Lock (Optional for Store)
    if (collection.passwordEnabled && !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: themeVars.bg, color: themeVars.text }}>
          <div className="max-w-md w-full bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200/50 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${themeVars.primary}20`, color: themeVars.primary }}>
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{collection.title}</h2>
            <p className="opacity-70 mb-8 max-w-[280px] mx-auto text-sm">Esta galeria é protegida por senha. Insira a senha para visualizar.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === collection.password) {
                setIsAuthenticated(true);
                setErrorInput(false);
              } else {
                setErrorInput(true);
              }
            }}>
              <input 
                type="password"
                placeholder="Senha de acesso"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none mb-4 ${errorInput ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                style={{ focus: { borderColor: themeVars.primary } }}
              />
              {errorInput && <p className="text-red-500 text-xs mb-4">Senha incorreta</p>}
              <button 
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90 shadow-md"
                style={{ backgroundColor: themeVars.primary }}
              >
                Acessar Galeria
              </button>
            </form>
          </div>
        </div>
      );
    }
  }

  if (collection.antiPrintEnabled && !clientEmail) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950" style={{ backgroundColor: themeVars.bg, color: themeVars.text }}>
        {QuotaWarning}
        <div className="flex-1 flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: collection.image ? `linear-gradient(to bottom, rgba(18,18,18,0.85), rgba(18,18,18,0.92)), url(${collection.image})` : 'none' }}>
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-neutral-800 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight text-gray-900 dark:text-white">Galeria Privada Protegida</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[320px] mx-auto text-xs leading-relaxed text-center">
              Para ver as fotografias, por favor preencha sua identificação rápida. Isso gera marcas d&apos;água personalizadas e assegura os direitos de imagem.
            </p>
            
            <form onSubmit={handleIdentifySubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634] mb-1.5 ml-1">Seu Nome Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome completo para registro"
                  value={localInputName}
                  onChange={e => setLocalInputName(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 dark:border-neutral-800 focus:border-[#D05634] focus:bg-white dark:bg-neutral-800 dark:text-white rounded-xl focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634] mb-1.5 ml-1">Seu E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@seuemail.com"
                  value={localInputEmail}
                  onChange={e => setLocalInputEmail(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 dark:border-neutral-800 focus:border-[#D05634] focus:bg-white dark:bg-neutral-800 dark:text-white rounded-xl focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              {identityError && (
                <p className="text-red-500 text-xs font-semibold ml-1">{identityError}</p>
              )}

              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#D05634]/20 mt-2"
                style={{ backgroundColor: themeVars.primary }}
              >
                Prosseguir com Segurança
              </button>
            </form>
            
            <p className="mt-8 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
              Protegido por rastreabilidade de sessão. Capturas e downloads são restritos ao titular.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative" style={{ backgroundColor: themeVars.bg, color: themeVars.text }}>
      {(isBlackout || devtoolsBlockActive) && (
        <div 
          className="fixed inset-0 bg-black z-[999999] flex flex-col items-center justify-center text-white p-6"
          onClick={() => {
            if (!devtoolsBlockActive) {
              setIsBlackout(false);
            }
          }}
        >
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wider text-amber-500 mb-3">
              {devtoolsBlockActive ? 'Inspeção Detectada' : 'Captura Impedida'}
            </h2>
            <p className="text-neutral-300 text-xs mb-6 leading-relaxed">
              {devtoolsBlockActive 
                ? 'Por motivos de direitos autorais e segurança industrial, esta galeria desfecha proteção total contra o uso de ferramentas de desenvolvedor.'
                : 'Gravação de tela, print-screen, capturas de recortes ou cópias não autorizadas são bloqueadas nesta plataforma.'}
            </p>
            <div className="w-full flex flex-col gap-1 text-[10px] text-zinc-500 bg-neutral-950 px-4 py-3 rounded-xl border border-white/5 font-mono text-left">
              <div>SESSÃO: {sessionId}</div>
              <div>CLIENTE: {localStorage.getItem(`client_name_${collection?.id}`) || clientEmail || 'Identificação Pendente'}</div>
              <div>EMAIL: {clientEmail || 'anon@anon.com'}</div>
              <div>DATA: {new Date().toLocaleString()}</div>
            </div>
            {devtoolsBlockActive ? (
              <p className="text-zinc-500 text-[10px] mt-6 animate-pulse font-semibold">Feche as Ferramentas de Desenvolvedor (F12) de seu navegador para continuar.</p>
            ) : (
              <p className="text-zinc-500 text-[10px] mt-6 font-semibold">Tire o print-screen, solte as teclas ou feche o comando e clique na tela para retornar.</p>
            )}
          </div>
        </div>
      )}
      {QuotaWarning}
      {parentFolder && (
        <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 py-3.5 px-8 sticky top-0 z-40 flex items-center justify-between shadow-xs">
          <a
            href={`?gallery=folder/${parentFolder.slug || parentFolder.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
            className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-[#D05634] uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a Pasta: {parentFolder.title}
          </a>
        </div>
      )}
      {/* Intro */}
      {collection.image && (
        <div className="w-full h-[60vh] relative mb-16 shadow-lg">
          <img 
            src={collection.image} 
            className="w-full h-full object-cover" 
            style={{ objectPosition: `${collection?.coverPositionX ?? 50}% ${collection?.coverPositionY ?? 50}%` }}
            referrerPolicy="no-referrer"
          />

          {/* Cover Action Buttons */}
          <div className="absolute top-6 right-6 flex flex-wrap items-center gap-2.5 z-40">
            {/* Fotolivro */}
            <button 
              onClick={handleFotolivroClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all cursor-pointer relative ${
                activeGalleryTab === 'album' 
                  ? 'bg-white text-gray-950 shadow-lg' 
                  : 'bg-black/35 hover:bg-black/50 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Fotolivro {photobookSelection.length > 0 && `(${photobookSelection.length})`}</span>
            </button>

            {/* Baixar todas as fotos */}
            {collection.allowDownload !== false && !collection.storeEnabled && (
              <button 
                onClick={handleDownloadAllClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/35 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar todas as fotos</span>
              </button>
            )}

            {/* Compartilhar */}
            <button 
              onClick={handleShareClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/35 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
          <div className={`absolute inset-0 bg-black/30 flex flex-col ${
            collection.coverLayout === 'left-aligned' ? 'items-start justify-center px-16 lg:px-32' :
            collection.coverLayout === 'novela' ? 'items-center justify-end pb-24' :
            collection.coverLayout === 'diario' ? 'items-start justify-end p-12' :
            collection.coverLayout === 'selo' ? 'items-end justify-start p-12' :
            'items-center justify-center px-4'
          }`}>
            <div className={`flex flex-col ${
              collection.coverLayout === 'left-aligned' ? 'items-start' :
              collection.coverLayout === 'novela' ? 'items-center space-y-2' :
              collection.coverLayout === 'moldura' ? 'border-2 border-white/40 p-8 md:p-12 backdrop-blur-sm items-center' :
              collection.coverLayout === 'faixa' ? 'w-full bg-black/30 py-12 backdrop-blur-md items-center' :
              collection.coverLayout === 'divisor' ? 'items-center' :
              collection.coverLayout === 'selo' ? 'bg-white/10 backdrop-blur-md p-6 border border-white/20 items-end' :
              'items-center'
            }`}>
              {collection.coverLayout === 'divisor' && <div className="w-12 h-0.5 bg-white mb-6 opacity-60"></div>}
              
              {collection.showTitleOnCover !== false && (
                <h1 className={`font-bold text-white tracking-tight leading-tight ${
                  collection.coverLayout === 'left-aligned' ? 'text-4xl md:text-6xl text-left max-w-2xl' :
                  collection.coverLayout === 'novela' ? 'text-5xl md:text-7xl uppercase text-center' :
                  collection.coverLayout === 'diario' ? 'text-3xl md:text-5xl font-light text-left' :
                  collection.coverLayout === 'contorno' ? 'text-5xl md:text-8xl text-transparent [-webkit-text-stroke:1px_white] text-center' :
                  'text-4xl md:text-6xl text-center max-w-4xl'
                }`}>
                  {collection.title}
                </h1>
              )}
              
              {collection.showDateOnCover !== false && collection.date && (
                <p className={`text-white/90 font-medium ${
                  collection.coverLayout === 'novela' ? 'text-xl tracking-[0.2em] uppercase mt-4' :
                  collection.coverLayout === 'vintage' ? 'mt-4 border-t border-b border-white/30 py-2 px-6 italic' :
                  collection.coverLayout === 'diario' ? 'text-sm mt-2 opacity-60 font-mono' :
                  'text-lg mt-4'
                }`}>
                  {collection.date}
                </p>
              )}

              {collection.coverLayout === 'divisor' && <div className="w-12 h-0.5 bg-white mt-6 opacity-60"></div>}

              {/* Overlaid Association Seals on Public Gallery Cover */}
              {collection?.associationSeals && collection.associationSeals.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6 z-20">
                  {collection.associationSeals.map((seal: any, idx: number) => {
                    const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                    return (
                      <div 
                        key={seal.id || idx}
                        className="px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white flex items-center gap-2 shadow-xl"
                      >
                        {resolvedLogo ? (
                          <img src={resolvedLogo} alt={seal.name} className="w-5 h-5 rounded object-contain shrink-0" />
                        ) : (
                          <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold tracking-tight">{seal.name}</span>
                        {seal.badgeText && (
                          <span className="text-[10px] uppercase tracking-wider text-[#FF9E80] font-extrabold ml-0.5">· {seal.badgeText}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-8 ${collection.image ? 'py-0 pb-16' : 'py-16'}`}>
        {!collection.image && (
          <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: themeVars.text }}>{collection.title}</h1>
              {collection.date && <p className="font-medium opacity-70" style={{ color: themeVars.text }}>{collection.date}</p>}
              
              {/* Center Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                {/* Fotolivro */}
                <button 
                  onClick={handleFotolivroClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                    activeGalleryTab === 'album' 
                      ? 'bg-[#D05634] text-white border-[#D05634] shadow-md' 
                      : 'bg-transparent border-gray-300 dark:border-neutral-700 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Fotolivro {photobookSelection.length > 0 && `(${photobookSelection.length})`}</span>
                </button>

                {/* Baixar todas as fotos */}
                {collection.allowDownload !== false && !collection.storeEnabled && (
                  <button 
                    onClick={handleDownloadAllClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-gray-300 dark:border-neutral-700 bg-transparent hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar todas as fotos</span>
                  </button>
                )}

                {/* Compartilhar */}
                <button 
                  onClick={handleShareClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-gray-300 dark:border-neutral-700 bg-transparent hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>
            </div>
          )}

        {/* Subtle Session Indicator */}
        {clientEmail && (
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8 text-neutral-400 text-xs">
            <div className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-2">
              <span>Sessão: {clientEmail}</span>
              <button 
                onClick={() => {
                  try {
                    localStorage.removeItem(`client_email_${collection.id}`);
                    localStorage.removeItem(`client_name_${collection.id}`);
                  } catch (_) {}
                  setClientEmail('');
                  setIsClientAuthenticated(false);
                  setPhotobookSelection([]);
                  setActiveGalleryTab('all');
                }}
                className="text-[#D05634] hover:underline font-black cursor-pointer uppercase"
              >
                (Sair / Alterar)
              </button>
            </div>
            {collection.storeEnabled && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveGalleryTab('all')}
                  className={`text-xs font-bold uppercase tracking-wider pb-1 ${activeGalleryTab === 'all' ? 'text-gray-900 border-b-2 border-gray-900 dark:text-white dark:border-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Galeria ({collection.media?.length || 0})
                </button>
                <button
                  onClick={() => setActiveGalleryTab('purchased')}
                  className={`text-xs font-bold uppercase tracking-wider pb-1 ${activeGalleryTab === 'purchased' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Minhas Fotos ({purchasedPhotosUrls.length})
                </button>
              </div>
            )}
          </div>
        )}

        {isDownloadingAll && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF0EB] rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                  <Download className="w-8 h-8 text-[#D05634] animate-bounce" />
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-[#D05634] transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Download em Progresso</h3>
                <p className="text-sm text-gray-500 mb-8">
                  Estamos preparando suas fotos. Seu navegador pode pedir permissão para baixar múltiplos arquivos.
                </p>

                <div className="w-full bg-gray-100 h-3 rounded-full mb-3 overflow-hidden">
                  <div 
                    className="h-full bg-[#D05634] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                
                <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest text-[#D05634]">
                  <span>{downloadProgress}%</span>
                  <span>{Math.round((downloadProgress / 100) * (collection.media?.length || 0))} de {collection.media?.length || 0} fotos</span>
                </div>
              </div>
            </div>
          </div>
        )}
          
        {activeGalleryTab === 'album' && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`p-8 rounded-[2rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-8 ${themeVars.isDark ? 'bg-white/5 border-white/10' : 'bg-[#FFF0EB] border-[#D05634]/20'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${themeVars.isDark ? 'bg-white/10 text-white' : 'bg-[#D05634] text-white'}`}>
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Construção do seu Álbum</h3>
                  <p className="text-sm opacity-70">Você selecionou {photobookSelection.length} fotos para seu álbum impresso.</p>
                  {collection.albumPhotoPrice > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black uppercase tracking-widest">Preço por foto: R${collection.albumPhotoPrice.toFixed(2).replace('.', ',')}</span>
                       <span className="text-sm font-bold">Total: R${(photobookSelection.length * collection.albumPhotoPrice).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveGalleryTab('all')}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-current opacity-70 hover:opacity-100 transition-all"
                >
                  Continuar Escolhendo
                </button>
                <button 
                  onClick={() => setShowCart(true)}
                  disabled={photobookSelection.length === 0}
                  className={`px-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2 ${photobookSelection.length === 0 ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
                  style={{ backgroundColor: themeVars.primary, color: '#FFFFFF' }}
                >
                  <Check className="w-4 h-4" />
                  Finalizar Álbum
                </button>
              </div>
            </div>
            {photobookSelection.length === 0 && (
              <div className="text-center py-20 opacity-40">
                <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm font-medium">Nenhuma foto adicionada ao álbum ainda.</p>
              </div>
            )}
          </div>
        )}
          
        <GalleryGrid 
          collection={collection} 
          media={activeGalleryTab === 'album' ? photobookSelection : (activeGalleryTab === 'all' ? (collection.media || []) : purchasedPhotosUrls)} 
          photobookSelection={photobookSelection}
          togglePhotobookSelection={togglePhotobookSelection}
          clientEmail={clientEmail}
          onImageClick={(index) => {
            const mediaList = activeGalleryTab === 'album' ? photobookSelection : (activeGalleryTab === 'all' ? (collection.media || []) : purchasedPhotosUrls);
            const originalIndex = collection.media.indexOf(mediaList[index]);
            setLightboxIndex(originalIndex);
          }}
        />
      </div>

      {lightboxIndex !== null && collection.media && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 flex items-center justify-center p-4">
          <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
            {collection.storeEnabled && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePhotobookSelection(collection.media[lightboxIndex]);
                }}
                className={`p-3 rounded-full transition-all backdrop-blur-md flex items-center gap-2 ${
                  photobookSelection.includes(collection.media[lightboxIndex])
                    ? 'bg-[#D05634] text-white shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Store className={`w-6 h-6 ${photobookSelection.includes(collection.media[lightboxIndex]) ? 'fill-white' : ''}`} />
                <span className="text-xs font-bold uppercase tracking-wider pr-1">
                  {photobookSelection.includes(collection.media[lightboxIndex]) ? 'Selecionada' : 'Selecionar'}
                </span>
              </button>
            )}
            {!collection.storeEnabled && (
              <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   
                   if (collection.downloadPinEnabled) {
                     const pin = prompt('Digite o PIN de download:');
                     if (pin !== collection.downloadPin) {
                       alert('PIN incorreto!');
                       return;
                     }
                   }

                   const a = document.createElement('a');
                   a.href = collection.media[lightboxIndex];
                   a.download = `photo-${lightboxIndex}.jpg`;
                   a.click();
                 }}
                 className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(prev => (prev! - 1 + collection.media.length) % collection.media.length);
            }}
            className="absolute left-4 md:left-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 z-50 backdrop-blur-sm"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center select-none cursor-default"
            onClick={() => setLightboxIndex(null)}
          >
            {collection?.antiPrintEnabled ? (
              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[85vh] p-2">
                <SecureCanvasViewer
                  imageIndex={lightboxIndex}
                  url={collection.media[lightboxIndex]}
                  clientEmail={clientEmail || 'anon@anon.com'}
                  clientName={localStorage.getItem(`client_name_${collection.id}`) || clientEmail?.split('@')[0] || 'Cliente'}
                  sessionId={sessionId}
                  sessionSecret={sessionSecret}
                  expires={generateSignedToken(lightboxIndex, clientEmail || 'anon@anon.com', sessionSecret).expires}
                  signature={generateSignedToken(lightboxIndex, clientEmail || 'anon@anon.com', sessionSecret).signature}
                  antiPrintEnabled={true}
                  collectionId={collection.id}
                  isPurchased={downloadedIndices.includes(lightboxIndex)}
                  aspectRatioClass="aspect-video sm:aspect-auto w-full h-[75vh]"
                />
              </div>
            ) : (
              <motion.img 
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                src={collection.media[lightboxIndex]} 
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm pointer-events-auto"
                draggable={false}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(prev => (prev! + 1) % collection.media.length);
            }}
            className="absolute right-4 md:right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 z-50 backdrop-blur-sm"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium tracking-widest uppercase">
            {lightboxIndex + 1} / {collection.media.length}
          </div>
        </div>
      )}

      {photobookSelection.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-40 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
           <div className="max-w-7xl w-full px-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: `${themeVars.primary}20`, color: themeVars.primary }}>
                 {photobookSelection.length}
               </div>
               <div>
                  <p className="font-medium" style={{ color: themeVars.text }}>{photobookSelection.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}</p>
                   <p className="text-sm opacity-60" style={{ color: themeVars.text }}>
                    {collection.storeEnabled 
                      ? 'Selecione imagens para comprar.' 
                      : 'Selecione imagens para o fotolivro.'}
                    </p>
               </div>
             </div>
             <button 
               disabled={photobookSelection.length < 1}
               onClick={() => {
                 if (activeGalleryTab === 'album') {
                   setShowPhotobook(true);
                 } else if (collection.storeEnabled) {
                   setCartIsAlbum(false);
                   setShowCart(true);
                 } else {
                   setShowPhotobook(true);
                 }
               }}
               className="text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto"
               style={{ backgroundColor: themeVars.primary }}
             >
               {activeGalleryTab === 'album' ? 'Ver Álbum' : collection.storeEnabled ? 'Ver Carrinho' : 'Ver fotolivro'}
             </button>
           </div>
        </div>
      )}

      {showPhotobook && (
        <PhotobookMockup 
          collection={collection} 
          images={photobookSelection} 
          onClose={() => setShowPhotobook(false)} 
          onFinish={() => {
            setShowPhotobook(false);
            setCartIsAlbum(true);
            setShowCart(true);
          }}
          onUpdateCollection={onUpdateCollection}
        />
      )}

      {showCart && (
        <StoreCartModal 
          images={photobookSelection} 
          collection={collection} 
          themeVars={themeVars}
          clientEmail={clientEmail}
          isAlbum={cartIsAlbum || activeGalleryTab === 'album'}
          onClose={() => setShowCart(false)} 
        />
      )}

      {showIdentityModal && (
        <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-gray-100 text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-[#FFF0EB] text-[#D05634] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Identifique-se para Continuar</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Para salvar suas fotos selecionadas e enviá-las ao fotógrafo, por favor informe seu e-mail.
            </p>
            
            <form onSubmit={handleIdentifySubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="seu@e-mail.com"
                  value={localInputEmail}
                  onChange={e => setLocalInputEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nome Completo (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Seu nome"
                  value={localInputName}
                  onChange={e => setLocalInputName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                />
              </div>

              {identityError && (
                <p className="text-red-500 text-xs font-semibold ml-1">{identityError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowIdentityModal(false);
                    setPendingSelectionUrl(null);
                  }}
                  className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md hover:brightness-110"
                  style={{ backgroundColor: themeVars.primary }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


const bc = new BroadcastChannel('frame_sync');

function AdminView({ 
  setActiveTab: setOuterActiveTab,
  user,
  isAdmin
}: { 
  setActiveTab?: (tab: string) => void;
  user?: any | null;
  isAdmin?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'armazenamento' | 'planos'>('usuarios');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [allCollections, setAllCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [r2Status, setR2Status] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    defaultTrialDays: 7,
    defaultInitialPlan: "Basic (3 GB)"
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Fetch real users and collections for Admin
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, collsRes, healthRes, settingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/collections'),
        fetch('/api/health'),
        fetch('/api/settings')
      ]);

      if (usersRes.ok) {
        const users = await usersRes.json();
        setUsersList(Array.isArray(users) ? users : []);
      }
      if (collsRes.ok) {
        const colls = await collsRes.json();
        setAllCollections(Array.isArray(colls) ? colls : []);
      }
      if (healthRes.ok) {
        const health = await healthRes.json();
        setR2Status(health);
      }
      if (settingsRes.ok) {
        const sett = await settingsRes.json();
        setSettings(sett);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Esta área é exclusiva para administradores da plataforma com permissões avançadas de gerenciamento.
        </p>
        <button 
          onClick={() => setOuterActiveTab ? setOuterActiveTab('colecoes') : undefined}
          className="bg-[#D05634] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#b84a2b] transition-all shadow-md active:scale-95"
        >
          Voltar para Minhas Coleções
        </button>
      </div>
    );
  }

  // Calculate platform totals
  const totalPlatformBytes = allCollections.reduce((acc, c) => acc + getCollectionStorageBytes(c), 0);
  const totalPlatformMB = totalPlatformBytes / (1024 * 1024);
  const totalPlatformGB = totalPlatformBytes / (1024 * 1024 * 1024);
  const formattedPlatformStorage = totalPlatformGB >= 1 ? `${totalPlatformGB.toFixed(2)} GB` : `${totalPlatformMB.toFixed(1)} MB`;

  // Compute storage for each user
  const enrichedUsers = usersList.map(u => {
    const userColls = allCollections.filter(c => c.ownerId?.toLowerCase() === u.uid?.toLowerCase());
    const storage = calculateUserStorage(userColls, u);
    return {
      ...u,
      collectionsCount: userColls.length,
      storage
    };
  });

  // Filter users
  const filteredUsers = enrichedUsers.filter(u => {
    const matchesSearch = 
      (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.status !== 'Inativo' : u.status === 'Inativo');
    const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' ? u.role === 'admin' : u.role !== 'admin');
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSettingsSuccess(false);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        const updated = await response.json();
        setSettings(updated);
        setSaveSettingsSuccess(true);
        setTimeout(() => setSaveSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Erro ao salvar as configurações.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingUser,
          storageLimitGB: Number(editingUser.storageLimitGB || 30)
        })
      });

      if (response.ok) {
        const saved = await response.json();
        setUsersList(prev => prev.map(u => u.uid === saved.uid ? { ...u, ...saved } : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Erro ao salvar alterações do usuário.");
    }
  };

  const handleToggleAdminRole = async (targetUser: any) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? `Tornar ${targetUser.displayName || targetUser.email} um Administrador?`
      : `Remover privilégios de Administrador de ${targetUser.displayName || targetUser.email}?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`/api/users/${targetUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...targetUser,
          role: newRole,
          isAdmin: newRole === 'admin'
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setUsersList(prev => prev.map(u => u.uid === updated.uid ? { ...u, ...updated } : u));
      }
    } catch (err) {
      console.error("Error toggling role:", err);
    }
  };

  const exportCSV = () => {
    const headers = "UID,Nome,Email,Função,Plano,Limite_GB,Usado_MB,Usado_Percent,Status\n";
    const rows = enrichedUsers.map(u => 
      `"${u.uid}","${u.displayName || ''}","${u.email || ''}","${u.role || 'user'}","${u.planName || 'Luz'}","${u.storage.limitGB}","${u.storage.totalMB.toFixed(1)}","${u.storage.formattedPercent}","${u.status || 'Ativo'}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `usuarios_frameplus_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="text-left">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Administração do Sistema</h1>
            <span className="bg-[#FFF0EB] text-[#D05634] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#D05634]/20">
              Super Admin
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Gerencie permissões, cotas de armazenamento e usuários da plataforma multitenant.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadAdminData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            Atualizar Dados
          </button>
          {setOuterActiveTab && (
            <button 
              onClick={() => setOuterActiveTab('configuracoes')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF0EB] hover:bg-[#ffe6de] border border-[#D05634]/20 text-[#D05634] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Settings className="w-3.5 h-3.5" />
              Configurações
            </button>
          )}
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#D05634] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Usuários Registrados</div>
            <div className="text-2xl font-bold text-gray-900">{usersList.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Armazenamento Total Usado</div>
            <div className="text-2xl font-bold text-gray-900">{formattedPlatformStorage}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Coleções Criadas</div>
            <div className="text-2xl font-bold text-gray-900">{allCollections.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Cloudflare R2</div>
            <div className="text-sm font-bold text-green-700 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {r2Status?.r2Configured ? 'Conectado e Ativo' : 'Operacional'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'usuarios' 
                ? 'bg-[#D05634] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" /> Usuários ({usersList.length})
          </button>
          <button 
            onClick={() => setActiveTab('armazenamento')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'armazenamento' 
                ? 'bg-[#D05634] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Armazenamento e R2
          </button>
          <button 
            onClick={() => setActiveTab('planos')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'planos' 
                ? 'bg-[#D05634] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" /> Planos e Trial
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative flex-1 w-full max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por email ou nome..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D05634]/20 focus:border-[#D05634]" 
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D05634]"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Apenas Ativos</option>
                  <option value="inactive">Apenas Inativos</option>
                </select>
                <select 
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D05634]"
                >
                  <option value="all">Todas as Funções</option>
                  <option value="admin">Apenas Admins</option>
                  <option value="user">Apenas Usuários</option>
                </select>
                <button 
                  onClick={exportCSV}
                  className="flex items-center gap-2 text-sm font-semibold border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 whitespace-nowrap text-gray-700 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Exportar CSV
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D05634]" />
                <p className="text-sm">Carregando usuários e calculando consumo de armazenamento...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-base font-bold text-gray-700">Nenhum usuário encontrado</p>
                <p className="text-xs text-gray-400 mt-1">Tente ajustar os termos da busca ou filtros.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium whitespace-nowrap">Usuário</th>
                      <th className="pb-3 font-medium whitespace-nowrap">Função</th>
                      <th className="pb-3 font-medium whitespace-nowrap">Plano</th>
                      <th className="pb-3 font-medium whitespace-nowrap min-w-[220px]">Armazenamento Consumido</th>
                      <th className="pb-3 font-medium whitespace-nowrap">Status</th>
                      <th className="pb-3 font-medium text-right whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u, i) => (
                      <tr key={u.uid || i} className="group hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-bold text-gray-900">{u.displayName || 'Sem nome informado'}</div>
                          <div className="text-gray-500 text-xs truncate max-w-xs">{u.email}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{u.collectionsCount || 0} coleções</div>
                        </td>
                        <td className="py-4 pr-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF0EB] text-[#D05634] border border-[#D05634]/20">
                              <Shield className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                              Fotógrafo
                            </span>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium text-gray-800 text-xs">{u.planName || 'Luz'}</div>
                          <div className="text-[11px] text-gray-400">Limite: {u.storage.formattedLimit}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-gray-700">
                              {u.storage.formattedUsed} de {u.storage.formattedLimit}
                            </span>
                            <span className={`font-bold ${u.storage.isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                              {u.storage.formattedPercent}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                u.storage.isOverLimit ? 'bg-red-500' : 'bg-[#D05634]'
                              }`} 
                              style={{ width: `${Math.min(100, u.storage.percent)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.status !== 'Inativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.status || 'Ativo'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleToggleAdminRole(u)}
                              title={u.role === 'admin' ? "Remover privilégio Admin" : "Tornar Admin"}
                              className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                                u.role === 'admin' 
                                  ? 'bg-[#FFF0EB] text-[#D05634] hover:bg-[#ffe4dc]' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <Shield className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setEditingUser({ ...u, storageLimitGB: u.storageLimitGB || 30 })}
                              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition-colors"
                              title="Editar Usuário / Cota"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'armazenamento' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#D05634] flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Cloudflare R2 Storage</h3>
                  <p className="text-xs text-gray-500">Provedor oficial de armazenamento em nuvem e CDN.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status do Provedor</div>
                    <div className="text-sm font-bold text-green-600 flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      Operacional e Pronto
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bucket Primário</div>
                    <div className="text-sm font-mono text-gray-800 mt-1">frameplus-uploads</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">CDN / Domínio Público</div>
                    <div className="text-sm font-mono text-[#D05634] mt-1">https://cdn.plus.framepro.click</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Consumo Total</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{formattedPlatformStorage}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'planos' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Form de Configuração de Novas Contas (Trial e Plano Inicial) */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#D05634] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Configuração de Cadastro do Usuário</h3>
                  <p className="text-xs text-gray-500">Defina o plano e período de testes padrão para novos fotógrafos.</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Dias Gratuitos de Teste (Trial)</label>
                    <input 
                      type="number"
                      min="0"
                      max="365"
                      value={settings.defaultTrialDays ?? 7}
                      onChange={e => setSettings({ ...settings, defaultTrialDays: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                      required
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Após estes dias, novos uploads serão bloqueados até a ativação de um plano.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Plano Inicial Padrão</label>
                    <select
                      value={settings.defaultInitialPlan ?? "Basic (3 GB)"}
                      onChange={e => setSettings({ ...settings, defaultInitialPlan: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 focus:border-[#D05634] focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                      required
                    >
                      <option value="Basic (3 GB)">Basic (3 GB)</option>
                      <option value="Crop (15 GB)">Crop (15 GB)</option>
                      <option value="Luz (30 GB)">Luz (30 GB)</option>
                      <option value="Shoot (50 GB)">Shoot (50 GB)</option>
                      <option value="Click (100 GB)">Click (100 GB)</option>
                      <option value="Plus (500 GB)">Plus (500 GB)</option>
                      <option value="PRO (2 TB)">PRO (2 TB)</option>
                      <option value="Founder (4 TB)">Founder (4 TB)</option>
                    </select>
                    <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Novo usuário receberá este plano e limite ao criar a conta.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {saveSettingsSuccess ? (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                      ✓ Configurações salvas com sucesso!
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="bg-[#D05634] hover:bg-[#b84a2b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingSettings ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Configurações'
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-x-auto text-left">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Tabela de Planos e Cotas Disponíveis</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium whitespace-nowrap pr-4">Nome do Plano</th>
                    <th className="pb-3 font-medium whitespace-nowrap pr-4">Limite de Armazenamento</th>
                    <th className="pb-3 font-medium whitespace-nowrap pr-4">Preço Mensal</th>
                    <th className="pb-3 font-medium whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { name: "Basic", storage: "3 GB", price: "R$12,00" },
                    { name: "Crop", storage: "15 GB", price: "R$44,40" },
                    { name: "Luz", storage: "30 GB", price: "R$56,40" },
                    { name: "Shoot", storage: "50 GB", price: "R$68,40" },
                    { name: "Click", storage: "100 GB", price: "R$92,40" },
                    { name: "Plus", storage: "500 GB", price: "R$116,40" },
                    { name: "PRO", storage: "2 TB", price: "R$236,40" },
                    { name: "Founder", storage: "4 TB", price: "R$356,40" },
                  ].map((plan, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900 pr-4">{plan.name}</td>
                      <td className="py-4 text-gray-500 pr-4">{plan.storage}</td>
                      <td className="py-4 text-gray-500 pr-4">{plan.price}</td>
                      <td className="py-4">
                        <span className="bg-[#D05634] text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Ativo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Editar Usuário</h3>
                <p className="text-xs text-gray-500 truncate max-w-xs">{editingUser.email}</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nome de Exibição</label>
                <input 
                  type="text"
                  value={editingUser.displayName || ''}
                  onChange={e => setEditingUser({ ...editingUser, displayName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D05634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Função no Sistema</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value, isAdmin: e.target.value === 'admin' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D05634]"
                >
                  <option value="user">Fotógrafo / Usuário Padrão</option>
                  <option value="admin">Administrador (Acesso Total)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Limite de Armazenamento (GB)</label>
                <input 
                  type="number"
                  min="1"
                  max="10000"
                  value={editingUser.storageLimitGB || 30}
                  onChange={e => setEditingUser({ ...editingUser, storageLimitGB: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D05634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nome do Plano</label>
                <select
                  value={editingUser.planName || 'Luz (30 GB)'}
                  onChange={e => {
                    const name = e.target.value;
                    let limit = 30;
                    if (name.includes('3 GB')) limit = 3;
                    else if (name.includes('15 GB')) limit = 15;
                    else if (name.includes('30 GB')) limit = 30;
                    else if (name.includes('50 GB')) limit = 50;
                    else if (name.includes('100 GB')) limit = 100;
                    else if (name.includes('500 GB')) limit = 500;
                    else if (name.includes('2 TB')) limit = 2048;
                    else if (name.includes('4 TB')) limit = 4096;
                    setEditingUser({ ...editingUser, planName: name, storageLimitGB: limit });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D05634]"
                >
                  <option value="Basic (3 GB)">Basic (3 GB)</option>
                  <option value="Crop (15 GB)">Crop (15 GB)</option>
                  <option value="Luz (30 GB)">Luz (30 GB)</option>
                  <option value="Shoot (50 GB)">Shoot (50 GB)</option>
                  <option value="Click (100 GB)">Click (100 GB)</option>
                  <option value="Plus (500 GB)">Plus (500 GB)</option>
                  <option value="PRO (2 TB)">PRO (2 TB)</option>
                  <option value="Founder (4 TB)">Founder (4 TB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Status da Conta</label>
                <select
                  value={editingUser.status || 'Ativo'}
                  onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D05634]"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#D05634] hover:bg-[#b84a2b] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface ConfiguracoesViewProps {
  user: any;
  userProfile: any;
  onUpdateProfile: (updates: any) => Promise<void>;
}

function ConfiguracoesView({ user, userProfile, onUpdateProfile }: ConfiguracoesViewProps) {
  const [studioName, setStudioName] = useState(userProfile?.studioName || '');
  const [studioPhone, setStudioPhone] = useState(userProfile?.studioPhone || '');
  const [studioEmail, setStudioEmail] = useState(userProfile?.studioEmail || '');
  const [defaultPhotoPrice, setDefaultPhotoPrice] = useState(userProfile?.defaultPhotoPrice ?? 10);
  
  // Gateways
  const [pixEnabled, setPixEnabled] = useState(userProfile?.pixEnabled ?? true);
  const [pixProvider, setPixProvider] = useState(userProfile?.pixProvider || 'Mercado Pago');
  const [pixKey, setPixKey] = useState(userProfile?.pixKey || '');

  const [cardEnabled, setCardEnabled] = useState(userProfile?.cardEnabled ?? true);
  const [cardProvider, setCardProvider] = useState(userProfile?.cardProvider || 'Stripe');
  const [cardPublicKey, setCardPublicKey] = useState(userProfile?.cardPublicKey || '');
  const [cardSecretKey, setCardSecretKey] = useState(userProfile?.cardSecretKey || '');

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'gateways' | 'lightroom'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if userProfile loaded/changed
  useEffect(() => {
    if (userProfile) {
      if (userProfile.studioName !== undefined) setStudioName(userProfile.studioName || '');
      if (userProfile.studioPhone !== undefined) setStudioPhone(userProfile.studioPhone || '');
      if (userProfile.studioEmail !== undefined) setStudioEmail(userProfile.studioEmail || '');
      if (userProfile.defaultPhotoPrice !== undefined) setDefaultPhotoPrice(userProfile.defaultPhotoPrice ?? 10);
      if (userProfile.pixEnabled !== undefined) setPixEnabled(userProfile.pixEnabled ?? true);
      if (userProfile.pixProvider !== undefined) setPixProvider(userProfile.pixProvider || 'Mercado Pago');
      if (userProfile.pixKey !== undefined) setPixKey(userProfile.pixKey || '');
      if (userProfile.cardEnabled !== undefined) setCardEnabled(userProfile.cardEnabled ?? true);
      if (userProfile.cardProvider !== undefined) setCardProvider(userProfile.cardProvider || 'Stripe');
      if (userProfile.cardPublicKey !== undefined) setCardPublicKey(userProfile.cardPublicKey || '');
      if (userProfile.cardSecretKey !== undefined) setCardSecretKey(userProfile.cardSecretKey || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateProfile({
        studioName,
        studioPhone,
        studioEmail,
        defaultPhotoPrice: Number(defaultPhotoPrice),
        pixEnabled,
        pixProvider,
        pixKey,
        cardEnabled,
        cardProvider,
        cardPublicKey,
        cardSecretKey,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving configurations:", err);
      alert("Ocorreu um erro ao salvar as configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Configurações Gerais</h1>
          <p className="text-sm text-gray-500 font-medium font-sans">Defina os dados do estúdio e os canais de recebimento dos gateways de pagamento.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/50 overflow-x-auto max-w-full">
          <button 
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeSubTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Perfil & Estúdio
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab('gateways')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeSubTab === 'gateways' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Gateways de Pagamento
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab('lightroom')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeSubTab === 'lightroom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Adobe Lightroom
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeSubTab === 'profile' ? (
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   <Database className="w-5 h-5 text-[#D05634]" /> Dados do Estúdio
                </h3>
                <p className="text-xs text-gray-400 mt-1">Essas informações aparecem no cabeçalho das suas lojas e faturas de álbuns.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nome do Estúdio / Fantasia</label>
                  <input 
                    type="text" 
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="Ex: Seu Nome ou Nome do Estúdio"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">WhatsApp de Contato</label>
                  <input 
                    type="tel" 
                    value={studioPhone}
                    onChange={(e) => setStudioPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">E-mail Comercial</label>
                <input 
                  type="email" 
                  value={studioEmail}
                  onChange={(e) => setStudioEmail(e.target.value)}
                  placeholder="comercial@estudio.com"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all shadow-inner"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-905">Preço Alternativo das Fotos Extras</h3>
                  <p className="text-xs text-gray-400 mt-1 font-sans">Preço universal aplicado por foto extra nas lojas quando nenhuma galeria definir preço personalizado.</p>
                </div>

                <div className="w-full max-w-xs">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block font-sans">Preço Padrão por Foto (R$)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">R$</span>
                     <input 
                       type="number" 
                       step="0.01"
                       min="0"
                       value={defaultPhotoPrice}
                       onChange={(e) => setDefaultPhotoPrice(Number(e.target.value))}
                       placeholder="10,00"
                       className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-bold outline-none transition-all shadow-inner"
                     />
                  </div>
                </div>
              </div>
            </div>
          ) : activeSubTab === 'gateways' ? (
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   <CreditCard className="w-5 h-5 text-[#D05634]" /> Provedores de Pagamento
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-sans">Insira as credenciais de produção. Os clientes pagarão diretamente para as suas contas.</p>
              </div>

              {/* PIX Gateway Section */}
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-sans">Gateway PIX</h4>
                      <p className="text-xs text-gray-400 mt-0.5 font-sans">Habilita e configura o QR Code de Pix automático.</p>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setPixEnabled(!pixEnabled)}
                     className={`w-12 h-6 rounded-full p-1 transition-all ${pixEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${pixEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                </div>

                {pixEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Provedor PIX</label>
                      <select 
                        value={pixProvider} 
                        onChange={(e) => setPixProvider(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-105 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-semibold outline-none appearance-none"
                      >
                        <option value="Mercado Pago">Mercado Pago</option>
                        <option value="Asaas">Asaas</option>
                        <option value="Efí / Gerencianet">Efí / Gerencianet</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Chave Pix Comercial</label>
                      <input 
                        type="text" 
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="Ex: pix@estudio.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Credit Card Gateway Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-sans">Gateway Cartão de Crédito</h4>
                      <p className="text-xs text-gray-400 mt-0.5 font-sans">Ofereça pagamento em até 12x via cartão de crédito.</p>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setCardEnabled(!cardEnabled)}
                     className={`w-12 h-6 rounded-full p-1 transition-all ${cardEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${cardEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                </div>

                {cardEnabled && (
                  <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-full max-w-xs">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Provedor do Cartão</label>
                      <select 
                        value={cardProvider} 
                        onChange={(e) => setCardProvider(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-105 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-semibold outline-none appearance-none"
                      >
                        <option value="Stripe">Stripe</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                        <option value="Pagar.me">Pagar.me</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Chave Pública (Public Key)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-3.5 h-3.5" /></span>
                          <input 
                            type="text" 
                            value={cardPublicKey}
                            onChange={(e) => setCardPublicKey(e.target.value)}
                            placeholder="pk_live_..."
                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-semibold outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Chave Secreta (Secret Key)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-3.5 h-3.5" /></span>
                          <input 
                            type="password" 
                            value={cardSecretKey}
                            onChange={(e) => setCardSecretKey(e.target.value)}
                            placeholder="sk_live_..."
                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-[#D05634] focus:bg-white rounded-xl text-xs font-semibold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-200">
              {/* Lightroom Plugin Section */}
              <div className="border-b border-gray-100 pb-4 text-left">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#D05634]" /> Integração Adobe Lightroom Classic
                </h3>
                <p className="text-xs text-gray-400 mt-1">Exporte suas fotos do Lightroom Classic diretamente para novas ou existentes coleções no Frame+.</p>
              </div>

              <div className="space-y-6 text-left">
                {/* Passo 1 */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF0EB] text-[#D05634] flex items-center justify-center text-xs font-black">1</span>
                    <h4 className="text-sm font-bold text-gray-900">Baixar o Plugin do Frame+</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-9 font-sans">
                    Preparamos um arquivo <b>.zip</b> pronto com os scripts de exportação formatados. Baixe-o clicando no botão abaixo, extraia o arquivo e salve a pasta <b>"frameplus.lrplugin"</b> em um local permanente no seu computador (por exemplo, na pasta Documentos).
                  </p>
                  <div className="pl-9">
                    <a 
                      href="/api/lightroom/download"
                      className="inline-flex items-center gap-2 bg-[#D05634] hover:bg-[#b84a2b] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Baixar Plugin Lightroom (.zip)
                    </a>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF0EB] text-[#D05634] flex items-center justify-center text-xs font-black">2</span>
                    <h4 className="text-sm font-bold text-gray-900">Instalar no Lightroom Classic</h4>
                  </div>
                  <ul className="text-xs text-gray-500 list-disc pl-14 space-y-2 leading-relaxed font-sans">
                    <li>Abra o <b>Adobe Lightroom Classic</b>.</li>
                    <li>No menu superior, clique em <b>Arquivo &gt; Gerenciador de Plug-ins...</b> (File &gt; Plug-in Manager).</li>
                    <li>Clique no botão <b>Adicionar</b> (Add) no canto inferior esquerdo.</li>
                    <li>Navegue até a pasta extraída <b>"frameplus.lrplugin"</b>, selecione-a e confirme.</li>
                    <li>Pronto! O plugin "Frame+" deverá aparecer com o status de luz verde "Ativo".</li>
                  </ul>
                </div>

                {/* Passo 3 */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF0EB] text-[#D05634] flex items-center justify-center text-xs font-black">3</span>
                    <h4 className="text-sm font-bold text-gray-900">Configurar Credenciais de Conexão</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-9 font-sans">
                    Ao exportar fotos, escolha <b>"Frame+ Art Gallery"</b> no menu de seleção do Lightroom (canto superior esquerdo) e insira as credenciais abaixo para autenticar o envio automático:
                  </p>
                  
                  <div className="pl-9 space-y-4 pt-1">
                    <div className="p-3.5 bg-white border border-gray-200/60 rounded-xl space-y-3 shadow-inner">
                      <div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Endereço do Servidor (Server URL)</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100 flex-1 truncate">{window.location.origin}</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin);
                              alert("Endereço do servidor copiado!");
                            }}
                            className="text-xs font-bold text-[#D05634] hover:underline px-2.5 py-1.5 bg-[#FFF0EB] rounded-lg border border-[#D05634]/10 cursor-pointer"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Token de Acesso (User Token)</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100 flex-1 truncate">{user?.uid}</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(user?.uid || "");
                              alert("Seu Token de acesso foi copiado!");
                            }}
                            className="text-xs font-bold text-[#D05634] hover:underline px-2.5 py-1.5 bg-[#FFF0EB] rounded-lg border border-[#D05634]/10 cursor-pointer"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Save Board */}
        <div className="space-y-6">
          <div className="bg-[#FFF0EB] border border-[#D0563410] p-6 rounded-[2rem] space-y-4">
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 font-sans">
                <Info className="w-4 h-4 text-[#D05634]" /> Centralização Global
             </h3>
             <p className="text-xs text-[#D05634]/80 leading-relaxed font-sans">
                Ao configurar seus gateways de pagamento aqui, todas as suas galerias criadas, novas compras de fotos extras e álbuns encomendados transacionarão automaticamente sob estas credenciais.
             </p>
             <p className="text-xs text-[#D05634]/80 leading-relaxed font-sans">
                Você não precisa mais preencher credenciais individuais ao criar ou gerenciar galerias!
             </p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm space-y-4">
             {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-bounce font-sans">
                  <Check className="w-4 h-4" /> Configurações salvas mundialmente!
                </div>
             )}

             <button 
               type="submit"
               disabled={isSaving}
               className="w-full py-4 bg-[#D05634] hover:bg-[#b84a2b] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#D05634]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-55 active:scale-95 font-sans"
             >
               {isSaving ? (
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <HardDrive className="w-4 h-4" />
               )}
               {isSaving ? 'Salvando...' : 'Salvar Alterações'}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [collectionsState, setCollectionsState] = useState<any[] | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [globalTheme, setGlobalTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('frameplus_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      if (globalTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('frameplus_theme', globalTheme);
    } catch {}
  }, [globalTheme]);

  const toggleGlobalTheme = () => {
    setGlobalTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  const [user, setUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('frameplus_sso_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.uid) return parsed;
      }
    } catch {}
    return auth.currentUser;
  });
  const [isAuthInited, setIsAuthInited] = useState(false);
  const [isFirestoreAvailable, setIsFirestoreAvailable] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Partial<Plan> | null>(null);
  const [authRecoveryMode, setAuthRecoveryMode] = useState(false);
  const [currentCollectionId, setCurrentCollectionId] = useState<any>(null);

  const [quotaExceeded, setQuotaExceeded] = useState(() => {
    try {
      return sessionStorage.getItem('firestore_quota_exceeded') === 'true' || (window as any).isFirestoreQuotaExceeded === true;
    } catch (e) {
      return false;
    }
  });

  const [userProfile, setUserProfile] = useState<any>(null);
  const isAdmin = isUserAdmin(user, userProfile);
  const currentStorageInfo = calculateUserStorage(collectionsState, userProfile);

  const handleAuthSuccess = (authenticatedUser: any) => {
    if (!authenticatedUser) return;
    const normalized = {
      ...authenticatedUser,
      uid: authenticatedUser.uid || authenticatedUser.id,
      displayName: authenticatedUser.displayName || authenticatedUser.name || authenticatedUser.email?.split('@')[0] || 'Fotógrafo',
      photoURL: authenticatedUser.photoURL || authenticatedUser.avatar_url || ''
    };
    try {
      localStorage.setItem('frameplus_sso_session', JSON.stringify(normalized));
      sessionStorage.removeItem('framepro_explicit_logout');
    } catch {}
    const queryParams = new URLSearchParams(window.location.search);
    if (!queryParams.get('gallery')) {
      setCollectionsState(null);
    }
    setUser(normalized);
    setUserProfile(normalized);
    setIsAuthInited(true);
    setActiveTab('colecoes');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('frameplus_sso_session');
      sessionStorage.setItem('framepro_explicit_logout', 'true');
      document.cookie = 'framepro_sso_bridge=; Path=/; Max-Age=0; SameSite=Lax';
      document.cookie = 'framepro_sso_bridge=; Domain=.framepro.click; Path=/; Max-Age=0; SameSite=Lax';
    } catch {}
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    setUserProfile(null);
    setCollectionsState(initialCollections);
    setActiveTab('inicio');
  };

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/users/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          // Sync latest profile fields back to local session if SSO
          try {
            const saved = localStorage.getItem('frameplus_sso_session');
            if (saved && data && data.uid) {
              const merged = { ...JSON.parse(saved), ...data };
              localStorage.setItem('frameplus_sso_session', JSON.stringify(merged));
            }
          } catch {}
        } else {
          setUserProfile(user);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        setUserProfile(user);
      }
    };
    loadProfile();
  }, [user]);

  const updateUserProfile = async (updates: any) => {
    if (!user) return;
    try {
      const merged = { ...(userProfile || {}), ...updates, uid: user.uid };
      setUserProfile(merged);
      try {
        const saved = localStorage.getItem('frameplus_sso_session');
        if (saved) {
          localStorage.setItem('frameplus_sso_session', JSON.stringify({ ...JSON.parse(saved), ...merged }));
        }
      } catch {}
      await fetch(`/api/users/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
    }
  };

  useEffect(() => {
    const checkQuota = () => {
      const isExceeded = sessionStorage.getItem('firestore_quota_exceeded') === 'true' || (window as any).isFirestoreQuotaExceeded === true;
      if (isExceeded !== quotaExceeded) {
        setQuotaExceeded(isExceeded);
      }
    };
    
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('firestore-quota-exceeded', handleQuota);
    
    const interval = setInterval(checkQuota, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('firestore-quota-exceeded', handleQuota);
    };
  }, [quotaExceeded]);

  const urlParams = new URLSearchParams(window.location.search);
  const forceMainApp = urlParams.get('app') === '1' || urlParams.get('main') === '1' || urlParams.get('dashboard') === '1';
  const pathSegment = window.location.pathname.replace(/^\/+/, '').split('/')[0];
  const gallerySlug = urlParams.get('gallery');
  const querySiteSlug = urlParams.get('site') || urlParams.get('s');
  const reservedPaths = ['admin', 'hub', 'dashboard', 'planos', 'colecoes', 'inicio', 'editor', 'login', 'cadastro', 'configuracoes', 'api', 'site'];
  const pathSiteSlug = (!reservedPaths.includes(pathSegment.toLowerCase()) && pathSegment && !pathSegment.includes('.')) ? pathSegment : '';
  const siteSlug = querySiteSlug || pathSiteSlug;
  const currentHost = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const customPlatformHost = ((import.meta as any).env?.VITE_PLATFORM_HOST || '').toLowerCase();
  
  const isPlatformHost =
    forceMainApp ||
    !currentHost ||
    currentHost === 'localhost' ||
    currentHost === '127.0.0.1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(currentHost) ||
    (customPlatformHost && currentHost.includes(customPlatformHost)) ||
    currentHost.endsWith('.run.app') ||
    currentHost.endsWith('.framepro.click') ||
    currentHost.endsWith('.framepro.com') ||
    currentHost.endsWith('.google.com') ||
    currentHost.endsWith('.googleusercontent.com') ||
    currentHost.endsWith('.easypanel.host') ||
    currentHost.includes('easypanel') ||
    currentHost.endsWith('.railway.app') ||
    currentHost.endsWith('.render.com') ||
    currentHost.endsWith('.vercel.app') ||
    currentHost.endsWith('.netlify.app') ||
    currentHost.endsWith('.fly.dev') ||
    currentHost.endsWith('.pages.dev');
  const isCustomDomainHost = !isPlatformHost && !gallerySlug && (!pathSegment || !reservedPaths.includes(pathSegment.toLowerCase()));
  const isPublicView = !forceMainApp && (!!gallerySlug || !!siteSlug || isCustomDomainHost);

  // 0. Connection check (Non-blocking warning)
  useEffect(() => {
    checkConnection().then(available => {
      setIsFirestoreAvailable(available);
      if (!available) {
        console.warn("Firestore connection check failed. The app will continue in offline/retry mode.");
      }
    });
  }, []);

  // 1. Unified FramePro SSO & Auth Listener
  useEffect(() => {
    let isMounted = true;

    const initUnifiedAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const isPublic = !!queryParams.get('gallery');
      const ssoTicket = queryParams.get('sso_ticket') || '';
      const ssoOrigin = queryParams.get('sso_origin') || '';

      const hashStr = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      const hashParams = new URLSearchParams(hashStr);
      const hashAccessToken = hashParams.get('access_token') || '';
      const hashRefreshToken = hashParams.get('refresh_token') || '';

      // Also check document.cookie for framepro_sso_bridge (.framepro.click)
      let cookieTicket = '';
      let cookieAccessToken = '';
      let cookieRefreshToken = '';
      try {
        const match = document.cookie.match(/(?:^|;\s*)framepro_sso_bridge=([^;]*)/);
        if (match && match[1]) {
          const decoded = decodeURIComponent(match[1]);
          try {
            const parsedBridge = JSON.parse(decoded);
            cookieTicket = parsedBridge.ticket || '';
            cookieAccessToken = parsedBridge.access_token || '';
            cookieRefreshToken = parsedBridge.refresh_token || '';
          } catch {
            if (decoded.startsWith('fpsso_')) cookieTicket = decoded;
          }
        }
      } catch {}

      const finalTicket = ssoTicket || cookieTicket;
      const finalAccessToken = hashAccessToken || cookieAccessToken;
      const finalRefreshToken = hashRefreshToken || cookieRefreshToken;
      const hasSsoPayload = Boolean(finalTicket || finalAccessToken);

      if (hasSsoPayload) {
        try {
          if (!isPublic) {
            setCollectionsState(null);
          }

          let verifiedUser: any = null;

          // Step 1: Verify via FramePlus server proxy (/api/sso/verify)
          const verifyRes = await fetch('/api/sso/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(finalAccessToken ? { 'Authorization': `Bearer ${finalAccessToken}` } : {})
            },
            body: JSON.stringify({
              ticket: finalTicket,
              access_token: finalAccessToken,
              refresh_token: finalRefreshToken,
              sso_origin: ssoOrigin
            })
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (verifyData && verifyData.valid && verifyData.user) {
              verifiedUser = verifyData.user;
            }
          }

          // Step 2: Direct browser fallback to CRM /api/sso/verify if ticket/token present
          if (!verifiedUser && (finalTicket || finalAccessToken)) {
            const crmEndpoint = `${(ssoOrigin || 'https://crm.framepro.click').replace(/\/+$/, '')}/api/sso/verify`;
            try {
              const directRes = await fetch(crmEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(finalAccessToken ? { 'Authorization': `Bearer ${finalAccessToken}` } : {})
                },
                body: JSON.stringify({
                  ...(finalTicket ? { ticket: finalTicket } : {}),
                  ...(finalAccessToken ? { access_token: finalAccessToken } : {})
                })
              });
              if (directRes.ok) {
                const directData = await directRes.json();
                if (directData && directData.valid && directData.user) {
                  const crmU = directData.user;
                  const syncRes = await fetch(`/api/users/${crmU.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      uid: crmU.id,
                      crmId: crmU.id,
                      email: crmU.email,
                      displayName: crmU.name || crmU.email?.split('@')[0],
                      photoURL: crmU.avatar_url || '',
                      role: crmU.role || 'user',
                      crmPlan: crmU.plan || ''
                    })
                  });
                  verifiedUser = syncRes.ok ? await syncRes.json() : {
                    uid: crmU.id,
                    crmId: crmU.id,
                    email: crmU.email,
                    displayName: crmU.name || crmU.email?.split('@')[0],
                    photoURL: crmU.avatar_url || '',
                    role: crmU.role || 'user'
                  };
                }
              }
            } catch (directErr) {
              console.warn("Direct browser SSO verify fallback failed:", directErr);
            }
          }

          // Clean URL query params (?sso_ticket, ?sso_origin) and #access_token hash
          try {
            queryParams.delete('sso_ticket');
            queryParams.delete('sso_origin');
            const remainingQuery = queryParams.toString();
            const cleanUrl = window.location.pathname + (remainingQuery ? `?${remainingQuery}` : '');
            window.history.replaceState({}, document.title, cleanUrl);
            document.cookie = 'framepro_sso_bridge=; Path=/; Max-Age=0; SameSite=Lax';
            document.cookie = 'framepro_sso_bridge=; Domain=.framepro.click; Path=/; Max-Age=0; SameSite=Lax';
          } catch {}

          if (verifiedUser && isMounted) {
            handleAuthSuccess(verifiedUser);
            return;
          }
        } catch (ssoErr) {
          console.error("Error processing FramePro SSO login:", ssoErr);
        }
      }

      // Check existing saved FramePro SSO session in localStorage
      try {
        const savedSession = localStorage.getItem('frameplus_sso_session');
        if (savedSession) {
          const parsedUser = JSON.parse(savedSession);
          if (parsedUser && parsedUser.uid) {
            if (isMounted) {
              if (!isPublic) setCollectionsState(null);
              setUser(parsedUser);
              setIsAuthInited(true);
            }
            return;
          }
        }
      } catch {}
    };

    initUnifiedAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      // Do not overwrite an active FramePro SSO session when Firebase auth is null
      try {
        const savedSession = localStorage.getItem('frameplus_sso_session');
        if (savedSession && !u) {
          const parsedUser = JSON.parse(savedSession);
          if (parsedUser && parsedUser.uid) {
            setUser(parsedUser);
            setIsAuthInited(true);
            return;
          }
        }
      } catch {}

      setUser(u);
      setIsAuthInited(true);
      
      const queryParams = new URLSearchParams(window.location.search);
      const isPublic = !!queryParams.get('gallery');
      if (!isPublic) {
        setCollectionsState(null); // Reset collections so guest example collections are not shown for logged-in users
      }
      if (u) {
        // Skip Firestore sync if quota is exceeded
        if ((window as any).isFirestoreQuotaExceeded || sessionStorage.getItem('firestore_quota_exceeded') === 'true') {
          console.warn("Skipping user sync due to Firestore quota.");
          return;
        }

        // Ensure user doc exists on Server for existing sessions
        try {
          await fetch(`/api/users/${u.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL
            })
          });
        } catch (err: any) {
          console.error("Error sync user profile on login:", err);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Collections Loader
  useEffect(() => {
    if (!isAuthInited || !user || isPublicView) return;

    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        if (response.ok) {
          const list = await response.json();
          // Match collections belonging to this user by uid or crmId
          const validIds = new Set(
            [user.uid, user.crmId, userProfile?.uid, userProfile?.crmId]
              .filter(Boolean)
              .map((id: string) => id.toString().toLowerCase().trim())
          );
          const owned = list.filter(
            (c: any) =>
              !c.ownerId ||
              c.ownerId === 'default' ||
              validIds.has(c.ownerId.toString().toLowerCase().trim())
          );
          setCollectionsState(owned);
          setIsInitialized(true);
        } else {
          setCollectionsState([]);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error loading collections from server API:", error);
        setCollectionsState([]);
        setIsInitialized(true);
      }
    };
    fetchCollections();
  }, [user, userProfile?.crmId, isAuthInited, isPublicView]);

  // 3. Plans Loader
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (response.ok) {
          const docs = await response.json();
          setPlans(docs);
        }
      } catch (err) {
        console.error("Error loaded plans from server:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleSavePlan = async (data: any) => {
    try {
      const cleanData = { 
        ...data, 
        updatedAt: new Date().toISOString(),
        // Ensure numbers
        storageGB: Number(data.storageGB),
        displayOrder: Number(data.displayOrder)
      };
      
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      if (response.ok) {
        const savedPlan = await response.json();
        setPlans(prev => {
          const idx = prev.findIndex(p => p.id === savedPlan.id);
          if (idx !== -1) {
            return prev.map(p => p.id === savedPlan.id ? savedPlan : p);
          }
          return [...prev, savedPlan];
        });
        setIsPlanModalOpen(false);
      } else {
        throw new Error("HTTP error saving plan");
      }
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este plano?")) return;
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setPlans(prev => prev.filter(p => p.id !== id));
        setIsPlanModalOpen(false);
      } else {
        throw new Error("HTTP error deleting plan");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  // 3. Public View Loader
  useEffect(() => {
    if (!isPublicView) return;
    
    const loadPublic = async () => {
      try {
        let finalDocs: any[] = [];
        const publicStatusList = ['Público', 'Pública', 'Publico', 'Publica', 'Publicada', 'Publicado', 'público', 'pública', 'publico', 'publica', 'publicada', 'publicado'];
        
        const response = await fetch('/api/collections');
        if (response.ok) {
          const allCollections = await response.json();
          
          if (gallerySlug) {
            // 1. Single gallery view: Try finding target doc by slug or id with intelligent priority
            const candidateDocs = allCollections.filter((c: any) => {
              const matchesId = c.id?.toString() === gallerySlug?.toString();
              const matchesSlug = c.slug?.toLowerCase() === gallerySlug?.toLowerCase();
              const titleSlug = (c.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              const matchesTitle = titleSlug === gallerySlug?.toLowerCase();
              return matchesId || matchesSlug || matchesTitle;
            });

            candidateDocs.sort((a: any, b: any) => {
              if (a.id?.toString() === gallerySlug?.toString()) return -1;
              if (b.id?.toString() === gallerySlug?.toString()) return 1;

              const aIsReal = Boolean(a.ownerId || a.id?.toString().startsWith('col_'));
              const bIsReal = Boolean(b.ownerId || b.id?.toString().startsWith('col_'));
              if (aIsReal && !bIsReal) return -1;
              if (!aIsReal && bIsReal) return 1;

              const aMediaCount = Array.isArray(a.media) ? a.media.length : 0;
              const bMediaCount = Array.isArray(b.media) ? b.media.length : 0;
              if (aMediaCount !== bMediaCount) return bMediaCount - aMediaCount;

              const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
              const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
              return bTime - aTime;
            });

            const targetDoc = candidateDocs[0];

            if (targetDoc) {
              finalDocs.push(targetDoc);
              
              if (targetDoc.type === 'folder') {
                const children = allCollections.filter((c: any) =>
                  c.parentId?.toString() === targetDoc.id?.toString()
                );
                finalDocs.push(...children);
              }
            }
          } else if (siteSlug) {
            // 2. Full photographer website view: load all published collections
            finalDocs = allCollections.filter((c: any) => {
              const isPub = !c.status || publicStatusList.includes(c.status);
              return isPub;
            });
            if (finalDocs.length === 0 && allCollections.length > 0) {
              finalDocs = allCollections;
            }
          }
        }

        setCollectionsState(finalDocs);
        setIsInitialized(true);
      } catch (err) {
        console.error("Public load error:", err);
        setCollectionsState([]);
        setIsInitialized(true);
      }
    };
    loadPublic();
  }, [isPublicView, gallerySlug, siteSlug]);

  // 4. Persistence / Sync for guest users
  useEffect(() => {
    if (!isAuthInited || user || isPublicView) return;

    const storageKey = 'frame_collections_guest';
    const init = async () => {
      try {
        const saved = await get(storageKey);
        if (saved && Array.isArray(saved) && saved.length > 0) {
          setCollectionsState(saved);
        } else {
          const lsSaved = localStorage.getItem(storageKey);
          if (lsSaved) {
            try {
              const parsed = JSON.parse(lsSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setCollectionsState(parsed);
              } else {
                setCollectionsState(initialCollections);
              }
            } catch (e) {
              setCollectionsState(initialCollections);
            }
          } else {
            setCollectionsState(initialCollections);
          }
        }
      } catch (e) {
        setCollectionsState(initialCollections);
      } finally {
        setIsInitialized(true);
      }
    };
    init();

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'sync' && !user) {
        get(storageKey).then((updated) => {
          if (updated) {
            setCollectionsState(prev => {
              const updatedStr = JSON.stringify(updated);
              if (JSON.stringify(prev) !== updatedStr) {
                return updated;
              }
              return prev;
            });
          }
        });
      } else if (e.data.type === 'request_sync' && !isPublicView && !user) {
        setCollectionsState(current => {
          if (current) {
            set(storageKey, current).then(() => {
              bc.postMessage({ type: 'sync', ts: Date.now() });
            });
          }
          return current;
        });
      }
    };
    bc.addEventListener('message', handleMessage);
    bc.postMessage({ type: 'request_sync' });
    return () => bc.removeEventListener('message', handleMessage);
  }, [user, isPublicView, isAuthInited]);

  const lastSavedRef = useRef<string>('');
  
  useEffect(() => {
    if (isInitialized && collectionsState !== null && !isPublicView) {
      const stateStr = JSON.stringify(collectionsState);
      if (stateStr !== lastSavedRef.current) {
        const timer = setTimeout(() => {
          lastSavedRef.current = stateStr;
          const storageKey = user ? `frame_collections_${user.uid}` : 'frame_collections_guest';
          
          set(storageKey, collectionsState);
          try {
            localStorage.setItem(storageKey, stateStr);
          } catch (e) {}
          
          if (!user) {
            bc.postMessage({ type: 'sync', ts: Date.now() });
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [collectionsState, isInitialized, isPublicView, user]);

  const syncMediaToSubcollection = async (idStr: string, mediaArray: string[]) => {
    return Promise.resolve();
  };

  // Load media dynamically for the active collection (media is already built-in on our API)
  useEffect(() => {
    if (!collectionsState || collectionsState.length === 0) return;
    
    // Determine which collection is active
    let activeId: string | null = null;
    if (isPublicView && gallerySlug) {
      if (!gallerySlug.startsWith('folder/')) {
        const found = collectionsState.find((c: any) => 
          c.type !== 'folder' && 
          (
            c.slug?.toLowerCase() === gallerySlug.toLowerCase() || 
            c.id === gallerySlug ||
            (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === gallerySlug.toLowerCase())
          )
        );
        if (found) activeId = found.id.toString();
      }
    } else if (currentCollectionId) {
      activeId = currentCollectionId.toString();
    }
    
    if (!activeId) return;
    
    const activeColl = collectionsState.find((c: any) => c.id.toString() === activeId!.toString());
    if (!activeColl || activeColl._mediaLoaded) return;
    
    setCollectionsState((prev) => {
      if (!prev) return prev;
      return prev.map((c: any) => {
        if (c.id.toString() === activeId!.toString()) {
          return {
            ...c,
            media: c.media || [],
            _mediaLoaded: true
          };
        }
        return c;
      });
    });
  }, [collectionsState, currentCollectionId, gallerySlug, isPublicView]);

  const updateCollection = async (id: any, updates: any) => {
    const idStr = id.toString();
    
    // Always update locally for instant UI responsiveness
    setCollectionsState((prev: any[] | null) => {
      if (!prev) return prev;
      return prev.map((c: any) => {
        if (c.id.toString() === idStr) {
          const merged = { ...c, ...updates, _mediaLoaded: true };
          // Keep primary cover thumbnail if empty and media has items
          if ('media' in updates && Array.isArray(updates.media) && updates.media.length > 0 && !merged.image) {
            merged.image = updates.media[0];
          }
          return merged;
        }
        return c;
      });
    });

    try {
      const currentArr = collectionsState || [];
      const activeColl = currentArr.find((c: any) => c.id.toString() === idStr);
      const fullCollObj = {
        ...(activeColl || {}),
        ...updates,
        id: idStr
      };
      if (user?.uid && !fullCollObj.ownerId) {
        fullCollObj.ownerId = user.uid;
      }
      // Keep primary cover thumbnail if empty and media has items
      if ('media' in updates && Array.isArray(updates.media) && updates.media.length > 0 && !fullCollObj.image) {
        fullCollObj.image = updates.media[0];
      }

      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullCollObj)
      });
      if (!response.ok) {
        throw new Error("HTTP error saving to API JSON DB");
      }
    } catch (err) {
      console.error("updateCollection server sync failed:", err);
    }
  };

  if (!isFirestoreAvailable && (collectionsState === null || (isInitialized && collectionsState.length === 0))) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 text-red-500 shadow-inner">
          <Globe className="w-12 h-12 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Ops! Problema de conexão ou limite atingido</h1>
        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">Não conseguimos sincronizar seus dados agora. Isso pode ser devido a uma falha na internet ou ao limite diário de uso do Firebase (Spark Plan) ter sido atingido.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => {
              setIsFirestoreAvailable(true);
              if (collectionsState === null) setCollectionsState([]);
            }}
            className="flex-1 bg-[#D05634] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#b84a2b] transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Ver Offline
          </button>
        </div>
      </div>
    );
  }

  if (collectionsState === null) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <img 
          src="https://cdn.plus.framepro.click/uploads/m30bw01epp9ab69/1778539446000-FMiPg.gif" 
          alt="Carregando..." 
          className="w-48 h-auto"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Handle routing
  if (siteSlug || isCustomDomainHost) {
    return <PublicWebsiteView siteSlug={siteSlug} collections={collectionsState || []} />;
  }

  if (gallerySlug) {
    if (gallerySlug.startsWith('folder/')) {
      const folderSlug = gallerySlug.replace('folder/', '');
      const folder = collectionsState.find((c: any) => c.type === 'folder' && (c.slug === folderSlug || c.slug === folderSlug + '-folder' || (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === folderSlug)));
      
      if (folder) {
        return <PublicFolderView folder={folder} collections={collectionsState.filter(c => c.parentId === folder.id)} />;
      }
    } else {
      const candidates = (collectionsState || []).filter((c: any) => 
        c.type !== 'folder' && 
        (
          c.id?.toString() === gallerySlug.toString() ||
          c.slug?.toLowerCase() === gallerySlug.toLowerCase() || 
          (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === gallerySlug.toLowerCase())
        )
      );

      candidates.sort((a: any, b: any) => {
        if (a.id?.toString() === gallerySlug.toString()) return -1;
        if (b.id?.toString() === gallerySlug.toString()) return 1;

        const aIsReal = Boolean(a.ownerId || a.id?.toString().startsWith('col_'));
        const bIsReal = Boolean(b.ownerId || b.id?.toString().startsWith('col_'));
        if (aIsReal && !bIsReal) return -1;
        if (!aIsReal && bIsReal) return 1;

        const aMediaCount = Array.isArray(a.media) ? a.media.length : 0;
        const bMediaCount = Array.isArray(b.media) ? b.media.length : 0;
        if (aMediaCount !== bMediaCount) return bMediaCount - aMediaCount;

        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      });

      const gallery = candidates[0];
      
      if (gallery) {
        const parentFolder = collectionsState.find((c: any) => c.type === 'folder' && c.id === gallery.parentId);
        return <PublicGalleryView collection={gallery} parentFolder={parentFolder} onUpdateCollection={updateCollection} />;
      }
    }
    
    // If we're in public view and data loaded but nothing found
    if (isPublicView) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Galeria não encontrada ou privada</h1>
          <p className="text-gray-500 max-w-sm mb-2">A galeria que você está procurando não existe ou está definida como rascunho pelo fotógrafo.</p>
          <p className="text-xs text-gray-400 max-w-xs">Verifique se o link está correto ou entre em contato com o responsável.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 text-[#D05634] font-bold hover:underline"
          >
            Voltar para o Início
          </button>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#FFF0EB] selection:text-[#D05634]">
      {quotaExceeded && (
        <div className="bg-red-600 py-3 px-4 flex items-center justify-center gap-3 text-white text-xs font-black uppercase tracking-widest animate-pulse sticky top-0 z-[9999] shadow-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>⚠️ Atenção: Cota do Firebase esgotada. Suas alterações serão salvas apenas localmente neste navegador até a renovação da cota (diária).</span>
        </div>
      )}
      {!isPublicView && (
        <Navbar 
          activeTab={activeTab === 'editor' ? 'colecoes' : activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          userProfile={userProfile}
          storageInfo={currentStorageInfo}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          globalTheme={globalTheme}
          onToggleGlobalTheme={toggleGlobalTheme}
        />
      )}
      
      <main>
        {!isFirestoreAvailable && isInitialized && (
          <div className="bg-[#FFF0EB] border-b border-[#D0563410] py-2 px-4 flex items-center justify-center gap-2 text-[#D05634] text-xs font-bold animate-in slide-in-from-top duration-500">
            <Globe className="w-3.5 h-3.5 animate-pulse" />
            <span>MODO OFFLINE ATIVADO • Verificando conexão com o servidor...</span>
          </div>
        )}
        {activeTab === 'inicio' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'planos' && (
        <PricingView 
          plans={plans} 
          isAdmin={isAdmin} 
          onEditPlan={(p) => {
            setSelectedPlan(p);
            setIsPlanModalOpen(true);
          }}
          onAddPlan={(category) => {
            setSelectedPlan({ category });
            setIsPlanModalOpen(true);
          }}
          onDeletePlan={handleDeletePlan}
        />
      )}
        {activeTab === 'colecoes' && (
          user ? (
            <CollectionsView 
              setActiveTab={setActiveTab}
              collections={collectionsState || []}
              setCollections={setCollectionsState}
              setCurrentCollectionId={setCurrentCollectionId}
              user={user}
              userProfile={userProfile}
              storageInfo={currentStorageInfo}
            />
          ) : (
            <AuthForm mode="login" onToggleMode={() => setActiveTab('cadastro')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
          )
        )}
        {activeTab === 'editor' && (
          user ? (
            <EditorView 
              key={currentCollectionId}
              setActiveTab={setActiveTab}
              collection={(collectionsState || []).find((c: any) => c.id === currentCollectionId)}
              onUpdateCollection={updateCollection}
              userProfile={userProfile}
              storageInfo={currentStorageInfo}
            />
          ) : (
            <AuthForm mode="login" onToggleMode={() => setActiveTab('cadastro')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
          )
        )}
        {activeTab === 'login' && (
          <AuthForm mode={authRecoveryMode ? 'recovery' : 'login'} onToggleMode={() => setActiveTab('cadastro')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
        )}
        {activeTab === 'cadastro' && (
          <AuthForm mode="register" onToggleMode={() => setActiveTab('login')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
        )}
        {activeTab === 'admin' && (
          <AdminView setActiveTab={setActiveTab} user={user} isAdmin={isAdmin} />
        )}
        {activeTab === 'configuracoes' && (
          user ? (
            <ConfiguracoesView 
              user={user} 
              userProfile={userProfile} 
              onUpdateProfile={updateUserProfile} 
            />
          ) : (
            <AuthForm mode="login" onToggleMode={() => setActiveTab('cadastro')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
          )
        )}
        {activeTab === 'site' && (
          user ? (
            <SiteBuilderView 
              user={user} 
              userProfile={userProfile} 
              collections={collectionsState || []} 
              setActiveTab={setActiveTab} 
              globalTheme={globalTheme}
              onToggleGlobalTheme={toggleGlobalTheme}
            />
          ) : (
            <AuthForm mode="login" onToggleMode={() => setActiveTab('cadastro')} onToggleRecovery={setAuthRecoveryMode} onAuthSuccess={handleAuthSuccess} />
          )
        )}
      </main>

      {isPlanModalOpen && selectedPlan && (
        <PlanSettingsModal 
          plan={selectedPlan}
          onClose={() => setIsPlanModalOpen(false)}
          onSave={handleSavePlan}
          onDelete={selectedPlan.id ? handleDeletePlan : undefined}
        />
      )}
    </div>
  );
}
