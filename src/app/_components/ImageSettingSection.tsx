import React, {useRef, useState} from 'react'
import {CropIcon, ExpandIcon, ImageIcon, ImageMinus, ImageUpscale, Loader2Icon} from "lucide-react";
import ImageKit from "imagekit";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "sonner";

type Props = {
    selectedEl: HTMLImageElement;
}

const transformOptions = [
    {label: 'Умная обрезка', value: 'smartcrop', icon: <CropIcon/>, transformation: 'fo-auto'},
    {label: 'Добавить тени', value: 'dropshadow', icon: <ExpandIcon/>, transformation: 'e-dropshadow'},
    {label: 'Увеличить', value: 'upscale', icon: <ImageUpscale/>, transformation: 'e-upscale'},
    {label: 'Удалить задний фон', value: 'bgremove', icon: <ImageMinus/>, transformation: 'e-bgremove'},
]

let imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLICKEY!,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATEKEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URLENDPOINT!
})

const ImageSettingSection = ({selectedEl}: Props) => {
    const [altText, setAltText] = useState(selectedEl.alt || '');
    const [width, setWidth] = useState<number>(selectedEl.width || 300);
    const [height, setHeight] = useState<number>(selectedEl.height || 300);
    const [borderRadius, setBorderRadius] = useState(selectedEl.style.borderRadius || '0px')
    const [preview, setPreview] = useState(selectedEl.src || "");
    const [activeTransform, setActiveTransform] = useState<string[]>()
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<File>()
    const [loading, setLoading] = useState(false)
    const toggleTransform = (value: string) => {
        setActiveTransform((prevState) => prevState?.includes(value) ? prevState.filter((t) => t !== value) : [...prevState]
        )
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const saveUploadFile = async () => {
        if (!selectedImage) return;
        setLoading(true);
        try {
            const imageRef = await imagekit.upload({
                file: selectedImage,
                fileName: `${Date.now()}.png`,
            });
            console.log("✅ Uploaded:", imageRef);


            selectedEl.setAttribute("src", imageRef.url + '?tr=');


            setPreview(imageRef.url);
        } catch (err) {
            console.error("Ошибка загрузки:", err);
        } finally {
            setLoading(false);
        }
    };

    const openFileDialog = () => {
        fileInputRef?.current?.click()
    }
    const generateAIImage = () => {
        setLoading(true)
        const  url = process.env.NEXT_PUBLIC_IMAGEKIT_URLENDPOINT + `/ik-genimg-prompt-${altText}/${Date.now()}.png?tr=`;
        setPreview(url);
        selectedEl.setAttribute("src", url);


    }

    const ApplyTransformation = async (trValue: string) => {
        setLoading(true);

        if (!preview.includes(trValue)) {
            const url = preview + trValue + ',';
            setPreview(url)
            selectedEl.setAttribute('src', url)
            toast.success('ИИ улучшение добавлено!')
        } else {
            const url = preview?.replaceAll(trValue + ', ', '')
            setPreview(url)
            selectedEl.setAttribute('src', url)
        }



    }

    return (
        <div className='w-96 shadow p-4 space-y-4'>
            <h2 className='flex gap-2 items-center font-bold'>
                <ImageIcon/>
                Image Settings
            </h2>
            <div className='flex justify-center'>
                <img
                    src={preview}
                    alt={altText}
                    onLoad={() => setLoading(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className='max-h-40 object-contain border rounded cursor-pointer hover:opacity-80 transition'
                />
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <Button type='button' variant='outline' className='w-full' onClick={saveUploadFile}>
                {loading ? <Loader2Icon className='animate-spin text-primary'/> : <ImageIcon/>}
                Загрузить изображение
            </Button>
            <div>
                <label className='text-sm'>ПРОМПТ</label>
                <Input type='text' value={altText} onChange={(e) => setAltText(e.target.value)}
                placeholder='Введите промпт для генерации'
                       className='mt-1'
                />
            </div>
            <Button className='w-full' onClick={generateAIImage} disabled={loading}>
                {loading ? <Loader2Icon className='animate-spin text-primary'/> : <ImageIcon/>}
                Сгенерировать BИ
            </Button>
            <div>
                <label  className='text-sm mb-1 block'>ИИ Улучшения</label>
                <div className='flex gap-2 flex-wrap'>
                    <TooltipProvider>
                        {transformOptions.map((opt) => {
                            const applied = activeTransform?.includes(opt.value);
                            return (
                                <Tooltip key={opt.value}>
                                    <TooltipTrigger asChild={true}>
                                        <Button type='button' variant={preview?.includes(opt.transformation)  ? 'default' : 'outline'}
                                                className='flex items-center justify-center'
                                                onClick={() => ApplyTransformation(opt.transformation)}
                                        >
                                            {opt.icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {opt.label} {applied && '(Applied)'}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </div>
            </div>


        </div>
    )
}
export default ImageSettingSection
