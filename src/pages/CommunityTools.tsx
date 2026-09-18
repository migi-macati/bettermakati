import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import CommunityToolsGrid from '../components/community/CommunityToolsGrid';
import SEO from '../components/SEO';

export default function CommunityTools() {
  return (
    <>
      <SEO
        title="Community Tools"
        description="Community-built civic tools for Makati."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Community Tools</div>
        <Heading>Useful tools for everyday Makati</Heading>
        <div className="mt-8">
          <CommunityToolsGrid />
        </div>
        <div className="mt-8">
          <Link to="/get-involved" className="brand-btn-secondary">
            Suggest a tool <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
