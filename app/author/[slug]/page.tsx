
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
  'prakash-jangid': {
  name: 'Prakash Jangid',
  role: 'Software Developer',
  title: 'Full Stack Developer',
  education: 'B.Tech in Mechanical Engineering',
  expertise: 'Web Development, Frontend Engineering, Full Stack Applications',
  about:
    'Prakash Jangid is a Full Stack Developer with 4+ years of experience in building modern web applications using React.js, Next.js, Node.js, Express.js, and MongoDB. He specializes in creating scalable, user-friendly digital solutions and has worked on education, immigration, and business platforms. His expertise includes frontend architecture, API integration, performance optimization, and responsive UI/UX development.',
  exams: [
    'React.js',
    'Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript',
    'TypeScript',
    'Tailwind CSS',
    'REST APIs'
  ],
  email: 'prakash.jangid@example.com',
  specializes: 'Full Stack Web Development',
  articles: [
    {
      title: 'Building Scalable Applications with Next.js and React',
      date: 'Updated Jun 19, 2026',
      comments: '12 Comments',
      shares: '18 Shares',
    },
    {
      title: 'Best Practices for API Integration in Modern Web Apps',
      date: 'Updated Jun 18, 2026',
      reads: '15.4K Reads',
      shares: '9 Shares',
    },
  ],
},
  'manish': {
    name: 'Manish',
    role: 'Senior Content Lead',
    title: 'Education Journalist',
    education: 'Master\'s in English Literature, B.Ed.',
    expertise: 'Medical & Law Entrance Exams',
    about:
      'Manish has over 5 years of experience in educational journalism. She specializes in medical and law entrance exams, providing in-depth analysis and timely updates for aspirants. Her articles help students navigate complex admission processes with confidence.',
    exams: ['NEET', 'AIIMS', 'CLAT', 'AILET', 'LSAT India', 'MH CET Law', 'AP LAWCET', 'TS LAWCET'],
    email: 'manish@shiksha.com',
    specializes: 'Medical & Law',
    articles: [
      {
        title: 'NEET 2026 Counselling Schedule: Everything You Need to Know',
        date: 'Updated Jun 17, 2026',
        comments: '12 Comments',
        shares: '24 Share',
      },
      {
        title: 'CLAT 2027 Exam Date Announced – Check Complete Details',
        date: 'Updated Jun 15, 2026',
        reads: '15.4K Reads',
        shares: '6 Share',
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