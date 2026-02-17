import { MutableRefObject, useEffect } from 'react';

interface UseKeyboardShortcutsParams {
  domainCardRefs: MutableRefObject<Array<HTMLElement | null>>;
  onFocusSearch: () => void;
  onEscape: () => void;
}

const KEY_TO_DOMAIN_INDEX: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '0': 9,
};

const isTextInputTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
};

export const useKeyboardShortcuts = ({
  domainCardRefs,
  onFocusSearch,
  onEscape,
}: UseKeyboardShortcutsParams): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') return;

      const isTyping = isTextInputTarget(event.target);
      if (event.key in KEY_TO_DOMAIN_INDEX && !isTyping) {
        const index = KEY_TO_DOMAIN_INDEX[event.key];
        const element = domainCardRefs.current[index];
        if (element) {
          event.preventDefault();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        onFocusSearch();
        return;
      }

      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [domainCardRefs, onFocusSearch, onEscape]);
};
