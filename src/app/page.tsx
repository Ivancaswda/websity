'use client'
import React from 'react'

import {Button} from "@/components/ui/button";
import {motion} from 'framer-motion'
import Navbar from "@/app/_components/Navbar";
import Link from "next/link";
import Hero from "@/app/_components/Hero";
import {ArrowUp} from "lucide-react";
import Footer from "@/app/_components/Footer";
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";


const HomePage = () => {

    const testimonials = [
        {
            quote:
                "Это было лучшее из времён, это было худшее из времён. Так же и с технологиями: Websity превращает хаос идей в ясный, красивый сайт — будто волшебство, только с ИИ.",
            name: "Чарльз Диккенс",
            title: "Автор классических историй, вдохновлённых инновациями",
        },
        {
            quote:
                "Быть или не быть онлайн — вот в чём вопрос. Websity делает выбор очевидным: создать сайт проще, чем написать сонет.",
            name: "Уильям Шекспир",
            title: "Драматург цифровой эпохи",
        },
        {
            quote:
                "Всё, что мы видим или представляем, — всего лишь идея, пока Websity не превратит её в настоящий сайт.",
            name: "Эдгар Аллан По",
            title: "Мастер вдохновения и воображения",
        },
        {
            quote:
                "Общеизвестная истина: любой бизнес, обладающий хорошим продуктом, должен иметь сайт — особенно, если он создан с помощью Websity.",
            name: "Джейн Остин",
            title: "Писательница, ценящая гармонию и эстетику",
        },
        {
            quote:
                "Зовите меня Исмаил. Когда-то я искал смысл в безбрежном океане идей. Теперь я просто открываю Websity и создаю сайт, который говорит сам за себя.",
            name: "Герман Мелвилл",
            title: "Путешественник по волнам вдохновения",
        },
    ];

    return (
        <div >

            <Navbar/>
            <Hero/>
            <div className='flex items-center justify-center w-full mb-4'>
                <Button >
                    <Link className='flex items-center gap-3' href='/workspace'>
                        <ArrowUp/>
                        Начать сейчас
                    </Link>

                </Button>
            </div>
            <motion.div
                className="grid mt-6 grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
            >
                {[
                    {
                        title: "Мощный ИИ-конструктор",
                        desc: "Создавайте полноценные сайты всего по одному запросу — без кода, без шаблонов.",
                        icon: "🤖",
                    },
                    {
                        title: "Мгновенный запуск",
                        desc: "Проект генерируется за считанные секунды. Вы сразу видите результат в реальном времени.",
                        icon: "⚡",
                    },
                    {
                        title: "Гибкость и стиль",
                        desc: "Настраивайте дизайн, тексты и структуру. Websity подстроится под ваш бренд.",
                        icon: "🎨",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        className="p-6 border rounded-2xl bg-sidebar/50 dark:bg-sidebar/70 backdrop-blur-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <div className="text-4xl mb-4">{card.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-primary text-primary">
                            {card.title}
                        </h3>
                        <p className="text-muted-foreground">{card.desc}</p>
                    </motion.div>
                ))}
            </motion.div>


            <section className="py-20 mt-20 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-20">Как работает Websity</h2>
                <div className="grid mt-8 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: "1",
                            title: "Опиши свою идею",
                            desc: "Напиши, какой сайт тебе нужен — например, лендинг кофейни или портфолио дизайнера.",
                        },
                        {
                            step: "2",
                            title: "ИИ создаёт сайт",
                            desc: "Websity анализирует запрос и генерирует современный адаптивный сайт за секунды.",
                        },
                        {
                            step: "3",
                            title: "Редактируй и публикуй",
                            desc: "Добавь свои тексты, фото и стиль. Готово — сайт уже онлайн!",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="p-8 rounded-2xl border bg-sidebar/50 dark:bg-sidebar/70 backdrop-blur-md"
                        >
                            <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>
            <Footer/>

        </div>
    )
}
export default HomePage
