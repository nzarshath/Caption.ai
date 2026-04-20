import ArchitectureDiagram from "@/components/ArchitectureDiagram";

const layers = [
  {
    title: "CNN Encoder (Feature Extraction)",
    items: [
      "Input: Raw image (224×224×3)",
      "Pretrained ResNet-50 / VGG-16 backbone",
      "Remove final classification layer",
      "Output: Feature vector (2048-d)",
    ],
  },
  {
    title: "LSTM Decoder (Caption Generation)",
    items: [
      "Input: CNN feature vector + word embeddings",
      "Embedding layer (vocabulary → 256-d)",
      "LSTM cell with 512 hidden units",
      "Attention mechanism over spatial features",
      "Dense + Softmax for next-word prediction",
    ],
  },
  {
    title: "Training Details",
    items: [
      "Dataset: Flickr8k / MS-COCO",
      "Loss: Cross-entropy on word predictions",
      "Optimizer: Adam (lr=1e-4)",
      "Beam search (k=3) for inference",
      "BLEU score evaluation metric",
    ],
  },
];

const Architecture = () => (
  <div className="min-h-screen pt-16">
    <div className="container py-12 max-w-5xl">
      <h1 className="font-heading text-3xl font-bold mb-2">Model Architecture</h1>
      <p className="text-muted-foreground mb-10">
        CNN + LSTM encoder-decoder architecture for image captioning using deep learning.
      </p>

      <div className="flex justify-center overflow-x-auto pb-8">
        <ArchitectureDiagram />
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {layers.map((layer) => (
          <div key={layer.title} className="card-gradient border border-border/60 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">{layer.title}</h3>
            <ul className="space-y-2">
              {layer.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Architecture;
