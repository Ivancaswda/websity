import React, { useRef, useState, useEffect } from 'react';
import { CropIcon, ExpandIcon, ImageIcon, ImageMinus, ImageUpscale, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

type Props = {
    selectedEl: HTMLImageElement | null;
    clearSelection: () => void;
};

const transformOptions = [
    { label: 'Умная обрезка', value: 'smartcrop', icon: <CropIcon />, transformation: 'fo-auto' },
    { label: 'Добавить тени', value: 'dropshadow', icon: <ExpandIcon />, transformation: 'e-dropshadow' },
    { label: 'Увеличить', value: 'upscale', icon: <ImageUpscale />, transformation: 'e-upscale' },
    { label: 'Удалить задний фон', value: 'bgremove', icon: <ImageMinus />, transformation: 'e-bgremove' },
];

const ImageSettingSection = ({ selectedEl, clearSelection }: Props) => {
    const [altText, setAltText] = useState('');
    const [width, setWidth] = useState<number>(300);
    const [height, setHeight] = useState<number>(300);
    const [borderRadius, setBorderRadius] = useState<string>('0px');
    const [preview, setPreview] = useState('');
    const [activeTransform, setActiveTransform] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);


// ✅ Синхронизация данных при выборе другого изображения
useEffect(() => {
    if (selectedEl) {
        setAltText(selectedEl.alt || '');
        setWidth(selectedEl.width || 300);
        setHeight(selectedEl.height || 300);
        setBorderRadius(selectedEl.style.borderRadius || '0px');
        setPreview(selectedEl.src || '');
    } else {
        // Если элемент сброшен
        setAltText('');
        setWidth(300);
        setHeight(300);
        setBorderRadius('0px');
        setPreview('');
    }
}, [selectedEl]);

// ✅ Автообновление DOM при изменении width/height/borderRadius
useEffect(() => {
    if (!selectedEl) return;
    selectedEl.width = width;
    selectedEl.height = height;
    selectedEl.style.borderRadius = borderRadius;
}, [width, height, borderRadius, selectedEl]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    }
};

const saveUploadFile = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const res = await fetch("/api/image-upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.url) {
            selectedEl?.setAttribute("src", data.url);
            setPreview(data.url);
            toast.success("Изображение загружено!");
        } else {
            toast.error("Ошибка загрузки");
        }
    } catch (err) {
        console.error(err);
        toast.error("Ошибка сервера");
    } finally {
        setLoading(false);
    }
};

const generateAIImage = async () => {
    if (!altText.trim()) {
        toast.error("Введите промпт для генерации изображения");
        return;
    }
    setLoading(true);
    try {
        const res = await fetch("/api/image-generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: altText }),
        });
        const data = await res.json();
        if (data.url) {
            selectedEl?.setAttribute("src", data.url);
            setPreview(data.url);
            toast.success("Изображение сгенерировано!");
        } else {
            toast.error(data.error || "Не удалось сгенерировать изображение");
        }
    } catch (err) {
        console.error(err);
        toast.error("Ошибка сервера");
    } finally {
        setLoading(false);
    }
};

const ApplyTransformation = (trValue: string) => {
    if (!preview) return;
    let url = preview;
    if (!preview.includes(trValue)) url += trValue + ',';
    else url = preview.replaceAll(trValue + ',', '');
    setPreview(url);
    selectedEl?.setAttribute('src', url);
    toast.success('ИИ улучшение обновлено!');
};

if (!selectedEl) {
    return (
        <div className="w-96 shadow p-4 bg-white rounded-xl">
            <p className="text-gray-500 text-sm italic">
                Выберите изображение для редактирования.
            </p>
        </div>
    );
}

return (
    <div className='w-96 shadow p-4 space-y-4 bg-white rounded-xl'>
        <div className="flex justify-between items-center">
            <h2 className='flex gap-2 items-center font-bold'>
                <ImageIcon /> Настройки изображения
            </h2>
            <Button variant="outline" size="sm" onClick={clearSelection}>
                Сбросить
            </Button>
        </div>

        <div className='flex justify-center'>
            <img
                src={preview}
                alt={altText}
                onLoad={() => setLoading(false)}
                onClick={() => fileInputRef.current?.click()}
                className='max-h-40 object-contain border rounded cursor-pointer hover:opacity-80 transition'
                style={{ width, height, borderRadius }}
            />
        </div>

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        <Button type='button' variant='outline' className='w-full' onClick={saveUploadFile}>
            {loading ? <Loader2Icon className='animate-spin text-primary' /> : <ImageIcon />}
            Загрузить изображение
        </Button>

        <div>
            <label className='text-sm'>ПРОМПТ</label>
            <Input
                type='text'
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder='Введите промпт для генерации'
                className='mt-1'
            />
        </div>

        <Button className='w-full' onClick={generateAIImage} disabled={loading}>
            {loading ? <Loader2Icon className='animate-spin text-primary' /> : <ImageIcon />}
            Сгенерировать с ИИ
        </Button>

        <div className='flex gap-2'>
            <div className='flex-1'>
                <label className='text-sm'>Ширина (px)</label>
                <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            </div>
            <div className='flex-1'>
                <label className='text-sm'>Высота (px)</label>
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            </div>
        </div>

        <div>
            <label className='text-sm'>Border Radius</label>
            <Input type="text" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} placeholder="например 10px или 50%" />
        </div>

        <div>
            <label className='text-sm mb-1 block'>ИИ Улучшения</label>
            <div className='flex gap-2 flex-wrap'>
                <TooltipProvider>
                    {transformOptions.map((opt) => (
                        <Tooltip key={opt.value}>
                            <TooltipTrigger asChild={true}>
                                <Button
                                    type='button'
                                    variant={preview?.includes(opt.transformation) ? 'default' : 'outline'}
                                    className='flex items-center justify-center'
                                    onClick={() => ApplyTransformation(opt.transformation)}
                                >
                                    {opt.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{opt.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    </div>
);


};

export default ImageSettingSection;
