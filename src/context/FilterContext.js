// src/context/FilterContext.js
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function useFilters() {
  return useContext(FilterContext);
}

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    type: [],
    genre: [],
  });

  const updateFilters = (filterType, value) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterType];
      if (currentValues.includes(value)) {
        return {
          ...prevFilters,
          [filterType]: currentValues.filter((item) => item !== value),
        };
      }
      return {
        ...prevFilters,
        [filterType]: [...currentValues, value],
      };
    });
  };

  const value = {
    filters,
    updateFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}