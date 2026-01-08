# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2026-01-07-task-comments-advanced-search/spec.md

## Technical Requirements

### 1. Task Comments System

**Frontend Components:**
- **CommentSection Component**: Display list of comments with infinite scroll or pagination
  - Show comment author avatar, name, timestamp in relative format (e.g., "2 hours ago")
  - Display comment content with parsed @mentions highlighted in primary color
  - Auto-refresh when new comments arrive via Realtime subscription
- **CommentInput Component**: Textarea with @mention autocomplete
  - Trigger autocomplete dropdown when user types "@"
  - Fetch team members matching the typed text
  - Insert mention as `@[User Name]` with hidden user ID metadata
  - Character limit: 1000 characters per comment
  - Submit button disabled until comment has content
- **ActivityTimeline Component**: Unified view of comments + system activities
  - Icon differentiation: comment icon for user comments, system icon for automated activities
  - Grouped by date with visual separators
  - System activities: status changes, assignee updates, priority changes, due date modifications
  - Format: "John Doe changed status from Todo to In Progress • 3h ago"

**State Management:**
- Add comments array to AppContext task state
- Add `addTaskComment(taskId, content, mentions)` action to AppContext
- Subscribe to Supabase Realtime channel for `task_comments` table filtered by task_id
- Parse @mentions from comment content to extract user IDs before submission

**Real-time Sync:**
- Supabase Realtime subscription to `task_comments` table
- Filter: `task_id=eq.{currentTaskId}`
- Events: INSERT (new comments)
- On INSERT event: Add new comment to local state, trigger notification sound (optional)

**@Mention Parser:**
- Regex pattern: `@\[([^\]]+)\]\(([a-f0-9-]{36})\)` to parse `@[Name](uuid)` format
- When typing, use simple regex `/@(\w+)$/` to detect mention trigger
- Autocomplete debounced to 300ms, search team members/profiles by name
- On selection, insert `@[Full Name](user_id)` in textarea
- Before rendering, replace mention pattern with styled span: `<span class="mention">@Full Name</span>`

### 2. Global Search

**Search UI:**
- Transform existing header search input into functional search
- Add magnifying glass icon (already exists from Lucide)
- Dropdown results panel appears below search input (z-index 50)
- Panel sections: "Projects" and "Tasks" with max 5 results each per section
- "View all X results" link at bottom of each section navigates to filtered view
- Click outside or ESC key closes search panel
- Loading spinner while search executes

**Search Implementation:**
- **Debounced Input**: 300ms debounce to avoid excessive queries
- **Minimum Query Length**: 2 characters before triggering search
- **Search Method**: Supabase `.textSearch()` or `.ilike()` across multiple columns
  - Projects: Search in `name`, `client`, `description`
  - Tasks: Search in `title`, `description`, `project` (project name)
- **Query Example**:
  ```typescript
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .or(`name.ilike.%${query}%,client.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5);
  ```
- **Result Highlighting**: Bold the matching text in results (simple indexOf/replace)
- **Recent Searches**: Store last 5 searches in localStorage, show as suggestions when search bar is focused

**Navigation:**
- Clicking project result: Navigate to `/projects` and auto-scroll/highlight that project
- Clicking task result: Open TaskDetailModal with that task pre-loaded
- Clear search query after navigation

### 3. Advanced Filtering

**Filter UI Components:**
- **FilterBar Component**: Horizontal bar with filter chips above task/project list
  - Active filters show as removable chips (X icon to remove)
  - "Add Filter" button opens filter dropdown menu
- **FilterDropdown Component**: Multi-select dropdown with checkbox groups
  - Groups: Status, Priority, Assignee, Due Date Range, Project
  - Apply button at bottom to commit filter changes
  - Clear all button to reset
- **SavedViewsSidebar**: Collapsible sidebar or dropdown showing saved view names
  - Default views: "All Tasks", "My Tasks", "High Priority"
  - User-created views below with edit/delete icons
  - Star icon to set default view

**Filter Logic:**
- Filters combine with AND logic (all filters must match)
- Multi-select within a category uses OR logic (Status = Todo OR In Progress)
- Date range filters:
  - Presets: Today, This Week, This Month, Overdue
  - Custom range picker for start/end dates
- Assignee filter:
  - Dropdown with all team members + "Unassigned" option
  - Support for "Assigned to Me" quick filter

**Filter State:**
- Store active filters in component state: `{ status: ['Todo', 'In Progress'], priority: ['High'], assignee: [userId], dueDateStart: Date, dueDateEnd: Date, project: [projectId] }`
- Apply filters client-side if dataset is small (<100 items)
- For larger datasets, build Supabase query with filters:
  ```typescript
  let query = supabase.from('tasks').select('*');
  if (filters.status.length) query = query.in('status', filters.status);
  if (filters.priority.length) query = query.in('priority', filters.priority);
  // ... etc
  ```

### 4. Saved Views

**Saved View Structure:**
```typescript
interface SavedView {
  id: string;
  user_id: string;
  name: string;
  entity_type: 'tasks' | 'projects';
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string[];
    dueDateStart?: string;
    dueDateEnd?: string;
    project?: string[];
  };
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
```

**Saved View Operations:**
- **Create**: Modal with name input, save current filter state to DB
- **Load**: Apply filters from saved view to current page
- **Update**: Edit view name or filters, update DB record
- **Delete**: Confirmation modal, delete from DB
- **Set Default**: Update `is_default` flag, clear other defaults for same entity_type

**UI Flow:**
- "Save View" button appears when any filter is active
- Modal: "Save current view as..." with name input (max 50 chars)
- Saved views appear in sidebar/dropdown sorted by created_at DESC
- Default view auto-loads when navigating to Tasks/Projects page
- Clicking saved view name applies those filters instantly

### 5. Activity Timeline Generation

**System Activity Tracking:**
- Not stored in separate table, generated from task change history
- When task is updated in AppContext, create activity object:
  ```typescript
  {
    type: 'system',
    action: 'status_changed',
    old_value: 'Todo',
    new_value: 'In Progress',
    user_id: currentUser.id,
    user_name: currentUser.name,
    created_at: new Date().toISOString()
  }
  ```
- Store in `task_activity` table (separate from comments) OR
- Append to JSONB column `activity_log` on tasks table

**Timeline Rendering:**
- Fetch both `task_comments` and `task_activity` for given task_id
- Merge arrays, sort by `created_at` DESC
- Render with different UI based on type:
  - type='comment': Show comment bubble
  - type='system': Show activity line with icon

### 6. Performance Optimizations

- **Pagination**: Load comments in pages of 20, infinite scroll or "Load more" button
- **Virtualization**: If task has 100+ comments, use react-window or similar
- **Debouncing**: All search and autocomplete inputs debounced to 300ms
- **Memoization**: Memo filter functions, memo comment list when no changes
- **Index Optimization**: Database indexes on commonly filtered columns (see database-schema.md)
- **Lazy Loading**: Load ActivityTimeline component only when "Activity" tab is clicked

### 7. Notification Integration

**Mention Notifications:**
- When comment with @mention is posted:
  1. Parse comment content to extract user IDs from `@[Name](id)` format
  2. For each mentioned user:
     - Call `notificationService.notifyMention(mentionedUserId, taskId, taskTitle, commenterName)`
     - Insert notification record with type='mention', relatedId=taskId
- Notification message format: "{commenterName} mentioned you in "{taskTitle}""
- Click notification navigates to task and scrolls to relevant comment

**Real-time Notification Delivery:**
- Existing NotificationCenter already subscribes to notifications table
- New mention notifications appear instantly in notification bell
- Play subtle sound effect on new mention (optional, user setting)

## External Dependencies

No new external dependencies are required. This spec uses existing libraries:

- **React** (already installed): Core UI framework
- **Supabase JS Client** (already installed): Database operations, Realtime subscriptions
- **Lucide React** (already installed): Icons for UI elements
- **Tailwind CSS** (already installed): Styling for all new components
- **uuid** (already installed): Generate IDs for comments and saved views

All functionality can be implemented with the current tech stack without adding new packages.
