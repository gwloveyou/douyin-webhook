// api/index.js - 抖音私信 Webhook 服务器
const express = require('express');
const axios = require('axios');
const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 抖音验证 webhook 的接口（必须）
app.get('/webhook', (req, res) => {
  // 抖音会发送一个 challenge 参数来验证
  const challenge = req.query.challenge;
  if (challenge) {
    console.log('✅ 抖音验证请求，challenge:', challenge);
    res.json({ challenge: challenge });
  } else {
    res.status(400).json({ error: 'Missing challenge parameter' });
  }
});

// 接收抖音私信事件的接口
app.post('/webhook', async (req, res) => {
  console.log('📩 收到抖音私信事件:', JSON.stringify(req.body, null, 2));
  
  const event = req.body;
  
  // 检查是否是私信消息
  if (event.event === 'im.message.receive_v1') {
    const message = event.event_data;
    const senderId = message.sender_id;
    const content = message.content;
    
    console.log(`👤 发送者: ${senderId}`);
    console.log(`💬 消息内容: ${content}`);
    
    try {
      // 调用扣子智能体 API 生成回复
      const reply = await callKouziAI(content);
      
      console.log(`🤖 生成的回复: ${reply}`);
      
      // 这里可以添加调用抖音 API 发送回复的代码
      // 需要抖音的 access_token
      
    } catch (error) {
      console.error('❌ 调用扣子AI失败:', error.message);
    }
  } else {
    console.log(`📋 收到其他事件: ${event.event}`);
  }
  
  // 必须返回成功响应，否则抖音会重试
  res.json({ 
    success: true,
    message: 'Webhook received successfully',
    timestamp: new Date().toISOString()
  });
});

// 调用扣子智能体的函数
async function callKouziAI(userMessage) {
  // TODO: 替换为你的扣子智能体 API 地址和密钥
  const KOUZI_API_URL = process.env.KOUZI_API_URL || 'https://你的扣子API地址';
  const KOUZI_API_KEY = process.env.KOUZI_API_KEY || '你的API密钥';
  
  // 如果没有配置扣子API，返回默认回复
  if (!KOUZI_API_URL || KOUZI_API_URL.includes('你的扣子API地址')) {
    return `已收到您的消息: "${userMessage}"。我正在学习如何回复，请稍后再试。`;
  }
  
  try {
    const response = await axios.post(KOUZI_API_URL, {
      message: userMessage,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Authorization': `Bearer ${KOUZI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });
    
    return response.data.reply || response.data.message || '收到消息，正在处理中...';
  } catch (error) {
    console.error('扣子API调用错误:', error.message);
    return `抱歉，暂时无法处理您的消息。错误: ${error.message}`;
  }
}

// 健康检查接口
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '抖音私信 Webhook 服务器运行中',
    endpoints: {
      webhook: 'GET/POST /webhook',
      health: 'GET /health'
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 启动服务器（本地开发用）
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 服务器运行在 http://localhost:${port}`);
    console.log(`🌐 Webhook 地址: http://localhost:${port}/webhook`);
  });
}

// 导出给 Vercel 使用
module.exports = app;