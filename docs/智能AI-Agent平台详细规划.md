# 智能 AI Agent 平台详细规划

## 1. 项目目标

建设一个**本地单用户、前后端分离**的智能 AI Agent 平台：Python 后端、Vue 3 前端。首版围绕以下闭环交付：

```text
配置云模型 → 上传资料 → 构建知识库 → 带引用聊天问答 →
受控调用文件/浏览器/MCP 工具 → 执行内置工作流 → 导出结果
```

## 2. 关键约束

- 云模型使用 OpenAI-compatible API，通过页面配置模型名、`base_url` 和 API Key；不优先适配 Anthropic API。
- API Key 不返回前端明文：优先保存至操作系统密钥链，降级时以应用主密钥加密保存。
- 首版本地运行，单用户，无登录和多租户；未来再加入部署、多用户和权限。
- 支持 PDF、Office 文档、文本、HTML、图片、视频上传；图片/扫描 PDF 本地 OCR，视频转写支持本地或可配置云服务。
- 浏览器默认允许访问公开网页；登录、表单提交、上传、下载、保存登录态等高风险动作必须人工确认。
- MCP 同时支持本机 stdio 和远程 Streamable HTTP；涉及文件的 MCP 调用只允许操作明确授权的目录。
- 工作流以 JSON/YAML 模板定义，首版提供内置模板和表单配置，不建设可视化画布；结果支持导出 Markdown/PDF。

## 3. 总体架构

```text
┌──────────────────────── Vue 3 Web ────────────────────────┐
│ Chat | Knowledge Bases | Workflows | MCP | Settings | Runs │
└───────────────────────────┬───────────────────────────────┘
                            │ REST + SSE
┌───────────────────────────▼───────────────────────────────┐
│ FastAPI                                                     │
│ API | Agent Runtime | Provider Adapter | Tool Policy       │
│ RAG | MCP Manager | Workflow Engine | Background Jobs      │
└───────┬────────────────┬────────────────┬─────────────────┘
        │                │                │
   ┌────▼────┐      ┌────▼─────┐    ┌────▼──────────┐
   │ SQLite  │      │ Qdrant   │    │ Local Storage │
   │ metadata│      │ vectors  │    │ files/exports │
   └─────────┘      └──────────┘    └───────────────┘
```

采用模块化单体：首版部署、调试与数据管理更简单；以后可独立拆出任务执行器、向量检索、工作流调度和多用户认证。

## 4. 后端规划

目录：`backend/`

```text
backend/
├── app/
│   ├── api/             # 路由、请求校验、SSE、错误响应
│   ├── agents/          # Agent 循环、上下文装配、限制策略
│   ├── core/            # 配置、加密、日志、数据库、异常、事件
│   ├── providers/       # OpenAI-compatible 模型与嵌入模型适配
│   ├── models/          # SQLAlchemy 数据模型
│   ├── repositories/    # SQLite/Qdrant 数据访问
│   ├── knowledge/       # 上传、解析、OCR、转写、分块、检索、引用
│   ├── tools/           # 文件、Playwright、MCP 工具及安全策略
│   ├── mcp/             # stdio / Streamable HTTP MCP 管理
│   ├── workflows/       # 模板、节点状态机、运行编排、导出
│   ├── jobs/            # 索引、媒体处理、工作流后台任务
│   └── main.py
├── data/
│   ├── app.db
│   ├── uploads/
│   ├── parsed/
│   ├── exports/
│   ├── downloads/
│   └── browser-profiles/
└── tests/
```

### 4.1 核心模块

| 模块 | 职责 |
|---|---|
| `api` | REST API、SSE 事件流、统一响应格式、输入校验 |
| `providers` | 聊天、流式输出、工具调用、嵌入能力的统一接口 |
| `agents` | 上下文组装、工具选择、最大步数、超时、取消 |
| `knowledge` | 多媒体解析、OCR、视频转写、向量索引、引用检索 |
| `tools` | 内建文件/浏览器/MCP 工具和确认策略 |
| `mcp` | MCP 服务配置、健康检查、工具发现、调用治理 |
| `workflows` | JSON/YAML 模板、节点执行、确认、重试、导出 |
| `jobs` | 长时任务状态、进度、失败重试、取消 |

### 4.2 主要 API

```text
GET/POST/PATCH /api/model-configs
POST            /api/model-configs/{id}/test

GET/POST        /api/conversations
POST            /api/conversations/{id}/messages
GET             /api/runs/{id}/events
POST            /api/runs/{id}/cancel

GET/POST        /api/knowledge-bases
POST            /api/knowledge-bases/{id}/documents
POST            /api/documents/{id}/reindex

GET/POST/PATCH /api/mcp-servers
POST            /api/mcp-servers/{id}/discover
POST            /api/mcp-servers/{id}/health-check

GET             /api/workflow-templates
POST            /api/workflow-runs
POST            /api/workflow-runs/{id}/confirm
POST            /api/workflow-runs/{id}/cancel

GET/POST        /api/security/workspaces
GET/PUT         /api/security/tool-policy
GET             /api/system/status
```

所有可能长时间运行的操作返回 `run_id`，前端通过 SSE 获取统一事件：

```text
run_started | token | retrieval_started | tool_requested |
confirmation_required | tool_completed | run_completed |
run_failed | cancelled
```

## 5. 前端页面与路径

目录：`frontend/`。采用 Vue 3、TypeScript、Vite、Vue Router、Pinia。

### 5.1 主导航

```text
智能对话
知识库
工作流
运行记录

工具
├── 内建工具
└── MCP 服务

设置
├── 模型配置
├── 安全设置
├── 通用设置
└── 系统状态
```

### 5.2 路由与功能

| 路由 | 页面 | 核心功能 |
|---|---|---|
| `/chat` | 智能对话 | 会话管理、模型/知识库选择、流式回答、工具卡片、引用、确认操作、Markdown/PDF 导出 |
| `/knowledge-bases` | 知识库列表 | 创建/编辑/删除知识库，展示文档数、索引状态和本地用量 |
| `/knowledge-bases/:id` | 知识库详情 | 上传、OCR/转写结果、解析/索引进度、失败重试、检索测试、来源预览 |
| `/workflows` | 工作流模板 | 模板卡片、说明、可用工具、最近运行记录 |
| `/workflows/:id/run` | 工作流启动 | 参数表单、模型/知识库/MCP 选择、浏览器开关、输出格式 |
| `/workflows/runs/:runId` | 工作流详情 | 节点状态、事件流、人工确认、暂停/取消/重试、结果预览与下载 |
| `/runs` | 统一运行记录 | 聊天/索引/OCR/浏览器/MCP/工作流任务的筛选、详情、取消 |
| `/tools` | 内建工具 | 文件/浏览器工具状态、工作区、下载目录、确认策略 |
| `/tools/mcp` | MCP 服务 | stdio/HTTP 配置、启停、健康检查、工具发现、白名单、授权目录、日志 |
| `/settings/models` | 模型配置 | 模型名、Base URL、Key 脱敏、默认模型、连通性测试 |
| `/settings/security` | 安全设置 | 文件授权目录、域名拒绝名单、登录态、限额和确认策略 |
| `/settings/general` | 通用设置 | 默认模型、默认知识库、主题、语言、数据目录、配置导入导出 |
| `/system/status` | 系统状态 | FastAPI、SQLite、Qdrant、OCR、转写、Playwright、MCP、存储和错误状态 |

### 5.3 Pinia Store

```text
stores/
├── chat.ts
├── knowledge-base.ts
├── workflow.ts
├── run.ts
├── mcp.ts
├── tools.ts
├── model-config.ts
├── security.ts
└── system.ts
```

## 6. 会话上下文与数据存储

### 6.1 SQLite：原始记录和业务元数据

SQLite 是首版的权威业务数据库，保存：

```text
model_configs
conversations
messages
runs
run_events
tool_calls
knowledge_bases
documents
document_chunks
mcp_servers
workflow_templates
workflow_runs
security_workspaces
```

原始聊天记录保存在 `messages` 中，通常不会成为单用户首版的容量问题。SQLite 不保存二进制附件、Base64 图片或大体积网页正文；这些内容存本地文件，数据库只保存摘要、路径、hash 与关联 ID。

### 6.2 运行内存：本次模型调用上下文

每轮请求动态组装：

```text
系统提示词
+ 最近 N 轮聊天消息
+ 会话摘要
+ 当前用户问题
+ RAG 命中文档片段
+ Agent 当前计划
+ 工具调用结果摘要
```

禁止无限加载历史消息。长会话通过“摘要 + 最近消息 + 相关检索记忆”控制模型上下文长度。

### 6.3 Qdrant：知识库与长期语义记忆

Qdrant 保存文档分块向量、来源元数据及未来可选的长期会话记忆。不要把全部原始聊天记录直接写入向量库；仅提炼稳定、可复用的用户偏好、项目事实和任务结论。

### 6.4 本地文件：大对象

```text
uploads/            原始上传文件
parsed/             提取文本、OCR、转写、关键帧
exports/            Markdown/PDF 结果
downloads/          浏览器下载文件
browser-profiles/   隔离登录态与浏览器配置
```

## 7. RAG 流程

```text
上传文件
  → 类型识别与 hash 去重
  → 文本/结构解析
  → OCR 或视频转写/关键帧 OCR
  → 清洗与分块
  → 嵌入模型生成向量
  → Qdrant 索引
  → 检索、引用、回答
```

支持：PDF、DOCX、XLSX、PPTX、TXT、Markdown、HTML、PNG、JPG、JPEG、WEBP、MP4、MOV、WEBM。

回答必须返回结构化来源信息：文档名称、页码/标题、片段位置，或视频时间点。前端可点击展开原始来源。

## 8. 工具安全策略

### 文件工具

- 只可访问用户授权的工作区根目录。
- 标准化路径并防止 `../`、符号链接和系统目录逃逸。
- 拒绝读取凭据、密钥及应用自身安全目录。
- 写入、覆盖、移动、删除必须由用户在前端确认。
- 首版不提供 Agent 任意 Shell 命令执行能力。

### 浏览器工具

- 通过 Playwright 驱动隔离浏览器上下文。
- 默认允许公开网页；支持用户确认后保存登录态。
- 打开页面、阅读、截图为低风险。
- 登录、表单提交、上传、下载、保存凭据为高风险，必须确认。
- 下载至隔离目录，限制运行时间、页面数量和文件大小。

### MCP 工具

- 支持 stdio 和 Streamable HTTP。
- 远程 MCP 默认禁用，需显式配置和启用。
- MCP 服务配置绑定允许工具清单和授权目录。
- MCP 工具的文件输入输出也必须经过路径边界校验。
- 高风险 MCP 调用需要确认并记录审计事件。

## 9. 工作流模板

模板使用 JSON/YAML。统一节点状态：

```text
pending → running → waiting_confirmation → succeeded
                              ├→ failed
                              └→ cancelled
```

节点类型：

```text
input
llm
rag_retrieval
file_tool
browser_tool
mcp_tool
condition
human_confirmation
output
```

首批模板：

1. **调研报告**：主题 → 知识库/网页检索 → 去重 → 提纲 → 带引用报告 → Markdown/PDF。
2. **文档处理**：选择文件 → 解析/OCR/转写 → 摘要/标签/问答集 → 写入知识库或导出。
3. **任务执行助手**：任务描述 → Agent 规划 → 文件/浏览器/MCP 操作 → 确认 → 结果汇总。
4. **信息汇总简报**：选择来源 → 收集 → 分类去重 → 简报 → Markdown/PDF。

## 10. 分阶段交付计划

### Phase 0：基础工程

- FastAPI、Vue 3、SQLite、配置、日志、健康检查、CORS、统一错误处理。
- 前端基础布局、路由、请求封装、全局通知和确认弹窗。
- 验收：前后端本地启动、健康检查/API 文档可用。

### Phase 1：模型配置与流式聊天

- 模型适配层、加密 Key、会话/消息存储、SSE 聊天。
- 页面：`/settings/models`、`/chat`。
- 验收：配置模型 → 测试连接 → 对话流式返回 → 页面刷新后历史保留。

### Phase 2：Agent 运行记录

- `runs`、`run_events`、取消、超时、审计和前端运行详情。
- 页面：`/runs`。
- 验收：每次对话可追踪、可停止、错误可查看。

### Phase 3：知识库 / RAG

- 上传、解析、OCR、分块、Qdrant、检索和引用。
- 页面：`/knowledge-bases`、`/knowledge-bases/:id`。
- 验收：上传资料 → 索引 → 带来源问答。

### Phase 4：文件工具与安全设置

- 授权工作区、文件工具、人工确认、路径安全和审计。
- 页面：`/tools`、`/settings/security`。
- 验收：可读授权文件、不可越界、写操作需确认。

### Phase 5：浏览器工具

- Playwright、隔离下载、登录态、高风险确认、网页调研。
- 验收：Agent 检索公开网页并生成有来源结果；高风险步骤会暂停确认。

### Phase 6：MCP 管理

- stdio/HTTP MCP、健康检查、工具发现、白名单、目录授权、审计。
- 页面：`/tools/mcp`。
- 验收：连接 MCP → 发现工具 → 白名单调用 → 展示执行过程。

### Phase 7：工作流

- JSON/YAML 模板、运行引擎、状态流转、确认、重试、Markdown/PDF 导出。
- 页面：`/workflows`、`/workflows/:id/run`、`/workflows/runs/:runId`。
- 验收：运行调研报告模板并导出结果。

### Phase 8：质量与部署准备

- 单元、集成、E2E、安全、性能测试；一键本地启动、备份恢复和诊断。
- 后续：Docker Compose、对象存储、PostgreSQL、任务队列、多用户与可视化工作流。

## 11. 首版优先顺序

优先实现：

```text
Phase 0 → Phase 1 → Phase 3
```

优先闭环：

```text
配置模型 → 上传文档 → 构建知识库 → 带引用聊天问答
```

之后再逐步叠加 Agent 运行记录、文件工具、浏览器、MCP 和工作流，确保每一阶段都有可验证价值。
