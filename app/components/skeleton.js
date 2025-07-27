export function SkeletonTable() {
  const temp = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr className="bg-base-200 text-black">
              <th className="w-20">
                <div className="skeleton h-8 w-full"></div>
              </th>
              <th>
                <div className="skeleton h-8 w-full"></div>
              </th>
              <th className="w-50">
                <div className="skeleton h-8 w-full"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {temp.map((item, key) => (
              <tr key={key}>
                <td>
                  <div className="skeleton h-8 w-full"></div>
                </td>
                <td>
                  <div className="skeleton h-8 w-full"></div>
                </td>
                <td>
                  <div className="skeleton h-8 w-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-5 ">
        <div className="skeleton h-8 w-40"></div>
        <div className="flex-1"></div>
        <div className="skeleton h-8 w-60"></div>
      </div>
    </div>
  );
}
