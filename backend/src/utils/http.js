import fetch from "node-fetch";

export async function httpGet(url) {
  const res = await fetch(url);
  return res.json();
}
