export default function SuccessMessage({ message }: { message?: string }) {
  if (!message) return null
  return <p style={{ color: 'green' }}>{message}</p>
}
