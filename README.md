# ⛪ Kingdom Kids - Sunday School Management System (Admin Panel)

Kingdom Kids is a high-performance, real-time Sunday School administration platform built with **Next.js 15**, **Firebase**, and **Tailwind CSS**. It is designed to bridge the gap between church leadership, teachers, and parents.

---

## 🚀 Core Functionalities

### 1. 📊 Smart Dashboard
*   **Real-time Stats**: Live tracking of Total Students, Active Lessons, Attendance Rate, and Staff Count.
*   **Dynamic Welcome**: Personalised greeting for the logged-in administrator.
*   **Birthday Widget**: Automatically scans the database to highlight student birthdays in the coming 7 days.
*   **Activity Feed**: Instant notifications for new student registrations and lesson uploads.

### 2. 👥 Student Management
*   **Complete Profiles**: Tracking Name, Age, Birthday, Grade, and Parent Contact.
*   **Class Categorisation**: Students are automatically grouped (Nursery, Balavakup, etc.).
*   **Dynamic Attendance Rate**: Real-time percentage calculation based on all historical registers.
*   **Bulk Import**: Excel/CSV parsing to import hundreds of students in seconds.
*   **Class Migration**: One-click "Move to Next Class" functionality.

### 3. 👩‍🏫 Teacher Coordination
*   **Staff Directory**: Manage teacher profiles, contact info, and assigned class categories.
*   **Live Availability**: Teachers can mark themselves as "Away" or "On Duty".
*   **Substitution System**: The Attendance page detects if an assigned teacher is away and triggers a **"Substitute Needed"** alert.

### 4. 📝 Attendance System
*   **Smart Register**: Group-based attendance tracking with auto-save functionality.
*   **Parent Notifications**: Integrated **WhatsApp Bridge** to instantly notify parents when a child is marked absent.
*   **Notification Tracking**: Tracks which parents have been notified for each session.

### 5. 📚 Curriculum Library
*   **Lesson Management**: Upload and categorise teaching materials.
*   **Real-time Previews**: Quick-view of the next upcoming lesson on the dashboard.

---

## 📂 Database Schema (Firestore)

To build your **User-Facing Front-end**, your app should interact with these collections:

### `students`
| Field | Type | Description |
| :--- | :--- | :--- |
| `Name` | string | Student's full name |
| `Category` | string | e.g., "Nursery", "Balavakup" |
| `Birthday` | string | YYYY-MM-DD |
| `ParentName` | string | Name of the guardian |
| `Contact` | string | WhatsApp/Phone number |
| `Attendance` | number | Dynamic percentage (0-100) |

### `attendance`
| Field | Type | Description |
| :--- | :--- | :--- |
| `date` | string | YYYY-MM-DD |
| `category` | string | The class group |
| `attendance` | map | `{ [studentId]: "present" | "absent" }` |
| `notifiedStudents`| map | `{ [studentId]: true }` (WhatsApp tracking) |

### `teachers`
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Teacher's name |
| `category` | string | Assigned class category |
| `isAvailable` | boolean | Live availability status |

---

## 🎨 Design System
*   **Aesthetics**: Glassmorphism, premium gradients, and smooth Framer Motion animations.
*   **Typography**: Using **Inter** for professional, clean readability.
*   **Icons**: Powered by **Lucide React**.

---

## 🛠️ Technology Stack
*   **Framework**: Next.js 15 (App Router)
*   **Database**: Google Firestore
*   **Authentication**: Firebase Auth (Email/Social)
*   **Styling**: Tailwind CSS & Lucide Icons
*   **Animations**: Framer Motion
*   **Data Processing**: XLSX for Excel handling

---

## 💡 Recommended User-Facing Features (Next Phase)
1.  **Parent Portal**: Allow parents to log in and see their child's attendance history and upcoming lessons.
2.  **Lesson Access**: Digital access for students to download study materials.
3.  **Direct Chat**: Integration between parents and class teachers.
4.  **Event RSVP**: Parents can confirm attendance for church events.

---

## 🔧 Installation & Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up `.env.local` with your Firebase credentials.
4. Run development server: `npm run dev`
