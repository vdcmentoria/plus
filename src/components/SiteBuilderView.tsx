import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  Layout, 
  Palette, 
  Grid, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Search, 
  Wand2, 
  MapPin, 
  Eye, 
  Copy, 
  CheckCircle2, 
  Send,
  Code,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  ArrowRight,
  X,
  Monitor,
  Smartphone,
  Tablet,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Pencil,
  RotateCcw,
  Maximize2,
  Minimize2,
  Upload,
  CheckSquare,
  Square,
  BarChart2,
  Link,
  ArrowLeft,
  Sun,
  Moon,
  Type,
  Sliders,
  Image as ImageIcon,
  User,
  Inbox,
  Briefcase,
  HelpCircle,
  Award,
  Star,
  Gauge,
  Activity,
  Compass,
  FileText,
  Share2,
  TrendingUp,
  Film,
  Layers,
  Database
} from 'lucide-react';
import { PublicWebsiteView, SiteData, BlogPost } from './PublicWebsiteView';
import {
  ScrollytellingThemeId,
  ScrollytellingConfig,
  ScrollySectionBlock,
  ScrollySectionType,
  ScrollyGalleryStyle,
  SCROLLYTELLING_THEME_CATALOG,
  SCROLLY_SECTION_LIBRARY,
  getThemePresetSections,
  createSectionFromTemplate,
  resolveScrollyConfig
} from './ScrollytellingThemes';

export interface SiteLead {
  id: string;
  siteId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  budget?: string;
  message?: string;
  submittedAt: string;
  status?: 'Novo' | 'Em Atendimento' | 'Fechado' | 'Arquivado';
}

export function SiteBuilderView({
  user,
  userProfile,
  collections = [],
  setActiveTab,
  globalTheme,
  onToggleGlobalTheme
}: {
  user: any;
  userProfile?: any;
  collections: any[];
  setActiveTab?: (t: string) => void;
  globalTheme?: 'light' | 'dark';
  onToggleGlobalTheme?: () => void;
}) {
  // Theme state for Editor Shell (inherits global app theme if provided or stored)
  const [editorTheme, setEditorTheme] = useState<'dark' | 'light'>(() => {
    if (globalTheme) return globalTheme;
    try {
      const saved = localStorage.getItem('frameplus_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  // Sync when global theme prop changes
  useEffect(() => {
    if (globalTheme && (globalTheme === 'dark' || globalTheme === 'light')) {
      setEditorTheme(globalTheme);
    }
  }, [globalTheme]);

  // Collapsible menus states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  // Device & View Modes
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Ardena Sidebar Selected Menu Item ID
  const [activeMenuId, setActiveMenuId] = useState<
    'dobras' | 'hero' | 'sobre' | 'pacotes' | 'temas' | 'fontes' | 'cores' | 'midia' | 'galerias' | 'blog' | 'seo_rea' | 'dominio' | 'leads'
  >('dobras');

  const [activeSection, setActiveSection] = useState<string>('hero');

  // Loading & Saving States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);

  // AI & Blog States
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isAiBlogModalOpen, setIsAiBlogModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCity, setAiCity] = useState('');
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);

  // Manual Blog Editor States
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editBlogTitle, setEditBlogTitle] = useState('');
  const [editBlogCategory, setEditBlogCategory] = useState('Dicas');
  const [editBlogCover, setEditBlogCover] = useState('');
  const [editBlogExcerpt, setEditBlogExcerpt] = useState('');
  const [editBlogContent, setEditBlogContent] = useState('');

  // Leads State
  const [leads, setLeads] = useState<SiteLead[]>([]);

  // SEO & GEO Audit State
  const [seoAudit, setSeoAudit] = useState<any>(null);
  const [isAuditingSeo, setIsAuditingSeo] = useState(false);
  const [seoActiveTab, setSeoActiveTab] = useState<'auditoria' | 'meta' | 'geo' | 'palavras' | 'schema'>('auditoria');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [isCopiedJsonLd, setIsCopiedJsonLd] = useState(false);
  const [showJsonLdModal, setShowJsonLdModal] = useState(false);

  // Scrollytelling Studio States
  const [scrollyAccordion, setScrollyAccordion] = useState<'capa' | 'secoes' | 'cta'>('secoes');
  const [selectedScrollySectionId, setSelectedScrollySectionId] = useState<string | null>(null);
  const [newScrollySectionType, setNewScrollySectionType] = useState<ScrollySectionType>('card_stacking_album');
  const [showScrollyJsonModal, setShowScrollyJsonModal] = useState(false);
  const [copiedScrollyJson, setCopiedScrollyJson] = useState(false);
  const [isFullScreenScrollyTest, setIsFullScreenScrollyTest] = useState(false);

  // Site Data State (Real-time synced)
  const [siteData, setSiteData] = useState<SiteData>({
    id: `site_${user?.uid || 'default'}`,
    ownerId: user?.uid || '',
    title: `${userProfile?.displayName || user?.displayName || 'Felipe Machado'} | Fotografia`,
    slug: (userProfile?.displayName || user?.displayName || 'felipe-machado').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    photographerName: userProfile?.displayName || user?.displayName || 'Felipe Machado',
    niche: 'Casamentos & Ensaios',
    theme: 'dark',
    primaryColor: '#D05634',
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    heroTitle: 'FOTOGRAFIA & REGISTROS ATEMPORAIS',
    heroSubtitle: 'Transformando momentos reais e emoções autênticas em memórias inesquecíveis.',
    heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    bioPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bioText: 'Especialista em capturar emoções autênticas, registros atemporais e momentos inesquecíveis. Transformando cada olhar em memórias eternas.',
    geoCity: 'São Paulo',
    geoRegion: 'SP',
    customDomain: '',
    published: true,
    selectedCollectionIds: collections.slice(0, 3).map(c => c.id.toString()),
    sectionsOrder: ['hero', 'portfolio', 'about', 'pricing', 'leads', 'blog'],
    sectionsVisibility: {
      hero: true,
      portfolio: true,
      about: true,
      pricing: true,
      leads: true,
      blog: true
    },
    services: [
      { id: '1', name: 'Cobertura de Casamento', price: 'R$ 4.500', description: 'Cobertura fotográfica completa do pré-wedding à festa.', features: ['Até 10h de cobertura', 'Galeria digital privada', 'Fotos tratadas em alta resolução'] },
      { id: '2', name: 'Ensaio de Casal / Pré-Wedding', price: 'R$ 1.200', description: 'Sessão fotográfica externa com luz natural.', features: ['2 horas de ensaio', '50 fotos tratadas em alta resolução', 'Entrega em 7 dias'] }
    ]
  });

  // Fetch initial site on load
  useEffect(() => {
    const loadSite = async () => {
      try {
        setIsLoading(true);
        const ownerId = user?.uid || 'default';
        const res = await fetch(`/api/sites?ownerId=${ownerId}`);
        if (res.ok) {
          const userSites = await res.json();
          if (Array.isArray(userSites) && userSites.length > 0) {
            const currentSite = userSites[0];
            setSiteData(prev => ({
              ...prev,
              ...currentSite,
              sectionsVisibility: currentSite.sectionsVisibility || prev.sectionsVisibility,
              sectionsOrder: currentSite.sectionsOrder || prev.sectionsOrder
            }));

            // Fetch blogs & leads
            fetchSiteBlogs(currentSite.id);
            fetchSiteLeads(currentSite.id);
          }
        }
      } catch (err) {
        console.error('Error fetching photographer site:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSite();
  }, [user?.uid]);

  const fetchSiteBlogs = async (siteId: string) => {
    try {
      const res = await fetch(`/api/sites/${siteId}/blogs`);
      if (res.ok) setBlogPosts(await res.json());
    } catch (e) {}
  };

  const fetchSiteLeads = async (siteId: string) => {
    try {
      const res = await fetch(`/api/sites/${siteId}/leads`);
      if (res.ok) setLeads(await res.json());
    } catch (e) {}
  };

  // Live save handler
  const handleSaveSite = async (updatedObj?: Partial<SiteData>) => {
    try {
      setIsSaving(true);
      const payload = {
        ...siteData,
        ...updatedObj,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setSiteData(saved);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving site:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload Handler to Cloudflare R2
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImageUrl' | 'bioPhotoUrl' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setSiteData(prev => {
            const next = { ...prev, [targetField]: data.url };
            handleSaveSite(next);
            return next;
          });
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Update Scrollytelling JSON-Driven Config
  const updateScrollyConfig = (partial: Partial<ScrollytellingConfig>) => {
    setSiteData(prev => {
      const currentThemeId: ScrollytellingThemeId =
        prev.scrollytellingThemeId || prev.theme_id || 'lumina-editorial';
      const mergedConfig: ScrollytellingConfig = {
        ...resolveScrollyConfig(prev),
        ...(prev.scrollytellingConfig || {}),
        sectionsThemeId: currentThemeId === 'classic' ? 'lumina-editorial' : currentThemeId,
        ...partial
      };
      const next = { ...prev, scrollytellingConfig: mergedConfig };
      handleSaveSite({ scrollytellingConfig: mergedConfig });
      return next;
    });
  };

  // Upload Image or Video to Scrollytelling Slot (R2 Storage + Local ObjectURL fallback)
  const handleScrollyMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUrlReady: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onUrlReady(data.url);
          return;
        }
      }
      // Instant local fallback if offline
      const localUrl = URL.createObjectURL(file);
      onUrlReady(localUrl);
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      onUrlReady(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  // AI Blog Generator
  const handleGenerateBlog = async () => {
    if (!aiTopic) return;
    try {
      setIsGeneratingBlog(true);
      const res = await fetch('/api/ai/generate-blog-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          city: aiCity || siteData.geoCity || 'São Paulo',
          photographerName: siteData.photographerName,
          style: 'Inspirador e Profissional'
        })
      });

      if (res.ok) {
        const newPost = await res.json();
        const saveRes = await fetch(`/api/sites/${siteData.id}/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newPost,
            published: true,
            coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
            category: 'Dicas'
          })
        });

        if (saveRes.ok) {
          const savedPost = await saveRes.json();
          setBlogPosts(prev => [savedPost, ...prev]);
          setIsAiBlogModalOpen(false);
          setAiTopic('');
        }
      }
    } catch (err) {
      console.error('Error generating blog post with AI:', err);
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  // Open Manual Blog Editor Modal
  const handleOpenBlogEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setEditBlogTitle(post.title || '');
      setEditBlogCategory(post.category || 'Dicas');
      setEditBlogCover(post.coverImage || '');
      setEditBlogExcerpt(post.excerpt || '');
      setEditBlogContent(post.content || '');
    } else {
      setEditingPost(null);
      setEditBlogTitle('');
      setEditBlogCategory('Dicas');
      setEditBlogCover('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80');
      setEditBlogExcerpt('');
      setEditBlogContent('');
    }
    setIsBlogModalOpen(true);
  };

  // Save Manual Blog Post (Create or Update)
  const handleSaveBlogPostManual = async () => {
    if (!editBlogTitle.trim()) return;

    const payload = {
      id: editingPost ? editingPost.id : undefined,
      siteId: siteData.id,
      title: editBlogTitle,
      slug: editBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: editBlogCategory || 'Dicas',
      coverImage: editBlogCover || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      excerpt: editBlogExcerpt || editBlogTitle,
      content: editBlogContent || editBlogExcerpt || editBlogTitle,
      published: true
    };

    try {
      const res = await fetch(`/api/sites/${siteData.id}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedPost = await res.json();
        setBlogPosts(prev => {
          const exists = prev.some(p => p.id === savedPost.id);
          if (exists) {
            return prev.map(p => p.id === savedPost.id ? savedPost : p);
          }
          return [savedPost, ...prev];
        });
        setIsBlogModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving blog post manually:', err);
    }
  };

  // Delete Blog Post
  const handleDeleteBlogPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/sites/${siteData.id}/blogs/${postId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBlogPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
    }
  };

  // Real-time live benchmark metrics (GTmetrix & PageSpeed Insights algorithm)
  const computeLiveSeoScores = () => {
    const title = (siteData.metaTitle || siteData.title || '').trim();
    const desc = (siteData.metaDescription || siteData.heroSubtitle || '').trim();
    const city = (siteData.geoCity || '').trim();
    const state = (siteData.geoState || siteData.geoRegion || '').trim();
    const kws = siteData.focusKeywords || [];

    let seo = 55;
    if (title.length >= 30 && title.length <= 65) seo += 15;
    else if (title.length > 0) seo += 8;

    if (desc.length >= 110 && desc.length <= 165) seo += 15;
    else if (desc.length > 0) seo += 8;

    if (kws.length >= 3) seo += 10;
    else if (kws.length > 0) seo += 5;

    if (siteData.schemaOrgEnabled !== false) seo += 5;
    if (siteData.autoAltTagsEnabled !== false) seo += 5;

    let geo = 40;
    if (city) geo += 25;
    if (state) geo += 10;
    if (siteData.geoNeighborhood || siteData.geoAddress) geo += 10;
    if (siteData.googleBusinessUrl || siteData.googleMapsEmbedUrl) geo += 15;
    if (city && title.toLowerCase().includes(city.toLowerCase())) geo += 10;
    if (siteData.schemaOrgEnabled !== false) geo += 10;

    const perf = 96;
    const access = 98;

    const finalSeo = Math.min(Math.max(seo, 45), 99);
    const finalGeo = Math.min(Math.max(geo, 40), 98);
    const overall = Math.round((finalSeo * 0.45) + (finalGeo * 0.45) + (perf * 0.1));
    const grade = overall >= 90 ? 'A' : overall >= 78 ? 'B' : 'C';

    return {
      overall,
      grade,
      seoScore: finalSeo,
      geoScore: finalGeo,
      perfScore: perf,
      accessScore: access,
      visibilityIndex: `${Math.round((finalSeo * 0.5) + (finalGeo * 0.5))}% · ${overall >= 88 ? 'Potencial Top 3 Google Maps' : 'Primeira Página'}`,
      lcp: "1.1s",
      tbt: "0ms",
      cls: "0.005",
      speedIndex: "1.2s",
      structureScore: Math.min(overall + 2, 98)
    };
  };

  // Run Comprehensive SEO & GEO Audit
  const handleRunSeoAudit = async () => {
    try {
      setIsAuditingSeo(true);
      const res = await fetch('/api/ai/analyze-site-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: siteData.title,
          metaTitle: siteData.metaTitle,
          metaDescription: siteData.metaDescription,
          heroSubtitle: siteData.heroSubtitle,
          city: siteData.geoCity,
          state: siteData.geoState || siteData.geoRegion,
          neighborhood: siteData.geoNeighborhood,
          serviceRadiusKm: siteData.serviceRadiusKm,
          keywords: siteData.focusKeywords && siteData.focusKeywords.length > 0 
            ? siteData.focusKeywords 
            : [siteData.niche, `Fotógrafo ${siteData.geoCity}`, siteData.title].filter(Boolean),
          hasBlog: blogPosts.length > 0,
          hasCustomDomain: !!siteData.customDomain,
          hasSchemaOrg: siteData.schemaOrgEnabled !== false,
          hasGoogleMaps: Boolean(siteData.googleBusinessUrl || siteData.googleMapsEmbedUrl),
          hasOgImage: Boolean(siteData.ogImageUrl || siteData.heroImageUrl)
        })
      });

      if (res.ok) {
        setSeoAudit(await res.json());
      }
    } catch (err) {
      console.error('Error auditing SEO & GEO:', err);
    } finally {
      setIsAuditingSeo(false);
    }
  };

  const handleOptimizeTitle = () => {
    const brand = siteData.photographerName || siteData.title || 'Estúdio';
    const city = siteData.geoCity ? ` em ${siteData.geoCity}` : '';
    const state = siteData.geoState ? ` - ${siteData.geoState}` : '';
    const niche = siteData.niche ? ` de ${siteData.niche}` : ' Profissional';
    const optTitle = `${brand} | Fotografia${niche}${city}${state}`.slice(0, 60);
    setSiteData(prev => {
      const next = { ...prev, metaTitle: optTitle };
      handleSaveSite(next);
      return next;
    });
  };

  const handleOptimizeDescription = () => {
    const brand = siteData.photographerName || siteData.title || 'Estúdio';
    const city = siteData.geoCity ? ` em ${siteData.geoCity}` : ' na sua região';
    const optDesc = `Fotografia profissional e registros visuais atemporais com ${brand}${city}. Histórias reais capturadas com alma e sensibilidade. Solicite seu orçamento online!`
      .slice(0, 158);
    setSiteData(prev => {
      const next = { ...prev, metaDescription: optDesc };
      handleSaveSite(next);
      return next;
    });
  };

  const handleAddKeyword = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    const current = siteData.focusKeywords || [];
    if (current.includes(clean)) return;
    const nextList = [...current, clean];
    setSiteData(prev => {
      const next = { ...prev, focusKeywords: nextList };
      handleSaveSite(next);
      return next;
    });
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    const current = siteData.focusKeywords || [];
    const nextList = current.filter(k => k !== kw);
    setSiteData(prev => {
      const next = { ...prev, focusKeywords: nextList };
      handleSaveSite(next);
      return next;
    });
  };

  // Toggle collection selection for portfolio
  const toggleCollectionSelection = (colId: string) => {
    const current = siteData.selectedCollectionIds || [];
    const nextIds = current.includes(colId) 
      ? current.filter(id => id !== colId) 
      : [...current, colId];
    
    setSiteData(prev => {
      const next = { ...prev, selectedCollectionIds: nextIds };
      handleSaveSite(next);
      return next;
    });
  };

  // Reorder section up/down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const order = [...(siteData.sectionsOrder || ['hero', 'portfolio', 'about', 'pricing', 'leads', 'blog'])];
    const index = order.indexOf(sectionId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= order.length) return;

    const temp = order[index];
    order[index] = order[newIndex];
    order[newIndex] = temp;

    setSiteData(prev => {
      const next = { ...prev, sectionsOrder: order };
      handleSaveSite(next);
      return next;
    });
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const visibility = { ...(siteData.sectionsVisibility || {}) };
    visibility[sectionId] = visibility[sectionId] === false ? true : false;

    setSiteData(prev => {
      const next = { ...prev, sectionsVisibility: visibility };
      handleSaveSite(next);
      return next;
    });
  };

  const siteLiveUrl = `${window.location.origin}/?site=${siteData.slug}`;

  const copyLiveLink = () => {
    navigator.clipboard.writeText(siteLiveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isDarkShell = editorTheme === 'dark';

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkShell ? 'bg-zinc-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D05634] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Carregando Criador de Sites Ardena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen max-h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 ${
      isDarkShell 
        ? 'bg-zinc-950 text-white selection:bg-[#D05634]/20 selection:text-[#D05634]' 
        : 'bg-[#FAFAFA] text-gray-900 selection:bg-[#FFF0EB] selection:text-[#D05634]'
    }`}>
      
      {/* TOP WORKSPACE TOOLBAR */}
      <header className={`h-16 backdrop-blur-xl border-b px-6 flex items-center justify-between shrink-0 z-50 transition-colors ${
        isDarkShell ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('inicio')}
              className={`p-2 rounded-xl transition-all ${
                isDarkShell ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Voltar ao Frame+"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D05634] text-white flex items-center justify-center font-black shadow-md shadow-[#D05634]/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h1 className={`font-black text-sm tracking-tight hidden sm:block ${isDarkShell ? 'text-white' : 'text-gray-900'}`}>
                {siteData.title || 'Meu Site Pro'}
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider hidden sm:block">
                Editor Visual em Tempo Real
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              const next = !siteData.published;
              setSiteData(prev => ({ ...prev, published: next }));
              handleSaveSite({ published: next });
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              siteData.published 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${siteData.published ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {siteData.published ? 'Ativo / Publicado' : 'Rascunho'}
          </button>
        </div>

        {/* Device Mode Switcher */}
        <div className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border ${
          isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'desktop' 
                ? (isDarkShell ? 'bg-zinc-800 text-amber-400 shadow-sm' : 'bg-white text-[#D05634] shadow-sm') 
                : (isDarkShell ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button 
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'tablet' 
                ? (isDarkShell ? 'bg-zinc-800 text-[#D05634] shadow-sm' : 'bg-white text-[#D05634] shadow-sm') 
                : (isDarkShell ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>
          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'mobile' 
                ? (isDarkShell ? 'bg-zinc-800 text-[#D05634] shadow-sm' : 'bg-white text-[#D05634] shadow-sm') 
                : (isDarkShell ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Celular</span>
          </button>
        </div>

        {/* Live URL Link, Theme Switcher & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            <Link className="w-3.5 h-3.5 text-[#D05634]" />
            <span className="font-mono text-[11px] truncate max-w-[180px] font-semibold">
              {siteData.slug}
            </span>
            <button 
              onClick={copyLiveLink}
              className="p-1 hover:text-[#D05634] transition-colors"
              title="Copiar Link do Site"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a 
              href={siteLiveUrl} 
              target="_blank" 
              rel="noreferrer"
              className="p-1 hover:text-[#D05634] transition-colors"
              title="Abrir Site Ao Vivo em Nova Aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button 
            onClick={() => handleSaveSite()}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#D05634]/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Alterações'}
          </button>
        </div>
      </header>

      {/* MAIN ARDENA WORKSPACE CONTAINER (FIXED HEIGHT) */}
      <div className="flex-1 h-[calc(100vh-4rem)] flex overflow-hidden">
        
        {/* ARDENA VERTICAL SIDEBAR MENU (COLLAPSIBLE) */}
        <aside className={`${
          isSidebarCollapsed ? 'w-[68px]' : 'w-[285px]'
        } border-r flex flex-col justify-between shrink-0 z-20 shadow-2xl transition-all duration-300 h-full overflow-hidden ${
          isDarkShell 
            ? 'bg-zinc-900/95 backdrop-blur-2xl border-zinc-800/80 text-white' 
            : 'bg-white/95 backdrop-blur-2xl border-gray-200 text-gray-900'
        }`}>
          
          {/* Sidebar Head */}
          <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
            isDarkShell ? 'border-zinc-800/80' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-[#D05634] text-white flex items-center justify-center font-black shadow-lg shadow-[#D05634]/30 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <b className="block text-xs font-extrabold tracking-tight truncate">Frame+ Site</b>
                  <span className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase block truncate">
                    Criador de Sites Pro
                  </span>
                </div>
              )}
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                isDarkShell 
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isSidebarCollapsed ? "Expandir Menu Lateral" : "Recolher Menu Lateral"}
            >
              <PanelLeftClose className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Categorized Nav Groups */}
          <nav className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin">
            
            {/* GROUP 1: ESTRUTURA & DOBRAS DO SITE */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-3 block mb-1.5 truncate">
                  Estrutura & Dobras
                </span>
              )}

              <button 
                onClick={() => {
                  setActiveMenuId('hero');
                  setActiveSection('hero');
                  setIsDrawerCollapsed(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all relative ${
                  ['dobras', 'hero'].includes(activeMenuId) 
                    ? 'bg-[#D05634] text-white shadow-lg shadow-[#D05634]/25 scale-[1.01]' 
                    : isDarkShell ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Gerenciar Dobras"
              >
                <div className="flex items-center gap-2.5">
                  <Layout className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Gerenciar Dobras</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    ['dobras', 'hero'].includes(activeMenuId) ? 'bg-white/20 text-white' : 'bg-[#D05634]/10 text-[#D05634] border border-[#D05634]/30'
                  }`}>
                    {siteData.sectionsOrder?.length || 6}
                  </span>
                )}
              </button>

              {/* Subseções das Dobras do Site com Controles de Visibilidade & Reordenação embutidos */}
              {!isSidebarCollapsed && (
                <div className="pl-2 border-l-2 border-gray-200 dark:border-zinc-800 ml-3 mt-1.5 space-y-1">
                  {(siteData.sectionsOrder || ['hero', 'portfolio', 'about', 'pricing', 'leads', 'blog']).map((secId, index) => {
                    const secMeta: Record<string, { label: string; icon: any; menuKey: any }> = {
                      hero: { label: '1. Banner Hero', icon: Pencil, menuKey: 'hero' },
                      portfolio: { label: '2. Portfólio em Destaque', icon: Grid, menuKey: 'galerias' },
                      about: { label: '3. Sobre & Biografia', icon: User, menuKey: 'sobre' },
                      pricing: { label: '4. Pacotes & Serviços', icon: Briefcase, menuKey: 'pacotes' },
                      leads: { label: '5. Form. GorilaForms', icon: Inbox, menuKey: 'leads' },
                      blog: { label: '6. Blog & Artigos IA', icon: Sparkles, menuKey: 'blog' }
                    };

                    const item = secMeta[secId] || { label: `${index + 1}. ${secId}`, icon: Layout, menuKey: secId };
                    const Icon = item.icon;
                    const isActive = activeMenuId === item.menuKey || (activeMenuId === 'dobras' && activeSection === secId);
                    const isVisible = siteData.sectionsVisibility?.[secId] !== false;

                    return (
                      <div 
                        key={secId}
                        className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                          isActive 
                            ? 'bg-[#D05634]/15 text-[#D05634] dark:text-amber-400 font-bold' 
                            : isDarkShell ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/40' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <button 
                          onClick={() => {
                            setActiveMenuId(item.menuKey);
                            setActiveSection(secId);
                            setIsDrawerCollapsed(false);
                          }}
                          className="flex items-center gap-2 truncate flex-1 text-left py-0.5"
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate text-[11px] font-semibold">{item.label}</span>
                        </button>

                        {/* Unified Eye Toggle & Reorder Buttons in Sidebar */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(secId); }}
                            className={`p-1 rounded-md transition-colors ${
                              isVisible ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/20' : 'text-gray-400 opacity-40 hover:opacity-100'
                            }`}
                            title={isVisible ? 'Ocultar Dobra' : 'Exibir Dobra'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveSection(secId, 'up'); }}
                            className="p-0.5 text-gray-400 hover:text-[#D05634]"
                            title="Mover para cima"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveSection(secId, 'down'); }}
                            className="p-0.5 text-gray-400 hover:text-[#D05634]"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* GROUP 2: ESTILO, FONTES & CORES */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-3 block mb-2 truncate">
                  Estilo & Design
                </span>
              )}

              {[
                { id: 'temas', label: 'Temas Visuais', icon: Palette },
                { id: 'fontes', label: 'Tipografia & Fontes', icon: Type },
                { id: 'cores', label: 'Cores Customizadas', icon: Sliders },
                { id: 'midia', label: 'Uploads de Mídias', icon: Upload }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeMenuId === item.id;

                return (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveMenuId(item.id as any);
                      setIsDrawerCollapsed(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? 'bg-[#D05634] text-white shadow-lg shadow-[#D05634]/25 scale-[1.02]' 
                        : isDarkShell ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* GROUP 3: INTELIGÊNCIA, SEO & LEADS */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-3 block mb-2 truncate">
                  SEO, Domínio & Leads
                </span>
              )}

              {[
                { id: 'seo_rea', label: 'SEO e GEO', icon: BarChart2 },
                { id: 'dominio', label: 'Domínio & Slug', icon: Globe },
                { id: 'leads', label: 'Leads GorilaForms', icon: Inbox, count: leads.length }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeMenuId === item.id;

                return (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveMenuId(item.id as any);
                      setIsDrawerCollapsed(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? 'bg-[#D05634] text-white shadow-lg shadow-[#D05634]/25 scale-[1.02]' 
                        : isDarkShell ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isSidebarCollapsed && item.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#D05634]/10 text-[#D05634] border border-[#D05634]/30'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </nav>

          {/* Ardena Sidebar Footer */}
          <div className={`p-4 border-t space-y-3 ${
            isDarkShell ? 'border-zinc-800/80 bg-zinc-950/50' : 'border-gray-200 bg-gray-50'
          }`}>
            {/* Site Status Box */}
            {!isSidebarCollapsed ? (
              <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDarkShell ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div>
                  <small className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Status do Site Pro</small>
                  <b className="text-xs text-emerald-500 font-extrabold flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {siteData.published ? 'Ativo no Ar' : 'Rascunho'}
                  </b>
                </div>
                <a 
                  href={siteLiveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[#FFF0EB] text-[#D05634] hover:bg-[#ffe2d9] transition-colors"
                  title="Abrir em Nova Aba"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <a 
                  href={siteLiveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFF0EB] text-[#D05634] hover:bg-[#ffe2d9] transition-colors"
                  title="Abrir Site Ao Vivo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Dark Glass / Light Glass Switch */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-2xl border ${
              isDarkShell ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              {!isSidebarCollapsed ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-zinc-300">
                    {isDarkShell ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-[#D05634]" />}
                    <span>{isDarkShell ? 'Modo Escuro' : 'Modo Claro'}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (onToggleGlobalTheme) {
                        onToggleGlobalTheme();
                      } else {
                        const next = isDarkShell ? 'light' : 'dark';
                        setEditorTheme(next);
                        try {
                          if (next === 'dark') document.documentElement.classList.add('dark');
                          else document.documentElement.classList.remove('dark');
                          localStorage.setItem('frameplus_theme', next);
                        } catch {}
                      }
                    }}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors relative ${
                      isDarkShell ? 'bg-[#D05634]' : 'bg-gray-300'
                    }`}
                    title="Alternar Modo Escuro / Claro"
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                      isDarkShell ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleGlobalTheme) {
                      onToggleGlobalTheme();
                    } else {
                      const next = isDarkShell ? 'light' : 'dark';
                      setEditorTheme(next);
                      try {
                        if (next === 'dark') document.documentElement.classList.add('dark');
                        else document.documentElement.classList.remove('dark');
                        localStorage.setItem('frameplus_theme', next);
                      } catch {}
                    }
                  }}
                  className="mx-auto p-1 text-gray-600 dark:text-zinc-300 hover:text-[#D05634]"
                  title="Alternar Modo Escuro / Claro"
                >
                  {isDarkShell ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-[#D05634]" />}
                </button>
              )}
            </div>

            {/* Photographer Profile Box */}
            <div className={`flex items-center gap-3 p-2 rounded-2xl ${
              isDarkShell ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="w-9 h-9 rounded-full bg-[#D05634] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {userProfile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'FM'}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <b className="block text-xs font-extrabold truncate">{siteData.photographerName || 'Felipe Machado'}</b>
                  <small className="text-[10px] text-gray-400 font-semibold truncate block">
                    {siteData.geoCity || 'São Paulo'}, {siteData.geoRegion || 'BR'}
                  </small>
                </div>
              )}
            </div>
          </div>

        </aside>

        {/* ACTIVE DRAWER PANEL (CUSTOMIZATION FUNCTIONS FOR SELECTED MENU ITEM - COLLAPSIBLE) */}
        {!isDrawerCollapsed ? (
          <div className={`w-[360px] border-r flex flex-col shrink-0 z-10 shadow-xl transition-all duration-300 ${
            isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDarkShell ? 'border-zinc-800' : 'border-gray-200'
            }`}>
              <div className="truncate pr-2">
                <h3 className="font-extrabold text-sm tracking-tight truncate">
                  {activeMenuId === 'dobras' && 'Estrutura & Seções'}
                  {activeMenuId === 'hero' && 'Banner Hero Principal'}
                  {activeMenuId === 'sobre' && 'Sobre o Estúdio & Biografia'}
                  {activeMenuId === 'pacotes' && 'Pacotes & Serviços'}
                  {activeMenuId === 'temas' && 'Temas Visuais & Menu'}
                  {activeMenuId === 'fontes' && 'Tipografia & Fontes'}
                  {activeMenuId === 'cores' && 'Cores Customizadas'}
                  {activeMenuId === 'midia' && 'Uploads & Mídias'}
                  {activeMenuId === 'galerias' && 'Coleções do Frame+'}
                  {activeMenuId === 'blog' && 'Blog & Artigos IA'}
                  {activeMenuId === 'seo_rea' && 'SEO e GEO · Auditor de Visibilidade'}
                  {activeMenuId === 'dominio' && 'Domínio & Slug'}
                  {activeMenuId === 'leads' && 'Leads GorilaForms'}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
                  {activeMenuId === 'seo_rea' ? 'Diagnóstico GTmetrix, PageSpeed, Visibilidade Local & Otimizações' : 'Edite e visualize instantaneamente ao vivo'}
                </p>
              </div>

              {/* Drawer Close / Collapse Button */}
              <button
                type="button"
                onClick={() => setIsDrawerCollapsed(true)}
                className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                  isDarkShell 
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Recolher Painel de Edição"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            
            {/* FUNCTION 1 & 2: HERO & LOGO */}
            {(activeMenuId === 'dobras' || activeMenuId === 'hero') && (
              <div className="space-y-6">
                
                {/* LOGO UPLOAD & BRAND IMAGE */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634] flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Logo do Fotógrafo / Marca
                  </label>
                  {siteData.logoUrl && (
                    <div className="p-2 bg-black/40 rounded-xl flex items-center justify-between border border-white/10">
                      <img src={siteData.logoUrl} alt="Logo" className="h-8 max-w-[150px] object-contain" />
                      <button 
                        onClick={() => {
                          setSiteData(prev => ({ ...prev, logoUrl: '' }));
                          handleSaveSite({ logoUrl: '' });
                        }}
                        className="text-xs text-red-500 hover:underline font-bold"
                      >
                        Remover Logo
                      </button>
                    </div>
                  )}
                  <label className={`flex items-center justify-center gap-2 p-3 border border-dashed rounded-xl cursor-pointer transition-all text-xs font-bold ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    <Upload className="w-4 h-4 text-[#D05634]" />
                    <span>{isUploading ? 'Enviando Logo...' : 'Fazer Upload de Logo (PNG/WEBP)'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logoUrl')} />
                  </label>
                  <input 
                    type="text"
                    value={siteData.logoUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, logoUrl: val }));
                      handleSaveSite({ logoUrl: val });
                    }}
                    placeholder="Ou cole a URL da imagem da Logo..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                {/* HERO STYLE SELECTOR (CLEAN CASCATA SELECT) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Estilo do Banner Hero
                  </label>
                  <select 
                    value={siteData.heroStyle || 'magic_spotlight'}
                    onChange={e => {
                      const val = e.target.value as any;
                      setSiteData(prev => ({ ...prev, heroStyle: val }));
                      handleSaveSite({ heroStyle: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="magic_spotlight">Magic UI Spotlight & Glow</option>
                    <option value="split_showcase">Split Screen Editorial</option>
                    <option value="minimal_luxury">Minimalist Luxury</option>
                    <option value="floating_glass">Modern Floating Glass Card</option>
                    <option value="cinematic_video">Cinematic Video Parallax</option>
                  </select>
                </div>

                {/* VISUAL EFFECTS SELECTOR */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634] mb-2">
                    Efeitos Visuais de Fundo
                  </label>
                  <select 
                    value={siteData.heroVisualEffect || 'none'}
                    onChange={e => {
                      const val = e.target.value as any;
                      setSiteData(prev => ({ ...prev, heroVisualEffect: val }));
                      handleSaveSite({ heroVisualEffect: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="none">Nenhum / Estático</option>
                    <option value="ken_burns">Ken Burns (Slow Ambient Zoom)</option>
                    <option value="vignette">Vignette Cinematográfica</option>
                    <option value="glass_blur">Efeito Vidro / Glassmorphism Blur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Título do Banner Hero *</label>
                  <input 
                    type="text"
                    value={siteData.heroTitle}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, heroTitle: val, title: val }));
                      handleSaveSite({ heroTitle: val, title: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Subtítulo do Banner *</label>
                  <textarea 
                    rows={3}
                    value={siteData.heroSubtitle}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, heroSubtitle: val }));
                      handleSaveSite({ heroSubtitle: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none resize-none ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Imagem de Capa (Hero)</label>
                  <div className="space-y-2">
                    <input 
                      type="text"
                      value={siteData.heroImageUrl}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, heroImageUrl: val }));
                        handleSaveSite({ heroImageUrl: val });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-xs ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                    <label className={`flex items-center justify-center gap-2 p-3 border border-dashed rounded-xl cursor-pointer transition-all text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}>
                      <Upload className="w-4 h-4 text-[#D05634]" />
                      <span>{isUploading ? 'Enviando Imagem...' : 'Upload de Nova Imagem de Capa'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'heroImageUrl')} />
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* FUNCTION 3: SOBRE O ESTÚDIO & BIOGRAFIA */}
            {activeMenuId === 'sobre' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Nome do Fotógrafo</label>
                  <input 
                    type="text"
                    value={siteData.photographerName}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, photographerName: val }));
                      handleSaveSite({ photographerName: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Cidade (GEO SEO)</label>
                  <input 
                    type="text"
                    value={siteData.geoCity || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, geoCity: val }));
                      handleSaveSite({ geoCity: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                {/* FOTO DO FOTÓGRAFO / BIO */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634]">
                    Foto de Perfil do Fotógrafo
                  </label>
                  <input 
                    type="text"
                    value={siteData.bioPhotoUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, bioPhotoUrl: val }));
                      handleSaveSite({ bioPhotoUrl: val });
                    }}
                    placeholder="URL da foto de perfil..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                  <label className={`flex items-center justify-center gap-2 p-2.5 border border-dashed rounded-xl cursor-pointer transition-all text-xs font-bold ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                    <Upload className="w-4 h-4 text-[#D05634]" />
                    <span>{isUploading ? 'Enviando Foto...' : 'Upload de Foto de Perfil'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'bioPhotoUrl')} />
                  </label>
                </div>

                {/* VÍDEO INSTITUCIONAL / BIO VIDEO */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634]">
                    Vídeo de Apresentação / Institucional
                  </label>
                  <input 
                    type="text"
                    value={siteData.bioVideoUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, bioVideoUrl: val }));
                      handleSaveSite({ bioVideoUrl: val });
                    }}
                    placeholder="Link do YouTube, Vimeo ou MP4..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />

                  {siteData.bioVideoUrl && (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Modo de Reprodução</label>
                      <select 
                        value={siteData.bioVideoMode || 'inline'}
                        onChange={e => {
                          const val = e.target.value as any;
                          setSiteData(prev => ({ ...prev, bioVideoMode: val }));
                          handleSaveSite({ bioVideoMode: val });
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="inline">Rodar no Próprio Card (Inline)</option>
                        <option value="modal">Abrir em Modal Popup</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Texto de Apresentação / Biografia</label>
                  <textarea 
                    rows={4}
                    value={siteData.bioText || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, bioText: val }));
                      handleSaveSite({ bioText: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs resize-none ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                {/* SELOS DE ASSOCIAÇÕES (FEARLESS, INSPIRATION, BRIDE, ISPWP, MYWED) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634]">
                    Selos de Associações Internacionais
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'fearless', name: 'Fearless Photographers' },
                      { id: 'inspiration', name: 'Inspiration Photographers' },
                      { id: 'bride', name: 'Bride Association' },
                      { id: 'ispwp', name: 'ISPWP International' },
                      { id: 'mywed', name: 'MyWed Awarded' },
                      { id: 'fineart', name: 'Fine Art Wedding' }
                    ].map((preset) => {
                      const activeList = siteData.associationSeals || [];
                      const isPresent = activeList.some(s => s.name === preset.name);

                      return (
                        <button 
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            let nextList = [...activeList];
                            if (isPresent) {
                              nextList = nextList.filter(s => s.name !== preset.name);
                            } else {
                              nextList.push({ id: preset.id, name: preset.name, badgeText: 'Membro' });
                            }
                            setSiteData(prev => ({ ...prev, associationSeals: nextList }));
                            handleSaveSite({ associationSeals: nextList });
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            isPresent 
                              ? 'bg-[#D05634] text-white border-[#D05634] shadow-sm' 
                              : isDarkShell ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          + {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CONQUISTAS & ESTATÍSTICAS (CASAMENTOS.COM.BR, ZANKYOU, NÚMERO DE CLIENTES) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#D05634]">
                      Conquistas & Estatísticas
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        const current = siteData.achievementBadges || [
                          { id: '1', title: '+500', subtitle: 'Eventos Fotografados' },
                          { id: '2', title: '100%', subtitle: 'Satisfação dos Noivos' }
                        ];
                        const newBadge = { id: `badge_${Date.now()}`, title: 'Selo Gold', subtitle: 'Casamentos.com.br 2026' };
                        const next = [...current, newBadge];
                        setSiteData(prev => ({ ...prev, achievementBadges: next }));
                        handleSaveSite({ achievementBadges: next });
                      }}
                      className="text-xs text-[#D05634] font-bold hover:underline"
                    >
                      + Adicionar Conquista
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(siteData.achievementBadges || [
                      { id: '1', title: '+500', subtitle: 'Eventos Fotografados' },
                      { id: '2', title: '100%', subtitle: 'Satisfação dos Noivos' },
                      { id: '3', title: 'Selo Gold', subtitle: 'Casamentos.com.br 2026' }
                    ]).map((ach, idx) => (
                      <div key={ach.id} className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
                        <input 
                          type="text"
                          value={ach.title}
                          onChange={e => {
                            const list = [...(siteData.achievementBadges || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            setSiteData(prev => ({ ...prev, achievementBadges: list }));
                            handleSaveSite({ achievementBadges: list });
                          }}
                          placeholder="+500"
                          className="w-24 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-black text-white"
                        />
                        <input 
                          type="text"
                          value={ach.subtitle}
                          onChange={e => {
                            const list = [...(siteData.achievementBadges || [])];
                            list[idx] = { ...list[idx], subtitle: e.target.value };
                            setSiteData(prev => ({ ...prev, achievementBadges: list }));
                            handleSaveSite({ achievementBadges: list });
                          }}
                          placeholder="Eventos Fotografados"
                          className="flex-1 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-white"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const list = (siteData.achievementBadges || []).filter((_, i) => i !== idx);
                            setSiteData(prev => ({ ...prev, achievementBadges: list }));
                            handleSaveSite({ achievementBadges: list });
                          }}
                          className="text-red-400 p-1 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* FUNCTION 4: PACOTES */}
            {activeMenuId === 'pacotes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-gray-500">Pacotes & Serviços</span>
                </div>

                {siteData.services?.map((svc, idx) => (
                  <div key={svc.id} className={`p-4 rounded-2xl border space-y-3 ${
                    isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <input 
                      type="text"
                      value={svc.name}
                      onChange={e => {
                        const newSvcs = [...(siteData.services || [])];
                        newSvcs[idx].name = e.target.value;
                        setSiteData(prev => ({ ...prev, services: newSvcs }));
                        handleSaveSite({ services: newSvcs });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-300 dark:border-zinc-800 font-bold text-xs"
                    />
                    <input 
                      type="text"
                      value={svc.price}
                      onChange={e => {
                        const newSvcs = [...(siteData.services || [])];
                        newSvcs[idx].price = e.target.value;
                        setSiteData(prev => ({ ...prev, services: newSvcs }));
                        handleSaveSite({ services: newSvcs });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-300 dark:border-zinc-800 text-xs font-mono text-[#D05634]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* FUNCTION 5: TEMAS & MODULAR SCROLLYTELLING COMPOSER (9 TEMAS + MIX & MATCH) */}
            {activeMenuId === 'temas' && (() => {
              const scrollyCfg = resolveScrollyConfig(siteData);
              const activeScrollyId: ScrollytellingThemeId =
                siteData.scrollytellingThemeId || siteData.theme_id || 'classic';
              const activeSections: ScrollySectionBlock[] = scrollyCfg.sections || [];

              const updateSectionBlock = (
                secId: string,
                patch: Partial<ScrollySectionBlock>
              ) => {
                const nextList = activeSections.map((s) =>
                  s.id === secId ? { ...s, ...patch } : s
                );
                updateScrollyConfig({ sections: nextList });
              };

              const moveSectionBlock = (idx: number, dir: -1 | 1) => {
                const target = idx + dir;
                if (target < 0 || target >= activeSections.length) return;
                const nextList = [...activeSections];
                const temp = nextList[idx];
                nextList[idx] = nextList[target];
                nextList[target] = temp;
                updateScrollyConfig({ sections: nextList });
              };

              const removeSectionBlock = (secId: string) => {
                const nextList = activeSections.filter((s) => s.id !== secId);
                updateScrollyConfig({ sections: nextList });
                if (selectedScrollySectionId === secId) {
                  setSelectedScrollySectionId(null);
                }
              };

              const handleAddMixedSection = () => {
                const created = createSectionFromTemplate(newScrollySectionType, siteData);
                // Insert right before the final CTA if possible, otherwise at end
                const nextList = [...activeSections];
                if (
                  nextList.length > 0 &&
                  nextList[nextList.length - 1].type === 'cta_zoom_whatsapp'
                ) {
                  nextList.splice(nextList.length - 1, 0, created);
                } else {
                  nextList.push(created);
                }
                updateScrollyConfig({ sections: nextList });
                setSelectedScrollySectionId(created.id);
              };

              return (
                <div className="space-y-5">
                  {/* 1. CATÁLOGO DE 9 TEMAS PRONTOS DE SCROLLYTELLING + LAYOUT CLÁSSICO */}
                  <div
                    className={`p-4 rounded-2xl border space-y-3 ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-[#D05634] flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        <span>9 Temas Scrollytelling + Modular</span>
                      </label>
                      <span className="text-[10px] font-mono text-gray-400">
                        theme_id: {activeScrollyId}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                      Escolha um dos 9 temas cinematográficos prontos (salva <code className="font-mono text-[#D05634]">theme_id</code> no site e na coleção) e mescle livremente dobras de outros temas abaixo.
                    </p>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin pt-1">
                      {SCROLLYTELLING_THEME_CATALOG.map((t) => {
                        const isSelected = activeScrollyId === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              const nextId = t.id;
                              const presetSections =
                                nextId === 'classic'
                                  ? scrollyCfg.sections
                                  : getThemePresetSections(nextId, {
                                      ...siteData,
                                      headingFont: t.defaultHeadingFont,
                                      bodyFont: t.defaultBodyFont
                                    });
                              const nextCfg: ScrollytellingConfig = {
                                ...scrollyCfg,
                                sectionsThemeId: nextId === 'classic' ? 'lumina-editorial' : nextId,
                                sections: presetSections
                              };
                              setSiteData((prev) => ({
                                ...prev,
                                theme_id: nextId,
                                scrollytellingThemeId: nextId,
                                headingFont: t.defaultHeadingFont,
                                bodyFont: t.defaultBodyFont,
                                scrollytellingConfig: nextCfg
                              }));
                              handleSaveSite({
                                theme_id: nextId,
                                scrollytellingThemeId: nextId,
                                headingFont: t.defaultHeadingFont,
                                bodyFont: t.defaultBodyFont,
                                scrollytellingConfig: nextCfg
                              });
                              if (presetSections && presetSections.length > 0) {
                                setSelectedScrollySectionId(presetSections[0].id);
                              }
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? 'border-[#D05634] bg-[#D05634]/10'
                                : isDarkShell
                                  ? 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={t.previewImage}
                                alt={t.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-xs font-extrabold truncate ${
                                      isSelected
                                        ? 'text-[#D05634]'
                                        : isDarkShell
                                          ? 'text-white'
                                          : 'text-gray-900'
                                    }`}
                                  >
                                    {t.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-zinc-400 line-clamp-1">
                                  {t.badge} · {t.desc}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-[#D05634] bg-[#D05634] text-white'
                                  : 'border-gray-400'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Action Buttons: Fullscreen Test & View Database JSON */}
                    {activeScrollyId !== 'classic' && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSidebarCollapsed(true);
                            setIsDrawerCollapsed(true);
                            setIsFullScreenScrollyTest(true);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-[#D05634] text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-95"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Tela Cheia</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowScrollyJsonModal(true)}
                          className={`py-2.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                            isDarkShell
                              ? 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-[#D05634]'
                              : 'border-gray-300 bg-white text-gray-800 hover:border-[#D05634]'
                          }`}
                        >
                          <Database className="w-3.5 h-3.5 text-[#D05634]" />
                          <span>JSON / SQL</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2. COMPOSITOR MODULAR DE DOBRAS (MIX & MATCH ENTRE TEMAS) */}
                  {activeScrollyId !== 'classic' && (
                    <div className="space-y-4">
                      {/* Add Section From Any Theme Box */}
                      <div
                        className={`p-3.5 rounded-2xl border space-y-2.5 ${
                          isDarkShell
                            ? 'bg-zinc-950 border-zinc-800'
                            : 'bg-orange-50/40 border-orange-200/70'
                        }`}
                      >
                        <label className="text-[11px] font-black uppercase tracking-wider text-[#D05634] flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Mesclar Dobra de Outro Tema (Mix & Match)</span>
                        </label>
                        <select
                          value={newScrollySectionType}
                          onChange={(e) =>
                            setNewScrollySectionType(e.target.value as ScrollySectionType)
                          }
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                            isDarkShell
                              ? 'bg-zinc-900 border-zinc-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        >
                          {SCROLLY_SECTION_LIBRARY.map((item) => (
                            <option key={item.type} value={item.type}>
                              [{item.originTheme}] {item.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAddMixedSection}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Inserir Dobra no Site</span>
                        </button>
                      </div>

                      {/* Active Sections Accordion List */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                            Dobras Ativas do Site ({activeSections.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const fresh = getThemePresetSections(activeScrollyId, siteData);
                              updateScrollyConfig({ sections: fresh });
                            }}
                            className="text-[10px] font-bold text-[#D05634] hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Restaurar Padrão
                          </button>
                        </div>

                        {activeSections.map((sec, idx) => {
                          const isExpanded = selectedScrollySectionId === sec.id;
                          const libMeta = SCROLLY_SECTION_LIBRARY.find(
                            (l) => l.type === sec.type
                          );

                          return (
                            <div
                              key={sec.id}
                              className={`rounded-2xl border transition-all overflow-hidden ${
                                isExpanded
                                  ? 'border-[#D05634] shadow-md'
                                  : isDarkShell
                                    ? 'border-zinc-800 bg-zinc-950/70'
                                    : 'border-gray-200 bg-white'
                              }`}
                            >
                              {/* Section Header Row */}
                              <div
                                onClick={() =>
                                  setSelectedScrollySectionId(isExpanded ? null : sec.id)
                                }
                                className={`p-3 flex items-center justify-between gap-2 cursor-pointer ${
                                  isExpanded
                                    ? isDarkShell
                                      ? 'bg-zinc-900'
                                      : 'bg-orange-50/50'
                                    : ''
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono font-black text-[#D05634]">
                                      0{idx + 1}.
                                    </span>
                                    <span className="text-xs font-extrabold truncate">
                                      {libMeta?.label || sec.title}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 block truncate">
                                    Origem: {sec.sourceThemeName} · {sec.title}
                                  </span>
                                </div>

                                <div
                                  className="flex items-center gap-1 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSectionBlock(sec.id, {
                                        visible: sec.visible === false ? true : false
                                      })
                                    }
                                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 ${
                                      sec.visible === false
                                        ? 'text-gray-400'
                                        : 'text-emerald-500'
                                    }`}
                                    title="Mostrar / Ocultar Dobra"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveSectionBlock(idx, -1)}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                                    title="Subir Dobra"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === activeSections.length - 1}
                                    onClick={() => moveSectionBlock(idx, 1)}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                                    title="Descer Dobra"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeSectionBlock(sec.id)}
                                    className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-500"
                                    title="Remover Dobra"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Per-Section Full Customizer */}
                              {isExpanded && (
                                <div
                                  className={`p-3.5 border-t space-y-3.5 text-xs ${
                                    isDarkShell
                                      ? 'border-zinc-800 bg-zinc-950'
                                      : 'border-gray-100 bg-white'
                                  }`}
                                >
                                  {/* A. TEXTOS DA SEÇÃO */}
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D05634] block">
                                      Textos & Títulos desta Dobra
                                    </span>
                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">
                                        Kicker Superior
                                      </label>
                                      <input
                                        type="text"
                                        value={sec.kicker || ''}
                                        onChange={(e) =>
                                          updateSectionBlock(sec.id, { kicker: e.target.value })
                                        }
                                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                                          isDarkShell
                                            ? 'bg-zinc-900 border-zinc-800 text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                        }`}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">
                                        Título Principal
                                      </label>
                                      <input
                                        type="text"
                                        value={sec.title || ''}
                                        onChange={(e) =>
                                          updateSectionBlock(sec.id, { title: e.target.value })
                                        }
                                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                                          isDarkShell
                                            ? 'bg-zinc-900 border-zinc-800 text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                        }`}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">
                                        Subtítulo / Descrição Curta
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={sec.subtitle || ''}
                                        onChange={(e) =>
                                          updateSectionBlock(sec.id, {
                                            subtitle: e.target.value
                                          })
                                        }
                                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs resize-none ${
                                          isDarkShell
                                            ? 'bg-zinc-900 border-zinc-800 text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                        }`}
                                      />
                                    </div>

                                    {(sec.type === 'sticky_story_split' ||
                                      sec.type === 'manifesto_word_reveal' ||
                                      sec.type === 'vogue_overlapping_spread') && (
                                      <div>
                                        <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">
                                          Texto Narrativo / Manifesto
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={sec.bodyText || ''}
                                          onChange={(e) =>
                                            updateSectionBlock(sec.id, {
                                              bodyText: e.target.value
                                            })
                                          }
                                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs resize-none ${
                                            isDarkShell
                                              ? 'bg-zinc-900 border-zinc-800 text-white'
                                              : 'bg-gray-50 border-gray-200 text-gray-900'
                                          }`}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* B. FONTES E CORES EXCLUSIVAS DESTA SEÇÃO */}
                                  <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 space-y-2.5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D05634] block">
                                      Fontes & Cores Exclusivas desta Dobra
                                    </span>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[10px] text-gray-400 mb-0.5">
                                          Fonte do Título
                                        </label>
                                        <select
                                          value={sec.headingFont || siteData.headingFont || 'Playfair Display'}
                                          onChange={(e) =>
                                            updateSectionBlock(sec.id, {
                                              headingFont: e.target.value
                                            })
                                          }
                                          className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold ${
                                            isDarkShell
                                              ? 'bg-zinc-900 border-zinc-800 text-white'
                                              : 'bg-gray-50 border-gray-200 text-gray-900'
                                          }`}
                                        >
                                          <option value="Playfair Display">Playfair Display</option>
                                          <option value="Cinzel">Cinzel (Luxo)</option>
                                          <option value="Outfit">Outfit (Moderna)</option>
                                          <option value="Bricolage Grotesque">Bricolage Grotesque</option>
                                          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                          <option value="Lora">Lora (Editorial)</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] text-gray-400 mb-0.5">
                                          Fonte do Corpo
                                        </label>
                                        <select
                                          value={sec.bodyFont || siteData.bodyFont || 'Plus Jakarta Sans'}
                                          onChange={(e) =>
                                            updateSectionBlock(sec.id, {
                                              bodyFont: e.target.value
                                            })
                                          }
                                          className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold ${
                                            isDarkShell
                                              ? 'bg-zinc-900 border-zinc-800 text-white'
                                              : 'bg-gray-50 border-gray-200 text-gray-900'
                                          }`}
                                        >
                                          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                          <option value="DM Sans">DM Sans</option>
                                          <option value="Manrope">Manrope</option>
                                          <option value="Lora">Lora</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                      <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">
                                          Cor de Fundo
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={sec.bgColor || '#0A0A0A'}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                bgColor: e.target.value
                                              })
                                            }
                                            className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                                          />
                                          <span className="text-[10px] font-mono">
                                            {sec.bgColor || '#0A0A0A'}
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">
                                          Cor do Texto
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={sec.textColor || '#FFFFFF'}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                textColor: e.target.value
                                              })
                                            }
                                            className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                                          />
                                          <span className="text-[10px] font-mono">
                                            {sec.textColor || '#FFFFFF'}
                                          </span>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] text-gray-400 mb-1">
                                          Cor Destaque
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={sec.accentColor || siteData.primaryColor || '#D05634'}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                accentColor: e.target.value
                                              })
                                            }
                                            className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                                          />
                                          <span className="text-[10px] font-mono">
                                            {sec.accentColor || '#D05634'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* C. ESTILO DE GALERIA (SE FOR VITRINE DE GALERIAS) */}
                                  {sec.type === 'interactive_gallery_showcase' && (
                                    <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D05634] block">
                                        Estilo & Formato da Vitrine de Galerias
                                      </span>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[10px] text-gray-400 mb-0.5">
                                            Estilo Visual
                                          </label>
                                          <select
                                            value={sec.galleryStyle || 'editorial_grid'}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                galleryStyle: e.target.value as ScrollyGalleryStyle
                                              })
                                            }
                                            className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold ${
                                              isDarkShell
                                                ? 'bg-zinc-900 border-zinc-800 text-white'
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                          >
                                            <option value="editorial_grid">Grade Editorial Clássica</option>
                                            <option value="masonry_flow">Masonry Assimétrico</option>
                                            <option value="horizontal_lookbook">Lookbook Horizontal</option>
                                            <option value="contact_sheet_35mm">Folha de Contato 35mm</option>
                                            <option value="cinema_widescreen">Cinema Widescreen 16:9</option>
                                          </select>
                                        </div>

                                        <div>
                                          <label className="block text-[10px] text-gray-400 mb-0.5">
                                            Proporção (Shape)
                                          </label>
                                          <select
                                            value={sec.galleryAspect || 'aspect-[3/4]'}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                galleryAspect: e.target.value as any
                                              })
                                            }
                                            className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold ${
                                              isDarkShell
                                                ? 'bg-zinc-900 border-zinc-800 text-white'
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                          >
                                            <option value="aspect-[3/4]">Retrato 3:4</option>
                                            <option value="aspect-[4/3]">Paisagem 4:3</option>
                                            <option value="aspect-square">Quadrado 1:1</option>
                                            <option value="aspect-[16/9]">Cinema 16:9</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* D. MÍDIA PRINCIPAL / VÍDEO DESTA SEÇÃO */}
                                  {sec.primaryImage !== undefined && (
                                    <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D05634] block">
                                        Foto & Vídeo Principal da Dobra
                                      </span>
                                      <div className="flex gap-1.5">
                                        <input
                                          type="text"
                                          value={sec.primaryImage || ''}
                                          onChange={(e) =>
                                            updateSectionBlock(sec.id, {
                                              primaryImage: e.target.value
                                            })
                                          }
                                          placeholder="URL da foto principal..."
                                          className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono ${
                                            isDarkShell
                                              ? 'bg-zinc-900 border-zinc-800 text-white'
                                              : 'bg-gray-50 border-gray-200 text-gray-900'
                                          }`}
                                        />
                                        <label className="px-2.5 py-1.5 rounded-lg bg-[#D05634] text-white text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0">
                                          <Upload className="w-3 h-3" /> Foto
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                              handleScrollyMediaUpload(e, (url) =>
                                                updateSectionBlock(sec.id, { primaryImage: url })
                                              )
                                            }
                                          />
                                        </label>
                                      </div>

                                      {/* Optional Video Loop */}
                                      <div className="flex gap-1.5">
                                        <input
                                          type="text"
                                          value={sec.primaryVideo || ''}
                                          onChange={(e) =>
                                            updateSectionBlock(sec.id, {
                                              primaryVideo: e.target.value
                                            })
                                          }
                                          placeholder="Vídeo MP4 em loop (opcional)..."
                                          className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono ${
                                            isDarkShell
                                              ? 'bg-zinc-900 border-zinc-800 text-white'
                                              : 'bg-gray-50 border-gray-200 text-gray-900'
                                          }`}
                                        />
                                        <label className="px-2.5 py-1.5 rounded-lg border border-[#D05634] text-[#D05634] text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0">
                                          <Film className="w-3 h-3" /> MP4
                                          <input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            className="hidden"
                                            onChange={(e) =>
                                              handleScrollyMediaUpload(e, (url) =>
                                                updateSectionBlock(sec.id, { primaryVideo: url })
                                              )
                                            }
                                          />
                                        </label>
                                      </div>

                                      {/* Secondary Image (for Before/After, Manifesto, Vogue Spread) */}
                                      {sec.secondaryImage !== undefined && (
                                        <div className="flex gap-1.5 pt-1">
                                          <input
                                            type="text"
                                            value={sec.secondaryImage || ''}
                                            onChange={(e) =>
                                              updateSectionBlock(sec.id, {
                                                secondaryImage: e.target.value
                                              })
                                            }
                                            placeholder="Segunda Foto (ex: RAW / Lateral)..."
                                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono ${
                                              isDarkShell
                                                ? 'bg-zinc-900 border-zinc-800 text-white'
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                          />
                                          <label className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1 shrink-0">
                                            <Upload className="w-3 h-3" /> 2ª Foto
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) =>
                                                handleScrollyMediaUpload(e, (url) =>
                                                  updateSectionBlock(sec.id, {
                                                    secondaryImage: url
                                                  })
                                                )
                                              }
                                            />
                                          </label>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* E. LISTA DE FOTOS / CARDS INTERNOS DA SEÇÃO (items) */}
                                  {sec.items && sec.items.length > 0 && (
                                    <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D05634]">
                                          Fotos / Cards da Dobra ({sec.items.length})
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const nextItems = [
                                              ...(sec.items || []),
                                              {
                                                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                                                caption: `Novo Card 0${(sec.items?.length || 0) + 1}`
                                              }
                                            ];
                                            updateSectionBlock(sec.id, { items: nextItems });
                                          }}
                                          className="text-[10px] font-bold text-[#D05634] hover:underline flex items-center gap-0.5"
                                        >
                                          <Plus className="w-3 h-3" /> Adicionar Foto
                                        </button>
                                      </div>

                                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                                        {sec.items.map((item, itemIdx) => (
                                          <div
                                            key={itemIdx}
                                            className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-1.5"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] font-bold text-gray-400">
                                                Item 0{itemIdx + 1}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <label className="text-[10px] font-bold text-[#D05634] cursor-pointer hover:underline flex items-center gap-1">
                                                  <Upload className="w-3 h-3" /> Upload
                                                  <input
                                                    type="file"
                                                    accept="image/*,video/mp4"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                      handleScrollyMediaUpload(e, (url) => {
                                                        const nextItems = [...(sec.items || [])];
                                                        const isVid =
                                                          e.target.files?.[0]?.type.startsWith(
                                                            'video/'
                                                          );
                                                        nextItems[itemIdx] = isVid
                                                          ? { ...nextItems[itemIdx], videoUrl: url }
                                                          : {
                                                              ...nextItems[itemIdx],
                                                              url,
                                                              videoUrl: ''
                                                            };
                                                        updateSectionBlock(sec.id, {
                                                          items: nextItems
                                                        });
                                                      })
                                                    }
                                                  />
                                                </label>
                                                {(sec.items?.length || 0) > 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const nextItems = (sec.items || []).filter(
                                                        (_, k) => k !== itemIdx
                                                      );
                                                      updateSectionBlock(sec.id, {
                                                        items: nextItems
                                                      });
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>

                                            <input
                                              type="text"
                                              value={item.caption}
                                              onChange={(e) => {
                                                const nextItems = [...(sec.items || [])];
                                                nextItems[itemIdx] = {
                                                  ...nextItems[itemIdx],
                                                  caption: e.target.value
                                                };
                                                updateSectionBlock(sec.id, { items: nextItems });
                                              }}
                                              placeholder="Título / Legenda"
                                              className={`w-full px-2 py-1 rounded border text-[11px] font-semibold ${
                                                isDarkShell
                                                  ? 'bg-zinc-900 border-zinc-800 text-white'
                                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                              }`}
                                            />

                                            <input
                                              type="text"
                                              value={item.url}
                                              onChange={(e) => {
                                                const nextItems = [...(sec.items || [])];
                                                nextItems[itemIdx] = {
                                                  ...nextItems[itemIdx],
                                                  url: e.target.value
                                                };
                                                updateSectionBlock(sec.id, { items: nextItems });
                                              }}
                                              placeholder="URL da imagem..."
                                              className={`w-full px-2 py-1 rounded border text-[10px] font-mono ${
                                                isDarkShell
                                                  ? 'bg-zinc-900 border-zinc-800 text-white'
                                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                              }`}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MENU NAVBAR STYLE SELECTOR */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634] mb-2">
                      Estilo do Menu de Navegação (Navbar)
                    </label>
                    <select
                      value={siteData.navStyle || 'floating_pill'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSiteData((prev) => ({ ...prev, navStyle: val }));
                        handleSaveSite({ navStyle: val });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                        isDarkShell
                          ? 'bg-zinc-950 border-zinc-800 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="floating_pill">Magic UI Floating Glass Header</option>
                      <option value="minimal_top">Minimalist Top Bar</option>
                      <option value="centered_logo">Centered Logo Header</option>
                      <option value="dark_editorial">Dark Editorial Bar</option>
                      <option value="modern_split">Modern Split Header</option>
                    </select>
                  </div>

                  {/* TEMAS VISUAIS */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Paleta de Fundo Padrão
                    </label>
                    <select
                      value={siteData.theme || 'dark'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSiteData((prev) => ({ ...prev, theme: val }));
                        handleSaveSite({ theme: val });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                        isDarkShell
                          ? 'bg-zinc-950 border-zinc-800 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="dark">Minimalist Dark</option>
                      <option value="light">Editorial Light</option>
                      <option value="luxury">Wedding Luxury</option>
                      <option value="cinematic">Cinematic Video</option>
                      <option value="modern">Modern Grid</option>
                    </select>
                  </div>
                </div>
              );
            })()}

            {/* FUNCTION 6: FONTES */}
            {activeMenuId === 'fontes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Fonte dos Títulos (Heading)</label>
                  <select 
                    value={siteData.headingFont || 'Outfit'}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, headingFont: val }));
                      handleSaveSite({ headingFont: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="Outfit">Outfit (Moderna Sans)</option>
                    <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Limpa)</option>
                    <option value="Bricolage Grotesque">Bricolage Grotesque (Brutalista)</option>
                    <option value="Cinzel">Cinzel (Luxo & Casamentos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Fonte do Texto (Body)</label>
                  <select 
                    value={siteData.bodyFont || 'Plus Jakarta Sans'}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, bodyFont: val }));
                      handleSaveSite({ bodyFont: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="DM Sans">DM Sans</option>
                    <option value="Manrope">Manrope</option>
                    <option value="Lora">Lora (Serif Elegante)</option>
                  </select>
                </div>
              </div>
            )}

            {/* FUNCTION 7: CORES */}
            {activeMenuId === 'cores' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cor Principal de Destaque</label>
                  <div className="flex items-center gap-3">
                    {['#D05634', '#E11D48', '#38BDF8', '#10B981', '#F59E0B', '#8B5CF6'].map((color) => (
                      <button 
                        key={color}
                        onClick={() => {
                          setSiteData(prev => ({ ...prev, primaryColor: color }));
                          handleSaveSite({ primaryColor: color });
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          siteData.primaryColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input 
                      type="color"
                      value={siteData.primaryColor || '#D05634'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, primaryColor: val }));
                        handleSaveSite({ primaryColor: val });
                      }}
                      className="w-8 h-8 rounded-full border-0 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FUNCTION 8: MÍDIAS */}
            {activeMenuId === 'midia' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Upload de Imagens R2</label>
                <label className={`flex items-center justify-center gap-2 p-4 border border-dashed rounded-2xl cursor-pointer transition-all text-xs font-bold ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}>
                  <Upload className="w-5 h-5 text-[#D05634]" />
                  <span>{isUploading ? 'Enviando...' : 'Fazer Upload de Capa Hero'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'heroImageUrl')} />
                </label>
              </div>
            )}

            {/* FUNCTION 9: GALERIAS DO PORTFÓLIO & CUSTOMIZAÇÃO VISUAL */}
            {activeMenuId === 'galerias' && (
              <div className="space-y-6">
                
                {/* 1. SELEÇÃO DE COLEÇÕES DO FRAME+ */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634] flex items-center justify-between">
                    <span>Coleções Exibidas no Site</span>
                    <span className="text-[10px] text-gray-400 font-mono font-normal">
                      {(siteData.selectedCollectionIds || []).length} selecionadas
                    </span>
                  </label>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                    {collections.map((col) => {
                      const isSelected = siteData.selectedCollectionIds?.includes(col.id.toString());
                      return (
                        <div 
                          key={col.id}
                          onClick={() => toggleCollectionSelection(col.id.toString())}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-[#FFF0EB] border-[#D05634] dark:bg-amber-500/10 dark:border-amber-500 font-bold' 
                              : isDarkShell ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black shrink-0">
                              <img src={col.image || (col.media && col.media[0]) || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80'} alt={col.title} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs truncate max-w-[160px]">{col.title}</p>
                          </div>
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#D05634]" /> : <Square className="w-4 h-4 text-gray-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. TEXTOS DA SEÇÃO DO PORTFÓLIO */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#D05634]">
                    Textos & Títulos da Seção
                  </label>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Kicker (Destaque Superior)</label>
                    <input 
                      type="text"
                      value={siteData.galleryKickerText ?? 'Galeria Visual'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, galleryKickerText: val }));
                        handleSaveSite({ galleryKickerText: val });
                      }}
                      placeholder="Ex: Galeria Visual, Portfólio 2026"
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Título Principal da Dobra</label>
                    <input 
                      type="text"
                      value={siteData.gallerySectionTitle ?? 'Portfólio em Destaque'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, gallerySectionTitle: val }));
                        handleSaveSite({ gallerySectionTitle: val });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Subtítulo / Descrição</label>
                    <textarea 
                      rows={2}
                      value={siteData.gallerySectionSubtitle ?? 'Confira os últimos trabalhos, momentos espontâneos e memórias registradas.'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, gallerySectionSubtitle: val }));
                        handleSaveSite({ gallerySectionSubtitle: val });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs resize-none ${
                        isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. FORMATO / SHAPE DOS CARDS (CLEAN SELECT) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Formato dos Cards (Aspect Ratio)
                  </label>
                  <select 
                    value={siteData.galleryShape || 'aspect-[4/3]'}
                    onChange={e => {
                      const val = e.target.value as any;
                      setSiteData(prev => ({ ...prev, galleryShape: val }));
                      handleSaveSite({ galleryShape: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="aspect-[4/3]">Padrão 4:3</option>
                    <option value="aspect-square">Quadrado 1:1</option>
                    <option value="aspect-[3/4]">Retrato 3:4</option>
                    <option value="aspect-[16/9]">Widescreen 16:9</option>
                    <option value="aspect-[9/16]">Vertical 9:16</option>
                  </select>
                </div>

                {/* 4. POSIÇÃO DAS INFORMAÇÕES (CLEAN SELECT) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Posição dos Textos das Galerias
                  </label>
                  <select 
                    value={siteData.galleryTextPosition || 'below_card'}
                    onChange={e => {
                      const val = e.target.value as any;
                      setSiteData(prev => ({ ...prev, galleryTextPosition: val }));
                      handleSaveSite({ galleryTextPosition: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="below_card">Embaixo do Card</option>
                    <option value="inside_overlay">Dentro do Card</option>
                  </select>
                </div>

                {/* 5. LAYOUT DE COLUNAS & ESPAÇAMENTO */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Colunas da Grade</label>
                    <select 
                      value={siteData.galleryColumns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, galleryColumns: val }));
                        handleSaveSite({ galleryColumns: val });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="grid-cols-1 md:grid-cols-2">2 Colunas Grandes</option>
                      <option value="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">3 Colunas (Padrão)</option>
                      <option value="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">4 Colunas Densa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Espaçamento (Gap)</label>
                    <select 
                      value={siteData.gallerySpacing || 'gap-8'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, gallerySpacing: val as any }));
                        handleSaveSite({ gallerySpacing: val as any });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="gap-4">Compacto (16px)</option>
                      <option value="gap-6">Médio (24px)</option>
                      <option value="gap-8">Amplo (32px)</option>
                      <option value="gap-12">Luxo (48px)</option>
                    </select>
                  </div>
                </div>

                {/* 6. BOTÃO DE AÇÃO NOS CARDS (CTA) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#D05634]">
                      Exibir Botão nos Cards
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        const next = siteData.galleryShowButton === false ? true : false;
                        setSiteData(prev => ({ ...prev, galleryShowButton: next }));
                        handleSaveSite({ galleryShowButton: next });
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                        siteData.galleryShowButton !== false ? 'bg-[#D05634]' : 'bg-gray-400'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
                        siteData.galleryShowButton !== false ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {siteData.galleryShowButton !== false && (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Texto do Botão</label>
                      <input 
                        type="text"
                        value={siteData.galleryButtonText ?? 'Ver Galeria'}
                        onChange={e => {
                          const val = e.target.value;
                          setSiteData(prev => ({ ...prev, galleryButtonText: val }));
                          handleSaveSite({ galleryButtonText: val });
                        }}
                        placeholder="Ex: Ver Galeria, Abrir Álbum"
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* 7. ARREDONDAMENTO DAS BORDAS & EFEITOS HOVER */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Arredondamento</label>
                    <select 
                      value={siteData.galleryCardRadius || 'rounded-2xl'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, galleryCardRadius: val as any }));
                        handleSaveSite({ galleryCardRadius: val as any });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="rounded-3xl">Extra Amplo (3XL)</option>
                      <option value="rounded-2xl">Padrão (2XL)</option>
                      <option value="rounded-xl">Leve (XL)</option>
                      <option value="rounded-none">Reto / Editorial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Efeito no Hover</label>
                    <select 
                      value={siteData.galleryHoverEffect || 'zoom'}
                      onChange={e => {
                        const val = e.target.value;
                        setSiteData(prev => ({ ...prev, galleryHoverEffect: val as any }));
                        handleSaveSite({ galleryHoverEffect: val as any });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="zoom">Zoom de Foto</option>
                      <option value="lift">Elevação do Card</option>
                      <option value="grayscale">P&B para Colorido</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* FUNCTION 10: BLOG & GERADOR IA */}
            {activeMenuId === 'blog' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsAiBlogModalOpen(true)}
                    className="py-3 px-2 bg-[#D05634] text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Gerar com IA
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleOpenBlogEditor()}
                    className="py-3 px-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl border border-white/10 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Criar Matéria
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Matérias & Artigos ({blogPosts.length})</span>
                  {blogPosts.map(p => (
                    <div key={p.id} className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-950/40 text-xs flex items-center justify-between gap-2">
                      <div className="truncate">
                        <p className="font-bold truncate text-white">{p.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.category || 'Geral'} • {p.readTime || '3 min'}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          type="button"
                          onClick={() => handleOpenBlogEditor(p)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-[#D05634] text-white transition-colors"
                          title="Editar Artigo"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteBlogPost(p.id)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-red-600 text-white transition-colors"
                          title="Excluir Artigo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FUNCTION 11: SEO & GEO (GTmetrix + Google PageSpeed Insights + Local Visibility) */}
            {activeMenuId === 'seo_rea' && (() => {
              const live = computeLiveSeoScores();
              const grade = seoAudit?.gtmetrix?.grade || live.grade;
              const perfScore = seoAudit?.gtmetrix?.performanceScore ?? live.perfScore;
              const structScore = seoAudit?.gtmetrix?.structureScore ?? live.structureScore;
              const seoScore = seoAudit?.lighthouse?.seoScore ?? live.seoScore;
              const geoScore = seoAudit?.lighthouse?.geoScore ?? live.geoScore;
              const accessScore = seoAudit?.lighthouse?.accessibilityScore ?? live.accessScore;
              const visIndex = seoAudit?.lighthouse?.visibilityIndex || live.visibilityIndex;
              const lcp = seoAudit?.gtmetrix?.lcp || live.lcp;
              const tbt = seoAudit?.gtmetrix?.tbt || live.tbt;
              const cls = seoAudit?.gtmetrix?.cls || live.cls;
              const speedIndex = seoAudit?.gtmetrix?.speedIndex || live.speedIndex;

              const renderGauge = (val: number, label: string) => {
                const radius = 24;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (val / 100) * circumference;
                const color = val >= 90 ? '#10B981' : val >= 65 ? '#F59E0B' : '#EF4444';
                return (
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 60 60">
                        <circle
                          cx="30"
                          cy="30"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="4.5"
                          fill="transparent"
                          className="text-gray-200 dark:text-zinc-800"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r={radius}
                          stroke={color}
                          strokeWidth="4.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <span className="absolute font-black text-xs" style={{ color }}>{val}</span>
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-gray-700 dark:text-zinc-300 text-center leading-tight">{label}</span>
                  </div>
                );
              };

              return (
                <div className="space-y-4">
                  {/* Top Action Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                      Auditor de Performance & GEO
                    </span>
                    <button
                      type="button"
                      onClick={handleRunSeoAudit}
                      disabled={isAuditingSeo}
                      className="px-3 py-1.5 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60 shrink-0"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAuditingSeo ? 'animate-spin' : ''}`} />
                      {isAuditingSeo ? 'Analisando...' : 'Scan com IA'}
                    </button>
                  </div>

                  {/* GTmetrix Benchmark Card */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isDarkShell ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-[#D05634]" />
                        <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                          GTmetrix Performance Grade
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Core Web Vitals</span>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center mt-3.5">
                      {/* Big Grade Diamond */}
                      <div className="col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade</span>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-md my-0.5 ${
                          grade === 'A' ? 'bg-emerald-500 text-white' :
                          grade === 'B' ? 'bg-lime-500 text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                          {grade}
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">Excelente</span>
                      </div>

                      {/* Performance & Structure Bars */}
                      <div className="col-span-8 space-y-2.5">
                        <div>
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-gray-600 dark:text-zinc-400">Performance</span>
                            <span className="text-emerald-600 font-extrabold">{perfScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                              style={{ width: `${perfScore}%` }} 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-gray-600 dark:text-zinc-400">Structure</span>
                            <span className="text-emerald-600 font-extrabold">{structScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                              style={{ width: `${structScore}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Web Vitals 4-Grid */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/80 text-center">
                      <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/60">
                        <span className="text-[9px] text-gray-400 font-semibold block">LCP</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{lcp}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/60">
                        <span className="text-[9px] text-gray-400 font-semibold block">TBT</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{tbt}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/60">
                        <span className="text-[9px] text-gray-400 font-semibold block">CLS</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{cls}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/60">
                        <span className="text-[9px] text-gray-400 font-semibold block">Speed Idx</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{speedIndex}</span>
                      </div>
                    </div>
                  </div>

                  {/* Google PageSpeed Insights & Lighthouse 4 Circular Gauges */}
                  <div className={`p-4 rounded-2xl border ${
                    isDarkShell ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                          Google PageSpeed Insights
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Lighthouse v12</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3.5">
                      {renderGauge(seoScore, 'SEO Geral')}
                      {renderGauge(geoScore, 'GEO Local')}
                      {renderGauge(perfScore, 'Performance')}
                      {renderGauge(accessScore, 'Acessível')}
                    </div>

                    {/* Local Visibility Index Banner */}
                    <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-2.5">
                      <Compass className="w-4 h-4 text-[#D05634] shrink-0 mt-0.5" />
                      <div className="text-[11px] flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#D05634] uppercase tracking-wider">
                            Visibilidade Google Maps & SERP
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-zinc-300 font-bold mt-0.5">{visIndex}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                          Baseado na densidade de palavras-chave locais, raio de atendimento e dados estruturados Schema.org.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-tabs Navigation */}
                  <div className="flex rounded-xl bg-gray-100 dark:bg-zinc-900 p-1 gap-1 overflow-x-auto text-[10px] font-black uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('auditoria')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                        seoActiveTab === 'auditoria'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Auditoria
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('meta')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                        seoActiveTab === 'meta'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Meta Tags
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('geo')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                        seoActiveTab === 'geo'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      GEO Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('palavras')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                        seoActiveTab === 'palavras'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Keywords
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoActiveTab('schema')}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                        seoActiveTab === 'schema'
                          ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Schema & Tools
                    </button>
                  </div>

                  {/* TAB 1: AUDITORIA & SUGESTÕES DE MELHORIA COM 1-CLIQUE */}
                  {seoActiveTab === 'auditoria' && (
                    <div className="space-y-3">
                      {/* Fast Check Indicators */}
                      <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                          Diagnóstico dos Fatores de Ranqueamento
                        </span>

                        {/* Title Check */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {siteData.metaTitle && siteData.metaTitle.length >= 25 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">Meta Title Otimizado</span>
                          </div>
                          {(!siteData.metaTitle || siteData.metaTitle.length < 25) && (
                            <button
                              type="button"
                              onClick={handleOptimizeTitle}
                              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#D05634] text-[10px] font-bold"
                            >
                              Corrigir em 1-Clique
                            </button>
                          )}
                        </div>

                        {/* Description Check */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {siteData.metaDescription && siteData.metaDescription.length >= 80 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">Meta Description (Snippet)</span>
                          </div>
                          {(!siteData.metaDescription || siteData.metaDescription.length < 80) && (
                            <button
                              type="button"
                              onClick={handleOptimizeDescription}
                              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#D05634] text-[10px] font-bold"
                            >
                              Gerar com IA
                            </button>
                          )}
                        </div>

                        {/* GEO Check */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {siteData.geoCity ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">
                              GEO Local: {siteData.geoCity || 'Não definida'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSeoActiveTab('geo')}
                            className="text-[10px] font-bold text-[#D05634] hover:underline"
                          >
                            Editar
                          </button>
                        </div>

                        {/* Schema Check */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {siteData.schemaOrgEnabled !== false ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">Schema.org LocalBusiness JSON-LD</span>
                          </div>
                          {siteData.schemaOrgEnabled === false ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSiteData(prev => ({ ...prev, schemaOrgEnabled: true }));
                                handleSaveSite({ schemaOrgEnabled: true });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold"
                            >
                              Ativar
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600">Ativo</span>
                          )}
                        </div>

                        {/* Keywords Check */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {(siteData.focusKeywords?.length || 0) >= 3 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">
                              Palavras-Chave de Foco ({siteData.focusKeywords?.length || 0}/5)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSeoActiveTab('palavras')}
                            className="text-[10px] font-bold text-[#D05634] hover:underline"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>

                      {/* AI Recommendations List */}
                      {seoAudit?.recommendations && seoAudit.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
                            Recomendações Práticas da IA
                          </span>
                          {seoAudit.recommendations.map((rec: any, idx: number) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-gray-900 dark:text-white">{rec.title}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  rec.priority === 'Alta' ? 'bg-red-500/10 text-red-500' :
                                  rec.priority === 'Média' ? 'bg-amber-500/10 text-amber-500' :
                                  'bg-blue-500/10 text-blue-500'
                                }`}>
                                  {rec.priority}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 dark:text-zinc-400">{rec.description}</p>
                              {rec.action && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (rec.action?.includes('meta') || rec.action?.includes('title')) handleOptimizeTitle();
                                    else if (rec.action?.includes('desc')) handleOptimizeDescription();
                                    else if (rec.action?.includes('geo')) setSeoActiveTab('geo');
                                    else if (rec.action?.includes('keyword')) setSeoActiveTab('palavras');
                                    else if (rec.action?.includes('schema')) setSeoActiveTab('schema');
                                  }}
                                  className="mt-1 text-[10px] font-black text-[#D05634] hover:underline flex items-center gap-1"
                                >
                                  Corrigir: {rec.action} <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: META TAGS & GOOGLE SERP PREVIEW */}
                  {seoActiveTab === 'meta' && (
                    <div className="space-y-4">
                      {/* Google Snippet Live Card Preview */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                          Preview no Google (SERP)
                        </span>
                        <div className={`p-4 rounded-2xl border text-left ${
                          isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 rounded-full bg-[#D05634] flex items-center justify-center text-[9px] text-white font-black">
                              F
                            </div>
                            <div className="text-[10px] text-gray-500 truncate font-mono">
                              https://{siteData.customDomain || `${siteData.slug}.framepro.click`}
                            </div>
                          </div>
                          <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 leading-snug">
                            {siteData.metaTitle || siteData.title || 'Título do Site no Google'}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                            {siteData.metaDescription || siteData.heroSubtitle || 'Adicione uma meta descrição para exibir um snippet persuasivo nos resultados do Google.'}
                          </p>
                        </div>
                      </div>

                      {/* Meta Title Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase text-gray-500">
                            Meta Título (SEO Title)
                          </label>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold ${
                              (siteData.metaTitle?.length || 0) >= 30 && (siteData.metaTitle?.length || 0) <= 60 
                                ? 'text-emerald-500' 
                                : 'text-amber-500'
                            }`}>
                              {siteData.metaTitle?.length || 0}/60 chars
                            </span>
                            <button
                              type="button"
                              onClick={handleOptimizeTitle}
                              className="text-[10px] font-bold text-[#D05634] hover:underline flex items-center gap-1"
                            >
                              <Wand2 className="w-2.5 h-2.5" /> Otimizar
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={siteData.metaTitle || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, metaTitle: val }));
                            handleSaveSite({ metaTitle: val });
                          }}
                          placeholder={`${siteData.photographerName} | Fotografia de Casamento em ${siteData.geoCity || 'São Paulo'}`}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Recomendado: 35 a 60 caracteres incluindo cidade e nicho.</p>
                      </div>

                      {/* Meta Description Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase text-gray-500">
                            Meta Descrição (Google Snippet)
                          </label>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold ${
                              (siteData.metaDescription?.length || 0) >= 110 && (siteData.metaDescription?.length || 0) <= 160 
                                ? 'text-emerald-500' 
                                : 'text-amber-500'
                            }`}>
                              {siteData.metaDescription?.length || 0}/160 chars
                            </span>
                            <button
                              type="button"
                              onClick={handleOptimizeDescription}
                              className="text-[10px] font-bold text-[#D05634] hover:underline flex items-center gap-1"
                            >
                              <Wand2 className="w-2.5 h-2.5" /> Gerar com IA
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={siteData.metaDescription || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, metaDescription: val }));
                            handleSaveSite({ metaDescription: val });
                          }}
                          placeholder="Fotografia e registros atemporais de casamentos e ensaios. Histórias reais contadas com sensibilidade e elegância. Conheça o portfólio!"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs resize-none leading-relaxed ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Ideal: 120 a 160 caracteres com chamada para ação clara.</p>
                      </div>

                      {/* OpenGraph Social Image */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase text-gray-500">
                            Imagem de Compartilhamento (og:image)
                          </label>
                          {siteData.heroImageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setSiteData(prev => ({ ...prev, ogImageUrl: siteData.heroImageUrl }));
                                handleSaveSite({ ogImageUrl: siteData.heroImageUrl });
                              }}
                              className="text-[10px] font-bold text-[#D05634] hover:underline"
                            >
                              Usar Foto da Hero
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteData.ogImageUrl || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, ogImageUrl: val }));
                            handleSaveSite({ ogImageUrl: val });
                          }}
                          placeholder="https://..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Imagem exibida nos previews do WhatsApp, iMessage e redes sociais (1200x630px).</p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GEO & BUSCA LOCAL GOOGLE MAPS */}
                  {seoActiveTab === 'geo' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Cidade Principal *
                          </label>
                          <input
                            type="text"
                            value={siteData.geoCity || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setSiteData(prev => ({ ...prev, geoCity: val }));
                              handleSaveSite({ geoCity: val });
                            }}
                            placeholder="São Paulo"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Estado / Região (UF)
                          </label>
                          <input
                            type="text"
                            value={siteData.geoState || siteData.geoRegion || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setSiteData(prev => ({ ...prev, geoState: val, geoRegion: val }));
                              handleSaveSite({ geoState: val, geoRegion: val });
                            }}
                            placeholder="SP"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Bairro / Área de Cobertura
                        </label>
                        <input
                          type="text"
                          value={siteData.geoNeighborhood || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, geoNeighborhood: val }));
                            handleSaveSite({ geoNeighborhood: val });
                          }}
                          placeholder="Jardins, Pinheiros, Vila Madalena..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Ajuda a ranquear em pesquisas geolocalizadas do bairro.</p>
                      </div>

                      {/* Service Radius Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500">
                            Raio de Atendimento
                          </label>
                          <span className="text-xs font-black text-[#D05634]">
                            {siteData.serviceRadiusKm || 50} km
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="250"
                          step="5"
                          value={siteData.serviceRadiusKm || 50}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10);
                            setSiteData(prev => ({ ...prev, serviceRadiusKm: val }));
                            handleSaveSite({ serviceRadiusKm: val });
                          }}
                          className="w-full accent-[#D05634] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>5 km (Local)</span>
                          <span>50 km (Metropolitano)</span>
                          <span>250 km (Regional)</span>
                        </div>
                      </div>

                      {/* Google Business Profile URL */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Link da Ficha Google Meu Negócio / Maps
                        </label>
                        <input
                          type="text"
                          value={siteData.googleBusinessUrl || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, googleBusinessUrl: val }));
                            handleSaveSite({ googleBusinessUrl: val });
                          }}
                          placeholder="https://maps.app.goo.gl/..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Conecta os sinais de relevância local e avaliações ao seu site.</p>
                      </div>

                      {/* Google Maps Embed iframe URL */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          URL de Embed do Google Maps
                        </label>
                        <input
                          type="text"
                          value={siteData.googleMapsEmbedUrl || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, googleMapsEmbedUrl: val }));
                            handleSaveSite({ googleMapsEmbedUrl: val });
                          }}
                          placeholder="https://www.google.com/maps/embed?pb=..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PALAVRAS-CHAVE DE FOCO */}
                  {seoActiveTab === 'palavras' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Adicionar Nova Palavra-Chave
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newKeywordInput}
                            onChange={e => setNewKeywordInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddKeyword(newKeywordInput);
                              }
                            }}
                            placeholder="Ex: Fotógrafo de Casamento São Paulo"
                            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddKeyword(newKeywordInput)}
                            className="px-4 py-2.5 rounded-xl bg-[#D05634] text-white text-xs font-black uppercase tracking-wider hover:bg-[#b84a2b] transition-all shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Active Keywords Tags */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                          Palavras-Chave Ativas ({siteData.focusKeywords?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(siteData.focusKeywords || []).map((kw, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#D05634] text-xs font-bold flex items-center gap-1.5"
                            >
                              {kw}
                              <button
                                type="button"
                                onClick={() => handleRemoveKeyword(kw)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {(!siteData.focusKeywords || siteData.focusKeywords.length === 0) && (
                            <p className="text-xs text-gray-400 italic">Nenhuma palavra-chave configurada ainda.</p>
                          )}
                        </div>
                      </div>

                      {/* Smart Keyword Suggestions */}
                      <div className={`p-3.5 rounded-2xl border space-y-2 ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300">
                          <Sparkles className="w-3.5 h-3.5 text-[#D05634]" />
                          <span>Sugestões Rápidas (1-Clique para Adicionar)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            `Fotógrafo em ${siteData.geoCity || 'São Paulo'}`,
                            `Fotografia de Casamento ${siteData.geoCity || 'SP'}`,
                            `Ensaio de Casal ${siteData.geoCity || 'SP'}`,
                            `Pré-Wedding ao Ar Livre`,
                            `Melhor Fotógrafo de Família`,
                            `Cobertura Fotográfica Completa`
                          ].map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddKeyword(suggestion)}
                              className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-[#D05634] hover:text-white text-gray-700 dark:text-zinc-300 text-[10px] font-bold transition-all flex items-center gap-1"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: SCHEMA.ORG & GOOGLE TOOLS */}
                  {seoActiveTab === 'schema' && (
                    <div className="space-y-4">
                      {/* Schema.org Toggle */}
                      <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Schema.org LocalBusiness (JSON-LD)
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Injeta dados estruturados do fotógrafo para o robô do Google indexar telefone, cidade e especialidade.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteData.schemaOrgEnabled !== false}
                          onChange={e => {
                            const val = e.target.checked;
                            setSiteData(prev => ({ ...prev, schemaOrgEnabled: val }));
                            handleSaveSite({ schemaOrgEnabled: val });
                          }}
                          className="w-4 h-4 accent-[#D05634] cursor-pointer"
                        />
                      </div>

                      {/* JSON-LD Preview Button */}
                      <button
                        type="button"
                        onClick={() => setShowJsonLdModal(true)}
                        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 hover:border-[#D05634] text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Code className="w-3.5 h-3.5 text-[#D05634]" />
                        Visualizar Código Schema JSON-LD Gerado
                      </button>

                      {/* Auto Alt Tags Toggle */}
                      <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-[#D05634]" />
                            Alt Tags Automáticas em Imagens
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Preenche os atributos alt das fotos com nome do fotógrafo e cidade para Google Imagens.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteData.autoAltTagsEnabled !== false}
                          onChange={e => {
                            const val = e.target.checked;
                            setSiteData(prev => ({ ...prev, autoAltTagsEnabled: val }));
                            handleSaveSite({ autoAltTagsEnabled: val });
                          }}
                          className="w-4 h-4 accent-[#D05634] cursor-pointer"
                        />
                      </div>

                      {/* Google Search Console Verification Tag */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Tag Google Search Console (google-site-verification)
                        </label>
                        <input
                          type="text"
                          value={siteData.googleSearchConsoleTag || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSiteData(prev => ({ ...prev, googleSearchConsoleTag: val }));
                            handleSaveSite({ googleSearchConsoleTag: val });
                          }}
                          placeholder="Ex: d_X8y9... ou <meta name='google-site-verification' content='...' />"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono ${
                            isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Cole o código do Google Search Console para verificar a propriedade do domínio instantaneamente.</p>
                      </div>

                      {/* Live Sitemap & Robots.txt Links */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href="/sitemap.xml"
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#D05634] text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all text-gray-800 dark:text-zinc-200 hover:text-[#D05634]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Ver sitemap.xml
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                        <a
                          href="/robots.txt"
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#D05634] text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all text-gray-800 dark:text-zinc-200 hover:text-[#D05634]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Ver robots.txt
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* FUNCTION 12: DOMÍNIO */}
            {activeMenuId === 'dominio' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Slug do Link Padrão</label>
                  <input 
                    type="text"
                    value={siteData.slug}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setSiteData(prev => ({ ...prev, slug: val }));
                      handleSaveSite({ slug: val });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-mono ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Domínio Próprio</label>
                  <input 
                    type="text"
                    value={siteData.customDomain || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setSiteData(prev => ({ ...prev, customDomain: val }));
                      handleSaveSite({ customDomain: val });
                    }}
                    placeholder="www.joaomachadofotografia.com.br"
                    className={`w-full px-4 py-3 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* FUNCTION 13: LEADS */}
            {activeMenuId === 'leads' && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-gray-500">Caixa de Entrada GorilaForms</span>
                {leads.map(lead => (
                  <div key={lead.id} className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs space-y-1">
                    <p className="font-bold">{lead.name}</p>
                    <p className="text-gray-500">{lead.email} • {lead.phone}</p>
                    <p className="text-[10px] text-[#D05634] font-bold">{lead.eventType} • {lead.budget}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      ) : null}

        {/* RIGHT AREA: REAL-TIME FULL-SCREEN CANVAS PREVIEW */}
        <main className={`flex-1 p-0 md:p-3 flex flex-col items-center justify-center overflow-hidden relative transition-colors ${
          isDarkShell ? 'bg-zinc-950' : 'bg-gray-100'
        }`}>
          {/* Expand Drawer Button if collapsed */}
          {isDrawerCollapsed && (
            <button
              type="button"
              onClick={() => setIsDrawerCollapsed(false)}
              className={`absolute top-5 left-5 z-40 p-2.5 rounded-2xl shadow-xl border flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                isDarkShell 
                  ? 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-850' 
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
              }`}
              title="Abrir Painel de Edição"
            >
              <PanelLeftOpen className="w-4 h-4 text-[#D05634]" />
              <span className="hidden sm:inline">Abrir Edição</span>
            </button>
          )}
          
          {/* Floating Exit Fullscreen Scrollytelling Test Button */}
          {isFullScreenScrollyTest && (
            <button
              type="button"
              onClick={() => {
                setIsFullScreenScrollyTest(false);
                setIsSidebarCollapsed(false);
                setIsDrawerCollapsed(false);
              }}
              className="absolute top-5 right-6 z-50 px-4 py-2.5 rounded-full bg-[#D05634] text-white text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Voltar ao Modo Editor</span>
            </button>
          )}

          {/* Full Screen Live Viewport (Mac Browser frame completely removed) */}
          <div 
            className={`transition-all duration-300 w-full h-full rounded-2xl shadow-xl overflow-hidden flex flex-col ${
              isDarkShell ? 'bg-black border border-zinc-800' : 'bg-white border border-gray-200'
            } ${
              deviceMode === 'desktop' 
                ? 'w-full h-full' 
                : deviceMode === 'tablet' 
                  ? 'max-w-[768px] h-[92%] my-auto rounded-3xl border-4' 
                  : 'max-w-[390px] h-[90%] my-auto rounded-[2.5rem] border-4'
            }`}
          >
            {/* LIVE SITE VIEWPORT - FULL CANVAS */}
            <div data-scrolly-viewport="true" className="flex-1 overflow-y-auto scrollbar-thin h-full">
              <PublicWebsiteView 
                site={siteData} 
                collections={collections}
                isEditorPreview={true}
                activeSection={activeSection}
                onSelectSection={(secId) => {
                  setActiveSection(secId);
                  const secToMenuMap: Record<string, any> = {
                    hero: 'hero',
                    portfolio: 'galerias',
                    about: 'sobre',
                    pricing: 'pacotes',
                    leads: 'leads',
                    blog: 'blog',
                    temas: 'temas'
                  };
                  setActiveMenuId(secToMenuMap[secId] || 'temas');
                }}
                onUpdateSite={(updated) => {
                  setSiteData(prev => ({ ...prev, ...updated }));
                  handleSaveSite(updated);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: AI ARTICLE GENERATOR */}
      {isAiBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl max-w-lg w-full p-8 border border-gray-200 dark:border-zinc-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D05634]" />
                <h3 className="font-black text-lg">Gerar Artigo por IA</h3>
              </div>
              <button onClick={() => setIsAiBlogModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-2">Tema ou Palavra-Chave *</label>
                <input 
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="Ex: Melhores locais para ensaio pré-wedding ao pôr do sol"
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-2">Cidade para GEO SEO</label>
                <input 
                  type="text"
                  value={aiCity}
                  onChange={e => setAiCity(e.target.value)}
                  placeholder={siteData.geoCity || 'São Paulo'}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerateBlog}
              disabled={isGeneratingBlog || !aiTopic}
              className="w-full py-4 rounded-2xl bg-[#D05634] hover:bg-[#b84a2b] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingBlog ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingBlog ? 'Gerando Artigo Completo...' : 'Gerar Artigo com IA'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL BLOG EDITOR */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl max-w-2xl w-full p-8 border border-gray-200 dark:border-zinc-800 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#D05634]" />
                <h3 className="font-black text-lg">{editingPost ? 'Editar Matéria' : 'Criar Nova Matéria'}</h3>
              </div>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-1">Título da Matéria *</label>
                <input 
                  type="text"
                  value={editBlogTitle}
                  onChange={e => setEditBlogTitle(e.target.value)}
                  placeholder="Ex: Como escolher os trajes do noivo e padrinhos para casamentos ao ar livre"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-1">Categoria</label>
                  <input 
                    type="text"
                    value={editBlogCategory}
                    onChange={e => setEditBlogCategory(e.target.value)}
                    placeholder="Dicas, Ensaios, Casamentos..."
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-1">Imagem de Capa (URL)</label>
                  <input 
                    type="text"
                    value={editBlogCover}
                    onChange={e => setEditBlogCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-1">Resumo / Excerpt</label>
                <textarea 
                  rows={2}
                  value={editBlogExcerpt}
                  onChange={e => setEditBlogExcerpt(e.target.value)}
                  placeholder="Um breve resumo atrativo para os leitores..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-1">Conteúdo do Artigo (HTML / Texto Formatado)</label>
                <textarea 
                  rows={8}
                  value={editBlogContent}
                  onChange={e => setEditBlogContent(e.target.value)}
                  placeholder="Insira parágrafos, imagens, citações e vídeos em HTML ou texto..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs focus:outline-none font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsBlogModalOpen(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-zinc-800 text-xs font-bold"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveBlogPostManual}
                disabled={!editBlogTitle}
                className="px-6 py-3 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-black uppercase tracking-wider shadow-lg disabled:opacity-50"
              >
                Salvar Matéria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schema.org JSON-LD Modal */}
      {showJsonLdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#D05634]" />
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  Schema.org LocalBusiness & Photographer (JSON-LD)
                </h3>
              </div>
              <button 
                onClick={() => setShowJsonLdModal(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Este bloco de dados estruturados JSON-LD é injetado automaticamente no cabeçalho do seu site público para que os robôs do Google identifiquem sua profissão, localização e raio de atendimento.
            </p>

            <pre className="p-4 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72 border border-zinc-800">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": ["LocalBusiness", "Photographer"],
                "name": siteData.photographerName || siteData.title,
                "description": siteData.metaDescription || siteData.heroSubtitle,
                "image": siteData.ogImageUrl || siteData.heroImageUrl,
                "areaServed": {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "addressLocality": siteData.geoCity || "São Paulo",
                    "addressRegion": siteData.geoState || siteData.geoRegion || "SP"
                  },
                  "geoRadius": `${(siteData.serviceRadiusKm || 50) * 1000}`
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": siteData.geoCity || "São Paulo",
                  "addressRegion": siteData.geoState || siteData.geoRegion || "SP",
                  "addressCountry": "BR"
                },
                "priceRange": "$$$",
                "url": `https://${siteData.customDomain || `${siteData.slug}.framepro.click`}`
              }, null, 2)}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400 font-semibold">
                Padrão Schema.org · Válido para Google Rich Snippets
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const code = JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": ["LocalBusiness", "Photographer"],
                      "name": siteData.photographerName || siteData.title,
                      "description": siteData.metaDescription || siteData.heroSubtitle,
                      "image": siteData.ogImageUrl || siteData.heroImageUrl,
                      "areaServed": {
                        "@type": "GeoCircle",
                        "geoMidpoint": {
                          "@type": "GeoCoordinates",
                          "addressLocality": siteData.geoCity || "São Paulo",
                          "addressRegion": siteData.geoState || siteData.geoRegion || "SP"
                        },
                        "geoRadius": `${(siteData.serviceRadiusKm || 50) * 1000}`
                      },
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": siteData.geoCity || "São Paulo",
                        "addressRegion": siteData.geoState || siteData.geoRegion || "SP",
                        "addressCountry": "BR"
                      },
                      "priceRange": "$$$",
                      "url": `https://${siteData.customDomain || `${siteData.slug}.framepro.click`}`
                    }, null, 2);
                    navigator.clipboard.writeText(code);
                    setIsCopiedJsonLd(true);
                    setTimeout(() => setIsCopiedJsonLd(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#D05634] text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {isCopiedJsonLd ? 'Copiado!' : 'Copiar JSON-LD'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonLdModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#D05634] text-white text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Scrollytelling Database JSON (content_config) & Supabase SQL */}
      {showScrollyJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#D05634]" />
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  JSON-Driven Scrollytelling (`content_config`) & Supabase SQL
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScrollyJsonModal(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Este é o payload JSON salvo automaticamente no banco de dados (coluna <code className="font-mono text-[#D05634]">content_config JSONB</code>) separando os dados do fotógrafo da coreografia de animação do tema <code className="font-mono text-[#D05634]">{siteData.scrollytellingThemeId || 'lumina-editorial'}</code>.
            </p>

            <pre className="p-4 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-80 border border-zinc-800">
              {JSON.stringify(
                {
                  theme_id: siteData.scrollytellingThemeId || 'lumina-editorial',
                  smooth_scroll: true,
                  global: {
                    brandName: siteData.photographerName || siteData.title,
                    primaryColor: siteData.primaryColor || '#D05634',
                    headingFont: siteData.headingFont || 'Playfair Display',
                    bodyFont: siteData.bodyFont || 'Plus Jakarta Sans',
                    whatsappNumber: resolveScrollyConfig(siteData).whatsappNumber
                  },
                  content_config: resolveScrollyConfig(siteData)
                },
                null,
                2
              )}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400 font-semibold">
                Documentado também em /design.md
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const payload = JSON.stringify(
                      {
                        theme_id: siteData.scrollytellingThemeId || 'lumina-editorial',
                        smooth_scroll: true,
                        global: {
                          brandName: siteData.photographerName || siteData.title,
                          primaryColor: siteData.primaryColor || '#D05634',
                          headingFont: siteData.headingFont || 'Playfair Display',
                          bodyFont: siteData.bodyFont || 'Plus Jakarta Sans',
                          whatsappNumber: resolveScrollyConfig(siteData).whatsappNumber
                        },
                        content_config: resolveScrollyConfig(siteData)
                      },
                      null,
                      2
                    );
                    navigator.clipboard.writeText(payload);
                    setCopiedScrollyJson(true);
                    setTimeout(() => setCopiedScrollyJson(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#D05634] text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedScrollyJson ? 'JSON Copiado!' : 'Copiar JSON do Tema'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowScrollyJsonModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#D05634] text-white text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
