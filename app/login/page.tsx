import LoginPage from "@/components/pages/login";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: "Login to Your Account - Ooshas Global",
    description: "Log in to your Ooshas Global account to access your student dashboard, track applications, connect with counselors, and manage your study abroad journey.",
    keywords: "Ooshas Global Login, Student Login, Ooshas Account Login, Study Abroad Portal, Student Dashboard, Ooshas Global Student Portal, Overseas Education Login, Ooshas Sign In",
    alternates: {
      canonical: "https://ooshasglobal.com/login",
    },
    openGraph: {
      title: "Login to Your Account - Ooshas Global",
      description: "Log in to your Ooshas Global account to access your student dashboard, track applications, connect with counselors, and manage your study abroad journey.",
      url: "https://ooshasglobal.com/login",
      siteName: "Ooshas Global",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Login to Your Account - Ooshas Global",
      description: "Log in to your Ooshas Global account to access your dashboard and manage your study abroad journey."
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Page() {
  return (
    <>
      <LoginPage />
    </>
  );
}