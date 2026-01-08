# Spec Tasks

## Tasks

- [x] 1. Database Schema Setup
  - [x] 1.1 Run migration script to create task_comments, task_activity, and saved_views tables
  - [x] 1.2 Enable pg_trgm extension for full-text search
  - [x] 1.3 Create all indexes specified in database-schema.md
  - [x] 1.4 Verify RLS policies are active and working correctly
  - [x] 1.5 Test cascade deletes work (delete task → comments/activity deleted)
  - [x] 1.6 Add type mappings to types/supabase.ts for new tables

- [ ] 2. Service Layer for Comments & Activity
  - [ ] 2.1 Create services/comments.ts with CRUD methods for task_comments
  - [ ] 2.2 Implement addComment(taskId, content, mentions) method
  - [ ] 2.3 Implement getComments(taskId) method with user profile JOIN
  - [ ] 2.4 Create services/activity.ts for task activity logging
  - [ ] 2.5 Implement logActivity(taskId, action, fieldName, oldValue, newValue) method
  - [ ] 2.6 Implement getActivityTimeline(taskId) merging comments + activity
  - [ ] 2.7 Add Realtime subscription setup for task_comments table
  - [ ] 2.8 Verify all methods handle errors gracefully with try/catch

- [ ] 3. Task Comments UI Components
  - [ ] 3.1 Create components/CommentSection.tsx component
  - [ ] 3.2 Implement comment list rendering with author info and timestamps
  - [ ] 3.3 Add relative time formatting (e.g., "2 hours ago")
  - [ ] 3.4 Create components/CommentInput.tsx with textarea
  - [ ] 3.5 Implement @mention autocomplete dropdown
  - [ ] 3.6 Add mention parsing and formatting on submit
  - [ ] 3.7 Integrate CommentSection into TaskDetailModal component
  - [ ] 3.8 Test real-time comment updates when other users post

- [ ] 4. @Mention System
  - [ ] 4.1 Create utils/mentionParser.ts with parsing functions
  - [ ] 4.2 Implement detectMentionTrigger(text, cursorPosition) function
  - [ ] 4.3 Implement searchUsers(query) autocomplete function
  - [ ] 4.4 Implement insertMention(text, cursorPosition, user) function
  - [ ] 4.5 Implement extractMentions(content) to get user IDs from text
  - [ ] 4.6 Implement renderMentions(content) to highlight mentions in UI
  - [ ] 4.7 Add notification creation when user is mentioned
  - [ ] 4.8 Test mention notifications appear in NotificationCenter

- [ ] 5. Activity Timeline Component
  - [ ] 5.1 Create components/ActivityTimeline.tsx component
  - [ ] 5.2 Implement unified timeline merging comments and system activities
  - [ ] 5.3 Add date grouping headers ("Today", "Yesterday", specific dates)
  - [ ] 5.4 Style system activities differently from user comments
  - [ ] 5.5 Add icons for different activity types (status change, assignment, etc.)
  - [ ] 5.6 Integrate ActivityTimeline into TaskDetailModal as a tab or section
  - [ ] 5.7 Test timeline shows all activities in correct chronological order

- [ ] 6. Global Search Implementation
  - [ ] 6.1 Create components/GlobalSearch.tsx component
  - [ ] 6.2 Implement debounced search input (300ms delay)
  - [ ] 6.3 Add search dropdown results panel
  - [ ] 6.4 Create services/search.ts with searchAll(query) method
  - [ ] 6.5 Implement search queries using .ilike() or .textSearch() for projects and tasks
  - [ ] 6.6 Add result highlighting (bold matching text)
  - [ ] 6.7 Implement navigation on result click (projects → page, tasks → modal)
  - [ ] 6.8 Add recent searches to localStorage
  - [ ] 6.9 Replace non-functional header search bar with GlobalSearch component
  - [ ] 6.10 Test search works across project names, clients, task titles, descriptions

- [ ] 7. Advanced Filtering System
  - [ ] 7.1 Create components/FilterBar.tsx component
  - [ ] 7.2 Implement active filter chips display with remove (X) functionality
  - [ ] 7.3 Create components/FilterDropdown.tsx with checkbox groups
  - [ ] 7.4 Add filter categories: Status, Priority, Assignee, Due Date, Project
  - [ ] 7.5 Implement date range picker for due date filtering
  - [ ] 7.6 Add "Assigned to Me" quick filter option
  - [ ] 7.7 Create utils/filterUtils.ts with applyFilters(items, filters) function
  - [ ] 7.8 Integrate FilterBar into TasksPage and ProjectsPage
  - [ ] 7.9 Test multi-criteria filtering works correctly with AND/OR logic
  - [ ] 7.10 Verify filter state persists during session

- [ ] 8. Saved Views Feature
  - [ ] 8.1 Create services/savedViews.ts with CRUD methods
  - [ ] 8.2 Implement createSavedView(name, entityType, filters) method
  - [ ] 8.3 Implement getUserSavedViews(userId, entityType) method
  - [ ] 8.4 Implement updateSavedView(id, updates) method
  - [ ] 8.5 Implement deleteSavedView(id) method
  - [ ] 8.6 Implement setDefaultView(id) method
  - [ ] 8.7 Create components/SavedViewsPanel.tsx component
  - [ ] 8.8 Add "Save Current View" button that opens save modal
  - [ ] 8.9 Display saved views in sidebar or dropdown
  - [ ] 8.10 Implement load saved view → apply filters functionality
  - [ ] 8.11 Add edit/delete actions for each saved view
  - [ ] 8.12 Load default view on page mount if exists
  - [ ] 8.13 Test saved views sync across devices (stored in DB)

- [ ] 9. AppContext Integration
  - [ ] 9.1 Add comments state array to AppContext
  - [ ] 9.2 Add addTaskComment action to AppContext
  - [ ] 9.3 Add getTaskComments action to AppContext
  - [ ] 9.4 Add activity state and actions to AppContext
  - [ ] 9.5 Add savedViews state and CRUD actions to AppContext
  - [ ] 9.6 Implement Realtime subscription for task_comments in AppContext
  - [ ] 9.7 Update editTask to log activity when task fields change
  - [ ] 9.8 Test all new actions work correctly and update state

- [ ] 10. Notification Integration
  - [ ] 10.1 Update notificationService to handle 'mention' notification type
  - [ ] 10.2 Add notifyMention(userId, taskId, taskTitle, mentionerName) method
  - [ ] 10.3 Update NotificationCenter to handle mention notifications
  - [ ] 10.4 Add navigation to task when mention notification is clicked
  - [ ] 10.5 Test mention notifications appear in real-time
  - [ ] 10.6 Verify notification count updates correctly

- [ ] 11. UI/UX Polish
  - [ ] 11.1 Add loading states for comment posting, search results, filter application
  - [ ] 11.2 Add empty states ("No comments yet", "No search results")
  - [ ] 11.3 Add character counter for comment input (1000 char limit)
  - [ ] 11.4 Add confirmation modal for deleting saved views
  - [ ] 11.5 Implement keyboard shortcuts (ESC to close search, Enter to submit comment)
  - [ ] 11.6 Add smooth scroll to new comment after posting
  - [ ] 11.7 Style @mentions with primary color highlight
  - [ ] 11.8 Add subtle animations for filter chips and search dropdown
  - [ ] 11.9 Ensure all components are mobile responsive
  - [ ] 11.10 Test accessibility (keyboard navigation, screen readers)

- [ ] 12. Testing & Bug Fixes
  - [ ] 12.1 Test comment posting from multiple users simultaneously
  - [ ] 12.2 Test @mention autocomplete with various user names
  - [ ] 12.3 Test global search with special characters and edge cases
  - [ ] 12.4 Test all filter combinations work correctly
  - [ ] 12.5 Test saved view persistence across browser refresh
  - [ ] 12.6 Test real-time updates work for comments and activity
  - [ ] 12.7 Verify RLS policies prevent unauthorized access
  - [ ] 12.8 Test performance with 100+ comments on a task
  - [ ] 12.9 Fix any UI bugs (layout issues, z-index conflicts, etc.)
  - [ ] 12.10 Verify all features work on mobile devices

- [ ] 13. Documentation & Cleanup
  - [ ] 13.1 Update types.ts with new interfaces (Comment, Activity, SavedView)
  - [ ] 13.2 Add JSDoc comments to all new service methods
  - [ ] 13.3 Update CLAUDE.md with new features and patterns
  - [ ] 13.4 Create user-facing documentation (if applicable)
  - [ ] 13.5 Run lint and fix any linting errors
  - [ ] 13.6 Run type-check and fix any TypeScript errors
  - [ ] 13.7 Verify all TODOs in code are resolved or tracked
  - [ ] 13.8 Clean up any console.logs or debug code
