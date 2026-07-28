import { ImageResponse } from 'next/og';
import { getBlogPostBySlug } from '@/src/lib/blog';

export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = 'Blog post preview';

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  const title = post?.title ?? 'Blog Post';
  const excerpt = post?.excerpt ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #131313 0%, #1c1b1b 50%, #0a0a0a 100%)',
          color: '#e5e2e1',
          fontFamily: 'monospace',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #4fdbc8, #89ceff, #4fdbc8)',
          }}
        />

        {/* Title */}
        <div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: '20px',
              maxWidth: '1000px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: '22px',
                color: '#bbcac6',
                lineHeight: 1.5,
                maxWidth: '900px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {excerpt}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#4fdbc8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#131313',
              }}
            >
              RS
            </div>
            <div style={{ fontSize: '20px', color: '#bbcac6' }}>
              Rakshit Sharma
            </div>
          </div>
          <div style={{ fontSize: '16px', color: '#4fdbc8' }}>
            rakshit.codes/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
