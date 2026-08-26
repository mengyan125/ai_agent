# Agent Studio

本地单用户 Agent Studio，包含 FastAPI 后端与 Vue 3 前端。

## 环境要求

- Windows 10/11
- Python 3.11+
- uv
- Node.js 22.12.0+
- npm

## 配置

复制并按需修改：

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

示例配置只包含本地地址和占位值，不包含真实密钥。

## 启动后端

```powershell
cd backend
uv sync --dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

后端地址：`http://localhost:8000`
健康检查：`http://localhost:8000/api/health`

## 启动前端

另开终端：

```powershell
cd frontend
npm install
npm run dev
```

前端地址：`http://localhost:5173`

## 验证

```powershell
cd backend
uv run pytest -q
python -m compileall app tests

cd ..\frontend
npm run build
npm run lint
npm run test
```

浏览器访问 `http://localhost:5173/system/status` 检查系统状态页。

## Phase 0 范围

当前阶段提供健康检查、应用壳、系统状态页、智能对话骨架和模型配置骨架。聊天请求、模型保存、知识库和工具执行属于后续阶段。
