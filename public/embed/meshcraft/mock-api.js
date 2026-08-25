/* ============================================================
 * MeshCraft · 纯前端仿真 DEMO — fetch shim
 *
 * 拦截所有 /api/* 请求并返回模拟数据，让原工具界面在无任何后端
 * 的情况下完整可交互：进度条会跑、任务逐条完成、日志滚动，
 * 但不产生任何真实文件，也不发任何真实外部请求。
 * ============================================================ */
(function () {
  'use strict';

  var MOCK_DATA = {"eval_models":[{"id":"hunyuan3d-v31-pro","name":"Hunyuan 3D v3.1 Pro (fal)","provider":"fal","path":"fal-ai/hunyuan-3d/v3.1/pro/image-to-3d","base":"fal-ai/hunyuan-3d","input_kind":"image","input_key":"input_image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":["hunyuan3d-smart-topology"],"hidden":false,"note":null,"max_concurrent":null},{"id":"tripo3d-p1","name":"Tripo3D P1 (fal, 旧)","provider":"fal","path":"tripo3d/p1/image-to-3d","base":"tripo3d/p1/image-to-3d","input_kind":"image","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"tripo-p1","name":"Tripo · P1 Image to 3D","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"image","input_key":"file","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"image_to_model","model_version":"P1-20260311","texture":true,"pbr":true},"followups":["tripo-refine","tripo-texture","tripo-stylize","tripo-rig"],"hidden":false,"note":null,"max_concurrent":null},{"id":"tripo-v31","name":"Tripo · v3.1 Image to 3D","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"image","input_key":"file","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"image_to_model","model_version":"v3.1-20260211","texture":true,"pbr":true},"followups":["tripo-refine","tripo-texture","tripo-stylize","tripo-rig"],"hidden":false,"note":null,"max_concurrent":null},{"id":"tripo-p1-quad","name":"Tripo · P1 Image to 3D (Quad, 一步式, FBX)","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"image","input_key":"file","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"image_to_model","model_version":"P1-20260311","texture":true,"pbr":true,"quad":true,"face_limit":10000},"followups":["tripo-refine","tripo-texture","tripo-stylize","tripo-rig"],"hidden":false,"note":null,"max_concurrent":null},{"id":"tripo-v31-quad","name":"Tripo · v3.1 Image to 3D (Quad, 一步式, FBX)","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"image","input_key":"file","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"image_to_model","model_version":"v3.1-20260211","texture":true,"pbr":true,"quad":true,"face_limit":10000},"followups":["tripo-refine","tripo-texture","tripo-stylize","tripo-rig"],"hidden":false,"note":null,"max_concurrent":null},{"id":"tripo-multiview","name":"Tripo · Multiview to 3D","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"image","input_key":"files","input_is_list":true,"prompt_key":null,"output_kind":"mesh","extra":{"type":"multiview_to_model","model_version":"v3.1-20260211","texture":true,"pbr":true},"followups":["tripo-refine","tripo-texture","tripo-stylize","tripo-rig"],"hidden":false,"note":"当前按单图批处理,发送一张图作为正视图。","max_concurrent":null},{"id":"tripo3d","name":"Tripo3D v2.5 (fal)","provider":"fal","path":"fal-ai/tripo3d/tripo/v2.5","base":"fal-ai/tripo3d","input_kind":"image","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"trellis","name":"Trellis (fal)","provider":"fal","path":"fal-ai/trellis","base":"fal-ai/trellis","input_kind":"image","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"hunyuan3d-v3","name":"Hunyuan3D v3 (fal)","provider":"fal","path":"fal-ai/hunyuan3d-v3/image-to-3d","base":"fal-ai/hunyuan3d-v3","input_kind":"image","input_key":"input_image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"hunyuan3d-v21","name":"Hunyuan3D v2.1 (fal)","provider":"fal","path":"fal-ai/hunyuan3d-v21","base":"fal-ai/hunyuan3d-v21","input_kind":"image","input_key":"input_image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"hunyuan3d-v2-turbo","name":"Hunyuan3D v2 Turbo (fal)","provider":"fal","path":"fal-ai/hunyuan3d/v2/turbo","base":"fal-ai/hunyuan3d","input_kind":"image","input_key":"input_image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"hyper3d-rodin","name":"Rodin / Hyper3D (fal)","provider":"fal","path":"fal-ai/hyper3d/rodin","base":"fal-ai/hyper3d","input_kind":"image","input_key":"input_image_urls","input_is_list":true,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"meshy-image-to-3d","name":"Meshy · Image to 3D","provider":"meshy","path":"/openapi/v1/image-to-3d","base":"","input_kind":"image","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":["meshy-remesh","meshy-rigging","meshy-retexture"],"hidden":false,"note":null,"max_concurrent":null},{"id":"meshy-image-to-3d-quad","name":"Meshy · Image to 3D (Quad, 一步式)","provider":"meshy","path":"/openapi/v1/image-to-3d","base":"","input_kind":"image","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"should_remesh":true,"topology":"quad","target_polycount":10000,"enable_pbr":true,"save_pre_remeshed_model":true},"followups":["meshy-rigging","meshy-retexture"],"hidden":false,"note":null,"max_concurrent":null},{"id":"meshy-multi-image-to-3d","name":"Meshy · Multi Image to 3D","provider":"meshy","path":"/openapi/v1/multi-image-to-3d","base":"","input_kind":"image","input_key":"image_urls","input_is_list":true,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":["meshy-remesh","meshy-rigging","meshy-retexture"],"hidden":false,"note":"当前每张图独立跑;将来可扩展为多视角打包。","max_concurrent":null},{"id":"meshy-image-to-image","name":"Meshy · Image to Image","provider":"meshy","path":"/openapi/v1/image-to-image","base":"","input_kind":"image+text","input_key":"reference_image_urls","input_is_list":true,"prompt_key":"prompt","output_kind":"image","extra":{"ai_model":"nano-banana"},"followups":[],"hidden":false,"note":null,"max_concurrent":null},{"id":"hunyuan3d-smart-topology","name":"Smart Topology / 重拓扑 (fal Hunyuan)","provider":"fal","path":"fal-ai/hunyuan-3d/v3.1/smart-topology","base":"fal-ai/hunyuan-3d","input_kind":"mesh","input_key":"input_file_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"input_file_type":"glb"},"followups":[],"hidden":true,"note":null,"max_concurrent":1},{"id":"meshy-remesh","name":"Meshy · Remesh","provider":"meshy","path":"/openapi/v1/remesh","base":"","input_kind":"mesh","input_key":"model_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"topology":"quad","target_polycount":10000,"target_formats":["glb"]},"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"meshy-rigging","name":"Meshy · Rigging","provider":"meshy","path":"/openapi/v1/rigging","base":"","input_kind":"mesh","input_key":"model_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"meshy-retexture","name":"Meshy · Retexture (使用提示词)","provider":"meshy","path":"/openapi/v1/retexture","base":"","input_kind":"mesh","input_key":"model_url","input_is_list":false,"prompt_key":"text_style_prompt","output_kind":"mesh","extra":null,"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"meshy-text-to-3d","name":"Meshy · Text to 3D","provider":"meshy","path":"/openapi/v2/text-to-3d","base":"","input_kind":"text","input_key":"image_url","input_is_list":false,"prompt_key":"prompt","output_kind":"mesh","extra":{"mode":"preview"},"followups":[],"hidden":true,"note":"需要提示词,不与图片批处理同工作流,暂未接入 UI。","max_concurrent":null},{"id":"meshy-text-to-image","name":"Meshy · Text to Image","provider":"meshy","path":"/openapi/v1/text-to-image","base":"","input_kind":"text","input_key":"image_url","input_is_list":false,"prompt_key":"prompt","output_kind":"image","extra":{"ai_model":"nano-banana"},"followups":[],"hidden":true,"note":"文本→图片,不与 3D 测评流程同工作流,暂未接入 UI。","max_concurrent":null},{"id":"meshy-animation","name":"Meshy · Animation","provider":"meshy","path":"/openapi/v1/animations","base":"","input_kind":"rig-task","input_key":"image_url","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":null,"followups":[],"hidden":true,"note":"需要 Rigging 产出的 rig_task_id + action_id,暂未接入 UI。","max_concurrent":null},{"id":"tripo-refine","name":"Tripo · Refine Draft","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"task_id","input_key":"draft_model_task_id","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"refine_model"},"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"tripo-texture","name":"Tripo · Retexture (使用提示词)","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"task_id","input_key":"original_model_task_id","input_is_list":false,"prompt_key":"text_prompt","output_kind":"mesh","extra":{"type":"texture_model","texture":true,"pbr":true},"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"tripo-stylize","name":"Tripo · Stylize (默认 Lego)","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"task_id","input_key":"original_model_task_id","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"stylize_model","style":"lego"},"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"tripo-rig","name":"Tripo · Rig (骨骼绑定)","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"task_id","input_key":"original_model_task_id","input_is_list":false,"prompt_key":null,"output_kind":"mesh","extra":{"type":"animate_rig"},"followups":[],"hidden":true,"note":null,"max_concurrent":null},{"id":"tripo-text-to-3d","name":"Tripo · Text to 3D","provider":"tripo","path":"/v2/openapi/task","base":"","input_kind":"text","input_key":"image_url","input_is_list":false,"prompt_key":"prompt","output_kind":"mesh","extra":{"type":"text_to_model","model_version":"P1-20260311"},"followups":[],"hidden":true,"note":"文本→3D,不与图片批处理同工作流,暂未接入 UI。","max_concurrent":null}],"params_meshy":{"_meta":{"description":"Tab 6 Meshy 批量图生 3D 的参数矩阵。前端按 ui_label/options 渲染按钮，后端按 value 提交给 Meshy API。supported_by 用于按钮联动：切 ai_model 时不在该列表里的按钮置灰。","source":"Meshy 官方文档 (WebFetch 2026-05)。Meshy 改版时手动同步此文件。","meshy_api_base":"https://api.meshy.ai","endpoints":{"submit":"POST /openapi/v1/image-to-3d","status":"GET /openapi/v1/image-to-3d/{task_id}","balance":"GET /openapi/v1/balance"}},"ai_model":{"ui_label":"模型版本","ui_help":"Meshy 5 是稳定版；Meshy 6 是新版（支持 4K 基础色 + USDZ）。只用显式版本号, 不用 latest 别名。","options":[{"value":"meshy-5","label":"Meshy 5"},{"value":"meshy-6","label":"Meshy 6","recommended":true}],"default":"meshy-6"},"target_polycount":{"ui_label":"面数","ui_help":"Meshy 只能在 100–300,000 之间精确减面 (should_remesh=true)。选「原始」= 不减面, 输出模型原生高精网格 (常 100 万+, 面数由模型决定、不固定)。注: 文档上限 30 万, 想要更高/更精确的面数控制请用 Hyper3D。","options":[{"value":10000,"label":"1 万 (减面)","supported_by":["meshy-5","meshy-6"]},{"value":50000,"label":"5 万 (减面)","supported_by":["meshy-5","meshy-6"]},{"value":100000,"label":"10 万 (减面)","supported_by":["meshy-5","meshy-6"]},{"value":300000,"label":"30 万 (减面·上限)","supported_by":["meshy-5","meshy-6"]},{"value":0,"label":"原始 (不减面·100万+不固定)","supported_by":["meshy-5","meshy-6"],"recommended":true}],"default":0},"hd_texture":{"ui_label":"贴图分辨率","ui_help":"标准 = 基础色 2K；高清 = 基础色 4K（仅 meshy-6 支持）。PBR 贴图（metallic/normal/roughness）永远 2K。","options":[{"value":false,"label":"标准 2K","supported_by":["meshy-5","meshy-6"],"recommended":true},{"value":true,"label":"高清 4K","supported_by":["meshy-6"]}],"default":false},"enable_pbr":{"ui_label":"贴图类型","ui_help":"PBR = 含 metallic/normal/roughness 三套贴图，物理渲染推荐；Flat = 仅基础色，体积小。","options":[{"value":true,"label":"PBR","supported_by":["meshy-5","meshy-6"],"recommended":true},{"value":false,"label":"Flat","supported_by":["meshy-5","meshy-6"]}],"default":true},"target_formats":{"ui_label":"输出格式","ui_help":"前端单选，提交时包装成 list。不传则 Meshy 默认生成所有格式（很烧 credit），所以这里强制单选。","ui_single_select":true,"options":[{"value":"glb","label":"GLB","supported_by":["meshy-5","meshy-6"],"recommended":true},{"value":"fbx","label":"FBX","supported_by":["meshy-5","meshy-6"]},{"value":"obj","label":"OBJ","supported_by":["meshy-5","meshy-6"]},{"value":"usdz","label":"USDZ","supported_by":["meshy-6"]}],"default":"glb"},"save_textures":{"ui_label":"贴图副本","ui_help":"GLB 已嵌入所有贴图 (base_color + PBR 三件套)；这里控制是否额外把 PNG 单独保存到 <stem>/ 子目录。多数工作流不需要。","options":[{"value":false,"label":"不保存","supported_by":["meshy-5","meshy-6"],"recommended":true},{"value":true,"label":"保存 PNG","supported_by":["meshy-5","meshy-6"]}],"default":false},"_concurrency":{"ui_label":"并发数","ui_help":"同时发起的 Meshy 任务数。Meshy 无公开查套餐端点；保守值 5，激进值 10。触发 429 会自动退让。","options":[{"value":5,"label":"5（保守）"},{"value":10,"label":"10（默认）","recommended":true}],"default":10}},"params_rodin":{"_meta":{"description":"Tab 6 Hyper3D (Rodin 模型线) 参数矩阵。前端按 ui_label/options 渲染按钮，后端按 value 提交给 Hyper3D /api/v2/rodin (multipart/form-data).","source":"Hyper3D 官方 minimal-example.md (2026-01) + Gen-2.5 UI 截图。字段名为最佳猜测, 部分新参数可能需实测调整。","api_base":"https://api.hyper3d.com/api/v2","endpoints":{"submit":"POST /api/v2/rodin (multipart/form-data)","status":"POST /api/v2/status {subscription_key}","download":"POST /api/v2/download {task_uuid}","balance":"GET /api/v2/check_balance → {balance:int}"},"notes":["Hyper3D 有余额端点 GET /api/v2/check_balance（已接入余额 badge）","submit 返回 {uuid, jobs:{subscription_key}}; status 返回 {jobs:[{uuid,status}]} (status 数组 — Gen-2.5 batch 可能 N 个 job)","download 单独一步: 必须等 status=Done 后调 /download 拿文件 URL 列表"]},"tier":{"ui_label":"模型版本","ui_help":"Gen-2.5 最强 (按思考强度细分), Gen-2 是稳定版, Gen-1.5 老但快 (按模式细分)。","options":[{"value":"Gen-2.5","label":"Gen-2.5","recommended":true},{"value":"Gen-2","label":"Gen-2"},{"value":"Gen-1.5","label":"Gen-1.5"}],"default":"Gen-2.5"},"thinking_effort":{"ui_label":"思考强度","ui_help":"Gen-2.5 专属; 越高质量越好但越慢。最终 tier 字段拼成 'Gen-2.5-<Effort>'。官方仅 5 档 (无 Minimum)。","_show_when":{"key":"tier","values":["Gen-2.5"]},"options":[{"value":"Extreme-Low","label":"Extreme-Low (最快)"},{"value":"Low","label":"Low"},{"value":"Medium","label":"Medium","recommended":true},{"value":"High","label":"High"},{"value":"Extreme-High","label":"Extreme-High (最精细)"}],"default":"Medium"},"gen15_mode":{"ui_label":"Gen-1.5 模式","ui_help":"Gen-1.5 专属; 实际 API tier 名见括号。Default=均衡, Focal=高细节, Zero=平滑清晰, Speedy=快速草模。","_show_when":{"key":"tier","values":["Gen-1.5"]},"options":[{"value":"Regular","label":"Default (Regular)","recommended":true},{"value":"Detail","label":"Focal (Detail)"},{"value":"Smooth","label":"Zero (Smooth)"},{"value":"Sketch","label":"Speedy (Sketch)"}],"default":"Regular"},"quality_override":{"ui_label":"面数","ui_help":"目标面数 (quality_override)。官方范围随拓扑/思考强度变: Quad 上限 20万; Raw 上限 100万 (Extreme-Low~Medium) / 200万 (High·Extreme-High)。切拓扑或思考强度会自动灰掉超范围档。","options":[{"value":50000,"label":"5 万"},{"value":100000,"label":"10 万"},{"value":200000,"label":"20 万 (Quad 上限)"},{"value":300000,"label":"30 万 (仅 Raw)"},{"value":500000,"label":"50 万 (仅 Raw)"},{"value":1000000,"label":"100 万 (仅 Raw)","recommended":true},{"value":2000000,"label":"200 万 (仅 Raw·High/E-High)"}],"default":1000000},"mesh_mode":{"ui_label":"拓扑","ui_help":"Raw = 原始三角网格 (默认, 通用); Quad = 四边面为主 (适合后续游戏 / 雕刻流水线)。","options":[{"value":"Raw","label":"Raw (三角)","recommended":true},{"value":"Quad","label":"Quad (四边)"}],"default":"Raw"},"material":{"ui_label":"材质","ui_help":"PBR = metallic/roughness/normal 三件套; Shaded = 烘焙好的单贴图 (轻便, 但二次编辑不够灵活)。","options":[{"value":"PBR","label":"PBR","recommended":true},{"value":"Shaded","label":"Shaded"}],"default":"PBR"},"geometry_file_format":{"ui_label":"输出格式","ui_help":"Hyper3D geometry_file_format 字段直接是字符串 (区分大小写, 必须小写)。","options":[{"value":"glb","label":"GLB","recommended":true},{"value":"fbx","label":"FBX"},{"value":"obj","label":"OBJ"},{"value":"usdz","label":"USDZ"},{"value":"stl","label":"STL"}],"default":"glb"},"save_textures":{"ui_label":"贴图副本","ui_help":"Hyper3D /download 返回的 PNG 贴图是否额外下载到 <stem>/ 子目录。多数模型格式（GLB/USDZ）已嵌入贴图, 不必再存; OBJ/FBX 流水线可能需要单独 PNG, 那时打开。","options":[{"value":false,"label":"不保存","recommended":true},{"value":true,"label":"保存 PNG"}],"default":false},"_concurrency":{"ui_label":"并发数","ui_help":"Hyper3D 限流策略未在文档披露; 保守 3, 默认 5。触发限流自动退让。","options":[{"value":3,"label":"3 保守"},{"value":5,"label":"5 默认","recommended":true}],"default":5}},"params_tripo":{"_meta":{"description":"Tab 6 Tripo3D 参数矩阵 (API v3, openapi.tripo3d.com/v3)。前端按 ui_label/options 渲染, 后端 tripo_payload 构造 /generation/image-to-model 请求体。低面是独立模式(smart_low_poly), 不在此批量面板。","api_base":"https://openapi.tripo3d.ai/v3","endpoints":{"upload":"POST /files (multipart 'file', returns data.file_token)","submit":"POST /generation/image-to-model (JSON: input + model + flags, 无 type 字段)","status":"GET /tasks/{task_id} (envelope {code, data:{status, output:{model_url}, ...}})","balance":"GET /account/balance (data.balance)"},"notes":["v3 用 input 直接传 file_token/URL; model 字段 (非 model_version)。","model 仅 v3.1/v3.0/v2.5 — 无 P1/Turbo (那是 v2 概念)。低面用 smart_low_poly:true。","v3.0+ 专属: texture_quality / geometry_quality / auto_size / quad / smart_low_poly。v2.5 禁用这些。","pbr=true 会强制 texture=true。quad 上限 15万并强制 FBX。","face_limit 上限: 三角 v3.1/v3.0 200万、v2.5 50万; quad 15万; smart_low_poly 三角2万/四边1万。"]},"model_version":{"ui_label":"模型版本","ui_help":"v3.1 最新最佳 (最高 200 万面); v3.0 稳定; v2.5 均衡 (上限 50 万, 不支持 v3.0+ 高级参数)。低面请用🎮低面模式。","options":[{"value":"v3.1-20260211","label":"v3.1 (最新)","recommended":true},{"value":"v3.0-20250812","label":"v3.0 (稳定)"},{"value":"v2.5-20250123","label":"v2.5 (均衡)"}],"default":"v3.1-20260211"},"face_limit":{"ui_label":"面数","ui_help":"输出最大面数。三角面: v3.1/v3.0 上限 200 万, v2.5 上限 50 万。开 quad 时上限 15 万 (后端自动卡)。省略=自适应拓扑。","options":[{"value":50000,"label":"5 万","supported_by":["v3.1-20260211","v3.0-20250812","v2.5-20250123"]},{"value":100000,"label":"10 万","supported_by":["v3.1-20260211","v3.0-20250812","v2.5-20250123"]},{"value":300000,"label":"30 万","supported_by":["v3.1-20260211","v3.0-20250812","v2.5-20250123"]},{"value":500000,"label":"50 万","supported_by":["v3.1-20260211","v3.0-20250812","v2.5-20250123"]},{"value":1000000,"label":"100 万","supported_by":["v3.1-20260211","v3.0-20250812"],"recommended":true},{"value":2000000,"label":"200 万","supported_by":["v3.1-20260211","v3.0-20250812"]}],"default":1000000},"texture":{"ui_label":"贴图","ui_help":"白模 = texture:false, 输出无纹理纯几何 (快/省积分)。带贴图时下方 PBR/质量生效。","options":[{"value":true,"label":"带贴图","recommended":true},{"value":false,"label":"白模 (无纹理)"}],"default":true},"pbr":{"ui_label":"PBR 贴图","ui_help":"PBR = base_color/metallic/roughness/normal。Flat = 仅基础色。开 PBR 会强制带贴图。","_show_when":{"key":"texture","values":[true]},"options":[{"value":true,"label":"PBR","recommended":true},{"value":false,"label":"Flat (仅 base color)"}],"default":true},"texture_quality":{"ui_label":"贴图质量","ui_help":"standard 默认; detailed 更高保真; extreme 8K (额外积分)。仅 v3.0+ 生效。","_show_when":{"key":"texture","values":[true]},"options":[{"value":"standard","label":"标准","recommended":true},{"value":"detailed","label":"高清 (detailed)","supported_by":["v3.1-20260211","v3.0-20250812"]},{"value":"extreme","label":"8K (extreme)","supported_by":["v3.1-20260211","v3.0-20250812"]}],"default":"standard"},"geometry_quality":{"ui_label":"几何质量","ui_help":"standard 平衡; detailed = Ultra 模式更精细几何。仅 v3.0+ 生效 (v2.5 切勿使用)。","options":[{"value":"standard","label":"标准","recommended":true},{"value":"detailed","label":"Ultra (detailed)","supported_by":["v3.1-20260211","v3.0-20250812"]}],"default":"standard"},"quad":{"ui_label":"拓扑","ui_help":"三角面 = 通用; 四边面 = 适合重拓扑 (强制 FBX 输出, 面数上限 15 万)。仅 v3.0+ 支持。","options":[{"value":false,"label":"三角面","recommended":true},{"value":true,"label":"四边面 (→FBX, ≤15万)","supported_by":["v3.1-20260211","v3.0-20250812"]}],"default":false},"auto_size":{"ui_label":"自动尺寸","ui_help":"AI 估测真实尺寸自动缩放 (米为单位), 适合 AR/VR/游戏引擎。仅 v3.0+ 支持。","options":[{"value":false,"label":"关 (单位 1)","recommended":true},{"value":true,"label":"开 (AI 估测真实尺寸)","supported_by":["v3.1-20260211","v3.0-20250812"]}],"default":false},"_concurrency":{"ui_label":"并发数","ui_help":"Tripo 限流策略未明确披露; 保守 3, 默认 5。触发限流自动退让。","options":[{"value":3,"label":"3 保守"},{"value":5,"label":"5 默认","recommended":true}],"default":5}},"params_trellis":{"_meta":{"description":"Tab 6 Trellis (Microsoft) 参数表。Trellis 通过 fal.ai 网关调用 (queue.fal.run/fal-ai/trellis), 但在 UI 上提为独立品牌 provider — 跟 Meshy/Hyper3D/Tripo3D 同一层级。","vendor":"Microsoft Research","api_base":"https://queue.fal.run","endpoints":{"submit":"POST /fal-ai/trellis","status":"GET <base>/requests/<request_id>/status","result":"GET <base>/requests/<request_id>","balance":null},"notes":["鉴权: Authorization: Key <api-key> (fal.ai 网关, 不是 Bearer)","底层模型是 Microsoft TRELLIS, 输入单张图 -> 输出带贴图的 3D 网格","fal.ai 上的 Trellis 只此一档, 没有不同的 version/tier"]},"fal_trellis_texture_size":{"ui_label":"贴图分辨率","ui_help":"Trellis 输出贴图边长 (px)。","options":[{"value":512,"label":"512"},{"value":1024,"label":"1024","recommended":true},{"value":2048,"label":"2048"}],"default":1024},"fal_trellis_mesh_simplify":{"ui_label":"网格简化","ui_help":"Trellis mesh_simplify 系数。越接近 1 越激进 (面数越低)。0.95 是默认平衡; 0.99 极简; 0.5 保留更多细节。","options":[{"value":0.5,"label":"0.5 (高细节)"},{"value":0.85,"label":"0.85"},{"value":0.95,"label":"0.95 (默认)","recommended":true},{"value":0.99,"label":"0.99 (极简)"}],"default":0.95},"_concurrency":{"ui_label":"并发数","ui_help":"fal.ai 限流按模型不同。Trellis 跑得快, 默认 5。触发 429 自动退让。","options":[{"value":3,"label":"3 保守"},{"value":5,"label":"5 默认","recommended":true}],"default":5}},"params_hunyuan":{"_meta":{"description":"Tab 6 Hunyuan (腾讯) 参数表。所有 Hunyuan 变体通过 fal.ai 网关调用 (queue.fal.run/...), 但 UI 上作为独立品牌 provider, 下面用 hunyuan_model_id 切换 v3.1 Pro / v3 / v2.1 / v2 Turbo 四个变体。","vendor":"Tencent (via fal.ai gateway)","api_base":"https://queue.fal.run","endpoints":{"submit":"POST /<model-path> (per-variant; v31-pro 是 fal-ai/hunyuan-3d/v3.1/pro/image-to-3d 等)","balance":null},"notes":["鉴权: Authorization: Key <api-key> (fal.ai 网关)","每个变体 payload 字段不同, 详见 fal_adapter._MODEL_DISPATCH 表","Multi-view 变体 (v2/multi-view) 暂不接入批量, 进 Task #32 (跨品牌多视角面板)","v3 docs 抓取于 2026-05-28, 价格: Normal $0.375 / LowPoly $0.45 / Geometry $0.225; PBR +$0.15","审计 2026-06-25: v3.1Pro(Normal/Geometry, 无LowPoly)/v3/v2-turbo 字段全部对齐 fal 官方; v2.1 已被 fal 标记 deprecated/no longer supported, UI 加警告"]},"hunyuan_model_id":{"ui_label":"模型版本","ui_help":"选不同变体调用不同底层。质量 / 速度 / 价格差异显著。","options":[{"value":"hunyuan3d-v31-pro","label":"v3.1 Pro (最新, 高质量)","recommended":true},{"value":"hunyuan3d-v3","label":"v3 (PBR + 多生成模式)"},{"value":"hunyuan3d-v2-turbo","label":"v2 Turbo (极速)"},{"value":"hunyuan3d-v21","label":"v2.1 (⚠ fal 已弃用, 可能失败)"}],"default":"hunyuan3d-v31-pro"},"fal_hunyuan31_face_count":{"ui_label":"面数","ui_help":"v3.1 Pro 目标面数 (40000-1500000)。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v31-pro"]},"options":[{"value":100000,"label":"10 万"},{"value":300000,"label":"30 万"},{"value":500000,"label":"50 万","recommended":true},{"value":1000000,"label":"100 万"},{"value":1500000,"label":"150 万"}],"default":500000},"fal_hunyuan31_generate_type":{"ui_label":"生成模式","ui_help":"Normal = 带纹理几何; Geometry = 仅白模 (不消耗贴图算力)。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v31-pro"]},"options":[{"value":"Normal","label":"Normal (带纹理)","recommended":true},{"value":"Geometry","label":"Geometry (白模)"}],"default":"Normal"},"fal_hunyuan31_enable_pbr":{"ui_label":"PBR 贴图","ui_help":"PBR = 含 metallic/roughness/normal 三套贴图。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v31-pro"]},"options":[{"value":false,"label":"关","recommended":true},{"value":true,"label":"开"}],"default":false},"fal_hunyuan3_face_count":{"ui_label":"面数","ui_help":"v3 目标面数 (40000-1500000)。⚠ 自定义面数 (不是默认 50 万) 会 +$0.15。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v3"]},"options":[{"value":100000,"label":"10 万"},{"value":300000,"label":"30 万"},{"value":500000,"label":"50 万 (默认价)","recommended":true},{"value":1000000,"label":"100 万"},{"value":1500000,"label":"150 万"}],"default":500000},"fal_hunyuan3_generate_type":{"ui_label":"生成模式","ui_help":"Normal $0.375 (带纹理) / LowPoly $0.45 (减面) / Geometry $0.225 (白模, 最便宜)。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v3"]},"options":[{"value":"Normal","label":"Normal ($0.375)","recommended":true},{"value":"LowPoly","label":"LowPoly ($0.45)"},{"value":"Geometry","label":"Geometry ($0.225, 白模)"}],"default":"Normal"},"fal_hunyuan3_enable_pbr":{"ui_label":"PBR 贴图","ui_help":"开启加 $0.15。Geometry 白模时强制 false (官方文档明示)。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v3"]},"options":[{"value":false,"label":"关 (+$0)","recommended":true},{"value":true,"label":"开 (+$0.15)"}],"default":false},"fal_hunyuan3_polygon_type":{"ui_label":"多边形类型","ui_help":"仅 LowPoly 模式生效。三角 = 通用; 四边形 = 便于游戏/重拓扑工作流。","_show_when":{"key":"fal_hunyuan3_generate_type","values":["LowPoly"]},"options":[{"value":"triangle","label":"三角","recommended":true},{"value":"quadrilateral","label":"四边形"}],"default":"triangle"},"fal_hunyuan21_textured_mesh":{"ui_label":"贴图","ui_help":"⚠ 开启后单次价格 3× ($0.3 → $0.9)。关闭 = 仅白模。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v21"]},"options":[{"value":false,"label":"关 (白模, 1× 价)","recommended":true},{"value":true,"label":"开 (带纹理, 3× 价)"}],"default":false},"fal_hunyuan21_octree_resolution":{"ui_label":"Octree 分辨率","ui_help":"几何细节密度。256 默认平衡; 128 快/糙; 512 高细节但慢。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v21"]},"options":[{"value":128,"label":"128 (快)"},{"value":256,"label":"256 (默认)","recommended":true},{"value":512,"label":"512 (高细节)"}],"default":256},"fal_hunyuan21_num_inference_steps":{"ui_label":"推理步数","ui_help":"Diffusion 步数。50 是官方默认 (最佳质量); 25 / 35 是质量换速度的提速档。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v21"]},"options":[{"value":25,"label":"25 (最快)"},{"value":35,"label":"35 (中)"},{"value":50,"label":"50 (默认)","recommended":true}],"default":50},"fal_hunyuan2turbo_textured_mesh":{"ui_label":"贴图","ui_help":"⚠ 开启后单次价格 3×。关闭 = 仅白模 (便宜)。","_show_when":{"key":"hunyuan_model_id","values":["hunyuan3d-v2-turbo"]},"options":[{"value":false,"label":"关 (白模, 1× 价)","recommended":true},{"value":true,"label":"开 (带纹理, 3× 价)"}],"default":false},"_concurrency":{"ui_label":"并发数","ui_help":"fal.ai 限流按模型不同。保守 3, 默认 5。触发 429 自动退让。","options":[{"value":3,"label":"3 保守"},{"value":5,"label":"5 默认","recommended":true}],"default":5}},"plugins":{"_note":"Tab 9 内置插件/工具。团队插件走 Z 盘共享库；这里放随 MeshCraft 一起发布的内置工具。加内置 = 把文件放进 plugins/ + 在这里加一条。","categories":[{"name":"工作流工具（内置）","items":[{"name":"多视角打分 · Claude 工作流","platform":"Claude Code","version":"v1","tags":["工作流","Claude","打分"],"type":"download","file":"multiview-scoring-toolkit.zip","desc":"多视角照片用 Claude 判朝向/信心、排前后左右槽位、挑信息量最大那张。下载后在 Claude Code 里按 HANDOVER.md / PROMPT_FOR_CLAUDE.md 跑（含脚本+示例+编辑器模板）。"}]}]},"glb_b64":"Z2xURgIAAAC8AQAAfAEAAEpTT057ImFzc2V0Ijp7InZlcnNpb24iOiIyLjAiLCJnZW5lcmF0b3IiOiJtZXNoY3JhZnQtZGVtbyJ9LCJzY2VuZSI6MCwic2NlbmVzIjpbeyJub2RlcyI6WzBdfV0sIm5vZGVzIjpbeyJtZXNoIjowfV0sIm1lc2hlcyI6W3sicHJpbWl0aXZlcyI6W3siYXR0cmlidXRlcyI6eyJQT1NJVElPTiI6MH19XX1dLCJhY2Nlc3NvcnMiOlt7ImJ1ZmZlclZpZXciOjAsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjozLCJ0eXBlIjoiVkVDMyIsIm1pbiI6Wy0wLjUsLTAuNSwwLjBdLCJtYXgiOlswLjUsMC41LDAuMF19XSwiYnVmZmVyVmlld3MiOlt7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MCwiYnl0ZUxlbmd0aCI6MzZ9XSwiYnVmZmVycyI6W3siYnl0ZUxlbmd0aCI6MzZ9XX0gICQAAABCSU4AAAAAvwAAAL8AAAAAAAAAPwAAAL8AAAAAAAAAAAAAAD8AAAAA","pixel_png_b64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg=="};

  var PIXEL_PNG = 'data:image/png;base64,' + MOCK_DATA.pixel_png_b64;
  var GLB_URI = 'data:model/gltf-binary;base64,' + MOCK_DATA.glb_b64;

  function b64bytes(b64) {
    var s = atob(b64);
    var u = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  function jres(obj, status) {
    return Promise.resolve(new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }));
  }
  function binRes(b64, ct) {
    return Promise.resolve(new Response(b64bytes(b64), {
      status: 200, headers: { 'Content-Type': ct },
    }));
  }
  function rid() {
    return 'demo-' + Math.random().toString(16).slice(2, 10) + Date.now().toString(16);
  }
  function nowSec() { return Date.now() / 1000; }
  function clock() {
    var d = new Date();
    function p(n) { return String(n).padStart(2, '0'); }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  /* ---------- 模拟素材 ---------- */

  // Tab 1 · 3D 转换的假模型清单
  var FAKE_MODELS = [
    ['机甲_胸甲_v03.fbx', 48234496],
    ['机甲_头盔_v02.fbx', 21983232],
    ['机甲_左臂_v03.fbx', 18649088],
    ['场景_祭坛_01.obj', 75497472],
    ['角色_幼龙_素模.fbx', 33154048],
    ['道具_宝箱_做旧.glb', 9175040],
    ['建筑_哨塔_A.obj', 27361280],
    ['武器_长刀_final.fbx', 6291456],
  ];

  // Tab 6 · Meshy 批量的假图片清单
  var FAKE_IMAGES = [
    ['角色_冒险家_正面.png', 3145728, [1024, 1024], null],
    ['角色_冒险家_背面.png', 2988441, [1024, 1024], null],
    ['载具_悬浮摩托_三视图.png', 4718592, [2048, 1024], null],
    ['生物_岩甲兽_侧视.jpg', 2254855, [1024, 768], null],
    ['建筑_面馆_正视图.png', 5620367, [1536, 1024], null],
    ['道具_符文火把.png', 1153433, [512, 512], 'lowres'],
    ['场景_峡谷_全景.tif', 24117248, [4096, 2048], 'oversize'],
    ['角色_药师_正面.webp', 1835008, [1024, 1024], null],
  ];

  // Tab 7 · S3 上传的假文件清单
  var FAKE_S3_FILES = [
    ['models/机甲_胸甲_v03.glb', 12582912],
    ['models/机甲_头盔_v02.glb', 7340032],
    ['models/场景_祭坛_01.glb', 23068672],
    ['textures/祭坛_basecolor_2k.webp', 3145728],
    ['textures/祭坛_normal_2k.webp', 4718592],
    ['textures/机甲_胸甲_orm_2k.webp', 2883584],
    ['exports/打包_20260630.zip', 52428800],
    ['README_交付说明.md', 4096],
  ];

  var M6_DIR = 'D:\\素材库\\三视图输入';
  var M6_OUT = 'D:\\素材库\\三视图输入\\output-glb';

  /* ---------- 任务仿真状态 ---------- */

  var sim1 = null;   // Tab 1 3D 批处理
  var sim6 = null;   // Tab 6 Meshy 批量
  var simMv = null;  // Tab 6 多视角
  var simS3 = null;  // Tab 7 S3 上传
  var ridPool = {};  // banana / eval 请求 id → 创建时间

  function fmtMB(b) { return (b / 1048576).toFixed(1) + ' MB'; }

  /* --- Tab 1：3D 批处理 --- */
  function s1Snapshot() {
    if (!sim1) {
      return { processing: false, progress: 0, current: 0, total: 0, file: '', logs: [] };
    }
    var total = sim1.files.length;
    var perTask = 2.4;                       // 每个文件约 2.4s
    var elapsed = nowSec() - sim1.started;
    var done = Math.min(total, Math.floor(elapsed / perTask));
    var finished = sim1.stopped || done >= total;
    var logs = sim1.logs;
    // 按 done 数确定性生成日志（前端按下标增量追加）
    logs.length = 0;
    logs.push('[' + sim1.t0 + '] 开始批处理: ' + total + ' 个文件 → ' + (sim1.out || 'output'));
    for (var i = 0; i < done; i++) {
      var f = sim1.files[i];
      logs.push('[' + clock() + '] ' + f[0] + ': 重命名 → 转换 GLB → 归一化 → Draco+WebP 压缩');
      logs.push('[' + clock() + '] ✓ ' + f[0].replace(/\.[^.]+$/, '.glb') + ' (' + fmtMB(f[1] / 6) + ', -83%)');
    }
    if (sim1.stopped) logs.push('[' + clock() + '] ⏹ 已停止');
    else if (finished) logs.push('[' + clock() + '] ✓ 全部完成: ' + total + ' 个文件');
    if (finished) sim1 = null;               // 下次轮询回静止态（保留最后一次日志由前端持有）
    var cur = finished ? done : done;
    return {
      processing: !finished,
      progress: total ? done / total : 0,
      current: cur,
      total: total,
      file: (!finished && done < total) ? sim1.fileAt(done) : '',
      logs: logs,
    };
  }

  /* --- Tab 6：Meshy 批量 --- */
  function m6Snapshot() {
    if (!sim6) {
      return {
        processing: false, progress: 0, current: 0, total: 0, file: '',
        logs: [], sample_pause: null, tasks: [], archive_count: 0,
      };
    }
    var tasks = sim6.tasks;
    var total = tasks.length;
    var perTask = 6, conc = 2;
    var elapsed = nowSec() - sim6.started;
    var done = 0, running = 0, cred = 0;
    var logs = [];
    logs.push('[' + sim6.t0 + '] 批量管线启动: ' + total + ' 张图, 并发 ' + conc + ', provider=meshy');
    for (var i = 0; i < total; i++) {
      var t = tasks[i];
      if (t.status === 'skipped') { continue; }
      var startAt = Math.floor(i / conc) * perTask;
      var dt = elapsed - startAt;
      if (dt < 0) { t.status = 'pending'; t.elapsed_sec = null; }
      else if (dt < perTask) {
        t.status = 'running'; t.elapsed_sec = dt; running++;
        logs.push('[' + clock() + '] ▶ 提交 ' + t.image + ' (task ' + t.task_id.slice(0, 8) + '…)');
      } else {
        if (t.status !== 'done') {
          t.status = 'done'; t.elapsed_sec = perTask + (i % 3);
          t.consumed_credits = 20;
          t.saved_path = M6_OUT + '\\' + t.image.replace(/\.[^.]+$/, '.glb');
        }
        done++; cred += t.consumed_credits || 0;
        logs.push('[' + clock() + '] ▶ 提交 ' + t.image + ' (task ' + t.task_id.slice(0, 8) + '…)');
        logs.push('[' + clock() + '] ✓ ' + t.image + ' → ' + t.image.replace(/\.[^.]+$/, '.glb') + ' (20 credits)');
      }
    }
    var finished = sim6.stopped || (done + tasks.filter(function (t) { return t.status === 'skipped'; }).length) >= total;
    if (finished && !sim6.stopped) logs.push('[' + clock() + '] ✓ 批次完成: ' + done + ' 成功, 共消耗 ' + cred + ' credits');
    if (sim6.stopped) logs.push('[' + clock() + '] ⏹ 已停止');
    var out = {
      processing: !finished,
      progress: total ? done / total : 0,
      current: done, total: total,
      file: running ? (tasks.find(function (t) { return t.status === 'running'; }) || {}).image || '' : '',
      logs: logs, sample_pause: null,
      tasks: tasks.map(function (t) {
        return {
          image: t.image, image_path: t.image_path, status: t.status,
          task_id: t.task_id, elapsed_sec: t.elapsed_sec, retries: t.retries,
          error: t.error, error_raw: t.error_raw,
          consumed_credits: t.consumed_credits,
          is_trial: t.is_trial, is_sample: t.is_sample, saved_path: t.saved_path,
        };
      }),
      archive_count: 0,
    };
    if (finished) { var keep = out; sim6 = null; keep.processing = false; return keep; }
    return out;
  }

  /* --- Tab 6 多视角 --- */
  function mvSnapshot() {
    if (!simMv) {
      return { processing: false, progress: 0, progress_label: '', logs: [], result: null, error: null };
    }
    var elapsed = nowSec() - simMv.started;
    var dur = 20;
    var p = Math.min(100, Math.round(elapsed / dur * 100));
    var phase = p < 10 ? '上传 4 张视角图' : p < 25 ? '提交 Meshy 多视角任务' :
                p < 85 ? '生成中（AI 重建 + 贴图）' : p < 100 ? '下载并保存模型' : '完成';
    var logs = [];
    logs.push('[' + simMv.t0 + '] 多视角任务启动 (meshy-multi-image)');
    if (p >= 10) logs.push('[' + clock() + '] 视角图已上传: front/back/left/right');
    if (p >= 25) logs.push('[' + clock() + '] 已提交, task=' + simMv.taskId.slice(0, 12) + '…');
    if (p >= 60) logs.push('[' + clock() + '] 网格重建完成, 进入贴图阶段');
    var done = p >= 100 || simMv.stopped;
    if (done && !simMv.stopped) logs.push('[' + clock() + '] ✓ 已保存: ' + simMv.out + '\\multiview_result.glb');
    if (simMv.stopped) logs.push('[' + clock() + '] ⏹ 已停止');
    var out = {
      processing: !done, progress: done ? 100 : p, progress_label: phase,
      logs: logs,
      result: (done && !simMv.stopped) ? { ok: true, saved_path: simMv.out + '\\multiview_result.glb' } : null,
      error: null,
    };
    if (done) { simMv = null; out.processing = false; }
    return out;
  }

  /* --- Tab 7：S3 上传 --- */
  function s3Snapshot() {
    if (!simS3) {
      return { processing: false, progress: 0, current: 0, total: 0, file: '', logs: [], tasks: [] };
    }
    var tasks = simS3.tasks;
    var total = tasks.length;
    var perTask = 1.6;
    var elapsed = nowSec() - simS3.started;
    var done = 0;
    var logs = [];
    logs.push('[' + simS3.t0 + '] 开始上传 → s3://' + simS3.bucket + '/' + (simS3.prefix || ''));
    for (var i = 0; i < total; i++) {
      var t = tasks[i];
      var dt = elapsed - i * (perTask / 2);
      if (dt < 0) t.status = 'pending';
      else if (dt < perTask) t.status = 'uploading';
      else {
        if (t.status !== 'done') { t.status = 'done'; }
        done++;
        logs.push('[' + clock() + '] [done] ' + t.name + ' (' + fmtMB(t.size) + ')');
      }
    }
    var finished = simS3.stopped || done >= total;
    if (finished && !simS3.stopped) logs.push('[' + clock() + '] ✓ 上传完成: ' + done + ' 个文件');
    if (simS3.stopped) logs.push('[' + clock() + '] ⏹ 已停止');
    var out = {
      processing: !finished, progress: total ? done / total : 0,
      current: done, total: total,
      file: (!finished) ? (tasks[Math.min(done, total - 1)] || {}).name || '' : '',
      logs: logs,
      tasks: tasks.map(function (t) { return { name: t.name, size: t.size, status: t.status, error: null }; }),
    };
    if (finished) { simS3 = null; out.processing = false; }
    return out;
  }

  /* --- banana / eval 的 rid 状态机 --- */
  function bananaStatus(id) {
    var t0 = ridPool[id];
    if (!t0) return { status: 'COMPLETED' };
    var dt = nowSec() - t0;
    if (dt < 2) return { status: 'IN_QUEUE' };
    if (dt < 6) return { status: 'IN_PROGRESS' };
    return { status: 'COMPLETED' };
  }
  function evalStatus(id) {
    var t0 = ridPool[id];
    if (!t0) return { status: 'COMPLETED', mesh_url: GLB_URI, thumbnail_url: PIXEL_PNG };
    var dt = nowSec() - t0;
    if (dt < 3) return { status: 'IN_QUEUE' };
    if (dt < 12) return { status: 'IN_PROGRESS', progress: Math.round((dt - 3) / 9 * 100) };
    return { status: 'COMPLETED', mesh_url: GLB_URI, thumbnail_url: PIXEL_PNG };
  }

  /* ---------- 假列表生成 ---------- */

  function meshyScanResult() {
    var images = FAKE_IMAGES.map(function (f) {
      return {
        path: M6_DIR + '\\' + f[0],
        name: f[0],
        stem: f[0].replace(/\.[^.]+$/, ''),
        size_bytes: f[1],
        dim: f[2],
        warning: f[3],
      };
    });
    var summary = { total: images.length, oversize: 0, lowres: 0, done: 0, ok: 0 };
    images.forEach(function (i) {
      if (i.warning) summary[i.warning]++; else summary.ok++;
    });
    return {
      images: images, summary: summary,
      has_existing_log: false, existing_log_batch_id: null, existing_done_count: 0,
    };
  }

  function pluginsResult(sharedDir) {
    var data = JSON.parse(JSON.stringify(MOCK_DATA.plugins));
    data.categories.push({
      name: '效率脚本（内置）',
      items: [
        {
          name: '贴图批量转 WebP', platform: 'Python', version: 'v1.3',
          tags: ['贴图', '压缩'], type: 'download', file: 'tex2webp_v1.3.zip',
          desc: '递归扫描文件夹，把 PNG/TGA 贴图批量转 WebP 并保留原始目录结构。',
        },
        {
          name: 'GLB 体检报告', platform: 'Blender 4.x', version: 'v0.9',
          tags: ['GLB', '质检'], type: 'download', file: 'glb_inspector_v0.9.zip',
          desc: '批量检查面数/UV/材质槽，输出 HTML 报告，超阈值标红。',
        },
      ],
    });
    data.shared = {
      dir: sharedDir || '',
      ok: !!sharedDir,
      groups: sharedDir ? [
        {
          name: 'Blender',
          items: [
            {
              name: 'UV 批量合并', platform: 'Blender 4.x', version: 'v2.1', src: 'shared',
              tags: ['UV', '批处理'], type: 'download', file: 'uv_merge_v2.1.zip',
              desc: '按材质自动合并重叠 UV 岛，支持整目录批跑。',
            },
            {
              name: '骨骼命名规范化', platform: 'Blender 4.x', version: 'v1.0', src: 'shared',
              tags: ['绑定', '规范'], type: 'download', file: 'bone_rename_v1.0.py',
              desc: '把 Mixamo/手搓骨骼名统一映射到团队命名规范。',
            },
          ],
        },
        { name: 'Photoshop', items: [] },
        { name: '其他', items: [] },
      ] : [],
    };
    return data;
  }

  /* ---------- 路由 ---------- */

  function route(method, path, query, body) {
    body = body || {};

    /* ===== GET ===== */
    if (method === 'GET') {
      if (path === '/api/detect') {
        return jres({
          blender_path: 'C:\\Program Files\\Blender Foundation\\Blender 4.2\\blender.exe',
          blender_version: '4.2.3',
          gltf_available: true,
        });
      }
      if (path === '/api/progress') return jres(s1Snapshot());
      if (path === '/api/config') return jres({});            // 绝不返回任何 key
      if (path.indexOf('/api/status/') === 0) {
        return jres(bananaStatus(path.slice('/api/status/'.length)));
      }
      if (path.indexOf('/api/result/') === 0) {
        return jres({ images: [{ url: PIXEL_PNG, width: 1024, height: 1024, content_type: 'image/png' }], seed: 20260630 });
      }
      if (path === '/api/eval/models') {
        return jres({ models: MOCK_DATA.eval_models, has_meshy_key: false, has_fal_key: false });
      }
      if (path.indexOf('/api/eval/status/') === 0) {
        return jres(evalStatus(path.slice('/api/eval/status/'.length)));
      }
      if (path.indexOf('/api/eval/result/') === 0) {
        return jres({ raw: {}, mesh_url: GLB_URI, thumbnail_url: PIXEL_PNG, output_kind: 'mesh' });
      }
      if (path === '/api/eval/proxy_glb') return binRes(MOCK_DATA.glb_b64, 'model/gltf-binary');
      if (path === '/api/localimg') return binRes(MOCK_DATA.pixel_png_b64, 'image/png');
      if (path === '/api/meshy/params') {
        var prov = (query.get('provider') || 'meshy');
        var params = MOCK_DATA['params_' + prov] || MOCK_DATA.params_meshy;
        return jres(params);
      }
      if (path === '/api/meshy/progress') return jres(m6Snapshot());
      if (path === '/api/meshy/job_log') return jres({ exists: false });
      if (path === '/api/meshy/multiview/progress') return jres(mvSnapshot());
      if (path === '/api/s3/progress') return jres(s3Snapshot());
      if (path === '/api/plugins') return jres(pluginsResult(query.get('shared') || ''));
      if (path === '/api/plugins/file') {
        return binRes(MOCK_DATA.pixel_png_b64, 'application/octet-stream');
      }
      return jres({ ok: true });
    }

    /* ===== POST ===== */
    if (path === '/api/scan') {
      return jres({
        count: FAKE_MODELS.length,
        files: FAKE_MODELS.map(function (f) { return f[0]; }),
        ext: '.fbx: 5  .obj: 2  .glb: 1',
      });
    }
    if (path === '/api/start') {
      sim1 = {
        started: nowSec(), t0: clock(), stopped: false,
        files: FAKE_MODELS.slice(), logs: [],
        out: body.output_folder || 'D:\\assets\\output-glb',
        fileAt: function (i) { return this.files[i][0]; },
      };
      return jres({ ok: true });
    }
    if (path === '/api/stop') { if (sim1) sim1.stopped = true; return jres({ ok: true }); }
    if (path === '/api/clear-log') { return jres({ ok: true }); }
    if (path === '/api/open-folder') return jres({ ok: true });
    if (path === '/api/set-blender') return jres({ ok: true, version: '4.2.3' });

    if (path === '/api/test') return jres({ ok: true, request_id: rid() });
    if (path === '/api/submit') { var b = rid(); ridPool[b] = nowSec(); return jres({ request_id: b }); }
    if (path === '/api/save') {
      return jres({ ok: true, saved: (body.out_dir || 'D:\\assets\\banana-out') + '\\' + (body.filename || 'output.png') });
    }
    if (path === '/api/save-meta') {
      return jres({ ok: true, path: (body.out_dir || 'D:\\assets') + '\\_meta.json' });
    }

    if (path === '/api/eval/submit') { var e = rid(); ridPool[e] = nowSec(); return jres({ request_id: e, raw: {} }); }
    if (path === '/api/eval/save') {
      return jres({ ok: true, saved: (body.out_dir || 'D:\\assets\\eval') + '\\' + (body.filename || 'model.glb'), size: 2489344 });
    }
    if (path === '/api/eval/export_table') {
      return jres({ error: 'Demo 环境不生成 xlsx 文件' }, 400);
    }

    if (path === '/api/upload-temp') {
      var fn = body.filename || 'upload.png';
      return jres({ path: 'C:\\Users\\demo\\AppData\\Local\\Temp\\meshcraft_uploads\\' + fn, size_bytes: (body.data || '').length });
    }
    if (path === '/api/split') {
      var od1 = body.output_dir || 'D:\\assets\\out-split-0630-1530';
      return jres({ ok: true, output_dir: od1, files: [1, 2, 3, 4].map(function (n) { return od1 + '\\元素_' + n + '.png'; }) });
    }
    if (path === '/api/split-batch') {
      var od2 = body.output_dir || 'D:\\assets\\out-split-0630-1530';
      return jres({
        ok: true, output_dir: od2, source_count: 3,
        files: [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return od2 + '\\批次_元素_' + n + '.png'; }),
      });
    }
    if (path === '/api/stitch') {
      var od3 = body.output_dir || 'D:\\assets\\out-stitch-0630-1530';
      return jres({ ok: true, output_dir: od3, file: od3 + '\\' + (body.filename || 'stitched.png') });
    }

    if (path === '/api/meshy/balance') {
      var bmap = { meshy: 365, tripo: 42, rodin: 18 };
      return jres({ balance: bmap[(body.provider || 'meshy')] != null ? bmap[body.provider || 'meshy'] : null });
    }
    if (path === '/api/balance/all') {
      return jres({ balances: { meshy: 365, tripo: 42, rodin: 18, fal: null }, errors: { fal: 'no_api' } });
    }

    if (path === '/api/plugins/share') return jres({ ok: true });
    if (path === '/api/pick_file') return jres({ path: 'D:\\素材库\\待处理\\角色设定_02.png' });
    if (path === '/api/meshy/pick_folder') return jres({ folder: M6_DIR });

    if (path === '/api/meshy/scan') return jres(meshyScanResult());
    if (path === '/api/meshy/start') {
      var excluded = {};
      (body.excluded_images || []).forEach(function (n) { excluded[n] = true; });
      sim6 = {
        started: nowSec(), t0: clock(), stopped: false,
        tasks: FAKE_IMAGES.map(function (f, i) {
          return {
            image: f[0], image_path: M6_DIR + '\\' + f[0],
            status: excluded[f[0]] ? 'skipped' : 'pending',
            task_id: rid(), elapsed_sec: null, retries: 0,
            error: null, error_raw: null, consumed_credits: null,
            is_trial: i === 0, is_sample: false, saved_path: null,
          };
        }),
      };
      return jres({ ok: true });
    }
    if (path === '/api/meshy/stop') { if (sim6) sim6.stopped = true; return jres({ ok: true }); }
    if (path === '/api/meshy/resume_ack') return jres({ ok: true });

    if (path === '/api/meshy/multiview/start') {
      simMv = {
        started: nowSec(), t0: clock(), stopped: false,
        taskId: rid(), out: body.output_folder || 'D:\\素材库\\多视角输出',
      };
      return jres({ ok: true });
    }
    if (path === '/api/meshy/multiview/stop') { if (simMv) simMv.stopped = true; return jres({ ok: true }); }
    if (path === '/api/meshy/multiview/upload') return jres({ ok: true, file: body.filename || 'view.png' });

    if (path === '/api/s3/connect' || path === '/api/s3/check') {
      return jres({
        ok: true, account: '123456789012',
        arn: 'arn:aws:iam::123456789012:user/demo-artist',
        region: body.region || 'us-west-2', error: null,
      });
    }
    if (path === '/api/s3/buckets') {
      return jres({ ok: true, buckets: ['demo-assets', 'demo-renders', 'team-3d-shared'], error: null });
    }
    if (path === '/api/s3/list') {
      return jres({
        ok: true, prefixes: ['models/', 'textures/', 'exports/', 'references/'],
        region: 'us-west-2', file_count: 8, truncated: false, error: null,
      });
    }
    if (path === '/api/s3/mkbucket') {
      return jres({ ok: true, bucket: body.name || '', region: body.region || 'us-west-2', error: null });
    }
    if (path === '/api/s3/sso_login') return jres({ ok: true, message: 'SSO 登录成功（模拟）' });
    if (path === '/api/s3/scan') {
      return jres({
        count: FAKE_S3_FILES.length,
        total_bytes: FAKE_S3_FILES.reduce(function (a, f) { return a + f[1]; }, 0),
        files: FAKE_S3_FILES.map(function (f) { return { name: f[0], size: f[1] }; }),
      });
    }
    if (path === '/api/s3/start') {
      simS3 = {
        started: nowSec(), t0: clock(), stopped: false,
        bucket: body.bucket || 'demo-assets', prefix: body.prefix || '',
        tasks: FAKE_S3_FILES.map(function (f) { return { name: f[0], size: f[1], status: 'pending' }; }),
      };
      return jres({ ok: true });
    }
    if (path === '/api/s3/stop') { if (simS3) simS3.stopped = true; return jres({ ok: true }); }

    return jres({ ok: true });
  }

  /* ---------- fetch 包装 ---------- */

  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var parsed;
    try { parsed = new URL(url, window.location.href); } catch (e) { return origFetch(input, init); }
    if (parsed.origin === window.location.origin && parsed.pathname.indexOf('/api/') === 0) {
      var method = ((init && init.method) || 'GET').toUpperCase();
      var body = null;
      if (init && typeof init.body === 'string') { try { body = JSON.parse(init.body); } catch (e) {} }
      try {
        return route(method, parsed.pathname, parsed.searchParams, body);
      } catch (err) {
        return jres({ error: String(err) }, 500);
      }
    }
    return origFetch(input, init);
  };

  /* ---------- DEMO 标识 ---------- */

  function addBadge() {
    if (document.getElementById('mcDemoBadge')) return;
    var d = document.createElement('div');
    d.id = 'mcDemoBadge';
    d.textContent = 'INTERACTIVE DEMO · 数据为模拟';
    d.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:9999;'
      + 'font:600 10px/1 "JetBrains Mono",monospace;color:#8a8a8a;'
      + 'background:#181818cc;border:1px solid #3f3f3f;padding:5px 9px;'
      + 'border-radius:8px;pointer-events:none;letter-spacing:.5px';
    document.body.appendChild(d);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addBadge);
  else addBadge();

  // <img src="/api/localimg?..."> 这类子资源请求不走 fetch，交给 SW 兜底
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./mock-sw.js').catch(function () {});
  }

  console.log('%cMeshCraft DEMO%c 所有 /api/* 请求均由前端模拟，不产生真实输出',
    'color:#c5f955;font-weight:700', 'color:#9b9b9b');
})();
