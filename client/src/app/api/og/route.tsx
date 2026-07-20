// region imports
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
// endregion

// region edge runtime configuration
export const runtime = 'edge';
// endregion

// region og image generator
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const savings = parseFloat(searchParams.get('savings') ?? '0');
  const annualSavings = parseFloat(searchParams.get('annual') ?? String(savings * 12));
  const tools = parseInt(searchParams.get('tools') ?? '0', 10);
  const isOptimal = searchParams.get('optimal') === '1';

  const monthlySavingsText = savings > 0
    ? `$${savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo`
    : 'Optimized';

  const annualSavingsText = annualSavings > 0
    ? `$${annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr`
    : null;

  const headline = isOptimal
    ? "Your AI stack is well-optimized"
    : savings > 0
      ? `You could save ${monthlySavingsText}`
      : "AI Spend Audit Results";

  const subheadline = isOptimal
    ? `${tools} tool${tools !== 1 ? 's' : ''} audited · Already running lean`
    : savings > 0
      ? `${tools} tool${tools !== 1 ? 's' : ''} audited · ${annualSavingsText ? annualSavingsText + ' annual savings' : ''}`
      : `${tools} tool${tools !== 1 ? 's' : ''} audited by WiseBill AI`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1e1040 40%, #0f1729 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        { // background grid pattern
        }
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.1) 0%, transparent 50%)',
          }}
        />

        { // top bar: logo and badge
        }
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              💡
            </div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
              WiseBill <span style={{ color: '#818cf8', fontWeight: '400' }}>AI</span>
            </span>
          </div>
          <div style={{
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '100px',
            padding: '8px 20px',
            color: '#a5b4fc',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}>
            AI SPEND AUDIT
          </div>
        </div>

        { // main content area
        }
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1, flex: 1, justifyContent: 'center' }}>
          <div style={{
            fontSize: savings > 999 ? '72px' : '80px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '-3px',
            lineHeight: '1',
          }}>
            {headline}
          </div>

          {annualSavingsText && !isOptimal && (
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              letterSpacing: '-0.5px',
            }}>
              {annualSavingsText} saved annually
            </div>
          )}

          <div style={{
            fontSize: '22px',
            color: '#94a3b8',
            fontWeight: '500',
            marginTop: '8px',
          }}>
            {subheadline}
          </div>
        </div>

        { // bottom cta bar
        }
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
        }}>
          <div style={{
            fontSize: '18px',
            color: '#64748b',
            fontWeight: '500',
          }}>
            wisebill.ai · Free AI spend audit
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            borderRadius: '12px',
            padding: '14px 32px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '0.2px',
          }}>
            Audit your stack →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
// endregion
