import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, FileCheck, AlertTriangle, Ban, RefreshCw, Eye, Globe, Clock, CheckCircle2, XCircle, LogOut } from "lucide-react";

type Verification = {
  id: string;
  file_name: string;
  file_type: string;
  is_document: boolean;
  category: string | null;
  category_icon: string | null;
  confidence: number | null;
  status: string;
  details: string[] | null;
  source: string | null;
  image_data: string | null;
  created_at: string;
  updated_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  verified: "bg-accent/10 text-accent border-accent/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  flagged: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  verified: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
  flagged: <AlertTriangle className="h-3.5 w-3.5" />,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, flagged: 0, embed: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("document_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVerifications(data as Verification[]);
      setStats({
        total: data.length,
        verified: data.filter((d) => d.status === "verified").length,
        flagged: data.filter((d) => !d.is_document).length,
        embed: data.filter((d) => d.source === "embed").length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("document_verifications").update({ status }).eq("id", id);
    fetchData();
  };

  const selected = verifications.find((v) => v.id === selectedId);

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Monitor document verifications, embed usage, and manage statuses
            </p>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-border/60 hover:bg-secondary transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Scans", value: stats.total, icon: <Eye className="h-5 w-5 text-primary" />, bg: "bg-primary/10" },
            { label: "Verified", value: stats.verified, icon: <FileCheck className="h-5 w-5 text-accent" />, bg: "bg-accent/10" },
            { label: "Flagged / Illegal", value: stats.flagged, icon: <Ban className="h-5 w-5 text-destructive" />, bg: "bg-destructive/10" },
            { label: "From Embed", value: stats.embed, icon: <Globe className="h-5 w-5 text-blue-400" />, bg: "bg-blue-400/10" },
          ].map((s) => (
            <div key={s.label} className="card-gradient border border-border/60 rounded-xl p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.bg} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Table */}
          <div className="md:col-span-2 card-gradient border border-border/60 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/40">
              <h2 className="font-heading font-semibold">Verification History</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading…</div>
            ) : verifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No verifications yet</div>
            ) : (
              <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
                {verifications.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-secondary/30 transition-colors flex items-center gap-3 ${
                      selectedId === v.id ? "bg-secondary/40" : ""
                    }`}
                  >
                    <span className="text-lg">{v.category_icon || "🚫"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{v.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.category || "Unrecognized"} • {v.source || "direct"} • {v.confidence ?? 0}%
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[v.status]}`}>
                      {statusIcons[v.status]}
                      {v.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="card-gradient border border-border/60 rounded-xl p-5">
            <h2 className="font-heading font-semibold mb-4">Details</h2>
            {selected ? (
              <div className="space-y-4">
                {selected.image_data && (
                  <div className="rounded-lg overflow-hidden border border-border/40 bg-secondary/20">
                    <img
                      src={selected.image_data}
                      alt={selected.file_name}
                      className="w-full max-h-56 object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.category_icon || "🚫"}</span>
                  <div>
                    <p className="font-heading font-bold">{selected.category || "Unrecognized"}</p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {selected.confidence ?? 0}%
                    </p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-muted-foreground">Confidence Score</p>
                    <p className="text-xs font-semibold">{selected.confidence ?? 0}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        selected.is_document ? "bg-accent" : "bg-destructive"
                      }`}
                      style={{ width: `${selected.confidence ?? 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">File</p>
                  <p className="text-sm break-all">{selected.file_name}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Source</p>
                  <p className="text-sm capitalize">{selected.source || "direct"}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">{new Date(selected.created_at).toLocaleString()}</p>
                </div>

                {selected.details && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Analysis</p>
                    <ul className="space-y-1">
                      {selected.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status actions */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "verified", "rejected", "flagged"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          selected.status === s
                            ? statusColors[s]
                            : "border-border/40 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {statusIcons[s]}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a verification to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
