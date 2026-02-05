import { PageWrapper, PageHeader, PageSection, TextBlock, PageFooter } from "@/components/layout";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Blog - Crytch",
  description: "Updates and news about Crytch",
};

interface BlogPost {
  date: string;
  title: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    date: "2017-08-30",
    title: "Crytch V2 Released",
    content: `After months of development, we're excited to announce the release of Crytch V2. This major update brings a completely rewritten encryption algorithm, improved text rendering, and a much more polished user interface. The new version supports longer passwords and provides better visual scrambling while maintaining perfect reversibility.`,
  },
  {
    date: "2017-07-22",
    title: "Public Keys Exhibition",
    content: `Crytch was featured at the "Public Keys" exhibition at Bauhaus-Universität Weimar. Visitors could create encrypted messages on site, which were then displayed as part of the installation. The exhibition explored themes of privacy, communication, and visual representation of data.`,
  },
  {
    date: "2017-04-14",
    title: "New Custom Typeface",
    content: `We've completed our custom typeface specifically designed for Crytch. Every character now has exactly 14 anchor points, ensuring consistent encryption behavior across all text. The typeface supports Latin characters, numbers, and common punctuation, including German umlauts and other European characters.`,
  },
  {
    date: "2016-07-17",
    title: "First Public Version",
    content: `Today marks the public release of Crytch! What started as an experiment in visual cryptography has evolved into a fully functional web tool. Create drawings or text, encrypt them with a password, and share the unique URL with friends. They can only decrypt the message with the correct password.`,
  },
  {
    date: "2016-06-28",
    title: "Project Started",
    content: `Crytch began as a student project exploring the intersection of design, privacy, and web technology. The initial concept: what if we could encrypt visual messages in a way that the transformation itself is visually interesting? Rather than turning content into unintelligible noise, we wanted the encrypted form to be its own aesthetic object.`,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <PageWrapper>
      <PageHeader title="Crytch" subtitle="Blog" />

      {blogPosts.map((post, index) => (
        <PageSection key={index}>
          <TextBlock>
            <h4 className="text-sm text-gray-500 mb-1">{formatDate(post.date)}</h4>
            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
            <p className="text-base leading-relaxed">{post.content}</p>
          </TextBlock>
        </PageSection>
      ))}

      <PageFooter>
        <LinkButton href="/" variant="default">Create a message →</LinkButton>
      </PageFooter>
    </PageWrapper>
  );
}
