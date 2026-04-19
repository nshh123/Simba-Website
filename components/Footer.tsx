import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Created by @nsam
        </p>
      </div>
    </footer>
  );
}
