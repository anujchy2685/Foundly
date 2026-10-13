# Lost and Found Platform — Requirements & User Flow

## 1. Requirements

### Goal

The **Lost and Found Platform** is a web application that helps people report lost items, report found items, search for matching items, and communicate with the person who may have lost or found an item.

The main goal is to make the process of finding lost belongings easier and more organized instead of depending only on verbal communication, notices, social media posts, or physical lost-and-found offices.

---

## Step 1 — Define the Problem

### Problem

People often lose personal belongings such as mobile phones, wallets, documents, bags, keys, certificates, and other valuable items. Similarly, people who find these items may not know how to return them to the rightful owner.

Without a centralized platform:

* Lost items can be difficult to report.
* Found items may not reach their owners.
* People may have difficulty searching for matching items.
* Information can become scattered across different places.
* There is no organized way to track the status of a lost or found item.

### Users

The main users of the platform are:

* Guest
* Registered User
* Admin

### Solution

The Lost and Found Platform allows users to:

* Report a lost item.
* Report a found item.
* Search and browse reported items.
* View item details.
* Find possible matches between lost and found items.
* Contact another user regarding an item.
* Update the status of an item.
* Manage reports and users through an admin system.

---

# 2. Define the Users

## Guest

A guest can:

* View publicly available lost and found items.
* Search for items.
* View item details.
* Register or log in.

## Registered User

A registered user can:

* Report a lost item.
* Report a found item.
* Edit their own reports.
* Delete their own reports.
* Search for lost and found items.
* View item details.
* Contact another user about an item.
* Mark an item as recovered or returned.
* View and manage their own reports.
* email verification

## Admin

An admin can:

* Manage users.
* View reported items.
* Edit or remove inappropriate reports.
* Review suspicious or duplicate reports.
* Manage reported content.
* Monitor the overall platform.

---

# 3. Define the Main Features

## Authentication

* Register
* Login
* Logout

## Lost Item

* Report lost item
* Add item name
* Add description
* Add category
* Add location
* Add date
* Add image
* Edit lost-item report
* Delete lost-item report
* View lost-item details

## Found Item

* Report found item
* Add item name
* Add description
* Add category
* Add location
* Add date
* Add image
* Edit found-item report
* Delete found-item report
* View found-item details

## Search and Browse

* View lost items
* View found items
* Search by item name
* Filter by category
* Filter by location
* Filter by date
* View item details

## Matching

The platform can help identify possible matches between lost and found items based on information such as:

* Item name
* Category
* Location
* Date
* Description

## Communication

Users can:

* Contact the person who reported an item.
* Discuss item details.
* Provide information needed to verify ownership.

## Item Status

An item can have different statuses such as:

* Active
* Matched
* Claimed
* Returned
* Closed

## Admin Management

Admin can:

* View users.
* View reports.
* Manage inappropriate content.
* Remove invalid reports.
* Manage reported users or content.

---

# 4. Separate Scope

## MVP

The first version should include:

* User registration and login
* Report lost item
* Report found item
* View lost and found items
* Search and filter
* Item details
* User's own reports
* Edit and delete own reports
* Basic contact/claim process
* Item status
* Admin management
* Notifications to person who had lost item
* Admin approval for lost and found items
* If admin approves, then notify person whose item was approved or updated or deleted



## Later

Features that can be added later:

* Automatic matching
* Email notifications
* Push notifications
* Location/map integration
* Advanced search
* Image-based item matching
* Mobile application
* QR codes for items

## Out of Scope

The initial version will not include:

* Physical collection of items
* Delivery of items
* Verification by external organizations
* Payment processing
* Police or government database integration

---

# 5. Important Rules

The platform should have simple and clear rules.

* Only registered users can report lost or found items.
* A user can edit their own reports.
* A user cannot edit another user's report.
* A user can delete their own report.
* Admin can manage or remove reports when necessary.
* Users should provide accurate information about reported items.
* A user should not claim an item without providing sufficient information to verify ownership.
* A returned item should not remain active as an available lost/found item.
* Closed reports should not be treated as active reports.

These rules define who can perform an action and when an action is allowed.

---

# 6. Define "Done"

## Feature: Register

* User can enter registration information.
* Valid information creates an account.
* Invalid information shows an error.
* Duplicate accounts are prevented.

## Feature: Login

* User can enter login credentials.
* Valid credentials log the user in.
* Invalid credentials show an error.
* Unauthenticated users cannot access protected actions.

## Feature: Report Lost Item

* Logged-in user can submit a lost-item report.
* Required information must be provided.
* The report is created successfully.
* The report appears in the lost-items list.

## Feature: Report Found Item

* Logged-in user can submit a found-item report.
* Required information must be provided.
* The report is created successfully.
* The report appears in the found-items list.

## Feature: Search

* User can search for an item.
* Matching items are displayed.
* User can filter results.
* If no matching item exists, an appropriate message is shown.

## Feature: Claim/Return

* User can request an item.
* The relevant user can review the request.
* Ownership can be discussed or verified.
* The item status can be changed after the item is returned.

---

# 7. User Flows

## Goal

The main purpose of the user flow is to understand how users accomplish their tasks.

Basic flow:

```text
User
  ↓
Goal
  ↓
Action
  ↓
System Response
  ↓
Result
```

---

# 8. User Goal — Report a Lost Item

```text
Login
   ↓
Open "Report Lost Item"
   ↓
Enter item information
   ↓
Add location and date
   ↓
Add description/image
   ↓
Submit Report
   ↓
System validates information
   ↓
Lost Item Report Created
   ↓
Report appears in Lost Items
```

### If something goes wrong

```text
Submit Report
      ↓
Valid information?
   ├── No → Show validation error
   └── Yes
        ↓
Create Lost Item Report
```

---

# 9. User Goal — Report a Found Item

```text
Login
   ↓
Open "Report Found Item"
   ↓
Enter item information
   ↓
Add location and date
   ↓
Add description/image
   ↓
Submit Report
   ↓
System validates information
   ↓
Found Item Report Created
   ↓
Report appears in Found Items
```

---

# 10. User Goal — Find a Lost Item

```text
Open Platform
   ↓
Search for item
   ↓
Apply filters
   ↓
View matching results
   ↓
Open item details
   ↓
Check item information
   ↓
Possible Match?
   ├── No → Continue Searching
   └── Yes
        ↓
Contact Reporter
        ↓
Discuss / Verify Item
```

---

# 11. User Goal — Claim a Found Item

                LOST ITEM
                   │
                   ▼
            Possible Match
                   │
                   ▼
             Claim Request/while requesting owner should provide their identification
                   │
          ┌────────┴────────┐
          ▼                 ▼
      Owner Side        Finder Side
          │                 │
     "I claim this"    "I found this"
          │                 │
          └────────┬────────┘
                   ▼
             Claim Accepted
                   │
                   ▼
             Contact / Meet
                   │
          Item exchanged
          outside system
                   │
          ┌────────┴────────┐
          ▼                 ▼
     Finder confirms     Owner confirms
     after confirming
     Identification
     "I returned it"   "I received it"
          │                 │
          └────────┬────────┘
                   ▼
              RETURNED
                   │
                   ▼
               CLOSED
```
---

# 12. User Goal — Manage Own Report

```text
Login
   ↓
Open My Reports
   ↓
Select Report
   ↓
View Report
   ↓
Choose Action
   ├── Edit
   ├── Delete
   └── Update Status
```

---

# 13. Consider What Can Go Wrong

For important flows, consider:

```text
What if the user is not logged in?
What if required information is missing?
What if the item does not exist?
What if the user tries to edit another user's report?
What if the item has already been returned?
What if multiple users claim the same item?
What if the report contains inappropriate information?
```

Example:

```text
Report Lost Item
       ↓
Logged in?
   ├── No → Login
   └── Yes
        ↓
Valid information?
   ├── No → Show Error
   └── Yes
        ↓
Create Report
        ↓
Report Created
```

---

# 14. Identify Permissions

```text
View public items       → Everyone

Search items            → Everyone

Register/Login          → Guest

Report lost item        → Registered User

Report found item       → Registered User

Edit own report         → Registered User

Delete own report       → Registered User

Edit another user's
report                  → Not Allowed

Manage reports          → Admin

Manage users            → Admin
```

---

# 15. Identify States

The platform needs clear states for lost and found reports.

## Item Report Lifecycle

```text
Active
  ↓
Matched
  ↓
Claimed
  ↓
Returned
  ↓
Closed
```

A report may also become:

```text
Active
  ↓
Closed
```

when the item is no longer relevant or the report is cancelled.

## Lost Item

```text
Lost
 ↓
Possible Match
 ↓
Claimed
 ↓
Recovered
 ↓
Closed
```

## Found Item

```text
Found
 ↓
Claimed
 ↓
Verified
 ↓
Returned
 ↓
Closed
```

The exact status transitions should be kept simple so the system does not become unnecessarily complicated.

---

# 16. Review Before Coding

Before starting development, check:

```text
Does every major feature have a user?

Does every user have a clear purpose?

Does every important feature have a user flow?

Are permissions clear?

Can users edit only what they are allowed to edit?

Are important failure cases considered?

Are item statuses clearly defined?

Can a lost item be connected to a found item?

Is the claim and return process clear?

Is anything unnecessarily complicated?
```

If something is unclear, resolve it before implementation.

---

# 17. Final Output

The project can initially have two simple documents:

```text
docs/
├── requirements.md
└── user-flows.md
```

### requirements.md

Should explain:

```text
What are we building?
Who uses it?
What problem does it solve?
What does it do?
What are the main features?
What are the important rules?
What is included?
What is not included?
```

### user-flows.md

Should explain:

```text
What does each user want to accomplish?
How do they accomplish it?
What can go wrong?
Who can perform each action?
What states can an item have?
How does a lost item become recovered?
How does a found item get returned?
```

---

# 18. Simple Development Chain

Use this mental model:

```text
PROBLEM
   ↓
USERS
   ↓
REQUIREMENTS
   ↓
USER GOALS
   ↓
USER FLOWS
   ↓
RULES
   ↓
ITEM STATES
   ↓
TECHNICAL DESIGN
   ↓
CODE
   ↓
TEST
   ↓
DEPLOY
```

The main principle is:

> **Understand the problem before designing the solution, and understand the user flow before writing the code.**

The Lost and Found Platform should first be clearly defined from the user's perspective. Technical details such as React components, database collections, API routes, and file structure can be decided after the requirements and user flows are clear.
