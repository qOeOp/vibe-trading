/**
 * Stub: app-config/state — Settings panel navigation not used in VT.
 */

export function useOpenSettingsToTab() {
  const handleClick = (_tab: string, _subTab?: string) => {
    // no-op in VT
  };
  return { handleClick };
}
