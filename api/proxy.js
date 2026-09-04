export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许 POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const apiKey = process.env.ALIYUN_API_KEY;
        if (!apiKey) {
            res.status(401).json({ error: 'API key is required' });
            return;
        }

        // 转发到阿里云 TTS
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.arrayBuffer();
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
        res.send(Buffer.from(data));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}