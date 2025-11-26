/**
 * UI 저장소
 * 패널 및 모달 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // 상태
  isFilterPanelOpen: boolean;
  isCustomizationPanelOpen: boolean;
  activeModal: string | null;
  sidebarCollapsed: boolean;

  // 액션
  toggleFilterPanel: () => void;
  toggleCustomizationPanel: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // 초기 상태
      isFilterPanelOpen: false,
      isCustomizationPanelOpen: false,
      activeModal: null,
      sidebarCollapsed: false,

      // 액션 구현
      toggleFilterPanel: () =>
        set((state) => ({
          isFilterPanelOpen: !state.isFilterPanelOpen,
        })),

      toggleCustomizationPanel: () =>
        set((state) => ({
          isCustomizationPanelOpen: !state.isCustomizationPanelOpen,
        })),

      openModal: (modalId) => set({ activeModal: modalId }),

      closeModal: () => set({ activeModal: null }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
    }),
    { name: 'UIStore' }
  )
);
