import React from 'react'
import Image from "next/image";
import { cn } from '@/lib/utils';

type Props = {
  imageUrl: string;
  className?: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

// Component to export to respective language
export default function ExportButton({
  imageUrl,
  className,
  comingSoon = false,
  onClick,
}: Props) {
  return (
    <div 
    onClick={onClick}
    className={cn(
      "relative h-9 w-10 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-all",
      className,
    )}>
      <Image 
        width={40}
        height={40}
        src={imageUrl}
        alt="Export to a language"
      />
      {
        comingSoon && <div className='absolute w-full h-full bg-black/60 flex items-center justify-center text-[6px]'>
        </div>
      }
    </div>
  )
}