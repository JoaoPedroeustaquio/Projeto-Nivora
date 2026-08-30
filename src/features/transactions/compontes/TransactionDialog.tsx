import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useTransactions } from "@/hooks/useTransactions";

import type { Transaction } from "@/types/transaction";

interface TransactionDialogProps {
  transaction?: Transaction;
}

type TransactionFormData = {
  type: "income" | "expense";
  value: string;
  category: string;
  payment: string;
  date: string;
  description: string;
};

type FormErrors = {
  type?: string;
  value?: string;
  category?: string;
  date?: string;
};

const emptyForm: TransactionFormData = {
  type: "expense",
  value: "",
  category: "",
  payment: "",
  date: "",
  description: "",
};

export default function TransactionDialog({
  transaction,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const { addTransaction, updateTransaction } = useTransactions();

  const [formData, setFormData] =
    useState<TransactionFormData>(emptyForm);

  const [errors, setErrors] = useState<FormErrors>({});

  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(transaction);

  function handleChange(
    field: keyof TransactionFormData,
    value: string | null,
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value ?? "",
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function resetForm() {
    setFormData({
      ...emptyForm,
    });

    setErrors({});
  }

  function handleOpen() {
    if (transaction) {
      setFormData({
        type: transaction.type,
        value: String(transaction.value),
        category: transaction.category,
        payment: transaction.payment,
        date: transaction.date,
        description: transaction.description,
      });
    } else {
      resetForm();
    }

    setErrors({});
    setOpen(true);
  }

  function handleClose() {
    if (submitting) {
      return;
    }

    setOpen(false);
    resetForm();
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!formData.type) {
      newErrors.type =
        "Selecione o tipo do lançamento.";
    }

    const numericValue = Number(formData.value);

    if (
      !formData.value ||
      !Number.isFinite(numericValue) ||
      numericValue <= 0
    ) {
      newErrors.value =
        "Informe um valor maior que zero.";
    }

    if (!formData.date) {
      newErrors.date =
        "Informe a data do lançamento.";
    }

    if (
      formData.type === "expense" &&
      !formData.category.trim()
    ) {
      newErrors.category =
        "Informe a categoria da despesa.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && transaction) {
        await updateTransaction({
          id: transaction.id,
          type: formData.type,
          value: Number(formData.value),
          category: formData.category.trim(),
          payment: formData.payment.trim(),
          date: formData.date,
          description: formData.description.trim(),
        });
      } else {
        await addTransaction({
          type: formData.type,
          value: Number(formData.value),
          category: formData.category.trim(),
          payment: formData.payment.trim(),
          date: formData.date,
          description: formData.description.trim(),
        });
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error(
        "Não foi possível salvar o lançamento:",
        error,
      );

      setErrors({
        value:
          "Não foi possível salvar o lançamento. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Botão que abre o modal */}
      <Button
        type="button"
        variant={isEditing ? "ghost" : "default"}
        size={isEditing ? "sm" : "default"}
        className={
          isEditing
            ? "gap-2 text-(--muted) hover:bg-white/5 hover:text-(--foreground)"
            : "gap-2 bg-(--primary) text-white hover:bg-(--primary-hover)"
        }
        onClick={handleOpen}
      >
        {isEditing ? (
          <>
            <Pencil className="h-4 w-4" />
            Editar
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Novo lançamento
          </>
        )}
      </Button>

      {/* Modal */}
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            handleOpen();
          } else {
            handleClose();
          }
        }}
      >
        <DialogContent
          className="
            border border-(--card-border)
            bg-(--card)
            text-(--foreground)
            shadow-2xl
            sm:max-w-130
          "
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-(--foreground)">
              {isEditing
                ? "Editar lançamento"
                : "Novo lançamento"}
            </DialogTitle>

            <DialogDescription className="text-(--muted)">
              {isEditing
                ? "Atualize os dados do lançamento."
                : "Preencha os campos abaixo para registrar uma entrada ou saída."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Tipo */}
            <div className="space-y-2">
              <Label className="text-(--foreground)">
                Tipo
              </Label>

              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleChange("type", value)
                }
              >
                <SelectTrigger
                  className="
                    border-(--card-border)
                    bg-(--background)
                    text-(--foreground)
                    focus:ring-(--primary)
                  "
                >
                  <span>
                    {formData.type === "income"
                      ? "Entrada"
                      : "Saída"}
                  </span>
                </SelectTrigger>

                <SelectContent
                  className="
                    border-(--card-border)
                    bg-(--card)
                    text-(--foreground)
                  "
                >
                  <SelectItem
                    value="income"
                    className="
                      text-(--foreground)
                      focus:bg-white/5
                      focus:text-(--foreground)
                    "
                  >
                    Entrada
                  </SelectItem>

                  <SelectItem
                    value="expense"
                    className="
                      text-(--foreground)
                      focus:bg-white/5
                      focus:text-(--foreground)
                    "
                  >
                    Saída
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-red-400">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label
                htmlFor="value"
                className="text-(--foreground)"
              >
                Valor
                <span className="text-red-400"> *</span>
              </Label>

              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.value}
                onChange={(event) =>
                  handleChange(
                    "value",
                    event.target.value,
                  )
                }
                className="
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  placeholder:text-(--muted)
                  focus-visible:border-(--primary)
                  focus-visible:ring-(--primary)
                "
              />

              {errors.value && (
                <p className="text-sm text-red-400">
                  {errors.value}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-(--foreground)"
              >
                Categoria
                {formData.type === "expense" && (
                  <span className="text-red-400"> *</span>
                )}
              </Label>

              <Input
                id="category"
                placeholder={
                  formData.type === "expense"
                    ? "Ex: Alimentação"
                    : "Opcional para entradas"
                }
                value={formData.category}
                onChange={(event) =>
                  handleChange(
                    "category",
                    event.target.value,
                  )
                }
                className="
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  placeholder:text-(--muted)
                  focus-visible:border-(--primary)
                  focus-visible:ring-(--primary)
                "
              />

              {errors.category && (
                <p className="text-sm text-red-400">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-2">
              <Label
                htmlFor="payment"
                className="text-(--foreground)"
              >
                Forma de pagamento
              </Label>

              <Input
                id="payment"
                placeholder="Ex: Pix, Cartão, Dinheiro"
                value={formData.payment}
                onChange={(event) =>
                  handleChange(
                    "payment",
                    event.target.value,
                  )
                }
                className="
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  placeholder:text-(--muted)
                  focus-visible:border-(--primary)
                  focus-visible:ring-(--primary)
                "
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-(--foreground)"
              >
                Data
                <span className="text-red-400"> *</span>
              </Label>

              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(event) =>
                  handleChange(
                    "date",
                    event.target.value,
                  )
                }
                className="
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  focus-visible:border-(--primary)
                  focus-visible:ring-(--primary)
                "
              />

              {errors.date && (
                <p className="text-sm text-red-400">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-(--foreground)"
              >
                Descrição
              </Label>

              <Textarea
                id="description"
                placeholder="Descreva o lançamento"
                value={formData.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value,
                  )
                }
                className="
                  min-h-24
                  border-(--card-border)
                  bg-(--background)
                  text-(--foreground)
                  placeholder:text-(--muted)
                  focus-visible:border-(--primary)
                  focus-visible:ring-(--primary)
                "
              />
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-2 border-t border-(--card-border) pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
                className="
                  border-(--card-border)
                  bg-transparent
                  text-(--foreground)
                  hover:bg-white/5
                  hover:text-(--foreground)
                "
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="
                  bg-(--primary)
                  text-white
                  hover:bg-(--primary-hover)
                "
              >
                {submitting
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Salvar lançamento"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}