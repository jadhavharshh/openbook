'use client';

import { clientEnv } from '@/lib/env/client';
import { ThemeProvider } from 'next-themes';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode } from 'react';
import { StudyModeProvider } from '@/contexts/StudyModeContext';
import { UserProvider } from '@/contexts/UserContext';
import { LimitModalProvider } from '@/contexts/LimitModalContext';
import { MotionProvider } from '@/contexts/MotionContext';

if (typeof window !== 'undefined' && clientEnv.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(clientEnv.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always',
    });
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <PostHogProvider client={posthog}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <MotionProvider>
                    <UserProvider>
                        <LimitModalProvider>
                            <StudyModeProvider>{children}</StudyModeProvider>
                        </LimitModalProvider>
                    </UserProvider>
                </MotionProvider>
            </ThemeProvider>
        </PostHogProvider>
    );
}
