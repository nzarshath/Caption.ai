import { Image, Layers, Brain, MessageSquare, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Image,
    title: "Input Image",
    desc: "Raw image fed into the pipeline",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Layers,
    title: "CNN Encoder",
    desc: "Feature extraction via convolutional layers (ResNet/VGG)",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "LSTM Decoder",
    desc: "Sequential word generation using encoded features",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Generated Caption",
    desc: "Natural language description of the image",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const ArchitectureDiagram = () => (
  <div className="flex flex-col md:flex-row items-center gap-4">
    {steps.map((step, i) => (
      <div key={step.title} className="flex items-center gap-4">
        <div className="card-gradient border border-border/60 rounded-xl p-5 text-center w-52 animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
          <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${step.bg}`}>
            <step.icon className={`h-6 w-6 ${step.color}`} />
          </div>
          <h4 className="font-heading font-semibold text-foreground text-sm">{step.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
        </div>
        {i < steps.length - 1 && (
          <ArrowRight className="hidden md:block h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </div>
    ))}
  </div>
);

export default ArchitectureDiagram;
