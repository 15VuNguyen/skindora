import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./App.tsx";
import "./index.css";
import { ReactQueryProvider } from "./lib/reactQuery.tsx";
import { store } from "./redux/index.ts";
import { logger } from "./utils/logger.ts";

if (import.meta.env.VITE_SENTRY_DSN_FRONTEND) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN_FRONTEND,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

    environment: import.meta.env.MODE || "development",
  });
} else {
  logger.warn("Sentry DSN for Frontend is not configured. Sentry will not be initialized.");
}
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred (Sentry Fallback)</p>}>
      <ReactQueryProvider>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ReactQueryProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>
);
