import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import { Popover } from "antd";

type Person = {
  name: string;
  email: string;
  active: boolean;
  role: string[];
  img: string;
};

const columnHelper = createColumnHelper<Person>();

function AccessManagement() {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [filtering, setFiltering] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [reload, setReload] = React.useState(0);
  const rerender = React.useReducer(() => ({}), {})[1];

  const handleRemove = async (person: Person) => {
    try {
      const response = await axios.delete(`/access-manager/${person?.email}`);
      if (response) {
        console.log("Deleted data:", response?.data);
        setReload((prev: any) => 1 + prev);
      }
    } catch (error) {
      console.error(error);
    }
    // Add remove logic here
  };

  const ActionCell = ({ person }: { person: Person }) => {
    const [popoverVisible, setPopoverVisible] = React.useState(false);
    const [role, setRole] = React.useState<string[]>(person.role || []);
    const handleCancel = () => {
      setPopoverVisible(false);
    };
    console.log(person);
    return (
      <div className="flex gap-2">
        <Popover
          content={
            <div>
              <div className=" flex gap-3 flex-wrap">
                {role?.map((data: string, index: number) => (
                  <>
                    <div key={index}>
                      <div>{data}</div>
                    </div>
                  </>
                ))}
              </div>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          }
          trigger="click"
          open={popoverVisible}
          onOpenChange={(visible) => setPopoverVisible(visible)}
        >
          <button onClick={() => setPopoverVisible(true)}>Modify Roles</button>
        </Popover>
        <button onClick={() => handleRemove(person)}>Remove</button>
      </div>
    );
  };

  const columns = [
    columnHelper.accessor((row) => row, {
      id: "info",
      cell: (info) => (
        <div className="grid grid-cols-2 justify-center items-center">
          <div className="flex gap-2">
            <img
              src={info?.row?.original?.img}
              alt="nothing"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-left">
              <span className="font-medium">{info?.row?.original?.name}</span>{" "}
              <p className="text-gray-400 text-xs">
                {info?.row.original?.email}
              </p>
            </div>
          </div>

          <span className="font-medium text-yellow-500">
            {info.row.original.active ? "" : "Not Logged In"}
          </span>
        </div>
      ),
      header: () => "Name and Email",
    }),
    columnHelper.accessor("role", {
      header: () => "User Role",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info) => <ActionCell person={info.row.original} />,
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      filtering,
      pagination,
    },
    onSortingChange: setSorting,
    onFilteringChange: setFiltering,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    const dataUser = async () => {
      try {
        const response = await axios.get("/access-manager");
        setData(response.data.data_access_management);
      } catch (error) {
        console.log(error);
      }
    };
    dataUser();
  }, [reload]);

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
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
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <div className="h-4" />
      <div>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex - 1)
          }
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex + 1)
          }
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AccessManagement;
