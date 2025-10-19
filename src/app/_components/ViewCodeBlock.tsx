import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import SyntaxHighlighter from 'react-syntax-highlighter'
import {Button} from "@/components/ui/button";
import {CopyIcon} from "lucide-react";
import {toast} from "sonner";

const ViewCodeBlock = ({children, code}) => {

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        toast.success('Код скопирован!')
    }

    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className='min-w-7xl max-h-[600px] overflow-auto'>
                <DialogTitle >
                    <div className='flex items-center gap-4'>
                        Code
                        <Button onClick={handleCopy}>
                            <CopyIcon/>
                        </Button>
                    </div>

                </DialogTitle>
                <DialogDescription asChild={true}>
                    <div>
                        <SyntaxHighlighter>
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
export default ViewCodeBlock
