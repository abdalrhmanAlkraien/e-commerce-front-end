Create all configuration files based on the documentation:

1. Create .claude/CLAUDE.md with the complete frontend specification
2. Create docs/FRONTEND_ARCHITECTURE.md
3. Create docs/API_INTEGRATION.md (use the E-Commerce OpenAPI spec)
4. Create docs/CODING_STANDARDS.md
5. docs/TEST_SCENARIOS.md - Use existing complete guide (or create if missing)
6. Create .env.example with:
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   NEXT_PUBLIC_APP_NAME=E-Commerce Platform
7. Create .env.local from .env.example
8. Update next.config.js with proper image domains and API rewrites
9. Create tsconfig.json with strict mode enabled

Verify all files are created and formatted correctly.