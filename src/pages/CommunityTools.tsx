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
        <Heading>What can help you today?</Heading>
        <p className="mt-2 max-w-3xl text-gray-600">
          Practical tools for finding services, places, information and ways to participate in Makati.
        </p>

        <div className="mt-7">
          <CommunityToolsGrid />
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-gray-500">Tool status:</span>
            <span className="tool-status tool-status-live">Live</span>
            <span className="tool-status tool-status-researching">Researching</span>
            <span className="tool-status tool-status-planned">Planned</span>
          </div>
          <Link to="/get-involved?type=idea" className="brand-btn-secondary">
            Suggest a tool <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
