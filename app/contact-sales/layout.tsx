import PageWrapper from '@/components/wrapper/page-wrapper';

export default function ContactSalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
