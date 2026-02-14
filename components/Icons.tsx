
import React from 'react';
import { Plus, X, StopCircle, Edit2 } from 'lucide-react';

export const PlusIcon = ({ className }: { className?: string }) => <Plus className={className} />;
export const CloseIcon = ({ className }: { className?: string }) => <X className={className} />;
export const StopIcon = ({ className }: { className?: string }) => <StopCircle className={className} />;
export const EditIcon = ({ className }: { className?: string }) => <Edit2 className={className} />;
