import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl animate-fade-in">
          <Text transform="uppercase">Independent civic portal</Text>
          <Heading>{t('site_name')}</Heading>
          <Text>{t('hero.subtitle')}</Text>
        </div>
      </div>
    </div>
  );
}
