import React, { useState, useEffect, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';
import {
  FolderOpen,
  Sparkles,
  Sliders,
  Download,
  Upload,
  Check,
  X,
  Star,
  Copy,
  ClipboardPaste,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Code2,
  AlertCircle,
  Loader2,
  Layers,
  Image as ImageIcon,
  FileCode,
  Send,
  ExternalLink,
  Cpu,
  Columns2,
  RefreshCw,
  Wand2,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import {
  DevelopSettings,
  DEFAULT_DEVELOP_SETTINGS,
  PRESET_PROFILES,
  PresetProfileId,
  LearnedStyleProfile,
  CalibrationSample,
  generateAdobeXmp,
  parseXmpToDevelopSettings,
  getXmpFileName,
  isRawFileName,
  isSupportedPhotoFile,
  getFileExtension,
} from '../utils/xmpGenerator';
import {
  extractRawEmbeddedPreview,
  loadImageFromSource,
  generateSmartPreview,
  generateFastThumbnail,
  renderAdjustedToCanvas,
  exportEditedJpgBlob,
  analyzeImageWithLocalHistogram,
  HistogramBins,
} from '../utils/localImageProcessor';

export interface LocalPhotoItem {
  id: string;
  name: string;
  extension: string;
  isRaw: boolean;
  size: number;
  file?: File;
  fileHandle?: any;
  xmpFile?: File;
  xmpHandle?: any;
  objectUrl: string | null;
  thumbnailUrl: string | null;
  previewLoaded: boolean;
  rawPreviewFailed?: boolean;
  settings: DevelopSettings;
  aiProcessed: boolean;
  aiEngine?: 'gemini' | 'local-histogram' | 'xmp-loaded' | 'personal-style';
  xmpSavedToDisk: boolean;
  jpgSavedToDisk?: boolean;
  selected: boolean;
}

interface AIStudioViewProps {
  user: any | null;
  collections: any[];
  setCollections: React.Dispatch<React.SetStateAction<any[] | null>>;
  setCurrentCollectionId: (id: any) => void;
  setActiveTab: (tab: string) => void;
}

const DIR_HANDLE_IDB_KEY = 'frameplus_ai_last_dir_handle';

const SLIDER_GROUPS: {
  title: string;
  sliders: {
    key: keyof DevelopSettings;
    label: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    gradient?: string;
  }[];
}[] = [
  {
    title: 'Balanço de Branco',
    sliders: [
      {
        key: 'temperature',
        label: 'Temperatura',
        min: 2000,
        max: 10000,
        step: 50,
        unit: 'K',
        gradient: 'linear-gradient(to right, #3b82f6, #e5e7eb, #f59e0b)',
      },
      {
        key: 'tint',
        label: 'Matiz',
        min: -50,
        max: 50,
        step: 1,
        gradient: 'linear-gradient(to right, #22c55e, #e5e7eb, #ec4899)',
      },
    ],
  },
  {
    title: 'Tom & Exposição',
    sliders: [
      { key: 'exposure', label: 'Exposição', min: -3, max: 3, step: 0.05, unit: ' EV' },
      { key: 'contrast', label: 'Contraste', min: -100, max: 100, step: 1 },
      { key: 'highlights', label: 'Realces', min: -100, max: 100, step: 1 },
      { key: 'shadows', label: 'Sombras', min: -100, max: 100, step: 1 },
      { key: 'whites', label: 'Brancos', min: -100, max: 100, step: 1 },
      { key: 'blacks', label: 'Pretos', min: -100, max: 100, step: 1 },
    ],
  },
  {
    title: 'Presença & Pele',
    sliders: [
      { key: 'clarity', label: 'Claridade', min: -100, max: 100, step: 1 },
      { key: 'vibrance', label: 'Vibração', min: -100, max: 100, step: 1 },
      { key: 'saturation', label: 'Saturação', min: -100, max: 100, step: 1 },
      { key: 'skinSmoothing', label: 'Suavizar Pele', min: 0, max: 100, step: 1 },
    ],
  },
];

export function AIStudioView({
  user,
  collections,
  setCollections,
  setCurrentCollectionId,
  setActiveTab,
}: AIStudioViewProps) {
  const [photos, setPhotos] = useState<LocalPhotoItem[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [dirHandle, setDirHandle] = useState<any>(null);
  const [savedDirHandle, setSavedDirHandle] = useState<any>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [hasWritePermission, setHasWritePermission] = useState<boolean>(false);
  const [isScanningFolder, setIsScanningFolder] = useState<boolean>(false);

  // Saved 10-photo Personal Style Profiles
  const [savedProfiles, setSavedProfiles] = useState<LearnedStyleProfile[]>([]);
  const [presetProfile, setPresetProfile] = useState<PresetProfileId>('Clean & Natural');
  const [calibrationMode, setCalibrationMode] = useState<boolean>(false);
  const [calibrationSamples, setCalibrationSamples] = useState<CalibrationSample[]>([]);
  const [calibrationProfileName, setCalibrationProfileName] = useState<string>('Meu Padrão Pessoal');
  const [isTrainingProfile, setIsTrainingProfile] = useState<boolean>(false);

  const [aiMode, setAiMode] = useState<'gemini' | 'demo'>('gemini');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'edited' | 'starred' | 'raw'>('all');

  const [isAnalyzingSingle, setIsAnalyzingSingle] = useState<boolean>(false);
  const [isSavingJpgs, setIsSavingJpgs] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{
    running: boolean;
    current: number;
    total: number;
    currentName: string;
  }>({ running: false, current: 0, total: 0, currentName: '' });
  const batchCancelRef = useRef<boolean>(false);

  // Canvas view mode: default to 'edited' so edits are unmistakably visible across the full photo
  const [viewMode, setViewMode] = useState<'edited' | 'split' | 'original'>('edited');
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  const [clipboardSettings, setClipboardSettings] = useState<DevelopSettings | null>(null);
  const [histogram, setHistogram] = useState<HistogramBins | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    suggestDemoMode?: boolean;
  } | null>(null);

  const [isIframeBlockedModalOpen, setIsIframeBlockedModalOpen] = useState<boolean>(false);
  const [isLrModalOpen, setIsLrModalOpen] = useState<boolean>(false);
  const [lrPluginSource, setLrPluginSource] = useState<{
    infoLua: string;
    editWithFramePlusLua: string;
    exportProviderLua: string;
    readmeTxt: string;
  } | null>(null);
  const [lrModalTab, setLrModalTab] = useState<
    'install' | 'Info.lua' | 'EditWithFramePlusAI.lua' | 'ExportProvider.lua'
  >('install');

  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('new');
  const [newCollectionTitle, setNewCollectionTitle] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishProgress, setPublishProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const [isXmpPreviewOpen, setIsXmpPreviewOpen] = useState<boolean>(false);

  const fallbackInputRef = useRef<HTMLInputElement | null>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const splitStageRef = useRef<HTMLDivElement | null>(null);
  const loadedImageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadingPhotoIdsRef = useRef<Set<string>>(new Set());
  const activeObjectUrlsRef = useRef<string[]>([]);

  const activePhoto = photos.find((p) => p.id === activePhotoId) || null;
  const activeLearnedProfile =
    presetProfile.startsWith('personal:')
      ? savedProfiles.find((sp) => `personal:${sp.id}` === presetProfile) || null
      : null;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      activeObjectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
    };
  }, []);

  // Load saved directory handle from IndexedDB for 1-click reconnect
  useEffect(() => {
    get(DIR_HANDLE_IDB_KEY)
      .then((handle) => {
        if (handle && typeof handle.entries === 'function') {
          setSavedDirHandle(handle);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch photographer's saved 10-photo Personal Style Profiles
  useEffect(() => {
    if (!user?.uid) return;
    fetch(`/api/ai/style-profiles?ownerId=${encodeURIComponent(user.uid)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setSavedProfiles(list);
          setPresetProfile(`personal:${list[0].id}`);
          setCalibrationMode(false);
        } else {
          // Prompt photographer on first use to calibrate their 10-photo style
          setCalibrationMode(true);
        }
      })
      .catch(() => {});
  }, [user?.uid]);

  const filteredPhotos = photos.filter((p) => {
    if (filterMode === 'edited') return p.aiProcessed;
    if (filterMode === 'starred') return (p.settings.cullingScore || 0) >= 4;
    if (filterMode === 'raw') return p.isRaw;
    return true;
  });

  const selectedPhotos = photos.filter((p) => p.selected);

  // Lazy-decode a single LocalPhotoItem directly from its FileHandle or File (no upfront bulk import!)
  const resolvePhotoBinary = useCallback(async (item: LocalPhotoItem): Promise<LocalPhotoItem> => {
    if (item.previewLoaded && (item.objectUrl || item.rawPreviewFailed)) {
      return item;
    }

    let fileObj = item.file;
    if (!fileObj && item.fileHandle) {
      fileObj = await item.fileHandle.getFile();
    }
    if (!fileObj) return item;

    let parsedSettings = item.settings;
    let aiProcessed = item.aiProcessed;
    let aiEngine = item.aiEngine;
    let xmpSavedToDisk = item.xmpSavedToDisk;

    // Load XMP sidecar lazily if handle exists and not yet parsed
    if (!xmpSavedToDisk && (item.xmpFile || item.xmpHandle)) {
      try {
        const xmpF = item.xmpFile || (await item.xmpHandle.getFile());
        const xmpText = await xmpF.text();
        const parsed = parseXmpToDevelopSettings(xmpText);
        if (parsed) {
          parsedSettings = { ...DEFAULT_DEVELOP_SETTINGS, ...parsed };
          aiProcessed = true;
          aiEngine = 'xmp-loaded';
          xmpSavedToDisk = true;
        }
      } catch {}
    }

    let objectUrl: string | null = item.objectUrl;
    let thumbnailUrl: string | null = item.thumbnailUrl;
    let rawPreviewFailed = false;

    if (!objectUrl) {
      if (!item.isRaw) {
        objectUrl = URL.createObjectURL(fileObj);
        activeObjectUrlsRef.current.push(objectUrl);
        try {
          thumbnailUrl = await generateFastThumbnail(objectUrl, 220);
        } catch {
          thumbnailUrl = objectUrl;
        }
      } else {
        const embeddedBlob = await extractRawEmbeddedPreview(fileObj);
        if (embeddedBlob) {
          objectUrl = URL.createObjectURL(embeddedBlob);
          activeObjectUrlsRef.current.push(objectUrl);
          try {
            thumbnailUrl = await generateFastThumbnail(objectUrl, 220);
          } catch {
            thumbnailUrl = objectUrl;
          }
        } else {
          rawPreviewFailed = true;
        }
      }
    }

    return {
      ...item,
      file: fileObj,
      size: fileObj.size,
      objectUrl,
      thumbnailUrl,
      previewLoaded: true,
      rawPreviewFailed,
      settings: parsedSettings,
      aiProcessed,
      aiEngine,
      xmpSavedToDisk,
    };
  }, []);

  // Ensure the active photo is loaded immediately when clicked
  useEffect(() => {
    if (!activePhoto || activePhoto.previewLoaded) return;
    if (loadingPhotoIdsRef.current.has(activePhoto.id)) return;

    let cancelled = false;
    loadingPhotoIdsRef.current.add(activePhoto.id);

    resolvePhotoBinary(activePhoto)
      .then((updated) => {
        if (!cancelled) {
          setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      })
      .catch(() => {})
      .finally(() => {
        loadingPhotoIdsRef.current.delete(activePhoto.id);
      });

    return () => {
      cancelled = true;
    };
  }, [activePhoto?.id, activePhoto?.previewLoaded, resolvePhotoBinary]);

  // Background lazy thumbnail streamer (streams thumbnails gently 3 at a time without blocking UI)
  useEffect(() => {
    const pending = photos.filter(
      (p) => !p.previewLoaded && !loadingPhotoIdsRef.current.has(p.id)
    );
    if (pending.length === 0) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const batch = pending.slice(0, 3);
      batch.forEach((p) => loadingPhotoIdsRef.current.add(p.id));
      const results = await Promise.all(
        batch.map(async (item) => {
          try {
            return await resolvePhotoBinary(item);
          } catch {
            return { ...item, previewLoaded: true };
          }
        })
      );
      batch.forEach((p) => loadingPhotoIdsRef.current.delete(p.id));
      if (!cancelled) {
        const resultMap = new Map(results.map((r) => [r.id, r]));
        setPhotos((prev) => prev.map((p) => resultMap.get(p.id) || p));
      }
    }, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [photos, resolvePhotoBinary]);

  // Render active photo onto Before & After canvases whenever activePhotoId, objectUrl, or settings change
  useEffect(() => {
    let cancelled = false;

    const renderCanvases = async () => {
      if (!activePhoto || !activePhoto.objectUrl) {
        setHistogram(null);
        return;
      }

      try {
        let img = loadedImageCacheRef.current.get(activePhoto.id);
        if (!img) {
          img = await loadImageFromSource(activePhoto.objectUrl);
          loadedImageCacheRef.current.set(activePhoto.id, img);
        }
        if (cancelled) return;

        if (beforeCanvasRef.current) {
          renderAdjustedToCanvas(img, beforeCanvasRef.current, DEFAULT_DEVELOP_SETTINGS, 1400);
        }
        if (afterCanvasRef.current) {
          const bins = renderAdjustedToCanvas(img, afterCanvasRef.current, activePhoto.settings, 1400);
          if (!cancelled) {
            setHistogram(bins);
          }
        }
      } catch (err) {
        console.warn('Erro ao renderizar prévia no Canvas:', err);
      }
    };

    renderCanvases();
    return () => {
      cancelled = true;
    };
  }, [activePhoto?.id, activePhoto?.objectUrl, activePhoto?.settings]);

  // Keyboard shortcuts (Left/Right navigation, Space for Original toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'ArrowRight' && filteredPhotos.length > 0 && activePhotoId) {
        const idx = filteredPhotos.findIndex((p) => p.id === activePhotoId);
        if (idx !== -1 && idx < filteredPhotos.length - 1) {
          setActivePhotoId(filteredPhotos[idx + 1].id);
        }
      } else if (e.key === 'ArrowLeft' && filteredPhotos.length > 0 && activePhotoId) {
        const idx = filteredPhotos.findIndex((p) => p.id === activePhotoId);
        if (idx > 0) {
          setActivePhotoId(filteredPhotos[idx - 1].id);
        }
      } else if (e.code === 'Space' && activePhoto) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'original' ? 'edited' : 'original'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredPhotos, activePhotoId, activePhoto]);

  // Index lightweight directory entries instantly (zero upfront upload/import)
  const mountDirectoryEntries = async (
    entries: { name: string; file?: File; fileHandle?: any; size?: number }[],
    xmpMap: Map<string, { file?: File; fileHandle?: any }>,
    pickedFolderName: string,
    pickedDirHandle: any,
    canWrite: boolean
  ) => {
    activeObjectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    activeObjectUrlsRef.current = [];
    loadedImageCacheRef.current.clear();
    loadingPhotoIdsRef.current.clear();

    const photoEntries = entries
      .filter((e) => isSupportedPhotoFile(e.name) && !e.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    if (photoEntries.length === 0) {
      setStatusBanner({
        type: 'error',
        text: 'Nenhuma foto (.jpg, .png, .webp ou RAW .cr3/.nef/.arw/.dng) foi encontrada nesta pasta.',
      });
      setIsScanningFolder(false);
      return;
    }

    setDirHandle(pickedDirHandle);
    setFolderName(pickedFolderName);
    setHasWritePermission(canWrite);

    if (pickedDirHandle) {
      setSavedDirHandle(pickedDirHandle);
      set(DIR_HANDLE_IDB_KEY, pickedDirHandle).catch(() => {});
    }

    const initialItems: LocalPhotoItem[] = photoEntries.map((entry, i) => {
      const ext = getFileExtension(entry.name);
      const isRaw = isRawFileName(entry.name);
      const xmpKey = getXmpFileName(entry.name).toLowerCase();
      const xmpMatch = xmpMap.get(xmpKey);

      return {
        id: `local_${i}_${entry.name}`,
        name: entry.name,
        extension: ext.toUpperCase(),
        isRaw,
        size: entry.size || entry.file?.size || 0,
        file: entry.file,
        fileHandle: entry.fileHandle,
        xmpFile: xmpMatch?.file,
        xmpHandle: xmpMatch?.fileHandle,
        objectUrl: null,
        thumbnailUrl: null,
        previewLoaded: false,
        settings: { ...DEFAULT_DEVELOP_SETTINGS },
        aiProcessed: false,
        xmpSavedToDisk: false,
        selected: i < 12,
      };
    });

    // Decode first photo immediately so viewport opens crisp in 1 frame
    if (initialItems.length > 0) {
      try {
        initialItems[0] = await resolvePhotoBinary(initialItems[0]);
      } catch {}
    }

    setPhotos(initialItems);
    setActivePhotoId(initialItems[0]?.id || null);
    setIsScanningFolder(false);
    setStatusBanner({
      type: 'success',
      text: `${initialItems.length} arquivo(s) lido(s) diretamente da pasta "${pickedFolderName}"${
        canWrite ? ' com permissão de gravação direta em disco' : ' (somente leitura neste navegador)'
      }.`,
    });
  };

  // Scan a FileSystemDirectoryHandle without eagerly copying or uploading files
  const openDirectoryHandle = async (pickedHandle: any) => {
    setIsScanningFolder(true);
    let canWrite = false;
    try {
      const perm = await pickedHandle.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        canWrite = true;
      } else {
        const reqPerm = await pickedHandle.requestPermission({ mode: 'readwrite' });
        canWrite = reqPerm === 'granted';
      }
    } catch {
      canWrite = false;
    }

    const photoEntries: { name: string; fileHandle: any }[] = [];
    const xmpMap = new Map<string, { fileHandle: any }>();

    for await (const [, entry] of pickedHandle.entries()) {
      if (entry.kind === 'file') {
        const name: string = entry.name || '';
        if (name.toLowerCase().endsWith('.xmp')) {
          xmpMap.set(name.toLowerCase(), { fileHandle: entry });
        } else if (isSupportedPhotoFile(name)) {
          photoEntries.push({ name, fileHandle: entry });
        }
      }
    }

    await mountDirectoryEntries(
      photoEntries,
      xmpMap,
      pickedHandle.name || 'Pasta Local',
      pickedHandle,
      canWrite
    );
  };

  // Primary Directory Picker: tries real native File System Access API first.
  // Never silently triggers <input webkitdirectory> ("Upload X files?") on SecurityError; opens choice dialog instead!
  const handlePickLocalFolder = async () => {
    setStatusBanner(null);
    const win = window as any;

    if (typeof win.showDirectoryPicker === 'function') {
      try {
        const pickedHandle = await win.showDirectoryPicker({ mode: 'readwrite' });
        await openDirectoryHandle(pickedHandle);
        return;
      } catch (err: any) {
        setIsScanningFolder(false);
        if (err?.name === 'AbortError') return;
        // SecurityError (iframe restriction) -> show explicit modal letting user open standalone tab for TRUE direct access
        setIsIframeBlockedModalOpen(true);
        return;
      }
    }

    // Browser doesn't support File System Access API -> show informative modal before compatibility picker
    setIsIframeBlockedModalOpen(true);
  };

  const handleReconnectSavedFolder = async () => {
    if (!savedDirHandle) return;
    setStatusBanner(null);
    try {
      await openDirectoryHandle(savedDirHandle);
    } catch {
      setStatusBanner({
        type: 'info',
        text: 'Permissão expirada. Clique em "Selecionar Pasta Local" para autorizar novamente.',
      });
    }
  };

  const handleFallbackInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsIframeBlockedModalOpen(false);
    setIsScanningFolder(true);
    const photoEntries: { name: string; file: File; size: number }[] = [];
    const xmpMap = new Map<string, { file: File }>();
    let detectedFolder = 'Pasta Local';

    const files: File[] = Array.from(fileList as ArrayLike<File>);
    const firstRel = (files[0] as any)?.webkitRelativePath || '';
    if (firstRel.includes('/')) {
      detectedFolder = firstRel.split('/')[0];
    }

    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.xmp')) {
        xmpMap.set(file.name.toLowerCase(), { file });
      } else if (isSupportedPhotoFile(file.name)) {
        photoEntries.push({ name: file.name, file, size: file.size });
      }
    }

    await mountDirectoryEntries(photoEntries, xmpMap, detectedFolder, null, false);
    e.target.value = '';
  };

  // --- 10-PHOTO STYLE CALIBRATION HANDLERS ---
  const handleRegisterCalibrationSample = async () => {
    if (!activePhoto) return;
    const loaded = activePhoto.previewLoaded ? activePhoto : await resolvePhotoBinary(activePhoto);
    if (!loaded.objectUrl) {
      setStatusBanner({
        type: 'error',
        text: `Não foi possível ler preview visual de "${loaded.name}" para calibração.`,
      });
      return;
    }

    const preview = await generateSmartPreview(loaded.objectUrl, 480, 0.72);
    const sample: CalibrationSample = {
      photoId: loaded.id,
      fileName: loaded.name,
      thumbnailUrl: loaded.thumbnailUrl || preview.base64,
      previewBase64: preview.base64,
      settings: { ...loaded.settings },
    };

    setCalibrationSamples((prev) => {
      const existingIdx = prev.findIndex((s) => s.photoId === sample.photoId);
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx] = sample;
        return next;
      }
      if (prev.length >= 10) {
        return [...prev.slice(0, 9), sample];
      }
      return [...prev, sample];
    });

    // Advance automatically to next uncalibrated photo in list for fast 10-photo workflow
    const currentIdx = photos.findIndex((p) => p.id === loaded.id);
    if (currentIdx !== -1 && currentIdx < photos.length - 1) {
      setActivePhotoId(photos[currentIdx + 1].id);
    }

    setStatusBanner({
      type: 'success',
      text: `Foto "${loaded.name}" salva no seu padrão! Continue ajustando até completar 10 fotos.`,
    });
  };

  const handleImportXmpsForCalibration = async () => {
    if (photos.length === 0) return;
    setStatusBanner(null);

    const xmpCandidates = photos.filter((p) => p.xmpFile || p.xmpHandle || p.aiEngine === 'xmp-loaded');
    if (xmpCandidates.length === 0) {
      setStatusBanner({
        type: 'info',
        text: 'Nenhum arquivo .XMP pré-existente encontrado nesta pasta. Ajuste 10 fotos manualmente nos sliders e clique em "Registrar Foto no Padrão".',
      });
      return;
    }

    const collected: CalibrationSample[] = [];
    for (const item of xmpCandidates.slice(0, 10)) {
      const loaded = await resolvePhotoBinary(item);
      if (loaded.objectUrl) {
        const preview = await generateSmartPreview(loaded.objectUrl, 480, 0.72);
        collected.push({
          photoId: loaded.id,
          fileName: loaded.name,
          thumbnailUrl: loaded.thumbnailUrl || preview.base64,
          previewBase64: preview.base64,
          settings: { ...loaded.settings },
        });
      }
    }

    if (collected.length > 0) {
      setCalibrationSamples(collected);
      setStatusBanner({
        type: 'success',
        text: `${collected.length} edição(ões) .XMP lida(s) direto da pasta para calibração do seu padrão!`,
      });
    }
  };

  const handleTrainPersonalProfile = async () => {
    if (!user?.uid) {
      setStatusBanner({ type: 'error', text: 'Faça login para salvar seu padrão pessoal.' });
      return;
    }
    if (calibrationSamples.length < 3) {
      setStatusBanner({
        type: 'error',
        text: 'Registre pelo menos 3 fotos editadas (ideal 10 fotos) antes de treinar seu padrão.',
      });
      return;
    }

    setIsTrainingProfile(true);
    setStatusBanner(null);
    try {
      const res = await fetch('/api/ai/train-style-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user.uid,
          profileName: calibrationProfileName.trim() || 'Meu Padrão Pessoal',
          samples: calibrationSamples,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Falha ao treinar padrão pessoal.');
      }

      setSavedProfiles((prev) => {
        const filtered = prev.filter((p) => p.id !== data.id);
        return [data, ...filtered];
      });
      setPresetProfile(`personal:${data.id}`);
      setCalibrationMode(false);
      setStatusBanner({
        type: 'success',
        text: `Padrão "${data.name}" treinado com ${data.sampleCount} fotos! Clique em "Editar Lote com IA" para aplicar automaticamente nas fotos selecionadas.`,
      });
    } catch (err: any) {
      setStatusBanner({
        type: 'error',
        text: err?.message || 'Erro ao salvar padrão pessoal.',
      });
    } finally {
      setIsTrainingProfile(false);
    }
  };

  const handleDeleteSavedProfile = async (profileId: string) => {
    try {
      await fetch(`/api/ai/style-profiles/${encodeURIComponent(profileId)}`, { method: 'DELETE' });
      setSavedProfiles((prev) => prev.filter((p) => p.id !== profileId));
      if (presetProfile === `personal:${profileId}`) {
        setPresetProfile('Clean & Natural');
      }
    } catch {}
  };

  // Instant deterministic application of photographer's learned mean sliders across selected photos
  const handleApplyLearnedBaselineToSelected = () => {
    if (!activeLearnedProfile) return;
    const targets = selectedPhotos.length > 0 ? selectedPhotos : activePhoto ? [activePhoto] : [];
    if (targets.length === 0) return;

    const targetIds = new Set(targets.map((t) => t.id));
    setPhotos((prev) =>
      prev.map((p) =>
        targetIds.has(p.id)
          ? {
              ...p,
              settings: {
                ...activeLearnedProfile.meanSettings,
                cullingScore: p.settings.cullingScore || 4,
                aiReasoning: `Aplicado padrão calibrado "${activeLearnedProfile.name}" (${activeLearnedProfile.sampleCount} fotos).`,
              },
              aiProcessed: true,
              aiEngine: 'personal-style',
              xmpSavedToDisk: false,
            }
          : p
      )
    );
    setViewMode('edited');
    setStatusBanner({
      type: 'success',
      text: `Padrão "${activeLearnedProfile.name}" aplicado em ${targets.length} foto(s) selecionada(s).`,
    });
  };

  // Core AI Analyze function for a single photo item (adapts photographer's 10-photo Learned Profile to each photo's scene)
  const analyzeSingleItem = useCallback(
    async (
      item: LocalPhotoItem,
      mode: 'gemini' | 'demo',
      profile: PresetProfileId,
      learned: LearnedStyleProfile | null,
      promptExtra: string
    ) => {
      const loaded = item.previewLoaded ? item : await resolvePhotoBinary(item);
      if (!loaded.objectUrl) {
        throw new Error(`Não há preview legível disponível para "${loaded.name}".`);
      }

      if (mode === 'demo') {
        const result = await analyzeImageWithLocalHistogram(loaded.objectUrl, profile, learned);
        return { settings: result, engine: 'local-histogram' as const, loadedItem: loaded };
      }

      const smartPreview = await generateSmartPreview(loaded.objectUrl, 1024, 0.84);
      const res = await fetch('/api/ai/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: smartPreview.base64,
          mimeType: smartPreview.mimeType,
          presetProfile: learned ? learned.name : profile,
          learnedProfile: learned || undefined,
          fileName: loaded.name,
          customPrompt: promptExtra,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data?.error || `Erro ${res.status} na API Gemini Vision.`) as any;
        err.code = data?.code;
        throw err;
      }

      return { settings: data as DevelopSettings, engine: 'gemini' as const, loadedItem: loaded };
    },
    [resolvePhotoBinary]
  );

  const handleAnalyzeActivePhoto = async () => {
    if (!activePhoto) return;
    setIsAnalyzingSingle(true);
    setStatusBanner(null);

    try {
      const { settings, engine, loadedItem } = await analyzeSingleItem(
        activePhoto,
        aiMode,
        presetProfile,
        activeLearnedProfile,
        customInstruction
      );
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === loadedItem.id
            ? {
                ...loadedItem,
                settings,
                aiProcessed: true,
                aiEngine: engine,
                xmpSavedToDisk: false,
              }
            : p
        )
      );
      setViewMode('edited');
      setStatusBanner({
        type: 'success',
        text: `Foto "${loadedItem.name}" editada visualmente usando ${
          activeLearnedProfile ? `seu padrão "${activeLearnedProfile.name}"` : presetProfile
        } (${engine === 'gemini' ? 'Gemini Vision IA' : 'Histograma Local'}).`,
      });
    } catch (err: any) {
      setStatusBanner({
        type: 'error',
        text: err?.message || 'Erro ao analisar foto.',
        suggestDemoMode: err?.code === 'GEMINI_KEY_MISSING' || aiMode === 'gemini',
      });
    } finally {
      setIsAnalyzingSingle(false);
    }
  };

  const handleBatchAnalyze = async () => {
    const targets = selectedPhotos.length > 0 ? selectedPhotos : photos;
    if (targets.length === 0) {
      setStatusBanner({
        type: 'error',
        text: 'Nenhuma foto selecionada para processamento em lote.',
      });
      return;
    }

    batchCancelRef.current = false;
    setBatchProgress({ running: true, current: 0, total: targets.length, currentName: targets[0].name });
    setStatusBanner(null);

    let successCount = 0;
    for (let i = 0; i < targets.length; i++) {
      if (batchCancelRef.current) break;
      const item = targets[i];
      setBatchProgress({ running: true, current: i, total: targets.length, currentName: item.name });
      setActivePhotoId(item.id);

      try {
        const { settings, engine, loadedItem } = await analyzeSingleItem(
          item,
          aiMode,
          presetProfile,
          activeLearnedProfile,
          customInstruction
        );
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === loadedItem.id
              ? {
                  ...loadedItem,
                  settings,
                  aiProcessed: true,
                  aiEngine: engine,
                  xmpSavedToDisk: false,
                }
              : p
          )
        );
        setViewMode('edited');
        successCount++;
      } catch (err: any) {
        setBatchProgress({ running: false, current: i, total: targets.length, currentName: '' });
        setStatusBanner({
          type: 'error',
          text: `Interrompido na foto "${item.name}": ${err?.message}`,
          suggestDemoMode: err?.code === 'GEMINI_KEY_MISSING' || aiMode === 'gemini',
        });
        return;
      }
    }

    setBatchProgress({ running: false, current: targets.length, total: targets.length, currentName: '' });
    setStatusBanner({
      type: 'success',
      text: batchCancelRef.current
        ? `Lote cancelado. ${successCount} foto(s) processada(s).`
        : `${successCount} foto(s) editada(s) em lote com ${
            activeLearnedProfile ? `seu padrão "${activeLearnedProfile.name}"` : presetProfile
          }! Agora você pode salvar os JPGs editados ou gravar os .XMP na pasta.`,
    });
  };

  const updateActiveSlider = (key: keyof DevelopSettings, value: number) => {
    if (!activePhoto) return;
    if (viewMode === 'original') setViewMode('edited');
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === activePhoto.id
          ? {
              ...p,
              settings: { ...p.settings, [key]: value },
              xmpSavedToDisk: false,
            }
          : p
      )
    );
  };

  const handleResetActiveSettings = () => {
    if (!activePhoto) return;
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === activePhoto.id
          ? {
              ...p,
              settings: { ...DEFAULT_DEVELOP_SETTINGS },
              aiProcessed: false,
              xmpSavedToDisk: false,
            }
          : p
      )
    );
  };

  const handlePasteToActive = () => {
    if (!activePhoto || !clipboardSettings) return;
    setViewMode('edited');
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === activePhoto.id
          ? {
              ...p,
              settings: { ...clipboardSettings },
              aiProcessed: true,
              xmpSavedToDisk: false,
            }
          : p
      )
    );
  };

  const handlePasteToSelected = () => {
    if (!clipboardSettings || selectedPhotos.length === 0) return;
    const selectedSet = new Set(selectedPhotos.map((p) => p.id));
    setViewMode('edited');
    setPhotos((prev) =>
      prev.map((p) =>
        selectedSet.has(p.id)
          ? {
              ...p,
              settings: { ...clipboardSettings },
              aiProcessed: true,
              xmpSavedToDisk: false,
            }
          : p
      )
    );
    setStatusBanner({
      type: 'success',
      text: `Ajustes colados em ${selectedPhotos.length} foto(s) selecionada(s).`,
    });
  };

  // Save .XMP sidecar directly into the original folder via File System Access API, or download
  const handleSaveXmpToFolderOrDownload = async (mode: 'active' | 'batch') => {
    const targets =
      mode === 'active'
        ? activePhoto
          ? [activePhoto]
          : []
        : photos.filter((p) => p.aiProcessed || p.selected);

    if (targets.length === 0) {
      setStatusBanner({
        type: 'info',
        text: 'Edite ou selecione pelo menos uma foto antes de gerar o arquivo .XMP.',
      });
      return;
    }

    const labelProfile = activeLearnedProfile ? activeLearnedProfile.name : presetProfile;

    if (dirHandle && hasWritePermission) {
      try {
        let written = 0;
        const writtenIds = new Set<string>();
        for (const item of targets) {
          const xmpName = getXmpFileName(item.name);
          const xmpContent = generateAdobeXmp(item.settings, item.name, labelProfile);
          const fileHandle = await dirHandle.getFileHandle(xmpName, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(xmpContent);
          await writable.close();
          written++;
          writtenIds.add(item.id);
        }

        setPhotos((prev) =>
          prev.map((p) => (writtenIds.has(p.id) ? { ...p, xmpSavedToDisk: true } : p))
        );
        setStatusBanner({
          type: 'success',
          text: `${written} arquivo(s) .XMP gravado(s) diretamente na pasta "${folderName}"! No Lightroom, use Metadados > Ler Metadados dos Arquivos.`,
        });
        return;
      } catch (err: any) {
        console.warn('Falha ao gravar .XMP na pasta, gerando download:', err?.message);
      }
    }

    if (targets.length === 1) {
      const item = targets[0];
      const xmpName = getXmpFileName(item.name);
      const xmpContent = generateAdobeXmp(item.settings, item.name, labelProfile);
      const blob = new Blob([xmpContent], { type: 'application/rdf+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = xmpName;
      a.click();
      URL.revokeObjectURL(url);
      setStatusBanner({
        type: 'success',
        text: `Arquivo "${xmpName}" baixado.`,
      });
    } else {
      const zip = new JSZip();
      for (const item of targets) {
        const xmpName = getXmpFileName(item.name);
        const xmpContent = generateAdobeXmp(item.settings, item.name, labelProfile);
        zip.file(xmpName, xmpContent);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FramePlus_XMP_${folderName || 'Lote'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusBanner({
        type: 'success',
        text: `${targets.length} arquivos .XMP empacotados em .ZIP com sucesso.`,
      });
    }
  };

  // Render & save finalized JPG image files directly into FramePlus_Editadas/ inside the folder (or download)
  const handleSaveEditedJpgsToFolderOrDownload = async () => {
    const targets = photos.filter((p) => (p.aiProcessed || p.selected));
    if (targets.length === 0) {
      setStatusBanner({
        type: 'info',
        text: 'Edite ou selecione pelo menos uma foto para salvar as imagens JPG finalizadas.',
      });
      return;
    }

    setIsSavingJpgs(true);
    setStatusBanner(null);

    try {
      const resolvedTargets: LocalPhotoItem[] = [];
      for (const t of targets) {
        const loaded = t.previewLoaded ? t : await resolvePhotoBinary(t);
        if (loaded.objectUrl) resolvedTargets.push(loaded);
      }

      if (resolvedTargets.length === 0) {
        throw new Error('Nenhuma das fotos selecionadas possui imagem renderizável.');
      }

      if (dirHandle && hasWritePermission) {
        const outDir = await dirHandle.getDirectoryHandle('FramePlus_Editadas', { create: true });
        const savedIds = new Set<string>();

        for (const item of resolvedTargets) {
          const jpgBlob = await exportEditedJpgBlob(item.objectUrl!, item.settings, 2600, 0.92);
          const dotIdx = item.name.lastIndexOf('.');
          const jpgName = `${dotIdx > 0 ? item.name.slice(0, dotIdx) : item.name}_editada.jpg`;
          const fh = await outDir.getFileHandle(jpgName, { create: true });
          const writable = await fh.createWritable();
          await writable.write(jpgBlob);
          await writable.close();
          savedIds.add(item.id);
        }

        setPhotos((prev) =>
          prev.map((p) => (savedIds.has(p.id) ? { ...p, jpgSavedToDisk: true } : p))
        );
        setStatusBanner({
          type: 'success',
          text: `${savedIds.size} foto(s) editada(s) salva(s) em JPG dentro de "${folderName}/FramePlus_Editadas"!`,
        });
        return;
      }

      // Download fallback if directory isn't writable
      if (resolvedTargets.length === 1) {
        const item = resolvedTargets[0];
        const jpgBlob = await exportEditedJpgBlob(item.objectUrl!, item.settings, 2600, 0.92);
        const dotIdx = item.name.lastIndexOf('.');
        const jpgName = `${dotIdx > 0 ? item.name.slice(0, dotIdx) : item.name}_editada.jpg`;
        const url = URL.createObjectURL(jpgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = jpgName;
        a.click();
        URL.revokeObjectURL(url);
        setStatusBanner({
          type: 'success',
          text: `Foto "${jpgName}" salva com suas edições aplicadas!`,
        });
      } else {
        const zip = new JSZip();
        for (const item of resolvedTargets) {
          const jpgBlob = await exportEditedJpgBlob(item.objectUrl!, item.settings, 2600, 0.92);
          const dotIdx = item.name.lastIndexOf('.');
          const jpgName = `${dotIdx > 0 ? item.name.slice(0, dotIdx) : item.name}_editada.jpg`;
          zip.file(jpgName, jpgBlob);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FramePlus_Editadas_${folderName || 'Lote'}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        setStatusBanner({
          type: 'success',
          text: `${resolvedTargets.length} foto(s) editada(s) em JPG baixada(s) em .ZIP.`,
        });
      }
    } catch (err: any) {
      setStatusBanner({
        type: 'error',
        text: err?.message || 'Falha ao exportar fotos JPG editadas.',
      });
    } finally {
      setIsSavingJpgs(false);
    }
  };

  // Load Lightroom plugin Lua source into modal
  const handleOpenLightroomModal = async () => {
    setIsLrModalOpen(true);
    if (!lrPluginSource) {
      try {
        const res = await fetch('/api/lightroom/plugin-source');
        if (res.ok) {
          const data = await res.json();
          setLrPluginSource(data);
        }
      } catch {}
    }
  };

  const handleOpenPublishModal = () => {
    const count = selectedPhotos.length > 0 ? selectedPhotos.length : activePhoto ? 1 : 0;
    if (count === 0) {
      setStatusBanner({
        type: 'info',
        text: 'Selecione uma ou mais fotos para enviar os JPGs finalizados à sua Galeria Frame+.',
      });
      return;
    }
    if (!newCollectionTitle) {
      setNewCollectionTitle(
        folderName ? `${folderName} (IA Studio)` : `Estúdio IA ${new Date().toLocaleDateString('pt-BR')}`
      );
    }
    setIsPublishModalOpen(true);
  };

  const handlePublishToFramePlusGallery = async () => {
    if (!user) {
      setStatusBanner({
        type: 'error',
        text: 'Faça login no Frame+ para enviar fotos para suas galerias.',
      });
      setIsPublishModalOpen(false);
      return;
    }

    const targets = selectedPhotos.length > 0 ? selectedPhotos : activePhoto ? [activePhoto] : [];
    if (targets.length === 0) return;

    setIsPublishing(true);
    setPublishProgress({ current: 0, total: targets.length });

    try {
      const renderable: LocalPhotoItem[] = [];
      for (const item of targets) {
        const loaded = item.previewLoaded ? item : await resolvePhotoBinary(item);
        if (loaded.objectUrl) renderable.push(loaded);
      }
      if (renderable.length === 0) {
        throw new Error('Nenhuma foto selecionada possui preview renderizável.');
      }

      let colId = targetCollectionId;
      let existingCol = (collections || []).find((c) => c.id?.toString() === colId);

      if (colId === 'new' || !existingCol) {
        const title = newCollectionTitle.trim() || `Estúdio IA ${new Date().toLocaleDateString('pt-BR')}`;
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const createRes = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Rascunho',
            image: null,
            media: [],
            mediaSizes: {},
            mediaMetadata: [],
            type: 'collection',
            slug,
            ownerId: user.uid,
          }),
        });
        if (!createRes.ok) {
          throw new Error('Falha ao criar galeria no Frame+.');
        }
        existingCol = await createRes.json();
        colId = existingCol.id.toString();
      }

      const uploadedUrls: string[] = [];
      const uploadedSizes: Record<string, number> = { ...(existingCol.mediaSizes || {}) };
      const uploadedMeta: any[] = Array.isArray(existingCol.mediaMetadata)
        ? [...existingCol.mediaMetadata]
        : [];

      for (let i = 0; i < renderable.length; i++) {
        const item = renderable[i];
        setPublishProgress({ current: i + 1, total: renderable.length });

        const jpgBlob = await exportEditedJpgBlob(item.objectUrl!, item.settings, 2600, 0.92);
        const dotIdx = item.name.lastIndexOf('.');
        const jpgName = `${dotIdx > 0 ? item.name.slice(0, dotIdx) : item.name}.jpg`;

        const formData = new FormData();
        formData.append('file', jpgBlob, jpgName);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData?.error || `Falha ao enviar ${jpgName}.`);
        }

        uploadedUrls.push(uploadData.url);
        uploadedSizes[uploadData.url] = uploadData.size || jpgBlob.size;
        uploadedMeta.push({
          url: uploadData.url,
          size: uploadData.size || jpgBlob.size,
          name: jpgName,
          mimetype: 'image/jpeg',
        });
      }

      const finalMedia = [...(existingCol.media || []), ...uploadedUrls];
      const updateRes = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existingCol,
          id: existingCol.id,
          media: finalMedia,
          image: existingCol.image || uploadedUrls[0],
          mediaSizes: uploadedSizes,
          mediaMetadata: uploadedMeta,
        }),
      });

      const updatedCol = updateRes.ok ? await updateRes.json() : { ...existingCol, media: finalMedia };

      setCollections((prev) => {
        const list = prev || [];
        const exists = list.some((c) => c.id?.toString() === updatedCol.id?.toString());
        if (exists) {
          return list.map((c) => (c.id?.toString() === updatedCol.id?.toString() ? updatedCol : c));
        }
        return [updatedCol, ...list];
      });

      setIsPublishModalOpen(false);
      setCurrentCollectionId(updatedCol.id);
      setActiveTab('editor');
    } catch (err: any) {
      setStatusBanner({
        type: 'error',
        text: err?.message || 'Erro ao publicar fotos na galeria.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const updateSplitFromClientX = (clientX: number) => {
    if (!splitStageRef.current) return;
    const rect = splitStageRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setSplitPosition(Math.min(100, Math.max(0, pct)));
  };

  const userCollections = (collections || []).filter((c) => c.type !== 'folder');
  const activeSampleRegistered = activePhoto
    ? calibrationSamples.some((s) => s.photoId === activePhoto.id)
    : false;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0F1115] text-zinc-100 flex flex-col select-none">
      {/* Hidden compatibility directory input (only triggered via explicit user choice inside modal) */}
      <input
        ref={fallbackInputRef}
        type="file"
        multiple
        {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        className="hidden"
        onChange={handleFallbackInputChange}
      />

      {/* Studio Top Toolbar */}
      <div className="bg-[#181B20] border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePickLocalFolder}
            disabled={isScanningFolder || batchProgress.running}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isScanningFolder ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
            <span>{folderName ? `Pasta: ${folderName}` : 'Ler Pasta Local'}</span>
          </button>

          {savedDirHandle && !dirHandle && (
            <button
              type="button"
              onClick={handleReconnectSavedFolder}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252A34] hover:bg-[#313744] text-zinc-100 border border-white/10 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reconectar "{savedDirHandle.name}"</span>
            </button>
          )}

          {/* Style Profile Selector (includes user's trained 10-photo styles!) */}
          <div className="flex items-center gap-2 bg-[#0F1115] border border-white/10 rounded-lg px-2.5 py-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <select
              value={presetProfile}
              onChange={(e) => setPresetProfile(e.target.value as PresetProfileId)}
              className="bg-transparent text-xs font-medium text-zinc-100 outline-none cursor-pointer pr-2 max-w-[190px]"
              aria-label="Perfil de Estilo"
            >
              {savedProfiles.length > 0 && (
                <optgroup label="Meu Padrão (10 Fotos)" className="bg-[#181B20] text-zinc-100">
                  {savedProfiles.map((sp) => (
                    <option key={sp.id} value={`personal:${sp.id}`} className="bg-[#181B20] text-zinc-100">
                      ★ {sp.name} ({sp.sampleCount} fotos)
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Perfis Base do Estúdio" className="bg-[#181B20] text-zinc-100">
                {PRESET_PROFILES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#181B20] text-zinc-100">
                    {p.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Toggle 10-Photo Style Calibration Mode */}
          <button
            type="button"
            onClick={() => setCalibrationMode((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              calibrationMode
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                : 'bg-[#0F1115] border-white/10 text-zinc-300 hover:text-white hover:bg-[#252A34]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums">
              {calibrationSamples.length > 0
                ? `Meu Padrão (${calibrationSamples.length}/10)`
                : savedProfiles.length > 0
                ? 'Recalibrar 10 Fotos'
                : 'Ensinar Meu Padrão (10 Fotos)'}
            </span>
          </button>

          {/* Engine Toggle: Gemini Vision vs Local Histogram Demo */}
          <div className="flex items-center p-0.5 bg-[#0F1115] border border-white/10 rounded-lg">
            <button
              type="button"
              onClick={() => setAiMode('gemini')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                aiMode === 'gemini' ? 'bg-[#252A34] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D05634]" />
              <span>Gemini IA</span>
            </button>
            <button
              type="button"
              onClick={() => setAiMode('demo')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                aiMode === 'demo' ? 'bg-[#252A34] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Local Rápido</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {photos.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleAnalyzeActivePhoto}
                disabled={!activePhoto || isAnalyzingSingle || batchProgress.running}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252A34] hover:bg-[#2F3643] text-zinc-100 border border-white/10 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
              >
                {isAnalyzingSingle ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D05634]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#D05634]" />
                )}
                <span>Editar Atual</span>
              </button>

              {batchProgress.running ? (
                <button
                  type="button"
                  onClick={() => {
                    batchCancelRef.current = true;
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>
                    Cancelar ({batchProgress.current}/{batchProgress.total})
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBatchAnalyze}
                  disabled={isAnalyzingSingle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D05634]/20 hover:bg-[#D05634]/30 text-[#ff9b7d] border border-[#D05634]/50 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    Editar Selecionadas {selectedPhotos.length > 0 ? `(${selectedPhotos.length})` : `(${photos.length})`}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveEditedJpgsToFolderOrDownload}
                disabled={isSavingJpgs}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252A34] hover:bg-[#2F3643] text-zinc-100 border border-white/10 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
                title={
                  hasWritePermission
                    ? 'Renderiza e grava os JPGs editados dentro da pasta FramePlus_Editadas/'
                    : 'Baixar fotos JPG já editadas'
                }
              >
                {isSavingJpgs ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{hasWritePermission ? 'Salvar JPGs na Pasta' : 'Baixar JPGs Editados'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveXmpToFolderOrDownload('batch')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252A34] hover:bg-[#2F3643] text-zinc-100 border border-white/10 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={hasWritePermission ? 'Grava .XMP direto na pasta original' : 'Baixar arquivos .XMP'}
              >
                <FileCode className="w-3.5 h-3.5 text-sky-400" />
                <span>{hasWritePermission ? 'Gravar .XMP' : 'Baixar .XMP'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPublishModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar para Galeria</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleOpenLightroomModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F1115] hover:bg-[#252A34] text-zinc-200 border border-white/15 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Plugin LR</span>
          </button>
        </div>
      </div>

      {/* 10-PHOTO PERSONAL STYLE CALIBRATION BAR */}
      {calibrationMode && (
        <div className="bg-[#151820] border-b border-amber-500/25 px-4 sm:px-6 py-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  Calibração do Seu Padrão de Edição ({calibrationSamples.length}/10 fotos)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Antes de editar seu lote automaticamente: abra sua pasta, ajuste 10 fotos nos sliders à direita (ou importe seus <code className="font-mono text-zinc-200">.XMP</code>) e clique em <strong className="text-zinc-200">Registrar Foto no Padrão</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {photos.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleRegisterCalibrationSample}
                    disabled={!activePhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>
                      {activeSampleRegistered
                        ? 'Atualizar Amostra Atual'
                        : `Registrar Foto no Padrão (${calibrationSamples.length}/10)`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleImportXmpsForCalibration}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252A34] hover:bg-[#313846] text-zinc-200 border border-white/10 text-xs font-medium cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ler .XMPs da Pasta</span>
                  </button>
                </>
              )}

              <input
                type="text"
                value={calibrationProfileName}
                onChange={(e) => setCalibrationProfileName(e.target.value)}
                placeholder="Nome do perfil..."
                className="w-40 px-2.5 py-1.5 rounded-lg bg-[#0F1115] border border-white/15 text-xs text-white outline-none focus:border-amber-400"
              />

              <button
                type="button"
                onClick={handleTrainPersonalProfile}
                disabled={isTrainingProfile || calibrationSamples.length < 3}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
              >
                {isTrainingProfile ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {isTrainingProfile
                    ? 'Aprendendo estilo...'
                    : calibrationSamples.length >= 10
                    ? 'Treinar Meu Padrão (10/10)'
                    : `Treinar Meu Padrão (${calibrationSamples.length}/10)`}
                </span>
              </button>

              {savedProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCalibrationMode(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                  title="Minimizar barra de calibração"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 10 Reference Sample Slots */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, idx) => {
              const sample = calibrationSamples[idx];
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (sample) setActivePhotoId(sample.photoId);
                  }}
                  className={`relative rounded-lg border overflow-hidden h-14 flex flex-col items-center justify-center text-[10px] ${
                    sample
                      ? 'border-amber-400/60 bg-[#0F1115] cursor-pointer group'
                      : 'border-white/10 border-dashed bg-[#0F1115]/60 text-zinc-500'
                  }`}
                >
                  {sample ? (
                    <>
                      <img
                        src={sample.thumbnailUrl || sample.previewBase64}
                        alt={sample.fileName}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5 flex items-center justify-between text-[9px] font-mono text-amber-300 tabular-nums">
                        <span>#{String(idx + 1).padStart(2, '0')}</span>
                        <span>
                          {sample.settings.exposure >= 0 ? '+' : ''}
                          {sample.settings.exposure.toFixed(1)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCalibrationSamples((prev) => prev.filter((s) => s.photoId !== sample.photoId));
                        }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 text-zinc-300 hover:text-red-400 hidden group-hover:flex items-center justify-center cursor-pointer"
                        title="Remover amostra"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </>
                  ) : (
                    <span className="font-mono tabular-nums">Foto {String(idx + 1).padStart(2, '0')}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Learned Personal Style Summary Ribbon */}
      {activeLearnedProfile && !calibrationMode && (
        <div className="bg-[#141923] border-b border-emerald-500/20 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-zinc-300">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Padrão Ativo: {activeLearnedProfile.name}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">
              {activeLearnedProfile.styleDna?.wbTendency} {activeLearnedProfile.styleDna?.exposureStyle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              <button
                type="button"
                onClick={handleApplyLearnedBaselineToSelected}
                className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium cursor-pointer"
              >
                Aplicar Base Rápida nas Selecionadas
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDeleteSavedProfile(activeLearnedProfile.id)}
              className="p-1 rounded hover:bg-red-500/15 text-zinc-500 hover:text-red-400 cursor-pointer"
              title="Excluir padrão salvo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Batch Progress Strip */}
      {batchProgress.running && (
        <div className="bg-[#181B20] border-b border-white/10 px-6 py-2.5 flex items-center gap-4">
          <Loader2 className="w-4 h-4 text-[#D05634] animate-spin shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-200 font-medium truncate">
                Editando com {activeLearnedProfile ? activeLearnedProfile.name : presetProfile}:{' '}
                {batchProgress.currentName}
              </span>
              <span className="font-mono tabular-nums text-zinc-400">
                {batchProgress.current} / {batchProgress.total}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D05634] transition-all duration-200"
                style={{
                  width: `${Math.round((batchProgress.current / Math.max(1, batchProgress.total)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Notification Bar */}
      {statusBanner && (
        <div
          className={`px-6 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
            statusBanner.type === 'error'
              ? 'bg-red-950/40 border-red-500/30 text-red-200'
              : statusBanner.type === 'success'
              ? 'bg-emerald-950/35 border-emerald-500/30 text-emerald-200'
              : 'bg-zinc-900 border-white/10 text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusBanner.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
          <div className="flex items-center gap-2">
            {statusBanner.suggestDemoMode && aiMode !== 'demo' && (
              <button
                type="button"
                onClick={() => {
                  setAiMode('demo');
                  setStatusBanner({
                    type: 'info',
                    text: 'Modo Local Rápido ativado. Clique em "Editar Atual" ou "Editar Selecionadas" para aplicar seu estilo instantaneamente.',
                  });
                }}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold cursor-pointer"
              >
                Usar Modo Local Rápido
              </button>
            )}
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Studio Body */}
      {photos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-3xl w-full bg-[#181B20] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#D05634]/15 border border-[#D05634]/30 text-[#D05634] flex items-center justify-center mx-auto">
              <FolderOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Frame Plus AI Studio
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Leitura direta na pasta do computador sem upload de RAWs. Primeiro calibramos o seu estilo com 10 fotos suas — depois a IA aplica seu padrão exato em todo o ensaio, grava os JPGs editados e os <code className="font-mono text-zinc-200">.XMP</code> do Lightroom direto na pasta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="p-4 rounded-xl bg-[#0F1115] border border-white/5 space-y-1.5">
                <div className="text-xs font-semibold text-white">1. Calibre em 10 Fotos</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Edite 10 fotos modelo (ou carregue seus .XMPs) para a IA aprender sua exposição, cor e pele preferidas.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1115] border border-white/5 space-y-1.5">
                <div className="text-xs font-semibold text-white">2. Leitura Direta da Pasta</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Abre centenas de JPGs e RAWs (.CR3, .NEF, .ARW, .DNG) direto do disco por streaming sob demanda.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1115] border border-white/5 space-y-1.5">
                <div className="text-xs font-semibold text-white">3. Salva JPG + .XMP no HD</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Grava os JPGs editados em <code className="font-mono">FramePlus_Editadas/</code> e os <code className="font-mono">.XMP</code> direto na pasta ou envia à Galeria Frame+.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePickLocalFolder}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Ler Pasta do Computador</span>
              </button>

              {savedDirHandle && (
                <button
                  type="button"
                  onClick={handleReconnectSavedFolder}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reconectar "{savedDirHandle.name}"</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenLightroomModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F1115] hover:bg-[#252A34] text-zinc-200 border border-white/10 text-sm font-medium transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Plugin Lightroom (.lrplugin)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* LEFT PANEL: Filmstrip / Direct Folder Grid */}
          <aside className="lg:col-span-3 xl:col-span-2 bg-[#181B20] border-r border-white/10 flex flex-col max-h-[calc(100vh-140px)]">
            <div className="p-3 border-b border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 tabular-nums">
                  {filteredPhotos.length} de {photos.length} fotos
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = selectedPhotos.length === photos.length;
                    setPhotos((prev) => prev.map((p) => ({ ...p, selected: !allSelected })));
                  }}
                  className="text-zinc-400 hover:text-white text-[11px] font-medium cursor-pointer"
                >
                  {selectedPhotos.length === photos.length ? 'Desmarcar' : 'Selecionar todas'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1 bg-[#0F1115] p-1 rounded-lg">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'edited', label: 'Editadas' },
                  { id: 'starred', label: '4-5★' },
                  { id: 'raw', label: 'RAW' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterMode(tab.id as any)}
                    className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      filterMode === tab.id ? 'bg-[#252A34] text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-2 lg:grid-cols-2 gap-2 content-start">
              {filteredPhotos.map((item) => {
                const isActive = item.id === activePhotoId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActivePhotoId(item.id)}
                    className={`group relative rounded-lg overflow-hidden border transition-all cursor-pointer bg-[#0F1115] ${
                      isActive
                        ? 'border-[#D05634] ring-1 ring-[#D05634]'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-[#0B0D10] flex items-center justify-center overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-zinc-500">
                          {item.previewLoaded ? (
                            <ImageIcon className="w-5 h-5" />
                          ) : (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                          )}
                          <span className="text-[10px] font-mono">{item.extension}</span>
                        </div>
                      )}
                    </div>

                    {/* Selection Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotos((prev) =>
                          prev.map((p) => (p.id === item.id ? { ...p, selected: !p.selected } : p))
                        );
                      }}
                      aria-label={`Selecionar ${item.name}`}
                      className={`absolute top-1.5 left-1.5 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                        item.selected
                          ? 'bg-[#D05634] border-[#D05634] text-white'
                          : 'bg-black/50 border-white/40 text-transparent hover:border-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>

                    {/* Top Right Format / Status */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[9px] font-mono bg-black/75 px-1.5 py-0.5 rounded text-zinc-200">
                      <span>{item.extension}</span>
                      {item.aiProcessed && <span className="text-[#ff8666]">· IA</span>}
                      {item.jpgSavedToDisk && <span className="text-emerald-400">· JPG</span>}
                      {item.xmpSavedToDisk && <span className="text-sky-400">· XMP</span>}
                    </div>

                    {/* Bottom Name + Star Rating */}
                    <div className="px-2 py-1.5 flex items-center justify-between gap-1 text-[10px] text-zinc-300 border-t border-white/5">
                      <span className="truncate font-mono">{item.name}</span>
                      {(item.settings.cullingScore || 0) > 0 && (
                        <span className="text-amber-400 shrink-0 tabular-nums">
                          {item.settings.cullingScore}★
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* CENTER PANEL: Live Edited / Split / Original Canvas + Diagnostic Strip */}
          <section className="lg:col-span-6 xl:col-span-7 bg-[#0F1115] flex flex-col min-h-[540px] max-h-[calc(100vh-140px)]">
            {/* Viewport Top Bar */}
            <div className="px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-[#14171C]">
              <div className="flex items-center gap-2 text-xs text-zinc-300 min-w-0">
                <span className="font-mono truncate max-w-[220px] text-white font-medium">
                  {activePhoto?.name || 'Nenhuma foto selecionada'}
                </span>
                {activePhoto && activePhoto.size > 0 && (
                  <>
                    <span className="text-zinc-600">·</span>
                    <span className="font-mono text-zinc-400 tabular-nums">
                      {(activePhoto.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                )}
                {activePhoto && (
                  <span className="px-2 py-0.5 rounded bg-[#0F1115] border border-white/10 text-[10px] font-mono text-zinc-300 tabular-nums">
                    {Math.round(activePhoto.settings.temperature)}K ·{' '}
                    {activePhoto.settings.exposure >= 0 ? '+' : ''}
                    {activePhoto.settings.exposure.toFixed(2)} EV
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activePhoto && (
                  <div className="flex items-center gap-0.5 bg-[#0F1115] px-2 py-1 rounded-lg border border-white/10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateActiveSlider('cullingScore', star)}
                        className="p-0.5 cursor-pointer"
                        title={`Classificar ${star} estrela(s)`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            (activePhoto.settings.cullingScore || 0) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Segmented View Mode Toggle: Editada (Default) | Dividir | Original */}
                <div className="flex items-center p-0.5 bg-[#0F1115] border border-white/10 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setViewMode('edited')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === 'edited' ? 'bg-[#D05634] text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Editada
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === 'split' ? 'bg-[#252A34] text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Columns2 className="w-3 h-3" />
                    <span>Dividir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('original')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === 'original' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Atalho: Barra de Espaço"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Original</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Comparison Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-[#0A0C0F]">
              {activePhoto && !activePhoto.previewLoaded ? (
                <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#D05634]" />
                  <span>Lendo preview direto da pasta...</span>
                </div>
              ) : activePhoto?.objectUrl ? (
                <div
                  ref={splitStageRef}
                  onMouseDown={(e) => {
                    if (viewMode !== 'split') return;
                    setIsDraggingSplit(true);
                    updateSplitFromClientX(e.clientX);
                  }}
                  onMouseMove={(e) => {
                    if (viewMode === 'split' && isDraggingSplit) updateSplitFromClientX(e.clientX);
                  }}
                  onMouseUp={() => setIsDraggingSplit(false)}
                  onMouseLeave={() => setIsDraggingSplit(false)}
                  onTouchMove={(e) => {
                    if (viewMode === 'split' && e.touches[0]) updateSplitFromClientX(e.touches[0].clientX);
                  }}
                  className={`relative inline-block max-w-full max-h-full overflow-hidden rounded-lg border border-white/10 ${
                    viewMode === 'split' ? 'cursor-ew-resize' : ''
                  }`}
                >
                  {/* Base Canvas: BEFORE (Original) sets exact natural aspect dimensions */}
                  <canvas
                    ref={beforeCanvasRef}
                    className="max-w-full max-h-[55vh] w-auto h-auto block"
                  />

                  {/* Synchronized Overlay Canvas: AFTER (AI + Manual Sliders) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{
                      clipPath:
                        viewMode === 'original'
                          ? 'inset(0 100% 0 0)'
                          : viewMode === 'edited'
                          ? 'inset(0 0 0 0)'
                          : `inset(0 ${100 - splitPosition}% 0 0)`,
                    }}
                  >
                    <canvas
                      ref={afterCanvasRef}
                      className="w-full h-full block"
                    />
                  </div>

                  {/* Subtle Corner Mode Badge */}
                  {viewMode === 'original' && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-zinc-200 text-[10px] font-mono pointer-events-none">
                      ORIGINAL SEM EDIÇÃO
                    </span>
                  )}
                  {viewMode === 'edited' && activePhoto.aiProcessed && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-emerald-300 text-[10px] font-mono pointer-events-none">
                      EDITADA
                    </span>
                  )}
                  {viewMode === 'split' && (
                    <>
                      {splitPosition > 12 && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono pointer-events-none">
                          DEPOIS
                        </span>
                      )}
                      {splitPosition < 88 && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 text-zinc-300 text-[10px] font-mono pointer-events-none">
                          ANTES
                        </span>
                      )}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/90 pointer-events-none shadow-lg"
                        style={{ left: `${splitPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg text-[10px] font-bold">
                          ↔
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center max-w-sm space-y-2 p-6 rounded-xl bg-[#181B20] border border-white/10">
                  <ImageIcon className="w-8 h-8 text-zinc-500 mx-auto" />
                  <p className="text-sm font-medium text-zinc-200">
                    Arquivo RAW sem preview JPEG embutido legível no navegador
                  </p>
                  <p className="text-xs text-zinc-400">
                    Você ainda pode ajustar os sliders à direita e gravar o arquivo Sidecar{' '}
                    <code className="font-mono">.XMP</code> diretamente na pasta.
                  </p>
                </div>
              )}

              {/* Previous / Next Navigation Arrows */}
              {filteredPhotos.length > 1 && activePhotoId && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = filteredPhotos.findIndex((p) => p.id === activePhotoId);
                      if (idx > 0) setActivePhotoId(filteredPhotos[idx - 1].id);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/15 cursor-pointer"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = filteredPhotos.findIndex((p) => p.id === activePhotoId);
                      if (idx !== -1 && idx < filteredPhotos.length - 1) {
                        setActivePhotoId(filteredPhotos[idx + 1].id);
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/15 cursor-pointer"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Live RGB Histogram Overlay */}
              {histogram && (
                <div className="hidden sm:block absolute bottom-4 right-4 w-40 h-16 bg-black/80 border border-white/10 rounded-lg p-1.5 pointer-events-none">
                  <svg viewBox="0 0 32 20" preserveAspectRatio="none" className="w-full h-full">
                    {(() => {
                      const maxVal = Math.max(
                        1,
                        ...histogram.luma,
                        ...histogram.r,
                        ...histogram.g,
                        ...histogram.b
                      );
                      const toPath = (arr: number[]) =>
                        `M 0 20 ` +
                        arr
                          .map((v, i) => `L ${i} ${(20 - (v / maxVal) * 18).toFixed(2)}`)
                          .join(' ') +
                        ` L 31 20 Z`;
                      return (
                        <>
                          <path d={toPath(histogram.r)} fill="rgba(239,68,68,0.35)" />
                          <path d={toPath(histogram.g)} fill="rgba(34,197,94,0.35)" />
                          <path d={toPath(histogram.b)} fill="rgba(59,130,246,0.35)" />
                          <path d={toPath(histogram.luma)} fill="rgba(255,255,255,0.22)" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              )}
            </div>

            {/* AI Reasoning & Diagnostic Strip */}
            <div className="bg-[#181B20] border-t border-white/10 px-4 py-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-200 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#D05634]" />
                  <span>Diagnóstico & Ações Rápidas</span>
                  {activePhoto?.settings.focusStatus && (
                    <span className="text-zinc-400 font-normal">
                      · Nitidez: <strong className="text-zinc-200">{activePhoto.settings.focusStatus}</strong>
                    </span>
                  )}
                </div>

                {activePhoto && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsXmpPreviewOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>XML .XMP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveXmpToFolderOrDownload('active')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#252A34] hover:bg-[#323846] text-zinc-100 text-[11px] font-medium cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-emerald-400" />
                      <span>Salvar {getXmpFileName(activePhoto.name)}</span>
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {activePhoto?.settings.aiReasoning ||
                  'Ajuste os sliders à direita para editar em tempo real na imagem ou clique em "Editar Atual" / "Editar Selecionadas" para aplicar seu estilo automaticamente.'}
              </p>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="Instrução opcional para a IA (ex: pele um pouco mais quente, manter detalhes do vestido branco)..."
                  className="flex-1 bg-[#0F1115] border border-white/10 focus:border-[#D05634] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: Develop Sliders (Lightroom Module) */}
          <aside className="lg:col-span-3 bg-[#181B20] border-l border-white/10 flex flex-col max-h-[calc(100vh-140px)]">
            <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">Revelação & Sliders</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => activePhoto && setClipboardSettings({ ...activePhoto.settings })}
                  disabled={!activePhoto}
                  title="Copiar Ajustes desta foto"
                  className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer disabled:opacity-30"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handlePasteToActive}
                  disabled={!activePhoto || !clipboardSettings}
                  title="Colar Ajustes na foto atual"
                  className="p-1.5 rounded hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer disabled:opacity-30"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                </button>
                {clipboardSettings && selectedPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePasteToSelected}
                    className="px-2 py-1 rounded bg-[#D05634]/20 text-[#ff8666] hover:bg-[#D05634]/30 text-[10px] font-semibold cursor-pointer"
                  >
                    Colar ({selectedPhotos.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetActiveSettings}
                  disabled={!activePhoto}
                  title="Resetar todos os sliders"
                  className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer disabled:opacity-30"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {SLIDER_GROUPS.map((group) => (
                <div key={group.title} className="space-y-3 pb-4 border-b border-white/10 last:border-b-0">
                  <h3 className="text-xs font-semibold text-zinc-300">{group.title}</h3>
                  <div className="space-y-3">
                    {group.sliders.map((s) => {
                      const rawVal = activePhoto ? Number(activePhoto.settings[s.key] ?? 0) : 0;
                      const formattedVal =
                        s.key === 'exposure'
                          ? `${rawVal > 0 ? '+' : ''}${rawVal.toFixed(2)}${s.unit || ''}`
                          : s.key === 'temperature'
                          ? `${Math.round(rawVal)}${s.unit || ''}`
                          : `${rawVal > 0 ? '+' : ''}${Math.round(rawVal)}`;

                      return (
                        <div key={s.key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              onDoubleClick={() =>
                                updateActiveSlider(
                                  s.key,
                                  Number(DEFAULT_DEVELOP_SETTINGS[s.key] ?? 0)
                                )
                              }
                              className="text-zinc-400 cursor-pointer hover:text-zinc-200"
                              title="Duplo clique para zerar"
                            >
                              {s.label}
                            </span>
                            <span className="font-mono tabular-nums text-zinc-200 text-[11px]">
                              {formattedVal}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            step={s.step}
                            value={rawVal}
                            disabled={!activePhoto}
                            onChange={(e) => updateActiveSlider(s.key, parseFloat(e.target.value))}
                            style={s.gradient ? { background: s.gradient } : undefined}
                            className="w-full h-1.5 rounded-lg appearance-none bg-[#0F1115] accent-[#D05634] cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* MODAL: Iframe Restriction vs Direct Folder Access Choice */}
      {isIframeBlockedModalOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181B20] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Leitura Direta na Pasta (Sem Janela de Importação)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Você está acessando o Estúdio dentro de uma janela incorporada (preview), onde o navegador bloqueia o acesso direto ao disco. Para ler e gravar direto na pasta sem o popup &quot;Fazer upload de arquivos&quot;, abra em uma nova aba:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsIframeBlockedModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="/?tab=ai-studio"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsIframeBlockedModalOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir em Nova Aba (Acesso Direto Real ao HD)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsIframeBlockedModalOpen(false);
                  fallbackInputRef.current?.click();
                }}
                className="w-full flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-[#0F1115] hover:bg-[#252A34] border border-white/10 text-zinc-200 text-xs font-medium cursor-pointer"
              >
                <span>Continuar aqui via Seletor de Compatibilidade</span>
                <span className="text-[11px] text-zinc-400 font-normal">
                  Nota: o Chrome exibe o texto &quot;Fazer upload&quot; no popup padrão, mas 0 bytes saem do seu PC.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XMP XML Inspector */}
      {isXmpPreviewOpen && activePhoto && (
        <div className="fixed inset-0 z-[10010] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181B20] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {getXmpFileName(activePhoto.name)}
                </h3>
                <p className="text-xs text-zinc-400">
                  Sidecar padrão Adobe Camera Raw / Lightroom Classic (ProcessVersion 15.4)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsXmpPreviewOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-5 text-[11px] font-mono text-emerald-300 bg-[#0F1115] leading-relaxed">
              {generateAdobeXmp(
                activePhoto.settings,
                activePhoto.name,
                activeLearnedProfile ? activeLearnedProfile.name : presetProfile
              )}
            </pre>
            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-end gap-2 bg-[#181B20]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateAdobeXmp(
                      activePhoto.settings,
                      activePhoto.name,
                      activeLearnedProfile ? activeLearnedProfile.name : presetProfile
                    )
                  );
                  setStatusBanner({ type: 'success', text: 'Conteúdo XML .XMP copiado!' });
                }}
                className="px-4 py-2 rounded-lg bg-[#252A34] hover:bg-[#2F3643] text-xs font-medium text-white cursor-pointer"
              >
                Copiar XML
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveXmpToFolderOrDownload('active');
                  setIsXmpPreviewOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#D05634] hover:bg-[#b84a2b] text-xs font-semibold text-white cursor-pointer"
              >
                Salvar / Baixar .XMP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Publish Finalized JPGs to Frame+ Art Gallery */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181B20] border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Enviar para Galeria Frame+</h3>
              <button
                type="button"
                onClick={() => !isPublishing && setIsPublishModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Somente as fotos selecionadas ({selectedPhotos.length > 0 ? selectedPhotos.length : 1}) serão renderizadas localmente em JPG otimizado com suas edições aplicadas e enviadas para a galeria — sem subir arquivos RAW.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Galeria de Destino
                </label>
                <select
                  value={targetCollectionId}
                  onChange={(e) => setTargetCollectionId(e.target.value)}
                  disabled={isPublishing}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1115] border border-white/15 text-xs text-white outline-none focus:border-[#D05634]"
                >
                  <option value="new">+ Criar Nova Galeria</option>
                  {userCollections.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {targetCollectionId === 'new' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nome da Nova Galeria
                  </label>
                  <input
                    type="text"
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    disabled={isPublishing}
                    placeholder="Ex: Casamento Ana e João"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1115] border border-white/15 text-xs text-white outline-none focus:border-[#D05634]"
                  />
                </div>
              )}

              {isPublishing && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Renderizando & enviando JPGs...</span>
                    <span className="font-mono tabular-nums">
                      {publishProgress.current} / {publishProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{
                        width: `${Math.round(
                          (publishProgress.current / Math.max(1, publishProgress.total)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 cursor-pointer disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePublishToFramePlusGallery}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{isPublishing ? 'Enviando...' : 'Confirmar Envio'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Lightroom Classic SDK Plugin (Lua + Bridge) */}
      {isLrModalOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181B20] border border-white/15 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Extensão Adobe Lightroom Classic (FramePlusAI.lrplugin)
                </h3>
                <p className="text-xs text-zinc-400">
                  Plugin oficial SDK em Lua para edição via Local Bridge (http://localhost:54321) e publicação direta na Frame+.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/api/lightroom/download"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D05634] hover:bg-[#b84a2b] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar .lrplugin (.zip)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsLrModalOpen(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-6 py-2.5 border-b border-white/10 bg-[#14171C] flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'install', label: 'Instalação & Fluxo' },
                { id: 'Info.lua', label: 'Info.lua' },
                { id: 'EditWithFramePlusAI.lua', label: 'EditWithFramePlusAI.lua' },
                { id: 'ExportProvider.lua', label: 'ExportProvider.lua' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLrModalTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                    lrModalTab === t.id ? 'bg-[#252A34] text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {lrModalTab === 'install' ? (
                <div className="space-y-5 text-xs text-zinc-300 leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0F1115] border border-white/10 space-y-2">
                      <h4 className="text-sm font-semibold text-white">Passo 1 · Instalar no Lightroom Classic</h4>
                      <ol className="list-decimal pl-4 space-y-1.5 text-zinc-400">
                        <li>
                          Clique em <strong className="text-zinc-200">Baixar .lrplugin (.zip)</strong> e extraia a pasta{' '}
                          <code className="font-mono text-zinc-200">FramePlusAI.lrplugin</code>.
                        </li>
                        <li>
                          No Lightroom Classic, abra{' '}
                          <strong className="text-zinc-200">Arquivo &gt; Gerenciador de Plug-ins...</strong>
                        </li>
                        <li>Clique em <strong className="text-zinc-200">Adicionar</strong> e selecione a pasta extraída.</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0F1115] border border-white/10 space-y-2">
                      <h4 className="text-sm font-semibold text-white">Passo 2 · Edição Sem Upload</h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-zinc-400">
                        <li>
                          <strong className="text-zinc-200">Fluxo XMP Direto:</strong> Clique em{' '}
                          <strong className="text-zinc-200">Gravar .XMP</strong> e no Lightroom use{' '}
                          <code className="font-mono text-zinc-200">Metadados &gt; Ler Metadados dos Arquivos</code>.
                        </li>
                        <li>
                          <strong className="text-zinc-200">Fluxo Live Bridge:</strong> Use{' '}
                          <code className="font-mono text-zinc-200">Arquivo &gt; Extras de Plug-in &gt; Editar com Frame Plus IA</code>{' '}
                          para aplicar <code className="font-mono text-zinc-200">applyDevelopSettings()</code>.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0F1115] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        Credenciais de Publicação Direta (ExportProvider)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLrModalOpen(false);
                          setActiveTab('configuracoes');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-[#D05634] hover:underline cursor-pointer"
                      >
                        <span>Abrir Configurações Lightroom</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                      <div className="p-2.5 rounded-lg bg-[#181B20] border border-white/10 flex items-center justify-between gap-2">
                        <span className="truncate text-zinc-300">{window.location.origin}</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(window.location.origin)}
                          className="text-[#D05634] hover:underline shrink-0 cursor-pointer"
                        >
                          Copiar URL
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#181B20] border border-white/10 flex items-center justify-between gap-2">
                        <span className="truncate text-zinc-300">{user?.uid || 'Faça login para ver UID'}</span>
                        {user?.uid && (
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(user.uid)}
                            className="text-[#D05634] hover:underline shrink-0 cursor-pointer"
                          >
                            Copiar Token
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-300">{lrModalTab}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const code =
                          lrModalTab === 'Info.lua'
                            ? lrPluginSource?.infoLua
                            : lrModalTab === 'EditWithFramePlusAI.lua'
                            ? lrPluginSource?.editWithFramePlusLua
                            : lrPluginSource?.exportProviderLua;
                        if (code) navigator.clipboard.writeText(code);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#252A34] hover:bg-[#2F3643] text-xs font-medium text-white cursor-pointer"
                    >
                      Copiar Código Lua
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0F1115] border border-white/10 text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                    {lrModalTab === 'Info.lua'
                      ? lrPluginSource?.infoLua || 'Carregando...'
                      : lrModalTab === 'EditWithFramePlusAI.lua'
                      ? lrPluginSource?.editWithFramePlusLua || 'Carregando...'
                      : lrPluginSource?.exportProviderLua || 'Carregando...'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
