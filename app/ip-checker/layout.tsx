import PageWrapper from '@/components/wrapper/page-wrapper';

export default function IPCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
