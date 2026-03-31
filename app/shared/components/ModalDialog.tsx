import { type KeyboardEvent as ReactKeyboardEvent, type PropsWithChildren, useEffect, useRef } from "react";

interface ModalDialogProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  descriptionId?: string;
  zIndexClassName?: string;
  panelClassName?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
  );
}

function handleFocusTrap(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    container?.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

export function ModalDialog({
  isOpen,
  onClose,
  titleId,
  descriptionId,
  zIndexClassName = "z-50",
  panelClassName = "",
  children,
}: ModalDialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      handleFocusTrap(event, panelRef.current);
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusableElements = getFocusableElements(panelRef.current);
    const autofocusTarget =
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus='true']") ??
      focusableElements[0] ??
      panelRef.current;

    autofocusTarget?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`relative z-10 mx-4 w-full outline-none ${panelClassName}`}
        onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
