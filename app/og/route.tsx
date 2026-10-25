import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  const title = new URL(request.url).searchParams.get('title') || 'Building things. Questioning everything.'
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: '#fff', color: '#171717', padding: '64px 72px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: 26 }}><span style={{ fontSize: 32, fontWeight: 700 }}>mm.</span><span style={{ fontSize: 18, color: '#666' }}>ENGINEERING / MATHEMATICS / IDEAS</span></div>
      <div style={{ fontSize: title.length > 90 ? 45 : 62, letterSpacing: '-2px', lineHeight: 1.15, fontWeight: 600 }}>{title.slice(0, 220)}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, color: '#555' }}><span>Manuel Martín Morante</span><span>Work & writing</span></div>
    </div>,
    { width: 1200, height: 630 },
  )
}
