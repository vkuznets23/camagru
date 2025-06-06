export async function checkAvailability(
  endpoint: string,
  paramKey: string,
  paramValue: string
): Promise<boolean | null> {
  if (!paramValue) return null
  try {
    const res = await fetch(
      `/api/auth/${endpoint}?${paramKey}=${encodeURIComponent(paramValue)}`
    )
    const data = await res.json()
    if (res.ok) {
      return data.available
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

export function updateAvailabilityError(
  prevErrors: { [key: string]: string },
  key: string,
  available: boolean | null,
  message: string
): { [key: string]: string } {
  const newErrors = { ...prevErrors }
  if (available === false) {
    newErrors[key] = message
  } else {
    delete newErrors[key]
  }
  return newErrors
}
