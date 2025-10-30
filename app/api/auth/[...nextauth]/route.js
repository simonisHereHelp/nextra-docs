    // app/api/auth/[...nextauth]/route.ts
    import { handlers } from "@/auth"; // Assuming auth.ts is in your project root

    export const { GET, POST } = handlers;