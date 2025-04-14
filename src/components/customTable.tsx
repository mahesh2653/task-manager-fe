"use client";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

interface TableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  title?: string;
  addData?: () => void;
  buttonName?: string;
  renderActions?: (row: T) => React.ReactNode;
}

const CustomTable = <T,>({
  columns,
  data,
  title,
  addData,
  buttonName,
  renderActions,
}: TableProps<T>) => {
  const allColumns: ColumnDef<T, any>[] = renderActions
    ? [
        ...columns,
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => renderActions(row.original),
        },
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-10 border-2 border-gray-200 rounded-md">
      <div className="flex justify-between items-center mb-4">
        {title && (
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {title}
          </h1>
        )}
        {addData && (
          <button
            onClick={addData}
            className="text-white bg-blue-500 cursor-pointer hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            {buttonName ?? "Add"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-extrabold text-gray-700 border-b border-gray-400"
                  >
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${
                    row.index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm text-gray-600 border-b"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="px-4 py-2 text-center font-bold text-sm text-gray-500"
                >
                  * No task available *
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
