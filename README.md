# 抖音私信自动回复 Webhook

这是一个用于抖音私信自动回复的 Webhook 服务器，部署在 Vercel 上。

## 功能
- ✅ 接收抖音私信事件
- ✅ 自动验证抖音 Webhook
- ✅ 调用扣子智能体生成回复
- ✅ 支持环境变量配置

## 部署步骤

### 1. 部署到 Vercel
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository" 或 "Drag & Drop"
4. 上传本文件夹所有文件
5. 点击 "Deploy"

### 2. 获取 Webhook 地址
部署成功后，你会得到一个地址：
- 例如：`https://douyin-webhook.vercel.app`
- 你的 Webhook 地址是：`https://douyin-webhook.vercel.app/webhook`

### 3. 配置抖音开放平台
1. 访问 https://open.douyin.com/
2. 在应用后台找到"事件订阅"
3. 填写 Webhook 地址：`https://douyin-webhook.vercel.app/webhook`
4. 完成验证

### 4. 配置扣子智能体（可选）
在 Vercel 项目设置中添加环境变量：
- `KOUZI_API_URL`: 扣子智能体 API 地址
- `KOUZI_API_KEY`: 扣子智能体 API 密钥

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或者直接运行
node api/index.js
```

## 测试 Webhook
### 验证接口测试
```
GET https://你的域名.vercel.app/webhook?challenge=test123
```
应该返回：`{"challenge":"test123"}`

### 主页测试
```
GET https://你的域名.vercel.app
```
显示服务器状态信息

## 文件结构
```
douyin-webhook/
├── api/
│   └── index.js          # 主服务器文件
├── package.json          # 项目配置
├── vercel.json           # Vercel 配置
└── README.md             # 说明文档
```

## 注意事项
1. 抖音 Webhook 需要在 3 秒内响应，否则会重试
2. 生产环境建议添加日志记录
3. 需要处理抖音的签名验证（当前版本已简化）