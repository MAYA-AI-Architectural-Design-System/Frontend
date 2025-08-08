"use client";

import { useEffect } from "react";

export default function ElevenLabsWidgetFallback() {
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]',
    );
    const existingWidget = document.querySelector("elevenlabs-convai");

    // If widget already exists, don't create another one
    if (existingWidget) {
      return;
    }

    // Create the widget element with your exact code
    const widgetElement = document.createElement("elevenlabs-convai");
    widgetElement.setAttribute(
      "agent-id",
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_5101k196114cfwbt26y8npftf2zj",
    );

    // Append the widget to the body
    document.body.appendChild(widgetElement);

    // Only add script if it doesn't already exist
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (document.body.contains(widgetElement)) {
        document.body.removeChild(widgetElement);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
