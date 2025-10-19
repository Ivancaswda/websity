"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";

const creditOptions = [
    { credits: 5, price: 50, variantId: "12345", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/ccd6d1b8-3669-42db-a664-5fc60d0d8d9e" },
    { credits: 10, price: 90, variantId: "12346", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/ccd6d1b8-3669-42db-a664-5fc60d0d8d9e" },
    { credits: 15, price: 130, variantId: "12347", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/ccd6d1b8-3669-42db-a664-5fc60d0d8d9e" },
    { credits: 20, price: 160, variantId: "12348", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/ccd6d1b8-3669-42db-a664-5fc60d0d8d9e" },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4">
            <div className="max-w-5xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Выберите свой <span className="text-primary">план</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Покупайте кредиты для создания сайтов с помощью Websity.
                    Больше кредитов — выгоднее!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {creditOptions.map((plan, i) => (
                    <motion.div
                        key={plan.credits}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Card className="border-2 border-transparent hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2 text-gray-900">
                                    <Coins className="text-primary" /> {plan.credits} Кредитов
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <p className="text-4xl font-bold text-gray-900">{plan.price} Рублей</p>
                                <p className="text-gray-500 text-sm">
                                    {plan.credits * 10} генераций контента
                                </p>
                                <Button
                                    onClick={plan.redirect}
                                >
                                    Купить
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 text-center text-gray-500 text-sm">
                * 1 кредит = 10 генераций контента. Кредиты не сгорают.
            </div>
        </div>
    );
}
