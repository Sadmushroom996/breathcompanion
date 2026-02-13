import React from 'react';
import { Music, Plus, X, StopCircle, Edit2 } from 'lucide-react';

export const MusicIcon = ({ className }: { className?: string }) => <Music className={className} />;
export const PlusIcon = ({ className }: { className?: string }) => <Plus className={className} />;
export const CloseIcon = ({ className }: { className?: string }) => <X className={className} />;
export const StopIcon = ({ className }: { className?: string }) => <StopCircle className={className} />;
export const EditIcon = ({ className }: { className?: string }) => <Edit2 className={className} />;
