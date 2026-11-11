import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Move,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
  Link2,
  ArrowRight,
  Calendar,
  Play,
  CheckCircle2,
  RefreshCw,
  FolderKanban,
  Send,
  Eye,
  X
} from 'lucide-react';

export type QuoteBoxLayoutPreset =
  | 'atelier_champagne'
  | 'liquid_glass'
  | 'dark_studio'
  | 'minimal_light'
  | 'concierge_split';

export type QuoteBoxSurfaceStyle =
  | 'editorial_gradient'
  | 'liquid_glass'
  | 'transparent'
  | 'solid';

export type QuoteFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'chips_single'
  | 'chips_multi'
  | 'textarea';

export interface QuoteFieldConfig {
  id: string;
  label: string;
  placeholder?: string;
  type: QuoteFieldType;
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  options?: string[];
  chipColumns?: 1 | 2 | 3;
  showUndefinedDateCheckbox?: boolean;
  undefinedDateLabel?: string;
  helperLinkText?: string;
  helperLinkUrl?: string;
  semanticKey?: 'name' | 'email' | 'phone' | 'date' | 'city' | 'budget' | 'services' | 'addons' | 'eventType' | 'message' | 'custom';
}

export interface CrmColumnItem {
  id: string;
  name: string;
  order?: number;
}

export interface CrmPipelineItem {
  id: string;
  name: string;
  columns: CrmColumnItem[];
}

export interface QuoteFormConfig {
  enabled?: boolean;
  layoutPreset: QuoteBoxLayoutPreset;
  boxSurface: QuoteBoxSurfaceStyle;
  // Header texts (optional — in Foto 2 preset header is hidden by default for clean vertical card, or toggleable)
  showHeader: boolean;
  kickerText: string;
  titleText: string;
  subtitleText: string;
  // Submit & Footer
  submitButtonText: string;
  showSubmitArrow: boolean;
  footerNoteText: string;
  openWhatsappOnSubmit: boolean;
  whatsappCustomNumber?: string;
  // Box Dimensions & Drag-and-Drop Positioning
  floatingMode: boolean;
  offsetX: number;
  offsetY: number;
  boxWidthPx: number;
  boxPaddingPx: number;
  boxRadiusPx: number;
  boxOpacity: number;
  boxBlurPx: number;
  // Colors & Typography
  boxBgColor: string;
  boxBgGradientEnd: string;
  boxBorderColor: string;
  labelFontFamily: string;
  labelFontStyle: 'italic' | 'normal';
  labelFontSizePx: number;
  labelColor: string;
  inputBgColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  chipActiveBgColor: string;
  chipActiveTextColor: string;
  submitBgColor: string;
  submitTextColor: string;
  // Fields list
  fields: QuoteFieldConfig[];
  // CRM FramePro Pipeline & Column Connection
  crmIntegrationEnabled: boolean;
  crmOrigin?: string;
  crmUserId?: string;
  crmApiToken?: string;
  crmPipelineId: string;
  crmPipelineName: string;
  crmColumnId: string;
  crmColumnName: string;
}

export const ATELIER_CHAMPAGNE_FIELDS: QuoteFieldConfig[] = [
  {
    id: 'qf_couple_name',
    label: 'Nome do casal',
    placeholder: 'Ex.: Ana e Pedro',
    type: 'text',
    required: true,
    width: 'full',
    semanticKey: 'name'
  },
  {
    id: 'qf_wedding_date',
    label: 'Data do casamento',
    placeholder: 'Escolha a data',
    type: 'date',
    required: false,
    width: 'full',
    showUndefinedDateCheckbox: true,
    undefinedDateLabel: 'Ainda não definimos a data',
    semanticKey: 'date'
  },
  {
    id: 'qf_whatsapp',
    label: 'WhatsApp',
    placeholder: '(41) 90000-0000',
    type: 'tel',
    required: true,
    width: 'full',
    semanticKey: 'phone'
  },
  {
    id: 'qf_city',
    label: 'Cidade do casamento',
    placeholder: 'Ex.: Curitiba/PR',
    type: 'text',
    required: false,
    width: 'full',
    semanticKey: 'city'
  },
  {
    id: 'qf_investment',
    label: 'Investimento previsto',
    type: 'chips_single',
    required: false,
    width: 'full',
    chipColumns: 2,
    options: ['Até R$ 8 mil', 'R$ 8 a 12 mil', 'R$ 12 a 15 mil', 'Acima de R$ 15 mil'],
    semanticKey: 'budget'
  },
  {
    id: 'qf_services',
    label: 'O que vocês querem?',
    type: 'chips_multi',
    required: false,
    width: 'full',
    chipColumns: 2,
    options: ['Foto', 'Vídeo'],
    semanticKey: 'services'
  },
  {
    id: 'qf_addons',
    label: 'Interesse em adicionais (opcional)',
    type: 'chips_multi',
    required: false,
    width: 'full',
    chipColumns: 2,
    options: ['Pré-wedding', 'Same-day edit'],
    helperLinkText: 'Não sabe o que é same-day edit? Assista a um exemplo',
    helperLinkUrl: '',
    semanticKey: 'addons'
  }
];

export const DARK_STUDIO_FIELDS: QuoteFieldConfig[] = [
  {
    id: 'qf_name',
    label: 'NOME COMPLETO *',
    placeholder: 'Digite seu nome',
    type: 'text',
    required: true,
    width: 'half',
    semanticKey: 'name'
  },
  {
    id: 'qf_email',
    label: 'E-MAIL *',
    placeholder: 'seu@email.com',
    type: 'email',
    required: true,
    width: 'half',
    semanticKey: 'email'
  },
  {
    id: 'qf_phone',
    label: 'WHATSAPP / TELEFONE',
    placeholder: '(00) 00000-0000',
    type: 'tel',
    required: false,
    width: 'third',
    semanticKey: 'phone'
  },
  {
    id: 'qf_event_type',
    label: 'TIPO DE EVENTO',
    type: 'select',
    required: false,
    width: 'third',
    options: ['Casamento', 'Pré-Wedding', 'Ensaio de Casal', 'Gestante & Família', 'Corporativo'],
    semanticKey: 'eventType'
  },
  {
    id: 'qf_date',
    label: 'DATA PREVISTA',
    placeholder: 'dd/mm/aaaa',
    type: 'date',
    required: false,
    width: 'third',
    semanticKey: 'date'
  },
  {
    id: 'qf_message',
    label: 'SUA MENSAGEM',
    placeholder: 'Conte mais sobre seu casamento, cidade ou ideias para o ensaio...',
    type: 'textarea',
    required: false,
    width: 'full',
    semanticKey: 'message'
  }
];

export const DEFAULT_QUOTE_FORM_CONFIG: QuoteFormConfig = {
  enabled: true,
  layoutPreset: 'atelier_champagne',
  boxSurface: 'editorial_gradient',
  showHeader: false,
  kickerText: 'CONTATO & ORÇAMENTOS',
  titleText: 'Verificar Disponibilidade',
  subtitleText: 'Preencha as informações do seu evento e entraremos em contato rapidamente.',
  submitButtonText: 'Quero minha proposta',
  showSubmitArrow: true,
  footerNoteText: 'Ao enviar, abrimos o WhatsApp com os seus dados já preenchidos.',
  openWhatsappOnSubmit: true,
  floatingMode: false,
  offsetX: 0,
  offsetY: 0,
  boxWidthPx: 460,
  boxPaddingPx: 32,
  boxRadiusPx: 28,
  boxOpacity: 92,
  boxBlurPx: 24,
  boxBgColor: '#3D2E27',
  boxBgGradientEnd: '#1B1411',
  boxBorderColor: 'rgba(223, 199, 182, 0.22)',
  labelFontFamily: 'Cormorant Garamond',
  labelFontStyle: 'italic',
  labelFontSizePx: 17,
  labelColor: '#F3EAE3',
  inputBgColor: 'rgba(255, 255, 255, 0.05)',
  inputBorderColor: 'rgba(255, 255, 255, 0.14)',
  inputTextColor: '#F5EFEA',
  chipActiveBgColor: '#DFC7B6',
  chipActiveTextColor: '#231B18',
  submitBgColor: '#DFC7B6',
  submitTextColor: '#231B18',
  fields: ATELIER_CHAMPAGNE_FIELDS,
  crmIntegrationEnabled: true,
  crmPipelineId: 'pipe_casamentos',
  crmPipelineName: 'Funil Principal · Casamentos & Eventos',
  crmColumnId: 'col_novo_lead',
  crmColumnName: 'Novo Lead (Orçamento Site)'
};

export function resolveQuoteFormConfig(site: any): QuoteFormConfig {
  const raw = site?.quoteFormConfig || {};
  return {
    ...DEFAULT_QUOTE_FORM_CONFIG,
    ...raw,
    fields: Array.isArray(raw.fields) && raw.fields.length > 0 ? raw.fields : DEFAULT_QUOTE_FORM_CONFIG.fields
  };
}

export const QUOTE_LAYOUT_PRESETS: Array<{
  id: QuoteBoxLayoutPreset;
  name: string;
  badge: string;
  description: string;
  apply: (current: QuoteFormConfig) => Partial<QuoteFormConfig>;
}> = [
  {
    id: 'atelier_champagne',
    name: 'Atelier Champagne (Foto 2)',
    badge: 'Destaque · Casamento',
    description: 'Caixa vertical em bronze translúcido, títulos em serifa itálica e seletores em pílula champagne.',
    apply: () => ({
      layoutPreset: 'atelier_champagne',
      boxSurface: 'editorial_gradient',
      showHeader: false,
      submitButtonText: 'Quero minha proposta',
      showSubmitArrow: true,
      footerNoteText: 'Ao enviar, abrimos o WhatsApp com os seus dados já preenchidos.',
      boxWidthPx: 460,
      boxPaddingPx: 32,
      boxRadiusPx: 28,
      boxOpacity: 92,
      boxBlurPx: 24,
      boxBgColor: '#3D2E27',
      boxBgGradientEnd: '#1B1411',
      boxBorderColor: 'rgba(223, 199, 182, 0.22)',
      labelFontFamily: 'Cormorant Garamond',
      labelFontStyle: 'italic',
      labelFontSizePx: 17,
      labelColor: '#F3EAE3',
      inputBgColor: 'rgba(255, 255, 255, 0.05)',
      inputBorderColor: 'rgba(255, 255, 255, 0.14)',
      inputTextColor: '#F5EFEA',
      chipActiveBgColor: '#DFC7B6',
      chipActiveTextColor: '#231B18',
      submitBgColor: '#DFC7B6',
      submitTextColor: '#231B18',
      fields: ATELIER_CHAMPAGNE_FIELDS
    })
  },
  {
    id: 'liquid_glass',
    name: 'Liquid Glass Translúcido',
    badge: 'Vidro Líquido',
    description: 'Efeito de refração de vidro líquido com blur profundo, fundo transparente e brilho especular.',
    apply: () => ({
      layoutPreset: 'liquid_glass',
      boxSurface: 'liquid_glass',
      showHeader: true,
      kickerText: 'PROPOSTA EXCLUSIVA',
      titleText: 'Solicitar Orçamento',
      subtitleText: 'Selecione os detalhes desejados para receber sua proposta personalizada.',
      submitButtonText: 'Quero minha proposta',
      showSubmitArrow: true,
      boxWidthPx: 490,
      boxPaddingPx: 34,
      boxRadiusPx: 32,
      boxOpacity: 28,
      boxBlurPx: 32,
      boxBgColor: '#18181b',
      boxBgGradientEnd: '#09090b',
      boxBorderColor: 'rgba(255, 255, 255, 0.28)',
      labelFontFamily: 'Cormorant Garamond',
      labelFontStyle: 'italic',
      labelFontSizePx: 17,
      labelColor: '#FFFFFF',
      inputBgColor: 'rgba(255, 255, 255, 0.08)',
      inputBorderColor: 'rgba(255, 255, 255, 0.22)',
      inputTextColor: '#FFFFFF',
      chipActiveBgColor: '#FFFFFF',
      chipActiveTextColor: '#09090B',
      submitBgColor: '#FFFFFF',
      submitTextColor: '#09090B'
    })
  },
  {
    id: 'dark_studio',
    name: 'Dark Studio Pro (Foto 1)',
    badge: 'Clássico Largo',
    description: 'Layout em grade escura de estúdio com título Verificar Disponibilidade e botão em destaque.',
    apply: () => ({
      layoutPreset: 'dark_studio',
      boxSurface: 'solid',
      showHeader: true,
      kickerText: 'CONTATO & ORÇAMENTOS',
      titleText: 'Verificar Disponibilidade',
      subtitleText: 'Preencha as informações do seu evento e entraremos em contato rapidamente.',
      submitButtonText: 'ENVIAR PEDIDO DE ORÇAMENTO',
      showSubmitArrow: false,
      footerNoteText: '',
      boxWidthPx: 760,
      boxPaddingPx: 40,
      boxRadiusPx: 28,
      boxOpacity: 96,
      boxBlurPx: 16,
      boxBgColor: '#121214',
      boxBgGradientEnd: '#09090b',
      boxBorderColor: 'rgba(255, 255, 255, 0.10)',
      labelFontFamily: 'Plus Jakarta Sans',
      labelFontStyle: 'normal',
      labelFontSizePx: 11,
      labelColor: '#A1A1AA',
      inputBgColor: '#09090B',
      inputBorderColor: '#27272A',
      inputTextColor: '#FFFFFF',
      chipActiveBgColor: '#D05634',
      chipActiveTextColor: '#FFFFFF',
      submitBgColor: '#D05634',
      submitTextColor: '#FFFFFF',
      fields: DARK_STUDIO_FIELDS
    })
  },
  {
    id: 'minimal_light',
    name: 'Editorial Alabaster (Claro)',
    badge: 'Minimal Light',
    description: 'Caixa clara em tom marfim editorial com tipografia contrastante e linhas finas.',
    apply: () => ({
      layoutPreset: 'minimal_light',
      boxSurface: 'solid',
      showHeader: true,
      kickerText: 'RESERVA DE DATA',
      titleText: 'Consultar Disponibilidade',
      subtitleText: 'Conte-nos sobre a sua história e data planejada.',
      submitButtonText: 'Solicitar Proposta',
      showSubmitArrow: true,
      boxWidthPx: 480,
      boxPaddingPx: 36,
      boxRadiusPx: 24,
      boxOpacity: 98,
      boxBlurPx: 12,
      boxBgColor: '#FAF7F2',
      boxBgGradientEnd: '#F3EDE2',
      boxBorderColor: 'rgba(28, 25, 23, 0.12)',
      labelFontFamily: 'Cormorant Garamond',
      labelFontStyle: 'italic',
      labelFontSizePx: 17,
      labelColor: '#1C1917',
      inputBgColor: '#FFFFFF',
      inputBorderColor: 'rgba(28, 25, 23, 0.16)',
      inputTextColor: '#1C1917',
      chipActiveBgColor: '#1C1917',
      chipActiveTextColor: '#FAF7F2',
      submitBgColor: '#1C1917',
      submitTextColor: '#FAF7F2'
    })
  },
  {
    id: 'concierge_split',
    name: 'Split Concierge (Duas Colunas)',
    badge: 'Editorial Split',
    description: 'Apresentação lateral com chamada de atendimento à esquerda e caixa de orçamento à direita.',
    apply: () => ({
      layoutPreset: 'concierge_split',
      boxSurface: 'editorial_gradient',
      showHeader: false,
      kickerText: 'ATENDIMENTO PERSONALIZADO',
      titleText: 'Vamos conversar sobre o seu grande dia?',
      subtitleText: 'Preencha os detalhes ao lado para montarmos uma proposta sob medida para vocês.',
      submitButtonText: 'Quero minha proposta',
      showSubmitArrow: true,
      boxWidthPx: 460,
      boxPaddingPx: 32,
      boxRadiusPx: 28,
      boxOpacity: 92,
      boxBlurPx: 24,
      boxBgColor: '#3D2E27',
      boxBgGradientEnd: '#1B1411',
      boxBorderColor: 'rgba(223, 199, 182, 0.22)',
      labelFontFamily: 'Cormorant Garamond',
      labelFontStyle: 'italic',
      labelFontSizePx: 17,
      labelColor: '#F3EAE3',
      inputBgColor: 'rgba(255, 255, 255, 0.05)',
      inputBorderColor: 'rgba(255, 255, 255, 0.14)',
      inputTextColor: '#F5EFEA',
      chipActiveBgColor: '#DFC7B6',
      chipActiveTextColor: '#231B18',
      submitBgColor: '#DFC7B6',
      submitTextColor: '#231B18'
    })
  }
];

function hexToRgba(hex: string, alpha: number): string {
  const clean = (hex || '#18181b').replace('#', '').trim();
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
  return hex;
}

// ============================================================================
// INTERACTIVE QUOTE FORM BOX (Used in PublicWebsiteView & ScrollytellingThemes)
// Supports Drag & Drop in Editor Preview, Liquid Glass, Custom Fields, CRM Sync
// ============================================================================
export function InteractiveQuoteFormBox({
  site,
  isEditorPreview = false,
  onUpdateConfig,
  onSelectQuoteTab,
  defaultWhatsappNumber
}: {
  site: any;
  isEditorPreview?: boolean;
  onUpdateConfig?: (nextCfg: QuoteFormConfig) => void;
  onSelectQuoteTab?: () => void;
  defaultWhatsappNumber?: string;
}) {
  const cfg = resolveQuoteFormConfig(site);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    cfg.fields.forEach((f) => {
      if (f.type === 'chips_multi') {
        init[f.id] = f.options ? [f.options[0]].filter(Boolean) : [];
      } else if (f.type === 'chips_single') {
        init[f.id] = f.options?.[f.options.length - 1] || '';
      } else if (f.type === 'select') {
        init[f.id] = f.options?.[0] || '';
      } else {
        init[f.id] = '';
      }
    });
    return init;
  });
  const [undefinedDates, setUndefinedDates] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helperVideoModalUrl, setHelperVideoModalUrl] = useState<string | null>(null);

  // Drag & Drop State for Editor Preview
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: cfg.offsetX || 0,
    y: cfg.offsetY || 0
  });
  const dragStartRef = useRef<{ startMouseX: number; startMouseY: number; startOffsetX: number; startOffsetY: number } | null>(null);

  useEffect(() => {
    setDragOffset({ x: cfg.offsetX || 0, y: cfg.offsetY || 0 });
  }, [cfg.offsetX, cfg.offsetY]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startMouseX;
      const dy = e.clientY - dragStartRef.current.startMouseY;
      setDragOffset({
        x: Math.round(dragStartRef.current.startOffsetX + dx),
        y: Math.round(dragStartRef.current.startOffsetY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (dragStartRef.current && onUpdateConfig) {
        onUpdateConfig({
          ...cfg,
          offsetX: dragOffset.x,
          offsetY: dragOffset.y
        });
      }
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, cfg, onUpdateConfig]);

  const handleStartDrag = (e: React.MouseEvent) => {
    if (!isEditorPreview) return;
    e.stopPropagation();
    e.preventDefault();
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startOffsetX: dragOffset.x,
      startOffsetY: dragOffset.y
    };
    setIsDragging(true);
  };

  const handleResetDragPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragOffset({ x: 0, y: 0 });
    if (onUpdateConfig) {
      onUpdateConfig({
        ...cfg,
        offsetX: 0,
        offsetY: 0
      });
    }
  };

  const handleToggleMultiChip = (fieldId: string, option: string) => {
    setValues((prev) => {
      const current: string[] = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const exists = current.includes(option);
      const next = exists ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Map semantic fields + custom fields dictionary
    let name = '';
    let email = '';
    let phone = '';
    let eventDate = '';
    let dateUndefined = false;
    let location = '';
    let budget = '';
    let eventType = 'Casamento';
    let message = '';
    let servicesWanted: string[] = [];
    let addons: string[] = [];
    const customFields: Record<string, any> = {};

    cfg.fields.forEach((field) => {
      const rawVal = values[field.id];
      const isDateUndef = Boolean(undefinedDates[field.id]);
      const formattedVal =
        field.type === 'date' && isDateUndef
          ? field.undefinedDateLabel || 'Ainda não definimos a data'
          : Array.isArray(rawVal)
            ? rawVal.join(', ')
            : String(rawVal || '').trim();

      customFields[field.label] = formattedVal;

      const lowerLabel = field.label.toLowerCase();
      if (field.semanticKey === 'name' || lowerLabel.includes('nome') || lowerLabel.includes('casal')) {
        if (!name) name = formattedVal;
      } else if (field.semanticKey === 'email' || field.type === 'email' || lowerLabel.includes('mail')) {
        if (!email) email = formattedVal;
      } else if (field.semanticKey === 'phone' || field.type === 'tel' || lowerLabel.includes('whats') || lowerLabel.includes('telefone')) {
        if (!phone) phone = formattedVal;
      } else if (field.semanticKey === 'date' || field.type === 'date' || lowerLabel.includes('data')) {
        eventDate = formattedVal;
        if (isDateUndef) dateUndefined = true;
      } else if (field.semanticKey === 'city' || lowerLabel.includes('cidade') || lowerLabel.includes('local')) {
        if (!location) location = formattedVal;
      } else if (field.semanticKey === 'budget' || lowerLabel.includes('investimento') || lowerLabel.includes('orçamento')) {
        if (!budget) budget = formattedVal;
      } else if (field.semanticKey === 'services' || lowerLabel.includes('querem') || lowerLabel.includes('serviço')) {
        servicesWanted = Array.isArray(rawVal) ? rawVal : formattedVal ? [formattedVal] : [];
      } else if (field.semanticKey === 'addons' || lowerLabel.includes('adicionai')) {
        addons = Array.isArray(rawVal) ? rawVal : formattedVal ? [formattedVal] : [];
      } else if (field.semanticKey === 'eventType' || lowerLabel.includes('tipo de evento')) {
        if (formattedVal) eventType = formattedVal;
      } else if (field.semanticKey === 'message' || field.type === 'textarea') {
        if (!message) message = formattedVal;
      }
    });

    // Compose summary message for CRM & Formulário PRO
    const summaryParts: string[] = [];
    Object.entries(customFields).forEach(([k, v]) => {
      if (v) summaryParts.push(`${k}: ${v}`);
    });
    const fullSummaryMessage = message || summaryParts.join(' | ');

    try {
      const targetSiteId = site?.id || site?.slug || 'default';
      await fetch(`/api/sites/${targetSiteId}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Cliente Site',
          email,
          phone,
          eventType,
          eventDate,
          dateUndefined,
          location,
          budget,
          servicesWanted,
          addons,
          customFields,
          message: fullSummaryMessage,
          crmPipelineId: cfg.crmPipelineId,
          crmPipelineName: cfg.crmPipelineName,
          crmColumnId: cfg.crmColumnId,
          crmColumnName: cfg.crmColumnName
        })
      });

      // Fire Facebook Pixel Lead event if configured
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function' && site?.facebookPixelId) {
        try {
          (window as any).fbq('track', 'Lead', {
            content_name: site.title || site.photographerName || 'Orçamento Site',
            value: budget || undefined
          });
        } catch {}
      }

      setSubmitted(true);

      // Open WhatsApp with pre-filled data if enabled
      if (cfg.openWhatsappOnSubmit) {
        const rawWhatsapp =
          cfg.whatsappCustomNumber ||
          site?.whatsapp ||
          site?.scrollytellingConfig?.whatsappNumber ||
          defaultWhatsappNumber ||
          '';
        const cleanNum = String(rawWhatsapp).replace(/[^0-9]/g, '');
        if (cleanNum) {
          const lines = [
            `Olá ${site?.photographerName || ''}! Gostaria de solicitar uma proposta:`,
            '',
            ...Object.entries(customFields)
              .filter(([, v]) => Boolean(v))
              .map(([k, v]) => `*${k}:* ${v}`)
          ];
          const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(lines.join('\n'))}`;
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (err) {
      console.error('Erro ao enviar pedido de orçamento:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Compute surface style of the quote box
  const alpha = Math.max(0, Math.min(1, (cfg.boxOpacity ?? 92) / 100));
  const getBoxSurfaceStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      maxWidth: `${cfg.boxWidthPx || 460}px`,
      width: '100%',
      padding: `${cfg.boxPaddingPx ?? 32}px`,
      borderRadius: `${cfg.boxRadiusPx ?? 28}px`,
      borderColor: cfg.boxBorderColor || 'rgba(223, 199, 182, 0.22)',
      borderWidth: '1px',
      borderStyle: 'solid',
      transform: (dragOffset.x !== 0 || dragOffset.y !== 0)
        ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
        : undefined,
      transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
    };

    if (cfg.boxSurface === 'transparent') {
      base.backgroundColor = 'transparent';
      if (cfg.boxBlurPx > 0) {
        base.backdropFilter = `blur(${cfg.boxBlurPx}px)`;
        base.WebkitBackdropFilter = `blur(${cfg.boxBlurPx}px)`;
      }
    } else if (cfg.boxSurface === 'liquid_glass') {
      base.background = `linear-gradient(135deg, ${hexToRgba(cfg.boxBgColor || '#ffffff', Math.min(alpha, 0.35))} 0%, ${hexToRgba(cfg.boxBgGradientEnd || '#18181b', Math.min(alpha, 0.18))} 100%)`;
      base.backdropFilter = `blur(${cfg.boxBlurPx || 28}px) saturate(180%)`;
      base.WebkitBackdropFilter = `blur(${cfg.boxBlurPx || 28}px) saturate(180%)`;
      base.boxShadow = '0 25px 60px -15px rgba(0, 0, 0, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.32)';
    } else if (cfg.boxSurface === 'editorial_gradient') {
      base.background = `linear-gradient(165deg, ${hexToRgba(cfg.boxBgColor || '#3D2E27', alpha)} 0%, ${hexToRgba(cfg.boxBgGradientEnd || '#1B1411', Math.min(1, alpha + 0.05))} 100%)`;
      if (cfg.boxBlurPx > 0) {
        base.backdropFilter = `blur(${cfg.boxBlurPx}px)`;
        base.WebkitBackdropFilter = `blur(${cfg.boxBlurPx}px)`;
      }
      base.boxShadow = '0 30px 70px -15px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)';
    } else {
      // solid
      base.backgroundColor = hexToRgba(cfg.boxBgColor || '#121214', alpha);
      if (alpha < 1 && cfg.boxBlurPx > 0) {
        base.backdropFilter = `blur(${cfg.boxBlurPx}px)`;
        base.WebkitBackdropFilter = `blur(${cfg.boxBlurPx}px)`;
      }
      base.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    }

    return base;
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: `'${cfg.labelFontFamily || 'Cormorant Garamond'}', serif`,
    fontStyle: cfg.labelFontStyle || 'italic',
    fontSize: `${cfg.labelFontSizePx || 17}px`,
    color: cfg.labelColor || '#F3EAE3'
  };

  const renderFormCard = () => (
    <div
      style={getBoxSurfaceStyle()}
      onClick={(e) => {
        if (isEditorPreview && onSelectQuoteTab) {
          e.stopPropagation();
          onSelectQuoteTab();
        }
      }}
      className={`relative mx-auto text-left ${
        isEditorPreview ? 'ring-1 ring-transparent hover:ring-[#D05634]/70' : ''
      } ${cfg.floatingMode ? 'z-30' : 'z-10'}`}
    >
      {/* Editor-Only Drag & Drop Floating Handle Bar */}
      {isEditorPreview && (
        <div
          onMouseDown={handleStartDrag}
          className=" -mt-3 mb-4 py-1.5 px-3 rounded-full bg-black/85 border border-white/20 text-white text-[10px] font-bold flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing select-none shadow-xl"
          title="Clique e arraste para posicionar a caixa de orçamento onde desejar"
        >
          <div className="flex items-center gap-1.5 text-amber-300">
            <Move className="w-3.5 h-3.5" />
            <span>Arrastar Caixa de Orçamento</span>
            {(dragOffset.x !== 0 || dragOffset.y !== 0) && (
              <span className="text-[9px] font-mono text-zinc-300 ml-1">
                (X: {dragOffset.x}px, Y: {dragOffset.y}px)
              </span>
            )}
          </div>
          {(dragOffset.x !== 0 || dragOffset.y !== 0) && (
            <button
              type="button"
              onClick={handleResetDragPosition}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-[#D05634] text-white text-[9px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Centralizar</span>
            </button>
          )}
        </div>
      )}

      {/* Optional Header Inside Box */}
      {cfg.showHeader && (
        <div className="text-center space-y-2 mb-7">
          {cfg.kickerText && (
            <span
              className="text-[11px] font-bold uppercase tracking-[0.22em] block"
              style={{ color: cfg.chipActiveBgColor || '#D05634' }}
            >
              {cfg.kickerText}
            </span>
          )}
          {cfg.titleText && (
            <h2
              className="text-2xl md:text-4xl font-black tracking-tight"
              style={{
                color: cfg.labelColor || '#FFFFFF',
                fontFamily: `'${site?.headingFont || 'Playfair Display'}', serif`
              }}
            >
              {cfg.titleText}
            </h2>
          )}
          {cfg.subtitleText && (
            <p className="text-xs md:text-sm opacity-75 max-w-md mx-auto leading-relaxed" style={{ color: cfg.inputTextColor }}>
              {cfg.subtitleText}
            </p>
          )}
        </div>
      )}

      {submitted ? (
        <div className="py-10 px-4 text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-lg"
            style={{ backgroundColor: cfg.submitBgColor || '#DFC7B6', color: cfg.submitTextColor || '#231B18' }}
          >
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: cfg.labelColor }}>
            Solicitação Enviada com Sucesso!
          </h3>
          <p className="text-xs opacity-80 max-w-xs mx-auto leading-relaxed" style={{ color: cfg.inputTextColor }}>
            Seus dados foram recebidos e registrados. Retornaremos o contato em breve!
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 px-5 py-2 rounded-xl text-xs font-bold border transition-opacity hover:opacity-80 cursor-pointer"
            style={{ borderColor: cfg.inputBorderColor, color: cfg.labelColor }}
          >
            Enviar outro orçamento
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {cfg.fields.map((field) => {
            const colSpanClass =
              field.width === 'half'
                ? 'md:col-span-3'
                : field.width === 'third'
                  ? 'md:col-span-2'
                  : 'md:col-span-6';

            const isDateDisabled = field.type === 'date' && Boolean(undefinedDates[field.id]);

            return (
              <div key={field.id} className={`${colSpanClass} space-y-2`}>
                <label className="block leading-snug tracking-wide" style={labelStyle}>
                  {field.label}
                </label>

                {/* TEXT / EMAIL / TEL */}
                {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                  <input
                    type={field.type}
                    required={field.required}
                    value={values[field.id] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder || ''}
                    style={{
                      backgroundColor: cfg.inputBgColor,
                      borderColor: cfg.inputBorderColor,
                      color: cfg.inputTextColor
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-1 focus:ring-white/30 placeholder:opacity-45"
                  />
                )}

                {/* DATE WITH OPTIONAL 'AINDA NÃO DEFINIMOS A DATA' CHECKBOX */}
                {field.type === 'date' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type={values[field.id] ? 'date' : 'text'}
                        onFocus={(e) => {
                          if (!isDateDisabled) e.currentTarget.type = 'date';
                        }}
                        onBlur={(e) => {
                          if (!e.currentTarget.value) e.currentTarget.type = 'text';
                        }}
                        disabled={isDateDisabled}
                        required={field.required && !isDateDisabled}
                        value={isDateDisabled ? '' : values[field.id] || ''}
                        onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={isDateDisabled ? (field.undefinedDateLabel || 'Ainda não definimos a data') : (field.placeholder || 'Escolha a data')}
                        style={{
                          backgroundColor: cfg.inputBgColor,
                          borderColor: cfg.inputBorderColor,
                          color: cfg.inputTextColor
                        }}
                        className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-all placeholder:opacity-45 ${
                          isDateDisabled ? 'opacity-45 cursor-not-allowed' : ''
                        }`}
                      />
                      <Calendar
                        className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                        style={{ color: cfg.inputTextColor }}
                      />
                    </div>

                    {field.showUndefinedDateCheckbox && (
                      <label
                        className="inline-flex items-center gap-2 cursor-pointer select-none pt-0.5 text-xs opacity-85 hover:opacity-100"
                        style={{ color: cfg.inputTextColor }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(undefinedDates[field.id])}
                          onChange={(e) =>
                            setUndefinedDates((prev) => ({ ...prev, [field.id]: e.target.checked }))
                          }
                          className="w-4 h-4 rounded border-white/25 bg-transparent accent-[#DFC7B6] cursor-pointer"
                        />
                        <span>{field.undefinedDateLabel || 'Ainda não definimos a data'}</span>
                      </label>
                    )}
                  </div>
                )}

                {/* SELECT DROPDOWN */}
                {field.type === 'select' && (
                  <select
                    value={values[field.id] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    style={{
                      backgroundColor: cfg.inputBgColor,
                      borderColor: cfg.inputBorderColor,
                      color: cfg.inputTextColor
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  >
                    {(field.options || []).map((opt, idx) => (
                      <option key={idx} value={opt} className="bg-zinc-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* SINGLE CHOICE CHIPS (Ex: Investimento Previsto) */}
                {field.type === 'chips_single' && (
                  <div
                    className={`grid gap-2.5 ${
                      field.chipColumns === 1
                        ? 'grid-cols-1'
                        : field.chipColumns === 3
                          ? 'grid-cols-2 sm:grid-cols-3'
                          : 'grid-cols-2'
                    }`}
                  >
                    {(field.options || []).map((opt) => {
                      const isSelected = values[field.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setValues((prev) => ({ ...prev, [field.id]: opt }))}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: cfg.chipActiveBgColor || '#DFC7B6',
                                  color: cfg.chipActiveTextColor || '#231B18',
                                  borderColor: cfg.chipActiveBgColor || '#DFC7B6'
                                }
                              : {
                                  backgroundColor: cfg.inputBgColor,
                                  color: cfg.inputTextColor,
                                  borderColor: cfg.inputBorderColor
                                }
                          }
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected ? 'shadow-md scale-[1.01]' : 'hover:opacity-90'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />}
                          <span className="truncate">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MULTI CHOICE CHIPS (Ex: O que vocês querem? Foto / Vídeo, Adicionais) */}
                {field.type === 'chips_multi' && (
                  <div className="space-y-2">
                    <div
                      className={`grid gap-2.5 ${
                        field.chipColumns === 1
                          ? 'grid-cols-1'
                          : field.chipColumns === 3
                            ? 'grid-cols-2 sm:grid-cols-3'
                            : 'grid-cols-2'
                      }`}
                    >
                      {(field.options || []).map((opt) => {
                        const selectedArr: string[] = Array.isArray(values[field.id]) ? values[field.id] : [];
                        const isSelected = selectedArr.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleToggleMultiChip(field.id, opt)}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: cfg.chipActiveBgColor || '#DFC7B6',
                                    color: cfg.chipActiveTextColor || '#231B18',
                                    borderColor: cfg.chipActiveBgColor || '#DFC7B6'
                                  }
                                : {
                                    backgroundColor: cfg.inputBgColor,
                                    color: cfg.inputTextColor,
                                    borderColor: cfg.inputBorderColor
                                  }
                            }
                            className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelected ? 'shadow-md scale-[1.01]' : 'hover:opacity-90'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />}
                            <span className="truncate">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Optional Helper Link (e.g. "▸ Não sabe o que é same-day edit? Assista a um exemplo") */}
                    {field.helperLinkText && (
                      <button
                        type="button"
                        onClick={() => {
                          if (field.helperLinkUrl) {
                            if (field.helperLinkUrl.includes('youtube.com') || field.helperLinkUrl.includes('youtu.be') || field.helperLinkUrl.includes('vimeo.com')) {
                              setHelperVideoModalUrl(field.helperLinkUrl);
                            } else {
                              window.open(field.helperLinkUrl, '_blank', 'noopener,noreferrer');
                            }
                          }
                        }}
                        style={{ color: cfg.inputTextColor, borderColor: cfg.inputBorderColor }}
                        className="inline-flex items-center gap-1.5 text-[11px] opacity-75 hover:opacity-100 border-b pb-0.5 pt-1 transition-opacity cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-current shrink-0" />
                        <span>{field.helperLinkText}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* TEXTAREA */}
                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    required={field.required}
                    value={values[field.id] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder || ''}
                    style={{
                      backgroundColor: cfg.inputBgColor,
                      borderColor: cfg.inputBorderColor,
                      color: cfg.inputTextColor
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none placeholder:opacity-45"
                  />
                )}
              </div>
            );
          })}

          {/* MAIN SUBMIT BUTTON */}
          <div className="md:col-span-6 pt-3 space-y-3">
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: cfg.submitBgColor || '#DFC7B6',
                color: cfg.submitTextColor || '#231B18'
              }}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Enviando...' : (cfg.submitButtonText || 'Quero minha proposta')}</span>
              {cfg.showSubmitArrow !== false && <ArrowRight className="w-4 h-4" />}
            </button>

            {cfg.footerNoteText && (
              <p
                className="text-[11px] text-center opacity-60 leading-relaxed"
                style={{ color: cfg.inputTextColor }}
              >
                {cfg.footerNoteText}
              </p>
            )}
          </div>
        </form>
      )}

      {/* Helper Video Example Modal */}
      {helperVideoModalUrl && (
        <div
          onClick={() => setHelperVideoModalUrl(null)}
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setHelperVideoModalUrl(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-[#D05634]"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              src={
                helperVideoModalUrl.includes('watch?v=')
                  ? helperVideoModalUrl.replace('watch?v=', 'embed/')
                  : helperVideoModalUrl
              }
              title="Exemplo em Vídeo"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );

  if (cfg.layoutPreset === 'concierge_split') {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center px-4">
        <div className="lg:col-span-5 space-y-5 text-left text-white">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] block"
            style={{ color: cfg.chipActiveBgColor || '#DFC7B6' }}
          >
            {cfg.kickerText || 'ATENDIMENTO PERSONALIZADO'}
          </span>
          <h2
            className="text-3xl md:text-5xl font-normal leading-tight"
            style={{ fontFamily: `'${site?.headingFont || 'Playfair Display'}', serif` }}
          >
            {cfg.titleText || 'Vamos conversar sobre o seu grande dia?'}
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            {cfg.subtitleText ||
              'Preencha os detalhes ao lado para montarmos uma proposta sob medida para vocês.'}
          </p>
        </div>
        <div className="lg:col-span-7 flex justify-center">{renderFormCard()}</div>
      </div>
    );
  }

  return renderFormCard();
}

// ============================================================================
// QUOTE BUILDER SIDEBAR DRAWER PANEL (Rendered when activeMenuId === 'orcamento')
// ============================================================================
export function QuoteBuilderDrawerPanel({
  siteData,
  isDarkShell,
  userId,
  onChangeQuoteConfig
}: {
  siteData: any;
  isDarkShell: boolean;
  userId?: string;
  onChangeQuoteConfig: (nextCfg: QuoteFormConfig) => void;
}) {
  const cfg = resolveQuoteFormConfig(siteData);
  const [subTab, setSubTab] = useState<'layouts' | 'caixa' | 'campos' | 'crm'>('layouts');
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(cfg.fields[0]?.id || null);
  const [newOptionInputs, setNewOptionInputs] = useState<Record<string, string>>({});

  // CRM Pipelines State
  const [pipelines, setPipelines] = useState<CrmPipelineItem[]>([]);
  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');

  const updateCfg = (patch: Partial<QuoteFormConfig>) => {
    onChangeQuoteConfig({
      ...cfg,
      ...patch
    });
  };

  const fetchCrmPipelines = async () => {
    setLoadingPipelines(true);
    try {
      const uid = userId || siteData.ownerId || 'default';
      const res = await fetch(`/api/crm/pipelines?userId=${encodeURIComponent(uid)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.pipelines) && data.pipelines.length > 0) {
          setPipelines(data.pipelines);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar pipelines do CRM:', err);
    } finally {
      setLoadingPipelines(false);
    }
  };

  useEffect(() => {
    fetchCrmPipelines();
  }, [userId, siteData.ownerId]);

  const handleSavePipelinesToServer = async (nextPipelines: CrmPipelineItem[]) => {
    setPipelines(nextPipelines);
    try {
      const uid = userId || siteData.ownerId || 'default';
      await fetch('/api/crm/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, pipelines: nextPipelines })
      });
    } catch {}
  };

  const handleAddField = (type: QuoteFieldType) => {
    const newId = `qf_${Date.now()}`;
    const typeLabels: Record<QuoteFieldType, string> = {
      text: 'Nova Pergunta (Texto)',
      email: 'Seu E-mail',
      tel: 'WhatsApp / Telefone',
      date: 'Data do Evento',
      select: 'Selecione uma Opção',
      chips_single: 'Investimento Previsto',
      chips_multi: 'Serviços Desejados',
      textarea: 'Observações / Detalhes'
    };
    const newField: QuoteFieldConfig = {
      id: newId,
      label: typeLabels[type],
      placeholder: type === 'tel' ? '(00) 00000-0000' : 'Digite aqui...',
      type,
      required: false,
      width: 'full',
      chipColumns: 2,
      options:
        type === 'chips_single'
          ? ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']
          : type === 'chips_multi' || type === 'select'
            ? ['Foto', 'Vídeo']
            : undefined,
      showUndefinedDateCheckbox: type === 'date',
      undefinedDateLabel: 'Ainda não definimos a data',
      semanticKey: 'custom'
    };
    const nextFields = [...cfg.fields, newField];
    updateCfg({ fields: nextFields });
    setExpandedFieldId(newId);
  };

  const handleUpdateField = (fieldId: string, patch: Partial<QuoteFieldConfig>) => {
    const nextFields = cfg.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f));
    updateCfg({ fields: nextFields });
  };

  const handleRemoveField = (fieldId: string) => {
    const nextFields = cfg.fields.filter((f) => f.id !== fieldId);
    updateCfg({ fields: nextFields });
  };

  const handleMoveField = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= cfg.fields.length) return;
    const nextFields = [...cfg.fields];
    const temp = nextFields[idx];
    nextFields[idx] = nextFields[target];
    nextFields[target] = temp;
    updateCfg({ fields: nextFields });
  };

  const activePipeline =
    pipelines.find((p) => p.id === cfg.crmPipelineId) || pipelines[0] || {
      id: 'pipe_casamentos',
      name: 'Funil Principal · Casamentos & Eventos',
      columns: [{ id: 'col_novo_lead', name: 'Novo Lead (Orçamento Site)' }]
    };

  return (
    <div className="space-y-5">
      {/* Sub-Navigation Pills */}
      <div
        className={`grid grid-cols-4 gap-1 p-1 rounded-2xl border ${
          isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-100 border-gray-200'
        }`}
      >
        {[
          { id: 'layouts', label: 'Layouts', icon: Sparkles },
          { id: 'caixa', label: 'Caixa & Drag', icon: Sliders },
          { id: 'campos', label: `Lacunas (${cfg.fields.length})`, icon: Layers },
          { id: 'crm', label: 'CRM Funil', icon: FolderKanban }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`py-2 px-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                active
                  ? 'bg-[#D05634] text-white shadow-md'
                  : isDarkShell
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: LAYOUTS & TEMAS DE ORÇAMENTO */}
      {subTab === 'layouts' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634]">
              Modelos de Caixa de Orçamento
            </label>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Escolha o design da caixa de pedido de orçamento. O modelo <strong>Atelier Champagne</strong> replica exatamente o layout editorial da Foto 2.
            </p>

            <div className="space-y-2.5 pt-1">
              {QUOTE_LAYOUT_PRESETS.map((preset) => {
                const isSelected = cfg.layoutPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => updateCfg(preset.apply(cfg))}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#D05634] bg-[#D05634]/10 shadow-sm'
                        : isDarkShell
                          ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        {preset.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          isSelected
                            ? 'bg-[#D05634] text-white'
                            : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão de Envio & Ação WhatsApp */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
              Botão Principal & Rodapé da Caixa
            </span>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Texto do Botão de Envio
              </label>
              <input
                type="text"
                value={cfg.submitButtonText}
                onChange={(e) => updateCfg({ submitButtonText: e.target.value })}
                placeholder="Quero minha proposta"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Frase abaixo do Botão (Rodapé da Caixa)
              </label>
              <input
                type="text"
                value={cfg.footerNoteText}
                onChange={(e) => updateCfg({ footerNoteText: e.target.value })}
                placeholder="Ao enviar, abrimos o WhatsApp com os seus dados já preenchidos."
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              />
            </div>

            <label className="flex items-center justify-between gap-2 pt-1 cursor-pointer">
              <span className="text-xs font-bold">Abrir WhatsApp preenchido ao enviar</span>
              <input
                type="checkbox"
                checked={cfg.openWhatsappOnSubmit}
                onChange={(e) => updateCfg({ openWhatsappOnSubmit: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            <label className="flex items-center justify-between gap-2 pt-1 cursor-pointer">
              <span className="text-xs font-bold">Exibir Título Interno no Topo da Caixa</span>
              <input
                type="checkbox"
                checked={cfg.showHeader}
                onChange={(e) => updateCfg({ showHeader: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            {cfg.showHeader && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <input
                  type="text"
                  value={cfg.kickerText}
                  onChange={(e) => updateCfg({ kickerText: e.target.value })}
                  placeholder="Kicker (Ex: CONTATO & ORÇAMENTOS)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <input
                  type="text"
                  value={cfg.titleText}
                  onChange={(e) => updateCfg({ titleText: e.target.value })}
                  placeholder="Título (Ex: Verificar Disponibilidade)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CAIXA SUSPENSA (DRAG & DROP), TAMANHO, LIQUID GLASS, CORES E FONTES */}
      {subTab === 'caixa' && (
        <div className="space-y-4">
          {/* Drag and Drop & Posição Livre */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5" /> Caixa Suspensa & Drag-and-Drop
              </span>
              {(cfg.offsetX !== 0 || cfg.offsetY !== 0) && (
                <button
                  type="button"
                  onClick={() => updateCfg({ offsetX: 0, offsetY: 0 })}
                  className="text-[10px] font-bold text-[#D05634] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Resetar Posição
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Você pode <strong>arrastar a caixa de orçamento com o mouse diretamente dentro do preview</strong> ao lado para posicioná-la onde preferir, ou ajustar os controles abaixo:
            </p>

            <label className="flex items-center justify-between gap-2 cursor-pointer">
              <span className="text-xs font-bold">Modo Caixa Suspensa (Flutuante)</span>
              <input
                type="checkbox"
                checked={Boolean(cfg.floatingMode)}
                onChange={(e) => updateCfg({ floatingMode: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Posição Horizontal (X)</span>
                  <span>{cfg.offsetX || 0}px</span>
                </div>
                <input
                  type="range"
                  min={-400}
                  max={400}
                  value={cfg.offsetX || 0}
                  onChange={(e) => updateCfg({ offsetX: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Posição Vertical (Y)</span>
                  <span>{cfg.offsetY || 0}px</span>
                </div>
                <input
                  type="range"
                  min={-400}
                  max={400}
                  value={cfg.offsetY || 0}
                  onChange={(e) => updateCfg({ offsetY: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
            </div>
          </div>

          {/* Tamanho & Dimensões da Caixa */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
              Tamanho & Formato da Caixa
            </span>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                <span>Largura da Caixa (Aumentar / Diminuir)</span>
                <span>{cfg.boxWidthPx}px</span>
              </div>
              <input
                type="range"
                min={340}
                max={920}
                step={10}
                value={cfg.boxWidthPx}
                onChange={(e) => updateCfg({ boxWidthPx: Number(e.target.value) })}
                className="w-full accent-[#D05634]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Espaçamento Interno</span>
                  <span>{cfg.boxPaddingPx}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={56}
                  value={cfg.boxPaddingPx}
                  onChange={(e) => updateCfg({ boxPaddingPx: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Arredondamento</span>
                  <span>{cfg.boxRadiusPx}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={cfg.boxRadiusPx}
                  onChange={(e) => updateCfg({ boxRadiusPx: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
            </div>
          </div>

          {/* Estilo de Fundo: Liquid Glass, Degradê Foto 2, Transparente, Sólido */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
              Fundo da Caixa & Efeito Liquid Glass
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'editorial_gradient', label: 'Degradê Atelier (Foto 2)' },
                { id: 'liquid_glass', label: 'Liquid Glass (Vidro)' },
                { id: 'transparent', label: '100% Transparente' },
                { id: 'solid', label: 'Cor Sólida' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateCfg({ boxSurface: s.id as QuoteBoxSurfaceStyle })}
                  className={`py-2 px-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    cfg.boxSurface === s.id
                      ? 'bg-[#D05634] text-white border-[#D05634]'
                      : isDarkShell
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Opacidade do Fundo</span>
                  <span>{cfg.boxOpacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={cfg.boxOpacity}
                  onChange={(e) => updateCfg({ boxOpacity: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span>Blur (Liquid Glass)</span>
                  <span>{cfg.boxBlurPx}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={cfg.boxBlurPx}
                  onChange={(e) => updateCfg({ boxBlurPx: Number(e.target.value) })}
                  className="w-full accent-[#D05634]"
                />
              </div>
            </div>

            {/* Paleta de Cores da Caixa */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Cor da Caixa (Principal)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cfg.boxBgColor.startsWith('#') ? cfg.boxBgColor : '#3D2E27'}
                    onChange={(e) => updateCfg({ boxBgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cfg.boxBgColor}
                    onChange={(e) => updateCfg({ boxBgColor: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Cor dos Títulos / Rótulos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cfg.labelColor.startsWith('#') ? cfg.labelColor : '#F3EAE3'}
                    onChange={(e) => updateCfg({ labelColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cfg.labelColor}
                    onChange={(e) => updateCfg({ labelColor: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Cor dos Chips Selecionados
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cfg.chipActiveBgColor.startsWith('#') ? cfg.chipActiveBgColor : '#DFC7B6'}
                    onChange={(e) => updateCfg({ chipActiveBgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cfg.chipActiveBgColor}
                    onChange={(e) => updateCfg({ chipActiveBgColor: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Cor do Botão Principal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cfg.submitBgColor.startsWith('#') ? cfg.submitBgColor : '#DFC7B6'}
                    onChange={(e) => updateCfg({ submitBgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cfg.submitBgColor}
                    onChange={(e) => updateCfg({ submitBgColor: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Fonte dos Rótulos */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-zinc-800">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Fonte das Perguntas
                </label>
                <select
                  value={cfg.labelFontFamily}
                  onChange={(e) => updateCfg({ labelFontFamily: e.target.value })}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                >
                  <option value="Cormorant Garamond">Cormorant Garamond (Foto 2)</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Inter">Inter</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Estilo da Letra
                </label>
                <select
                  value={cfg.labelFontStyle}
                  onChange={(e) => updateCfg({ labelFontStyle: e.target.value as 'italic' | 'normal' })}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                >
                  <option value="italic">Itálico Editorial (Foto 2)</option>
                  <option value="normal">Normal / Reto</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LACUNAS & CAMPOS DO FORMULÁRIO (ADICIONAR / REMOVER / PERSONALIZAR) */}
      {subTab === 'campos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
                Lacunas da Caixa ({cfg.fields.length})
              </span>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                Adicione ou remova campos para aumentar ou diminuir a caixa.
              </p>
            </div>
          </div>

          {/* Adicionar Nova Lacuna Dropdown */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { type: 'text', label: '+ Campo Texto' },
              { type: 'date', label: '+ Data c/ Checkbox' },
              { type: 'chips_single', label: '+ Botões Única Escolha' },
              { type: 'chips_multi', label: '+ Botões Múltipla Escolha' },
              { type: 'tel', label: '+ WhatsApp' },
              { type: 'textarea', label: '+ Mensagem' }
            ].map((btn) => (
              <button
                key={btn.type}
                type="button"
                onClick={() => handleAddField(btn.type as QuoteFieldType)}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isDarkShell
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-[#D05634] hover:text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-[#D05634] hover:text-[#D05634]'
                }`}
              >
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Lista de Campos Ativos */}
          <div className="space-y-2.5">
            {cfg.fields.map((field, idx) => {
              const isExp = expandedFieldId === field.id;
              return (
                <div
                  key={field.id}
                  className={`rounded-2xl border transition-all ${
                    isExp
                      ? 'border-[#D05634] bg-[#D05634]/5'
                      : isDarkShell
                        ? 'bg-zinc-950 border-zinc-800'
                        : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    onClick={() => setExpandedFieldId(isExp ? null : field.id)}
                    className="p-3 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-black block truncate">{field.label}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-mono">{field.type}</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveField(idx, -1)}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-25 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === cfg.fields.length - 1}
                        onClick={() => handleMoveField(idx, 1)}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-25 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Remover lacuna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isExp && (
                    <div className="px-3 pb-3.5 pt-2 border-t border-gray-200/60 dark:border-zinc-800 space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                          Título / Pergunta da Lacuna
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border text-xs ${
                            isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                            Tipo de Campo
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleUpdateField(field.id, { type: e.target.value as QuoteFieldType })
                            }
                            className={`w-full px-2.5 py-2 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                            }`}
                          >
                            <option value="text">Texto Curto</option>
                            <option value="tel">WhatsApp / Telefone</option>
                            <option value="email">E-mail</option>
                            <option value="date">Data do Evento</option>
                            <option value="chips_single">Botões (Escolha Única)</option>
                            <option value="chips_multi">Botões (Múltipla Escolha)</option>
                            <option value="select">Lista Suspensa</option>
                            <option value="textarea">Mensagem Longa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                            Largura na Caixa
                          </label>
                          <select
                            value={field.width || 'full'}
                            onChange={(e) =>
                              handleUpdateField(field.id, { width: e.target.value as any })
                            }
                            className={`w-full px-2.5 py-2 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                            }`}
                          >
                            <option value="full">Linha Inteira (100%)</option>
                            <option value="half">Meia Linha (50%)</option>
                            <option value="third">Um Terço (33%)</option>
                          </select>
                        </div>
                      </div>

                      {(field.type === 'text' ||
                        field.type === 'tel' ||
                        field.type === 'email' ||
                        field.type === 'date' ||
                        field.type === 'textarea') && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                            Texto de Exemplo (Placeholder)
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) =>
                              handleUpdateField(field.id, { placeholder: e.target.value })
                            }
                            className={`w-full px-3 py-2 rounded-xl border text-xs ${
                              isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                            }`}
                          />
                        </div>
                      )}

                      {field.type === 'date' && (
                        <div className="space-y-2 pt-1">
                          <label className="flex items-center justify-between gap-2 cursor-pointer">
                            <span className="text-xs font-bold">
                              Opção "Ainda não definimos a data"
                            </span>
                            <input
                              type="checkbox"
                              checked={Boolean(field.showUndefinedDateCheckbox)}
                              onChange={(e) =>
                                handleUpdateField(field.id, {
                                  showUndefinedDateCheckbox: e.target.checked
                                })
                              }
                              className="w-4 h-4 accent-[#D05634]"
                            />
                          </label>
                        </div>
                      )}

                      {(field.type === 'chips_single' ||
                        field.type === 'chips_multi' ||
                        field.type === 'select') && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[10px] font-bold uppercase text-gray-400">
                            Opções de Escolha ({field.options?.length || 0})
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {(field.options || []).map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
                                  isDarkShell
                                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                                    : 'bg-gray-100 border-gray-300 text-gray-800'
                                }`}
                              >
                                <span>{opt}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextOpts = (field.options || []).filter((_, i) => i !== oIdx);
                                    handleUpdateField(field.id, { options: nextOpts });
                                  }}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newOptionInputs[field.id] || ''}
                              onChange={(e) =>
                                setNewOptionInputs((prev) => ({
                                  ...prev,
                                  [field.id]: e.target.value
                                }))
                              }
                              placeholder="Nova opção (ex: Álbum Impresso)"
                              className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                                isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = (newOptionInputs[field.id] || '').trim();
                                if (!val) return;
                                handleUpdateField(field.id, {
                                  options: [...(field.options || []), val]
                                });
                                setNewOptionInputs((prev) => ({ ...prev, [field.id]: '' }));
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#D05634] text-white text-xs font-bold cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>

                          {field.type !== 'select' && (
                            <div className="space-y-2 pt-2 border-t border-gray-200/50 dark:border-zinc-800">
                              <label className="block text-[10px] font-bold uppercase text-gray-400">
                                Link de Exemplo / Vídeo Abaixo do Campo (Opcional)
                              </label>
                              <input
                                type="text"
                                value={field.helperLinkText || ''}
                                onChange={(e) =>
                                  handleUpdateField(field.id, { helperLinkText: e.target.value })
                                }
                                placeholder="Ex: Não sabe o que é same-day edit? Assista a um exemplo"
                                className={`w-full px-3 py-1.5 rounded-xl border text-xs ${
                                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                                }`}
                              />
                              <input
                                type="url"
                                value={field.helperLinkUrl || ''}
                                onChange={(e) =>
                                  handleUpdateField(field.id, { helperLinkUrl: e.target.value })
                                }
                                placeholder="URL do vídeo (YouTube, Vimeo ou Link)"
                                className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono ${
                                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                                }`}
                              />
                            </div>
                          )}
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

      {/* SUBTAB 4: CONEXÃO COM PIPELINES E COLUNAS DO CRM FRAMEPRO */}
      {subTab === 'crm' && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Formulário PRO + FramePRO CRM Conectado
                </span>
              </div>
              <button
                type="button"
                onClick={fetchCrmPipelines}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-xs flex items-center gap-1 hover:border-[#D05634] cursor-pointer"
                title="Sincronizar Funis e Colunas do CRM"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPipelines ? 'animate-spin text-[#D05634]' : ''}`} />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Cada orçamento respondido no seu site vai para a aba <strong>Leads Formulário PRO</strong> e também cria automaticamente um Lead dentro do <strong>CRM FramePRO</strong> no Funil (Pipeline) e Coluna selecionados abaixo:
            </p>

            <label className="flex items-center justify-between gap-2 pt-1 cursor-pointer">
              <span className="text-xs font-bold">Enviar automaticamente para o CRM FramePRO</span>
              <input
                type="checkbox"
                checked={cfg.crmIntegrationEnabled !== false}
                onChange={(e) => updateCfg({ crmIntegrationEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            {/* Seletor de Pipeline (Funil) */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                1. Escolha o Pipeline (Funil do CRM)
              </label>
              <select
                value={activePipeline.id}
                onChange={(e) => {
                  const found = pipelines.find((p) => p.id === e.target.value);
                  if (found) {
                    const firstCol = found.columns[0] || { id: 'col_novo_lead', name: 'Novo Lead' };
                    updateCfg({
                      crmPipelineId: found.id,
                      crmPipelineName: found.name,
                      crmColumnId: firstCol.id,
                      crmColumnName: firstCol.name
                    });
                  }
                }}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              >
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Coluna (Etapa do Kanban no CRM) */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                2. Escolha a Coluna (Etapa onde o Lead vai cair)
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {(activePipeline.columns || []).map((col, cIdx) => {
                  const isColSelected = cfg.crmColumnId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() =>
                        updateCfg({
                          crmPipelineId: activePipeline.id,
                          crmPipelineName: activePipeline.name,
                          crmColumnId: col.id,
                          crmColumnName: col.name
                        })
                      }
                      className={`w-full px-3 py-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isColSelected
                          ? 'border-[#D05634] bg-[#D05634]/15 text-[#D05634]'
                          : isDarkShell
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-mono">
                          {cIdx + 1}
                        </span>
                        <span>{col.name}</span>
                      </div>
                      {isColSelected && <Check className="w-4 h-4 text-[#D05634]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Adicionar Novo Pipeline ou Coluna Personalizada */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
              Gerenciar Pipelines & Colunas Sincronizadas
            </span>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400">
                + Adicionar Nova Coluna em "{activePipeline.name}"
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Ex: Qualificação Site"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const clean = newColumnName.trim();
                    if (!clean) return;
                    const newCol: CrmColumnItem = {
                      id: `col_${Date.now()}`,
                      name: clean,
                      order: activePipeline.columns.length
                    };
                    const nextPipes = pipelines.map((p) =>
                      p.id === activePipeline.id ? { ...p, columns: [...p.columns, newCol] } : p
                    );
                    handleSavePipelinesToServer(nextPipes);
                    updateCfg({
                      crmColumnId: newCol.id,
                      crmColumnName: newCol.name
                    });
                    setNewColumnName('');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#D05634] text-white text-xs font-bold cursor-pointer"
                >
                  Criar Coluna
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
              <label className="block text-[10px] font-bold text-gray-400">
                + Criar Novo Pipeline (Funil)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  placeholder="Ex: Funil Casamentos 2027"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const clean = newPipelineName.trim();
                    if (!clean) return;
                    const newPipe: CrmPipelineItem = {
                      id: `pipe_${Date.now()}`,
                      name: clean,
                      columns: [
                        { id: `col_${Date.now()}_1`, name: 'Novo Lead (Orçamento Site)', order: 0 },
                        { id: `col_${Date.now()}_2`, name: 'Proposta Enviada', order: 1 },
                        { id: `col_${Date.now()}_3`, name: 'Fechado', order: 2 }
                      ]
                    };
                    const nextPipes = [...pipelines, newPipe];
                    handleSavePipelinesToServer(nextPipes);
                    updateCfg({
                      crmPipelineId: newPipe.id,
                      crmPipelineName: newPipe.name,
                      crmColumnId: newPipe.columns[0].id,
                      crmColumnName: newPipe.columns[0].name
                    });
                    setNewPipelineName('');
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
                >
                  Criar Funil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
