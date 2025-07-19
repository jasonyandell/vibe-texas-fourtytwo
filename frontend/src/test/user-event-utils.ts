import { userEvent } from '@testing-library/user-event';
import { act } from 'react';

// Enhanced userEvent that wraps all interactions in act() to prevent warnings
export const createUserEvent = () => {
  const user = userEvent.setup();
  
  return {
    ...user,
    
    // Wrap click interactions in act
    click: async (element: Element) => {
      await act(async () => {
        await user.click(element);
      });
    },
    
    // Wrap type interactions in act
    type: async (element: Element, text: string) => {
      await act(async () => {
        await user.type(element, text);
      });
    },
    
    // Wrap clear interactions in act
    clear: async (element: Element) => {
      await act(async () => {
        await user.clear(element);
      });
    },
    
    // Wrap tab interactions in act
    tab: async () => {
      await act(async () => {
        await user.tab();
      });
    },
    
    // Wrap keyboard interactions in act
    keyboard: async (text: string) => {
      await act(async () => {
        await user.keyboard(text);
      });
    },
    
    // Wrap hover interactions in act
    hover: async (element: Element) => {
      await act(async () => {
        await user.hover(element);
      });
    },
    
    // Wrap unhover interactions in act
    unhover: async (element: Element) => {
      await act(async () => {
        await user.unhover(element);
      });
    },
    
    // Wrap upload interactions in act
    upload: async (element: HTMLElement, file: File | File[]) => {
      await act(async () => {
        await user.upload(element, file);
      });
    }
  };
};

// Helper function to wrap any async operation in act
export const actAsync = async (fn: () => Promise<void>) => {
  await act(async () => {
    await fn();
  });
};
