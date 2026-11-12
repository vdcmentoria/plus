import { User } from 'firebase/auth';

export function isUserAdmin(user: any, userProfile: any): boolean {
  if (!user && !userProfile) return false;
  
  const email = (user?.email || userProfile?.email || '').toLowerCase().trim();
  const isMaster = email === 'felipemachadophotography@gmail.com' || email === 'isabelefelipefotografias@gmail.com';
  
  return Boolean(
    isMaster || 
    userProfile?.role === 'admin' || 
    userProfile?.isAdmin === true
  );
}

export function getCollectionStorageBytes(collection: any): number {
  if (!collection) return 0;
  
  // If explicitly calculated and saved
  if (typeof collection.totalStorageBytes === 'number' && collection.totalStorageBytes > 0) {
    return collection.totalStorageBytes;
  }
  
  let total = 0;
  const mediaSizes = collection.mediaSizes || {};
  const mediaMetadata = collection.mediaMetadata || [];
  
  if (Array.isArray(collection.media)) {
    for (const item of collection.media) {
      if (typeof item === 'object' && item?.size) {
        total += Number(item.size);
      } else if (typeof item === 'string') {
        if (mediaSizes[item] && typeof mediaSizes[item] === 'number') {
          total += Number(mediaSizes[item]);
        } else {
          const meta = Array.isArray(mediaMetadata) ? mediaMetadata.find((m: any) => m?.url === item) : null;
          if (meta?.size) {
            total += Number(meta.size);
          } else {
            // Realistic average size for high-resolution gallery photos (3.5 MB each)
            total += 3.5 * 1024 * 1024;
          }
        }
      }
    }
  }
  
  if (collection.image && typeof collection.image === 'string' && !collection.media?.includes(collection.image)) {
    total += 1.8 * 1024 * 1024;
  }
  
  return total;
}

export interface StorageInfo {
  totalBytes: number;
  totalMB: number;
  totalGB: number;
  limitGB: number;
  limitMB: number;
  percent: number;
  formattedUsed: string;
  formattedLimit: string;
  formattedPercent: string;
  isOverLimit: boolean;
}

export function calculateUserStorage(collections: any[] | null | undefined, userProfile: any): StorageInfo {
  const safeCollections = collections || [];
  const totalBytes = safeCollections.reduce((acc: number, c: any) => acc + getCollectionStorageBytes(c), 0);
  const totalMB = totalBytes / (1024 * 1024);
  const totalGB = totalBytes / (1024 * 1024 * 1024);
  
  const limitGB = Number(userProfile?.storageLimitGB || userProfile?.storageGB || 30);
  const limitMB = limitGB * 1024;
  const percent = limitMB > 0 ? Math.min(100, (totalMB / limitMB) * 100) : 0;
  
  let formattedUsed = '';
  if (totalGB >= 1) {
    formattedUsed = `${totalGB.toFixed(2)} GB`;
  } else if (totalMB >= 0.1) {
    formattedUsed = `${totalMB.toFixed(1)} MB`;
  } else if (totalBytes > 0) {
    formattedUsed = `${(totalBytes / 1024).toFixed(0)} KB`;
  } else {
    formattedUsed = `0 MB`;
  }
  
  let formattedLimit = '';
  if (limitGB >= 1024) {
    formattedLimit = `${(limitGB / 1024).toFixed(0)} TB`;
  } else {
    formattedLimit = `${limitGB} GB`;
  }
  
  return {
    totalBytes,
    totalMB,
    totalGB,
    limitGB,
    limitMB,
    percent,
    formattedUsed,
    formattedLimit,
    formattedPercent: `${percent.toFixed(1)}%`,
    isOverLimit: percent >= 100
  };
}

export function getUserExpirationDate(userProfile: any): Date {
  if (!userProfile) return new Date();
  if (userProfile.expiresAt) {
    const d = new Date(userProfile.expiresAt);
    if (!isNaN(d.getTime())) return d;
  }
  const created = userProfile.createdAt ? new Date(userProfile.createdAt).getTime() : Date.now();
  const trialDays = userProfile.trialDays !== undefined ? Number(userProfile.trialDays) : 7;
  return new Date(created + (trialDays * 24 * 60 * 60 * 1000));
}

export function getUserDaysRemaining(userProfile: any): number {
  if (!userProfile) return 0;
  const expDate = getUserExpirationDate(userProfile);
  const diffMs = expDate.getTime() - Date.now();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export function isTrialExpired(userProfile: any): boolean {
  if (!userProfile) return false;
  if (userProfile.role === 'admin' || userProfile.isAdmin === true) return false;
  if (userProfile.status === 'Inativo') return true;
  
  const expDate = getUserExpirationDate(userProfile);
  return Date.now() > expDate.getTime();
}

export function getTrialDaysRemaining(userProfile: any): number {
  if (!userProfile) return 0;
  if (userProfile.role === 'admin' || userProfile.isAdmin === true) return 999;
  
  return Math.max(0, getUserDaysRemaining(userProfile));
}
