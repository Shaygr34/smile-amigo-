import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { client } from "@/lib/sanity/client";
import { galleryByLaneQuery } from "@/lib/sanity/queries";
import { urlFor, getBlurDataURL } from "@/lib/sanity/image";
import Hero from "@/components/sections/Hero";
import CtaSection from "@/components/sections/CtaSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { INSTAGRAM_URL } from "@/lib/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      languages: { en: "/en/about", he: "/he/about" },
    },
  };
}

interface SanityImage {
  asset?: { _ref?: string };
}

interface GalleryDoc {
  _id: string;
  title: string;
  images?: Array<{
    image: SanityImage;
    alt: string;
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  let heroUrl = "";
  let heroBlur = "";

  try {
    const galleries = await client.fetch<GalleryDoc[]>(
      galleryByLaneQuery,
      { lane: "surf", locale },
      { next: { tags: ["sanity"] } }
    );
    const firstImage = galleries?.[0]?.images?.[0]?.image;
    heroUrl = getImageUrl(firstImage, 1920);
    if (firstImage?.asset?._ref) {
      heroBlur = await getBlurDataURL(firstImage);
    }
  } catch {
    // CMS not configured yet
  }

  const locations = [
    { name: t("locationPhilippines"), description: t("locationPhilippinesDesc") },
    { name: t("locationSriLanka"), description: t("locationSriLankaDesc") },
    { name: t("locationIsrael"), description: t("locationIsraelDesc") },
    { name: t("locationAustralia"), description: t("locationAustraliaDesc") },
  ];

  return (
    <>
      <Hero
        imageUrl={heroUrl}
        imageAlt={t("heroImageAlt")}
        blurDataURL={heroBlur}
        headline={t("heroHeadline")}
        subline={t("heroSubline")}
      />

      {/* Story Section */}
      <section className="py-section">
        <div className="max-w-text mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-h2 font-heading font-bold text-black mb-8">
              {t("storyTitle")}
            </h2>
            <div className="space-y-6 text-body text-gray-mid leading-relaxed">
              <p>{t("storyP1")}</p>
              <p>{t("storyP2")}</p>
              <p>{t("storyP3")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-section bg-gray-light">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-h2 font-heading font-bold text-black text-center mb-12">
              {t("locationsTitle")}
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc, i) => (
              <ScrollReveal key={loc.name} delay={i * 100}>
                <div className="bg-white-pure rounded-lg p-6 shadow-card text-center">
                  <h3 className="text-h3 font-heading font-semibold text-black mb-2">
                    {loc.name}
                  </h3>
                  <p className="text-small text-gray-mid">
                    {loc.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-section">
        <div className="max-w-text mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-h2 font-heading font-bold text-black mb-8">
              {t("approachTitle")}
            </h2>
            <div className="space-y-6 text-body text-gray-mid leading-relaxed">
              <p>{t("approachP1")}</p>
              <p>{t("approachP2")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaSection
        headline={t("ctaHeadline")}
        whatsappLabel={t("ctaGetInTouch")}
        emailLabel={t("ctaViewEvents")}
        emailHref="/events"
        instagramLabel={t("ctaFollowSmileAmigo")}
        instagramHref={INSTAGRAM_URL}
      />
    </>
  );
}
