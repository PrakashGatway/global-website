"use client";
function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-gray-200 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="w-full border-b border-gray-100 bg-white">
      {/* Top bar */}
      <div className="hidden border-b border-gray-100 lg:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-3 w-36 rounded-full" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Skeleton className="h-11 w-40 rounded-md" />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>

        {/* Mobile menu */}
        <Skeleton className="h-9 w-9 rounded-lg lg:hidden" />
      </div>
    </header>
  );
}

function BreadcrumbSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-3 w-14 rounded-full" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-3 w-32 rounded-full" />
      </div>
    </div>
  );
}

function ArticleHeroSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="max-w-4xl">
        {/* Category */}
        <Skeleton className="mb-5 h-7 w-28 rounded-full" />

        {/* Title */}
        <Skeleton className="h-9 w-full max-w-4xl rounded-lg md:h-12" />
        <Skeleton className="mt-3 h-9 w-4/5 max-w-3xl rounded-lg md:h-12" />

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-full" />
        </div>
      </div>

      {/* Featured image */}
      <Skeleton className="mt-8 aspect-[16/8] w-full rounded-2xl md:mt-10" />
    </section>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Intro paragraph */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-11/12 rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
      </div>

      {/* Heading */}
      <Skeleton className="h-8 w-3/5 rounded-lg" />

      {/* Paragraph */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-10/12 rounded" />
        <Skeleton className="h-5 w-9/12 rounded" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex gap-4 border-b border-gray-200 bg-gray-100 p-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 border-b border-gray-100 p-4 last:border-0"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>

      {/* Heading */}
      <Skeleton className="h-8 w-2/3 rounded-lg" />

      {/* Paragraphs */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-11/12 rounded" />
        <Skeleton className="h-5 w-10/12 rounded" />
      </div>

      {/* List */}
      <div className="space-y-4 pl-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-full" />
            <Skeleton
              className={`h-4 ${
                index % 2 === 0 ? "w-4/5" : "w-3/5"
              }`}
            />
          </div>
        ))}
      </div>

      {/* More content */}
      <Skeleton className="h-8 w-1/2 rounded-lg" />

      <div className="space-y-3">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-10/12 rounded" />
        <Skeleton className="h-5 w-8/12 rounded" />
      </div>
    </div>
  );
}

function TableOfContentsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <Skeleton className="mb-5 h-6 w-40 rounded-lg" />

      <div className="space-y-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="mt-1 h-2 w-2 shrink-0 rounded-full" />

            <Skeleton
              className={`h-4 ${
                index % 3 === 0
                  ? "w-4/5"
                  : index % 2 === 0
                    ? "w-3/5"
                    : "w-2/3"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsultationFormSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <Skeleton className="h-7 w-3/4 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-full rounded" />
      <Skeleton className="mt-1 h-4 w-4/5 rounded" />

      <div className="mt-6 space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      <Skeleton className="mt-5 h-12 w-full rounded-lg" />

      <div className="mt-4 flex items-start gap-2">
        <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded" />
        <Skeleton className="h-3 w-full rounded" />
      </div>
    </div>
  );
}

function RelatedArticlesSkeleton() {
  return (
    <section className="mt-14 border-t border-gray-100 pt-10">
      <Skeleton className="h-8 w-52 rounded-lg" />

      <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <Skeleton className="aspect-[16/9] w-full rounded-none" />

            <div className="p-5">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="mt-3 h-6 w-full rounded-lg" />
              <Skeleton className="mt-2 h-6 w-4/5 rounded-lg" />

              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
              </div>

              <Skeleton className="mt-5 h-4 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="mt-16 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Skeleton className="h-10 w-36 bg-gray-700" />

            <div className="mt-5 space-y-3">
              <Skeleton className="h-3 w-full bg-gray-700" />
              <Skeleton className="h-3 w-11/12 bg-gray-700" />
              <Skeleton className="h-3 w-4/5 bg-gray-700" />
            </div>

            <div className="mt-6 flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full bg-gray-700" />
              <Skeleton className="h-9 w-9 rounded-full bg-gray-700" />
              <Skeleton className="h-9 w-9 rounded-full bg-gray-700" />
            </div>
          </div>

          {/* Links */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-5 w-32 bg-gray-700" />

              <div className="mt-5 space-y-4">
                {Array.from({ length: 5 }).map((_, itemIndex) => (
                  <Skeleton
                    key={itemIndex}
                    className="h-3 w-28 bg-gray-700"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <Skeleton className="h-3 w-64 bg-gray-700" />
        </div>
      </div>
    </footer>
  );
}

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />

      <main className="min-h-screen bg-white">
        <BreadcrumbSkeleton />

        <ArticleHeroSkeleton />

        {/* Main article area */}
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">

            {/* Article */}
            <article className="min-w-0">
              {/* Social/share row */}
              <div className="mb-7 flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>

                <Skeleton className="h-4 w-24 rounded-full" />
              </div>

              {/* TOC on mobile/tablet */}
              <div className="mb-8 lg:hidden">
                <TableOfContentsSkeleton />
              </div>

              <ContentSkeleton />

              <RelatedArticlesSkeleton />
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContentsSkeleton />
                <ConsultationFormSkeleton />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <FooterSkeleton />

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}