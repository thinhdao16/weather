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
import { CiCirclePlus, CiCircleRemove } from "react-icons/ci";
import { data_role } from "../mocks/data/data_role";
import { useVirtualizer } from "@tanstack/react-virtual";

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

  };

  const getButtonClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-green-900 text-white';
      case 'Auditor':
        return 'bg-green-700 text-white';
      case 'Manager':
        return 'bg-yellow-700 text-white';
      case 'User':
        return 'bg-yellow-400 text-black';
      default:
        return '';
    }
  };

  const RoleCell = ({ role }: { role: Person }) => {

    return (
      <div className="flex flex-wrap gap-3">
        {
          role?.role?.map((data: string, index: number) => (
            <div key={index}>
              <button className={`px-1 py-0.5 text-xs rounded-sm ${getButtonClass(data)}`}>
                {data}
              </button>
            </div>
          ))
        }
      </div>
    )
  }

  const ActionCell = ({ person }: { person: Person }) => {
    const [popoverVisible, setPopoverVisible] = React.useState(false);
    const [role, setRole] = React.useState<string[]>(person.role || []);
    const [dataRole, setDataRole] = React.useState<any>([])

    const handleCancel = () => {
      setPopoverVisible(false);
    };
    function addItem(itemToAdd: string) {
      const updatedTourTag = [...role, itemToAdd];
      setRole(updatedTourTag);
      const updatedDataTag = dataRole.filter(
        (item: string) => item !== itemToAdd
      );
      setDataRole(updatedDataTag);
    }
    function removeItem(idToRemove: string) {
      console.log(idToRemove);
      const updatedTourTag = role.filter(
        (item: string) => item !== idToRemove
      );
      setRole(updatedTourTag);
      const updatedDataTag = [...dataRole, idToRemove];
      setDataRole(updatedDataTag);
    }
    const handleUpdate = async () => {
      try {
        const email = person?.email
        const putResponse = await axios.put("/access-manager-role", JSON.stringify({ role, email }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        setReload((prev) => prev + 1)
        console.log("Put response:", putResponse?.data);
      } catch (error) {
        console.log(error)
      }
    }
    React.useEffect(() => {
      const updatedRole = data_role.filter(
        (dataItem: string) =>
          !person?.role?.some(
            (data_person_role) => data_person_role === dataItem
          )
      )
      setDataRole(updatedRole)
    }, [data_role])

    return (
      <div className="flex gap-2">
        <Popover
          content={
            <div className="m-3">
              <span className="font-medium">Role recent</span>
              <div className=" flex gap-5 flex-wrap my-3">
                {role?.map((data: string, index: number) => (
                  <div key={index}>
                    <button className={`px-1 py-0.5 text-xs rounded-sm relative ${getButtonClass(data)}`} onClick={() => removeItem(data)}>
                      <CiCircleRemove className="absolute top-[-9px] right-[-10px] text-black" />
                      {data}
                    </button>
                  </div>
                ))}
              </div>
              <span className="font-medium">Add more</span>
              <div className=" flex gap-5 flex-wrap my-3">
                {dataRole?.map((data: string, index: number) => (
                  <div key={index}>
                    <button className={`px-1 py-0.5 text-xs rounded-sm relative ${getButtonClass(data)}`} onClick={() => addItem(data)}>
                      <CiCirclePlus className="absolute top-[-9px] right-[-10px] text-black" />
                      {data}
                    </button>
                  </div>
                ))}
              </div>
              <div>

              </div>
              <div className="flex">
                <button className="bg-green-700 text-white rounded-sm p-1 " onClick={handleCancel}>Cancel</button>
                <button className="bg-blue-700 text-white rounded-sm px-1" onClick={handleUpdate}>Save</button>
              </div>


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
          <div className="text-left">
          <span className="font-medium text-yellow-500">
            {info.row.original.active ? "" : "Not Logged In"}
          </span>
          </div>
          
        </div>
      ),
      header: () => "Name",
    }),
    columnHelper.accessor("role", {
      header: () => "User Role",
      cell: (info) => <RoleCell role={info.row.original} />,
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
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 5,
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
    <div className="px-32 py-10 bg-stone-100">
      <div ref={parentRef} className="overflow-y-auto" style={{ maxHeight: '400px' }}>
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md shadow-xl">
        <thead className=" ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <td key={header.id} className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider ">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </td>
              ))}
            </tr>
          ))}
           <tr>
            <td colSpan={columns.length} className="px-6 py-3 text-sm  text-gray-500 bg-stone-50 text-left">
             Showing {table.getRowModel().rows.length} of {table.getRowModel().rows.length} total Users
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
      {/* <div className="flex items-center justify-between">
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
      </div> */}
    </div>
  );
}

export default AccessManagement;
