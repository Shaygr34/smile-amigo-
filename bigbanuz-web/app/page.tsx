import { client } from "@/lib/sanity/client";
import { homePageQuery, galleryByLaneQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import SplitGateway from "@/components/sections/SplitGateway";
import FeaturedGallery from "@/components/sections/FeaturedGallery";
import CtaSection from "@/components/sections/CtaSection";
import type { GalleryImage } from "@/components/ui/GalleryGrid";
import { INSTAGRAM_URL } from "@/lib/utils/constants";

interface SanityImage {
  asset?: { _ref?: string };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

interface SanityGalleryImage {
  image: SanityImage;
  alt: string;
  caption?: string;
  location?: string;
  featured?: boolean;
}

interface HomePageData {
  heroImage?: SanityImage;
  eventsPreview?: {
    image?: SanityImage;
  };
  surfPreview?: {
    image?: SanityImage;
  };
  featuredGallery?: Array<{
    _id: string;
    title: string;
    images?: SanityGalleryImage[];
  }>;
  bottomCtaText?: string;
}

interface GalleryDoc {
  _id: string;
  title: string;
  images?: Array<{
    image: SanityImage;
    alt: string;
    caption?: string;
    location?: string;
  }>;
}

function getSanityImageUrl(image?: SanityImage, width = 1920): string {
  if (!image?.asset?._ref) return "";
  try {
    return urlFor(image).width(width).quality(85).auto("format").url();
  } catch {
    return "";
  }
}

export default async function HomePage() {
  let data: HomePageData | null = null;
  let eventsGalleries: GalleryDoc[] = [];
  let surfGalleries: GalleryDoc[] = [];

  try {
    [data, eventsGalleries, surfGalleries] = await Promise.all([
      client.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ["sanity"] } }),
      client.fetch<GalleryDoc[]>(galleryByLaneQuery, { lane: "events" }, { next: { tags: ["sanity"] } }),
      client.fetch<GalleryDoc[]>(galleryByLaneQuery, { lane: "surf" }, { next: { tags: ["sanity"] } }),
    ]);
  } catch {
    // CMS not configured yet
  }

  // Split-screen images: prefer CMS preview images, fall back to first gallery image
  const eventsImageUrl =
    getSanityImageUrl(data?.eventsPreview?.image) ||
    getSanityImageUrl(eventsGalleries[0]?.images?.[0]?.image);

  const surfImageUrl =
    getSanityImageUrl(data?.surfPreview?.image) ||
    getSanityImageUrl(surfGalleries[0]?.images?.[0]?.image);

  // Build featured gallery images from CMS
  const galleryImages: GalleryImage[] = [];
  if (data?.featuredGallery) {
    for (const gallery of data.featuredGallery) {
      if (gallery.images) {
        for (const img of gallery.images) {
          const url = getSanityImageUrl(img.image, 800);
          if (url) {
            galleryImages.push({
              url,
              alt: img.alt || "Photography by Amit Banuz",
              caption: img.caption,
              location: img.location,
            });
          }
        }
      }
    }
  }

  return (
    <>
      <SplitGateway
        eventsImage={eventsImageUrl}
        surfImage={surfImageUrl}
      />

      {galleryImages.length > 0 && (
        <FeaturedGallery images={galleryImages.slice(0, 9)} />
      )}

      <CtaSection
        headline={data?.bottomCtaText || "Let's create something amazing"}
        whatsappLabel="WhatsApp Me"
        instagramLabel="Follow @smileamigo.photo"
        instagramHref={INSTAGRAM_URL}
      />
    </>
  );
}
