import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  IconButton,
  Drawer,
  Divider,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  Autocomplete,
} from "@mui/material";

// MUI Icons
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import WorkIcon from "@mui/icons-material/Work";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClearIcon from "@mui/icons-material/Clear";
import { useGlobal } from "@/src/statecontext";

export default function ProgramFilters({
  filters,
  handleFilterChange,
  clearFilters,
  getActiveFilterCount,
  countries,
  universities,
  categories,
  studyModes,
  levels,
  showFilters,
  setShowFilters,
  isCleared,
  setIsCleared
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { allProfile } = useGlobal()

  console.log("Profile Category:", allProfile?.profile?.preferences?.preferredCourse?.[0]);
  console.log("Categories:", categories);

  const selectedLevel =
  isCleared ? "" :
    filters.level ||
    levels?.find(
      item =>
        item.label?.toLowerCase() ===
        allProfile?.profile?.preferences?.level?.toLowerCase()
    )?.value;

  // Reusable MUI Select Component for Filters
  const FilterSelect = ({ label, icon, options, value, onChange, placeholder }) => {
    // Find the selected option object
    const selectedOption = options?.find(opt => opt.value === value) || null;

    return (
      <FormControl fullWidth size="small">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {icon}
          <Typography variant="caption" fontWeight={500} sx={{ color: "#374151" }}>
            {label}
          </Typography>
        </Box>
        <Autocomplete
          size="small"
          options={options || []}
          getOptionLabel={(option) => option.label || ""}
          value={selectedOption}
          onChange={(event, newValue) => {
            onChange(newValue ? newValue.value : "");
          }}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          disableClearable={false}
          clearOnEscape
          freeSolo={false}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f26d44",
                    }
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f26d44",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e5e7eb",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                  padding: "8.5px 14px",
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Box sx={{ color: "#f26d44", display: "flex", alignItems: "center" }}>
                {icon}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {option.label}
                </Typography>
              </Box>
            </li>
          )}
          ListboxProps={{
            sx: {
              maxHeight: 300,
              "& .MuiAutocomplete-option": {
                padding: "8px 12px",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                },
                "&[aria-selected='true']": {
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                },
              },
            },
          }}
          sx={{
            "& .MuiAutocomplete-clearIndicator": {
              color: "#6b7280",
              "&:hover": {
                color: "#f26d44",
              },
            },
          }}
        />
      </FormControl>
    );
  };
  // Filter Content (Reusable for both Desktop & Mobile)
  const FilterContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(to right, rgba(37,99,235,0.05), transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} display="flex" alignItems="center" gap={1}>
          <FilterListIcon sx={{ color: "#f26d44", fontSize: 18 }} />
          Filter Programs
        </Typography>
        {isMobile && (
          <IconButton size="small" onClick={() => setShowFilters(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Filters Body */}
      <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>

        {/* Country Filter */}
        <FilterSelect
          label="Country"
          icon={<PublicIcon fontSize="small" />}
          options={countries}
          value={ isCleared ? "" :
            filters.country ||
            countries?.find(
              item =>
                item.label?.toLowerCase() ===
                allProfile?.profile?.preferences?.preferredCountries?.[0]?.toLowerCase()
            )?.value ||
            ""
          }
          onChange={(value) => {
            setIsCleared(false);
            handleFilterChange("country", value)}}
          placeholder="Select country"
        />

        {/* University Filter */}
        <FilterSelect
          label="University"
          icon={<SchoolIcon fontSize="small" />}
          options={universities}
          value={filters.university}
          onChange={(value) => handleFilterChange("university", value)}
          placeholder="Select university"
        />

        {/* Category Filter */}
        <FilterSelect
          label="Category"
          icon={<CategoryIcon fontSize="small" />}
          options={categories}
          value={isCleared ? "" :
            filters.category ||
            categories?.find(
              item =>
                item.label?.toLowerCase() ===
                allProfile?.profile?.preferences?.preferredCourse?.[0]?.toLowerCase()
            )?.value ||
            ""
          }
          onChange={(value) => {
            setIsCleared(false);
            handleFilterChange("category", value)}}
          placeholder="Select category"
        />

        {/* Study Mode Filter */}
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <WorkIcon fontSize="small" sx={{ color: "#6b7280" }} />
            Study Mode
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {studyModes.map((mode) => (
              <Button
                key={mode.value}
                size="small"
                variant={filters.studyMode === mode.value ? "contained" : "outlined"}
                onClick={() => handleFilterChange("studyMode", filters.studyMode === mode.value ? "" : mode.value)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                  ...(filters.studyMode !== mode.value && {
                    borderColor: "#e5e7eb",
                    color: "#374151",
                    "&:hover": { borderColor: "#f26d44", backgroundColor: "rgba(37,99,235,0.04)" },
                  }),
                }}
              >
                {mode.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Level Filter */}
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <MenuBookIcon fontSize="small" sx={{ color: "#6b7280" }} />
            Program Level
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {levels.map((level) => (
              <Chip
                key={level.value}
                label={level.label}
                size="small"
                onClick={() => handleFilterChange("level", filters.level === level.value ? "" : level.value)}
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  ...(selectedLevel === level.value
                    ? {
                      backgroundColor: "rgba(37,99,235,0.1)",
                      color: "#f26d44",
                      border: "1px solid #f26d44",
                      "&:hover": { backgroundColor: "rgba(37,99,235,0.15)" },
                    }
                    : {
                      backgroundColor: "#F9FAFB",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      "&:hover": { borderColor: "#f26d44", backgroundColor: "rgba(37,99,235,0.04)" },
                    }),
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, color: "#6b7280" }}>
              Active Filters
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filters.country && (
                <Chip
                  size="small"
                  label={countries.find((c) => c.value === filters.country)?.label || filters.country}
                  onDelete={() => handleFilterChange("country", "")}
                  deleteIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    backgroundColor: "rgba(37,99,235,0.1)",
                    color: "#f26d44",
                    fontWeight: 500,
                    fontSize: "12px",
                    "& .MuiChip-deleteIcon": { color: "#f26d44ca", "&:hover": { color: "#f26d44" } },
                  }}
                />
              )}
              {filters.studyMode && (
                <Chip
                  size="small"
                  label={filters.studyMode}
                  onDelete={() => handleFilterChange("studyMode", "")}
                  deleteIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    backgroundColor: "rgba(37,99,235,0.1)",
                    color: "#f26d44",
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                />
              )}
              {filters.level && (
                <Chip
                  size="small"
                  label={filters.level}
                  onDelete={() => handleFilterChange("level", "")}
                  deleteIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    backgroundColor: "rgba(37,99,235,0.1)",
                    color: "#f26d44",
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(0,0,0,0.02)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          color="inherit"
          onClick={clearFilters}
          startIcon={<ClearIcon fontSize="small" />}
          sx={{ textTransform: "none", fontWeight: 500, color: "#6b7280", "&:hover": { color: "#1f2937" } }}
        >
          Clear all
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => isMobile && setShowFilters(false)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "#f26d44",
            "&:hover": { backgroundColor: "#f26d44" },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar (Always Visible on LG+) */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "320px",
          flexShrink: 0,
          position: "sticky",
          top: "16px",
          zIndex: 30,
        }}
      >
        <Box
          sx={{
            border: "1px solid #494938",
            background: "#fff",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)",
            overflow: "hidden",
            maxHeight: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FilterContent />
        </Box>
      </Box>

      {/* Mobile: Filter Button + Drawer */}
      <Box sx={{ display: { xs: "block", lg: "none" }, width: "100%" }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setShowFilters(true)}
          startIcon={<FilterListIcon />}
          endIcon={
            getActiveFilterCount() > 0 ? (
              <Box
                component="span"
                sx={{
                  backgroundColor: "#fff",
                  color: "#f26d44",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  ml: 0.5,
                }}
              >
                {getActiveFilterCount()}
              </Box>
            ) : null
          }
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#f26d44",
            "&:hover": { backgroundColor: "#f26d44" },
            justifyContent: "space-between",
          }}
        >
          Filters
        </Button>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={showFilters}
          onClose={() => setShowFilters(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 320,
              borderLeft: "none",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            },
          }}
        >
          <FilterContent />
        </Drawer>
      </Box>
    </>
  );
}