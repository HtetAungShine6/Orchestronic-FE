export async function getRequests() {
  const res = await fetch(`${process.env.API_URL}/request`)
  if (!res.ok) throw new Error("Failed to fetch requests")
  const data = await res.json()
  return data
}
