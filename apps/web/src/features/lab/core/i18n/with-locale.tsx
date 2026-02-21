/**
 * Stub: i18n/with-locale — Locale wrapper, defaults to navigator locale in VT.
 */

export function WithLocale({
  children,
}: {
  children: (locale: string) => React.ReactNode;
}) {
  const locale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  return <>{children(locale)}</>;
}
