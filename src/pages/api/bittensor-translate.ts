
export default async function handler(req: any, res: any) {

    const data = JSON.parse(req.body);

    const key = process.env.NEXT_PUBLIC_BITTENSOR_KEY!;
    
    
    try {
        const response = await fetch('https://api.corcel.io/v1/translate/subnet-beta/translate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_lang: data.sourceLang,
                target_lang: data.targetLang,
                source_texts: [
                    data.sourceText
                ]
            })
        })        
        
        const result = await response.json();
        
        res.status(200).json({ data: result })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
    }
}


