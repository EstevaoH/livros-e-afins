export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen dark:bg-neutral-950">
      {children}
    </div>
  );
}