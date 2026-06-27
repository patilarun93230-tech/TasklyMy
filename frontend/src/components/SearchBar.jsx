import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ value, onChange, placeholder = 'Search by title or description...' }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Debouncing user search keystrokes to minimize server strain
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onChange(searchTerm);
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onChange]);

  // Sync internal state when external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 3,
          boxShadow: 'none',
        },
      }}
    />
  );
};

export default SearchBar;
