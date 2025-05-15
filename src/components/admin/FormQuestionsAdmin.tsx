import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types"; 

// Use type Json from Database instead of supabase
type Json = Database['public']['Tables']['couple_formulaire']['Row']['options'];

type Question = Database["public"]["Tables"]["couple_formulaire"]["Row"];
type QuestionInsert =
  Database["public"]["Tables"]["couple_formulaire"]["Insert"];

const FormQuestionsAdmin = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "add">("add");

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("couple_formulaire")
      .select("*")
      .order("question_order", { ascending: true });
    if (error) {
      toast.error("Erreur lors du chargement");
      return;
    }
    if (data) {
      setQuestions(data || []);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("couple_formulaire")
      .delete()
      .eq("id", id);
    if (error) return toast.error("Erreur suppression");
    toast.success("Question supprimée");
    fetchQuestions();
  };

  const handleEdit = (question: Question) => {
    setSelected(question);
    setMode("edit");
    setDialogOpen(true);
  };
  const handleAdd = () => {
    setSelected(null);
    setMode("add");
    setDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Gestion des questions</h1>
        <Button onClick={handleAdd}>Ajouter une question</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordre</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => {
            return (
              <TableRow key={question.id}>
                <TableCell>{question.question_order}</TableCell>
                <TableCell>{question.question_title}</TableCell>
                <TableCell>{question.question_label}</TableCell>
                <TableCell>{question.category}</TableCell>
                <TableCell>{question.input_type}</TableCell>
                <TableCell className="space-x-2 flex flex-row">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(question)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(question.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "add" ? "Ajouter une question" : "Modifier une question"}
              </DialogTitle>
            </DialogHeader>
            <FormQuestion
              question={selected}
              mode={mode}
              onClose={() => setDialogOpen(false)}
              onSave={fetchQuestions}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

type FormQuestionProps = {
  question: Question | null;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: () => void;
};

const FormQuestion = ({ question, mode, onClose, onSave }: FormQuestionProps) => {
  const [questionTitle, setQuestionTitle] = useState(question?.question_title || "");
  const [questionLabel, setQuestionLabel] = useState(question?.question_label || "");
  const [questionOrder, setQuestionOrder] = useState(question?.question_order || 0);
  const [category, setCategory] = useState(question?.category || "");
  const [inputType, setInputType] = useState(question?.input_type || "input");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (question) {
      setQuestionTitle(question.question_title || "");
      setQuestionLabel(question.question_label || "");
      setQuestionOrder(question.question_order || 0);
      setCategory(question.category || "");
      setInputType(question.input_type || "input");
      if (question.options && typeof question.options === 'object' && Array.isArray(question.options)) {
        setOptions(question.options.map(String));
      } else {
        setOptions([]);
      }
    } else {
      setQuestionTitle("");
      setQuestionLabel("");
      setQuestionOrder(0);
      setCategory("");
      setInputType("input");
      setOptions([]);
    }
  }, [question]);

  const handleOptionAdd = () => {
    if (newOption.trim() !== "") {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleOptionDelete = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (
      questionTitle.trim() === "" ||
      questionLabel.trim() === "" ||
      category.trim() === ""
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const questionData: QuestionInsert = {
      question_title: questionTitle,
      question_label: questionLabel,
      question_order: questionOrder,
      category: category,
      input_type: inputType,
      options: options.length > 0 ? options : null,
    };

    let res;

    if (mode === "add") {
      res = await supabase.from("couple_formulaire").insert([questionData]);
    } else {
      res = await supabase
        .from("couple_formulaire")
        .update(questionData)
        .eq("id", question!.id);
    }

    if (res.error) {
      toast.error("Erreur lors de l'enregistrement");
      return;
    }

    toast.success("Question enregistrée");
    onSave();
    onClose();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="questionTitle" className="text-right">
          Titre de la question
        </label>
        <Input
          id="questionTitle"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="questionLabel" className="text-right">
          Label de la question
        </label>
        <Input
          id="questionLabel"
          value={questionLabel}
          onChange={(e) => setQuestionLabel(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="questionOrder" className="text-right">
          Ordre de la question
        </label>
        <Input
          type="number"
          id="questionOrder"
          value={questionOrder}
          onChange={(e) => setQuestionOrder(Number(e.target.value))}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="category" className="text-right">
          Catégorie
        </label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="inputType" className="text-right">
          Type d'input
        </label>
        <select
          id="inputType"
          className="border rounded px-2 py-1"
          value={inputType}
          onChange={(e) => setInputType(e.target.value as any)}
        >
          <option value="input">Input</option>
          <option value="select">Select</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>

      {inputType === "select" && (
        <div className="grid gap-2">
          <label className="text-right">Options</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Nouvelle option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <Button type="button" onClick={handleOptionAdd}>
              Ajouter
            </Button>
          </div>
          <ul>
            {options.map((option, index) => (
              <li key={index} className="flex justify-between items-center py-1">
                {option}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleOptionDelete(index)}
                >
                  Supprimer
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  );
};

export default FormQuestionsAdmin;
