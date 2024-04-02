import WhiteboardCanvas from "./component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Canvas Drawing</h1>
      <WhiteboardCanvas/>
    </main>
  );
}
