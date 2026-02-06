import React from "react";

type PricingPlan = {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  isActive?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    features: [
      "There live the blind texts",
      "Far far away behind the word",
      "Far from the countries Vokalia and Consonantia",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Standard",
    price: "19.99",
    features: [
      "There live the blind texts",
      "Far far away behind the word",
      "Far from the countries Vokalia and Consonantia",
    ],
    buttonText: "Get Started",
    isActive: true,
  },
  {
    name: "Premium",
    price: "79.99",
    features: [
      "There live the blind texts",
      "Far far away behind the word",
      "Far from the countries Vokalia and Consonantia",
    ],
    buttonText: "Get Started",
  },
];

export default function PricingSection(){
  return (
    <section id="pricing-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading mb-4">Pricing</h2>
          <p className="text-xl text-gray-600">
            Pricing for everyone. Choose your plan now!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.isActive
                    ? "ring-2 ring-blue-600 transform scale-105"
                    : "hover:scale-105"
                }`}
              >
                {/* Popular badge */}
                {plan.isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan name & price */}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      {plan.price !== "0" && (
                        <span className="text-gray-600 ml-2">/month</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="ul-check mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-gray-700">
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="text-center">
                    <a
                      href="#"
                      className={`inline-block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        plan.isActive
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {plan.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include 24/7 support and 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
