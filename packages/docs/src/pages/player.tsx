import StreamTester from './components/player'

export default function StreamsPage() {
  return (
    <>
      <h1>Streams</h1>
      <p>Paste a URL or pick a sample. Same loaders as the library.</p>
      <StreamTester />
    </>
  )
}
