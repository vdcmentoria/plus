import React, { useEffect, useState } from 'react';
import {
  Camera,
  Newspaper,
  Users,
  Briefcase,
  Calendar,
  Globe,
  Heart,
  Mail,
  MapPin,
  Sparkles,
  Video,
  ShoppingBag,
  Link2,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

export type BioLinkType =
  | 'whatsapp'
  | 'portfolio'
  | 'blog'
  | 'portal'
  | 'orcamento'
  | 'url'
  | 'email'
  | 'phone';

export type BioLinkIcon =
  | 'whatsapp'
  | 'camera'
  | 'newspaper'
  | 'users'
  | 'briefcase'
  | 'calendar'
  | 'globe'
  | 'heart'
  | 'mail'
  | 'map-pin'
  | 'sparkles'
  | 'video'
  | 'shopping-bag'
  | 'link';

export interface BioLinkItem {
  id: string;
  label: string;
  subtitle?: string;
  url: string;
  type: BioLinkType;
  icon: BioLinkIcon;
  active: boolean;
  clicks?: number;
  whatsappPhone?: string;
  whatsappMessage?: string;
}

export type BioSocialPlatform =
  | 'instagram'
  | 'whatsapp'
  | 'website'
  | 'youtube'
  | 'tiktok'
  | 'facebook'
  | 'pinterest'
  | 'linkedin'
  | 'email';

export interface BioSocialItem {
  id: string;
  platform: BioSocialPlatform;
  url: string;
  active: boolean;
}

export type BioButtonStyle = 'line' | 'minimal_outline' | 'soft_surface' | 'solid';
export type BioImageEffect = 'soft_zoom' | 'bw_to_color' | 'elevate' | 'none';
export type BioThemePresetId =
  | 'clean-editorial'
  | 'noir-studio'
  | 'fine-art-sand'
  | 'terracota-autoral';

export interface BioPageData {
  id?: string;
  ownerId: string;
  slug: string;
  published: boolean;
  themePreset: BioThemePresetId;
  displayName: string;
  eyebrow?: string;
  bioText: string;
  avatarUrl: string;
  avatarSize: 'sm' | 'md' | 'lg';
  avatarPosition: string;
  coverBannerUrl?: string;
  bgImageUrl?: string;
  bgImageOverlayOpacity?: number;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  titleFont: string;
  bodyFont: string;
  buttonStyle: BioButtonStyle;
  showNumbers: boolean;
  alignment: 'left' | 'center';
  imageEffect: BioImageEffect;
  showFooterCredit: boolean;
  footerCreditText?: string;
  links: BioLinkItem[];
  socials: BioSocialItem[];
  viewsCount?: number;
  totalClicks?: number;
  updatedAt?: string;
}

export interface BioThemePreset {
  id: BioThemePresetId;
  name: string;
  subtitle: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  titleFont: string;
  bodyFont: string;
  buttonStyle: BioButtonStyle;
  showNumbers: boolean;
  alignment: 'left' | 'center';
  imageEffect: BioImageEffect;
}

export const BIO_THEME_PRESETS: BioThemePreset[] = [
  {
    id: 'clean-editorial',
    name: 'Clean Editorial',
    subtitle: 'Padrão minimalista • Linhas numeradas 01–05',
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
    imageEffect: 'soft_zoom'
  },
  {
    id: 'noir-studio',
    name: 'Noir Studio',
    subtitle: 'Editorial escuro • Contraste elegante',
    bgColor: '#0B0B0D',
    surfaceColor: '#151519',
    textColor: '#F9FAFB',
    mutedColor: '#9CA3AF',
    accentColor: '#D4AF37',
    titleFont: 'Cormorant Garamond',
    bodyFont: 'Poppins',
    buttonStyle: 'line',
    showNumbers: true,
    alignment: 'center',
    imageEffect: 'bw_to_color'
  },
  {
    id: 'fine-art-sand',
    name: 'Fine Art Sand',
    subtitle: 'Areia quente • Cartões minimalistas',
    bgColor: '#F7F4EF',
    surfaceColor: '#EFEAE1',
    textColor: '#1C1917',
    mutedColor: '#78716C',
    accentColor: '#8C6B4F',
    titleFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    buttonStyle: 'minimal_outline',
    showNumbers: true,
    alignment: 'center',
    imageEffect: 'elevate'
  },
  {
    id: 'terracota-autoral',
    name: 'Terracota Autoral',
    subtitle: 'Estúdio contemporâneo • Destaque quente',
    bgColor: '#FFFBF8',
    surfaceColor: '#FFF0EB',
    textColor: '#1F1715',
    mutedColor: '#6B5E59',
    accentColor: '#D05634',
    titleFont: 'Raleway',
    bodyFont: 'Poppins',
    buttonStyle: 'soft_surface',
    showNumbers: true,
    alignment: 'left',
    imageEffect: 'soft_zoom'
  }
];

export const BIO_FONT_OPTIONS = [
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Cormorant Garamond',
  'Plus Jakarta Sans',
  'Montserrat',
  'Inter',
  'DM Sans'
];

function WhatsAppSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function TikTokSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function PinterestSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 19.5 11.5 11" />
      <path d="M10.5 14.5c.8.6 1.8.8 2.8.4 1.6-.6 2.5-2.4 2.1-4.2-.4-1.8-2-3-3.9-2.9-2 .1-3.5 1.8-3.5 3.8 0 .8.3 1.5.7 2" />
    </svg>
  );
}

export function renderBioLinkIcon(icon: BioLinkIcon, className = 'w-[18px] h-[18px]') {
  switch (icon) {
    case 'whatsapp':
      return <WhatsAppSvg className={className} />;
    case 'camera':
      return <Camera className={className} strokeWidth={1.65} />;
    case 'newspaper':
      return <Newspaper className={className} strokeWidth={1.65} />;
    case 'users':
      return <Users className={className} strokeWidth={1.65} />;
    case 'briefcase':
      return <Briefcase className={className} strokeWidth={1.65} />;
    case 'calendar':
      return <Calendar className={className} strokeWidth={1.65} />;
    case 'globe':
      return <Globe className={className} strokeWidth={1.65} />;
    case 'heart':
      return <Heart className={className} strokeWidth={1.65} />;
    case 'mail':
      return <Mail className={className} strokeWidth={1.65} />;
    case 'map-pin':
      return <MapPin className={className} strokeWidth={1.65} />;
    case 'sparkles':
      return <Sparkles className={className} strokeWidth={1.65} />;
    case 'video':
      return <Video className={className} strokeWidth={1.65} />;
    case 'shopping-bag':
      return <ShoppingBag className={className} strokeWidth={1.65} />;
    case 'link':
    default:
      return <Link2 className={className} strokeWidth={1.65} />;
  }
}

export function renderBioSocialIcon(platform: BioSocialPlatform, className = 'w-5 h-5') {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} strokeWidth={1.7} />;
    case 'whatsapp':
      return <WhatsAppSvg className={className} />;
    case 'website':
      return <Globe className={className} strokeWidth={1.7} />;
    case 'youtube':
      return <Youtube className={className} strokeWidth={1.7} />;
    case 'tiktok':
      return <TikTokSvg className={className} />;
    case 'facebook':
      return <Facebook className={className} strokeWidth={1.7} />;
    case 'pinterest':
      return <PinterestSvg className={className} />;
    case 'linkedin':
      return <Linkedin className={className} strokeWidth={1.7} />;
    case 'email':
      return <Mail className={className} strokeWidth={1.7} />;
    default:
      return <MessageCircle className={className} strokeWidth={1.7} />;
  }
}

export function resolveBioLinkHref(item: BioLinkItem): string {
  if (item.type === 'whatsapp') {
    const cleanPhone = (item.whatsappPhone || '').replace(/\D/g, '');
    if (cleanPhone) {
      const msg = item.whatsappMessage?.trim();
      return `https://wa.me/${cleanPhone}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
    }
  }
  const raw = (item.url || '').trim();
  if (!raw) return '#';
  if (item.type === 'email') {
    return raw.startsWith('mailto:') ? raw : `mailto:${raw}`;
  }
  if (item.type === 'phone') {
    return raw.startsWith('tel:') ? raw : `tel:${raw.replace(/[^\d+]/g, '')}`;
  }
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(raw)) {
    return raw;
  }
  return `https://${raw}`;
}

export function resolveSocialHref(item: BioSocialItem): string {
  const raw = (item.url || '').trim();
  if (!raw) return '#';
  if (item.platform === 'email') {
    return raw.startsWith('mailto:') ? raw : `mailto:${raw}`;
  }
  if (item.platform === 'instagram' && !raw.includes('http') && !raw.includes('.')) {
    return `https://instagram.com/${raw.replace(/^@/, '')}`;
  }
  if (item.platform === 'tiktok' && !raw.includes('http') && !raw.includes('.')) {
    return `https://tiktok.com/@${raw.replace(/^@/, '')}`;
  }
  if (item.platform === 'whatsapp' && !raw.includes('http')) {
    const digits = raw.replace(/\D/g, '');
    if (digits) return `https://wa.me/${digits}`;
  }
  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) {
    return raw;
  }
  return `https://${raw}`;
}

function useGoogleFontLoader(fonts: string[]) {
  useEffect(() => {
    const unique = Array.from(new Set(fonts.filter(Boolean)));
    if (unique.length === 0) return;

    const id = 'frameplus-bio-google-fonts';
    const families = unique
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@300;400;500;600;700;800`)
      .join('&');
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

    let linkEl = document.getElementById(id) as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = id;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }
    if (linkEl.href !== href) {
      linkEl.href = href;
    }
  }, [fonts.join('|')]);
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = (hex || '#101828').replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(16, 24, 40, ${alpha})`;
}

export function BioPageCanvas({
  data,
  isPreview = false,
  onLinkClick
}: {
  data: BioPageData;
  isPreview?: boolean;
  onLinkClick?: (item: BioLinkItem) => void;
}) {
  useGoogleFontLoader([data.titleFont || 'Raleway', data.bodyFont || 'Poppins']);

  const bgColor = data.bgColor || '#FFFFFF';
  const surfaceColor = data.surfaceColor || '#F9FAFB';
  const textColor = data.textColor || '#101828';
  const mutedColor = data.mutedColor || '#667085';
  const accentColor = data.accentColor || '#475467';
  const titleFont = data.titleFont || 'Raleway';
  const bodyFont = data.bodyFont || 'Poppins';
  const isCentered = data.alignment === 'center';

  const activeLinks = (data.links || []).filter((l) => l.active);
  const activeSocials = (data.socials || []).filter((s) => s.active && s.url?.trim());

  const avatarDimension =
    data.avatarSize === 'sm'
      ? 'w-20 h-20'
      : data.avatarSize === 'md'
        ? 'w-24 h-24 sm:w-28 sm:h-28'
        : 'w-28 h-28 sm:w-[132px] sm:h-[132px]';

  const avatarEffectClass =
    data.imageEffect === 'soft_zoom'
      ? 'transition-transform duration-700 ease-out group-hover:scale-105'
      : data.imageEffect === 'bw_to_color'
        ? 'grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105'
        : data.imageEffect === 'elevate'
          ? 'transition-transform duration-500 ease-out group-hover:scale-[1.03]'
          : '';

  const hairlineBorder = hexToRgba(textColor, 0.14);
  const softBorder = hexToRgba(textColor, 0.12);
  const monogram = (data.displayName || 'F').trim().charAt(0).toUpperCase();

  return (
    <div
      className="relative w-full min-h-full flex flex-col justify-between overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: `"${bodyFont}", system-ui, -apple-system, sans-serif`
      }}
    >
      {/* Optional full-bleed background image */}
      {data.bgImageUrl && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={data.bgImageUrl}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: bgColor,
              opacity: typeof data.bgImageOverlayOpacity === 'number' ? data.bgImageOverlayOpacity : 0.86
            }}
          />
        </div>
      )}

      {/* Optional subtle cover banner */}
      {data.coverBannerUrl && (
        <div className="relative z-10 w-full h-36 sm:h-44 overflow-hidden">
          <img
            src={data.coverBannerUrl}
            alt="Capa"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-20"
            style={{
              background: `linear-gradient(to top, ${bgColor}, transparent)`
            }}
          />
        </div>
      )}

      <div
        className={`relative z-10 w-full max-w-[540px] mx-auto px-6 sm:px-8 ${
          data.coverBannerUrl ? '-mt-14 pt-0 pb-12' : 'pt-12 sm:pt-16 pb-12'
        } flex-1 flex flex-col`}
      >
        {/* Profile Header */}
        <header
          className={`flex flex-col ${
            isCentered ? 'items-center text-center' : 'items-start text-left'
          } mb-9 sm:mb-10`}
        >
          <div
            className={`group relative ${avatarDimension} rounded-full overflow-hidden mb-6 shrink-0 transition-shadow duration-500 ${
              data.imageEffect === 'elevate' ? 'hover:-translate-y-1 shadow-lg' : 'shadow-xs'
            }`}
            style={{
              border: `1.5px solid ${hexToRgba(textColor, 0.14)}`,
              backgroundColor: surfaceColor
            }}
          >
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.displayName || 'Foto de perfil'}
                className={`w-full h-full object-cover ${avatarEffectClass}`}
                style={{ objectPosition: data.avatarPosition || '50% 15%' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-bold text-3xl select-none"
                style={{
                  color: accentColor,
                  fontFamily: `"${titleFont}", sans-serif`
                }}
              >
                {monogram}
              </div>
            )}
          </div>

          {data.eyebrow?.trim() && (
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2.5"
              style={{ color: accentColor }}
            >
              {data.eyebrow}
            </p>
          )}

          <h1
            className="text-[28px] sm:text-[34px] font-bold tracking-[-0.02em] leading-[1.12] mb-3.5"
            style={{
              color: textColor,
              fontFamily: `"${titleFont}", sans-serif`
            }}
          >
            {data.displayName || 'Seu Estúdio'}
          </h1>

          {data.bioText?.trim() && (
            <p
              className={`text-[14.5px] sm:text-[15px] leading-[1.65] font-normal ${
                isCentered ? 'max-w-[420px]' : 'max-w-[460px]'
              }`}
              style={{ color: mutedColor }}
            >
              {data.bioText}
            </p>
          )}
        </header>

        {/* Action Links List */}
        <nav aria-label="Links principais" className="w-full">
          {activeLinks.length === 0 ? (
            <div
              className="py-8 text-center text-xs border-y"
              style={{ borderColor: hairlineBorder, color: mutedColor }}
            >
              Adicione seus links para exibi-los aqui.
            </div>
          ) : (
            <div className={data.buttonStyle === 'line' ? 'flex flex-col' : 'flex flex-col gap-3'}>
              {activeLinks.map((item, idx) => {
                const indexLabel = String(idx + 1).padStart(2, '0');
                const href = resolveBioLinkHref(item);
                const isExternal = href.startsWith('http');

                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (isPreview) {
                    e.preventDefault();
                    return;
                  }
                  if (onLinkClick) {
                    onLinkClick(item);
                  }
                };

                if (data.buttonStyle === 'line') {
                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      onClick={handleClick}
                      className="group flex items-center justify-between gap-4 py-4 sm:py-[18px] transition-all duration-300"
                      style={{
                        borderBottom: `1px solid ${hairlineBorder}`
                      }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: accentColor }}
                        >
                          {renderBioLinkIcon(item.icon, 'w-[18px] h-[18px]')}
                        </span>
                        <div className="min-w-0 text-left">
                          <span
                            className="block text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.14em] truncate transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: textColor }}
                          >
                            {item.label}
                          </span>
                          {item.subtitle?.trim() && (
                            <span
                              className="block text-[11.5px] truncate mt-0.5 transition-transform duration-300 group-hover:translate-x-1"
                              style={{ color: mutedColor }}
                            >
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className="shrink-0 text-[12px] font-medium tabular-nums transition-all duration-300 group-hover:translate-x-0.5"
                        style={{ color: mutedColor }}
                      >
                        {data.showNumbers ? (
                          indexLabel
                        ) : (
                          <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        )}
                      </span>
                    </a>
                  );
                }

                const isSolid = data.buttonStyle === 'solid';
                const isSoft = data.buttonStyle === 'soft_surface';

                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={handleClick}
                    className="group flex items-center justify-between gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      backgroundColor: isSolid
                        ? textColor
                        : isSoft
                          ? surfaceColor
                          : 'transparent',
                      border: `1px solid ${isSolid ? textColor : softBorder}`,
                      color: isSolid ? bgColor : textColor
                    }}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: isSolid ? bgColor : accentColor }}
                      >
                        {renderBioLinkIcon(item.icon, 'w-[18px] h-[18px]')}
                      </span>
                      <div className="min-w-0 text-left">
                        <span className="block text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.13em] truncate">
                          {item.label}
                        </span>
                        {item.subtitle?.trim() && (
                          <span
                            className="block text-[11.5px] truncate mt-0.5"
                            style={{
                              color: isSolid ? hexToRgba(bgColor, 0.72) : mutedColor
                            }}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className="shrink-0 text-[12px] font-medium tabular-nums"
                      style={{
                        color: isSolid ? hexToRgba(bgColor, 0.75) : mutedColor
                      }}
                    >
                      {data.showNumbers ? (
                        indexLabel
                      ) : (
                        <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100" />
                      )}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </nav>

        {/* Monochrome Social Icons */}
        {activeSocials.length > 0 && (
          <div
            className={`flex flex-wrap items-center gap-5 mt-8 pt-1 ${
              isCentered ? 'justify-center' : 'justify-start'
            }`}
          >
            {activeSocials.map((social) => {
              const href = resolveSocialHref(social);
              const isExternal = href.startsWith('http');
              return (
                <a
                  key={social.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={isPreview ? (e) => e.preventDefault() : undefined}
                  aria-label={social.platform}
                  title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                  className="p-1.5 -m-1.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:opacity-100 opacity-85"
                  style={{ color: accentColor }}
                >
                  {renderBioSocialIcon(social.platform, 'w-[21px] h-[21px]')}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtle Footer Credit */}
      {data.showFooterCredit && (
        <footer className="relative z-10 w-full max-w-[540px] mx-auto px-6 sm:px-8 pb-8 pt-2">
          <div className={`flex ${isCentered ? 'justify-center' : 'justify-start'}`}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              style={{
                backgroundColor: surfaceColor,
                border: `1px solid ${softBorder}`,
                color: mutedColor
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span>{data.footerCreditText?.trim() || 'Criado com Frame+'}</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export function PublicBioView({ bioSlug }: { bioSlug: string }) {
  const [bio, setBio] = useState<BioPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/bios/lookup?slug=${encodeURIComponent(bioSlug)}`);
        if (!res.ok) {
          if (active) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (active) {
          if (data && data.published !== false) {
            setBio(data);
            document.title = `${data.displayName || 'Link na Bio'} • Link na Bio`;
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Error loading public bio:', err);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [bioSlug]);

  const handleTrackClick = (item: BioLinkItem) => {
    if (!bio?.id) return;
    try {
      fetch(`/api/bios/${encodeURIComponent(bio.id)}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: item.id }),
        keepalive: true
      }).catch(() => {});
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-7 h-7 animate-spin text-[#D05634]" />
        <span className="text-xs font-medium tracking-wider uppercase text-gray-400">
          Carregando Link na Bio...
        </span>
      </div>
    );
  }

  if (notFound || !bio) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] text-[#D05634] flex items-center justify-center mb-5">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link na Bio não encontrado</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          O endereço <span className="font-mono text-gray-700">/bio/{bioSlug}</span> não existe ou ainda não foi publicado.
        </p>
        <a
          href="/?app=1"
          className="px-5 py-2.5 rounded-xl bg-[#D05634] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b84a2b] transition-colors"
        >
          Ir para o Frame+
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      <BioPageCanvas data={bio} onLinkClick={handleTrackClick} />
    </div>
  );
}
