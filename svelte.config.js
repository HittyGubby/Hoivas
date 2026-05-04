/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */

const config = {
  // ... other Svelte options
  onwarn: (warning, handler) => {
    // Check if the warning code matches a specific accessibility rule
    if (warning.code === "a11y_no_static_element_interactions") {
      return; // Skips the warning, effectively ignoring it
    }

    // Otherwise, use the default handler
    handler(warning);
  },
};

export default config;
