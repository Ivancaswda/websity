import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {CodeIcon, Download, EyeIcon, MonitorIcon, SquareArrowOutUpRight} from "lucide-react";
import {FaMobile} from "react-icons/fa";
import ViewCodeBlock from "@/app/_components/ViewCodeBlock";


const HTML_CODE =  `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template" />
        <title>AI Website Builder</title>

        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <!-- Font Awesome -->
        <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
              integrity="sha512-SnH5W+zQj+Mj7Vp7bXE5s29LNlX6j+CWEJxg7FqgOpM81R1+a5/fQ1fJb01T2uE5wP5yQ5u15UA=="
              crossorigin="anonymous"
              referrerpolicy="no-referrer" />

        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- AOS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

        <!-- GSAP -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <!-- Lottie -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

        <!-- Swiper -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

        <!-- Tippy.js -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body class="bg-gray-50 text-gray-900">
        <div id="root">
        {code}
        
</div>
      </body>
      </html>
    `

const WebPageTools = ({selectedScreenSize, setSelectedScreenSize, generatedCode}:any) => {

    const [finalCode, setFinalCode] =  useState();

    useEffect(() => {
        if (!generatedCode) return;

        let clean = generatedCode
            // убрать markdown обёртки
            .replace(/```html|```/g, '')
            // убрать <html ...> и </html>
            .replace(/<\/?html[^>]*>/g, '')
            // убрать <!DOCTYPE ...> если вдруг есть
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            // подрезать пробелы
            .trim();

        const final = HTML_CODE.replace('{code}', clean);
        setFinalCode(final);
    }, [generatedCode]);

    const viewInNewTab = () => {
        if (!generatedCode) return;



        const blob = new Blob([finalCode], {type: 'text/html'})
        const url  = URL.createObjectURL(blob);
        window.open(url, "_blank")
    }
    const downloadCode = () => {
        const blob = new Blob([finalCode ?? ''], {type: 'text/html'})
        const url  = URL.createObjectURL(blob);
        const anchorTag = document.createElement('a')
        anchorTag.href = url;
        anchorTag.download = 'code.html'
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag)
        URL.revokeObjectURL(url);
    }

    return (
        <div className='p-2 shadow rounded-xl flex gap-2 '>
            <div className='flex gap-2'>
                <Button className={`${selectedScreenSize ? 'border border-primary' : ''}`} onClick={() => setSelectedScreenSize('web')} >
                    <MonitorIcon/>
                </Button>
                <Button className={`${selectedScreenSize ? 'border-primary border' : ''}`}  onClick={() => setSelectedScreenSize('mobile')} variant='ghost'>
                    <FaMobile/>
                </Button>
            </div>
            <div className='flex items-cetner gap-2'>
                <Button onClick={() => viewInNewTab()}>

                    <SquareArrowOutUpRight/>
                </Button>
                <ViewCodeBlock code={finalCode}>
                        <Button>
                            <CodeIcon/>
                        </Button>
                </ViewCodeBlock>
                <Button variant='outline'>
                    <EyeIcon/>
                </Button>
                <Button onClick={downloadCode}>
                    <Download/>
                </Button>
            </div>
        </div>
    )
}
export default WebPageTools
