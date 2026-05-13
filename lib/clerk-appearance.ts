import { dark } from "@clerk/ui/themes"

/**
 * Clerk `dark` theme with colors from app CSS variables (globals.css).
 */
export const clerkAppearance = {
  theme: dark,
  variables: {
    fontFamily:
      "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons:
      "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    colorPrimary: "var(--primary)",
    colorBackground: "var(--background)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorInputBackground: "var(--card)",
    colorInputText: "var(--foreground)",
    colorNeutral: "var(--muted)",
    colorSuccess: "var(--state-success)",
    colorDanger: "var(--destructive)",
    colorWarning: "var(--state-warning)",
    colorShimmer: "var(--muted-foreground)",
    borderRadius: "var(--radius)",
  },
}
