import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  Copy,
  ExternalLink,
  Upload,
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  Gift,
  MapPin,
  FileText,
  RefreshCw,
  AlertCircle,
  Webhook,
  HelpCircle,
  ArrowRight,
  Lock
} from 'lucide-react';

export interface BookingPackageItem {
  id: string;
  name: string;
  badge?: string;
  subtitle?: string;
  pixPrice: number;
  cardPrice: number;
  maxInstallments: number;
  durationMinutes: number;
  includedPeople: number;
  extraPersonPrice: number;
  features: string[];
  ctaText?: string;
  highlighted?: boolean;
}

export interface BookingAddonItem {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  imageUrl?: string;
}

export interface BlockedSlotItem {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason?: string;
}

export interface BookingCheckoutConfig {
  enabled: boolean;
  displayMode: 'checkout_only' | 'Packages_and_checkout' | 'classic_form';
  // Header & Campaign Info
  kickerText: string;
  titleText: string;
  subtitleText: string;
  reservationRulesNotice: string;
  // Packages
  packages: BookingPackageItem[];
  // Add-on Products / Souvenirs
  addonsEnabled: boolean;
  addonsSectionTitle: string;
  addonsSectionSubtitle: string;
  addons: BookingAddonItem[];
  // Schedule / Agenda Config
  availableDaysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  timeSlots: string[]; // ['09:00', '10:00', '14:00', '15:00', '16:00']
  slotDurationMinutes: number;
  holdMinutes: number;
  blockedSlots: BlockedSlotItem[];
  // Payment Methods & Gateways
  allowPixFull: boolean;
  allowPix50Deposit: boolean;
  allowCreditCard: boolean;
  activeGateway: 'manual_pix' | 'asaas' | 'mercadopago' | 'paghiper';
  // Manual Pix Settings
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  pixKey: string;
  pixBeneficiary: string;
  pixInstructions: string;
  requireReceiptUpload: boolean;
  // Gateways Credentials
  asaasApiKey?: string;
  asaasEnvironment?: 'production' | 'sandbox';
  mercadoPagoAccessToken?: string;
  mercadoPagoPublicKey?: string;
  paghiperApiKey?: string;
  paghiperToken?: string;
  // Google Calendar & CRM Sync
  syncWithGoogleCalendar: boolean;
  googleCalendarEmail?: string;
}

export const DEFAULT_BOOKING_PACKAGES: BookingPackageItem[] = [
  {
    id: 'pkg_pinheiro',
    name: 'Pacote Pinheiro',
    subtitle: 'Ideal para quem quer o registro essencial da sessão com curadoria artística.',
    pixPrice: 890,
    cardPrice: 960,
    maxInstallments: 4,
    durationMinutes: 30,
    includedPeople: 5,
    extraPersonPrice: 100,
    features: [
      '30 minutos de sessão',
      '15 fotos digitais tratadas em alta resolução',
      'Até 5 pessoas (pais + filhos do mesmo núcleo)',
      'Galeria online privada para seleção'
    ],
    ctaText: 'Reservar Pinheiro',
    highlighted: false
  },
  {
    id: 'pkg_estrela',
    name: 'Pacote Estrela',
    badge: 'Mais escolhido',
    subtitle: 'Mais fotos, álbum impresso e tempo tranquilo com a família.',
    pixPrice: 1490,
    cardPrice: 1610,
    maxInstallments: 4,
    durationMinutes: 30,
    includedPeople: 5,
    extraPersonPrice: 100,
    features: [
      '30 minutos de sessão',
      '25 fotos digitais tratadas em alta resolução',
      'Álbum impresso 20x20cm com 20 páginas',
      'Até 5 pessoas (pais + filhos do mesmo núcleo)',
      '1 figurino do acervo incluso para as crianças',
      'Entrega prioritária em até 7 dias úteis'
    ],
    ctaText: 'Reservar Estrela',
    highlighted: true
  },
  {
    id: 'pkg_guirlanda',
    name: 'Pacote Guirlanda',
    badge: 'Experiência Completa',
    subtitle: 'A experiência completa — todas as fotos, álbum grande e vídeo.',
    pixPrice: 2190,
    cardPrice: 2370,
    maxInstallments: 4,
    durationMinutes: 30,
    includedPeople: 5,
    extraPersonPrice: 100,
    features: [
      '30 minutos de sessão',
      'Todas as fotos aprovadas da sessão (mínimo 40)',
      'Álbum fine art 25x25cm com 30 páginas em linho',
      'Mini filme vertical (Reels) de 30–45s editado',
      'Caixa presenteável com 10 fotos 15x21cm impressas',
      'Até 5 pessoas + pets bem-vindos',
      'Figurinos do acervo liberados'
    ],
    ctaText: 'Reservar Guirlanda',
    highlighted: false
  }
];

export const DEFAULT_BOOKING_ADDONS: BookingAddonItem[] = [
  {
    id: 'addon_calendario',
    name: 'Calendário de mesa personalizado',
    description: '12 meses com fotos do ensaio da família. Base em madeira pinus e impressão em papel couchê 250g.',
    price: 60
  },
  {
    id: 'addon_ima_1',
    name: 'Ímã em formato Polaroid',
    description: '1 unidade · 7,5×10cm com manta magnética total no verso e espaço para legenda.',
    price: 25
  },
  {
    id: 'addon_ima_5',
    name: 'Pacote 5 ímãs Polaroid',
    description: '5 unidades com fotos diferentes da sessão — ótimo para distribuir para os avós.',
    price: 100,
    badge: 'Economize R$ 25'
  },
  {
    id: 'addon_kit',
    name: 'Kit Lembrança (1 calendário + 3 ímãs)',
    description: 'Nosso combo mais pedido: o calendário para a mesa de trabalho + 3 polaroids magnéticas.',
    price: 120,
    badge: 'Combo com desconto'
  }
];

export const DEFAULT_BOOKING_CHECKOUT_CONFIG: BookingCheckoutConfig = {
  enabled: false,
  displayMode: 'Packages_and_checkout',
  kickerText: 'RESERVA ONLINE · AGENDA INTEGRADA',
  titleText: 'Escolha seu pacote, data e garanta sua vaga',
  subtitleText: 'Selecione o pacote ideal, personalize com produtos adicionais, escolha o melhor dia e horário na agenda e finalize via Pix ou Cartão.',
  reservationRulesNotice:
    'A confirmação da reserva está sujeita ao pagamento em até 30 minutos. Caso o pagamento não seja concluído nesse prazo, o horário volta a ficar disponível.',
  packages: DEFAULT_BOOKING_PACKAGES,
  addonsEnabled: true,
  addonsSectionTitle: 'Lembranças & Produtos Adicionais',
  addonsSectionSubtitle: 'Adicione produtos impressos com as fotos do seu ensaio. Escolha a quantidade desejada durante a reserva.',
  addons: DEFAULT_BOOKING_ADDONS,
  availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  slotDurationMinutes: 30,
  holdMinutes: 30,
  blockedSlots: [],
  allowPixFull: true,
  allowPix50Deposit: true,
  allowCreditCard: true,
  activeGateway: 'manual_pix',
  pixKeyType: 'email',
  pixKey: '',
  pixBeneficiary: '',
  pixInstructions: 'Realize o pagamento via Pix Copia e Cola ou QR Code abaixo e envie o comprovante para confirmarmos imediatamente o seu horário na agenda.',
  requireReceiptUpload: true,
  asaasEnvironment: 'production',
  syncWithGoogleCalendar: true
};

export function resolveBookingCheckoutConfig(rawQuoteCfg: any, site?: any): BookingCheckoutConfig {
  const raw = rawQuoteCfg?.bookingCheckout || {};
  return {
    ...DEFAULT_BOOKING_CHECKOUT_CONFIG,
    ...raw,
    pixKey: raw.pixKey || site?.socialLinks?.whatsapp || site?.contactEmail || '',
    pixBeneficiary: raw.pixBeneficiary || site?.photographerName || site?.title || 'Estúdio Fotográfico',
    packages: Array.isArray(raw.packages) && raw.packages.length > 0 ? raw.packages : DEFAULT_BOOKING_PACKAGES,
    addons: Array.isArray(raw.addons) ? raw.addons : DEFAULT_BOOKING_ADDONS,
    availableDaysOfWeek:
      Array.isArray(raw.availableDaysOfWeek) && raw.availableDaysOfWeek.length > 0
        ? raw.availableDaysOfWeek
        : [0, 1, 2, 3, 4, 5, 6],
    timeSlots:
      Array.isArray(raw.timeSlots) && raw.timeSlots.length > 0
        ? raw.timeSlots
        : ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    blockedSlots: Array.isArray(raw.blockedSlots) ? raw.blockedSlots : []
  };
}

function formatBRL(val: number): string {
  return Number(val || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const WEEKDAYS_SHORT_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ============================================================================
// PUBLIC 4-STEP BOOKING & PRODUCT CHECKOUT WIDGET
// ============================================================================
export function PublicBookingCheckoutWidget({
  site,
  config,
  isEditorPreview = false,
  onSelectQuoteTab
}: {
  site: any;
  config: BookingCheckoutConfig;
  isEditorPreview?: boolean;
  onSelectQuoteTab?: () => void;
}) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    () => config.packages.find((p) => p.highlighted)?.id || config.packages[0]?.id || ''
  );
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [showCheckoutWizard, setShowCheckoutWizard] = useState<boolean>(
    config.displayMode === 'checkout_only'
  );

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>(''); // HH:mm
  const [bookedSlots, setBookedSlots] = useState<Array<{ date: string; time: string; status: string }>>([]);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false);

  // Step 2: Personalize (Participants + Add-ons)
  const [parent1Name, setParent1Name] = useState('');
  const [parent2Name, setParent2Name] = useState('');
  const [childrenList, setChildrenList] = useState<Array<{ name: string; age: string }>>([]);
  const [extraGuestsList, setExtraGuestsList] = useState<Array<{ name: string; relation: string }>>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});

  // Step 3: Client Details & Address
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCpfCnpj, setClientCpfCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  // Step 4: Payment & Checkout Execution
  const [paymentMode, setPaymentMode] = useState<'pix_full' | 'pix_50_deposit' | 'credit_card'>('pix_full');
  const [installments, setInstallments] = useState<number>(1);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<any | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Receipt Upload State
  const [receiptUrl, setReceiptUrl] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');
  const [uploadingReceiptFile, setUploadingReceiptFile] = useState(false);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receiptSentSuccess, setReceiptSentSuccess] = useState(false);

  const selectedPkg = useMemo(
    () => config.packages.find((p) => p.id === selectedPkgId) || config.packages[0],
    [config.packages, selectedPkgId]
  );

  // Fetch live availability from server
  const fetchAvailability = async () => {
    const targetSiteId = site?.id || site?.slug;
    if (!targetSiteId) return;
    setLoadingAvailability(true);
    try {
      const res = await fetch(`/api/sites/${encodeURIComponent(targetSiteId)}/availability`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookedSlots)) {
          setBookedSlots(data.bookedSlots);
        }
      }
    } catch {
      // ignore offline
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [site?.id, site?.slug]);

  // Poll booking status when waiting for gateway webhook or photographer approval
  useEffect(() => {
    if (!completedBooking?.lead?.id) return;
    if (completedBooking.lead.bookingStatus === 'confirmado_agendado') return;
    const targetSiteId = site?.id || site?.slug || 'default';
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/sites/${encodeURIComponent(targetSiteId)}/leads/${completedBooking.lead.id}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.bookingStatus && data.bookingStatus !== completedBooking.lead.bookingStatus) {
            setCompletedBooking((prev: any) =>
              prev ? { ...prev, lead: { ...prev.lead, bookingStatus: data.bookingStatus, paymentStatus: data.paymentStatus } } : prev
            );
          }
        }
      } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [completedBooking?.lead?.id, completedBooking?.lead?.bookingStatus, site?.id]);

  // Auto-select first available date in current view month if none selected
  useEffect(() => {
    if (selectedDate) return;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewYear, viewMonth, d);
      if (dt < new Date(today.getFullYear(), today.getMonth(), today.getDate())) continue;
      if (config.availableDaysOfWeek.includes(dt.getDay())) {
        const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        setSelectedDate(iso);
        break;
      }
    }
  }, [viewYear, viewMonth, config.availableDaysOfWeek, selectedDate, today]);

  // Auto-lookup CEP via ViaCEP
  const handleCepChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 8);
    const formatted = clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean;
    setCep(formatted);
    if (clean.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            if (data.logradouro) setStreet(data.logradouro);
            if (data.bairro) setNeighborhood(data.bairro);
            if (data.localidade) setCity(data.localidade);
            if (data.uf) setStateUf(data.uf);
          }
        }
      } catch {}
      setLoadingCep(false);
    }
  };

  // Price calculations
  const basePackagePrice =
    paymentMode === 'credit_card'
      ? Number(selectedPkg?.cardPrice || selectedPkg?.pixPrice || 0)
      : Number(selectedPkg?.pixPrice || 0);

  const extraGuestPriceUnit = Number(selectedPkg?.extraPersonPrice || 100);
  const extraGuestsTotal = extraGuestsList.length * extraGuestPriceUnit;

  const selectedAddonsArray = useMemo(() => {
    return (config.addons || [])
      .filter((a) => (addonQuantities[a.id] || 0) > 0)
      .map((a) => ({
        id: a.id,
        name: a.name,
        price: Number(a.price || 0),
        qty: addonQuantities[a.id] || 0
      }));
  }, [config.addons, addonQuantities]);

  const addonsTotal = useMemo(
    () => selectedAddonsArray.reduce((acc, item) => acc + item.price * item.qty, 0),
    [selectedAddonsArray]
  );

  const amountTotal = basePackagePrice + extraGuestsTotal + addonsTotal;
  const amountDueNow =
    paymentMode === 'pix_50_deposit' ? Math.round((amountTotal / 2) * 100) / 100 : amountTotal;
  const amountRemainingOnDay = Math.max(0, amountTotal - amountDueNow);

  const isSlotBooked = (dateIso: string, timeStr: string): boolean => {
    const inServer = bookedSlots.some((b) => b.date === dateIso && b.time === timeStr);
    const inConfig = (config.blockedSlots || []).some((b) => b.date === dateIso && b.time === timeStr);
    return inServer || inConfig;
  };

  // Build calendar days for viewYear / viewMonth
  const calendarDays = useMemo(() => {
    const firstDayWeek = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ day: number | null; iso: string; available: boolean; allBooked: boolean }> = [];
    for (let i = 0; i < firstDayWeek; i++) {
      cells.push({ day: null, iso: '', available: false, allBooked: false });
    }
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for (let d = 1; d <= totalDays; d++) {
      const dt = new Date(viewYear, viewMonth, d);
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isPast = dt < todayZero;
      const isDayAllowed = config.availableDaysOfWeek.includes(dt.getDay());
      const slots = config.timeSlots || [];
      const freeSlots = slots.filter((t) => !isSlotBooked(iso, t));
      const allBooked = slots.length > 0 && freeSlots.length === 0;
      cells.push({
        day: d,
        iso,
        available: !isPast && isDayAllowed && !allBooked,
        allBooked: !isPast && isDayAllowed && allBooked
      });
    }
    return cells;
  }, [viewYear, viewMonth, config.availableDaysOfWeek, config.timeSlots, bookedSlots, config.blockedSlots, today]);

  const handleUploadReceiptImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceiptFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          setReceiptUrl(data.url);
          setUploadingReceiptFile(false);
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setReceiptUrl(reader.result);
        setUploadingReceiptFile(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingReceiptFile(false);
    }
  };

  const handleConfirmBookingCheckout = async () => {
    setCheckoutError(null);
    if (!selectedDate || !selectedTime) {
      setActiveStep(1);
      setCheckoutError('Escolha uma data e um horário disponível na agenda.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      setActiveStep(3);
      setCheckoutError('Preencha seu nome completo e WhatsApp para continuar.');
      return;
    }

    setSubmittingCheckout(true);
    try {
      const targetSiteId = site?.id || site?.slug || 'default';
      const participantsSummaryParts = [
        parent1Name ? `Responsável 1: ${parent1Name}` : '',
        parent2Name ? `Responsável 2: ${parent2Name}` : '',
        ...childrenList.filter((c) => c.name).map((c) => `Criança: ${c.name} (${c.age || ''})`),
        ...extraGuestsList.filter((g) => g.name).map((g) => `Extra: ${g.name} (${g.relation || ''})`)
      ].filter(Boolean);

      const res = await fetch(`/api/sites/${encodeURIComponent(targetSiteId)}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPkg?.id,
          packageName: selectedPkg?.name,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          durationMinutes: selectedPkg?.durationMinutes || config.slotDurationMinutes || 30,
          participants: {
            parent1Name,
            parent2Name,
            children: childrenList,
            extraGuests: extraGuestsList,
            extraGuestsCount: extraGuestsList.length,
            extraGuestsFee: extraGuestsTotal,
            summary: participantsSummaryParts.join(' · ') || clientName
          },
          selectedAddons: selectedAddonsArray,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          cpfCnpj: clientCpfCnpj,
          address: {
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state: stateUf
          },
          paymentMode,
          paymentProvider: config.activeGateway || 'manual_pix',
          installments,
          amountTotal,
          amountDueNow,
          amountRemainingOnDay
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || 'Não foi possível concluir a reserva. Tente outro horário.');
        setSubmittingCheckout(false);
        return;
      }

      setCompletedBooking(data);
      fetchAvailability();
    } catch (err: any) {
      setCheckoutError(err.message || 'Erro de conexão ao processar reserva.');
    } finally {
      setSubmittingCheckout(false);
    }
  };

  const handleSendReceiptToPhotographer = async () => {
    if (!completedBooking?.lead?.id) return;
    setSubmittingReceipt(true);
    try {
      const targetSiteId = site?.id || site?.slug || 'default';
      const res = await fetch(
        `/api/sites/${encodeURIComponent(targetSiteId)}/leads/${completedBooking.lead.id}/receipt`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiptUrl: receiptUrl || 'Comprovante confirmado pelo cliente',
            receiptNotes,
            payerName: clientName
          })
        }
      );
      if (res.ok) {
        const data = await res.json();
        setReceiptSentSuccess(true);
        setCompletedBooking((prev: any) => (prev ? { ...prev, lead: data.lead } : prev));
      }
    } catch {}
    setSubmittingReceipt(false);
  };

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return 'Escolha no calendário';
    const [y, m, d] = selectedDate.split('-').map(Number);
    return `${String(d).padStart(2, '0')} de ${MONTH_NAMES_PT[(m || 1) - 1]?.toLowerCase() || ''} de ${y}`;
  }, [selectedDate]);

  return (
    <div
      onClick={(e) => {
        if (isEditorPreview && onSelectQuoteTab) {
          e.stopPropagation();
          onSelectQuoteTab();
        }
      }}
      className="w-full max-w-6xl mx-auto text-left space-y-12"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {config.kickerText && (
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D05634] block">
            {config.kickerText}
          </span>
        )}
        <h2
          className="text-3xl md:text-5xl font-normal tracking-tight text-[#FAF6F0]"
          style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
        >
          {config.titleText || 'Escolha seu pacote e garanta seu horário'}
        </h2>
        {config.subtitleText && (
          <p className="text-sm text-[#FAF6F0]/75 leading-relaxed">{config.subtitleText}</p>
        )}
      </div>

      {/* 1. PACKAGES VITRINE CARDS (Shown when displayMode !== 'checkout_only' and not inside completed screen) */}
      {!completedBooking && config.displayMode !== 'checkout_only' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {config.packages.map((pkg) => {
              const isSelected = pkg.id === selectedPkg?.id;
              const installmentVal = pkg.cardPrice / (pkg.maxInstallments || 4);
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all border ${
                    pkg.highlighted || isSelected
                      ? 'bg-gradient-to-b from-[#2A1F1A] to-[#171210] border-[#D4AF37]/60 shadow-2xl scale-[1.01]'
                      : 'bg-[#171210]/90 border-white/10 hover:border-white/25'
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#D4AF37] text-[#171210] shadow-lg">
                      {pkg.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3
                        className="text-2xl font-semibold text-[#FAF6F0]"
                        style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                      >
                        {pkg.name}
                      </h3>
                      {pkg.subtitle && (
                        <p className="text-xs text-[#FAF6F0]/65 mt-1 leading-relaxed">{pkg.subtitle}</p>
                      )}
                    </div>

                    <div className="pt-2 pb-4 border-b border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-[#D4AF37] font-bold">R$</span>
                        <span className="text-4xl font-black text-[#FAF6F0] tracking-tight">
                          {formatBRL(pkg.pixPrice)}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">no Pix</span>
                      </div>
                      {config.allowCreditCard && (
                        <p className="text-[11px] text-[#FAF6F0]/60 mt-1">
                          ou R$ {formatBRL(pkg.cardPrice)} em até {pkg.maxInstallments || 4}x de R${' '}
                          {formatBRL(installmentVal)}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#FAF6F0]/85">
                      {(pkg.features || []).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {pkg.extraPersonPrice > 0 && (
                      <p className="text-[11px] text-[#FAF6F0]/55 pt-2 border-t border-white/5">
                        Convidado extra (avós, tios, primos):{' '}
                        <strong className="text-[#D4AF37]">+ R$ {formatBRL(pkg.extraPersonPrice)}</strong> por pessoa
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPkgId(pkg.id);
                      setShowCheckoutWizard(true);
                      setActiveStep(1);
                    }}
                    className={`mt-6 w-full py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      pkg.highlighted || isSelected
                        ? 'bg-[#D4AF37] text-[#171210] hover:bg-[#e3be42] shadow-lg'
                        : 'bg-white/10 text-[#FAF6F0] hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    <span>{pkg.ctaText || `Reservar ${pkg.name}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ADD-ONS SHOWCASE PREVIEW */}
          {config.addonsEnabled && config.addons.length > 0 && !showCheckoutWizard && (
            <div className="rounded-3xl bg-[#171210]/85 border border-white/10 p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block">
                    Produtos Opcionais · Escolha na Reserva
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-normal text-[#FAF6F0] mt-1"
                    style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                  >
                    {config.addonsSectionTitle || 'Lembranças com foto do ensaio'}
                  </h3>
                  <p className="text-xs text-[#FAF6F0]/65 mt-1">{config.addonsSectionSubtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutWizard(true);
                    setActiveStep(1);
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-wider hover:opacity-95 transition-opacity shrink-0 cursor-pointer"
                >
                  Escolher Horário & Personalizar →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      {addon.badge && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37]">
                          {addon.badge}
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-[#FAF6F0]">{addon.name}</h4>
                      <p className="text-[11px] text-[#FAF6F0]/60 leading-relaxed">{addon.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-black text-[#D4AF37]">R$ {formatBRL(addon.price)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAddonQuantities((prev) => ({ ...prev, [addon.id]: (prev[addon.id] || 0) + 1 }));
                          setShowCheckoutWizard(true);
                        }}
                        className="text-[11px] font-bold text-[#FAF6F0]/80 hover:text-[#D4AF37] cursor-pointer"
                      >
                        + Incluir na reserva
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. 4-STEP INTERACTIVE BOOKING & CHECKOUT WIZARD */}
      {(showCheckoutWizard || config.displayMode === 'checkout_only') && !completedBooking && (
        <div className="rounded-3xl bg-[#171210]/95 border border-[#D4AF37]/30 p-6 md:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Top Stepper Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {[
                { num: 1, label: 'Data e horário' },
                { num: 2, label: 'Personalize' },
                { num: 3, label: 'Seus dados' },
                { num: 4, label: 'Pagamento' }
              ].map((st) => {
                const isCurrent = activeStep === st.num;
                const isDone = activeStep > st.num;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveStep(st.num as 1 | 2 | 3 | 4)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#171210] shadow-md'
                        : isDone
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-[#FAF6F0]/60 hover:text-[#FAF6F0]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                      {isDone ? '✓' : st.num}
                    </span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Package Switcher Pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#FAF6F0]/60">Pacote:</span>
              <select
                value={selectedPkg?.id || ''}
                onChange={(e) => setSelectedPkgId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-black/50 border border-[#D4AF37]/40 text-xs font-bold text-[#FAF6F0] outline-none"
              >
                {config.packages.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                    {p.name} — R$ {formatBRL(p.pixPrice)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {checkoutError && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* MAIN 2-COLUMN LAYOUT: LEFT = STEP CONTENT, RIGHT = STICKY RESUMO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1: DATA E HORÁRIO */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3
                      className="text-2xl font-normal text-[#FAF6F0]"
                      style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                    >
                      Escolha o dia e o horário
                    </h3>
                    <p className="text-xs text-[#FAF6F0]/65 mt-1">
                      Sessões de {selectedPkg?.durationMinutes || config.slotDurationMinutes || 30} minutos. Horários
                      riscados já foram reservados em tempo real.
                    </p>
                  </div>

                  {config.reservationRulesNotice && (
                    <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-start gap-3 text-xs text-[#FAF6F0]/90">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#D4AF37]">Importante sobre a reserva:</strong>{' '}
                        {config.reservationRulesNotice}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Monthly Interactive Calendar */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            if (viewMonth === 0) {
                              setViewMonth(11);
                              setViewYear((y) => y - 1);
                            } else {
                              setViewMonth((m) => m - 1);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#FAF6F0] cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-center">
                          <span className="text-sm font-bold text-[#FAF6F0] block">
                            {MONTH_NAMES_PT[viewMonth]} {viewYear}
                          </span>
                          <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">
                            Agenda disponível
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (viewMonth === 11) {
                              setViewMonth(0);
                              setViewYear((y) => y + 1);
                            } else {
                              setViewMonth((m) => m + 1);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#FAF6F0] cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#FAF6F0]/45">
                        {WEEKDAYS_SHORT_PT.map((w, idx) => (
                          <div key={idx} className="py-1">
                            {w}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        {calendarDays.map((cell, idx) => {
                          if (!cell.day) {
                            return <div key={`empty-${idx}`} className="h-9" />;
                          }
                          const isSelected = selectedDate === cell.iso;
                          return (
                            <button
                              key={cell.iso}
                              type="button"
                              disabled={!cell.available}
                              onClick={() => {
                                setSelectedDate(cell.iso);
                                setSelectedTime('');
                              }}
                              className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#D4AF37] text-[#171210] shadow-md scale-105 cursor-pointer'
                                  : cell.available
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer'
                                    : cell.allBooked
                                      ? 'bg-red-500/10 text-red-400/50 line-through cursor-not-allowed'
                                      : 'text-white/20 cursor-not-allowed'
                              }`}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#FAF6F0]/60 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" /> Selecionado
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" /> Com vagas
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> Indisponível
                        </span>
                      </div>
                    </div>

                    {/* Time Slots Picker */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                            Horários do Dia
                          </span>
                          <h4 className="text-sm font-bold text-[#FAF6F0] mt-0.5">{formattedSelectedDate}</h4>
                        </div>
                        {loadingAvailability && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />}
                      </div>

                      {!selectedDate ? (
                        <p className="text-xs text-[#FAF6F0]/50 py-8 text-center">
                          Selecione um dia com vagas no calendário ao lado.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {(config.timeSlots || []).map((slot) => {
                            const taken = isSlotBooked(selectedDate, slot);
                            const isPicked = selectedTime === slot && !taken;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={taken}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                                  taken
                                    ? 'bg-white/5 border-white/5 text-white/30 line-through cursor-not-allowed'
                                    : isPicked
                                      ? 'bg-[#D4AF37] border-[#D4AF37] text-[#171210] shadow-md scale-[1.02] cursor-pointer'
                                      : 'bg-white/5 border-white/15 text-[#FAF6F0] hover:border-[#D4AF37]/60 cursor-pointer'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-3.5 rounded-2xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                      <span>Continuar para Personalização</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONALIZE (PARTICIPANTS + ADD-ONS) */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3
                      className="text-2xl font-normal text-[#FAF6F0]"
                      style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                    >
                      Quem vai participar do ensaio?
                    </h3>
                    <p className="text-xs text-[#FAF6F0]/65 mt-1">
                      O pacote inclui até {selectedPkg?.includedPeople || 5} pessoas do mesmo núcleo familiar. Convidados
                      extras têm acréscimo de R$ {formatBRL(extraGuestPriceUnit)} por pessoa.
                    </p>
                  </div>

                  {/* Family Core Inputs */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                          Mãe / Responsável 1 *
                        </label>
                        <input
                          type="text"
                          value={parent1Name}
                          onChange={(e) => setParent1Name(e.target.value)}
                          placeholder="Ex.: Mariana Silva"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                          Pai / Responsável 2 (opcional)
                        </label>
                        <input
                          type="text"
                          value={parent2Name}
                          onChange={(e) => setParent2Name(e.target.value)}
                          placeholder="Ex.: Lucas Silva"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Children List */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FAF6F0]">Filhos / Crianças (inclusos no pacote)</span>
                        <button
                          type="button"
                          onClick={() => setChildrenList((prev) => [...prev, { name: '', age: '' }])}
                          className="text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
                        >
                          + Adicionar filho(a)
                        </button>
                      </div>
                      {childrenList.map((child, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={child.name}
                            onChange={(e) => {
                              const next = [...childrenList];
                              next[idx].name = e.target.value;
                              setChildrenList(next);
                            }}
                            placeholder="Nome da criança"
                            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={child.age}
                            onChange={(e) => {
                              const next = [...childrenList];
                              next[idx].age = e.target.value;
                              setChildrenList(next);
                            }}
                            placeholder="Idade (ex: 3 anos)"
                            className="w-32 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setChildrenList((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Extra Paid Guests */}
                    {extraGuestPriceUnit > 0 && (
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#FAF6F0] block">
                              Pessoas extras (+ R$ {formatBRL(extraGuestPriceUnit)} cada)
                            </span>
                            <span className="text-[11px] text-[#FAF6F0]/55">
                              Avós, tios, primos ou padrinhos que vão participar das fotos
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExtraGuestsList((prev) => [...prev, { name: '', relation: '' }])}
                            className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37]/25 cursor-pointer"
                          >
                            + Adicionar pessoa extra (+ R$ {formatBRL(extraGuestPriceUnit)})
                          </button>
                        </div>
                        {extraGuestsList.map((guest, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => {
                                const next = [...extraGuestsList];
                                next[idx].name = e.target.value;
                                setExtraGuestsList(next);
                              }}
                              placeholder="Nome do convidado extra"
                              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={guest.relation}
                              onChange={(e) => {
                                const next = [...extraGuestsList];
                                next[idx].relation = e.target.value;
                                setExtraGuestsList(next);
                              }}
                              placeholder="Parentesco (ex: Avó)"
                              className="w-36 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setExtraGuestsList((prev) => prev.filter((_, i) => i !== idx))}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Optional Add-on Products with - / + steppers */}
                  {config.addonsEnabled && config.addons.length > 0 && (
                    <div className="space-y-3">
                      <div>
                        <h4
                          className="text-xl font-normal text-[#FAF6F0]"
                          style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                        >
                          {config.addonsSectionTitle || 'Quer incluir lembranças ou produtos adicionais?'}
                        </h4>
                        <p className="text-xs text-[#FAF6F0]/60">
                          Opcional — produzidos com as fotos que você escolher da sua galeria.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {config.addons.map((addon) => {
                          const qty = addonQuantities[addon.id] || 0;
                          return (
                            <div
                              key={addon.id}
                              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                                qty > 0
                                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50'
                                  : 'bg-black/40 border-white/10'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#FAF6F0]">{addon.name}</span>
                                  {addon.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37]">
                                      {addon.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#FAF6F0]/60">{addon.description}</p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm font-black text-[#D4AF37]">
                                  R$ {formatBRL(addon.price)}
                                </span>
                                <div className="flex items-center gap-2 bg-black/50 border border-white/15 rounded-xl px-2 py-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAddonQuantities((prev) => ({
                                        ...prev,
                                        [addon.id]: Math.max(0, (prev[addon.id] || 0) - 1)
                                      }))
                                    }
                                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-5 text-center text-xs font-black text-white">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAddonQuantities((prev) => ({
                                        ...prev,
                                        [addon.id]: (prev[addon.id] || 0) + 1
                                      }))
                                    }
                                    className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#171210] flex items-center justify-center cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-[#FAF6F0]/80 text-xs font-bold cursor-pointer"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (parent1Name && !clientName) setClientName(parent1Name);
                        setActiveStep(3);
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continuar para Seus Dados</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SEUS DADOS E ENDEREÇO */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3
                      className="text-2xl font-normal text-[#FAF6F0]"
                      style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                    >
                      Seus dados para reserva e contrato
                    </h3>
                    <p className="text-xs text-[#FAF6F0]/65 mt-1">
                      Enviaremos a confirmação, o acesso à galeria e os detalhes do ensaio para estes contatos.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Como consta no documento"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="voce@exemplo.com.br"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                        CPF ou CNPJ * (para contrato e nota fiscal)
                      </label>
                      <input
                        type="text"
                        value={clientCpfCnpj}
                        onChange={(e) => setClientCpfCnpj(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">
                        CEP {loadingCep && <span className="text-[#D4AF37]">(buscando...)</span>}
                      </label>
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">Rua / Logradouro</label>
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Rua, Avenida..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">Número</label>
                        <input
                          type="text"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="123"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">Bairro</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Bairro"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">Cidade</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Cidade"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#FAF6F0]/80 mb-1">UF</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={stateUf}
                          onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                          placeholder="SP"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-[#FAF6F0]/80 text-xs font-bold cursor-pointer"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="button"
                      disabled={!clientName.trim() || !clientPhone.trim()}
                      onClick={() => setActiveStep(4)}
                      className="px-6 py-3.5 rounded-2xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                      <span>Ir para Pagamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PAGAMENTO */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3
                      className="text-2xl font-normal text-[#FAF6F0]"
                      style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                    >
                      Como prefere pagar?
                    </h3>
                    <p className="text-xs text-[#FAF6F0]/65 mt-1">
                      Escolha Pix à vista, 50% agora para garantir a vaga na agenda ou Cartão de Crédito.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {config.allowPixFull !== false && (
                      <button
                        type="button"
                        onClick={() => setPaymentMode('pix_full')}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMode === 'pix_full'
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                            : 'bg-black/40 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold text-[#FAF6F0]">Pix à vista (100%)</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                              Valor com desconto no Pix
                            </span>
                          </div>
                          <p className="text-xs text-[#FAF6F0]/60">
                            Liberação imediata por QR Code ou Pix Copia e Cola
                          </p>
                        </div>
                        <span className="text-base font-black text-[#D4AF37]">
                          R$ {formatBRL(selectedPkg?.pixPrice + extraGuestsTotal + addonsTotal)}
                        </span>
                      </button>
                    )}

                    {config.allowPix50Deposit !== false && (
                      <button
                        type="button"
                        onClick={() => setPaymentMode('pix_50_deposit')}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMode === 'pix_50_deposit'
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                            : 'bg-black/40 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold text-[#FAF6F0]">
                              50% agora no Pix + 50% no dia do ensaio
                            </span>
                          </div>
                          <p className="text-xs text-[#FAF6F0]/60">
                            Sinal de 50% para reservar a data na agenda e o restante no dia da sessão
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-[#D4AF37] block">
                            R$ {formatBRL((selectedPkg?.pixPrice + extraGuestsTotal + addonsTotal) / 2)} agora
                          </span>
                          <span className="text-[10px] text-[#FAF6F0]/50">
                            + R$ {formatBRL((selectedPkg?.pixPrice + extraGuestsTotal + addonsTotal) / 2)} no dia
                          </span>
                        </div>
                      </button>
                    )}

                    {config.allowCreditCard !== false && (
                      <button
                        type="button"
                        onClick={() => setPaymentMode('credit_card')}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMode === 'credit_card'
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                            : 'bg-black/40 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold text-[#FAF6F0]">
                              Cartão de Crédito em até {selectedPkg?.maxInstallments || 4}x
                            </span>
                          </div>
                          <p className="text-xs text-[#FAF6F0]/60">
                            Processado com segurança via{' '}
                            {config.activeGateway === 'manual_pix'
                              ? 'Link de Pagamento / Gateway'
                              : config.activeGateway.toUpperCase()}
                          </p>
                        </div>
                        <span className="text-base font-black text-[#FAF6F0]">
                          R$ {formatBRL((selectedPkg?.cardPrice || selectedPkg?.pixPrice) + extraGuestsTotal + addonsTotal)}
                        </span>
                      </button>
                    )}
                  </div>

                  {paymentMode === 'credit_card' && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <label className="block text-xs font-bold text-[#FAF6F0]">Número de Parcelas</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs font-bold text-white"
                      >
                        {Array.from({ length: selectedPkg?.maxInstallments || 4 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}x de R$ {formatBRL(amountTotal / n)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-[#FAF6F0]/80 text-xs font-bold cursor-pointer"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="button"
                      disabled={submittingCheckout}
                      onClick={handleConfirmBookingCheckout}
                      className="px-7 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#171210] text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {submittingCheckout
                          ? 'Processando Reserva...'
                          : `Confirmar Reserva · R$ ${formatBRL(amountDueNow)}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY RESUMO DA RESERVA */}
            <div className="lg:col-span-4 lg:sticky lg:top-6 p-6 rounded-3xl bg-black/60 border border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Resumo da Reserva
                </span>
                <span className="text-[10px] font-bold text-emerald-400">
                  {selectedPkg?.durationMinutes || 30} min
                </span>
              </div>

              <div>
                <h4
                  className="text-xl font-semibold text-[#FAF6F0]"
                  style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                >
                  {selectedPkg?.name}
                </h4>
                <p className="text-xs text-[#FAF6F0]/70 mt-1">
                  📅 {formattedSelectedDate} {selectedTime ? `às ${selectedTime}` : ''}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-[#FAF6F0]/80">
                  <span>{selectedPkg?.name}</span>
                  <span className="font-bold">R$ {formatBRL(basePackagePrice)}</span>
                </div>

                {extraGuestsList.length > 0 && (
                  <div className="flex justify-between text-[#FAF6F0]/80">
                    <span>{extraGuestsList.length}x Pessoa(s) extra(s)</span>
                    <span className="font-bold">+ R$ {formatBRL(extraGuestsTotal)}</span>
                  </div>
                )}

                {selectedAddonsArray.map((item) => (
                  <div key={item.id} className="flex justify-between text-[#FAF6F0]/80">
                    <span>
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-bold">+ R$ {formatBRL(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/15 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase text-[#FAF6F0]/70">Total</span>
                  <span className="text-2xl font-black text-[#FAF6F0]">R$ {formatBRL(amountTotal)}</span>
                </div>
                {paymentMode === 'pix_50_deposit' && (
                  <div className="flex justify-between text-xs text-[#D4AF37] font-bold pt-1">
                    <span>Pagar agora (Sinal 50%):</span>
                    <span>R$ {formatBRL(amountDueNow)}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-[#FAF6F0]/65 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5" />
                Horário sincronizado automaticamente com a agenda do estúdio e FramePro CRM.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. POST-CHECKOUT PAYMENT & RECEIPT SCREEN */}
      {completedBooking && (
        <div className="rounded-3xl bg-[#171210] border border-[#D4AF37]/50 p-6 md:p-10 shadow-2xl max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
          {completedBooking.lead?.bookingStatus === 'confirmado_agendado' ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                Pagamento Confirmado · Horário Agendado
              </span>
              <h3
                className="text-3xl font-normal text-[#FAF6F0]"
                style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
              >
                Sua data está oficialmente reservada!
              </h3>
              <p className="text-xs text-[#FAF6F0]/75 max-w-md mx-auto leading-relaxed">
                Pacote <strong>{completedBooking.lead?.packageName}</strong> agendado para{' '}
                <strong>
                  {completedBooking.lead?.bookingDate} às {completedBooking.lead?.bookingTime}
                </strong>
                .
              </p>
              {completedBooking.lead?.googleCalendarUrl && (
                <a
                  href={completedBooking.lead.googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Salvar na Minha Google Agenda</span>
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest">
                    Pré-Reserva Criada · Aguardando Pagamento ({completedBooking.payment?.holdMinutes || 30} min)
                  </span>
                  <h3
                    className="text-2xl font-normal text-[#FAF6F0] mt-2"
                    style={{ fontFamily: `'${site?.headingFont || 'Cormorant Garamond'}', serif` }}
                  >
                    Finalize o pagamento para confirmar seu horário
                  </h3>
                  <p className="text-xs text-[#FAF6F0]/65">
                    {completedBooking.lead?.packageName} — {formattedSelectedDate} às {selectedTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#FAF6F0]/50 block">Valor a pagar agora</span>
                  <span className="text-2xl font-black text-[#D4AF37]">
                    R$ {formatBRL(completedBooking.payment?.amountDueNow || amountDueNow)}
                  </span>
                </div>
              </div>

              {/* GATEWAY CHECKOUT BUTTON IF REDIRECT URL EXISTS (Mercado Pago / Asaas Cartão) */}
              {completedBooking.payment?.checkoutRedirectUrl && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">
                      Pagamento Seguro via {String(completedBooking.payment.provider).toUpperCase()}
                    </h4>
                    <p className="text-xs text-white/70">
                      Clique no botão ao lado para concluir no ambiente seguro do gateway. Assim que aprovado, o
                      horário é confirmado automaticamente via Webhook.
                    </p>
                  </div>
                  <a
                    href={completedBooking.payment.checkoutRedirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0"
                  >
                    <span>Pagar Agora no Gateway</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* PIX QR CODE & COPY-PASTE */}
              {completedBooking.payment?.pixCopyPaste && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="md:col-span-4 flex flex-col items-center justify-center bg-white p-3 rounded-2xl">
                    <img
                      src={completedBooking.payment.pixQrCodeUrl}
                      alt="QR Code Pix"
                      className="w-44 h-44 object-contain"
                    />
                    <span className="text-[10px] font-bold text-zinc-700 mt-1">Escaneie no app do seu banco</span>
                  </div>
                  <div className="md:col-span-8 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                        Chave Pix / Pix Copia e Cola
                      </span>
                      <p className="text-xs text-[#FAF6F0]/80">
                        Favorecido: <strong>{completedBooking.payment.pixBeneficiary}</strong> (Chave:{' '}
                        <span className="font-mono">{completedBooking.payment.pixKey}</span>)
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={completedBooking.payment.pixCopyPaste}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-[11px] font-mono text-white/80"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(completedBooking.payment.pixCopyPaste);
                          setCopiedPix(true);
                          setTimeout(() => setCopiedPix(false), 2500);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#171210] text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPix ? 'Copiado!' : 'Copiar Pix'}</span>
                      </button>
                    </div>

                    {config.pixInstructions && (
                      <p className="text-xs text-[#FAF6F0]/65 leading-relaxed">{config.pixInstructions}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP TO UPLOAD / SEND PAYMENT RECEIPT SO PHOTOGRAPHER APPROVES & LOCKS AGENDA */}
              <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#FAF6F0]">
                      Já realizou o Pix? Envie o comprovante para trancar sua data na agenda
                    </h4>
                    <p className="text-xs text-[#FAF6F0]/65">
                      Assim que você anexar o comprovante abaixo, o fotógrafo recebe no painel e confirma sua data
                      definitivamente.
                    </p>
                  </div>
                </div>

                {receiptSentSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Comprovante enviado com sucesso!</span>
                    </div>
                    <p>
                      Seu horário ({selectedDate} às {selectedTime}) está reservado para análise do comprovante. Você
                      também pode avisar diretamente no WhatsApp abaixo:
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="px-4 py-3 rounded-xl bg-black/50 border border-dashed border-[#D4AF37]/60 text-xs font-bold text-[#FAF6F0] flex items-center justify-center gap-2 cursor-pointer hover:bg-black/70">
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span>
                        {uploadingReceiptFile
                          ? 'Enviando arquivo...'
                          : receiptUrl
                            ? '✓ Comprovante Anexado (Trocar)'
                            : 'Anexar Foto / Print do Comprovante'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleUploadReceiptImage}
                      />
                    </label>
                    <input
                      type="text"
                      value={receiptNotes}
                      onChange={(e) => setReceiptNotes(e.target.value)}
                      placeholder="Observação ou nome do titular do Pix (opcional)"
                      className="px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {!receiptSentSuccess && (
                    <button
                      type="button"
                      disabled={submittingReceipt}
                      onClick={handleSendReceiptToPhotographer}
                      className="px-5 py-3 rounded-xl bg-[#D4AF37] text-[#171210] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{submittingReceipt ? 'Enviando...' : 'Confirmar Envio do Comprovante'}</span>
                    </button>
                  )}

                  {/* Direct WhatsApp Button with Booking & Receipt summary */}
                  {(() => {
                    const rawPhone = site?.socialLinks?.whatsapp || config.pixKey || '';
                    const cleanPhone = String(rawPhone).replace(/\D/g, '');
                    if (!cleanPhone) return null;
                    const msg = [
                      `Olá ${site?.photographerName || ''}! Acabei de fazer minha reserva pelo site:`,
                      `📦 *Pacote:* ${selectedPkg?.name}`,
                      `📅 *Data e Horário:* ${selectedDate} às ${selectedTime}`,
                      `👤 *Cliente:* ${clientName}`,
                      `💰 *Valor:* R$ ${formatBRL(amountDueNow)}`,
                      receiptUrl ? `🧾 Já anexei o comprovante no sistema e estou enviando por aqui também!` : ''
                    ]
                      .filter(Boolean)
                      .join('\n');
                    return (
                      <a
                        href={`https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`}?text=${encodeURIComponent(msg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
                      >
                        <span>Enviar Comprovante no WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PHOTOGRAPHER'S DRAWER EDITOR FOR BOOKING CHECKOUT, GATEWAYS & WEBHOOKS
// ============================================================================
export function BookingCheckoutEditorSection({
  siteData,
  isDarkShell,
  config,
  onUpdateBookingConfig
}: {
  siteData: any;
  isDarkShell: boolean;
  config: BookingCheckoutConfig;
  onUpdateBookingConfig: (patch: Partial<BookingCheckoutConfig>) => void;
}) {
  const [subSection, setSubSection] = useState<'pacotes' | 'adicionais' | 'agenda' | 'pagamentos' | 'webhook'>(
    'pacotes'
  );
  const [newSlotInput, setNewSlotInput] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedIcs, setCopiedIcs] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);

  const siteId = siteData?.id || siteData?.slug || 'default';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://site.framepro.click';
  const webhookUrl = `${origin}/api/webhooks/payments/${config.activeGateway === 'manual_pix' ? 'asaas' : config.activeGateway}/${siteId}`;
  const icsCalendarUrl = `${origin}/api/sites/${siteId}/calendar.ics`;

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      const provider = config.activeGateway === 'manual_pix' ? 'asaas' : config.activeGateway;
      const res = await fetch(`/api/webhooks/payments/${provider}/${siteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testWebhook: true,
          event: 'PAYMENT_CONFIRMED',
          status: 'approved'
        })
      });
      const data = await res.json();
      setWebhookTestResult(
        data.webhookProcessed
          ? `✅ Automação verificada! A reserva #${data.leadId.slice(0, 10)} foi marcada como Paga e Agendada automaticamente.`
          : `✅ Webhook conectado e respondendo! (${data.note || 'Pronto para receber pagamentos'})`
      );
    } catch {
      setWebhookTestResult('Erro ao testar webhook.');
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {[
          { id: 'pacotes', label: '1. Pacotes & Preços' },
          { id: 'adicionais', label: '2. Produtos Extras' },
          { id: 'agenda', label: '3. Agenda & Horários' },
          { id: 'pagamentos', label: '4. Pix & Gateways' },
          { id: 'webhook', label: '5. Webhook & Google Agenda' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubSection(t.id as any)}
            className={`py-2 px-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subSection === t.id
                ? 'bg-[#D05634] text-white border-[#D05634]'
                : isDarkShell
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. PACOTES & PREÇOS */}
      {subSection === 'pacotes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634]">
              Pacotes com Compra Direta ({config.packages.length})
            </span>
            <button
              type="button"
              onClick={() => {
                const newPkg: BookingPackageItem = {
                  id: `pkg_${Date.now()}`,
                  name: `Novo Pacote ${config.packages.length + 1}`,
                  subtitle: 'Descrição resumida do pacote',
                  pixPrice: 990,
                  cardPrice: 1090,
                  maxInstallments: 4,
                  durationMinutes: 30,
                  includedPeople: 5,
                  extraPersonPrice: 100,
                  features: ['30 minutos de sessão', '15 fotos em alta resolução', 'Galeria online privada'],
                  ctaText: 'Reservar Agora'
                };
                onUpdateBookingConfig({ packages: [...config.packages, newPkg] });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#D05634] text-white text-[10px] font-bold cursor-pointer"
            >
              + Novo Pacote
            </button>
          </div>

          {config.packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`p-3.5 rounded-2xl border space-y-2.5 ${
                isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => {
                    const next = [...config.packages];
                    next[idx] = { ...pkg, name: e.target.value };
                    onUpdateBookingConfig({ packages: next });
                  }}
                  className={`flex-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateBookingConfig({ packages: config.packages.filter((_, i) => i !== idx) })
                  }
                  className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-400 mb-0.5">
                    Preço no Pix (R$)
                  </label>
                  <input
                    type="number"
                    value={pkg.pixPrice}
                    onChange={(e) => {
                      const next = [...config.packages];
                      next[idx] = { ...pkg, pixPrice: Number(e.target.value) };
                      onUpdateBookingConfig({ packages: next });
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-400 mb-0.5">
                    Preço no Cartão (R$)
                  </label>
                  <input
                    type="number"
                    value={pkg.cardPrice}
                    onChange={(e) => {
                      const next = [...config.packages];
                      next[idx] = { ...pkg, cardPrice: Number(e.target.value) };
                      onUpdateBookingConfig({ packages: next });
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-400 mb-0.5">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    value={pkg.durationMinutes}
                    onChange={(e) => {
                      const next = [...config.packages];
                      next[idx] = { ...pkg, durationMinutes: Number(e.target.value) };
                      onUpdateBookingConfig({ packages: next });
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-400 mb-0.5">
                    Pessoa Extra (R$)
                  </label>
                  <input
                    type="number"
                    value={pkg.extraPersonPrice}
                    onChange={(e) => {
                      const next = [...config.packages];
                      next[idx] = { ...pkg, extraPersonPrice: Number(e.target.value) };
                      onUpdateBookingConfig({ packages: next });
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-0.5">
                  Itens inclusos (1 por linha)
                </label>
                <textarea
                  rows={3}
                  value={(pkg.features || []).join('\n')}
                  onChange={(e) => {
                    const next = [...config.packages];
                    next[idx] = { ...pkg, features: e.target.value.split('\n').filter((l) => l.trim()) };
                    onUpdateBookingConfig({ packages: next });
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. PRODUTOS ADICIONAIS / LEMBRANÇAS */}
      {subSection === 'adicionais' && (
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-2 cursor-pointer">
            <span className="text-xs font-bold">Oferecer Produtos Adicionais / Lembranças no Checkout</span>
            <input
              type="checkbox"
              checked={config.addonsEnabled}
              onChange={(e) => onUpdateBookingConfig({ addonsEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#D05634]"
            />
          </label>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634]">
              Produtos Extras ({config.addons.length})
            </span>
            <button
              type="button"
              onClick={() => {
                const newAdd: BookingAddonItem = {
                  id: `addon_${Date.now()}`,
                  name: 'Novo Produto / Álbum Extra',
                  description: 'Descrição do item opcional',
                  price: 80
                };
                onUpdateBookingConfig({ addons: [...config.addons, newAdd] });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#D05634] text-white text-[10px] font-bold cursor-pointer"
            >
              + Adicionar Produto
            </button>
          </div>

          {config.addons.map((addon, idx) => (
            <div
              key={addon.id}
              className={`p-3 rounded-2xl border space-y-2 ${
                isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={addon.name}
                  onChange={(e) => {
                    const next = [...config.addons];
                    next[idx] = { ...addon, name: e.target.value };
                    onUpdateBookingConfig({ addons: next });
                  }}
                  placeholder="Nome do produto"
                  className={`flex-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <input
                  type="number"
                  value={addon.price}
                  onChange={(e) => {
                    const next = [...config.addons];
                    next[idx] = { ...addon, price: Number(e.target.value) };
                    onUpdateBookingConfig({ addons: next });
                  }}
                  placeholder="R$"
                  className={`w-24 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onUpdateBookingConfig({ addons: config.addons.filter((_, i) => i !== idx) })}
                  className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={addon.description}
                onChange={(e) => {
                  const next = [...config.addons];
                  next[idx] = { ...addon, description: e.target.value };
                  onUpdateBookingConfig({ addons: next });
                }}
                placeholder="Descrição do produto"
                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. AGENDA & HORÁRIOS DISPONÍVEIS */}
      {subSection === 'agenda' && (
        <div className="space-y-4">
          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
              Dias da Semana com Atendimento
            </span>
            <div className="grid grid-cols-7 gap-1">
              {[
                { d: 0, label: 'Dom' },
                { d: 1, label: 'Seg' },
                { d: 2, label: 'Ter' },
                { d: 3, label: 'Qua' },
                { d: 4, label: 'Qui' },
                { d: 5, label: 'Sex' },
                { d: 6, label: 'Sáb' }
              ].map((item) => {
                const active = config.availableDaysOfWeek.includes(item.d);
                return (
                  <button
                    key={item.d}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? config.availableDaysOfWeek.filter((x) => x !== item.d)
                        : [...config.availableDaysOfWeek, item.d];
                      onUpdateBookingConfig({ availableDaysOfWeek: next });
                    }}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#D05634] text-white border-[#D05634]'
                        : isDarkShell
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
                Horários por Dia ({config.timeSlots.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.timeSlots.map((slot) => (
                  <span
                    key={slot}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                      isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  >
                    {slot}
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateBookingConfig({
                          timeSlots: config.timeSlots.filter((s) => s !== slot)
                        })
                      }
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1">
                <input
                  type="time"
                  value={newSlotInput}
                  onChange={(e) => setNewSlotInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSlotInput) return;
                    if (!config.timeSlots.includes(newSlotInput)) {
                      const sorted = [...config.timeSlots, newSlotInput].sort();
                      onUpdateBookingConfig({ timeSlots: sorted });
                    }
                    setNewSlotInput('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#D05634] text-white text-xs font-bold cursor-pointer"
                >
                  + Horário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PIX DIRETO & GATEWAYS (MERCADO PAGO, PAGHIPER, ASAAS) */}
      {subSection === 'pagamentos' && (
        <div className="space-y-3">
          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634] block">
              Opções de Pagamento Aceitas no Checkout
            </span>

            <label className="flex items-center justify-between gap-2 text-xs font-bold cursor-pointer">
              <span>Pix à vista (100%)</span>
              <input
                type="checkbox"
                checked={config.allowPixFull !== false}
                onChange={(e) => onUpdateBookingConfig({ allowPixFull: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            <label className="flex items-center justify-between gap-2 text-xs font-bold cursor-pointer">
              <span>Sinal de 50% no Pix agora + 50% no dia do ensaio</span>
              <input
                type="checkbox"
                checked={config.allowPix50Deposit !== false}
                onChange={(e) => onUpdateBookingConfig({ allowPix50Deposit: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>

            <label className="flex items-center justify-between gap-2 text-xs font-bold cursor-pointer">
              <span>Cartão de Crédito parcelado</span>
              <input
                type="checkbox"
                checked={config.allowCreditCard !== false}
                onChange={(e) => onUpdateBookingConfig({ allowCreditCard: e.target.checked })}
                className="w-4 h-4 accent-[#D05634]"
              />
            </label>
          </div>

          {/* Seletor de Método Principal: Pix Direto com Comprovante vs Gateways */}
          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#D05634]">
              Processador / Gateway de Pagamento
            </label>
            <select
              value={config.activeGateway}
              onChange={(e) => onUpdateBookingConfig({ activeGateway: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
              }`}
            >
              <option value="manual_pix">1. Pix Direto do Fotógrafo + Envio de Comprovante (Sem Taxas)</option>
              <option value="asaas">2. Asaas (Pix Automático + Cartão de Crédito + Webhook)</option>
              <option value="mercadopago">3. Mercado Pago (Pix + Cartão em até 12x + Webhook)</option>
              <option value="paghiper">4. PagHiper (Pix Automático + Webhook)</option>
            </select>

            {/* Configs de Pix Direto (sempre útil mesmo com gateway como fallback) */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">
                Sua Chave Pix (Para QR Code & Pix Copia e Cola)
              </span>
              <input
                type="text"
                value={config.pixKey}
                onChange={(e) => onUpdateBookingConfig({ pixKey: e.target.value })}
                placeholder="Ex: CNPJ, CPF, E-mail ou Celular"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              />
              <input
                type="text"
                value={config.pixBeneficiary}
                onChange={(e) => onUpdateBookingConfig({ pixBeneficiary: e.target.value })}
                placeholder="Nome do Favorecido no Pix"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                }`}
              />
            </div>

            {/* Credenciais Asaas */}
            {config.activeGateway === 'asaas' && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <span className="text-[10px] font-black uppercase text-emerald-500 block">
                  Configuração Asaas (Pix + Cartão)
                </span>
                <input
                  type="password"
                  value={config.asaasApiKey || ''}
                  onChange={(e) => onUpdateBookingConfig({ asaasApiKey: e.target.value })}
                  placeholder="API Key do Asaas ($aact_...)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>
            )}

            {/* Credenciais Mercado Pago */}
            {config.activeGateway === 'mercadopago' && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <span className="text-[10px] font-black uppercase text-sky-400 block">
                  Configuração Mercado Pago (Pix + Cartão)
                </span>
                <input
                  type="password"
                  value={config.mercadoPagoAccessToken || ''}
                  onChange={(e) => onUpdateBookingConfig({ mercadoPagoAccessToken: e.target.value })}
                  placeholder="Access Token de Produção (APP_USR-...)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>
            )}

            {/* Credenciais PagHiper */}
            {config.activeGateway === 'paghiper' && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <span className="text-[10px] font-black uppercase text-amber-400 block">
                  Configuração PagHiper
                </span>
                <input
                  type="text"
                  value={config.paghiperApiKey || ''}
                  onChange={(e) => onUpdateBookingConfig({ paghiperApiKey: e.target.value })}
                  placeholder="API Key PagHiper (apk_...)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
                <input
                  type="password"
                  value={config.paghiperToken || ''}
                  onChange={(e) => onUpdateBookingConfig({ paghiperToken: e.target.value })}
                  placeholder="Token Secreto PagHiper"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                    isDarkShell ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. ASSISTENTE DE WEBHOOK AUTOMÁTICO & CONEXÃO GOOGLE AGENDA / CRM */}
      {subSection === 'webhook' && (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-[#D05634]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634]">
                Assistente de Webhook (Baixa e Agendamento Automático)
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Copie a URL de Webhook abaixo e cole no painel do seu gateway (<strong>Asaas</strong>,{' '}
              <strong>Mercado Pago</strong> ou <strong>PagHiper</strong>). Quando o cliente pagar, o sistema aprova
              automaticamente, tranca a data na agenda e envia para o <strong>FramePro CRM + Google Agenda</strong>.
            </p>

            <div className="flex gap-1.5">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className={`flex-1 px-2.5 py-2 rounded-xl border text-[10px] font-mono ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-white border-gray-200 text-black'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  setCopiedWebhook(true);
                  setTimeout(() => setCopiedWebhook(false), 2500);
                }}
                className="px-3 py-2 rounded-xl bg-[#D05634] text-white text-[10px] font-black uppercase cursor-pointer shrink-0"
              >
                {copiedWebhook ? 'Copiado!' : 'Copiar URL'}
              </button>
            </div>

            {/* Passo a passo por Gateway */}
            <div
              className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                isDarkShell ? 'bg-zinc-900/70 border-zinc-800 text-zinc-300' : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <p className="font-black text-[#D05634]">Como ativar no seu Gateway:</p>
              <p>
                • <strong>Asaas:</strong> Acesse <em>Configurações → Integrações → Webhooks</em>, cole a URL acima e
                marque os eventos <code className="text-emerald-400">PAYMENT_CONFIRMED</code> e{' '}
                <code className="text-emerald-400">PAYMENT_RECEIVED</code>.
              </p>
              <p>
                • <strong>Mercado Pago:</strong> Em <em>Suas Integrações → Webhooks → Configurar notificações</em>,
                cole a URL em Modo Produção e marque o tópico <code className="text-sky-400">Pagamentos (Payments)</code>.
              </p>
              <p>
                • <strong>PagHiper:</strong> Em <em>Minha Conta → Integração → Retorno Automático</em>, cole a URL
                acima.
              </p>
            </div>

            <button
              type="button"
              disabled={testingWebhook}
              onClick={handleTestWebhook}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              {testingWebhook ? 'Simulando Disparo de Webhook...' : '⚡ Testar Automação de Webhook Agora'}
            </button>

            {webhookTestResult && (
              <p className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                {webhookTestResult}
              </p>
            )}
          </div>

          {/* Sincronização com Google Agenda (.ics + Link Direto) */}
          <div
            className={`p-4 rounded-2xl border space-y-2.5 ${
              isDarkShell ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D05634]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D05634]">
                Sincronização com Google Agenda & FramePro CRM
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Toda reserva aprovada (por você via comprovante Pix ou automaticamente via Webhook) entra na agenda do{' '}
              <strong>FramePro CRM</strong> e no link de assinatura da sua <strong>Google Agenda</strong>:
            </p>
            <div className="flex gap-1.5">
              <input
                type="text"
                readOnly
                value={icsCalendarUrl}
                className={`flex-1 px-2.5 py-2 rounded-xl border text-[10px] font-mono ${
                  isDarkShell ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-gray-200 text-black'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(icsCalendarUrl);
                  setCopiedIcs(true);
                  setTimeout(() => setCopiedIcs(false), 2500);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-white text-[10px] font-bold cursor-pointer shrink-0"
              >
                {copiedIcs ? 'Copiado!' : 'Copiar Feed .ICS'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              No Google Agenda, clique em <strong>Outras agendas (+) → De URL</strong> e cole o link acima para
              sincronizar automaticamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
