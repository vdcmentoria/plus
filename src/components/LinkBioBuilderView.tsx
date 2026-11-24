import React, { useEffect, useRef, useState } from 'react';
import {
  Link2,
  User as UserIcon,
  Palette,
  Share2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Upload,
  Save,
  Loader2,
  Eye,
  EyeOff,
  MousePointerClick,
  BarChart3,
  Sparkles,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  AlignLeft,
  AlignCenter
} from 'lucide-react';
import {
  BioPageCanvas,
  BioPageData,
  BioLinkItem,
  BioLinkIcon,
  BioLinkType,
  BioSocialItem,
  BioSocialPlatform,
  BioButtonStyle,
  BioImageEffect,
  BIO_THEME_PRESETS,
  BIO_FONT_OPTIONS,
  renderBioLinkIcon,
  renderBioSocialIcon
} from './PublicBioView';
import { convertToWebP } from '../utils/imageOptimizer';

const LINK_ICON_OPTIONS: { value: BioLinkIcon; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'camera', label: 'Câmera / Portfólio' },
  { value: 'newspaper', label: 'Blog / Editorial' },
  { value: 'users', label: 'Portal do Cliente' },
  { value: 'briefcase', label: 'Orçamento' },
  { value: 'calendar', label: 'Agenda / Data' },
  { value: 'globe', label: 'Website' },
  { value: 'heart', label: 'Casamentos / Favoritos' },
  { value: 'video', label: 'Filmes / Reels' },
  { value: 'shopping-bag', label: 'Loja / Álbuns' },
  { value: 'mail', label: 'E-mail' },
  { value: 'map-pin', label: 'Localização' },
  { value: 'sparkles', label: 'Destaque' },
  { value: 'link', label: 'Link Geral' }
];

const LINK_TYPE_OPTIONS: { value: BioLinkType; label: string }[] = [
  { value: 'url', label: 'Link (URL)' },
  { value: 'whatsapp', label: 'WhatsApp Direto' },
  { value: 'portfolio', label: 'Portfólio / Site' },
  { value: 'portal', label: 'Portal / Galeria' },
  { value: 'orcamento', label: 'Orçamento' },
  { value: 'blog', label: 'Blog / Artigos' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' }
];

const SOCIAL_PLATFORM_OPTIONS: { value: BioSocialPlatform; label: string; placeholder: string }[] = [
  { value: 'instagram', label: 'Instagram', placeholder: '@seuestudio ou https://instagram.com/...' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: '5511999999999' },
  { value: 'website', label: 'Website', placeholder: 'https://seusite.com.br' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@seucanal' },
  { value: 'tiktok', label: 'TikTok', placeholder: '@seuestudio' },
  { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/seuestudio' },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/seuestudio' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { value: 'email', label: 'E-mail', placeholder: 'contato@seuestudio.com.br' }
];

function sanitizeSlug(raw: string): string {
  return (raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function buildDefaultBio(
  ownerId: string,
  user: any,
  userProfile: any,
  userSite?: any
): BioPageData {
  const studioName =
    userSite?.studioName ||
    userSite?.brandName ||
    userProfile?.studioName ||
    userProfile?.displayName ||
    user?.displayName ||
    (user?.email ? user.email.split('@')[0] : 'Meu Estúdio');

  const rawSlugSource =
    userSite?.slug ||
    studioName ||
    (user?.email ? user.email.split('@')[0] : 'meu-estudio');

  const cleanSlug = sanitizeSlug(rawSlugSource) || `studio-${Date.now().toString(36)}`;

  const host = typeof window !== 'undefined' ? window.location.origin : 'https://site.framepro.click';
  const siteUrl = userSite?.customDomain
    ? `https://${String(userSite.customDomain).replace(/^https?:\/\//, '')}`
    : userSite?.slug
      ? `${host}/${userSite.slug}`
      : host;

  const rawPhone =
    userSite?.whatsapp ||
    userSite?.contactPhone ||
    userProfile?.phone ||
    '';

  const rawInstagram =
    userSite?.instagram ||
    userProfile?.instagram ||
    '';

  const rawAvatar =
    [userSite?.bioPhotoUrl, userProfile?.photoURL, user?.photoURL, userSite?.logoUrl].find(
      (u) => typeof u === 'string' && u.trim() !== '' && !u.includes('1472099645785-5658abf4ff4e')
    ) || '';

  return {
    ownerId,
    slug: cleanSlug,
    published: true,
    themePreset: 'clean-editorial',
    displayName: studioName.toUpperCase(),
    eyebrow: 'FOTOGRAFIA • DIREÇÃO EDITORIAL',
    bioText:
      userSite?.heroSubtitle ||
      'Transformando momentos reais e emoções autênticas em memórias inesquecíveis.',
    avatarUrl: rawAvatar,
    avatarSize: 'lg',
    avatarPosition: '50% 15%',
    coverBannerUrl: '',
    bgImageUrl: '',
    bgImageOverlayOpacity: 0.88,
    bgColor: '#FFFFFF',
    surfaceColor: '#F9FAFB',
    textColor: '#101828',
    mutedColor: '#667085',
    accentColor: '#475467',
    titleFont: 'Raleway',
    bodyFont: 'Poppins',
    buttonStyle: 'line',
    showNumbers: true,
    alignment: 'left',
    imageEffect: 'soft_zoom',
    showFooterCredit: true,
    footerCreditText: 'Criado com Frame+',
    links: [
      {
        id: 'lnk_1',
        label: 'RESERVE SUA DATA',
        subtitle: '',
        url: rawPhone ? `https://wa.me/${String(rawPhone).replace(/\D/g, '')}` : 'https://wa.me/',
        type: 'whatsapp',
        icon: 'whatsapp',
        active: true,
        whatsappPhone: String(rawPhone || ''),
        whatsappMessage: 'Olá! Gostaria de verificar disponibilidade de data e valores.'
      },
      {
        id: 'lnk_2',
        label: 'NOSSO TRABALHO',
        subtitle: '',
        url: siteUrl,
        type: 'portfolio',
        icon: 'camera',
        active: true
      },
      {
        id: 'lnk_3',
        label: 'NOSSO BLOG',
        subtitle: '',
        url: siteUrl,
        type: 'blog',
        icon: 'newspaper',
        active: true
      },
      {
        id: 'lnk_4',
        label: 'PORTAL DO CLIENTE',
        subtitle: '',
        url: siteUrl,
        type: 'portal',
        icon: 'users',
        active: true
      },
      {
        id: 'lnk_5',
        label: 'ORÇAMENTO & CONTATO',
        subtitle: '',
        url: rawPhone ? `https://wa.me/${String(rawPhone).replace(/\D/g, '')}` : `${siteUrl}#contato`,
        type: 'orcamento',
        icon: 'briefcase',
        active: true
      }
    ],
    socials: [
      {
        id: 'soc_1',
        platform: 'instagram',
        url: rawInstagram || 'https://instagram.com/',
        active: true
      },
      {
        id: 'soc_2',
        platform: 'whatsapp',
        url: rawPhone ? String(rawPhone) : 'https://wa.me/',
        active: true
      },
      {
        id: 'soc_3',
        platform: 'website',
        url: siteUrl,
        active: true
      }
    ],
    viewsCount: 0,
    totalClicks: 0
  };
}

export function LinkBioBuilderView({
  user,
  userProfile
}: {
  user: any;
  userProfile?: any;
}) {
  const ownerId = user?.uid || userProfile?.uid || user?.email || 'default';
  const [bio, setBio] = useState<BioPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'links' | 'perfil' | 'aparencia' | 'compartilhar'>('links');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<'avatar' | 'cover' | 'bg' | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const loadBio = async () => {
      setIsLoading(true);
      try {
        const [biosRes, sitesRes] = await Promise.all([
          fetch(`/api/bios?ownerId=${encodeURIComponent(ownerId)}`),
          fetch(`/api/sites?ownerId=${encodeURIComponent(ownerId)}`).catch(() => null)
        ]);

        let existingBio: BioPageData | null = null;
        if (biosRes.ok) {
          const list = await biosRes.json();
          if (Array.isArray(list) && list.length > 0) {
            existingBio = list[0];
          }
        }

        let userSite: any = null;
        if (sitesRes && sitesRes.ok) {
          const sites = await sitesRes.json();
          if (Array.isArray(sites) && sites.length > 0) {
            userSite = sites[0];
          }
        }

        if (active) {
          if (existingBio) {
            setBio({
              ...buildDefaultBio(ownerId, user, userProfile, userSite),
              ...existingBio
            });
            setHasUnsavedChanges(false);
          } else {
            setBio(buildDefaultBio(ownerId, user, userProfile, userSite));
            setHasUnsavedChanges(true);
          }
        }
      } catch (err) {
        console.error('Error loading Link na Bio:', err);
        if (active) {
          setBio(buildDefaultBio(ownerId, user, userProfile));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadBio();
    return () => {
      active = false;
    };
  }, [ownerId]);

  const updateBio = (patch: Partial<BioPageData>) => {
    setBio((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasUnsavedChanges(true);
  };

  const getPublicBioUrl = (slug: string) => {
    const clean = sanitizeSlug(slug);
    if (typeof window === 'undefined') return `/bio/${clean}`;
    return `${window.location.origin}/bio/${clean}`;
  };

  const handleSave = async () => {
    if (!bio) return;
    const cleanSlug = sanitizeSlug(bio.slug);
    if (!cleanSlug) {
      setSaveFeedback({ type: 'error', text: 'Defina um endereço (slug) válido antes de salvar.' });
      return;
    }

    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const response = await fetch('/api/bios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bio,
          ownerId,
          slug: cleanSlug
        })
      });
      const result = await response.json();
      if (!response.ok) {
        setSaveFeedback({
          type: 'error',
          text: result?.error || 'Não foi possível salvar o Link na Bio.'
        });
        return;
      }
      setBio(result);
      setHasUnsavedChanges(false);
      setSaveFeedback({
        type: 'success',
        text: 'Link na Bio salvo e pronto para usar no seu Instagram!'
      });
      setTimeout(() => {
        setSaveFeedback((curr) => (curr?.type === 'success' ? null : curr));
      }, 4000);
    } catch (err) {
      console.error('Error saving bio:', err);
      setSaveFeedback({ type: 'error', text: 'Erro de conexão ao salvar. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!bio?.slug) return;
    try {
      await navigator.clipboard.writeText(getPublicBioUrl(bio.slug));
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {}
  };

  const handleUploadImage = async (
    file: File | undefined,
    field: 'avatar' | 'cover' | 'bg'
  ) => {
    if (!file || !bio) return;
    setUploadingField(field);
    setSaveFeedback(null);
    try {
      const optimized = await convertToWebP(file, {
        quality: 0.9,
        maxDimension: field === 'avatar' ? 1200 : 2400
      });
      const formData = new FormData();
      formData.append('file', optimized);
      formData.append('folder', 'link-bio');
      formData.append('ownerId', ownerId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        throw new Error('Falha no upload da imagem');
      }
      const data = await res.json();
      const uploadedUrl = data.url || data.fileUrl;
      if (uploadedUrl) {
        if (field === 'avatar') updateBio({ avatarUrl: uploadedUrl });
        if (field === 'cover') updateBio({ coverBannerUrl: uploadedUrl });
        if (field === 'bg') updateBio({ bgImageUrl: uploadedUrl });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setSaveFeedback({ type: 'error', text: 'Erro ao enviar imagem. Tente novamente.' });
    } finally {
      setUploadingField(null);
    }
  };

  const handleApplyPreset = (presetId: BioPageData['themePreset']) => {
    const preset = BIO_THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    updateBio({
      themePreset: preset.id,
      bgColor: preset.bgColor,
      surfaceColor: preset.surfaceColor,
      textColor: preset.textColor,
      mutedColor: preset.mutedColor,
      accentColor: preset.accentColor,
      titleFont: preset.titleFont,
      bodyFont: preset.bodyFont,
      buttonStyle: preset.buttonStyle,
      showNumbers: preset.showNumbers,
      alignment: preset.alignment,
      imageEffect: preset.imageEffect
    });
  };

  const handleAddLink = () => {
    if (!bio) return;
    const newItem: BioLinkItem = {
      id: `lnk_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      label: 'NOVO LINK',
      subtitle: '',
      url: 'https://',
      type: 'url',
      icon: 'link',
      active: true
    };
    updateBio({ links: [...bio.links, newItem] });
    setExpandedLinkId(newItem.id);
  };

  const handleUpdateLink = (id: string, patch: Partial<BioLinkItem>) => {
    if (!bio) return;
    updateBio({
      links: bio.links.map((item) => (item.id === id ? { ...item, ...patch } : item))
    });
  };

  const handleMoveLink = (index: number, direction: -1 | 1) => {
    if (!bio) return;
    const target = index + direction;
    if (target < 0 || target >= bio.links.length) return;
    const next = [...bio.links];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    updateBio({ links: next });
  };

  const handleDeleteLink = (id: string) => {
    if (!bio) return;
    updateBio({ links: bio.links.filter((l) => l.id !== id) });
    if (expandedLinkId === id) setExpandedLinkId(null);
  };

  const handleAddSocial = () => {
    if (!bio) return;
    const used = new Set(bio.socials.map((s) => s.platform));
    const nextPlatform =
      SOCIAL_PLATFORM_OPTIONS.find((p) => !used.has(p.value))?.value || 'instagram';
    const newSocial: BioSocialItem = {
      id: `soc_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      platform: nextPlatform,
      url: '',
      active: true
    };
    updateBio({ socials: [...bio.socials, newSocial] });
  };

  const handleUpdateSocial = (id: string, patch: Partial<BioSocialItem>) => {
    if (!bio) return;
    updateBio({
      socials: bio.socials.map((s) => (s.id === id ? { ...s, ...patch } : s))
    });
  };

  const handleDeleteSocial = (id: string) => {
    if (!bio) return;
    updateBio({ socials: bio.socials.filter((s) => s.id !== id) });
  };

  if (isLoading || !bio) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#D05634]" />
        <p className="text-sm font-medium">Preparando seu editor de Link na Bio...</p>
      </div>
    );
  }

  const publicUrl = getPublicBioUrl(bio.slug);
  const viewsCount = Number(bio.viewsCount || 0);
  const totalClicks = Number(bio.totalClicks || 0);
  const ctr = viewsCount > 0 ? Math.min(100, Math.round((totalClicks / viewsCount) * 100)) : 0;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#F7F7F8] dark:bg-zinc-950 flex flex-col">
      {/* Top Studio Bar */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200/80 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1520px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Link na Bio
                </h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    bio.published
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                  }`}
                >
                  {bio.published ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Personalize sua página de links para Instagram, WhatsApp e redes sociais.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Inline Slug Input */}
            <div className="flex items-center bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-400 dark:text-zinc-500 select-none font-mono">/bio/</span>
              <input
                type="text"
                value={bio.slug}
                onChange={(e) => updateBio({ slug: sanitizeSlug(e.target.value) })}
                placeholder="seu-estudio"
                className="bg-transparent text-gray-900 dark:text-white font-semibold font-mono outline-none w-32 sm:w-40"
              />
            </div>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Link Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abrir Página</span>
            </a>

            <button
              type="button"
              onClick={() => updateBio({ published: !bio.published })}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                bio.published
                  ? 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-50'
                  : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
              title={bio.published ? 'Ocultar página pública' : 'Publicar página'}
            >
              {bio.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{bio.published ? 'Online' : 'Offline'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{hasUnsavedChanges ? 'Salvar Alterações' : 'Salvo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveFeedback && (
          <div className="max-w-[1520px] mx-auto mt-3">
            <div
              className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                saveFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {saveFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{saveFeedback.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveFeedback(null)}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Editor Controls */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xs overflow-hidden flex flex-col">
          {/* Editor Sub-tabs */}
          <div className="grid grid-cols-4 border-b border-gray-100 dark:border-zinc-800 p-1.5 bg-gray-50/70 dark:bg-zinc-950/50 gap-1">
            {[
              { id: 'links', label: 'Links', icon: Link2 },
              { id: 'perfil', label: 'Perfil', icon: UserIcon },
              { id: 'aparencia', label: 'Aparência', icon: Palette },
              { id: 'compartilhar', label: 'Divulgar', icon: Share2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeEditorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-[#D05634] shadow-xs border border-gray-200/70 dark:border-zinc-700'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[calc(100vh-225px)] overflow-y-auto">
            {/* TAB 1: LINKS */}
            {activeEditorTab === 'links' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                      Seus Botões & Links ({bio.links.length})
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Organize a ordem, ícones e destinos do seu Link na Bio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Link
                  </button>
                </div>

                {bio.links.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-8 text-center">
                    <Link2 className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                      Nenhum link adicionado
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      Crie botões para WhatsApp, portfólio, orçamento e galeria de clientes.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 rounded-xl bg-[#FFF0EB] text-[#D05634] text-xs font-bold hover:bg-[#ffe3d9] transition-colors cursor-pointer"
                    >
                      + Criar Primeiro Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bio.links.map((item, idx) => {
                      const isExpanded = expandedLinkId === item.id;
                      const num = String(idx + 1).padStart(2, '0');
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border transition-all ${
                            item.active
                              ? 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                              : 'border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-950/40 opacity-70'
                          }`}
                        >
                          {/* Row Header */}
                          <div className="flex items-center justify-between gap-2 p-3.5">
                            <button
                              type="button"
                              onClick={() => setExpandedLinkId(isExpanded ? null : item.id)}
                              className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                            >
                              <span className="text-[11px] font-mono font-bold text-gray-400 tabular-nums w-5 shrink-0">
                                {num}
                              </span>
                              <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                                {renderBioLinkIcon(item.icon, 'w-4 h-4')}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-900 dark:text-white truncate uppercase tracking-wide">
                                  {item.label || 'Sem título'}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate">
                                  {item.type === 'whatsapp'
                                    ? item.whatsappPhone
                                      ? `WhatsApp • ${item.whatsappPhone}`
                                      : item.url
                                    : item.url || 'Defina o endereço...'}
                                </p>
                              </div>
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              {typeof item.clicks === 'number' && item.clicks > 0 && (
                                <span
                                  className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md tabular-nums mr-1"
                                  title="Cliques registrados"
                                >
                                  {item.clicks}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleMoveLink(idx, -1)}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Mover para cima"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveLink(idx, 1)}
                                disabled={idx === bio.links.length - 1}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Mover para baixo"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLink(item.id, { active: !item.active })}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  item.active
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={item.active ? 'Ocultar link' : 'Ativar link'}
                              >
                                {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLink(item.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Remover link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Fields */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-3.5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                                    Título do Botão
                                  </label>
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleUpdateLink(item.id, { label: e.target.value })}
                                    placeholder="Ex: RESERVE SUA DATA"
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                                    Subtítulo (opcional)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => handleUpdateLink(item.id, { subtitle: e.target.value })}
                                    placeholder="Ex: Agenda aberta 2026"
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                                    Tipo de Destino
                                  </label>
                                  <select
                                    value={item.type}
                                    onChange={(e) => {
                                      const nextType = e.target.value as BioLinkType;
                                      const iconAuto: Partial<BioLinkItem> =
                                        nextType === 'whatsapp'
                                          ? { icon: 'whatsapp' }
                                          : nextType === 'portfolio'
                                            ? { icon: 'camera' }
                                            : nextType === 'blog'
                                              ? { icon: 'newspaper' }
                                              : nextType === 'portal'
                                                ? { icon: 'users' }
                                                : nextType === 'orcamento'
                                                  ? { icon: 'briefcase' }
                                                  : nextType === 'email'
                                                    ? { icon: 'mail' }
                                                    : {};
                                      handleUpdateLink(item.id, { type: nextType, ...iconAuto });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                                  >
                                    {LINK_TYPE_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                                    Ícone
                                  </label>
                                  <select
                                    value={item.icon}
                                    onChange={(e) =>
                                      handleUpdateLink(item.id, { icon: e.target.value as BioLinkIcon })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                                  >
                                    {LINK_ICON_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {item.type === 'whatsapp' ? (
                                <div className="space-y-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                                  <div>
                                    <label className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                                      Número do WhatsApp (com DDI + DDD)
                                    </label>
                                    <input
                                      type="text"
                                      value={item.whatsappPhone || ''}
                                      onChange={(e) =>
                                        handleUpdateLink(item.id, { whatsappPhone: e.target.value })
                                      }
                                      placeholder="5511999999999"
                                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                                      Mensagem automática (opcional)
                                    </label>
                                    <input
                                      type="text"
                                      value={item.whatsappMessage || ''}
                                      onChange={(e) =>
                                        handleUpdateLink(item.id, { whatsappMessage: e.target.value })
                                      }
                                      placeholder="Olá! Vim pelo Instagram e gostaria de um orçamento."
                                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                                    {item.type === 'email'
                                      ? 'Endereço de E-mail'
                                      : item.type === 'phone'
                                        ? 'Número de Telefone'
                                        : 'URL de Destino'}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.url}
                                    onChange={(e) => handleUpdateLink(item.id, { url: e.target.value })}
                                    placeholder={
                                      item.type === 'email'
                                        ? 'contato@seuestudio.com.br'
                                        : item.type === 'phone'
                                          ? '+55 11 99999-9999'
                                          : 'https://seusite.com.br'
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PERFIL & REDES */}
            {activeEditorTab === 'perfil' && (
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Foto de Perfil / Logotipo
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                      {bio.avatarUrl ? (
                        <img
                          src={bio.avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: bio.avatarPosition || '50% 15%' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadImage(e.target.files?.[0], 'avatar')}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={uploadingField === 'avatar'}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF0EB] text-[#D05634] hover:bg-[#ffe3d9] text-xs font-bold transition-colors cursor-pointer"
                        >
                          {uploadingField === 'avatar' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          Enviar Foto
                        </button>
                        {bio.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => updateBio({ avatarUrl: '' })}
                            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-500 hover:text-red-600 cursor-pointer"
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={bio.avatarSize}
                          onChange={(e) => updateBio({ avatarSize: e.target.value as any })}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px] font-medium text-gray-700 dark:text-zinc-200 outline-none"
                        >
                          <option value="sm">Tamanho: Compacto</option>
                          <option value="md">Tamanho: Médio</option>
                          <option value="lg">Tamanho: Editorial (Grande)</option>
                        </select>
                        <select
                          value={bio.avatarPosition || '50% 15%'}
                          onChange={(e) => updateBio({ avatarPosition: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px] font-medium text-gray-700 dark:text-zinc-200 outline-none"
                        >
                          <option value="50% 15%">Enquadramento: Rosto (Topo)</option>
                          <option value="50% 50%">Enquadramento: Centro</option>
                          <option value="50% 85%">Enquadramento: Inferior</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Texts */}
                <div className="space-y-3.5 pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                      Especialidade / Subtítulo Superior (Eyebrow)
                    </label>
                    <input
                      type="text"
                      value={bio.eyebrow || ''}
                      onChange={(e) => updateBio({ eyebrow: e.target.value })}
                      placeholder="Ex: WEDDING • DIREÇÃO EDITORIAL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                      Nome da Empresa / Fotógrafo
                    </label>
                    <input
                      type="text"
                      value={bio.displayName}
                      onChange={(e) => updateBio({ displayName: e.target.value })}
                      placeholder="Ex: ATELIER LUMINA FOTOGRAFIA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                      Descrição / Bio Curta
                    </label>
                    <textarea
                      rows={3}
                      value={bio.bioText}
                      onChange={(e) => updateBio({ bioText: e.target.value })}
                      placeholder="Conte em poucas palavras o que sua marca oferece..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634] resize-none"
                    />
                  </div>
                </div>

                {/* Cover Banner Optional */}
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Capa Superior (Opcional)
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Adiciona uma faixa fotográfica suave no topo da página.
                      </p>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadImage(e.target.files?.[0], 'cover')}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingField === 'cover'}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 cursor-pointer"
                      >
                        {uploadingField === 'cover' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5" />
                        )}
                        {bio.coverBannerUrl ? 'Trocar' : 'Enviar'}
                      </button>
                      {bio.coverBannerUrl && (
                        <button
                          type="button"
                          onClick={() => updateBio({ coverBannerUrl: '' })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Ícones de Redes Sociais
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Exibidos abaixo da lista principal de botões.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-800 dark:text-zinc-200 text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Rede
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {bio.socials.map((soc) => {
                      const meta = SOCIAL_PLATFORM_OPTIONS.find((p) => p.value === soc.platform);
                      return (
                        <div
                          key={soc.id}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30"
                        >
                          <span className="text-gray-500 shrink-0 pl-1">
                            {renderBioSocialIcon(soc.platform, 'w-4 h-4')}
                          </span>
                          <select
                            value={soc.platform}
                            onChange={(e) =>
                              handleUpdateSocial(soc.id, {
                                platform: e.target.value as BioSocialPlatform
                              })
                            }
                            className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-gray-700 dark:text-zinc-200 outline-none shrink-0"
                          >
                            {SOCIAL_PLATFORM_OPTIONS.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={soc.url}
                            onChange={(e) => handleUpdateSocial(soc.id, { url: e.target.value })}
                            placeholder={meta?.placeholder || 'https://...'}
                            className="flex-1 min-w-0 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteSocial(soc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer credit */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      Selo de Rodapé Discreto
                    </span>
                    <button
                      type="button"
                      onClick={() => updateBio({ showFooterCredit: !bio.showFooterCredit })}
                      className={`w-10 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                        bio.showFooterCredit ? 'bg-[#D05634]' : 'bg-gray-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          bio.showFooterCredit ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  {bio.showFooterCredit && (
                    <input
                      type="text"
                      value={bio.footerCreditText || ''}
                      onChange={(e) => updateBio({ footerCreditText: e.target.value })}
                      placeholder="Criado com Frame+"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none focus:border-[#D05634]"
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: APARÊNCIA & TEMA */}
            {activeEditorTab === 'aparencia' && (
              <div className="space-y-6">
                {/* Theme Presets */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D05634]" />
                    Temas Prontos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BIO_THEME_PRESETS.map((preset) => {
                      const selected = bio.themePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleApplyPreset(preset.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'border-[#D05634] bg-[#FFF0EB]/50 dark:bg-[#D05634]/10 ring-1 ring-[#D05634]/30'
                              : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <span
                                className="w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: preset.bgColor }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: preset.textColor }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                            </div>
                            {selected && (
                              <span className="text-[10px] font-bold text-[#D05634] uppercase">
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {preset.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {preset.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Layout & Button Style */}
                <div className="space-y-3.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1.5">
                      Estilo dos Botões
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: 'line', label: 'Linha Minimalista' },
                          { id: 'minimal_outline', label: 'Contorno Fino' },
                          { id: 'soft_surface', label: 'Superfície Suave' },
                          { id: 'solid', label: 'Botão Sólido' }
                        ] as { id: BioButtonStyle; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateBio({ buttonStyle: opt.id })}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            bio.buttonStyle === opt.id
                              ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]'
                              : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1.5">
                        Alinhamento do Topo
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateBio({ alignment: 'left' })}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                            bio.alignment === 'left'
                              ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]'
                              : 'border-gray-200 dark:border-zinc-700 text-gray-600'
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" /> Esquerda
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBio({ alignment: 'center' })}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                            bio.alignment === 'center'
                              ? 'border-[#D05634] bg-[#FFF0EB] text-[#D05634]'
                              : 'border-gray-200 dark:border-zinc-700 text-gray-600'
                          }`}
                        >
                          <AlignCenter className="w-3.5 h-3.5" /> Centro
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1.5">
                        Efeito na Foto
                      </label>
                      <select
                        value={bio.imageEffect}
                        onChange={(e) =>
                          updateBio({ imageEffect: e.target.value as BioImageEffect })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none"
                      >
                        <option value="soft_zoom">Zoom Suave</option>
                        <option value="bw_to_color">P&amp;B → Colorido</option>
                        <option value="elevate">Elevação Editorial</option>
                        <option value="none">Sem Efeito</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 block">
                        Numeração Editorial (01, 02, 03...)
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Exibe o índice alinhado à direita de cada botão.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateBio({ showNumbers: !bio.showNumbers })}
                      className={`w-10 h-5 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                        bio.showNumbers ? 'bg-[#D05634]' : 'bg-gray-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          bio.showNumbers ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                      Fonte de Título
                    </label>
                    <select
                      value={bio.titleFont}
                      onChange={(e) => updateBio({ titleFont: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none"
                    >
                      {BIO_FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-1">
                      Fonte de Texto
                    </label>
                    <select
                      value={bio.bodyFont}
                      onChange={(e) => updateBio({ bodyFont: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white outline-none"
                    >
                      {BIO_FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Color Palette */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-300 mb-2.5">
                    Paleta de Cores Personalizada
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        { key: 'bgColor', label: 'Fundo' },
                        { key: 'surfaceColor', label: 'Superfície' },
                        { key: 'textColor', label: 'Texto Principal' },
                        { key: 'mutedColor', label: 'Texto Suave' },
                        { key: 'accentColor', label: 'Ícones / Destaque' }
                      ] as const
                    ).map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 cursor-pointer"
                      >
                        <input
                          type="color"
                          value={(bio[item.key] as string) || '#FFFFFF'}
                          onChange={(e) => updateBio({ [item.key]: e.target.value })}
                          className="w-6 h-6 rounded-md border-0 cursor-pointer bg-transparent p-0"
                        />
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold text-gray-700 dark:text-zinc-200 truncate">
                            {item.label}
                          </span>
                          <span className="block text-[10px] font-mono text-gray-400 uppercase">
                            {bio[item.key]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional Full Background Photo */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 block">
                        Imagem de Fundo (Opcional)
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Com véu de opacidade para preservar a leitura.
                      </span>
                    </div>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadImage(e.target.files?.[0], 'bg')}
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => bgInputRef.current?.click()}
                        disabled={uploadingField === 'bg'}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 cursor-pointer"
                      >
                        {uploadingField === 'bg' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        {bio.bgImageUrl ? 'Trocar' : 'Enviar'}
                      </button>
                      {bio.bgImageUrl && (
                        <button
                          type="button"
                          onClick={() => updateBio({ bgImageUrl: '' })}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {bio.bgImageUrl && (
                    <div>
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                        <span>Opacidade da camada de leitura</span>
                        <span className="font-mono font-bold">
                          {Math.round((bio.bgImageOverlayOpacity ?? 0.88) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.4}
                        max={0.96}
                        step={0.02}
                        value={bio.bgImageOverlayOpacity ?? 0.88}
                        onChange={(e) =>
                          updateBio({ bgImageOverlayOpacity: Number(e.target.value) })
                        }
                        className="w-full accent-[#D05634]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: COMPARTILHAR & MÉTRICAS */}
            {activeEditorTab === 'compartilhar' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#FFF0EB]/60 dark:bg-[#D05634]/10 border border-[#D05634]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D05634] uppercase tracking-wider">
                      Seu Link para Bio do Instagram
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-[#D05634]/25 rounded-xl p-2">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="flex-1 bg-transparent text-xs font-mono text-gray-800 dark:text-zinc-200 px-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-3.5 py-2 rounded-lg bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUrl ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed">
                    Cole este endereço no campo <strong>Site / Links</strong> do seu perfil no Instagram, TikTok, YouTube e na mensagem automática do WhatsApp Business.
                  </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-950/40">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                      <Eye className="w-3.5 h-3.5" /> Visitas
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {viewsCount}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-950/40">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                      <MousePointerClick className="w-3.5 h-3.5" /> Cliques
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {totalClicks}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-950/40">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                      <BarChart3 className="w-3.5 h-3.5" /> Taxa
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {ctr}%
                    </div>
                  </div>
                </div>

                {/* Per-link breakdown */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                    Desempenho por Botão
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                    {bio.links.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-zinc-900 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[11px] font-mono text-gray-400 tabular-nums">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-zinc-200 truncate">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-gray-600 dark:text-zinc-400 tabular-nums shrink-0">
                          {Number(item.clicks || 0)} cliques
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Mobile / Desktop Preview */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wider">
                Pré-visualização em Tempo Real
              </span>
            </div>

            <div className="inline-flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-[#FFF0EB] text-[#D05634]'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Celular
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-[#FFF0EB] text-[#D05634]'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
            </div>
          </div>

          {previewDevice === 'mobile' ? (
            <div className="w-full max-w-[404px] bg-zinc-900 rounded-[44px] p-3 shadow-2xl border border-zinc-800">
              <div className="w-28 h-5 bg-zinc-900 rounded-b-2xl mx-auto -mb-2 relative z-20" />
              <div className="w-full h-[700px] rounded-[34px] overflow-y-auto overflow-x-hidden bg-white shadow-inner">
                <BioPageCanvas data={bio} isPreview />
              </div>
            </div>
          ) : (
            <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-100/90 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg px-3 py-1 text-[11px] font-mono text-gray-500 truncate">
                  {publicUrl}
                </div>
              </div>
              <div className="h-[680px] overflow-y-auto">
                <BioPageCanvas data={bio} isPreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
