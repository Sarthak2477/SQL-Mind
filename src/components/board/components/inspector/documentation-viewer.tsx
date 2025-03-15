// import { generateDocumentationFromSchema } from '@/actions/documentation-generator';
// import useInspectorStore from '@/stores/inspector';
// import { LoaderCircle } from 'lucide-react';
// import React from 'react'

// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// type Props = {}

// export default function DocumentationViewer({}: Props) {
//   const { documentationText, mainSchemaText, setDocumentationText, setDocumentationBuffering, documentationBuffering } = useInspectorStore();

//   async function handleRegenerateDocumentation() {
//     setDocumentationBuffering(true);
//     const response = await generateDocumentationFromSchema(mainSchemaText);

//     const cleanedResponse = response
//         .replace(/```markdown/g, '')  // Remove ```markdown
//         .replace(/```/g, ''); 
    
//     setDocumentationText(cleanedResponse);
//     setDocumentationBuffering(false);
//   }

//   if ( documentationBuffering ) {
//     return <div className='h-[20vh] flex flex-col items-center justify-center gap-4'>
//       <LoaderCircle size={18} className='animate-spin text-emerald-500' />
//       <span className='text-xs text-gray-500'>Generating documentation...</span>
//     </div>
//   }

//   return (
//     <div className='h-[80vh] overflow-auto'>
//       { documentationText.length > 0 && (
//         <div className='flex flex-col gap-1'>
//           <button 
//             onClick={handleRegenerateDocumentation}
//             className='bg-emerald-500/60 text-white px-2 py-1 rounded-lg text-sm hover:bg-emerald-500/80 w-48'>Regenerate documentation</button>
//           <span className='text-xs text-gray-500'>Regenerate documnetation for the current schema</span>
//         </div>
//       ) }
//       <Markdown
//         className="markdown h-full"
//         remarkPlugins={[
//           remarkGfm,
//         ]}
//       >
//         { documentationText }
//       </Markdown>
//     </div>
//   )
// }