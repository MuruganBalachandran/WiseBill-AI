import type { Metadata } from 'next';
import { getServerAuditBySlug } from '@/services/audit';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';



export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getServerAuditBySlug(slug);

  if (!audit) {
    return {
      title: 'Audit Not Found',
      description: 'This audit link may have expired or does not exist.',
    };
  }

  const savings = audit.totalMonthlySavings;
  const annual = audit.totalAnnualSavings;
  const tools = audit.spendInputs?.length ?? 0;
  const isOptimal = savings <= 0;

  const title = isOptimal
    ? `AI Stack Audit — Already Optimized (${tools} tools)`
    : `AI Stack Audit — Save $${savings.toFixed(0)}/mo on your AI tools`;

  const description = audit.aiSummary
    ? audit.aiSummary.slice(0, 155)
    : isOptimal
      ? `Your team's AI stack looks well-optimized across ${tools} tools. See the full breakdown on WiseBill AI.`
      : `Your AI stack audit found $${savings.toFixed(0)}/month ($${annual.toFixed(0)}/year) in potential savings across ${tools} tools. See the full breakdown.`;

  const ogImageUrl = new URL(`${APP_URL}/api/og`);
  ogImageUrl.searchParams.set('savings', savings.toFixed(0));
  ogImageUrl.searchParams.set('annual', annual.toFixed(0));
  ogImageUrl.searchParams.set('tools', String(tools));
  if (isOptimal) ogImageUrl.searchParams.set('optimal', '1');

  const auditUrl = `${APP_URL}/audit/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: auditUrl,
      siteName: 'WiseBill AI',
      title,
      description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
    alternates: {
      canonical: auditUrl,
    },
  };
}

export default function AuditSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
