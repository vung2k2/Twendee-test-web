// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface User {
  name: {
    title: string;
    first: string;
    last: string;
  };
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  picture: {
    thumbnail: string;
  };
}

interface UserContextProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  fetchUsers: (page: number) => void;
  setCurrentPage: (page: number) => void;
  setUsers: (users: User[]) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageParam = queryParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    pageParam ? parseInt(pageParam) : 1,
  );

  const [users, setUsers] = useState<User[]>([]);
  const totalPages = 10;
  const totalResults = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function fetchUsers(page: number) {
    const storedSortField =
      (localStorage.getItem("sortField") as "name" | "username") || "name";
    const storedSortOrder =
      (localStorage.getItem("sortOrder") as "asc" | "desc") || "asc";

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/?page=${page}&results=${totalResults}`,
    );
    const data = await response.json();

    const sortedUsers = [...data.results].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (storedSortField === "name") {
        aValue = a.name.last.toLowerCase();
        bValue = b.name.last.toLowerCase();
      } else {
        aValue = a.login.username.toLowerCase();
        bValue = b.login.username.toLowerCase();
      }

      if (aValue < bValue) return storedSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return storedSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  }

  return (
    <UserContext.Provider
      value={{
        users,
        currentPage,
        totalPages,
        totalResults,
        fetchUsers,
        setCurrentPage,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
