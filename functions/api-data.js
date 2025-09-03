// Cloudflare Pages Function: /api/data
// 支持 type 参数，路由到不同后端 API，懒加载缓存到 KV
export async function onRequest(context) {
  const KV = context.env.MY_KV; // 绑定的KV命名空间
  // 根据 type 设置不同的 TTL
  const { searchParams } = new URL(context.request.url);
  const type = searchParams.get("type") || "latest-utxo";
  let CACHE_TTL;
  if (type === "latest-utxo") {
    CACHE_TTL = 15 * 60; // 15分钟
  } else {
    CACHE_TTL = 60 * 60; // 1小时
  }
  const API_BASE = "https://53edba271760e4b58e08299442fca98930daa137-4000.dstack-prod8.phala.network";

  // ...existing code...

  // 路由表
  const apiMap = {
    "latest-utxo": "/api/latest-utxo",
    "top-balances": "/api/top-balances",
    "total-balances": "/api/total-balances"
  };
  const apiPath = apiMap[type];
  if (!apiPath) {
    return new Response("Invalid type", { status: 400 });
  }

  const CACHE_KEY = `api_data_${type}`;

  // 1. 先查KV缓存
  let cached = await KV.get(CACHE_KEY, { type: "json" });
  if (cached) {
    return new Response(JSON.stringify({ result: cached.data }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // 2. 没有缓存或缓存过期，访问后端API
  const apiResp = await fetch(`${API_BASE}${apiPath}`);
  if (!apiResp.ok) {
    return new Response("API fetch failed", { status: 502 });
  }
  const data = await apiResp.json();

  // 3. 写入KV
  await KV.put(
    CACHE_KEY,
    JSON.stringify({ data: data.result || data, timestamp: Date.now() }),
    { expirationTtl: CACHE_TTL }
  );

  return new Response(JSON.stringify({ result: data.result || data }), {
    headers: { "Content-Type": "application/json" }
  });
}
