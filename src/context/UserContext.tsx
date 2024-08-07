// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

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
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 10;
  const totalResults = 10;
  const fetchUsers = async (page: number) => {
    const response = await fetch(
      `https://randomuser.me/api/?page=${page}&results=${totalResults}`,
    );
    const data = await response.json();
    setUsers(data.results);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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
