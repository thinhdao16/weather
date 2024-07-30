import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
  role: 'admin' | 'user' | 'manager' | 'auditor';
};

const defaultData: Person[] = [
  {
    firstName: 'Tanner',
    lastName: 'Linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    role: 'admin',
  },
  {
    firstName: 'Tandy',
    lastName: 'Miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    role: 'user',
  },
  {
    firstName: 'Joe',
    lastName: 'Dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    role: 'manager',
  },
  {
    firstName: 'Sara',
    lastName: 'Connor',
    age: 34,
    visits: 60,
    status: 'Engaged',
    progress: 70,
    role: 'auditor',
  },
];

const columnHelper = createColumnHelper<Person>();

const RoleCell = ({ role }: { role: string }) => {
  const getButtonClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-500 text-white';
      case 'user':
        return 'bg-gray-500 text-white';
      case 'manager':
        return 'bg-red-500 text-white';
      case 'auditor':
        return 'bg-yellow-500 text-black';
      default:
        return '';
    }
  };

  return (
    <button className={`px-4 py-2 rounded ${getButtonClass(role)}`}>
      {role}
    </button>
  );
};

const columns = [
  columnHelper.accessor('firstName', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
    header: () => 'First Name',
  }),
  columnHelper.accessor('lastName', {
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: info => <RoleCell role={info.getValue()} />,
    footer: info => info.column.id,
  }),
];

function AccessManagement() {
  const [data, setData] = React.useState(() => [...defaultData]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div className="p-2">
      <div ref={parentRef} className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md shadow-xl">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={columns.length} className="px-6 py-2 text-sm text-gray-700 bg-gray-50">
                Number of users: {table.getRowModel().rows.length}
              </td>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <div className="h-4" />
      <div className="flex items-center justify-between">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessManagement;
