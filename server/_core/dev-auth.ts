import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerDevAuthRoutes(app: Express) {
    // Simulate the external auth portal login page/callback
    // This route matches what the client redirects to: /app-auth
    app.get("/app-auth", async (req: Request, res: Response) => {
        try {
            // Create a dev user
            const devUser = {
                openId: "dev-user-id",
                name: "Developer",
                email: "dev@local.host",
                loginMethod: "manus",
            };

            await db.upsertUser({
                ...devUser,
                lastSignedIn: new Date(),
            });

            // Create session token directly using the SDK's internal method
            // We are "The Platform" now.
            const sessionToken = await sdk.createSessionToken(devUser.openId, {
                name: devUser.name,
                expiresInMs: ONE_YEAR_MS,
            });

            const cookieOptions = getSessionCookieOptions(req);
            res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

            // Redirect back to home
            res.redirect(302, "/");
        } catch (error) {
            console.error("[DevAuth] Login failed", error);
            res.status(500).json({ error: "Dev login failed" });
        }
    });
}
