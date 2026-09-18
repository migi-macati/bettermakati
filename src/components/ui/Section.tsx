import { cn } from '../../lib/utils';

export default function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cn('py-12 md:py-14', className)} id={id}>
      <div className="container mx-auto px-5 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}
