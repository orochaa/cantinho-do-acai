import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  imgUrl?: string
}

export function Seo({
  title,
  description,
  imgUrl,
}: SeoProps): React.JSX.Element {
  const absoluteImageUrl = imgUrl
    ? `${globalThis.location.origin}${imgUrl}`
    : undefined

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!!absoluteImageUrl && (
        <meta property="og:image" content={absoluteImageUrl} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!!absoluteImageUrl && (
        <meta name="twitter:image" content={absoluteImageUrl} />
      )}
    </Helmet>
  )
}
