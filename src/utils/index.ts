import { useEffect, useRef } from 'react'

type UseEventListener = <E>(
  eventName: string, 
  handler: (event: E) => void, 
  element?: HTMLElement | SVGElement | globalThis.Window | globalThis.Document,
  options?: boolean | AddEventListenerOptions
) => void


const maybeWindow = () => {
  try {
    return window
  } catch {
    return undefined
  }
}

export const useEventListener: UseEventListener = (
    eventName,
    handler,
    element = maybeWindow(),
    options,
) => {
  const savedHandler = useRef<(event: any) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
  
      const eventListener = (event: Event) => savedHandler.current!(event);
      
      element.addEventListener(eventName, eventListener, options);

      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  )
}