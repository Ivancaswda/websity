"use client";
import React, { useEffect, useRef, useState } from "react";
import WebPageTools from "@/app/_components/WebPageTools";
import ElementSettings from "@/app/_components/ElementSettings";
import ImageSettingSection from "@/app/_components/ImageSettingSection";
import {useOnSaveData} from "@/context/OnSaveProvider";
import {toast} from "sonner";
import axios from "axios";
import {useParams, useSearchParams} from "next/navigation";

type Props = {
    generatedCode: string;
};

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template" />
  <title>AI Website Builder</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Flowbite -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!-- Font Awesome -->
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        crossorigin="anonymous" />

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
  <div id="root"></div>
</body>
</html>
`;

const WebsiteDesign = ({ generatedCode }: Props) => {
    const {projectId} = useParams()
    const params = useSearchParams()
    const frameId = params.get('frameId')
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedScreenSize, setSelectedScreenSize] = useState<"mobile" | "web">("web");
    const [selectedElement, setSelectedElement] = useState(null)
    const {onSaveData, setOnSaveData} = useOnSaveData();

    useEffect(() => {
        onSaveData && onSaveCode()
    }, [onSaveData]);

    const onSaveCode = async () => {
        if (iframeRef?.current) {
            try {
                const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                if (iframeDoc) {
                    const cloneDoc = iframeDoc.documentElement.cloneNode(true) as HTMLElement;
                    const allElements = cloneDoc.querySelectorAll<HTMLElement>('*');
                    allElements.forEach((el) => {
                        el.style.outline = '';
                        el.style.cursor = ''
                    });

                    const html =  cloneDoc.outerHTML;

                     await axios.put('/api/frames', {
                        designCode: html,
                        frameId,
                        projectId
                    });

                    toast.success('Вебсайт Сохранен!');



                }
            } catch (error) {
                toast.error('Не удалось сохранить код!');
            }
        }
    }

    useEffect(() => {
        if (!iframeRef.current) return;
        const iframe = iframeRef.current;

        iframe.onload = () => {
            const doc = iframe.contentWindow?.document;
            if (!doc || !doc.body) return;

            let hoverEl: HTMLElement | null = null;
            let selectedEl: HTMLElement | null = null;

            const handleMouseOver = (e: MouseEvent) => {
                if (selectedEl) return;
                const target = e.target as HTMLElement;
                if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
                hoverEl = target;
                hoverEl.style.outline = "2px dotted blue";
            };

            const handleMouseOut = () => {
                if (selectedEl) return;
                if (hoverEl) {
                    hoverEl.style.outline = "";
                    hoverEl = null;
                }
            };

            const handleClick = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const target = e.target as HTMLElement;

                if (selectedEl && selectedEl !== target) {
                    selectedEl.style.outline = "";
                    selectedEl.removeAttribute("contenteditable");
                }

                selectedEl = target;
                selectedEl.style.outline = "2px solid red";
                selectedEl.setAttribute("contenteditable", "true");
                selectedEl.focus();
                console.log("Selected element:", selectedEl);
                setSelectedElement(selectedEl)
            };

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape" && selectedEl) {
                    selectedEl.removeAttribute("contenteditable");
                    selectedEl.style.outline = "";
                    selectedEl = null;
                }
            };

            doc.body.addEventListener("mouseover", handleMouseOver);
            doc.body.addEventListener("mouseout", handleMouseOut);
            doc.body.addEventListener("click", handleClick);
            doc.body.addEventListener("keydown", handleKeyDown);
        };


        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(template);
            doc.close();
        }
    }, []);

    useEffect(() => {
        if (!iframeRef.current) return;

        const doc  = iframeRef.current.contentDocument;
        if (!doc) return;
        const root = doc.getElementById('root');
        if (root) {
            root.innerHTML = generatedCode?.replaceAll("```html", '').replaceAll("```", "").replace('html', '') ?? ''
        }

    }, [generatedCode]);


    return (
        <div className='w-full flex gap-2'>


            <div className="flex-1 h-[91vh] border-l w-full flex flex-col items-center justify-center">
                <iframe
                    ref={iframeRef}
                    title="AI Website Preview"
                    className={`${selectedScreenSize === "web" ? "w-full" : "w-130"} h-full bg-white`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
                <WebPageTools
                    generatedCode={generatedCode}
                    selectedScreenSize={selectedScreenSize}
                    setSelectedScreenSize={setSelectedScreenSize}
                />
            </div>
            {selectedElement?.tagName === 'IMG' ? <ImageSettingSection selectedEl={selectedElement} /> :
                <ElementSettings selectedEl={selectedElement} clearSelection={() => setSelectedElement(null)}/>
            }
           </div>
    );
};

export default WebsiteDesign;
