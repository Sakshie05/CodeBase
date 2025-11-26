# 🚀 CodeBase

A full-stack GitHub-inspired version control platform with AWS integration and CLI tools

CodeBase is a feature-rich repository management system that replicates core GitHub functionality, enabling developers to create, manage, and collaborate on projects with version control, issue tracking, and cloud storage capabilities.

## ✨ Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication
- User profiles with activity heatmaps
- Public/private repository visibility controls
- Personalized dashboards

### 📁 Repository Management
- Create and manage repositories
- Multi-file upload support with Multer
- Public/private visibility toggles
- Fork repositories with automatic linking
- Star/unstar repositories
- Real-time repository search and filtering

### 🐛 Issue Tracking System
- Create, update, and delete issues
- Link issues to repositories
- Track issue status (open/closed)
- Owner-based permissions

### ⭐ Social Features
- Star repositories to show appreciation
- Fork repositories to create copies
- View starred repositories in profile
- Track repository popularity with star/fork counts

### 📊 Activity Visualization
- Contribution heatmap
- 12-month activity tracking
- Color-coded contribution intensity
- Automatic activity logging for all actions

### ☁️ AWS Integration
- AWS S3 for cloud storage
- Push/pull repositories to/from cloud
- Seamless integration with local version control

### 💻 Command Line Interface (CLI)
Replicated Git commands for version control:
- `codebase init` - Initialize a new repository
- `codebase add <file>` - Stage files for commit
- `codebase commit <message>` - Commit staged changes
- `codebase push` - Push commits to AWS S3
- `codebase pull` - Pull changes from AWS S3
- `codebase revert <commitID>` - Revert to a specific commit

### 🎨 Modern UI/UX
- Dark theme
- Responsive design with Tailwind CSS
- Intuitive navigation and workflows
- Real-time updates with Socket.io

## 🛠️ Tech Stack

### Frontend
- **React** - UI library with modern hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **Multer** - File upload middleware
- **JWT** - JSON Web Tokens for authentication

### Cloud & CLI
- **AWS S3** - Cloud storage for repositories
- **Yargs** - CLI argument parsing
- **fs/promises** - File system operations

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- AWS Account (for cloud features)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/codebase.git
cd codebase
```

### Backend Setup
```bash
cd Backend
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
```

### Frontend Setup
```bash
cd Frontend
npm install
```

### Start the Application

**Backend:**
```bash
cd Backend
node index.js start
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

The application will run on:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 💡 Usage

### Web Application

**Sign Up/Login**
- Create an account or login with existing credentials
- Access your personalized dashboard

**Create a Repository**
- Click "New" button in the sidebar
- Add repository details and upload files
- Set visibility (public/private)

**Manage Issues**
- Navigate to any repository
- Switch to "Issues" tab
- Create, view, or delete issues

**Star & Fork**
- Star repositories you like
- Fork repositories to create your own copy
- View all starred repos in your profile

**Track Activity**
- View your contribution heatmap in profile
- See all your activity for the past year

### CLI Commands

Initialize version control:
```bash
node index.js init
```

Stage files:
```bash
node index.js add index.js
node index.js add .
```

Commit changes:
```bash
node index.js commit "Initial commit"
```

Push to AWS S3:
```bash
node index.js push
```

Pull from AWS S3:
```bash
node index.js pull
```

Revert to previous commit:
```bash
node index.js revert abc123def456
```

## 🔑 Key Features Explained

### Activity Heatmap
Tracks user contributions automatically:
- Repository creation
- Issue management
- Toggle visibility
- Delete operations
- Star/fork actions

Data persists in localStorage and displays as a color-coded calendar grid.

### Star/Fork System
- **Star**: Bookmark repositories you like (can unstar)
- **Fork**: Create a complete copy of a repository
- Automatically links forked repos to originals
- Prevents duplicate forks
- Owners cannot fork their own repositories

### File Upload System
- Upload multiple files simultaneously
- Supports code files (.js, .jsx, .ts, .tsx, .py, .java, .cpp, .c)
- Supports documents (.txt, .md, .json, .pdf)
- 10MB file size limit
- Files stored temporarily on server and content saved to MongoDB

### Version Control CLI
Replicates Git workflow:
- Initialize repository tracking
- Stage files for commit
- Commit with descriptive messages
- Push to AWS S3 for backup
- Pull from AWS S3 to restore
- Revert to any previous commit

## 🚀 API Endpoints

### Authentication
- `POST /signup` - Create new user
- `POST /login` - User login

### Repositories
- `POST /repo/create` - Create repository
- `GET /repo/allRepos` - Get all repositories
- `GET /repo/:id` - Get repository by ID
- `GET /repo/user/:userId` - Get user's repositories
- `GET /repo/starred/:userId` - Get starred repositories
- `POST /repo/star/:id` - Star/unstar repository
- `POST /repo/fork/:id` - Fork repository
- `PATCH /repo/toggle/:id` - Toggle visibility
- `DELETE /repo/delete/:id` - Delete repository

### Issues
- `POST /issue/create` - Create issue
- `GET /issue/:id` - Get issues by repository
- `PUT /issue/update/:id` - Update issue
- `DELETE /issue/delete/:id` - Delete issue

## 🎯 Future Enhancements
- Pull request functionality
- Branch management
- Merge conflicts resolution
- Email notifications
- Collaboration tools (contributors, teams)
- Repository insights and analytics

## 👨‍💻 Author

**Sakshi**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by GitHub's design and functionality
- Built as a learning project to understand full-stack development

## 📸 Screenshots

### Authentication Pages
<img width="1915" height="864" alt="image" src="https://github.com/user-attachments/assets/f4ec6e97-d5be-4316-a45b-be5c783f8919" />
<img width="1895" height="852" alt="image" src="https://github.com/user-attachments/assets/8a42e3da-53b1-4452-ab07-e2136cae341e" />

### Dashboard
<img width="1881" height="868" alt="image" src="https://github.com/user-attachments/assets/6d2d5123-3098-4507-9276-de6b68990283" />

### Repository View
<img width="1894" height="840" alt="image" src="https://github.com/user-attachments/assets/63b9f214-0426-42db-86e2-295f7d4e4ed0" />
<img width="1827" height="837" alt="image" src="https://github.com/user-attachments/assets/0fc05aad-fcb4-4175-88f1-b483351610a2" />
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/9e44f349-8d5b-4551-ae1b-b9463fd80019" />
<img width="1867" height="866" alt="image" src="https://github.com/user-attachments/assets/f4a658ca-3434-40e1-af2f-d68421c34756" />
<img width="1884" height="839" alt="image" src="https://github.com/user-attachments/assets/64a8ac7d-9f77-4c15-bdb8-fc9f4e5861a6" />
<img width="1898" height="854" alt="image" src="https://github.com/user-attachments/assets/5951f1ed-9e9d-4832-8571-3fc8e9ab6901" />


### Profile & Heatmap
<img width="1896" height="837" alt="image" src="https://github.com/user-attachments/assets/a32b67ae-a671-4c53-9e3b-e996f948919d" />
<img width="1843" height="842" alt="image" src="https://github.com/user-attachments/assets/ffbe1d7a-04a3-4383-80ea-a11f524bc878" />

---

⭐ **Star this repository if you find it helpful!**

🍴 **Fork it to create your own version!**

Built with ❤️ by [Sakshi]
