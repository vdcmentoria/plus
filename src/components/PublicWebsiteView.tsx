import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Instagram, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowUpRight, 
  Star, 
  BookOpen, 
  ExternalLink, 
  Play, 
  Camera, 
  Award,
  Phone,
  Mail,
  User,
  Tag,
  HelpCircle,
   Pencil,
  Sliders,
  Check
} from 'lucide-react';
import {
  ScrollytellingThemeId,
  ScrollytellingConfig,
  ScrollySectionBlock,
  resolveScrollyConfig,
  ModularScrollytellingComposer,
  BlockCustomFooterSection,
  createSectionFromTemplate,
  getSectionNavLabel,
  WhatsAppCircularIcon,
  getAssociationSealLogoUrl
} from './ScrollytellingThemes';

export interface SiteData {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  photographerName: string;
  niche: string;
  theme: 'dark' | 'light' | 'luxury' | 'cinematic' | 'modern';
  theme_id?: ScrollytellingThemeId;
  scrollytellingThemeId?: ScrollytellingThemeId;
  scrollytellingConfig?: ScrollytellingConfig;
  primaryColor: string;
  headingFont?: string;
  bodyFont?: string;
  customColors?: { bg?: string; text?: string; accent?: string };
  logoUrl?: string;
  faviconUrl?: string;
  heroStyle?: 'magic_spotlight' | 'split_showcase' | 'minimal_luxury' | 'floating_glass' | 'cinematic_video';
  navStyle?: 'floating_pill' | 'minimal_top' | 'centered_logo' | 'dark_editorial' | 'modern_split';
  navTransparency?: 'glass' | 'transparent' | 'solid';
  bioPhotoUrl?: string;
  bioText?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroVideoUrl?: string;
  heroTitleSize?: 'lg' | 'xl' | '2xl' | '3xl' | 'cinema';
  heroSubtitleSize?: 'sm' | 'base' | 'lg';
  heroOverlayOpacity?: number;
  heroButtonText?: string;
  heroButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonUrl?: string;
  customDomain?: string;
  geoCity?: string;
  geoRegion?: string;
  selectedCollectionIds?: string[];
  services?: Array<{ id: string; name: string; price: string; description: string; features: string[] }>;
  testimonials?: Array<{ id: string; clientName: string; eventType: string; comment: string; avatarUrl?: string }>;
  faqs?: Array<{ id: string; question: string; answer: string }>;
  socialLinks?: { instagram?: string; facebook?: string; whatsapp?: string; youtube?: string };
  showFloatingWhatsapp?: boolean;
  whatsappDefaultMessage?: string;
  published: boolean;
  sectionsOrder?: string[];
  sectionsVisibility?: Record<string, boolean>;
  // Gallery Section Customization Options
  galleryShape?: 'aspect-[4/3]' | 'aspect-square' | 'aspect-[3/4]' | 'aspect-[16/9]' | 'aspect-[9/16]';
  galleryColumns?: string;
  galleryTextPosition?: 'inside_overlay' | 'below_card';
  gallerySpacing?: 'gap-4' | 'gap-6' | 'gap-8' | 'gap-12';
  galleryShowButton?: boolean;
  galleryButtonText?: string;
  gallerySectionTitle?: string;
  gallerySectionSubtitle?: string;
  galleryKickerText?: string;
  galleryCardRadius?: 'rounded-3xl' | 'rounded-2xl' | 'rounded-xl' | 'rounded-none';
  galleryHoverEffect?: 'zoom' | 'lift' | 'grayscale';
  // Hero Image Re-framing & Visual Effects
  heroImageYOffset?: number; // 0% to 100% vertical object position
  heroVisualEffect?: 'none' | 'parallax' | 'ken_burns' | 'vignette' | 'glass_blur';
  sectionRevealEffect?: 'fade_up' | 'zoom_in' | 'slide_left' | 'none';
  // Bio Video & Association Seals / Achievements
  bioVideoUrl?: string;
  bioVideoMode?: 'inline' | 'modal';
  associationSeals?: Array<{ id: string; name: string; badgeText?: string; iconUrl?: string }>;
  achievementBadges?: Array<{ id: string; title: string; subtitle: string; category?: string }>;
  customNavLabels?: Record<string, string>;
  // SEO & GEO Advanced Controls
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  geoState?: string;
  geoAddress?: string;
  geoNeighborhood?: string;
  serviceRadiusKm?: number;
  googleBusinessUrl?: string;
  googleMapsEmbedUrl?: string;
  schemaOrgEnabled?: boolean;
  ogImageUrl?: string;
  canonicalUrl?: string;
  googleSearchConsoleTag?: string;
  autoAltTagsEnabled?: boolean;
  domainStatus?: 'not_connected' | 'propagating' | 'connected';
  domainLastCheckedAt?: string;
  facebookPixelId?: string;
  // Header & Menu Customization
  logoHeight?: number;
  navBgColor?: string;
  navBorderColor?: string;
  navTextColor?: string;
  navActiveTextColor?: string;
  navCtaBgColor?: string;
  navCtaTextColor?: string;
  navFontFamily?: string;
  navFontSize?: string;
  navFontWeight?: string;
  navTextTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
  navLetterSpacing?: 'normal' | 'wide' | 'widest';
  navCustomOpacity?: number;
  // User Saved Custom Themes (Layout-only, isolated from texts/links/media)
  savedCustomThemes?: SavedLayoutTheme[];
}

export interface SavedSectionLayout {
  id?: string;
  type: ScrollySectionBlock['type'];
  sourceThemeName?: string;
  visible: boolean;
  hideFromNav?: boolean;
  headingFont?: string;
  bodyFont?: string;
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  galleryStyle?: ScrollySectionBlock['galleryStyle'];
  galleryAspect?: ScrollySectionBlock['galleryAspect'];
  portalShape?: ScrollySectionBlock['portalShape'];
  testimonialStyle?: ScrollySectionBlock['testimonialStyle'];
  instagramStyle?: ScrollySectionBlock['instagramStyle'];
  footerStyle?: ScrollySectionBlock['footerStyle'];
  footerEffect?: ScrollySectionBlock['footerEffect'];
  footerPaddingSize?: ScrollySectionBlock['footerPaddingSize'];
  footerLayout?: ScrollySectionBlock['footerLayout'];
  footerTextAlign?: ScrollySectionBlock['footerTextAlign'];
  footerSocialPosition?: ScrollySectionBlock['footerSocialPosition'];
  footerBottomLayout?: ScrollySectionBlock['footerBottomLayout'];
  showFooterKicker?: boolean;
  showFooterTitle?: boolean;
  showFooterSubtitle?: boolean;
  showFooterCopyright?: boolean;
  showFooterCredits?: boolean;
  showBackToTop?: boolean;
  showFooterSocials?: boolean;
  showAssociationSeals?: boolean;
  titleSize?: ScrollySectionBlock['titleSize'];
  subtitleSize?: ScrollySectionBlock['subtitleSize'];
  overlayOpacity?: number;
  visualEffect?: ScrollySectionBlock['visualEffect'];
  navStyle?: ScrollySectionBlock['navStyle'];
  navTransparency?: ScrollySectionBlock['navTransparency'];
  showButton?: boolean;
  curtainSpeed?: ScrollySectionBlock['curtainSpeed'];
  marqueeOpacity?: number;
  doorBorderColor?: string;
  shutterBlades?: ScrollySectionBlock['shutterBlades'];
  initialAperture?: ScrollySectionBlock['initialAperture'];
  showFStopMarks?: boolean;
  shutterRotationDeg?: number;
  initialMaskWidth?: number;
  maskBorderRadius?: ScrollySectionBlock['maskBorderRadius'];
  perspectiveTiltDeg?: number;
  perspectiveDepth?: number;
  darkroomBath?: ScrollySectionBlock['darkroomBath'];
  darkroomRevealThreshold?: number;
  chemicalGrainIntensity?: number;
  bentoInitialZoom?: number;
  bentoGridGap?: ScrollySectionBlock['bentoGridGap'];
  storyTextSide?: ScrollySectionBlock['storyTextSide'];
  storyParallaxSpeed?: ScrollySectionBlock['storyParallaxSpeed'];
  stackSpacingPx?: number;
  stackScaleStep?: number;
  wordGlowColor?: string;
  showFloatingSidePhotos?: boolean;
  sliderHandleIcon?: ScrollySectionBlock['sliderHandleIcon'];
}

export interface SavedLayoutTheme {
  id: string;
  name: string;
  createdAt: string;
  baseThemeId?: ScrollytellingThemeId;
  theme?: SiteData['theme'];
  primaryColor?: string;
  headingFont?: string;
  bodyFont?: string;
  customColors?: { bg?: string; text?: string; accent?: string };
  navStyle?: SiteData['navStyle'];
  navTransparency?: SiteData['navTransparency'];
  galleryShape?: SiteData['galleryShape'];
  galleryColumns?: string;
  galleryTextPosition?: SiteData['galleryTextPosition'];
  gallerySpacing?: SiteData['gallerySpacing'];
  galleryCardRadius?: SiteData['galleryCardRadius'];
  galleryHoverEffect?: SiteData['galleryHoverEffect'];
  footerDeleted?: boolean;
  sectionsLayout: SavedSectionLayout[];
}

export interface BlogPost {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  geoCity?: string;
  coverImage?: string;
  category: string;
  readTime: string;
  createdAt: string;
  published: boolean;
}

function SectionWrapper({
  sectionId,
  isEditorPreview,
  onSelectSection,
  children
}: {
  sectionId: string;
  title?: string;
  isEditorPreview?: boolean;
  activeSection?: string;
  onSelectSection?: (id: string) => void;
  children: React.ReactNode;
}) {
  if (!isEditorPreview) return <>{children}</>;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectSection) onSelectSection(sectionId);
      }}
      className="relative cursor-pointer transition-all duration-200"
    >
      {children}
    </div>
  );
}

export function PublicWebsiteView({ 
  site: initialSite, 
  siteSlug,
  collections = [],
  isEditorPreview = false,
  activeSection,
  onSelectSection,
  onUpdateSite
}: { 
  site?: SiteData; 
  siteSlug?: string;
  collections?: any[];
  isEditorPreview?: boolean;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  onUpdateSite?: (updated: Partial<SiteData>) => void;
}) {
  const [site, setSite] = useState<SiteData | null>(initialSite || null);
  const [loadingSite, setLoadingSite] = useState<boolean>(!initialSite);
  const [activeNav, setActiveNav] = useState<'home' | 'portfolio' | 'galerias' | 'sobre' | 'servicos' | 'blog' | 'contato'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [internalCollections, setInternalCollections] = useState<any[]>(collections || []);

  // Apply custom favicon to browser tab when available
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const activeFavicon =
      site?.faviconUrl ||
      initialSite?.faviconUrl ||
      (typeof window !== 'undefined' ? localStorage.getItem('frame_saved_favicon_url') || '' : '');
    if (!activeFavicon) return;

    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.href = activeFavicon;
  }, [site?.faviconUrl, initialSite?.faviconUrl]);

  useEffect(() => {
    let isMounted = true;
    if (collections && collections.length > 0) {
      setInternalCollections(collections);
    }
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/collections');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setInternalCollections((prev) => {
              const map = new Map<string, any>();
              for (const item of prev || []) {
                if (item?.id) map.set(item.id.toString(), item);
              }
              for (const item of data) {
                if (item?.id) map.set(item.id.toString(), item);
              }
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('Error fetching collections for PublicWebsiteView:', err);
      }
    };
    fetchCollections();
    return () => {
      isMounted = false;
    };
  }, [collections]);
  
  // Hero Image Re-framing State
  const [isAdjustingHeroCrop, setIsAdjustingHeroCrop] = useState(false);
  const [tempYOffset, setTempYOffset] = useState<number>(initialSite?.heroImageYOffset ?? 50);

  // Bio Video States
  const [isPlayingInlineBioVideo, setIsPlayingInlineBioVideo] = useState(false);
  const [isBioVideoModalOpen, setIsBioVideoModalOpen] = useState(false);

  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  useEffect(() => {
    if (initialSite?.heroImageYOffset !== undefined) {
      setTempYOffset(initialSite.heroImageYOffset);
    }
  }, [initialSite?.heroImageYOffset]);
  
  // GorilaForms State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEventType, setFormEventType] = useState('Casamento');
  const [formEventDate, setFormEventDate] = useState('');
  const [formBudget, setFormBudget] = useState('R$ 3.000 - R$ 6.000');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (initialSite) {
      setSite(initialSite);
      setLoadingSite(false);
      if (initialSite.niche) setFormEventType(initialSite.niche);
      return;
    }

    const fetchSite = async () => {
      try {
        setLoadingSite(true);
        const targetSlug = siteSlug || new URLSearchParams(window.location.search).get('site') || '';
        const hostDomain = window.location.hostname;
        
        const res = await fetch(`/api/sites/lookup?slug=${encodeURIComponent(targetSlug)}&domain=${encodeURIComponent(hostDomain)}`);
        if (res.ok) {
          const data = await res.json();
          setSite(data);
          if (data.niche) setFormEventType(data.niche);
        } else {
          const resAll = await fetch('/api/sites');
          if (resAll.ok) {
            const all = await resAll.json();
            if (all.length > 0) {
              setSite(all[0]);
              if (all[0].niche) setFormEventType(all[0].niche);
            }
          }
        }
      } catch (err) {
        console.error('Error loading site:', err);
      } finally {
        setLoadingSite(false);
      }
    };

    fetchSite();
  }, [initialSite, siteSlug]);

  useEffect(() => {
    if (!site) return;
    const headingFont = site.headingFont || 'Outfit';
    const bodyFont = site.bodyFont || 'Plus Jakarta Sans';
    const fontFamilies = Array.from(new Set([headingFont, bodyFont]));
    const fontQuery = fontFamilies.map(f => `family=${f.replace(/ /g, '+')}:wght@400;600;700;900`).join('&');
    
    const linkId = 'site-google-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
  }, [site?.headingFont, site?.bodyFont]);

  useEffect(() => {
    if (!site) return;
    if (site.customCss) {
      const styleTag = document.createElement('style');
      styleTag.id = 'site-custom-css';
      styleTag.innerHTML = site.customCss;
      document.head.appendChild(styleTag);
      return () => {
        const el = document.getElementById('site-custom-css');
        if (el) el.remove();
      };
    }
  }, [site?.customCss]);

  useEffect(() => {
    if (!site) return;
    
    if (site.metaTitle || site.title) {
      document.title = site.metaTitle || `${site.title} | ${site.niche || 'Fotografia'}${site.geoCity ? ` em ${site.geoCity}` : ''}`;
    }

    if (site.schemaOrgEnabled !== false) {
      const scriptId = 'site-schema-org-jsonld';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Photographer",
        "name": site.photographerName || site.title,
        "description": site.metaDescription || site.heroSubtitle,
        "image": site.ogImageUrl || site.heroImageUrl,
        "telephone": site.socialLinks?.whatsapp || "",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": site.geoCity || "Brasil",
          "addressRegion": site.geoState || "BR",
          "streetAddress": site.geoAddress || site.geoNeighborhood || ""
        },
        "areaServed": site.serviceRadiusKm ? `${site.serviceRadiusKm} km ao redor de ${site.geoCity || 'sua região'}` : (site.geoCity || "Brasil")
      };
      script.text = JSON.stringify(schemaData);
    }
  }, [site?.metaTitle, site?.title, site?.geoCity, site?.geoState, site?.geoAddress, site?.geoNeighborhood, site?.schemaOrgEnabled, site?.ogImageUrl, site?.heroImageUrl, site?.photographerName, site?.heroSubtitle]);

  // Meta Pixel (Facebook Pixel) injection and PageView tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pixelId = (site?.facebookPixelId || '').trim();
    if (!pixelId) return;

    if ((window as any).__fb_pixel_loaded === pixelId) return;

    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if ((window as any).fbq) {
      (window as any).fbq('init', pixelId);
      (window as any).fbq('track', 'PageView');
      (window as any).__fb_pixel_loaded = pixelId;
    }
  }, [site?.facebookPixelId]);

  useEffect(() => {
    if (!site?.id) return;
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/sites/${site.id}/blogs`);
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data.filter((b: BlogPost) => b.published));
        }
      } catch (err) {
        console.error("Error loading blog posts:", err);
      }
    };
    fetchBlogs();
  }, [site?.id]);

  if (loadingSite) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D05634] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide text-zinc-400">Carregando website do fotógrafo...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8 text-center">
        <div>
          <Globe className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Website não encontrado</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">O site informado não existe ou o domínio ainda não foi configurado.</p>
          <button onClick={() => window.location.href = '/?app=1'} className="px-6 py-3 bg-[#D05634] text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-[#b84a2b] transition-colors cursor-pointer">
            Voltar para o Frame+
          </button>
        </div>
      </div>
    );
  }

  const activeCollectionsList = (internalCollections.length > 0 ? internalCollections : collections).filter(
    (c: any) =>
      c &&
      c.type !== 'folder' &&
      (!site.ownerId || !c.ownerId || c.ownerId === 'default' || c.ownerId === site.ownerId)
  );
  const filteredGalleries = activeCollectionsList.filter(
    (c: any) => c.status !== 'Privado' && c.status !== 'Privada' && c.status !== 'Oculto'
  );
  const selectedFiltered =
    site.selectedCollectionIds && site.selectedCollectionIds.length > 0
      ? filteredGalleries.filter((c: any) => site.selectedCollectionIds?.includes(String(c.id)))
      : filteredGalleries;
  const portfolioGalleries = selectedFiltered.length > 0
    ? selectedFiltered
    : (filteredGalleries.length > 0 ? filteredGalleries : activeCollectionsList);

  const themeClasses = {
    dark: 'bg-zinc-950 text-zinc-100',
    light: 'bg-stone-50 text-stone-900',
    luxury: 'bg-[#0f0d0c] text-amber-50',
    cinematic: 'bg-black text-white',
    modern: 'bg-slate-900 text-slate-100'
  }[site.theme || 'dark'];

  const accentColor = site.customColors?.accent || site.primaryColor || '#D05634';
  const headingStyle = site.headingFont ? { fontFamily: `'${site.headingFont}', sans-serif` } : {};
  const bodyStyle = site.bodyFont ? { fontFamily: `'${site.bodyFont}', sans-serif` } : {};

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const response = await fetch(`/api/sites/${site.id}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          eventType: formEventType,
          eventDate: formEventDate,
          budget: formBudget,
          message: formMessage,
          submittedAt: new Date().toISOString()
        })
      });
      if (response.ok) {
        setFormSubmitted(true);
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: formEventType || 'GorilaForms Lead',
            currency: 'BRL'
          });
        }
      }
    } catch (err) {
      console.error("Error submitting lead form:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const isVisible = (secId: string) => site.sectionsVisibility?.[secId] !== false;

  // Selected Header Nav Style
  const navStyle = site.navStyle || 'floating_pill';

  const effectiveLogoUrl =
    site.logoUrl ||
    site.scrollytellingConfig?.sections?.[0]?.logoUrl ||
    (typeof window !== 'undefined' ? localStorage.getItem('frame_saved_logo_url') || '' : '');

  const logoH = site.logoHeight || 40;

  // Brand Logo or Name Renderer
  const renderBrand = () => (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      onClick={(e) => {
        setActiveNav('home');
        setSelectedPost(null);
        if (onSelectSection) {
          e.stopPropagation();
          const heroSecId = site.scrollytellingConfig?.sections?.[0]?.id || 'hero';
          onSelectSection(heroSecId);
        }
      }}
    >
      {effectiveLogoUrl ? (
        <img 
          src={effectiveLogoUrl} 
          alt={site.photographerName || 'Logo'} 
          className="w-auto object-contain transition-transform hover:scale-105" 
          style={{ height: `${logoH}px`, maxHeight: '120px' }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6" style={{ color: accentColor }} />
          <span className="font-black text-base md:text-lg tracking-wider uppercase text-white" style={headingStyle}>
            {site.photographerName || site.title || 'Seu Nome'}
          </span>
        </div>
      )}
    </div>
  );

  const resolvedScrolly = resolveScrollyConfig(site);
  const allScrollySections = resolvedScrolly.sections || [];
  const navMenuSections = allScrollySections
    .map((sec, idx) => {
      const customLabel = site.customNavLabels?.[sec.id] || sec.navLabel;
      return { 
        sec, 
        idx, 
        label: customLabel && customLabel.trim().length > 0 ? customLabel.trim() : getSectionNavLabel(sec, idx) 
      };
    })
    .filter((item) => item.sec.visible !== false && !item.sec.hideFromNav);

  const handleNavSectionClick = (secId: string, idx: number) => {
    setActiveNav('home');
    setSelectedPost(null);
    setIsMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection(secId);
    }
    setTimeout(() => {
      const el = document.getElementById(`scrolly-sec-${secId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (idx === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 30);
  };

  // Dynamic Navigation Header Custom Styles
  const navFontFamilyStyle = site.navFontFamily ? { fontFamily: `'${site.navFontFamily}', sans-serif` } : {};
  const navFontSizeStyle = site.navFontSize ? `${site.navFontSize}px` : undefined;
  const navFontWeightStyle = site.navFontWeight || undefined;
  const navTextTransformClass = 
    site.navTextTransform === 'lowercase' ? 'lowercase' :
    site.navTextTransform === 'capitalize' ? 'capitalize' :
    site.navTextTransform === 'none' ? 'normal-case' : 'uppercase';
  const navLetterSpacingClass = 
    site.navLetterSpacing === 'normal' ? 'tracking-normal' :
    site.navLetterSpacing === 'wide' ? 'tracking-wide' : 'tracking-widest';

  const getHeaderStyle = (): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
      ...navFontFamilyStyle
    };
    if (site.navTransparency === 'transparent') {
      styleObj.backgroundColor = site.navBgColor || 'rgba(0,0,0,0.35)';
      styleObj.borderColor = site.navBorderColor || 'rgba(255,255,255,0.1)';
    } else if (site.navTransparency === 'solid') {
      styleObj.backgroundColor = site.navBgColor || '#09090b';
      styleObj.borderColor = site.navBorderColor || '#27272a';
    } else if (site.navTransparency === 'custom_color') {
      const op = (site.navCustomOpacity ?? 90) / 100;
      styleObj.backgroundColor = site.navBgColor || `rgba(15,15,18,${op})`;
      styleObj.borderColor = site.navBorderColor || 'rgba(255,255,255,0.15)';
      if (op < 1) styleObj.backdropFilter = 'blur(16px)';
    } else {
      // glass (default)
      const op = (site.navCustomOpacity ?? 80) / 100;
      styleObj.backgroundColor = site.navBgColor || `rgba(0,0,0,${op})`;
      styleObj.borderColor = site.navBorderColor || 'rgba(255,255,255,0.15)';
      styleObj.backdropFilter = 'blur(24px)';
    }
    return styleObj;
  };

  const getNavLinkStyle = (isActive: boolean): React.CSSProperties => {
    return {
      ...navFontFamilyStyle,
      fontSize: navFontSizeStyle,
      fontWeight: navFontWeightStyle,
      color: isActive 
        ? (site.navActiveTextColor || '#ffffff') 
        : (site.navTextColor || 'rgba(212,212,216,0.9)')
    };
  };

  const getNavCtaStyle = (): React.CSSProperties => {
    return {
      ...navFontFamilyStyle,
      fontSize: navFontSizeStyle,
      fontWeight: navFontWeightStyle || '700',
      backgroundColor: site.navCtaBgColor || accentColor,
      color: site.navCtaTextColor || '#ffffff',
      borderColor: site.navCtaBgColor || accentColor
    };
  };

  return (
    <div className={`min-h-screen selection:bg-[#D05634]/20 selection:text-[#D05634] ${themeClasses}`} style={bodyStyle}>
      
      {/* HEADER NAVIGATION (SUPPORTS 5 DISTINCT NAVBAR STYLES, LOGO SIZE, TYPOGRAPHY & COLORS) */}
      
      {/* NAV STYLE 1: Magic UI Floating Glass Header */}
      {navStyle === 'floating_pill' && (
        <div className="sticky top-4 z-50 px-4 pt-2">
          <header 
            className="max-w-5xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between transition-all border shadow-2xl"
            style={getHeaderStyle()}
          >
            {renderBrand()}

            <nav className={`hidden md:flex items-center gap-7 text-xs font-semibold ${navTextTransformClass} ${navLetterSpacingClass}`}>
              {navMenuSections.map(({ sec, idx, label }) => (
                <button
                  key={sec.id}
                  onClick={() => handleNavSectionClick(sec.id, idx)}
                  className="hover:opacity-100 transition-all cursor-pointer"
                  style={getNavLinkStyle(activeSection === sec.id)}
                >
                  {label}
                </button>
              ))}
              {blogPosts.length > 0 && (
                <button 
                  onClick={() => { setActiveNav('blog'); setSelectedPost(null); }} 
                  className="hover:opacity-100 transition-all cursor-pointer"
                  style={getNavLinkStyle(activeNav === 'blog')}
                >
                  Blog
                </button>
              )}
            </nav>

            <div className="hidden md:flex items-center">
              <button 
                onClick={() => { setActiveNav('contato'); setSelectedPost(null); }}
                className={`px-5 py-2.5 rounded-xl text-xs shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer ${navTextTransformClass} ${navLetterSpacingClass}`}
                style={getNavCtaStyle()}
              >
                <Send className="w-3.5 h-3.5" />
                {site.customNavLabels?.cta || 'Orçamento'}
              </button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-1">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>
        </div>
      )}

      {/* NAV STYLE 2: Minimalist Top Bar */}
      {navStyle === 'minimal_top' && (
        <header 
          className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b transition-all"
          style={getHeaderStyle()}
        >
          {renderBrand()}
          <nav className={`hidden md:flex items-center gap-8 text-xs font-semibold ${navTextTransformClass} ${navLetterSpacingClass}`}>
            {navMenuSections.map(({ sec, idx, label }) => (
              <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)} className="hover:opacity-100 transition-all cursor-pointer" style={getNavLinkStyle(activeSection === sec.id)}>
                {label}
              </button>
            ))}
            <button 
              onClick={() => { setActiveNav('contato'); setSelectedPost(null); }} 
              className={`px-4 py-2 rounded-lg text-xs transition-transform hover:scale-105 ${navTextTransformClass} ${navLetterSpacingClass}`}
              style={getNavCtaStyle()}
            >
              {site.customNavLabels?.cta || 'Contato'}
            </button>
          </nav>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* NAV STYLE 3: Centered Logo Header */}
      {navStyle === 'centered_logo' && (
        <header 
          className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b transition-all"
          style={getHeaderStyle()}
        >
          <div className={`hidden md:flex items-center gap-6 text-xs font-bold ${navTextTransformClass} ${navLetterSpacingClass}`}>
            {navMenuSections.slice(0, Math.ceil(navMenuSections.length / 2)).map(({ sec, idx, label }) => (
              <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)} className="hover:opacity-100 transition-all cursor-pointer" style={getNavLinkStyle(activeSection === sec.id)}>
                {label}
              </button>
            ))}
          </div>
          <div>{renderBrand()}</div>
          <div className={`hidden md:flex items-center gap-6 text-xs font-bold ${navTextTransformClass} ${navLetterSpacingClass}`}>
            {navMenuSections.slice(Math.ceil(navMenuSections.length / 2)).map(({ sec, idx, label }) => (
              <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)} className="hover:opacity-100 transition-all cursor-pointer" style={getNavLinkStyle(activeSection === sec.id)}>
                {label}
              </button>
            ))}
            <button 
              onClick={() => { setActiveNav('contato'); setSelectedPost(null); }} 
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all ${navTextTransformClass} ${navLetterSpacingClass}`}
              style={getNavCtaStyle()}
            >
              {site.customNavLabels?.cta || 'Contato'}
            </button>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* NAV STYLE 4: Dark Editorial Bar */}
      {navStyle === 'dark_editorial' && (
        <header 
          className="sticky top-0 z-50 px-8 py-5 flex items-center justify-between border-b transition-all"
          style={getHeaderStyle()}
        >
          {renderBrand()}
          <nav className={`hidden md:flex items-center gap-10 text-xs font-black ${navTextTransformClass} ${navLetterSpacingClass}`}>
            {navMenuSections.map(({ sec, idx, label }) => (
              <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)} className="hover:opacity-100 transition-all cursor-pointer" style={getNavLinkStyle(activeSection === sec.id)}>
                {label}
              </button>
            ))}
            <button 
              onClick={() => { setActiveNav('contato'); setSelectedPost(null); }} 
              className={`px-5 py-2.5 rounded-full text-xs shadow-lg transition-transform hover:scale-105 ${navTextTransformClass} ${navLetterSpacingClass}`}
              style={getNavCtaStyle()}
            >
              {site.customNavLabels?.cta || 'Agendar'}
            </button>
          </nav>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* NAV STYLE 5: Modern Split Header */}
      {navStyle === 'modern_split' && (
        <header 
          className="sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between border-b transition-all"
          style={getHeaderStyle()}
        >
          {renderBrand()}
          <nav className={`hidden md:flex items-center gap-6 text-xs font-bold ${navTextTransformClass} ${navLetterSpacingClass}`}>
            {navMenuSections.map(({ sec, idx, label }) => (
              <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)} className="hover:opacity-100 transition-all cursor-pointer" style={getNavLinkStyle(activeSection === sec.id)}>
                {label}
              </button>
            ))}
          </nav>
          <button 
            onClick={() => { setActiveNav('contato'); setSelectedPost(null); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${navTextTransformClass} ${navLetterSpacingClass}`}
            style={getNavCtaStyle()}
          >
            <Send className="w-3.5 h-3.5" />
            {site.customNavLabels?.cta || 'WhatsApp / Contato'}
          </button>
        </header>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col p-8 pt-24 gap-6 text-sm font-bold uppercase tracking-widest text-white">
          {navMenuSections.map(({ sec, idx, label }) => (
            <button key={sec.id} onClick={() => handleNavSectionClick(sec.id, idx)}>
              {label}
            </button>
          ))}
          <button onClick={() => { setActiveNav('contato'); setIsMobileMenuOpen(false); }} style={{ color: accentColor }}>
            {site.customNavLabels?.cta || 'Solicitar Orçamento'}
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="min-h-[80vh]">
        {selectedPost ? (
          <article className="max-w-4xl mx-auto px-6 py-16 animate-in fade-in duration-300">
            <button 
              onClick={() => setSelectedPost(null)}
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white mb-8 flex items-center gap-2"
            >
              ← Voltar para o Blog
            </button>
            {selectedPost.coverImage && (
              <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
                <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight" style={headingStyle}>
              {selectedPost.title}
            </h1>
            <p className="text-lg text-zinc-300 mb-10 leading-relaxed font-light border-l-2 pl-4 italic" style={{ borderColor: accentColor }}>
              {selectedPost.excerpt}
            </p>
            <div 
              className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </article>
        ) : activeNav === 'home' && (site.scrollytellingThemeId || site.theme_id) && (site.scrollytellingThemeId || site.theme_id) !== 'classic' ? (
          <div>
            <ModularScrollytellingComposer
              site={site}
              config={resolveScrollyConfig(site)}
              collections={portfolioGalleries}
              onOpenGallery={(col) => {
                const gSlug = (col.slug || col.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                window.location.href = `/?gallery=${encodeURIComponent(gSlug)}`;
              }}
              onNavigateSection={(sec) => setActiveNav(sec as any)}
              onSelectSection={isEditorPreview ? onSelectSection : undefined}
              selectedSectionId={activeSection}
            />
          </div>
        ) : (
          <>
            {/* HERO BANNER SECTION (SUPPORTS 5 MAGIC UI HERO STYLES) */}
            {isVisible('hero') && (activeNav === 'home') && (
              <SectionWrapper sectionId="hero" title="Banner Principal (Hero)" isEditorPreview={isEditorPreview} activeSection={activeSection} onSelectSection={onSelectSection}>
                
                {/* Editor-Only Small Reajustar Imagem Button (Top Left) */}
                {isEditorPreview && (
                  <div className="absolute top-3 left-3 z-40 flex flex-col items-start gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAdjustingHeroCrop(!isAdjustingHeroCrop);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black/90 hover:bg-[#D05634] text-white border border-white/20 text-[11px] font-bold shadow-2xl flex items-center gap-1.5 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-300" />
                      <span>Reajustar Imagem</span>
                    </button>

                    {isAdjustingHeroCrop && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="p-3.5 bg-black/95 backdrop-blur-xl rounded-xl border border-white/20 text-white space-y-2.5 shadow-2xl animate-in zoom-in-95 duration-200 min-w-[210px]"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                          <span>REENQUADRAMENTO VERTICAL</span>
                          <span className="text-amber-400 font-bold">{tempYOffset}%</span>
                        </div>

                        <input 
                          type="range"
                          min={0}
                          max={100}
                          value={tempYOffset}
                          onChange={(e) => setTempYOffset(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D05634]"
                        />

                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <button 
                            type="button" 
                            onClick={() => setTempYOffset(prev => Math.max(0, prev - 10))}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-white"
                          >
                            ▲ Cima
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setTempYOffset(prev => Math.min(100, prev + 10))}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-white"
                          >
                            ▼ Baixo
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => {
                            const newY = tempYOffset;
                            if (site) setSite({ ...site, heroImageYOffset: newY });
                            if (onUpdateSite) onUpdateSite({ heroImageYOffset: newY });
                            setIsAdjustingHeroCrop(false);
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#D05634] hover:bg-[#b84a2b] text-white text-[11px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1 mt-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Salvar Posição</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* HERO STYLE 1: Magic UI Spotlight & Animated Glow (DEFAULT HIGH-IMPACT) */}
                {(!site.heroStyle || site.heroStyle === 'magic_spotlight') && (
                  <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6 py-20 bg-zinc-950">
                    {/* Radial Spotlight Glow Background */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-zinc-950/80 to-zinc-950" />
                    
                    {site.heroImageUrl && (
                      <div className={`absolute inset-0 z-0 opacity-30 mix-blend-overlay ${site.heroVisualEffect === 'vignette' ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]' : ''}`}>
                        <img 
                          src={site.heroImageUrl} 
                          alt={site.title} 
                          className={`w-full h-full object-cover filter contrast-125 ${site.heroVisualEffect === 'ken_burns' ? 'animate-ken-burns' : ''}`}
                          style={{ objectPosition: `center ${isAdjustingHeroCrop ? tempYOffset : (site.heroImageYOffset ?? 50)}%` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
                      
                      {/* Unslop Editorial Metadata Kicker */}
                      <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        <span>{site.niche || 'Fotografia Editorial'}</span>
                        {site.geoCity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{site.geoCity}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{site.photographerName || 'Frame+ Pro'}</span>
                      </div>

                      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-none uppercase drop-shadow-2xl bg-clip-text max-w-4xl mx-auto" style={{ ...headingStyle, textWrap: 'balance' }}>
                        {site.heroTitle || site.title}
                      </h1>

                      <p className="text-base md:text-2xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
                        {site.heroSubtitle || "Fotografia e registros visuais atemporais. Histórias contadas com alma, sensibilidade e luz natural."}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button 
                          onClick={() => setActiveNav('contato')}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:opacity-95 active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: accentColor }}
                        >
                          <span>Solicitar Orçamento</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setActiveNav('portfolio')}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          Explorar Portfólio
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* HERO STYLE 2: Split Screen Editorial Showcase */}
                {site.heroStyle === 'split_showcase' && (
                  <section className="relative min-h-[85vh] flex items-center px-8 py-20 bg-zinc-950">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6 text-left">
                        <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-400 uppercase">
                          <span>{site.photographerName}</span>
                          {site.geoCity && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{site.geoCity}</span>
                            </>
                          )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight uppercase" style={{ ...headingStyle, textWrap: 'balance' }}>
                          {site.heroTitle}
                        </h1>
                        <p className="text-lg text-zinc-300 font-light leading-relaxed">
                          {site.heroSubtitle}
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                          <button 
                            onClick={() => setActiveNav('contato')}
                            className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:opacity-95 transition-all"
                            style={{ backgroundColor: accentColor }}
                          >
                            Solicitar Orçamento
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
                        <img 
                          src={site.heroImageUrl} 
                          alt={site.title} 
                          className={`w-full h-full object-cover ${site.heroVisualEffect === 'ken_burns' ? 'animate-ken-burns' : ''}`}
                          style={{ objectPosition: `center ${isAdjustingHeroCrop ? tempYOffset : (site.heroImageYOffset ?? 50)}%` }}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* HERO STYLE 3: Minimalist Centered Luxury */}
                {site.heroStyle === 'minimal_luxury' && (
                  <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 bg-[#0a0a0a] text-amber-50 text-center overflow-hidden">
                    {site.heroImageUrl && (
                      <div className="absolute inset-0 z-0 opacity-20">
                        <img 
                          src={site.heroImageUrl} 
                          alt={site.title} 
                          className={`w-full h-full object-cover ${site.heroVisualEffect === 'ken_burns' ? 'animate-ken-burns' : ''}`}
                          style={{ objectPosition: `center ${isAdjustingHeroCrop ? tempYOffset : (site.heroImageYOffset ?? 50)}%` }}
                        />
                      </div>
                    )}
                    <div className="relative z-10 max-w-4xl space-y-8">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-400/90">Estúdio & Fotografia</p>
                      <h1 className="text-4xl md:text-7xl font-serif font-light tracking-tight text-white leading-tight" style={{ ...headingStyle, textWrap: 'balance' }}>
                        {site.heroTitle}
                      </h1>
                      <div className="w-12 h-px bg-amber-500/50 mx-auto" />
                      <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto font-serif italic">
                        {site.heroSubtitle}
                      </p>
                      <button 
                        onClick={() => setActiveNav('contato')}
                        className="px-8 py-3.5 rounded-xl border border-amber-500/40 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Verificar Disponibilidade
                      </button>
                    </div>
                  </section>
                )}

                {/* HERO STYLE 4: Modern Floating Glass Card */}
                {site.heroStyle === 'floating_glass' && (
                  <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-zinc-950 overflow-hidden">
                    {site.heroImageUrl && (
                      <div className="absolute inset-0 z-0 opacity-25">
                        <img 
                          src={site.heroImageUrl} 
                          alt={site.title} 
                          className={`w-full h-full object-cover ${site.heroVisualEffect === 'ken_burns' ? 'animate-ken-burns' : ''}`}
                          style={{ objectPosition: `center ${isAdjustingHeroCrop ? tempYOffset : (site.heroImageYOffset ?? 50)}%` }}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 max-w-4xl w-full backdrop-blur-2xl bg-zinc-900/80 border border-white/15 p-10 md:p-16 rounded-3xl shadow-2xl text-center space-y-8">
                      <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-zinc-400 uppercase">
                        <span>{site.niche || 'Fotografia'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{site.photographerName}</span>
                      </div>
                      <h1 className="text-3xl md:text-6xl font-extrabold text-white uppercase tracking-tight" style={{ ...headingStyle, textWrap: 'balance' }}>
                        {site.heroTitle}
                      </h1>
                      <p className="text-zinc-300 text-base md:text-xl font-light">
                        {site.heroSubtitle}
                      </p>
                      <button 
                        onClick={() => setActiveNav('contato')}
                        className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase text-white shadow-xl hover:opacity-95 transition-all"
                        style={{ backgroundColor: accentColor }}
                      >
                        Solicitar Orçamento
                      </button>
                    </div>
                  </section>
                )}

                {/* HERO STYLE 5: Cinematic Parallax Video Hero */}
                {site.heroStyle === 'cinematic_video' && (
                  <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-black text-white text-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={site.heroImageUrl} 
                        alt={site.title} 
                        className={`w-full h-full object-cover filter brightness-75 contrast-105 ${site.heroVisualEffect === 'ken_burns' ? 'animate-ken-burns' : ''}`}
                        style={{ objectPosition: `center ${isAdjustingHeroCrop ? tempYOffset : (site.heroImageYOffset ?? 50)}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
                    </div>
                    <div className="relative z-10 max-w-4xl space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto text-white shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                      <h1 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight" style={{ ...headingStyle, textWrap: 'balance' }}>
                        {site.heroTitle}
                      </h1>
                      <p className="text-zinc-300 text-lg max-w-xl mx-auto font-light">
                        {site.heroSubtitle}
                      </p>
                    </div>
                  </section>
                )}

              </SectionWrapper>
            )}

            {/* PORTFOLIO SECTION */}
            {isVisible('portfolio') && (activeNav === 'home' || activeNav === 'portfolio') && (
              <SectionWrapper sectionId="portfolio" title={site.gallerySectionTitle || "Portfólio em Destaque"} isEditorPreview={isEditorPreview} activeSection={activeSection} onSelectSection={onSelectSection}>
                <section className="max-w-7xl mx-auto px-6 py-20">
                  <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    {site.galleryKickerText !== '' && (
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                        {site.galleryKickerText || 'Galeria Visual'}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white" style={{ ...headingStyle, textWrap: 'balance' }}>
                      {site.gallerySectionTitle || 'Portfólio em Destaque'}
                    </h2>
                    {site.gallerySectionSubtitle !== '' && (
                      <p className="text-zinc-400 text-sm">
                        {site.gallerySectionSubtitle || 'Confira os últimos trabalhos, momentos espontâneos e memórias registradas.'}
                      </p>
                    )}
                  </div>

                  {portfolioGalleries.length > 0 ? (
                    <div className={`grid ${site.galleryColumns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} ${site.gallerySpacing || 'gap-8'}`}>
                      {portfolioGalleries.map((col) => {
                        const shapeClass = site.galleryShape || 'aspect-[4/3]';
                        const radiusClass = site.galleryCardRadius || 'rounded-2xl';
                        const isOverlay = site.galleryTextPosition === 'inside_overlay';
                        const showBtn = site.galleryShowButton !== false;

                        return (
                          <div 
                            key={col.id} 
                            className={`group relative ${radiusClass} overflow-hidden bg-zinc-900 border border-white/10 shadow-xl transition-all duration-300 cursor-pointer ${
                              site.galleryHoverEffect === 'lift' ? 'hover:-translate-y-2' : ''
                            }`}
                            onClick={() => window.open(`/?gallery=${col.slug || col.id}`, '_blank')}
                          >
                            <div className={`${shapeClass} overflow-hidden relative`}>
                              <img 
                                src={col.image || (col.media && col.media[0]) || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'} 
                                alt={col.title}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                  site.galleryHoverEffect === 'grayscale' 
                                    ? 'filter grayscale group-hover:grayscale-0 group-hover:scale-105' 
                                    : 'group-hover:scale-105 filter brightness-90 group-hover:brightness-100'
                                }`} 
                              />

                              {/* Overlaid Association Seals on Gallery Card */}
                              {col.associationSeals && col.associationSeals.length > 0 && (
                                <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 max-w-[70%] pointer-events-none">
                                  {col.associationSeals.map((seal: any, sIdx: number) => {
                                    const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                                    return (
                                      <div 
                                        key={seal.id || sIdx}
                                        className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-lg text-[9px] font-bold"
                                      >
                                        {resolvedLogo ? (
                                          <img src={resolvedLogo} alt={seal.name} className="w-4 h-4 rounded object-contain shrink-0" />
                                        ) : (
                                          <Award className="w-3 h-3 text-amber-400 shrink-0" />
                                        )}
                                        <span className="truncate max-w-[90px]">{seal.name}</span>
                                        {seal.badgeText && (
                                          <span className="text-[7.5px] uppercase tracking-wider text-[#FF9E80] font-extrabold truncate max-w-[60px]">
                                            · {seal.badgeText}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Inside Overlay Mode */}
                              {isOverlay ? (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 block mb-1">
                                        {col.date || 'Sessão Recente'}
                                      </span>
                                      <h3 className="text-xl font-bold text-white leading-snug" style={headingStyle}>
                                        {col.title}
                                      </h3>
                                    </div>
                                    {showBtn && (
                                      <div className="shrink-0 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/15 text-white flex items-center gap-1 group-hover:bg-[#D05634] transition-colors">
                                        <span>{site.galleryButtonText || 'Ver Galeria'}</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                showBtn && (
                                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/15 text-white flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:bg-[#D05634] transition-all">
                                    <span>{site.galleryButtonText || 'Ver Galeria'}</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </div>
                                )
                              )}
                            </div>

                            {/* Below Card Text Mode */}
                            {!isOverlay && (
                              <div className="p-5 space-y-1.5 bg-zinc-900/90">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                                  {col.date || 'Sessão Recente'}
                                </span>
                                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#D05634]" style={headingStyle}>
                                  {col.title}
                                </h3>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-6 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-3">
                      <Camera className="w-12 h-12 text-zinc-600 mx-auto" />
                      <h3 className="text-lg font-bold text-white">Portfólio em atualização</h3>
                      <p className="text-xs text-zinc-500">Selecione galerias no painel do editor para exibir aqui no seu site.</p>
                    </div>
                  )}
                </section>
              </SectionWrapper>
            )}

            {/* ABOUT / BIOGRAPHY SECTION */}
            {isVisible('about') && (activeNav === 'home' || activeNav === 'sobre') && (
              <SectionWrapper sectionId="about" title="Sobre o Estúdio & Biografia" isEditorPreview={isEditorPreview} activeSection={activeSection} onSelectSection={onSelectSection}>
                <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Bio Photo / Video Container */}
                    <div className="lg:col-span-5 relative">
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-zinc-900 group">
                        {site.bioVideoUrl && isPlayingInlineBioVideo ? (
                          <iframe 
                            src={getEmbedUrl(site.bioVideoUrl)} 
                            title="Vídeo do Fotógrafo" 
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <img 
                              src={site.bioPhotoUrl || site.heroImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"} 
                              alt={site.photographerName} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />

                            {/* Play Overlay if Video is configured */}
                            {site.bioVideoUrl && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (site.bioVideoMode === 'modal') {
                                      setIsBioVideoModalOpen(true);
                                    } else {
                                      setIsPlayingInlineBioVideo(true);
                                    }
                                  }}
                                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-[#D05634] transition-all group/play"
                                  title="Assistir Vídeo"
                                >
                                  <Play className="w-7 h-7 fill-white ml-1 group-hover/play:scale-110 transition-transform" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>A Arte por Trás das Câmeras</span>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight" style={headingStyle}>
                        {site.photographerName || site.title}
                      </h2>
                      <p className="text-zinc-300 leading-relaxed text-base font-light whitespace-pre-line">
                        {site.bioText || `Especialista em capturar emoções autênticas, registros atemporais e momentos inesquecíveis. Transformando cada olhar em memórias eternas.`}
                      </p>

                      {/* Association Seals / Member Badges (Bride, Inspiration, Fearless, ISPWP, MyWed, etc.) */}
                      {site.associationSeals && site.associationSeals.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Associações & Membrorias</span>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {site.associationSeals.map((seal) => {
                              const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                              return (
                                <div 
                                  key={seal.id}
                                  className="px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-bold text-zinc-200 flex items-center gap-2.5 shadow-sm hover:border-[#D05634]/60 transition-colors"
                                >
                                  {resolvedLogo ? (
                                    <img src={resolvedLogo} alt={seal.name} className="w-8 h-8 rounded-lg object-contain shrink-0" />
                                  ) : (
                                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                                  )}
                                  <span>{seal.name}</span>
                                  {seal.badgeText && <span className="text-[10px] font-mono text-[#D05634]">({seal.badgeText})</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Achievements & Stats Badges (Casamentos.com.br, Zankyou, Stat Counters) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                        {(site.achievementBadges && site.achievementBadges.length > 0 ? site.achievementBadges : [
                          { id: '1', title: '+500', subtitle: 'Eventos Fotografados' },
                          { id: '2', title: '100%', subtitle: 'Satisfação dos Noivos' },
                          { id: '3', title: 'Selo Gold', subtitle: 'Casamentos.com.br 2026' }
                        ]).map((ach) => (
                          <div key={ach.id} className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1 hover:border-[#D05634]/50 transition-colors">
                            <Award className="w-5 h-5 text-[#D05634]" />
                            <h4 className="text-lg font-black text-white">{ach.title}</h4>
                            <p className="text-[11px] text-zinc-400 font-medium leading-tight">{ach.subtitle}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </section>

                {/* Video Modal if bioVideoMode is 'modal' */}
                {isBioVideoModalOpen && site.bioVideoUrl && (
                  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                      <button 
                        type="button" 
                        onClick={() => setIsBioVideoModalOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/80 text-white hover:bg-[#D05634] transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <iframe 
                        src={getEmbedUrl(site.bioVideoUrl)} 
                        title="Vídeo de Apresentação" 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </SectionWrapper>
            )}

            {/* SERVICES & PACKAGES SECTION */}
            {isVisible('pricing') && site.services && site.services.length > 0 && (activeNav === 'home' || activeNav === 'servicos') && (
              <SectionWrapper sectionId="pricing" title="Pacotes & Investimento" isEditorPreview={isEditorPreview} activeSection={activeSection} onSelectSection={onSelectSection}>
                <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
                  <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>Valores & Proposta</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white" style={headingStyle}>Investimento & Pacotes</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {site.services.map((svc) => (
                      <div key={svc.id} className="bg-zinc-900/90 rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6 shadow-xl">
                        <div className="space-y-4">
                          <h3 className="text-xl font-black text-white uppercase tracking-wider">{svc.name}</h3>
                          <div className="text-3xl font-black" style={{ color: accentColor }}>{svc.price}</div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{svc.description}</p>
                          <div className="space-y-2 pt-4 border-t border-white/5">
                            {svc.features?.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => { setActiveNav('contato'); setFormEventType(svc.name); }}
                          className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg"
                          style={{ backgroundColor: accentColor }}
                        >
                          Solicitar Este Pacote
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </SectionWrapper>
            )}

            {/* GORILAFORMS CONTACT SECTION */}
            {isVisible('leads') && (activeNav === 'home' || activeNav === 'contato') && (
              <SectionWrapper sectionId="leads" title="Formulário GorilaForms" isEditorPreview={isEditorPreview} activeSection={activeSection} onSelectSection={onSelectSection}>
                <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
                  <div className="bg-gradient-to-b from-zinc-900 to-black rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl space-y-8">
                    <div className="text-center space-y-3">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>Contato & Orçamentos</span>
                      <h2 className="text-3xl md:text-5xl font-black text-white" style={headingStyle}>Verificar Disponibilidade</h2>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Preencha as informações do seu evento e entraremos em contato rapidamente.
                      </p>
                    </div>

                    {formSubmitted ? (
                      <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                        <h3 className="text-2xl font-black text-white">Solicitação Recebida!</h3>
                        <p className="text-xs text-emerald-200">Em breve retornaremos o contato por e-mail ou WhatsApp.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Nome Completo *</label>
                            <input 
                              type="text"
                              required
                              value={formName}
                              onChange={e => setFormName(e.target.value)}
                              placeholder="Digite seu nome"
                              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">E-mail *</label>
                            <input 
                              type="email"
                              required
                              value={formEmail}
                              onChange={e => setFormEmail(e.target.value)}
                              placeholder="seu@email.com"
                              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">WhatsApp / Telefone</label>
                            <input 
                              type="tel"
                              value={formPhone}
                              onChange={e => setFormPhone(e.target.value)}
                              placeholder="(00) 00000-0000"
                              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Tipo de Evento</label>
                            <select 
                              value={formEventType}
                              onChange={e => setFormEventType(e.target.value)}
                              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none"
                            >
                              <option value="Casamento">Casamento</option>
                              <option value="Pré-Wedding">Ensaio Pré-Wedding</option>
                              <option value="Ensaio de Casal">Ensaio de Casal</option>
                              <option value="Gestante & Família">Gestante & Família</option>
                              <option value="Corporativo">Corporativo / Evento</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Data Prevista</label>
                            <input 
                              type="date"
                              value={formEventDate}
                              onChange={e => setFormEventDate(e.target.value)}
                              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Sua Mensagem</label>
                          <textarea 
                            rows={3}
                            value={formMessage}
                            onChange={e => setFormMessage(e.target.value)}
                            placeholder="Conte mais sobre seu casamento, cidade ou ideias para o ensaio..."
                            className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none resize-none"
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={formSubmitting}
                          className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-2xl flex items-center justify-center gap-2"
                          style={{ backgroundColor: accentColor }}
                        >
                          {formSubmitting ? 'Enviando Mensagem...' : 'Enviar Pedido de Orçamento'}
                        </button>
                      </form>
                    )}
                  </div>
                </section>
              </SectionWrapper>
            )}
          </>
        )}
      </main>

      {/* FOOTER FOR CLASSIC THEME OR BLOG POST VIEW (SCROLLYTELLING RENDERS RODAPÉ SECTION DIRECTLY IN COMPOSER) */}
      {(selectedPost ||
        activeNav !== 'home' ||
        !(site.scrollytellingThemeId || site.theme_id) ||
        (site.scrollytellingThemeId || site.theme_id) === 'classic') && (() => {
        const footerSec =
          allScrollySections.find((s) => s.type === 'custom_footer_section') ||
          createSectionFromTemplate('custom_footer_section', site);
        if (footerSec.visible === false) return null;
        return (
          <div
            onClick={() => {
              if (isEditorPreview && onSelectSection && footerSec.id) {
                onSelectSection(footerSec.id);
              }
            }}
            className={isEditorPreview ? 'cursor-pointer relative group/footer' : 'relative'}
          >
            <BlockCustomFooterSection block={footerSec} site={site} />
          </div>
        );
      })()}

      {/* FLOATING WHATSAPP BUTTON (BOTTOM-RIGHT CORNER, TRANSPARENT VECTOR SVG WITHOUT WHITE BACKGROUND) */}
      {(site.showFloatingWhatsapp !== undefined
        ? site.showFloatingWhatsapp
        : resolvedScrolly.showFloatingWhatsapp !== false) && (() => {
        const rawWhatsapp =
          site.socialLinks?.whatsapp ||
          resolvedScrolly.whatsappNumber ||
          '5511999999999';
        const cleanWhatsapp = String(rawWhatsapp).replace(/[^0-9]/g, '') || '5511999999999';
        const customMessage =
          site.whatsappDefaultMessage ||
          resolvedScrolly.whatsappMessage ||
          `Olá ${site.photographerName || ''}! Vi seu site e gostaria de solicitar um orçamento.`;
        const waHref = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(customMessage)}`;

        return (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEditorPreview && onSelectSection) {
                const contactSec =
                  allScrollySections.find(
                    (s, i) =>
                      s.type === 'cta_zoom_whatsapp' ||
                      getSectionNavLabel(s, i).toUpperCase().includes('CONTATO')
                  ) || allScrollySections[allScrollySections.length - 1];
                if (contactSec) {
                  onSelectSection(contactSec.id);
                }
              }
            }}
            title="Falar no WhatsApp"
            aria-label="Falar no WhatsApp"
            className="fixed bottom-6 right-6 z-50 bg-transparent border-0 p-0 rounded-full drop-shadow-[0_8px_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <WhatsAppCircularIcon className="w-14 h-14 md:w-16 md:h-16 block" />
          </a>
        );
      })()}
    </div>
  );
}
