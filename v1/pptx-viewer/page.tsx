import PowerPointUploader from "@/components/PowerPointUploader";

export default function PowerPointViewerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">PowerPoint Viewer</h1>
      <PowerPointUploader />
    </div>
  )
}