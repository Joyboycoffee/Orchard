import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TreePine, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <TreePine className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-serif">404 — Page Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The apple branch or product page you are looking for has been moved or pruned.
        </p>
      </div>

      <Link href="/">
        <Button size="lg" className="rounded-2xl gap-2 font-bold">
          <ArrowLeft className="h-4 w-4" /> Return to Storefront
        </Button>
      </Link>
    </div>
  );
}
