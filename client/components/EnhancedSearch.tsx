import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, MapPin, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LostFoundItem } from "@/types/database";
import { useNavigate } from "react-router-dom";

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  items: LostFoundItem[];
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export const EnhancedSearch = React.memo<EnhancedSearchProps>(
  ({
    value,
    onChange,
    items,
    placeholder = "Search for lost items...",
    className,
    onSearch,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const navigate = useNavigate();

    // Create smart suggestions from database items
    const filteredSuggestions = React.useMemo(() => {
      if (!value.trim() || value.length < 2) return [];

      const searchTerm = value.toLowerCase();
      
      // Get matching items from database
      const matchingItems = items
        .filter((item) => 
          item.status === "lost" && // Only show lost items in suggestions
          (item.title.toLowerCase().includes(searchTerm) ||
           item.description.toLowerCase().includes(searchTerm) ||
           item.category.toLowerCase().includes(searchTerm) ||
           item.location.toLowerCase().includes(searchTerm))
        )
        .slice(0, 6) // Limit to 6 suggestions
        .sort((a, b) => {
          // Prioritize title matches over description matches
          const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
          const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          
          // Then sort by how well the title matches (starts with search term gets priority)
          const aStartsWithTitle = a.title.toLowerCase().startsWith(searchTerm);
          const bStartsWithTitle = b.title.toLowerCase().startsWith(searchTerm);
          if (aStartsWithTitle && !bStartsWithTitle) return -1;
          if (!aStartsWithTitle && bStartsWithTitle) return 1;
          
          // Finally sort by recency
          return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
        });

      return matchingItems;
    }, [value, items]);

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setIsOpen(true);
        setHighlightedIndex(-1);
      },
      [onChange],
    );

    // Handle suggestion selection (item click)
    const handleSuggestionSelect = useCallback(
      (item: LostFoundItem) => {
        // Auto-complete the search with the item title
        onChange(item.title);
        setIsOpen(false);
        setHighlightedIndex(-1);
        
        // Navigate to browse page with highlighted item
        const params = new URLSearchParams({
          search: item.title,
          highlight: item.id || ""
        });
        navigate(`/browse?${params.toString()}`);
      },
      [onChange, navigate],
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!isOpen) {
          if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(0);
          }
          return;
        }

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            break;
          case "Enter":
            e.preventDefault();
            if (
              highlightedIndex >= 0 &&
              highlightedIndex < filteredSuggestions.length
            ) {
              handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
            } else if (onSearch) {
              onSearch(value);
              setIsOpen(false);
            }
            break;
          case "Escape":
            setIsOpen(false);
            setHighlightedIndex(-1);
            inputRef.current?.blur();
            break;
          case "Tab":
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      },
      [
        isOpen,
        highlightedIndex,
        filteredSuggestions,
        handleSuggestionSelect,
        onSearch,
        value,
      ],
    );

    // Handle clear input
    const handleClear = useCallback(() => {
      onChange("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    }, [onChange]);

    // Handle search button click
    const handleSearchClick = useCallback(() => {
      if (value.trim()) {
        const params = new URLSearchParams({ search: value.trim() });
        navigate(`/browse?${params.toString()}`);
        setIsOpen(false);
      }
    }, [value, navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [highlightedIndex]);

    const showSuggestions = isOpen && filteredSuggestions.length > 0;

    return (
      <div className={cn("relative w-full", className)}>
        <div className="flex gap-3 p-2 bg-card rounded-full shadow-sm border">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => value.trim().length >= 2 && setIsOpen(true)}
              placeholder={placeholder}
              className="pl-12 pr-10 h-12 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Search for lost items"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `suggestion-${highlightedIndex}`
                  : undefined
              }
              autoComplete="off"
            />
            {value && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearchClick}
            className="h-12 px-8 rounded-full"
            type="button"
          >
            Search
            <Search className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Enhanced suggestions dropdown with item details */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="bg-popover border rounded-lg shadow-lg max-h-80 overflow-y-auto">
              <ul
                ref={listRef}
                role="listbox"
                className="py-2"
                aria-label="Search suggestions"
              >
                {filteredSuggestions.map((item, index) => (
                  <li
                    key={item.id}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    className={cn(
                      "px-4 py-3 cursor-pointer text-sm transition-colors border-b border-border/50 last:border-b-0",
                      index === highlightedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50",
                    )}
                    onClick={() => handleSuggestionSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground truncate">
                            {item.title}
                          </span>
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Lost
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{item.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(item.dateReported).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {value.trim().length >= 2 && filteredSuggestions.length === 0 && (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No matching lost items found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

EnhancedSearch.displayName = "EnhancedSearch";
