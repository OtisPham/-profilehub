/**
 * Reverse Sync Toast & Master Project Types
 * Định nghĩa hợp đồng dữ liệu cho Non-blocking Sync Toast và đồng bộ ngược đồ án về kho Master
 */

import type { ProjectItem } from './cvSection';

export interface ReverseSyncToastProps {
  isOpen: boolean;
  projectsToSync: ProjectItem[];
  onSync: () => Promise<void>;
  onDismiss: () => void;
  isSyncing?: boolean;
  syncedCount?: number;
}

export interface ReverseSyncDetectionResult {
  hasEligibleProjects: boolean;
  eligibleProjects: ProjectItem[];
  optedOutProjects: ProjectItem[];
}
