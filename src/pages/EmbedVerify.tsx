import { useEffect } from "react";
import DocumentVerify from "./DocumentVerify";

/**
 * Standalone embed page for white-label integration.
 * Renders DocumentVerify in embedded mode and communicates
 * results to the parent window via postMessage.
 */
const EmbedVerify = () => {
  useEffect(() => {
    // Listen for config messages from parent
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "DOCVERIFY_CONFIG") {
        // Could apply branding config here in the future
        console.log("Received config from parent:", e.data.config);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return <DocumentVerify embedded />;
};

export default EmbedVerify;
