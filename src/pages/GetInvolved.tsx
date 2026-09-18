import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  Bug,
  Database,
  ExternalLink,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { communityTools } from '../data/communityTools';

const actionCards = [
  {
    type: 'idea',
    title: 'Suggest an idea',
    description: 'Propose a civic tool, feature or improvement.',
    icon: Lightbulb,
  },
  {
    type: 'source',
    title: 'Share a source',
    description: 'Send a public record, dataset or useful official link.',
    icon: Database,
  },
  {
    type: 'correction',
    title: 'Report a correction',
    description: 'Flag information that is wrong, stale or incomplete.',
    icon: Bug,
  },
  {
    type: 'volunteer',
    title: 'Volunteer',
    description: 'Offer research, data, design or development help.',
    icon: HeartHandshake,
  },
];

export default function GetInvolved() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'idea';
  const initialTool = searchParams.get('tool') || '';

  const [type, setType] = useState(initialType);
  const [tool, setTool] = useState(initialTool);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [barangay, setBarangay] = useState('');

  useEffect(() => {
    setType(searchParams.get('type') || 'idea');
    setTool(searchParams.get('tool') || '');
  }, [searchParams]);

  const issueUrl = useMemo(() => {
    const label =
      type === 'source'
        ? 'Source'
        : type === 'correction'
          ? 'Correction'
          : type === 'volunteer'
            ? 'Volunteer'
            : 'Idea';

    const selectedTool = communityTools.find(item => item.id === tool)?.name;

    const body = [
      selectedTool ? `Community tool: ${selectedTool}` : '',
      barangay ? `Barangay / area: ${barangay}` : '',
      sourceUrl ? `Source / URL: ${sourceUrl}` : '',
      '',
      details,
    ]
      .filter((line, index, lines) => line || (index > 0 && index < lines.length - 1))
      .join('\n');

    const params = new URLSearchParams({
      title: `[${label}] ${subject || 'BetterMakati submission'}`,
      body,
    });

    return `https://github.com/migi-macati/bettermakati/issues/new?${params.toString()}`;
  }, [barangay, details, sourceUrl, subject, tool, type]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  };

  const chooseType = (value: string) => {
    setType(value);
    const next = new URLSearchParams(searchParams);
    next.set('type', value);
    if (tool) next.set('tool', tool);
    setSearchParams(next);
    document.getElementById('submission')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Get Involved"
        description="Suggest ideas, share sources, report corrections or volunteer for BetterMakati."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Get Involved</div>
        <Heading>Help improve BetterMakati</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
          {actionCards.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                type="button"
                onClick={() => chooseType(action.type)}
                className="text-left rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="font-bold text-gray-950 mt-4">{action.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section id="submission" className="bg-[#f5f8f2]">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow">Submission</div>
          <Heading>Send something to BetterMakati</Heading>

          <form onSubmit={submit} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="form-field">
                <span>Submission type</span>
                <select value={type} onChange={event => setType(event.target.value)}>
                  <option value="idea">Idea</option>
                  <option value="source">Source / data</option>
                  <option value="correction">Correction</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </label>

              <label className="form-field">
                <span>Community tool</span>
                <select value={tool} onChange={event => setTool(event.target.value)}>
                  <option value="">General / not specific</option>
                  {communityTools.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>

              <label className="form-field md:col-span-2">
                <span>Subject</span>
                <input
                  required
                  value={subject}
                  onChange={event => setSubject(event.target.value)}
                  placeholder="Short title"
                />
              </label>

              <label className="form-field md:col-span-2">
                <span>Details</span>
                <textarea
                  required
                  rows={7}
                  value={details}
                  onChange={event => setDetails(event.target.value)}
                  placeholder="Describe the idea, source, correction or offer to help."
                />
              </label>

              <label className="form-field">
                <span>Source / URL</span>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={event => setSourceUrl(event.target.value)}
                  placeholder="https://"
                />
              </label>

              <label className="form-field">
                <span>Barangay / area</span>
                <input
                  value={barangay}
                  onChange={event => setBarangay(event.target.value)}
                  placeholder="Optional"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="brand-btn-primary">
                Continue on GitHub <ExternalLink className="h-4 w-4" />
              </button>
              <a href="tel:911" className="text-sm text-red-700 font-semibold">
                Emergency? Call 911
              </a>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}
