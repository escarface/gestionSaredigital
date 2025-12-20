import { LayoutDashboard, Briefcase, CalendarDays, Users, CheckSquare, Settings } from 'lucide-react';

// UI Constants only
export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGWF15p11GkaBV0E3OQbmRCp7KYPAQF8xW1Y0L7EOWZlDoHUk218Pq3zsdMuIJ7uwyUv36d_eSHRKroAqpcbQxleTYHfg4VKHYYUmXYkiDMWSxzjaiLCBHbgDXkG5xe9MkjwwHjT74kBHzN5Jt_2foN-SHiNkaUaSHaKgdLM0h6teFtxk1zA-_b4hEWaFfBhbIqwU1tyJ4XuWVOas6zWg8FPe-HTUBMJwngOMT5YBN5g6qUrrbNzb9GJ1km_4lf8Sfckdxbo2QfvA";

// Default avatar for new users/placeholders
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random";

export const AVATARS = {
  ana: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  bob: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  charlie: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  david: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

export const MENU_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'projects', icon: Briefcase, label: 'Projects' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { id: 'team', icon: Users, label: 'Team' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];