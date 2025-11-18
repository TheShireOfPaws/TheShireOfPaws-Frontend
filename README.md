## 🎨 Frontend: User Interface (React.js)

The Frontend provides a modern, accessible interface for viewing animals and interacting with the adoption system. It is built as a Single Page Application (SPA) that consumes the Backend API.

### 🚀 Getting Started

Navigate to the frontend directory and install the necessary dependencies.

```bash
cd the-shire-of-paws/frontend
npm install
# or
yarn install
```
### 🛠️ Tech Stack

* **Framework:** React.js
* **Paradigm:** Functional Programming and React Hooks
* **Architecture:** Component-Based Architecture (focusing on reusable UI/logic components)
* **Styling:** Modular CSS, CSS-in-JS, or a Preprocessor (e.g., SCSS, Tailwind CSS)
* **API Interaction:** Fetch API or Axios
* **Routing:** React Router DOM
* **Testing:** Vitest, Jest (Unit Testing), Cypress (E2E Testing)
* **Standards:** Strong focus on **Accessibility (ARIA/Semantic HTML)** and optimal **User Experience (UX)**.
  
### ✨ Core Features

* **Public Dog Gallery:** Displays cards for all dogs available for adoption, with filters and sorting options.
* **Dog Detail View:** Provides detailed information about a specific dog (history, health, temperament).
* **Adoption Request Form:** A publicly accessible form (no login required) that allows users to submit their pre-adoption interest, which triggers a status change ("Adoption Pending") on the dog profile in the backend.
* **Authentication Flow:** Dedicated Login component for administrators using JWT.
* **Admin Dashboard:**
    * Protected route accessible only by authenticated administrators.
    * Interface for the complete **CRUD** management of Dog profiles.
    * Section to view, filter, and manage (approve/reject) pending Adoption Requests.
    * Ability to approve adoption, registering the adopter's contact info and linking them to the adopted dog.
      
### ⚙️ Configuración de la API

La aplicación frontend necesita comunicarse con el Backend API, que por defecto se ejecuta en el puerto 8080. Para gestionar esto de manera flexible, se recomienda definir la URL base en un archivo de configuración de entorno (`.env`).

Define esta variable en el archivo **`.env`** en la raíz del directorio `frontend`:

### 🏃 Running the Application

After installing dependencies and configuring the API base URL in the .env file, you can start the local development server.

# Navigate to the frontend directory
cd the-shire-of-paws/frontend

# Install dependencies (if not done already)
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev


The application will typically be accessible in your browser at http://localhost:5173 (depending on your build tool configuration).

### 📂 Frontend Project Structure

The project follows a component-based architecture in React, organized logically to ensure scalability, maintainability, and clear separation of concerns (Pages, Components, Services, Hooks, Context).

The core dependencies for API calls will utilize Axios (or Fetch API wrapper) within the services/ directory.
```bash
theshireofpaws-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html (Main entry point)
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/ (Reusable, general-purpose components)
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.module.css
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.module.css
│   │   │   │
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   │
│   │   │   └── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Modal.module.css
│   │   │
│   │   ├── home/ (Components specific to the Landing Page)
│   │   │   ├── Hero/
│   │   │   ├── Stats/
│   │   │   └── About/
│   │   │
│   │   ├── dogs/ (Components related to Dog profiles and browsing)
│   │   │   ├── DogCard/
│   │   │   ├── DogGrid/
│   │   │   ├── DogFilters/
│   │   │   └── DogDetail/
│   │   │
│   │   ├── adoption/ (Components for the Adoption Request process)
│   │   │   └── AdoptionForm/
│   │   │
│   │   └── admin/ (Components for the Admin Dashboard and Authentication)
│   │       ├── LoginModal/
│   │       └── Dashboard/
│   │           ├── DogProfiles.jsx (CRUD table/list)
│   │           └── AdoptionRequests.jsx (Request management)
│   │
│   ├── pages/ (Top-level components defining routes)
│   │   ├── HomePage.jsx
│   │   ├── DogsPage.jsx (Gallery/List)
│   │   ├── DogDetailPage.jsx
│   │   └── AdminDashboardPage.jsx (Protected Route)
│   │
│   ├── services/ (API interaction logic using **Axios**)
│   │   ├── api.js (Axios instance configuration)
│   │   ├── dogService.js (Handles Dog CRUD)
│   │   ├── adoptionService.js (Handles Adoption requests/management)
│   │   └── authService.js (Handles Login, Token management)
│   │
│   ├── hooks/ (Custom hooks for reusable logic)
│   │   ├── useDogs.js
│   │   ├── useAuth.js
│   │   └── useStats.js
│   │
│   ├── context/ (Global state management)
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   ├── constants.js (App-wide fixed values)
│   │   └── validators.js (Form validation logic)
│   │
│   ├── styles/ (Global styling files)
│   │   ├── variables.css
│   │   └── global.css
│   │
│   ├── App.jsx (Main Router component)
│   └── main.jsx (Root rendering)
│
├── index.html
└── package.json
```
