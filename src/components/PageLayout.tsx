interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return <div className="my-8 px-4 md:px-[10%] lg:px-[20%]">{children}</div>;
};

export default PageLayout;
