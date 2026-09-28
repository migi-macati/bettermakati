import { Navigate, useLocation } from 'react-router';

interface CompatibilityRedirectProps {
  to: string;
}

export default function CompatibilityRedirect({
  to,
}: CompatibilityRedirectProps) {
  const location = useLocation();

  return (
    <Navigate
      to={to + location.search + location.hash}
      replace
    />
  );
}
