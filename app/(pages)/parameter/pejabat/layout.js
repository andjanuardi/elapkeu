import Breadcrumbs from "@/app/components/breadcrumbs";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <Breadcrumbs parentId={1} childId={1} />
      <div className="rounded bg-base-200 inset-shadow-sm p-4 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
