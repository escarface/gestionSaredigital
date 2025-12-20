
import React, { useState, useRef, useEffect } from 'react';
import { Mail, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { NewMemberModal } from './Modals';
import { TeamMember } from '../types';

const TeamPage: React.FC = () => {
  const { team, addTeamMember, removeTeamMember, askConfirmation } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (member: TeamMember) => {
      askConfirmation(
          "Remove Team Member",
          `Are you sure you want to remove ${member.name} from the team?`,
          () => removeTeamMember(member.id)
      );
      setActiveMenu(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Team Members</h2>
          <p className="text-text-muted text-sm">Collaborate and manage your team access</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
             <div className="flex items-center bg-white border border-border-color rounded-full px-4 h-10 flex-1 sm:w-64 focus-within:ring-2 ring-primary/50 transition-all">
              <Search className="text-text-muted" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find member..." 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full text-text-main placeholder-text-muted h-full ml-2"
              />
            </div>
            {isAdmin && (
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center rounded-full px-4 h-10 bg-primary hover:bg-[#e6e205] transition-colors text-black text-sm font-bold shadow-sm shrink-0"
              >
              <Plus size={18} className="mr-2" />
              Invite
              </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeam.map((member) => (
          <div key={member.id} className="relative bg-white border border-border-color rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
             {isAdmin && (
               <>
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === member.id ? null : member.id);
                    }}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors p-1 rounded-full hover:bg-gray-100"
                 >
                     <MoreVertical size={18} />
                 </button>

                 {activeMenu === member.id && (
                    <div 
                        ref={menuRef}
                        className="absolute right-4 top-10 w-32 bg-white rounded-xl shadow-xl border border-border-color z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-left"
                    >
                        <button 
                            onClick={() => handleDelete(member)}
                            className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Remove
                        </button>
                    </div>
                )}
               </>
             )}

             <div className="relative mb-4">
                 <img src={member.avatar} alt={member.name} className="size-20 rounded-full object-cover border-4 border-background-light" />
                 <span className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white ${
                     member.status === 'Online' ? 'bg-green-500' : 
                     member.status === 'Busy' ? 'bg-red-500' : 'bg-gray-400'
                 }`}></span>
             </div>
             
             <h3 className="text-lg font-bold text-text-main">{member.name}</h3>
             <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-4">{member.role}</p>
             
             <div className="flex gap-2 w-full mt-auto">
                 <button className="flex-1 py-2 rounded-lg border border-border-color hover:bg-gray-50 text-xs font-bold text-text-main flex items-center justify-center gap-2 transition-colors">
                     View Profile
                 </button>
                 <button className="p-2 rounded-lg bg-primary/20 hover:bg-primary text-text-main transition-colors">
                     <Mail size={16} />
                 </button>
             </div>
          </div>
        ))}
         {isAdmin && (
           <button 
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-border-color rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group h-full min-h-[250px]"
          >
              <div className="size-12 rounded-full bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
                  <Plus size={24} className="text-text-muted group-hover:text-text-main" />
              </div>
              <span className="font-bold text-text-main">Add New Member</span>
           </button>
         )}
      </div>

      <NewMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTeamMember}
      />
    </div>
  );
};

export default TeamPage;
