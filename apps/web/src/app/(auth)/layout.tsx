export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility: Wrapper div for auth pages */}
      {children}
    </div>
  );
}
