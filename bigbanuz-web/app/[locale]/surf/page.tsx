import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { client } from "@/lib/sanity/client";
import { galleryByLaneQuery } from "@/lib/sanity/queries";
import { urlFor, getBlurDataURL } from "@/lib/sanity/image";
import Hero from "@/components/sections/Hero";
import SurfGallery from "@/components/sections/SurfGallery";
import type { SurfGalleryImage } from "@/components/sections/SurfGallery";
import LocationsStrip from "@/components/sections/LocationsStrip";
import CollabForm from "@/components/ui/CollabForm";
import CtaSection from "@/components/sections/CtaSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { INSTAGRAM_URL } from "@/lib/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Surf" });

  let ogImage: string | undefined;
  try {
    const galleries = await client.fetch<GalleryDoc[]>(
      galleryByLaneQuery,
      { lane: "surf", locale },
      { next: { tags: ["sanity"] } }
    );
    const firstImage = galleries?.[0]?.images?.[0]?.image;
    if (firstImage?.asset?._ref) {
      ogImage = urlFor(firstImage).width(1200).height(630).quality(80).auto("format").url();
    }
  } catch {
    // fallback to default
  }

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    alternates: {
      languages: { en: "/en/surf", he: "/he/surf" },
    },
  };
}

interface SanityImage {
  asset?: { _ref?: string };
}

interface GalleryDoc {
  _id: string;
  title: string;
  category?: string;
  images?: Array<{
    image: SanityImage;
    alt: string;
    caption?: string;
    location?: string;
  }>;
}

function getImageUrl(image?: SanityImage, width = 800): string {
  if (!image?.asset?._ref) return "";
  try {
    return urlFor(image).width(width).quality(80).auto("format").url();
  } catch {
    return "";
  }
}

export default async function SurfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Surf");

  let galleries: GalleryDoc[] = [];

  try {
    galleries = await client.fetch<GalleryDoc[]>(
      galleryByLaneQuery,
      { lane: "surf", locale },
      { next: { tags: ["sanity"] } }
    );
  } catch {
    // CMS not configured yet
  }

  const galleryEntries: { image: SurfGalleryImage; source: SanityImage }[] = [];
  for (const gallery of galleries) {
    if (gallery.images) {
      for (const img of gallery.images) {
        const url = getImageUrl(img.image);
        if (url) {
          galleryEntries.push({
            image: {
              url,
              alt: img.alt || "Surf photography",
              caption: img.caption,
              location: img.location,
              category: gallery.category || "action",
            },
            source: img.image,
          });
        }
      }
    }
  }

  const heroSource = galleries[0]?.images?.[0]?.image;
  const surfHeroUrl = galleryEntries.length > 0 ? getImageUrl(heroSource, 1920) : "";

  const [heroBlur] = await Promise.all([
    heroSource?.asset?._ref ? getBlurDataURL(heroSource) : Promise.resolve(""),
    ...galleryEntries.map(async (entry) => {
      entry.image.blurDataURL = await getBlurDataURL(entry.source);
    }),
  ]);

  const galleryImages = galleryEntries.map((e) => e.image);

  return (
    <>
      <Hero
        imageUrl={surfHeroUrl}
        imageAlt={t("heroImageAlt")}
        blurDataURL={heroBlur}
        headline={t("heroHeadline")}
        subline={t("heroSubline")}
        ctas={[
          { label: t("workWithMe"), href: "#work-with-me" },
        ]}
      />

      <SurfGallery images={galleryImages} />

      <LocationsStrip />

      {/* Work With Me Section */}
      <section id="work-with-me" className="py-section bg-gray-light">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-h2 font-heading font-bold text-black text-center mb-4">
              {t("workWithMe")}
            </h2>
            <p className="text-body text-gray-mid text-center max-w-text mx-auto mb-12">
              {t("workWithMeSubtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <CollabForm />
          </ScrollReveal>
        </div>
      </section>

      <CtaSection
        headline={t("ctaHeadline")}
        instagramLabel={t("followSmileAmigo")}
        instagramHref={INSTAGRAM_URL}
        whatsappLabel={t("whatsappMe")}
      />
    </>
  );
}
