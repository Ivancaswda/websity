"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {Coins, Stars} from "lucide-react";

const creditOptions = [
    { credits: 5, price: 500, variantId: "12345", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/961db7ee-80a9-4e30-8bed-3259ad456476" },
    { credits: 10, price: 900, variantId: "12346", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/655f7132-2f94-425f-9989-4449ee74f84c" },
    { credits: 15, price: 1300, variantId: "12347", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/3d75fc02-c9f4-4bb1-bcf4-a8062893dbb1" },
    { credits: 20, price: 1600, variantId: "12348", redirect: () => window.location.href = "https://websity.lemonsqueezy.com/buy/122afb0b-1501-4e75-9826-b983708e2595" },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4">
            <div className="max-w-5xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Выберите свой <span className="text-primary">план</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Покупайте звезды для создания сайтов с помощью Websity.
                    Больше звезд — выгоднее!
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
                                    <Stars className="text-primary" /> {plan.credits} звезд
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-2">
                                <p className="text-4xl font-bold text-gray-900">{plan.price} Руб</p>
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
