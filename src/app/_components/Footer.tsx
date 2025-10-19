import React from 'react'
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


                    <div>
                        <Image src='/logo.png' className='rounded-lg' alt='logo' width={50} height={50}/>
                        <p className="text-sm mt-2 text-white/80 mb-4">
                            Создавайте сайты за секунды с помощью искусственного интеллекта.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="hover:text-gray-200">
                                <i className="fab fa-telegram-plane text-xl"></i>
                            </a>
                            <a href="#" className="hover:text-gray-200">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="hover:text-gray-200">
                                <i className="fab fa-github text-xl"></i>
                            </a>
                        </div>
                    </div>


                    <div>
                        <h3 className="text-lg font-semibold mb-3">Навигация</h3>
                        <ul className="space-y-2 text-white/80">
                            <li><a href="/" className="hover:text-white">Главная</a></li>
                            <li><a href="/pricing" className="hover:text-white">Цены</a></li>
                            <li><a href="/playground" className="hover:text-white">Песочница</a></li>
                            <li><a href="/about" className="hover:text-white">О проекте</a></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="text-lg font-semibold mb-3">Поддержка</h3>
                        <ul className="space-y-2 text-white/80">
                            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                            <li><a href="/contact" className="hover:text-white">Контакты</a></li>
                            <li><a href="/policy" className="hover:text-white">Политика конфиденциальности</a></li>
                        </ul>
                    </div>



                </div>

                <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/70">
                    © 2025 Websity. Все права защищены.
                </div>
            </div>
        </footer>

    )
}
export default Footer
