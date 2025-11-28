# Task Manager - React + Tailwind CSS

A modern, fully responsive task management application built with React and Tailwind CSS.

## Features

✨ **Modern UI** - Beautiful, clean interface with smooth animations
📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
🔐 **Secure Login** - Authentication system with localStorage
📅 **Calendar View** - Interactive calendar with daily task management
✅ **Task Management** - Add, edit, delete, and track tasks
📊 **Progress Tracking** - Visual progress indicators for each day
🎨 **Beautiful Modals** - Animated, modern modal dialogs
⚡ **Fast & Optimized** - Efficient state management and API calls

## Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx          # Login page with authentication
│   ├── CalendarPage.jsx       # Main calendar view
│   └── TaskModal.jsx          # Task management modal
├── hooks/
│   └── useTaskManagement.js   # Custom hook for task operations
├── utils/
│   └── api.js                 # API utilities and helper functions
├── App.jsx                    # Main app component
├── main.jsx                   # React entry point
└── index.css                  # Global styles with Tailwind

public/
└── index.html                 # HTML template

Configuration Files:
- vite.config.js              # Vite configuration
- tailwind.config.js          # Tailwind CSS configuration
- postcss.config.js           # PostCSS configuration
- package.json                # Dependencies and scripts
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Login Credentials

- **User ID:** 2313841
- **Password:** anu

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client (optional, currently using fetch)

## Features Breakdown

### Login System

- Secure credential validation
- LocalStorage session management
- Smooth transitions between pages
- Input validation and error handling

### Calendar View

- Month navigation with prev/next buttons
- Visual indicators for task completion status
- Today's date highlighting
- Responsive grid layout (7 columns)
- Day status legend

### Task Modal

- Add new tasks with validation
- Toggle task completion status
- Delete individual tasks
- Progress bar showing completion percentage
- Smooth animations and transitions
- Mobile and desktop optimized

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and inputs
- Optimized spacing and typography
- Adaptive grid layouts

## API Integration

Currently integrated with:

- **Backend:** https://todo-backend-5t1x.onrender.com/api/task

Default tasks are initialized for each new day:

- LeetCode
- GitHub Contribution
- Workout

## Styling

Tailwind CSS custom colors:

- Primary: Blue gradient (#2b47ff to #1e37db)
- Success: Green gradient (#7bf07b to #4ad763)
- Danger: Red gradient (#ff5b5b to #e03b3b)

## Performance Optimizations

- Monthly task preloading
- Efficient caching system
- Memoized callbacks with useCallback
- Optimized re-renders
- CSS animations for smooth UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Task reminders/notifications
- [ ] Dark mode
- [ ] Multi-user support
- [ ] Task priority levels
- [ ] Export/import functionality
- [ ] Statistics and analytics

## License

MIT License
