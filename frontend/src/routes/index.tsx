import { createFileRoute } from "@tanstack/react-router";
import { PipelineToolbar } from "@/pipeline/toolbar";
import { PipelineUI } from "@/pipeline/ui";
import { SubmitButton } from "@/pipeline/submit";
import "@/pipeline/pipeline.css";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "VectorShift Pipeline Builder" },
      {
        name: "description",
        content:
          "Compose intelligent workflows visually — drag, connect, and submit pipelines built from LLM, logic, and I/O nodes.",
      },
    ],
  }),
});

function Index() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}
