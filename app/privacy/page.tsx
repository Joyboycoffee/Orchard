import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Data Security</Badge>
        <h1 className="text-4xl font-bold font-serif">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          How Orchard protects your personal information, address records, and payment data.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-8 border space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">1. Information We Collect</h3>
          <p>
            We collect personal information necessary to process orders, including full name, delivery address, phone number, and email. Payment processing is handled via 256-bit encrypted Razorpay gateways; no raw credit card details are stored on our servers.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">2. Use of Data</h3>
          <p>
            Your information is strictly used for order fulfillment, courier delivery updates, and optional seasonal nursery advisory newsletters. We never sell or share customer data with third-party advertisers.
          </p>
        </div>
      </Card>
    </div>
  );
}
