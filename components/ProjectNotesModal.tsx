import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Save, Loader2, FileText, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { Project, ProjectNote } from '../types';
import { db } from '../services/storage';

interface ProjectNotesModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectNotesModal: React.FC<ProjectNotesModalProps> = ({ project, isOpen, onClose }) => {
    const [notes, setNotes] = useState<ProjectNote[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingNote, setEditingNote] = useState<ProjectNote | null>(null);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen && project) {
            loadNotes();
        }
    }, [isOpen, project]);

    const loadNotes = async () => {
        setLoading(true);
        const data = await db.getProjectNotes(project.id);
        setNotes(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;

        setSaving(true);
        try {
            if (editingNote) {
                await db.updateProjectNote({
                    ...editingNote,
                    title: newTitle,
                    content: newContent
                });
                setEditingNote(null);
            } else {
                await db.saveProjectNote({
                    projectId: project.id,
                    title: newTitle,
                    content: newContent
                });
            }
            setNewTitle('');
            setNewContent('');
            await loadNotes();
        } catch (error) {
            console.error('Failed to save note', error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (note: ProjectNote) => {
        setEditingNote(note);
        setNewTitle(note.title);
        setNewContent(note.content);
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
        setNewTitle('');
        setNewContent('');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            await db.deleteProjectNote(id);
            await loadNotes();
        }
    };

    const toggleExpand = (noteId: string) => {
        setExpandedNotes(prev => {
            const next = new Set(prev);
            if (next.has(noteId)) {
                next.delete(noteId);
            } else {
                next.add(noteId);
            }
            return next;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-border-color flex justify-between items-center bg-background-light/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${project.status === 'In Progress' ? 'bg-primary/20 text-text-main' : 'bg-gray-100 text-text-muted'}`}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main">Project Notes</h3>
                            <p className="text-sm text-text-muted">Project: {project.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-muted hover:text-text-main"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Notes List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[250px] bg-background-light/30">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-text-muted">
                            <Loader2 size={24} className="animate-spin mr-2" />
                            Loading notes...
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-text-muted opacity-60">
                            <FileText size={48} className="mb-2" />
                            <p>No project notes yet.</p>
                            <p className="text-sm">Add notes to keep detailed information about this project.</p>
                        </div>
                    ) : (
                        notes.map((note) => {
                            const isExpanded = expandedNotes.has(note.id);
                            const contentPreview = note.content.length > 150 && !isExpanded
                                ? note.content.slice(0, 150) + '...'
                                : note.content;

                            return (
                                <div key={note.id} className="bg-white p-4 rounded-xl border border-border-color shadow-sm group hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-base font-bold text-text-main">{note.title}</h4>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(note)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-all"
                                                title="Edit note"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                                title="Delete note"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-text-main/80 whitespace-pre-wrap text-sm leading-relaxed mb-3">
                                        {contentPreview}
                                    </div>
                                    {note.content.length > 150 && (
                                        <button
                                            onClick={() => toggleExpand(note.id)}
                                            className="flex items-center gap-1 text-xs text-primary hover:text-text-main transition-colors font-medium"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp size={14} />
                                                    Show less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={14} />
                                                    Show more
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-text-muted mt-2 pt-2 border-t border-gray-100">
                                        <Calendar size={12} />
                                        <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                                            <span className="ml-2">| Updated: {new Date(note.updatedAt).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer - Input */}
                <div className="p-6 border-t border-border-color bg-white rounded-b-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">
                            {editingNote ? 'Edit Note' : 'New Note'}
                        </label>
                        {editingNote && (
                            <button
                                onClick={handleCancelEdit}
                                className="text-xs text-text-muted hover:text-text-main transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Note title..."
                            className="w-full p-3 rounded-xl border border-border-color bg-background-light focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium"
                        />
                        <div className="flex gap-3 items-start">
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Write your detailed note here..."
                                className="flex-1 min-h-[100px] p-3 rounded-xl border border-border-color bg-background-light focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.metaKey) handleSave();
                                }}
                            />
                            <button
                                onClick={handleSave}
                                disabled={!newTitle.trim() || !newContent.trim() || saving}
                                className="h-[100px] px-6 bg-text-main hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                            >
                                {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                <span className="text-[10px] uppercase tracking-wider">
                                    {editingNote ? 'Update' : 'Save'}
                                </span>
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-text-muted mt-2 text-center">
                        Pro tip: Press <kbd className="font-sans bg-gray-100 px-1 rounded">Cmd + Enter</kbd> to save quickly
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ProjectNotesModal;
