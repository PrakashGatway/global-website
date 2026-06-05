import React from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    IconButton,
} from "@mui/material";

// MUI Icons
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationPinIcon from '@mui/icons-material/LocationPin'; // Using MUI Close icon for better integration

export default function ProgramHeader({ searchQuery, setSearchQuery }) {
    return (
        <Box
            sx={{
                border: "2px solid #f26d44",
                borderRadius: "14px",
                p: 3,
                background: "#fff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
        >
            <Grid container spacing={2.5} alignItems="flex-end">

                {/* ================= SEARCH PROGRAMS ================= */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            mb: 1,
                            color: "#1f2937",
                        }}
                    >
                        Search Programs
                    </Typography>

                    <TextField
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, university..."
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: 48,
                                background: "#F3F4F6",
                                borderRadius: "8px",
                                transition: "all 0.2s ease-in-out",

                                // Adjust padding so text doesn't hit icons
                                "& .MuiInputBase-input": {
                                    paddingLeft: "5px !important",
                                    paddingRight: searchQuery ? "5px !important" : "14px !important",
                                },

                                "& fieldset": {
                                    borderColor: "#e5e7eb",
                                    borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#f26d44",
                                    borderWidth: "1px",
                                },
                                "&.Mui-focused": {
                                    background: "#fff",
                                    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.1)",
                                    "& fieldset": {
                                        borderColor: "#f26d44",
                                        borderWidth: "2px",
                                    },
                                },
                            },
                        }}
                        InputProps={{
                            // Left Icon (Search)
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        position: "absolute",
                                        left: "12px",
                                        zIndex: 1,
                                        pointerEvents: "none",
                                    }}
                                >
                                    <SearchIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                                </InputAdornment>
                            ),

                            // Right Icon (Clear X)
                            endAdornment: searchQuery && (
                                <InputAdornment
                                    position="end"
                                    sx={{
                                        position: "absolute",
                                        right: "8px",
                                        pointerEvents: "auto",
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchQuery("")}
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            padding: 0,
                                            color: "#6b7280",
                                            "&:hover": {
                                                background: "rgba(0,0,0,0.08)",
                                                color: "#ef4444",
                                            },
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* ================= INTAKE ================= */}
                <Grid item xs={12} sm={6} md={1}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#1f2937" }}>
                        Intake
                    </Typography>
                    {/* <TextField
                        fullWidth
                        select
                        value=""
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: 48,
                                width: "200px",
                                background: "#F3F4F6",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e5e7eb" },
                                "&:hover fieldset": { borderColor: "#2563EB" },
                                "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarMonthOutlinedIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="">All Intakes</MenuItem>
                        <MenuItem value="jan">January</MenuItem>
                        <MenuItem value="feb">February</MenuItem>
                    </TextField> */}
                    <MultipleSelectCheckmarks/>
                </Grid>

                {/* ================= YEAR ================= */}
                <Grid item xs={12} sm={6} md={1.5}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#1f2937" }}>
                        Year
                    </Typography>
                    <TextField
                        fullWidth
                        select
                        value=""
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: 48,
                                width: "100px",

                                background: "#F3F4F6",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e5e7eb" },
                                "&:hover fieldset": { borderColor: "#f26d44" },
                                "&.Mui-focused fieldset": { borderColor: "#f26d44" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarMonthOutlinedIcon sx={{ color: "#f26d44", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                    </TextField>
                </Grid>

                {/* ================= NATIONALITY ================= */}
                <Grid item xs={12} sm={6} md={2}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#1f2937" }}>
                        Nationality
                    </Typography>
                    <TextField
                        fullWidth
                        select
                        value=""
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: 48,
                                width: "200px",

                                background: "#F3F4F6",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e5e7eb" },
                                "&:hover fieldset": { borderColor: "#f26d44" },
                                "&.Mui-focused fieldset": { borderColor: "#f26d44" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FlagOutlinedIcon sx={{ color: "#f26d44", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="in">India</MenuItem>
                        <MenuItem value="us">USA</MenuItem>
                    </TextField>
                </Grid>

                {/* ================= STATE ================= */}
                <Grid item xs={12} sm={6} md={2}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#1f2937" }}>
                        State
                    </Typography>
                  <div className="relative">
  <LocationPinIcon
    style={{
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#f26d44",
      zIndex: 1,
    }}
  />

  <TextField
    fullWidth
    select
    value=""
    placeholder="Search by name, university..."

    SelectProps={{
      displayEmpty: true,
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: 48,
        width: "200px",
        background: "#F3F4F6",
        borderRadius: "8px",
      },

      "& .MuiSelect-select": {
        paddingLeft: "40px",
      },
    }}
  >
    <MenuItem value="" disabled >
      Select State
    </MenuItem>

    <MenuItem value="dl">Delhi</MenuItem>
    <MenuItem value="mh">Maharashtra</MenuItem>
    <MenuItem value="up">Uttar Pradesh</MenuItem>
  </TextField>
</div>
                </Grid>

                {/* ================= SEARCH BUTTON ================= */}
                <Grid item xs={12} sm={12} md={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        endIcon={<SearchIcon />}
                        sx={{
                            height: 48,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            mt:"25px",
                            fontSize: "16px",
                            background: "#f26d44",
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                            "&:hover": {
                                background: "#f26d44", // Fixed hover color (was orange)
                                boxShadow: "0 6px 8px -1px rgba(37, 99, 235, 0.3)",
                            },
                        }}
                    >
                        Search
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
}

import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const MultipleSelectCheckmarks =() => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{  width: 200 , height: 100}}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
