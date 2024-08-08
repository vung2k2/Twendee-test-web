// src/features/users/UsersList.tsx
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const UsersList: React.FC = () => {
  const userContext = useContext(UserContext);

  const navigate = useNavigate();

  const [sortField, setSortField] = useState<"name" | "username">(
    (localStorage.getItem("sortField") as "name" | "username") || "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (localStorage.getItem("sortOrder") as "asc" | "desc") || "asc",
  );

  if (!userContext) {
    return <div>Loading...</div>;
  }

  const { users, currentPage, totalPages, setCurrentPage, setUsers } =
    userContext;

  const handlePageChange = (newPage: number) => {
    setUsers([]);
    setCurrentPage(newPage);
    navigate(`?page=${newPage}`);
  };

  function handleSort(field: "name" | "username") {
    const newSortOrder =
      sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    localStorage.setItem("sortField", field);
    localStorage.setItem("sortOrder", newSortOrder);
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedUsers = [...users].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (field === "name") {
        aValue = a.name.last.toLowerCase();
        bValue = b.name.last.toLowerCase();
      } else {
        aValue = a.login.username.toLowerCase();
        bValue = b.login.username.toLowerCase();
      }

      if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  }

  return (
    <div>
      <table className="w-full table-auto border-spacing-4 overflow-hidden rounded-lg shadow-md">
        <thead>
          <tr className="border-b bg-gray-300">
            <th
              className="w-4/12 cursor-pointer p-3 text-left"
              onClick={() => handleSort("name")}
            >
              Full Name{" "}
              {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="w-3/12 cursor-pointer p-3 text-left"
              onClick={() => handleSort("username")}
            >
              Username{" "}
              {sortField === "username"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th className="hidden w-3/12 p-3 text-left md:table-cell">
              Password
            </th>
          </tr>
        </thead>
        <tbody className="animate-loading-delay">
          {users.length
            ? users.map((user, index) => (
                <tr
                  key={user.login.uuid}
                  className={`border border-gray-200 hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} cursor-pointer`}
                >
                  <td className="flex items-center space-x-4 p-2">
                    <img
                      src={user.picture.thumbnail}
                      alt="thumbnail"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>{`${user.name.title} ${user.name.first} ${user.name.last}`}</span>
                  </td>
                  <td className="p-2">{user.login.username}</td>
                  <td className="hidden p-2 md:table-cell">
                    {user.login.password}
                  </td>
                </tr>
              ))
            : Array.from({ length: totalPages }).map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse border border-gray-200"
                >
                  <td className="flex items-center space-x-4 p-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div className="h-4 flex-1 rounded bg-gray-300"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                  </td>
                  <td className="hidden p-2 md:table-cell">
                    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <button
          className={`rounded bg-gray-300 px-4 py-2 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="hidden space-x-2 md:flex">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`rounded px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className={`rounded bg-gray-300 px-4 py-2 ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
