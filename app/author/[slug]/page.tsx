
import AuthorPage from '@/components/authorPage';
import { notFound } from 'next/navigation';

// types
interface Author {
  name: string;
  role: string;
  title: string;
  education: string;
  expertise: string;
  about: string;
  exams: string[];
  email: string;
  specializes: string;
  articles: {
    title: string;
    date: string;
    reads?: string;
    comments?: string;
    shares?: string;
  }[];
}

// mock data – 3 static authors
const authorsData: Record<string, Author> = {
 'sakshi-taneja': {
  name: 'Sakshi Taneja',
  role: 'Teacher & Study Abroad Expert',
  title: 'Content Writer & International Education Specialist',
  education: 'Academic Background in Education & International Studies',
  expertise:
    'Study Abroad Guidance, University Admissions, Visa Processes, Test Preparation, Educational Content Writing',
  about:
    'Sakshi Taneja is a Teacher and expert Content Writer at Gateway Abroad Education, specializing in international education and test preparation. Drawing from her academic background, she demystifies the complex study abroad journey by crafting insightful, actionable guides on global university admissions, visa processes, and effective exam strategies. Her expert, student-first content empowers applicants to confidently clear competitive tests and transition to top overseas institutions. Passionate about education, Sakshi turns overwhelming academic requirements into clear, step-by-step roadmaps. Her high-value articles and resources bridge the gap between global dreams and reality, making her a trusted authority for future international students.',
  exams: [
    'Study Abroad Counseling',
    'University Admissions',
    'Student Visa Guidance',
    'IELTS Preparation',
    'TOEFL Preparation',
    'PTE Preparation',
    'Scholarship Guidance',
    'International Education',
    'Career Counseling'
  ],
  email: '',
  specializes: 'Study Abroad Education & Test Preparation',
  articles: [
    {
      title: 'Complete Guide to Studying Abroad in 2026',
      date: 'Updated Jun 19, 2026',
      comments: '18 Comments',
      shares: '24 Shares',
    },
    {
      title: 'How to Choose the Right University for International Studies',
      date: 'Updated Jun 18, 2026',
      reads: '18.2K Reads',
      shares: '14 Shares',
    },
  ],
},

 
};

// generate static params for 3 slugs
export function generateStaticParams() {
  return Object.keys(authorsData).map((slug) => ({
    slug,
  }));
}

export default async function Author({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const author = authorsData[slug];

  if (!author) {
    notFound();
  }




  return (
   <AuthorPage author={author}/>
  );
}