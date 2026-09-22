import { ExternalLink, Mail, MessageCircle, PhoneCall } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Contact BetterMakati or find official Makati City contact channels."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Contact</div>
        <Heading>Get in touch</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <MessageCircle className="h-6 w-6 text-primary-700" />
            <h2 className="font-bold text-lg mt-4">BetterMakati</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <a
                  href="mailto:hello@bettermakati.org"
                  className="inline-flex items-center gap-2 font-semibold text-primary-700 underline underline-offset-2"
                >
                  <Mail className="h-4 w-4" />
                  hello@bettermakati.org
                </a>
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-2">
                <a
                  href="https://www.facebook.com/bettermakati"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary-700 underline underline-offset-2"
                >
                  Facebook @bettermakati <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/bettermakati/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary-700 underline underline-offset-2"
                >
                  Instagram @bettermakati <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </p>
              <p>
                <Link
                  to="/get-involved?type=contact#submission"
                  className="font-semibold text-primary-700 underline underline-offset-2"
                >
                  Structured contact form
                </Link>
              </p>
              <p>
                <Link to="/get-involved" className="font-semibold text-primary-700 underline underline-offset-2">
                  Corrections, sources & volunteering
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <PhoneCall className="h-6 w-6 text-primary-700" />
            <h2 className="font-bold text-lg mt-4">City Government of Makati</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p><a className="text-primary-700 underline" href="tel:+63288701000">8870-1000</a></p>
              <p><a className="text-primary-700 underline" href="mailto:makati@makati.gov.ph">makati@makati.gov.ph</a></p>
              <p>
                <a
                  className="text-primary-700 underline"
                  href="https://www.makati.gov.ph/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Makati City Web Portal
                </a>
              </p>
              <p><Link className="text-primary-700 underline" to="/hotlines">Hotlines</Link></p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
