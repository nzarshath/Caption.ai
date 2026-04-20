import { ArrowRight, Brain, Layers, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

const features = [
  {
    icon: Layers,
    title: "CNN Feature Extraction",
    desc: "Deep convolutional networks extract rich visual features from input images using pretrained architectures.",
  },
  {
    icon: Brain,
    title: "LSTM Caption Decoder",
    desc: "Long Short-Term Memory networks generate coherent, context-aware captions word by word.",
  },
  {
    icon: ShieldCheck,
    title: "Document Verification",
    desc: "AI-powered document authentication to verify integrity and detect tampering.",
  },
  {
    icon: Zap,
    title: "Real-Time Inference",
    desc: "Optimized pipeline delivers captions in seconds with high accuracy.",
  },
];

const Index = () => (
  <div className="min-h-screen pt-16">
    {/* Hero */}
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(238_84%_67%/0.08),transparent_70%)]" />
      <div className="container relative text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
          <Brain className="h-3.5 w-3.5" /> Deep Learning Project — CNN + LSTM
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Image Caption Generation<br />
          <span className="gradient-text">Using CNN & LSTM</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
          A deep learning system that combines Convolutional Neural Networks for visual feature extraction 
          with Long Short-Term Memory networks for natural language caption generation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/caption"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors glow-primary"
          >
            Try Caption Generator <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/architecture"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            View Architecture
          </Link>
        </div>
      </div>
    </section>

    {/* Architecture preview */}
    <section className="py-16 border-t border-border/40">
      <div className="container">
        <h2 className="font-heading text-2xl font-bold text-center mb-2">Model Architecture</h2>
        <p className="text-muted-foreground text-center mb-10">CNN Encoder → LSTM Decoder Pipeline</p>
        <div className="flex justify-center overflow-x-auto pb-4">
          <ArchitectureDiagram />
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16 border-t border-border/40">
      <div className="container">
        <h2 className="font-heading text-2xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card-gradient border border-border/60 rounded-xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/40 py-8">
      <div className="container text-center text-sm text-muted-foreground">
        <p>CNN + LSTM Image Caption Generation — Deep Learning Project</p>
      </div>
    </footer>
  </div>
);

export default Index;
