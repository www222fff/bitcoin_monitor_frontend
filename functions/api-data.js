// Cloudflare Pages Function: /api/data
// 支持 type 参数，路由到不同后端 API，懒加载缓存到 KV
export async function onRequest(context) {
  console.log("[api-data] Function triggered");
  console.log("[api-data] Request URL:", context.request.url);
  const KV = context.env.MY_KV; // 绑定的KV命名空间
  //const API_BASE = "https://53edba271760e4b58e08299442fca98930daa137-4000.dstack-prod8.phala.network";
  const API_BASE = process.env.REACT_APP_API_URL;
  // 根据 type 设置不同的 TTL
  const { searchParams } = new URL(context.request.url);
  const type = searchParams.get("type") || "latest-utxo";
  let CACHE_TTL;
  if (type === "latest-utxo") {
    CACHE_TTL = 15 * 60; // 15分钟
  } else {
    CACHE_TTL = 60 * 60; // 1小时
  }
  console.log(`[api-data] type: ${type}, CACHE_TTL: ${CACHE_TTL}`);

  // 路由表
  const apiMap = {
    "latest-utxo": "/api/latest-utxo",
    "top-balances": "/api/top-balances",
    "total-balances": "/api/total-balances"
  };
  const apiPath = apiMap[type];
  if (!apiPath) {
    console.error("[api-data] Invalid type:", type);
    return new Response("Invalid type", { status: 400 });
  }

  const CACHE_KEY = `api_data_${type}`;

  // 1. 先查KV缓存
  let cached = await KV.get(CACHE_KEY, { type: "json" });
  if (cached) {
    console.log(`[api-data] Cache found for key: ${CACHE_KEY}`);
    if (Date.now() - cached.timestamp < CACHE_TTL * 1000) {
      console.log("[api-data] Returning cached data");
      return new Response(JSON.stringify({ result: cached.data }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      console.log("[api-data] Cache expired, will fetch new data");
    }
  } else {
    console.log(`[api-data] No cache found for key: ${CACHE_KEY}`);
  }

  // 2. 没有缓存或缓存过期，访问后端API
  const apiUrl = `${API_BASE}${apiPath}`;
  console.log(`[api-data] Fetching from backend API: ${apiUrl}`);
  const apiResp = await fetch(apiUrl);
  if (!apiResp.ok) {
    console.error(`[api-data] API fetch failed: ${apiResp.status} ${apiResp.statusText}`);
    return new Response("API fetch failed", { status: 502 });
  }
  const data = await apiResp.json();
  console.log("[api-data] Data fetched from backend:", JSON.stringify(data).slice(0, 200));

  // 3. 写入KV
  await KV.put(
    CACHE_KEY,
    JSON.stringify({ data: data.result || data, timestamp: Date.now() }),
    { expirationTtl: CACHE_TTL }
  );
  console.log(`[api-data] Data cached to KV with key: ${CACHE_KEY}`);

  return new Response(JSON.stringify({ result: data.result || data }), {
    headers: { "Content-Type": "application/json" }
  });
}
