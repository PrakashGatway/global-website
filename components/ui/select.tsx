import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown,ChevronUp, X, Check } from "lucide-react"
import * as Select from '@radix-ui/react-select';
const AmazingSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option...",
  label,
  icon: Icon,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  className = ""
}:any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const selectRef = useRef(null)
  const searchInputRef = useRef(null)
  const optionsRef = useRef([])

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery?.toLowerCase())
  )

  // Get display value
  const selectedOption = options.find(opt => opt.value === value)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions.length])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value)
          setIsOpen(false)
          setSearchQuery("")
        }
        break
      case "Escape":
        setIsOpen(false)
        setSearchQuery("")
        break
    }
  }

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      })
    }
  }, [highlightedIndex, isOpen])

  return (
    <div className={`relative ${className}`} ref={selectRef}>


      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full relative flex items-center justify-between
          px-4 py-2.5 text-left
          border-1 border-gray-300
          rounded-lg
          hover:border-gray-300 dark:hover:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-200
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
          ${selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}
        `}
      >
        <div className="flex items-center gap-3 truncate">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute z-50 w-full mt-2
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                rounded-xl shadow-xl
                overflow-hidden
              `}
              style={{
                transformOrigin: 'top',
                maxHeight: 'min(400px, calc(100vh - 100px))'
              }}
            >
              {/* Search Input */}
              <div className="relative border-b border-gray-200 dark:border-gray-700">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="
                    w-full pl-10 pr-10 py-3.5
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none
                    text-sm
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      p-1 rounded-full
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-colors
                    "
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Options List */}
              <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                {filteredOptions.length > 0 ? (
                  <div className="p-1.5">
                    {filteredOptions.map((option, index) => (
                      <motion.button
                        key={option.value}
                        ref={el => optionsRef.current[index] = el}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          onChange(option.value)
                          setIsOpen(false)
                          setSearchQuery("")
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`
                          w-full flex items-center justify-between
                          px-3 py-2.5 rounded-lg
                          text-sm text-left
                          transition-all duration-150
                          ${value === option.value 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                            : highlightedIndex === index
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {value === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {emptyMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredOptions.length} options
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    px-3 py-1.5 text-xs
                    text-gray-600 dark:text-gray-400
                    hover:text-gray-900 dark:hover:text-gray-200
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    rounded-lg transition-colors
                  "
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


export default AmazingSelect





export const ModernSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  label,
  searchable = true,
  className = "",
}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter Options
  const filteredOptions = useMemo(() => {
    return options.filter((option: any) =>
      option?.label?.toLowerCase()?.includes(debouncedSearch?.toLowerCase())
    );
  }, [options, debouncedSearch]);

  const selectedOption = options.find(
    (opt: any) => opt.value === value
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}

      <Select.Root
        value={value || ""}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger
          className="
            inline-flex items-center justify-between
            w-full px-4 py-2.5
            border border-gray-300 dark:border-gray-800
            rounded-lg
            text-sm
            hover:bg-gray-50 dark:hover:bg-gray-800/50
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            transition-all duration-200
          "
        >
          <Select.Value placeholder={placeholder}>
            {selectedOption?.label}
          </Select.Value>

          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="
              z-50
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-lg
              shadow-xl
              overflow-hidden
              w-[var(--radix-select-trigger-width)]
            "
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-900">
              <ChevronUp className="w-4 h-4" />
            </Select.ScrollUpButton>

            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Search..."
                    className="
                      w-full pl-9 pr-8 py-2
                      bg-gray-50 dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      rounded-md
                      text-sm
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    "
                  />

                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedSearch("");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <Select.Viewport className="p-1.5 max-h-60">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option: any, index: number) => (
                  <Select.Item
                    key={index}
                    value={option?.value || "Not Found"}
                    className="
                      relative flex items-center
                      px-8 py-2.5
                      rounded-md
                      text-sm
                      cursor-pointer
                      select-none
                      outline-none
                      data-[highlighted]:bg-blue-50
                      data-[state=checked]:text-blue-600
                    "
                  >
                    <Select.ItemText>
                      {option.label}
                    </Select.ItemText>

                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No options found
                  </p>
                </div>
              )}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-900">
              <ChevronDown className="w-4 h-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};