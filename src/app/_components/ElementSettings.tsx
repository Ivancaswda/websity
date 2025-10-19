"use client";
import React, { useEffect, useState } from "react";
import { Settings2Icon, X, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    selectedEl: HTMLElement | null;
    clearSelection: () => void;
};

const ElementSettings = ({ selectedEl, clearSelection }: Props) => {
    const [tailwindInput, setTailwindInput] = useState("");
    const [tailwindClasses, setTailwindClasses] = useState<string[]>([]);
    const [textAlign, setTextAlign] = useState("left");
    const [fontSize, setFontSize] = useState("16px");
    const [textColor, setTextColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [margin, setMargin] = useState("");
    const [padding, setPadding] = useState("");


    useEffect(() => {
        if (selectedEl) {
            setTailwindClasses(selectedEl.className?.split(" ")?.filter(Boolean) || []);
            setTextAlign(selectedEl.style?.textAlign || "left");
            setFontSize(selectedEl.style?.fontSize || "16px");
            setTextColor(selectedEl.style?.color || "#000000");
            setBgColor(selectedEl.style?.backgroundColor || "#ffffff");
            setMargin(selectedEl.style?.margin || "");
            setPadding(selectedEl.style?.padding || "");
        } else {

            setTailwindClasses([]);
            setTailwindInput("");
            setTextAlign("left");
            setFontSize("16px");
            setTextColor("#000000");
            setBgColor("#ffffff");
            setMargin("");
            setPadding("");
        }
    }, [selectedEl]);

    const applyStyle = (property: string, value: string) => {
        if (selectedEl) {
            selectedEl.style[property as any] = value;
        }
    };

    const updateClassesOnPage = (updated: string[]) => {
        setTailwindClasses(updated);
        if (selectedEl) {
            selectedEl.className = updated.join(" ");
        }
    };

    const addClass = () => {
        const newClass = tailwindInput.trim();
        if (!newClass) return;
        if (!tailwindClasses.includes(newClass)) {
            const updated = [...tailwindClasses, newClass];
            updateClassesOnPage(updated);
        }
        setTailwindInput("");
    };

    const removeClass = (className: string) => {
        const updated = tailwindClasses.filter((cls) => cls !== className);
        updateClassesOnPage(updated);
    };

    const handleAlignChange = (align: string) => {
        setTextAlign(align);
        applyStyle("textAlign", align);
    };

    if (!selectedEl) {
        return (
            <div className="w-96 shadow p-4">
                <p className="text-sm text-gray-500 italic">
                    Выберите элемент на странице, чтобы редактировать.
                </p>
            </div>
        );
    }

    return (
        <div className="w-96 shadow p-4 flex flex-col gap-3 bg-white rounded-xl">
            <div className="flex justify-between items-center">
                <h2 className="flex gap-2 items-center font-bold text-lg">
                    Настройки <Settings2Icon />
                </h2>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                    Сбросить
                </Button>
            </div>


            <label className="text-sm font-medium">Размер текста</label>
            <Select
                onValueChange={(value) => {
                    setFontSize(value);
                    applyStyle("fontSize", value);
                }}
                value={fontSize}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="font size" />
                </SelectTrigger>
                <SelectContent>
                    {[...Array(40)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 12}px`}>
                            {i + 12}px
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Цвет текста</label>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                        setTextColor(e.target.value);
                        applyStyle("color", e.target.value);
                    }}
                    className="w-[40px] h-[40px] rounded-lg border"
                />
                <label className="text-sm font-medium">Фон</label>
                <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                        setBgColor(e.target.value);
                        applyStyle("backgroundColor", e.target.value);
                    }}
                    className="w-[40px] h-[40px] rounded-lg border"
                />
            </div>


            <label className="text-sm font-medium">Выравнивание текста</label>
            <div className="flex gap-2 w-full">
                <Button
                    variant={textAlign === "left" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleAlignChange("left")}
                >
                    <AlignLeft size={18} />
                </Button>
                <Button
                    variant={textAlign === "center" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleAlignChange("center")}
                >
                    <AlignCenter size={18} />
                </Button>
                <Button
                    variant={textAlign === "right" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleAlignChange("right")}
                >
                    <AlignRight size={18} />
                </Button>
            </div>


            <label className="text-sm font-medium">Внешний отступ (margin)</label>
            <Input
                placeholder="например: 10px или 1rem"
                value={margin}
                onChange={(e) => {
                    setMargin(e.target.value);
                    applyStyle("margin", e.target.value);
                }}
            />

            <label className="text-sm font-medium">Внутренний отступ (padding)</label>
            <Input
                placeholder="например: 10px или 1rem"
                value={padding}
                onChange={(e) => {
                    setPadding(e.target.value);
                    applyStyle("padding", e.target.value);
                }}
            />


            <label className="text-sm font-medium">Tailwind классы</label>
            <div className="flex gap-2">
                <Input
                    placeholder="например: bg-blue-500 p-4 text-white"
                    value={tailwindInput}
                    onChange={(e) => setTailwindInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addClass()}
                />
                <Button onClick={addClass}>Добавить</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {tailwindClasses.length > 0 ? (
                    tailwindClasses.map((cls) => (
                        <span
                            key={cls}
                            className="flex items-center gap-1 bg-gray-100 border border-gray-300 px-2 py-1 rounded-full text-sm"
                        >
              {cls}
                            <button
                                onClick={() => removeClass(cls)}
                                className="hover:text-red-500 text-gray-500"
                                title="Удалить класс"
                            >
                <X size={14} />
              </button>
            </span>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">Классы не добавлены</p>
                )}
            </div>
        </div>
    );
};

export default ElementSettings;
