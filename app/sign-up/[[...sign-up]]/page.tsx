import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SignUp path="/sign-up" appearance={{
        elements: {
          formButtonPrimary: 'bg-[#FF8800] hover:bg-[#E07000] text-sm normal-case',
          card: 'shadow-2xl shadow-black/10 dark:bg-card dark:border dark:border-border',
          headerTitle: 'text-primary dark:text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'dark:border-border dark:bg-muted dark:hover:bg-muted/80',
          socialButtonsBlockButtonText: 'font-semibold dark:text-foreground',
          formFieldLabel: 'dark:text-foreground',
          formFieldInput: 'dark:bg-muted dark:border-border dark:text-foreground',
          footerActionLink: 'text-[#FF8800] hover:text-[#E07000]',
        }
      }} />
    </div>
  );
}
