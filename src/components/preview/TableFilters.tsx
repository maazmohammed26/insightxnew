import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface TableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dataQualityFilter: 'all' | 'clean' | 'errors';
  setDataQualityFilter: (filter: 'all' | 'clean' | 'errors') => void;
}

const TableFilters = ({
  searchTerm,
  setSearchTerm,
  dataQualityFilter,
  setDataQualityFilter
}: TableFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-t-lg border border-gray-200 dark:border-gray-700">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search in all columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={dataQualityFilter}
          onValueChange={(value: 'all' | 'clean' | 'errors') => setDataQualityFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                All Data
              </div>
            </SelectItem>
            <SelectItem value="clean">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Error-free Data
              </div>
            </SelectItem>
            <SelectItem value="errors">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Data with Errors
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TableFilters;