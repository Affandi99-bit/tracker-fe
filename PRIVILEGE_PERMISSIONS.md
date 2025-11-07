# Privilege Permissions Documentation

## Location

All privilege permissions are defined in: `frontend/src/hook/Privilege.jsx`

## Permission Levels

### 1. **masteruser** (Full Access)

- ✅ All permissions granted
- Can access: create, edit, delete, report, view, kanban, share

### 2. **pm** (Project Manager)

- ✅ create - Create new projects
- ✅ edit - Edit existing projects
- ✅ delete - Delete projects
- ✅ report - Access Report.jsx (Berita Acara)
- ✅ view - View project list
- ✅ kanban - Access Kanban board
- ✅ share - Share projects (readonly links)

### 3. **user** (Limited Access)

- ❌ create - Cannot create projects
- ❌ edit - Cannot edit projects
- ❌ delete - Cannot delete projects
- ❌ report - Cannot access Report.jsx
- ✅ view - View project list
- ✅ kanban - Access Kanban board
- ✅ share - Share projects (readonly links)

### 4. **finance** (Finance Access)

- ❌ create - Cannot create projects
- ❌ edit - Cannot edit projects
- ❌ delete - Cannot delete projects
- ✅ report - Access Report.jsx (Berita Acara)
- ✅ view - View project list
- ❌ kanban - Cannot access Kanban
- ❌ share - Cannot share projects

## User Accounts

User accounts and their privileges are defined in: `frontend/src/constant/constant.js`

```javascript
export const user = [
  {
    privilege: "user",
    user: "blackfamz",
    password: "bendinongopi",
  },
  {
    privilege: "pm",
    user: "blackstdpm",
    password: "blckstdpm",
  },
  {
    privilege: "finance",
    user: "blackstdfinance",
    password: "blckfn",
  },
  {
    privilege: "masteruser",
    user: "main",
    password: "blck",
  },
];
```

## How Permissions Are Checked

Permissions are checked using the `useHasPermission` hook:

```javascript
import { useHasPermission } from "../hook";

// In component
const canEdit = useHasPermission("edit");
const canDelete = useHasPermission("delete");
const canReport = useHasPermission("report");
```

## Where Permissions Are Applied

1. **Navbar.jsx** - Create button visibility
2. **MainTable.jsx** - Edit, Delete, Report, Share, Kanban buttons
3. **Report.jsx** - Component access restriction

## To Modify Permissions

Edit the `useHasPermission` function in `frontend/src/hook/Privilege.jsx`:

```javascript
// Add new permission to a role
if (privilege === "pm") {
  return [
    "create",
    "edit",
    "delete",
    "report",
    "view",
    "kanban",
    "share",
    "newPermission",
  ].includes(action);
}
```
