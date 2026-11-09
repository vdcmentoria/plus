import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Sliders,
  Film,
  Sparkles,
  Camera,
  Play,
  Pause
} from 'lucide-react';

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
  | 'cta_zoom_whatsapp';

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
}

export interface ScrollySectionBlock {
  id: string;
  type: ScrollySectionType;
  sourceThemeName: string;
  visible: boolean;
  kicker?: string;
  title: string;
  subtitle?: string;
  bodyText?: string;
  buttonText?: string;
  headingFont?: string;
  bodyFont?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  primaryImage?: string;
  primaryVideo?: string;
  secondaryImage?: string;
  galleryStyle?: ScrollyGalleryStyle;
  galleryAspect?: 'aspect-[3/4]' | 'aspect-[4/3]' | 'aspect-square' | 'aspect-[16/9]';
  items?: ScrollyPhotoItem[];
}

export interface ScrollytellingConfig {
  smoothScroll?: boolean;
  sectionsThemeId?: ScrollytellingThemeId;
  sections?: ScrollySectionBlock[];
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
    label: 'Portal Circular Íris (Circle Reveal)',
    originTheme: 'Horizon Parallax',
    desc: 'Círculo central que expande até revelar o cenário panorâmico completo'
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
    originTheme: 'Multi-Tema',
    desc: 'Exibe suas coleções em Grid, Masonry, Lookbook Horizontal, Folha 35mm ou Cinema'
  },
  {
    type: 'cta_zoom_whatsapp',
    label: 'Encerramento Zoom-Out & WhatsApp',
    originTheme: 'Universal',
    desc: 'Foto de fundo em zoom-out suave com botão direto para orçamento no WhatsApp'
  }
];

export const DEFAULT_SCROLLYTELLING_CONFIG: Required<ScrollytellingConfig> = {
  smoothScroll: true,
  sectionsThemeId: 'lumina-editorial',
  sections: [],
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
  whatsappNumber: '5511999999999'
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
        subtitle: 'Expansão circular guiada pela rolagem',
        headingFont: hFont,
        bodyFont: bFont,
        bgColor: themeOverride?.bgColor || '#07090E',
        textColor: '#FFFFFF',
        accentColor: brandAccent,
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

  switch (themeId) {
    case 'lumina-editorial':
      return [
        createSectionFromTemplate('hero_curtain_reveal', site, ov),
        createSectionFromTemplate('sticky_story_split', site, ov),
        createSectionFromTemplate('horizontal_filmstrip', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          galleryStyle: 'editorial_grid'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];

    case 'noir-cinema':
      return [
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

    case 'atelier-minimal':
      return [
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

    case 'layered-pinning':
      return [
        createSectionFromTemplate('layered_pinning_chapters', site, ov),
        {
          ...createSectionFromTemplate('interactive_gallery_showcase', site, ov),
          bgColor: '#0B0B0B',
          textColor: '#FFFFFF',
          galleryStyle: 'editorial_grid'
        },
        createSectionFromTemplate('cta_zoom_whatsapp', site, ov)
      ];

    case 'koreo-kinetic':
      return [
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

    case 'prism-webgl':
      return [
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

    case 'analog-chronicle':
      return [
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

    case 'vogue-runway':
      return [
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

    case 'horizon-parallax':
    default:
      return [
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
  }
}

export function resolveScrollyConfig(site: any): Required<ScrollytellingConfig> {
  const custom: ScrollytellingConfig = site?.scrollytellingConfig || {};
  const activeThemeId: ScrollytellingThemeId =
    site?.scrollytellingThemeId || site?.theme_id || 'lumina-editorial';

  const safeThemeId = activeThemeId === 'classic' ? 'lumina-editorial' : activeThemeId;

  // Use custom sections ONLY if they explicitly match the currently active theme
  const hasMatchingSections = Boolean(
    custom.sections &&
      custom.sections.length > 0 &&
      custom.sectionsThemeId === safeThemeId
  );

  const resolvedSections = hasMatchingSections
    ? custom.sections!
    : getThemePresetSections(safeThemeId, site);

  return {
    ...DEFAULT_SCROLLYTELLING_CONFIG,
    ...custom,
    sectionsThemeId: safeThemeId,
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
  const maskWidth = useTransform(progress, [0, 0.82], ['44%', '100%']);
  const maskHeight = useTransform(progress, [0, 0.82], ['54%', '100%']);
  const maskRadius = useTransform(progress, [0, 0.82], ['32px', '0px']);
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
            className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.04]"
          >
            {block.title}
          </h1>
          {block.subtitle && (
            <p className="mt-4 text-sm sm:text-base opacity-75 max-w-xl mx-auto">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
            <ScrollCueBadge accent={accent} text="CORTINA EDITORIAL · ROLE PARA EXPANDIR" />
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
            <button
              type="button"
              onClick={() =>
                window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer')
              }
              style={{ backgroundColor: accent }}
              className="px-6 py-3.5 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl"
            >
              <span>Consultar Agenda</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
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
  const colOddY = useTransform(progress, [0, 1], ['16%', '-22%']);
  const colEvenY = useTransform(progress, [0, 1], ['34%', '-34%']);
  const progressScaleX = useTransform(progress, [0.1, 0.9], [0, 1]);

  const bg = block.bgColor || '#F7F4EF';
  const txt = block.textColor || '#141413';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';
  const photos = block.items && block.items.length > 0 ? block.items : DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative py-28 md:py-36 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: accent }}>
            {block.kicker || 'NARRATIVA VISUAL'}
          </div>
          <h2 style={{ fontFamily: hFont }} className="text-4xl md:text-5xl font-normal leading-[1.12]">
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

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
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
            <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
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
  const cardRotateX = useTransform(progress, [0, 0.75], [26, 0]);
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

  const sideImg1 = DEFAULT_SCROLLYTELLING_CONFIG.manifestoLeftImage;
  const sideImg2 = DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage;

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div
        style={{ perspective: '1200px' }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-6"
      >
        {/* Background Giant Kinetic Typography */}
        <motion.div
          style={{ y: bgTitleY, scale: bgTitleScale, opacity: bgTitleOpacity, fontFamily: hFont }}
          className="absolute inset-x-0 text-center pointer-events-none select-none"
        >
          <span className="text-[13vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap">
            {site?.photographerName || block.title}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
            <ScrollCueBadge accent={accent} text="PERSPECTIVA 3D · ROLE PARA MERGULHAR" />
          </div>

          <div className="absolute bottom-8 inset-x-8 text-center text-white space-y-2">
            <span style={{ color: accent }} className="text-[10px] uppercase tracking-[0.35em] font-bold block">
              {block.kicker || 'NOIR CINEMA 3D'}
            </span>
            <h1 style={{ fontFamily: hFont }} className="text-2xl md:text-4xl font-normal tracking-wide">
              {block.title}
            </h1>
            {block.subtitle && <p className="text-xs text-neutral-300 line-clamp-2">{block.subtitle}</p>}
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
  const cards =
    block.items && block.items.length > 0
      ? block.items
      : DEFAULT_SCROLLYTELLING_CONFIG.stackedProjects;

  return (
    <section style={{ backgroundColor: bg, color: txt, fontFamily: bFont }} className="relative">
      <div className="py-16 px-6 md:px-16 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between border-b border-current/10 gap-4">
        <div>
          <span style={{ color: accent }} className="text-xs uppercase tracking-[0.3em] font-bold block mb-1">
            {block.kicker || 'EXPOSIÇÃO EM CAMADAS (CARD STACKING)'}
          </span>
          <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
            {block.title}
          </h2>
        </div>
        <span className="text-xs uppercase tracking-widest opacity-60">
          {block.subtitle || 'Role para empilhar os álbuns'}
        </span>
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
  const text = block.bodyText || DEFAULT_SCROLLYTELLING_CONFIG.manifestoText;
  const words = text.split(' ');

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
          <motion.div style={{ y: leftY, rotate: leftRotate }} className="lg:col-span-3 hidden lg:block">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-current/15 shadow-2xl">
              <img
                src={block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.manifestoLeftImage}
                alt="Left Manifesto"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-6 text-center space-y-6">
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

          <motion.div style={{ y: rightY, rotate: rightRotate }} className="lg:col-span-3 hidden lg:block">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-current/15 shadow-2xl">
              <img
                src={block.secondaryImage || DEFAULT_SCROLLYTELLING_CONFIG.manifestoRightImage}
                alt="Right Manifesto"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
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
  const gridScale = useTransform(progress, [0, 0.85], [3.2, 1.0]);
  const titleOpacity = useTransform(progress, [0, 0.38], [1, 0]);
  const titleScale = useTransform(progress, [0, 0.38], [1, 1.15]);
  const labelOpacity = useTransform(progress, [0.68, 0.96], [0, 1]);

  const bg = block.bgColor || '#0A0A0A';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Outfit';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';

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
          className="w-full max-w-6xl h-[82vh] px-4 grid grid-cols-3 grid-rows-3 gap-3 md:gap-4"
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
            <div className="absolute inset-0 bg-black/35" />
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
          <h1 style={{ fontFamily: hFont }} className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl">
            {block.title}
          </h1>
          {block.subtitle && <p className="mt-3 text-sm sm:text-base text-white/85 max-w-lg">{block.subtitle}</p>}
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

  const gradedImg = block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.afterGradedImage;
  const rawImg = block.secondaryImage || block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.beforeRawImage;

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
            <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-4xl font-bold tracking-tight">
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
            RAW · Arquivo Original
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
              Color Grading Final ({splitPercent}%)
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
          <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-bold tracking-tight">
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
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-[1.02]"
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
  const leftDoorX = useTransform(progress, [0, 0.78], ['0%', '-102%']);
  const rightDoorX = useTransform(progress, [0, 0.78], ['0%', '102%']);
  const innerScale = useTransform(progress, [0, 0.88], [0.76, 1.06]);
  const marqueeBottomX = useTransform(progress, [0, 1], ['15%', '-55%']);
  const marqueeTopX = useTransform(progress, [0, 1], ['-45%', '15%']);

  const bg = block.bgColor || '#09090B';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#E11D48';
  const hFont = block.headingFont || site?.headingFont || 'Bricolage Grotesque';
  const bFont = block.bodyFont || site?.bodyFont || 'DM Sans';

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
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        {/* Kinetic Marquee Band at Top */}
        <motion.div
          style={{ x: marqueeTopX, fontFamily: hFont }}
          className="absolute top-12 left-0 whitespace-nowrap text-[6vw] font-black uppercase tracking-tighter text-white/15 pointer-events-none select-none z-10"
        >
          {site?.photographerName} · DIREÇÃO EDITORIAL · {block.kicker || 'KOREO KINETIC'} · {site?.photographerName}
        </motion.div>

        {/* Kinetic Marquee Band at Bottom */}
        <motion.div
          style={{ x: marqueeBottomX, fontFamily: hFont }}
          className="absolute bottom-10 left-0 whitespace-nowrap text-[8vw] font-black uppercase tracking-tighter text-white/25 pointer-events-none select-none z-10"
        >
          {block.title} · {site?.photographerName} · {block.kicker || 'KOREO KINETIC'} · {block.title}
        </motion.div>

        {/* Center Revealed Title */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span
            style={{ color: accent }}
            className="text-xs uppercase tracking-[0.35em] font-bold block mb-3"
          >
            {block.kicker || 'KOREO SPLIT REVEAL'}
          </span>
          <h2 style={{ fontFamily: hFont }} className="text-4xl sm:text-6xl md:text-7xl font-black text-white">
            {block.title}
          </h2>
          {block.subtitle && <p className="mt-3 text-sm sm:text-base text-white/80">{block.subtitle}</p>}
        </div>

        {/* Left & Right Sliding Curtain Doors */}
        <motion.div
          style={{ x: leftDoorX, backgroundColor: bg }}
          className="absolute inset-y-0 left-0 w-1/2 z-20 border-r border-white/15 flex flex-col items-end justify-center pr-6 md:pr-12 overflow-hidden shadow-2xl"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-45 mb-2">
            PORTA ESQUERDA
          </span>
          <span
            style={{ fontFamily: hFont }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight"
          >
            {site?.photographerName?.split(' ')[0] || 'STUDIO'}
          </span>
        </motion.div>

        <motion.div
          style={{ x: rightDoorX, backgroundColor: bg }}
          className="absolute inset-y-0 right-0 w-1/2 z-20 border-l border-white/15 flex flex-col items-start justify-center pl-6 md:pl-12 overflow-hidden shadow-2xl"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-45 mb-2">
            ROLE PARA ABRIR
          </span>
          <span
            style={{ fontFamily: hFont, color: accent }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight"
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
  const innerScale = useTransform(progress, [0, 1], [1.32, 1.0]);
  const ringRotate = useTransform(progress, [0, 1], [0, 120]);

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setRadiusPct(Math.round(16 + v * 84));
    });
    return () => unsub();
  }, [progress]);

  const bg = block.bgColor || '#07090E';
  const txt = block.textColor || '#FFFFFF';
  const accent = block.accentColor || site?.primaryColor || '#38BDF8';
  const hFont = block.headingFont || site?.headingFont || 'Cinzel';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';

  return (
    <section
      ref={ref}
      style={{ backgroundColor: bg, color: txt, fontFamily: bFont }}
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Rotating Optical Lens Rings */}
        <motion.div
          style={{ rotate: ringRotate, borderColor: accent }}
          className="absolute w-[62vh] h-[62vh] rounded-full border border-dashed opacity-25 pointer-events-none z-10"
        />
        <div className="absolute top-10 inset-x-0 text-center z-10 pointer-events-none px-4">
          <ScrollCueBadge accent={accent} text={`ÍRIS ÓPTICA (${radiusPct}%) · ROLE PARA EXPANDIR`} />
        </div>

        {/* Expanding Circular Iris Mask */}
        <div
          style={{ clipPath: `circle(${radiusPct}% at 50% 50%)` }}
          className="absolute inset-0 w-full h-full z-20"
        >
          <motion.div style={{ scale: innerScale }} className="w-full h-full">
            <MediaSlot
              imageUrl={block.primaryImage}
              videoUrl={block.primaryVideo}
              alt={block.title}
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center px-6 text-white">
            <span className="text-xs uppercase tracking-[0.35em] text-white/80 mb-3">
              {block.kicker || 'DESTINATION & NATUREZA'}
            </span>
            <h2 style={{ fontFamily: hFont }} className="text-4xl sm:text-6xl md:text-7xl font-normal max-w-4xl">
              {block.title}
            </h2>
            {block.subtitle && (
              <p className="mt-4 text-sm sm:text-base text-white/85 max-w-xl">{block.subtitle}</p>
            )}
          </div>
        </div>
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

  const grayVal = Math.max(0, 100 - developPct);
  const sepiaVal = Math.max(0, Math.round((100 - developPct) * 0.78));

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
            <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
              {block.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-current/20">
              REVELAÇÃO QUÍMICA: {developPct}%
            </span>
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

          {/* Red Darkroom Safelight Overlay that fades out as photo develops */}
          <div
            style={{ opacity: Math.max(0, (75 - developPct) / 100) }}
            className="absolute inset-0 bg-red-950/65 mix-blend-multiply pointer-events-none"
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
            className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight leading-none uppercase"
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
  const style: ScrollyGalleryStyle = block.galleryStyle || 'editorial_grid';
  const aspect = block.galleryAspect || 'aspect-[3/4]';

  const displayItems =
    collections && collections.length > 0
      ? collections.map((col: any, idx: number) => ({
          id: col.id,
          rawCollection: col,
          url:
            col.image ||
            (col.media && col.media[0]) ||
            DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos[idx % 4].url,
          caption: col.title || `Coleção 0${idx + 1}`,
          subtitle: `${col.category || 'Galeria'} · ${col.date || '2026'}`,
          category: `0${idx + 1}`
        }))
      : (block.items || DEFAULT_SCROLLYTELLING_CONFIG.storyPhotos).map((it, idx) => ({
          id: `item_${idx}`,
          rawCollection: null,
          url: it.url,
          caption: it.caption,
          subtitle: it.subtitle || 'Série Autoral',
          category: `0${idx + 1}`
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
            <span style={{ color: accent }} className="text-xs uppercase tracking-[0.25em] font-bold block mb-2">
              {block.kicker || 'COLEÇÕES & GALERIAS'}
            </span>
            <h2 style={{ fontFamily: hFont }} className="text-3xl md:text-5xl font-normal">
              {block.title}
            </h2>
          </div>
          {block.subtitle && <p className="text-xs opacity-70 max-w-sm">{block.subtitle}</p>}
        </div>

        {/* STYLE 1: EDITORIAL GRID */}
        {style === 'editorial_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                onClick={() => item.rawCollection && onOpenGallery && onOpenGallery(item.rawCollection)}
                className="group cursor-pointer space-y-3"
              >
                <div className={`${aspect} rounded-2xl overflow-hidden bg-neutral-900/20 relative shadow-lg`}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h3 style={{ fontFamily: hFont }} className="text-xl font-normal">
                      {item.caption}
                    </h3>
                    <p className="text-xs opacity-60">{item.subtitle}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
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
                className="break-inside-avoid group cursor-pointer space-y-2"
              >
                <div
                  className={`${
                    i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                  } rounded-2xl overflow-hidden bg-neutral-900/20 shadow-md`}
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold">{item.caption}</span>
                  <span className="opacity-60">{item.subtitle}</span>
                </div>
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
                className="w-[75vw] sm:w-[44vw] md:w-[32vw] shrink-0 group cursor-pointer space-y-3"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900/20 shadow-xl">
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono opacity-50 block">LOOK 0{i + 1}</span>
                    <h3 style={{ fontFamily: hFont }} className="text-lg font-normal">
                      {item.caption}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
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
                className="group cursor-pointer p-2 border border-white/10 hover:border-amber-500 transition-colors space-y-2"
              >
                <div className="flex justify-between text-[10px]">
                  <span>KODAK 400</span>
                  <span>{i + 1}A</span>
                </div>
                <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-[11px] text-white truncate">{item.caption}</p>
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
                className="group relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                  <span
                    style={{ backgroundColor: accent }}
                    className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    Ver Filme / Galeria
                  </span>
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
  whatsappNumber
}: {
  block: ScrollySectionBlock;
  site: any;
  whatsappNumber: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useUniversalScrollProgress(ref, 'enter-exit');
  const scale = useTransform(progress, [0, 1], [1.32, 1.0]);

  const accent = block.accentColor || site?.primaryColor || '#D05634';
  const hFont = block.headingFont || site?.headingFont || 'Playfair Display';
  const bFont = block.bodyFont || site?.bodyFont || 'Plus Jakarta Sans';

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
      className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center"
    >
      <motion.div style={{ scale }} className="absolute inset-0 w-full h-full">
        <MediaSlot
          imageUrl={block.primaryImage || DEFAULT_SCROLLYTELLING_CONFIG.ctaBackgroundImage}
          videoUrl={block.primaryVideo}
          alt={block.title}
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-white/80 block">
          {block.kicker || site?.photographerName}
        </span>
        <h2 style={{ fontFamily: hFont }} className="text-4xl sm:text-6xl font-normal leading-tight">
          {block.title}
        </h2>
        {block.subtitle && (
          <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">{block.subtitle}</p>
        )}
        <div className="pt-4">
          <button
            type="button"
            onClick={openWhatsApp}
            style={{ backgroundColor: accent }}
            className="px-8 py-4 rounded-full text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2.5 shadow-2xl hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{block.buttonText || 'Verificar Disponibilidade no WhatsApp'}</span>
          </button>
        </div>
      </div>
    </section>
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
  onOpenGallery
}: {
  site: any;
  config: Required<ScrollytellingConfig>;
  collections?: any[];
  onOpenGallery?: (col: any) => void;
  onNavigateSection?: (sec: string) => void;
}) {
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const activeThemeId: ScrollytellingThemeId =
    site?.scrollytellingThemeId || site?.theme_id || 'lumina-editorial';

  const sections =
    config.sections && config.sections.length > 0
      ? config.sections.filter((s) => s.visible !== false)
      : getThemePresetSections(activeThemeId === 'classic' ? 'lumina-editorial' : activeThemeId, site);

  // Whenever the user switches theme, scroll the viewport to the top so they see the Hero immediately
  useEffect(() => {
    setIsAutoScrolling(false);
    const viewport = composerRef.current?.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeThemeId]);

  // Smooth Auto-Scroll Demonstration Mode so the user can test Scrollytelling with 1 click or manual scroll
  useEffect(() => {
    if (!isAutoScrolling) return;

    let rafId = 0;
    const viewport = composerRef.current?.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;

    const step = () => {
      if (viewport) {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        if (viewport.scrollTop >= maxScroll - 4) {
          setIsAutoScrolling(false);
          return;
        }
        viewport.scrollTop += 3.2;
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 4) {
          setIsAutoScrolling(false);
          return;
        }
        window.scrollBy(0, 3.2);
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);

    const stopOnWheel = () => setIsAutoScrolling(false);
    window.addEventListener('wheel', stopOnWheel, { passive: true });
    window.addEventListener('touchstart', stopOnWheel, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', stopOnWheel);
      window.removeEventListener('touchstart', stopOnWheel);
    };
  }, [isAutoScrolling]);

  const accent = site?.primaryColor || '#D05634';

  return (
    <div ref={composerRef} className="w-full relative">
      {/* Floating Scrollytelling Auto-Play / Demo Button */}
      <div className="sticky top-20 z-40 pointer-events-none flex justify-end px-4 md:px-8 h-0 overflow-visible">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!isAutoScrolling) {
              const viewport = composerRef.current?.closest('[data-scrolly-viewport="true"]') as HTMLElement | null;
              if (viewport && viewport.scrollTop > viewport.scrollHeight - viewport.clientHeight - 100) {
                viewport.scrollTo({ top: 0 });
              }
            }
            setIsAutoScrolling((prev) => !prev);
          }}
          style={{ backgroundColor: isAutoScrolling ? '#111111' : accent }}
          className="pointer-events-auto h-9 px-4 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-2xl border border-white/25 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {isAutoScrolling ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pausar Scrollytelling</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Demonstrar Animação</span>
            </>
          )}
        </button>
      </div>

      {sections.map((block) => {
        const renderBlock = () => {
          switch (block.type) {
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
              return <BlockFloatingMasonry3Col block={block} site={site} />;
            case 'layered_pinning_chapters':
              return <BlockLayeredPinningChapters block={block} site={site} />;
            case 'koreo_split_curtain':
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
            case 'cta_zoom_whatsapp':
            default:
              return (
                <BlockCtaZoomWhatsapp
                  block={block}
                  site={site}
                  whatsappNumber={config.whatsappNumber}
                />
              );
          }
        };
        return <div key={block.id}>{renderBlock()}</div>;
      })}
    </div>
  );
}

// Keep individual named exports pointing to ModularScrollytellingComposer for compatibility
export const LuminaEditorialTheme = ModularScrollytellingComposer;
export const NoirCinemaTheme = ModularScrollytellingComposer;
export const AtelierMinimalTheme = ModularScrollytellingComposer;
export const LayeredPinningTheme = ModularScrollytellingComposer;

