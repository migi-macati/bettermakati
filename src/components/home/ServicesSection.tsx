import Section from '../ui/Section';
import * as LucideIcons from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { serviceCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

export default function ServicesSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();

  const getIcon = (category: string) => {
    const IconComponent = LucideIcons[
      category as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  const displayedCategories = serviceCategories.categories as Category[];

  return (
    <Section className="bg-[#fffdf8]">
      <div className="section-eyebrow">Services</div>
      <Heading level={2}>{title || t('services.title')}</Heading>
      <Text className="text-gray-600 mb-7">
        {description || t('services.description')}
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedCategories.map(category => (
          <Link key={category.slug} to={`/services/${category.slug}`} className="category-card">
            <div className="category-card-icon">{getIcon(category.icon)}</div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-950">{category.category}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{category.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary-600 ml-auto shrink-0" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
