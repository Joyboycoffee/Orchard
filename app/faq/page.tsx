import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "How are fresh apples packaged to prevent damage during transit?",
      answer: "Our Kullu Valley apples are packed in temperature-controlled, molded food-grade pulp crates with individual shock-absorbing sleeves. This guarantees 0% bruising during courier transportation.",
    },
    {
      question: "What is the best time of year to plant M9 feathered saplings?",
      answer: "Dormant bare-root or container-grown M9 feathered saplings should be planted between December and early March. This allows root establishment prior to spring bud break.",
    },
    {
      question: "Are your rootstocks virus-indexed and certified?",
      answer: "Yes. All M9 T337 and Geneva rootstocks supplied by Orchard are imported directly from Naktuinbouw-certified Dutch propagation units with DNA variety verification.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We support Razorpay, UPI (Google Pay, PhonePe, Paytm), All major Credit & Debit cards, NetBanking, and Cash On Delivery (COD).",
    },
    {
      question: "Do you offer bulk pricing for commercial orchards (1,000+ plants)?",
      answer: "Yes! Commercial growers establishing high-density projects can contact our nursery advisory team for custom farm delivery pricing and pre-orders.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="outline">Help Center</Badge>
        <h1 className="text-4xl font-bold font-serif">Frequently Asked Questions</h1>
        <p className="text-sm text-muted-foreground">
          Find instant answers to common questions about nursery orders, rootstock delivery, and cold-chain shipping.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.question} className="glass-card rounded-2xl p-6 border space-y-2">
            <h3 className="font-bold text-base font-serif flex items-center gap-2 text-foreground">
              <HelpCircle className="h-5 w-5 text-primary shrink-0" />
              {faq.question}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed pl-7">
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
