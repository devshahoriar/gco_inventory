import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <>
      <Navbar title={title} />
      <div className="container pt-4 md:pt-8 pb-8 px-2 sm:px-8 print:w-full print:!p-0 print:px-0 print:min-w-full">{children}</div>
    </>
  );
}
