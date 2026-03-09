import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { client } from "@/lib/sanity/client";
import { storiesQuery } from "@/lib/sanity/queries";
import { urlFor, getBlurDataURL } from "@/lib/sanity/image";
import StoryCard from "@/components/ui/StoryCard";
import SocialFeed from "@/components/sections/SocialFeed";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Stories" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      images: [{ url: "/og-stories.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      languages: { en: "/en/stories", he: "/he/stories" },
    },
  };
}

interface SanityImage {
  asset?: { _ref?: string };
}

interface Story {
  _id: string;
  title: string;
  slug: { current: string };
  image?: SanityImage;
  shortDescription?: string;
  publishedAt?: string;
  location?: string;
}

function getImageUrl(image?: SanityImage, width = 800): string {
  if (!image?.asset?._ref) return "";
  try {
    return urlFor(image).width(width).quality(80).auto("format").url();
  } catch {
    return "";
  }
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Stories");

  let stories: Story[] = [];

  try {
    stories = await client.fetch<Story[]>(storiesQuery, { locale }, { next: { tags: ["sanity"] } });
  } catch {
    // CMS not configured yet
  }

  // Resolve story images + blur placeholders
  const storyEntries = stories.map((story) => ({
    story,
    imageUrl: getImageUrl(story.image),
    source: story.image,
  }));

  await Promise.all(
    storyEntries.map(async (entry) => {
      if (entry.source?.asset?._ref) {
        (entry as { blurDataURL?: string }).blurDataURL = await getBlurDataURL(entry.source);
      }
    })
  );

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-8">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h1 className="text-h1 font-heading font-bold text-black mb-4">
              {t("title")}
            </h1>
            <p className="text-body text-gray-mid max-w-text mx-auto">
              {t("subtitle")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Instagram Feed — Latest from @bigbanuz */}
      <SocialFeed />

      {/* Field Notes — Story cards */}
      <section className="pb-section">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {storyEntries.length > 0 && (
            <ScrollReveal>
              <h2 className="text-h2 font-heading font-bold text-black mb-8">
                {t("fieldNotesTitle")}
              </h2>
            </ScrollReveal>
          )}

          {storyEntries.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storyEntries.map((entry, i) => (
                <ScrollReveal key={entry.story._id} delay={i * 100}>
                  <StoryCard
                    title={entry.story.title}
                    slug={entry.story.slug.current}
                    imageUrl={entry.imageUrl}
                    blurDataURL={(entry as { blurDataURL?: string }).blurDataURL}
                    shortDescription={entry.story.shortDescription}
                    publishedAt={entry.story.publishedAt}
                    location={entry.story.location}
                    locale={locale}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-16">
                <p className="text-body text-gray-mid">
                  {t("empty")}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}
