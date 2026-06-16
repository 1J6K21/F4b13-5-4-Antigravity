"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Upload, FileText, PieChart, AlertCircle } from "lucide-react";

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProject(data);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processUpload = () => {
    if (!file) return;
    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        
        try {
          const res = await fetch(`/api/projects/${id}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feedbacks: rows }),
          });

          if (res.ok) {
            setFile(null);
            fetchProject();
          }
        } catch (error) {
          console.error("Upload failed", error);
        }
        setUploading(false);
      },
    });
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  const feedbacks = project.feedbacks || [];
  const hasData = feedbacks.length > 0;

  // Basic analytics
  const categoriesCount = feedbacks.reduce((acc: any, f: any) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoriesCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
        <p className="text-slate-500">Analyze your customer feedback</p>
      </div>

      {!hasData ? (
        <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Upload Data (CSV)</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Upload a CSV file containing your customer feedback. Make sure it has a 'content' or 'text' column.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="block w-full max-w-sm text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <button
                onClick={processUpload}
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? "Analyzing with AI..." : "Process Data"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Insights Dashboard */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600 w-6 h-6" />
                <h3 className="font-semibold text-slate-800">Total Feedback</h3>
              </div>
              <p className="text-4xl font-bold text-slate-900">{feedbacks.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="text-blue-600 w-6 h-6" />
                <h3 className="font-semibold text-slate-800">Top Categories (AI Detected)</h3>
              </div>
              <div className="space-y-3">
                {topCategories.map(([category, count]: any) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{category}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(count / feedbacks.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Analyzed Feedback</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
                  <tr>
                    <th className="px-6 py-4">Feedback Content</th>
                    <th className="px-6 py-4 w-32">Category</th>
                    <th className="px-6 py-4 w-32">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {feedbacks.slice(0, 50).map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="line-clamp-2">{f.content}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {f.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${f.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                            f.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 
                            'bg-slate-100 text-slate-800'}`}>
                          {f.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
