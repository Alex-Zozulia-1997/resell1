import PageWrapper from '@/components/wrapper/page-wrapper';

export default function FreeProxiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
