import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterValidColumns, validateColumnSelection } from '@/utils/columnUtils';
import { toast } from 'sonner';

interface SelectControlsProps {
  columns: string[];
  categoricalColumns: string[];
  numericColumns: string[];
  groupByColumn: string;
  aggregateColumn: string;
  onGroupByChange: (value: string) => void;
  onAggregateChange: (value: string) => void;
}

export const SelectControls = ({
  columns,
  categoricalColumns,
  numericColumns,
  groupByColumn,
  aggregateColumn,
  onGroupByChange,
  onAggregateChange,
}: SelectControlsProps) => {
  const validCategoricalColumns = React.useMemo(() => 
    filterValidColumns(categoricalColumns),
    [categoricalColumns]
  );

  const validNumericColumns = React.useMemo(() => 
    filterValidColumns(numericColumns),
    [numericColumns]
  );

  const handleGroupByChange = (value: string) => {
    if (!value || !validCategoricalColumns.includes(value)) {
      toast.error('Please select a valid categorical column');
      return;
    }
    onGroupByChange(value);
  };

  const handleAggregateChange = (value: string) => {
    if (!value || !validNumericColumns.includes(value)) {
      toast.error('Please select a valid numeric column');
      return;
    }
    onAggregateChange(value);
  };

  if (!validCategoricalColumns.length && !validNumericColumns.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No valid columns available for analysis
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {validCategoricalColumns.length > 0 && (
        <Select 
          value={groupByColumn || undefined}
          onValueChange={handleGroupByChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category column" />
          </SelectTrigger>
          <SelectContent>
            {validCategoricalColumns.map((col) => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {validNumericColumns.length > 0 && (
        <Select 
          value={aggregateColumn || undefined}
          onValueChange={handleAggregateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select numeric column" />
          </SelectTrigger>
          <SelectContent>
            {validNumericColumns.map((col) => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};