"use client"
import Image from 'next/image';
import react, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import Loading from '@/components/molecules/bittensor/loading';
const { Option } = Select;

type ConversationType = {
    sourceLang: string;
    targetLang: string;
    sourceText: string;
    translatedText: string;
}

const languages = [
    { code: "ar", name: "Arabic" },
    { code: "bg", name: "Bulgarian" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "et", name: "Estonian" },
    { code: "fa", name: "Persian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "it", name: "Italian" },
    { code: "ko", name: "Korean" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sv", name: "Swedish" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "vi", name: "Vietnamese" },
    { code: "zh", name: "Chinese" }
];


const BittensorSubnetTranslate = () => {
    const inputRef = useRef<HTMLInputElement|null>(null);
    const [conversation, setConversation] = useState<ConversationType[]>([]);
    const [inputVal, setInputValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [sourceLang, setSourceLang] = useState<string>("en");
    const [targetLang, setTargetLang] = useState<string>("en");

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                sendMessage();
            }
         }
         
         const inputElement = inputRef.current!;
   
         if(inputElement) {
            inputElement.addEventListener('keypress', handleKeyPress);
   
            return () => {
               inputElement.removeEventListener('keypress', handleKeyPress);
            };
         }

    }, [inputVal]);

    
    const onSendQueryHandle = async() => {

        const data = {
            sourceLang  : sourceLang,
            targetLang  : targetLang,
            sourceText  : inputVal,
            translatedText: ''
        }

        setConversation(prev =>  [...prev, data]);

        setLoading(true);

        const response = await fetch('/api/bittensor-translate', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if(response.status == 200) {
            const result = await response.json();
            const translatedText = result.data[0]['translated_texts'][0];
            
            setConversation(prevLanguages => {
                const updatedLanguages = [...prevLanguages]; 
                const lastLanguageIndex = updatedLanguages.length - 1;
                if (lastLanguageIndex >= 0) {
                    updatedLanguages[lastLanguageIndex] = { ...updatedLanguages[lastLanguageIndex], translatedText: translatedText }
                }
                return updatedLanguages;
            });

        }
        setLoading(false);
    }
    

    const sendMessage = () => {
        if(inputVal == '') {
            return;
        }

        onSendQueryHandle();
        setInputValue('');
    }
    

    return (
        <div className='border-[2px] border-[#f2f2f2] rounded-[20px] sm:px-[10px] py-[60px] relative'>
            {
                loading && <Loading/>
            }
            <div className='h-[640px] mb-[30px] subnet-chat-content overflow-y-scroll'>
                <div className='mx-[10px] sm:mx-[30px]'>
                    {
                        conversation.map((item, idx) => (
                            <div key={idx} className="flex justify-start items-start mb-4">
                                <div className="mr-2 py-3 px-4 bg-blue-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white" >
                                    <span className='text-[18px] font-bold'>{languages.find(_item => _item.code === item.sourceLang)?.name}: </span> {item.sourceText}
                                    <br />
                                    <hr />
                                    <span className='text-[18px] font-bold'>{languages.find(_item => _item.code === item.targetLang)?.name}: </span> {item.translatedText}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

           
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex justify-center items-center gap-x-3 w-full px-[20px]">
                <Select showSearch  style={{ width: 100 }} placeholder="Source"value={sourceLang} onChange={(val) => setSourceLang(val)}
                    optionFilterProp="children"  filterOption={(input: string, option : any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        languages.map((item, idx) => (
                            <Option key={idx} value={item.code}>{item.name}</Option>
                        ))
                    }
                </Select> 
                <div className='w-full sm:w-[540px] md:w-[640px] mx-auto relative'>
                    <input ref={inputRef} value={inputVal} onChange={(e) => setInputValue(e.target.value)}  disabled={loading}
                        className="w-full bg-gray-500 py-3 px-5 rounded-xl outline-none 
                            hover:bg-[#303846] focus:bg-[#303846] duration-300 transition-all"
                        type="text" placeholder="Type text here..."
                    />
                </div>
                <Select showSearch  style={{ width: 100 }} placeholder="Target" value={targetLang} onChange={(val) => setTargetLang(val)}
                    optionFilterProp="children" filterOption={(input: string, option : any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        languages.map((item, idx) => (
                            <Option key={idx} value={item.code}>{item.name}</Option>
                        ))
                    }
                </Select> 
            </div>
        </div>
    )
}


export default BittensorSubnetTranslate;

