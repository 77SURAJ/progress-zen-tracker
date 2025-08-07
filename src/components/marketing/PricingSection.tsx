import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    description: "Perfect for individuals getting started",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "Personal dashboard",
      "Basic analytics",
      "Mobile app access",
      "Email support",
      "5 projects",
      "Basic integrations"
    ],
    color: "from-blue-500 to-cyan-500",
    popular: false
  },
  {
    name: "Professional",
    icon: Crown,
    description: "Ideal for professionals and small teams",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Everything in Starter",
      "Advanced 3D analytics",
      "Team collaboration",
      "Priority support",
      "Unlimited projects",
      "Advanced integrations",
      "Custom reports",
      "API access"
    ],
    color: "from-purple-500 to-pink-500",
    popular: true
  },
  {
    name: "Enterprise",
    icon: Rocket,
    description: "For large teams and organizations",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Professional",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "Training sessions",
      "24/7 phone support"
    ],
    color: "from-orange-500 to-red-500",
    popular: false
  }
];

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. All plans include our core features
            with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-gradient-primary"
            />
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="bg-gradient-primary text-white">
              Save 20%
            </Badge>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: plan.popular ? 0 : 5,
                transition: { duration: 0.3 }
              }}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <Badge className="bg-gradient-primary text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </Badge>
                </motion.div>
              )}

              <Card className={`h-full relative overflow-hidden ${
                plan.popular 
                  ? 'border-primary/50 shadow-glow bg-card/80' 
                  : 'bg-card/50 border-border/50'
              } backdrop-blur-sm hover:shadow-glow transition-all duration-500 transform-gpu`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardHeader className="text-center pb-8 relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <plan.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="space-y-2">
                    <motion.div
                      key={isYearly ? 'yearly' : 'monthly'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold"
                    >
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg text-muted-foreground font-normal">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </motion.div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground">
                        ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-primary hover:opacity-90 shadow-glow' 
                          : 'bg-background hover:bg-muted border-2 border-border hover:border-primary/50'
                      } transition-all duration-300`}
                      size="lg"
                    >
                      {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Need a custom solution? We've got you covered.
          </p>
          <Button variant="outline" size="lg" className="border-2">
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  );
}