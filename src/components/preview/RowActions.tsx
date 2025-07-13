
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy, Edit, Trash, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface RowActionsProps {
  row: any;
  onEdit?: (column: string) => void;
  onDelete?: () => void;
}

const RowActions = ({ row, onEdit, onDelete }: RowActionsProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(row));
    toast.success('Row data copied to clipboard');
  };

  const handleView = () => {
    toast.info('Viewing details', {
      description: JSON.stringify(row, null, 2)
    });
  };

  const handleEdit = () => {
    const firstColumn = Object.keys(row)[0];
    if (onEdit && firstColumn) {
      onEdit(firstColumn);
      toast.success('Click on any cell to edit its value');
    } else {
      toast.info('Edit functionality not available');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast.info('Delete functionality not available');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-purple-100/30 dark:hover:bg-purple-900/30 rounded-full w-7 h-7">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-purple-100/50 dark:border-purple-800/50 invisible-scrollbar max-h-[200px] overflow-y-auto shadow-lg rounded-xl p-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          <motion.div variants={itemVariants}>
            <DropdownMenuItem onClick={handleView} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg my-1 cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <DropdownMenuItem onClick={handleCopy} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg my-1 cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Copy Row
            </DropdownMenuItem>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <DropdownMenuItem onClick={handleEdit} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg my-1 cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg my-1 cursor-pointer">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActions;
