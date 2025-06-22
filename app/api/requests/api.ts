export async function getRequests() {
  const res = await fetch(`${process.env.API_BASE_URL}/request}`)
  const data = await res.json()
  return data
}
