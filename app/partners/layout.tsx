import PageWrapper from '@/components/wrapper/page-wrapper';

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
