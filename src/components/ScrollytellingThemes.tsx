import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Sliders,
  Film,
  Sparkles,
  Camera,
  Play,
  Pause,
  Star,
  Instagram,
  Quote,
  ExternalLink,
  ShieldCheck,
  Award,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Globe,
  X
} from 'lucide-react';
import { InteractiveQuoteFormBox, QuoteFormConfig } from './QuoteFormBuilder';

export const OFFICIAL_ASSOCIATION_SEALS = [
  {
    id: 'inspiration',
    name: 'Inspiration Photographers',
    badgeText: 'Awarded',
    iconUrl: '/assets/aistudio/inspiration_40193d94.svg'
  },
  {
    id: 'bride',
    name: 'Bride Association',
    badgeText: 'Membro',
    iconUrl: '/assets/aistudio/bride_85fd23f6.svg'
  },
  {
    id: 'fearless',
    name: 'Fearless Photographers',
    badgeText: 'Member',
    iconUrl: '/assets/aistudio/fearless_c43f2310.svg'
  },
  {
    id: 'ispwp',
    name: 'ISPWP International',
    badgeText: 'Member',
    iconUrl: ''
  },
  {
    id: 'mywed',
    name: 'MyWed Awarded',
    badgeText: 'Award',
    iconUrl: ''
  },
  {
    id: 'fineart',
    name: 'Fine Art Wedding',
    badgeText: 'Certificado',
    iconUrl: ''
  }
];

export function getAssociationSealLogoUrl(
  nameOrId?: string,
  explicitIconUrl?: string
): string | undefined {
  if (explicitIconUrl && explicitIconUrl.trim().length > 0) {
    return explicitIconUrl;
  }
  if (!nameOrId) return undefined;
  const norm = nameOrId.toLowerCase();
  if (norm.includes('inspiration')) return '/assets/aistudio/inspiration_40193d94.svg';
  if (norm.includes('bride')) return '/assets/aistudio/bride_85fd23f6.svg';
  if (norm.includes('fearless') || norm.includes('feraless')) return '/assets/aistudio/fearless_c43f2310.svg';
  return undefined;
}

export type ScrollytellingThemeId =
  | 'classic'
  | 'lumina-editorial'
  | 'noir-cinema'
  | 'atelier-minimal'
  | 'layered-pinning'
  | 'koreo-kinetic'
  | 'prism-webgl'
  | 'analog-chronicle'
  | 'vogue-runway'
  | 'horizon-parallax';

export type ScrollySectionType =
  | 'hero_curtain_reveal'
  | 'sticky_story_split'
  | 'horizontal_filmstrip'
  | 'hero_3d_perspective'
  | 'card_stacking_album'
  | 'manifesto_word_reveal'
  | 'bento_zoom_mosaic'
  | 'before_after_grading'
  | 'floating_masonry_3col'
  | 'layered_pinning_chapters'
  | 'koreo_split_curtain'
  | 'circle_iris_portal'
  | 'darkroom_color_develop'
  | 'vogue_overlapping_spread'
  | 'interactive_gallery_showcase'
  | 'cta_zoom_whatsapp'
  | 'client_testimonials'
  | 'instagram_feed_banner'
  | 'custom_footer_section';

export type ScrollyGalleryStyle =
  | 'editorial_grid'
  | 'masonry_flow'
  | 'horizontal_lookbook'
  | 'contact_sheet_35mm'
  | 'cinema_widescreen';

export interface ScrollyPhotoItem {
  url: string;
  caption: string;
  subtitle?: string;
  category?: string;
  videoUrl?: string;
  rating?: number;
  instagramHandle?: string;
  gallerySlug?: string;
  avatarUrl?: string;
}

export interface ScrollySectionBlock {
  id: string;
  type: ScrollySectionType;
  sourceThemeName: string;
  visible: boolean;
  navLabel?: string;
  hideFromNav?: boolean;
  kicker?: string;
  title: string;
  subtitle?: string;
  bodyText?: string;
  buttonText?: string;
  headingFont?: string;
  bodyFont?: string;
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  primaryImage?: string;
  primaryVideo?: string;
  secondaryImage?: string;
  beforeImage?: string;
  afterImage?: string;
  galleryStyle?: ScrollyGalleryStyle;
  galleryAspect?: 'aspect-[3/4]' | 'aspect-[4/3]' | 'aspect-square' | 'aspect-[16/9]';
  portalShape?: 'shutter' | 'circle';
  testimonialStyle?: 'video_story_bubbles' | 'editorial_quotes_split' | 'cards_carousel' | 'grid_instagram_reviews';
  instagramStyle?: 'grid_mosaic_6col' | 'horizontal_story_strip' | 'card_featured_profile';
  footerStyle?: 'minimal_dark' | 'editorial_big_typography' | 'luxury_columns' | 'social_badges_links';
  footerEffect?:
    | 'editorial_big_typography'
    | 'marquee_kinetic'
    | 'instagram_strip'
    | 'curtain_parallax_bg'
    | 'columns_3_luxury'
    | 'minimal_bar';
  footerPaddingSize?: 'compact' | 'normal' | 'large' | 'monumental';
  footerLayout?: 'editorial_split' | 'centered_stack' | 'minimal_row' | 'columns_3';
  footerTextAlign?: 'left' | 'center' | 'right';
  footerSocialPosition?: 'top' | 'middle' | 'bottom';
  footerBottomLayout?: 'split' | 'centered' | 'reverse';
  showFooterKicker?: boolean;
  showFooterTitle?: boolean;
  showFooterSubtitle?: boolean;
  showFooterCopyright?: boolean;
  showFooterCredits?: boolean;
  footerCreditsText?: string;
  showBackToTop?: boolean;
  backToTopText?: string;
  showFooterSocials?: boolean;
  footerInstagramUrl?: string;
  footerWhatsappUrl?: string;
  footerYoutubeUrl?: string;
  footerFacebookUrl?: string;
  footerEmail?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  copyrightText?: string;
  showAssociationSeals?: boolean;
  titleSize?: 'lg' | 'xl' | '2xl' | '3xl' | 'cinema';
  subtitleSize?: 'sm' | 'base' | 'lg';
  overlayOpacity?: number;
  visualEffect?: 'none' | 'parallax' | 'ken_burns' | 'vignette' | 'particles' | 'film_grain';
  navStyle?: 'floating_pill' | 'minimal_top' | 'centered_logo' | 'dark_editorial' | 'modern_split';
  navTransparency?: 'glass' | 'transparent' | 'solid';
  showButton?: boolean;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  logoUrl?: string;
  // Parâmetros finos de cada efeito de Scrollytelling
  curtainSpeed?: 'normal' | 'fast' | 'slow';
  marqueeTopText?: string;
  marqueeBottomText?: string;
  marqueeOpacity?: number;
  doorBorderColor?: string;
  shutterBlades?: 6 | 8 | 12;
  initialAperture?: 'f1.4' | 'f2.8' | 'f5.6' | 'f8' | 'closed';
  showFStopMarks?: boolean;
  shutterRotationDeg?: number;
  initialMaskWidth?: number;
  maskBorderRadius?: 'pill' | 'curved' | 'sharp';
  scrollCueText?: string;
  perspectiveTiltDeg?: number;
  perspectiveDepth?: number;
  giantBackgroundText?: string;
  darkroomBath?: 'red_safelight' | 'amber_vintage' | 'cyanotype' | 'monochrome_cold';
  darkroomRevealThreshold?: number;
  chemicalGrainIntensity?: number;
  darkroomStageLabel?: string;
  bentoInitialZoom?: number;
  bentoGridGap?: 'gap-2' | 'gap-4' | 'gap-6';
  storyTextSide?: 'left' | 'right';
  storyParallaxSpeed?: 'subtle' | 'dynamic' | 'cinematic';
  stackSpacingPx?: number;
  stackScaleStep?: number;
  wordGlowColor?: string;
  showFloatingSidePhotos?: boolean;
  sliderHandleIcon?: 'lens' | 'arrows' | 'circle';
  beforeLabel?: string;
  afterLabel?: string;
  items?: ScrollyPhotoItem[];
}

export function getSectionNavLabel(sec: ScrollySectionBlock, idx: number): string {
  if (sec.navLabel && sec.navLabel.trim().length > 0) {
    return sec.navLabel.trim();
  }
  if (sec.type === 'custom_footer_section') return 'RODAPÉ';
  if (idx === 0) return 'INÍCIO';
  if (idx === 1) return 'PORTFÓLIO';
  if (idx === 2) return 'GALERIAS';
  if (idx === 3) return 'SOBRE';
  if (idx === 4) return 'CONTATO';
  switch (sec.type) {
    case 'interactive_gallery_showcase':
      return 'GALERIAS';
    case 'floating_masonry_3col':
    case 'horizontal_filmstrip':
    case 'card_stacking_album':
    case 'bento_zoom_mosaic':
      return 'PORTFÓLIO';
    case 'sticky_story_split':
    case 'manifesto_word_reveal':
    case 'vogue_overlapping_spread':
    case 'layered_pinning_chapters':
      return 'SOBRE';
    case 'client_testimonials':
      return 'DEPOIMENTOS';
    case 'instagram_feed_banner':
      return 'INSTAGRAM';
    case 'cta_zoom_whatsapp':
      return 'CONTATO';
    default:
      return `ABA 0${idx + 1}`;
  }
}

export interface ScrollytellingConfig {
  smoothScroll?: boolean;
  sectionsThemeId?: ScrollytellingThemeId;
  sections?: ScrollySectionBlock[];
  footerDeleted?: boolean;
  // Legacy / global fallback slots
  heroKicker?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroVideo?: string;
  storyTitle?: string;
  storyText?: string;
  storyLocation?: string;
  storyPhotos?: ScrollyPhotoItem[];
  filmstripTitle?: string;
  filmstripSubtitle?: string;
  filmstripImages?: ScrollyPhotoItem[];
  stackedProjects?: ScrollyPhotoItem[];
  manifestoText?: string;
  manifestoLeftImage?: string;
  manifestoRightImage?: string;
  bentoImages?: string[];
  beforeAfterTitle?: string;
  beforeAfterSubtitle?: string;
  beforeRawImage?: string;
  afterGradedImage?: string;
  pinnedChapters?: Array<{
    id: string;
    chapterNumber: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    videoUrl?: string;
    useBrandAccentBg?: boolean;
  }>;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaBackgroundImage?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  showFloatingWhatsapp?: boolean;
}

export function WhatsAppCircularIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <circle cx="32" cy="32" r="30" fill="#25D366" />
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.02 14.5C22.34 14.5 14.48 22.33 14.48 31.98C14.48 35.29 15.4 38.51 17.15 41.3L14.3 49.5L22.75 46.72C25.44 48.31 28.69 49.47 32.02 49.47C41.7 49.47 49.56 41.64 49.56 31.99C49.56 22.34 41.7 14.5 32.02 14.5ZM32.02 46.15C29.02 46.15 26.15 45.28 23.67 43.73L23.07 43.36L18.19 44.97L19.83 40.24L19.42 39.61C17.71 36.98 16.81 34.54 16.81 31.98C16.81 23.61 23.63 16.81 32.02 16.81C40.41 16.81 47.23 23.61 47.23 31.99C47.23 40.37 40.41 46.15 32.02 46.15ZM40.36 35.47C39.9 35.24 37.65 34.13 37.23 33.98C36.81 33.83 36.5 33.75 36.2 34.21C35.89 34.67 35.02 35.7 34.75 36.01C34.48 36.31 34.21 36.35 33.75 36.12C33.29 35.89 31.82 35.41 30.07 33.85C28.71 32.64 27.79 31.14 27.52 30.68C27.25 30.22 27.49 29.97 27.72 29.74C27.93 29.53 28.18 29.21 28.41 28.94C28.64 28.67 28.72 28.48 28.87 28.17C29.02 27.87 28.95 27.6 28.83 27.37C28.72 27.14 27.8 24.89 27.42 23.97C27.05 23.08 26.67 23.2 26.39 23.19C26.12 23.18 25.81 23.17 25.51 23.17C25.2 23.17 24.71 23.29 24.29 23.75C23.87 24.21 22.68 25.31 22.68 27.56C22.68 29.81 24.33 31.99 24.56 32.29C24.79 32.6 27.79 37.26 32.42 39.24C33.52 39.71 34.38 40 35.05 40.21C36.15 40.56 37.16 40.51 37.95 40.39C38.84 40.26 40.69 39.27 41.07 38.19C41.45 37.12 41.45 36.21 41.34 36.01C41.22 35.82 40.82 35.7 40.36 35.47Z"
      />
    </svg>
  );
}

// ============================================================================
// CATALOG OF 9 READY-TO-USE SCROLLYTELLING THEMES + CLASSIC
// ============================================================================
export const SCROLLYTELLING_THEME_CATALOG: Array<{
  id: ScrollytellingThemeId;
  name: string;
  badge: string;
  desc: string;
  defaultHeadingFont: string;
  defaultBodyFont: string;
  defaultBg: string;
  defaultText: string;
  defaultAccent: string;
  previewImage: string;
}> = [
  {
    id: 'classic',
    name: 'Layout Modular Clássico',
    badge: 'Padrão',
    desc: 'Dobras tradicionais livres (Hero, Galerias, Sobre, Pacotes & Blog)',
    defaultHeadingFont: 'Outfit',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#09090B',
    defaultText: '#FFFFFF',
    defaultAccent: '#D05634',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lumina-editorial',
    name: '1. Lumina Editorial',
    badge: 'Fine Art & Casamentos',
    desc: 'Cortina Mask Reveal + Story Split Fixo + Filme Horizontal (01/06) + CTA Zoom',
    defaultHeadingFont: 'Playfair Display',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#F7F4EF',
    defaultText: '#141413',
    defaultAccent: '#D05634',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'noir-cinema',
    name: '2. Noir Cinema',
    badge: 'Retratos & Filmmakers',
    desc: 'Hero 3D Perspective + Álbum Folheado em Camadas (4 Cards) + Manifesto no Scroll',
    defaultHeadingFont: 'Cinzel',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#050505',
    defaultText: '#FFFFFF',
    defaultAccent: '#C5A059',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'atelier-minimal',
    name: '3. Atelier Minimal',
    badge: 'Bento Zoom & Color Grading',
    desc: 'Mosaico Apple Zoom-Out 3x3 + Comparador RAW vs Editada no Scroll + Masonry 3 Colunas',
    defaultHeadingFont: 'Outfit',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#FAFAFA',
    defaultText: '#111111',
    defaultAccent: '#D05634',
    previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'layered-pinning',
    name: '4. Layered Pinning Studio',
    badge: 'Basement @bsmnt',
    desc: 'Capítulos 100vh empilhados no topo alternando fundo escuro e cor da marca',
    defaultHeadingFont: 'Bricolage Grotesque',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#0B0B0B',
    defaultText: '#FFFFFF',
    defaultAccent: '#D05634',
    previewImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'koreo-kinetic',
    name: '5. Koreo Kinetic',
    badge: 'Cortina Dupla & Cinético',
    desc: 'Cortina Dupla Bipartida no Scroll + Tipografia Cinética + Cascata Masonry',
    defaultHeadingFont: 'Bricolage Grotesque',
    defaultBodyFont: 'DM Sans',
    defaultBg: '#09090B',
    defaultText: '#FAFAFA',
    defaultAccent: '#E11D48',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prism-webgl',
    name: '6. Prism 3D Depth',
    badge: 'Portal Íris & Profundidade',
    desc: 'Hero 3D Perspective + Portal Circular Íris Expand + Álbum Empilhado',
    defaultHeadingFont: 'Outfit',
    defaultBodyFont: 'Manrope',
    defaultBg: '#07090E',
    defaultText: '#F8FAFC',
    defaultAccent: '#38BDF8',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'analog-chronicle',
    name: '7. Analog Chronicle 35mm',
    badge: 'Documental & Filme 35mm',
    desc: 'Revelação Câmara Escura no Scroll + Rolo 35mm Horizontal + Folha de Contato',
    defaultHeadingFont: 'Playfair Display',
    defaultBodyFont: 'Lora',
    defaultBg: '#12100E',
    defaultText: '#F5EFE6',
    defaultAccent: '#D97706',
    previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vogue-runway',
    name: '8. Vogue Runway Editorial',
    badge: 'Alta Moda & Revista',
    desc: 'Página Dupla Assimétrica Vogue + Color Grading no Scroll + Lookbook Horizontal',
    defaultHeadingFont: 'Playfair Display',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#FFFFFF',
    defaultText: '#0A0A0A',
    defaultAccent: '#111111',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'horizon-parallax',
    name: '9. Horizon Deep Parallax',
    badge: 'Destination & Natureza',
    desc: 'Portal Circular Íris + Story Split Fixo + Mosaico Bento + Galeria Cinema 16:9',
    defaultHeadingFont: 'Cinzel',
    defaultBodyFont: 'Plus Jakarta Sans',
    defaultBg: '#F4F1EA',
    defaultText: '#1C1917',
    defaultAccent: '#0D9488',
    previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
  }
];

// ============================================================================
// LIBRARY OF COMBINABLE SCROLLYTELLING SECTIONS (MIX & MATCH ACROSS THEMES)
// ============================================================================
export const SCROLLY_SECTION_LIBRARY: Array<{
  type: ScrollySectionType;
  label: string;
  originTheme: string;
  desc: string;
}> = [
  {
    type: 'hero_curtain_reveal',
    label: 'Abertura Cortina (Mask Reveal)',
    originTheme: 'Lumina Editorial',
    desc: 'Moldura central que abre até 100vw x 100vh conforme o scroll'
  },
  {
    type: 'sticky_story_split',
    label: 'História Fixa + 4 Fotos Parallax',
    originTheme: 'Lumina Editorial',
    desc: 'Texto poético fixo à esquerda com 4 fotos subindo em velocidades diferentes'
  },
  {
    type: 'horizontal_filmstrip',
    label: 'Galeria Filme Horizontal (Pinning 01/06)',
    originTheme: 'Lumina Editorial',
    desc: 'Tela trava na vertical enquanto 6 fotos correm da direita para a esquerda'
  },
  {
    type: 'hero_3d_perspective',
    label: 'Hero Perspectiva 3D + Texto Gigante',
    originTheme: 'Noir Cinema',
    desc: 'Foto/vídeo inclinado em 3D que se alinha no scroll sobre tipografia gigante'
  },
  {
    type: 'card_stacking_album',
    label: 'Álbum Folheado em Camadas (4 Cards 100vh)',
    originTheme: 'Noir Cinema',
    desc: '4 projetos em tela cheia que empilham um sobre o outro durante a rolagem'
  },
  {
    type: 'manifesto_word_reveal',
    label: 'Manifesto Iluminado Palavra por Palavra',
    originTheme: 'Noir Cinema',
    desc: 'Frase de impacto que acende palavra por palavra com fotos laterais flutuantes'
  },
  {
    type: 'bento_zoom_mosaic',
    label: 'Mosaico Bento Grid Zoom-Out (Efeito Apple)',
    originTheme: 'Atelier Minimal',
    desc: 'Começa com zoom 3.15x na foto central e revela um grid de 7 fotos'
  },
  {
    type: 'before_after_grading',
    label: 'Antes & Depois (Color Grading no Scroll)',
    originTheme: 'Atelier Minimal',
    desc: 'Linha divisória entre foto RAW P&B e foto Editada controlada pelo scroll'
  },
  {
    type: 'floating_masonry_3col',
    label: 'Masonry 3 Colunas em Parallax Contínuo',
    originTheme: 'Atelier Minimal',
    desc: 'Colunas laterais e central sobem em velocidades opostas'
  },
  {
    type: 'layered_pinning_chapters',
    label: 'Capítulos Empilhados (@bsmnt Pinning)',
    originTheme: 'Layered Pinning Studio',
    desc: 'Capítulos de 100vh travados no topo alternando cor da marca e fotos/vídeos'
  },
  {
    type: 'koreo_split_curtain',
    label: 'Cortina Bipartida + Marquee Cinético',
    originTheme: 'Koreo Kinetic',
    desc: 'Duas metades se abrem horizontalmente revelando o ensaio central'
  },
  {
    type: 'circle_iris_portal',
    label: 'Obturador de Câmera / Portal Íris (Aperture Reveal)',
    originTheme: 'Horizon Parallax',
    desc: 'Lâminas de obturador de câmera 35mm que se abrem no scroll (com opção de círculo)'
  },
  {
    type: 'darkroom_color_develop',
    label: 'Revelação Câmara Escura 35mm',
    originTheme: 'Analog Chronicle',
    desc: 'Fotografia que se revela do filtro âmbar/monocromático para cores reais no scroll'
  },
  {
    type: 'vogue_overlapping_spread',
    label: 'Página Dupla Editorial Assimétrica',
    originTheme: 'Vogue Runway',
    desc: 'Composição de revista de moda com fotos sobrepostas e tipografia gigante'
  },
  {
    type: 'interactive_gallery_showcase',
    label: 'Vitrine de Galerias (5 Estilos de Layout)',
    originTheme: 'Portfólio',
    desc: 'Exibe suas coleções em Grid, Masonry, Lookbook Horizontal, Folha 35mm ou Cinema'
  },
  {
    type: 'client_testimonials',
    label: 'Depoimentos de Clientes & Histórias Reais',
    originTheme: 'Social Proof',
    desc: 'Depoimentos com vídeos integrados, thumbnails, @instagram e link direto para a galeria de fotos do casal'
  },
  {
    type: 'instagram_feed_banner',
    label: 'Feed & Perfil do Instagram (@Handle)',
    originTheme: 'Social Proof',
    desc: 'Grid de fotos/reels do Instagram com selo do perfil, @handle e botão "Siga no Instagram"'
  },
  {
    type: 'custom_footer_section',
    label: 'Rodapé Autoral Customizado & Selos',
    originTheme: 'Universal',
    desc: 'Rodapé completo com copyright, redes sociais e selos de associações (Bride, Inspiration, Fearless)'
  },
  {
    type: 'cta_zoom_whatsapp',
    label: 'Encerramento Zoom-Out & WhatsApp',
    originTheme: 'Universal',
    desc: 'Foto de fundo em zoom-out suave com botão direto para orçamento no WhatsApp'
  }
];

export interface ScrollyCategoryMeta {
  id: string;
  name: string;
  badge: string;
  iconName: string;
  desc: string;
  types: ScrollySectionType[];
}

export const SCROLLY_CATEGORIES: ScrollyCategoryMeta[] = [
  {
    id: 'portais',
    name: 'Aberturas & Portais Hero',
    badge: '6 Efeitos',
    iconName: 'Sparkles',
    desc: 'Efeitos cinematográficos projetados para a 1ª dobra com impacto no scroll',
    types: [
      'koreo_split_curtain',
      'circle_iris_portal',
      'hero_curtain_reveal',
      'hero_3d_perspective',
      'darkroom_color_develop',
      'bento_zoom_mosaic'
    ]
  },
  {
    id: 'narrativas',
    name: 'Narrativas & Álbuns Fixos',
    badge: '5 Efeitos',
    iconName: 'Layers',
    desc: 'Histórias autorais fixas, manifesto iluminado e álbuns empilhados em camadas',
    types: [
      'card_stacking_album',
      'sticky_story_split',
      'layered_pinning_chapters',
      'manifesto_word_reveal',
      'vogue_overlapping_spread'
    ]
  },
  {
    id: 'vitrines',
    name: 'Vitrines & Movimento',
    badge: '4 Efeitos',
    iconName: 'Film',
    desc: 'Exposição dinâmica de fotos com rolo 35mm, masonry parallax e antes/depois',
    types: [
      'interactive_gallery_showcase',
      'horizontal_filmstrip',
      'floating_masonry_3col',
      'before_after_grading'
    ]
  },
  {
    id: 'conversao',
    name: 'Prova Social & Encerramentos',
    badge: '3 Efeitos',
    iconName: 'Award',
    desc: 'Depoimentos em vídeo, feed do Instagram e chamada final para WhatsApp',
    types: [
      'client_testimonials',
      'instagram_feed_banner',
      'cta_zoom_whatsapp'
    ]
  }
];

export const FOOTER_EFFECT_CATALOG: Array<{
  id: NonNullable<ScrollySectionBlock['footerEffect']>;
  label: string;
  badge: string;
  desc: string;
  defaultLayout: NonNullable<ScrollySectionBlock['footerLayout']>;
}> = [
  {
    id: 'editorial_big_typography',
    label: 'Tipografia Monumental (Editorial)',
    badge: 'Lumina Editorial',
    desc: 'Marca em destaque monumental + localização, ícones sociais, selos e barra inferior',
    defaultLayout: 'editorial_split'
  },
  {
    id: 'marquee_kinetic',
    label: 'Marquee Cinético Infinito no Rodapé',
    badge: 'Koreo Kinetic',
    desc: 'Faixa de texto em movimento contínuo horizontal integrada dentro do rodapé',
    defaultLayout: 'editorial_split'
  },
  {
    id: 'instagram_strip',
    label: 'Rodapé + Faixa do Instagram Integrada',
    badge: 'Social Feed',
    desc: 'Exibe uma fileira compacta de fotos do Instagram dentro do próprio rodapé',
    defaultLayout: 'editorial_split'
  },
  {
    id: 'curtain_parallax_bg',
    label: 'Rodapé com Foto de Fundo & Máscara',
    badge: 'Noir Cinema',
    desc: 'Fundo fotográfico com controle de máscara escura e revelação suave no fim da página',
    defaultLayout: 'centered_stack'
  },
  {
    id: 'columns_3_luxury',
    label: 'Colunas de Estúdio (3 Colunas)',
    badge: 'Atelier Minimal',
    desc: 'Organização clássica em 3 colunas (Marca, Localização/Contato e Redes Sociais)',
    defaultLayout: 'columns_3'
  },
  {
    id: 'minimal_bar',
    label: 'Barra Minimalista Horizontal',
    badge: 'Clean Studio',
    desc: 'Rodapé discreto em faixa única com marca, redes sociais e direitos reservados',
    defaultLayout: 'minimal_row'
  }
];

export const DEFAULT_SCROLLYTELLING_CONFIG: Required<ScrollytellingConfig> = {
  smoothScroll: true,
  sectionsThemeId: 'lumina-editorial',
  sections: [],
  footerDeleted: false,
  heroKicker: 'FINE ART & STORYTELLING VISUAL',
  heroTitle: 'FOTOGRAFIA & REGISTROS ATEMPORAIS',
  heroSubtitle: 'Transformando momentos reais e emoções autênticas em memórias eternas.',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80',
  heroVideo: '',
  storyTitle: 'A Poesia do Instante',
  storyText:
    'Cada olhar guarda uma narrativa silenciosa. Nosso trabalho é transformar a luz natural, a arquitetura do instante e o movimento espontâneo em um legado visual que atravessa gerações.',
  storyLocation: 'São Paulo · Brasil & Destination Weddings',
  storyPhotos: [
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
      caption: 'O Preparo & Detalhes',
      subtitle: 'Luz de janela em filme 35mm'
    },
    {
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
      caption: 'A Cerimônia',
      subtitle: 'Emoção espontânea no altar'
    },
    {
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Retratos ao Entardecer',
      subtitle: 'Golden hour cinematográfica'
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'A Primeira Dança',
      subtitle: 'Movimento, sombra e contraste'
    }
  ],
  filmstripTitle: 'Exposição em Movimento',
  filmstripSubtitle: 'Role verticalmente para percorrer os fotogramas da coleção',
  filmstripImages: [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 01 · A Chegada',
      category: 'Casamento Editorial'
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 02 · O Vestido & Véu',
      category: 'Making Of'
    },
    {
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 03 · Os Votos',
      category: 'Cerimônia'
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 04 · Luz Natural',
      category: 'Ensaio Externo'
    },
    {
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 05 · Celebração',
      category: 'Recepção'
    },
    {
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      caption: 'Frame 06 · Legado Visual',
      category: 'Fine Art'
    }
  ],
  stackedProjects: [
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Vogue Noir · Retrato Editorial',
      subtitle: 'Estúdio Luz Contínua · São Paulo',
      category: '01 / RETRATO DE LUXO'
    },
    {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
      caption: 'L’Amour Classique · Gabriela & Lucas',
      subtitle: 'Fazenda Boa Vista · Itu, SP',
      category: '02 / DESTINATION WEDDING'
    },
    {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
      caption: 'Atelier Silhueta · Alta Moda',
      subtitle: 'Direção Criativa & Filme 120mm',
      category: '03 / EDITORIAL MODA'
    },
    {
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      caption: 'Solitude Ao Entardecer',
      subtitle: 'Ensaio Autoral na Costa Amalfitana',
      category: '04 / ARTE AUTORAL'
    }
  ],
  manifestoText:
    'A luz revela aquilo que os olhos comuns deixam escapar. Cada retrato é construído entre o silêncio, a sombra e a verdade de quem está diante da lente.',
  manifestoLeftImage:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  manifestoRightImage:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  bentoImages: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80'
  ],
  beforeAfterTitle: 'Color Grading & Direção de Arte',
  beforeAfterSubtitle:
    'Role a página para revelar o tratamento cromático autoral que transforma o arquivo bruto em cinema.',
  beforeRawImage:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  afterGradedImage:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  pinnedChapters: [
    {
      id: 'pin-1',
      chapterNumber: 'CAPÍTULO 01',
      title: 'A Abertura Narrativa',
      subtitle: 'Layered Pinning com transição contínua de tela cheia',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80',
      videoUrl: '',
      useBrandAccentBg: false
    },
    {
      id: 'pin-2',
      chapterNumber: 'CAPÍTULO 02',
      title: 'A Cor da Emoção',
      subtitle: 'Identidade visual assinada com a paleta da sua marca',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80',
      videoUrl: '',
      useBrandAccentBg: true
    },
    {
      id: 'pin-3',
      chapterNumber: 'CAPÍTULO 03',
      title: 'Retratos sem Tempo',
      subtitle: 'Composição editorial pensada para grandes formatos',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=80',
      videoUrl: '',
      useBrandAccentBg: false
    },
    {
      id: 'pin-4',
      chapterNumber: 'CAPÍTULO 04',
      title: 'Reserve a Sua Data',
      subtitle: 'Agenda aberta para casamentos, ensaios e projetos exclusivos',
      imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1800&q=80',
      videoUrl: '',
      useBrandAccentBg: true
    }
  ],
  ctaTitle: 'Vamos contar a sua história?',
  ctaSubtitle: 'Consulte a disponibilidade de agenda para casamentos, ensaios e projetos especiais.',
  ctaButtonText: 'Verificar Disponibilidade no WhatsApp',
  ctaBackgroundImage:
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80',
  whatsappNumber: '5511999999999',
  whatsappMessage: 'Olá! Vi seu site e gostaria de solicitar um orçamento.',
  showFloatingWhatsapp: true
};

/**
 * Factory to create a single ScrollySectionBlock from any ScrollySectionType
 */
export function createSectionFromTemplate(
  type: ScrollySectionType,
  site?: any,
  themeOverride?: {
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    headingFont?: string;
    bodyFont?: string;
  }
): ScrollySectionBlock {
  const id = `sec_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const brandAccent = themeOverride?.accentColor || site?.primaryColor || '#D05634';
  const hFont = themeOverride?.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = themeOverride?.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const heroImg = site?.heroImageUrl || DEFAULT_SCROLLYTELLING_CONFIG.heroImage;
  const heroVid = site?.heroVideoUrl || '';

  switch (type) {
    case 'hero_curtain_reveal':
      return {
        id,
        type,
        sourceThemeName: 'Lumina Editorial',
        visible: true,
        kicker: site?.niche || 'FINE ART & STORYTELLING',
        title: site?.heroTitle || 'FOTOGRAFIA & REGISTROS ATEMPORAIS',
        subtitle: site?.heroSubtitle || DEFAULT_SCROLLYTELLING_CONFIG.heroSubtitle,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#F7F4EF',
        textColor: themeOverride?.textColor || '#141413',
        accentColor: brandAccent,
        primaryImage: heroImg,
        primaryVideo: heroVid
      };

    case 'sticky_story_split':
      return {
        id,
        type,
        sourceThemeName: 'Lumina Editorial',
        visible: true,
        kicker: site?.geoCity ? `01. NARRATIVA · ${site.geoCity.toUpperCase()}` : '01. NARRATIVA VISUAL',
        title: 'A Poesia do Instante',
        bodyText: site?.bioText || DEFAULT_SCROLLYTELLING_CONFIG.storyText,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#F7F4EF',
        textColor: themeOverride?.textColor || '#141413',
        accentColor: brandAccent,
        items: [...DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos]
      };

    case 'horizontal_filmstrip':
      return {
        id,
        type,
        sourceThemeName: 'Lumina Editorial',
        visible: true,
        kicker: 'GALERIA EM ROLO DE FILME',
        title: 'Exposição em Movimento',
        subtitle: 'Role verticalmente para deslizar os fotogramas horizontalmente',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#0D0D0D',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        items: [...DEFAULT_SCROLLYTELLING_CONFIG.filmstripImages]
      };

    case 'hero_3d_perspective':
      return {
        id,
        type,
        sourceThemeName: 'Noir Cinema',
        visible: true,
        kicker: site?.niche || 'DIREÇÃO CRIATIVA & RETRATOS',
        title: site?.heroTitle || 'NOIR CINEMA STUDIO',
        subtitle: site?.heroSubtitle || DEFAULT_SCROLLYTELLING_CONFIG.heroSubtitle,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#050505',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        primaryImage: heroImg,
        primaryVideo: heroVid
      };

    case 'card_stacking_album':
      return {
        id,
        type,
        sourceThemeName: 'Noir Cinema',
        visible: true,
        kicker: 'ÁLBUM FOLHEADO EM TELA CHEIA',
        title: 'Obras & Ensaios Selecionados',
        subtitle: 'Cada projeto sobe e empilha sobre o anterior',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#050505',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        items: [...DEFAULT_SCROLLYTELLING_CONFIG.stackedProjects]
      };

    case 'manifesto_word_reveal':
      return {
        id,
        type,
        sourceThemeName: 'Noir Cinema',
        visible: true,
        kicker: 'MANIFESTO FOTOGRÁFICO',
        title: 'Luz, Sombra & Verdade',
        bodyText: DEFAULT_SCROLLYTELLING_CONFIG.manifestoText,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#080808',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        primaryImage: DEFAULT_SCROLLYTELLING_CONFIG.manifestoLeftImage,
        secondaryImage: DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage
      };

    case 'bento_zoom_mosaic':
      return {
        id,
        type,
        sourceThemeName: 'Atelier Minimal',
        visible: true,
        kicker: site?.niche || 'CURADORIA VISUAL',
        title: site?.heroTitle || 'ATELIER MINIMAL',
        subtitle: site?.heroSubtitle || 'Mosaico arquitetônico em alta resolução',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#0A0A0A',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        primaryImage: heroImg,
        primaryVideo: heroVid,
        items: DEFAULT_SCROLLYTELLING_CONFIG.bentoImages.map((url, idx) => ({
          url,
          caption: `Mosaico 0${idx + 1}`
        }))
      };

    case 'before_after_grading':
      return {
        id,
        type,
        sourceThemeName: 'Atelier Minimal',
        visible: true,
        kicker: 'DIREÇÃO DE COR CONTROLADA PELO SCROLL',
        title: 'Color Grading & Tratamento Autoral',
        subtitle: 'Role para revelar a transformação entre o arquivo RAW e a edição finalizada',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#FAFAFA',
        textColor: themeOverride?.textColor || '#111111',
        accentColor: brandAccent,
        primaryImage: DEFAULT_SCROLLYTELLING_CONFIG.afterGradedImage,
        secondaryImage: DEFAULT_SCROLLYTELLING_CONFIG.beforeRawImage
      };

    case 'floating_masonry_3col':
      return {
        id,
        type,
        sourceThemeName: 'Atelier Minimal',
        visible: true,
        kicker: 'FLUXO PARALLAX DE 3 COLUNAS',
        title: 'Portfólio em Movimento',
        subtitle: 'Colunas laterais e central deslizam em velocidades opostas',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#FAFAFA',
        textColor: themeOverride?.textColor || '#111111',
        accentColor: brandAccent,
        items: [...DEFAULT_SCROLLYTELLING_CONFIG.filmstripImages]
      };

    case 'layered_pinning_chapters':
      return {
        id,
        type,
        sourceThemeName: 'Layered Pinning Studio',
        visible: true,
        kicker: 'CAPÍTULOS IMERSIVOS',
        title: 'Narrativa em Camadas (Layered Pinning)',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#0B0B0B',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        items: DEFAULT_SCROLLYTELLING_CONFIG.pinnedChapters.map((c) => ({
          url: c.imageUrl,
          videoUrl: c.videoUrl,
          caption: c.title,
          subtitle: c.subtitle,
          category: c.chapterNumber
        }))
      };

    case 'koreo_split_curtain':
      return {
        id,
        type,
        sourceThemeName: 'Koreo Kinetic',
        visible: true,
        kicker: 'KOREO KINETIC OPENING',
        title: site?.heroTitle || 'MOVIMENTO & LUZ',
        subtitle: 'As duas metades se abrem revelando o filme principal',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#09090B',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        primaryImage: heroImg,
        primaryVideo: heroVid,
        secondaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80'
      };

    case 'circle_iris_portal':
      return {
        id,
        type,
        sourceThemeName: 'Horizon Parallax',
        visible: true,
        kicker: 'PORTAL HORIZONTE',
        title: 'Onde a Luz Encontra o Infinito',
        subtitle: 'Expansão guiada pela rolagem com obturador de câmera 35mm',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#07090E',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        portalShape: 'shutter',
        primaryImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1800&q=80',
        primaryVideo: heroVid
      };

    case 'darkroom_color_develop':
      return {
        id,
        type,
        sourceThemeName: 'Analog Chronicle 35mm',
        visible: true,
        kicker: 'LABORATÓRIO ANALÓGICO 35MM',
        title: 'Revelação na Câmara Escura',
        subtitle: 'Veja o negativo ganhar contraste e cor real conforme você rola a página',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#12100E',
        textColor: '#F5EFE6',
        accentColor: brandAccent,
        primaryImage: heroImg
      };

    case 'vogue_overlapping_spread':
      return {
        id,
        type,
        sourceThemeName: 'Vogue Runway',
        visible: true,
        kicker: 'EDIÇÃO ESPECIAL · LOOKBOOK',
        title: site?.photographerName || 'VOGUE ATELIER',
        subtitle: 'Composição assimétrica de página dupla com sobreposição tipográfica',
        bodyText: site?.bioText || DEFAULT_SCROLLYTELLING_CONFIG.storyText,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#FFFFFF',
        textColor: themeOverride?.textColor || '#0A0A0A',
        accentColor: brandAccent,
        primaryImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80'
      };

    case 'interactive_gallery_showcase':
      return {
        id,
        type,
        sourceThemeName: 'Vitrine Multi-Estilo',
        visible: true,
        kicker: 'PORTFÓLIO & COLEÇÕES',
        title: site?.gallerySectionTitle || 'Histórias & Galerias Publicadas',
        subtitle: site?.gallerySectionSubtitle || 'Clique em qualquer coleção para abrir a galeria completa',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#111111',
        textColor: themeOverride?.textColor || '#FFFFFF',
        accentColor: brandAccent,
        galleryStyle: 'editorial_grid',
        galleryAspect: 'aspect-[3/4]',
        items: [...DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos]
      };

    case 'client_testimonials':
      return {
        id,
        type,
        sourceThemeName: 'Social Proof & Depoimentos',
        visible: true,
        kicker: 'DEPOIMENTOS & HISTÓRIAS DE AMOR',
        title: 'O Que Dizem Nossos Noivos & Clientes',
        subtitle: 'Depoimentos reais com vídeos, fotos e links diretos para as galerias dos casais',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#0C0D10',
        textColor: themeOverride?.textColor || '#FFFFFF',
        accentColor: brandAccent,
        testimonialStyle: 'video_story_bubbles',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            caption: 'Gabriela & Lucas',
            subtitle: '“Ver nossas fotos foi reviver cada segundo com o mesmo arrepio. A sensibilidade do enquadramento é indescritível.”',
            instagramHandle: '@gabrielaelucas',
            gallerySlug: 'gabriela-e-lucas',
            rating: 5
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
            avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
            caption: 'Mariana & Felipe',
            subtitle: '“Profissionalismo impecável do primeiro café até o envio do álbum. Todos os convidados comentaram sobre as fotos!”',
            instagramHandle: '@marianafelipe.wedding',
            gallerySlug: 'mariana-e-felipe',
            rating: 5
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
            avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
            caption: 'Beatriz & Henrique',
            subtitle: '“O olhar poético e a captura espontânea superaram todas as nossas expectativas. Indicamos de olhos fechados.”',
            instagramHandle: '@biayhenrique',
            gallerySlug: 'beatriz-e-henrique',
            rating: 5
          }
        ]
      };

    case 'instagram_feed_banner':
      return {
        id,
        type,
        sourceThemeName: 'Social Feed',
        visible: true,
        kicker: 'ACOMPANHE NO INSTAGRAM',
        title: site?.photographerName ? `@${site.photographerName.toLowerCase().replace(/\s+/g, '')}` : '@seuinstagram',
        subtitle: 'Bastidores de casamentos, ensaios autorais e publicações em tempo real',
        buttonText: 'Siga no Instagram',
        instagramHandle: site?.socialLinks?.instagram || '@seuinstagram',
        instagramUrl: `https://instagram.com/${(site?.socialLinks?.instagram || 'seuinstagram').replace('@', '')}`,
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#09090B',
        textColor: themeOverride?.textColor || '#FFFFFF',
        accentColor: brandAccent,
        instagramStyle: 'grid_mosaic_6col',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
            caption: 'Destination Wedding na Fazenda Boa Vista ✨',
            subtitle: '2.4k curtidas'
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
            caption: 'Luz de janela & véu editorial 💍',
            subtitle: '1.8k curtidas'
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
            caption: 'Golden hour em Trancoso 🌅',
            subtitle: '3.1k curtidas'
          },
          {
            url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80',
            caption: 'Detalhes em filme 35mm 🎞️',
            subtitle: '1.5k curtidas'
          },
          {
            url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80',
            caption: 'Making of da noiva com luz natural 🌿',
            subtitle: '2.9k curtidas'
          },
          {
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
            caption: 'Primeira dança sob as estrelas 💫',
            subtitle: '4.2k curtidas'
          }
        ]
      };

    case 'custom_footer_section':
      return {
        id: 'sec_custom_footer_section_default',
        type,
        sourceThemeName: 'Footer',
        visible: true,
        navLabel: 'RODAPÉ',
        hideFromNav: true,
        kicker: 'ESTÚDIO AUTORAL DE FOTOGRAFIA',
        title: site?.photographerName || site?.title || 'Seu Nome',
        subtitle: site?.geoCity ? `${site.geoCity} · Brasil & Destination Weddings` : 'São Paulo · Brasil & Destination Weddings',
        copyrightText: `© ${new Date().getFullYear()} ${site?.photographerName || site?.title || 'Seu Nome'}. Todos os direitos reservados.`,
        showAssociationSeals: true,
        showFooterKicker: true,
        showFooterTitle: true,
        showFooterSubtitle: true,
        showFooterCopyright: true,
        showFooterCredits: true,
        footerCreditsText: 'Powered by Frame+ Pro Studio',
        showBackToTop: true,
        backToTopText: 'Voltar ao Topo ↑',
        showFooterSocials: true,
        footerEffect: 'editorial_big_typography',
        footerPaddingSize: 'normal',
        footerLayout: 'editorial_split',
        footerTextAlign: 'left',
        footerSocialPosition: 'middle',
        footerBottomLayout: 'split',
        titleSize: 'xl',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#050505',
        textColor: themeOverride?.textColor || '#FFFFFF',
        accentColor: brandAccent,
        footerStyle: 'editorial_big_typography',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 01'
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 02'
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 03'
          },
          {
            url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 04'
          },
          {
            url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 05'
          },
          {
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 06'
          }
        ]
      };

    case 'cta_zoom_whatsapp':
    default:
      return {
        id,
        type: 'cta_zoom_whatsapp',
        sourceThemeName: 'Universal',
        visible: true,
        kicker: site?.photographerName || 'AGENDA ABERTA',
        title: 'Vamos contar a sua história?',
        subtitle: 'Consulte a disponibilidade de data para casamentos, ensaios e projetos exclusivos.',
        buttonText: 'Verificar Disponibilidade no WhatsApp',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: '#0A0A0A',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
        primaryImage: DEFAULT_SCROLLYTELLING_CONFIG.ctaBackgroundImage
      };
  }
}

/**
 * Generates the default preset list of ScrollySectionBlock[] for any of the 9 Scrollytelling themes
 */
export function getThemePresetSections(
  themeId: ScrollytellingThemeId,
  site?: any
): ScrollySectionBlock[] {
  const meta =
    SCROLLYTELLING_THEME_CATALOG.find((t) => t.id === themeId) ||
    SCROLLYTELLING_THEME_CATALOG[1];

  const ov = {
    bgColor: meta.defaultBg,
    textColor: meta.defaultText,
    accentColor: site?.primaryColor || meta.defaultAccent,
    headingFont: site?.headingFont || meta.defaultHeadingFont,
    bodyFont: site?.bodyFont || meta.defaultBodyFont
  };

  let baseSections: ScrollySectionBlock[] = [];

  switch (themeId) {
    case 'lumina-editorial':
      baseSections = [
        createSectionFromTemplate('hero_curtain_reveal', site, ov),
        createSectionFromTemplate('sticky_story_split', site, ov),
        createSectionFromTemplate('horizontal_filmstrip', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          galleryStyle: 'editorial_grid'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'noir-cinema':
      baseSections = [
        createSectionFromTemplate('hero_3d_perspective', site, ov),
        createSectionFromTemplate('card_stacking_album', site, ov),
        createSectionFromTemplate('manifesto_word_reveal', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#050505',
          textColor: '#FFFFFF',
          galleryStyle: 'cinema_widescreen',
          galleryAspect: 'aspect-[16/9]'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'atelier-minimal':
      baseSections = [
        createSectionFromTemplate('bento_zoom_mosaic', site, ov),
        createSectionFromTemplate('before_after_grading', site, ov),
        createSectionFromTemplate('floating_masonry_3col', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#FAFAFA',
          textColor: '#111111',
          galleryStyle: 'masonry_flow'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'layered-pinning':
      baseSections = [
        createSectionFromTemplate('layered_pinning_chapters', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#0B0B0B',
          textColor: '#FFFFFF',
          galleryStyle: 'editorial_grid'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'koreo-kinetic':
      baseSections = [
        createSectionFromTemplate('koreo_split_curtain', site, ov),
        createSectionFromTemplate('horizontal_filmstrip', site, ov),
        {
          ...createSectionFromTemplate('floating_masonry_3col', site, ov),
          bgColor: '#09090B',
          textColor: '#FFFFFF'
        },
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#09090B',
          textColor: '#FFFFFF',
          galleryStyle: 'masonry_flow'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'prism-webgl':
      baseSections = [
        createSectionFromTemplate('hero_3d_perspective', site, ov),
        createSectionFromTemplate('circle_iris_portal', site, ov),
        createSectionFromTemplate('card_stacking_album', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#07090E',
          textColor: '#FFFFFF',
          galleryStyle: 'horizontal_lookbook'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'analog-chronicle':
      baseSections = [
        createSectionFromTemplate('darkroom_color_develop', site, ov),
        createSectionFromTemplate('horizontal_filmstrip', site, ov),
        {
          ...createSectionFromTemplate('sticky_story_split', site, ov),
          bgColor: '#12100E',
          textColor: '#F5EFE6'
        },
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#12100E',
          textColor: '#F5EFE6',
          galleryStyle: 'contact_sheet_35mm',
          galleryAspect: 'aspect-[4/3]'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'vogue-runway':
      baseSections = [
        createSectionFromTemplate('vogue_overlapping_spread', site, ov),
        createSectionFromTemplate('before_after_grading', site, ov),
        createSectionFromTemplate('card_stacking_album', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#FFFFFF',
          textColor: '#0A0A0A',
          galleryStyle: 'horizontal_lookbook'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;

    case 'horizon-parallax':
    default:
      baseSections = [
        createSectionFromTemplate('circle_iris_portal', site, ov),
        createSectionFromTemplate('sticky_story_split', site, ov),
        createSectionFromTemplate('bento_zoom_mosaic', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#F4F1EA',
          textColor: '#1C1917',
          galleryStyle: 'cinema_widescreen',
          galleryAspect: 'aspect-[16/9]'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];
      break;
  }

  return [
    ...baseSections,
    createSectionFromTemplate('custom_footer_section', site, {
      ...ov,
      bgColor: '#050505',
      textColor: '#FFFFFF'
    })
  ];
}

export function resolveScrollyConfig(site: any): Required<ScrollytellingConfig> {
  const custom: ScrollytellingConfig = site?.scrollytellingConfig || {};
  const activeThemeId: ScrollytellingThemeId =
    site?.scrollytellingThemeId || site?.theme_id || 'lumina-editorial';

  const safeThemeId = activeThemeId === 'classic' ? 'lumina-editorial' : activeThemeId;

  // Always preserve existing custom sections so user-added sections/galleries never disappear
  const hasCustomSections = Boolean(
    custom.sections && custom.sections.length > 0
  );

  let resolvedSections = hasCustomSections
    ? [...custom.sections!]
    : getThemePresetSections(safeThemeId, site);

  // Repair & deduplicate any footer sections so selecting an effect inside Rodapé never creates a duplicate RODAPÉ tab
  let seenFooter = false;
  resolvedSections = resolvedSections
    .map((sec) => {
      const labelUpper = (sec.navLabel || '').trim().toUpperCase();
      if (sec.type === 'custom_footer_section' || labelUpper === 'RODAPÉ' || labelUpper === 'RODAPE') {
        return {
          ...sec,
          type: 'custom_footer_section' as const,
          navLabel: sec.navLabel || 'RODAPÉ'
        };
      }
      return sec;
    })
    .filter((sec) => {
      if (sec.type === 'custom_footer_section') {
        if (seenFooter) return false;
        seenFooter = true;
      }
      return true;
    });

  // Ensure RODAPÉ tab is always present at the end unless explicitly deleted by the user
  if (
    !custom.footerDeleted &&
    !resolvedSections.some((s) => s.type === 'custom_footer_section')
  ) {
    resolvedSections = [
      ...resolvedSections,
      createSectionFromTemplate('custom_footer_section', site)
    ];
  }

  return {
    ...DEFAULT_SCROLLYTELLING_CONFIG,
    ...custom,
    footerDeleted: Boolean(custom.footerDeleted),
    sectionsThemeId: custom.sectionsThemeId || safeThemeId,
    sections: resolvedSections,
    heroKicker: custom.heroKicker || site?.niche || DEFAULT_SCROLLYTELLING_CONFIG.heroKicker,
    heroTitle: custom.heroTitle || site?.heroTitle || DEFAULT_SCROLLYTELLING_CONFIG.heroTitle,
    heroSubtitle: custom.heroSubtitle || site?.heroSubtitle || DEFAULT_SCROLLYTELLING_CONFIG.heroSubtitle,
    heroImage: custom.heroImage || site?.heroImageUrl || DEFAULT_SCROLLYTELLING_CONFIG.heroImage,
    heroVideo: custom.heroVideo !== undefined ? custom.heroVideo : site?.heroVideoUrl || '',
    storyText: custom.storyText || site?.bioText || DEFAULT_SCROLLYTELLING_CONFIG.storyText,
    storyLocation:
      custom.storyLocation ||
      (site?.geoCity ? `${site.geoCity}${site.geoState ? `, ${site.geoState}` : ''}` : DEFAULT_SCROLLYTELLING_CONFIG.storyLocation),
    whatsappNumber:
      custom.whatsappNumber ||
      site?.socialLinks?.whatsapp?.replace(/\D/g, '') ||
      DEFAULT_SCROLLYTELLING_CONFIG.whatsappNumber,
    storyPhotos:
      custom.storyPhotos && custom.storyPhotos.length > 0
        ? custom.storyPhotos
        : DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos,
    filmstripImages:
      custom.filmstripImages && custom.filmstripImages.length > 0
        ? custom.filmstripImages
        : DEFAULT_SCROLLYTELLING_CONFIG.filmstripImages,
    stackedProjects:
      custom.stackedProjects && custom.stackedProjects.length > 0
        ? custom.stackedProjects
        : DEFAULT_SCROLLYTELLING_CONFIG.stackedProjects,
    bentoImages:
      custom.bentoImages && custom.bentoImages.length >= 7
        ? custom.bentoImages
        : DEFAULT_SCROLLYTELLING_CONFIG.bentoImages,
    pinnedChapters:
      custom.pinnedChapters && custom.pinnedChapters.length > 0
        ? custom.pinnedChapters
        : DEFAULT_SCROLLYTELLING_CONFIG.pinnedChapters
  };
}

/**
 * Universal scroll progress hook that works seamlessly inside BOTH:
 * 1) Nested overflow-y-auto preview containers ([data-scrolly-viewport="true"] in SiteBuilderView)
 * 2) Full-screen window scrolling (in PublicWebsiteView)
 *
 * Uses capture-phase scroll listeners on window + direct listener on [data-scrolly-viewport="true"]
 * so no intermediate wrapper can ever swallow or block scroll events.
 */
function useUniversalScrollProgress(
  targetRef: React.RefObject<HTMLElement | null>,
  mode: 'pinned' | 'enter-exit' = 'pinned'
) {
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.0005
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const getScrollContainer = (node: HTMLElement | null): HTMLElement | null => {
      if (!node) return null;
      const explicitViewport = node.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;
      if (explicitViewport) return explicitViewport;

      let current = node.parentElement;
      while (current && current !== document.body && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const isYScrollable =
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          style.overflowX !== 'hidden';
        if (isYScrollable && current.clientHeight > 0 && current.scrollHeight > current.clientHeight) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    const updateScroll = () => {
      const node = targetRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollContainer = getScrollContainer(node);

      let viewportTop = 0;
      let viewportHeight = window.innerHeight;

      if (scrollContainer) {
        const parentRect = scrollContainer.getBoundingClientRect();
        viewportTop = parentRect.top;
        viewportHeight = parentRect.height;
      }

      const relativeTop = rect.top - viewportTop;

      if (mode === 'pinned') {
        const scrollableDistance = Math.max(1, rect.height - viewportHeight);
        const scrolled = -relativeTop;
        const p = Math.min(1, Math.max(0, scrolled / scrollableDistance));
        rawProgress.set(p);
      } else {
        const totalDistance = Math.max(1, rect.height + viewportHeight);
        const scrolled = viewportHeight - relativeTop;
        const p = Math.min(1, Math.max(0, scrolled / totalDistance));
        rawProgress.set(p);
      }
    };

    updateScroll();
    const explicitViewport = el.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;
    if (explicitViewport) {
      explicitViewport.addEventListener('scroll', updateScroll, { passive: true });
    }
    // Capture-phase listener on window catches scroll on ANY container in the DOM
    window.addEventListener('scroll', updateScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    const timer = window.setTimeout(updateScroll, 120);

    return () => {
      window.clearTimeout(timer);
      if (explicitViewport) {
        explicitViewport.removeEventListener('scroll', updateScroll);
      }
      window.removeEventListener('scroll', updateScroll, { capture: true });
      window.removeEventListener('resize', updateScroll);
    };
  }, [targetRef, mode, rawProgress]);

  return smoothProgress;
}

function MediaSlot({
  imageUrl,
  videoUrl,
  alt,
  className = 'w-full h-full object-cover'
}: {
  imageUrl?: string;
  videoUrl?: string;
  alt: string;
  className?: string;
}) {
  const safeImg =
    imageUrl ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';
  if (videoUrl && videoUrl.trim().length > 4) {
    return (
      <video
        src={videoUrl}
        poster={safeImg}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }
  return <img src={safeImg} alt={alt} className={className} loading="lazy" />;
}

function ScrollCueBadge({ accent, text = 'ROLE PARA ANIMAR' }: { accent: string; text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7 }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.25em] text-white shadow-xl pointer-events-none"
    >
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ color: accent }}
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </motion.span>
      <span>{text}</span>
    </motion.div>
  );
}

// ============================================================================
// INDIVIDUAL MODULAR SECTION BLOCK RENDERERS
// ============================================================================

function getSectionTitleSizeClass(
  block: ScrollySectionBlock,
  site: any,
  fallback: 'lg' | 'xl' | '2xl' | '3xl' | 'cinema' = '2xl'
): string {
  const sizeKey = block.titleSize || site?.heroTitleSize || fallback;
  const map: Record<string, string> = {
    lg: 'text-2xl sm:text-3xl md:text-5xl',
    xl: 'text-2xl sm:text-4xl md:text-6xl',
    '2xl': 'text-2xl sm:text-4xl md:text-6xl lg:text-7xl',
    '3xl': 'text-3xl sm:text-5xl md:text-7xl lg:text-8xl',
    cinema: 'text-4xl sm:text-6xl md:text-8xl lg:text-9xl'
  };
  return map[sizeKey] || map[fallback];
}

function triggerBlockDestination(dest: string, site: any, fallbackWhatsapp?: string) {
  const target = dest || 'whatsapp';
  if (target === 'whatsapp') {
    const rawNum =
      site?.socialLinks?.whatsapp ||
      site?.scrollytellingConfig?.whatsappNumber ||
      fallbackWhatsapp ||
      '5511999999999';
    const num = String(rawNum).replace(/[^0-9]/g, '') || '5511999999999';
    const customMsg =
      site?.whatsappDefaultMessage ||
      site?.scrollytellingConfig?.whatsappMessage ||
      `Olá ${site?.photographerName || ''}! Vi seu site e gostaria de solicitar um orçamento.`;
    const text = encodeURIComponent(customMsg);
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener,noreferrer');
  } else if (target.startsWith('#')) {
    const clean = target.replace(/^#/, '');
    const el = document.querySelector(target) ||
               document.getElementById(`scrolly-sec-${clean}`) ||
               document.querySelector(`[data-section-id="${clean}"]`) ||
               document.querySelector(`[data-section-type="${clean}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.open(target, '_blank', 'noopener,noreferrer');
  }
}

function renderBlockActionButtons(
  block: ScrollySectionBlock,
  site: any,
  accent: string,
  whatsappNumber?: string,
  defaultShow = false
) {
  const showPrimary =
    block.showButton !== undefined ? block.showButton : defaultShow;
  const primaryLabel = block.buttonText || site?.heroButtonText || 'Consultar Agenda';
  const primaryDest = block.buttonUrl || site?.heroButtonUrl || 'whatsapp';
  const secondaryLabel = block.secondaryButtonText?.trim();
  const secondaryDest = block.secondaryButtonUrl || '#portfolio';

  if (!showPrimary && !secondaryLabel) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
      {showPrimary && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerBlockDestination(primaryDest, site, whatsappNumber);
          }}
          style={{ backgroundColor: accent, color: '#FFFFFF' }}
          className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
        >
          <span>{primaryLabel}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
      {secondaryLabel && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerBlockDestination(secondaryDest, site, whatsappNumber);
          }}
          className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/35 bg-black/35 backdrop-blur-md text-white hover:bg-white/15 transition-colors"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}

function BlockHeroCurtainReveal({
  block,
  site,
  whatsappNumber
}: {
  block: ScrollySectionBlock;
  site: any;
  whatsappNumber: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const startW = `${block.initialMaskWidth || 44}%`;
  const startR = block.maskBorderRadius === 'pill' ? '999px' : block.maskBorderRadius === 'sharp' ? '0px' : '32px';
  const maskWidth = useTransform(progress, [0, 0.82], [startW, '100%']);
  const maskHeight = useTransform(progress, [0, 0.82], ['54%', '100%']);
  const maskRadius = useTransform(progress, [0, 0.82], [startR, '0px']);
  const innerMediaScale = useTransform(progress, [0, 0.9], [1.32, 1.0]);
  const textY = useTransform(progress, [0, 0.55], ['0%', '-85%']);
  const textScale = useTransform(progress, [0, 0.55], [1, 0.92]);
  const textOpacity = useTransform(progress, [0, 0.42], [1, 0]);
  const overlayOpacity = useTransform(progress, [0.58, 0.92], [0, 1]);
  const overlayY = useTransform(progress, [0.58, 0.92], [36, 0]);

  const bg = block.bgColor || '#F7F4EF';
  const txt = block.textColor || '#141413';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, '2xl');
  const maskDarkness = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.35;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[240vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ y: textY, scale: textScale, opacity: textOpacity }}
          className="relative z-20 text-center px-6 max-w-5xl mx-auto pointer-events-none mb-6"
        >
          <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.35em] font-semibold opacity-70 mb-4">
            <span>{block.kicker || 'FINE ART'}</span>
            <span aria-hidden="true">·</span>
            <span>{site?.geoCity || 'São Paulo'}</span>
          </div>
          <h1
            style={{ fontFamily: hFont }}
            className={`${titleSizeCls} font-normal tracking-tight leading-[1.08] break-words max-w-full px-2`}
          >
            {block.title}
          </h1>
          {block.subtitle && (
            <p className="mt-3 text-xs sm:text-sm md:text-base opacity-75 max-w-xl mx-auto px-2">
              {block.subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ width: maskWidth, height: maskHeight, borderRadius: maskRadius }}
          className="relative z-10 overflow-hidden shadow-2xl mx-auto"
        >
          <motion.div style={{ scale: innerMediaScale }} className="w-full h-full">
            <MediaSlot
              imageUrl={block.primaryImage}
              videoUrl={block.primaryVideo}
              alt={block.title}
            />
          </motion.div>
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: maskDarkness }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
            <ScrollCueBadge accent={accent} text={block.scrollCueText || 'CORTINA EDITORIAL · ROLE PARA EXPANDIR'} />
          </div>

          <motion.div
            style={{ opacity: overlayOpacity, y: overlayY }}
            className="absolute bottom-12 inset-x-0 px-8 md:px-16 flex flex-col md:flex-row items-start md:items-end justify-between text-white gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/75 mb-2">
                {site?.photographerName || site?.title}
              </p>
              <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
                {block.title}
              </h2>
            </div>
            {renderBlockActionButtons(block, site, accent, whatsappNumber, true)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BlockStickyStorySplit({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'enter-exit');
  const speedMode = block.storyParallaxSpeed || 'dynamic';
  const oddRange: [string, string] =
    speedMode === 'subtle'
      ? ['8%', '-10%']
      : speedMode === 'cinematic'
        ? ['26%', '-32%']
        : ['16%', '-22%'];
  const evenRange: [string, string] =
    speedMode === 'subtle'
      ? ['16%', '-16%']
      : speedMode === 'cinematic'
        ? ['46%', '-46%']
        : ['34%', '-34%'];

  const colOddY = useTransform(progress, [0, 1], oddRange);
  const colEvenY = useTransform(progress, [0, 1], evenRange);
  const progressScaleX = useTransform(progress, [0.1, 0.9], [0, 1]);

  const bg = block.bgColor || '#F7F4EF';
  const txt = block.textColor || '#141413';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const photos = block.items && block.items.length > 0 ? block.items : DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos;
  const isTextRight = block.storyTextSide === 'right';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative py-28 md:py-36 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className={`lg:col-span-5 lg:sticky lg:top-28 space-y-6 ${isTextRight ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: accent }}>
            {block.kicker || 'NARRATIVA VISUAL'}
          </div>
          <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal leading-[1.12]`}>
            {block.title}
          </h2>
          <p className="text-base md:text-lg opacity-80 leading-relaxed">
            {block.bodyText || block.subtitle || DEFAULT_SCROLLYTELLING_CONFIG.storyText}
          </p>
          <div className="w-full h-1 bg-current/10 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: progressScaleX, transformOrigin: 'left', backgroundColor: accent }}
              className="h-full w-full"
            />
          </div>
          <div className="pt-3 border-t border-current/15 flex items-center justify-between text-xs uppercase tracking-widest opacity-60">
            <span>Direção Autoral · Sticky Split</span>
            <span>{site?.photographerName}</span>
          </div>
        </div>

        <div className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 ${isTextRight ? 'lg:order-1' : 'lg:order-2'}`}>
          <motion.div style={{ y: colOddY }} className="space-y-8">
            {photos.filter((_, i) => i % 2 === 0).map((item, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="group space-y-3"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-800/10 shadow-xl">
                  <MediaSlot
                    imageUrl={item.url}
                    videoUrl={item.videoUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <figcaption className="flex items-center justify-between text-xs opacity-80 pt-1">
                  <span className="font-semibold">{item.caption}</span>
                  <span>0{idx * 2 + 1}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

          <motion.div style={{ y: colEvenY }} className="space-y-8 sm:mt-16">
            {photos.filter((_, i) => i % 2 === 1).map((item, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group space-y-3"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-800/10 shadow-xl">
                  <MediaSlot
                    imageUrl={item.url}
                    videoUrl={item.videoUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <figcaption className="flex items-center justify-between text-xs opacity-80 pt-1">
                  <span className="font-semibold">{item.caption}</span>
                  <span>0{idx * 2 + 2}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BlockHorizontalFilmstrip({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const filmX = useTransform(progress, [0, 1], ['4%', '-68%']);
  const imgParallaxScale = useTransform(progress, [0, 0.5, 1], [1.02, 1.12, 1.02]);
  const [activeIdx, setActiveIdx] = useState(1);

  const frames =
    block.items && block.items.length > 0
      ? block.items
      : DEFAULT_SCROLLYTELLING_CONFIG.filmstripImages;

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      const total = frames.length || 6;
      setActiveIdx(Math.min(total, Math.max(1, Math.ceil(v * total) || 1)));
    });
    return () => unsub();
  }, [progress, frames.length]);

  const bg = block.bgColor || '#0D0D0D';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[290vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 md:py-14">
        <div className="px-6 md:px-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] opacity-60 mb-2 flex items-center gap-2">
              <Film className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>{block.kicker || 'ROLO DE FILME HORIZONTAL 35MM'}</span>
            </div>
            <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal`}>
              {block.title}
            </h2>
          </div>
          <div className="font-mono text-sm md:text-base tracking-widest opacity-80 flex items-center gap-2">
            <span style={{ color: accent }} className="font-bold opacity-100">
              FRAME {String(activeIdx).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(frames.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="w-full overflow-hidden my-auto py-4 border-y border-current/10 bg-black/20">
          {/* Top 35mm Film Perforations */}
          <div className="flex items-center justify-around px-4 mb-3 opacity-25">
            {Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} className="w-4 h-2.5 rounded-sm border border-current" />
            ))}
          </div>

          <motion.div style={{ x: filmX }} className="flex items-center gap-8 px-6 md:px-16 w-max">
            {frames.map((frame, i) => (
              <div key={i} className="w-[78vw] sm:w-[52vw] md:w-[40vw] lg:w-[34vw] shrink-0 group">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 border border-current/15 relative shadow-2xl">
                  <motion.div style={{ scale: imgParallaxScale }} className="w-full h-full">
                    <MediaSlot
                      imageUrl={frame.url}
                      videoUrl={frame.videoUrl}
                      alt={frame.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                  <span className="font-semibold">{frame.caption}</span>
                  <span className="font-mono opacity-65">{frame.category || `KODAK 400 · 0${i + 1}A`}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom 35mm Film Perforations */}
          <div className="flex items-center justify-around px-4 mt-3 opacity-25">
            {Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} className="w-4 h-2.5 rounded-sm border border-current" />
            ))}
          </div>
        </div>

        <div className="px-6 md:px-16 flex items-center justify-between gap-6">
          <span className="text-[11px] uppercase tracking-[0.25em] opacity-65">
            {block.subtitle || 'Role verticalmente para percorrer os fotogramas horizontalmente'}
          </span>
          <div className="w-52 h-1.5 bg-current/15 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: progress, transformOrigin: 'left', backgroundColor: accent }}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BlockHero3DPerspective({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const initialTilt = block.perspectiveTiltDeg ?? 26;
  const depthPx = `${block.perspectiveDepth ?? 1200}px`;
  const cardRotateX = useTransform(progress, [0, 0.75], [initialTilt, 0]);
  const cardRotateY = useTransform(progress, [0, 0.75], [-12, 0]);
  const cardScale = useTransform(progress, [0, 0.88], [0.78, 1.12]);
  const bgTitleY = useTransform(progress, [0, 1], ['-18%', '42%']);
  const bgTitleScale = useTransform(progress, [0, 1], [0.9, 1.16]);
  const bgTitleOpacity = useTransform(progress, [0, 0.8], [0.28, 0.06]);
  const leftSatelliteX = useTransform(progress, [0, 0.85], ['-55%', '-135%']);
  const rightSatelliteX = useTransform(progress, [0, 0.85], ['55%', '135%']);
  const satelliteOpacity = useTransform(progress, [0, 0.7], [0.65, 0]);

  const bg = block.bgColor || '#050505';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#C5A059';
  const hFont = block.headingFont || site?.headingFont || 'Cinzel';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const overlayDarkness = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.4;
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  const sideImg1 = DEFAULT_SCROLLYTELLING_CONFIG.manifestoLeftImage;
  const sideImg2 = DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div
        style={{ perspective: depthPx }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-6"
      >
        {/* Background Giant Kinetic Typography */}
        <motion.div
          style={{ y: bgTitleY, scale: bgTitleScale, opacity: bgTitleOpacity, fontFamily: hFont }}
          className="absolute inset-x-0 text-center pointer-events-none select-none"
        >
          <span className="text-[13vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">
            {block.giantBackgroundText || site?.photographerName || block.title}
          </span>
        </motion.div>

        {/* Left & Right Orbiting 3D Satellite Frames */}
        <motion.div
          style={{ x: leftSatelliteX, opacity: satelliteOpacity, rotateY: 28, rotateZ: -6 }}
          className="hidden md:block absolute w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl pointer-events-none"
        >
          <img src={sideImg1} alt="Orbit Left" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <motion.div
          style={{ x: rightSatelliteX, opacity: satelliteOpacity, rotateY: -28, rotateZ: 6 }}
          className="hidden md:block absolute w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl pointer-events-none"
        >
          <img src={sideImg2} alt="Orbit Right" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Central 3D Monolith Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 32, scale: 0.72 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            scale: cardScale,
            transformStyle: 'preserve-3d'
          }}
          className="relative z-10 w-full max-w-md md:max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border border-white/20 shadow-[0_35px_110px_rgba(0,0,0,0.95)]"
        >
          <MediaSlot
            imageUrl={block.primaryImage}
            videoUrl={block.primaryVideo}
            alt={block.title}
          />
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: overlayDarkness }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
            <ScrollCueBadge accent={accent} text="PERSPECTIVA 3D · ROLE PARA MERGULHAR" />
          </div>

          <div className="absolute bottom-8 inset-x-6 text-center text-white space-y-2">
            <span style={{ color: accent }} className="text-[10px] uppercase tracking-[0.35em] font-bold block">
              {block.kicker || 'NOIR CINEMA 3D'}
            </span>
            <h1 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal tracking-wide break-words`}>
              {block.title}
            </h1>
            {block.subtitle && <p className="text-xs text-neutral-300 line-clamp-2">{block.subtitle}</p>}
            {renderBlockActionButtons(block, site, accent, undefined, false)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StackedAlbumCardItem({
  project,
  index,
  total,
  accent,
  hFont,
  site,
  collection,
  onOpenGallery
}: {
  project: ScrollyPhotoItem;
  index: number;
  total: number;
  accent: string;
  hFont: string;
  site: any;
  collection?: any;
  onOpenGallery?: (col: any) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const progress = useUniversalScrollProgress(cardRef, 'pinned');
  const scale = useTransform(progress, [0, 1], [1, 0.9]);
  const innerImgScale = useTransform(progress, [0, 1], [1.14, 1.0]);

  return (
    <div
      ref={cardRef}
      className="relative h-[125vh]"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-4 md:p-10"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          style={{ scale, top: `${index * 14}px` }}
          className="relative w-full h-[84vh] max-w-7xl rounded-3xl overflow-hidden border border-white/15 bg-[#0A0A0A] shadow-[0_-25px_90px_rgba(0,0,0,0.9)]"
        >
          <motion.div style={{ scale: innerImgScale }} className="w-full h-full">
            <MediaSlot
              imageUrl={project.url}
              videoUrl={project.videoUrl}
              alt={project.caption}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35" />

          <div className="absolute top-8 inset-x-8 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/75">
            <span>{project.category || `0${index + 1} / SÉRIE AUTORAL`}</span>
            <span className="font-mono">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <div className="absolute bottom-10 inset-x-8 md:inset-x-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-300 mb-2">
                {project.subtitle || site?.geoCity || 'Direção de Arte'}
              </p>
              <h3 style={{ fontFamily: hFont }} className="text-3xl sm:text-5xl md:text-6xl font-normal text-white">
                {project.caption}
              </h3>
            </div>

            {collection && onOpenGallery && (
              <button
                type="button"
                onClick={() => onOpenGallery(collection)}
                style={{ borderColor: accent, color: accent }}
                className="px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors self-start md:self-auto"
              >
                Abrir Galeria
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BlockCardStackingAlbum({
  block,
  site,
  collections = [],
  onOpenGallery
}: {
  block: ScrollySectionBlock;
  site: any;
  collections?: any[];
  onOpenGallery?: (col: any) => void;
}) {
  const bg = block.bgColor || '#050505';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#C5A059';
  const hFont = block.headingFont || site?.headingFont || 'Cinzel';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  const kicker =
    site?.galleryKickerText !== undefined && site?.galleryKickerText !== ''
      ? site.galleryKickerText
      : (block.kicker || 'EXPOSIÇÃO EM CAMADAS (CARD STACKING)');
  const title = site?.gallerySectionTitle || block.title;
  const subtitle =
    site?.gallerySectionSubtitle !== undefined
      ? site.gallerySectionSubtitle
      : (block.subtitle || 'Role para empilhar os álbuns');

  const filteredCollections =
    collections && collections.length > 0
      ? (site?.selectedCollectionIds && site.selectedCollectionIds.length > 0
          ? collections.filter((col: any) => site.selectedCollectionIds.includes(String(col.id)))
          : collections)
      : [];
  const effectiveCollections = filteredCollections.length > 0 ? filteredCollections : collections;

  const cards =
    effectiveCollections && effectiveCollections.length > 0
      ? effectiveCollections.map((col: any, idx: number) => ({
          url:
            col.image ||
            col.coverImage ||
            (typeof col.media?.[0] === 'string' ? col.media[0] : col.media?.[0]?.url) ||
            DEFAULT_SCROLLYTELLING_CONFIG.stackedProjects[idx % 3].url,
          caption: col.title || `Coleção 0${idx + 1}`,
          subtitle: `${col.category || 'Galeria'} · ${col.date || '2026'}`,
          category: `0${idx + 1} / COLEÇÃO REAL`
        }))
      : (block.items && block.items.length > 0
          ? block.items
          : DEFAULT_SCROLLYTELLING_CONFIG.stackedProjects);

  return (
    <section style={{ backgroundColor: bg, color: txt, fontFamily: bFont }} className="relative">
      <div className="py-16 px-6 md:px-16 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between border-b border-current/10 gap-4">
        <div>
          {kicker && (
            <span style={{ color: accent }} className="text-xs uppercase tracking-[0.3em] font-bold block mb-1">
              {kicker}
            </span>
          )}
          <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal`}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <span className="text-xs uppercase tracking-widest opacity-60">
            {subtitle}
          </span>
        )}
      </div>

      <div className="relative">
        {cards.map((project, index) => (
          <React.Fragment key={index}>
            <StackedAlbumCardItem
              project={project}
              index={index}
              total={cards.length}
              accent={accent}
              hFont={hFont}
              site={site}
              collection={collections?.[index]}
              onOpenGallery={onOpenGallery}
            />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function BlockManifestoWordReveal({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const [revealIdx, setRevealIdx] = useState(1);
  const text = block.bodyText || block.subtitle || block.title || DEFAULT_SCROLLYTELLING_CONFIG.manifestoText;
  const words = text.split(' ');
  const showSidePhotos = block.showFloatingSidePhotos !== false;

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      const normalized = Math.min(1, Math.max(0.05, v * 1.15));
      setRevealIdx(Math.max(1, Math.ceil(normalized * words.length)));
    });
    return () => unsub();
  }, [progress, words.length]);

  const leftY = useTransform(progress, [0, 1], ['28%', '-28%']);
  const leftRotate = useTransform(progress, [0, 1], [-6, 4]);
  const rightY = useTransform(progress, [0, 1], ['-28%', '28%']);
  const rightRotate = useTransform(progress, [0, 1], [6, -4]);

  const bg = block.bgColor || '#080808';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#C5A059';
  const hFont = block.headingFont || site?.headingFont || 'Cinzel';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[210vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {showSidePhotos && (
            <motion.div style={{ y: leftY, rotate: leftRotate }} className="lg:col-span-3 hidden lg:block">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-current/15 shadow-2xl">
                <img
                  src={block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.manifestoLeftImage}
                  alt="Left Manifesto"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}

          <div className={`${showSidePhotos ? 'lg:col-span-6' : 'lg:col-span-10 lg:col-start-2'} text-center space-y-6`}>
            <span style={{ color: accent }} className="text-xs uppercase tracking-[0.35em] font-bold block">
              {block.kicker || 'MANIFESTO FOTOGRÁFICO · SCROLL REVEAL'}
            </span>
            <p
              style={{ fontFamily: hFont }}
              className="text-2xl sm:text-4xl md:text-5xl leading-[1.28] font-normal flex flex-wrap justify-center gap-x-3 gap-y-2"
            >
              {words.map((w, i) => {
                const isLit = i < revealIdx;
                return (
                  <span
                    key={i}
                    style={{
                      opacity: isLit ? 1 : 0.16,
                      transform: isLit ? 'translateY(0px)' : 'translateY(6px)',
                      color: isLit && i === revealIdx - 1 ? accent : undefined
                    }}
                    className="transition-all duration-200 inline-block"
                  >
                    {w}
                  </span>
                );
              })}
            </p>
          </div>

          {showSidePhotos && (
            <motion.div style={{ y: rightY, rotate: rightRotate }} className="lg:col-span-3 hidden lg:block">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-current/15 shadow-2xl">
                <img
                  src={block.secondaryImage || DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage}
                  alt="Right Manifesto"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function BlockBentoZoomMosaic({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const startZoom = block.bentoInitialZoom ?? 3.2;
  const gridGapClass = block.bentoGridGap || 'gap-3 md:gap-4';
  const gridScale = useTransform(progress, [0, 0.85], [startZoom, 1.0]);
  const titleOpacity = useTransform(progress, [0, 0.38], [1, 0]);
  const titleScale = useTransform(progress, [0, 0.38], [1, 1.15]);
  const labelOpacity = useTransform(progress, [0.68, 0.96], [0, 1]);

  const bg = block.bgColor || '#0A0A0A';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Outfit';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const centerOverlayOpacity = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.35;
  const titleSizeCls = getSectionTitleSizeClass(block, site, '2xl');

  const imgs =
    block.items && block.items.length >= 6
      ? block.items.map((it) => it.url)
      : DEFAULT_SCROLLYTELLING_CONFIG.bentoImages;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ scale: gridScale }}
          className={`w-full max-w-6xl h-[82vh] px-4 grid grid-cols-3 grid-rows-3 ${gridGapClass}`}
        >
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[0]} alt="Bento 1" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[1]} alt="Bento 2" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[2]} alt="Bento 3" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[4] || imgs[0]} alt="Bento 4" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 relative shadow-2xl">
            <MediaSlot
              imageUrl={block.primaryImage || imgs[3]}
              videoUrl={block.primaryVideo}
              alt={block.title}
            />
            <div className="absolute inset-0 bg-black" style={{ opacity: centerOverlayOpacity }} />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[5] || imgs[1]} alt="Bento 5" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[6] || imgs[2]} alt="Bento 6" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <img src={imgs[0]} alt="Bento 7" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none text-white"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-white/80 mb-3">
            {block.kicker || 'BENTO OPTICAL ZOOM'}
          </span>
          <h1 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-bold tracking-tight max-w-4xl break-words px-2`}>
            {block.title}
          </h1>
          {block.subtitle && <p className="mt-3 text-xs sm:text-sm md:text-base text-white/85 max-w-lg px-2">{block.subtitle}</p>}
          {renderBlockActionButtons(block, site, accent, undefined, false)}
          <div className="mt-6">
            <ScrollCueBadge accent={accent} text="MOSAICO BENTO · ROLE PARA REVELAR AS 7 OBRAS" />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute bottom-6 inset-x-8 z-20 flex items-center justify-between text-xs uppercase tracking-[0.25em] opacity-80 pointer-events-none"
        >
          <span>{site?.photographerName} · Mosaico Curatorial</span>
          <span>07 Fotografias em Alta Resolução</span>
        </motion.div>
      </div>
    </section>
  );
}

function BlockBeforeAfterGrading({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const [splitPercent, setSplitPercent] = useState(50);

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setSplitPercent(Math.round(8 + v * 84));
    });
    return () => unsub();
  }, [progress]);

  const bg = block.bgColor || '#FAFAFA';
  const txt = block.textColor || '#111111';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Outfit';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  const gradedImg = block.afterImage || block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.afterGradedImage;
  const rawImg = block.beforeImage || block.secondaryImage || block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.beforeRawImage;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span style={{ color: accent }} className="text-xs uppercase tracking-[0.25em] font-bold block mb-1">
              {block.kicker || 'DIREÇÃO DE COR NO SCROLL OU ARRASTE'}
            </span>
            <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-bold tracking-tight`}>
              {block.title}
            </h2>
          </div>
          {block.subtitle && <p className="text-xs opacity-65 max-w-md">{block.subtitle}</p>}
        </div>

        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.min(96, Math.max(4, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
            setSplitPercent(pct);
          }}
          className="relative w-full h-[64vh] rounded-3xl overflow-hidden shadow-2xl border border-current/10 select-none cursor-ew-resize"
        >
          <img
            src={rawImg}
            alt="RAW"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-75 brightness-95"
          />
          <span className="absolute top-5 right-5 z-10 text-[11px] font-mono uppercase tracking-widest text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-md">
            {block.beforeLabel || 'RAW · Arquivo Original'}
          </span>

          <div
            style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={gradedImg}
              alt="Color Graded"
              className="w-full h-full object-cover saturate-115 contrast-105"
            />
            <span
              style={{ backgroundColor: accent }}
              className="absolute top-5 left-5 z-10 text-[11px] font-mono uppercase tracking-widest text-white px-3 py-1 rounded-md"
            >
              {block.afterLabel || 'Color Grading Final'} ({splitPercent}%)
            </span>
          </div>

          <div
            style={{ left: `${splitPercent}%` }}
            className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.6)] z-20 flex items-center justify-center"
          >
            <div
              style={{ backgroundColor: accent }}
              className="w-9 h-9 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white"
            >
              <Sliders className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlockFloatingMasonry3Col({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'enter-exit');
  const fastColY = useTransform(progress, [0, 1], ['16%', '-22%']);
  const slowColY = useTransform(progress, [0, 1], ['-14%', '18%']);
  const thirdColY = useTransform(progress, [0, 1], ['24%', '-28%']);

  const bg = block.bgColor || '#FAFAFA';
  const txt = block.textColor || '#111111';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Outfit';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');
  const items =
    block.items && block.items.length >= 6
      ? block.items
      : DEFAULT_SCROLLYTELLING_CONFIG.filmstripImages;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="py-28 px-6 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span style={{ color: accent }} className="text-xs uppercase tracking-[0.25em] font-bold block">
            {block.kicker || 'CURADORIA EM FLUXO PARALLAX'}
          </span>
          <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-bold tracking-tight`}>
            {block.title}
          </h2>
          {block.subtitle && <p className="text-sm opacity-70">{block.subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div style={{ y: fastColY }} className="space-y-6">
            {items.slice(0, 2).map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                <MediaSlot imageUrl={img.url} videoUrl={img.videoUrl} alt={img.caption} />
              </div>
            ))}
          </motion.div>

          <motion.div style={{ y: slowColY }} className="space-y-6 md:mt-12">
            {items.slice(2, 4).map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                <MediaSlot imageUrl={img.url} videoUrl={img.videoUrl} alt={img.caption} />
              </div>
            ))}
          </motion.div>

          <motion.div style={{ y: thirdColY }} className="space-y-6">
            {items.slice(4, 6).map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                <MediaSlot imageUrl={img.url} videoUrl={img.videoUrl} alt={img.caption} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PinnedChapterItem({
  chapter,
  idx,
  total,
  bg,
  accent,
  hFont,
  site
}: {
  chapter: ScrollyPhotoItem;
  idx: number;
  total: number;
  bg: string;
  accent: string;
  hFont: string;
  site: any;
}) {
  const slideRef = useRef<HTMLDivElement | null>(null);
  const progress = useUniversalScrollProgress(slideRef, 'pinned');
  const imgScale = useTransform(progress, [0, 1], [1.24, 1.0]);
  const titleY = useTransform(progress, [0, 0.5, 1], ['28px', '0px', '-24px']);
  const isAccent = idx % 2 === 1;

  return (
    <div ref={slideRef} className="relative h-[120vh]" style={{ zIndex: idx + 1 }}>
      <section
        style={{ backgroundColor: isAccent ? accent : bg }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center border-t border-white/15 shadow-[0_-25px_75px_rgba(0,0,0,0.75)]"
      >
        <motion.div style={{ scale: imgScale }} className="absolute inset-0 w-full h-full">
          <MediaSlot
            imageUrl={chapter.url}
            videoUrl={chapter.videoUrl}
            alt={chapter.caption}
            className={`w-full h-full object-cover ${
              isAccent ? 'mix-blend-multiply opacity-45' : 'opacity-55'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />
        </motion.div>

        {idx === 0 && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <ScrollCueBadge accent={accent} text="CAPÍTULOS 100VH FIXADOS · ROLE PARA SOBREPOR" />
          </div>
        )}

        <motion.div
          style={{ y: titleY }}
          className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center space-y-5"
        >
          <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] font-bold text-white/85">
            <span>{chapter.category || `CAPÍTULO 0${idx + 1}`}</span>
            <span aria-hidden="true">·</span>
            <span>{site?.photographerName}</span>
          </div>
          <h2
            style={{ fontFamily: hFont }}
            className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02] break-words max-w-full px-2"
          >
            {chapter.caption}
          </h2>
          {chapter.subtitle && (
            <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto">
              {chapter.subtitle}
            </p>
          )}
        </motion.div>

        <div className="absolute bottom-8 inset-x-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-white/75">
          <span>{site?.title}</span>
          <span>
            CAMADA 0{idx + 1} / 0{total}
          </span>
        </div>
      </section>
    </div>
  );
}

function BlockLayeredPinningChapters({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const bg = block.bgColor || '#0B0B0B';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Bricolage Grotesque';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const chapters =
    block.items && block.items.length > 0
      ? block.items
      : DEFAULT_SCROLLYTELLING_CONFIG.pinnedChapters.map((c) => ({
          url: c.imageUrl,
          videoUrl: c.videoUrl,
          caption: c.title,
          subtitle: c.subtitle,
          category: c.chapterNumber
        }));

  return (
    <div style={{ fontFamily: bFont }} className="relative text-white">
      {chapters.map((chapter, idx) => (
        <React.Fragment key={idx}>
          <PinnedChapterItem
            chapter={chapter}
            idx={idx}
            total={chapters.length}
            bg={bg}
            accent={accent}
            hFont={hFont}
            site={site}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function BlockKoreoSplitCurtain({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const doorEndPoint = block.curtainSpeed === 'fast' ? 0.58 : block.curtainSpeed === 'slow' ? 0.92 : 0.78;
  const leftDoorX = useTransform(progress, [0, doorEndPoint], ['0%', '-102%']);
  const rightDoorX = useTransform(progress, [0, doorEndPoint], ['0%', '102%']);
  const innerScale = useTransform(progress, [0, 0.88], [0.76, 1.06]);
  const marqueeBottomX = useTransform(progress, [0, 1], ['15%', '-55%']);
  const marqueeTopX = useTransform(progress, [0, 1], ['-45%', '15%']);

  const bg = block.bgColor || '#09090B';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#E11D48';
  const hFont = block.headingFont || site?.headingFont || 'Bricolage Grotesque';
  const bFont = block.bodyFont || site?.bodyFont || 'DM Sans';

  const overlayOpacityValue = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.45;
  const marqueeOpacityValue = block.marqueeOpacity !== undefined ? block.marqueeOpacity / 100 : 0.2;
  const titleSizeClass = getSectionTitleSizeClass(block, site, '2xl');

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Inner Revealed Fullscreen Media */}
        <motion.div style={{ scale: innerScale }} className="absolute inset-0 w-full h-full">
          <MediaSlot
            imageUrl={block.primaryImage}
            videoUrl={block.primaryVideo}
            alt={block.title}
          />
          <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacityValue }} />
        </motion.div>

        {/* Kinetic Marquee Band at Top */}
        <motion.div
          style={{ x: marqueeTopX, fontFamily: hFont, opacity: marqueeOpacityValue }}
          className="absolute top-12 left-0 whitespace-nowrap text-[6vw] font-black uppercase tracking-tighter text-white pointer-events-none select-none z-10"
        >
          {block.marqueeTopText || `${site?.photographerName} · DIREÇÃO EDITORIAL · ${block.kicker || 'KOREO KINETIC'} · ${site?.photographerName}`}
        </motion.div>

        {/* Kinetic Marquee Band at Bottom */}
        <motion.div
          style={{ x: marqueeBottomX, fontFamily: hFont, opacity: marqueeOpacityValue * 1.25 }}
          className="absolute bottom-10 left-0 whitespace-nowrap text-[8vw] font-black uppercase tracking-tighter text-white pointer-events-none select-none z-10"
        >
          {block.marqueeBottomText || `${block.title} · ${site?.photographerName} · ${block.kicker || 'KOREO KINETIC'} · ${block.title}`}
        </motion.div>

        {/* Center Revealed Title */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span
            style={{ color: accent }}
            className="text-xs uppercase tracking-[0.35em] font-bold block mb-3"
          >
            {block.kicker || 'KOREO SPLIT REVEAL'}
          </span>
          <h2 style={{ fontFamily: hFont }} className={`${titleSizeClass} font-black text-white break-words px-2`}>
            {block.title}
          </h2>
          {block.subtitle && <p className="mt-3 text-xs sm:text-sm md:text-base text-white/80 px-2">{block.subtitle}</p>}
          {renderBlockActionButtons(block, site, accent, undefined, true)}
        </div>

        {/* Left & Right Sliding Curtain Doors */}
        <motion.div
          style={{ x: leftDoorX, backgroundColor: bg }}
          className="absolute inset-y-0 left-0 w-1/2 z-20 border-r border-white/15 flex flex-col items-end justify-center pr-4 sm:pr-6 md:pr-12 overflow-hidden shadow-2xl"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] opacity-45 mb-1 sm:mb-2">
            PORTA ESQUERDA
          </span>
          <span
            style={{ fontFamily: hFont }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight break-words text-right"
          >
            {site?.photographerName?.split(' ')[0] || 'STUDIO'}
          </span>
        </motion.div>

        <motion.div
          style={{ x: rightDoorX, backgroundColor: bg }}
          className="absolute inset-y-0 right-0 w-1/2 z-20 border-l border-white/15 flex flex-col items-start justify-center pl-4 sm:pl-6 md:pl-12 overflow-hidden shadow-2xl"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] opacity-45 mb-1 sm:mb-2">
            ROLE PARA ABRIR
          </span>
          <span
            style={{ fontFamily: hFont, color: accent }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight break-words text-left"
          >
            {site?.photographerName?.split(' ').slice(1).join(' ') || 'VISUAL'}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function BlockCircleIrisPortal({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const [radiusPct, setRadiusPct] = useState(18);
  const innerScale = useTransform(progress, [0, 1], [1.25, 1.0]);
  const ringRotate = useTransform(progress, [0, 1], [0, 140]);
  const bladesRotate = useTransform(progress, [0, 1], [-25, 65]);

  const baseStartPct = {
    closed: 10,
    f8: 16,
    'f5.6': 24,
    'f2.8': 32,
    'f1.4': 42
  }[block.initialAperture || 'f8'] || 16;

  useEffect(() => {
    setRadiusPct(baseStartPct);
    const unsub = progress.on('change', (v) => {
      setRadiusPct(Math.round(baseStartPct + v * (100 - baseStartPct)));
    });
    return () => unsub();
  }, [progress, baseStartPct]);

  const bg = block.bgColor || '#07090E';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#38BDF8';
  const hFont = block.headingFont || site?.headingFont || 'Cinzel';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const portalShape = block.portalShape || 'shutter';
  const bladeCount = block.shutterBlades || 8;
  const portalOverlayOpacity = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.45;
  const titleSizeCls = getSectionTitleSizeClass(block, site, '2xl');

  // Dynamic N-blade camera diaphragm polygon calculation
  const r = radiusPct * 1.15;
  const rot = radiusPct * 0.45;
  const octagonalPoints = Array.from({ length: bladeCount })
    .map((_, i) => {
      const angle = (i * 2 * Math.PI) / bladeCount + (rot * Math.PI) / 180;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    })
    .join(', ');

  const clipPathStyle =
    portalShape === 'shutter'
      ? `polygon(${octagonalPoints})`
      : `circle(${radiusPct}% at 50% 50%)`;

  const fStops = ['f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16'];
  const activeFStopIdx = Math.min(7, Math.max(0, Math.floor((1 - (radiusPct - 10) / 90) * 7.99)));

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Rotating Optical Lens Rings & Markings (responsive scale) */}
        <motion.div
          style={{ rotate: ringRotate, borderColor: accent }}
          className="absolute w-[82vw] h-[82vw] sm:w-[68vh] sm:h-[68vh] rounded-full border border-dashed opacity-25 pointer-events-none z-10"
        />
        <motion.div
          style={{ rotate: useTransform(progress, [0, 1], [0, -110]) }}
          className="absolute w-[92vw] h-[92vw] sm:w-[78vh] sm:h-[78vh] rounded-full border border-current opacity-10 pointer-events-none z-10"
        />

        {/* Camera Lens Barrel f-stop markings for authentic shutter */}
        {portalShape === 'shutter' && block.showFStopMarks !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
            <div className="relative w-[86vw] h-[86vw] sm:w-[72vh] sm:h-[72vh] rounded-full border border-white/10 flex items-center justify-center">
              {fStops.map((f, i) => {
                const angleDeg = i * 45 - 90;
                const isActive = i === activeFStopIdx;
                return (
                  <div
                    key={f}
                    style={{
                      transform: `rotate(${angleDeg}deg) translateY(-46%)`,
                      transformOrigin: 'center center'
                    }}
                    className={`absolute text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-amber-400 font-bold scale-110' : 'text-white/30'
                    }`}
                  >
                    {f}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="absolute top-8 inset-x-0 text-center z-10 pointer-events-none px-4 flex justify-center">
          <ScrollCueBadge
            accent={accent}
            text={
              portalShape === 'shutter'
                ? `OBTURADOR 35MM · ${fStops[activeFStopIdx]} (${radiusPct}%) · ROLE PARA ABRIR`
                : `PORTAL ÍRIS CIRCULAR (${radiusPct}%) · ROLE PARA EXPANDIR`
            }
          />
        </div>

        {/* Dynamic Expanding Aperture (Shutter Octagon or Smooth Circle) */}
        <div
          style={{ clipPath: clipPathStyle }}
          className="absolute inset-0 w-full h-full z-20 transition-all duration-75"
        >
          <motion.div style={{ scale: innerScale }} className="w-full h-full">
            <MediaSlot
              imageUrl={block.primaryImage}
              videoUrl={block.primaryVideo}
              alt={block.title}
            />
          </motion.div>
          <div
            style={{ backgroundColor: `rgba(0,0,0,${portalOverlayOpacity})` }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 text-white"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accent }} />
              <span>{block.kicker || 'DESTINATION & NATUREZA'}</span>
            </span>
            <h2
              style={{ fontFamily: hFont }}
              className={`${titleSizeCls} font-normal max-w-4xl break-words px-2`}
            >
              {block.title}
            </h2>
            {block.subtitle && (
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-white/85 max-w-xl px-2">
                {block.subtitle}
              </p>
            )}
            {renderBlockActionButtons(block, site, accent, undefined, false)}
          </div>
        </div>

        {/* Visual Shutter Iris Blades Overlay (visible when shutter is small to medium) */}
        {portalShape === 'shutter' && radiusPct < 70 && (
          <motion.div
            style={{ rotate: bladesRotate }}
            className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center opacity-40"
          >
            <svg
              className="w-[84vw] h-[84vw] sm:w-[70vh] sm:h-[70vh]"
              viewBox="0 0 400 400"
              fill="none"
              stroke="currentColor"
            >
              {Array.from({ length: bladeCount }).map((_, idx) => (
                <line
                  key={idx}
                  x1="200"
                  y1="200"
                  x2={200 + 190 * Math.cos((idx * 2 * Math.PI) / bladeCount)}
                  y2={200 + 190 * Math.sin((idx * 2 * Math.PI) / bladeCount)}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function BlockDarkroomColorDevelop({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'pinned');
  const [developPct, setDevelopPct] = useState(0);
  const imgScale = useTransform(progress, [0, 1], [1.14, 1.0]);

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setDevelopPct(Math.round(Math.min(100, Math.max(0, v * 115))));
    });
    return () => unsub();
  }, [progress]);

  const bg = block.bgColor || '#12100E';
  const txt = block.textColor || '#F5EFE6';
  const accent = block.accentColor || site?.primaryColor || '#D97706';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Lora';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  const grayVal = Math.max(0, 100 - developPct);
  const sepiaVal = block.darkroomBath === 'monochrome_cold' ? 0 : Math.max(0, Math.round((100 - developPct) * 0.78));
  const bathOverlayClass = {
    red_safelight: 'bg-red-950/65',
    amber_vintage: 'bg-amber-950/65',
    cyanotype: 'bg-sky-950/65',
    monochrome_cold: 'bg-zinc-950/65'
  }[block.darkroomBath || 'red_safelight'];

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span style={{ color: accent }} className="text-xs font-mono uppercase tracking-[0.3em] block mb-1">
              {block.kicker || '35MM DARKROOM CHEMICAL DEVELOP'}
            </span>
            <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal`}>
              {block.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-current/20">
              {block.darkroomStageLabel || 'REVELAÇÃO QUÍMICA'}: {developPct}%
            </span>
            {renderBlockActionButtons(block, site, accent, undefined, false)}
          </div>
        </div>

        <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-current/15 shadow-2xl">
          <motion.div
            style={{
              scale: imgScale,
              filter: `grayscale(${grayVal}%) sepia(${sepiaVal}%) contrast(${122 - developPct * 0.2}%)`
            }}
            className="w-full h-full transition-all duration-75"
          >
            <MediaSlot
              imageUrl={block.primaryImage}
              videoUrl={block.primaryVideo}
              alt={block.title}
            />
          </motion.div>

          {/* Darkroom Chemical Bath Overlay that fades out as photo develops */}
          <div
            style={{ opacity: Math.max(0, (75 - developPct) / 100) }}
            className={`absolute inset-0 ${bathOverlayClass} mix-blend-multiply pointer-events-none`}
          />

          <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/90 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl">
            <span>KODAK PORTRA 400 · ISO 400</span>
            <div className="flex items-center gap-3">
              <span>{block.subtitle || 'Role para revelar as cores reais do fotograma'}</span>
              <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  style={{ width: `${developPct}%`, backgroundColor: accent }}
                  className="h-full transition-all duration-75"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlockVogueOverlappingSpread({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'enter-exit');
  const mastheadX = useTransform(progress, [0, 1], ['-6%', '6%']);
  const leftImgY = useTransform(progress, [0, 1], ['16%', '-18%']);
  const rightImgY = useTransform(progress, [0, 1], ['-18%', '18%']);
  const badgeRotate = useTransform(progress, [0, 1], [0, 180]);

  const bg = block.bgColor || '#FFFFFF';
  const txt = block.textColor || '#0A0A0A';
  const accent = block.accentColor || site?.primaryColor || '#111111';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const titleSizeCls = getSectionTitleSizeClass(block, site, '3xl');

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative py-28 md:py-36 px-6 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Giant Editorial Masthead with Scroll Drift */}
        <div className="border-b-2 border-current pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 overflow-hidden">
          <motion.h1
            style={{ fontFamily: hFont, x: mastheadX }}
            className={`${titleSizeCls} font-normal tracking-tight leading-none uppercase break-words max-w-full`}
          >
            {block.title}
          </motion.h1>
          <div className="text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-3" style={{ color: accent }}>
            <motion.span style={{ rotate: badgeRotate }} className="inline-block">
              ✦
            </motion.span>
            <span>{block.kicker || 'EDIÇÃO DE COLECIONADOR'}</span>
          </div>
        </div>

        {/* Asymmetric 2-Page Magazine Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div style={{ y: leftImgY }} className="lg:col-span-7">
            <div className="aspect-[4/5] rounded-none overflow-hidden shadow-2xl">
              <MediaSlot
                imageUrl={block.primaryImage}
                videoUrl={block.primaryVideo}
                alt={block.title}
              />
            </div>
          </motion.div>

          <motion.div style={{ y: rightImgY }} className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p style={{ fontFamily: hFont }} className="text-2xl md:text-3xl italic leading-snug">
                “{block.subtitle || 'Elegância atemporal em cada enquadramento.'}”
              </p>
              <p className="text-sm md:text-base opacity-75 leading-relaxed">
                {block.bodyText || DEFAULT_SCROLLYTELLING_CONFIG.storyText}
              </p>
              {renderBlockActionButtons(block, site, accent, undefined, false)}
            </div>

            <div className="aspect-[3/4] overflow-hidden shadow-xl border border-current/10">
              <img
                src={block.secondaryImage || DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage}
                alt="Editorial Secondary"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MULTI-STYLE INTERACTIVE GALLERY SHOWCASE (5 SELECTABLE GALLERY STYLES)
// ============================================================================
function BlockInteractiveGalleryShowcase({
  block,
  site,
  collections = [],
  onOpenGallery
}: {
  block: ScrollySectionBlock;
  site: any;
  collections?: any[];
  onOpenGallery?: (col: any) => void;
}) {
  const bg = block.bgColor || '#111111';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const rawStyle = (block.galleryStyle as string) || 'editorial_grid';
  const style: ScrollyGalleryStyle =
    rawStyle === 'horizontal_strip'
      ? 'horizontal_lookbook'
      : rawStyle === 'coverflow_3d'
        ? 'contact_sheet_35mm'
        : rawStyle === 'fullscreen_slider'
          ? 'cinema_widescreen'
          : (rawStyle as ScrollyGalleryStyle);

  // Gallery reactive customizations from site and block
  const aspect = site?.galleryShape || block.galleryAspect || 'aspect-[4/3]';
  const titleSizeCls = getSectionTitleSizeClass(block, site, 'xl');

  const kicker =
    site?.galleryKickerText !== undefined && site?.galleryKickerText !== ''
      ? site.galleryKickerText
      : (block.kicker !== undefined ? block.kicker : 'COLEÇÕES & GALERIAS');
  const title = site?.gallerySectionTitle || block.title || 'Portfólio em Destaque';
  const subtitle =
    site?.gallerySectionSubtitle !== undefined
      ? site.gallerySectionSubtitle
      : block.subtitle;

  const cols = site?.galleryColumns || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  const gap = site?.gallerySpacing || 'gap-8';
  const radius = site?.galleryCardRadius || 'rounded-2xl';
  const isOverlay = site?.galleryTextPosition === 'inside_overlay';
  const showBtn = site?.galleryShowButton !== false;
  const btnText = site?.galleryButtonText || 'Ver Galeria';
  const hoverEff = site?.galleryHoverEffect || 'zoom';

  const cardHoverClass = hoverEff === 'lift' ? 'hover:-translate-y-2' : '';
  const imgHoverClass =
    hoverEff === 'grayscale'
      ? 'filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700'
      : 'group-hover:scale-105 transition-transform duration-700';

  // Filter collections if selectedCollectionIds is configured
  const filteredCollections =
    collections && collections.length > 0
      ? (site?.selectedCollectionIds && site.selectedCollectionIds.length > 0
          ? collections.filter((col: any) => site.selectedCollectionIds.includes(String(col.id)))
          : collections)
      : [];
  const effectiveCollections = filteredCollections.length > 0 ? filteredCollections : collections;

  const displayItems =
    effectiveCollections && effectiveCollections.length > 0
      ? effectiveCollections.map((col: any, idx: number) => ({
          id: col.id,
          rawCollection: col,
          url:
            col.image ||
            col.coverImage ||
            (typeof col.media?.[0] === 'string' ? col.media[0] : col.media?.[0]?.url) ||
            DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos[idx % 4].url,
          caption: col.title || `Coleção 0${idx + 1}`,
          subtitle: `${col.category || 'Galeria'} · ${col.date || '2026'}`,
          category: `0${idx + 1}`,
          associationSeals: col.associationSeals || []
        }))
      : (block.items || DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos).map((it, idx) => ({
          id: `item_${idx}`,
          rawCollection: null,
          url: it.url,
          caption: it.caption,
          subtitle: it.subtitle || 'Série Autoral',
          category: `0${idx + 1}`,
          associationSeals: []
        }));

  return (
    <section
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="py-24 md:py-32 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-current/10 pb-6">
          <div>
            {kicker && (
              <span style={{ color: accent }} className="text-xs uppercase tracking-[0.25em] font-bold block mb-2">
                {kicker}
              </span>
            )}
            <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal`}>
              {title}
            </h2>
          </div>
          {subtitle && <p className="text-xs opacity-70 max-w-sm">{subtitle}</p>}
        </div>

        {/* STYLE 1: EDITORIAL GRID */}
        {style === 'editorial_grid' && (
          <div className={`grid ${cols} ${gap}`}>
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className={`group cursor-pointer ${cardHoverClass} transition-all duration-300 ${isOverlay ? '' : 'space-y-3'}`}
              >
                <div className={`${aspect} ${radius} overflow-hidden bg-neutral-900/40 relative shadow-lg`}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className={`w-full h-full object-cover ${imgHoverClass}`}
                    style={{ objectPosition: `${item.rawCollection?.coverPositionX ?? 50}% ${item.rawCollection?.coverPositionY ?? 50}%` }}
                  />

                  {/* Association Seals Badges */}
                  {item.associationSeals && item.associationSeals.length > 0 && (
                    <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 max-w-[75%] pointer-events-none">
                      {item.associationSeals.map((seal: any, sIdx: number) => {
                        const resolvedLogo = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                        return (
                          <div
                            key={seal.id || sIdx}
                            className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-lg text-[9px] font-bold"
                          >
                            {resolvedLogo ? (
                              <img src={resolvedLogo} alt={seal.name} className="w-3.5 h-3.5 rounded object-contain shrink-0" />
                            ) : (
                              <Award className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                            <span className="truncate max-w-[85px]">{seal.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Inside Overlay Mode */}
                  {isOverlay ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end text-white">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 block mb-1">
                            {item.subtitle}
                          </span>
                          <h3 style={{ fontFamily: hFont }} className="text-xl font-normal leading-snug">
                            {item.caption}
                          </h3>
                        </div>
                        {showBtn && (
                          <div
                            style={{ backgroundColor: accent }}
                            className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-md group-hover:scale-105 transition-transform"
                          >
                            <span>{btnText}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    showBtn && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/15 text-white flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:bg-[#D05634] transition-all">
                        <span>{btnText}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    )
                  )}
                </div>

                {/* Below Card Text Mode */}
                {!isOverlay && (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h3 style={{ fontFamily: hFont }} className="text-xl font-normal group-hover:text-[#D05634] transition-colors">
                        {item.caption}
                      </h3>
                      <p className="text-xs opacity-60">{item.subtitle}</p>
                    </div>
                    {showBtn ? (
                      <div
                        style={{ color: accent }}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                      >
                        <span className="hidden sm:inline">{btnText}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* STYLE 2: MASONRY FLOW */}
        {style === 'masonry_flow' && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className={`break-inside-avoid group cursor-pointer ${cardHoverClass} transition-all duration-300 ${isOverlay ? '' : 'space-y-2'}`}
              >
                <div
                  className={`${
                    i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                  } ${radius} overflow-hidden bg-neutral-900/20 shadow-md relative`}
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className={`w-full h-full object-cover ${imgHoverClass}`}
                    style={{ objectPosition: `${item.rawCollection?.coverPositionX ?? 50}% ${item.rawCollection?.coverPositionY ?? 50}%` }}
                  />
                  {isOverlay && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4 flex flex-col justify-end text-white">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-300 block">{item.subtitle}</span>
                          <span className="font-bold text-sm leading-snug">{item.caption}</span>
                        </div>
                        {showBtn && (
                          <div
                            style={{ backgroundColor: accent }}
                            className="shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1"
                          >
                            <span>{btnText}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!isOverlay && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold">{item.caption}</span>
                    <span className="opacity-60">{item.subtitle}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* STYLE 3: HORIZONTAL LOOKBOOK */}
        {style === 'horizontal_lookbook' && (
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
            {displayItems.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className={`w-[75vw] sm:w-[44vw] md:w-[32vw] shrink-0 group cursor-pointer ${cardHoverClass} transition-all duration-300 space-y-3`}
              >
                <div className={`${aspect} overflow-hidden ${radius} bg-neutral-900/20 shadow-xl relative`}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className={`w-full h-full object-cover ${imgHoverClass}`}
                    style={{ objectPosition: `${item.rawCollection?.coverPositionX ?? 50}% ${item.rawCollection?.coverPositionY ?? 50}%` }}
                  />
                  {showBtn && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white border border-white/20">
                      {btnText}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono opacity-50 block">LOOK 0{i + 1}</span>
                    <h3 style={{ fontFamily: hFont }} className="text-lg font-normal">
                      {item.caption}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STYLE 4: CONTACT SHEET 35MM */}
        {style === 'contact_sheet_35mm' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black text-amber-500/90 font-mono border border-white/15">
            {displayItems.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className={`group cursor-pointer p-2 border border-white/10 hover:border-amber-500 transition-colors space-y-2 ${cardHoverClass}`}
              >
                <div className="flex justify-between text-[10px]">
                  <span>KODAK 400</span>
                  <span>{i + 1}A</span>
                </div>
                <div className={`aspect-[4/3] overflow-hidden bg-zinc-900 ${radius}`}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className={`w-full h-full object-cover ${imgHoverClass}`}
                    style={{ objectPosition: `${item.rawCollection?.coverPositionX ?? 50}% ${item.rawCollection?.coverPositionY ?? 50}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-white truncate">{item.caption}</p>
                  {showBtn && (
                    <span className="text-[9px] text-amber-400 font-bold shrink-0">
                      {btnText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STYLE 5: CINEMA WIDESCREEN */}
        {style === 'cinema_widescreen' && (
          <div className="space-y-10">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className={`group relative aspect-[16/9] md:aspect-[21/9] w-full ${radius} overflow-hidden cursor-pointer shadow-2xl ${cardHoverClass}`}
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className={`w-full h-full object-cover ${imgHoverClass}`}
                  style={{ objectPosition: `${item.rawCollection?.coverPositionX ?? 50}% ${item.rawCollection?.coverPositionY ?? 50}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-8 inset-x-8 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/75 block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 style={{ fontFamily: hFont }} className="text-2xl md:text-4xl font-normal">
                      {item.caption}
                    </h3>
                  </div>
                  {showBtn && (
                    <span
                      style={{ backgroundColor: accent }}
                      className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-transform"
                    >
                      <span>{btnText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BlockCtaZoomWhatsapp({
  block,
  site,
  whatsappNumber,
  isEditorPreview,
  onUpdateQuoteConfig,
  onSelectQuoteTab
}: {
  block: ScrollySectionBlock;
  site: any;
  whatsappNumber: string;
  isEditorPreview?: boolean;
  onUpdateQuoteConfig?: (nextCfg: QuoteFormConfig) => void;
  onSelectQuoteTab?: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'enter-exit');
  const scale = useTransform(progress, [0, 1], [1.32, 1.0]);

  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const overlayDarkness = block.overlayOpacity !== undefined ? block.overlayOpacity / 100 : 0.6;
  const titleSizeCls = getSectionTitleSizeClass(block, site, '2xl');

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${site?.photographerName || ''}! Vi seu site e gostaria de verificar disponibilidade de data.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={ref}
      style={{ fontFamily: bFont }}
      className="relative min-h-[95vh] py-20 w-full overflow-hidden flex items-center justify-center"
    >
      <motion.div style={{ scale }} className="absolute inset-0 w-full h-full">
        <MediaSlot
          imageUrl={block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.ctaBackgroundImage}
          videoUrl={block.primaryVideo}
          alt={block.title}
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayDarkness }} />
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 text-center text-white space-y-8">
        {(block.kicker || block.title || block.subtitle) &&
          site?.quoteFormConfig?.layoutPreset !== 'concierge_split' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {block.kicker !== '' && (
                <span className="text-xs uppercase tracking-[0.3em] text-white/80 block">
                  {block.kicker || site?.photographerName}
                </span>
              )}
              {block.title && (
                <h2 style={{ fontFamily: hFont }} className={`${titleSizeCls} font-normal leading-tight break-words px-2`}>
                  {block.title}
                </h2>
              )}
              {block.subtitle && (
                <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">{block.subtitle}</p>
              )}
            </div>
          )}

        {/* Interactive Quote Form Box (Supports Foto 2 Atelier Champagne, Liquid Glass, Drag & Drop, CRM Sync) */}
        {site?.quoteFormConfig?.enabled !== false ? (
          <div className="pt-2">
            <InteractiveQuoteFormBox
              site={site}
              isEditorPreview={isEditorPreview}
              onUpdateConfig={onUpdateQuoteConfig}
              onSelectQuoteTab={onSelectQuoteTab}
              defaultWhatsappNumber={whatsappNumber}
            />
          </div>
        ) : (
          block.showButton !== false && (
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={openWhatsApp}
                style={{ backgroundColor: accent }}
                className="px-8 py-4 rounded-full text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2.5 shadow-2xl hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{block.buttonText || 'Verificar Disponibilidade no WhatsApp'}</span>
              </button>
              {block.secondaryButtonText && (
                <button
                  type="button"
                  onClick={() => triggerBlockDestination(block.secondaryButtonUrl || '#portfolio', site, whatsappNumber)}
                  className="px-6 py-4 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/35 bg-black/35 backdrop-blur-md hover:bg-white/15 transition-colors"
                >
                  {block.secondaryButtonText}
                </button>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}

// ============================================================================
// NEW SECTION 1: CLIENT TESTIMONIALS (WITH EMBEDDED VIDEO & GALLERY LINK)
// ============================================================================
function BlockClientTestimonials({
  block,
  site,
  collections = [],
  onOpenGallery
}: {
  block: ScrollySectionBlock;
  site: any;
  collections?: any[];
  onOpenGallery?: (col: any) => void;
}) {
  const [activeVideoModal, setActiveVideoModal] = useState<ScrollyPhotoItem | null>(null);
  const bg = block.bgColor || '#0C0D10';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const style = block.testimonialStyle || 'video_story_bubbles';
  const items = block.items || [];

  const handleOpenGalleryBySlug = (slug?: string) => {
    if (!slug) return;
    const match = collections.find(
      (c) =>
        c.slug === slug ||
        c.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase()
    );
    if (match && onOpenGallery) {
      onOpenGallery(match);
    } else {
      window.location.href = `/?gallery=${encodeURIComponent(slug)}`;
    }
  };

  return (
    <section
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="py-24 md:py-32 px-6 md:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span style={{ color: accent }} className="text-xs uppercase tracking-[0.3em] font-bold block">
            {block.kicker || 'DEPOIMENTOS DE CASAIS'}
          </span>
          <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
            {block.title}
          </h2>
          {block.subtitle && <p className="text-sm opacity-70 leading-relaxed">{block.subtitle}</p>}
        </div>

        {style === 'video_story_bubbles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl border border-current/10 bg-white/5 backdrop-blur-md relative flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => item.videoUrl ? setActiveVideoModal(item) : null}
                      style={{ borderColor: accent }}
                      className="relative w-16 h-16 rounded-full p-0.5 border-2 cursor-pointer group shrink-0"
                    >
                      <img
                        src={item.avatarUrl || item.url}
                        alt={item.caption}
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {item.videoUrl && (
                        <div
                          style={{ backgroundColor: accent }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 style={{ fontFamily: hFont }} className="text-lg font-bold">
                        {item.caption}
                      </h3>
                      {item.instagramHandle && (
                        <span style={{ color: accent }} className="text-xs font-semibold block">
                          {item.instagramHandle}
                        </span>
                      )}
                      <div className="flex gap-0.5 text-amber-400 mt-1">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 opacity-10 absolute -top-3 -left-2" />
                    <p className="text-sm opacity-85 italic leading-relaxed pt-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden relative group">
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveVideoModal(item)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white gap-2 font-bold text-xs uppercase tracking-wider group-hover:bg-black/20 transition-colors"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>Ver Depoimento em Vídeo</span>
                      </button>
                    )}
                  </div>

                  {item.gallerySlug && (
                    <button
                      type="button"
                      onClick={() => handleOpenGalleryBySlug(item.gallerySlug)}
                      style={{ color: accent, borderColor: accent }}
                      className="w-full py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver Galeria de Fotos do Casal</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {style === 'editorial_quotes_split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {items[0] && (
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-[0.3em] font-mono opacity-60">DEPOIMENTO EM DESTAQUE</span>
                <p style={{ fontFamily: hFont }} className="text-2xl sm:text-4xl font-normal italic leading-snug">
                  {items[0].subtitle}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-current/15">
                  <img src={items[0].avatarUrl || items[0].url} alt={items[0].caption} className="w-12 h-12 rounded-full object-cover border border-current/20" />
                  <div>
                    <h4 style={{ fontFamily: hFont }} className="text-lg font-bold">{items[0].caption}</h4>
                    <span style={{ color: accent }} className="text-xs font-semibold">{items[0].instagramHandle}</span>
                  </div>
                </div>
                {items[0].gallerySlug && (
                  <button
                    type="button"
                    onClick={() => handleOpenGalleryBySlug(items[0].gallerySlug)}
                    style={{ backgroundColor: accent }}
                    className="px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-lg"
                  >
                    <span>Ver Galeria Publicada de {items[0].caption}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {items[0] && (
              <div className="aspect-[4/3] rounded-3xl overflow-hidden relative shadow-2xl border border-current/15">
                <MediaSlot imageUrl={items[0].url} videoUrl={items[0].videoUrl} alt={items[0].caption} />
              </div>
            )}
          </div>
        )}

        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-neutral-900 border border-white/20 shadow-2xl space-y-4">
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-[16/9] bg-black">
                <video src={activeVideoModal.videoUrl} poster={activeVideoModal.url} controls autoPlay className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-white space-y-2">
                <h3 style={{ fontFamily: hFont }} className="text-2xl font-bold">{activeVideoModal.caption}</h3>
                <p className="text-sm opacity-80">{activeVideoModal.subtitle}</p>
                {activeVideoModal.gallerySlug && (
                  <button
                    type="button"
                    onClick={() => {
                      const slug = activeVideoModal.gallerySlug;
                      setActiveVideoModal(null);
                      handleOpenGalleryBySlug(slug);
                    }}
                    style={{ backgroundColor: accent }}
                    className="mt-4 px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2"
                  >
                    <span>Abrir Galeria de Fotos Completa</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// NEW SECTION 2: INSTAGRAM FEED & BANNER PROFILE
// ============================================================================
function BlockInstagramFeedBanner({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const bg = block.bgColor || '#09090B';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#E11D48';
  const hFont = block.headingFont || site?.headingFont || 'Outfit';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const handle = block.instagramHandle || site?.socialLinks?.instagram || '@seuinstagram';
  const instaUrl = block.instagramUrl || `https://instagram.com/${handle.replace('@', '')}`;
  const items = block.items || [];

  return (
    <section
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="py-24 md:py-32 px-6 md:px-16 relative overflow-hidden border-t border-b border-current/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-current/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2 mb-2" style={{ color: accent }}>
              <Instagram className="w-4 h-4" />
              <span>{block.kicker || 'INSTAGRAM FEED & BASTIDORES'}</span>
            </span>
            <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {handle}
            </h2>
            {block.subtitle && <p className="text-xs opacity-70 mt-1">{block.subtitle}</p>}
          </div>

          <a
            href={instaUrl}
            target="_blank"
            rel="noreferrer"
            style={{ backgroundColor: accent }}
            className="px-6 py-3 rounded-full text-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2.5 shadow-xl hover:scale-105 transition-transform self-start sm:self-auto"
          >
            <Instagram className="w-4 h-4" />
            <span>{block.buttonText || 'Siga no Instagram'}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={instaUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 shadow-lg border border-current/10"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white text-xs">
                <Instagram className="w-4 h-4 mb-auto text-amber-400" />
                <p className="font-semibold line-clamp-2 text-[11px]">{item.caption}</p>
                <span className="text-[10px] opacity-75 font-mono mt-1">{item.subtitle || 'Instagram Post'}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// NEW SECTION 3: CUSTOM FOOTER SECTION & ASSOCIATION SEALS
// ============================================================================
export function BlockCustomFooterSection({
  block,
  site
}: {
  block: ScrollySectionBlock;
  site: any;
}) {
  const bg = block.bgColor || '#050505';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';

  const paddingSize = block.footerPaddingSize || 'normal';
  const paddingCls =
    paddingSize === 'compact'
      ? 'py-8 md:py-10'
      : paddingSize === 'large'
        ? 'py-20 md:py-24'
        : paddingSize === 'monumental'
          ? 'py-28 md:py-36'
          : 'py-14 md:py-16';

  const activeEffect = block.footerEffect || 'editorial_big_typography';

  const layout =
    block.footerLayout ||
    (activeEffect === 'columns_3_luxury'
      ? 'columns_3'
      : activeEffect === 'minimal_bar'
        ? 'minimal_row'
        : activeEffect === 'curtain_parallax_bg'
          ? 'centered_stack'
          : 'editorial_split');

  const textAlign =
    block.footerTextAlign || (layout === 'centered_stack' ? 'center' : 'left');
  const socialPos = block.footerSocialPosition || 'middle';
  const bottomLayout =
    block.footerBottomLayout || (layout === 'centered_stack' ? 'centered' : 'split');

  const showKicker = block.showFooterKicker !== false;
  const showTitle = block.showFooterTitle !== false;
  const showSubtitle = block.showFooterSubtitle !== false;
  const showSeals = block.showAssociationSeals !== false;
  const showSocials = block.showFooterSocials !== false;
  const showCopyright = block.showFooterCopyright !== false;
  const showCredits = block.showFooterCredits !== false;
  const showBackToTop = block.showBackToTop !== false;

  const titleScale = block.titleSize || 'xl';
  const titleSizeClass =
    titleScale === 'lg'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : titleScale === 'xl'
        ? 'text-2xl sm:text-4xl md:text-5xl'
        : titleScale === '2xl'
          ? 'text-3xl sm:text-5xl md:text-6xl'
          : titleScale === '3xl'
            ? 'text-4xl sm:text-6xl md:text-7xl'
            : 'text-5xl sm:text-7xl md:text-8xl';

  const textAlignCls =
    textAlign === 'center'
      ? 'text-center items-center'
      : textAlign === 'right'
        ? 'text-right items-end'
        : 'text-left items-start';

  // Resolve social links from block or site.socialLinks
  const rawInsta =
    block.footerInstagramUrl !== undefined
      ? block.footerInstagramUrl
      : site?.socialLinks?.instagram || '';
  const instaHref = rawInsta
    ? rawInsta.startsWith('http')
      ? rawInsta
      : `https://instagram.com/${rawInsta.replace('@', '').trim()}`
    : '';

  const rawWa =
    block.footerWhatsappUrl !== undefined
      ? block.footerWhatsappUrl
      : site?.socialLinks?.whatsapp || '';
  const waHref = rawWa
    ? rawWa.startsWith('http')
      ? rawWa
      : `https://wa.me/${rawWa.replace(/\D/g, '')}`
    : '';

  const rawYoutube =
    block.footerYoutubeUrl !== undefined
      ? block.footerYoutubeUrl
      : site?.socialLinks?.youtube || '';
  const youtubeHref = rawYoutube
    ? rawYoutube.startsWith('http')
      ? rawYoutube
      : `https://${rawYoutube}`
    : '';

  const rawFacebook =
    block.footerFacebookUrl !== undefined
      ? block.footerFacebookUrl
      : site?.socialLinks?.facebook || '';
  const facebookHref = rawFacebook
    ? rawFacebook.startsWith('http')
      ? rawFacebook
      : `https://facebook.com/${rawFacebook.replace('@', '').trim()}`
    : '';

  const rawEmail =
    block.footerEmail !== undefined
      ? block.footerEmail
      : site?.socialLinks?.email || site?.contactEmail || '';
  const emailHref = rawEmail
    ? rawEmail.startsWith('mailto:')
      ? rawEmail
      : `mailto:${rawEmail.trim()}`
    : '';

  const socialItems = [
    instaHref && {
      id: 'instagram',
      label: 'Instagram',
      href: instaHref,
      icon: <Instagram className="w-4 h-4" />
    },
    waHref && {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: waHref,
      icon: <MessageCircle className="w-4 h-4" />
    },
    youtubeHref && {
      id: 'youtube',
      label: 'YouTube',
      href: youtubeHref,
      icon: <Play className="w-4 h-4" />
    },
    facebookHref && {
      id: 'facebook',
      label: 'Facebook',
      href: facebookHref,
      icon: <Share2 className="w-4 h-4" />
    },
    emailHref && {
      id: 'email',
      label: 'E-mail',
      href: emailHref,
      icon: <Globe className="w-4 h-4" />
    }
  ].filter(Boolean) as Array<{ id: string; label: string; href: string; icon: React.ReactNode }>;

  // Default fallback social icons if showSocials is enabled and user hasn't filled links yet
  const activeSocialItems =
    socialItems.length > 0
      ? socialItems
      : [
          {
            id: 'instagram',
            label: 'Instagram',
            href: 'https://instagram.com',
            icon: <Instagram className="w-4 h-4" />
          },
          {
            id: 'whatsapp',
            label: 'WhatsApp',
            href: 'https://wa.me/5511999999999',
            icon: <MessageCircle className="w-4 h-4" />
          }
        ];

  const renderSocialIcons = (justifyCls = '') => {
    if (!showSocials) return null;
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${justifyCls}`}>
        {activeSocialItems.map((soc) => (
          <a
            key={soc.id}
            href={soc.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={soc.label}
            style={{ borderColor: `${txt}26` }}
            className="px-3.5 py-2 rounded-full border bg-white/5 hover:bg-white/10 transition-all inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
          >
            <span style={{ color: accent }}>{soc.icon}</span>
            <span>{soc.label}</span>
          </a>
        ))}
      </div>
    );
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const viewport = (e.currentTarget as HTMLElement).closest(
      '[data-scrolly-viewport="true"]'
    ) as HTMLElement | null;
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSeals: Array<{ id?: string; name: string; iconUrl?: string; badgeText?: string }> =
    site?.associationSeals && site.associationSeals.length > 0
      ? site.associationSeals.map((s: any) => ({
          id: s.id,
          name: (s.name || '').toUpperCase(),
          badgeText: s.badgeText,
          iconUrl: getAssociationSealLogoUrl(s.id || s.name, s.iconUrl)
        }))
      : [
          {
            id: 'inspiration',
            name: 'INSPIRATION PHOTOGRAPHERS',
            iconUrl: '/assets/aistudio/inspiration_40193d94.svg'
          },
          {
            id: 'bride',
            name: 'BRIDE ASSOCIATION',
            iconUrl: '/assets/aistudio/bride_85fd23f6.svg'
          },
          {
            id: 'fearless',
            name: 'FEARLESS PHOTOGRAPHERS',
            iconUrl: '/assets/aistudio/fearless_c43f2310.svg'
          }
        ];

  const marqueePhrase =
    block.marqueeTopText ||
    `${block.title || site?.photographerName || site?.title || 'SEU NOME'} · ${
      block.kicker || 'ESTÚDIO AUTORAL'
    } · ${block.subtitle || site?.geoCity || 'FOTOGRAFIA ATEMPORAL'}`;
  const marqueeOpacity = (block.marqueeOpacity !== undefined ? block.marqueeOpacity : 22) / 100;

  const instaHandle =
    block.instagramHandle || site?.socialLinks?.instagram || '@seuinstagram';
  const instaStripUrl =
    instaHref || `https://instagram.com/${instaHandle.replace('@', '').trim()}`;
  const instaItems =
    block.items && block.items.length > 0
      ? block.items.slice(0, 6)
      : [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 01'
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 02'
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 03'
          },
          {
            url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 04'
          },
          {
            url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 05'
          },
          {
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
            caption: 'Instagram 06'
          }
        ];

  const bgImage =
    block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.ctaBackgroundImage;
  const bgOverlayOpacity =
    (block.overlayOpacity !== undefined ? block.overlayOpacity : 75) / 100;

  return (
    <footer
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className={`${paddingCls} px-6 md:px-16 border-t border-current/15 relative overflow-hidden transition-all`}
    >
      {/* EFEITO INTERNO 1: FUNDO FOTOGRÁFICO + MÁSCARA ESCURA (CURTAIN PARALLAX BG) */}
      {activeEffect === 'curtain_parallax_bg' && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <MediaSlot
            imageUrl={bgImage}
            videoUrl={block.primaryVideo}
            alt={block.title || 'Rodapé'}
            className="w-full h-full object-cover scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bg, opacity: bgOverlayOpacity }}
          />
        </div>
      )}

      {/* EFEITO INTERNO 2: MARQUEE CINÉTICO INFINITO NO RODAPÉ */}
      {activeEffect === 'marquee_kinetic' && (
        <div
          style={{ opacity: marqueeOpacity }}
          className="relative z-10 w-full overflow-hidden py-3 mb-8 border-y border-current/15 select-none pointer-events-none"
        >
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration:
                block.curtainSpeed === 'fast'
                  ? 16
                  : block.curtainSpeed === 'slow'
                    ? 36
                    : 24
            }}
            style={{ fontFamily: hFont }}
            className="flex whitespace-nowrap text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider font-normal"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <span key={idx} className="mx-6">
                {marqueePhrase} ·
              </span>
            ))}
          </motion.div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* EFEITO INTERNO 3: FAIXA DO INSTAGRAM INTEGRADA DENTRO DO RODAPÉ */}
        {activeEffect === 'instagram_strip' && (
          <div className="pb-8 border-b border-current/15 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4" style={{ color: accent }} />
                <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold">
                  INSTAGRAM · {instaHandle}
                </span>
              </div>
              <a
                href={instaStripUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: accent }}
                className="px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-2 self-start sm:self-auto hover:opacity-95 transition-opacity"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{block.buttonText || 'Siga no Instagram'}</span>
              </a>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {instaItems.map((item, idx) => (
                <a
                  key={idx}
                  href={instaStripUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-current/10"
                >
                  <img
                    src={item.url}
                    alt={item.caption || `Instagram ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* POSIÇÃO DOS ÍCONES SOCIAIS: TOPO */}
        {socialPos === 'top' && showSocials && (
          <div
            className={`pb-6 border-b border-current/10 flex ${
              textAlign === 'center'
                ? 'justify-center'
                : textAlign === 'right'
                  ? 'justify-end'
                  : 'justify-start'
            }`}
          >
            {renderSocialIcons()}
          </div>
        )}

        {/* LAYOUT 1: EDITORIAL SPLIT (ESQUERDA / DIREITA) */}
        {layout === 'editorial_split' && (
          <div className="border-b border-current/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className={`flex flex-col ${textAlignCls} space-y-2`}>
              {showKicker && (
                <span
                  style={{ color: accent }}
                  className="text-xs uppercase tracking-[0.35em] font-mono font-bold block"
                >
                  {block.kicker || 'ESTÚDIO AUTORAL'}
                </span>
              )}
              {showTitle && (
                <h2
                  style={{ fontFamily: hFont }}
                  className={`${titleSizeClass} font-normal uppercase tracking-tight break-words leading-none`}
                >
                  {block.title || site?.photographerName || site?.title || 'Seu Nome'}
                </h2>
              )}
            </div>

            <div className="flex flex-col md:items-end gap-4">
              {showSubtitle && (
                <p className="text-xs opacity-75 font-mono uppercase tracking-widest max-w-sm md:text-right">
                  {block.subtitle || site?.geoCity || 'São Paulo · Brasil & Destination Weddings'}
                </p>
              )}
              {socialPos === 'middle' && renderSocialIcons('md:justify-end')}
            </div>
          </div>
        )}

        {/* LAYOUT 2: CENTERED STACK (TUDO CENTRALIZADO) */}
        {layout === 'centered_stack' && (
          <div className="border-b border-current/15 pb-10 flex flex-col items-center text-center space-y-4">
            {showKicker && (
              <span
                style={{ color: accent }}
                className="text-xs uppercase tracking-[0.35em] font-mono font-bold block"
              >
                {block.kicker || 'ESTÚDIO AUTORAL'}
              </span>
            )}
            {showTitle && (
              <h2
                style={{ fontFamily: hFont }}
                className={`${titleSizeClass} font-normal uppercase tracking-tight break-words leading-none`}
              >
                {block.title || site?.photographerName || site?.title || 'Seu Nome'}
              </h2>
            )}
            {showSubtitle && (
              <p className="text-xs opacity-75 font-mono uppercase tracking-widest max-w-lg">
                {block.subtitle || site?.geoCity || 'São Paulo · Brasil & Destination Weddings'}
              </p>
            )}
            {socialPos === 'middle' && <div className="pt-2">{renderSocialIcons('justify-center')}</div>}
          </div>
        )}

        {/* LAYOUT 3: 3 COLUNAS DISTRIBUÍDAS */}
        {layout === 'columns_3' && (
          <div className="border-b border-current/15 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-2">
              {showKicker && (
                <span
                  style={{ color: accent }}
                  className="text-[11px] uppercase tracking-[0.3em] font-mono font-bold block"
                >
                  {block.kicker || 'ESTÚDIO AUTORAL'}
                </span>
              )}
              {showTitle && (
                <h2
                  style={{ fontFamily: hFont }}
                  className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-tight break-words"
                >
                  {block.title || site?.photographerName || site?.title || 'Seu Nome'}
                </h2>
              )}
            </div>

            <div className="space-y-2 md:text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-50 font-mono block">
                LOCALIZAÇÃO & ATENDIMENTO
              </span>
              {showSubtitle && (
                <p className="text-xs opacity-80 font-mono uppercase tracking-widest">
                  {block.subtitle || site?.geoCity || 'São Paulo · Brasil & Destination Weddings'}
                </p>
              )}
            </div>

            <div className="space-y-2 md: flex md:flex-col md:items-end">
              {socialPos === 'middle' && renderSocialIcons('md:justify-end')}
            </div>
          </div>
        )}

        {/* LAYOUT 4: FAIXA HORIZONTAL MINIMALISTA */}
        {layout === 'minimal_row' && (
          <div className="border-b border-current/15 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {showTitle && (
                <h2
                  style={{ fontFamily: hFont }}
                  className="text-xl sm:text-2xl font-bold uppercase tracking-wider"
                >
                  {block.title || site?.photographerName || site?.title || 'Seu Nome'}
                </h2>
              )}
              {showKicker && (
                <span
                  style={{ color: accent }}
                  className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold"
                >
                  {block.kicker}
                </span>
              )}
              {showSubtitle && (
                <span className="text-xs opacity-65 font-mono">
                  {block.subtitle || site?.geoCity}
                </span>
              )}
            </div>
            {socialPos === 'middle' && renderSocialIcons()}
          </div>
        )}

        {/* SELOS DE ASSOCIAÇÕES */}
        {showSeals && (
          <div className={`pt-1 flex flex-col ${textAlignCls}`}>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50 block mb-4">
              MEMBRO E CREDENCIADO PELAS ASSOCIAÇÕES INTERNACIONAIS:
            </span>
            <div
              className={`flex flex-wrap items-center gap-3 sm:gap-5 opacity-95 ${
                textAlign === 'center'
                  ? 'justify-center'
                  : textAlign === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              }`}
            >
              {activeSeals.map((seal, idx: number) => {
                const logoUrl = getAssociationSealLogoUrl(seal.id || seal.name, seal.iconUrl);
                return (
                  <div
                    key={seal.id || idx}
                    className="px-3.5 py-2 rounded-xl border border-current/20 text-xs font-mono font-bold flex items-center gap-2.5"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={seal.name}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-contain shrink-0"
                      />
                    ) : idx % 3 === 0 ? (
                      <Award className="w-4 h-4" style={{ color: accent }} />
                    ) : idx % 3 === 1 ? (
                      <ShieldCheck className="w-4 h-4" style={{ color: accent }} />
                    ) : (
                      <Star className="w-4 h-4" style={{ color: accent }} />
                    )}
                    <span>{seal.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BARRA INFERIOR: COPYRIGHT, REDES SOCIAIS (SE BOTTOM), CRÉDITOS & VOLTAR AO TOPO */}
        {(showCopyright || showCredits || showBackToTop || (socialPos === 'bottom' && showSocials)) && (
          <div
            className={`pt-4 flex flex-col gap-4 text-xs opacity-75 font-mono ${
              bottomLayout === 'centered'
                ? 'items-center text-center'
                : bottomLayout === 'reverse'
                  ? 'sm:flex-row-reverse items-center justify-between'
                  : 'sm:flex-row items-center justify-between'
            }`}
          >
            {showCopyright && (
              <p>
                {block.copyrightText ||
                  `© ${new Date().getFullYear()} ${
                    site?.photographerName || site?.title || 'Seu Nome'
                  }. Todos os direitos reservados.`}
              </p>
            )}

            {socialPos === 'bottom' && showSocials && renderSocialIcons()}

            <div className="flex flex-wrap items-center gap-5">
              {showCredits && (
                <span className="opacity-80">
                  {block.footerCreditsText || 'Powered by Frame+ Pro Studio'}
                </span>
              )}
              {showBackToTop && (
                <button
                  type="button"
                  onClick={handleScrollToTop}
                  style={{ color: accent }}
                  className="hover:underline uppercase tracking-widest font-bold cursor-pointer"
                >
                  {block.backToTopText || 'Voltar ao Topo ↑'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

// ============================================================================
// MASTER MODULAR SCROLLYTELLING COMPOSER (Renders Mixed & Matched Sections)
// IMPORTANT: Never place overflow-x-hidden on this root wrapper, so CSS
// `position: sticky` inside every Scrollytelling section works 100% natively!
// ============================================================================
export function ModularScrollytellingComposer({
  site,
  config,
  collections = [],
  onOpenGallery,
  onSelectSection,
  selectedSectionId,
  onUpdateQuoteConfig,
  onSelectQuoteTab
}: {
  site: any;
  config: Required<ScrollytellingConfig>;
  collections?: any[];
  onOpenGallery?: (col: any) => void;
  onNavigateSection?: (sec: string) => void;
  onSelectSection?: (secId: string) => void;
  selectedSectionId?: string | null;
  onUpdateQuoteConfig?: (nextCfg: QuoteFormConfig) => void;
  onSelectQuoteTab?: () => void;
}) {
  const composerRef = useRef<HTMLDivElement | null>(null);

  const activeThemeId: ScrollytellingThemeId =
    site?.scrollytellingThemeId || site?.theme_id || 'lumina-editorial';

  const sections =
    config.sections && config.sections.length > 0
      ? config.sections.filter((s) => s.visible !== false)
      : getThemePresetSections(activeThemeId === 'classic' ? 'lumina-editorial' : activeThemeId, site);

  // Whenever the user switches theme, scroll the viewport to the top so they see the Hero immediately
  useEffect(() => {
    const viewport = composerRef.current?.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeThemeId]);

  return (
    <div ref={composerRef} className="w-full relative">
      {sections.map((block, idx) => {
        const renderBlock = () => {
          switch (block.type as string) {
            case 'hero_curtain_reveal':
              return (
                <BlockHeroCurtainReveal
                  block={block}
                  site={site}
                  whatsappNumber={config.whatsappNumber}
                />
              );
            case 'sticky_story_split':
              return <BlockStickyStorySplit block={block} site={site} />;
            case 'horizontal_filmstrip':
              return <BlockHorizontalFilmstrip block={block} site={site} />;
            case 'hero_3d_perspective':
              return <BlockHero3DPerspective block={block} site={site} />;
            case 'card_stacking_album':
              return (
                <BlockCardStackingAlbum
                  block={block}
                  site={site}
                  collections={collections}
                  onOpenGallery={onOpenGallery}
                />
              );
            case 'manifesto_word_reveal':
              return <BlockManifestoWordReveal block={block} site={site} />;
            case 'bento_zoom_mosaic':
              return <BlockBentoZoomMosaic block={block} site={site} />;
            case 'before_after_grading':
              return <BlockBeforeAfterGrading block={block} site={site} />;
            case 'floating_masonry_3col':
            case 'masonry_flow_editorial':
              return <BlockFloatingMasonry3Col block={block} site={site} />;
            case 'layered_pinning_chapters':
              return <BlockLayeredPinningChapters block={block} site={site} />;
            case 'koreo_split_curtain':
            case 'hero_bipartite_curtain':
              return <BlockKoreoSplitCurtain block={block} site={site} />;
            case 'circle_iris_portal':
              return <BlockCircleIrisPortal block={block} site={site} />;
            case 'darkroom_color_develop':
              return <BlockDarkroomColorDevelop block={block} site={site} />;
            case 'vogue_overlapping_spread':
              return <BlockVogueOverlappingSpread block={block} site={site} />;
            case 'interactive_gallery_showcase':
              return (
                <BlockInteractiveGalleryShowcase
                  block={block}
                  site={site}
                  collections={collections}
                  onOpenGallery={onOpenGallery}
                />
              );
            case 'client_testimonials':
              return (
                <BlockClientTestimonials
                  block={block}
                  site={site}
                  collections={collections}
                  onOpenGallery={onOpenGallery}
                />
              );
            case 'instagram_feed_banner':
              return <BlockInstagramFeedBanner block={block} site={site} />;
            case 'custom_footer_section':
              return <BlockCustomFooterSection block={block} site={site} />;
            case 'cta_zoom_whatsapp':
            default:
              return (
                <BlockCtaZoomWhatsapp
                  block={block}
                  site={site}
                  whatsappNumber={config.whatsappNumber}
                  isEditorPreview={Boolean(onSelectSection)}
                  onUpdateQuoteConfig={onUpdateQuoteConfig}
                  onSelectQuoteTab={onSelectQuoteTab}
                />
              );
          }
        };

        const isSelected = Boolean(onSelectSection && selectedSectionId === block.id);

        return (
          <div
            key={block.id}
            id={`scrolly-sec-${block.id}`}
            data-section-id={block.id}
            data-section-type={block.type}
            onClick={(e) => {
              if (onSelectSection) {
                e.stopPropagation();
                onSelectSection(block.id);
              }
            }}
            className={`scroll-mt-20 md:scroll-mt-24 ${
              onSelectSection
                ? `relative cursor-pointer group/dobra transition-all ${
                    isSelected
                      ? 'ring-2 ring-inset ring-[#D05634]/80'
                      : 'hover:ring-2 hover:ring-inset hover:ring-[#D05634]/45'
                  }`
                : 'relative'
            }`}
          >
            {onSelectSection && (
              <div
                className={`absolute top-4 right-4 z-40 pointer-events-none px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D05634] text-white border-white/25 opacity-100'
                    : 'bg-black/80 text-white border-white/15 opacity-0 group-hover/dobra:opacity-100'
                }`}
              >
                <span>
                  {getSectionNavLabel(block, idx).toUpperCase()}
                </span>
              </div>
            )}
            {(block.titleColor || block.buttonBgColor || block.buttonTextColor) && (
              <style>{`
                ${
                  block.titleColor
                    ? `#scrolly-sec-${block.id} h1, #scrolly-sec-${block.id} h2, #scrolly-sec-${block.id} h3 { color: ${block.titleColor} !important; }`
                    : ''
                }
                ${
                  block.buttonBgColor
                    ? `#scrolly-sec-${block.id} a.rounded-full, #scrolly-sec-${block.id} button.rounded-full { background-color: ${block.buttonBgColor} !important; border-color: ${block.buttonBgColor} !important; }`
                    : ''
                }
                ${
                  block.buttonTextColor
                    ? `#scrolly-sec-${block.id} a.rounded-full, #scrolly-sec-${block.id} button.rounded-full, #scrolly-sec-${block.id} a.rounded-full span, #scrolly-sec-${block.id} button.rounded-full span { color: ${block.buttonTextColor} !important; }`
                    : ''
                }
              `}</style>
            )}
            {renderBlock()}
          </div>
        );
      })}
    </div>
  );
}

// Keep individual named exports pointing to ModularScrollytellingComposer for compatibility
export const LuminaEditorialTheme = ModularScrollytellingComposer;
export const NoirCinemaTheme = ModularScrollytellingComposer;
export const AtelierMinimalTheme = ModularScrollytellingComposer;
export const LayeredPinningTheme = ModularScrollytellingComposer;

