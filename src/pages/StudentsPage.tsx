import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Volume2, RefreshCw, Edit, Trash2, Loader2, X, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  period: string;
  tts_custom_text: string | null;
  audio_url: string | null;
}

interface Guardian {
  id: string;
  name: string;
  type: string;
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [cls, setCls] = useState("");
  const [period, setPeriod] = useState("");
  const [ttsCustomText, setTtsCustomText] = useState("");
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);

  // Student guardians for display
  const [studentGuardians, setStudentGuardians] = useState<Record<string, Guardian[]>>({});

  const fetchData = async () => {
    setLoading(true);
    const [studentsRes, guardiansRes, linksRes] = await Promise.all([
      supabase.from("students").select("*").order("name"),
      supabase.from("guardians").select("id, name, type").order("name"),
      supabase.from("student_guardian").select("student_id, guardian_id"),
    ]);

    if (studentsRes.data) setStudents(studentsRes.data);
    if (guardiansRes.data) setGuardians(guardiansRes.data);

    // Build guardian map
    if (linksRes.data && guardiansRes.data) {
      const map: Record<string, Guardian[]> = {};
      for (const link of linksRes.data) {
        const g = guardiansRes.data.find((g) => g.id === link.guardian_id);
        if (g) {
          if (!map[link.student_id]) map[link.student_id] = [];
          map[link.student_id].push(g);
        }
      }
      setStudentGuardians(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setName(""); setGrade(""); setCls(""); setPeriod(""); setTtsCustomText("");
    setSelectedGuardians([]); setEditingStudent(null);
  };

  const openEdit = async (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setGrade(student.grade);
    setCls(student.class);
    setPeriod(student.period);
    setTtsCustomText(student.tts_custom_text || "");
    // Load linked guardians
    const { data } = await supabase.from("student_guardian").select("guardian_id").eq("student_id", student.id);
    setSelectedGuardians(data?.map((d) => d.guardian_id) || []);
    setDialogOpen(true);
  };

  const generateAudio = async (studentId: string, studentName: string, studentGrade: string, studentClass: string, customText?: string | null) => {
    setGeneratingAudio(studentId);
    try {
      // Get default voice
      const { data: voiceData } = await supabase.from("voice_settings").select("voice_id").eq("is_default", true).limit(1).single();
      const voiceId = voiceData?.voice_id || "onwK4e9ZLuTAKqWW03F9";

      // Get TTS template
      const { data: settings } = await supabase.from("school_settings").select("tts_template").limit(1).single();
      const template = settings?.tts_template || "{nome} do {serie}";

      let text: string;
      if (customText && customText.trim()) {
        text = customText;
      } else {
        text = template.replace("{nome}", studentName).replace("{serie}", studentGrade).replace("{turma}", studentClass);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ studentId, text, voiceId }),
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      toast.success("Áudio gerado com sucesso!");
      fetchData();
    } catch (err: any) {
      toast.error("Erro ao gerar áudio: " + err.message);
    } finally {
      setGeneratingAudio(null);
    }
  };

  const handleSave = async () => {
    if (!name || !grade || !cls || !period) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingStudent) {
        const { error } = await supabase.from("students").update({
          name, grade, class: cls, period,
          tts_custom_text: ttsCustomText || null,
        }).eq("id", editingStudent.id);
        if (error) throw error;

        // Update guardian links
        await supabase.from("student_guardian").delete().eq("student_id", editingStudent.id);
        if (selectedGuardians.length > 0) {
          await supabase.from("student_guardian").insert(
            selectedGuardians.map((gid) => ({ student_id: editingStudent.id, guardian_id: gid }))
          );
        }
        toast.success("Aluno atualizado!");
      } else {
        const { data, error } = await supabase.from("students").insert({
          name, grade, class: cls, period,
          tts_custom_text: ttsCustomText || null,
        }).select().single();
        if (error) throw error;

        // Link guardians
        if (selectedGuardians.length > 0) {
          await supabase.from("student_guardian").insert(
            selectedGuardians.map((gid) => ({ student_id: data.id, guardian_id: gid }))
          );
        }

        toast.success("Aluno cadastrado!");
        // Auto-generate audio
        generateAudio(data.id, name, grade, cls, ttsCustomText || null);
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este aluno?")) return;
    await supabase.from("students").delete().eq("id", id);
    toast.success("Aluno excluído");
    fetchData();
  };

  const playAudio = (url: string, id: string) => {
    setPlayingAudio(id);
    const audio = new Audio(url);
    audio.onended = () => setPlayingAudio(null);
    audio.play();
  };

  const toggleGuardian = (gid: string) => {
    setSelectedGuardians((prev) =>
      prev.includes(gid) ? prev.filter((id) => id !== gid) : [...prev, gid]
    );
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alunos</h1>
          <p className="text-sm text-muted-foreground">{students.length} alunos cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Editar Aluno" : "Cadastrar Aluno"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Nome completo do aluno" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Série</Label>
                  <Input placeholder="Ex: 5º Ano" value={grade} onChange={(e) => setGrade(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Turma</Label>
                  <Input placeholder="Ex: A" value={cls} onChange={(e) => setCls(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Período de Saída</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue placeholder="Selecione o período" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matutino">Matutino</SelectItem>
                    <SelectItem value="Vespertino">Vespertino</SelectItem>
                    <SelectItem value="Integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Responsáveis vinculados */}
              <div className="grid gap-2">
                <Label>Responsáveis Vinculados</Label>
                <div className="rounded-lg border border-border bg-muted/20 p-3 max-h-40 overflow-y-auto space-y-2">
                  {guardians.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum responsável cadastrado</p>
                  ) : (
                    guardians.map((g) => (
                      <label key={g.id} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={selectedGuardians.includes(g.id)}
                          onCheckedChange={() => toggleGuardian(g.id)}
                        />
                        <span>{g.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">{g.type}</Badge>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Texto TTS (opcional - para corrigir pronúncia)</Label>
                <Input
                  placeholder="Ex: Atenção, Ana do 5º Ano"
                  value={ttsCustomText}
                  onChange={(e) => setTtsCustomText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio para usar o padrão. Use para corrigir pronúncias difíceis.
                </p>
              </div>

              {editingStudent && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 flex-1"
                    disabled={generatingAudio === editingStudent.id}
                    onClick={() => generateAudio(editingStudent.id, name, grade, cls, ttsCustomText || null)}
                  >
                    {generatingAudio === editingStudent.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Regenerar Áudio
                  </Button>
                  {editingStudent.audio_url && (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => playAudio(editingStudent.audio_url!, editingStudent.id)}
                    >
                      <Volume2 className="h-4 w-4" /> Ouvir
                    </Button>
                  )}
                </div>
              )}

              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar aluno por nome ou série..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Série/Turma</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Período</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Responsáveis</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Áudio</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhum aluno encontrado</td></tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{student.grade} {student.class}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">{student.period}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(studentGuardians[student.id] || []).map((g) => (
                          <Badge key={g.id} variant="outline" className="text-xs">{g.name} ({g.type})</Badge>
                        ))}
                        {!(studentGuardians[student.id]?.length) && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {generatingAudio === student.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : student.audio_url ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => playAudio(student.audio_url!, student.id)}>
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => generateAudio(student.id, student.name, student.grade, student.class, student.tts_custom_text)}>
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs border-warning/30 text-warning">Pendente</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(student)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
