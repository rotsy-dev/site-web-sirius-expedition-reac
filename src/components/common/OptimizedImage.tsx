import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean; // Pour les images above-the-fold
  aspectRatio?: string; // e.g., "16/9", "4/3"
}

const DEFAULT_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0YwRTdENSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM0QjM5MzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  priority = false,
  aspectRatio,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Commence à charger 50px avant d'entrer dans le viewport
      }
    );

    const imgElement = document.querySelector(`[data-img-src="${src}"]`);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => observer.disconnect();
  }, [src, priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(DEFAULT_FALLBACK);
      }
    }
  };

  // Préchargement pour les images prioritaires
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const containerClass = aspectRatio
    ? `relative overflow-hidden ${className}`
    : className;

  const aspectStyle = aspectRatio
    ? {
        aspectRatio: aspectRatio.replace('/', ' / '),
      }
    : {};

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#F0E7D5] ${containerClass}`}
        style={aspectStyle}
        {...(props as any)}
      >
        <ImageIcon className="w-12 h-12 text-[#4B3935]/40" />
      </div>
    );
  }

  return (
    <div
      className={containerClass}
      style={aspectStyle}
      data-img-src={src}
    >
      {/* Placeholder pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E7D5] via-[#F8F5F0] to-[#F0E7D5] animate-pulse" />
      )}

      {/* Image */}
      {(priority || isInView) && (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
