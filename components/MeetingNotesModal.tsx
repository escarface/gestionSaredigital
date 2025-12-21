import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Save, Loader2, StickyNote } from 'lucide-react';
import { Project, MeetingNote } from '../types';
import { db } from '../services/storage';

interface MeetingNotesModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

const MeetingNotesModal: React.FC<MeetingNotesModalProps> = ({ project, isOpen, onClose }) => {
    const [notes, setNotes] = useState<MeetingNote[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && project) {
            loadNotes();
        }
    }, [isOpen, project]);

    const loadNotes = async () => {
        setLoading(true);
        const data = await db.getMeetingNotes(project.id);
        setNotes(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!newNote.trim()) return;

        setSaving(true);
        try {
            await db.saveMeetingNote({
                projectId: project.id,
                content: newNote
            });
            setNewNote('');
            await loadNotes();
        } catch (error) {
            console.error('Failed to save note', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this note?')) {
            await db.deleteMeetingNote(id);
            await loadNotes();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-border-color flex justify-between items-center bg-background-light/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${project.status === 'In Progress' ? 'bg-primary/20 text-text-main' : 'bg-gray-100 text-text-muted'}`}>
                            <StickyNote size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main">Meeting Notes</h3>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] bg-background-light/30">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-text-muted">
                            <Loader2 size={24} className="animate-spin mr-2" />
                            Loading notes...
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-text-muted opacity-60">
                            <StickyNote size={48} className="mb-2" />
                            <p>No meeting notes yet.</p>
                            <p className="text-sm">Start typing below to add one.</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="bg-white p-4 rounded-xl border border-border-color shadow-sm group hover:border-primary/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                                        <Calendar size={12} />
                                        {new Date(note.createdAt).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                        title="Delete note"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="text-text-main whitespace-pre-wrap text-sm leading-relaxed">
                                    {note.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer - Input */}
                <div className="p-6 border-t border-border-color bg-white rounded-b-2xl">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider mb-2 block">New Note</label>
                    <div className="flex gap-3 items-start">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Type your meeting notes here..."
                            className="flex-1 min-h-[80px] p-3 rounded-xl border border-border-color bg-background-light focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.metaKey) handleSave(); // Cmd+Enter to save
                            }}
                        />
                        <button
                            onClick={handleSave}
                            disabled={!newNote.trim() || saving}
                            className="h-[80px] px-6 bg-text-main hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                            {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                            <span className="text-[10px] uppercase tracking-wider">Save</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-text-muted mt-2 text-center">
                        Pro tip: Press <kbd className="font-sans bg-gray-100 px-1 rounded">Cmd + Enter</kbd> to save quickly
                    </p>
                </div>

            </div>
        </div>
    );
};

export default MeetingNotesModal;
