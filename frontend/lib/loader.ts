type Listener = (visible: boolean) => void;

let visible = false;
const listeners = new Set<Listener>();

export function showLoader() {
  if (!visible) {
    visible = true;
    listeners.forEach((l) => l(true));
  }
}

export function hideLoader() {
  if (visible) {
    visible = false;
    listeners.forEach((l) => l(false));
  }
}

export function subscribeLoader(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isLoaderVisible() {
  return visible;
}


