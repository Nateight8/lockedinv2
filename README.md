# 🚀 Kickstart - Modern Authentication Starter Kit

Kickstart is a full-featured project starter kit that provides magic link and OAuth authentication with user management out of the box. Built with Next.js, TypeScript, and Prisma, it's designed to help you quickly bootstrap secure, production-ready applications.

## ✨ Features

- **Magic Link Authentication** - Passwordless login via email
- **OAuth 2.0 Integration** - Social login with popular providers
- **JWT & Session Management** - Secure token-based authentication
- **User Management** - Profile management and account settings
- **Responsive UI** - Built with modern design principles
- **TypeScript First** - Full type safety across the stack
- **GraphQL API** - Flexible and efficient data fetching
- **Prisma ORM** - Type-safe database access
- **Redis Caching** - Improved performance with Redis

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT, Magic Links, OAuth 2.0
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **ORM**: Prisma
- **Caching**: Redis
- **Testing**: Jest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker (for Redis)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kickstart.git
   cd kickstart
   ```

2. Install dependencies:
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `client/web` and `server` directories
   - Update the environment variables with your configuration

4. Start the development servers:
   ```bash
   # Start the server
   cd server
   pnpm dev
   
   # In a new terminal, start the client
   cd ../client/web
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Project Structure

```
├── client/                  # Frontend application
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # Reusable components
│       │   └── lib/         # Utility functions
│
├── server/                  # Backend application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication logic
│   │   ├── graphql/        # GraphQL resolvers and type definitions
│   │   └── lib/            # Utility functions
│   └── index.ts            # Server entry point
```

## 🔐 Authentication

Kickstart supports multiple authentication methods:

1. **Magic Link** - Passwordless login via email
2. **OAuth 2.0** - Social login with providers like Google, GitHub, etc.
3. **Email/Password** - Traditional email and password login

### Environment Variables

Create `.env` files in both `client/web` and `server` directories based on the provided `.env.example` files.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://react-query.tanstack.com/)
- [Passport.js](http://www.passportjs.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Contact

Your Name - [@your-twitter](https://twitter.com/your-twitter)

Project Link: [https://github.com/your-username/kickstart](https://github.com/your-username/kickstart)
