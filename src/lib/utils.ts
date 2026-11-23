// cn — joins class names, skipping empty ones (the kokonutui components import it from here).
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
