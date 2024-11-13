import { useRouter } from 'next/router';
import Link from 'next/link';

export const ConditionalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <Link href={isHomePage ? '#' : href}>
      <span aria-disabled={isHomePage}>{children}</span>
    </Link>
  );
};
