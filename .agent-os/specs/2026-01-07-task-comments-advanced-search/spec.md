# Spec Requirements Document

> Spec: Task Comments & Advanced Search System
> Created: 2026-01-07
> Status: Planning

## Overview

Implement a comprehensive collaboration and discovery system that enables team members to have contextual discussions directly on tasks through threaded comments with @mentions, while providing powerful global search and advanced filtering capabilities across projects and tasks. This feature will eliminate the need for external communication tools for task-related discussions and dramatically improve user productivity by making it easy to find and filter relevant work items.

## User Stories

### Story 1: Task Collaboration Through Comments

As a team member working on a task, I want to add comments and mention other team members (@username) so that I can ask questions, provide updates, and get feedback without leaving the application or using external chat tools.

**Detailed Workflow:**
- User opens a task detail modal or panel
- User sees a comment section below the task description showing all previous comments in chronological order
- User can type a new comment in a text input area
- While typing, user can type "@" followed by a username to mention/notify a specific team member
- An autocomplete dropdown appears showing matching team members
- Upon selecting a mentioned user, they receive a notification
- Comment is posted with timestamp and author information
- All team members with access to the task can see the comment thread
- Users can see a complete activity timeline showing task changes (status updates, assignee changes) alongside comments

### Story 2: Finding Work Items Quickly

As a project manager, I want to quickly search across all projects and tasks by typing keywords in the global search bar, so that I can instantly find the work item I'm looking for without navigating through multiple views.

**Detailed Workflow:**
- User clicks on the search bar in the header (currently non-functional)
- User types a search query (e.g., "login bug", "Website Redesign", "high priority")
- Search results appear in real-time showing matching projects and tasks
- Results are categorized by type (Projects, Tasks) with visual distinction
- Each result shows key context: project name, status, assignee, due date
- User can click on any result to navigate directly to that item
- Recent searches are saved for quick access
- Search works across project names, task titles, descriptions, client names

### Story 3: Custom Filtered Views

As a developer, I want to create and save custom filtered views (e.g., "My High Priority Tasks Due This Week") so that I can quickly access the exact subset of tasks I need to focus on without manually applying filters every time.

**Detailed Workflow:**
- User navigates to the Tasks page
- User applies multiple filters: Priority = High, Assignee = Me, Due Date = This Week, Status = Todo or In Progress
- User clicks "Save View" button
- User names the view (e.g., "My Critical Tasks")
- View is saved to the database and appears in a sidebar or dropdown
- User can access saved views from any device
- User can edit, duplicate, or delete saved views
- Views can be set as default landing page for the Tasks section

## Spec Scope

1. **Task Comments System** - Enable threaded comments on tasks with rich text support, author attribution, and timestamps
2. **@Mention Notifications** - Allow users to mention team members using @username syntax with autocomplete, triggering notifications to mentioned users
3. **Activity Timeline** - Display a unified timeline showing both comments and system-generated activity (status changes, assignments, due date updates)
4. **Global Search** - Implement full-text search across projects and tasks accessible from the header search bar with instant results
5. **Advanced Filtering** - Multi-criteria filtering system for tasks and projects supporting combinations of status, priority, assignee, date ranges, and project
6. **Saved Views** - Allow users to save, name, and persist custom filter combinations to the database for reuse across devices
7. **Real-time Updates** - Comments, mentions, and activity updates sync in real-time via Supabase Realtime subscriptions

## Out of Scope

- Editing or deleting comments (can be added in future iteration)
- Replying to specific comments (threading within comments)
- Rich text formatting in comments (bold, italic, links) - only plain text with @mentions
- File attachments in comments
- Emoji reactions to comments
- Comments on projects or calendar events (only tasks for now)
- Search in team members or calendar events (only projects and tasks)
- Advanced search operators (AND, OR, NOT, quotes)
- Search result ranking/relevance scoring beyond basic text matching
- Exporting search results or filtered views
- Sharing saved views with other users
- AI-powered search suggestions

## Expected Deliverable

1. **Functional Comment System**: Users can view and add comments on any task, see comment author and timestamp, and receive real-time updates when new comments are posted
2. **Working @Mentions**: Users can type @ to trigger autocomplete of team members, mentioned users receive notifications, and mentions are visually highlighted in comments
3. **Activity Timeline**: Task detail view shows a unified timeline of comments and system activities (e.g., "John changed status to In Progress", "María added a comment")
4. **Global Search Bar**: Header search bar accepts text input and displays instant search results for projects and tasks, clicking a result navigates to that item
5. **Multi-Criteria Filters**: Task and project pages have filter UI allowing simultaneous filtering by status, priority, assignee, date range, and other criteria
6. **Saved Views Feature**: Users can save current filter state with a custom name, access saved views from a dropdown/sidebar, and delete views they no longer need
7. **All features work in real-time**: New comments appear instantly for other users viewing the same task, filter changes reflect immediately
