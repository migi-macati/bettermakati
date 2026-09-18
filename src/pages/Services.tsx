import Section from '../components/ui/Section';
import { useParams, Link } from 'react-router';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import * as LucideIcons from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ServicesSection from '../components/home/ServicesSection';
import ServiceSearch from '../components/home/ServiceSearch';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { useState, useEffect } from 'react';

const Services: React.FC = () => {
  const { category } = useParams();
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const subcategories: Subcategory[] = categoryIndex.pages;

  const categoryData = serviceCategories.categories.find(c => c.slug === category);
  const Icon = LucideIcons[
    categoryData?.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  useEffect(() => {
    if (category && categoryData) {
      setLoading(true);
      getCategorySubcategories(category)
        .then(setCategoryIndex)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category, categoryData]);

  if (!category) {
    return (
      <>
        <SEO
          title="Services"
          description="Makati City public-service information."
          keywords="Makati services, permits, health, education, social services, property"
        />
        <Section className="bg-[#f5f8f2]">
          <div className="max-w-3xl mx-auto">
            <div className="section-eyebrow">Services</div>
            <Heading>What do you need?</Heading>
            <Text className="text-gray-600 mb-6">Search by service, document, benefit or task.</Text>
            <ServiceSearch scope="services" />
          </div>
        </Section>
        <ServicesSection
          title="Browse by category"
          description="Permits, health, education, social services, property and land-use information."
        />
        <Section className="bg-[#fffdf8]">
          <div className="section-eyebrow">Digital Makati</div>
          <Heading level={2}>City apps & portals</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <a
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
            >
              <h3 className="font-extrabold text-gray-950">Official Makati Web Portal</h3>
              <p className="text-sm text-gray-600 mt-1">Official city information, forms and announcements.</p>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=project.smsgt.makaapp&hl=en"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
            >
              <h3 className="font-extrabold text-gray-950">Makatizen App</h3>
              <p className="text-sm text-gray-600 mt-1">Makati City mobile app.</p>
            </a>
          </div>
        </Section>
      </>
    );
  }

  if (!categoryData) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title="Category not found"
          description="The category you are looking for does not exist."
          icon
        />
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category}
        description={categoryData.description}
        keywords={`${categoryData.category}, Makati City services`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        {Icon && <Icon className="h-8 w-8 mb-4 text-primary-600 rounded-md" />}
        <Heading>{categoryData.category}</Heading>
        <Text className="text-gray-600 mb-6">{categoryData.description}</Text>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Text>Loading services...</Text>
          </div>
        ) : subcategories.length === 0 ? (
          <Banner
            type="info"
            title="No services listed"
            description="Choose another service category."
          />
        ) : (
          <div className={categoryIndex.layout === 'grid'
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'}>
            {subcategories.map(subcategory => (
              <Link
                key={subcategory.slug}
                to={`/services/${category}/${subcategory.slug}`}
              >
                <Card hoverable className="mb-4 h-full">
                  <CardContent>
                    <h4 className="text-lg font-medium text-gray-900">
                      {subcategory.name}
                    </h4>
                    {subcategory.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {subcategory.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default Services;
