import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CertificationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Quality Compliance</Badge>
        <h1 className="text-4xl font-bold font-serif">Certifications & Accreditation</h1>
        <p className="text-sm text-muted-foreground">
          European phytosanitary certificates, Dutch lineage lineage logs, and organic produce standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg font-serif">Naktuinbouw Elite Virus-Free</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All M9 T337 rootstocks carry Naktuinbouw Dutch phytosanitary certificates confirming 0% latent virus infection (Apple Chlorotic Leaf Spot / Stem Grooving).
          </p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg font-serif">Organic Produce Certification</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our fresh Honeycrisp and Gala apples are grown under strict organic integrated pest management (IPM) guidelines without synthetic post-harvest waxes.
          </p>
        </Card>
      </div>
    </div>
  );
}
